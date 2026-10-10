import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with that email" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine role based on email domain / prefix
    const role = (email.toLowerCase().endsWith("@unireport.tz") || email.toLowerCase().startsWith("admin@"))
      ? "UNIREPORT_ADMIN"
      : "STUDENT";

    // Create user in postgres
    const newUser = await db.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        passwordHash,
        role,
        subscription: {
          create: {
            tier: role === "UNIREPORT_ADMIN" ? "INSTITUTIONAL" : "FREE",
          },
        },
      },
    });

    // Create session cookie
    await createSession(newUser.id, newUser.role);

    return NextResponse.json({ 
      success: true, 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    }, { status: 201 });

  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
