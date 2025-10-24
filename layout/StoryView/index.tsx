"use client";

import type { FC } from "react";
import { APP_TITLE } from "@/constants";

type Chapter = {
  story: string;
  words: string[];
  feedback: string;
};

type Props = {
  title: string;
  chapters: Chapter[];
};

const StoryView: FC<Props> = ({ title, chapters }) => {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-10 py-8 space-y-8 md:space-y-9">
      <h1 className="font-bold text-2xl md:text-4xl">{APP_TITLE}</h1>
      <div className="w-full md:w-4/5 border border-gray-300 rounded-md p-3 md:p-4 text-center text-base md:text-lg font-medium">
        {title}
      </div>
      <div className="w-full md:w-4/5 flex flex-col space-y-8 md:space-y-9">
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="flex flex-col space-y-4 md:space-y-5 border border-gray-300 rounded-md p-4 md:p-5"
          >
            <div className="text-base md:text-lg font-bold">第{index + 1}章</div>
            <div className="border border-gray-200 rounded-md p-4 md:p-5 bg-white min-h-[120px] md:min-h-[160px] text-sm md:text-base whitespace-pre-wrap">
              {chapter.story}
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {chapter.words.slice(0, 4).map((word, wordIndex) => (
                <div
                  key={wordIndex}
                  className="px-3 md:px-4 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="border border-gray-200 rounded-md p-4 md:p-5 bg-white min-h-[100px] md:min-h-[140px] text-sm md:text-base whitespace-pre-wrap">
              {chapter.feedback}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryView;
