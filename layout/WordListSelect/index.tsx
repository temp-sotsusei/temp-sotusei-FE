"use client";

import { FC } from "react";
import { APP_TITLE } from "@/constants";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import WordList from "@/components/WordList";
import SlidePrevButton from "@/components/SlidePrevButton";
import SlideNextButton from "@/components/SlideNextButton";

type Props = {
  nestedWordList: string[][];
};
const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  const swiper = useSwiper();
  console.log(swiper);

  return (
    <>
      <div className="fixed left-1/2 -translate-x-1/2 top-8 border font-bold px-8 py-4">
        {APP_TITLE}
      </div>
      <div className="fixed bottom-0 border-t w-full h-160">
        <Swiper spaceBetween={0} loop={true}>
          {nestedWordList.map((wordList, index) => (
            <SwiperSlide key={index}>
              <WordList wordList={wordList} />
            </SwiperSlide>
          ))}
          <div className="flex justify-between px-8 mt-30">
            <SlidePrevButton />
            <SlideNextButton />
          </div>
        </Swiper>
        {/* // TODO:absoluteの位置をfooterの位置にしたい */}
        <div className="absolute">
          <div className="relative right-5 -top-60  border h-40 w-40 -z-10" />
          <div className="relative left-70 -top-100 border h-40 w-40 -z-10" />
        </div>
        <div className="flex items-center justify-center mt-20">
          <button className="border py-4 px-16">決定</button>
        </div>
      </div>
    </>
  );
};

export default WordListSelect;
