import { Domain } from "@/lib/generated/prisma/client";
import { AddTask } from "./add-task";
import db from "@/lib/db";
import { format } from "date-fns";
import { CalendarDays, RefreshCcw } from "lucide-react";

export const Tasks = async ({ domain }: { domain: Domain }) => {
  const tasks = await db.task.findMany({ where: { domainId: domain.id } });

  return (
    <div
      id="tasks"
      className="min-w-full h-full snap-center px-5 shrink-0 overflow-y-auto pb-24 relative"
    >
      <div>
        <h2 className="text-white font-semibold text-2xl py-3">Tasks</h2>
        <div className="flex flex-col items-center gap-5 mt-3">
          {tasks.map((task) => (
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
                      ? format(task.deadline, "EE dd MMM HH:mm")
                      : "Daily"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddTask domainId={domain.id} />
    </div>
  );
};
