import { create } from "zustand";

type TimeProps = {
  open: boolean;
  toggleOpen: () => void;
};

export const useTimer = create<TimeProps>((set) => ({
  open: false,
  toggleOpen: () => set((e) => ({ open: !e.open })),
}));
