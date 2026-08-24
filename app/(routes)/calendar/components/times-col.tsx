"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Task } from "@/lib/generated/prisma/client";
import { generateTime } from "../utils/generateDates";

export const TimesCol = ({ tasks }: { tasks: Task[] }) => {
  const times = generateTime();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentDate(new Date());
    };

    updateTime();

    const interval = setInterval(updateTime, 60_000);

    return () => clearInterval(interval);
  }, []);

  const combineDateTime = (day: string, time: string) => {
    const [year, month, date] = day.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    return new Date(year, month - 1, date, hours, minutes);
  };

  const tasksWithLayout = useMemo(() => {
    return tasks
      .map((task) => {
        if (!task.day || !task.startTime || !task.endTime) {
          return null;
        }

        const startDate = combineDateTime(task.day, task.startTime);
        const endDate = combineDateTime(task.day, task.endTime);

        // Duration in minutes
        const duration = (endDate.getTime() - startDate.getTime()) / 60_000;

        // Ignore invalid/negative durations
        if (duration <= 0) {
          return null;
        }

        return {
          ...task,
          startDate,
          endDate,
          hour: startDate.getHours(),

          // Position inside the hour
          top: (startDate.getMinutes() / 60) * 100,

          // Height relative to one hour
          height: (duration / 60) * 100,
        };
      })
      .filter((task): task is NonNullable<typeof task> => task !== null);
  }, [tasks]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll pb-40">
      {times.map((time, idx) => {
        const isCurrentHour =
          currentDate !== null && currentDate.getHours() === idx;

        const currentMinutePercent = currentDate
          ? (currentDate.getMinutes() / 60) * 100
          : 0;

        const hourTasks = tasksWithLayout.filter((task) => task.hour === idx);

        return (
          <div
            key={idx}
            className="flex h-25 min-h-25 w-full shrink-0 items-center"
          >
            {/* Time label */}
            <div className="flex h-full w-13 shrink-0 items-start justify-start pr-2">
              <span className="text-xs text-white/50">
                {format(new Date(time), "HH:mm")}
              </span>
            </div>

            {/* Hour */}
            <div
              className={`relative h-full w-full border-l ${
                idx === times.length - 1 ? "" : "border-b"
              }`}
            >
              {/* Tasks */}
              {hourTasks.map((task) => (
                <div
                  key={task.id}
                  className={`absolute z-5 w-full rounded-lg ${task.type === "REPEATING" ? "bg-blue-500" : "bg-pink-500"} px-2 overflow-hidden border border-black`}
                  style={{
                    top: `${task.top}%`,
                    height: `${task.height}%`,
                  }}
                >
                  <h6 className="text-xs font-medium">{task.label}</h6>
                </div>
              ))}

              {/* Current time line */}
              {isCurrentHour && (
                <div
                  className="absolute left-0 z-10 h-px w-full bg-red-500"
                  style={{
                    top: `${currentMinutePercent}%`,
                  }}
                >
                  <div className="absolute -left-1 top-1/2 z-10 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
