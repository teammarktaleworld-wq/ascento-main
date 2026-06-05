





// "use client";

// import { createContext, useContext, useEffect, useState, ReactNode } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
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
//   token: string | null;   // ← ADD THIS
//   loading: boolean;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,            // ← ADD THIS
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);  // ← ADD THIS
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchUser = async () => {
//     const { data } = await supabase.auth.getSession();

//     if (!data.session) {
//       setUser(null);
//       setToken(null);       // ← ADD THIS
//       setLoading(false);
//       return;
//     }

//     const accessToken = data.session.access_token;
//     setToken(accessToken);  // ← ADD THIS

//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch user");

//       const dbUser = await res.json();

//       setUser({
//         id:     dbUser.id,
//         email:  dbUser.email,
//         name:   dbUser.name ?? dbUser.email.split("@")[0],
//         avatar: dbUser.avatarUrl ?? undefined,
//         role:   dbUser.role,
//       });
//     } catch (err) {
//       console.error(err);
//       setUser(null);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUser();

//     const { data: { subscription } } =
//       supabase.auth.onAuthStateChange(() => { fetchUser(); });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//     setToken(null);         // ← ADD THIS
//     router.push("/");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);












// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
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
//   token: string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [user, setUser] = useState<AuthUser>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   const fetchUser = async () => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         setUser(null);
//         setToken(null);
//         setLoading(false);
//         return;
//       }

//       const supabaseUser = session.user;

//       setToken(session.access_token);

//       setUser({
//         id: supabaseUser.id,
//         email: supabaseUser.email || "",
//         name:
//           supabaseUser.user_metadata?.full_name ||
//           supabaseUser.user_metadata?.name ||
//           supabaseUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           supabaseUser.user_metadata?.avatar_url ||
//           supabaseUser.user_metadata?.picture ||
//           undefined,
//         role:
//           supabaseUser.user_metadata?.role ||
//           "user",
//       });

//       setLoading(false);
//     } catch (error) {
//       console.error("AuthContext Error:", error);

//       setUser(null);
//       setToken(null);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         if (!session) {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//           return;
//         }

//         const supabaseUser = session.user;

//         setToken(session.access_token);

//         setUser({
//           id: supabaseUser.id,
//           email: supabaseUser.email || "",
//           name:
//             supabaseUser.user_metadata?.full_name ||
//             supabaseUser.user_metadata?.name ||
//             supabaseUser.email?.split("@")[0] ||
//             "User",
//           avatar:
//             supabaseUser.user_metadata?.avatar_url ||
//             supabaseUser.user_metadata?.picture ||
//             undefined,
//           role:
//             supabaseUser.user_metadata?.role ||
//             "user",
//         });

//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     await supabase.auth.signOut();

//     setUser(null);
//     setToken(null);

//     router.push("/");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);















// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
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
//   token: string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [user, setUser] = useState<AuthUser>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const router = useRouter();

//   const fetchUser = async () => {
//     try {
//       const {
//         data: { session },
//       } = await supabase.auth.getSession();

//       if (!session) {
//         setUser(null);
//         setToken(null);
//         setLoading(false);
//         return;
//       }

//       const supabaseUser = session.user;

//       setToken(session.access_token);

//       // First set user from Supabase session
//       setUser({
//         id: supabaseUser.id,
//         email: supabaseUser.email || "",
//         name:
//           supabaseUser.user_metadata?.full_name ||
//           supabaseUser.user_metadata?.name ||
//           supabaseUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           supabaseUser.user_metadata?.avatar_url ||
//           supabaseUser.user_metadata?.picture ||
//           undefined,
//         role: "user", // temporary until DB loads
//       });

//       // Then load DB role/details
//       try {
//         const res = await fetch("/api/me", {
//           headers: {
//             Authorization: `Bearer ${session.access_token}`,
//           },
//         });

//         if (res.ok) {
//           const dbUser = await res.json();

//           setUser((prev) =>
//             prev
//               ? {
//                   ...prev,
//                   name: dbUser.name || prev.name,
//                   avatar: dbUser.avatarUrl || prev.avatar,
//                   role: dbUser.role || prev.role,
//                 }
//               : null
//           );
//         } else {
//           console.error("/api/me failed:", res.status);
//         }
//       } catch (dbError) {
//         console.error("Failed to load DB user:", dbError);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error("AuthContext Error:", error);

//       setUser(null);
//       setToken(null);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();

//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         if (!session) {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//           return;
//         }

//         fetchUser();
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//     } catch (err) {
//       console.error("Sign out error:", err);
//     }

//     setUser(null);
//     setToken(null);

//     router.push("/");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);











"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/helpers/supabaseClient";
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
  token: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [token, setToken] = useState<string | null>(null);
  // Start as true — don't render anything until we know auth state
  const [loading, setLoading] = useState(true);
  const isFetching = useRef(false);
  const router = useRouter();

  const loadUser = async (accessToken: string, userId: string, supabaseMeta: Record<string, unknown>) => {
    // Prevent concurrent fetches
    if (isFetching.current) return;
    isFetching.current = true;

    setToken(accessToken);

    try {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        // Prevent browser caching stale role data
        cache: "no-store",
      });

      if (res.ok) {
        const dbUser = await res.json();
        setUser({
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || (supabaseMeta?.full_name as string) || (supabaseMeta?.name as string) || dbUser.email?.split("@")[0] || "User",
          avatar: dbUser.avatarUrl || (supabaseMeta?.avatar_url as string) || (supabaseMeta?.picture as string) || undefined,
          role: dbUser.role, // authoritative from DB
        });
      } else {
        // /api/me failed — still set a minimal user so they're not logged out
        console.warn("/api/me returned", res.status);
        setUser({
          id: userId,
          email: (supabaseMeta?.email as string) || "",
          name: (supabaseMeta?.full_name as string) || (supabaseMeta?.name as string) || "User",
          avatar: (supabaseMeta?.avatar_url as string) || (supabaseMeta?.picture as string) || undefined,
          role: "user",
        });
      }
    } catch (err) {
      console.error("Failed to load DB user:", err);
      setUser(null);
      setToken(null);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Immediately check existing session (handles refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser(session.access_token, session.user.id, session.user.user_metadata);
      } else {
        setUser(null);
        setToken(null);
        setLoading(false);
      }
    });

    // 2. Listen for changes: login, logout, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // SIGNED_OUT or no session = clear state
        if (!session) {
          setUser(null);
          setToken(null);
          setLoading(false);
          return;
        }

        // TOKEN_REFRESHED — update token silently without full reload
        if (event === "TOKEN_REFRESHED") {
          setToken(session.access_token);
          return;
        }

        // SIGNED_IN (including OAuth callback) — load full user
        if (event === "SIGNED_IN") {
          await loadUser(session.access_token, session.user.id, session.user.user_metadata);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
    setToken(null);
    setLoading(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);