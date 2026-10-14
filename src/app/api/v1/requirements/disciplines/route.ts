import { NextResponse } from "next/server";
import { DisciplineRegistry } from "@/lib/disciplines/registry";

export async function GET() {
  try {
    const profiles = DisciplineRegistry.getAllProfiles();
    return NextResponse.json({
      success: true,
      disciplines: profiles
    });
  } catch (error) {
    console.error("[DISCIPLINES_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to load discipline registry" }, { status: 500 });
  }
}
