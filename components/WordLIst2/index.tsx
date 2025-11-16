import { FC } from "react";

type Props = {
  wordList: string[];
};

const WordList2: FC<Props> = ({ wordList }) => {
  return (
    <div className="border mx-auto w-70 h-40 p-4 mt-20 bg-white">
      <p className="font-bold">単語リスト</p>
      <div className="flex flex-wrap mt-2 gap-2">
        {wordList.map((word, index) => (
          <p
            className="border border-gray-400 rounded-2xl px-4 py-2 truncate"
            key={index}
          >
            {word}
          </p>
        ))}
      </div>
    </div>
  );
};

export default WordList2;
