import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, Clock, XCircle, Trash2, ChevronDown, BookOpen } from "lucide-react";
import { useT } from "@/lib/i18n";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";

interface Assignment {
  id: string;
  skill_id: string;
  assigned_date: string;
  due_date: string | null;
  status: string;
  note: string | null;
}

interface Props {
  childId: string;
  refreshKey?: number;
}

function formatCzDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}.${d.getMonth() + 1}.`;
}

const SUBJECT_EMOJI: Record<string, string> = {
  matematika: "🔢",
  čeština: "📝",
  prvouka: "🌍",
  přírodověda: "🌿",
  vlastivěda: "🗺️",
};

function subjectLabel(skillId: string): { emoji: string; subject: string } {
  const subject = getSkillSubject(skillId);
  if (!subject) return { emoji: "📚", subject: "Ostatní" };
  return {
    emoji: SUBJECT_EMOJI[subject] ?? "📚",
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
  };
}

export function AssignmentList({ childId, refreshKey }: Props) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const t = useT();

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("parent_assignments")
      .select("id, skill_id, assigned_date, due_date, status, note")
      .eq("child_id", childId)
      .order("assigned_date", { ascending: false })
      .limit(50);
    setAssignments((data as Assignment[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, [childId, refreshKey]);

  const handleDelete = async (id: string) => {
    await supabase.from("parent_assignments").delete().eq("id", id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  if (loading) return null;
  if (assignments.length === 0) return null;

  // Rozděl na aktivní (pending) a hotové (completed/skipped)
  const active = assignments.filter(a => a.status === "pending");
  const done = assignments.filter(a => a.status !== "pending");

  return (
    <div className="space-y-3">
      {/* AKTIVNÍ ÚKOLY — vždy viditelné */}
      {active.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-orange-500" />
            Aktuální úkoly ({active.length})
          </p>
          <div className="space-y-2">
            {active.map(a => <AssignmentCard key={a.id} a={a} onDelete={handleDelete} active />)}
          </div>
        </div>
      )}

      {/* HOTOVÉ ÚKOLY — collapsed */}
      {done.length > 0 && (
        <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between gap-2 rounded-lg border-2 border-green-200/60 bg-green-50/50 hover:bg-green-50 hover:border-green-300 px-3 py-2.5 text-sm font-medium text-green-800 transition-colors">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>Hotové úkoly</span>
                <span className="text-xs font-normal text-green-700/70">({done.length})</span>
              </span>
              <span className="flex items-center gap-1 text-xs text-green-700/70">
                <span>{showCompleted ? "Skrýt" : "Zobrazit"}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showCompleted ? "rotate-180" : ""}`} />
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-2 mt-2">
              {done.map(a => <AssignmentCard key={a.id} a={a} onDelete={handleDelete} />)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Když máme jen hotové úkoly, žádné aktivní */}
      {active.length === 0 && done.length > 0 && (
        <div className="rounded-lg border-2 border-dashed border-green-200 bg-green-50/50 px-4 py-3 text-center">
          <p className="text-sm font-medium text-green-700">✓ Všechny úkoly hotové!</p>
          <p className="text-xs text-green-600 mt-0.5">Zadej nový úkol níže.</p>
        </div>
      )}
    </div>
  );
}

// ── Single card ──────────────────────────────────────────────
function AssignmentCard({
  a, onDelete, active = false,
}: {
  a: Assignment;
  onDelete: (id: string) => void;
  active?: boolean;
}) {
  const t = useT();
  const { emoji, subject } = subjectLabel(a.skill_id);
  const name = getReadableSkillName(a.skill_id);

  // Status visual
  const isCompleted = a.status === "completed";
  const isSkipped = a.status === "skipped";
  const isPending = a.status === "pending";

  // Termín — pouze pokud je vyplněn
  const hasTerminus = !!a.due_date;
  const isOverdue = hasTerminus && isPending && new Date(a.due_date!) < new Date();

  const cardClasses = isCompleted
    ? "border-emerald-200 bg-emerald-50/40"
    : isSkipped
    ? "border-border bg-muted/30 opacity-60"
    : isOverdue
    ? "border-rose-200 bg-rose-50/40"
    : active
    ? "border-border bg-card"
    : "border-border bg-card";

  return (
    <div className={`rounded-2xl border ${cardClasses} p-3 flex items-center gap-3 shadow-soft-1`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 text-base shrink-0" aria-hidden="true">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm leading-tight">{name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {subject} · zadáno {formatCzDate(a.assigned_date)}
          {hasTerminus && ` · do ${formatCzDate(a.due_date!)}`}
        </p>
        {a.note && (
          <p className="text-xs text-foreground/80 italic mt-1 leading-snug">„{a.note}"</p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {isCompleted && (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            <CheckCircle2 className="h-3 w-3" /> Splněno
          </Badge>
        )}
        {isSkipped && (
          <Badge variant="secondary" className="text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            <XCircle className="h-3 w-3" /> Přeskočeno
          </Badge>
        )}
        {isPending && !isOverdue && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            K procvičení
          </Badge>
        )}
        {isPending && isOverdue && (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[11px] gap-1 h-6 rounded-full font-semibold px-2.5">
            Po termínu
          </Badge>
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
  );
}
