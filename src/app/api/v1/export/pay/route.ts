import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, paymentMethod, phoneNumber } = body;

    // Simulate Mobile Money / Card Payment Verification (M-Pesa, Tigo Pesa, Airtel Money)
    console.log(`[PAYMENT ENGINE] Processing ${paymentMethod} for User ${session.userId}, Doc: ${documentId}`);

    if (documentId) {
      await db.document.update({
        where: { id: documentId, userId: session.userId as string },
        data: { isPaid: true }
      });
    } else {
      // Upgrade subscription
      await db.subscription.update({
        where: { userId: session.userId as string },
        data: { tier: "PRO", isActive: true }
      });
    }

    // Record Activity
    await db.activityLog.create({
      data: {
        userId: session.userId as string,
        action: "DOCUMENT_UNLOCK_PAYMENT",
        metadata: JSON.stringify({ documentId, paymentMethod, amountTzs: 5000 })
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payment processed successfully. Document download unlocked!"
    });

  } catch (error) {
    console.error("[PAYMENT_API_ERROR]", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
