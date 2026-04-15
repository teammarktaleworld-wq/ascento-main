import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcryptjs";

function generateTempPassword(): string {
  return "Stu@" + crypto.randomBytes(4).toString("hex");
}

async function generateStudentId(tx: any): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AA-${year}-`;

  const lastStudent = await tx.student.findFirst({
    where: { studentId: { startsWith: prefix } },
    orderBy: { studentId: "desc" },
  });

  let seq = 1;
  if (lastStudent?.studentId) {
    const parts = lastStudent.studentId.split("-");
    const lastSeq = parseInt(parts[2], 10);
    if (!isNaN(lastSeq)) seq = lastSeq + 1;
  }

  return `${prefix}${String(seq).padStart(4, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: { email: true, avatarUrl: true },
        },
        enrollments: {
          include: {
            section: {
              include: {
                class: {
                  include: { domain: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("List students error:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      rollNumber,
      fullName,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address,
      city,
      state,
      parentName,
      parentPhone,
      parentEmail,
      sectionId,
      academicYear,
    } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: "fullName is required" },
        { status: 400 }
      );
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Use provided email or parentEmail or generate one
    const userEmail =
      email || parentEmail || `student.${Date.now()}@ascento-abacus.local`;

    const result = await prisma.$transaction(async (tx) => {
      // Generate student ID
      const studentId = await generateStudentId(tx);

      const user = await tx.user.create({
        data: {
          email: userEmail,
          name: name || fullName,
          role: "student",
          passwordHash,
          isPasswordTemporary: true,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          studentId,
          rollNumber,
          fullName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
          gender,
          bloodGroup,
          phone,
          address,
          city,
          state,
          parentName,
          parentPhone,
          parentEmail,
        },
      });

      let enrollment = null;
      if (sectionId) {
        enrollment = await tx.enrollment.create({
          data: {
            studentId: student.id,
            sectionId,
            academicYear: academicYear || new Date().getFullYear().toString(),
          },
        });
      }

      return { user, student, enrollment };
    });

    // Return credentials for admin to share with student/parent
    return NextResponse.json(
      {
        ...result,
        credentials: {
          studentId: result.student.studentId,
          loginEmail: userEmail,
          temporaryPassword: tempPassword,
          message:
            "Share these credentials with the student/parent. They must change the password on first login.",
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create student error:", error);
    const message =
      error?.code === "P2002"
        ? "A student with this email already exists"
        : error?.message || "Failed to create student";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { students } = body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "A non-empty students array is required" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();

    const result = await prisma.$transaction(async (tx) => {
      const lastStudent = await tx.student.findFirst({
        where: {
          studentId: { startsWith: `AA-${year}-` },
        },
        orderBy: { studentId: "desc" },
      });

      let seq = 1;
      if (lastStudent?.studentId) {
        const parts = lastStudent.studentId.split("-");
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          seq = lastSeq + 1;
        }
      }

      let count = 0;
      const credentials: {
        fullName: string;
        studentId: string;
        loginEmail: string;
        temporaryPassword: string;
      }[] = [];

      for (const s of students) {
        const tempPassword = generateTempPassword();
        const hash = await bcrypt.hash(tempPassword, 10);
        const loginEmail =
          s.email || `student.${year}.${seq}@ascento-abacus.local`;
        const studentId = `AA-${year}-${String(seq).padStart(4, "0")}`;

        const user = await tx.user.create({
          data: {
            email: loginEmail,
            name: s.fullName,
            role: "student",
            passwordHash: hash,
            isPasswordTemporary: true,
          },
        });

        const student = await tx.student.create({
          data: {
            userId: user.id,
            studentId,
            rollNumber: s.rollNumber,
            fullName: s.fullName,
            dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth) : undefined,
            gender: s.gender,
            bloodGroup: s.bloodGroup,
            phone: s.phone,
            address: s.address,
            city: s.city,
            state: s.state,
            parentName: s.parentName,
            parentPhone: s.parentPhone,
            parentEmail: s.parentEmail,
          },
        });

        if (s.sectionId) {
          await tx.enrollment.create({
            data: {
              studentId: student.id,
              sectionId: s.sectionId,
              academicYear:
                s.academicYear || new Date().getFullYear().toString(),
            },
          });
        }

        credentials.push({
          fullName: s.fullName,
          studentId,
          loginEmail,
          temporaryPassword: tempPassword,
        });

        seq++;
        count++;
      }

      return { count, credentials };
    });

    return NextResponse.json(
      { success: true, count: result.count, credentials: result.credentials },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk create students error:", error);
    return NextResponse.json(
      { error: "Failed to bulk create students" },
      { status: 500 }
    );
  }
}
