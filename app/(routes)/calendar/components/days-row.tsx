"use client";

import { useEffect, useState } from "react";
import { generateDates } from "../utils/generateDates";
import { format } from "date-fns";

export const DaysRow = () => {
  const days = generateDates();
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  useEffect(() => {
    setIsClient(true);
    const updateTime = () => {
      setCurrentDate(new Date());
    };

    updateTime();

    const interval = setInterval(updateTime, 60_000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="grid grid-cols-7 gap-2 w-full pb-5">
      {isClient &&
        days.map((d, idx) => (
          <div
            key={idx}
            className={`w-full flex flex-col items-center justify-center py-3 rounded-lg ${currentDate && currentDate.toLocaleDateString("en-CA") === d && "bg-white text-black"}`}
          >
            <span className="text-xs font-medium opacity-50">
              {format(new Date(d), "iii")}
            </span>
            <span className="font-medium mt-1 opacity-70">
              {format(new Date(d), "dd")}
            </span>
          </div>
        ))}
    </div>
  );
};
