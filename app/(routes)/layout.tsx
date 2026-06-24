import { MenuBar } from "@/components/menubar";
import { DomainForm } from "./domains/components/domain-form";
import { AnimatePresence } from "motion/react";
import { Timer } from "@/components/modals/timer";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {children}
      <MenuBar className="absolute bottom-7 transform translate-x-[-50%] left-[50%] z-99" />
      <AnimatePresence>
        <DomainForm key={"domain-form"} />
        <Timer time={300000} key={"timer"} />
      </AnimatePresence>
    </div>
  );
}
