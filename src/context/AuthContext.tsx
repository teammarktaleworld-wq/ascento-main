// "use client";

// // ─────────────────────────────────────────────────────────────────
// // context/AuthContext.tsx
// //
// // • Listens to Supabase auth state changes
// // • Keeps user profile in React context (accessible everywhere)
// // • NavbarWrapper reads from this — no prop drilling needed
// // ─────────────────────────────────────────────────────────────────

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import { useRouter } from "next/navigation";

// export type AuthUser = {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
//   role: string;
// } | null;

// type AuthContextType = {
//   user: AuthUser;
//   loading: boolean;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser]       = useState<AuthUser>(null);
//   const [loading, setLoading] = useState(true);
//   const router                = useRouter();

//   /* Helper: shape supabase user → AuthUser */
//   const shapeUser = (supaUser: any): AuthUser => {
//     if (!supaUser) return null;
//     return {
//       id:     supaUser.id,
//       email:  supaUser.email ?? "",
//       name:   supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
//       avatar: supaUser.user_metadata?.avatar_url ?? undefined,
//       role:   supaUser.user_metadata?.role ?? "user",
//     };
//   };

//   useEffect(() => {
//     /* 1. Get current session on mount */
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(shapeUser(session?.user ?? null));
//       setLoading(false);
//     });

//     /* 2. Subscribe to auth changes (login, logout, token refresh) */
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(shapeUser(session?.user ?? null));
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     router.push("/");
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// /* Hook for easy consumption */
// export const useAuth = () => useContext(AuthContext);








"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
} | null;

type AuthContextType = {
  user: AuthUser;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🔥 NEW: fetch user from DB
  const fetchUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      setUser(null);
      setLoading(false);
      return;
    }

    const token = data.session.access_token;

    try {
      const res = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const dbUser = await res.json();

      setUser({
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name ?? dbUser.email.split("@")[0],
        avatar: dbUser.avatarUrl ?? undefined,
        role: dbUser.role, // ✅ FROM DATABASE
      });
    } catch (err) {
      console.error(err);
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    // 1. Initial load
    fetchUser();

    // 2. Listen for auth changes
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(() => {
        fetchUser();
      });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);