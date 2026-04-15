import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { studentNotifications: true },
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("List notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, targetType, studentId } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "title and message are required" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          title,
          message,
          targetType: targetType || "all",
          status: "active",
        },
      });

      if (studentId) {
        // Target a specific student
        await tx.studentNotification.create({
          data: {
            notificationId: notification.id,
            studentId,
          },
        });
      } else {
        // Broadcast to all students
        const students = await tx.student.findMany({
          select: { id: true },
        });

        if (students.length > 0) {
          await tx.studentNotification.createMany({
            data: students.map((s) => ({
              notificationId: notification.id,
              studentId: s.id,
            })),
          });
        }
      }

      return notification;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
