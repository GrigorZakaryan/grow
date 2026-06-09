import { create } from "zustand";

type TaskFormProps = {
  label: string;
  type: "ONE_TIME" | "REPEATING";
  status: "UPCOMING" | "IN_PROGRESS" | "DONE";
  deadline: Date | undefined;
  open: boolean;
  setLabel: (text: string) => void;
  setDeadline: (date: Date) => void;
  setType: (type: "ONE_TIME" | "REPEATING") => void;
  setStatus: (status: "UPCOMING" | "IN_PROGRESS" | "DONE") => void;
  setClose: () => void;
  setOpen: () => void;
  reset: () => void;
};

export const useTaskForm = create<TaskFormProps>((set) => ({
  open: false,
  description: null,
  deadline: undefined,
  label: "",
  status: "UPCOMING",
  type: "REPEATING",
  setClose: () => set(() => ({ open: false })),
  setOpen: () => set(() => ({ open: true })),
  setLabel: (text: string) => set(() => ({ label: text })),
  setDeadline: (date: Date) => set(() => ({ deadline: date })),
  setType: (type: "ONE_TIME" | "REPEATING") => set(() => ({ type })),
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
