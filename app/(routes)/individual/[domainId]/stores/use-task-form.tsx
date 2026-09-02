import { create } from "zustand";

type TaskFormState = {
  openTask: boolean;
  setClose: () => void;
  setOpenTask: () => void;
};

export const useTaskForm = create<TaskFormState>((set) => ({
  openTask: false,
  setClose: () => set({ openTask: false }),
  setOpenTask: () => set({ openTask: true }),
}));
