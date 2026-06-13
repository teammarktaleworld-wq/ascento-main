// app/api/debug-db/route.ts

export async function GET() {
  const db = process.env.DATABASE_URL || "";

  return Response.json({
    exists: !!process.env.DATABASE_URL,
    startsWith: db.substring(0, 25),
    hasDirectUrl: !!process.env.DIRECT_URL,
  });
}