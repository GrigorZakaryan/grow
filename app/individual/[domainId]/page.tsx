import db from "@/lib/db";
import { Plus } from "lucide-react";
import { Relfections } from "./components/reflections";
import { AnimatePresence } from "motion/react";
import { ReflectionsForm } from "./components/reflections-form";
import { redirect } from "next/navigation";
import { DomainHeader } from "./components/header";

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
      <DomainHeader domainId={domain.id} />
      <div className="flex w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory touch-pan-x scrollbar-hide scroll-smooth">
        <div className="min-w-full snap-center px-5 mt-5 shrink-0">
          <div className="w-full h-40 rounded-4xl bg-[#1e1e1e]"></div>
        </div>
        <div className="min-w-full snap-center px-5 mt-5 shrink-0">
          <div className="w-full h-45 rounded-4xl bg-[#1e1e1e]"></div>
          <div className="w-full flex items-center justify-between mt-5">
            <h2 className={"text-white/80"}>Goals</h2>
            <div className="py-1 px-3 bg-[#313131] rounded-full border border-white/10">
              <Plus className="text-white w-4 h-4" />
            </div>
          </div>
        </div>
        <Relfections domain={domain} />
      </div>
      <AnimatePresence>
        <ReflectionsForm domainId={domain.id} />
      </AnimatePresence>
    </div>
  );
}
