import { useState, useMemo } from "react";
import { getAllTopics } from "@/lib/contentRegistry";
import {
  runOfflineAudit,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type AuditReport,
  type AuditCategory,
  type AuditIssue,
} from "@/lib/contentAudit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  ShieldCheck, Play, Loader2, AlertTriangle, CheckCircle2,
  Filter, FileBarChart, Sparkles, Copy, Check,
} from "lucide-react";

const SUBJECT_LABELS: Record<string, string> = {
  matematika: "Matematika",
  "čeština": "Čeština",
  prvouka: "Prvouka",
  přírodověda: "Přírodověda",
  vlastivěda: "Vlastivěda",
};

const SUBJECT_COLORS: Record<string, string> = {
  matematika: "bg-blue-100 text-blue-800",
  "čeština": "bg-violet-100 text-violet-800",
  prvouka: "bg-green-100 text-green-800",
  přírodověda: "bg-emerald-100 text-emerald-800",
  vlastivěda: "bg-amber-100 text-amber-800",
};

interface AiFixResult {
  issueIdx: number;
  suggestions: string[];
  loading: boolean;
  error?: string;
}

interface Props {
  trigger?: React.ReactNode;
}

export function AdminContentAudit({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFixes, setAiFixes] = useState<Map<number, AiFixResult>>(new Map());
  const [copied, setCopied] = useState<number | null>(null);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<AuditCategory | null>(null);

  const allTopics = useMemo(() => getAllTopics(), []);
  const subjects = useMemo(
    () => [...new Set(allTopics.map((t) => t.subject))],
    [allTopics],
  );

  const handleRun = async () => {
    setLoading(true);
    setProgress(0);
    setReport(null);
    setAiFixes(new Map());

    await new Promise((r) => setTimeout(r, 50));

    const result = runOfflineAudit(allTopics, {
      subjectFilter: subjectFilter ? [subjectFilter] : undefined,
      gradeFilter: gradeFilter ?? undefined,
      onProgress: (p) => setProgress(p),
    });

    setReport(result);
    setLoading(false);
  };

  const handleReset = () => {
    setReport(null);
    setProgress(0);
    setAiFixes(new Map());
    setCategoryFilter(null);
  };

  /** Volá AI gateway pro opravu nápovědy */
  const handleAiFix = async (issue: AuditIssue, idx: number) => {
    setAiFixes(prev => new Map(prev).set(idx, { issueIdx: idx, suggestions: [], loading: true }));

    try {
      const prompt = `Jsi expert na tvorbu vzdělávacího obsahu pro základní školy.

Úloha: "${issue.taskQuestion}"
Správná odpověď: "${issue.correctAnswer ?? "?"}"
Předmět: ${SUBJECT_LABELS[issue.topicSubject] ?? issue.topicSubject}, ${issue.topicCategory}, ${issue.topicGradeRange[0]}. ročník

Problematické nápovědy (jedna z nich obsahuje doslova správnou odpověď):
${(issue.failingHints ?? []).map((h, i) => `Nápověda ${i + 1}: "${h}"`).join("\n")}

Napiš 2 náhradní nápovědy, které:
- pomohou dítěti přijít na odpověď samo
- NEOBSAHUJÍ doslova text správné odpovědi ("${issue.correctAnswer ?? ""}")
- jsou krátké (max 1 věta každá)
- jsou srozumitelné pro žáka ${issue.topicGradeRange[0]}. ročníku

Odpověz POUZE tímto JSON objektem, bez jakéhokoliv dalšího textu před ani za ním:
{"hints":["zde napiš nápovědu 1","zde napiš nápovědu 2"]}`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const text: string = json.choices?.[0]?.message?.content ?? json.content ?? "";
      // Extrahuj JSON — někdy AI obalí odpověď textem nebo markdown blokem
      const match = text.match(/\{[\s\S]*?"hints"\s*:\s*\[[\s\S]*?\]\s*\}/);
      if (!match) throw new Error("AI nevrátilo platný JSON s hints");
      let parsed: { hints?: string[] };
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        // Záloha: zkus vytáhnout strings z pole přímo regexem
        const rawHints = [...text.matchAll(/"([^"]{10,200})"/g)].map(m => m[1]).slice(0, 2);
        parsed = { hints: rawHints };
      }
      const hints: string[] = (parsed.hints ?? []).filter(h => typeof h === "string" && h.length > 5);

      setAiFixes(prev => new Map(prev).set(idx, { issueIdx: idx, suggestions: hints, loading: false }));
    } catch (e) {
      setAiFixes(prev => new Map(prev).set(idx, {
        issueIdx: idx,
        suggestions: [],
        loading: false,
        error: e instanceof Error ? e.message : "Chyba AI",
      }));
    }
  };

  /** Opraví všechny hint_leak najednou */
  const handleAiFixAll = async (issues: AuditIssue[]) => {
    setAiLoading(true);
    const hintLeakIssues = issues
      .map((iss, idx) => ({ iss, idx }))
      .filter(({ iss }) => iss.category === "hint_leak");

    for (const { iss, idx } of hintLeakIssues) {
      await handleAiFix(iss, idx);
    }
    setAiLoading(false);
  };

  const handleCopy = (hints: string[], idx: number) => {
    const code = `hints: [\n  ${hints.map(h => `"${h.replace(/"/g, '\\"')}"`).join(",\n  ")},\n],`;
    navigator.clipboard.writeText(code);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (!report) return [];
    return report.issues.filter(i => !categoryFilter || i.category === categoryFilter);
  }, [report, categoryFilter]);

  const hintLeakCount = report?.byCategory.hint_leak ?? 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Audit obsahu
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Audit obsahu
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* INTRO */}
          {!report && !loading && (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-5 space-y-2">
                <p className="text-sm text-foreground">
                  Tento audit projde všechna cvičení a zkontroluje:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 ml-2">
                  <li>Generator nezhavaruje a vrací úlohy</li>
                  <li>Každá úloha má neprázdnou otázku + odpověď</li>
                  <li>Formát úlohy odpovídá typu inputu</li>
                  <li>Nápověda neprozrazuje výsledek</li>
                  <li>Odpověď splňuje hranice tématu</li>
                  <li>Odpověď projde svým validátorem</li>
                </ul>
                <p className="text-xs text-muted-foreground italic mt-2">
                  Trvá pár sekund. Nepoužívá AI ani síť — jen procházení obsahu.
                </p>
              </CardContent>
            </Card>
          )}

          {/* FILTERS */}
          {!report && !loading && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="h-4 w-4 text-muted-foreground" />
                Filtry (volitelné)
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Předmět:</span>
                <Button size="sm" variant={subjectFilter === null ? "default" : "outline"}
                  className="h-7 text-xs rounded-full" onClick={() => setSubjectFilter(null)}>
                  Všechny
                </Button>
                {subjects.map((s) => (
                  <Button key={s} size="sm" variant={subjectFilter === s ? "default" : "outline"}
                    className="h-7 text-xs rounded-full capitalize" onClick={() => setSubjectFilter(s)}>
                    {SUBJECT_LABELS[s] ?? s}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Ročník:</span>
                <Button size="sm" variant={gradeFilter === null ? "default" : "outline"}
                  className="h-7 text-xs rounded-full" onClick={() => setGradeFilter(null)}>
                  Všechny
                </Button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <Button key={g} size="sm" variant={gradeFilter === g ? "default" : "outline"}
                    className="h-7 w-7 p-0 text-xs rounded-full" onClick={() => setGradeFilter(g)}>
                    {g}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* RUN BUTTON */}
          {!loading && !report && (
            <Button onClick={handleRun} className="w-full gap-2 h-11" size="lg">
              <Play className="h-4 w-4" />
              Spustit audit
            </Button>
          )}

          {/* PROGRESS */}
          {loading && (
            <Card>
              <CardContent className="p-5 space-y-3 text-center">
                <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Procházím cvičení… {Math.round(progress * 100)}%
                </p>
                <Progress value={progress * 100} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* REPORT */}
          {report && !loading && (
            <>
              {/* Summary */}
              <Card className={
                report.passingPct >= 90
                  ? "border-2 border-emerald-300 bg-emerald-50/50"
                  : report.passingPct >= 70
                    ? "border-2 border-amber-300 bg-amber-50/50"
                    : "border-2 border-rose-300 bg-rose-50/50"
              }>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {report.passingPct >= 90
                      ? <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                      : <AlertTriangle className={report.passingPct >= 70
                          ? "h-8 w-8 text-amber-600 shrink-0"
                          : "h-8 w-8 text-rose-600 shrink-0"} />
                    }
                    <div className="flex-1 space-y-1">
                      <p className="text-2xl font-bold text-foreground">{report.passingPct}% OK</p>
                      <p className="text-sm text-muted-foreground">
                        {report.okCount} z {report.totalTasksChecked} kontrolovaných úloh prošlo
                        ({report.totalTopicsChecked} témat)
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>Znovu</Button>
                  </div>
                </CardContent>
              </Card>

              {/* By category — klikací filtry */}
              {report.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileBarChart className="h-4 w-4" />
                    Rozpis problémů
                    <span className="text-xs font-normal text-muted-foreground">(klikni pro filtr)</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCategoryFilter(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        categoryFilter === null
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      Vše ({report.issues.length})
                    </button>
                    {(Object.entries(report.byCategory) as [AuditCategory, number][])
                      .filter(([, count]) => count > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, count]) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            categoryFilter === cat
                              ? "bg-slate-800 text-white border-slate-800"
                              : `${CATEGORY_COLORS[cat]} hover:opacity-80`
                          }`}
                        >
                          {CATEGORY_LABELS[cat]} ({count})
                        </button>
                      ))}
                  </div>

                  {/* AI Fix All button — pouze pro hint_leak */}
                  {hintLeakCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-violet-300 text-violet-700 hover:bg-violet-50"
                      onClick={() => handleAiFixAll(report.issues)}
                      disabled={aiLoading}
                    >
                      {aiLoading
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Sparkles className="h-3.5 w-3.5" />
                      }
                      AI navrhnout opravy nápověd ({hintLeakCount})
                    </Button>
                  )}
                </div>
              )}

              {/* Issue list */}
              {filteredIssues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Detail problémů ({filteredIssues.length}
                    {categoryFilter ? ` · ${CATEGORY_LABELS[categoryFilter]}` : ""})
                  </p>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredIssues.map((issue, idx) => {
                      const fix = aiFixes.get(report.issues.indexOf(issue));
                      const originalIdx = report.issues.indexOf(issue);
                      return (
                        <Card key={idx} className="border rounded-xl overflow-hidden">
                          <CardContent className="p-0">
                            {/* Header — předmět + téma + ročník */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border-b flex-wrap">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                SUBJECT_COLORS[issue.topicSubject] ?? "bg-slate-100 text-slate-700"
                              }`}>
                                {SUBJECT_LABELS[issue.topicSubject] ?? issue.topicSubject}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {issue.topicCategory}
                              </span>
                              <span className="text-[10px] text-muted-foreground">·</span>
                              <span className="text-[10px] text-muted-foreground font-medium">
                                {issue.topicGradeRange[0] === issue.topicGradeRange[1]
                                  ? `${issue.topicGradeRange[0]}. ročník`
                                  : `${issue.topicGradeRange[0]}–${issue.topicGradeRange[1]}. ročník`}
                              </span>
                              <span className="text-[10px] text-muted-foreground">·</span>
                              <code className="text-[10px] text-muted-foreground font-mono">{issue.topicId}</code>
                            </div>

                            {/* Tělo */}
                            <div className="p-3 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <Badge variant="outline"
                                    className={`text-[10px] ${CATEGORY_COLORS[issue.category]} mb-1`}>
                                    {CATEGORY_LABELS[issue.category]}
                                  </Badge>
                                  <p className="text-sm text-foreground font-medium leading-snug">
                                    {issue.taskQuestion}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                    → {issue.detail}
                                  </p>
                                  {issue.failingHints && issue.failingHints.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Aktuální nápovědy:</p>
                                      {issue.failingHints.map((h, hi) => (
                                        <p key={hi} className="text-[11px] text-slate-600 bg-slate-100 rounded px-2 py-1">
                                          <span className="font-bold text-slate-400 mr-1">{hi + 1}.</span>
                                          {h}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* AI Fix tlačítko pro jednotlivý hint_leak */}
                                {issue.category === "hint_leak" && !fix && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-violet-600 hover:bg-violet-50 shrink-0 gap-1"
                                    onClick={() => handleAiFix(issue, originalIdx)}
                                  >
                                    <Sparkles className="h-3 w-3" />
                                    AI opravit
                                  </Button>
                                )}
                              </div>

                              {/* AI výsledek */}
                              {fix?.loading && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  AI navrhuje opravu…
                                </div>
                              )}
                              {fix?.error && (
                                <p className="text-xs text-red-500">Chyba: {fix.error}</p>
                              )}
                              {fix && !fix.loading && fix.suggestions.length > 0 && (
                                <div className="bg-violet-50 border border-violet-200 rounded-lg p-2.5 space-y-2">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Sparkles className="h-3 w-3 text-violet-600" />
                                    <p className="text-[10px] font-semibold text-violet-700 uppercase tracking-wide">
                                      AI návrh opravy
                                    </p>
                                  </div>
                                  <p className="text-[10px] text-violet-500 mb-2">
                                    Nové nápovědy, které neobsahují odpověď. Zkopíruj kód a vlož do souboru s generátorem <code className="font-mono bg-violet-100 px-0.5 rounded">{issue.topicId}</code>.
                                  </p>
                                  {fix.suggestions.map((hint, hi) => (
                                    <div key={hi} className="flex items-start gap-2">
                                      <span className="text-[10px] text-violet-500 font-bold shrink-0 mt-0.5">{hi + 1}.</span>
                                      <p className="text-xs text-violet-900 flex-1">„{hint}"</p>
                                    </div>
                                  ))}
                                  <div className="mt-2">
                                    <pre className="text-[10px] text-violet-800 bg-violet-100 rounded p-2 overflow-x-auto font-mono leading-relaxed">
{`hints: [\n  ${fix.suggestions.map(h => `"${h.replace(/"/g, '\\"')}"`).join(",\n  ")},\n],`}
                                    </pre>
                                    <button
                                      onClick={() => handleCopy(fix.suggestions, originalIdx)}
                                      className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                                    >
                                      {copied === originalIdx
                                        ? <><Check className="h-3 w-3" /> Zkopírováno do schránky</>
                                        : <><Copy className="h-3 w-3" /> Zkopírovat kód pro vložení</>
                                      }
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {report.issues.length === 0 && (() => {
                // Sestavíme přehled per předmět ze zkontrolovaných topics
                const topicsChecked = allTopics.filter(t => {
                  if (subjectFilter && t.subject !== subjectFilter) return false;
                  if (gradeFilter !== null && !(gradeFilter >= t.gradeRange[0] && gradeFilter <= t.gradeRange[1])) return false;
                  return true;
                });
                const bySubject = topicsChecked.reduce<Record<string, number>>((acc, t) => {
                  acc[t.subject] = (acc[t.subject] ?? 0) + 1;
                  return acc;
                }, {});
                return (
                  <Card className="border-2 border-emerald-300 bg-emerald-50/50">
                    <CardContent className="p-5 space-y-4">
                      <div className="text-center space-y-1">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                        <p className="text-lg font-bold text-foreground">Vše v pořádku!</p>
                        <p className="text-sm text-muted-foreground">
                          Všech {report.totalTasksChecked} úloh v {report.totalTopicsChecked} tématech prošlo bez problémů.
                        </p>
                      </div>
                      <div className="border-t border-emerald-200 pt-3 space-y-1.5">
                        <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">Co bylo zkontrolováno:</p>
                        {Object.entries(bySubject).map(([subj, count]) => (
                          <div key={subj} className="flex items-center justify-between text-sm">
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${SUBJECT_COLORS[subj] ?? "bg-slate-100 text-slate-700"}`}>
                              {SUBJECT_LABELS[subj] ?? subj}
                            </span>
                            <span className="text-xs text-muted-foreground">{count} témat · {count * 5} úloh</span>
                          </div>
                        ))}
                        {gradeFilter !== null && (
                          <p className="text-[11px] text-muted-foreground pt-1">Filtr: {gradeFilter}. ročník</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
