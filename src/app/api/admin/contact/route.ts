// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/helpers/prisma";

// export async function POST(req: Request) {
//   try {
//    console.log("added console logs ")
//     const body = await req.json();
//     const { name, phone, email, childAge, reason, message } = body;

//     if (!name?.trim()) {
//       return NextResponse.json({ error: "Name is required" }, { status: 400 });
//     }
//     if (!phone?.trim()) {
//       return NextResponse.json({ error: "Phone is required" }, { status: 400 });
//     }

//     const enquiry = await prisma.contactEnquiry.create({
//       data: {
//         name: name.trim(),
//         phone: phone.trim(),
//         email: email?.trim() || null,
//         childAge: childAge || null,
//         reason: reason || null,
//         message: message?.trim() || null,
//       },
//     });

//     return NextResponse.json({ success: true, id: enquiry.id }, { status: 201 });
//   } catch (err) {
//     console.error("Contact API error:", err);
    
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // GET — for admin to view all enquiries
// export async function GET(req: Request) {
//   // basic protection: check for a secret header or use requireAdmin from auth-helpers
//   const secret = req.headers.get("x-admin-secret");
//   if (secret !== process.env.ADMIN_SECRET) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const enquiries = await prisma.contactEnquiry.findMany({
//     orderBy: { submittedAt: "desc" },
//   });
//   return NextResponse.json(enquiries);
// }









import { NextResponse } from "next/server";
import { prisma } from "@/lib/helpers/prisma";
import { requireAdmin } from "@/lib/helpers/auth-helpers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, childAge, reason, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!phone?.trim()) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        childAge: childAge || null,
        reason: reason || null,
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, id: enquiry.id }, { status: 201 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// GET — for admin to view all enquiries
export async function GET(req: Request) {
  const denied = await requireAdmin(req);  // ✅ replaces the broken x-admin-secret check
  if (denied) return denied;

  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(enquiries);
}