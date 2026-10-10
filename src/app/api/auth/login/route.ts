import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the user
    let user = await db.user.findUnique({
      where: { email },
    });

    // Auto-provision default admin user if logging in with admin@unireport.tz for the first time
    if (!user && email.toLowerCase() === "admin@unireport.tz") {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("admin123", salt);
      user = await db.user.create({
        data: {
          email: "admin@unireport.tz",
          name: "System Administrator",
          passwordHash,
          role: "UNIREPORT_ADMIN",
          subscription: {
            create: { tier: "INSTITUTIONAL" }
          }
        }
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Create session cookie
    await createSession(user.id, user.role);

    const redirectTo = user.role === "UNIREPORT_ADMIN" ? "/admin" : "/dashboard";

    return NextResponse.json({ 
      success: true, 
      redirectTo,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, { status: 200 });

  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
