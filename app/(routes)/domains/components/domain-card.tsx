"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Domain, Relfection, Task } from "@/lib/generated/prisma/client";

interface DomainProps {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  relfections: Relfection[];
}

export const DomainCard = ({ domain }: { domain: DomainProps }) => {
  return (
    <Link href={`/individual/${domain.id}`} key={domain.id}>
      <motion.div
        whileTap={{ scale: 1.1 }}
        className="relative w-full rounded-2xl h-33 px-4 py-3 active:bg-white/20 duration-400"
      >
        <div className="w-[40%] h-full bg-[#c5305a] absolute left-0 top-0 rounded-2xl"></div>
        <div className="w-full h-[93%] bg-[#c5305a] absolute right-0 bottom-0 rounded-2xl"></div>
        <div className="w-full h-[50%] bg-[#c9184a] absolute bottom-0 left-0 rounded-b-2xl p-2 z-20">
          <div className="flex flex-col items-start">
            <h1 className="text-md font-semibold">{domain.label}</h1>
            <p className="text-sm text-white/90">{domain.tasks.length}</p>
          </div>
        </div>
        <div className="w-full">
          {domain.tasks.length > 0 && (
            <div className="w-18.75 h-20 bg-gray-100 rounded-2xl absolute z-0 -rotate-3 bottom-5 shadow p-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
              </div>
            </div>
          )}
          {domain.tasks.length > 1 && (
            <div className="w-18.75 h-20 bg-gray-100 rounded-2xl absolute z-0 rotate-3 bottom-3 shadow right-12 p-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
              </div>
            </div>
          )}
          {domain.tasks.length > 2 && (
            <div className="w-18.75 h-20 bg-gray-100 rounded-2xl absolute z-0 rotate-2 bottom-5 shadow right-2 p-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
                <div className="w-full h-1 rounded-full bg-gray-300" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
