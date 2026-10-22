import { NextResponse } from "next/server";
import { UniversityTemplateService } from "@/lib/services/university-template-service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const university = searchParams.get("university") || searchParams.get("university_id");
    const reportType = searchParams.get("report_type") || searchParams.get("report_type_id") || "FIELDWORK";

    if (!university) {
      return NextResponse.json(
        { success: false, error: "University parameter is required" },
        { status: 400 }
      );
    }

    const college = searchParams.get("college") || undefined;
    const programme = searchParams.get("programme") || undefined;
    const academicDiscipline = searchParams.get("discipline") || undefined;

    const resolved = await UniversityTemplateService.resolveTemplate({
      universityIdOrShortName: university,
      reportTypeCode: reportType,
      college,
      programme,
      academicDiscipline
    });

    if (!resolved) {
      return NextResponse.json(
        { success: false, error: "No matching template found for institution" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resolved,
    });
  } catch (error) {
    console.error("[API_TEMPLATES_RESOLVE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve template" },
      { status: 500 }
    );
  }
}
