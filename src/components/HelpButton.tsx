import { useState, useEffect } from "react";
import { getHelpForTopic } from "@/lib/helpEngine";
import { getSafeHints } from "@/lib/safeHints";
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import icoHelp from "@/assets/progress/progress-help.png";
import { useT } from "@/lib/i18n";

interface HelpButtonProps {
  skillId: string;
  topic?: TopicMetadata | null;
  currentTask?: PracticeTask | null;
  onHelpOpened?: () => void;
}

export function HelpButton({ skillId, topic, currentTask, onHelpOpened }: HelpButtonProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [revealedCount, setRevealedCount] = useState(1);
  const help = getHelpForTopic(topic ?? null);

  const hints = getSafeHints(currentTask, topic);
  const hasHints = hints.length > 0;
  const hasSolutionSteps = currentTask?.solutionSteps && currentTask.solutionSteps.length > 0;

  // Reset revealed count when task changes
  useEffect(() => {
    setRevealedCount(1);
    setOpen(false);
  }, [currentTask?.question]);

  // Show button if we have hints, solutionSteps (fallback), or topic help (fallback)
  if (!hasHints && !hasSolutionSteps && !help) return null;

  const handleOpen = (val: boolean) => {
    setOpen(val);
    if (val && onHelpOpened) onHelpOpened();
  };

  return (
    <Collapsible open={open} onOpenChange={handleOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          /**
           * 🐞 Tady byla `bg-violet-200 border-violet-400 text-violet-900`.
           * Jenže `tailwind.config.ts` mapuje `violet → brandOrange`, takže se
           * to renderovalo jako **meruňková placka přes celou šířku** —
           * nejsytější prvek obrazovky. Autor psal fialovou, obrazovka
           * ukazovala oranžovou. Nápověda tím byla vizuálně hlasitější než
           * samotné odpovědi, což je přesně naruby.
           *
           * Nově tichá pilulka s okrajem: nabídne se, ale nekřičí. Zmizel
           * i `hover:scale-[1.02]` — design systém povoluje jediný hover
           * pohyb, zvednutí o 1 px, a tohle bylo poslední místo, kde přežil.
           */
          className="w-full justify-start gap-2 rounded-full border border-warning/40 bg-warning-muted px-5 text-[15px] font-semibold text-warning-foreground shadow-e1 transition-colors duration-150 hover:border-warning/70 hover:bg-warning-muted/70"
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          {open ? t("help.close") : t("help.open")}
        </Button>
      </CollapsibleTrigger>
      {/* Panel je bílý list s okrajem v jantarovém tintu — stejné tvarosloví
          jako karta otázky a landing page. Dřív dvojnásobně silná linka
          a plná světle žlutá plocha, tedy jiný jazyk než zbytek obrazovky. */}
      <CollapsibleContent className="mt-4 rounded-3xl border border-warning/30 bg-card p-5 text-base shadow-e1 animate-fade-in">
        <div className="space-y-4">
            {hasHints ? (
              <>
                {hints.slice(0, revealedCount).map((hint, i) => (
                  <p key={i} className="flex gap-2 text-foreground text-base leading-relaxed">
                    <img src={icoHelp} alt="" className="mt-0.5 h-5 w-5 shrink-0 object-contain" />
                    <span>{hint}</span>
                  </p>
                ))}
                {revealedCount < hints.length && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full font-semibold"
                    onClick={() => setRevealedCount((c) => c + 1)}
                  >
                    {t("help.more")}
                  </Button>
                )}
              </>
            ) : hasSolutionSteps ? (
              <>
                <p className="font-medium text-foreground text-lg">{t("help.procedure_title")}</p>
                <ol className="list-decimal list-inside space-y-2 text-base text-muted-foreground">
                  {currentTask!.solutionSteps!.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            ) : help ? (
              <>
                <p className="font-medium text-foreground text-lg">{help.hint}</p>
                <div className="space-y-3 border-t border-border pt-4 text-muted-foreground">
                  <p className="font-medium text-foreground text-lg">Postup:</p>
                  <ol className="list-decimal list-inside space-y-2 text-base">
                    {help.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                  <p className="text-base"><span className="font-medium text-foreground">{t("help.common_mistake")}</span> {help.commonMistake}</p>
                  <p className="text-base"><span className="font-medium text-foreground">{t("help.example")}</span> {help.example}</p>
                </div>
              </>
            ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
