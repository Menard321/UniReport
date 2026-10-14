import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { UserRole, TierLevel } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const tier = searchParams.get("tier");

    const where: any = {};
    if (role && role !== "ALL") where.role = role;
    if (tier && tier !== "ALL") {
      where.subscription = { tier };
    }

    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        role: true,
        createdAt: true,
        subscription: {
          select: {
            tier: true,
            isActive: true,
            aiTokensUsed: true,
            projectsUsed: true,
            storageUsedMb: true
          }
        },
        _count: {
          select: {
            documents: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[ADMIN_USERS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role, tier, isActive } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Update user role if provided
    if (role) {
      await db.user.update({
        where: { id: userId },
        data: { role: role as UserRole }
      });
    }

    // Update subscription details if provided
    if (tier !== undefined || isActive !== undefined) {
      const updateData: any = {};
      if (tier) updateData.tier = tier as TierLevel;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      await db.subscription.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          tier: (tier as TierLevel) || "FREE",
          isActive: isActive !== undefined ? Boolean(isActive) : true
        }
      });
    }

    // Audit log entry
    await db.activityLog.create({
      data: {
        userId: session.userId as string,
        action: "ADMIN_USER_MODIFICATION",
        metadata: JSON.stringify({ targetUserId: userId, role, tier, isActive })
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
