import { create } from "zustand";

type TaskFormProps = {
  label: string;
  type: "ONE_TIME" | "REPEATING";
  status: "UPCOMING" | "IN_PROGRESS" | "DONE" | undefined;
  deadline: Date | undefined;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  countType: "QTA" | "TIME" | "CHECKBOX";
  currentScore: number | undefined;
  finalScore: number | undefined;
  open: boolean;

  setLabel: (text: string) => void;
  setDeadline: (date: Date) => void;
  setType: (type: "ONE_TIME" | "REPEATING") => void;
  setFrequency: (freq: "DAILY" | "WEEKLY" | "MONTHLY") => void;

  setCountType: (type: "QTA" | "TIME" | "CHECKBOX") => void;
  setFinalScore: (num: number) => void;
  setCurrentScore: (num: number) => void;

  setStatus: (status: "UPCOMING" | "IN_PROGRESS" | "DONE") => void;
  setClose: () => void;
  setOpen: () => void;
  reset: () => void;
};

export const useTaskForm = create<TaskFormProps>((set) => ({
  open: false,
  description: null,
  deadline: undefined,
  frequency: "DAILY",
  countType: "QTA",
  currentScore: 0,
  finalScore: undefined,
  label: "",
  status: "UPCOMING",
  type: "REPEATING",
  setClose: () => set(() => ({ open: false })),
  setOpen: () => set(() => ({ open: true })),
  setLabel: (text: string) => set(() => ({ label: text })),
  setDeadline: (date: Date) => set(() => ({ deadline: date })),
  setType: (type: "ONE_TIME" | "REPEATING") => set(() => ({ type })),
  setFrequency: (freq) => set(() => ({ frequency: freq })),

  setCountType: (type: "QTA" | "TIME" | "CHECKBOX") =>
    set(() => ({ countType: type })),
  setCurrentScore: (num) => set(() => ({ currentScore: num })),
  setFinalScore: (num) => set(() => ({ finalScore: num })),

  setStatus: (status: "UPCOMING" | "IN_PROGRESS" | "DONE") =>
    set(() => ({ status })),
  reset: () =>
    set(() => ({
      label: "",
      type: "REPEATING",
      status: "UPCOMING",
      deadline: undefined,
    })),
}));
