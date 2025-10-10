"use client";

import { FC, TouchEvent, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { SubmitHandler, useForm } from "react-hook-form";
import WordList from "@/components/WordList";
import SlidePrevButton from "@/components/SlidePrevButton";
import SlideNextButton from "@/components/SlideNextButton";
import { MESSAGE_FORM_VALUES } from "@/constants";
import { MessageForm } from "@/types/form";

import "swiper/css";
import { ErrorMessage } from "@hookform/error-message";

type Props = {
  nestedWordList: string[][];
};
const WordListSelect: FC<Props> = ({ nestedWordList }) => {
  const [isSelectedWordList, setIsSelectedWordList] = useState<boolean>(false);
  const handleSelectWordList = useCallback(() => {
    setIsSelectedWordList((prev) => !prev);
  }, []);
  const [displayedWordList, setDisplayedWordList] = useState<string[]>();
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setDisplayedWordList(nestedWordList[swiper.realIndex]);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageForm>({
    defaultValues: {
      [MESSAGE_FORM_VALUES.MESSAGE]: "",
    },
  });
  const onSubmit = useCallback<SubmitHandler<MessageForm>>(
    (data) => console.log(data),
    []
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startDrag = useCallback((e: TouchEvent<HTMLParagraphElement>) => {
    setIsDragging(true);
    console.log(e);
  }, []);

  return (
    <>
      {isSelectedWordList ? (
        <form className="h-screen" onSubmit={handleSubmit(onSubmit)}>
          <div className="h-[calc(66.66%-16px)] mx-4 mb-4 border">
            <div className="border flex items-center justify-center py-2 m-4">
              第1章
            </div>
            <div className="mx-8">
              <p>第1章の単語</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {displayedWordList.map((word, index) => (
                  <p
                    className="border border-gray-400 rounded-2xl px-4 py-2"
                    key={index}
                    // ref={}
                    onTouchStart={startDrag}
                  >
                    {word}
                  </p>
                ))}
              </div>
              <textarea
                rows={9}
                placeholder="第1章の物語入力"
                className="mt-4 w-full border rounded p-4"
                {...register(MESSAGE_FORM_VALUES.MESSAGE, {
                  maxLength: {
                    value: 150,
                    message: "150文字以内で入力してください",
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name={MESSAGE_FORM_VALUES.MESSAGE}
                render={({ message }) => (
                  <p className="text-red-500">{message}</p>
                )}
              />
            </div>
          </div>
          <div className="h-1/3 border-t">
            <div className="mt-8 mx-4 flex flex-wrap items-start gap-4 h-[calc(66.66%-32px)]">
              {displayedWordList.map((word, index) => (
                <div className="border px-4 py-2 rounded-2xl" key={index}>
                  {word}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mx-4 h-1/3">
              <div className="flex-1" />
              <div className="px-16 py-4 border">完成</div>
              <div className="flex-1 flex justify-end">
                <button type="submit" className="text-center border p-2">
                  <p className="text-sm">次の章を作成</p>
                  <p className="text-sm">0/4</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="fixed bottom-0 border-t w-full h-2/3">
          <Swiper
            spaceBetween={0}
            loop={true}
            onSlideChange={handleSlideChange}
          >
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
            <button
              className="border py-4 px-16"
              onClick={handleSelectWordList}
            >
              決定
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WordListSelect;
