// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   // ❌ Not logged in
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));

//     // ❌ Not admin
//     if (payload.role !== "admin") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }

//     // ✅ Allow
//     return NextResponse.next();
//   } catch (err) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }
// disable middleware completely
export function middleware() {
  return;
}