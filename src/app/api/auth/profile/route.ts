import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    // Check if new email is already taken by someone else
    const existing = await db.user.findUnique({ where: { email } });
    if (existing && existing.id !== session.userId) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 409 });
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId as string },
      data: { name, email }
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email } 
    });

  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
