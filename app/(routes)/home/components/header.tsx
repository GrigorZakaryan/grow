"use client";

import { format } from "date-fns";
import { Bell } from "lucide-react";
import localFont from "next/font/local";

const SFSemibold = localFont({
  src: "../../../fonts/SF-Compact-Text-Semibold.otf",
});

const SFRegular = localFont({
  src: "../../../fonts/SF-Compact.ttf",
});

export const Header = () => {
  return (
    <header className="flex items-center justify-between pb-3 bg-trasnparent px-5">
      <div>
        <h1 className={`text-xl font-medium ${SFSemibold.className}`}>
          {format(new Date(), "EEEE dd")}
        </h1>
        <p className={`text-md opacity-50  font-medium${SFRegular}`}>
          {format(new Date(), "MMMM")}
        </p>
      </div>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/5 border-b border-b-black/10 dark:border-b-white/10 border-l border-l-black/10 dark:border-l-white/10 border-t border-r border-t-black/10 dark:border-t-white/10 border-r-black/10 dark:border-r-white/10 backdrop-blur-2xl shadow-lg">
        <Bell className="w-5 h-5" />
      </div>
    </header>
  );
};
