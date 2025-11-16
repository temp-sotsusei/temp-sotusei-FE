import WordListSelect2 from "@/layout/WordListSelect2";
import { FC } from "react";

const Page: FC = () => {
  // TODO:文字数による表記崩れについて調査したい
  const nestedWordList: string[][] = [
    ["どうぶつ", "もり", "かぎ", "たからもの"],
    ["まほうつかい", "ほし", "てがみ", "ねがい"],
    ["ふね", "そら", "ともだち", "ぼうけん"],
  ];

  return <WordListSelect2 nestedWordList={nestedWordList} />;
};

export default Page;
