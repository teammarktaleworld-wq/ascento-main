





// // // src\app\dashboard\layout.tsx






// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import Sidebar from "@/components/userdashboard/Sidebar";
// import TopBar from "@/components/userdashboard/Topbar.user";

// const NAVBAR_HEIGHT = 80;

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const { user, token, loading } = useAuth(); // ← token from context
//   const router = useRouter();
//   const [unreadCount, setUnreadCount] = useState(0);

//   const fetchUnreadCount = useCallback(async () => {
//     if (!token) return; // ← gate on token from context, no supabase call needed
//     try {
//       const res = await fetch("/api/notifications?limit=1", {
//         headers: { Authorization: `Bearer ${token}` },
//         cache: "no-store",
//       });
//       if (!res.ok) return;
//       const data = await res.json();
//       setUnreadCount(data.unreadCount ?? 0);
//     } catch {}
//   }, [token]); // ← re-creates when token changes (new user = new token)

//   // Only poll once token exists
//   useEffect(() => {
//     if (!token) return;
//     fetchUnreadCount();
//     const id = setInterval(fetchUnreadCount, 60_000);
//     return () => clearInterval(id);
//   }, [token, fetchUnreadCount]);

//   // Reset unread count when user changes
//   useEffect(() => {
//     if (!token) setUnreadCount(0);
//   }, [token]);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   // Redirect only after auth check is complete
//   useEffect(() => {
//     if (ready && !user) router.replace("/login");
//   }, [ready, user, router]);

//   // Show loader while auth is resolving
//   if (loading || !ready) {
//     return (
//       <div
//         className="fixed flex items-center justify-center bg-[#F5F6FA]"
//         style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
//       >
//         <Loader2 className="animate-spin text-[#FF6B6B]" size={28} />
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     // key=user.id — React fully remounts this tree when user switches
//     // Every child component gets fresh state, no bleed from previous session
//     <div
//       key={user.id}
//       className="fixed flex"
//       style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
//     >
//       <Sidebar notificationCount={unreadCount} />
//       <div className="flex flex-col flex-1 min-w-0">
//         <TopBar
//           title="Dashboard"
//           onNotificationsClick={() => router.push("/dashboard/notifications")}
//         />
//         <main className="flex-1 overflow-y-auto p-6 bg-[#F5F6FA]">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }






















// src/app/dashboard/layout.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/userdashboard/Sidebar";
import TopBar from "@/components/userdashboard/Topbar.user";

const NAVBAR_HEIGHT = 80;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/notifications?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchUnreadCount();
    const id = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(id);
  }, [token, fetchUnreadCount]);

  useEffect(() => {
    if (!token) setUnreadCount(0);
  }, [token]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ✅ Redirect only after loading is done
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // ✅ Show loader while auth is resolving
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
      key={user.id}
      className="fixed flex"
      style={{ top: NAVBAR_HEIGHT, left: 0, right: 0, bottom: 0 }}
    >
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