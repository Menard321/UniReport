import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { DocxCompilerEngine } from "@/lib/export/docx-compiler";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized: Download requires active session" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId, options } = body;

    // Fetch user subscription tier & document status
    const userSubscription = await db.subscription.findUnique({
      where: { userId: session.userId as string }
    });

    let documentRecord = null;
    if (documentId) {
      documentRecord = await db.document.findUnique({
        where: { id: documentId, userId: session.userId as string }
      });
    }

    // Check backend payment entitlement (Requirement 12)
    // PRO or INSTITUTIONAL tier users or documents marked isPaid === true are authorized
    const isUserPro = userSubscription?.tier === "PRO" || userSubscription?.tier === "INSTITUTIONAL";
    const isDocumentPaid = documentRecord ? documentRecord.isPaid : false;
    const isAuthorized = isUserPro || isDocumentPaid;

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: "Payment Required: Upgrade to Pro or unlock this report to download the full editable .DOC file.",
          requiresPayment: true,
          priceTzs: 5000,
          documentId: documentRecord?.id || null
        },
        { status: 402 }
      );
    }

    // Compile Microsoft Word Document payload for authorized user
    const wordContentHtml = DocxCompilerEngine.compileToWordHtml({
      title: options?.title || documentRecord?.title || "Academic Report",
      institution: options?.institution || "University of Dar es Salaam (UDSM)",
      faculty: options?.faculty || "College of Information and Communication Technologies",
      programme: options?.programme || "BSc in Computer Science",
      supervisorName: options?.supervisorName || "Eng. J. Mkasanga",
      academicYear: options?.academicYear || "2025/2026",
      content: options?.content || documentRecord?.content || "# ACADEMIC REPORT DRAFT"
    });

    return NextResponse.json({
      success: true,
      isPaidAuthorized: true,
      htmlDocument: wordContentHtml,
      filename: `${(options?.title || "Academic_Report").replace(/\s+/g, "_")}.doc`
    });

  } catch (error) {
    console.error("[EXPORT_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to export document" }, { status: 500 });
  }
}
