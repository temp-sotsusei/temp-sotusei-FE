"use client";

import { FC } from "react";
import { APP_TITLE } from "@/constants";
import Swiper from "swiper";

import "swiper/css";
import { SwiperSlide } from "swiper/react";

const WordListSelect: FC = () => {
  return (
    <>
      <div className="flex items-center justify-center mt-6">
        <div className="font-bold border px-12 py-4">{APP_TITLE}</div>
      </div>
      <div className="flex items-center justify-center m-20">
        <p className="font-bold">単語リストを選んでね</p>
      </div>
      <Swiper>
        <SwiperSlide></SwiperSlide>
      </Swiper>
    </>
  );
};

export default WordListSelect;
