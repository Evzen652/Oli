import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getReadableSkillName, getSkillSubject, getSkillIcon } from "@/lib/skillReadableName";
import { useT } from "@/lib/i18n";
import { CalendarDays, CalendarRange, History } from "lucide-react";
import type { ReportRange, ReportDetail } from "@/lib/weeklyReportGenerator";

const TONE_STYLES: Record<ReportDetail["tone"], { bg: string; border: string; label: string }> = {
  positive: {
    bg: "bg-green-50/60 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    label: "text-green-700 dark:text-green-400",
  },
  warn: {
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    label: "text-amber-700 dark:text-amber-400",
  },
  info: {
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    label: "text-blue-700 dark:text-blue-400",
  },
  neutral: {
    bg: "bg-muted/40",
    border: "border-border",
    label: "text-foreground",
  },
};

const SUBJECT_META: Record<string, { emoji: string; label: string; color: string }> = {
  matematika: { emoji: "🔢", label: "Matematika", color: "text-blue-700" },
  "čeština": { emoji: "📝", label: "Čeština", color: "text-purple-700" },
  prvouka: { emoji: "🌍", label: "Prvouka", color: "text-green-700" },
  "přírodověda": { emoji: "🌿", label: "Přírodověda", color: "text-emerald-700" },
  "vlastivěda": { emoji: "🗺️", label: "Vlastivěda", color: "text-amber-700" },
  ostatní: { emoji: "📚", label: "Ostatní", color: "text-slate-700" },
};

function detectSubjectForSkill(skillId: string): string {
  const fromRegistry = getSkillSubject(skillId);
  if (fromRegistry) return fromRegistry;
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "matematika";
  if (skillId.startsWith("cz-") || skillId.includes("diktat") || skillId.includes("pravopis") ||
      skillId.includes("vyjmen") || skillId.includes("mluvnice") || skillId.includes("parove")) return "čeština";
  if (skillId.startsWith("prv-") || skillId.startsWith("pr-") || skillId.includes("prvouka")) return "prvouka";
  return "ostatní";
}

interface SkillSummary {
  skill: string;
  mastery: number;
  attempts: number;
  correct: number;
  error_streak: number;
  weak_patterns: unknown;
  verdict?: string;
}

interface ReportData {
  summary: string;
  details?: ReportDetail[];
  strengths?: string;
  to_practice?: string;
  recommendations: string;
  skills: SkillSummary[];
  stats: { sessions: number; attempts: number; accuracy: number; withHelp?: number; wrong?: number };
  errors?: Record<string, number>;
  weakSkillIds?: string[];
  strongSkillIds?: string[];
  childName?: string | null;
  range?: ReportRange;
  rangeLabel?: string;
}

const VALID_RANGES: ReportRange[] = ["week", "month", "all"];

function parseRange(s: string | null): ReportRange {
  return VALID_RANGES.includes(s as ReportRange) ? (s as ReportRange) : "week";
}

const RANGE_TABS: { id: ReportRange; label: string; icon: React.ReactNode }[] = [
  { id: "week", label: "Týdenní", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "month", label: "Měsíční", icon: <CalendarRange className="h-4 w-4" /> },
  { id: "all", label: "Od začátku", icon: <History className="h-4 w-4" /> },
];

const RANGE_HEADING: Record<ReportRange, string> = {
  week: "Týdenní hodnocení",
  month: "Měsíční hodnocení",
  all: "Hodnocení od začátku",
};

type SkillTier = "strong" | "medium" | "weak" | "tiny";

function skillEmoji(s: SkillSummary): {
  label: string;
  labelColor: string;
  bg: string;
  tier: SkillTier;
  /** Konkrétní rada pro toto téma — 1 věta */
  verdict: string;
  /** Text pro hlavní CTA na kartě */
  cta: string;
  /** Vizuální variant CTA */
  ctaVariant: "default" | "outline" | "ghost";
} {
  const acc = s.attempts > 0 ? s.correct / s.attempts : 0;
  const wrong = s.attempts - s.correct;

  // Příliš málo dat (1 pokus) — nelze rozumně hodnotit
  if (s.attempts < 2) {
    return {
      label: "Zatím jen jeden pokus",
      labelColor: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800",
      tier: "tiny",
      verdict: "Z jednoho pokusu zatím nepoznáme, jak na tom téma je. Pojďme přidat pár dalších cvičení.",
      cta: "Zadat krátké cvičení",
      ctaVariant: "default",
    };
  }

  if (acc >= 0.8) {
    return {
      label: "Zvládnuto",
      labelColor: "text-green-700 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      tier: "strong",
      verdict: "Toto téma sedí — můžete zkusit těžší variantu nebo ho jen občas opakovat, ať se nezapomene.",
      cta: "Posunout dál",
      ctaVariant: "ghost",
    };
  }
  if (acc >= 0.5) {
    return {
      label: "Jde to, ještě trénovat",
      labelColor: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      tier: "medium",
      verdict: `${wrong} z ${s.attempts} úloh ještě nesedlo. Jedno krátké cvičení (5 minut) téma obvykle dotáhne.`,
      cta: "Zadat procvičení",
      ctaVariant: "default",
    };
  }
  return {
    label: "Teprve začínáme",
    labelColor: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    tier: "weak",
    verdict: `Téma zatím dělá potíže (${s.correct} z ${s.attempts} správně). Doporučujeme krátké cvičení a klidně se k němu vrátit i zítra.`,
    cta: "Zadat úkol z tohoto tématu",
    ctaVariant: "default",
  };
}

function accuracyBadge(acc: number): { emoji: string; text: string; color: string } {
  if (acc >= 80) return { emoji: "🎉", text: "Skvělá!", color: "text-green-600 dark:text-green-400" };
  if (acc >= 50) return { emoji: "👍", text: "Dobrá", color: "text-amber-600 dark:text-amber-400" };
  if (acc >= 25) return { emoji: "💪", text: "Stojí za to procvičit víc", color: "text-orange-600 dark:text-orange-400" };
  return { emoji: "🌱", text: "Začátky bývají těžké — vytrvejte", color: "text-blue-600 dark:text-blue-400" };
}

export default function Report() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = useT();

  const childId = searchParams.get("child");
  const range = parseRange(searchParams.get("range"));

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        const { generateWeeklyReport } = await import("@/lib/weeklyReportGenerator");
        const data = await generateWeeklyReport(childId, range);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("report.error"));
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [navigate, childId, range, t]);

  const handleRangeChange = (newRange: ReportRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", newRange);
    setSearchParams(params, { replace: true });
  };

  const heading = RANGE_HEADING[range];
  const title = report?.childName
    ? `${heading} — ${report.childName}`
    : heading;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <p className="text-4xl animate-bounce">📊</p>
          <p className="text-muted-foreground">{t("report.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
        <p className="text-4xl">😕</p>
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>{t("report.back")}</Button>
      </div>
    );
  }

  if (!report) return null;

  const independent = report.stats.attempts - (report.stats.withHelp ?? 0) - (report.stats.wrong ?? 0);
  const accBadge = accuracyBadge(report.stats.accuracy);
  const hasActivity = report.stats.attempts > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background p-4 pb-12">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Header */}
        <header className="flex items-center justify-between pt-2">
          <h1 className="text-xl font-bold text-foreground">📋 {title}</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            {t("report.back")}
          </Button>
        </header>

        {/* Range tabs — Týdenní / Měsíční / Od začátku */}
        <div className="rounded-xl border-2 border-border/60 bg-muted/40 p-1 grid grid-cols-3 gap-1">
          {RANGE_TABS.map((tab) => {
            const isActive = range === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleRangeChange(tab.id)}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Summary - warm card */}
        <div className="rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-sm">
          <p className="text-base text-foreground leading-relaxed font-medium">{report.summary}</p>
        </div>

        {/* Detail items — strukturovaná pozorování (jeden box per item) */}
        {report.details && report.details.length > 0 && (
          <div className="space-y-2">
            {report.details.map((d, i) => {
              const tone = TONE_STYLES[d.tone];
              return (
                <div
                  key={i}
                  className={`rounded-xl border ${tone.border} ${tone.bg} p-3.5 flex items-start gap-3`}
                >
                  <span className="text-xl flex-shrink-0 leading-none mt-0.5">{d.icon}</span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-xs font-bold uppercase tracking-wide ${tone.label}`}>
                      {d.label}
                    </p>
                    <p className="text-sm text-foreground/85 leading-relaxed">
                      {d.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats — pouze pokud je aktivita */}
        {hasActivity ? (
          <div className="rounded-2xl border bg-card p-5 text-center space-y-2">
            <p className="text-lg text-foreground">
              {report.rangeLabel.charAt(0).toUpperCase() + report.rangeLabel.slice(1)}: <span className="font-bold">{report.stats.attempts} úloh</span> v{" "}
              <span className="font-bold">{report.stats.sessions} sezeních</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {independent} samostatně · {report.stats.withHelp ?? 0} s nápovědou · {report.stats.wrong ?? 0} chybně
            </p>
            <p className={`text-lg font-semibold ${accBadge.color}`}>
              {accBadge.emoji} Úspěšnost: {accBadge.text} ({report.stats.accuracy} %)
            </p>
          </div>
        ) : (
          // Empty state — žádná aktivita v daném rozsahu
          <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center space-y-3">
            <p className="text-4xl">💤</p>
            <p className="text-lg font-semibold text-blue-900">
              {range === "week" && "Tento týden žádná aktivita"}
              {range === "month" && "Tento měsíc žádná aktivita"}
              {range === "all" && "Zatím žádná aktivita"}
            </p>
            <p className="text-sm text-blue-700/80 leading-relaxed max-w-sm mx-auto">
              {report.childName ?? "Dítě"} {report.rangeLabel ?? ""} ještě neprocvičoval/a. Nejsou data,
              ze kterých by šlo udělat hodnocení.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button variant="default" size="sm" className="gap-2" onClick={() => navigate(-1)}>
                ← Zpět k zadání úkolu
              </Button>
              {range !== "all" && (
                <Button variant="outline" size="sm" onClick={() => handleRangeChange("all")}>
                  Zkusit „Od začátku"
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Strengths & To Practice - friendly */}
        {(report.strengths || report.to_practice) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {report.strengths && (
              <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 p-4 space-y-2">
                <p className="font-semibold text-green-700 dark:text-green-400">🌟 Silné stránky</p>
                <p className="text-sm text-foreground leading-relaxed">{report.strengths}</p>
              </div>
            )}
            {report.to_practice && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2">
                <p className="font-semibold text-amber-600 dark:text-amber-400">💪 K procvičení</p>
                <p className="text-sm text-foreground leading-relaxed">{report.to_practice}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills — seskupené po předmětech */}
        {report.skills.length > 0 && (() => {
          // Grupuj skills podle předmětu
          const bySubject = new Map<string, typeof report.skills>();
          for (const s of report.skills) {
            const subj = detectSubjectForSkill(s.skill);
            if (!bySubject.has(subj)) bySubject.set(subj, []);
            bySubject.get(subj)!.push(s);
          }
          // Pořadí: matematika → čeština → prvouka → přírodověda → vlastivěda → ostatní
          const subjectOrder = ["matematika", "čeština", "prvouka", "přírodověda", "vlastivěda", "ostatní"];
          const sortedSubjects = Array.from(bySubject.keys()).sort((a, b) => {
            const ia = subjectOrder.indexOf(a);
            const ib = subjectOrder.indexOf(b);
            return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
          });

          return (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">{t("report.skills")}</h2>
              {sortedSubjects.map((subj) => {
                const meta = SUBJECT_META[subj] ?? SUBJECT_META.ostatní;
                const skills = bySubject.get(subj)!;
                const totalAttempts = skills.reduce((s, k) => s + k.attempts, 0);
                const totalCorrect = skills.reduce((s, k) => s + k.correct, 0);

                return (
                  <div key={subj} className="space-y-2">
                    {/* Subject header */}
                    <div className="flex items-center gap-2 pb-1 border-b-2 border-border/40">
                      <span className="text-xl">{meta.emoji}</span>
                      <span className={`text-base font-bold ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {skills.length} {skills.length === 1 ? "téma" : skills.length < 5 ? "témata" : "témat"} · <span className="font-bold text-foreground">{totalCorrect}/{totalAttempts}</span> správně
                      </span>
                    </div>
                    {/* Skill cards in this subject */}
                    <div className="space-y-2">
                      {skills.map((skill) => {
                        const v = skillEmoji(skill);
                        const acc = skill.attempts > 0 ? Math.round((skill.correct / skill.attempts) * 100) : 0;
                        const targetUrl = childId
                          ? `/parent?child=${childId}#assign-${encodeURIComponent(skill.skill)}`
                          : `/parent#assign-${encodeURIComponent(skill.skill)}`;
                        return (
                          <div key={skill.skill} className={`rounded-2xl border p-4 ${v.bg} space-y-2`}>
                            {/* Header row: topic icon + name + accuracy */}
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-xl flex-shrink-0" aria-hidden>{getSkillIcon(skill.skill)}</span>
                                <p className="font-semibold text-foreground">
                                  {getReadableSkillName(skill.skill)}
                                </p>
                              </div>
                              {skill.attempts >= 2 && (
                                <span className="text-xs font-bold text-foreground tabular-nums whitespace-nowrap mt-0.5">
                                  {acc} % · {skill.correct}/{skill.attempts}
                                </span>
                              )}
                            </div>
                            {/* Status badge */}
                            <p className={`text-xs font-bold uppercase tracking-wide ${v.labelColor}`}>
                              {v.label}
                            </p>
                            {/* Verdict + per-skill CTA */}
                            <p className="text-sm text-foreground/85 leading-relaxed">
                              {v.verdict}
                            </p>
                            {v.tier !== "strong" && (
                              <div>
                                <Button
                                  variant={v.ctaVariant}
                                  size="sm"
                                  className="gap-1.5 h-8"
                                  onClick={() => navigate(targetUrl)}
                                >
                                  ✏️ {v.cta}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Recommendations */}
        {report.recommendations && (
          <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 p-5 space-y-2">
            <p className="font-semibold text-blue-700 dark:text-blue-400">💡 {t("report.recommendations")}</p>
            <p className="text-sm text-foreground leading-relaxed">{report.recommendations}</p>
          </div>
        )}

        {/* Bottom action — návrat */}
        {hasActivity && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              variant="outline"
              size="default"
              className="gap-2"
              onClick={() => navigate("/parent")}
            >
              ← Zpět na přehled
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
