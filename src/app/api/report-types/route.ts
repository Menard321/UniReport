import { NextResponse } from "next/server";
import { UniversityTemplateService } from "@/lib/services/university-template-service";

export async function GET() {
  try {
    const reportTypes = await UniversityTemplateService.getReportTypes();
    return NextResponse.json({
      success: true,
      data: reportTypes,
    });
  } catch (error) {
    console.error("[API_REPORT_TYPES_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report types" },
      { status: 500 }
    );
  }
}
