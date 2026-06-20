import db from "@/lib/db";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { redirect } from "next/navigation";
import FireRed from "@/public/fire.svg";
import Image from "next/image";
import { TaskControlForm } from "./components/task-control-form";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ domainId: string; taskId: string }>;
}) {
  const { taskId, domainId } = await params;

  const domain = await db.domain.findUnique({ where: { id: domainId } });
  const task = await db.task.findUnique({ where: { id: taskId } });

  if (!task || !domain) redirect(`/individual/${domainId}`);

  return (
    <div className="flex flex-col w-full h-full">
      <TaskControlForm task={task} domain={domain} />
    </div>
  );
}
