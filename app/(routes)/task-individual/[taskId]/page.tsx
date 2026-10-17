"use client";
import { Check, ChevronLeft, Pen, X } from "lucide-react";
import { format } from "date-fns";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import flame from "@/public/flame.png";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Activity, Task } from "@/lib/generated/prisma/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatMinutes } from "@/utils/time-converter";
import { useTaskForm } from "../../individual/[domainId]/stores/use-task-form";

export default function TaskIndividual({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [task, setTaskState] = useState<Task>();
  const { taskId } = useParams<{ taskId: string }>();
  const { setTask } = useTaskForm();

  useEffect(() => {
    fetch(`/api/activity?days=7&taskId=${taskId}`)
      .then((res) => res.json())
      .then(setActivities);
    fetch(`/api/task/${taskId}`)
      .then((res) => res.json())
      .then(setTaskState);
  }, [taskId]);

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
    <div className="w-full h-full">
      <div className="p-5">
        <div className="relative w-full flex items-center justify-between">
          <Link href={"/"}>
            <button
              type="button"
              className="p-3 rounded-full border border-white/10 active:bg-white/50 transition active:scale-150 duration-200"
            >
              <ChevronLeft className="text-white w-5 h-5" />
            </button>
          </Link>
          <h1 className="absolute left-[50%] translate-x-[-50%] text-xl font-medium">
            {task?.label}
          </h1>
          <button
            onClick={() => setTask(task ?? null)}
            type="button"
            className="flex items-center gap-2 p-3 px-4 text-sm font-medium rounded-full border border-white/10 active:bg-white/50 transition active:scale-150 duration-200"
          >
            <Pen className="text-white w-4 h-4" /> Edit
          </button>
        </div>
        <div className="w-full h-40 mt-6">
          <div>
            <h2 className="opacity-60 font-medium text-sm">
              {task?.countType !== "CHECKBOX" && "Productivity"}
            </h2>
            <h3 className="text-3xl font-semibold mt-1">
              {task?.countType === "TIME" &&
                formatMinutes(
                  lastSevenDays.reduce((acc, curr) => acc + curr.minutes, 0),
                )}
              {task?.countType === "QTY" &&
                lastSevenDays.reduce((acc, curr) => acc + curr.qty, 0)}
            </h3>
          </div>
          {task?.countType === "QTY" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={lastSevenDays.map((day) => ({
                  date: day.date,
                  qty: day.qty,
                }))}
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
                  padding={{ left: 10 }}
                  tickMargin={16}
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
                  formatter={(value) => [`${value}`, "Quantity"]}
                />

                <Area
                  type="monotone"
                  dataKey="qty"
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
          {task?.countType === "TIME" && (
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
                  padding={{ left: 10 }}
                  tickMargin={16}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000000",
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
          {task?.countType === "CHECKBOX" && (
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
                      {task.streakDays}{" "}
                      <span className="text-sm font-normal text-white/60">
                        Days
                      </span>
                    </h1>
                  </div>
                </div>
              </div>

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
      </div>
    </div>
  );
}
