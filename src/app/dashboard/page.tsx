



// // src\app\dashboard\page.tsx

// import UserDashboard from "@/components/userdashboard/UserDashboard";

// export default function DashboardPage() {
//   return <UserDashboard />;
// }


// // src\app\dashboard\page.tsx
// export default function DashboardPage() {
//   return <DashboardPage />;
// }




// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/home");
  }, [router]);

  return null;
}

