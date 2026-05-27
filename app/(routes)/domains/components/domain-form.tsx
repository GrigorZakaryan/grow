"use client";
import { IoLayers } from "react-icons/io5";
import { Inter } from "next/font/google";
import { Check, X } from "lucide-react";
import { useDomainForm } from "../stores/use-domain-form";
import { AnimatePresence, motion } from "motion/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const DomainForm = () => {
  const { open, setClose, label, setLabel } = useDomainForm();
  const router = useRouter();

  const onSubmit = async () => {
    try {
      await axios.post("/domains/api", { label });
    } catch (err) {
      console.error(err);
    } finally {
      setClose();
      router.refresh();
    }
  };
  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2 }}
            exit={{ y: "100%" }}
            className={`${inter.className} absolute ${open ? "bottom-0" : "bottom-[-100vh]"} w-full h-full rounded-t-4xl bg-[#1e1e1e] border-t border-white/20 z-999`}
          >
            <div className="flex items-center justify-between p-5">
              <div
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
                onClick={() => setClose()}
              >
                <X className="text-white" />
              </div>
              <div
                onClick={() => onSubmit()}
                className="p-3 bg-white/10 rounded-full border border-white/15 active:bg-white/50 transition active:scale-150 duration-200"
              >
                <Check className="text-white" />
              </div>
            </div>

            <div className="flex justify-center px-5 py-5">
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="bg-[#313131] rounded-full p-5">
                    <IoLayers className="w-14 h-14 text-white" />
                  </div>
                  <h1 className={` text-2xl text-white font-medium`}>
                    Add Domain
                  </h1>
                  <p className="text-white">{open}</p>
                </div>
                <div className="rounded-4xl bg-[#313131] w-full mt-16 p-5">
                  <div className="flex items-center gap-3">
                    <label
                      className="text-white/50 font-normal"
                      htmlFor="domain-label"
                    >
                      Label
                    </label>
                    <input
                      onChange={(e) => setLabel(e.target.value)}
                      className="w-full text-right text-white focus:outline-none"
                      id="domain-label"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
