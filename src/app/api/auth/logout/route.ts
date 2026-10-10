import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
