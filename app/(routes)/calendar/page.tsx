import { Header } from "./components/header";
import { DaysRow } from "./components/days-row";
import { TimesCol } from "./components/times-col";
import db from "@/lib/db";

export default async function CalendarPage() {
  const tasks = await db.task.findMany({ where: { day: { not: null } } });
  const activities = await db.activity.findMany({
    where: { taskId: { not: null } },
    include: { task: true },
  });
  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="flex flex-col items-center w-full h-full mt-5">
        <DaysRow />
        <TimesCol activities={activities} tasks={tasks} />
      </div>
    </div>
  );
}
