import db from "@/lib/db";
import { NextResponse } from "next/server";

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
