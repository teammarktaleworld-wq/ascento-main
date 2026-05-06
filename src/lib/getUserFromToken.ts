import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserFromToken(token: string) {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  return dbUser;
}