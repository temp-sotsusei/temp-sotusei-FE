"use client";

import { FC, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import WordList from "@/components/WordList";
import SlidePrevButton from "@/components/SlidePrevButton";
import SlideNextButton from "@/components/SlideNextButton";
import type { Swiper as SwiperType } from "swiper";
import { EditorContent, NodeType, TextType, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Draggable from "@/components/Draggable";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import { postChapter } from "@/apiClient";
import CustomWord from "@/components/CustomWord";
import { stripHtml } from "string-strip-html";
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
};
type Props = {
  nestedWordList: string[][];
};

const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  const [isSelectedWordList, setIsSelectedWordList] = useState<boolean>(false);
  const handleSelectWordList = useCallback(() => {
    setIsSelectedWordList((prev) => !prev);
  }, []);
  const [candidateWordList, setCandidateWordList] =
    useState<string[][]>(nestedWordList);
  const handleCandidateWordList = useCallback((wordList: string[][]) => {
    setCandidateWordList(wordList);
  }, []);
  const [selectedWordList, setSelectedWordList] = useState<string[]>();
  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setSelectedWordList(candidateWordList[swiper.realIndex]);
    },
    [candidateWordList]
  );
  const [isTextEditorActive, setIsTextEditorActive] = useState(false);
  const deactivateTextEditor = useCallback(() => {
    setIsTextEditorActive(false);
  }, []);
  const [droppedStrState, setDroppedStrState] = useState<DroppedStrState[]>([]);
  const removeDroppedStr = useCallback((droppedId: UniqueIdentifier) => {
    setDroppedStrState((prev) =>
      prev.filter((droppedStr) => droppedStr.id !== droppedId)
    );
  }, []);
  const editor = useEditor({
    extensions: [StarterKit, CustomWord],
    content:
      "<p>あなたは<span>ぞう</span>ですが、<span>まほうつかい</span>でもありますし、<span>からあげ</span>が好きな<span>あり</span>です。</p>",
    immediatelyRender: false,
    onBlur: () => {
      deactivateTextEditor();
    },
    onUpdate: ({ editor }) => {
      // TODO:外に出したい
      // console.log("エディターの入力文字数");
      const currentChapterText = stripHtml(editor.getHTML()).result;
      // console.log("エディタ入力文字数:", currentChapterText.length);
      if (currentChapterText.length > MAX_CHAPTER_CHARS) {
        // TODO:文字数の出力する？
        // console.log("エディタ入力値が200文字を超えている");
      } else {
        // console.log("エディタ入力値が200文字以内です!");
      }
    },
    onDelete: (deleteEvent) => {
      if (deleteEvent.type === "node" && deleteEvent.node.attrs.droppedId) {
        const droppedId = deleteEvent.node.attrs.droppedId;
        removeDroppedStr(droppedId);
      }
    },
  });
  const activateTextEditor = useCallback(() => {
    setIsTextEditorActive(true);
    editor.commands.focus();
  }, [editor]);
  const sensors = useSensors(useSensor(TouchSensor));
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;
      if (over) {
        console.log("文字列番目:", over.data.current.position);
        console.log(
          "ドロップされた要素の文字:",
          active.data.current.draggedText
        );
        console.log("ドロップされた要素id:", active.id);
        setDroppedStrState((prev) => {
          const filteredState = prev.filter((item) => item.id !== active.id);
          return [
            ...filteredState,
            {
              id: active.id,
              droppedString: active.data.current.draggedText,
              droppedIndex: over.data.current.position + 1,
            },
          ];
        });

        editor
          .chain()
          .focus()
          .insertCustomWord(
            active.data.current.draggedText,
            active.id,
            over.data.current.position + 1
          )
          .run();
      } else {
        console.log("drop範囲は入力文字内である必要があります");
      }
    },
    [droppedStrState, editor]
  );
  const postChapterRequest = useCallback(
    async (chapterText: string) => {
      const response = await postChapter(chapterText);
      handleSelectWordList();
      handleCandidateWordList(response);
      handleSetChaptersPayload();
      setDroppedStrState([]);
      editor.commands.clearContent();
    },
    [editor, droppedStrState]
  );
  const getTiptapHTML = useCallback(() => {
    const editorContent = editor.getJSON();
    const contents = editorContent.content[0].content ?? [];

    const result: CharItem[] = [];
    contents.forEach((content) => {
      if (content.type === "text") {
        const textObject = content as TextType;
        textObject.text.split("").forEach((char) => {
          result.push({
            char,
            isDroppable: true,
          });
        });
      } else if (content.type === "customWord") {
        const customWordObject = content as NodeType;
        customWordObject.attrs.text.split(".").forEach((char) => {
          result.push({
            char,
            isDroppable: false,
          });
        });
      }
    });

    return result;
  }, [editor]);
  const [chaptersPayload, setChaptersPayload] = useState<ChaptersPayload[]>([]);
  const handleSetChaptersPayload = useCallback(() => {
    const chapterNum = chaptersPayload.length + 1;
    const chapterText = stripHtml(editor.getHTML()).result;

    const chapterKeywords = droppedStrState.map((droppedStrState) => ({
      keyword: droppedStrState.droppedString,
      position: droppedStrState.droppedIndex,
    }));
    setChaptersPayload([
      ...chaptersPayload,
      { chapterNum, chapterText, keywords: chapterKeywords },
    ]);
  }, [chaptersPayload, editor, droppedStrState]);
  const [isPosting, setIsPosting] = useState(false);
  const handleClickNextChapter = async () => {
    if (isPosting) return;
    setIsPosting(true);

    try {
      await postChapterRequest("abcdef123");
    } catch (error) {
      console.error("章の投稿に失敗しました", error);
    } finally {
      setIsPosting(false);
    }
  };
  const canCreateNextChapter =
    droppedStrState.length === 4 && chaptersPayload.length <= 3;
  return (
    <>
      {isSelectedWordList ? (
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
                  {/* // TODO:ドロップ文字を良い感じに変えたいか？ */}
                  <div className="border mx-8 h-64">{chapter.chapterText}</div>
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
                {isTextEditorActive ? (
                  <EditorContent
                    editor={editor}
                    className="border mx-8 h-64 [&>div]:h-full relative"
                  >
                    <div className="absolute right-4 top-55 text-gray-300">
                      {/* // TODO:メモ化したい */}
                      {`${
                        stripHtml(editor.getHTML()).result.length
                      } / ${MAX_CHAPTER_CHARS}`}
                    </div>
                  </EditorContent>
                ) : (
                  <div
                    className="border mx-8 h-64 break-words relative"
                    onClick={activateTextEditor}
                  >
                    {getTiptapHTML().map((char, index) =>
                      char.isDroppable ? (
                        <Droppable key={index} id={index}>
                          {char.char}
                        </Droppable>
                      ) : (
                        <div key={index} className="border inline px-2 py-1">
                          {char.char}
                        </div>
                      )
                    )}
                    <div className="absolute right-4 bottom-2 text-gray-300">
                      {/* // TODO:メモ化したい */}
                      {`${
                        stripHtml(editor.getHTML()).result.length
                      } / ${MAX_CHAPTER_CHARS}`}
                    </div>
                  </div>
                )}
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
                  {/* <button
                    className={`text-center border p-2 ${
                      canCreateNextChapter
                        ? "border-black"
                        : "border-gray-400 text-gray-400"
                    }`}
                    disabled={!canCreateNextChapter}
                    onClick={() => postChapterRequest("abcdef123")}
                  >
                    <p className="text-sm">次の章を作成</p>
                    <p className="text-sm">{droppedStrState.length}/4</p>
                  </button> */}
                  <button
                    className={`text-center border p-2 ${
                      canCreateNextChapter && !isPosting
                        ? "border-black"
                        : "border-gray-400 text-gray-400"
                    }`}
                    disabled={!canCreateNextChapter || isPosting}
                    onClick={handleClickNextChapter}
                  >
                    <p className="text-sm">
                      {isPosting ? "送信中..." : "次の章を作成"}
                    </p>
                    <p className="text-sm">{droppedStrState.length}/4</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DndContext>
      ) : (
        <div className="fixed bottom-0 border-t w-full h-2/3">
          <Swiper
            spaceBetween={0}
            loop={true}
            onSlideChange={handleSlideChange}
          >
            {candidateWordList.map((wordList, index) => (
              <SwiperSlide key={index}>
                <WordList wordList={wordList} />
              </SwiperSlide>
            ))}
            <div className="flex justify-between px-8 mt-30">
              <SlidePrevButton />
              <SlideNextButton />
            </div>
          </Swiper>
          {/* // TODO:absoluteの位置をfooterの位置にしたい */}
          <div className="absolute">
            <div className="relative right-5 -top-60  border h-40 w-40 -z-10" />
            <div className="relative left-70 -top-100 border h-40 w-40 -z-10" />
          </div>
          <div className="flex items-center justify-center mt-20">
            <button
              className="border py-4 px-16"
              onClick={handleSelectWordList}
            >
              決定
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WordListSelect;
