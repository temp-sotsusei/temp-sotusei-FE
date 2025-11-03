"use client";
import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const FooterCtaBar: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className="w-full bg-lime-300 border-t border-lime-400 pb-[env(safe-area-inset-bottom)]">
      <div
        className={`mx-auto max-w-[1200px] px-4 md:px-6 py-4 md:py-5 flex flex-col items-center gap-2 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default FooterCtaBar;
