import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Child {
  id: string;
  parent_user_id: string;
  child_user_id: string | null;
  child_name: string;
  grade: number;
  pairing_code: string | null;
  pairing_code_expires_at: string | null;
  created_at: string;
  learning_notes: string | null;
  is_paired?: boolean;
}

// Derived from child_user_id presence
export function isPaired(child: Child): boolean {
  return child.is_paired ?? child.child_user_id !== null;
}

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("children")
      .select("*")
      .order("created_at", { ascending: true });
    setChildren((data as Child[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchChildren(); }, [fetchChildren]);

  const addChild = useCallback(async (childName: string, grade: number, learningNotes?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const { data, error } = await supabase
      .from("children")
      .insert({
        parent_user_id: user.id,
        child_name: childName,
        grade,
        learning_notes: learningNotes || null,
        pairing_code: code,
        pairing_code_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    await fetchChildren();
    return data as Child;
  }, [fetchChildren]);

  const regenerateCode = useCallback(async (childId: string) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const { error } = await supabase
      .from("children")
      .update({
        pairing_code: code,
        pairing_code_expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", childId);

    if (error) throw error;
    await fetchChildren();
  }, [fetchChildren]);

  const updateChild = useCallback(async (childId: string, updates: { child_name?: string; grade?: number; learning_notes?: string | null }) => {
    const { error } = await supabase
      .from("children")
      .update(updates)
      .eq("id", childId);
    if (error) throw error;
    await fetchChildren();
  }, [fetchChildren]);

  const deleteChild = useCallback(async (childId: string) => {
    const { error } = await supabase
      .from("children")
      .delete()
      .eq("id", childId);
    if (error) throw error;
    await fetchChildren();
  }, [fetchChildren]);

  return { children, loading, addChild, regenerateCode, updateChild, deleteChild, refetch: fetchChildren };
}
