import db from "@/lib/db";
import { AddReflection } from "../reflections/add-reflection";
import { ReflectionCard } from "../reflections/reflection-card";
import { Domain } from "@/lib/generated/prisma/client";

export const Relfections = async ({ domain }: { domain: Domain }) => {
  const reflections = await db.relfection.findMany({
    where: { domainId: domain.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div
      id="journal"
      className="min-w-full h-full snap-center px-5 shrink-0 overflow-y-auto pb-24 relative"
    >
      <div>
        <h2 className="text-white font-semibold text-2xl py-3">Journal</h2>
        <div className="flex flex-col items-center gap-5 mt-3">
          {reflections.map((r) => (
            <ReflectionCard key={r.id} r={r} />
          ))}
        </div>
      </div>
      <AddReflection domainId={domain.id} />
    </div>
  );
};
