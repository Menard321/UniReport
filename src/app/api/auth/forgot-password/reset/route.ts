import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyResetToken } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resetToken = (body.resetToken || "").trim();
    const newPassword = body.newPassword || "";

    if (!resetToken) {
      return NextResponse.json(
        { error: "Authorization expired. Please restart the password reset process." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Verify reset token authorization
    const userId = await verifyResetToken(resetToken);
    if (!userId) {
      return NextResponse.json(
        { error: "Reset authorization has expired or is invalid. Please request a new code." },
        { status: 401 }
      );
    }

    // Hash the new password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update user record in PostgreSQL
    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    console.log(`[UniReportTZ PASSWORD RESET] Password successfully updated for user: ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully updated. You can now sign in.",
    });
  } catch (err: any) {
    console.error("Forgot password reset error:", err);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}
