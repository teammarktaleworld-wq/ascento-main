import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
            avatarUrl: true,
          },
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("List teachers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, experience, subjectIds } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          role: "user",
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          name,
          phone,
          experience,
        },
      });

      if (subjectIds && subjectIds.length > 0) {
        await tx.subjectTeacher.createMany({
          data: subjectIds.map((subjectId: string) => ({
            teacherId: teacher.id,
            subjectId,
          })),
        });
      }

      return { user, teacher };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create teacher error:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, phone, experience, subjectIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(phone !== undefined && { phone }),
          ...(experience !== undefined && { experience }),
        },
      });

      if (subjectIds !== undefined) {
        await tx.subjectTeacher.deleteMany({
          where: { teacherId: id },
        });

        if (subjectIds.length > 0) {
          await tx.subjectTeacher.createMany({
            data: subjectIds.map((subjectId: string) => ({
              teacherId: id,
              subjectId,
            })),
          });
        }
      }

      return teacher;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update teacher error:", error);
    return NextResponse.json(
      { error: "Failed to update teacher" },
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

    await prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!teacher) {
        throw new Error("Teacher not found");
      }

      await tx.subjectTeacher.deleteMany({
        where: { teacherId: id },
      });

      await tx.teacher.delete({
        where: { id },
      });

      await tx.user.delete({
        where: { id: teacher.userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete teacher error:", error);
    return NextResponse.json(
      { error: "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
