import { ChevronRight } from "lucide-react";
import { Header } from "./components/header";
import db from "@/lib/db";
import Link from "next/link";

export default async function Domains() {
  const domains = await db.domain.findMany({});
  return (
    <div className="w-full h-dvh px-5 py-2 overflow-hidden">
      <Header />
      <div className="grid grid-cols-2 gap-3 mt-5 pb-26">
        {domains.map((domain) => (
          <Link
            href={`/individual/${domain.id}`}
            key={domain.id}
            className="relative w-full rounded-2xl bg-[#1e1e1e] h-40 px-4 py-3 active:bg-white/20 hover:scale-105 active:scale-105 duration-400"
          >
            <div className="relative w-full flex items-center justify-between">
              <h1 className="flex max-w-[80%] text-white text-lg overflow-x-hidden">
                {domain.label}
              </h1>
              <div className="border border-white/10 rounded-full bg-white/10 p-0.5">
                <ChevronRight className="w-3 h-3 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
