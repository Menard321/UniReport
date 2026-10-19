import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId as string },
      select: { id: true, name: true, email: true, phone: true, role: true, university: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[PROFILE_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if new email is already taken by someone else
    const existing = await db.user.findUnique({ where: { email } });
    if (existing && existing.id !== session.userId) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 409 });
    }

    const normalizedPhone = phone ? phone.trim() : null;
    if (normalizedPhone) {
      const existingPhone = await db.user.findFirst({
        where: { phone: normalizedPhone, NOT: { id: session.userId as string } }
      });
      if (existingPhone) {
        return NextResponse.json({ error: "Phone number is already associated with another account" }, { status: 409 });
      }
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId as string },
      data: { name, email, phone: normalizedPhone }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone } 
    });

  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
