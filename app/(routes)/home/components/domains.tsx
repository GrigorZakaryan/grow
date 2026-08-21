"use client";

import { Domain, Relfection, Task } from "@/lib/generated/prisma/client";
import { DomainCard } from "../../domains/components/domain-card";

interface DomainProps {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  relfections: Relfection[];
}

export const HomeDomains = ({ domains }: { domains: DomainProps[] }) => {
  return (
    <div className="mt-10 w-full">
      <div className="flex items-center gap-5 mt-3 w-full overflow-y-hidden overflow-x-auto">
        {domains &&
          domains.map((domain) => (
            <div key={domain.id} className="w-full min-w-45">
              <DomainCard key={domain.id} domain={domain} />
            </div>
          ))}
      </div>
    </div>
  );
};
