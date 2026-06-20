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
    <header>
      <div>
        <h1 className={`text-2xl font-semibold ${SFSemibold.className}`}>
          Home
        </h1>
        <p className={`text-xs opacity-50 ${SFRegular}`}>
          {format(new Date(), "EEEE, dd  MMM")}
        </p>
      </div>
    </header>
  );
};
