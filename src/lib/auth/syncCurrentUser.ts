import { supabase } from "@/lib/helpers/supabaseClient";

export async function syncCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No active session found");
  }

  const res = await fetch("/api/auth/upsert-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    throw new Error("User sync failed");
  }

  return await res.json();
}