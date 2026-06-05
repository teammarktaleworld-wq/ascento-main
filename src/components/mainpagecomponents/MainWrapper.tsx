// components/MainWrapper.tsx
"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      style={{
        // Admin page manages its own top offset (marginTop: 80px on its shell).
        // Public pages need the 80px padding to clear the fixed navbar.
        paddingTop: isAdmin ? "0px" : "80px",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  );
}