import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const provider = searchParams.get("provider");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (provider && provider !== "ALL") where.provider = provider;

    const transactions = await db.paymentTransaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("[ADMIN_PAYMENTS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Transaction ID and status are required" }, { status: 400 });
    }

    const updated = await db.paymentTransaction.update({
      where: { id },
      data: { status: status as PaymentStatus }
    });

    // Log admin action in activity log
    await db.activityLog.create({
      data: {
        userId: session.userId as string,
        action: "ADMIN_PAYMENT_STATUS_UPDATE",
        metadata: JSON.stringify({ transactionId: id, newStatus: status })
      }
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error("[ADMIN_PAYMENTS_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
