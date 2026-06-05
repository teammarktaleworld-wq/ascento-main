import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { supabase } from "@/lib/helpers/supabaseClient";

async function requireUserOrStudent(
  req: Request
): Promise<{ userId: string; role: string } | NextResponse> {
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "").trim();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true },
  });

  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (dbUser.role !== "user" && dbUser.role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { userId: dbUser.id, role: dbUser.role };
}

export async function GET(req: Request) {
  const auth = await requireUserOrStudent(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType")?.toLowerCase();
  const search = searchParams.get("search")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where = {
    ...(fileType === "pdf" || fileType === "image" ? { fileType } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { label: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [homeworkFiles, total] = await Promise.all([
    prisma.homeworkFile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { serialId: "asc" },
      select: {
        id: true,
        serialId: true,
        title: true,
        label: true,
        fileType: true,
        fileUrl: true,
        createdAt: true,
      },
    }),
    prisma.homeworkFile.count({ where }),
  ]);

  return NextResponse.json({ homeworkFiles, total, page, limit });
}