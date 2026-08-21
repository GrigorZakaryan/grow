import db from "@/lib/db";
import { Header } from "./components/header";
import { HomeTasks } from "./components/tasks";
import { HomeDomains } from "./components/domains";

import friend from "@/public/friend.png";
import Image from "next/image";

export default async function Home() {
  const domains = await db.domain.findMany({
    include: { tasks: true, relfections: true },
  });
  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="w-full h-full overflow-y-scroll pb-40">
        <div className="relative w-full rounded-2xl h-50 bg-linear-to-br from-blue-800 to-blue-500 shadow-inner shadow-blue-400 mt-5 overflow-hidden p-5">
          <div className="flex flex-col justify-between w-full max-w-[70%] h-full">
            <div>
              <h1 className="font-semibold text-2xl">Good Morning!</h1>
              <p className="text-sm mt-1 opacity-80">
                Complete the tasks to keep your streak.
              </p>
            </div>
            <div className="flex flex-col justify-end h-full w-full pb-2">
              <div className="flex justify-start items-center gap-3 w-full">
                <div className="flex items-center justify-center text-xs font-bold bg-linear-to-b from-yellow-500 to-yellow-600 text-white rounded-full w-8 h-8 p-2">
                  M
                </div>
                <div className="flex items-center justify-center text-xs font-bold bg-linear-to-b from-yellow-500 to-yellow-600 text-white rounded-full w-8 h-8 p-2">
                  T
                </div>
                <div className="flex items-center justify-center text-xs font-bold bg-linear-to-b from-yellow-500 to-yellow-600 text-white rounded-full w-8 h-8 p-2">
                  W
                </div>
                <div className="flex items-center justify-center text-xs font-bold bg-linear-to-b from-yellow-500 to-yellow-600 text-white rounded-full w-8 h-8 p-2">
                  T
                </div>
                <div className="flex items-center justify-center text-xs font-bold border-3 border-white/70 text-white rounded-full w-8 h-8 p-2">
                  F
                </div>
              </div>
            </div>
          </div>
          <Image
            className="absolute -right-5 -bottom-15"
            width={130}
            height={130}
            alt="friend"
            src={friend.src}
          />
        </div>
        <HomeDomains domains={domains} />
        <HomeTasks />
      </div>
    </div>
  );
}
