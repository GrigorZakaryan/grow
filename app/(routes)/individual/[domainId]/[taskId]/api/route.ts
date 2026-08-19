import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> },
) => {
  const { taskId } = await params;
  const body = await req.json();

  const task = await db.task.findUnique({ where: { id: taskId } });

  if (!task) {
    return new NextResponse("Task was not found!", { status: 404 });
  }

  let updateData = {};

  // Handle specific logic based on countType
  switch (task.countType) {
    case "CHECKBOX":
      if (typeof body.checked !== "boolean") {
        return new NextResponse("Invalid or missing checked status", {
          status: 400,
        });
      }
      updateData = { checked: body.checked, status: "DONE" };
      break;

    case "QTY":
      if (typeof body.qty !== "number") {
        return new NextResponse("Invalid or missing quantity", { status: 400 });
      }

      updateData = {
        qty: (task.qty ?? 0) + body.qty,
        status:
          (task.qty ?? 0) + body.qty >= (task.finalQty ?? 0)
            ? "DONE"
            : "IN_PROGRESS",
      };
      break;

    case "TIME":
      if (typeof body.time !== "number") {
        return new NextResponse("Invalid or missing time", { status: 400 });
      }

      updateData = {
        timeMS: (task.timeMS ?? 0) + body.time,
        status:
          (task.timeMS ?? 0) + body.time >= (task.finalTimeMS ?? 0)
            ? "DONE"
            : "IN_PROGRESS",
      };
      break;

    default:
      return new NextResponse("Unknown count type", { status: 400 });
  }

  const updatedTask = await db.task.update({
    where: { id: task.id },
    data: updateData,
  });

  return NextResponse.json(updatedTask, { status: 200 });
};
