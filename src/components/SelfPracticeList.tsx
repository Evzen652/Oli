import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getReadableSkillName } from "@/lib/skillReadableName";

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
}

function subjectEmoji(skillId: string): string {
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "🔢";
  if (skillId.startsWith("cz-") || skillId.startsWith("diktat") || skillId.includes("pravopis") || skillId.includes("vyjmen") || skillId.includes("mluvnice") || skillId.includes("parove")) return "📝";
  if (skillId.startsWith("prv-") || skillId.includes("prvouka")) return "🌿";
  return "📚";
}

function skillDisplayName(skillId: string): string {
  return getReadableSkillName(skillId);
}

export function SelfPracticeList({ childId }: Props) {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">🧩 Procvičoval(a) si sám/sama</p>
        <p className="text-[11px] text-muted-foreground">Za posledních 14 dní</p>
      </div>
      <div className="space-y-2">
        {groups.map((g) => (
          <div key={g.skillId} className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-base">{subjectEmoji(g.skillId)}</span>
              <span className="flex-1 truncate font-medium text-foreground">
                {skillDisplayName(g.skillId)}
              </span>
              <span className="text-xs text-muted-foreground">{g.count}×</span>
            </div>
            <div className="flex items-center gap-3 pl-7 text-[11px] text-muted-foreground">
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
}
