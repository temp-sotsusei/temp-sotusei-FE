import StoryCreator from "@/layout/StoryCreator";
import { FC } from "react";

const Page: FC = () => {
  // TODO:文字数による表記崩れについて調査したい
  const nestedWordList: string[][] = [
    ["どうぶつ", "もり", "かぎ", "たからもの"],
    ["まほうつかい", "ほし", "てがみ", "ねがい"],
    ["ふね", "そら", "ともだち", "ぼうけん"],
  ];

  return <StoryCreator wordsList={nestedWordList} />;
};

export default Page;
