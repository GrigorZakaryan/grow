"use client";
import { Plus } from "lucide-react";
import axios from "axios";
import { useTaskForm } from "../../stores/use-task-form";

export const AddTask = ({ domainId }: { domainId: string }) => {
  const { setOpenTask } = useTaskForm();
  return (
    <div
      className="absolute bg-black/10 dark:bg-[#303030] border border-black/20 dark:border-white/20 rounded-full p-2 backdrop-blur-lg bottom-12 right-7 z-30"
      onClick={() => setOpenTask()}
    >
      <Plus />
    </div>
  );
};
