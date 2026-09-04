import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { getReadableSkillName, getSkillSubject } from "@/lib/skillReadableName";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { localDayKey } from "@/lib/assignmentBinding";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, ChevronRight, ChevronDown, BarChart3 } from "lucide-react";

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

/**
 * Ikona předmětu ze **sdíleného rejstříku**, ne z vlastní mapy.
 *
 * Původní `subjectEmoji()` porovnávala prefixy `math…`, `cz-`, `prv-`, tedy jen
 * legacy demo ID. Reálná témata mají tvar `g4-mat-…`, `g4-cjl-…`,
 * `g3-prvouka-…`, takže by **všechna** propadla na obecné 📚 a rozpad dne by
 * měl u každé dovednosti stejnou ikonu. Navíc to byla sedmá nezávislá mapa
 * předmětů — design systém je sjednotil do `subjectRegistry`.
 */
function SkillIcon({ skillId }: { skillId: string }) {
  const subject = getSkillSubject(skillId);
  const meta = subject ? getSubjectMeta(subject) : null;
  return (
    <span className="h-5 w-5 shrink-0 grid place-items-center overflow-hidden" aria-hidden>
      <IllustrationImg
        src={meta?.image ?? ""}
        className="h-5 w-5 object-contain"
        fallback={<span className="text-base leading-none">{meta?.emoji ?? "📚"}</span>}
      />
    </span>
  );
}

/** `YYYY-MM-DD` v **místním** čase — viz `localDayKey` v dataloadu níž. */
function toLocalDayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
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
      // Klíče dnů se počítají v MÍSTNÍ zóně. `toISOString().slice(0,10)` by
      // v ČR (UTC+1/+2) hodilo večerní procvičování do jiného dne, než ve který
      // ho dítě dělalo — sloupec by v grafu vyskočil o den vedle. Stejný bug byl
      // v `useChildStats` a `weeklyReportGenerator`, opravený ve `feed2bf`.
      const todayStr = toLocalDayKey(new Date());

      for (let i = 6; i >= 0; i--) {
        const d = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = toLocalDayKey(d);
        const dayName = d.toLocaleDateString("cs-CZ", { weekday: "short" });
        const dateLabel = `${d.getDate()}.${d.getMonth() + 1}.`;
        dayEntries.push({ key: dateStr, dayName, dayNum: d.getDate(), dateLabel, isToday: dateStr === todayStr });
        dayMap.set(dateStr, { independent: 0, withHelp: 0, wrong: 0, skills: new Map() });
      }

      ((logs as LogEntry[] | null) ?? []).forEach((log) => {
        // Ne `created_at.slice(0,10)` — to je UTC den z databáze.
        const dateStr = localDayKey(log.created_at);
        const entry = dateStr ? dayMap.get(dateStr) : undefined;
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

  const hasAnyActivity = data.some(d => d.total > 0);
  const [open, setOpen] = useState(false);

  // Pokud žádná aktivita za 7 dní — collapsed by default (graf nedominuje).
  // Pokud aktivita — open by default (rodič ji chce vidět). Reaguje jen na
  // změnu dat (nová hodnota `hasAnyActivity` po načtení/změně weekOffset),
  // ne na každý render — jinak by `open || hasAnyActivity` udělalo tlačítko
  // "Skrýt" nefunkční natrvalo, kdykoli je nějaká aktivita (nešlo by ho
  // nikdy zavřít, protože OR s `true` je vždy `true`).
  useEffect(() => {
    setOpen(hasAnyActivity);
  }, [hasAnyActivity]);

  if (loading) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between gap-2 rounded-2xl border border-border bg-card hover:bg-muted/40 px-4 py-3 text-sm font-medium text-foreground transition-colors shadow-soft-1">
          <span className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            <span className="font-display font-semibold">Aktivita za 7 dní</span>
            <span className="text-xs text-muted-foreground font-normal">
              {hasAnyActivity ? `(${data.reduce((s, d) => s + d.total, 0)} úloh)` : "(zatím nic)"}
            </span>
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{open ? "Skrýt" : "Zobrazit"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4 pt-3 px-1">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={() => setWeekOffset(o => o + 1)}
          title="Předchozí týden"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-semibold text-foreground/80 px-2 py-1 rounded-full bg-muted/60">
          {weekOffset === 0 ? t("parent.chart_title") : formatDateRange(weekOffset)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset(o => o - 1)}
          title="Další týden"
        >
          <ChevronRight className="h-4 w-4" />
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
              <span className={`text-caption font-medium capitalize ${
                isSelected ? "text-primary" : d.isToday ? "text-primary" : "text-muted-foreground"
              }`}>
                {d.day}
              </span>
              <span className="text-caption text-muted-foreground/70">{d.dateLabel}</span>

              <div className="h-16 flex items-end justify-center w-full my-1.5">
                {active ? (
                  <div className="flex flex-col items-center gap-1 w-full">
                    <span className="text-sm font-bold text-foreground">{d.total}</span>
                    {/* Semafor z design systému (success / warning / destructive),
                        ne vlastní odstíny. Legenda dole používá tytéž třídy —
                        dřív měl sloupec `bg-green-500`, ale legenda `bg-success`,
                        takže puntík neodpovídal barvě, kterou vysvětloval. */}
                    <div className="w-full rounded-full overflow-hidden flex" style={{ height: "6px" }}>
                      {d.independent > 0 && (
                        <div className="bg-success h-full" style={{ width: `${(d.independent / d.total) * 100}%` }} />
                      )}
                      {d.withHelp > 0 && (
                        <div className="bg-warning h-full" style={{ width: `${(d.withHelp / d.total) * 100}%` }} />
                      )}
                      {d.wrong > 0 && (
                        <div className="bg-destructive h-full" style={{ width: `${(d.wrong / d.total) * 100}%` }} />
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
                    <SkillIcon skillId={skillId} />
                    <span className="flex-1 truncate font-medium text-foreground">{getReadableSkillName(skillId)}</span>
                    <span className="text-xs text-muted-foreground">{stats.count}×</span>
                  </div>
                  <div className="flex items-center gap-3 pl-7 text-caption">
                    {(stats.independent + stats.withHelp) > 0 && (
                      <span className="flex items-center gap-1 text-success font-semibold">
                        ✓ {stats.independent + stats.withHelp} správně
                      </span>
                    )}
                    {stats.withHelp > 0 && (
                      <span className="flex items-center gap-1 text-warning font-semibold">
                        {stats.withHelp} s&nbsp;nápov.
                      </span>
                    )}
                    {stats.wrong > 0 && (
                      <span className="flex items-center gap-1 text-destructive font-semibold">
                        ✗ {stats.wrong} špatně
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legenda. „Bez nápovědy", ne „Samostatně" — na téhle stránce je hned
          vedle sekce „Samostatné procvičování", kde totéž slovo znamená pravý
          opak (bez zadání rodiče). Dvě různá čtení jednoho slova na jedné
          obrazovce; tady jde o to, že dítě odpovědělo správně bez nápovědy. */}
      <div className="flex items-center gap-4 text-caption text-muted-foreground justify-center pt-1">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-success" /> Správně bez nápovědy
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-warning" /> Správně s nápovědou
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-destructive" /> Chybně
        </span>
      </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
