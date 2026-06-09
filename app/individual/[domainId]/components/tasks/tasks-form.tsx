"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTaskForm } from "../../stores/use-task-form";
import { inter } from "../reflections/reflections-form";
import { Check, ListTodo, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useRouter } from "next/navigation";

export const TasksForm = ({ domainId }: { domainId: string }) => {
  const {
    open,
    setClose,
    setLabel,
    setType,
    deadline,
    type,
    setDeadline,
    label,
    reset,
  } = useTaskForm();

  const router = useRouter();

  const onSubmit = async () => {
    try {
      await axios.post(`/individual/${domainId}/api/tasks`, {
        type,
        deadline,
        label,
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
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="bg-[#313131] rounded-full p-5">
                    <ListTodo className="w-10 h-10 text-white" />
                  </div>
                  <h1 className={` text-2xl text-white font-medium`}>
                    Add Task
                  </h1>
                  <p className="text-white">{open}</p>
                </div>
                <div className="rounded-4xl bg-[#313131] w-full mt-16 p-5">
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
                      htmlFor="task-label"
                    >
                      Type
                    </label>
                    <select
                      onChange={(e) =>
                        setType(e.target.value as "REPEATING" | "ONE_TIME")
                      }
                      value={type}
                      className="text-right focus:outline-none"
                      name="type"
                    >
                      <option className="text-right" value="REPEATING">
                        Repeating
                      </option>
                      <option className="text-right" value="ONE_TIME">
                        One-Time
                      </option>
                    </select>
                  </div>
                  {type === "ONE_TIME" && <Separator className="my-4" />}
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
