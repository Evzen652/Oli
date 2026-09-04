import { Badge } from "@/components/ui/badge";
import icoCurrent from "@/assets/progress/progress-current.png";
import icoCorrect from "@/assets/progress/progress-correct.png";
import icoWrong from "@/assets/progress/progress-wrong.png";
import icoHelp from "@/assets/progress/progress-help.png";

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
 *
 * Ikony byly do 2026-09-03 **systémová emoji** (✏️ 😊 😕 🤔). Nahrazeny
 * akvarelovými kresbami ze stejného rukopisu jako zbytek aplikace — emoji
 * se na každé platformě kreslí jinak a na 28 px se z obličeje stejně stane
 * šedá kaše. Proto ani nové ikony nejsou obličeje: nesou je siluety, které
 * se poznají z jedné barevné plochy.
 *
 * Chyba je **křížek v terakotě**, ne smutný smajlík ani plná signální červená —
 * ta je podle design systému pro dítě trest, ne informace.
 *
 * Mezikrok, který neprošel: kroužící šipka „zkus to znovu". Významově seděla,
 * ale v rozhraní je to univerzálně „načíst znovu", takže jako stavová ikona
 * lákala na kliknutí. **Stavová ikona nesmí mít tvarosloví ovládacího prvku.**
 */
const DOT = {
  correct: { cls: "bg-success-muted ring-1 ring-success/40", icon: icoCorrect, alt: "Správně" },
  wrong: { cls: "bg-destructive-muted ring-1 ring-destructive/40", icon: icoWrong, alt: "Zkus to příště" },
  help: { cls: "bg-warning-muted ring-1 ring-warning/40", icon: icoHelp, alt: "S nápovědou" },
} as const;

export function ProgressIndicator({ current, total, results = [], dotAccentClass }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        Úloha {Math.min(current + 1, total)} z {total}
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: total }).map((_, i) => {
          const base = "rounded-full transition-all duration-300 flex items-center justify-center ";
          const result = results[i];
          const done = result ? DOT[result] : null;

          if (done) {
            return (
              <div key={i} className={`${base} w-7 h-7 ${done.cls}`}>
                <img src={done.icon} alt={done.alt} className="w-[18px] h-[18px] object-contain" />
              </div>
            );
          }
          if (i === current) {
            const accent = dotAccentClass ?? "bg-accent ring-2 ring-primary/50";
            return (
              <div key={i} className={`${base} w-8 h-8 ${accent} scale-110`}>
                <img src={icoCurrent} alt="" className="w-[20px] h-[20px] object-contain" />
              </div>
            );
          }
          return <div key={i} className={`${base} w-7 h-7 bg-muted-foreground/20`} />;
        })}
      </div>
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <Badge variant="success" className="gap-1.5">
            <img src={icoCorrect} alt="" className="w-3.5 h-3.5 object-contain" /> Správně
          </Badge>
          <Badge variant="danger" className="gap-1.5">
            <img src={icoWrong} alt="" className="w-3.5 h-3.5 object-contain" /> Zkus to příště
          </Badge>
          <Badge variant="warning" className="gap-1.5">
            <img src={icoHelp} alt="" className="w-3.5 h-3.5 object-contain" /> S nápovědou
          </Badge>
        </div>
      )}
    </div>
  );
}
