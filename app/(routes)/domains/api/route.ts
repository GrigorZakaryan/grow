import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { label } = body;

  if (!label) {
    return new NextResponse("Label is missing!", { status: 400 });
  }

  await db.domain.create({ data: { label } });

  return new NextResponse("Domain created!", { status: 200 });
};
