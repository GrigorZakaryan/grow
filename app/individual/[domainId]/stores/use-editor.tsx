import { create } from "zustand";

type EditorProps = {
  content: JSON | null;
  setContent: (ct: JSON) => void;
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
  content: null,
  state: "saved",
  docId: "",
  setDocId: (id: string) => set(() => ({ docId: id })),
  setState: (s) => set(() => ({ state: s })),
  setClose: () => set(() => ({ open: false, content: null })),
  setOpen: () => set(() => ({ open: true })),
  setContent: (ct) => set(() => ({ content: ct })),
}));
