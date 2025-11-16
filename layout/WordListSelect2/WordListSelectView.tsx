"use client";

import { FC } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Editor } from "@tiptap/react";
import { DragEndEvent, UniqueIdentifier, SensorDescriptor } from "@dnd-kit/core";
import ChapterEdit from "./ChapterEdit";
import WordListSelection from "./WordListSelection";

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

type Props = {
  isSelectedWordList: boolean;
  candidateWordList: string[][];
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
  handleSlideChange: (swiper: SwiperType) => void;
  handleSelectWordList: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
  activateTextEditor: () => void;
  handleClickNextChapter: () => Promise<void>;
};

const WordListSelectView: FC<Props> = ({
  isSelectedWordList,
  candidateWordList,
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
  handleSlideChange,
  handleSelectWordList,
  handleDragEnd,
  activateTextEditor,
  handleClickNextChapter,
}) => {
  return (
    <>
      {isSelectedWordList ? (
        <ChapterEdit
          selectedWordList={selectedWordList}
          chaptersPayload={chaptersPayload}
          editor={editor}
          isTextEditorActive={isTextEditorActive}
          isOverChapterText={isOverChapterText}
          contentLength={contentLength}
          droppedStrState={droppedStrState}
          isPosting={isPosting}
          canCreateNextChapter={canCreateNextChapter}
          sensors={sensors}
          handleDragEnd={handleDragEnd}
          activateTextEditor={activateTextEditor}
          handleClickNextChapter={handleClickNextChapter}
        />
      ) : (
        <WordListSelection
          candidateWordList={candidateWordList}
          handleSlideChange={handleSlideChange}
          handleSelectWordList={handleSelectWordList}
        />
      )}
    </>
  );
};

export default WordListSelectView;