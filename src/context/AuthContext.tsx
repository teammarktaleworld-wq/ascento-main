
// src\context\AuthContext.tsx

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
  ready: boolean; // true once the first session check is done
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  ready: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<AuthUser>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready,   setReady]   = useState(false); // ← NEW
  const isFetching = useRef(false);

  const loadUser = async (
    accessToken: string,
    userId: string,
    supabaseMeta: Record<string, unknown>
  ) => {
    if (isFetching.current) return;
    isFetching.current = true;

    setToken(accessToken);

    try {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });

      if (res.ok) {
        const dbUser = await res.json();
        setUser({
          id:     dbUser.id,
          email:  dbUser.email,
          name:   dbUser.name
                    || (supabaseMeta?.full_name as string)
                    || (supabaseMeta?.name as string)
                    || dbUser.email?.split("@")[0]
                    || "User",
          avatar: dbUser.avatarUrl
                    || (supabaseMeta?.avatar_url as string)
                    || (supabaseMeta?.picture as string)
                    || undefined,
          role: dbUser.role, // always from DB, never trust JWT
        });
      } else {
        console.warn("/api/me returned", res.status);
        // Fallback — keep them logged in with minimal data
        setUser({
          id:     userId,
          email:  (supabaseMeta?.email as string) || "",
          name:   (supabaseMeta?.full_name as string)
                    || (supabaseMeta?.name as string)
                    || "User",
          avatar: (supabaseMeta?.avatar_url as string)
                    || (supabaseMeta?.picture as string)
                    || undefined,
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
      setReady(true); // ← mark ready after first load, success or failure
    }
  };

  useEffect(() => {
    // 1. Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUser(
          session.access_token,
          session.user.id,
          session.user.user_metadata
        );
      } else {
        setUser(null);
        setToken(null);
        setLoading(false);
        setReady(true); // ← no session, but we're done checking
      }
    });

    // 2. Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setUser(null);
          setToken(null);
          setLoading(false);
          setReady(true);
          return;
        }

        if (event === "TOKEN_REFRESHED") {
          setToken(session.access_token); // silent token update, no re-fetch
          return;
        }

        if (event === "SIGNED_IN") {
          await loadUser(
            session.access_token,
            session.user.id,
            session.user.user_metadata
          );
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    setLoading(true);
    setReady(false);
    try {
      // 1. Clear HTTP cache — prevents next user seeing stale responses
      if (typeof window !== "undefined" && "caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      // 2. Clear any local storage keys your app uses
      localStorage.clear();
      sessionStorage.clear();
      // 3. Sign out from Supabase
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setUser(null);
    setToken(null);
    setLoading(false);
    // Hard redirect — destroys entire React tree, zero stale state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, ready, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);