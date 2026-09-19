import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ reflectionId: string }> },
) => {
  const { reflectionId } = await params;

  if (!reflectionId)
    return new NextResponse("Missing domain Id!", { status: 400 });

  try {
    await db.relfection.delete({
      where: { id: reflectionId },
    });
    return new NextResponse("Reflection Deleted!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
