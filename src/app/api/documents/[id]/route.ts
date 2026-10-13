import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET SINGLE DOCUMENT BY ID
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    const document = await db.document.findFirst({
      where: {
        id,
        userId: session.userId as string,
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, document }, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_GET_BY_ID_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE DOCUMENT CONTENT & TITLE
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content } = body;

    const existingDoc = await db.document.findFirst({
      where: {
        id,
        userId: session.userId as string,
      },
    });

    if (!existingDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const storageSizeKb = content ? Buffer.byteLength(content, "utf8") / 1024 : existingDoc.storageSizeKb;

    const updatedDocument = await db.document.update({
      where: { id },
      data: {
        title: title || existingDoc.title,
        content: content !== undefined ? content : existingDoc.content,
        storageSizeKb,
      },
    });

    return NextResponse.json({ success: true, document: updatedDocument }, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENT_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
