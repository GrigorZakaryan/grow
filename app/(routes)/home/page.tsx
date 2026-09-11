"use client";

import { Header } from "./components/header";
import { QuickActions } from "./components/qucik-actions";
import { HomeTasks } from "./components/tasks";

export default function Home() {
  const hour = new Date().getHours();

  let daytime: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT";

  if (hour >= 5 && hour < 12) {
    daytime = "MORNING";
  } else if (hour >= 12 && hour < 17) {
    daytime = "AFTERNOON";
  } else if (hour >= 17 && hour < 21) {
    daytime = "EVENING";
  } else {
    daytime = "NIGHT";
  }

  const greeting = {
    MORNING: "Morning",
    AFTERNOON: "Afternoon",
    EVENING: "Evening",
    NIGHT: "Night",
  }[daytime];

  const background = {
    MORNING: "bg-linear-to-b from-[#17222B] via-black to-black",
    AFTERNOON: "bg-linear-to-b from-[#19251F] via-black to-black",
    EVENING: "bg-linear-to-b from-[#281C20] via-black to-black",
    NIGHT: "bg-linear-to-b from-[#121522] via-black to-black",
  }[daytime];

  return (
    <div className={`w-full h-full py-2 ${background}`}>
      <div className="w-full h-full overflow-y-scroll pb-40 ">
        <Header />
        <h1 className="text-3xl font-semibold ml-5 mt-5">
          Good {greeting}, <br />
          Grigor Zakaryan!
        </h1>

        <div className="flex items-center w-full mt-10">
          <QuickActions />
        </div>
        <HomeTasks />
      </div>
    </div>
  );
}
