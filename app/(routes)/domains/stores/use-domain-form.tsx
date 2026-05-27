import { create } from "zustand";

type DomainFormProps = {
  label: string;
  setLabel: (text: string) => void;
  open: boolean;
  setOpen: () => void;
  setClose: () => void;
};

export const useDomainForm = create<DomainFormProps>((set) => ({
  open: false,
  label: "",
  setClose: () => set(() => ({ open: false })),
  setOpen: () => set(() => ({ open: true })),
  setLabel: (text) => set(() => ({ label: text })),
}));
