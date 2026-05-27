"use client";

import { format } from "date-fns";
import { Plus } from "lucide-react";
import localFont from "next/font/local";
import { useDomainForm } from "../stores/use-domain-form";

const SFSemibold = localFont({
  src: "../../../fonts/SF-Compact-Text-Semibold.otf",
});

const SFRegular = localFont({
  src: "../../../fonts/SF-Compact.ttf",
});

export const Header = () => {
  const { setOpen } = useDomainForm();
  return (
    <header className="text-white">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-semibold ${SFSemibold.className}`}>
            Domains
          </h1>
          <p className={`text-xs text-white/50 ${SFRegular}`}>
            {format(new Date(), "EEEE, dd  MMM")}
          </p>
        </div>
        <button
          onClick={() => setOpen()}
          className="flex items-center justify-center border border-white/10 rounded-full p-2 bg-white/20 active:bg-white/50 transition active:scale-150 duration-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
