import { Activity } from "@/lib/generated/prisma/client";
import { create } from "zustand";

type ActivityStoreState = {
  activity: Activity | null;
  openActivity: boolean;
  setActivity: (activity: Activity | null) => void;
  setClose: () => void;
  setOpenActivity: () => void;
};

export const useActivity = create<ActivityStoreState>((set) => ({
  activity: null,
  openActivity: false,
  setClose: () => set({ openActivity: false }),
  setActivity: (activity: Activity | null) =>
    set({ activity, openActivity: true }),
  setOpenActivity: () => set({ openActivity: true }),
}));
