import { NextResponse } from "next/server";
import { RequirementsResolver } from "@/lib/requirements/resolver";
import { DiagramEngine } from "@/lib/diagrams/generator";
import { CalculationEngine } from "@/lib/calculations/engine";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      universityId,
      programmeId,
      specialization,
      reportType,
      reportTitle,
      studentName,
      regNumber,
      assignmentInstructions,
      requestedCitationStyle,
      requestedWordBudget,
      uploadedEvidenceNotes,
    } = body;

    if (!universityId || !reportType || !reportTitle) {
      return NextResponse.json(
        { error: "universityId, reportType, and reportTitle are required" },
        { status: 400 }
      );
    }

    // 1. Resolve layered requirements specification
    const spec = RequirementsResolver.resolve({
      universityId,
      programmeId: programmeId || "coict-cs",
      specialization,
      reportType,
      reportTitle,
      studentName,
      regNumber,
      assignmentInstructions,
      requestedCitationStyle,
      requestedWordBudget,
      uploadedEvidenceNotes,
    });

    // 2. Pre-compile required diagrams if any
    const compiledDiagrams = spec.requiredDiagrams.map((diagType) => {
      return DiagramEngine.generate({
        diagramType: diagType as any,
        title: `${diagType.replace(/_/g, " ")} for ${spec.metadata.reportTitle}`,
        caption: `Figure: Architecture and Design Specifications`,
        data: {
          systemName: spec.metadata.reportTitle,
          actors: ["Student", "Faculty Supervisor", "Platform Admin"],
        },
      });
    });

    // 3. Pre-compile required calculations if any
    const compiledCalculations = spec.requiredCalculations.map((calcCode) => {
      try {
        return CalculationEngine.calculate(calcCode, {});
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      specification: spec,
      compiledDiagrams,
      compiledCalculations,
    });
  } catch (error: any) {
    console.error("[REQUIREMENTS_RESOLVE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to resolve requirements" },
      { status: 500 }
    );
  }
}
