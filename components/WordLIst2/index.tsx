import { FC } from "react";

type Props = {
  wordList: string[];
};

const WordList2: FC<Props> = ({ wordList }) => {
  return (
    <div className="aspect-[4/2.5] w-full p-2 border-4 border-[#93C400] bg-white rounded-lg">
      <p className="font-bold">たんご リスト</p>
      <div className="flex flex-wrap mt-2 gap-2">
        {wordList.map((word, index) => (
          <p
            className="border border-gray-400 rounded-md px-2 py-1 truncate"
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
