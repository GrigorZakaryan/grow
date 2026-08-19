"use client";
import { TaskCard } from "@/app/(routes)/individual/[domainId]/components/tasks/task-card";
import { Task } from "@/lib/generated/prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export const HomeTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Now you are safely in the browser context
        const localTime = new Date().toISOString();
        console.log("Local Time client side", localTime);
        const res = await axios.get(
          `/home/api/tasks?localTime=${encodeURIComponent(localTime)}`,
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
  }, []);

  return (
    <div className="mt-10">
      <div>
        <h2 className="text-xl">Tasks</h2>
      </div>
      <div className="flex items-center gap-5 mt-3 w-full overflow-y-hidden overflow-x-auto">
        {tasks && tasks.map((task) => <TaskCard task={task} key={task.id} />)}
      </div>
    </div>
  );
};
