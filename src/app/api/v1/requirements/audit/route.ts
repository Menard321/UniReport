import { NextResponse } from "next/server";
import { ComplianceAuditor } from "@/lib/report-engine/compliance-auditor";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { reportText, specification, calculations = [], diagrams = [], userId } = await req.json();

    if (!reportText || !specification) {
      return NextResponse.json(
        { error: "reportText and specification are required for compliance audit" },
        { status: 400 }
      );
    }

    const auditReport = ComplianceAuditor.audit(
      reportText,
      specification,
      calculations,
      diagrams
    );

    // If userId is provided, persist audit result to database
    if (userId) {
      try {
        await prisma.complianceAuditResult.create({
          data: {
            specificationId: specification.specificationId,
            auditScore: auditReport.overallScore,
            isCompliant: auditReport.isCompliant,
            structuralCheck: auditReport.checks.structuralCompleteness.passed,
            numericalCheck: auditReport.checks.numericalConsistency.passed,
            visualCheck: auditReport.checks.visualTraceability.passed,
            citationCheck: auditReport.checks.citationStyleAdherence.passed,
            privacyCheck: auditReport.checks.privacyAndEthicalSanity.passed,
            disciplineCheck: auditReport.checks.disciplineRequirements.passed,
            renderCheck: auditReport.checks.documentRenderSafety.passed,
            errorsJson: JSON.stringify(auditReport.errors),
            warningsJson: JSON.stringify(auditReport.warnings),
            remediationPlan: JSON.stringify(auditReport.remediationPlan),
          }
        });
      } catch (dbErr) {
        console.warn("[AUDIT_DB_PERSIST_WARNING]", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      auditReport
    });
  } catch (error: any) {
    console.error("[COMPLIANCE_AUDIT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Compliance audit failed" },
      { status: 500 }
    );
  }
}
