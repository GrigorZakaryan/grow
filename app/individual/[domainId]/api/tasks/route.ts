import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const body = await req.json();
  const { domainId } = await params;
  const { label, type, countType, finalScore } = body;
  let { deadline, frequency } = body;

  if (!label) return new NextResponse("Missing Label!", { status: 400 });

  if (type === "ONE_TIME" && !deadline)
    return new NextResponse("Missing deadline!", { status: 400 });

  if (countType !== "CHECKBOX" && !finalScore)
    return new NextResponse("Final Score is missing!", { status: 400 });

  if (type === "REPEATING") {
    deadline = undefined;
  } else if (type === "ONE_TIME") {
    frequency = undefined;
  }

  try {
    await db.task.create({
      data: {
        label,
        deadline,
        frequency,
        countType,
        finalScore,
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
