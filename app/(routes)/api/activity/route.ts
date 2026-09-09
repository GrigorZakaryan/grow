import db from "@/lib/db";
import { TaskStatus } from "@/lib/generated/prisma/enums";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { taskId, date } = body;
  let { duration } = body;

  if (!taskId) {
    return new NextResponse("Task Id is missing!", { status: 400 });
  }

  const existingTask = await db.task.findUnique({ where: { id: taskId } });

  if (!existingTask) {
    return new NextResponse("Task doesn't exist!", { status: 404 });
  }

  if (!date) {
    return new NextResponse("Date is missing!", { status: 400 });
  }

  if (!duration || duration < 5) {
    duration = 10;
  }

  let updatedData = {
    status: "IN_PROGRESS" as TaskStatus,
    timeMS:
      existingTask.countType === "TIME" &&
      Number(existingTask.finalTimeMS) < duration * 60_000
        ? existingTask.finalTimeMS
        : duration * 60_000,
    checked: existingTask.countType === "CHECKBOX" && true,
    // Implement Quantity
  };

  if (existingTask.countType === "CHECKBOX") {
    updatedData.status = "DONE";
  } else if (existingTask.countType === "TIME") {
    if (Number() <= duration * 60_000) {
      updatedData.status = "DONE";
    } else {
      updatedData.status = "IN_PROGRESS";
    }
  }
  // Implement Quantity Check

  try {
    await db.activity.create({
      data: { date, duration: duration * 60_000, taskId },
    });

    try {
      await db.task.update({
        where: { id: existingTask.id },
        data: updatedData,
      });
      return new NextResponse("Activity created & Task Updated!", {
        status: 200,
      });
    } catch (err) {
      console.error(err);
      return new NextResponse("Something went wrong!", { status: 500 });
    }
  } catch (err) {
    console.error("[ACTIVITY]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
