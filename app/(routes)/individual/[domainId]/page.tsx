import db from "@/lib/db";
import { Relfections } from "./components/reflections/reflections";
import { redirect } from "next/navigation";
import { DomainHeader } from "./components/header";
import { Tasks } from "./components/tasks/tasks";

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
    <div className="flex flex-col w-full h-dvh overflow-hidden relative">
      <DomainHeader domain={domain} />
      <div className="flex-1 flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory touch-pan-x scrollbar-hide scroll-smooth">
        <div className="min-w-full snap-center px-5 pt-5 shrink-0"></div>
        <Tasks domain={domain} />
        <Relfections domain={domain} />
      </div>
    </div>
  );
}
