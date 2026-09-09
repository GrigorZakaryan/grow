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
    <header className="pb-3 bg-trasnparent">
      <div>
        <h1 className={`text-xl font-medium ${SFSemibold.className}`}>
          {format(new Date(), "EEEE dd")}
        </h1>
        <p className={`text-md opacity-50  font-medium${SFRegular}`}>
          {format(new Date(), "MMMM")}
        </p>
      </div>
    </header>
  );
};
