"use client";
import type { FC, ReactNode } from "react";
import Link from "next/link";

type Props = {
  href?: string;
  className?: string;
  children?: ReactNode; // ボタン文言（指定しなければ既定文言）
};

const HomeBackButton: FC<Props> = ({
  href = "/main",
  className = "",
  children = "ほーむにもどる",
}) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center
                  rounded-full border border-white/80
                  px-4 md:px-5 py-2 md:py-2.5
                  text-white font-bold text-xs md:text-sm shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-white/60
                  ${className}`}
      style={{ backgroundColor: "#FF8258" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E6724C")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FF8258")
      }
    >
      {children}
    </Link>
  );
};

export default HomeBackButton;
