"use client";

// 変更: 型定義とユーティリティ関数をインポート、useMemoでパフォーマンス最適化

import { FC, useMemo } from "react";
import { EditorContent, Editor } from "@tiptap/react";
import { DndContext, DragEndEvent, DragOverlay, UniqueIdentifier, SensorDescriptor } from "@dnd-kit/core";
import Draggable from "@/components/Draggable";
import Droppable from "@/components/Droppable";
import DroppableBox from "@/components/DroppableBox";
import { ChaptersPayload, DroppedStrState } from "./types";
import { getTiptapHTML } from "./utils/editorUtils";
import { MAX_CHAPTER_CHARS } from "./constants";

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
  // 変更: getTiptapHTMLの結果をuseMemoでメモ化してパフォーマンス向上
  const editorCharItems = useMemo(() => {
    return getTiptapHTML(editor);
  }, [editor.state.doc]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={editor.commands.blur}
    >
      <div className="h-screen">
        <div className="h-[calc(66.67%-16px)] mx-4 mb-4 border overflow-y-auto">
          {/* 過去の章の表示 */}
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
          
          {/* 現在編集中の章 */}
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
                  {/* 変更: メモ化されたeditorCharItemsを使用 */}
                  {editorCharItems.map((char, index) =>
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
        
        {/* ドラッグ可能な単語リストと操作ボタン */}
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
                {/* 変更: droppedStrState.lengthは親から渡されたpropsを使用 */}
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