import { NextResponse } from "next/server";
import { UniversityTemplateService } from "@/lib/services/university-template-service";

export async function GET(req: Request) {
  try {
    const universities = await UniversityTemplateService.getUniversities();
    return NextResponse.json({
      success: true,
      data: universities,
    });
  } catch (error) {
    console.error("[API_UNIVERSITIES_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}
