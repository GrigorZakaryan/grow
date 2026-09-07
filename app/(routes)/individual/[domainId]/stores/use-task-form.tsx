import { Task } from "@/lib/generated/prisma/client";
import { create } from "zustand";

type TaskFormState = {
  task: Task | null;
  openTask: boolean;
  setTask: (task: Task | null) => void;
  setClose: () => void;
  setOpenTask: () => void;
};

export const useTaskForm = create<TaskFormState>((set) => ({
  task: null,
  openTask: false,
  setTask: (task) => set({ task, openTask: true }),
  setClose: () => set({ openTask: false }),
  setOpenTask: () => set({ openTask: true }),
}));
