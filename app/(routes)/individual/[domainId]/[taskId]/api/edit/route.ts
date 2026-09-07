import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string; taskId: string }> },
) => {
  const body = await req.json();
  const { domainId, taskId } = await params;
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
    await db.task.update({
      where: { id: taskId },
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

    return new NextResponse("Task updated!", { status: 200 });
  } catch (err) {
    console.error("[TASK UPDATE]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};

export const DELETE = async (
  _: any,
  { params }: { params: Promise<{ domainId: string; taskId: string }> },
) => {
  const { taskId } = await params;
  try {
    await db.task.delete({
      where: { id: taskId },
    });

    return new NextResponse("Task deleted!", { status: 200 });
  } catch (err) {
    console.error("[TASK DELETE]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
