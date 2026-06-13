// "use client";

// // ─────────────────────────────────────────────────────────────────
// // components/NavbarWrapper.tsx  (updated — reads from AuthContext)
// // ─────────────────────────────────────────────────────────────────


// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/mainpagecomponents/Navbar";

// export default function NavbarWrapper() {
//   const { user, signOut } = useAuth();
//   const router = useRouter();

//   return (
//     <Navbar
//       user={user}
//       onLogin={() => router.push("/login")}
//       onSignOut={signOut}
//       onDashboard={() => router.push("/dashboard")}
//     />
//   );
// }


// src\components\mainpagecomponents\Navbarwrapper.tsx

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/mainpagecomponents/Navbar";

export default function NavbarWrapper() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  // Pass null while loading so navbar shows no user (no flicker/ghost state)
  return (
    <Navbar
      user={loading ? null : user}
      onLogin={() => router.push("/login")}
      onSignOut={signOut}
      onDashboard={() => router.push("/dashboard")}
    />
  );
}