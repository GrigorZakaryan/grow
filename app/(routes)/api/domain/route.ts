import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const domains = await db.domain.findMany({
      include: { tasks: { include: { activity: true } } },
    });

    if (domains.length === 0 || !domains)
      return new NextResponse("No domain found!", { status: 404 });

    return NextResponse.json(domains, { status: 200 });
  } catch (err) {
    console.error("[DOMAINS GET ALL]", err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
