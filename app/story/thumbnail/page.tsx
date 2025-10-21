"use client";

import type { FC } from "react";
import ThumbnailDecision from "@/layout/ThumbnailDecision";

const Page: FC = () => {
  const thumbnails = Array.from({ length: 12 }).map(
    (_, index) =>
      `https://placehold.jp/ffffff/000000/300x300.png?text=${index + 1}`
  );
  return <ThumbnailDecision thumbnails={thumbnails} />;
};

export default Page;
