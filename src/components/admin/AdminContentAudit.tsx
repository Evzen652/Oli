import { useState, useMemo } from "react";
import { getAllTopics } from "@/lib/contentRegistry";
import {
  runOfflineAudit,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type AuditReport,
  type AuditCategory,
} from "@/lib/contentAudit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShieldCheck, Play, Loader2, AlertTriangle, CheckCircle2, Filter, FileBarChart } from "lucide-react";

/**
 * AdminContentAudit — admin dashboard pro hromadný audit cvičení.
 *
 * Spustí offline kontrolu nad celým curriculum (nebo filtrem subject/grade).
 * Zobrazí: passing %, počty per kategorie, top problémy, drilldown per topic.
 *
 * Volá runOfflineAudit() z lib (stejná logika jako npm run audit:content).
 *
 * Použití:
 *   <AdminContentAudit trigger={<Button>Audit obsahu</Button>} />
 */

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

  const allTopics = useMemo(() => getAllTopics(), []);
  const subjects = useMemo(
    () => [...new Set(allTopics.map((t) => t.subject))],
    [allTopics],
  );

  const handleRun = async () => {
    setLoading(true);
    setProgress(0);
    setReport(null);

    // Defer kvůli UI flush — runOfflineAudit je sync ale chceme vidět progress
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
  };

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
                  <li>Generator nezhavarujе a vrací úlohy</li>
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

              {/* Subject pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Předmět:</span>
                <Button
                  size="sm"
                  variant={subjectFilter === null ? "default" : "outline"}
                  className="h-7 text-xs rounded-full"
                  onClick={() => setSubjectFilter(null)}
                >
                  Všechny
                </Button>
                {subjects.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={subjectFilter === s ? "default" : "outline"}
                    className="h-7 text-xs rounded-full capitalize"
                    onClick={() => setSubjectFilter(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>

              {/* Grade pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Ročník:</span>
                <Button
                  size="sm"
                  variant={gradeFilter === null ? "default" : "outline"}
                  className="h-7 text-xs rounded-full"
                  onClick={() => setGradeFilter(null)}
                >
                  Všechny
                </Button>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant={gradeFilter === g ? "default" : "outline"}
                    className="h-7 w-7 p-0 text-xs rounded-full"
                    onClick={() => setGradeFilter(g)}
                  >
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
              <Card
                className={
                  report.passingPct >= 90
                    ? "border-2 border-emerald-300 bg-emerald-50/50"
                    : report.passingPct >= 70
                      ? "border-2 border-amber-300 bg-amber-50/50"
                      : "border-2 border-rose-300 bg-rose-50/50"
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {report.passingPct >= 90 ? (
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle
                        className={
                          report.passingPct >= 70
                            ? "h-8 w-8 text-amber-600 shrink-0"
                            : "h-8 w-8 text-rose-600 shrink-0"
                        }
                      />
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="text-2xl font-bold text-foreground">
                        {report.passingPct}% OK
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {report.okCount} z {report.totalTasksChecked} kontrolovaných úloh prošlo
                        ({report.totalTopicsChecked} témat)
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Znovu
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* By category */}
              {report.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileBarChart className="h-4 w-4" />
                    Rozpis problémů
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(report.byCategory) as [AuditCategory, number][])
                      .filter(([, count]) => count > 0)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, count]) => (
                        <Card
                          key={cat}
                          className={`border ${CATEGORY_COLORS[cat]} rounded-xl`}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <span className="text-xs font-medium">
                              {CATEGORY_LABELS[cat]}
                            </span>
                            <Badge variant="outline" className="bg-white/60 font-bold">
                              {count}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* Issue list */}
              {report.issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Detail problémů ({report.issues.length})
                  </p>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {report.issues.map((issue, idx) => (
                      <Card key={idx} className="border rounded-lg">
                        <CardContent className="p-3 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${CATEGORY_COLORS[issue.category]}`}
                                >
                                  {CATEGORY_LABELS[issue.category]}
                                </Badge>
                                <code className="text-xs text-muted-foreground font-mono truncate">
                                  {issue.topicId}
                                </code>
                              </div>
                              <p className="text-sm text-foreground mt-1 line-clamp-2">
                                {issue.taskQuestion}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                → {issue.detail}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state — všechno OK */}
              {report.issues.length === 0 && (
                <Card className="border-2 border-emerald-300 bg-emerald-50/50">
                  <CardContent className="p-5 text-center space-y-2">
                    <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                    <p className="text-lg font-bold text-foreground">
                      Vše v pořádku!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Všech {report.totalTasksChecked} úloh prošlo kontrolou bez problémů.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
