import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  _: any,
  { params }: { params: Promise<{ activityId: string }> },
) => {
  const { activityId } = await params;

  if (!activityId) {
    return new NextResponse("Activity Id is missing!");
  }

  try {
    await db.activity.delete({ where: { id: activityId } });
    return new NextResponse("Activity Deleted!", { status: 200 });
  } catch (err) {
    console.error("[ACTIVTY DELETE]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ activityId: string }> },
) => {
  const body = await req.json();
  const { activityId } = await params;

  const { taskId, date } = body;
  let { duration } = body;

  if (!taskId) {
    return new NextResponse("Task Id is missing!");
  }

  if (!date) {
    return new NextResponse("Date is missing!");
  }

  if (!duration || duration < 5) {
    duration = 10;
  }

  try {
    await db.activity.update({
      where: { id: activityId },
      data: { date, duration: duration * 60_000, taskId },
    });
    return new NextResponse("Activity created!", { status: 200 });
  } catch (err) {
    console.error("[ACTIVITY UPDATE]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
