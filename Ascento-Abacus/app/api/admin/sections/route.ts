import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      include: {
        class: {
          include: { domain: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { class: { name: "asc" } },
    });

    return NextResponse.json(
      sections.map((s) => ({
        id: s.id,
        name: `${s.class.name} - ${s.name}`,
        className: s.class.name,
        sectionName: s.name,
        classId: s.classId,
        domain: s.class.domain.name,
        domainId: s.class.domainId,
        enrollmentCount: s._count.enrollments,
      }))
    );
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { className, sectionName, domainId } = await req.json();

    if (!className || !sectionName || !domainId) {
      return NextResponse.json(
        { error: "className, sectionName, and domainId are required" },
        { status: 400 }
      );
    }

    // Find or create the class under the given domain
    let classRecord = await prisma.class.findFirst({
      where: { name: className, domainId },
    });

    if (!classRecord) {
      classRecord = await prisma.class.create({
        data: { name: className, domainId },
      });
    }

    // Create the section under that class
    const section = await prisma.section.create({
      data: { name: sectionName, classId: classRecord.id },
      include: {
        class: {
          include: { domain: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: section.id,
        name: `${section.class.name} - ${section.name}`,
        className: section.class.name,
        sectionName: section.name,
        classId: section.classId,
        domain: section.class.domain.name,
        domainId: section.class.domainId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, sectionName } = await req.json();

    if (!id || !sectionName) {
      return NextResponse.json(
        { error: "id and sectionName are required" },
        { status: 400 }
      );
    }

    const section = await prisma.section.update({
      where: { id },
      data: { name: sectionName },
      include: {
        class: {
          include: { domain: true },
        },
      },
    });

    return NextResponse.json({
      id: section.id,
      name: `${section.class.name} - ${section.name}`,
      className: section.class.name,
      sectionName: section.name,
      classId: section.classId,
      domain: section.class.domain.name,
      domainId: section.class.domainId,
    });
  } catch (error) {
    console.error("Failed to update section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    // Check for existing enrollments or timetable slots
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrollments: true, timetableSlots: true },
        },
      },
    });

    if (!section) {
      return NextResponse.json(
        { error: "Section not found" },
        { status: 404 }
      );
    }

    if (section._count.enrollments > 0 || section._count.timetableSlots > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete section with existing enrollments or timetable slots",
          enrollmentCount: section._count.enrollments,
          timetableSlotCount: section._count.timetableSlots,
        },
        { status: 409 }
      );
    }

    await prisma.section.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
