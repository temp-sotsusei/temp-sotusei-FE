"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Swiper as SwiperType } from "swiper";
import WordList from "@/components/WordList";
import SlidePrevButton from "@/components/SlidePrevButton";
import SlideNextButton from "@/components/SlideNextButton";

type Props = {
  candidateWordList: string[][];
  handleSlideChange: (swiper: SwiperType) => void;
  handleSelectWordList: () => void;
};

const WordListSelection: FC<Props> = ({
  candidateWordList,
  handleSlideChange,
  handleSelectWordList,
}) => {
  return (
    <div className="fixed bottom-0 border-t w-full h-2/3">
      <Swiper
        spaceBetween={0}
        loop={true}
        onSlideChange={handleSlideChange}
      >
        {candidateWordList.map((wordList, index) => (
          <SwiperSlide key={index}>
            <WordList wordList={wordList} />
          </SwiperSlide>
        ))}
        <div className="flex justify-between px-8 mt-30">
          <SlidePrevButton />
          <SlideNextButton />
        </div>
      </Swiper>
      <div className="absolute">
        <div className="relative right-5 -top-60  border h-40 w-40 -z-10" />
        <div className="relative left-70 -top-100 border h-40 w-40 -z-10" />
      </div>
      <div className="flex items-center justify-center mt-20">
        <button
          className="border py-4 px-16"
          onClick={handleSelectWordList}
        >
          決定
        </button>
      </div>
    </div>
  );
};

export default WordListSelection;