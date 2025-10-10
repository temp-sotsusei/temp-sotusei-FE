import WordListSelect from "@/layout/WordListSelect";
import { FC } from "react";

const Page: FC = () => {
  // TODO:ワードリストのAPI設計を考える
  const wordList: string[][] = [
    ["どうぶつ", "もり", "かぎ", "たからもの"],
    ["まほうつかい", "ほし", "てがみ", "ねがい"],
    ["ふね", "そら", "ともだち", "ぼうけん"],
  ];

  return <WordListSelect wordList={wordList} />;
};

export default Page;
