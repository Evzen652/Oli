import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "parent" | "child";

export function useUserRole() {
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setLoading(false); return; }

      // Pojistka pro případ víc rolí: enum app_role je definovaný v pořadí
      // ('admin','parent','child'), takže ascending vrátí nejvýše privilegovanou
      // jako první → deterministická volba místo náhodné.
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .order("role", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!cancelled) {
        setRole(data?.role as AppRole | null ?? null);
        setLoading(false);
      }
    }

    fetchRole();
    return () => { cancelled = true; };
  }, []);

  return { role, loading };
}
