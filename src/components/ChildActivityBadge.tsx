import { useChildStats } from "@/hooks/useChildStats";
import { Sparkles, TrendingUp, Heart } from "lucide-react";

interface Props {
  childId: string;
}

/**
 * Hero karta s týdenním přehledem aktivity dítěte.
 *
 * Tři stavy:
 *  • žádná aktivita → motivační CTA bez negace
 *  • aktivita s nízkou úspěšností → "ještě trénovat"
 *  • aktivita s dobrou úspěšností → pochvala
 */
export function ChildActivityBadge({ childId }: Props) {
  const { sessions, tasks, accuracy, loading } = useChildStats(childId);

  if (loading) return null;

  // Žádná aktivita — pozitivní motivační karta, žádné negativní hlášky
  if (tasks === 0) {
    return (
      <div className="rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <p className="text-sm font-semibold text-blue-900">Tento týden ještě nezačal</p>
        </div>
        <p className="text-xs text-blue-700/80 leading-relaxed">
          Můžete dítě jemně motivovat — třeba mu zadat menší úkol nebo zkusit společně.
        </p>
      </div>
    );
  }

  // S aktivitou — ukáž pokrok
  const verdictInfo =
    accuracy >= 80
      ? {
          icon: <Sparkles className="h-4 w-4" />,
          text: "Jde mu/jí to skvěle!",
          subText: "Pokračujte ve stejném tempu.",
          color: "text-green-700",
          bg: "bg-gradient-to-br from-green-50 to-emerald-50",
          border: "border-green-200",
          accent: "text-green-600",
        }
      : accuracy >= 50
      ? {
          icon: <TrendingUp className="h-4 w-4" />,
          text: "Zlepšuje se",
          subText: "Stačí ještě trochu trénovat.",
          color: "text-amber-700",
          bg: "bg-gradient-to-br from-amber-50 to-orange-50",
          border: "border-amber-200",
          accent: "text-amber-600",
        }
      : {
          icon: <Heart className="h-4 w-4" />,
          text: "Potřebuje pomoct",
          subText: "Zkuste s ním projít látku společně.",
          color: "text-rose-700",
          bg: "bg-gradient-to-br from-rose-50 to-pink-50",
          border: "border-rose-200",
          accent: "text-rose-600",
        };

  return (
    <div className={`rounded-xl border-2 ${verdictInfo.bg} ${verdictInfo.border} p-4 space-y-3`}>
      {/* Verdikt nahoře */}
      <div className="flex items-center gap-2">
        <span className={verdictInfo.accent}>{verdictInfo.icon}</span>
        <div>
          <p className={`text-sm font-bold ${verdictInfo.color}`}>{verdictInfo.text}</p>
          <p className="text-xs text-foreground/70">{verdictInfo.subText}</p>
        </div>
      </div>

      {/* Statistiky kompaktně v řádku */}
      <div className="flex items-center justify-around gap-2 pt-2 border-t border-current/10">
        <Stat label="Úloh" value={tasks} />
        <Stat label={sessions === 1 ? "Sezení" : "Sezení"} value={sessions} />
        <Stat label="Úspěšnost" value={`${accuracy} %`} highlight={accuracy >= 80} />
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className={`text-xl font-bold ${highlight ? "text-green-600" : "text-foreground"}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
