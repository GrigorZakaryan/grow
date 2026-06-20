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
      <div className="flex flex-col items-start w-full h-full">
        <h2 className="font-semibold text-2xl py-3">Tasks</h2>
        <div className="flex flex-col items-center gap-5 mt-3 w-full h-full overflow-y-auto pb-5 rounded-t-2xl">
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
      </div>
      <AddTask domainId={domain.id} />
    </div>
  );
};
