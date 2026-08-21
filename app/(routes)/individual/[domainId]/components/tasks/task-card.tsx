"use client";
import { useTimer } from "@/components/modals/stores/use-timer-store";
import { RadialProgress } from "@/components/radial-progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Task } from "@/lib/generated/prisma/client";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarDays,
  Check,
  CircleCheck,
  CircleDashed,
  Loader,
  PlayCircle,
  Repeat,
  StepForward,
} from "lucide-react";
import { useState } from "react";

export const TaskCard = ({
  task,
  onTaskUpdate,
}: {
  task: Task;
  onTaskUpdate: () => Promise<void>;
}) => {
  // Use let variables or a helper function to set values
  let currentScore = 0;
  let finalScore = 1;
  const { setTime, toggleOpen, setTaskId, setDomainId, taskId, time } =
    useTimer();
  const [loading, setLoading] = useState(false);

  switch (task.countType) {
    case "CHECKBOX":
      currentScore = task.checked ? 1 : 0;
      finalScore = 1;
      break;
    case "QTY":
      currentScore = task.qty ?? 0;
      finalScore = task.finalQty ?? 1;
      break;
    case "TIME":
      currentScore = task.timeMS ?? 0;
      finalScore = task.finalTimeMS ?? 1;
      break;
  }

  const formatMStoString = (ms: number) => {
    // Add parentheses to ensure correct order of operations
    const minutes = Math.floor((ms ?? 0) / 60000);
    const seconds = Math.floor(((ms ?? 0) % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  const formatProgress = () => {
    if (task.countType === "TIME") {
      return `${formatMStoString(Math.max(0, (task.finalTimeMS ?? 0) - (task.timeMS ?? 0)))} left`;
    } else {
      return `${currentScore}/${finalScore}`;
    }
  };

  const onCheck = async () => {
    try {
      setLoading(true);
      await axios.patch(`/individual/${task.domainId}/${task.id}/api`, {
        checked: true,
      });
      await onTaskUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const percentage = finalScore > 0 ? (currentScore / finalScore) * 100 : 0;

  const progress = percentage;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference * (1 - progress / 100);

  return (
    <div
      className={`flex min-w-full rounded-2xl bg-muted dark:bg-gray-300/10 p-4 border border-white/10 ${task.status === "DONE" ? "opacity-70" : "shadow-inner shadow-white/10"}`}
    >
      <div className="flex flex-col items-center justify-between w-full">
        <div className="flex items-center justify-between w-full">
          <div className="w-full max-w-[60%] overflow-x-hidden">
            <div className="flex flex-col items-start gap-1 w-full">
              <h1 className="font-semibold">{task.label}</h1>
              <p className="text-xs text-black/60 dark:text-white/60 capitalize">
                {task.type === "ONE_TIME" ? "one-time" : "repeating"}
              </p>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center gap-2 h-full">
              <div className="flex items-center gap-2 text-black/60 dark:text-white/60">
                {task.deadline ? (
                  <CalendarDays className="w-3 h-3" />
                ) : (
                  <Repeat className="w-3 h-3" />
                )}
                <p className="text-xs capitalize">
                  {task.deadline
                    ? format(new Date(task.deadline), "EE dd MMM HH:mm")
                    : task.frequency?.toLocaleLowerCase()}
                </p>
              </div>
              <Separator orientation="vertical" />
              <div className="flex items-center gap-2 text-black/60 dark:text-white/60">
                <Loader className="w-3 h-3" />
                <span className="text-xs">{formatProgress()}</span>
              </div>
            </div>
          </div>
          <div className="max-w-[40%]">
            {task.countType !== "CHECKBOX" ? (
              <RadialProgress
                w={80}
                h={80}
                strokeWidth={5}
                percentage={progress}
                showPercentage
                toggleStop={() => {}}
              />
            ) : task.status === "UPCOMING" ? (
              <CircleDashed className="w-20 h-20 opacity-40" strokeWidth={1} />
            ) : (
              task.status === "DONE" && (
                <CircleCheck className="w-20 h-20" strokeWidth={1} />
              )
            )}
          </div>
        </div>
        {task.status === "UPCOMING" && (
          <div className="w-full">
            {task.countType !== "CHECKBOX" ? (
              <button
                onClick={() => {
                  if (task.countType === "TIME" && task.finalTimeMS) {
                    setTime(task.finalTimeMS);
                    setTaskId(task.id);
                    setDomainId(task.domainId);
                    toggleOpen();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10"
              >
                <PlayCircle strokeWidth={1.5} className="w-5 h-5" /> Get Started
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={async () => {
                  await onCheck();
                }}
                className={`flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10 ${loading && "opacity-80"}`}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="flex items-center gap-2">
                    <CircleCheck strokeWidth={1.5} className="w-5 h-5" /> Mark
                    Completed
                  </div>
                )}
              </button>
            )}
          </div>
        )}
        {task.status === "IN_PROGRESS" && (
          <div className="w-full">
            {task.countType !== "CHECKBOX" ? (
              <button
                onClick={() => {
                  if (task.countType === "TIME" && task.finalTimeMS) {
                    setTime(task.finalTimeMS - (task.timeMS ?? 0));
                    setTaskId(task.id);
                    setDomainId(task.domainId);
                    toggleOpen();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10"
              >
                <StepForward strokeWidth={1.5} className="w-5 h-5" /> Resume
              </button>
            ) : (
              <button className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10">
                <CircleCheck strokeWidth={1.5} className="w-5 h-5" /> Mark
                Completed
              </button>
            )}
          </div>
        )}
        {task.status === "DONE" && (
          <div className="w-full">
            <button className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10">
              <Check strokeWidth={1.5} className="w-5 h-5" /> Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
