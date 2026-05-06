// lib/auth-helper.ts


import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** Returns a 401/403 Response on failure, or null on success. */
export async function requireAdmin(req: Request): Promise<NextResponse | null> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return null;
}

/** Returns the authenticated user's DB record, or throws. */
export async function getAuthUser(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Unauthorized");
  const { data: { user } } = await supabaseAdmin.auth.getUser(token);
  if (!user) throw new Error("Unauthorized");
  return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
}