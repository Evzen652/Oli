import { useState, useEffect } from "react";
import { getHelpForTopic } from "@/lib/helpEngine";
import { getSafeHints } from "@/lib/safeHints";
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import helpHintImg from "@/assets/help-hint.png";
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
          className={`w-full text-base font-bold border-2 gap-2 rounded-xl shadow-md transition-all duration-200 ${
            open
              ? "bg-violet-200 border-violet-400 text-violet-900 hover:bg-violet-300 hover:text-violet-950"
              : "bg-violet-200 border-violet-400 text-violet-900 hover:bg-violet-300 hover:border-violet-500 hover:shadow-lg hover:scale-[1.02]"
          }`}
        >
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          {open ? t("help.close") : t("help.open")}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 text-base animate-fade-in">
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            {hasHints ? (
              <>
                {hints.slice(0, revealedCount).map((hint, i) => (
                  <p key={i} className="text-foreground text-base leading-relaxed">
                    💡 {hint}
                  </p>
                ))}
                {revealedCount < hints.length && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
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
                <div className="space-y-3 border-t border-amber-200 pt-4 text-muted-foreground">
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
          <img src={helpHintImg} alt="Nápověda" className="w-20 h-20 object-contain shrink-0 self-start mix-blend-multiply" />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
