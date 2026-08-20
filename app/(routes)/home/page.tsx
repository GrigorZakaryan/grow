import db from "@/lib/db";
import { Header } from "./components/header";
import { HomeTasks } from "./components/tasks";
import { HomeDomains } from "./components/domains";

export default async function Home() {
  const domains = await db.domain.findMany({
    include: { tasks: true, relfections: true },
  });
  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="w-full h-full">
        <HomeTasks />
        <HomeDomains domains={domains} />
      </div>
    </div>
  );
}
