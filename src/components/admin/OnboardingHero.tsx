import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, GraduationCap, ArrowRight, Wand2 } from "lucide-react";
import type { Grade } from "@/lib/types";

// ══════════════════════════════════════════════════════
// Quick-start templates — pre-filled prompts for common scenarios
// ══════════════════════════════════════════════════════
interface Template {
  label: string;
  description: string;
  emoji: string;
  grades: string;
  prompt: string;
}

const TEMPLATES: Template[] = [
  {
    label: "ZŠ Matematika",
    description: "Základy + zlomky + geometrie",
    emoji: "🧮",
    grades: "1.–9. tř.",
    prompt:
      'Navrhni kompletní strukturu předmětu "matematika" pro základní školu (1.–9. ročník). Zahrň hlavní okruhy (čísla a operace, zlomky, geometrie, měření), klíčová témata pro každý ročník a základní dovednosti s cíli, hranicemi, nápovědami a klíčovými slovy.',
  },
  {
    label: "ZŠ Čeština",
    description: "Pravopis, mluvnice, diktáty",
    emoji: "✏️",
    grades: "1.–9. tř.",
    prompt:
      'Navrhni kompletní strukturu předmětu "čeština" pro základní školu (1.–9. ročník). Zahrň okruhy (pravopis, mluvnice, vyjmenovaná slova, diktáty), témata a dovednosti s cíli a nápovědami.',
  },
  {
    label: "ZŠ Prvouka",
    description: "Přírodověda, vlastivěda",
    emoji: "🌍",
    grades: "1.–5. tř.",
    prompt:
      'Navrhni kompletní strukturu předmětu "prvouka" pro 1.–5. ročník ZŠ. Zahrň okruhy (tělo a zdraví, rostliny a zvířata, rodina a společnost, orientace v prostoru a čase, roční období a počasí), témata a podtémata s cíli a nápovědami.',
  },
  {
    label: "Vlastní obor",
    description: "Popíšu AI, co potřebuji",
    emoji: "✨",
    grades: "libovolné",
    prompt: "",
  },
];

interface OnboardingHeroProps {
  gradeFilter: Grade | null;
  onStartWithPrompt: (prompt: string) => void;
  onOpenWizard: () => void;
}

export function OnboardingHero({ gradeFilter, onStartWithPrompt, onOpenWizard }: OnboardingHeroProps) {
  const gradeCtx = gradeFilter ? ` pro ${gradeFilter}. ročník` : "";

  return (
    <div className="space-y-6">
      {/* ═══════ Hero welcome card ═══════ */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/10 overflow-hidden relative">
        <CardContent className="p-8 sm:p-10 text-center space-y-6 relative">
          {/* Decorative background sparkles */}
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>

          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {gradeFilter ? `Pro ${gradeFilter}. ročník zatím není obsah` : "Vítejte! Začněme vytvářet kurikulum"}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vyberte si jednu z připravených šablon, nebo popište AI asistentovi, co potřebujete
              {gradeCtx}. Asistent navrhne kompletní strukturu (okruhy, témata, podtémata s nápovědami).
            </p>
          </div>

          <Button size="lg" onClick={onOpenWizard} className="gap-2 shadow-md">
            <Wand2 className="h-4 w-4" />
            Otevřít průvodce
          </Button>
        </CardContent>
      </Card>

      {/* ═══════ Quick-start templates ═══════ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Rychlý start — vyberte šablonu</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {TEMPLATES.map((tpl) => {
            const isCustom = tpl.prompt === "";
            const actualPrompt = isCustom
              ? ""
              : gradeFilter
              ? `${tpl.prompt} Zaměř se zejména na ${gradeFilter}. ročník.`
              : tpl.prompt;
            return (
              <Card
                key={tpl.label}
                className="cursor-pointer border-2 border-transparent hover:border-primary/50 hover:bg-primary/5 transition-all group"
                onClick={() => (isCustom ? onOpenWizard() : onStartWithPrompt(actualPrompt))}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl shrink-0">{tpl.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-foreground">{tpl.label}</p>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {tpl.grades}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tpl.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ═══════ Help footer ═══════ */}
      <div className="rounded-md border bg-muted/40 px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          💡 <span className="font-medium">Tip:</span> Všechny šablony vytvoří kompletní strukturu —
          předměty, okruhy, témata i podtémata s nápovědami. Po vygenerování můžete cokoli upravit.
        </p>
      </div>
    </div>
  );
}
