import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sparkles, MessageSquare, Wand2, Search, PlusCircle, BookOpen,
} from "lucide-react";
import type { Grade } from "@/lib/types";

type WizardTask = "create" | "check" | "fill_gaps" | "custom";

interface TaskOption {
  value: WizardTask;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TASKS: TaskOption[] = [
  {
    value: "create",
    label: "Vytvořit nový obsah",
    description: "Navrhne kompletní strukturu (okruhy, témata, dovednosti) od nuly",
    icon: <PlusCircle className="h-4 w-4" />,
  },
  {
    value: "check",
    label: "Zkontrolovat existující",
    description: "Prověří konzistenci, nápovědy, hranice a cíle stávajícího obsahu",
    icon: <Search className="h-4 w-4" />,
  },
  {
    value: "fill_gaps",
    label: "Doplnit chybějící témata",
    description: "Porovná obsah s RVP a navrhne, co chybí",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    value: "custom",
    label: "Vlastní instrukce",
    description: "Napište vlastní požadavek pro AI",
    icon: <Wand2 className="h-4 w-4" />,
  },
];

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];


interface CurriculumWizardProps {
  /** Pre-filled from dashboard context */
  currentGrade: Grade | null;
  currentSubject: string | null;
  currentCategory: string | null;
  currentTopic: string | null;
  /** Available subjects from the dashboard */
  availableSubjects?: string[];
  onGenerate: (prompt: string) => void;
  onSwitchToChat: () => void;
}

function buildPrompt(
  task: WizardTask,
  grade: Grade | null,
  subject: string | null,
  category: string | null,
  topic: string | null,
  customText: string,
): string {
  const gradeCtx = grade ? `pro ${grade}. ročník` : "";
  const subjectCtx = subject ? `předmětu "${subject}"` : "";
  const categoryCtx = category ? `, okruh "${category}"` : "";
  const topicCtx = topic ? `, téma "${topic}"` : "";
  const context = [subjectCtx, categoryCtx, topicCtx].filter(Boolean).join("");

  switch (task) {
    case "create":
      if (!subject) {
        return `Navrhni kompletní strukturu kurikula ${gradeCtx}. Zahrň předměty, okruhy, témata a dovednosti s nápovědami, cíli a hranicemi.`;
      }
      if (topic) {
        return `Pro ${context} ${gradeCtx}: Navrhni nová podtémata (skills) s názvy, popisy, cíli, hranicemi, klíčovými slovy a kompletní nápovědou (hint, kroky, příklad, častá chyba, vizuální příklady).`;
      }
      if (category) {
        return `Pro ${context} ${gradeCtx}: Navrhni chybějící témata a dovednosti, které by měly být zahrnuty podle RVP. Zahrň popis a odůvodnění.`;
      }
      return `Navrhni kompletní strukturu ${context} ${gradeCtx}. Zahrň okruhy, témata a dovednosti s nápovědami, cíli a hranicemi.`;

    case "check":
      return `Zkontroluj konzistenci ${context || "celého kurikula"} ${gradeCtx}: 1) Jsou cíle dovedností jasné a nepřekrývají se? 2) Odpovídají hranice ročníkovým požadavkům? 3) Jsou nápovědy pedagogicky správné a neprozrazují odpovědi? 4) Jsou úvodní motivační texty věkově přiměřené?`;

    case "fill_gaps":
      return `Analyzuj ${context || "existující kurikulum"} ${gradeCtx} a identifikuj: 1) Chybějící okruhy nebo témata oproti RVP 2) Dovednosti bez nápověd 3) Nekonzistentní hranice nebo cíle 4) Chybějící pokrytí. Vypiš konkrétní problémy a navrhni opravy.`;

    case "custom":
      return customText.trim();

    default:
      return customText.trim();
  }
}

export function CurriculumWizard({
  currentGrade,
  currentSubject,
  currentCategory,
  currentTopic,
  availableSubjects,
  onGenerate,
  onSwitchToChat,
}: CurriculumWizardProps) {
  const [grade, setGrade] = useState<Grade | null>(currentGrade);
  const [subject, setSubject] = useState<string | null>(currentSubject);
  const [task, setTask] = useState<WizardTask>("create");
  const [customText, setCustomText] = useState("");
  // Předměty z DB — filtrované podle ročníku (přes skills.grade_min/max)
  const [allSubjects, setAllSubjects] = useState<string[]>([]);
  useEffect(() => {
    if (grade) {
      // Pouze předměty, které mají alespoň jedno skill pro daný ročník
      supabase
        .from("curriculum_skills")
        .select(`
          curriculum_topics (
            curriculum_categories (
              curriculum_subjects ( name )
            )
          )
        `)
        .lte("grade_min", grade)
        .gte("grade_max", grade)
        .then(({ data }) => {
          if (!data) return;
          const names = new Set<string>();
          for (const skill of data) {
            const subjectName = (skill as any)
              .curriculum_topics?.curriculum_categories?.curriculum_subjects?.name;
            if (subjectName) names.add(subjectName.toLowerCase());
          }
          setAllSubjects([...names].sort());
        });
    } else {
      // Bez ročníku — všechny předměty z DB
      supabase.from("curriculum_subjects").select("name").then(({ data }) => {
        if (data) setAllSubjects(data.map(s => s.name.toLowerCase()).sort());
      });
    }
  }, [grade]);

  const missingSubjects: string[] = []; // RVP analýza odstraněna — žádné "chybějící" předměty

  // Reset subject if not available in new grade
  const handleGradeChange = (v: string) => {
    const newGrade = v === "all" ? null : (parseInt(v) as Grade);
    setGrade(newGrade);
    // Neresettujeme subject — DB předměty jsou dostupné pro všechny ročníky
  };

  const canGenerate = task === "custom" ? customText.trim().length > 0 : true;

  const handleGenerate = () => {
    const prompt = buildPrompt(task, grade, subject, currentCategory, currentTopic, customText);
    if (prompt) onGenerate(prompt);
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Co chcete udělat?
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Vyberte parametry a AI navrhne strukturu kurikula
        </p>
      </div>

      {/* Context badges */}
      {(currentCategory || currentTopic) && (
        <div className="flex flex-wrap gap-1.5">
          {currentCategory && (
            <Badge variant="outline" className="text-xs">
              📂 {currentCategory}
            </Badge>
          )}
          {currentTopic && (
            <Badge variant="outline" className="text-xs">
              📄 {currentTopic}
            </Badge>
          )}
        </div>
      )}

      {/* Grade + Subject row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Ročník</Label>
          <Select
            value={grade?.toString() || "all"}
            onValueChange={handleGradeChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Vše" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny ročníky</SelectItem>
              {GRADES.map((g) => (
                <SelectItem key={g} value={g.toString()}>
                  {g}. ročník
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Předmět</Label>
          {/* Chybějící předmět vybraný přes pill — zobrazíme chip místo dropdownu */}
          {subject && missingSubjects.includes(subject) ? (
            <div className="h-9 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3">
              <span className="text-sm font-medium text-amber-800 flex-1 truncate">
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
                <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-200 text-amber-700 rounded px-1 py-0.5">nový</span>
              </span>
              <button
                onClick={() => { setSubject(null); setTask("create"); }}
                className="text-amber-500 hover:text-amber-800 transition-colors shrink-0"
                title="Zrušit výběr"
              >
                ✕
              </button>
            </div>
          ) : (
            <Select
              value={subject || "all"}
              onValueChange={(v) => setSubject(v === "all" ? null : v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Vše" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechny předměty</SelectItem>
                {allSubjects.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Rychlá akce: Generovat předměty */}
      {!subject && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 space-y-2">
          <p className="text-[11px] font-semibold text-primary">
            🎯 Rychlá akce
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 font-medium"
            onClick={() => {
              const gradeCtx = grade ? `pro ${grade}. ročník` : "pro základní školu (3.–9. ročník)";
              onGenerate(
                `Navrhni seznam předmětů ${gradeCtx} dle RVP ZŠ. ` +
                `Navrhni POUZE předměty (type: "subject", action: "create") — BEZ okruhů, BEZ témat, BEZ podtémat. ` +
                `Pro každý předmět pouze: name (česky s diakritikou) a slug (lowercase bez diakritiky, pomlčky místo mezer). ` +
                `Odpověz pouze JSON blokem s proposals, žádná další struktura.`
              );
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Generovat předměty{grade ? ` pro ${grade}. ročník` : ""}
          </Button>
        </div>
      )}

      {/* Task selection */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Úkol</Label>
        {/* Pokud je vybrán chybějící předmět, jen "Vytvořit" dává smysl */}
        {subject && missingSubjects.includes(subject) && (
          <p className="text-[11px] text-amber-600 flex items-center gap-1">
            ⚠ Pro nový předmět je dostupná pouze možnost „Vytvořit nový obsah".
          </p>
        )}
        <RadioGroup
          value={task}
          onValueChange={(v) => setTask(v as WizardTask)}
          className="space-y-2"
        >
          {TASKS.map((t) => {
            const isMissingSubject = !!(subject && missingSubjects.includes(subject));
            const isDisabled = isMissingSubject && t.value !== "create";
            return (
              <label
                key={t.value}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  isDisabled
                    ? "border-border/40 bg-muted/30 opacity-40 cursor-not-allowed"
                    : task === t.value
                    ? "border-primary bg-primary/5 cursor-pointer"
                    : "border-border hover:bg-accent/50 cursor-pointer"
                }`}
              >
                <RadioGroupItem value={t.value} className="mt-0.5" disabled={isDisabled} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {t.icon}
                    <span className="text-sm font-medium text-foreground">
                      {t.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.description}
                  </p>
                </div>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      {/* Custom textarea */}
      {task === "custom" && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Vaše instrukce</Label>
          <Textarea
            placeholder="Popište, co chcete vytvořit nebo upravit..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      )}

      {/* Optional refinement for non-custom tasks */}
      {task !== "custom" && (
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Upřesnění <span className="text-muted-foreground/60">(volitelné)</span>
          </Label>
          <Textarea
            placeholder="Např. zaměř se na zlomky, přidej víc vizuálních příkladů..."
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>
      )}

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className="w-full gap-2"
        size="lg"
      >
        <Sparkles className="h-4 w-4" />
        Generovat návrh
      </Button>

      {/* Separator + switch to chat */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">nebo</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSwitchToChat}
        className="gap-1.5 text-muted-foreground"
      >
        <MessageSquare className="h-4 w-4" />
        Přepnout na volný chat
      </Button>
    </div>
  );
}
