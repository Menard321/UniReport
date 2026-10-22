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
    const { documentId, format = "doc", options } = body;

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

    // Check backend payment entitlement
    // PRO or INSTITUTIONAL tier users or documents marked isPaid === true are authorized
    const isUserPro = userSubscription?.tier === "PRO" || userSubscription?.tier === "INSTITUTIONAL";
    const isDocumentPaid = documentRecord ? Boolean((documentRecord as any).isPaid) : false;
    const isAuthorized = isUserPro || isDocumentPaid;

    if (!isAuthorized) {
      const { getSystemPricing } = await import("@/lib/pricing-service");
      const pricing = await getSystemPricing();
      const formattedPrice = new Intl.NumberFormat("en-TZ").format(pricing.singleDocumentExportTzs);

      return NextResponse.json(
        {
          error: `Payment Required: Complete mobile payment (TZS ${formattedPrice}) or upgrade to PRO to download this document.`,
          requiresPayment: true,
          priceTzs: pricing.singleDocumentExportTzs,
          documentId: documentRecord?.id || null
        },
        { status: 402 }
      );
    }

    const exportOptions = {
      title: options?.title || documentRecord?.title || "Academic Report",
      institution: options?.institution || "Higher Learning Institution",
      institutionShortName: options?.institutionShortName,
      logoUrl: options?.logoUrl,
      faculty: options?.faculty || "",
      department: options?.department,
      programme: options?.programme || "",
      studentName: options?.studentName || "",
      registrationNumber: options?.registrationNumber || "",
      yearOfStudy: options?.yearOfStudy || "",
      organization: options?.organization || "",
      supervisorName: options?.supervisorName || options?.fieldSupervisor || "Supervisor",
      fieldSupervisor: options?.fieldSupervisor,
      universitySupervisor: options?.universitySupervisor,
      academicYear: options?.academicYear || "2024/2025",
      attachmentPeriod: options?.attachmentPeriod,
      submissionDate: options?.submissionDate,
      reportType: options?.reportType,
      discipline: options?.discipline,
      content: options?.content || documentRecord?.content || "# ACADEMIC REPORT DRAFT"
    };

    if (format !== "doc") {
      const pdfHtml = DocxCompilerEngine.compileToPdfHtml(exportOptions);
      return NextResponse.json({
        success: true,
        isPaidAuthorized: true,
        format: "pdf",
        pdfHtml,
        filename: `${exportOptions.title.replace(/\s+/g, "_")}.pdf`
      });
    }

    // Fallback if explicitly requested (.doc)
    const wordContentHtml = DocxCompilerEngine.compileToWordHtml(exportOptions);
    return NextResponse.json({
      success: true,
      isPaidAuthorized: true,
      format: "doc",
      htmlDocument: wordContentHtml,
      filename: `${exportOptions.title.replace(/\s+/g, "_")}.doc`
    });

  } catch (error) {
    console.error("[EXPORT_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to export document" }, { status: 500 });
  }
}
