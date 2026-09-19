import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const reflections = await db.relfection.findMany();
    return NextResponse.json(reflections, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
