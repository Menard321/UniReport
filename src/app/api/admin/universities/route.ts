import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { UniversityStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const universities = await db.university.findMany({
      orderBy: { name: "asc" }
    });
    return NextResponse.json({ universities });
  } catch (error) {
    console.error("[ADMIN_UNIVERSITIES_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, shortName, location, domain, campuses, programmesCount, reportTypes } = await req.json();

    if (!name || !shortName || !location) {
      return NextResponse.json({ error: "Name, short name, and location are required" }, { status: 400 });
    }

    const uni = await db.university.create({
      data: {
        name,
        shortName,
        location,
        domain: domain || null,
        campuses: Number(campuses) || 1,
        programmesCount: Number(programmesCount) || 1,
        status: "VERIFIED",
        reportTypes: reportTypes || ["Final Year Project (FYP)", "Field Training (IPT)"]
      }
    });

    return NextResponse.json({ success: true, university: uni });
  } catch (error) {
    console.error("[ADMIN_UNIVERSITIES_POST_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "UNIREPORT_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "University ID is required" }, { status: 400 });
    }

    await db.university.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_UNIVERSITIES_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
