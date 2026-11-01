"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Trash, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Task } from "@/lib/generated/prisma/client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useActivity } from "@/app/(routes)/individual/[domainId]/stores/use-activity-store";

type ActivityFormValues = {
  date: string;
  duration: number;
  taskId: string;
};

const toLocalDatetime = (date: string | Date) => {
  const d = new Date(date);

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const ActivityForm = ({ tasks }: { tasks: Task[] }) => {
  const { openActivity, setClose, activity, setActivity } = useActivity();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<ActivityFormValues>({
    defaultValues: {
      date: toLocalDatetime(new Date()),
      duration: 0,
      taskId: "",
    },
  });

  useEffect(() => {
    if (activity) {
      reset({
        taskId: activity.taskId ?? "",
        duration: Number(activity.duration ?? 0) / 60_000,
        date: toLocalDatetime(activity.date),
      });
    }
  }, [activity, reset]);

  const onSubmit = async (values: ActivityFormValues) => {
    try {
      const payload = {
        date: new Date(values.date).toISOString(),
        duration: values.duration,
        taskId: values.taskId,
      };

      if (activity?.id) {
        await axios.patch(`/api/activity/${activity.id}`, payload);
      } else {
        await axios.post(`/api/activity`, payload);
      }

      reset();
      setActivity(null);
      setClose();
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/activity/${activity?.id}`);

      setActivity(null);
      setClose();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-dvh">
      <AnimatePresence>
        {openActivity && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 w-full h-full bg-[#1e1e1e] z-99 rounded-t-4xl overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5">
              <button
                type="button"
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
                onClick={() => {
                  reset();
                  setActivity(null);
                  setClose();
                }}
              >
                <X className="text-white" />
              </button>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
              >
                <Check className="text-white" />
              </button>
            </div>

            <div className="flex justify-center px-5 py-5 h-full">
              <div className="flex flex-col items-start w-full pb-30">
                <div className="rounded-4xl bg-[#313131] w-full mt-6 p-5">
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="activity-task"
                    >
                      Task
                    </label>

                    <select
                      id="activity-task"
                      {...register("taskId")}
                      className="text-right focus:outline-none bg-transparent text-white"
                    >
                      {tasks.map((task) => (
                        <option
                          key={task.id}
                          className="text-black"
                          value={task.id}
                        >
                          {task.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="activity-date"
                    >
                      Start Date
                    </label>

                    <input
                      {...register("date")}
                      className="text-right text-white focus:outline-none"
                      id="activity-date"
                      type="datetime-local"
                    />
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="activity-duration"
                    >
                      Duration
                    </label>

                    <input
                      {...register("duration", {
                        valueAsNumber: true,
                      })}
                      className="text-right text-white focus:outline-none"
                      id="activity-duration"
                      type="number"
                      placeholder="45 (in min)"
                    />
                  </div>
                </div>

                {activity?.id && (
                  <div className="w-full mt-6 pb-6">
                    <Button
                      type="button"
                      disabled={loading}
                      onClick={onDelete}
                      size="lg"
                      className="w-full"
                      variant="destructive"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Trash />
                          Delete Activity
                        </div>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
