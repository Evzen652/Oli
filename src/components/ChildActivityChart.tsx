import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { getTopicById } from "@/lib/contentRegistry";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LogEntry {
  created_at: string;
  correct: boolean;
  help_used: boolean;
  skill_id: string;
}

interface SkillStats {
  count: number;
  independent: number;
  withHelp: number;
  wrong: number;
}

interface DayData {
  key: string;
  day: string;
  dayNum: number;
  dateLabel: string;
  independent: number;
  withHelp: number;
  wrong: number;
  total: number;
  isToday: boolean;
  skills: Map<string, SkillStats>;
}

interface Props {
  childId: string;
}

function subjectEmoji(skillId: string): string {
  if (skillId.startsWith("math") || skillId.startsWith("frac")) return "🔢";
  if (skillId.startsWith("cz-") || skillId.startsWith("diktat") || skillId.includes("pravopis") || skillId.includes("vyjmen") || skillId.includes("mluvnice") || skillId.includes("parove")) return "📝";
  if (skillId.startsWith("prv-") || skillId.includes("prvouka")) return "🌿";
  return "📚";
}

function skillDisplayName(skillId: string): string {
  return getTopicById(skillId)?.title ?? skillId;
}

function formatDateRange(weekOffset: number): string {
  const end = new Date(Date.now() - weekOffset * 7 * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
  return `${fmt(start)} – ${fmt(end)}`;
}

export function ChildActivityChart({ childId }: Props) {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const t = useT();

  useEffect(() => {
    let cancelled = false;
    const endDate = new Date(Date.now() - weekOffset * 7 * 24 * 60 * 60 * 1000);
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    (async () => {
      const { data: logs } = await supabase
        .from("session_logs")
        .select("created_at, correct, help_used, skill_id")
        .eq("child_id", childId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true });

      if (cancelled) return;

      const dayMap = new Map<string, { independent: number; withHelp: number; wrong: number; skills: Map<string, SkillStats> }>();
      const dayEntries: { key: string; dayName: string; dayNum: number; dateLabel: string; isToday: boolean }[] = [];
      const todayStr = new Date().toISOString().slice(0, 10);

      for (let i = 6; i >= 0; i--) {
        const d = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().slice(0, 10);
        const dayName = d.toLocaleDateString("cs-CZ", { weekday: "short" });
        const dateLabel = `${d.getDate()}.${d.getMonth() + 1}.`;
        dayEntries.push({ key: dateStr, dayName, dayNum: d.getDate(), dateLabel, isToday: dateStr === todayStr });
        dayMap.set(dateStr, { independent: 0, withHelp: 0, wrong: 0, skills: new Map() });
      }

      ((logs as LogEntry[] | null) ?? []).forEach((log) => {
        const dateStr = log.created_at.slice(0, 10);
        const entry = dayMap.get(dateStr);
        if (!entry) return;
        if (log.correct && !log.help_used) entry.independent++;
        else if (log.correct && log.help_used) entry.withHelp++;
        else entry.wrong++;

        const sk = entry.skills.get(log.skill_id) ?? { count: 0, independent: 0, withHelp: 0, wrong: 0 };
        sk.count++;
        if (log.correct && !log.help_used) sk.independent++;
        else if (log.correct && log.help_used) sk.withHelp++;
        else sk.wrong++;
        entry.skills.set(log.skill_id, sk);
      });

      const result: DayData[] = dayEntries.map((e) => {
        const val = dayMap.get(e.key)!;
        return {
          key: e.key,
          day: e.dayName,
          dayNum: e.dayNum,
          dateLabel: e.dateLabel,
          ...val,
          total: val.independent + val.withHelp + val.wrong,
          isToday: e.isToday,
          skills: val.skills,
        };
      });

      setData(result);
      setSelectedDay(null);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [childId, weekOffset]);

  const selectedDayData = useMemo(
    () => data.find(d => d.key === selectedDay) ?? null,
    [data, selectedDay]
  );

  if (loading) return null;

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground"
          onClick={() => setWeekOffset(o => o + 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Předchozí
        </Button>
        <span className="text-xs font-medium text-muted-foreground">
          {weekOffset === 0 ? t("parent.chart_title") : formatDateRange(weekOffset)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset(o => o - 1)}
        >
          Další <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 7-day grid */}
      <div className="grid grid-cols-7 gap-2.5">
        {data.map((d) => {
          const active = d.total > 0;
          const isSelected = d.key === selectedDay;

          return (
            <button
              type="button"
              key={d.key}
              onClick={() => active && setSelectedDay(isSelected ? null : d.key)}
              disabled={!active}
              className={`flex flex-col items-center rounded-xl p-2.5 transition-all border-2 ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : d.isToday
                  ? "border-primary/20 bg-primary/5"
                  : active
                  ? "border-transparent bg-card hover:border-muted-foreground/20 cursor-pointer"
                  : "border-transparent bg-muted/30 cursor-default opacity-60"
              }`}
            >
              <span className={`text-[10px] font-medium capitalize ${
                isSelected ? "text-primary" : d.isToday ? "text-primary" : "text-muted-foreground"
              }`}>
                {d.day}
              </span>
              <span className="text-[10px] text-muted-foreground/70">{d.dateLabel}</span>

              <div className="h-16 flex items-end justify-center w-full my-1.5">
                {active ? (
                  <div className="flex flex-col items-center gap-1 w-full">
                    <span className="text-sm font-bold text-foreground">{d.total}</span>
                    <div className="w-full rounded-full overflow-hidden flex" style={{ height: "6px" }}>
                      {d.independent > 0 && (
                        <div className="bg-green-500 h-full" style={{ width: `${(d.independent / d.total) * 100}%` }} />
                      )}
                      {d.withHelp > 0 && (
                        <div className="bg-amber-400 h-full" style={{ width: `${(d.withHelp / d.total) * 100}%` }} />
                      )}
                      {d.wrong > 0 && (
                        <div className="bg-red-400 h-full" style={{ width: `${(d.wrong / d.total) * 100}%` }} />
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/50">–</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day detail panel */}
      {selectedDayData && selectedDayData.skills.size > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm font-medium text-foreground">
            {selectedDayData.day} {selectedDayData.dateLabel} — {selectedDayData.total} úloh
          </p>
          <div className="space-y-2">
            {Array.from(selectedDayData.skills.entries())
              .sort((a, b) => b[1].count - a[1].count)
              .map(([skillId, stats]) => (
                <div key={skillId} className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-base">{subjectEmoji(skillId)}</span>
                    <span className="flex-1 truncate font-medium text-foreground">{skillDisplayName(skillId)}</span>
                    <span className="text-xs text-muted-foreground">{stats.count}×</span>
                  </div>
                  <div className="flex items-center gap-3 pl-7 text-[11px] text-muted-foreground">
                    {stats.independent > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        {stats.independent} sam.
                      </span>
                    )}
                    {stats.withHelp > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
                        {stats.withHelp} s&nbsp;náp.
                      </span>
                    )}
                    {stats.wrong > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                        {stats.wrong} chyb
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground justify-center pt-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" /> samostatně
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" /> s nápovědou
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400" /> chybně
        </span>
      </div>
    </div>
  );
}
