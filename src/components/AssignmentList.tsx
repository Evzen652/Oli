import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trash2, BarChart2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { pickCompletingSessionId, toAssignmentWindow, startOfLocalDayIso } from "@/lib/assignmentBinding";
import { IllustrationImg } from "@/components/IllustrationImg";
import { SkillDetailModal } from "@/components/SkillDetailModal";

interface Assignment {
  id: string;
  skill_id: string;
  assigned_date: string;
  due_date: string | null;
  status: string;
  note: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  subject?: string;
  completedDate?: string;
  completionCorrect?: number;
  completionHelpUsed?: number;
  completionTotal?: number;
}

interface Props {
  childId?: string;
  childName?: string;
  refreshKey?: number;
  highlightSkillId?: string | null;
}

type StatusFilter = "all" | "today" | "pending" | "completed";

function pctToGrade(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 90) return 1;
  if (pct >= 75) return 2;
  if (pct >= 55) return 3;
  if (pct >= 40) return 4;
  return 5;
}

const GRADE_META: Record<number, { color: string; bg: string; border: string }> = {
  1: { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-300" },
  2: { color: "text-green-700",   bg: "bg-green-50",    border: "border-green-300" },
  3: { color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-300" },
  4: { color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-300" },
  5: { color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-300" },
};

function formatCzDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
}

export function AssignmentList({ childId = "", childName, refreshKey, highlightSkillId }: Props) {
  // `useT` se sem importovalo, ale nikdy nevolalo — prázdný stav odkazuje na
  // popisek tlačítka, takže ho čteme ze stejného zdroje jako to tlačítko.
  const t = useT();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{ skillId: string } | null>(null);

  const fetchAssignments = useCallback(async () => {
    const { data } = await supabase
      .from("parent_assignments")
      .select("id, skill_id, assigned_date, due_date, status, note, created_at, updated_at")
      .eq("child_id", childId)
      .order("assigned_date", { ascending: false })
      .limit(100);

    const rawList: Assignment[] = ((data ?? []) as Assignment[]).map(a => ({
      ...a,
      subject: getSkillSubject(a.skill_id) ?? undefined,
    }));

    // Skóre splněného úkolu = sezení, které ho splnilo, a to natrvalo.
    // Dřív se bralo „poslední sezení na tom skill_id", takže si dítě pozdějším
    // procvičováním téhož tématu zpětně přepsalo známku u dávno hotového úkolu.
    // Klíčem je proto ID úkolu, ne skill_id — jedno téma může být zadáno vícekrát.
    const completed = rawList.filter(a => a.status === "completed");
    const completionMap = new Map<string, { date: string; correct: number; helpUsed: number; total: number }>();

    if (completed.length > 0 && childId) {
      // Dotaz omezíme dnem nejstaršího zadání: starší log nemůže spadnout do
      // okna žádného z těchhle úkolů, takže by jen ujídal z limitu a mohl
      // vytlačit sezení, které úkol opravdu splnilo (→ žádné skóre u karty).
      const earliestAssigned = completed
        .map(a => (a.assigned_date ?? "").slice(0, 10))
        .filter(Boolean)
        .sort()[0];
      const since = earliestAssigned ? startOfLocalDayIso(earliestAssigned) : null;

      let query = supabase
        .from("session_logs")
        .select("skill_id, session_id, correct, help_used, created_at")
        .eq("child_id", childId)
        .in("skill_id", [...new Set(completed.map(a => a.skill_id))]);
      if (since) query = query.gte("created_at", since);

      const { data: logs } = await query
        .order("created_at", { ascending: false })
        .limit(1000);

      if (logs) {
        const bySkill = new Map<string, typeof logs>();
        for (const log of logs) {
          const list = bySkill.get(log.skill_id as string);
          if (list) list.push(log);
          else bySkill.set(log.skill_id as string, [log]);
        }

        for (const a of completed) {
          const skillLogs = bySkill.get(a.skill_id) ?? [];
          const sessionId = pickCompletingSessionId(
            skillLogs.map(l => ({ session_id: l.session_id as string, created_at: l.created_at })),
            toAssignmentWindow(a),
          );
          // Bez dohledaného sezení raději neukazuj žádné skóre než cizí.
          if (!sessionId) continue;

          const rows = skillLogs.filter(l => l.session_id === sessionId);
          if (rows.length === 0) continue;
          completionMap.set(a.id, {
            // `logs` jsou řazené sestupně, takže rows[0] je poslední odpověď
            // sezení — tedy okamžik, kdy dítě úkol dokončilo.
            date: rows[0].created_at as string,
            correct: rows.filter(l => l.correct && !l.help_used).length,
            helpUsed: rows.filter(l => l.correct && l.help_used).length,
            total: rows.length,
          });
        }
      }
    }

    setAssignments(rawList.map(a => {
      const cm = completionMap.get(a.id);
      return cm ? { ...a, completedDate: cm.date, completionCorrect: cm.correct, completionHelpUsed: cm.helpUsed, completionTotal: cm.total } : a;
    }));
    setLoading(false);
    // Obalené `useCallback`, ať se dá poctivě uvést v závislostech efektu —
    // jinak by se funkce vytvářela na každý render a efekt by běžel pořád.
  }, [childId]);

  useEffect(() => {
    fetchAssignments();
  }, [childId, refreshKey, fetchAssignments]);

  const handleDelete = async (id: string) => {
    await supabase.from("parent_assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return null;

  // Prázdný stav, ne `return null`. Obal měl napevno `h-[460px]`, takže rodič
  // bez jediného zadaného úkolu koukal pod nadpis „Zadané úkoly" na 460 px
  // prázdné bílé plochy — bez vysvětlení a bez akce.
  if (assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-8 text-center">
        <p className="text-sm font-semibold text-foreground">Zatím jste nic nezadali</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Tlačítkem „{t("assign.create")}" nahoře vyberete téma, které má
          {childName ? ` ${childName} ` : " dítě "}
          procvičit. Zadané úkoly se pak objeví tady.
        </p>
      </div>
    );
  }

  // Unikátní předměty přítomné v seznamu
  const subjects = [...new Set(assignments.map(a => a.subject).filter(Boolean) as string[])];

  // Aplikuj filtry
  const filtered = assignments.filter(a => {
    const isPending = a.status === "pending";
    const isCompleted = a.status === "completed" || a.status === "skipped";

    if (subjectFilter && a.subject !== subjectFilter) return false;

    // "Splněné" vždy jen splněné
    if (statusFilter === "completed") return isCompleted;

    // Ostrý provoz — datové a stavové filtry
    if (statusFilter === "today") return isToday(a.assigned_date);
    if (statusFilter === "pending") return isPending;
    return true; // "all" → vše
  });

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Vše" },
    { key: "today", label: "Dnes zadané" },
    { key: "pending", label: "Nesplněné" },
    { key: "completed", label: "Splněné" },
  ];

  const SUBJECT_LABELS: Record<string, string> = {
    matematika: "Matematika",
    "čeština": "Čeština",
    prvouka: "Prvouka",
    "přírodověda": "Přírodověda",
    "vlastivěda": "Vlastivěda",
  };

  return (
    // Výšku si řídí komponenta sama, ne obal. Dřív měl obal napevno
    // `h-[460px]` a tenhle kořen `h-full` — karta tedy měla pořád 460 px bez
    // ohledu na obsah: u jednoho úkolu zbytek prázdný, u dvaceti scroll-trap
    // uvnitř stránky, která scrolluje taky. Scrolluje teď jen seznam, a to až
    // když přeteče.
    <div className="flex flex-col">
      {/* Filtry — fixní, nescrollují */}
      <div className="flex-shrink-0 space-y-2 mb-3">
        {/* Status filtry — pill group */}
        <div className="flex flex-wrap rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Předmětové filtry s ilustracemi — jen pokud je více předmětů */}
        {subjects.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSubjectFilter(null)}
              className={`h-7 px-3 rounded-xl text-xs font-medium border transition-all ${
                subjectFilter === null
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
              }`}
            >
              Vše
            </button>
            {subjects.map(s => {
              const meta = getSubjectMeta(s);
              const label = SUBJECT_LABELS[s] ?? (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
              return (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(subjectFilter === s ? null : s)}
                  className={`h-7 pl-1.5 pr-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    subjectFilter === s
                      ? "bg-slate-800 text-white border-slate-800"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <span className="h-5 w-5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <IllustrationImg
                      src={meta?.image ?? ""}
                      className="h-4 w-4 object-contain"
                      fallback={<span className="text-caption">{meta?.emoji ?? "📚"}</span>}
                    />
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Seznam — scrolluje */}
      <div className="overflow-y-auto max-h-[420px]">
        {filtered.length === 0 ? (
          <p className="text-xs text-center text-muted-foreground py-4">Žádné úkoly odpovídající filtru.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => (
              <AssignmentCard
                key={a.id}
                a={a}
                onDelete={handleDelete}
                isNew={!!highlightSkillId && a.skill_id === highlightSkillId}
                onDetail={childId ? () => {
                    setDetailData({ skillId: a.skill_id });
                } : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {detailData && childId && (
        <SkillDetailModal
          childId={childId}
          skillId={detailData.skillId}
          childName={childName}
          onClose={() => setDetailData(null)}
        />
      )}
    </div>
  );
}

// ── Single card ──────────────────────────────────────────────
function AssignmentCard({
  a, onDelete, isNew = false, onDetail,
}: {
  a: Assignment;
  onDelete: (id: string) => void;
  isNew?: boolean;
  onDetail?: () => void;
}) {
  const subject = a.subject ?? null;
  const subjectMeta = subject ? getSubjectMeta(subject) : null;
  const subjectLabel = subjectMeta?.label ?? (subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : null);
  const name = getReadableSkillName(a.skill_id);

  const isCompleted = a.status === "completed";
  const isSkipped = a.status === "skipped";
  const isPending = a.status === "pending";
  const hasTerminus = !!a.due_date;
  const isOverdue = hasTerminus && isPending && new Date(a.due_date!) < new Date();

  const cardClasses = isNew
    ? "border-violet-300 bg-violet-50/60 ring-2 ring-violet-300/50 ring-offset-1"
    : isCompleted
    ? "border-emerald-200 bg-emerald-50/40"
    : isSkipped
    ? "border-border bg-muted/30 opacity-60"
    : isOverdue
    ? "border-rose-200 bg-rose-50/40"
    : "border-border bg-card";

  const total = a.completionTotal ?? 0;
  const correct = a.completionCorrect ?? 0;
  const helpUsed = a.completionHelpUsed ?? 0;
  const wrong = total - correct - helpUsed;
  // Úspěšnost = všechny správné (i s nápovědou) / celkem. Nápověda se ukazuje
  // zvlášť, netrestá se ve známce (shodné se SkillDetailModal a ChildSessionLog).
  const acc = total > 0 ? Math.round(((correct + helpUsed) / total) * 100) : null;
  const grade = acc !== null ? pctToGrade(acc) : null;
  const gMeta = grade !== null ? GRADE_META[grade] : null;

  return (
    <div className={`rounded-3xl border ${cardClasses} px-7 py-6 flex items-center gap-6 shadow-sm transition-all duration-500`}>
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 shrink-0" aria-hidden="true">
        <IllustrationImg
          src={subjectMeta?.image ?? ""}
          className="h-11 w-11 object-contain"
          fallback={<span className="text-2xl">{subjectMeta?.emoji ?? "📚"}</span>}
        />
      </div>
      <div className="flex-1 min-w-0">
        {subjectLabel && <p className="text-caption font-bold text-muted-foreground uppercase tracking-wide leading-tight mb-0.5">{subjectLabel}</p>}
        <p className="font-semibold text-foreground text-sm leading-tight">{name}</p>
        <p className="text-caption text-muted-foreground mt-0.5">
          zadáno {formatCzDate(a.assigned_date)}
          {hasTerminus && !isCompleted && ` · do ${formatCzDate(a.due_date!)}`}
          {isCompleted && a.completedDate && (
            <> <span className="mx-0.5 opacity-40">|</span> <span className="text-emerald-700 font-medium">splněno {formatCzDate(a.completedDate)}</span></>
          )}
        </p>
        {a.note && (
          <p className="text-xs text-foreground/80 italic mt-1 leading-snug">„{a.note}"</p>
        )}
      </div>
      <div className="flex flex-col items-end gap-3 shrink-0">
        {isCompleted && (
          <Badge variant="success" className="gap-1 h-6 px-2.5">
            <CheckCircle2 className="h-3 w-3" /> Splněno
          </Badge>
        )}
        {isCompleted && total > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs text-success font-semibold">
              ✓ {correct} správně
            </span>
            {helpUsed > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-warning font-semibold">
                {helpUsed} s nápov.
              </span>
            )}
            {wrong > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-destructive font-semibold">
                ✗ {wrong} špatně
              </span>
            )}
            {gMeta && (
              <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-caption font-bold border ${gMeta.bg} ${gMeta.color} ${gMeta.border}`}>
                {grade}
              </span>
            )}
          </div>
        )}
        {isSkipped && (
          <Badge variant="secondary" className="gap-1 h-6 px-2.5">
            <XCircle className="h-3 w-3" /> Přeskočeno
          </Badge>
        )}
        {isPending && !isOverdue && !isNew && (
          <Badge variant="warning" className="h-6 px-2.5">
            K procvičení
          </Badge>
        )}
        {isPending && isNew && (
          <Badge variant="info" className="h-6 px-2.5">
            ✨ Právě zadáno
          </Badge>
        )}
        {isPending && isOverdue && (
          <Badge variant="danger" className="h-6 px-2.5">
            Po termínu
          </Badge>
        )}
        {isCompleted && onDetail && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 rounded-full text-xs text-orange-800 border-primary/30 hover:bg-accent flex items-center gap-1 font-semibold"
            onClick={onDetail}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Ukázat výsledky a hodnocení
          </Button>
        )}
        {isPending && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive-muted"
            onClick={() => onDelete(a.id)}
            title="Zrušit úkol"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
