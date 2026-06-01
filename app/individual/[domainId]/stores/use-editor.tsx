import { create } from "zustand";

type EditorProps = {
  document: string;
  setLabel: (text: string) => void;
  open: boolean;
  state: "saved" | "saving";
  docId: string;
  setDocId: (id: string) => void;
  setState: (s: "saved" | "saving") => void;
  setOpen: () => void;
  setClose: () => void;
};

export const useEditorStore = create<EditorProps>((set) => ({
  open: false,
  document: "",
  state: "saved",
  docId: "",
  setDocId: (id: string) => set(() => ({ docId: id })),
  setState: (s) => set(() => ({ state: s })),
  setClose: () => set(() => ({ open: false })),
  setOpen: () => set(() => ({ open: true })),
  setLabel: (text) => set(() => ({ document: text })),
}));
