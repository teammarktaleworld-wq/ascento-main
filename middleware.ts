// import { createServerClient } from "@supabase/ssr";
// import { NextResponse, type NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   let response = NextResponse.next();

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return req.cookies.get(name)?.value;
//         },
//         set(name: string, value: string, options) {
//           response.cookies.set({
//             name,
//             value,
//             ...options,
//           });
//         },
//         remove(name: string, options) {
//           response.cookies.set({
//             name,
//             value: "",
//             ...options,
//           });
//         },
//       },
//     }
//   );

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   const pathname = req.nextUrl.pathname;

//   if (session && pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   if (!session && pathname.startsWith("/admin")) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/login", "/admin/:path*"],
// };


import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};