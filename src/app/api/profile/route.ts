// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/helpers/auth-helpers"; // your auth helper
import { prisma } from "@/lib/helpers/prisma";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Base user data
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      city: true,
      avatarUrl: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Role-specific extended data
  let roleData: Record<string, unknown> = {};

  if (dbUser.role === "student") {
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        studentId: true,
        rollNumber: true,
        fullName: true,
        photoUrl: true,
        dateOfBirth: true,
        admissionDate: true,
        gender: true,
        bloodGroup: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        parentName: true,
        parentPhone: true,
        parentEmail: true,
        status: true,
        section: true,
        academicYear: true,
        program: { select: { id: true, name: true } },
        programLevel: { select: { id: true, name: true } },
        _count: {
          select: {
            attendance: true,
            fees: true,
          },
        },
        fees: {
          where: { status: { in: ["Pending", "Overdue"] } },
          select: { id: true, feeType: true, amount: true, paidAmount: true, status: true, dueDate: true },
          orderBy: { dueDate: "asc" },
          take: 5,
        },
        attendance: {
          orderBy: { date: "desc" },
          take: 30,
          select: { date: true, status: true },
        },
      },
    });
    roleData = { student };
  }

  if (dbUser.role === "teacher") {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        phone: true,
        experience: true,
        designation: true,
        photoUrl: true,
        dateOfBirth: true,
        status: true,
        subjects: {
          select: {
            subject: { select: { id: true, name: true } },
            assignedAt: true,
          },
        },
      },
    });
    roleData = { teacher };
  }

  if (dbUser.role === "admin") {
    // For admin, show platform stats
    const [userCount, studentCount, teacherCount, enquiryCount] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.enquiry.count(),
    ]);
    roleData = {
      stats: { userCount, studentCount, teacherCount, enquiryCount },
    };
  }

  // Purchases — visible to all roles
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    orderBy: { purchasedAt: "desc" },
    take: 10,
    select: {
      id: true,
      originalPrice: true,
      finalPrice: true,
      discountApplied: true,
      purchasedAt: true,
      note: { select: { id: true, title: true, serialId: true } },
      testPaper: { select: { id: true, title: true, serialId: true } },
    },
  });

  // Notifications — unread count
  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false },
  });

  return NextResponse.json({
    ...dbUser,
    ...roleData,
    purchases,
    unreadCount,
  });
}

// PATCH — update own profile (name, phone, city only)
export async function PATCH(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Whitelist — never let users change their own role/status
  const allowed = ["name", "phone", "city"] as const;
  const update: Partial<Record<typeof allowed[number], string>> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = String(body[key]).trim();
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: update,
    select: { id: true, name: true, phone: true, city: true, updatedAt: true },
  });

  return NextResponse.json(updated);
}