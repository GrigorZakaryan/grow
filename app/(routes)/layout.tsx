import { MenuBar } from "@/components/menubar";
import { DomainForm } from "./domains/components/domain-form";
import { AnimatePresence } from "motion/react";

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
        <DomainForm />
      </AnimatePresence>
    </div>
  );
}
