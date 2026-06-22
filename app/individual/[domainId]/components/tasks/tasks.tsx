"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Domain, Task } from "@/lib/generated/prisma/client";
import { AddTask } from "./add-task";
import { TaskCard } from "./task-card";

export const Tasks = ({ domain }: { domain: Domain }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Now you are safely in the browser context
        const localTime = new Date().toISOString();
        console.log("Local Time client side", localTime);
        const res = await axios.get(
          `/individual/${domain.id}/api/tasks?localTime=${encodeURIComponent(localTime)}`,
        );
        setTasks(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        // Handle redirect or error state here
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [domain.id]);

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div
      id="tasks"
      className="min-w-full h-full snap-center px-5 shrink-0 relative"
    >
      <div className="flex flex-col items-start w-full h-full">
        <h2 className="font-semibold text-2xl py-3">Tasks</h2>
        <div className="flex flex-col items-center gap-5 mt-3 w-full h-full overflow-y-auto pb-5">
          {tasks && tasks.map((task) => <TaskCard task={task} key={task.id} />)}
        </div>
      </div>
      <AddTask domainId={domain.id} />
    </div>
  );
};
