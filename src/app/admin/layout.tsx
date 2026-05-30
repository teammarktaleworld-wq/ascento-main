// // app/admin/layout.tsx

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div style={{ isolation: "isolate" }}>
//       {children}
//     </div>
//   );
// }









// // app/admin/layout.tsx
// import type { Metadata } from "next";

// export const metadata: Metadata = { title: "Admin — Ascento" };

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   // Renders NOTHING from the root layout — full takeover
//   return <>{children}</>;
// }












"use client";

import Sidebar from "@/components/admin/layout/Sidebar";
import TopBar from "@/components/admin/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed flex inset-0 pt-20">
      <div style={{ width: 260 }}>
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <TopBar title="Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}