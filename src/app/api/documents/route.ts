import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

// GET ALL DOCUMENTS FOR CURRENT USER
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: { userId: session.userId as string },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, documents }, { status: 200 });
  } catch (error) {
    console.error("[DOCUMENTS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// CREATE A NEW DOCUMENT
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, toolType } = await req.json();

    if (!title || !content || !toolType) {
      return NextResponse.json({ error: "Missing required fields (title, content, toolType)" }, { status: 400 });
    }

    // Optional: We can calculate approximate storage size in kb
    const storageSizeKb = Buffer.byteLength(content, 'utf8') / 1024;

    const document = await db.document.create({
      data: {
        userId: session.userId as string,
        title,
        content,
        toolType,
        storageSizeKb,
      },
    });

    // We can also update subscription usage metrics here
    await db.subscription.update({
      where: { userId: session.userId as string },
      data: {
        projectsUsed: { increment: 1 },
      }
    });

    return NextResponse.json({ success: true, document }, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENTS_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
