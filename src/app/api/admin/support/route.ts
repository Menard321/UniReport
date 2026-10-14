import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { TicketStatus, TicketPriority } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (priority && priority !== "ALL") where.priority = priority;

    const tickets = await db.supportTicket.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true
          }
        },
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("[ADMIN_SUPPORT_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, text, statusUpdate } = await req.json();

    if (!ticketId || !text) {
      return NextResponse.json({ error: "Ticket ID and message text are required" }, { status: 400 });
    }

    // Append staff reply to ticket
    const message = await db.ticketMessage.create({
      data: {
        ticketId,
        sender: "SUPPORT_AGENT",
        text
      }
    });

    // Update ticket status
    const newStatus = (statusUpdate as TicketStatus) || "IN_PROGRESS";
    const updatedTicket = await db.supportTicket.update({
      where: { id: ticketId },
      data: { status: newStatus },
      include: { user: true }
    });

    // Create Notification for the student
    if (updatedTicket.userId) {
      await db.notification.create({
        data: {
          userId: updatedTicket.userId,
          title: `Reply to Ticket: ${updatedTicket.subject}`,
          message: `Support agent: "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"`,
          type: "INFO"
        }
      });
    }

    return NextResponse.json({ success: true, message, ticket: updatedTicket });
  } catch (error) {
    console.error("[ADMIN_SUPPORT_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticketId, status, priority } = await req.json();

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const data: any = {};
    if (status) data.status = status as TicketStatus;
    if (priority) data.priority = priority as TicketPriority;

    const updated = await db.supportTicket.update({
      where: { id: ticketId },
      data
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error("[ADMIN_SUPPORT_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
