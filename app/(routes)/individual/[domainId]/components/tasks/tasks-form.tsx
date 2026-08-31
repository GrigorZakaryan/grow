"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTaskForm } from "../../stores/use-task-form";
import { inter } from "../reflections/reflections-form";
import { Check, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Domain } from "@/lib/generated/prisma/client";
import { Switch } from "@/components/ui/switch";

export const TasksForm = ({ domains }: { domains: Domain[] }) => {
  const {
    openTask,
    domainId,
    setClose,
    setLabel,
    setType,
    setDeadline,
    setFrequency,
    setCountType,
    setFinalScore,
    setDomainId,
    setPriority,

    toggleShowCalendar,
    setDay,
    setStartTime,
    setEndTime,
    day,
    startTime,
    endTime,

    reset,
    deadline,
    type,
    frequency,
    countType,
    finalScore,
    label,
    priority,
    showCalendar,
  } = useTaskForm();

  const onSubmit = async () => {
    try {
      const payload = {
        label,
        type,
        deadline,
        frequency,
        countType,
        // Map store values to the specific backend fields
        finalQty: countType === "QTY" ? finalScore : null,
        finalTimeMS: countType === "TIME" ? finalScore : null,
        priority,
        day,
        startTime,
        endTime,
      };

      await axios.post(`/individual/${domainId}/api/tasks`, payload);
      reset();
      setClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-dvh">
      <AnimatePresence>
        {openTask && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ y: "100%" }}
            className={`${inter.className} fixed ${openTask ? "bottom-0" : "bottom-[-100vh]"} w-full h-full bg-[#1e1e1e] z-99 rounded-t-4xl overflow-y-auto`}
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

            <div className="flex justify-center px-5 py-5 h-full">
              <div className="flex flex-col items-start w-full pb-30">
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
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-domain"
                    >
                      Priority
                    </label>
                    <select
                      onChange={(e) => setPriority(Number(e.target.value))}
                      value={priority}
                      className="text-right focus:outline-none"
                      name="task-domain"
                    >
                      <option className="text-right" value={3}>
                        High
                      </option>
                      <option className="text-right" value={2}>
                        Medium
                      </option>
                      <option className="text-right" value={1}>
                        Low
                      </option>
                      <option className="text-right" value={0}>
                        None
                      </option>
                    </select>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-domain"
                    >
                      Domain
                    </label>
                    <select
                      onChange={(e) =>
                        setDomainId(e.target.value as "REPEATING" | "ONE_TIME")
                      }
                      value={domainId}
                      className="text-right focus:outline-none"
                      name="task-domain"
                    >
                      {domains.map((d) => (
                        <option key={d.id} className="text-right" value={d.id}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                          e.target.value as "TIME" | "QTY" | "CHECKBOX",
                        );
                      }}
                      value={countType}
                      className="text-right focus:outline-none"
                      name="count-type"
                    >
                      <option className="text-right" value="QTY">
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
                  {countType === "QTY" && (
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
                {/* ----------------------------SHOW ON CALENDAR----------------------------- */}
                <div className="rounded-4xl bg-[#313131] w-full mt-6 p-5">
                  <div className="flex items-center justify-between w-full gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="task-show-calendar"
                    >
                      Show on Calendar
                    </label>
                    <Switch
                      id="task-show-calendar"
                      onClick={() => toggleShowCalendar()}
                      checked={showCalendar}
                    />
                  </div>
                  {showCalendar && <Separator className="my-4" />}
                  {showCalendar && (
                    <div className="flex items-center justify-between gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-day"
                      >
                        Day
                      </label>
                      <input
                        onChange={(e) => setDay(e.target.value)}
                        value={day}
                        className="text-right text-white focus:outline-none"
                        id="task-day"
                        placeholder="e.g. 10 (times)"
                        type="date"
                      />
                    </div>
                  )}
                  {showCalendar && <Separator className="my-4" />}
                  {showCalendar && (
                    <div className="flex items-center justify-between gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-day"
                      >
                        Start Time
                      </label>
                      <input
                        onChange={(e) => setStartTime(e.target.value)}
                        value={startTime}
                        className="text-right text-white focus:outline-none"
                        id="task-day"
                        type="time"
                      />
                    </div>
                  )}
                  {showCalendar && <Separator className="my-4" />}
                  {showCalendar && (
                    <div className="flex items-center justify-between gap-3">
                      <label
                        className="text-white/50 font-normal"
                        htmlFor="task-day"
                      >
                        End Time
                      </label>
                      <input
                        onChange={(e) => setEndTime(e.target.value)}
                        value={endTime}
                        className="text-right text-white focus:outline-none"
                        id="task-day"
                        type="time"
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
