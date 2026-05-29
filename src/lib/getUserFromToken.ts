// import { prisma } from "@/lib/prisma";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export async function getUserFromToken(token: string) {
//   const { data, error } = await supabase.auth.getUser(token);

//   if (error || !data.user) return null;

//   const dbUser = await prisma.user.findUnique({
//     where: { id: data.user.id },
//   });

//   return dbUser;
// }





//lib/getUserFromToken

import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getUserFromToken(
  token: string
) {
  console.log("TOKEN:", token);

  const { data, error } =
    await supabase.auth.getUser(token);

  console.log("SUPABASE DATA:", data);
  console.log("SUPABASE ERROR:", error);

  if (error || !data.user) {
    return null;
  }

  console.log("SUPABASE USER ID:", data.user.id);

  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  console.log("DB USER:", dbUser);

  return dbUser;
}