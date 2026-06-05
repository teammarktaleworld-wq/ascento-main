// // app/dashboard/layout.tsx

// export default function UserDashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex">
//       {/* <UserSidebar /> */}
//       <main>{children}</main>
//     </div>
//   );
// }












"use client";

import { useState } from "react";
import UserTopBar from "@/components/userdashboard/Topbar.user";
import UserNotificationsView from "@/components/userdashboard/Notificationsview.user";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <UserTopBar
        title={showNotifications ? "notifications" : "dashboard"}
        onNotificationsClick={() => setShowNotifications(true)}
      />

      {/* <UserSidebar /> */}
      <main className="flex-1 p-6">
        {showNotifications ? (
          <UserNotificationsView />
        ) : (
          children
        )}
      </main>
    </div>
  );
}