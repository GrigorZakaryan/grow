"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTaskForm } from "../../stores/use-task-form";
import { inter } from "../reflections/reflections-form";
import { Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export const TasksForm = ({ domainId }: { domainId: string }) => {
  const {
    open,
    setClose,
    setLabel,
    setType,
    setDeadline,
    setFrequency,
    setCountType,
    setFinalScore,
    reset,
    deadline,
    type,
    frequency,
    countType,
    finalScore,
    label,
  } = useTaskForm();

  const onSubmit = async () => {
    try {
      await axios.post(`/individual/${domainId}/api/tasks`, {
        type,
        deadline,
        label,
        frequency,
        countType,
        finalScore,
      });
      reset();
      setClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-h-dvh overflow-y-auto">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ y: "100%" }}
            className={`${inter.className} fixed ${open ? "bottom-0" : "bottom-[-100vh]"} w-full h-full bg-[#1e1e1e] z-30 rounded-t-4xl`}
          >
            <div className="flex items-center justify-between p-5">
              <div
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
                onClick={() => {
                  reset();
                  setClose();
                }}
              >
                <X className="text-white" />
              </div>
              <div
                onClick={() => onSubmit()}
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
              >
                <Check className="text-white" />
              </div>
            </div>

            <div className="flex justify-center px-5 py-5">
              <div className="flex flex-col items-start w-full">
                <div className="flex flex-col items-center justify-center gap-3">
                  <h1 className={` text-2xl text-white font-semibold`}>
                    Add Task
                  </h1>
                  <p className="text-white">{open}</p>
                </div>
                <div className="rounded-4xl bg-[#313131] w-full mt-6 p-5">
                  <div className="flex items-center gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-label"
                    >
                      Label
                    </label>
                    <input
                      onChange={(e) => setLabel(e.target.value)}
                      value={label}
                      className="w-full text-right text-white focus:outline-none"
                      placeholder="e.g. Finish homework"
                      id="task-label"
                      type="text"
                    />
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-type"
                    >
                      Type
                    </label>
                    <select
                      onChange={(e) =>
                        setType(e.target.value as "REPEATING" | "ONE_TIME")
                      }
                      value={type}
                      className="text-right focus:outline-none"
                      name="task-type"
                    >
                      <option className="text-right" value="REPEATING">
                        Repeating
                      </option>
                      <option className="text-right" value="ONE_TIME">
                        One-Time
                      </option>
                    </select>
                  </div>
                  <Separator className="my-4" />
                  {type === "REPEATING" && (
                    <div className="flex items-center justify-between w-full gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-frequency"
                      >
                        Frequency
                      </label>
                      <select
                        onChange={(e) => {
                          setFrequency(
                            e.target.value as "DAILY" | "WEEKLY" | "MONTHLY",
                          );
                        }}
                        value={frequency}
                        className="text-right focus:outline-none"
                        name="task-frequency"
                      >
                        <option className="text-right" value="DAILY">
                          Daily
                        </option>
                        <option className="text-right" value="WEEKLY">
                          Weekly
                        </option>
                        <option className="text-right" value="MONTHLY">
                          Monthly
                        </option>
                      </select>
                    </div>
                  )}
                  {type === "ONE_TIME" && (
                    <div className="flex items-center justify-between w-full gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-label"
                      >
                        Deadline
                      </label>
                      <input
                        value={
                          deadline
                            ? new Date(
                                deadline.getTime() -
                                  deadline.getTimezoneOffset() * 60000,
                              )
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        type="datetime-local"
                        onChange={(e) => setDeadline(new Date(e.target.value))}
                      />
                    </div>
                  )}
                </div>
                {/* -------------------------------------------------------- */}
                <div className="rounded-4xl bg-[#313131] w-full mt-6 p-5">
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-count-type"
                    >
                      Count Type
                    </label>
                    <select
                      onChange={(e) => {
                        setCountType(
                          e.target.value as "TIME" | "QTA" | "CHECKBOX",
                        );
                      }}
                      value={countType}
                      className="text-right focus:outline-none"
                      name="count-type"
                    >
                      <option className="text-right" value="QTA">
                        Quantity
                      </option>
                      <option className="text-right" value="TIME">
                        Time
                      </option>
                      <option className="text-right" value="CHECKBOX">
                        Checkbox
                      </option>
                    </select>
                  </div>
                  {countType !== "CHECKBOX" && <Separator className="my-4" />}
                  {countType === "QTA" && (
                    <div className="flex items-center gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-goal"
                      >
                        Goal
                      </label>
                      <input
                        onChange={(e) => setFinalScore(Number(e.target.value))}
                        value={finalScore ? finalScore.toString() : ""}
                        className="w-full text-right text-white focus:outline-none"
                        id="task-goal"
                        placeholder="e.g. 10 (times)"
                        type="number"
                      />
                    </div>
                  )}
                  {countType === "TIME" && (
                    <div className="flex items-center justify-between gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-goal"
                      >
                        Goal
                      </label>
                      <input
                        onChange={(e) => setFinalScore(Number(e.target.value))}
                        value={finalScore ? finalScore.toString() : ""}
                        className="w-full text-right text-white focus:outline-none"
                        id="task-goal"
                        placeholder="e.g. 20 (minutes)"
                        type="number"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
