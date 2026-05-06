// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const notifications = await prisma.notification.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 20,
//   });
//   return NextResponse.json(notifications);
// }

// // POST — broadcast or targeted notification
// export async function POST(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const body = await req.json();
//   const { title, message, targetType, studentIds } = body as {
//     title: string;
//     message: string;
//     targetType: "broadcast" | "individual";
//     studentIds?: string[];
//   };

//   const notif = await prisma.notification.create({
//     data: { title, message, targetType },
//   });

//   if (targetType === "broadcast") {
//     const allStudents = await prisma.student.findMany({ select: { id: true } });
//     await prisma.studentNotification.createMany({
//       data: allStudents.map((s) => ({ notificationId: notif.id, studentId: s.id })),
//       skipDuplicates: true,
//     });
//   } else if (studentIds?.length) {
//     await prisma.studentNotification.createMany({
//       data: studentIds.map((sid) => ({ notificationId: notif.id, studentId: sid })),
//       skipDuplicates: true,
//     });
//   }

//   return NextResponse.json(notif, { status: 201 });
// }





import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(notifications);
}

// POST — broadcast or targeted notification
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const body = await req.json();
  const { title, message, targetType, studentIds } = body as {
    title: string;
    message: string;
    targetType: "broadcast" | "individual";
    studentIds?: string[];
  };

  const notif = await prisma.notification.create({
    data: { title, message, targetType },
  });

  if (targetType === "broadcast") {
    const allStudents = await prisma.student.findMany({ select: { id: true } }) as { id: string }[];
    await prisma.studentNotification.createMany({
      data: allStudents.map((s) => ({ notificationId: notif.id, studentId: s.id })),
      skipDuplicates: true,
    });
  } else if (studentIds?.length) {
    await prisma.studentNotification.createMany({
      data: studentIds.map((sid) => ({ notificationId: notif.id, studentId: sid })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json(notif, { status: 201 });
}