import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

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
    await db.activity.create({
      data: { date, duration: duration * 60_000, taskId },
    });
    return new NextResponse("Activity created!", { status: 200 });
  } catch (err) {
    console.error("[ACTIVITY]: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
