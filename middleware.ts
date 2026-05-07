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



import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // logged in user trying to access login
  if (user && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // non logged in user trying to access admin
  if (!user && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/login", "/admin/:path*"],
};