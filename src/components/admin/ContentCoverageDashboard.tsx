import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECT_METADATA, ContentType, QualityTier } from "@/lib/content/taxonomy";
import type { Grade } from "@/lib/types";
import { Loader2, BookOpen, FileText } from "lucide-react";

/**
 * Coverage Dashboard — admin přehled pokrytí obsahu napříč předměty a ročníky.
 *
 * Zobrazuje:
 * - Matrix subject × grade s počtem skillů a cvičení
 * - Barevné kódování: 🟢 dost validovaných cvičení, 🟡 jen AI, 🔴 prázdné
 * - Klik na buňku → seznam skillů v této kombinaci (budoucí rozšíření)
 */

interface CoverageRow {
  subject_slug: string;
  subject_name: string;
  skill_name: string;
  code_skill_id: string;
  grade_min: number;
  grade_max: number;
  content_type: string;
  validated_exercises: number;
  ai_validated_exercises: number;
  ai_raw_exercises: number;
  validated_facts: number;
  unvalidated_facts: number;
}

interface GradeCellStats {
  skills: number;
  validatedCount: number;
  aiValidatedCount: number;
  aiRawCount: number;
  factsCount: number;
}

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function classifyCell(stats: GradeCellStats): "green" | "yellow" | "orange" | "red" | "gray" {
  if (stats.skills === 0) return "gray";
  if (stats.validatedCount >= stats.skills * 5) return "green";      // ≥5 validovaných per skill
  if (stats.aiValidatedCount >= stats.skills * 3) return "yellow";   // ≥3 AI-validated per skill
  if (stats.aiValidatedCount + stats.validatedCount > 0) return "orange";
  return "red";
}

const CELL_STYLES: Record<string, string> = {
  green: "bg-green-100 border-green-400 text-green-900",
  yellow: "bg-yellow-100 border-yellow-400 text-yellow-900",
  orange: "bg-orange-100 border-orange-400 text-orange-900",
  red: "bg-red-100 border-red-400 text-red-900",
  gray: "bg-muted border-border text-muted-foreground",
};

const CELL_ICONS: Record<string, string> = {
  green: "🟢",
  yellow: "🟡",
  orange: "🟠",
  red: "🔴",
  gray: "⚪",
};

export function ContentCoverageDashboard() {
  const [rows, setRows] = useState<CoverageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error: err } = await (supabase as any)
          .from("content_coverage")
          .select("*");
        if (err) throw err;
        setRows(data || []);
      } catch (e: any) {
        setError(e?.message || "Nepodařilo se načíst přehled pokrytí.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Pivot: subject → grade → stats
  const matrix = useMemo(() => {
    const out: Record<string, Record<number, GradeCellStats>> = {};
    for (const subjectSlug of Object.keys(SUBJECT_METADATA)) {
      out[subjectSlug] = {};
      for (const g of GRADES) {
        out[subjectSlug][g] = {
          skills: 0,
          validatedCount: 0,
          aiValidatedCount: 0,
          aiRawCount: 0,
          factsCount: 0,
        };
      }
    }
    for (const row of rows) {
      const subj = row.subject_slug;
      if (!out[subj]) continue;
      for (let g = row.grade_min; g <= row.grade_max; g++) {
        if (g < 1 || g > 9) continue;
        const cell = out[subj][g];
        cell.skills++;
        cell.validatedCount += row.validated_exercises || 0;
        cell.aiValidatedCount += row.ai_validated_exercises || 0;
        cell.aiRawCount += row.ai_raw_exercises || 0;
        cell.factsCount += row.validated_facts || 0;
      }
    }
    return out;
  }, [rows]);

  // Celkové statistiky
  const totals = useMemo(() => {
    const totalSkills = rows.length;
    const totalValidated = rows.reduce((s, r) => s + (r.validated_exercises || 0), 0);
    const totalAiValidated = rows.reduce((s, r) => s + (r.ai_validated_exercises || 0), 0);
    const totalRaw = rows.reduce((s, r) => s + (r.ai_raw_exercises || 0), 0);
    const totalFacts = rows.reduce((s, r) => s + (r.validated_facts || 0), 0);
    const byType = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.content_type] = (acc[r.content_type] || 0) + 1;
      return acc;
    }, {});
    return { totalSkills, totalValidated, totalAiValidated, totalRaw, totalFacts, byType };
  }, [rows]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Načítám pokrytí obsahu…</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-destructive">
          <p className="font-semibold">Chyba</p>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: pokud běžíš proti nové DB, zkontroluj, že je nasazena migrace
            <code className="ml-1 bg-muted px-1 py-0.5 rounded">20260417120000_content_infrastructure.sql</code>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Souhrn */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard icon="📚" label="Celkem dovedností" value={totals.totalSkills} />
        <SummaryCard icon="🟢" label="Ověřená cvičení" value={totals.totalValidated} />
        <SummaryCard icon="🟡" label="AI-validovaná cvičení" value={totals.totalAiValidated} />
        <SummaryCard icon="📎" label="Validovaná fakta" value={totals.totalFacts} />
      </div>

      {/* Legenda */}
      <Card>
        <CardContent className="p-4 text-xs space-y-1">
          <p className="font-medium text-foreground mb-1">Legenda barev v tabulce:</p>
          <div className="flex flex-wrap gap-3">
            <span>🟢 ≥5 ověřených cvičení / skill</span>
            <span>🟡 ≥3 AI-validovaných / skill</span>
            <span>🟠 něco je, ale málo</span>
            <span>🔴 žádná cvičení (jen struktura)</span>
            <span>⚪ skill neexistuje</span>
          </div>
        </CardContent>
      </Card>

      {/* Matrix subject × grade */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Pokrytí podle předmětů a ročníků
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-3 font-medium text-muted-foreground">Předmět</th>
                {GRADES.map((g) => (
                  <th key={g} className="text-center pb-2 px-1 font-medium text-muted-foreground min-w-[50px]">
                    {g}.
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(SUBJECT_METADATA).map((subj) => {
                const cells = matrix[subj.slug] || {};
                return (
                  <tr key={subj.slug} className="border-t border-border/30">
                    <td className="py-1.5 pr-3">
                      <span className="mr-1">{subj.emoji}</span>
                      <span className="font-medium text-foreground">{subj.label}</span>
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        {subj.gradeRange[0]}–{subj.gradeRange[1]}
                      </Badge>
                    </td>
                    {GRADES.map((g) => {
                      const stats = cells[g] || { skills: 0, validatedCount: 0, aiValidatedCount: 0, aiRawCount: 0, factsCount: 0 };
                      const inRange = g >= subj.gradeRange[0] && g <= subj.gradeRange[1];
                      if (!inRange) {
                        return <td key={g} className="text-center text-muted-foreground/30">—</td>;
                      }
                      const cls = classifyCell(stats);
                      return (
                        <td key={g} className="text-center p-0.5">
                          <div
                            className={`rounded border px-1 py-1 ${CELL_STYLES[cls]}`}
                            title={`${stats.skills} skill(ů), ${stats.validatedCount} ověřených, ${stats.aiValidatedCount} AI-val, ${stats.factsCount} faktů`}
                          >
                            <div className="text-base leading-none">{CELL_ICONS[cls]}</div>
                            <div className="text-[10px] leading-none mt-0.5">{stats.skills}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Content-type rozpočet */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dovednosti podle typu obsahu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(totals.byType).map(([type, count]) => {
            const pct = totals.totalSkills > 0 ? (count / totals.totalSkills) * 100 : 0;
            const labels: Record<string, string> = {
              [ContentType.ALGORITHMIC]: "🧮 Algoritmické",
              [ContentType.FACTUAL]: "📎 Faktické",
              [ContentType.CONCEPTUAL]: "💡 Konceptuální",
              [ContentType.MIXED]: "🔀 Smíšené",
            };
            return (
              <div key={type} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{labels[type] || type}</span>
                  <span className="text-muted-foreground">
                    {count} ({pct.toFixed(0)} %)
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-xl font-bold text-foreground leading-none">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
