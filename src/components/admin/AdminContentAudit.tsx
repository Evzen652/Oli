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
  Filter, FileBarChart,
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

interface Props {
  trigger?: React.ReactNode;
}

export function AdminContentAudit({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
    setCategoryFilter(null);
  };

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (!report) return [];
    return report.issues.filter(i => !categoryFilter || i.category === categoryFilter);
  }, [report, categoryFilter]);

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
                    {filteredIssues.map((issue, idx) => (
                      <Card key={idx} className="border rounded-xl overflow-hidden">
                        <CardContent className="p-0">
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
                          <div className="p-3 space-y-1">
                            <Badge variant="outline"
                              className={`text-[10px] ${CATEGORY_COLORS[issue.category]} mb-1`}>
                              {CATEGORY_LABELS[issue.category]}
                            </Badge>
                            <p className="text-sm text-foreground font-medium leading-snug">
                              {issue.taskQuestion}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
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
                        </CardContent>
                      </Card>
                    ))}
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
