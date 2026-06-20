"use client";
import { Domain } from "@/lib/generated/prisma/client";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";

export const DomainHeader = ({ domain }: { domain: Domain }) => {
  return (
    <header className="w-full py-3 px-5">
      <div className="flex items-center justify-between w-full">
        <Link href={"/domains"}>
          <div className="p-2 bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </div>
        </Link>
        <h1 className="font-semibold capitalize">{domain.label}</h1>
        <div className="p-2 bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20 rounded-full">
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
};
