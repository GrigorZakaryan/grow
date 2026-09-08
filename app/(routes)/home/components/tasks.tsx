"use client";
import { TaskCard } from "@/app/(routes)/individual/[domainId]/components/tasks/task-card";
import {
  Domain,
  TaskCountType,
  TaskFrequency,
  TaskStatus,
  TaskType,
} from "@/lib/generated/prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export type TaskProps = {
  id: string;
  label: string;
  description: string | null;
  type: TaskType;
  deadline: Date | null;
  frequency: TaskFrequency | null;
  status: TaskStatus;
  priority: number;
  countType: TaskCountType;
  qty: number | null;
  finalQty: number | null;
  timeMS: number | null;
  finalTimeMS: number | null;
  checked: boolean | null;
  domainId: string;
  day: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastResetAt: Date | null;
  domain: Domain;
};

export const HomeTasks = () => {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const res = await axios.get(
        `/home/api/tasks?timeZone=${encodeURIComponent(timeZone)}`,
      );

      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl">Tasks</h2>
        <div>
          <p className="text-sm opacity-70">{tasks.length} Remaining</p>
        </div>
      </div>
      <div className="flex items-center gap-5 mt-4 w-full overflow-y-hidden overflow-x-auto">
        {tasks &&
          tasks.map((task) => (
            <TaskCard onTaskUpdate={fetchTasks} task={task} key={task.id} />
          ))}
        {loading && (
          <div className="flex min-w-full rounded-2xl bg-muted min-h-50"></div>
        )}
      </div>
    </div>
  );
};
