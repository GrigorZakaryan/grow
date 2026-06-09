"use client";
import { Plus } from "lucide-react";
import axios from "axios";
import { useTaskForm } from "../../stores/use-task-form";

export const AddTask = ({ domainId }: { domainId: string }) => {
  const { setOpen } = useTaskForm();
  return (
    <div
      className="absolute bg-[#303030] border border-white/20 rounded-full p-2 backdrop-blur-lg bottom-24 right-7 z-30"
      onClick={() => setOpen()}
    >
      <Plus className="text-white" />
    </div>
  );
};
