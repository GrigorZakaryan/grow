import { create } from "zustand";

type EditorProps = {
  domainId: string;
  content: JSON | null;
  setContent: (ct: JSON) => void;
  openEditor: boolean;
  state: "saved" | "saving";
  docId: string;
  setDocId: (id: string) => void;
  setState: (s: "saved" | "saving") => void;
  setOpenEditor: () => void;
  setClose: () => void;
  setDomainId: (id: string) => void;
};

export const useEditorStore = create<EditorProps>((set) => ({
  openEditor: false,
  domainId: "",
  content: null,
  state: "saved",
  docId: "",
  setDocId: (id: string) => set(() => ({ docId: id })),
  setState: (s) => set(() => ({ state: s })),
  setDomainId: (id: string) => set((e) => ({ domainId: id })),
  setClose: () => set(() => ({ open: false, content: null })),
  setOpenEditor: () => set(() => ({ openEditor: true })),
  setContent: (ct) => set(() => ({ content: ct })),
}));
