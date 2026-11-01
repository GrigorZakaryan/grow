import { Project } from "@/lib/generated/prisma/client";
import { create } from "zustand";

type ProjectFormState = {
  project: Project | null;
  openProject: boolean;
  setProject: (project: Project | null) => void;
  setClose: () => void;
  setOpenProject: () => void;
};

export const useProjectForm = create<ProjectFormState>((set) => ({
  project: null,
  openProject: false,
  setProject: (project) => set({ project, openProject: true }),
  setClose: () => set({ openProject: false }),
  setOpenProject: () => set({ openProject: true }),
}));
