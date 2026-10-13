import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Total users
    const totalStudents = await db.user.count({ where: { role: "STUDENT" } });
    const totalUsers = await db.user.count();

    // 2. University distribution
    const usersByUni = await db.user.groupBy({
      by: ["university"],
      _count: {
        id: true
      },
      where: {
        university: {
          not: null
        }
      }
    });

    const universityAdoption = usersByUni.map((item) => ({
      name: item.university || "Other",
      students: item._count.id,
      share: totalUsers > 0 ? `${Math.round((item._count.id / totalUsers) * 100)}%` : "0%"
    }));

    // 3. Document types distribution
    const docsByType = await db.document.groupBy({
      by: ["toolType"],
      _count: {
        id: true
      }
    });

    const totalDocs = await db.document.count();

    const reportTypeDistribution = docsByType.map((item) => {
      const count = item._count.id;
      return {
        type: item.toolType,
        count,
        pct: totalDocs > 0 ? `${Math.round((count / totalDocs) * 100)}%` : "0%"
      };
    });

    // 4. Token metrics
    const tokenAgg = await db.subscription.aggregate({
      _sum: {
        aiTokensUsed: true
      }
    });
    const totalAiTokens = tokenAgg._sum.aiTokensUsed || 0;

    return NextResponse.json({
      totalStudents,
      totalUsers,
      totalDocs,
      totalAiTokens,
      universityAdoption,
      reportTypeDistribution
    });
  } catch (error) {
    console.error("[ADMIN_ANALYTICS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
