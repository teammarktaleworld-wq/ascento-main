import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json(map);
}

// POST body: { key: string, value: any }[]
export async function POST(req: Request) {
  const err = await requireAdmin(req);
  if (err) return err;

  const entries = await req.json() as { key: string; value: any }[];
  const ops = entries.map((e) =>
    prisma.setting.upsert({
      where: { key: e.key },
      update: { value: e.value },
      create: { key: e.key, value: e.value },
    })
  );
  await prisma.$transaction(ops);
  return NextResponse.json({ success: true });
}