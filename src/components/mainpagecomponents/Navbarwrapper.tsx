"use client";

// ─────────────────────────────────────────────────────────────────
// components/NavbarWrapper.tsx  (updated — reads from AuthContext)
// ─────────────────────────────────────────────────────────────────


import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/mainpagecomponents/Navbar";

export default function NavbarWrapper() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <Navbar
      user={user}
      onLogin={() => router.push("/login")}
      onSignOut={signOut}
      onDashboard={() => router.push("/dashboard")}
    />
  );
}
