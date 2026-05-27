import { create } from "zustand";

type EditorProps = {
  document: string;
  setLabel: (text: string) => void;
  open: boolean;
  setOpen: () => void;
  setClose: () => void;
};

export const useEditor = create<EditorProps>((set) => ({
  open: false,
  document: "",
  setClose: () => set(() => ({ open: false })),
  setOpen: () => set(() => ({ open: true })),
  setLabel: (text) => set(() => ({ document: text })),
}));
