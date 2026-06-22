import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const localTime = searchParams.get("localTime");

  if (!localTime) return new NextResponse("Missing params", { status: 400 });

  const clientDate = new Date(localTime);
  clientDate.setUTCHours(0, 0, 0, 0);

  // Perform the bulk update only on REPEATING tasks that are outdated
  await db.task.updateMany({
    where: {
      type: "REPEATING", // Only target repeating tasks
      updatedAt: { lt: clientDate }, // Tasks not updated today
    },
    data: {
      qty: null,
      timeMS: null,
      checked: false,
      status: "UPCOMING",
    },
  });

  // Fetch all tasks (now updated) to return to the client
  const tasks = await db.task.findMany({
    where: { status: { in: ["UPCOMING", "IN_PROGRESS"] } },
    orderBy: { createdAt: "asc" }, // Optional: ensure consistent order
  });

  return NextResponse.json(tasks, { status: 200 });
};
