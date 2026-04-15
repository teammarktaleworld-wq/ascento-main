import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json(
        { error: "sectionId query parameter is required" },
        { status: 400 }
      );
    }

    const slots = await prisma.timetableSlot.findMany({
      where: { sectionId },
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
      orderBy: [{ dayOfWeek: "asc" }, { periodNumber: "asc" }],
    });

    // Group by day of week
    const grouped: Record<string, Array<{
      periodNumber: number;
      subject: { id: string; name: string } | null;
      teacher: { id: string; name: string } | null;
    }>> = {};

    for (const day of DAYS_OF_WEEK) {
      grouped[day] = [];
    }

    for (const slot of slots) {
      const day = slot.dayOfWeek.toLowerCase();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({
        periodNumber: slot.periodNumber,
        subject: slot.subject,
        teacher: slot.teacher,
      });
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Failed to fetch timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sectionId, slots } = await req.json();

    if (!sectionId || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: "sectionId and slots array are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing slots for this section
      await tx.timetableSlot.deleteMany({
        where: { sectionId },
      });

      // Create all new slots
      const created = await tx.timetableSlot.createMany({
        data: slots.map(
          (slot: {
            dayOfWeek: string;
            periodNumber: number;
            subjectId?: string | null;
            teacherId?: string | null;
          }) => ({
            sectionId,
            dayOfWeek: slot.dayOfWeek,
            periodNumber: slot.periodNumber,
            subjectId: slot.subjectId || null,
            teacherId: slot.teacherId || null,
          })
        ),
      });

      return created;
    });

    return NextResponse.json(
      { success: true, slotsCreated: result.count },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save timetable:", error);
    return NextResponse.json(
      { error: "Failed to save timetable" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { sectionId, dayOfWeek, periodNumber, subjectId, teacherId } =
      await req.json();

    if (!sectionId || !dayOfWeek || periodNumber == null) {
      return NextResponse.json(
        { error: "sectionId, dayOfWeek, and periodNumber are required" },
        { status: 400 }
      );
    }

    const slot = await prisma.timetableSlot.upsert({
      where: {
        sectionId_dayOfWeek_periodNumber: {
          sectionId,
          dayOfWeek,
          periodNumber,
        },
      },
      update: {
        subjectId: subjectId || null,
        teacherId: teacherId || null,
      },
      create: {
        sectionId,
        dayOfWeek,
        periodNumber,
        subjectId: subjectId || null,
        teacherId: teacherId || null,
      },
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error("Failed to update timetable slot:", error);
    return NextResponse.json(
      { error: "Failed to update timetable slot" },
      { status: 500 }
    );
  }
}
