// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import { NoteType } from "@prisma/client";

// // ─── Auth helper: allow user or student roles ─────────────────────────────────
// async function requireUserOrStudent(
//   req: Request
// ): Promise<{ userId: string; role: string } | NextResponse> {
//   const authHeader = req.headers.get("Authorization") ?? "";
//   const token = authHeader.replace("Bearer ", "").trim();

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Verify token with Supabase
//   const { data: { user }, error } = await supabase.auth.getUser(token);
//   if (error || !user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   // Check role in DB
//   const dbUser = await prisma.user.findUnique({
//     where: { id: user.id },
//     select: { id: true, role: true },
//   });

//   if (!dbUser) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   if (dbUser.role !== "user" && dbUser.role !== "student") {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   return { userId: dbUser.id, role: dbUser.role };
// }

// // ─── GET /api/notes ───────────────────────────────────────────────────────────
// // Returns ALL notes (DEMO + REAL) sorted by serialId.
// // • DEMO notes → full pdfUrl included (free access)
// // • REAL notes → pdfUrl is OMITTED (payment required; Razorpay coming soon)
// //
// // Query params:
// //   type   = "DEMO" | "REAL"   (optional filter)
// //   search = string            (searches title + label)
// //   page   = number            (default 1)
// //   limit  = number            (default 50, max 100)
// export async function GET(req: Request) {
//   const auth = await requireUserOrStudent(req);
//   // If auth returned a NextResponse, it's an error — return it
//   if (auth instanceof NextResponse) return auth;

//   const { searchParams } = new URL(req.url);
//   const typeParam = searchParams.get("type")?.toUpperCase() as NoteType | null;
//   const search = searchParams.get("search")?.trim() ?? "";
//   const page = Math.max(1, Number(searchParams.get("page") ?? 1));
//   const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

//   const where = {
//     ...(typeParam === "DEMO" || typeParam === "REAL" ? { type: typeParam } : {}),
//     ...(search
//       ? {
//           OR: [
//             { title: { contains: search, mode: "insensitive" as const } },
//             { label: { contains: search, mode: "insensitive" as const } },
//           ],
//         }
//       : {}),
//   };

//   const [rawNotes, total] = await Promise.all([
//     prisma.note.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { serialId: "asc" },
//       select: {
//         id: true,
//         serialId: true,
//         title: true,
//         label: true,
//         type: true,
//         pdfUrl: true,      // stripped below for REAL notes
//         storagePath: false, // never expose internal storage path to clients
//         createdAt: true,
//         updatedAt: true,
//       },
//     }),
//     prisma.note.count({ where }),
//   ]);

//   // Gate REAL note PDFs — strip pdfUrl so the client can't bypass payment
//   const notes = rawNotes.map((note) => ({
//     ...note,
//     pdfUrl: note.type === "DEMO" ? note.pdfUrl : null,
//     locked: note.type === "REAL",
//   }));

//   return NextResponse.json({ notes, total, page, limit });
// }





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import { NoteType } from "@prisma/client";

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

// // ─── GET /api/notes ───────────────────────────────────────────────────────────
// // Returns ALL notes (DEMO + REAL) sorted by serialId.
// // • DEMO notes → full pdfUrl included (free access)
// // • REAL notes → pdfUrl is OMITTED (payment required; Razorpay coming soon)
// //
// // Query params:
// //   type        = "DEMO" | "REAL"         (optional filter)
// //   categoryId  = string | "uncategorized" (optional filter)
// //   search      = string                  (searches title + label)
// //   page        = number                  (default 1)
// //   limit       = number                  (default 50, max 100)
// export async function GET(req: Request) {
//   const auth = await requireUserOrStudent(req);
//   if (auth instanceof NextResponse) return auth;

//   const { searchParams } = new URL(req.url);
//   const typeParam = searchParams.get("type")?.toUpperCase() as NoteType | null;
//   const search = searchParams.get("search")?.trim() ?? "";
//   const categoryId = searchParams.get("categoryId")?.trim() ?? "";
//   const page = Math.max(1, Number(searchParams.get("page") ?? 1));
//   const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));

//   const where = {
//     ...(typeParam === "DEMO" || typeParam === "REAL" ? { type: typeParam } : {}),
//     ...(categoryId === "uncategorized"
//       ? { categoryId: null }
//       : categoryId
//       ? { categoryId }
//       : {}),
//     ...(search
//       ? {
//           OR: [
//             { title: { contains: search, mode: "insensitive" as const } },
//             { label: { contains: search, mode: "insensitive" as const } },
//           ],
//         }
//       : {}),
//   };

//   const [rawNotes, total] = await Promise.all([
//     prisma.note.findMany({
//       where,
//       skip: (page - 1) * limit,
//       take: limit,
//       orderBy: { serialId: "asc" },
//       select: {
//         id: true,
//         serialId: true,
//         title: true,
//         label: true,
//         type: true,
//         pdfUrl: true,       // stripped below for REAL notes
//         storagePath: false, // never expose internal storage path to clients
//         categoryId: true,
//         category: {
//           select: { id: true, name: true },
//         },
//         createdAt: true,
//         updatedAt: true,
//       },
//     }),
//     prisma.note.count({ where }),
//   ]);

//   // Gate REAL note PDFs — strip pdfUrl so the client can't bypass payment
//   const notes = rawNotes.map((note) => ({
//     ...note,
//     pdfUrl: note.type === "DEMO" ? note.pdfUrl : null,
//     locked: note.type === "REAL",
//   }));

//   return NextResponse.json({ notes, total, page, limit });
// }












// app/api/notes/route.ts  (updated)
//


import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { getSessionUser } from "@/lib/helpers/auth-helpers";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search     = searchParams.get("search")?.trim()     ?? "";
  const categoryId = searchParams.get("categoryId")?.trim() ?? "";
  const priceFilter= searchParams.get("price")              ?? "";   // "free" | "paid"
  const access     = searchParams.get("access")             ?? "";   // "owned" | "free"
  const page       = Math.max(1, Number(searchParams.get("page")  ?? 1));
  const limit      = Math.min(100, Number(searchParams.get("limit") ?? 50));

  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { label: { contains: search, mode: "insensitive" } },
    ];
  }
  if (categoryId === "uncategorized") where.categoryId = null;
  else if (categoryId)                where.categoryId = categoryId;

  if (priceFilter === "free") where.price = 0;
  if (priceFilter === "paid") where.price = { gt: 0 };

  const [rawNotes, total, userPurchases] = await Promise.all([
    prisma.note.findMany({
      where,
      skip:    (page - 1) * limit,
      take:    limit,
      orderBy: { serialId: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count:   { select: { purchases: true } },
      },
    }),
    prisma.note.count({ where }),
    // Fetch this user's note purchases
    prisma.purchase.findMany({
      where:  { userId: user.id, noteId: { not: null } },
      select: { noteId: true, finalPrice: true, discountApplied: true, purchasedAt: true },
    }),
  ]);

  const purchasedNoteIds = new Set(userPurchases.map((p) => p.noteId!));

  const notes = rawNotes.map((note) => {
    const isPurchased = note.price === 0 || purchasedNoteIds.has(note.id);
    const purchase    = userPurchases.find((p) => p.noteId === note.id);

    const effectivePrice =
      note.discountPercent
        ? Math.round(note.price * (1 - note.discountPercent / 100))
        : note.price;

    return {
      id:              note.id,
      serialId:        note.serialId,
      title:           note.title,
      label:           note.label,
      categoryId:      note.categoryId,
      category:        note.category,
      price:           note.price,
      discountPercent: note.discountPercent,
      effectivePrice,
      createdAt:       note.createdAt,
      // Access gating
      isPurchased,
      locked:          !isPurchased,
      // Demo PDF is always visible; real PDF only if purchased
      demoUrl:  note.demoUrl,
      realUrl:  isPurchased ? note.realUrl : null,
      // Purchase metadata
      purchase: purchase
        ? {
            paidAmount:      purchase.finalPrice,
            discountApplied: purchase.discountApplied,
            purchasedAt:     purchase.purchasedAt,
          }
        : null,
      _count: note._count,
    };
  });

  // Filter "access" param after enrichment
  const filtered =
    access === "owned" ? notes.filter((n) => n.isPurchased)
    : access === "free"  ? notes.filter((n) => n.price === 0)
    : notes;

  return NextResponse.json({ notes: filtered, total, page, limit });
}