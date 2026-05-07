import { useChildStats } from "@/hooks/useChildStats";
import { Sparkles, TrendingUp } from "lucide-react";
import { DewhiteImg } from "@/components/DewhiteImg";

interface Props {
  childId?: string;
  /** Demo/mock mode — přeskočí Supabase fetch */
  mockStats?: { tasks: number; days: number; accuracy: number; assignedTasks?: number; selfTasks?: number };
  /** Kompaktní mód pro tmavé/gradientní pozadí — bílé číslice, žádné bílé boxy */
  compact?: boolean;
}

/**
 * Status banner + 3-stat grid v Notion vibe.
 * Layout: žluto-zelený banner s ikonou a popisem, pod ním 3 velké stat boxy.
 */
export function ChildActivityBadge({ childId = "", mockStats, compact }: Props) {
  const hookStats = useChildStats(childId);
  const { tasks, accuracy, assignedTasks, selfTasks, loading } = mockStats
    ? { ...mockStats, assignedTasks: mockStats.assignedTasks ?? 0, selfTasks: mockStats.selfTasks ?? 0, loading: false }
    : hookStats;
  const days = mockStats ? mockStats.days : hookStats.daysActive;

  if (loading) return null;

  // Kompaktní mód — bílé číslice pro tmavé/gradientní pozadí
  if (compact) {
    const pl = (n: number, one: string, few: string, many: string) =>
      n === 1 ? one : n >= 2 && n <= 4 ? few : many;

    let summaryText: string;
    if (tasks === 0) {
      summaryText = "Za poslední týden žádná aktivita. Zkuste zadat malý úkol — třeba jen 5 minut denně stačí.";
    } else {
      const splitPart = assignedTasks > 0 && selfTasks > 0
        ? ` (${assignedTasks} ${pl(assignedTasks, "ze zadání", "ze zadání", "ze zadání")}, ${selfTasks} samostatně)`
        : assignedTasks > 0
        ? " — vše ze zadání"
        : selfTasks > 0
        ? " — vše samostatně"
        : "";

      const base = `Za poslední týden splnil/a ${tasks} ${pl(tasks, "úlohu", "úlohy", "úloh")} za ${days} ${pl(days, "den", "dny", "dní")}${splitPart} s ${accuracy}% úspěšností.`;

      const tip =
        accuracy >= 80 ? " Skvělé výsledky — klidně přidejte nové téma!" :
        accuracy >= 50 ? " Jde to správným směrem — trochu více opakování a výsledky přijdou." :
        " Zkuste spolu procvičit jedno konkrétní téma — pomůže to víc než roztříštěné opakování.";

      summaryText = base + tip;
    }

    return (
      <div className="space-y-3">
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-extrabold text-foreground tabular-nums">{tasks}</p>
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] mt-0.5">ÚLOH</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground tabular-nums">{days}</p>
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] mt-0.5">{days === 1 ? "DEN" : days >= 2 && days <= 4 ? "DNY" : "DNÍ"}</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-foreground tabular-nums">{accuracy}%</p>
            <p className="text-muted-foreground text-[10px] font-bold tracking-[0.12em] mt-0.5">ÚSPĚŠNOST</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm leading-snug max-w-sm">{summaryText}</p>
      </div>
    );
  }

  // Žádná aktivita — měkká motivační karta
  if (tasks === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-border bg-card shadow-soft-1 p-3 flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-50 text-sky-600 shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-foreground">Tento týden ještě nezačal/a</p>
            <p className="text-[12px] text-muted-foreground leading-snug">
              Můžete dítě jemně motivovat — zadat menší úkol nebo zkusit společně.
            </p>
          </div>
        </div>
        <StatGrid tasks={tasks} days={days} accuracy={accuracy} />
      </div>
    );
  }

  // S aktivitou — verdikt + stats
  const verdictInfo =
    accuracy >= 80
      ? {
          img: "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png",
          text: "Jde mu/jí to skvěle!",
          subText: "Pokračujte ve stejném tempu.",
          tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
        }
      : accuracy >= 50
      ? {
          img: "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-child-desk.png",
          text: "Zlepšuje se",
          subText: "Stačí ještě trochu trénovat. Pokračuje v dobrém tempu.",
          tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
        }
      : {
          img: "https://uusaczibimqvaazpaopy.supabase.co/storage/v1/object/public/prvouka-images/ui-focus-target.png",
          text: "Je tu prostor pro zlepšení",
          subText: "Procvičte spolu jedno téma — výsledky přijdou rychle.",
          tone: "bg-amber-50 border-amber-200 text-amber-800",
        };

  return (
    <div className="space-y-3">
      <div className={`rounded-2xl border ${verdictInfo.tone} p-3 flex items-center gap-3 shadow-soft-1`}>
        <DewhiteImg
          src={verdictInfo.img}
          alt=""
          className="h-12 w-12 object-contain shrink-0"
          threshold={240}
        />
        <div className="space-y-0.5 flex-1">
          <p className="text-sm font-bold">{verdictInfo.text}</p>
          <p className="text-[12px] opacity-90 leading-snug">{verdictInfo.subText}</p>
        </div>
      </div>
      <StatGrid tasks={tasks} days={days} accuracy={accuracy} highlight={accuracy >= 80} />
    </div>
  );
}

function StatGrid({
  tasks, days, accuracy, highlight,
}: { tasks: number; days: number; accuracy: number; highlight?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard value={tasks} label="ÚLOH" tone="indigo" />
      <StatCard value={days} label={days === 1 ? "DEN" : days >= 2 && days <= 4 ? "DNY" : "DNÍ"} tone="emerald" />
      <StatCard value={`${accuracy}%`} label="ÚSPĚŠNOST" tone={highlight ? "emerald" : "indigo"} />
    </div>
  );
}

function StatCard({ value, label, tone }: { value: number | string; label: string; tone: "indigo" | "emerald" }) {
  const colors = {
    indigo: "border-b-2 border-primary/60 text-foreground",
    emerald: "border-b-2 border-emerald-500/60 text-foreground",
  } as const;
  return (
    <div className={`rounded-2xl border border-border bg-card shadow-soft-1 px-3 py-3.5 text-center ${colors[tone]}`}>
      <p className="font-display text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
