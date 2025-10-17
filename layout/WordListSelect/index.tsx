"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import WordList from "@/components/WordList";
import SlidePrevButton from "@/components/SlidePrevButton";
import SlideNextButton from "@/components/SlideNextButton";
import type { Swiper as SwiperType } from "swiper";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Draggable from "@/components/Draggable";
import {
  DndContext,
  DragEndEvent,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Droppable from "@/components/Droppable";

type DroppedStrState = {
  id: UniqueIdentifier;
  droppedString: string;
  droppedIndex: number;
};
type Props = {
  nestedWordList: string[][];
};
const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  const [isSelectedWordList, setIsSelectedWordList] = useState<boolean>(false);
  const handleSelectWordList = useCallback(() => {
    setIsSelectedWordList((prev) => !prev);
  }, []);
  const [displayedWordList, setDisplayedWordList] = useState<string[]>();
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setDisplayedWordList(nestedWordList[swiper.realIndex]);
  }, []);
  const [isTextEditorActive, setIsTextEditorActive] = useState(false);
  const deactivateTextEditor = useCallback(() => {
    setIsTextEditorActive(false);
  }, []);
  const [textValue, setTextValue] = useState<string>(
    "あああああああああああああああああああああああああああああああああああああああああああああああ"
  );
  const [droppedStrState, setDroppedStrState] = useState<DroppedStrState[]>([]);
  const editor = useEditor({
    extensions: [StarterKit],
    content: textValue,
    immediatelyRender: false,
    onBlur: ({ editor }) => {
      setTextValue(editor.getText());
      deactivateTextEditor();
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
        console.log("ドロップされた要素番目:", active.id);
        setDroppedStrState((prev) => {
          const filteredState = prev.filter((item) => item.id !== active.id);
          return [
            ...filteredState,
            {
              id: active.id,
              droppedString: active.data.current.draggedText,
              droppedIndex: over.data.current.position,
            },
          ];
        });
      } else {
        console.log("drop範囲は入力文字内である必要があります");
      }
    },
    [droppedStrState]
  );
  return (
    <>
      {isSelectedWordList ? (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="h-screen">
            <div className="h-[calc(66.67%-16px)] mx-4 mb-4 border">
              <div className="border flex items-center justify-center py-2 m-4">
                第1章
              </div>
              <div className="mx-8">第1章の単語</div>
              <div className="my-2 mx-8 flex items-center justify-start gap-x-2 gap-y-2 flex-wrap">
                {displayedWordList.map((word, index) => (
                  <div className="border px-4 py-2 rounded-2xl" key={index}>
                    {word}
                  </div>
                ))}
              </div>
              {isTextEditorActive ? (
                <EditorContent editor={editor} className="border mx-8" />
              ) : (
                <div
                  className="border mx-8 break-all"
                  onClick={activateTextEditor}
                >
                  {/* // TODO:ガチでメモ化したい.不快 */}
                  {textValue.split("").map((char, index) => (
                    <Droppable key={index} id={index}>
                      {char}
                    </Droppable>
                  ))}
                </div>
              )}
            </div>
            <div className="h-1/3 border-t flex flex-col items-between">
              <div className="mt-8 mx-4 flex flex-wrap items-start gap-4 h-[calc(66.67%-32px)]">
                {displayedWordList.map((word, index) => (
                  <Draggable key={index} id={index} draggedText={word}>
                    <div className="border px-4 py-2 rounded-2xl">{word}</div>
                  </Draggable>
                ))}
              </div>
              <div className="flex items-center justify-between mx-4 h-1/3">
                <div className="flex-1" />
                <div className="px-16 py-4 border">完成</div>
                <div className="flex-1 flex justify-end">
                  <div className="text-center border p-2">
                    <p className="text-sm">次の章を作成</p>
                    <p className="text-sm">0/4</p>
                  </div>
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
            {nestedWordList.map((wordList, index) => (
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
