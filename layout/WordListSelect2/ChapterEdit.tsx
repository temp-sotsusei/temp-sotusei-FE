"use client";

import { FC } from "react";
import { EditorContent, NodeType, TextType, Editor } from "@tiptap/react";
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier, SensorDescriptor } from "@dnd-kit/core";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import DroppableBox from "@/components/DroppableBox";
import { MAX_CHAPTER_CHARS } from "@/const";

type ChaptersPayload = {
  chapterNum: number;
  chapterText: string;
  keywords: {
    keyword: string;
    position: number;
  }[];
};

type DroppedStrState = {
  id: UniqueIdentifier;
  droppedString: string;
  droppedIndex: number;
};

type CharItem = {
  char: string;
  isDroppable: boolean;
  isEmpty: boolean;
  isNewLine: boolean;
};

type Props = {
  selectedWordList: string[];
  chaptersPayload: ChaptersPayload[];
  editor: Editor;
  isTextEditorActive: boolean;
  isOverChapterText: boolean;
  contentLength: number;
  droppedStrState: DroppedStrState[];
  isPosting: boolean;
  canCreateNextChapter: boolean;
  sensors: SensorDescriptor<any>[];
  handleDragEnd: (event: DragEndEvent) => void;
  activateTextEditor: () => void;
  handleClickNextChapter: () => Promise<void>;
};

const getTiptapHTML = (editor: Editor): CharItem[] => {
  const editorContent = editor.getJSON();
  const contentsArray = editorContent.content.map((content) => content.content);
  const result: CharItem[] = [];
  let currentParagraphIndex = 0;

  contentsArray.forEach((contents, index) => {
    if (currentParagraphIndex !== index) {
      currentParagraphIndex = index;
      result.push({
        char: "",
        isDroppable: false,
        isEmpty: false,
        isNewLine: true,
      });
    }
    if (!contents) {
      return result.push({
        char: "",
        isDroppable: false,
        isEmpty: true,
        isNewLine: false,
      });
    }
    contents.forEach((content) => {
      if (content.type === "text") {
        const textObject = content as TextType;
        textObject.text.split("").forEach((char) => {
          result.push({
            char,
            isDroppable: true,
            isEmpty: false,
            isNewLine: false,
          });
        });
      } else if (content.type === "customWord") {
        const customWordObject = content as NodeType;
        customWordObject.attrs.text.split(".").forEach((char) => {
          result.push({
            char,
            isDroppable: false,
            isEmpty: false,
            isNewLine: false,
          });
        });
      }
    });
  });

  return result;
};

const ChapterEdit: FC<Props> = ({
  selectedWordList,
  chaptersPayload,
  editor,
  isTextEditorActive,
  isOverChapterText,
  contentLength,
  droppedStrState,
  isPosting,
  canCreateNextChapter,
  sensors,
  handleDragEnd,
  activateTextEditor,
  handleClickNextChapter,
}) => {
  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={editor.commands.blur}
    >
      <div className="h-screen">
        <div className="h-[calc(66.67%-16px)] mx-4 mb-4 border overflow-y-auto">
          {chaptersPayload.map((chapter, index) => (
            <div key={index}>
              <div className="border flex items-center justify-center py-2 m-4">
                第{chapter.chapterNum}章
              </div>
              <div className="mx-8">第{chapter.chapterNum}章の単語</div>
              <div className="my-2 mx-8 flex items-center justify-start gap-x-2 gap-y-2 flex-wrap">
                {chapter.keywords.map((keyword, index) => (
                  <div className="border px-4 py-2 rounded-2xl" key={index}>
                    {keyword.keyword}
                  </div>
                ))}
              </div>
              <div className="border mx-8 h-64 break-words">
                {chapter.chapterText}
              </div>
            </div>
          ))}
          <div>
            <div className="border flex items-center justify-center py-2 m-4">
              第{chaptersPayload.length + 1}章
            </div>
            <div className="mx-8">
              第{chaptersPayload.length + 1}章の単語
            </div>
            <div className="my-2 mx-8 flex items-center justify-start gap-x-2 gap-y-2 flex-wrap">
              {selectedWordList.map((word, index) => (
                <div className="border px-4 py-2 rounded-2xl" key={index}>
                  {word}
                </div>
              ))}
            </div>
            <div className="mx-8">
              {isTextEditorActive ? (
                <EditorContent
                  editor={editor}
                  className={
                    "border h-64 [&>div]:h-full [&>div]:overflow-y-auto" +
                    (isOverChapterText ? " border-red-500" : "")
                  }
                ></EditorContent>
              ) : (
                <DroppableBox
                  className={
                    "border h-64 break-words relative overflow-y-auto" +
                    (isOverChapterText ? " border-red-500" : "")
                  }
                  onClick={activateTextEditor}
                >
                  {getTiptapHTML(editor).map((char, index) =>
                    char.isNewLine ? (
                      <div key={index} />
                    ) : char.isEmpty ? (
                      <div key={index}>&nbsp;</div>
                    ) : char.isDroppable ? (
                      <Droppable key={index} id={index}>
                        {char.char}
                      </Droppable>
                    ) : (
                      <div key={index} className="border inline px-2 py-1">
                        {char.char}
                      </div>
                    )
                  )}
                </DroppableBox>
              )}
              <div
                className={
                  "bg-black text-white text-end px-2" +
                  (isOverChapterText ? " bg-red-500" : "")
                }
              >
                {`${contentLength} / ${MAX_CHAPTER_CHARS}`}
              </div>
            </div>
          </div>
        </div>
        <div className="h-1/3 border-t flex flex-col items-between">
          <div className="mt-8 mx-4 flex flex-wrap items-start gap-4 h-[calc(66.67%-32px)]">
            {selectedWordList.map((word, index) => (
              <Draggable
                key={index}
                id={index}
                draggedText={word}
                isDisabled={droppedStrState.some(
                  (droppedStrState) =>
                    droppedStrState.id === `draggable-${index}`
                )}
              >
                <div
                  className={`border px-4 py-2 rounded-2xl ${
                    droppedStrState.some(
                      (item) => item.id === `draggable-${index}`
                    ) && "border-gray-400 text-gray-400"
                  }`}
                >
                  {word}
                </div>
              </Draggable>
            ))}
            <DragOverlay />
          </div>
          <div className="flex items-center justify-between mx-4 h-1/3">
            <div className="flex-1" />
            <div className="px-16 py-4 border">完成</div>
            <div className="flex-1 flex justify-end">
              <button
                className={`text-center border p-2 ${
                  canCreateNextChapter && !isPosting && !isOverChapterText
                    ? "border-black"
                    : "border-gray-400 text-gray-400"
                }`}
                disabled={
                  !canCreateNextChapter || isPosting || isOverChapterText
                }
                onClick={handleClickNextChapter}
              >
                <p className="text-sm">
                  {isPosting
                    ? "送信中..."
                    : isOverChapterText
                    ? "文字数が200文字を超えています"
                    : "次の章を作成"}
                </p>
                <p className="text-sm">{droppedStrState.length}/4</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default ChapterEdit;