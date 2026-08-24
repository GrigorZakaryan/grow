"use client";

import { useEffect, useState } from "react";
import { generateDates } from "../utils/generateDates";
import { format } from "date-fns";
import { useSelectDay } from "../store/useSelectDay";

export const DaysRow = () => {
  const days = generateDates();

  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const { selectedDay, setSelectDay } = useSelectDay();

  useEffect(() => {
    setIsClient(true);

    const updateTime = () => {
      const now = new Date();

      setCurrentDate(now);
      setSelectDay(now.toLocaleDateString("en-CA"));
    };

    updateTime();

    const interval = setInterval(updateTime, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient || !currentDate) {
    return null;
  }

  const today = currentDate.toLocaleDateString("en-CA");

  return (
    <div className="grid grid-cols-7 gap-2 w-full pb-5">
      {days.map((day) => {
        const isToday = today === day;
        const isSelected = selectedDay === day;

        return (
          <div
            key={day}
            onClick={() => setSelectDay(day)}
            className={`w-full flex flex-col items-center justify-center py-3 rounded-lg duration-200 cursor-pointer ${
              isSelected
                ? "bg-white text-black"
                : isToday
                  ? "bg-accent text-white"
                  : ""
            }`}
          >
            <span className="text-xs font-medium opacity-50">
              {format(new Date(day), "iii")}
            </span>

            <span className="font-medium mt-1 opacity-70">
              {format(new Date(day), "dd")}
            </span>
          </div>
        );
      })}
    </div>
  );
};
