/**
 * Local report generator — builds report data from session_logs + skill_profiles.
 * Supports 3 timeframes: week (7 dní), month (30 dní), all (od začátku).
 * No AI needed. Replaces edge function weekly-report.
 */

import { supabase } from "@/integrations/supabase/client";
import { getTopicById } from "@/lib/contentRegistry";

export type ReportRange = "week" | "month" | "all";

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
  range: ReportRange;
  rangeLabel: string;
}

const RANGE_DAYS: Record<ReportRange, number | null> = {
  week: 7,
  month: 30,
  all: null,
};

const RANGE_LABEL: Record<ReportRange, string> = {
  week: "tento týden",
  month: "tento měsíc",
  all: "celkem",
};

export async function generateWeeklyReport(
  childId?: string | null,
  range: ReportRange = "week",
): Promise<ReportData> {
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

  // Fetch session logs — timeframe podle range parametru
  const days = RANGE_DAYS[range];
  let query = supabase
    .from("session_logs")
    .select("session_id, skill_id, correct, help_used, error_type");
  if (days !== null) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("created_at", since);
  }

  if (resolvedChildId) {
    query = query.eq("child_id", resolvedChildId);
  } else {
    query = query.eq("user_id", user.id);
  }

  const { data: logs } = await query;
  const rangeLabel = RANGE_LABEL[range];
  if (!logs || logs.length === 0) {
    const periodNoun = range === "week" ? "týden" : range === "month" ? "měsíc" : "dosavadní období";
    return {
      summary: childName
        ? `${childName} ${rangeLabel} ještě neprocvičoval/a žádné úlohy. Zadejte úkol nebo motivujte k procvičování.`
        : `Za ${periodNoun} zatím žádná aktivita.`,
      recommendations: "Doporučujeme procvičovat alespoň 3× týdně po 10 minutách.",
      skills: [],
      stats: { sessions: 0, attempts: 0, accuracy: 0, withHelp: 0, wrong: 0 },
      childName,
      range,
      rangeLabel,
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

  const strengthCount = strong.length;
  const weakCount = weak.length;

  // Build summary — no numbers (those are in the stats section)
  const name = childName ?? "Žák";
  let summary: string;
  if (accuracy >= 80) {
    summary = `${name} si ${rangeLabel} vedl/a výborně! Učení jde správným směrem — jen tak dál.`;
  } else if (accuracy >= 50) {
    summary = `${name} ${rangeLabel} procvičoval/a pravidelně. Základ je dobrý, ale některá témata si zaslouží víc pozornosti.`;
  } else {
    summary = `${name} ${rangeLabel} potřebuje s učením trochu pomoct. Doporučujeme se zaměřit na slabší témata a procvičovat kratší dobu, ale častěji.`;
  }

  const strengths = strengthCount > 0
    ? `V ${strengthCount} ${strengthCount === 1 ? "tématu" : "tématech"} má úspěšnost nad 80 % — skvělá práce!`
    : undefined;
  const to_practice = weakCount > 0
    ? `V ${weakCount} ${weakCount === 1 ? "tématu" : "tématech"} je úspěšnost pod 50 %. Viz přehled níže.`
    : undefined;

  let recommendations: string;
  if (weakCount > 0) {
    recommendations = "Doporučujeme kratší, ale častější procvičování slabších témat (5–10 minut denně).";
  } else if (accuracy >= 80) {
    recommendations = "Výborný výkon! Můžete zkusit těžší témata nebo nový předmět.";
  } else {
    recommendations = "Pokračujte v pravidelném procvičování. Doporučujeme 3–4× týdně po 10 minutách.";
  }

  return {
    summary,
    strengths,
    to_practice,
    recommendations,
    skills,
    stats: { sessions, attempts, accuracy, withHelp, wrong },
    childName,
    range,
    rangeLabel,
  };
}
