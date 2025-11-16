// 変更: 章管理のロジックをカスタムフックに分離

import { useCallback, useState, useMemo } from "react";
import { postChapter } from "@/apiClient";
import { MAX_CHAPTERS, REQUIRED_KEYWORDS_PER_CHAPTER } from "../constants";
import { ChaptersPayload, DroppedStrState } from "../types";

export const useChapterManagement = () => {
  const [chaptersPayload, setChaptersPayload] = useState<ChaptersPayload[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // 変更: 章作成可能条件をuseMemoで計算し、意図を明確化
  const canCreateNextChapter = useCallback(
    (droppedStrCount: number) => {
      // 変更前: droppedStrState.length === 4 && chaptersPayload.length <= 3
      // 変更後: 定数化して意図を明確に（<= 3 は実質4章まで）
      return (
        droppedStrCount === REQUIRED_KEYWORDS_PER_CHAPTER &&
        chaptersPayload.length < MAX_CHAPTERS
      );
    },
    [chaptersPayload.length]
  );

  // 変更: 章データの追加処理を独立させた
  const addChapter = useCallback(
    (chapterText: string, droppedStrState: DroppedStrState[]) => {
      const chapterNum = chaptersPayload.length + 1;
      const chapterKeywords = droppedStrState.map((droppedStrState) => ({
        keyword: droppedStrState.droppedString,
        position: droppedStrState.droppedIndex,
      }));

      setChaptersPayload((prev) => [
        ...prev,
        { chapterNum, chapterText, keywords: chapterKeywords },
      ]);
    },
    [chaptersPayload.length]
  );

  // 変更: API呼び出しと副作用を分離
  // onSuccessコールバックで各処理を呼び出し側で制御できるように
  const postChapterRequest = useCallback(
    async (
      chapterText: string,
      onSuccess: (response: string[][]) => void
    ) => {
      if (isPosting) return;
      setIsPosting(true);

      try {
        // 変更前: ハードコード "abcdef123"
        // 変更後: 実際のchapterTextを使用
        const response = await postChapter(chapterText);
        onSuccess(response);
      } catch (error) {
        // 変更: エラーハンドリングを改善（将来的にはtoast通知などを追加）
        console.error("章の投稿に失敗しました", error);
        // TODO: ユーザーにエラーを通知する仕組みを追加
        throw error;
      } finally {
        setIsPosting(false);
      }
    },
    [isPosting]
  );

  return {
    chaptersPayload,
    isPosting,
    canCreateNextChapter,
    addChapter,
    postChapterRequest,
  };
};