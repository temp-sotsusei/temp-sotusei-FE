import { UniqueIdentifier } from "@dnd-kit/core";

type DroppedTexts = {
  id: UniqueIdentifier;
  droppedString: string;
  stringBuildDroppedIndex: number;
  currentChapterDisplayDroppedIndex: number;
}[];

export const mergeDroppedText = (
  inputText: string,
  droppedTexts: DroppedTexts
) => {
  const sortedDroppedTexts = [...droppedTexts].sort((current, next) => {
    return next.stringBuildDroppedIndex - current.stringBuildDroppedIndex;
  });

  let resultText = "";
  sortedDroppedTexts.forEach((droppedTexts) => {
    console.log("droppedTexts:", droppedTexts);
  });
};
