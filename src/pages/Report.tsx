import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { logoNoText } from "@/components/OlyLogo";
import { useT } from "@/lib/i18n";
import { CalendarDays, CalendarRange, History, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { ReportRange, ReportDetail } from "@/lib/weeklyReportGenerator";

interface SkillSummary {
  skill: string;
  mastery: number;
  attempts: number;
  correct: number;
  helpUsed: number;
  error_streak: number;
  weak_patterns: string[];
  source: "assigned" | "self" | "both";
}

interface ReportData {
  summary: string;
  details?: ReportDetail[];
  strengths?: string;
  to_practice?: string;
  recommendations: string;
  skills: SkillSummary[];
  stats: { days: number; attempts: number; accuracy: number; withHelp?: number; wrong?: number };
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
  week: "Tento týden",
  month: "Tento měsíc",
  all: "Celkový přehled",
};

function detectSubject(skillId: string): string {
  const from = getSkillSubject(skillId);
  if (from) return from;
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "matematika";
  if (skillId.startsWith("cz-") || skillId.includes("vyjmen") || skillId.includes("pravopis")) return "čeština";
  if (skillId.startsWith("prv-") || skillId.startsWith("pr-")) return "prvouka";
  return "ostatní";
}

function subName(text: string, name?: string | null): string {
  if (!name) return text;
  return text.replace(/[Žž]ák/g, name);
}

const ERROR_LABELS: Record<string, string> = {
  wrong_string:      "záměna písmen",
  wrong_count:       "špatný počet",
  wrong_items:       "špatné volby",
  wrong_length:      "neúplná odpověď",
  wrong_order:       "špatné pořadí",
  wrong_number:      "chybný výsledek",
  wrong_chronology:  "špatná chronologie",
  wrong_position:    "špatná pozice",
  wrong_image:       "záměna obrázku",
  wrong_coef_count:  "špatný počet koeficientů",
  wrong_coef:        "špatný koeficient",
  wrong_label_count: "špatný počet popisků",
};

function translatePatterns(patterns: string[]): string[] {
  return patterns
    .filter(p => p !== "wrong_answer" && ERROR_LABELS[p])
    .map(p => ERROR_LABELS[p]);
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
  const [chartSubject, setChartSubject] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<"all" | "assigned" | "self">("all");

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
  }, [childId, range, t]);

  const handleRangeChange = (newRange: ReportRange) => {
    const params = new URLSearchParams(searchParams);
    params.set("range", newRange);
    setSearchParams(params, { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdf8f2]">
        <div className="text-center space-y-3">
          <p className="text-4xl animate-bounce">📊</p>
          <p className="text-muted-foreground">{t("report.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fdf8f2] p-4">
        <p className="text-4xl">😕</p>
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>{t("report.back")}</Button>
      </div>
    );
  }

  if (!report) return null;

  const childName = report.childName ?? null;
  const heading = RANGE_HEADING[range];
  const title = childName ? `${childName} · ${heading}` : heading;
  const acc = report.stats.accuracy;
  const accColor = acc >= 80 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-rose-600";
  const accBg = acc >= 80 ? "bg-emerald-50 border-emerald-200" : acc >= 50 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";
  const accLabel = acc >= 80 ? "Skvělá úspěšnost" : acc >= 50 ? "Zlepšuje se" : "Potřebuje pomoc";

  // Skupiny po předmětech
  const subjectOrder = ["matematika", "čeština", "prvouka", "přírodověda", "vlastivěda", "ostatní"];
  const bySubject = new Map<string, SkillSummary[]>();
  for (const s of report.skills) {
    const subj = detectSubject(s.skill);
    if (!bySubject.has(subj)) bySubject.set(subj, []);
    bySubject.get(subj)!.push(s);
  }
  const sortedSubjects = Array.from(bySubject.keys()).sort(
    (a, b) => (subjectOrder.indexOf(a) === -1 ? 99 : subjectOrder.indexOf(a)) - (subjectOrder.indexOf(b) === -1 ? 99 : subjectOrder.indexOf(b))
  );

  // Data pro graf
  const allChartData = report.skills.map((s) => {
    const a = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
    const full = getReadableSkillName(s.skill);
    const short = full.length > 14 ? full.slice(0, 12) + "…" : full;
    const color = a >= 80 ? "#10b981" : a >= 50 ? "#f59e0b" : "#f43f5e";
    return { name: full, short, acc: a, color, correct: s.correct, attempts: s.attempts, subject: detectSubject(s.skill), source: s.source };
  });
  const chartSubjects = Array.from(new Set(allChartData.map((d) => d.subject)));

  // Filtrace podle zdroje + předmětu
  const filteredSkills = report.skills.filter(s =>
    (sourceFilter === "all" || s.source === sourceFilter)
  );
  const filteredBySubject = new Map<string, SkillSummary[]>();
  for (const s of filteredSkills) {
    const subj = detectSubject(s.skill);
    if (!filteredBySubject.has(subj)) filteredBySubject.set(subj, []);
    filteredBySubject.get(subj)!.push(s);
  }
  const visibleSubjects = Array.from(filteredBySubject.keys()).sort(
    (a, b) => (subjectOrder.indexOf(a) === -1 ? 99 : subjectOrder.indexOf(a)) - (subjectOrder.indexOf(b) === -1 ? 99 : subjectOrder.indexOf(b))
  );
  const chartData = allChartData.filter(d =>
    (sourceFilter === "all" || d.source === sourceFilter) &&
    (!chartSubject || d.subject === chartSubject)
  );
  const manyBars = chartData.length > 7;

  const hasActivity = report.stats.attempts > 0;

  return (
    <div className="min-h-screen bg-[#fdf8f2] px-4 pb-12 pt-4">
      <div className="mx-auto max-w-2xl space-y-4">

        {/* Header */}
        <div className="bg-white rounded-3xl px-6 py-5 flex items-center gap-4 shadow-sm border border-black/[0.05]">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <img src={logoNoText} alt="Oli" className="h-10 w-10 object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-foreground leading-tight">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Přehled výsledků · {report.rangeLabel}</p>
          </div>
        </div>

        {/* Range tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] p-1.5 grid grid-cols-3 gap-1">
          {RANGE_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleRangeChange(tab.id)}
              className={`flex items-center justify-center gap-1.5 rounded-2xl py-2.5 px-2 text-sm font-medium transition-all ${
                range === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats + shrnutí */}
        {hasActivity ? (
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-border/40">
              <div className="px-5 py-5 text-center">
                <p className="text-3xl font-extrabold text-foreground tabular-nums">{report.stats.days}</p>
                <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">DNY</p>
              </div>
              <div className="px-5 py-5 text-center">
                <p className="text-3xl font-extrabold text-foreground tabular-nums">{report.stats.attempts}</p>
                <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">ÚLOH</p>
              </div>
              <div className="px-5 py-5 text-center">
                <p className={`text-3xl font-extrabold tabular-nums ${accColor}`}>{acc} %</p>
                <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-1">ÚSPĚŠNOST</p>
              </div>
            </div>
            <div className="border-t border-border/40 px-5 py-4 space-y-2.5">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${accBg} ${accColor}`}>
                {accLabel}
              </span>
              <p className="text-sm text-foreground leading-relaxed">{subName(report.summary, childName)}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] p-6 text-center space-y-3">
            <p className="text-4xl">💤</p>
            <p className="text-lg font-semibold text-foreground">
              {range === "week" && "Tento týden žádná aktivita"}
              {range === "month" && "Tento měsíc žádná aktivita"}
              {range === "all" && "Zatím žádná aktivita"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              {childName ?? "Dítě"} {report.rangeLabel ?? ""} ještě neprocvičovalo. Zkuste zadat první úkol.
            </p>
            {range !== "all" && (
              <Button variant="outline" size="sm" onClick={() => handleRangeChange("all")}>
                Zkusit „Od začátku"
              </Button>
            )}
          </div>
        )}

        {/* Graf témat */}
        {hasActivity && allChartData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40">
              <h2 className="font-bold text-base text-foreground">Přehled témat</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Úspěšnost v každém procvičovaném tématu (% správných odpovědí)</p>
            </div>
            <div className="px-5 pt-4 pb-1 flex flex-wrap gap-1.5">
              {(["all", "self", "assigned"] as const).map((v) => {
                const label = v === "all" ? "Vše" : v === "self" ? "Samostatně" : "Od rodiče";
                const active = sourceFilter === v;
                const cls = active
                  ? v === "self" ? "bg-sky-600 text-white" : v === "assigned" ? "bg-violet-600 text-white" : "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80";
                return (
                  <button key={v} onClick={() => setSourceFilter(v)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${cls}`}>
                    {label}
                  </button>
                );
              })}
            </div>
            {chartSubjects.length > 1 && (
              <div className="px-5 pt-2 pb-1 flex flex-wrap gap-1.5">
                <button
                  onClick={() => setChartSubject(null)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${!chartSubject ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >Vše</button>
                {chartSubjects.map((subj) => {
                  const meta = getSubjectMeta(subj);
                  return (
                    <button
                      key={subj}
                      onClick={() => setChartSubject(chartSubject === subj ? null : subj)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors flex items-center gap-1 ${chartSubject === subj ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      <span>{meta?.emoji}</span>
                      {meta?.label ?? subj}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="px-4 pt-4 pb-3">
              <ResponsiveContainer width="100%" height={manyBars ? 260 : 220}>
                <BarChart data={chartData} barSize={manyBars ? undefined : 44} margin={{ top: 8, right: 8, left: 0, bottom: manyBars ? 68 : 4 }}>
                  <XAxis
                    dataKey="short"
                    tick={{ fontSize: 10, fill: "#888" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={manyBars ? -45 : 0}
                    textAnchor={manyBars ? "end" : "middle"}
                  />
                  <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} unit="%" width={44} />
                  <ReferenceLine y={80} stroke="#10b981" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: "cíl 80 %", position: "insideTopRight", fontSize: 10, fill: "#10b981" }} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", radius: 6 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-border rounded-xl shadow-md px-3 py-2 text-xs space-y-0.5">
                          <p className="font-semibold text-foreground">{d.name}</p>
                          <p className="text-muted-foreground">{d.correct} z {d.attempts} správně</p>
                          <p className="font-bold" style={{ color: d.color }}>{d.acc} %</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="acc" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-5 pt-1 pb-2 text-[11px] text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block shrink-0" />Zvládnuto (≥ 80 %)</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400 inline-block shrink-0" />Zlepšuje se (50–79 %)</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-rose-500 inline-block shrink-0" />Potřebuje pomoc</span>
              </div>
            </div>
            <div className="border-t border-border/40 p-4 space-y-4">
              {(chartSubject ? visibleSubjects.filter(s => s === chartSubject) : visibleSubjects).map((subj) => {
                const meta = getSubjectMeta(subj);
                const skills = filteredBySubject.get(subj)!;
                return (
                  <div key={subj} className="space-y-2">
                    <div className="flex items-center gap-2.5 px-1">
                      <IllustrationImg src={meta.image} alt={meta.label} className="h-7 w-7 object-contain shrink-0" fallback={<span className="text-xl">{meta.emoji}</span>} />
                      <p className="font-bold text-sm text-foreground">{meta.label}</p>
                    </div>
                    {skills.map((s) => {
                      const a = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
                      const textColor = a >= 80 ? "text-emerald-700" : a >= 50 ? "text-amber-600" : "text-rose-600";
                      const barColor = a >= 80 ? "bg-emerald-500" : a >= 50 ? "bg-amber-400" : "bg-rose-500";
                      const dotColor = a >= 80 ? "bg-emerald-500" : a >= 50 ? "bg-amber-400" : "bg-rose-500";
                      const nm = childName ?? "Dítě";
                      const helpRatio = s.attempts > 0 ? Math.round((s.helpUsed / s.attempts) * 100) : 0;
                      const wrongCount = s.attempts - s.correct - s.helpUsed;
                      const translated = translatePatterns(s.weak_patterns ?? []);

                      let evalText: string;
                      if (s.attempts < 3) {
                        evalText = `Zatím jen ${s.attempts} ${s.attempts === 1 ? "pokus" : "pokusy"} — příliš málo dat pro spolehlivé hodnocení.`;
                      } else if (a >= 80) {
                        evalText = helpRatio <= 10
                          ? `${nm} toto téma zvládá samostatně a spolehlivě (${a} %).`
                          : `${nm} dosahuje dobrých výsledků (${a} %), ale využívá nápovědu v ${helpRatio} % případů.`;
                      } else if (a >= 50) {
                        evalText = wrongCount > s.correct
                          ? `Výsledky jsou smíšené — více chyb než správných odpovědí (${s.correct}/${s.attempts}).`
                          : `${nm} se zlepšuje (${a} %), ale látka ještě není pevně zažitá.`;
                      } else {
                        evalText = `Téma dělá ${nm === "Dítě" ? "dítěti" : nm} velké potíže — správně pouze ${s.correct} z ${s.attempts} pokusů.`;
                      }

                      let tip: string;
                      if (a >= 80 && helpRatio <= 10) {
                        tip = "Doporučujeme přejít na těžší úlohy nebo nové téma.";
                      } else if (a >= 80) {
                        tip = "Zkuste snížit používání nápovědy — procvičujte bez ní.";
                      } else if (a >= 50) {
                        tip = "Zadejte 1–2 krátké úkoly týdně pro upevnění. Pravidelnost pomáhá víc než jedno dlouhé procvičování.";
                      } else if (translated.length > 0) {
                        tip = `Časté chyby: ${translated.slice(0, 2).join(", ")}. Procvičujte denně po 5–10 minutách.`;
                      } else {
                        tip = "Doporučujeme začít od základů a procvičovat denně po 5–10 minutách.";
                      }
                      return (
                        <div key={s.skill} className="rounded-2xl border border-border/40 bg-slate-50/60 p-4 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
                              <p className="text-sm font-semibold text-foreground truncate">{getReadableSkillName(s.skill)}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.source === "assigned" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"}`}>
                                {s.source === "assigned" ? "Zadáno" : "Samostatně"}
                              </span>
                              <span className="text-xs text-muted-foreground">{s.correct}/{s.attempts}</span>
                              <span className={`text-sm font-bold tabular-nums ${textColor}`}>{a} %</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${a}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug">{evalText}</p>
                          <p className="text-xs font-medium text-foreground/70 leading-snug">{tip}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Co teď */}
        {hasActivity && report.recommendations && (
          <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40">
              <h2 className="font-bold text-base text-foreground">Co teď?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Doporučení na základě výsledků</p>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{subName(report.recommendations, childName)}</p>
              <button
                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-between px-4 shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-sm"
                onClick={() => navigate(childId ? `/parent#assign-${childId}` : "/parent")}
              >
                Zadat úkol {childName ? `pro ${childName}` : ""}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Zpět */}
        <div className="flex justify-center pt-2">
          <button
            className="h-11 rounded-2xl bg-white border border-border text-foreground font-semibold text-sm px-5 flex items-center gap-2 hover:bg-muted/50 active:scale-[0.98] transition-all shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Zpět na přehled
          </button>
        </div>

      </div>
    </div>
  );
}
