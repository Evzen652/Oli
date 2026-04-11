import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generic CRUD hook for curriculum tables (uses `any` to bypass generated types for new tables)
export function useCurriculumTable<T extends { id: string }>(
  table: string,
  filterColumn?: string,
  filterValue?: string,
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = (supabase as any).from(table).select("*").order("sort_order", { ascending: true });
    if (filterColumn && filterValue) {
      query = query.eq(filterColumn, filterValue);
    }
    const { data, error } = await query;
    if (!error && data) setItems(data as T[]);
    setLoading(false);
  }, [table, filterColumn, filterValue]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = useCallback(async (item: Partial<T>) => {
    const { error } = await (supabase as any).from(table).insert(item);
    if (error) throw error;
    await fetch();
  }, [table, fetch]);

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    const { error } = await (supabase as any).from(table).update(updates).eq("id", id);
    if (error) throw error;
    await fetch();
  }, [table, fetch]);

  const remove = useCallback(async (id: string) => {
    const { error } = await (supabase as any).from(table).delete().eq("id", id);
    if (error) throw error;
    await fetch();
  }, [table, fetch]);

  return { items, loading, add, update, remove, refetch: fetch };
}
