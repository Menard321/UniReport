import { NextResponse } from "next/server";
import { CalculationEngine } from "@/lib/calculations/engine";

export async function POST(req: Request) {
  try {
    const { formulaCode, inputs, assumptions } = await req.json();

    if (!formulaCode) {
      return NextResponse.json({ error: "formulaCode is required" }, { status: 400 });
    }

    const result = CalculationEngine.calculate(formulaCode, inputs || {}, assumptions || []);

    return NextResponse.json({
      success: true,
      calculation: result
    });
  } catch (error: any) {
    console.error("[CALCULATION_ERROR]", error);
    return NextResponse.json({ error: error.message || "Calculation failed" }, { status: 400 });
  }
}
