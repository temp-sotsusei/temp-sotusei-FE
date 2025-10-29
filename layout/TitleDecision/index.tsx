"use client";

import type { FC } from "react";
import Image from "next/image";
import BannerBar from "@/components/BannerBar";

const BACKGROUND_URL = "/images/background.jpg";

type Props = {
  thumbnails: string[];
};

const TitleDecision: FC<Props> = ({ thumbnails }) => {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden px-4 md:px-10 py-8 md:py-10 flex flex-col items-center space-y-8 md:space-y-9"
      style={{
        backgroundImage: `url(${BACKGROUND_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <BannerBar text="タイトルをきめよう" />
      {/* ▼ バナー下の間隔を少し狭める */}
      <div className="h-3 md:h-4 pt-[env(safe-area-inset-top)]" />

<div className="w-full md:w-4/5">
  <label
    htmlFor="story-title"
    className="block mb-2 font-semibold text-base md:text-lg"
  >
    タイトル
  </label>
          <input
          id="story-title"
          type="text"
          placeholder="タイトルをいれよう"
          className="w-full p-3 md:p-4 text-base md:text-xl border border-gray-300 rounded-md bg-white/90"
        />
      </div>

      <div className="w-full md:w-4/5 mx-auto space-y-2 md:space-y-4 border border-gray-300 rounded-md p-3 md:p-5 bg-white/80">
        <p className="font-medium text-sm md:text-lg">サムネイルをえらぼう！</p>

        {/* 3×3 固定表示 + 縦スクロール、比率は 3:4 */}
        <div className="h-[520px] md:h-[820px] overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {thumbnails.map((src, index) => (
              <div
                key={index}
                className="relative border rounded-md overflow-hidden bg-white aspect-[3/4]"
              >
                <Image
                  src={src}
                  alt={`サムネイル ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 py-4 px-12 font-bold text-base md:text-xl text-white
                   bg-[#93C400] hover:bg-[#82B000] rounded-md"
      >
        けってい
      </button>
    </div>
  );
};

export default TitleDecision;
