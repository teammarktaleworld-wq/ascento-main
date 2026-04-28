
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {

  console.log("Project ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);
  console.log("Client Email:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  console.log("Key exists:", !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  

    
    const body = await req.json();
    const { name, location, phone, background } = body;

    // Validation
    if (!name?.trim() || !phone?.trim() || !location?.trim()) {
      return NextResponse.json(
        { error: "Name, phone, and location are required." },
        { status: 400 }
      );
    }

    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    const docRef = await adminDb.collection("FranchiseInquiries").add({
      name: name.trim(),
      location: location.trim(),
      phone: phone.trim(),
      background: background || "Other",
      status: "new",
      submittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Franchise POST error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("FranchiseInquiries")
      .orderBy("submittedAt", "desc")
      .limit(100)
      .get();

    const inquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate().toISOString() ?? null,
    }));

    return NextResponse.json(
      { success: true, count: inquiries.length, inquiries },
      { status: 200 }
    );

  } catch (error) {
    console.error("Franchise GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}