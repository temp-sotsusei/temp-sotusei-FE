"use client";

// 変更: カスタムフックを使用してロジックを分離し、コンテナの責務を軽減

import { FC, useCallback } from "react";
import WordListSelectView from "./WordListSelectView";
import { useWordListSelection } from "./hooks/useWordListSelection";
import { useChapterManagement } from "./hooks/useChapterManagement";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useChapterEditor } from "./hooks/useChapterEditor";

type Props = {
  nestedWordList: string[][];
};

const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  // 変更: 各機能をカスタムフックに分離
  const {
    isSelectedWordList,
    candidateWordList,
    selectedWordList,
    handleSelectWordList,
    handleCandidateWordList,
    handleSlideChange,
  } = useWordListSelection(nestedWordList);

  const {
    chaptersPayload,
    isPosting,
    canCreateNextChapter,
    addChapter,
    postChapterRequest,
  } = useChapterManagement();

  // 変更: ドラッグ&ドロップのフックを先に初期化（editorが必要なため）
  const dragDropHookInitializer = (editor) => useDragAndDrop(editor);
  
  const {
    editor,
    isTextEditorActive,
    isOverChapterText,
    contentLength,
    activateTextEditor,
    clearEditor,
    getEditorText,
  } = useChapterEditor((id) => {
    // エディターが初期化されてからドラッグ&ドロップフックにアクセス
    if (dragAndDropRef.current) {
      dragAndDropRef.current.removeDroppedStr(id);
    }
  });

  // 変更: useRefを使ってドラッグ&ドロップフックを保持
  const dragAndDropRef = { current: null };
  const dragAndDropHook = useDragAndDrop(editor);
  dragAndDropRef.current = dragAndDropHook;

  const { droppedStrState, sensors, handleDragEnd, clearDroppedStr } = dragAndDropHook;

  // 変更: 次の章を作成する処理を整理し、責務を明確化
  const handleClickNextChapter = useCallback(async () => {
    // 変更前: ハードコード "abcdef123"
    // 変更後: 実際のエディターの内容を使用
    const chapterText = getEditorText();

    await postChapterRequest(chapterText, (response) => {
      // 変更: 副作用を分離し、順序を明確化
      // 1. 章データを追加
      addChapter(chapterText, droppedStrState);
      
      // 2. 単語リストを更新
      handleCandidateWordList(response);
      
      // 3. 単語リスト選択画面に戻る
      handleSelectWordList();
      
      // 4. 状態をクリア
      clearDroppedStr();
      clearEditor();
    });
  }, [
    getEditorText,
    postChapterRequest,
    addChapter,
    droppedStrState,
    handleCandidateWordList,
    handleSelectWordList,
    clearDroppedStr,
    clearEditor,
  ]);

  // 変更: 章作成可能かどうかの判定を関数呼び出しに変更
  const isChapterCreatable = canCreateNextChapter(droppedStrState.length);

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
      canCreateNextChapter={isChapterCreatable}
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