import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const { domainId } = await params;
  const body = await req.json();

  const { label } = body;

  const existingDomain = await db.domain.findUnique({
    where: { id: domainId },
  });

  if (!existingDomain) {
    return new NextResponse("Domain doesn't exist!", { status: 404 });
  }

  try {
    await db.project.create({ data: { label, domainId } });
    return new NextResponse("Project created successfully!");
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
};
