import { create } from "zustand";

type TaskFormProps = {
  label: string;
  type: "ONE_TIME" | "REPEATING";
  status: "UPCOMING" | "IN_PROGRESS" | "DONE" | undefined;
  deadline: Date | undefined;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  countType: "QTY" | "TIME" | "CHECKBOX";
  currentScore: number | undefined;
  finalScore: number | undefined;
  domainId: string;
  openTask: boolean;
  priority: number;

  setLabel: (text: string) => void;
  setDeadline: (date: Date) => void;
  setType: (type: "ONE_TIME" | "REPEATING") => void;
  setFrequency: (freq: "DAILY" | "WEEKLY" | "MONTHLY") => void;

  setCountType: (type: "QTY" | "TIME" | "CHECKBOX") => void;
  setFinalScore: (num: number) => void;
  setCurrentScore: (num: number) => void;

  setPriority: (num: number) => void;

  setStatus: (status: "UPCOMING" | "IN_PROGRESS" | "DONE") => void;
  setClose: () => void;
  setDomainId: (id: string) => void;
  setOpenTask: () => void;
  reset: () => void;
};

export const useTaskForm = create<TaskFormProps>((set) => ({
  label: "",
  description: null,

  status: "UPCOMING",
  type: "REPEATING",
  countType: "QTY",

  deadline: undefined,
  frequency: "DAILY",

  currentScore: 0,
  finalScore: undefined,

  priority: 0,

  openTask: false,
  domainId: "",

  setLabel: (text: string) => set(() => ({ label: text })),

  setClose: () => set(() => ({ openTask: false })),
  setOpenTask: () => set(() => ({ openTask: true })),

  setDeadline: (date: Date) => set(() => ({ deadline: date })),
  setType: (type: "ONE_TIME" | "REPEATING") => set(() => ({ type })),
  setFrequency: (freq) => set(() => ({ frequency: freq })),

  setCountType: (type: "QTY" | "TIME" | "CHECKBOX") =>
    set(() => ({ countType: type })),
  setCurrentScore: (num) => set(() => ({ currentScore: num })),
  setFinalScore: (num) => set(() => ({ finalScore: num })),
  setPriority: (num) => set((e) => ({ priority: num })),

  setDomainId: (id: string) => set((e) => ({ domainId: id })),

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
