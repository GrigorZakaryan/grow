import { create } from "zustand";

type TimeProps = {
  open: boolean;
  time: number;
  taskId: string;
  setTaskId: (id: string) => void;
  domainId: string;
  setDomainId: (id: string) => void;
  setTime: (time: number) => void;
  toggleOpen: () => void;
};

export const useTimer = create<TimeProps>((set) => ({
  open: false,
  time: 300000,
  taskId: "",
  setTaskId: (id: string) => set((e) => ({ taskId: id })),
  domainId: "",
  setDomainId: (id: string) => set((e) => ({ domainId: id })),
  setTime: (time: number) => set((e) => ({ time: time })),
  toggleOpen: () => set((e) => ({ open: !e.open })),
}));
