import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, HelpCircle, XCircle, Trash2, BarChart2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { SkillDetailModal } from "@/components/SkillDetailModal";

interface Assignment {
  id: string;
  skill_id: string;
  assigned_date: string;
  due_date: string | null;
  status: string;
  note: string | null;
  subject?: string;
  completedDate?: string;
  completionCorrect?: number;
  completionHelpUsed?: number;
  completionTotal?: number;
}

interface Props {
  childId?: string;
  refreshKey?: number;
  mockAssignments?: Assignment[];
  onMockDelete?: (id: string) => void;
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

export function AssignmentList({ childId = "", refreshKey, mockAssignments, onMockDelete, highlightSkillId }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments ?? []);
  const [loading, setLoading] = useState(!mockAssignments);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [detailSkillId, setDetailSkillId] = useState<string | null>(null);

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("parent_assignments")
      .select("id, skill_id, assigned_date, due_date, status, note")
      .eq("child_id", childId)
      .order("assigned_date", { ascending: false })
      .limit(100);

    const rawList: Assignment[] = ((data ?? []) as Assignment[]).map(a => ({
      ...a,
      subject: getSkillSubject(a.skill_id) ?? undefined,
    }));

    // Pro splněné úkoly dohledej datum a skóre z session_logs
    const completedSkillIds = rawList.filter(a => a.status === "completed").map(a => a.skill_id);
    const completionMap = new Map<string, { date: string; correct: number; helpUsed: number; total: number }>();

    if (completedSkillIds.length > 0 && childId) {
      const { data: logs } = await supabase
        .from("session_logs")
        .select("skill_id, session_id, correct, help_used, created_at")
        .eq("child_id", childId)
        .in("skill_id", completedSkillIds)
        .order("created_at", { ascending: false })
        .limit(1000);

      if (logs) {
        const lastSessionId = new Map<string, string>();
        for (const log of logs) {
          const sid = log.skill_id as string;
          if (!lastSessionId.has(sid)) lastSessionId.set(sid, log.session_id as string);
        }
        const cCorrect = new Map<string, number>();
        const cHelp = new Map<string, number>();
        const cTotal = new Map<string, number>();
        const cDate = new Map<string, string>();
        for (const log of logs) {
          const sid = log.skill_id as string;
          if (log.session_id !== lastSessionId.get(sid)) continue;
          cTotal.set(sid, (cTotal.get(sid) ?? 0) + 1);
          if (log.correct && !log.help_used) cCorrect.set(sid, (cCorrect.get(sid) ?? 0) + 1);
          if (log.correct && log.help_used) cHelp.set(sid, (cHelp.get(sid) ?? 0) + 1);
          if (!cDate.has(sid)) cDate.set(sid, log.created_at as string);
        }
        for (const [sid, date] of cDate) {
          completionMap.set(sid, { date, correct: cCorrect.get(sid) ?? 0, helpUsed: cHelp.get(sid) ?? 0, total: cTotal.get(sid) ?? 0 });
        }
      }
    }

    setAssignments(rawList.map(a => {
      const cm = completionMap.get(a.skill_id);
      return cm ? { ...a, completedDate: cm.date, completionCorrect: cm.correct, completionHelpUsed: cm.helpUsed, completionTotal: cm.total } : a;
    }));
    setLoading(false);
  };

  useEffect(() => {
    if (mockAssignments) {
      setAssignments(mockAssignments.map(a => ({ ...a, subject: a.subject ?? getSkillSubject(a.skill_id) ?? undefined })));
      return;
    }
    fetchAssignments();
  }, [childId, refreshKey, mockAssignments]);

  const handleDelete = async (id: string) => {
    if (onMockDelete) { onMockDelete(id); return; }
    await supabase.from("parent_assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return null;
  if (assignments.length === 0) return null;

  // Unikátní předměty přítomné v seznamu
  const subjects = [...new Set(assignments.map(a => a.subject).filter(Boolean) as string[])];

  // Aplikuj filtry
  const filtered = assignments.filter(a => {
    const isPending = a.status === "pending";
    const isCompleted = a.status === "completed" || a.status === "skipped";

    if (statusFilter === "today" && !isToday(a.assigned_date)) return false;
    if (statusFilter === "pending" && !isPending) return false;
    if (statusFilter === "completed" && !isCompleted) return false;
    if (subjectFilter && a.subject !== subjectFilter) return false;
    return true;
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
    <div className="flex flex-col h-full">
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
              const label = SUBJECT_LABELS[s] ?? (s.charAt(0).toUpperCase() + s.slice(1));
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
                      fallback={<span className="text-[11px]">{meta?.emoji ?? "📚"}</span>}
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
      <div className="flex-1 overflow-y-auto">
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
                onDetail={childId ? () => setDetailSkillId(a.skill_id) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {detailSkillId && childId && (
        <SkillDetailModal
          childId={childId}
          skillId={detailSkillId}
          onClose={() => setDetailSkillId(null)}
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
  const acc = total > 0 ? Math.round((correct / total) * 100) : null;
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
        {subjectLabel && <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide leading-tight mb-0.5">{subjectLabel}</p>}
        <p className="font-semibold text-foreground text-sm leading-tight">{name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
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
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            <CheckCircle2 className="h-3 w-3" /> Splněno
          </Badge>
        )}
        {isCompleted && total > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs text-green-600 font-semibold">
              <CheckCircle2 className="h-3 w-3" />{correct}
            </span>
            {helpUsed > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-amber-500 font-semibold">
                <HelpCircle className="h-3 w-3" />{helpUsed}
              </span>
            )}
            {wrong > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-red-500 font-semibold">
                <XCircle className="h-3 w-3" />{wrong}
              </span>
            )}
            {gMeta && (
              <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold border ${gMeta.bg} ${gMeta.color} ${gMeta.border}`}>
                {grade}
              </span>
            )}
          </div>
        )}
        {isSkipped && (
          <Badge variant="secondary" className="text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            <XCircle className="h-3 w-3" /> Přeskočeno
          </Badge>
        )}
        {isPending && !isOverdue && !isNew && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] h-6 rounded-full font-semibold px-2.5">
            K procvičení
          </Badge>
        )}
        {isPending && isNew && (
          <Badge className="bg-violet-100 text-violet-700 border-violet-300 text-[11px] h-6 rounded-full font-semibold px-2.5">
            ✨ Právě zadáno
          </Badge>
        )}
        {isPending && isOverdue && (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] h-6 rounded-full font-semibold px-2.5">
            Po termínu
          </Badge>
        )}
        {isCompleted && onDetail && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 rounded-full text-xs text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400 flex items-center gap-1 font-semibold"
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
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
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
