"use client";
import { Inter } from "next/font/google";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEditor } from "../stores/use-editor";
import { Editor } from "@/components/DynamicEditor";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const ReflectionsForm = () => {
  const { open, setClose, document, setLabel } = useEditor();
  const router = useRouter();
  return (
    <div className="w-full max-h-dvh overflow-y-auto">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ y: "100%" }}
            className={`${inter.className} fixed ${open ? "bottom-0" : "bottom-[-100vh]"} w-full h-full bg-[#1e1e1e] z-20 rounded-t-4xl`}
          >
            <div className="flex items-center p-5" onClick={() => setClose()}>
              <div className="p-2 rounded-full border border-white/20 bg-white/10">
                <ChevronLeft className="text-white" />
              </div>
            </div>
            {open && <SimpleEditor />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
