import { MenuBar } from "@/components/menubar";
import { DomainForm } from "../../components/modals/domain-modal";
import { AnimatePresence } from "motion/react";
import { Timer } from "@/components/modals/timer-modal";
import { ReflectionsForm } from "../../components/modals/reflections-modal";
import db from "@/lib/db";
import { ActivityForm } from "@/components/modals/activity-modal";
import { ProjectModal } from "@/components/modals/project-modal";
import { TaskModal } from "@/components/modals/task-modal";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domains = await db.domain.findMany({ include: { projects: true } });
  const tasks = await db.task.findMany();
  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {children}
      <MenuBar className="absolute bottom-7 transform translate-x-[-50%] left-[50%] z-50" />
      <AnimatePresence>
        <DomainForm key={"domain-form"} />
        <Timer key={"timer"} />
        <ReflectionsForm key={"reflections-form"} />
        <TaskModal domains={domains} key={"tasks-form"} />
        <ActivityForm tasks={tasks} key={"activity-form"} />
        <ProjectModal domains={domains} />
      </AnimatePresence>
    </div>
  );
}
