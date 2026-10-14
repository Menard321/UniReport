import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPhoneLookupVariants } from "@/lib/auth-utils";
import { createChallengeTicket, generateOtpCode, maskIdentifier } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawIdentifier = (body.identifier || "").trim();

    if (!rawIdentifier) {
      return NextResponse.json(
        { error: "Please enter your registered email or phone number." },
        { status: 400 }
      );
    }

    let user = null;

    if (rawIdentifier.includes("@")) {
      user = await db.user.findUnique({
        where: { email: rawIdentifier.toLowerCase() },
      });
    } else {
      const phoneVariants = getPhoneLookupVariants(rawIdentifier);
      user = await db.user.findFirst({
        where: {
          OR: [
            { phone: { in: phoneVariants } },
            { email: rawIdentifier.toLowerCase() },
          ],
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this email address or phone number." },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code & signed challenge ticket
    const otpCode = generateOtpCode();
    const destination = user.email || user.phone || rawIdentifier;
    const ticket = await createChallengeTicket(user.id, destination, otpCode);
    const maskedTarget = maskIdentifier(destination);

    // In a production setup, dispatch SMS via local aggregator (e.g. Beem) or Email via SMTP/Resend
    // In development mode, provide convenience logging and dev helper response
    const isDev = process.env.NODE_ENV !== "production";
    console.log(`\n======================================================`);
    console.log(`[UniReportTZ PASSWORD RESET OTP]`);
    console.log(`User: ${user.name || user.email} (${user.id})`);
    console.log(`Destination: ${destination}`);
    console.log(`Code: >>> ${otpCode} <<<`);
    console.log(`Expires in: 15 minutes`);
    console.log(`======================================================\n`);

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${maskedTarget}.`,
      maskedTarget,
      ticket,
      // Provide devCode in development to allow instant one-click testing without SMS gateway
      ...(isDev ? { devCode: otpCode } : {}),
    });
  } catch (err: any) {
    console.error("Forgot password request error:", err);
    return NextResponse.json(
      { error: "Unable to process password reset request. Please try again." },
      { status: 500 }
    );
  }
}
