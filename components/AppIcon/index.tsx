"use client";
import type { FC } from "react";
import Image from "next/image";

type Props = {
  src?: string;   // 既定: /images/icon.png (public配下)
  alt?: string;   // 既定: ことばのタネ
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

const AppIcon: FC<Props> = ({
  src = "/images/icon.png",
  alt = "ことばのタネ",
  width = 420,     // 大きめ既定
  height = 190,
  className = "",
  priority,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`object-contain select-none ${className}`}
      priority={priority}
    />
  );
};

export default AppIcon;
