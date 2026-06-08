





// // src\app\dashboard\layout.tsx

// "use client";

// import { useState } from "react";

// import UserSidebar from "@/components/userdashboard/Sidebar";
// import UserTopBar from "@/components/userdashboard/Topbar.user";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="fixed flex inset-0 pt-20">
//       <UserSidebar
//         sidebarOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       <div className="flex flex-col flex-1">
//         <UserTopBar
//           title="Dashboard"
//           onMenuClick={() => setSidebarOpen(!sidebarOpen)}
//         />

//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }









// // src/app/dashboard/layout.tsx
// "use client";

// import { useState } from "react";
// import UserSidebar from "@/components/userdashboard/Sidebar";
// import UserTopBar from "@/components/userdashboard/Topbar.user";
// import { usePathname } from "next/navigation";

// // Derive a readable title from the current [tab] segment
// function usePageTitle() {
//   const pathname = usePathname();
//   const segment  = pathname.split("/").pop() ?? "dashboard";
//   return segment.charAt(0).toUpperCase() + segment.slice(1);
// }

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const title = usePageTitle();

//   return (
//     // Full-viewport flex row — sidebar + main column
//     <div className="flex h-screen w-screen overflow-hidden bg-[#F5F6FA]">
//       <UserSidebar
//         sidebarOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//       />

//       {/* Right column: topbar + scrollable content */}
//       <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
//         <UserTopBar
//           title={title}
//           onMenuClick={() => setSidebarOpen((v) => !v)}
//         />

//         <main className="flex-1 overflow-y-auto p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }








"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/userdashboard/Sidebar";
import TopBar from "@/components/userdashboard/Topbar.user";

const NAVBAR_HEIGHT = 80;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res  = await fetch("/api/notifications?limit=1");
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(id);
  }, [fetchUnreadCount]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div
        className="fixed flex items-center justify-center bg-[#F5F6FA]"
        style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
      >
        <Loader2 className="animate-spin text-[#FF6B6B]" size={28} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="fixed flex"
      style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
    >
      {/* Sidebar — takes full height of this container, scrolls internally */}
      <Sidebar notificationCount={unreadCount} />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          title="Dashboard"
          onNotificationsClick={() => router.push("/dashboard/notifications")}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-[#F5F6FA]">
          {children}
        </main>
      </div>
    </div>
  );
}