import { MenuBar } from "@/components/menubar";
import { DomainForm } from "./domains/components/domain-form";
import { AnimatePresence } from "motion/react";
import { Timer } from "@/components/modals/timer";
import { ReflectionsForm } from "./individual/[domainId]/components/reflections/reflections-form";
import { TasksForm } from "./individual/[domainId]/components/tasks/tasks-form";
import db from "@/lib/db";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = await db.domain.findMany();
  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {children}
      <MenuBar className="absolute bottom-7 transform translate-x-[-50%] left-[50%] z-99" />
      <AnimatePresence>
        <DomainForm key={"domain-form"} />
        <Timer key={"timer"} />
        <ReflectionsForm key={"reflections-form"} />
        <TasksForm domains={domains} key={"tasks-form"} />
      </AnimatePresence>
    </div>
  );
}
