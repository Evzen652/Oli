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

  const fetchProfile = useCallback(async (cancelled?: { v: boolean }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || cancelled?.v) { setLoading(false); return; }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cancelled?.v) return;
    setProfile(data as Profile | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const c = { v: false };
    fetchProfile(c);
    return () => { c.v = true; };
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: { display_name?: string; locale?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) throw error;
    await fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
