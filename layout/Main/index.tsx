"use client";

import DoneMark from "@/components/icon/DoneMark";
import { CircleQuestionMark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import Calendar from "react-calendar";
import { Swiper, SwiperSlide } from "swiper/react";
import { APP_TITLE } from "@/constants";

import "swiper/css";
import "react-calendar/dist/Calendar.css";

type CalenderStoryItem = {
  image: string;
  title: string;
};
type CalenderStoryDataStrict = Record<string, CalenderStoryItem[]>;

type Props = {
  calenderStoryData: CalenderStoryDataStrict;
};

const Main: FC<Props> = ({ calenderStoryData }) => {
  const calenderStoryDataKeys = Object.keys(calenderStoryData);
  const calenderStoryDataEntries = Object.entries(calenderStoryData);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const findEntries = calenderStoryDataEntries.find(
    (data) => data[0] === selectedDay
  );
  return (
    <>
      <div className="flex items-center justify-center p-4">
        <p>{APP_TITLE}</p>
        <Link href="/guides" className="fixed right-4 top-2">
          <CircleQuestionMark size={36} />
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Calendar
          onChange={(e) => {
            if (e instanceof Date) {
              setSelectedDay(e.toLocaleDateString());
              console.log(e.toLocaleDateString());
            } else {
              alert("複数選択は許可されていません。");
              setSelectedDay("");
            }
          }}
          tileContent={({ date }) => {
            if (calenderStoryDataKeys.includes(date.toLocaleDateString())) {
              return <DoneMark className="w-full mx-auto mt-1" />;
            }
            return <div className="w-6 h-7" />;
          }}
        />
        <Swiper
          spaceBetween={50}
          slidesPerView="auto"
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {findEntries &&
            findEntries[1].map((data) => (
              <SwiperSlide className="relative">
                <Image
                  src={data.image}
                  alt="サムネイル画像"
                  width={350}
                  height={350}
                  className="mx-auto"
                />
                <p className="absolute text-2xl text-gray-400 bottom-4 right-10">
                  {data.title}
                </p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="fixed bottom-0 w-full h-20 flex justify-center items-center border-t">
        <div className="w-1/4 h-full flex justify-center items-center border">
          物語作成
        </div>
      </div>
    </>
  );
};

export default Main;
