import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// app/individual/[domainId]/api/tasks/route.ts

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const body = await req.json();
  const { domainId } = await params;
  const { label, type, countType, description, finalQty, finalTimeMS } = body;
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
        finalTimeMS: countType === "TIME" ? finalTimeMS : null,
        checked: countType === "CHECKBOX" ? false : null,
      },
    });

    return new NextResponse("Task created!", { status: 200 });
  } catch (err) {
    console.error("Task Creation: ", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
