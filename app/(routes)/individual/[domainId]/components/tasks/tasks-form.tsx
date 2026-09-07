"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTaskForm } from "../../stores/use-task-form";
import { inter } from "../reflections/reflections-form";
import { Check, Trash, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Domain } from "@/lib/generated/prisma/client";
import { Switch } from "@/components/ui/switch";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

type TaskFormValues = {
  label: string;
  domainId: string;
  type: "ONE_TIME" | "REPEATING";
  deadline: string;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  countType: "QTY" | "TIME" | "CHECKBOX";
  finalQty?: number | null;
  finalTimeMS?: number | null;
  priority: number;
  showCalendar: boolean;
  day: string;
  startTime: string;
  endTime: string;
};

export const TasksForm = ({ domains }: { domains: Domain[] }) => {
  const { openTask, setClose, task, setTask } = useTaskForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, register, handleSubmit, reset } = useForm<TaskFormValues>({
    defaultValues: {
      label: task?.label,
      domainId: domains[0]?.id ?? "",
      type: "REPEATING",
      deadline: "",
      frequency: "DAILY",
      countType: "QTY",
      finalQty: 0,
      finalTimeMS: 0,
      priority: 0,
      showCalendar: false,
      day: "",
      startTime: "",
      endTime: "",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        label: task.label ?? "",
        domainId: task.domainId ?? domains[0]?.id ?? "",
        type: task.type,
        deadline: task.deadline
          ? new Date(task.deadline).toISOString().slice(0, 16)
          : "",
        frequency: task.frequency ?? "DAILY",
        countType: task.countType,
        priority: task.priority,
        showCalendar: task.day ? true : false,
        day: task.day ?? "",
        startTime: task.startTime ?? "",
        endTime: task.endTime ?? "",
        finalQty: task.finalQty,
        finalTimeMS: Number(task.finalTimeMS) / 60_000,
      });
    }
  }, [task, domains, reset]);

  const type = useWatch({ control, name: "type" });
  const countType = useWatch({ control, name: "countType" });
  const showCalendar = useWatch({ control, name: "showCalendar" });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      const payload = {
        label: values.label,
        type: values.type,
        deadline: values.deadline ? new Date(values.deadline) : undefined,
        frequency: values.frequency,
        countType: values.countType,
        // Map store values to the specific backend fields
        finalQty: values.countType === "QTY" ? values.finalQty : null,
        finalTimeMS: values.countType === "TIME" ? values.finalTimeMS : null,
        priority: values.priority,
        day: values.day,
        startTime: values.startTime,
        endTime: values.endTime,
      };

      if (task?.id) {
        await axios.patch(
          `/individual/${values.domainId}/${task.id}/api/edit`,
          payload,
        );
        reset();
      } else {
        await axios.post(`/individual/${values.domainId}/api/tasks`, payload);
        reset();
      }
      reset();
      setClose();
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/individual/${task?.domainId}/${task?.id}/api/edit`);
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
                  reset({
                    label: "",
                    domainId: domains[0]?.id ?? "",
                    type: "REPEATING",
                    deadline: "",
                    frequency: "DAILY",
                    countType: "CHECKBOX",
                    priority: 0,
                    showCalendar: false,
                    day: "",
                    startTime: "",
                    endTime: "",
                    finalQty: null,
                    finalTimeMS: null,
                  });
                  setTask(null);
                  setClose();
                }}
              >
                <X className="text-white" />
              </div>
              <div
                onClick={handleSubmit(onSubmit)}
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
                      {...register("label")}
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
                      {...register("type")}
                      className="text-right focus:outline-none"
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
                        {...register("frequency")}
                        className="text-right focus:outline-none"
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
                      <input type="datetime-local" {...register("deadline")} />
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
                      {...register("priority", { valueAsNumber: true })}
                      className="text-right focus:outline-none"
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
                      {...register("domainId")}
                      className="text-right focus:outline-none"
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
                      {...register("countType")}
                      className="text-right focus:outline-none"
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
                        {...register("finalQty", { valueAsNumber: true })}
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
                        {...register("finalTimeMS", { valueAsNumber: true })}
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
                    <Controller
                      name="showCalendar"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          id="task-show-calendar"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
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
                        {...register("day")}
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
                        {...register("startTime")}
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
                        {...register("endTime")}
                        className="text-right text-white focus:outline-none"
                        id="task-day"
                        type="time"
                      />
                    </div>
                  )}
                </div>
                {task?.id && (
                  <div className="w-full mt-6 pb-6">
                    <Button
                      disabled={loading}
                      onClick={() => onDelete()}
                      size={"lg"}
                      className="w-full"
                      variant={"destructive"}
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Trash /> Delete Task
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
