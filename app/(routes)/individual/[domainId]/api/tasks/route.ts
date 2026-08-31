import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const body = await req.json();
  const { domainId } = await params;
  const {
    label,
    type,
    countType,
    description,
    finalQty,
    finalTimeMS,
    priority,
    day,
    startTime,
    endTime,
  } = body;
  let { deadline, frequency } = body;

  // 1. Validation logic
  if (!label) return new NextResponse("Missing Label!", { status: 400 });
  if (type === "ONE_TIME" && !deadline)
    return new NextResponse("Missing deadline!", { status: 400 });

  // 2. Data Preparation
  if (type === "REPEATING") deadline = undefined;
  if (type === "ONE_TIME") frequency = undefined;

  try {
    await db.task.create({
      data: {
        label,
        description,
        type,
        deadline,
        frequency,
        countType,
        status: "UPCOMING",
        domainId,
        // Map based on countType
        qty: countType === "QTY" ? 0 : null,
        finalQty: countType === "QTY" ? finalQty : null,
        timeMS: countType === "TIME" ? 0 : null,
        finalTimeMS: countType === "TIME" ? finalTimeMS * 60000 : null,
        checked: countType === "CHECKBOX" ? false : null,
        priority,
        day,
        startTime,
        endTime,
      },
    });

    return new NextResponse("Task created!", { status: 200 });
  } catch (err) {
    console.error("Task Creation: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const { searchParams } = new URL(req.url);
  const localTime = searchParams.get("localTime");
  const { domainId } = await params;

  if (!localTime || !domainId)
    return new NextResponse("Missing params", { status: 400 });

  const clientDate = new Date(localTime);
  clientDate.setUTCHours(0, 0, 0, 0);

  // Perform the bulk update only on REPEATING tasks that are outdated
  await db.task.updateMany({
    where: {
      domainId: domainId,
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
    where: { domainId: domainId },
    orderBy: { createdAt: "asc" }, // Optional: ensure consistent order
  });

  return NextResponse.json(tasks, { status: 200 });
};
