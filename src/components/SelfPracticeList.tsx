import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles } from "lucide-react";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";

interface Props {
  childId: string;
}

interface SkillGroup {
  skillId: string;
  count: number;
  independent: number;
  withHelp: number;
  wrong: number;
  lastDate: string;
  subject: string;
}

const SUBJECT_META: Record<string, { emoji: string; label: string; color: string }> = {
  matematika: { emoji: "🔢", label: "Matematika", color: "text-blue-700" },
  "čeština": { emoji: "📝", label: "Čeština", color: "text-purple-700" },
  prvouka: { emoji: "🌍", label: "Prvouka", color: "text-green-700" },
  "přírodověda": { emoji: "🌿", label: "Přírodověda", color: "text-emerald-700" },
  "vlastivěda": { emoji: "🗺️", label: "Vlastivěda", color: "text-amber-700" },
  ostatní: { emoji: "📚", label: "Ostatní", color: "text-slate-700" },
};

function detectSubject(skillId: string): string {
  // Nejdřív zkus skillReadableName.getSkillSubject
  const fromRegistry = getSkillSubject(skillId);
  if (fromRegistry) return fromRegistry;
  // Fallback heuristika podle prefixu
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "matematika";
  if (skillId.startsWith("cz-") || skillId.includes("diktat") || skillId.includes("pravopis") ||
      skillId.includes("vyjmen") || skillId.includes("mluvnice") || skillId.includes("parove")) return "čeština";
  if (skillId.startsWith("prv-") || skillId.startsWith("pr-") || skillId.includes("prvouka")) return "prvouka";
  return "ostatní";
}

export function SelfPracticeList({ childId }: Props) {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    (async () => {
      const [logsRes, assignRes] = await Promise.all([
        supabase
          .from("session_logs")
          .select("skill_id, correct, help_used, created_at")
          .eq("child_id", childId)
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(200),
        supabase
          .from("parent_assignments")
          .select("skill_id")
          .eq("child_id", childId),
      ]);

      if (cancelled) return;

      const assignedSkills = new Set(
        (assignRes.data ?? []).map((a) => a.skill_id)
      );

      const logs = (logsRes.data ?? []).filter(
        (l) => !assignedSkills.has(l.skill_id)
      );

      const map = new Map<string, SkillGroup>();
      for (const log of logs) {
        const g = map.get(log.skill_id) ?? {
          skillId: log.skill_id,
          count: 0,
          independent: 0,
          withHelp: 0,
          wrong: 0,
          lastDate: log.created_at,
          subject: detectSubject(log.skill_id),
        };
        g.count++;
        if (log.correct && !log.help_used) g.independent++;
        else if (log.correct && log.help_used) g.withHelp++;
        else g.wrong++;
        if (log.created_at > g.lastDate) g.lastDate = log.created_at;
        map.set(log.skill_id, g);
      }

      const sorted = Array.from(map.values()).sort(
        (a, b) => b.lastDate.localeCompare(a.lastDate)
      );

      setGroups(sorted);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [childId]);

  if (loading || groups.length === 0) return null;

  // Seskup podle předmětu
  const bySubject = new Map<string, SkillGroup[]>();
  for (const g of groups) {
    if (!bySubject.has(g.subject)) bySubject.set(g.subject, []);
    bySubject.get(g.subject)!.push(g);
  }

  // Pořadí předmětů (matematika první, pak abecedně)
  const subjectOrder = ["matematika", "čeština", "prvouka", "přírodověda", "vlastivěda", "ostatní"];
  const sortedSubjects = Array.from(bySubject.keys()).sort((a, b) => {
    const ia = subjectOrder.indexOf(a);
    const ib = subjectOrder.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const totalSkills = groups.length;
  const totalTasks = groups.reduce((s, g) => s + g.count, 0);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between gap-2 rounded-lg border-2 border-indigo-200/60 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 px-3 py-2.5 text-sm font-medium text-indigo-900 transition-colors">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Procvičoval(a) si sám/sama</span>
            <span className="text-xs font-normal text-indigo-700/70">
              ({totalSkills} {totalSkills === 1 ? "téma" : totalSkills < 5 ? "témata" : "témat"} · {totalTasks}×)
            </span>
          </span>
          <span className="flex items-center gap-1 text-xs text-indigo-700/70">
            <span>{open ? "Skrýt" : "Zobrazit"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="rounded-xl border bg-card p-4 space-y-4 mt-2">
          <p className="text-[11px] text-muted-foreground -mt-1">Za posledních 14 dní</p>

          {sortedSubjects.map((subject) => {
            const meta = SUBJECT_META[subject] ?? SUBJECT_META.ostatní;
            const items = bySubject.get(subject)!;
            const subjectTotal = items.reduce((s, g) => s + g.count, 0);

            return (
              <div key={subject} className="space-y-2">
                {/* Subject header */}
                <div className="flex items-center gap-2 pb-1 border-b border-border/40">
                  <span className="text-base">{meta.emoji}</span>
                  <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {items.length} {items.length === 1 ? "téma" : items.length < 5 ? "témata" : "témat"} · {subjectTotal}×
                  </span>
                </div>

                {/* Skills v tomto předmětu */}
                <div className="space-y-2 pl-2">
                  {items.map((g) => (
                    <div key={g.skillId} className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex-1 truncate font-medium text-foreground">
                          {getReadableSkillName(g.skillId)}
                        </span>
                        <span className="text-xs text-muted-foreground">{g.count}×</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        {g.independent > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                            {g.independent} sam.
                          </span>
                        )}
                        {g.withHelp > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                            {g.withHelp} s&nbsp;náp.
                          </span>
                        )}
                        {g.wrong > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                            {g.wrong} chyb
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
