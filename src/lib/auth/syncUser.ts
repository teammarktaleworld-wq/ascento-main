import { prisma } from "@/lib/helpers/prisma";
import { User as SupabaseUser } from "@supabase/supabase-js";

export async function syncUser(user: SupabaseUser) {
  const email = user.email;

  if (!email) {
    throw new Error("User email missing");
  }

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    email.split("@")[0];

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const phone = user.phone || null;

  const dbUser = await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      email,
      name,
      avatarUrl,
      phone,
      // NEVER update role here
    },
    create: {
      id: user.id,
      email,
      name,
      avatarUrl,
      phone,
      role: "user",
    },
  });

  return dbUser;
}