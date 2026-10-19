import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";
import { normalizePhone, isValidPhoneNumber, getPhoneLookupVariants } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await req.json();

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists with that email
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with that email" }, { status: 409 });
    }

    let normalizedPhone: string | null = null;
    if (phone && phone.trim()) {
      if (!isValidPhoneNumber(phone)) {
        return NextResponse.json({ error: "Please enter a valid phone number (e.g., 0712 345 678)" }, { status: 400 });
      }
      normalizedPhone = normalizePhone(phone);

      // Check if phone number is already registered by looking up variants
      const phoneVariants = getPhoneLookupVariants(phone);
      const existingPhoneUser = await db.user.findFirst({
        where: {
          phone: { in: phoneVariants }
        }
      });

      if (existingPhoneUser) {
        return NextResponse.json({ error: "An account with this phone number already exists" }, { status: 409 });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine role based on internal email domain only
    const role = cleanEmail.endsWith("@unireport.tz")
      ? "UNIREPORT_ADMIN"
      : "STUDENT";

    // Create user in postgres
    const newUser = await db.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email: cleanEmail,
        phone: normalizedPhone,
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
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        phone: newUser.phone, 
        role: newUser.role 
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);

    // Handle Prisma unique constraint violation (code P2002)
    if (error && typeof error === "object" && error.code === "P2002") {
      const target = error.meta?.target;
      const targetField = Array.isArray(target) ? target.join(", ") : target || "email or phone";
      return NextResponse.json(
        { error: `An account with this ${targetField} already exists.` },
        { status: 409 }
      );
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
