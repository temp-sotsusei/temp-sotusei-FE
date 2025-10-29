"use client";

import type { FC } from "react";
import TitleDecision from "@/layout/TitleDecision";

const Page: FC = () => {
  // ここで props を準備（API 連携時は置き換え）
  const thumbnails = Array.from({ length: 12 }).map(
    (_, index) =>
      `https://placehold.jp/dedede/ffffff/300x400.png?text=${index + 1}`
  );

  return <TitleDecision thumbnails={thumbnails} />;
};

export default Page;
