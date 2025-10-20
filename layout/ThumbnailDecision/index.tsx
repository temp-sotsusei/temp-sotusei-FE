"use client";

import type { FC } from "react";
import Image from "next/image";
import { APP_TITLE } from "@/constants";

type Props = {
  thumbnails: string[];
};

const ThumbnailDecision: FC<Props> = ({ thumbnails }) => {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-10 py-8 space-y-8 md:space-y-9">
      <h1 className="font-bold text-2xl md:text-4xl">{APP_TITLE}</h1>
      <input
        type="text"
        placeholder="物語のタイトルを入力"
        className="w-full md:w-4/5 p-2 md:p-4 text-base md:text-xl border border-gray-300 rounded-md"
      />
      <div className="w-full md:w-4/5 mx-auto space-y-2 md:space-y-4 border border-gray-300 rounded-md p-3 md:p-5">
        <p className="font-medium text-sm md:text-lg">サムネイルを選択</p>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {thumbnails.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-square border rounded-md overflow-hidden bg-white"
            >
              <Image
                src={src}
                alt={`サムネイル ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button className="mt-4 py-4 px-12 font-bold text-base md:text-xl text-white bg-blue-500 rounded-md hover:bg-blue-600">
        保存
      </button>
    </div>
  );
};

export default ThumbnailDecision;
