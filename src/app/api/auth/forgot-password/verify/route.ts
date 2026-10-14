import { NextResponse } from "next/server";
import { verifyChallengeCode } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = (body.ticket || "").trim();
    const code = (body.code || "").trim();

    if (!ticket) {
      return NextResponse.json(
        { error: "Verification session missing. Please start the recovery process again." },
        { status: 400 }
      );
    }

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit verification code." },
        { status: 400 }
      );
    }

    const result = await verifyChallengeCode(ticket, code);

    if (!result.valid || !result.resetToken) {
      return NextResponse.json(
        { error: result.error || "The 6-digit verification code is invalid or has expired." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Code verified successfully.",
      resetToken: result.resetToken,
    });
  } catch (err: any) {
    console.error("Forgot password verify error:", err);
    return NextResponse.json(
      { error: "Unable to verify code. Please try again." },
      { status: 500 }
    );
  }
}
