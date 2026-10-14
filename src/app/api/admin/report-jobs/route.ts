import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") where.status = status;

    const reportPlans = await db.reportPlan.findMany({
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
        sections: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            status: true,
            qaScore: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ jobs: reportPlans });
  } catch (error) {
    console.error("[ADMIN_REPORT_JOBS_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, status } = await req.json();

    if (!jobId || !status) {
      return NextResponse.json({ error: "Job ID and status are required" }, { status: 400 });
    }

    const updated = await db.reportPlan.update({
      where: { id: jobId },
      data: { status }
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error("[ADMIN_REPORT_JOBS_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
