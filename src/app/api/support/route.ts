import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { TicketPriority } from "@prisma/client";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ tickets: [] });
    }

    const tickets = await db.supportTicket.findMany({
      where: { userId: session.userId as string },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("[GET_STUDENT_SUPPORT_ERROR]", error);
    return NextResponse.json({ tickets: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, category, message, priority = "MEDIUM", institution } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: session.userId as string }
    });

    const ticket = await db.supportTicket.create({
      data: {
        userId: session.userId as string,
        subject,
        category: category || "GENERAL_INQUIRY",
        priority: priority as TicketPriority,
        institution: institution || user?.university || null,
        status: "OPEN",
        messages: {
          create: {
            sender: "STUDENT",
            text: message
          }
        }
      },
      include: {
        messages: true
      }
    });

    // Create Activity Log
    await db.activityLog.create({
      data: {
        userId: session.userId as string,
        action: "SUPPORT_TICKET_CREATED",
        metadata: JSON.stringify({ ticketId: ticket.id, subject })
      }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("[CREATE_SUPPORT_TICKET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
