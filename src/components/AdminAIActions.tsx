import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Sparkles, Search, PlusCircle, RefreshCw, Eye, AlertTriangle,
  BookOpen, Lightbulb, BarChart3, Wand2
} from "lucide-react";
import type { TopicMetadata, Grade } from "@/lib/types";

export interface AIAction {
  label: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
}

interface AdminAIActionsProps {
  level: "subject" | "category" | "topic" | "subtopic" | "detail";
  gradeFilter: Grade | null;
  selectedSubject: string | null;
  selectedCategory: string | null;
  selectedTopic: string | null;
  selectedSkill: TopicMetadata | null;
  subjectCount: number;
  categoryCount: number;
  topicCount: number;
  skillCount: number;
  onAction: (prompt: string) => void;
}

function getActions(props: AdminAIActionsProps): AIAction[] {
  const { level, gradeFilter, selectedSubject, selectedCategory, selectedTopic, selectedSkill, subjectCount, categoryCount, topicCount, skillCount } = props;
  const gradeCtx = gradeFilter ? ` pro ${gradeFilter}. ročník` : "";

  if (level === "subject") {
    const actions: AIAction[] = [];

    if (subjectCount === 0) {
      actions.push({
        label: "Vytvoř kurikulum",
        description: "Navrhne kompletní strukturu předmětů, okruhů, témat a dovedností od nuly",
        prompt: `Navrhni kompletní strukturu kurikula${gradeCtx}. Zahrň předměty, okruhy, témata a dovednosti s nápovědami.`,
        icon: <Sparkles className="h-4 w-4" />,
        variant: "default",
      });
    } else {
      actions.push(
        {
          label: "Co v kurikulu chybí?",
          description: "Porovná obsah s RVP a najde chybějící témata, okruhy a nápovědy",
          prompt: `Analyzuj existující kurikulum${gradeCtx} a identifikuj: 1) Chybějící okruhy nebo témata oproti RVP 2) Dovednosti bez nápověd 3) Nekonzistentní hranice nebo cíle 4) Chybějící pokrytí ročníků. Vypiš konkrétní problémy a navrhni opravy.`,
          icon: <Search className="h-4 w-4" />,
        },
        {
          label: "Jsou cíle a nápovědy OK?",
          description: "Prověří překryvy cílů, správnost nápověd a věkovou přiměřenost",
          prompt: `Prověř konzistenci celého kurikula${gradeCtx}: 1) Jsou cíle dovedností jasné a nepřekrývají se? 2) Odpovídají hranice ročníkovým požadavkům? 3) Jsou nápovědy pedagogicky správné a neprozrazují odpovědi? 4) Jsou úvodní motivační texty věkově přiměřené?`,
          icon: <Eye className="h-4 w-4" />,
        },
        {
          label: "Navrhni nová témata",
          description: "Navrhne nové okruhy a dovednosti podle RVP, které dosud chybí",
          prompt: `Na základě stávajícího kurikula${gradeCtx} navrhni smysluplná rozšíření: nové okruhy, témata nebo dovednosti, které dosud chybí a odpovídají RVP.`,
          icon: <PlusCircle className="h-4 w-4" />,
        },
      );
    }
    return actions;
  }

  if (level === "category" && selectedSubject) {
    const actions: AIAction[] = [];

    if (categoryCount === 0) {
      actions.push({
        label: "Vytvoř strukturu předmětu",
        description: "Navrhne kompletní strukturu okruhů, témat a dovedností pro tento předmět",
        prompt: `Navrhni kompletní strukturu předmětu "${selectedSubject}"${gradeCtx}: okruhy, témata a dovednosti s cíli, hranicemi, nápovědami a klíčovými slovy.`,
        icon: <Sparkles className="h-4 w-4" />,
        variant: "default",
      });
    } else {
      actions.push(
        {
          label: "Doplň chybějící okruhy",
          description: "Najde okruhy a témata, které v předmětu chybí oproti RVP",
          prompt: `Pro předmět "${selectedSubject}"${gradeCtx}: Analyzuj existující okruhy a navrhni chybějící témata nebo okruhy, které odpovídají RVP. Srovnej se standardním kurikulem a doplň mezery.`,
          icon: <PlusCircle className="h-4 w-4" />,
        },
        {
          label: "Vylepši úvodní texty",
          description: "Zkontroluje a přepíše motivační texty okruhů, aby byly stručné a věkově přiměřené",
          prompt: `Zkontroluj a vylepši úvodní motivační texty všech okruhů předmětu "${selectedSubject}". Úvodní texty musí být motivační, stručné a věkově přiměřené${gradeCtx}. Navrhni lepší verze pro ty, které jsou slabé.`,
          icon: <Lightbulb className="h-4 w-4" />,
        },
        {
          label: "Pokrytí ročníků",
          description: "Zkontroluje, zda má každý ročník dostatečný obsah, a označní mezery",
          prompt: `Analyzuj předmět "${selectedSubject}" a zkontroluj, zda má každý ročník (3.–9.) dostatečné pokrytí témat a dovedností. Označ mezery a navrhni doplnění.`,
          icon: <BarChart3 className="h-4 w-4" />,
        },
      );
    }
    return actions;
  }

  if (level === "topic" && selectedSubject && selectedCategory) {
    if (topicCount === 0) {
      return [{
        label: "Vytvoř témata",
        description: "Navrhne kompletní sadu témat a dovedností pro tento okruh",
        prompt: `Pro okruh "${selectedCategory}" předmětu "${selectedSubject}"${gradeCtx}: Navrhni kompletní sadu témat a dovedností s cíli, hranicemi, nápovědami a klíčovými slovy.`,
        icon: <Sparkles className="h-4 w-4" />,
        variant: "default" as const,
      }];
    }
    return [
      {
        label: "Doplň témata",
        description: "Navrhne chybějící témata v tomto okruhu podle RVP",
        prompt: `Pro okruh "${selectedCategory}" předmětu "${selectedSubject}"${gradeCtx}: Navrhni chybějící témata, která by měla být zahrnuta podle RVP. Zahrň popis a odůvodnění.`,
        icon: <PlusCircle className="h-4 w-4" />,
      },
      {
        label: "Zkontroluj pořadí",
        description: "Ověří, zda jsou témata seřazena od jednodušších ke složitějším",
        prompt: `Zkontroluj didaktické pořadí témat v okruhu "${selectedCategory}" (${selectedSubject}). Je pořadí logické od jednodušších ke složitějším? Závisí některé téma na jiném, které je zařazeno později? Navrhni optimální pořadí.`,
        icon: <RefreshCw className="h-4 w-4" />,
      },
      {
        label: "Vylepši popis okruhu",
        description: "Přepíše úvodní text okruhu tak, aby motivoval a byl srozumitelný",
        prompt: `Vylepši pedagogický kontext (úvodní text, co to je, proč to používáme, vizuální příklady, zajímavost) pro okruh "${selectedCategory}" v předmětu "${selectedSubject}". Text musí být motivační, stručný a srozumitelný${gradeCtx}.`,
        icon: <BookOpen className="h-4 w-4" />,
      },
    ];
  }

  if (level === "subtopic" && selectedSubject && selectedCategory && selectedTopic) {
    if (skillCount === 0) {
      return [{
        label: "Vytvoř podtémata",
        description: "Navrhne kompletní sadu dovedností pro toto téma",
        prompt: `Pro téma "${selectedTopic}" v okruhu "${selectedCategory}" (${selectedSubject})${gradeCtx}: Navrhni kompletní sadu podtémat (skills) s názvy, popisy, cíli, hranicemi, klíčovými slovy a nápovědami.`,
        icon: <Sparkles className="h-4 w-4" />,
        variant: "default" as const,
      }];
    }
    return [
      {
        label: "Přidej podtéma",
        description: "Navrhne nové dovednosti (skills) s cíli, hranicemi a nápovědami",
        prompt: `Pro téma "${selectedTopic}" v okruhu "${selectedCategory}" (${selectedSubject})${gradeCtx}: Navrhni nová podtémata (skills), která chybí. Zahrň: název, popis, cíle, hranice, klíčová slova a kompletní nápovědu (hint, kroky, příklad, častá chyba, vizuální příklady).`,
        icon: <PlusCircle className="h-4 w-4" />,
      },
      {
        label: "Zkontroluj nápovědy",
        description: "Ověří, že nápovědy neprozrazují odpovědi a jsou logicky správné",
        prompt: `Zkontroluj nápovědy (help templates) všech podtémat v tématu "${selectedTopic}" (${selectedCategory}, ${selectedSubject}): 1) Neprozrazují odpověď? 2) Jsou kroky logické? 3) Jsou vizuální příklady srozumitelné? 4) Jsou časté chyby reálné? Navrhni vylepšení.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        label: "Doplň vizuální příklady",
        description: "Vytvoří nebo vylepší názorné ilustrace (emoji/ASCII) pro žáky",
        prompt: `Navrhni nebo vylepši vizuální příklady (emoji diagramy, ASCII ilustrace) pro všechna podtémata v tématu "${selectedTopic}" (${selectedCategory}, ${selectedSubject}). Příklady musí být názorné a srozumitelné pro žáky${gradeCtx}.`,
        icon: <Wand2 className="h-4 w-4" />,
      },
    ];
  }

  if (level === "detail" && selectedSkill) {
    return [
      {
        label: "Vylepši nápovědu",
        description: "Přepíše hint, kroky a příklad tak, aby lépe vedly k pochopení",
        prompt: `Vylepši nápovědu pro podtéma "${selectedSkill.title}" (${selectedSkill.id}): Současná nápověda: hint="${selectedSkill.helpTemplate?.hint || "chybí"}", kroky: ${JSON.stringify(selectedSkill.helpTemplate?.steps || [])}, příklad: "${selectedSkill.helpTemplate?.example || "chybí"}", častá chyba: "${selectedSkill.helpTemplate?.commonMistake || "chybí"}". Navrhni lepší verzi, která je pedagogicky správná a neprozrazuje odpověď.`,
        icon: <Lightbulb className="h-4 w-4" />,
      },
      {
        label: "Přepiš jednodušeji",
        description: "Zjednoduší popis a cíle tak, aby jim rozuměl žák daného ročníku",
        prompt: `Přepiš popis, cíle a nápovědu podtématu "${selectedSkill.title}" jednodušeji a srozumitelněji pro žáky ${selectedSkill.gradeRange[0]}. ročníku. Současný popis: "${selectedSkill.briefDescription}". Cíle: ${JSON.stringify(selectedSkill.goals)}.`,
        icon: <RefreshCw className="h-4 w-4" />,
      },
      {
        label: "Zkontroluj hranice",
        description: "Ověří, že rozsah dovednosti odpovídá ročníku a není v rozporu s cíli",
        prompt: `Zkontroluj hranice (boundaries) podtématu "${selectedSkill.title}": ${JSON.stringify(selectedSkill.boundaries)}. 1) Jsou kompletní? 2) Nejsou příliš restriktivní? 3) Odpovídají ročníkovým požadavkům (${selectedSkill.gradeRange[0]}.–${selectedSkill.gradeRange[1]}. ročník)? 4) Nejsou v rozporu s cíli: ${JSON.stringify(selectedSkill.goals)}? Navrhni opravy.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        label: "Doplň vizuální příklady",
        description: "Vytvoří názorné ilustrace, které pomůžou žákům pochopit podstatu",
        prompt: `Navrhni vizuální příklady (visualExamples) pro podtéma "${selectedSkill.title}" (${selectedSkill.id}). Příklady musí obsahovat: label (název), illustration (emoji/ASCII diagram), conclusion (závěr). Musí být názorné pro ${selectedSkill.gradeRange[0]}. ročník a ilustrovat podstatu podtématu.`,
        icon: <Wand2 className="h-4 w-4" />,
      },
    ];
  }

  return [];
}

export function AdminAIActions(props: AdminAIActionsProps) {
  const actions = getActions(props);

  if (actions.length === 0) return null;

  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">AI asistent navrhuje</span>
        </div>
        <TooltipProvider delayDuration={300}>
          <div className="flex flex-wrap gap-2">
            {actions.map((action, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={action.variant || "outline"}
                    className="gap-1.5 text-xs h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onAction(action.prompt);
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" collisionPadding={16} className="max-w-md text-xs">
                  <p className="font-medium mb-1">{action.description}</p>
                  <p className="text-muted-foreground line-clamp-5">{action.prompt}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
