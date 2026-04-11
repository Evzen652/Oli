/**
 * Local weekly report generator — builds report data from session_logs + skill_profiles.
 * No AI needed. Replaces edge function weekly-report.
 */

import { supabase } from "@/integrations/supabase/client";
import { getTopicById } from "@/lib/contentRegistry";

interface SkillSummary {
  skill: string;
  mastery: number;
  attempts: number;
  correct: number;
  error_streak: number;
  weak_patterns: string[];
}

interface ReportData {
  summary: string;
  strengths?: string;
  to_practice?: string;
  recommendations: string;
  skills: SkillSummary[];
  stats: { sessions: number; attempts: number; accuracy: number; withHelp: number; wrong: number };
  childName?: string | null;
}

export async function generateWeeklyReport(childId?: string | null): Promise<ReportData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Resolve child
  let resolvedChildId = childId;
  let childName: string | null = null;

  if (childId) {
    const { data: child } = await supabase
      .from("children")
      .select("name")
      .eq("id", childId)
      .maybeSingle();
    childName = child?.name ?? null;
  } else {
    // Find first child for this parent
    const { data: child } = await supabase
      .from("children")
      .select("id, name")
      .eq("parent_user_id", user.id)
      .limit(1)
      .maybeSingle();
    if (child) {
      resolvedChildId = child.id;
      childName = child.name;
    }
  }

  // Fetch session logs for last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let query = supabase
    .from("session_logs")
    .select("session_id, skill_id, correct, help_used, error_type")
    .gte("created_at", weekAgo);

  if (resolvedChildId) {
    query = query.eq("child_id", resolvedChildId);
  } else {
    query = query.eq("user_id", user.id);
  }

  const { data: logs } = await query;
  if (!logs || logs.length === 0) {
    return {
      summary: childName
        ? `${childName} tento tyden jeste neprocvicoval/a zadne ulohy. Zkuste ho/ji motivovat k procvicovani.`
        : "Tento tyden zatim zadna aktivita.",
      recommendations: "Doporucujeme procvicovat alespon 3x tydne po 10 minutach.",
      skills: [],
      stats: { sessions: 0, attempts: 0, accuracy: 0, withHelp: 0, wrong: 0 },
      childName,
    };
  }

  // Compute stats
  const sessions = new Set(logs.map(l => l.session_id)).size;
  const attempts = logs.length;
  const correctAlone = logs.filter(l => l.correct && !l.help_used).length;
  const withHelp = logs.filter(l => l.correct && l.help_used).length;
  const wrong = logs.filter(l => !l.correct).length;
  const accuracy = Math.round((correctAlone / attempts) * 100);

  // Per-skill breakdown
  const skillMap = new Map<string, { correct: number; attempts: number; helpUsed: number; errors: string[] }>();
  for (const log of logs) {
    const existing = skillMap.get(log.skill_id) ?? { correct: 0, attempts: 0, helpUsed: 0, errors: [] };
    existing.attempts++;
    if (log.correct) existing.correct++;
    if (log.help_used) existing.helpUsed++;
    if (log.error_type) existing.errors.push(log.error_type);
    skillMap.set(log.skill_id, existing);
  }

  const skills: SkillSummary[] = Array.from(skillMap.entries()).map(([skillId, data]) => ({
    skill: skillId,
    mastery: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) / 100 : 0,
    attempts: data.attempts,
    correct: data.correct,
    error_streak: 0,
    weak_patterns: [...new Set(data.errors)],
  }));

  // Identify strengths and weaknesses
  const strong = skills.filter(s => s.attempts >= 2 && s.correct / s.attempts >= 0.8);
  const weak = skills.filter(s => s.attempts >= 2 && s.correct / s.attempts < 0.5);

  const strengthNames = strong.map(s => getTopicById(s.skill)?.title ?? s.skill).join(", ");
  const weakNames = weak.map(s => getTopicById(s.skill)?.title ?? s.skill).join(", ");

  // Build summary
  const name = childName ?? "Zak";
  let summary: string;
  if (accuracy >= 80) {
    summary = `${name} mel/a tento tyden skvely tyden! Zvladl/a ${attempts} uloh v ${sessions} sezenich s uspesnosti ${accuracy} %. Jen tak dal!`;
  } else if (accuracy >= 50) {
    summary = `${name} tento tyden procvicoval/a ${attempts} uloh v ${sessions} sezenich. Uspesnost ${accuracy} % — solidni zaklad, ale jeste je kam rust.`;
  } else {
    summary = `${name} tento tyden procvicoval/a ${attempts} uloh. Uspesnost ${accuracy} % ukazuje, ze nektere temata potrebuji vice pozornosti.`;
  }

  const strengths = strengthNames ? `Dobre zvlada: ${strengthNames}.` : undefined;
  const to_practice = weakNames ? `Doporucujeme vice procvicovat: ${weakNames}.` : undefined;

  let recommendations: string;
  if (weak.length > 0) {
    recommendations = `Zamerit se na ${weakNames}. Doporucujeme kratsi, ale castejsi procvicovani (5-10 minut denne).`;
  } else if (accuracy >= 80) {
    recommendations = "Vynikajici vykon! Muzete zkusit tezsi temata nebo novy predmet.";
  } else {
    recommendations = "Pokracujte v pravidelnem procvicovani. Doporucujeme 3-4x tydne po 10 minutach.";
  }

  return {
    summary,
    strengths,
    to_practice,
    recommendations,
    skills,
    stats: { sessions, attempts, accuracy, withHelp, wrong },
    childName,
  };
}
