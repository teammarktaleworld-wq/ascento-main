// // app/api/admin/users/export/route.ts
// // GET /api/admin/users/export?format=csv&role=student&status=Active
// // Streams a CSV of users matching the given filters.

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { requireAdmin } from "@/lib/helpers/auth-helpers";
// import { Prisma } from "@prisma/client";

// function escapeCsv(value: unknown): string {
//   if (value === null || value === undefined) return "";
//   const str = String(value);
//   if (str.includes(",") || str.includes('"') || str.includes("\n")) {
//     return `"${str.replace(/"/g, '""')}"`;
//   }
//   return str;
// }

// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const role   = searchParams.get("role")   ?? "";
//   const status = searchParams.get("status") ?? "";
//   const search = searchParams.get("search") ?? "";

//   const where: Prisma.UserWhereInput = {
//     AND: [
//       search
//         ? {
//             OR: [
//               { name:  { contains: search, mode: "insensitive" } },
//               { email: { contains: search, mode: "insensitive" } },
//               { phone: { contains: search, mode: "insensitive" } },
//             ],
//           }
//         : {},
//       role   ? { role:   role   as any } : {},
//       status ? { status: status }        : {},
//     ],
//   };

//   const users = await prisma.user.findMany({
//     where,
//     orderBy: { createdAt: "desc" },
//     include: {
//       student: { include: { program: true, programLevel: true } },
//       teacher: true,
//     },
//   });

//   const headers = [
//     "Name", "Email", "Phone", "Role", "Status",
//     "Student ID", "Program", "Level",
//     "Parent Name", "Parent Phone",
//     "Teacher Designation", "Teacher Experience",
//     "Created At",
//   ];

//   const rows = users.map((u) => [
//     u.name          ?? "",
//     u.email,
//     u.phone         ?? "",
//     u.role,
//     u.status        ?? "Active",
//     u.student?.studentId        ?? "",
//     u.student?.program?.name    ?? "",
//     u.student?.programLevel?.name ?? "",
//     u.student?.parentName       ?? "",
//     u.student?.parentPhone      ?? "",
//     u.teacher?.designation      ?? "",
//     u.teacher?.experience       ?? "",
//     u.createdAt.toISOString().split("T")[0],
//   ]);

//   const csv = [headers, ...rows]
//     .map((row) => row.map(escapeCsv).join(","))
//     .join("\n");

//   return new NextResponse(csv, {
//     status: 200,
//     headers: {
//       "Content-Type": "text/csv; charset=utf-8",
//       "Content-Disposition": `attachment; filename="users-${Date.now()}.csv"`,
//     },
//   });
// }















import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";
import { Prisma, UserStatus } from "@prisma/client";

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);

  const role = searchParams.get("role") ?? "";
  const statusParam = searchParams.get("status");
  const search = searchParams.get("search") ?? "";

  const status =
    statusParam &&
    Object.values(UserStatus).includes(statusParam as UserStatus)
      ? (statusParam as UserStatus)
      : undefined;

  const where: Prisma.UserWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      role ? { role: role as any } : {},
      status ? { status } : {},
    ],
  };

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      student: {
        include: {
          program: true,
          programLevel: true,
        },
      },
      teacher: true,
    },
  });

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Role",
    "Status",
    "Student ID",
    "Program",
    "Level",
    "Parent Name",
    "Parent Phone",
    "Teacher Designation",
    "Teacher Experience",
    "Created At",
  ];

  const rows = users.map((u) => [
    u.name ?? "",
    u.email,
    u.phone ?? "",
    u.role,
    String(u.status ?? UserStatus.Active),
    u.student?.studentId ?? "",
    u.student?.program?.name ?? "",
    u.student?.programLevel?.name ?? "",
    u.student?.parentName ?? "",
    u.student?.parentPhone ?? "",
    u.teacher?.designation ?? "",
    u.teacher?.experience ?? "",
    u.createdAt.toISOString().split("T")[0],
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="users-${Date.now()}.csv"`,
    },
  });
}