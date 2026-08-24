import { create } from "zustand";

type SelectDayProps = {
  selectedDay: string;
  setSelectDay: (day: string) => void;
};

export const useSelectDay = create<SelectDayProps>((set) => ({
  selectedDay: "",
  setSelectDay: (day: string) => set((e) => ({ selectedDay: day })),
}));
