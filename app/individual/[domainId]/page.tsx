import db from "@/lib/db";
import { Relfections } from "./components/reflections/reflections";
import { AnimatePresence } from "motion/react";
import { ReflectionsForm } from "./components/reflections/reflections-form";
import { redirect } from "next/navigation";
import { DomainHeader } from "./components/header";
import { Tasks } from "./components/tasks/tasks";
import { TasksForm } from "./components/tasks/tasks-form";

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domainId: string }>;
}) {
  const { domainId } = await params;
  const domain = await db.domain.findUnique({ where: { id: domainId } });
  if (!domain?.id) {
    redirect("/domains");
  }
  return (
    <div className="w-full h-dvh overflow-hidden relative">
      <DomainHeader domain={domain} />
      <div className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory touch-pan-x scrollbar-hide scroll-smooth">
        <div className="min-w-full snap-center px-5 mt-5 shrink-0"></div>
        <Tasks domain={domain} />
        <Relfections domain={domain} />
      </div>
      <AnimatePresence>
        <ReflectionsForm key={"reflections-form"} domainId={domain.id} />
        <TasksForm key={"tasks-form"} domainId={domain.id} />
      </AnimatePresence>
    </div>
  );
}
