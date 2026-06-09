import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const body = await req.json();
  const { domainId } = await params;
  const { label, type } = body;
  let { deadline } = body;

  if (!label) return new NextResponse("Missing Label!", { status: 400 });

  if (type === "ONE_TIME" && !deadline)
    return new NextResponse("Missing deadline!", { status: 400 });

  if (type === "REPEATING") deadline = undefined;

  try {
    await db.task.create({
      data: {
        label,
        deadline,
        type,
        status: "UPCOMING",
        domainId,
      },
    });

    return new NextResponse("Task created!", { status: 200 });
  } catch (err) {
    console.error("Task Creation: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
