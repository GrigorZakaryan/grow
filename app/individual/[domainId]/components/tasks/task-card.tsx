"use client";
import { Task } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import { CalendarDays, RefreshCcw } from "lucide-react";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      className="w-full rounded-2xl bg-[#1e1e1e] text-white p-4"
      key={task.id}
    >
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col items-start gap-1 pb-10">
          <h1 className="font-semibold">{task.label}</h1>
          <p className="text-xs text-white/60 capitalize">
            {task.type === "ONE_TIME" ? "one-time" : "repeating"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/60">
          {task.deadline ? (
            <CalendarDays className="w-3 h-3" />
          ) : (
            <RefreshCcw className="w-3 h-3" />
          )}
          <p className="text-xs">
            {task.deadline
              ? format(new Date(task.deadline), "EE dd MMM HH:mm")
              : "Daily"}
          </p>
        </div>
      </div>
    </div>
  );
};
