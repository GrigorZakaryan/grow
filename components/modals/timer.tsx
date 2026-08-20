"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { RadialProgress } from "../radial-progress";
import { useTimer } from "./stores/use-timer-store";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";

export const Timer = () => {
  const { open, time, taskId, domainId } = useTimer();

  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setProgress(0);
    startRef.current = null;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Set start time relative to current elapsed state
    startRef.current = Date.now() - elapsed;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const newElapsed = now - (startRef.current ?? now);

      if (newElapsed >= time) {
        setElapsed(time);
        setProgress(100);
        setIsRunning(false);
      } else {
        setElapsed(newElapsed);
        setProgress((newElapsed / time) * 100);
      }
    }, 10);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, time]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return { minutes, seconds };
  };

  const { minutes, seconds } = formatTime(elapsed);

  const toggleStop = () => {
    setIsRunning(!isRunning);
  };

  const onFinish = async () => {
    try {
      setLoading(true);
      await axios.patch(`/individual/${domainId}/${taskId}/api`, {
        time: elapsed,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setElapsed(0);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 w-full p-2 z-1000"
        >
          <div className="w-full h-full bg-black/80 shadow-inner backdrop-blur-md shadow-white/30 rounded-4xl border border-white/10 flex items-center justify-center text-white p-2">
            <div className="flex items-center justify-between w-full h-full">
              <div className="flex-1 flex flex-col items-start justify-between w-full h-full p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Timer</p>
                  <h1 className="text-[56px] font-mono tabular-nums">
                    {String(minutes).padStart(2, "0")}:
                    {String(seconds).padStart(2, "0")}
                  </h1>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={loading}
                    onClick={handleReset}
                    className="px-5 py-1 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      if (elapsed !== 0) {
                        setIsRunning(false);
                        onFinish();
                      } else {
                        setIsRunning(true);
                      }
                    }}
                    className={`${elapsed !== 0 ? "bg-red-500" : "bg-green-500"} px-5 py-1 rounded-lg text-sm font-bold`}
                  >
                    {elapsed !== 0 ? "Finish" : "Start"}
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center w-full h-full bg-white/10 rounded-3xl aspect-square p-2">
                <RadialProgress
                  w={140}
                  h={140}
                  percentage={progress}
                  isRunning={isRunning}
                  strokeWidth={12}
                  toggleStop={toggleStop}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
