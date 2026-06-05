// import { NextRequest, NextResponse } from "next/server";
// import { getUserFromToken } from "@/lib/helpers/getUserFromToken";

// export async function GET(req: NextRequest) {
//   const token = req.headers.get("authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const user = await getUserFromToken(token);

//   if (!user) {
//     return NextResponse.json({ error: "User not found" }, { status: 404 });
//   }

//   return NextResponse.json(user);
// }










// import { NextRequest, NextResponse } from "next/server";
// import { getUserFromToken } from "@/lib/helpers/getUserFromToken";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.headers
//       .get("authorization")
//       ?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     console.log("API /me TOKEN EXISTS:", !!token);

//     const user = await getUserFromToken(token);

//     console.log("API /me USER:", user);

//     if (!user) {
//       return NextResponse.json(
//         {
//           error: "User not found",
//           tokenValid: false,
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("/api/me ERROR:", error);

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }












// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const userId = req.nextUrl.searchParams.get("id");

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User id is required" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(user);
//   } catch (error) {
//     console.error("/api/me error:", error);

//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }








// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/helpers/supabaseAdmin";
import { prisma } from "@/lib/helpers/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(dbUser);
  } catch (err) {
    console.error("/api/me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}