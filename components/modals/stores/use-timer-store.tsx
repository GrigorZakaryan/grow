import { create } from "zustand";

type TimeProps = {
  open: boolean;
  time: number;
  setTime: (time: number) => void;
  toggleOpen: () => void;
};

export const useTimer = create<TimeProps>((set) => ({
  open: false,
  time: 300000,
  setTime: (time: number) => set((e) => ({ time: time })),
  toggleOpen: () => set((e) => ({ open: !e.open })),
}));
