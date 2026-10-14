import { NextResponse } from "next/server";
import { getSystemPricing } from "@/lib/pricing-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pricing = await getSystemPricing();
    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (err: any) {
    console.error("Failed to retrieve public pricing:", err);
    return NextResponse.json(
      { error: "Failed to retrieve active pricing." },
      { status: 500 }
    );
  }
}
