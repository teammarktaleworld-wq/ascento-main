
// // src\app\admin\dashboard\page.tsx
// import DashboardView from "@/components/admin/modules/dashboard/DashboardView";

// export default function Page() {
//   return <DashboardView />;
// }







// src\app\admin\dashboard\page.tsx



"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect /admin/dashboard → /admin/dashboard/dashboard
// so the [tab] page always handles rendering — no duplicate logic
export default function AdminDashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard/dashboard");
  }, [router]);

  return null;
}