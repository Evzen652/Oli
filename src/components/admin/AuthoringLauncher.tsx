import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { TopicMetadata } from "@/lib/types";

interface AuthoringLauncherProps {
  topic: TopicMetadata;
  level: 2 | 3;
}

const LEVEL_DESC: Record<number, string> = {
  2: "pokročilá — vícekrokové úlohy, aplikační situace z reálného světa",
  3: "vysoká obtížnost — kombinace konceptů, slovní úlohy, neobvyklé příklady",
};

function buildPrompt(topic: TopicMetadata, level: number): string {
  return `Vytvoř Level ${level} cvičení pro podtéma OLI:

Podtéma: ${topic.displayName ?? topic.title}
Předmět: ${topic.subject}
Ročník: ${topic.gradeRange[0]}. ročník
Level ${level}: ${LEVEL_DESC[level] ?? ""}

Požadavky:
- 40 různých úloh (náhodně generovaných, ne statický seznam)
- inputType: mix select_one, fill_blank, true_false dle vhodnosti
- Každá úloha má: question, correctAnswer, options (u select_one),
  hints[2], solutionSteps[3]
- Jazyk odpovídá ${topic.gradeRange[0]}. třídě ZŠ — krátké věty, běžná slova
- Hint[0]: navede směr, neprozradí odpověď
- Hint[1]: konkrétnější, žák musí udělat poslední krok sám
- Distraktory reprezentují typické chyby žáků (ne náhodná čísla)
- Level ${level} musí být znatelně těžší než Level ${level - 1}

Vzor: src/content/grade-${topic.gradeRange[0]}/TEMPLATE.ts
Výstup: TypeScript soubor připravený pro integraci přes Claude Code.`;
}

export function AuthoringLauncher({ topic, level }: AuthoringLauncherProps) {
  const handleOpen = () => {
    const url = `https://claude.ai/new?q=${encodeURIComponent(buildPrompt(topic, level))}`;
    window.open(url, "_blank");
  };

  return (
    <div className="rounded-xl border border-dashed border-violet-300 bg-violet-50 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-violet-500 text-xl shrink-0">📋</span>
        <div>
          <p className="font-semibold text-violet-900 text-sm">
            Obsah pro Level {level} chybí
          </p>
          <p className="text-violet-700 text-xs mt-1 leading-relaxed">
            Obsah se vytváří přes Claude Chat + Claude Code.
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="border-violet-300 text-violet-700 hover:bg-violet-100 gap-1.5"
      >
        Vytvořit obsah v Claude Chat <ExternalLink className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
