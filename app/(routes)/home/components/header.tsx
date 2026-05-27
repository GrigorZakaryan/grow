"use client";

import { format } from "date-fns";
import localFont from "next/font/local";

const SFSemibold = localFont({
  src: "../../../fonts/SF-Compact-Text-Semibold.otf",
});

const SFRegular = localFont({
  src: "../../../fonts/SF-Compact.ttf",
});

export const Header = () => {
  return (
    <header className="text-white">
      <div>
        <h1 className={`text-2xl font-semibold ${SFSemibold.className}`}>
          Home
        </h1>
        <p className={`text-xs text-white/50 ${SFRegular}`}>
          {format(new Date(), "EEEE, dd  MMM")}
        </p>
      </div>
    </header>
  );
};
