"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/login");
        return;
      }

      const session = data.session;

      // ✅ 🔥 THIS IS THE MISSING PART
      if (session?.access_token) {
        await fetch("/api/auth/upsert-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }

      // ✅ redirect after saving
      router.replace("/profile");
    };

    handleAuth();
  }, [router]);

  return <p>Logging you in...</p>;
}