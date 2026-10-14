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
    const { 
      documentId, 
      paymentMethod = "M-Pesa", 
      phoneNumber, 
      bankName, 
      bankReference,
      cardholderName,
      last4,
      cardBrand 
    } = body;

    // Map method string to Prisma PaymentProvider enum
    let provider = "M_PESA";
    if (paymentMethod.includes("Tigo")) provider = "TIGO_PESA";
    else if (paymentMethod.includes("Airtel")) provider = "AIRTEL_MONEY";
    else if (paymentMethod.includes("Halo")) provider = "HALOPESA";
    else if (paymentMethod.includes("Card")) provider = "CARD";
    else if (paymentMethod.includes("Bank") || paymentMethod.includes("CRDB") || paymentMethod.includes("NMB")) provider = "BANK_TRANSFER";

    const reference = bankReference 
      ? `TZ-BK-${bankReference}` 
      : provider === "CARD" && last4
        ? `TZ-CARD-${last4}-${Date.now().toString().slice(-4)}`
        : `TZ-DOC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { getSystemPricing } = await import("@/lib/pricing-service");
    const pricing = await getSystemPricing();
    const chargeAmount = pricing.singleDocumentExportTzs;

    // 1. Create live PaymentTransaction record
    const transaction = await db.paymentTransaction.create({
      data: {
        userId: session.userId as string,
        reference,
        amount: chargeAmount,
        currency: "TZS",
        provider: provider as any,
        tier: "STUDENT" as any,
        status: "SUCCESS" as any,
        phone: phoneNumber || null,
        metadata: JSON.stringify({ 
          documentId, 
          paymentMethod,
          amountTzs: chargeAmount,
          cardholderName: cardholderName || null,
          cardLast4: last4 || null,
          cardBrand: cardBrand || null,
          bankName: bankName || null,
          bankReference: bankReference || null
        })
      }
    });

    // 2. Mark document as isPaid: true
    if (documentId) {
      await db.document.update({
        where: { id: documentId, userId: session.userId as string },
        data: { isPaid: true } as any
      });
    }

    // 3. Dispatch in-app student notification
    await db.notification.create({
      data: {
        userId: session.userId as string,
        title: "Document Unlocked Successfully",
        message: `Your payment of TZS 5,000 via ${paymentMethod} (${reference}) was confirmed. Full PDF export and text copying are now available.`,
        type: "SUCCESS"
      }
    });

    // 4. Record ActivityLog
    await db.activityLog.create({
      data: {
        userId: session.userId as string,
        action: "DOCUMENT_UNLOCK_PAYMENT",
        metadata: JSON.stringify({ documentId, reference, paymentMethod, amountTzs: chargeAmount })
      }
    });

    return NextResponse.json({
      success: true,
      reference,
      message: "Payment confirmed. PDF, Word download, and copying unlocked!",
      transaction
    });

  } catch (error) {
    console.error("[PAYMENT_API_ERROR]", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
