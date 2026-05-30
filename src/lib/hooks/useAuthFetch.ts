// hooks/useAuthFetch.ts
"use client";

import { useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Returns an `authFetch` function identical to `fetch` but automatically
 * injects `Authorization: Bearer <token>` from the active Supabase session.
 *
 * Usage:
 *   const authFetch = useAuthFetch();
 *   const res = await authFetch("/api/notifications");
 */
export function useAuthFetch() {
  const authFetch = useCallback(async (
    input: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<Response> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Preserve Content-Type if caller already set it
        ...("Content-Type" in (init.headers ?? {})
          ? {}
          : init.body
            ? { "Content-Type": "application/json" }
            : {}),
      },
    });
  }, []);

  return authFetch;
}