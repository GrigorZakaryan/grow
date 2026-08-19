"use client";

import { Domain, Task } from "@/lib/generated/prisma/client";
import axios from "axios";
import { Check, ChevronLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const TaskControlForm = ({
  task,
  domain,
}: {
  task: Task;
  domain: Domain;
}) => {
  const [qty, setQty] = useState<number>(task.qty ?? 0);
  const [checked, setChecked] = useState<boolean | undefined>(undefined);
  const [elapsed, setElapsed] = useState(0); // ms

  const [isRunning, setIsRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startRef.current = Date.now() - elapsed;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const newElapsed = now - (startRef.current ?? now);

      // Check against limit
      if (task.finalTimeMS && newElapsed >= task.finalTimeMS) {
        setElapsed(task.finalTimeMS); // Snap to the limit
        setIsRunning(false); // Stop the timer
      } else {
        setElapsed(newElapsed);
      }
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, task.finalTimeMS]); // Include task.finalTimeMS in dependency array

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;

    return {
      minutes,
      seconds,
      milliseconds,
    };
  };

  const { minutes, seconds, milliseconds } = formatTime(elapsed);

  const onSubmit = async () => {
    try {
      await axios.patch(`/individual/${domain.id}/${task.id}/api`, {
        qty: qty === 0 ? undefined : qty,
        checked,
        time: elapsed,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setElapsed(0);
      setChecked(undefined);
      setQty(0);
    }
  };

  if (task.countType === "CHECKBOX")
    return (
      <div className="flex flex-col w-full h-full">
        <header className="flex-1">
          <div className="flex items-center justify-between w-full p-5">
            <Link href={`/individual/${domain.id}`}>
              <div className="rounded-full p-2 bg-gray-white/10 border border-white/20">
                <ChevronLeft />
              </div>
            </Link>
            <h1>{domain?.label}</h1>
            <div
              onClick={() => onSubmit()}
              className="rounded-full p-2 bg-gray-white/10 border border-white/20"
            >
              <Check />
            </div>
          </div>
        </header>
        <div className="w-full h-20 bg-muted rounded-2xl">
          <h2 className="text-white">Completed</h2>
        </div>
      </div>
    );

  if (task.countType === "QTY")
    return (
      <div className="flex flex-col w-full h-full">
        <header className="flex-1">
          <div className="flex items-center justify-between w-full p-5">
            <Link href={`/individual/${domain.id}`}>
              <div className="rounded-full p-2 bg-gray-white/10 border border-white/20">
                <ChevronLeft />
              </div>
            </Link>
            <h1>{domain?.label}</h1>
            <div
              onClick={() => onSubmit()}
              className="rounded-full p-2 bg-gray-white/10 border border-white/20"
            >
              <Check />
            </div>
          </div>
        </header>
        <div className="flex-1 w-full h-full">
          <div className="flex items-center justify-center gap-16">
            <div
              onClick={() => {
                if (qty > 0) {
                  setQty(qty - 1);
                }
              }}
              className="p-3 bg-muted rounded-full border border-white/20"
            >
              <Minus />
            </div>
            <div>
              <input
                onChange={(e) => setQty(Number(e.target.value))}
                type="number"
                value={qty ?? ""}
                className="max-w-25 text-4xl text-center focus:outline-none"
              />
            </div>
            <div
              onClick={() => {
                if (task.finalQty && qty < task.finalQty) {
                  setQty(qty + 1);
                }
              }}
              className="p-3 bg-muted rounded-full border border-white/20"
            >
              <Plus />
            </div>
          </div>
        </div>
      </div>
    );

  if (task.countType === "TIME")
    return (
      <div className="flex flex-col w-full h-full">
        <header className="flex-1">
          <div className="flex items-center justify-between w-full p-5">
            <Link href={`/individual/${domain.id}`}>
              <button className="rounded-full p-2 bg-gray-white/10 border border-white/20">
                <ChevronLeft />
              </button>
            </Link>
            <h1>{domain?.label}</h1>
            <button
              onClick={() => onSubmit()}
              className="rounded-full p-2 bg-gray-white/10 border border-white/20"
            >
              <Check />
            </button>
          </div>
        </header>
        <div className="flex justify-center w-full h-full px-6 mt-24">
          <div className="flex flex-col items-center w-full">
            <div className="text-7xl font-light text-center tabular-nums font-mono">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")},
              {String(milliseconds).padStart(3, "0")}
            </div>
            <div className="flex items-center justify-between w-full mt-12">
              <div
                onClick={() => {
                  setIsRunning(false);
                  setElapsed(0);
                }}
                className=" w-20 h-20 flex items-center justify-center bg-muted rounded-full border border-white/20"
              >
                Reset
              </div>

              <div
                onClick={() => setIsRunning(!isRunning)}
                className={`w-20 h-20 flex items-center justify-center rounded-full border ${isRunning ? "bg-red-800 text-red-200" : "bg-green-800 text-green-200"}`}
              >
                {isRunning ? "Stop" : " Start"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
