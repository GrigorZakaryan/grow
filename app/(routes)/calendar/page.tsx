"use client";
import { useEffect, useState } from "react";
import { generateDates, generateTime } from "./utils/generateDates";
import { Header } from "./components/header";
import { format } from "date-fns";

export default function CalendarPage() {
  const days = generateDates();
  const times = generateTime();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="flex flex-col items-center w-full h-full mt-5">
        <div className="grid grid-cols-7 gap-2 w-full">
          {isClient &&
            days.map((d, idx) => (
              <div
                key={idx}
                className="w-full flex flex-col items-center justify-center py-3 rounded-lg"
              >
                <span className="text-xs font-medium text-white/50">
                  {format(new Date(d), "iii")}
                </span>
                <span className="font-medium mt-1 text-white/70">
                  {format(new Date(d), "dd")}
                </span>
              </div>
            ))}
        </div>
        <div className="flex flex-col w-full h-full overflow-y-scroll pb-40">
          {times.map((t, idx) => (
            <div key={idx} className="flex items-center min-h-25">
              <div className="flex items-center justify-start pr-2 w-13 h-full">
                <span className="text-xs text-white/50">
                  {format(new Date(t), "HH:mm")}
                </span>
              </div>
              <div
                className={`w-full h-full ${idx === 23 ? null : "border-b"} border-l`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
