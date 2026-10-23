"use client";

import axios from "axios";
import { useEffect, useState } from "react";

type ActivityProps = {
  date: string;
  duration: number | null;
  checked: boolean | null;
  qty: number | null;
};

type TaskProps = {
  id: string;
  type: "ONE_TIME" | "REPEATING";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | null;
  countType: "TIME" | "QTY" | "CHECKBOX";
  finalTimeMS: number | null;
  finalQty: number | null;
  deadline: string | null;
  activity: ActivityProps[];
};

type DomainProps = {
  id: string;
  label: string;
  tasks: TaskProps[];
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getDomainProductivity(tasks: TaskProps[], now: number) {
  const weekStart = now - WEEK_MS;
  let plannedTasks = 0;
  let completedPercent = 0;

  for (const task of tasks) {
    // A one-time task contributes to this week's plan when its deadline falls
    // in the reporting window. Repeating goals are normalized to weekly targets.
    if (
      task.type === "ONE_TIME" &&
      (!task.deadline ||
        new Date(task.deadline).getTime() < weekStart ||
        new Date(task.deadline).getTime() > now)
    ) {
      continue;
    }

    const weeklyOccurrences =
      task.type === "ONE_TIME"
        ? 1
        : task.frequency === "DAILY"
          ? 7
          : task.frequency === "MONTHLY"
            ? 7 / 30
            : 1;
    const target =
      task.countType === "TIME"
        ? Number(task.finalTimeMS ?? 0)
        : task.countType === "QTY"
          ? Number(task.finalQty ?? 0)
          : 1;

    if (target <= 0) continue;

    const actual = task.activity.reduce((total, activity) => {
      const date = new Date(activity.date).getTime();
      if (date < weekStart || date > now) return total;

      if (task.countType === "TIME")
        return total + Number(activity.duration ?? 0);
      if (task.countType === "QTY") return total + Number(activity.qty ?? 0);
      return total + (activity.checked ? 1 : 0);
    }, 0);

    const targetForWeek = target * weeklyOccurrences;
    plannedTasks += weeklyOccurrences;
    completedPercent += Math.min(actual / targetForWeek, 1) * weeklyOccurrences;
  }

  return {
    percent: plannedTasks
      ? Math.round((completedPercent / plannedTasks) * 100)
      : 0,
    plannedTasks,
  };
}

export const DomainStats = () => {
  const [domains, setDomains] = useState<DomainProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    axios
      .get<DomainProps[]>("/api/domain")
      .then((res) => {
        if (active) setDomains(res.data);
      })
      .catch((err) => {
        if (active && axios.isAxiosError(err) && err.response?.status === 404) {
          setDomains([]);
        } else if (active) {
          setError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const now = Date.now();

  return (
    <div className="px-5">
      <section
        className="mt-8 mb-5 p-5 bg-white/5 rounded-2xl"
        aria-labelledby="domain-stats-title"
      >
        {loading ? (
          <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
        ) : error ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Domain statistics could not be loaded.
          </p>
        ) : domains.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Add a domain and planned tasks to see your productivity.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {domains.map((domain) => {
              const { percent, plannedTasks } = getDomainProductivity(
                domain.tasks,
                now,
              );

              return (
                <div key={domain.id} className="">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="truncate font-medium">{domain.label}</h3>
                    <span className="shrink-0 text-lg font-semibold tabular-nums">
                      {percent}%
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    aria-label={`${domain.label} productivity`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                  >
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/50">
                    {plannedTasks > 0
                      ? `Based on ${plannedTasks % 1 === 0 ? plannedTasks : plannedTasks.toFixed(1)} planned task${plannedTasks === 1 ? "" : "s"}`
                      : "No planned tasks this week"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
