"use client";

import { FC, useCallback, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { DragEndEvent, UniqueIdentifier, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import CustomWord from "@/components/CustomWord";
import { stripHtml } from "string-strip-html";
import { MAX_CHAPTER_CHARS } from "@/const";
import { postChapter } from "@/apiClient";
import WordListSelectView from "./WordListSelectView";

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
  nestedWordList: string[][];
};

const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  const [isSelectedWordList, setIsSelectedWordList] = useState<boolean>(false);
  const handleSelectWordList = useCallback(() => {
    setIsSelectedWordList((prev) => !prev);
  }, []);

  const [candidateWordList, setCandidateWordList] = useState<string[][]>(nestedWordList);
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

  const [isOverChapterText, setIsOverChapterText] = useState(false);
  const [contentLength, setContentLength] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit, CustomWord],
    content:
      "<p>あなたは<span>ぞう</span>ですが、<span>まほうつかい</span>でもありますし、<span>からあげ</span>が好きな<span>あり</span>です。</p>",
    immediatelyRender: false,
    onBlur: () => {
      deactivateTextEditor();
    },
    onUpdate: ({ editor }) => {
      const currentChapterText = stripHtml(editor.getHTML()).result;
      setContentLength(currentChapterText.length);
      setIsOverChapterText(currentChapterText.length > MAX_CHAPTER_CHARS);
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
      if (over.id === "droppable-box") {
        setDroppedStrState((prev) => {
          const filteredState = prev.filter((item) => item.id !== active.id);
          return [
            ...filteredState,
            {
              id: active.id,
              droppedString: active.data.current.draggedText,
              droppedIndex: editor.state.doc.content.size - 1,
            },
          ];
        });

        editor
          .chain()
          .focus()
          .insertCustomWord(
            active.data.current.draggedText,
            active.id,
            editor.state.doc.content.size - 1,
          )
          .run();
      } else if (over) {
        setDroppedStrState((prev) => {
          const filteredState = prev.filter((item) => item.id !== active.id);
          return [
            ...filteredState,
            {
              id: active.id,
              droppedString: active.data.current.draggedText,
              droppedIndex: over.data.current.position + 2,
            },
          ];
        });

        editor
          .chain()
          .focus()
          .insertCustomWord(
            active.data.current.draggedText,
            active.id,
            over.data.current.position + 2
          )
          .run();
      } else {
        console.log("drop範囲は入力文字内である必要があります");
      }
    },
    [droppedStrState, editor]
  );

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
    <WordListSelectView
      isSelectedWordList={isSelectedWordList}
      candidateWordList={candidateWordList}
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
      handleSlideChange={handleSlideChange}
      handleSelectWordList={handleSelectWordList}
      handleDragEnd={handleDragEnd}
      activateTextEditor={activateTextEditor}
      handleClickNextChapter={handleClickNextChapter}
    />
  );
};

export default WordListSelect;