import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAllTopics } from "@/lib/contentRegistry";
import type { TopicMetadata, Grade, InputType, PracticeTask } from "@/lib/types";

/** A DB skill record joined with its hierarchy */
export interface DbSkillRow {
  id: string;
  code_skill_id: string;
  name: string;
  brief_description: string | null;
  input_type: string;
  grade_min: number;
  grade_max: number;
  goals: string[];
  boundaries: string[];
  keywords: string[];
  help_hint: string | null;
  help_example: string | null;
  help_common_mistake: string | null;
  help_steps: string[];
  help_visual_examples: any[];
  default_level: number;
  session_task_count: number;
  sort_order: number;
  is_active: boolean;
  // Joined
  topic_name: string;
  topic_slug: string;
  category_name: string;
  category_slug: string;
  subject_name: string;
  subject_slug: string;
}

/** Map DB subject slug to content registry subject name */
const SLUG_TO_SUBJECT: Record<string, string> = {
  matematika: "matematika",
  cestina: "čeština",
  prvouka: "prvouka",
  prirodoveda: "přírodověda",
  vlastiveda: "vlastivěda",
};

/** Normalize DB category names to match code registry (ASCII → diacritics) */
const CATEGORY_NAME_MAP: Record<string, string> = {
  "Cisla a operace": "Čísla a operace",
  "Zakladni pocty": "Čísla a operace",
  "Porovnavani": "Čísla a operace",
  "Vyjmenovana slova": "Vyjmenovaná slova",
  "Diktat": "Diktát",
  "Priroda": "Příroda kolem nás",
  "Priroda kolem nas": "Příroda kolem nás",
  "Clovek a jeho telo": "Člověk a jeho tělo",
  "Lide a spolecnost": "Lidé a společnost",
  "Orientace v prostoru a case": "Orientace v prostoru a čase",
};

function normalizeCategoryName(name: string): string {
  return CATEGORY_NAME_MAP[name] ?? name;
}

/**
 * Convert a DB-only skill to a TopicMetadata-compatible object
 * (with a no-op generator that returns []).
 */
export function dbSkillToTopicMetadata(row: DbSkillRow): TopicMetadata {
  return {
    id: row.code_skill_id,
    title: row.name,
    subject: SLUG_TO_SUBJECT[row.subject_slug] ?? row.subject_slug,
    category: normalizeCategoryName(row.category_name),
    topic: row.topic_name,
    briefDescription: row.brief_description || "",
    keywords: Array.isArray(row.keywords) ? row.keywords : [],
    goals: Array.isArray(row.goals) ? row.goals : [],
    boundaries: Array.isArray(row.boundaries) ? row.boundaries : [],
    gradeRange: [row.grade_min as Grade, row.grade_max as Grade],
    inputType: row.input_type as InputType,
    defaultLevel: row.default_level,
    sessionTaskCount: row.session_task_count,
    generator: () => [], // DB-only: no code generator
    helpTemplate: {
      hint: row.help_hint || "",
      steps: Array.isArray(row.help_steps) ? row.help_steps : [],
      commonMistake: row.help_common_mistake || "",
      example: row.help_example || "",
      visualExamples: Array.isArray(row.help_visual_examples) ? row.help_visual_examples : [],
    },
    // Mark it so we can identify it later
    _dbOnly: true,
  } as TopicMetadata & { _dbOnly?: boolean };
}

/**
 * Check if a TopicMetadata has a real code generator (not a DB-only stub).
 */
export function hasCodeGenerator(topic: TopicMetadata): boolean {
  if ((topic as any)._dbOnly) return false;
  try {
    const tasks = topic.generator(topic.defaultLevel ?? 1);
    return tasks.length > 0;
  } catch {
    return false;
  }
}

/**
 * Hook: fetches all DB skills with their hierarchy and identifies
 * which ones are "DB-only" (no matching code generator).
 */
export function useDbCurriculum(grade?: Grade | null) {
  const [dbSkills, setDbSkills] = useState<DbSkillRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch skills with joined hierarchy
      let query = (supabase as any)
        .from("curriculum_skills")
        .select(`
          *,
          curriculum_topics!inner(name, slug,
            curriculum_categories!inner(name, slug,
              curriculum_subjects!inner(name, slug)
            )
          )
        `)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (grade) {
        query = query.lte("grade_min", grade).gte("grade_max", grade);
      }

      const { data, error } = await query;
      if (error) {
        console.error("[useDbCurriculum] fetch error:", error);
        setDbSkills([]);
        setLoading(false);
        return;
      }

      const rows: DbSkillRow[] = (data || []).map((row: any) => ({
        ...row,
        topic_name: row.curriculum_topics?.name || "",
        topic_slug: row.curriculum_topics?.slug || "",
        category_name: row.curriculum_topics?.curriculum_categories?.name || "",
        category_slug: row.curriculum_topics?.curriculum_categories?.slug || "",
        // Use slug (lowercase, no diacritics) as subject name to match content registry
        subject_name: row.curriculum_topics?.curriculum_categories?.curriculum_subjects?.slug || "",
        subject_slug: row.curriculum_topics?.curriculum_categories?.curriculum_subjects?.slug || "",
      }));

      setDbSkills(rows);
    } catch (e) {
      console.error("[useDbCurriculum] error:", e);
      setDbSkills([]);
    }
    setLoading(false);
  }, [grade]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Identify DB-only skills (no code generator counterpart)
  const codeTopics = useMemo(() => getAllTopics() as TopicMetadata[], []);
  const codeSkillIds = useMemo(() => new Set(codeTopics.map((t) => t.id)), [codeTopics]);

  const dbOnlySkills = useMemo(
    () => dbSkills.filter((s) => !codeSkillIds.has(s.code_skill_id)),
    [dbSkills, codeSkillIds]
  );

  /** DB-only skills converted to TopicMetadata for use in TopicBrowser */
  const dbOnlyTopics = useMemo(
    () => dbOnlySkills.map(dbSkillToTopicMetadata),
    [dbOnlySkills]
  );

  /** Merged: code topics + DB-only topics */
  const mergedTopics = useMemo(() => {
    const merged = [...codeTopics, ...dbOnlyTopics];
    return merged;
  }, [codeTopics, dbOnlyTopics]);

  /** Merged topics filtered by grade */
  const mergedTopicsForGrade = useMemo(() => {
    if (!grade) return mergedTopics;
    return mergedTopics.filter(
      (t) => grade >= t.gradeRange[0] && grade <= t.gradeRange[1]
    );
  }, [mergedTopics, grade]);

  return {
    dbSkills,
    dbOnlySkills,
    dbOnlyTopics,
    mergedTopics,
    mergedTopicsForGrade,
    loading,
    refetch: fetchSkills,
  };
}
