"use client";

import {
  Check,
  ChevronRight,
  CircleCheck,
  CirclePlus,
  Clock,
  Flame,
  PlayCircle,
  StepForward,
} from "lucide-react";
import { TaskProps } from "./tasks";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity } from "@/lib/generated/prisma/client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Spinner } from "@/components/ui/spinner";
import { useTimer } from "@/components/modals/stores/use-timer-store";
import { useTaskForm } from "../../individual/[domainId]/stores/use-task-form";
import flame from "@/public/flame.png";
import axios from "axios";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const TaskCard = ({
  task,
  onTaskUpdate,
}: {
  task: TaskProps;
  onTaskUpdate: () => Promise<void>;
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { setTime, toggleOpen, setTaskId, setDomainId, taskId, time } =
    useTimer();
  const [loading, setLoading] = useState(false);
  const { setTask } = useTaskForm();

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

  const onAddProgress = async () => {
    try {
      setLoading(true);
      await axios.patch(`/individual/${task.domainId}/${task.id}/api`, {
        qty: 1,
      });
      await onTaskUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDismiss = async () => {
    try {
      setLoading(true);
      await axios.patch(`/individual/${task.domainId}/${task.id}/api`, {
        status: "DISMISSED",
      });
      await onTaskUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`/api/activity?days=7&taskId=${task.id}`)
      .then((res) => res.json())
      .then(setActivities);
  }, [task.id]);

  const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();

    date.setDate(date.getDate() - (6 - i));

    const dateString = format(date, "yyyy-MM-dd");

    const dayActivities = activities.filter((activity) => {
      return format(new Date(activity.date), "yyyy-MM-dd") === dateString;
    });

    const duration = dayActivities.reduce(
      (total, activity) => total + Number(activity.duration ?? 0),
      0,
    );

    const qty = dayActivities.reduce(
      (total, activity) => total + Number(activity.qty),
      0,
    );

    const checked = dayActivities.find((activity) => activity.checked === true);

    return {
      date: dateString,
      duration,
      checked: checked ? true : false,
      qty: qty,
      minutes: Math.round(duration / 1000 / 60),
    };
  });

  return (
    <div className="flex flex-col items-start bg-[#1e1e1e]/50 text-white rounded-3xl min-w-80 w-full max-w-100">
      <div className="px-5 py-3 w-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start">
            <h1 className="text-lg font-medium text-white text-nowrap">
              {task.label}
            </h1>

            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-white/80" />

              <p className="text-sm text-white/80">
                {task.startTime}-{task.endTime}
              </p>
            </div>
          </div>

          <ChevronRight className="opacity-70" />
        </div>

        {/* Chart */}
        <div className="w-full h-32 mt-6">
          {task.countType === "TIME" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lastSevenDays}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${task.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />

                    <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "E")}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 10, right: 10 }}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e1e",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                  }}
                  labelFormatter={(date: any) =>
                    format(new Date(date), "dd MMM")
                  }
                  formatter={(value) => [`${value} min`, "Duration"]}
                />

                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="white"
                  strokeWidth={2}
                  fill={`url(#gradient-${task.id})`}
                  dot={false}
                  activeDot={{
                    r: 4,
                    strokeWidth: 0,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {task.countType === "CHECKBOX" && (
            <div className="flex flex-col w-full h-full justify-between">
              <div className="flex items-center">
                <Image
                  width={200}
                  height={200}
                  className="w-16 h-16"
                  alt="flame"
                  src={flame.src}
                />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-white/60">STREAK</span>
                  <div>
                    <h1 className="font-bold text-lg">
                      X{" "}
                      <span className="text-sm font-normal text-white/60">
                        Days
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="grid grid-cols-7 gap-3 w-full">
                {lastSevenDays.map((day) => (
                  <div
                    key={day.date}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-7 h-7 ${day.checked ? "bg-linear-to-br from-orange-300 to-red-500" : "bg-white/20 shadow-inner shadow-black"} flex items-center justify-center rounded-full text-sm`}
                    >
                      {day.checked ? <Check className="w-4 h-4" /> : null}
                    </div>
                    <span className="text-xs text-white/60">
                      {format(day.date, "eee")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-6 w-full flex-1">
          {task.status === "UPCOMING" && (
            <div className="w-full flex-1 min-w-[50%]">
              {task.countType === "TIME" && (
                <Button
                  onClick={() => {
                    if (task.countType === "TIME" && task.finalTimeMS) {
                      setTime(task.finalTimeMS);
                      setTaskId(task.id);
                      setDomainId(task.domainId);
                      toggleOpen();
                    }
                  }}
                  className="w-full flex-1 rounded-full"
                  variant="default"
                  size="lg"
                >
                  <PlayCircle strokeWidth={1.5} className="w-5 h-5" /> Get
                  Started
                </Button>
              )}
              {task.countType === "CHECKBOX" && (
                <Button
                  disabled={loading}
                  onClick={async () => {
                    await onCheck();
                  }}
                  className="w-full flex-1 rounded-full"
                  variant="default"
                  size="lg"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className="flex items-center gap-2">
                      <CircleCheck strokeWidth={1.5} className="w-5 h-5" />
                      Complete
                    </div>
                  )}
                </Button>
              )}
              {task.countType === "QTY" && (
                <Button
                  disabled={loading}
                  onClick={async () => {
                    await onAddProgress();
                  }}
                  className={`w-full flex-1 rounded-full ${loading && "opacity-80"}`}
                  variant="default"
                  size="lg"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className="flex items-center gap-2">
                      <CirclePlus strokeWidth={1.5} className="w-5 h-5" /> Add
                      Progress
                    </div>
                  )}
                </Button>
              )}
            </div>
          )}
          {task.status === "IN_PROGRESS" && (
            <div className="w-full flex-1 items-center justify-center gap-2">
              {task.countType === "TIME" && (
                <Button
                  onClick={() => {
                    if (task.countType === "TIME" && task.finalTimeMS) {
                      setTime(task.finalTimeMS - (task.timeMS ?? 0));
                      setTaskId(task.id);
                      setDomainId(task.domainId);
                      toggleOpen();
                    }
                  }}
                  className="w-full flex-1 rounded-full"
                  variant="default"
                  size="lg"
                >
                  <StepForward strokeWidth={1.5} className="w-5 h-5" /> Resume
                </Button>
              )}
              {task.countType === "QTY" && (
                <Button
                  disabled={loading}
                  onClick={async () => {
                    await onAddProgress();
                  }}
                  className="w-full flex-1 rounded-full"
                  variant="default"
                  size="lg"
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className="flex items-center gap-2">
                      <CirclePlus strokeWidth={1.5} className="w-5 h-5" /> Add
                      Progress
                    </div>
                  )}
                </Button>
              )}
            </div>
          )}
          {task.status === "DONE" && (
            <div className="w-full flex-1 items-center justify-center gap-2 opacity-050">
              <Button
                disabled={true}
                className="w-full rounded-full"
                variant="default"
                size="lg"
              >
                Completed
              </Button>
            </div>
          )}

          <Button
            disabled={loading}
            onClick={() => onDismiss()}
            className="w-full flex-1 rounded-full"
            variant="outline"
            size="lg"
          >
            {loading ? <Spinner /> : "Dismiss"}
          </Button>
        </div>
      </div>
    </div>
  );
};
