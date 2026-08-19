import db from "@/lib/db";
import { JSONContent } from "@tiptap/core";
import { NextRequest, NextResponse } from "next/server";
import initialContent from "@/components/tiptap-templates/simple/data/content.json";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const { domainId } = await params;

  let title = "Untitled Document";

  try {
    const doc = await db.relfection.create({
      data: { title, content: initialContent, domainId },
    });
    return NextResponse.json(doc, { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!");
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ domainId: string }> },
) => {
  const body = await req.json();
  const { domainId } = await params;
  const { content, docId }: { content: JSONContent; docId: string } = body;

  let title = "Untitled Document";

  if (content.content && content.content?.length > 0) {
    if (content.content[0].content && content.content[0].content.length > 0)
      if (
        content.content[0].content[0].text &&
        content.content[0].content[0].text !== ""
      ) {
        title = content.content[0].content[0].text;
      }
  }

  if (!content) {
    return new NextResponse("Content is missing!", { status: 400 });
  }

  try {
    await db.relfection.upsert({
      where: { id: docId },
      update: { title, content },
      create: { title, content, domainId },
    });
    return new NextResponse("Document saved!", { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!");
  }
};
