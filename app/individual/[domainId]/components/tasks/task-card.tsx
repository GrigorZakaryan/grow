"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import { CalendarDays, RefreshCcw } from "lucide-react";

export const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div
      className="w-full rounded-2xl bg-[#1e1e1e] text-white p-4"
      key={task.id}
    >
      <div className="flex flex-col items-center justify-between w-full">
        <div className="flex flex-col items-start gap-1 w-full">
          <h1 className="font-semibold">{task.label}</h1>
          <p className="text-xs text-white/60 capitalize">
            {task.type === "ONE_TIME" ? "one-time" : "repeating"}
          </p>
        </div>
        <Field className="w-full max-w-sm my-6">
          <FieldLabel htmlFor="progress-upload">
            <span className="text-xs text-white/60">
              Progress {`(${task.currentScore}/${task.finalScore})`}
            </span>
            <span className="text-xs text-white/60 ml-auto">
              {(
                (Number(task.currentScore ? task.currentScore : 0) /
                  Number(task.finalScore ? task.finalScore : 0)) *
                100
              ).toFixed(2)}
              %
            </span>
          </FieldLabel>
          <Progress
            value={
              (Number(task.currentScore ?? 0) / Number(task.finalScore ?? 0)) *
              100
            }
            id="progress-upload"
          />
        </Field>
        <div className="flex items-center gap-2 text-white/60 w-full justify-end">
          {task.deadline ? (
            <CalendarDays className="w-3 h-3" />
          ) : (
            <RefreshCcw className="w-3 h-3" />
          )}
          <p className="text-xs capitlize">
            {task.deadline
              ? format(new Date(task.deadline), "EE dd MMM HH:mm")
              : task.frequency}
          </p>
        </div>
      </div>
    </div>
  );
};
