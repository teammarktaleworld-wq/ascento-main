



// ═══════════════════════════════════════════════════════════════════════
// FILE 1: app/api/notes/categories/route.ts
// GET /api/notes/categories — returns note categories for user dashboard
// ═══════════════════════════════════════════════════════════════════════
 
import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";
 
export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 
  const categories = await prisma.noteCategory.findMany({
    orderBy: { name: "asc" },
    select: {
      id:          true,
      name:        true,
      description: true,
    },
  });
 
  return NextResponse.json({ categories });
}