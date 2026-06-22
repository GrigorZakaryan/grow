"use client";
import { RadialProgress } from "@/components/radial-progress";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import {
  CalendarDays,
  Loader,
  PlayCircle,
  Repeat,
  StepForward,
} from "lucide-react";
import Link from "next/link";

export const TaskCard = ({ task }: { task: Task }) => {
  // Use let variables or a helper function to set values
  let currentScore = 0;
  let finalScore = 1;

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

  const percentage = finalScore > 0 ? (currentScore / finalScore) * 100 : 0;

  const progress = percentage;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference * (1 - progress / 100);

  return (
    <div className="w-full rounded-2xl bg-muted dark:bg-[#1e1e1e] p-4 shadow-inner shadow-white/20">
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
            <RadialProgress
              w={80}
              h={80}
              strokeWidth={5}
              percentage={progress}
            />
          </div>
        </div>
        {task.status === "UPCOMING" && (
          <Link
            className="w-full"
            href={`/individual/${task.domainId}/${task.id}`}
          >
            <button className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-white dark:text-black font-semibold text-sm py-3 mt-10">
              <PlayCircle strokeWidth={1.5} className="w-5 h-5" /> Get Started
            </button>
          </Link>
        )}
        {task.status === "IN_PROGRESS" && (
          <Link
            className="w-full"
            href={`/individual/${task.domainId}/${task.id}`}
          >
            <button className="flex items-center justify-center gap-2 w-full rounded-full dark:bg-yellow-600 dark:text-white border border-yellow-200/20 font-semibold text-sm py-3 mt-10">
              <StepForward strokeWidth={1.5} className="w-5 h-5" /> Resume
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
