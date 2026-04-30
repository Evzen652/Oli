import { useChildMisconceptions } from "@/hooks/useChildMisconceptions";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { getReadableSkillName } from "@/lib/skillReadableName";

interface Props {
  childId: string;
}

/**
 * Zobrazí AI-detekované vzorce chyb dítěte (misconceptions).
 * Pokud žádné aktivní → nezobrazí nic (skrytá sekce).
 */
export function ChildMisconceptions({ childId }: Props) {
  const { data, loading } = useChildMisconceptions(childId);

  if (loading) return null;
  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3 shadow-soft-1">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
        <p className="font-display font-semibold text-foreground text-sm">
          Co se opakovaně nedaří
        </p>
        <span className="text-[11px] text-muted-foreground">
          AI rozpoznala {data.length} {data.length === 1 ? "vzor" : data.length < 5 ? "vzory" : "vzorů"}
        </span>
      </div>

      <div className="space-y-2.5">
        {data.map((m) => (
          <div key={m.id} className="rounded-xl bg-card border border-amber-200/70 p-3 space-y-1.5">
            <div className="flex items-start gap-2 flex-wrap">
              <p className="font-semibold text-foreground text-sm flex-1 min-w-0">
                {m.pattern_label}
              </p>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                {getReadableSkillName(m.skill_id)}
              </span>
            </div>
            {m.description && (
              <p className="text-[12px] text-muted-foreground leading-snug">{m.description}</p>
            )}
            {m.suggestion && (
              <div className="flex items-start gap-1.5 pt-1.5 border-t border-amber-200/50">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-foreground/85 leading-snug font-medium">{m.suggestion}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
