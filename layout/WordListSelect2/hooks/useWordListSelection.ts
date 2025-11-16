// 変更: 単語リスト選択のロジックをカスタムフックに分離

import { useCallback, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

export const useWordListSelection = (initialWordList: string[][]) => {
  const [isSelectedWordList, setIsSelectedWordList] = useState<boolean>(false);
  const [candidateWordList, setCandidateWordList] = useState<string[][]>(initialWordList);
  const [selectedWordList, setSelectedWordList] = useState<string[]>();

  const handleSelectWordList = useCallback(() => {
    setIsSelectedWordList((prev) => !prev);
  }, []);

  const handleCandidateWordList = useCallback((wordList: string[][]) => {
    setCandidateWordList(wordList);
  }, []);

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setSelectedWordList(candidateWordList[swiper.realIndex]);
    },
    [candidateWordList]
  );

  return {
    isSelectedWordList,
    candidateWordList,
    selectedWordList,
    handleSelectWordList,
    handleCandidateWordList,
    handleSlideChange,
  };
};