import { Badge } from "@/components/ui/badge";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  results?: ("correct" | "wrong" | "help")[];
  dotAccentClass?: string;
}

/**
 * Design systém: správně = zelená, chyba = červená, nápověda = jantarová.
 *
 * Dřív tu byla chyba **oranžová** a nápověda **modrá**. Oranžová je přitom
 * barva sovy — dítě vidělo maskota a značku ve stejném odstínu jako svoji
 * chybu. Modrá zase kolidovala s matematikou. Tečky navíc nejsou plné syté
 * plochy, ale tinty s prstencem: plná červená je pro dítě trest, ne
 * informace (viz `docs/DESIGN_SYSTEM.md`).
 */
const DOT = {
  correct: { cls: "bg-success-muted ring-1 ring-success/40", emoji: "😊" },
  wrong: { cls: "bg-destructive-muted ring-1 ring-destructive/40", emoji: "😕" },
  help: { cls: "bg-warning-muted ring-1 ring-warning/40", emoji: "🤔" },
} as const;

export function ProgressIndicator({ current, total, results = [], dotAccentClass }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        Úloha {Math.min(current + 1, total)} z {total}
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const base = "rounded-full transition-all duration-300 flex items-center justify-center text-sm ";
          const result = results[i];
          const done = result ? DOT[result] : null;

          if (done) {
            return <div key={i} className={`${base} w-7 h-7 ${done.cls}`}>{done.emoji}</div>;
          }
          if (i === current) {
            const accent = dotAccentClass ?? "bg-accent ring-2 ring-primary/50";
            return <div key={i} className={`${base} w-8 h-8 ${accent} scale-110`}>✏️</div>;
          }
          return <div key={i} className={`${base} w-7 h-7 bg-muted-foreground/20`} />;
        })}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Badge variant="success" className="gap-1">😊 správně</Badge>
          <Badge variant="danger" className="gap-1">😕 zkus to příště</Badge>
          <Badge variant="warning" className="gap-1">🤔 s nápovědou</Badge>
        </div>
      )}
    </div>
  );
}
