import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query sections that have flagged QA scores or are under revision
    const flaggedSections = await db.reportSection.findMany({
      where: {
        OR: [
          { status: "NEEDS_REVISION" },
          { qaScore: { lt: 75 } }
        ]
      },
      include: {
        plan: {
          select: {
            id: true,
            title: true,
            institution: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const issues = (flaggedSections as any[]).map((sec: any) => ({
      id: sec.id,
      reportId: sec.plan.id,
      topic: sec.plan.title,
      institution: sec.plan.institution,
      studentName: sec.plan.user?.name || "Scholar",
      studentEmail: sec.plan.user?.email || "",
      issueType: sec.qaScore && sec.qaScore < 50 ? "CITATION_MISMATCH" : "FORMAT_VIOLATION",
      severity: sec.qaScore && sec.qaScore < 50 ? "HIGH" : "MEDIUM",
      status: sec.status === "NEEDS_REVISION" ? "OPEN" : "REVIEWED",
      detectedAt: sec.updatedAt,
      chapterTitle: `Chapter ${sec.chapterNumber}: ${sec.title}`,
      qaScore: sec.qaScore || 0,
      excerptSnippet: sec.content ? sec.content.substring(0, 150) + "..." : "Section drafted with missing guideline verifications.",
      automatedNote: `Automated QA compliance evaluation scored this chapter at ${sec.qaScore || 0}%. Requires institutional formatting revision.`
    }));

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("[ADMIN_QUALITY_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId, status } = await req.json();

    if (!sectionId) {
      return NextResponse.json({ error: "Section ID is required" }, { status: 400 });
    }

    const updated = await db.reportSection.update({
      where: { id: sectionId },
      data: {
        status: status || "APPROVED",
        qaScore: 90
      }
    });

    return NextResponse.json({ success: true, section: updated });
  } catch (error) {
    console.error("[ADMIN_QUALITY_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
