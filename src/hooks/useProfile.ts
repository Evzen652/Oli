import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  locale: string;
  created_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    setProfile(data as Profile | null);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: { display_name?: string; locale?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Upsert (ne update) — kdyby řádek profiles ještě neexistoval (timing po signupu
    // nebo účet z doby před DB triggerem), update by tiše zasáhl 0 řádků a onboarding
    // by se zacyklil. Upsert na user_id řádek vždy vytvoří/aktualizuje.
    const { error } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, ...updates }, { onConflict: "user_id" });

    if (error) throw error;
    await fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
