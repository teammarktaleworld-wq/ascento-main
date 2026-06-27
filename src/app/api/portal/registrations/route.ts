
// src\app\api\portal\registrations\route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getAuthUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const registrations = await prisma.portalRegistration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        paper: {
          include: {
            category: { select: { id: true, name: true } },
            _count: { select: { portalQuestions: true } },
          },
        },
      },
    });

    return NextResponse.json({ registrations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}