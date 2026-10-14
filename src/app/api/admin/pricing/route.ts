import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getSystemPricing, updateSystemPricing, resetSystemPricingToDefaults } from "@/lib/pricing-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const pricing = await getSystemPricing();
    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error) {
    console.error("[ADMIN_PRICING_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to load pricing configuration" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const adminIdentifier = (session.userId as string) || "System Administrator";

    if (body.reset === true) {
      const resetPricing = await resetSystemPricingToDefaults(adminIdentifier);
      return NextResponse.json({
        success: true,
        message: "Pricing successfully reset to platform defaults.",
        pricing: resetPricing,
      });
    }

    const updatedPricing = await updateSystemPricing(
      {
        singleDocumentExportTzs: body.singleDocumentExportTzs,
        studentMonthlyTzs: body.studentMonthlyTzs,
        proMonthlyTzs: body.proMonthlyTzs,
        institutionalYearlyTzs: body.institutionalYearlyTzs,
      },
      adminIdentifier
    );

    console.log(
      `[ADMIN PRICING UPDATE] Admin updated rates: Single Report Export = ${updatedPricing.singleDocumentExportTzs} TZS, Student = ${updatedPricing.studentMonthlyTzs} TZS`
    );

    return NextResponse.json({
      success: true,
      message: "Pricing configuration successfully updated.",
      pricing: updatedPricing,
    });
  } catch (error: any) {
    console.error("[ADMIN_PRICING_POST_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update pricing configuration" },
      { status: 500 }
    );
  }
}
