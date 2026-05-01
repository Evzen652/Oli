import { useState, useEffect } from "react";
import type { TopicMetadata } from "@/lib/types";
import { FractionBarVisual } from "@/components/FractionBarVisual";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Props {
  topic: TopicMetadata;
  /** Resetuj otevření při změně tasku */
  resetKey?: string | number;
}

/**
 * MiniExplainer — kompaktní vizuální mini-vysvětlení tématu (Fáze 10).
 *
 * Renderuje se nad/u taskem. Tahá první visualExample z helpTemplate
 * + krátký závěr. Default collapsed — žák ho otevře, když chce.
 *
 * Princip "less time in system": není to plná nápověda (HelpButton),
 * jen rychlá vizuální připomínka konceptu. Pokud topic nemá vizuál,
 * komponenta se neurenderuje.
 */
export function MiniExplainer({ topic, resetKey }: Props) {
  const [open, setOpen] = useState(false);
  const visuals = topic.helpTemplate?.visualExamples ?? [];
  const first = visuals[0];

  useEffect(() => {
    setOpen(false);
  }, [resetKey]);

  if (!first) return null;

  const hasContent = !!(first.fractionBars?.length || first.illustration || first.conclusion);
  if (!hasContent) return null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 rounded-full text-xs text-muted-foreground hover:text-amber-700 hover:bg-amber-50"
        >
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>{open ? "Skrýt mini-příklad" : "Mini-příklad"}</span>
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-xl border border-amber-200 bg-amber-50/40 p-3 animate-fade-in">
        {first.label && (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 mb-2">
            {first.label}
          </p>
        )}
        {first.fractionBars && first.fractionBars.length > 0 ? (
          <FractionBarVisual bars={first.fractionBars} conclusion={first.conclusion} />
        ) : first.illustration ? (
          <pre className="text-xs font-mono bg-card border border-amber-200 rounded-lg p-2 overflow-x-auto whitespace-pre-wrap">
            {first.illustration}
          </pre>
        ) : null}
        {first.conclusion && !first.fractionBars && (
          <p className="text-sm text-foreground/80 mt-2 italic">{first.conclusion}</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
