import { Header } from "./components/header";
import db from "@/lib/db";
import { DomainCard } from "./components/domain-card";

export default async function Domains() {
  const domains = await db.domain.findMany({
    include: { tasks: true, relfections: true },
  });
  return (
    <div className="w-full h-dvh px-5 py-2 overflow-hidden">
      <Header />
      <div className="grid grid-cols-2 gap-4 mt-10 pb-26">
        {domains.map((domain) => (
          <DomainCard key={domain.id} domain={domain} />
        ))}
      </div>
    </div>
  );
}
