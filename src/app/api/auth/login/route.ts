import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { getPhoneLookupVariants } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const identifier = (body.identifier || body.email || body.phone || "").trim();
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Please enter your email or phone number and password" }, { status: 400 });
    }

    let user = null;

    if (identifier.includes("@")) {
      // Find the user by email
      user = await db.user.findUnique({
        where: { email: identifier.toLowerCase() },
      });
    } else {
      // Find the user by phone number variants or email
      const phoneVariants = getPhoneLookupVariants(identifier);
      user = await db.user.findFirst({
        where: {
          OR: [
            { phone: { in: phoneVariants } },
            { email: identifier.toLowerCase() },
          ],
        },
      });
    }

    // Auto-provision default admin user if logging in with admin@unireport.tz for the first time
    if (!user && identifier.toLowerCase() === "admin@unireport.tz") {
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
      return NextResponse.json({ error: "Invalid email, phone number, or password" }, { status: 401 });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email, phone number, or password" }, { status: 401 });
    }

    // Create session cookie
    await createSession(user.id, user.role);

    const redirectTo = user.role === "UNIREPORT_ADMIN" ? "/admin" : "/dashboard";

    return NextResponse.json({ 
      success: true, 
      redirectTo,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role 
      }
    }, { status: 200 });

  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
