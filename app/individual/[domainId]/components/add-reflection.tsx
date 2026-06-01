"use client";
import { Plus } from "lucide-react";
import { useEditorStore } from "../stores/use-editor";
import axios from "axios";

export const AddReflection = ({ domainId }: { domainId: string }) => {
  const { open, setOpen, setDocId } = useEditorStore();
  const onPlus = async () => {
    try {
      const res = await axios.post(
        `/individual/${domainId}/api/reflections`,
        {},
      );
      setDocId(res.data.id);
      setOpen();
    } catch (err) {
      console.error(err);
    } finally {
    }
  };
  return (
    <div
      className="absolute bg-[#303030] border border-white/20 rounded-full p-2 backdrop-blur-lg bottom-7 right-7 z-30"
      onClick={() => onPlus()}
    >
      <Plus className="text-white" />
    </div>
  );
};
