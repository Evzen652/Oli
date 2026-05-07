import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, HelpCircle, XCircle, BarChart2 } from "lucide-react";
import { getTopicById } from "@/lib/contentRegistry";
import { getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { SkillDetailModal } from "@/components/SkillDetailModal";
import { Button } from "@/components/ui/button";

export interface SessionEntry {
  session_id: string;
  date: string;
  skill_id: string;
  total: number;
  correct: number;
  help_used: number;
}

// Předměty podle ročníku
function subjectsForGrade(grade: number): string[] {
  if (grade <= 3) return ["matematika", "čeština", "prvouka"];
  if (grade <= 5) return ["matematika", "čeština", "přírodověda", "vlastivěda"];
  return ["matematika", "čeština"];
}

interface Props {
  childId?: string;
  grade?: number;
  mockSessions?: SessionEntry[];
}

// Převod % úspěšnosti na školní známku
function pctToGrade(pct: number): 1 | 2 | 3 | 4 | 5 {
  if (pct >= 90) return 1;
  if (pct >= 75) return 2;
  if (pct >= 55) return 3;
  if (pct >= 40) return 4;
  return 5;
}

const GRADE_META: Record<number, { label: string; color: string; bg: string; border: string }> = {
  1: { label: "Výborný",      color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-300" },
  2: { label: "Chvalitebný",  color: "text-green-700",   bg: "bg-green-50",    border: "border-green-300" },
  3: { label: "Dobrý",        color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-300" },
  4: { label: "Dostatečný",   color: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-300" },
  5: { label: "Nedostatečný", color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-300" },
};

const SUBJECT_LABELS: Record<string, string> = {
  matematika: "Matematika",
  "čeština": "Čeština",
  prvouka: "Prvouka",
  "přírodověda": "Přírodověda",
  "vlastivěda": "Vlastivěda",
};

export function ChildSessionLog({ childId = "", grade, mockSessions }: Props) {
  const [sessions, setSessions] = useState<SessionEntry[]>(mockSessions ?? []);
  const [loading, setLoading] = useState(!mockSessions);
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [detailSkillId, setDetailSkillId] = useState<string | null>(null);

  useEffect(() => {
    if (mockSessions) { setSessions(mockSessions); return; }
    if (!childId) { setLoading(false); return; }

    (async () => {
      const { data: assignments } = await supabase
        .from("parent_assignments")
        .select("skill_id")
        .eq("child_id", childId);
      const assignedSkills = new Set((assignments ?? []).map(a => a.skill_id));

      const { data } = await supabase
        .from("session_logs")
        .select("session_id, skill_id, correct, help_used, created_at")
        .eq("child_id", childId)
        .order("created_at", { ascending: false })
        .limit(200);

      if (data) {
        const map = new Map<string, SessionEntry>();
        for (const row of data) {
          if (assignedSkills.has(row.skill_id)) continue;
          let s = map.get(row.session_id);
          if (!s) {
            s = { session_id: row.session_id, date: row.created_at as string, skill_id: row.skill_id as string, total: 0, correct: 0, help_used: 0 };
            map.set(row.session_id, s);
          }
          s.total++;
          if (row.correct) s.correct++;
          if (row.help_used) s.help_used++;
        }
        setSessions(Array.from(map.values()));
      }
      setLoading(false);
    })();
  }, [childId, mockSessions]);

  if (loading) return <p className="text-xs text-muted-foreground text-center py-4">Načítám…</p>;
  if (sessions.length === 0) return <p className="text-xs text-muted-foreground text-center py-4">Zatím žádné samostatné procvičování</p>;

  // Předměty: vždy všechny pro daný ročník (nebo odvozené ze sessions jako fallback)
  const subjects = grade
    ? subjectsForGrade(grade)
    : [...new Set(sessions.map(s => getSkillSubject(s.skill_id)).filter(Boolean) as string[])];

  const usedGrades: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

  // Filtrace
  const filtered = sessions.filter(s => {
    const subject = getSkillSubject(s.skill_id);
    if (subjectFilter && subject !== subjectFilter) return false;
    if (gradeFilter !== null) {
      const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
      if (pctToGrade(pct) !== gradeFilter) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Filtry — fixní, nescrollují */}
      <div className="flex-shrink-0 space-y-2 pt-1 mb-2">
        {/* Hodnocení — pill group */}
        {usedGrades.length > 1 && (
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 gap-0.5">
            <button
              onClick={() => setGradeFilter(null)}
              className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${
                gradeFilter === null
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Vše
            </button>
            {usedGrades.map(g => {
              const m = GRADE_META[g];
              return (
                <button
                  key={g}
                  onClick={() => setGradeFilter(gradeFilter === g ? null : g)}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all ${
                    gradeFilter === g
                      ? `bg-white shadow-sm ${m.color}`
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {g} – {m.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Předmět s ilustracemi */}
        {subjects.length > 0 && (
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
                      fallback={<span className="text-[11px]">{meta?.emoji ?? "📋"}</span>}
                    />
                  </span>
                  {SUBJECT_LABELS[s] ?? (s.charAt(0).toUpperCase() + s.slice(1))}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Seznam — scrolluje */}
      <div className="flex-1 overflow-y-auto">
      {filtered.length === 0 ? (
        <p className="text-xs text-center text-muted-foreground py-3">Žádné záznamy odpovídající filtru.</p>
      ) : (
        <div className="space-y-2 py-1">
          {filtered.slice(0, 30).map((s) => {
            const pct = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
            const grade = pctToGrade(pct);
            const gMeta = GRADE_META[grade];
            const topic = getTopicById(s.skill_id);
            const name = topic?.title ?? s.skill_id.replace(/[-_]/g, " ");
            const subject = getSkillSubject(s.skill_id);
            const subjectMeta = subject ? getSubjectMeta(subject) : null;

            return (
              <div key={s.session_id} className="rounded-2xl border border-border/40 bg-slate-50/60 p-3 flex items-center gap-3.5">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 shrink-0">
                  <IllustrationImg
                    src={subjectMeta?.image ?? ""}
                    className="h-11 w-11 object-contain"
                    fallback={<span className="text-2xl">{subjectMeta?.emoji ?? "📋"}</span>}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {subjectMeta?.label && (
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide leading-tight mb-0.5">
                      {subjectMeta.label}
                    </p>
                  )}
                  <p className="font-semibold text-foreground text-sm leading-tight">{name}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {new Date(s.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" })}
                    {" "}
                    {new Date(s.date).toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="flex items-center gap-0.5 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" />{s.correct}</span>
                  {s.help_used > 0 && <span className="flex items-center gap-0.5 text-xs text-amber-500"><HelpCircle className="h-3 w-3" />{s.help_used}</span>}
                  {s.total - s.correct > 0 && <span className="flex items-center gap-0.5 text-xs text-red-500"><XCircle className="h-3 w-3" />{s.total - s.correct}</span>}
                  <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-[11px] font-bold border ${gMeta.bg} ${gMeta.color} ${gMeta.border}`}>
                    {grade}
                  </span>
                  {childId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 rounded-full text-xs text-blue-700 border-blue-300 hover:bg-blue-50 hover:border-blue-400 flex items-center gap-1 font-semibold"
                      onClick={() => setDetailSkillId(s.skill_id)}
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      Jak mu to šlo
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
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
