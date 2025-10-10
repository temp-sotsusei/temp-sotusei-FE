import WordListSelect from "@/layout/WordListSelect";
import { FC } from "react";

const Page: FC = () => {
  const nestedWordList: string[][] = [
    ["どうぶつ", "もり", "かぎ", "たからもの"],
    ["まほうつかい", "ほし", "てがみ", "ねがい"],
    ["ふね", "そら", "ともだち", "ぼうけん"],
  ];

  return <WordListSelect nestedWordList={nestedWordList} />;
};

export default Page;
