




// hooks/useAuthFetch.ts
"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/helpers/supabaseClient"; // ← import singleton

// ← REMOVED: import { createClient } from "@supabase/supabase-js"
// ← REMOVED: const supabase = createClient(...)

export function useAuthFetch() {
  const authFetch = useCallback(async (
    input: RequestInfo | URL,
    init: RequestInit = {},
  ): Promise<Response> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    return fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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