// src\app\api\schedule\programs\route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  const dbUser = await getSessionUser(req);
  if (!dbUser)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const programs = await prisma.program.findMany({
      where: { isActive: true },
      select: {
        id: true, name: true, hasLevels: true,
        levels: {
          where: { isActive: true },
          select: { id: true, name: true, sortOrder: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ programs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}