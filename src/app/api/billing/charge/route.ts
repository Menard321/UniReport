import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { TierLevel } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      amount, 
      planId, 
      phone, 
      provider = "M_PESA", 
      bankName, 
      bankReference,
      cardholderName,
      last4,
      cardBrand 
    } = await req.json();

    if (!amount || !planId) {
      return NextResponse.json({ error: "Missing required billing details" }, { status: 400 });
    }

    const validTiers: TierLevel[] = ["FREE", "STUDENT", "PRO", "INSTITUTIONAL"];
    if (!validTiers.includes(planId as TierLevel)) {
      return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 });
    }

    // Generate unique reference ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    let prefix = "MP";
    if (provider === "CARD") prefix = "CARD";
    else if (provider === "BANK_TRANSFER") prefix = bankName ? bankName.substring(0, 4).toUpperCase() : "BANK";
    else if (provider === "TIGO_PESA") prefix = "TG";
    else if (provider === "AIRTEL_MONEY") prefix = "AT";
    else if (provider === "HALOPESA") prefix = "HL";

    const reference = bankReference 
      ? `${prefix}-${bankReference}` 
      : provider === "CARD" && last4
        ? `${prefix}-${last4}-${Date.now().toString().slice(-4)}${randomSuffix.toString().slice(-2)}`
        : `${prefix}-${Date.now().toString().slice(-6)}${randomSuffix}`;

    // Execute atomic PostgreSQL mutation
    const result = await db.$transaction(async (tx: any) => {
      // 1. Record the Payment Transaction
      const transaction = await tx.paymentTransaction.create({
        data: {
          userId: session.userId as string,
          reference,
          amount: Number(amount),
          currency: "TZS",
          provider: provider as any,
          tier: planId as TierLevel,
          status: "SUCCESS",
          phone: phone || null,
          metadata: JSON.stringify({
            upgradedAt: new Date().toISOString(),
            channel: provider,
            bankName: bankName || null,
            bankReference: bankReference || null,
            cardholderName: cardholderName || null,
            cardLast4: last4 || null,
            cardBrand: cardBrand || null,
            verified: true
          })
        }
      });

      // 2. Upgrade the User Subscription
      const updatedSubscription = await tx.subscription.upsert({
        where: { userId: session.userId as string },
        update: {
          tier: planId as TierLevel,
          isActive: true
        },
        create: {
          userId: session.userId as string,
          tier: planId as TierLevel,
          isActive: true,
          projectsUsed: 0,
          aiTokensUsed: 0,
          storageUsedMb: 0
        }
      });

      // 3. Log Audit Activity
      await tx.activityLog.create({
        data: {
          userId: session.userId as string,
          action: "PLAN_UPGRADE",
          metadata: JSON.stringify({
            tier: planId,
            reference,
            amount,
            provider
          })
        }
      });

      // 4. Send Confirmation Notification to the Student
      await tx.notification.create({
        data: {
          userId: session.userId as string,
          title: `Subscription Activated: ${planId}`,
          message: `Your payment of ${Number(amount).toLocaleString()} TZS via ${provider} was confirmed. Ref: ${reference}`,
          type: "SUCCESS"
        }
      });

      return { transaction, subscription: updatedSubscription };
    });

    return NextResponse.json({
      success: true,
      reference: result.transaction.reference,
      tier: result.subscription.tier,
      message: "Subscription successfully upgraded."
    });

  } catch (error) {
    console.error("[BILLING_CHARGE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
