"use client";
import { Inter } from "next/font/google";
import { Check, ChevronLeft, CloudCheck, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEditorStore } from "../../stores/use-editor";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { redirect, useRouter } from "next/navigation";

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const ReflectionsForm = ({ domainId }: { domainId: string }) => {
  const { open, setClose, state } = useEditorStore();
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
            className={`${inter.className} fixed ${open ? "bottom-0" : "bottom-[-100vh]"} w-full h-full bg-[#1e1e1e] z-30 rounded-t-4xl`}
          >
            <div
              className="flex items-center justify-between w-full p-5"
              onClick={() => setClose()}
            >
              <div className="p-2 rounded-full border border-white/20 bg-white/10">
                <ChevronLeft className="text-white" />
              </div>
              <div className="flex items-center space-x-2">
                {state === "saved" && <CloudCheck className="w-4 h-4" />}
                {state === "saving" && <RefreshCcw className="w-4 h-4" />}
                <p className="text-sm capitalize">{state}</p>
              </div>
              <div
                onClick={() => {
                  router.refresh();
                  router.push("#journal");
                }}
                className="p-2 rounded-full border border-white/20 bg-white/10"
              >
                <Check className="text-white" />
              </div>
            </div>
            {open && <SimpleEditor domainId={domainId} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
