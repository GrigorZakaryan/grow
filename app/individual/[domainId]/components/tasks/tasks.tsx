import { Domain } from "@/lib/generated/prisma/client";
import { AddTask } from "./add-task";
import db from "@/lib/db";
import { TaskCard } from "./task-card";

export const Tasks = async ({ domain }: { domain: Domain }) => {
  const tasks = await db.task.findMany({ where: { domainId: domain.id } });

  return (
    <div
      id="tasks"
      className="min-w-full h-full snap-center px-5 shrink-0 relative"
    >
      <div className="h-full">
        <h2 className="text-white font-semibold text-2xl py-3">Tasks</h2>
        <div className="flex-1 flex flex-col items-center gap-5 mt-3 h-full pb-32 overflow-y-scroll">
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
      </div>
      <AddTask domainId={domain.id} />
    </div>
  );
};
