"use client";
import { Plus } from "lucide-react";
import { useEditor } from "../stores/use-editor";
import { ReflectionsForm } from "./reflections-form";
import { AnimatePresence } from "motion/react";

export const Relfections = () => {
  const { open, setOpen, setClose } = useEditor();
  return (
    <div className="min-w-full h-full snap-center px-5 mt-5 shrink-0">
      <div onClick={() => setOpen()}>
        <Plus className="text-white" />
      </div>
      <p className="text-white">{open}</p>
    </div>
  );
};
