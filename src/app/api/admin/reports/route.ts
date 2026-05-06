// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { requireAdmin } from "@/lib/auth-helpers";

// // GET /api/admin/reports?type=fees|attendance|marks|enrollment
// export async function GET(req: Request) {
//   const err = await requireAdmin(req);
//   if (err) return err;

//   const { searchParams } = new URL(req.url);
//   const type = searchParams.get("type") ?? "fees";

//   if (type === "fees") {
//     const data = await prisma.fee.groupBy({
//       by: ["paymentStatus"],
//       _count: true,
//       _sum: { amount: true },
//     });
//     return NextResponse.json(data);
//   }

//   if (type === "attendance") {
//     const data = await prisma.attendance.groupBy({
//       by: ["status"],
//       _count: true,
//       where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
//     });
//     return NextResponse.json(data);
//   }

//   if (type === "marks") {
//     const data = await prisma.mark.findMany({
//       include: { student: true, subject: true, exam: true },
//     });
//     return NextResponse.json(data);
//   }

//   if (type === "enrollment") {
//     const data = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
//       SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
//              COUNT(*) AS count
//       FROM students
//       WHERE "createdAt" >= NOW() - INTERVAL '12 months'
//       GROUP BY DATE_TRUNC('month', "createdAt")
//       ORDER BY DATE_TRUNC('month', "createdAt")
//     `;
//     return NextResponse.json(data.map((d) => ({ month: d.month, count: Number(d.count) })));
//   }

//   return NextResponse.json({ error: "Unknown report type" }, { status: 400 });
// }







import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

// GET /api/admin/reports?type=fees|attendance|marks|enrollment
export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "fees";

  if (type === "fees") {
    const data = await prisma.fee.groupBy({
      by: ["paymentStatus"],
      _count: true,
      _sum: { amount: true },
    });
    return NextResponse.json(data);
  }

  if (type === "attendance") {
    const data = await prisma.attendance.groupBy({
      by: ["status"],
      _count: true,
      where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });
    return NextResponse.json(data);
  }

  if (type === "marks") {
    const data = await prisma.mark.findMany({
      include: { student: true, subject: true, exam: true },
    });
    return NextResponse.json(data);
  }

  if (type === "enrollment") {
    const data = await (prisma.$queryRaw`
      SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') AS month,
             COUNT(*) AS count
      FROM students
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    ` as Promise<{ month: string; count: bigint }[]>);
    return NextResponse.json(data.map((d) => ({ month: d.month, count: Number(d.count) })));
  }

  return NextResponse.json({ error: "Unknown report type" }, { status: 400 });
}