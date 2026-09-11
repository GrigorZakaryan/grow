"use client";

import { ChevronRight, Clock } from "lucide-react";
import { TaskProps } from "./tasks";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity } from "@/lib/generated/prisma/client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export const TaskCard = ({
  task,
  onTaskUpdate,
}: {
  task: TaskProps;
  onTaskUpdate: () => Promise<void>;
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);

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

    return {
      date: dateString,
      duration,
      minutes: Math.round(duration / 1000 / 60),
    };
  });

  return (
    <div className="flex flex-col items-start bg-[#1e1e1e] text-white h-full rounded-3xl border min-w-80">
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
                  <stop offset="0%" stopOpacity={0.4} />

                  <stop offset="100%" stopOpacity={0} />
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
                labelFormatter={(date: any) => format(new Date(date), "dd MMM")}
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
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mt-6 w-full">
          <Button
            className="w-full flex-1 rounded-full"
            variant="default"
            size="lg"
          >
            Complete
          </Button>

          <Button
            className="w-full flex-1 rounded-full"
            variant="outline"
            size="lg"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
