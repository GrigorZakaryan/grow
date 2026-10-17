import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) => {
  const { taskId } = await params;

  const task = await db.task.findUnique({
    where: { id: taskId },
    include: { activity: true },
  });

  if (!task) {
    return new NextResponse("Task was not found!", { status: 404 });
  }

  return NextResponse.json(task, { status: 200 });
};
