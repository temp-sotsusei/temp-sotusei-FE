// 変更: 型定義を共通化して一箇所に集約

import { UniqueIdentifier } from "@dnd-kit/core";

export type ChaptersPayload = {
  chapterNum: number;
  chapterText: string;
  keywords: {
    keyword: string;
    position: number;
  }[];
};

export type DroppedStrState = {
  id: UniqueIdentifier;
  droppedString: string;
  droppedIndex: number;
};

export type CharItem = {
  char: string;
  isDroppable: boolean;
  isEmpty: boolean;
  isNewLine: boolean;
};