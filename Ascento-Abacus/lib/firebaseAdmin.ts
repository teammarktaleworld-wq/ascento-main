// import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
// import { getFirestore } from "firebase-admin/firestore";
// import { getAuth } from "firebase-admin/auth";




// const adminApp =
//   getApps().length === 0
//     ? initializeApp({
//         credential: cert({
//           projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
//           clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
//           privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//         }),
//       })
//     : getApp();

// export const adminDb = getFirestore(adminApp);
// export const adminAuth = getAuth(adminApp);


import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getAdminApp(): App {
  if (getApps().length > 0) return getApp();

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminDb = getFirestore(getAdminApp());
export const adminAuth = getAuth(getAdminApp());