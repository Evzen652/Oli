import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { canonicalSubjectName } from "@/lib/subjectSlugMap";

export interface DbSubject {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  /** Explicitní ročníkový rozsah dle RVP. Null = nemá rozsah, zobrazí se jen s obsahem. */
  grade_min: number | null;
  grade_max: number | null;
}

export interface DbCategory {
  id: string;
  name: string;
  slug: string;
  subject_id: string;
  subject_name: string;
  sort_order: number;
  description: string | null;
  fun_fact: string | null;
}

export interface DbTopic {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name: string;
  subject_name: string;
  sort_order: number;
  description: string | null;
}

/**
 * Hook for admin dashboard: fetches the FULL curriculum hierarchy
 * (subjects → categories → topics) directly from DB tables,
 * independent of whether skills exist underneath.
 */
export function useAdminCurriculum() {
  const [subjects, setSubjects] = useState<DbSubject[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [topics, setTopics] = useState<DbTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [subRes, catRes, topRes] = await Promise.all([
        (supabase as any)
          .from("curriculum_subjects")
          .select("id, name, slug, sort_order, grade_min, grade_max")
          .order("sort_order", { ascending: true }),
        (supabase as any)
          .from("curriculum_categories")
          .select("id, name, slug, subject_id, sort_order, description, fun_fact, curriculum_subjects!inner(name)")
          .order("sort_order", { ascending: true }),
        (supabase as any)
          .from("curriculum_topics")
          .select("id, name, slug, category_id, sort_order, description, curriculum_categories!inner(name, curriculum_subjects!inner(name))")
          .order("sort_order", { ascending: true }),
      ]);

      setSubjects(
        (subRes.data || []).map((s: any) => ({
          ...s,
          // Single source of truth → subjectSlugMap
          name: canonicalSubjectName(s.slug, s.name),
          grade_min: s.grade_min ?? null,
          grade_max: s.grade_max ?? null,
        }))
      );
      setCategories(
        (catRes.data || []).map((c: any) => ({
          ...c,
          subject_name: c.curriculum_subjects?.name || "",
        }))
      );
      setTopics(
        (topRes.data || []).map((t: any) => ({
          ...t,
          category_name: t.curriculum_categories?.name || "",
          subject_name: t.curriculum_categories?.curriculum_subjects?.name || "",
        }))
      );
    } catch (e) {
      console.error("[useAdminCurriculum] error:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { subjects, categories, topics, loading, refetch: fetch };
}
