
// // src\context\AuthContext.tsx

// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useRef,
//   ReactNode,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";

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
//   ready: boolean; // true once the first session check is done
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   token: null,
//   loading: true,
//   ready: false,
//   signOut: async () => {},
// });

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [ready,   setReady]   = useState(false); // ← NEW
//   const isFetching = useRef(false);

//   const loadUser = async (
//     accessToken: string,
//     userId: string,
//     supabaseMeta: Record<string, unknown>
//   ) => {
//     if (isFetching.current) return;
//     isFetching.current = true;

//     setToken(accessToken);

//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache: "no-store",
//       });

//       if (res.ok) {
//         const dbUser = await res.json();
//         setUser({
//           id:     dbUser.id,
//           email:  dbUser.email,
//           name:   dbUser.name
//                     || (supabaseMeta?.full_name as string)
//                     || (supabaseMeta?.name as string)
//                     || dbUser.email?.split("@")[0]
//                     || "User",
//           avatar: dbUser.avatarUrl
//                     || (supabaseMeta?.avatar_url as string)
//                     || (supabaseMeta?.picture as string)
//                     || undefined,
//           role: dbUser.role, // always from DB, never trust JWT
//         });
//       } else {
//         console.warn("/api/me returned", res.status);
//         // Fallback — keep them logged in with minimal data
//         setUser({
//           id:     userId,
//           email:  (supabaseMeta?.email as string) || "",
//           name:   (supabaseMeta?.full_name as string)
//                     || (supabaseMeta?.name as string)
//                     || "User",
//           avatar: (supabaseMeta?.avatar_url as string)
//                     || (supabaseMeta?.picture as string)
//                     || undefined,
//           role: "user",
//         });
//       }
//     } catch (err) {
//       console.error("Failed to load DB user:", err);
//       setUser(null);
//       setToken(null);
//     } finally {
//       isFetching.current = false;
//       setLoading(false);
//       setReady(true); // ← mark ready after first load, success or failure
//     }
//   };

//   useEffect(() => {
//     // 1. Check existing session on mount
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         loadUser(
//           session.access_token,
//           session.user.id,
//           session.user.user_metadata
//         );
//       } else {
//         setUser(null);
//         setToken(null);
//         setLoading(false);
//         setReady(true); // ← no session, but we're done checking
//       }
//     });

//     // 2. Listen for auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (!session) {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//           setReady(true);
//           return;
//         }

//         if (event === "TOKEN_REFRESHED") {
//           setToken(session.access_token); // silent token update, no re-fetch
//           return;
//         }

//         if (event === "SIGNED_IN") {
//           await loadUser(
//             session.access_token,
//             session.user.id,
//             session.user.user_metadata
//           );
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     setLoading(true);
//     setReady(false);
//     try {
//       // 1. Clear HTTP cache — prevents next user seeing stale responses
//       if (typeof window !== "undefined" && "caches" in window) {
//         const cacheNames = await caches.keys();
//         await Promise.all(cacheNames.map(name => caches.delete(name)));
//       }
//       // 2. Clear any local storage keys your app uses
//       localStorage.clear();
//       sessionStorage.clear();
//       // 3. Sign out from Supabase
//       await supabase.auth.signOut();
//     } catch (err) {
//       console.error("Sign out error:", err);
//     }
//     setUser(null);
//     setToken(null);
//     setLoading(false);
//     // Hard redirect — destroys entire React tree, zero stale state
//     window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, loading, ready, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

















// // context/AuthContext.tsx
// // Patches applied:
// //  1. AuthUser.status field
// //  2. loadUser() checks status + forceLogoutAt
// //  3. loginTime stored in sessionStorage on SIGNED_IN
// //  4. Restored sessions also set loginTime
// //  5. Background validation every 30s
// //  6. /api/me returns forceLogoutAt + status (already done in route)

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type AuthUser = {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
//   role: string;
//   status?: string;   // ← patch 1
// } | null;

// interface AuthContextValue {
//   user:    AuthUser;
//   token:   string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }

// // ── Context ───────────────────────────────────────────────────────────────────

// const AuthContext = createContext<AuthContextValue>({
//   user:    null,
//   token:   null,
//   loading: true,
//   signOut: async () => {},
// });

// // ── Provider ──────────────────────────────────────────────────────────────────

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Stable ref so intervals / callbacks always call the latest signOut
//   const signOutRef = useRef<() => Promise<void>>(async () => {});

//   const signOut = async () => {
//     setUser(null);
//     setToken(null);
//     sessionStorage.removeItem("loginTime");
//     await supabase.auth.signOut();
//   };

//   // Keep ref in sync
//   useEffect(() => {
//     signOutRef.current = signOut;
//   });

//   // ── loadUser ───────────────────────────────────────────────────────────────
//   // Fetch /api/me and validate status + forceLogoutAt (patch 2)
//   const loadUser = async (
//     accessToken: string,
//     _userId: string,
//     supabaseMeta: Record<string, unknown> = {},
//   ) => {
//     setToken(accessToken);
//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache: "no-store",
//       });

//       // ── patch 2 ────────────────────────────────────────────────────────────
//       if (!res.ok) {
//         console.warn("/api/me returned", res.status);
//         await signOutRef.current();
//         return;
//       }

//       const dbUser = await res.json();

//       const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//       // Account disabled / suspended / deleted
//       if (dbUser.status !== "Active") {
//         await signOutRef.current();
//         return;
//       }

//       // Admin regenerated password → forceLogoutAt is newer than this session's login
//       if (
//         dbUser.forceLogoutAt &&
//         new Date(dbUser.forceLogoutAt).getTime() > loginTime
//       ) {
//         await signOutRef.current();
//         return;
//       }

//       setUser({
//         id:   dbUser.id,
//         email: dbUser.email,
//         name:
//           dbUser.name ||
//           (supabaseMeta?.full_name as string) ||
//           (supabaseMeta?.name as string) ||
//           dbUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           dbUser.avatarUrl ||
//           (supabaseMeta?.avatar_url as string) ||
//           (supabaseMeta?.picture as string) ||
//           undefined,
//         role:   dbUser.role,
//         status: dbUser.status,   // ← patch 1
//       });
//       // ──────────────────────────────────────────────────────────────────────
//     } catch (err) {
//       console.error("loadUser error:", err);
//       await signOutRef.current();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Auth state listener ────────────────────────────────────────────────────
//   useEffect(() => {
//     // Restore existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         // ── patch 4 ──────────────────────────────────────────────────────────
//         if (!sessionStorage.getItem("loginTime")) {
//           sessionStorage.setItem("loginTime", String(Date.now()));
//         }
//         loadUser(
//           session.access_token,
//           session.user.id,
//           session.user.user_metadata,
//         );
//         // ────────────────────────────────────────────────────────────────────
//       } else {
//         setLoading(false);
//       }
//     });

//     // Live auth events
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session: Session | null) => {
//         if (event === "SIGNED_IN" && session) {
//           // ── patch 3 ────────────────────────────────────────────────────────
//           sessionStorage.setItem("loginTime", String(Date.now()));
//           // ──────────────────────────────────────────────────────────────────
//           await loadUser(
//             session.access_token,
//             session.user.id,
//             session.user.user_metadata,
//           );
//         }

//         if (event === "TOKEN_REFRESHED" && session) {
//           setToken(session.access_token);
//         }

//         if (event === "SIGNED_OUT") {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//         }
//       },
//     );

//     return () => subscription.unsubscribe();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Patch 5: background validation every 30 s ─────────────────────────────
//   useEffect(() => {
//     if (!token) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           await signOutRef.current();
//           return;
//         }

//         const dbUser = await res.json();
//         const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//         if (dbUser.status !== "Active") {
//           await signOutRef.current();
//           return;
//         }

//         if (
//           dbUser.forceLogoutAt &&
//           new Date(dbUser.forceLogoutAt).getTime() > loginTime
//         ) {
//           await signOutRef.current();
//         }
//       } catch (err) {
//         console.error("Background auth check failed:", err);
//       }
//     }, 30_000);

//     return () => clearInterval(interval);
//   }, [token]);
//   // ──────────────────────────────────────────────────────────────────────────

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useAuth() {
//   return useContext(AuthContext);
// }









// context/AuthContext.tsx
// Patches applied:
//  1. AuthUser.status field
//  2. loadUser() checks status + forceLogoutAt
//  3. loginTime stored in sessionStorage on SIGNED_IN
//  4. Restored sessions also set loginTime
//  5. Background validation every 30s
//  6. /api/me returns forceLogoutAt + status (already done in route)

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type AuthUser = {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
//   role: string;
//   status?: string;   // ← patch 1
// } | null;

// interface AuthContextValue {
//   user:    AuthUser;
//   token:   string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }

// // ── Context ───────────────────────────────────────────────────────────────────

// const AuthContext = createContext<AuthContextValue>({
//   user:    null,
//   token:   null,
//   loading: true,
//   signOut: async () => {},
// });

// // ── Provider ──────────────────────────────────────────────────────────────────

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Stable ref so intervals / callbacks always call the latest signOut
//   const signOutRef = useRef<() => Promise<void>>(async () => {});

//   const signOut = async () => {
//     setUser(null);
//     setToken(null);
//     sessionStorage.removeItem("loginTime");
//     await supabase.auth.signOut();
//   };

//   // Keep ref in sync
//   useEffect(() => {
//     signOutRef.current = signOut;
//   });

//   // ── loadUser ───────────────────────────────────────────────────────────────
//   // Fetch /api/me and validate status + forceLogoutAt (patch 2)
//   const loadUser = async (
//     accessToken: string,
//     _userId: string,
//     supabaseMeta: Record<string, unknown> = {},
//   ) => {
//     setToken(accessToken);
//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache: "no-store",
//       });

//       // ── patch 2 ────────────────────────────────────────────────────────────
//       if (!res.ok) {
//         console.warn("/api/me returned", res.status);
//         await signOutRef.current();
//         return;
//       }

//       const dbUser = await res.json();

//       const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//       // Account disabled / suspended / deleted
//       if (dbUser.status !== "Active") {
//         await signOutRef.current();
//         return;
//       }

//       // Admin regenerated password → forceLogoutAt is newer than this session's login
//       if (
//         dbUser.forceLogoutAt &&
//         new Date(dbUser.forceLogoutAt).getTime() > loginTime
//       ) {
//         await signOutRef.current();
//         return;
//       }

//       setUser({
//         id:   dbUser.id,
//         email: dbUser.email,
//         name:
//           dbUser.name ||
//           (supabaseMeta?.full_name as string) ||
//           (supabaseMeta?.name as string) ||
//           dbUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           dbUser.avatarUrl ||
//           (supabaseMeta?.avatar_url as string) ||
//           (supabaseMeta?.picture as string) ||
//           undefined,
//         role:   dbUser.role,
//         status: dbUser.status,   // ← patch 1
//       });
//       // ──────────────────────────────────────────────────────────────────────
//     } catch (err) {
//       console.error("loadUser error:", err);
//       await signOutRef.current();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Auth state listener ────────────────────────────────────────────────────
//   useEffect(() => {
//     // Restore existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         // ── patch 4 ──────────────────────────────────────────────────────────
//         if (!sessionStorage.getItem("loginTime")) {
//           sessionStorage.setItem("loginTime", String(Date.now()));
//         }
//         loadUser(
//           session.access_token,
//           session.user.id,
//           session.user.user_metadata,
//         );
//         // ────────────────────────────────────────────────────────────────────
//       } else {
//         setLoading(false);
//       }
//     });

//     // Live auth events
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session: Session | null) => {
//         if (event === "SIGNED_IN" && session) {
//           // ── patch 3 ────────────────────────────────────────────────────────
//           sessionStorage.setItem("loginTime", String(Date.now()));
//           // ──────────────────────────────────────────────────────────────────
//           await loadUser(
//             session.access_token,
//             session.user.id,
//             session.user.user_metadata,
//           );
//         }

//         if (event === "TOKEN_REFRESHED" && session) {
//           setToken(session.access_token);
//         }

//         if (event === "SIGNED_OUT") {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//         }
//       },
//     );

//     return () => subscription.unsubscribe();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Patch 5: background validation every 30 s ─────────────────────────────
//   useEffect(() => {
//     if (!token) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache: "no-store",
//         });

//         if (!res.ok) {
//           await signOutRef.current();
//           return;
//         }

//         const dbUser = await res.json();
//         const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//         if (dbUser.status !== "Active") {
//           await signOutRef.current();
//           return;
//         }

//         if (
//           dbUser.forceLogoutAt &&
//           new Date(dbUser.forceLogoutAt).getTime() > loginTime
//         ) {
//           await signOutRef.current();
//         }
//       } catch (err) {
//         console.error("Background auth check failed:", err);
//       }
//     }, 30_000);

//     return () => clearInterval(interval);
//   }, [token]);
//   // ──────────────────────────────────────────────────────────────────────────

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useAuth() {
//   return useContext(AuthContext);
// }





















// // context/AuthContext.tsx
// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// // ── Types ─────────────────────────────────────────────────────────────────────

// export type AuthUser = {
//   id:      string;
//   email:   string;
//   name:    string;
//   avatar?: string;
//   role:    string;
//   status?: string;
// } | null;

// interface AuthContextValue {
//   user:    AuthUser;
//   token:   string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }

// // ── Context ───────────────────────────────────────────────────────────────────

// const AuthContext = createContext<AuthContextValue>({
//   user:    null,
//   token:   null,
//   loading: true,
//   signOut: async () => {},
// });

// // ── Provider ──────────────────────────────────────────────────────────────────

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Stable ref so intervals / callbacks always see the latest signOut
//   const signOutRef = useRef<() => Promise<void>>(async () => {});

//   const signOut = async () => {
//     setUser(null);
//     setToken(null);
//     sessionStorage.removeItem("loginTime");
//     await supabase.auth.signOut();
//   };

//   // Keep ref in sync with latest signOut closure
//   useEffect(() => {
//     signOutRef.current = signOut;
//   });

//   // ── loadUser ───────────────────────────────────────────────────────────────
//   // Calls /api/me with the Supabase access token.
//   // /api/me is the single source of truth — it checks status + forceLogoutAt.
//   // No Supabase session logic here beyond passing the token.
//   const loadUser = async (
//     accessToken: string,
//     supabaseMeta: Record<string, unknown> = {},
//   ) => {
//     setToken(accessToken);
//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache:   "no-store",
//       });

//       // 401 = bad token, 403 = account disabled/suspended — sign out either way
//       if (!res.ok) {
//         console.warn("/api/me returned", res.status);
//         await signOutRef.current();
//         return;
//       }

//       const dbUser = await res.json();
//       const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//       // /api/me already returns 403 for non-Active accounts, but double-check
//       // in case you have an older version of the route deployed
//       if (dbUser.status && dbUser.status !== "Active") {
//         await signOutRef.current();
//         return;
//       }

//       // Password was regenerated after this session started → kick the session
//       if (
//         dbUser.forceLogoutAt &&
//         new Date(dbUser.forceLogoutAt).getTime() > loginTime
//       ) {
//         await signOutRef.current();
//         return;
//       }

//       setUser({
//         id:   dbUser.id,
//         email: dbUser.email,
//         name:
//           dbUser.name ||
//           (supabaseMeta?.full_name as string) ||
//           (supabaseMeta?.name    as string) ||
//           dbUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           dbUser.avatarUrl ||
//           (supabaseMeta?.avatar_url as string) ||
//           (supabaseMeta?.picture   as string) ||
//           undefined,
//         role:   dbUser.role,
//         status: dbUser.status,
//       });
//     } catch (err) {
//       console.error("loadUser error:", err);
//       await signOutRef.current();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Auth state listener ────────────────────────────────────────────────────
//   useEffect(() => {
//     // Restore existing Supabase session on page load
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         // Preserve loginTime across page refreshes — only set if not already stored
//         if (!sessionStorage.getItem("loginTime")) {
//           sessionStorage.setItem("loginTime", String(Date.now()));
//         }
//         loadUser(session.access_token, session.user.user_metadata);
//       } else {
//         setLoading(false);
//       }
//     });

//     // Live auth events
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session: Session | null) => {
//         if (event === "SIGNED_IN" && session) {
//           // Fresh login — record the time so forceLogoutAt comparisons work
//           sessionStorage.setItem("loginTime", String(Date.now()));
//           await loadUser(session.access_token, session.user.user_metadata);
//         }

//         if (event === "TOKEN_REFRESHED" && session) {
//           // Just update the token — no need to re-validate the user
//           setToken(session.access_token);
//         }

//         if (event === "SIGNED_OUT") {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//         }
//       },
//     );

//     return () => subscription.unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Background validation every 30 s ──────────────────────────────────────
//   // Catches: account disabled, password regenerated, token revoked.
//   // /api/me is the only authority — no Supabase session calls here.
//   useEffect(() => {
//     if (!token) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache:   "no-store",
//         });

//         // 401 = token expired/invalid, 403 = account disabled — sign out
//         if (!res.ok) {
//           await signOutRef.current();
//           return;
//         }

//         const dbUser    = await res.json();
//         const loginTime = Number(sessionStorage.getItem("loginTime") ?? "0");

//         // Account was disabled/suspended since last check
//         if (dbUser.status && dbUser.status !== "Active") {
//           await signOutRef.current();
//           return;
//         }

//         // Admin regenerated password → forceLogoutAt is newer than this session
//         if (
//           dbUser.forceLogoutAt &&
//           new Date(dbUser.forceLogoutAt).getTime() > loginTime
//         ) {
//           await signOutRef.current();
//         }
//       } catch (err) {
//         console.error("Background auth check failed:", err);
//         // Network error — don't sign out, let next tick retry
//       }
//     }, 30_000);

//     return () => clearInterval(interval);
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useAuth() {
//   return useContext(AuthContext);
// }

















// // context/AuthContext.tsx
// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// export type AuthUser = {
//   id:      string;
//   email:   string;
//   name:    string;
//   avatar?: string;
//   role:    string;
//   status?: string;
// } | null;

// interface AuthContextValue {
//   user:    AuthUser;
//   token:   string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue>({
//   user:    null,
//   token:   null,
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const signOutRef = useRef<() => Promise<void>>(async () => {});

//   const signOut = async () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("loginTime");                // ← was sessionStorage
//     await supabase.auth.signOut();
//   };

//   useEffect(() => {
//     signOutRef.current = signOut;
//   });

//   const loadUser = async (
//     accessToken: string,
//     supabaseMeta: Record<string, unknown> = {},
//   ) => {
//     setToken(accessToken);
//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache:   "no-store",
//       });

//       if (!res.ok) {
//         console.warn("/api/me returned", res.status);
//         await signOutRef.current();
//         return;
//       }

//       const dbUser = await res.json();
//       const loginTime = Number(localStorage.getItem("loginTime") ?? "0"); // ← was sessionStorage

//       if (dbUser.status && dbUser.status !== "Active") {
//         await signOutRef.current();
//         return;
//       }

//       if (
//         dbUser.forceLogoutAt &&
//         new Date(dbUser.forceLogoutAt).getTime() > loginTime
//       ) {
//         await signOutRef.current();
//         return;
//       }

//       setUser({
//         id:     dbUser.id,
//         email:  dbUser.email,
//         name:
//           dbUser.name ||
//           (supabaseMeta?.full_name as string) ||
//           (supabaseMeta?.name     as string) ||
//           dbUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           dbUser.avatarUrl ||
//           (supabaseMeta?.avatar_url as string) ||
//           (supabaseMeta?.picture   as string) ||
//           undefined,
//         role:   dbUser.role,
//         status: dbUser.status,
//       });
//     } catch (err) {
//       console.error("loadUser error:", err);
//       await signOutRef.current();
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         // Survive page refresh + server restarts — localStorage persists
//         if (!localStorage.getItem("loginTime")) {        // ← was sessionStorage
//           localStorage.setItem("loginTime", String(Date.now()));
//         }
//         loadUser(session.access_token, session.user.user_metadata);
//       } else {
//         setLoading(false);
//       }
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session: Session | null) => {
//         if (event === "SIGNED_IN" && session) {
//           localStorage.setItem("loginTime", String(Date.now())); // ← was sessionStorage
//           await loadUser(session.access_token, session.user.user_metadata);
//         }

//         if (event === "TOKEN_REFRESHED" && session) {
//           setToken(session.access_token);
//         }

//         if (event === "SIGNED_OUT") {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//         }
//       },
//     );

//     return () => subscription.unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Background validation every 30s ───────────────────────────────────────
//   useEffect(() => {
//     if (!token) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache:   "no-store",
//         });

//         if (!res.ok) {
//           await signOutRef.current();
//           return;
//         }

//         const dbUser    = await res.json();
//         const loginTime = Number(localStorage.getItem("loginTime") ?? "0"); // ← was sessionStorage

//         if (dbUser.status && dbUser.status !== "Active") {
//           await signOutRef.current();
//           return;
//         }

//         if (
//           dbUser.forceLogoutAt &&
//           new Date(dbUser.forceLogoutAt).getTime() > loginTime
//         ) {
//           await signOutRef.current();
//         }
//       } catch (err) {
//         console.error("Background auth check failed:", err);
//       }
//     }, 30_000);

//     return () => clearInterval(interval);
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }









// // context/AuthContext.tsx
// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import { supabase } from "@/lib/helpers/supabaseClient";
// import type { Session } from "@supabase/supabase-js";

// export type AuthUser = {
//   id:      string;
//   email:   string;
//   name:    string;
//   avatar?: string;
//   role:    string;
//   status?: string;
// } | null;

// interface AuthContextValue {
//   user:    AuthUser;
//   token:   string | null;
//   loading: boolean;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextValue>({
//   user:    null,
//   token:   null,
//   loading: true,
//   signOut: async () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user,    setUser]    = useState<AuthUser>(null);
//   const [token,   setToken]   = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   const signOutRef     = useRef<() => Promise<void>>(async () => {});
//   const loadingUserRef = useRef(false); // ← dedup guard

//   const signOut = async () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("loginTime");
//     await supabase.auth.signOut();
//   };

//   useEffect(() => {
//     signOutRef.current = signOut;
//   });

//   const loadUser = async (
//     accessToken: string,
//     supabaseMeta: Record<string, unknown> = {},
//     retryCount = 0,
//   ) => {
//     // Prevent concurrent calls (duplicate SIGNED_IN + getSession race)
//     if (loadingUserRef.current) return;
//     loadingUserRef.current = true;

//     console.log(`loadUser start (attempt ${retryCount + 1})`);

//     setToken(accessToken);
//     try {
//       const res = await fetch("/api/me", {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         cache:   "no-store",
//       });

//       console.log("/api/me status", res.status);

//       // User row not created yet — upsert-user is still in flight.
//       // Retry up to 5 times (5 s total) instead of signing out.
//       if (res.status === 404) {
//         if (retryCount >= 5) {
//           console.error("User sync failed after 5 retries, signing out");
//           await signOutRef.current();
//           return;
//         }
//         console.log(`User not synced yet, retrying in 1s... (${retryCount + 1}/5)`);
//         loadingUserRef.current = false; // release lock before retry
//         setTimeout(() => {
//           loadUser(accessToken, supabaseMeta, retryCount + 1);
//         }, 1000);
//         return;
//       }

//       // Transient server error (Prisma hiccup, cold start) — retry once after 2 s.
//       if (res.status === 500) {
//         if (retryCount >= 5) {
//           console.error("Server error persisted after 5 retries, signing out");
//           await signOutRef.current();
//           return;
//         }
//         console.warn(`Server error on /api/me, retrying in 2s... (${retryCount + 1}/5)`);
//         loadingUserRef.current = false;
//         setTimeout(() => {
//           loadUser(accessToken, supabaseMeta, retryCount + 1);
//         }, 2000);
//         return;
//       }

//       if (!res.ok) {
//         console.warn("/api/me returned", res.status, "— signing out");
//         await signOutRef.current();
//         return;
//       }

//       const dbUser    = await res.json();
//       const loginTime = Number(localStorage.getItem("loginTime") ?? "0");

//       if (dbUser.status && dbUser.status !== "Active") {
//         await signOutRef.current();
//         return;
//       }

//       if (
//         dbUser.forceLogoutAt &&
//         new Date(dbUser.forceLogoutAt).getTime() > loginTime
//       ) {
//         await signOutRef.current();
//         return;
//       }

//       console.log("loadUser success", dbUser.role);

//       setUser({
//         id:     dbUser.id,
//         email:  dbUser.email,
//         name:
//           dbUser.name ||
//           (supabaseMeta?.full_name as string) ||
//           (supabaseMeta?.name     as string) ||
//           dbUser.email?.split("@")[0] ||
//           "User",
//         avatar:
//           dbUser.avatarUrl ||
//           (supabaseMeta?.avatar_url as string) ||
//           (supabaseMeta?.picture   as string) ||
//           undefined,
//         role:   dbUser.role,
//         status: dbUser.status,
//       });
//     } catch (err) {
//       console.error("loadUser error:", err);
//       await signOutRef.current();
//     } finally {
//       loadingUserRef.current = false;
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         if (!localStorage.getItem("loginTime")) {
//           localStorage.setItem("loginTime", String(Date.now()));
//         }
//         loadUser(session.access_token, session.user.user_metadata);
//       } else {
//         setLoading(false);
//       }
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session: Session | null) => {
//         if (event === "SIGNED_IN" && session) {
//           localStorage.setItem("loginTime", String(Date.now()));
//           await loadUser(session.access_token, session.user.user_metadata);
//         }

//         if (event === "TOKEN_REFRESHED" && session) {
//           setToken(session.access_token);
//         }

//         if (event === "SIGNED_OUT") {
//           setUser(null);
//           setToken(null);
//           setLoading(false);
//         }
//       },
//     );

//     return () => subscription.unsubscribe();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Background validation every 30s ───────────────────────────────────────
//   useEffect(() => {
//     if (!token) return;

//     const interval = setInterval(async () => {
//       try {
//         const res = await fetch("/api/me", {
//           headers: { Authorization: `Bearer ${token}` },
//           cache:   "no-store",
//         });

//         if (!res.ok) {
//           await signOutRef.current();
//           return;
//         }

//         const dbUser    = await res.json();
//         const loginTime = Number(localStorage.getItem("loginTime") ?? "0");

//         if (dbUser.status && dbUser.status !== "Active") {
//           await signOutRef.current();
//           return;
//         }

//         if (
//           dbUser.forceLogoutAt &&
//           new Date(dbUser.forceLogoutAt).getTime() > loginTime
//         ) {
//           await signOutRef.current();
//         }
//       } catch (err) {
//         console.error("Background auth check failed:", err);
//       }
//     }, 30_000);

//     return () => clearInterval(interval);
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ user, token, loading, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }


















// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/helpers/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export type AuthUser = {
  id:      string;
  email:   string;
  name:    string;
  avatar?: string;
  role:    string;
  status?: string;
} | null;

interface AuthContextValue {
  user:    AuthUser;
  token:   string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:    null,
  token:   null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<AuthUser>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signOutRef     = useRef<() => Promise<void>>(async () => {});
  const loadingUserRef = useRef(false);

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("loginTime");
    await supabase.auth.signOut();
  };

  useEffect(() => {
    signOutRef.current = signOut;
  });

  const loadUser = async (
    accessToken: string,
    supabaseMeta: Record<string, unknown> = {},
    retryCount = 0,
  ) => {
    if (loadingUserRef.current) return;
    loadingUserRef.current = true;

    console.log(`loadUser start (attempt ${retryCount + 1})`);

    setToken(accessToken);
    try {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache:   "no-store",
      });

      console.log("/api/me status", res.status);

      if (res.status === 404) {
        if (retryCount >= 5) {
          console.error("User sync failed after 5 retries, signing out");
          await signOutRef.current();
          return;
        }
        console.log(`User not synced yet, retrying in 1s... (${retryCount + 1}/5)`);
        loadingUserRef.current = false;
        setTimeout(() => {
          loadUser(accessToken, supabaseMeta, retryCount + 1);
        }, 1000);
        return;
      }

      if (res.status === 500) {
        if (retryCount >= 5) {
          console.error("Server error persisted after 5 retries, signing out");
          await signOutRef.current();
          return;
        }
        console.warn(`Server error on /api/me, retrying in 2s... (${retryCount + 1}/5)`);
        loadingUserRef.current = false;
        setTimeout(() => {
          loadUser(accessToken, supabaseMeta, retryCount + 1);
        }, 2000);
        return;
      }

      if (!res.ok) {
        console.warn("/api/me returned", res.status, "— signing out");
        await signOutRef.current();
        return;
      }

      const dbUser    = await res.json();
      const loginTime = Number(localStorage.getItem("loginTime") ?? "0");

      if (dbUser.status && dbUser.status !== "Active") {
        await signOutRef.current();
        return;
      }

      if (
        dbUser.forceLogoutAt &&
        new Date(dbUser.forceLogoutAt).getTime() > loginTime
      ) {
        await signOutRef.current();
        return;
      }

      console.log("loadUser success", dbUser.role);

      setUser({
        id:    dbUser.id,
        email: dbUser.email,
        name:
          dbUser.name ||
          (supabaseMeta?.full_name as string) ||
          (supabaseMeta?.name     as string) ||
          dbUser.email?.split("@")[0] ||
          "User",
        avatar:
          dbUser.avatarUrl ||
          (supabaseMeta?.avatar_url as string) ||
          (supabaseMeta?.picture   as string) ||
          undefined,
        role:   dbUser.role,
        status: dbUser.status,
      });
    } catch (err) {
      console.error("loadUser error:", err);
      await signOutRef.current();
    } finally {
      loadingUserRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // On page load — session already exists (e.g. returning user, page refresh).
    // No delay needed here because the DB row already exists.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (!localStorage.getItem("loginTime")) {
          localStorage.setItem("loginTime", String(Date.now()));
        }
        loadUser(session.access_token, session.user.user_metadata);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          localStorage.setItem("loginTime", String(Date.now()));

          // Delay gives syncCurrentUser() on the login/register/callback page
          // time to finish writing the Prisma row before we call /api/me.
          // Without this, AuthContext races ahead and hits a 404 on new signups.
          setTimeout(() => {
            loadUser(session.access_token, session.user.user_metadata);
          }, 1500);
        }

        if (event === "TOKEN_REFRESHED" && session) {
          setToken(session.access_token);
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
      },
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Background validation every 30s ───────────────────────────────────────
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
          cache:   "no-store",
        });

        if (!res.ok) {
          await signOutRef.current();
          return;
        }

        const dbUser    = await res.json();
        const loginTime = Number(localStorage.getItem("loginTime") ?? "0");

        if (dbUser.status && dbUser.status !== "Active") {
          await signOutRef.current();
          return;
        }

        if (
          dbUser.forceLogoutAt &&
          new Date(dbUser.forceLogoutAt).getTime() > loginTime
        ) {
          await signOutRef.current();
        }
      } catch (err) {
        console.error("Background auth check failed:", err);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}