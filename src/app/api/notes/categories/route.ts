
// //api//notes//categories

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { supabase } from "@/lib/helpers/supabaseClient";

// // ─── Auth helper: allow user or student roles ─────────────────────────────────
// async function requireUserOrStudent(
//   req: Request
// ): Promise<{ userId: string; role: string } | NextResponse> {
//   const authHeader = req.headers.get("Authorization") ?? "";
//   const token = authHeader.replace("Bearer ", "").trim();

//   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const { data: { user }, error } = await supabase.auth.getUser(token);
//   if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const dbUser = await prisma.user.findUnique({
//     where: { id: user.id },
//     select: { id: true, role: true },
//   });

//   if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
//   if (dbUser.role !== "user" && dbUser.role !== "student")
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//   return { userId: dbUser.id, role: dbUser.role };
// }

// // ─── GET /api/categories ──────────────────────────────────────────────────────
// // Returns all categories with the count of notes in each,
// // split by type (DEMO / REAL) so the UI can show accurate counts.
// export async function GET(req: Request) {
//   const auth = await requireUserOrStudent(req);
//   if (auth instanceof NextResponse) return auth;

//   // const categories = await prisma.category.findMany({
//   //   orderBy: { name: "asc" },
//   //   select: {
//   //     id: true,
//   //     name: true,
//   //     description: true,
//   //     _count: { select: { notes: true } },
//   //   },
//   // });
//   const categories = await prisma.noteCategory.findMany({
//   orderBy: { name: "asc" },
//   select: {
//     id: true,
//     name: true,
//     description: true,
//   },
// });

//   return NextResponse.json({ categories });
// }














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