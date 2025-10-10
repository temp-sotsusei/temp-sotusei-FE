"use client";

import { FC } from "react";
import { APP_TITLE } from "@/constants";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

type Props = {
  wordList: string[][];
};
const WordListSelect: FC<Props> = ({ wordList }) => {
  return (
    <>
      <div className="flex items-center justify-center mt-6">
        <div className="font-bold border px-12 py-4">{APP_TITLE}</div>
      </div>
      <div className="flex items-center justify-center m-20">
        <p className="font-bold">単語リストを選んでね</p>
      </div>
      <Swiper
        spaceBetween={50}
        slidesPerView="auto"
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>
          <div className="w-full flex justify-center items-center">
            <div className="w-1/2 h-60 border">aaa</div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default WordListSelect;
