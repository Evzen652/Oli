import { useChildStats } from "@/hooks/useChildStats";
import { Sparkles, TrendingUp, Heart } from "lucide-react";

interface Props {
  childId: string;
}

/**
 * Status banner + 3-stat grid v Notion vibe.
 * Layout: žluto-zelený banner s ikonou a popisem, pod ním 3 velké stat boxy.
 */
export function ChildActivityBadge({ childId }: Props) {
  const { sessions, tasks, accuracy, loading } = useChildStats(childId);

  if (loading) return null;

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
        <StatGrid tasks={tasks} sessions={sessions} accuracy={accuracy} />
      </div>
    );
  }

  // S aktivitou — verdikt + stats
  const verdictInfo =
    accuracy >= 80
      ? {
          icon: <Sparkles className="h-4 w-4" />,
          text: "Jde mu/jí to skvěle!",
          subText: "Pokračujte ve stejném tempu.",
          tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
          iconBg: "bg-emerald-100 text-emerald-700",
        }
      : accuracy >= 50
      ? {
          icon: <TrendingUp className="h-4 w-4" />,
          text: "Zlepšuje se",
          subText: "Stačí ještě trochu trénovat. Pokračuje v dobrém tempu.",
          tone: "bg-emerald-50 border-emerald-200 text-emerald-700",
          iconBg: "bg-emerald-100 text-emerald-700",
        }
      : {
          icon: <Heart className="h-4 w-4" />,
          text: "Potřebuje pomoct",
          subText: "Zkuste s ním projít látku společně.",
          tone: "bg-rose-50 border-rose-200 text-rose-700",
          iconBg: "bg-rose-100 text-rose-700",
        };

  return (
    <div className="space-y-3">
      <div className={`rounded-2xl border ${verdictInfo.tone} p-3 flex items-start gap-3 shadow-soft-1`}>
        <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${verdictInfo.iconBg}`}>
          {verdictInfo.icon}
        </span>
        <div className="space-y-0.5 flex-1">
          <p className="text-sm font-bold">{verdictInfo.text}</p>
          <p className="text-[12px] opacity-90 leading-snug">{verdictInfo.subText}</p>
        </div>
      </div>
      <StatGrid tasks={tasks} sessions={sessions} accuracy={accuracy} highlight={accuracy >= 80} />
    </div>
  );
}

function StatGrid({
  tasks, sessions, accuracy, highlight,
}: { tasks: number; sessions: number; accuracy: number; highlight?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <StatCard value={tasks} label="ÚLOH" tone="indigo" />
      <StatCard value={sessions} label="SEZENÍ" tone="emerald" />
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
