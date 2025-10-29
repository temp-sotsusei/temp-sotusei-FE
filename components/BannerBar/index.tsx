"use client";
import type { FC } from "react";

type Props = {
  text: string;
  className?: string;
};

const BannerBar: FC<Props> = ({ text, className = "" }) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-20
                  bg-lime-200/90 border-b border-lime-300
                  text-center font-bold
                  text-base md:text-xl
                  py-3 md:py-4
                  ${className}`}
    >
      {text}
    </div>
  );
};

export default BannerBar;
