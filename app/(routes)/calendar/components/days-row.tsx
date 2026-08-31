"use client";

import { useEffect, useRef, useState } from "react";
import { generateDates } from "../utils/generateDates";
import { format } from "date-fns";
import { useSelectDay } from "../store/useSelectDay";

export const DaysRow = () => {
  const days = generateDates();

  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const { selectedDay, setSelectDay } = useSelectDay();

  const todayRef = useRef<HTMLDivElement>(null);

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
  }, [setSelectDay]);

  useEffect(() => {
    if (!isClient || !currentDate) return;

    // Wait until the days have rendered
    requestAnimationFrame(() => {
      todayRef.current?.scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "nearest",
      });
    });
  }, [isClient, currentDate]);

  if (!isClient || !currentDate) {
    return null;
  }

  const today = currentDate.toLocaleDateString("en-CA");

  return (
    <div className="w-full overflow-x-auto min-h-16 snap-x snap-mandatory">
      <div className="flex w-max items-center gap-1.5">
        {days.map((day) => {
          const isToday = today === day;
          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              ref={isToday ? todayRef : null}
              onClick={() => setSelectDay(day)}
              className={`w-14 shrink-0 snap-center flex flex-col items-center justify-center py-2 rounded-lg duration-200 cursor-pointer ${
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
    </div>
  );
};
