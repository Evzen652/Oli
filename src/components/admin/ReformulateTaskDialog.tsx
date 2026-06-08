import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Check, Wand2 } from "lucide-react";
import { callAi } from "@/lib/aiClient";
import type { PracticeTask, TopicMetadata } from "@/lib/types";

// ── Types ────────────────────────────────────────────────────────────────────

export type ReformField = "question" | "correctAnswer" | "hints" | "options" | "solutionSteps";

interface StyleOption {
  key: string;
  label: string;
  description: string;
}

interface FieldDef {
  label: string;
  emoji: string;
  styles: StyleOption[];
  buildPrompt: (task: PracticeTask, skill: TopicMetadata, style: string) => string;
  parseVariants: (raw: string) => unknown[];
}

// ── Field definitions ────────────────────────────────────────────────────────

const FIELDS: Record<ReformField, FieldDef> = {
  question: {
    label: "Otázka",
    emoji: "❓",
    styles: [
      { key: "simpler",  label: "Jednodušeji",      description: "Kratší věty, jednodušší slova" },
      { key: "context",  label: "Jiný kontext",      description: "Stejná látka, jiný životní příklad" },
      { key: "shorter",  label: "Kratčeji",          description: "Minimum slov, přímá otázka" },
      { key: "harder",   label: "Náročněji",         description: "Složitější formulace" },
    ],
    buildPrompt(task, skill, style) {
      const styleMap: Record<string, string> = {
        simpler: "použij jednodušší jazyk vhodný pro daný ročník, kratší věty",
        context: "zachovej stejnou látku, ale změň životní kontext nebo příklad",
        shorter: "zkrať na minimum slov, zachovej smysl",
        harder:  "formuluj náročněji, přidej složitější kontext",
      };
      return `Jsi expert na tvorbu vzdělávacího obsahu pro ZŠ v ČR. Odpověz POUZE validním JSON.

Předmět: ${skill.subject}, Ročník: ${skill.gradeRange[0]}, Téma: ${skill.topic}
Otázka: ${task.question}
Správná odpověď: ${task.correctAnswer}
${task.options ? `Možnosti: ${task.options.join(", ")}` : ""}

Navrhni 3 různé přeformulace POUZE otázky. Styl: ${styleMap[style] ?? style}
Správná odpověď musí zůstat: "${task.correctAnswer}"
Vrať: {"variants":["varianta1","varianta2","varianta3"]}`;
    },
    parseVariants(raw) {
      try { const m = raw.match(/\{[\s\S]*\}/); return m ? (JSON.parse(m[0]).variants ?? []) : []; }
      catch { return []; }
    },
  },

  correctAnswer: {
    label: "Správná odpověď",
    emoji: "✅",
    styles: [
      { key: "shorter",  label: "Stručnější",        description: "Jen nejdůležitější slova" },
      { key: "example",  label: "S příkladem",       description: "Přidá konkrétní číslo nebo příklad" },
      { key: "causal",   label: "Proč? (kauzální)",  description: "Vysvětlí příčinu nebo důvod" },
    ],
    buildPrompt(task, skill, style) {
      const styleMap: Record<string, string> = {
        shorter: "zkrať na nejdůležitější slova",
        example: "přidej konkrétní příklad nebo číslo",
        causal:  "stručně vysvětli proč je to správná odpověď",
      };
      return `Jsi expert na tvorbu vzdělávacího obsahu pro ZŠ v ČR. Odpověz POUZE validním JSON.

Předmět: ${skill.subject}, Ročník: ${skill.gradeRange[0]}, Téma: ${skill.topic}
Otázka: ${task.question}
Správná odpověď: ${task.correctAnswer}

Navrhni 3 různé přeformulace POUZE správné odpovědi. Styl: ${styleMap[style] ?? style}
Vrať: {"variants":["varianta1","varianta2","varianta3"]}`;
    },
    parseVariants(raw) {
      try { const m = raw.match(/\{[\s\S]*\}/); return m ? (JSON.parse(m[0]).variants ?? []) : []; }
      catch { return []; }
    },
  },

  hints: {
    label: "Nápověda",
    emoji: "💡",
    styles: [
      { key: "strategic", label: "Strategická",     description: "Vede k uvažování, NEnáznačuje odpověď" },
      { key: "analogy",   label: "Analogie",        description: "Příklad ze života žáka" },
      { key: "steps",     label: "Krok za krokem",  description: "Dílčí kroky od obecného ke konkrétnímu" },
    ],
    buildPrompt(task, skill, style) {
      const styleMap: Record<string, string> = {
        strategic: "nápovědy vedou k uvažování, NIKDY neodhalují odpověď, formulace 'Zkus si promyslet...', 'Co víš o...'",
        analogy:   "každá nápověda = analogie nebo příklad ze každodenního života žáka",
        steps:     "dílčí kroky vedoucí k řešení, od obecného ke konkrétnímu",
      };
      return `Jsi expert na tvorbu vzdělávacího obsahu pro ZŠ v ČR. Odpověz POUZE validním JSON.

Předmět: ${skill.subject}, Ročník: ${skill.gradeRange[0]}, Téma: ${skill.topic}
Otázka: ${task.question}
Správná odpověď: ${task.correctAnswer}
${task.hints?.length ? `Aktuální nápovědy: ${task.hints.join(" | ")}` : ""}

Vytvoř 3 různé sety po 2 nápovědách. Styl: ${styleMap[style] ?? style}
NIKDY neodhaluj správnou odpověď přímo.
Vrať: {"variants":[["h1a","h1b"],["h2a","h2b"],["h3a","h3b"]]}`;
    },
    parseVariants(raw) {
      try { const m = raw.match(/\{[\s\S]*\}/); return m ? (JSON.parse(m[0]).variants ?? []) : []; }
      catch { return []; }
    },
  },

  options: {
    label: "Možnosti odpovědí",
    emoji: "🔤",
    styles: [
      { key: "better",   label: "Lepší distraktorové", description: "Míří na typické chyby žáků" },
      { key: "harder",   label: "Obtížnější",           description: "Odpovědi podobnější, žák musí přemýšlet" },
      { key: "simpler",  label: "Jednodušší",           description: "Zřetelnější špatné odpovědi" },
    ],
    buildPrompt(task, skill, style) {
      const styleMap: Record<string, string> = {
        better:  "špatné odpovědi míří na typické chyby a miskoncepce žáků daného ročníku",
        harder:  "špatné odpovědi jsou si podobnější, žák musí přemýšlet",
        simpler: "špatné odpovědi jsou zřetelnější, vhodné pro slabší žáky",
      };
      return `Jsi expert na tvorbu vzdělávacího obsahu pro ZŠ v ČR. Odpověz POUZE validním JSON.

Předmět: ${skill.subject}, Ročník: ${skill.gradeRange[0]}, Téma: ${skill.topic}
Otázka: ${task.question}
Správná odpověď: ${task.correctAnswer}
${task.options ? `Aktuální možnosti: ${task.options.join(", ")}` : ""}

Vytvoř 3 různé sety možností odpovědí (každý set = 4 možnosti). Styl: ${styleMap[style] ?? style}
Správná odpověď MUSÍ být vždy "${task.correctAnswer}" jako jedna z možností.
Vrať: {"variants":[["a","b","c","d"],["e","f","g","h"],["i","j","k","l"]]}`;
    },
    parseVariants(raw) {
      try { const m = raw.match(/\{[\s\S]*\}/); return m ? (JSON.parse(m[0]).variants ?? []) : []; }
      catch { return []; }
    },
  },

  solutionSteps: {
    label: "Postup řešení",
    emoji: "📋",
    styles: [
      { key: "shorter",  label: "Stručnější",          description: "Méně kroků, jen to podstatné" },
      { key: "detailed", label: "Podrobnější",          description: "Více kroků, vysvětlí každý detail" },
      { key: "age",      label: "Věkově přiměřenější",  description: "Jednodušší jazyk pro daný ročník" },
      { key: "causal",   label: "Kauzální (proč)",      description: "Každý krok vysvětlí příčinu nebo důvod" },
    ],
    buildPrompt(task, skill, style) {
      const styleMap: Record<string, string> = {
        shorter:  "méně kroků (max 3), jen nejdůležitější, přímé instrukce",
        detailed: "více kroků (4–6), každý krok je podrobně popsán",
        age:      "jednoduchý jazyk vhodný pro žáka " + skill.gradeRange[0] + ". třídy, žádné složité termíny",
        causal:   "každý krok vysvětlí PROČ je daná akce nutná, kauzální vazby",
      };
      const current = task.solutionSteps?.length
        ? `Aktuální postup: ${task.solutionSteps.join(" | ")}`
        : "";
      return `Jsi expert na tvorbu vzdělávacího obsahu pro ZŠ v ČR. Odpověz POUZE validním JSON.

Předmět: ${skill.subject}, Ročník: ${skill.gradeRange[0]}, Téma: ${skill.topic}
Otázka: ${task.question}
Správná odpověď: ${task.correctAnswer}
${current}

Vytvoř 3 různé sety kroků postupu řešení. Styl: ${styleMap[style] ?? style}
Každý set = pole stringů, každý string = jeden krok.
Vrať: {"variants":[["krok1","krok2"],["krok1","krok2","krok3"],["krok1","krok2"]]}`;
    },
    parseVariants(raw) {
      try { const m = raw.match(/\{[\s\S]*\}/); return m ? (JSON.parse(m[0]).variants ?? []) : []; }
      catch { return []; }
    },
  },
};

// ── OriginalExercisePanel ─────────────────────────────────────────────────────

function OriginalExercisePanel({
  task,
  activeField,
  help,
}: {
  task: PracticeTask;
  activeField: ReformField;
  help?: { hint?: string; steps?: string[] };
}) {
  const hl = (field: ReformField) =>
    field === activeField
      ? "border-purple-400 bg-purple-50/80 ring-1 ring-purple-300"
      : "border-border/50 bg-muted/20";

  return (
    <div className="space-y-2.5">
      {/* Question */}
      <div className={`rounded-xl p-3 border-2 transition-all ${hl("question")}`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">❓ Otázka</p>
        <p className="text-sm font-medium leading-snug">{task.question}</p>
      </div>

      {/* Correct answer — jen pokud task nemá options (jinak je označená v mřížce) */}
      {(!task.options || task.options.length === 0) && (
        <div className={`rounded-xl p-3 border-2 transition-all ${hl("correctAnswer")}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">✅ Správná odpověď</p>
          <p className="text-sm font-semibold text-emerald-700">✓ {task.correctAnswer}</p>
        </div>
      )}

      {/* Options */}
      {task.options && task.options.length > 0 && (
        <div className={`rounded-xl p-3 border-2 transition-all ${hl("options")}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">🔤 Možnosti odpovědí</p>
          <div className="grid grid-cols-2 gap-1.5">
            {task.options.map((opt, i) => (
              <div
                key={i}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium ${
                  opt === task.correctAnswer
                    ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                    : "border-border/60 text-foreground/70"
                }`}
              >
                {opt === task.correctAnswer && <Check className="inline h-3 w-3 mr-0.5 text-emerald-600" />}
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {task.hints && task.hints.length > 0 && (
        <div className={`rounded-xl p-3 border-2 transition-all ${hl("hints")}`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">💡 Nápovědy</p>
          <ol className="text-xs space-y-1 list-decimal list-inside text-foreground/80">
            {task.hints.map((h, i) => <li key={i}>{h}</li>)}
          </ol>
        </div>
      )}

      {/* Solution steps — task.solutionSteps, fallback na help.hint + help.steps */}
      {(() => {
        const steps = task.solutionSteps?.length ? task.solutionSteps
          : help?.steps?.length ? help.steps
          : help?.hint ? [help.hint]
          : null;
        if (!steps) return null;
        return (
          <div className={`rounded-xl p-3 border-2 transition-all ${hl("solutionSteps")}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">📋 Postup řešení</p>
            <ol className="text-xs space-y-1 list-decimal list-inside text-foreground/80">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        );
      })()}

      {/* Items (drag_order) */}
      {task.items && task.items.length > 0 && (
        <div className="rounded-xl p-3 border-2 border-border/50 bg-muted/20">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Správné pořadí</p>
          <ol className="text-xs space-y-0.5 list-decimal list-inside text-foreground/80">
            {task.items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        </div>
      )}
    </div>
  );
}

// ── VariantCard ───────────────────────────────────────────────────────────────

function VariantCard({
  field,
  variant,
  correctAnswer,
  onApply,
}: {
  field: ReformField;
  variant: unknown;
  correctAnswer: string;
  onApply: () => void;
}) {
  const content = (() => {
    if (field === "hints" || field === "solutionSteps") {
      const items = variant as string[];
      return (
        <ol className="text-sm space-y-1 list-decimal list-inside text-foreground/85">
          {items.map((h, i) => <li key={i}>{h}</li>)}
        </ol>
      );
    }
    if (field === "options") {
      const opts = variant as string[];
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {opts.map((opt, i) => (
            <div key={i} className={`rounded-lg border px-2 py-1.5 text-xs font-medium ${
              opt === correctAnswer
                ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                : "border-border text-foreground/70"
            }`}>
              {opt === correctAnswer && <Check className="inline h-3 w-3 mr-0.5 text-emerald-600" />}
              {opt}
            </div>
          ))}
        </div>
      );
    }
    return (
      <p className="text-sm text-foreground leading-snug">
        {field === "correctAnswer" && <span className="text-emerald-600 font-medium">✓ </span>}
        {String(variant)}
      </p>
    );
  })();

  return (
    <div
      onClick={onApply}
      className="rounded-xl border border-border/60 bg-card p-3 space-y-2.5 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
    >
      {content}
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Check className="h-3 w-3" /> Použít
        </span>
      </div>
    </div>
  );
}

// ── ReformulateTaskDialog ─────────────────────────────────────────────────────

export function ReformulateTaskDialog({
  task,
  skill,
  help,
  open,
  initialField,
  onApply,
  onClose,
}: {
  task: PracticeTask;
  skill: TopicMetadata;
  help?: TopicMetadata["helpTemplate"];
  open: boolean;
  initialField?: ReformField;
  onApply: (field: ReformField, value: unknown) => void;
  onClose: () => void;
}) {
  const [activeField, setActiveField] = useState<ReformField>(initialField ?? "question");
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fieldDef = FIELDS[activeField];

  // Pro solutionSteps: pokud task nemá vlastní kroky, doplníme z helpTemplate
  const effectiveTask: PracticeTask = (() => {
    if (activeField === "solutionSteps" && !task.solutionSteps?.length && help) {
      const fallbackSteps = help.steps?.length ? help.steps : help.hint ? [help.hint] : [];
      return { ...task, solutionSteps: fallbackSteps };
    }
    return task;
  })();

  const handleStyleClick = async (styleKey: string) => {
    setActiveStyle(styleKey);
    setVariants([]);
    setError(null);
    setLoading(true);
    try {
      const prompt = fieldDef.buildPrompt(effectiveTask, skill, styleKey);
      const raw = await callAi(
        [
          { role: "system", content: "Jsi expert na tvorbu vzdělávacího obsahu. Odpovídáš POUZE validním JSON." },
          { role: "user", content: prompt },
        ],
        { maxTokens: 600, temperature: 0.85, timeoutMs: 15000 }
      );
      const parsed = fieldDef.parseVariants(raw);
      if (parsed.length === 0) throw new Error("Nepodařilo se načíst varianty.");
      setVariants(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba při generování.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (f: ReformField) => {
    setActiveField(f);
    setActiveStyle(null);
    setVariants([]);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-full h-[88vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Wand2 className="h-4 w-4 text-purple-500" />
            Přeformulovat cvičení
            <span className="text-xs font-normal text-muted-foreground ml-1">
              {skill.subject} · {skill.gradeRange[0]}. ročník · {skill.topic}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Two-column body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT — original exercise (sticky, scrollable internally) */}
          <div className="w-72 shrink-0 border-r bg-muted/10 p-4 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Původní cvičení
            </p>
            <OriginalExercisePanel task={task} activeField={activeField} help={help} />
          </div>

          {/* RIGHT — controls + variants */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">

            {/* Field selector */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Co chceš přeformulovat?
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.entries(FIELDS) as [ReformField, FieldDef][]).map(([key, def]) => (
                  <button
                    key={key}
                    onClick={() => handleFieldChange(key)}
                    className={`rounded-xl border px-2 py-2 text-center transition-all ${
                      activeField === key
                        ? "border-purple-400 bg-purple-50 text-purple-800"
                        : "border-border hover:border-purple-200 hover:bg-purple-50/40 text-foreground/70"
                    }`}
                  >
                    <span className="block text-lg mb-0.5">{def.emoji}</span>
                    <span className="text-[11px] font-medium leading-tight">{def.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Style selector */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Jak přeformulovat?
              </p>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {fieldDef.styles.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleStyleClick(s.key)}
                    disabled={loading}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-all disabled:opacity-50 ${
                      activeStyle === s.key
                        ? "border-purple-400 bg-purple-50"
                        : "border-border hover:border-purple-200 hover:bg-purple-50/40"
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center gap-2 py-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">AI generuje varianty…</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Variants */}
            {variants.length > 0 && !loading && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Vyber variantu — kliknutím ji aplikuješ na cvičení
                </p>
                <div className="space-y-2">
                  {variants.map((v, i) => (
                    <VariantCard
                      key={i}
                      field={activeField}
                      variant={v}
                      correctAnswer={task.correctAnswer}
                      onApply={() => {
                        onApply(activeField, v);
                        onClose();
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── ReformulateButtons ────────────────────────────────────────────────────────

export function ReformulateButtons({
  task,
  skill,
  help,
  onApply,
}: {
  task: PracticeTask;
  skill: TopicMetadata;
  help?: TopicMetadata["helpTemplate"];
  onApply: (field: ReformField, value: unknown) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="pt-0.5">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-purple-300 bg-purple-50/60 px-3 py-1 text-[11px] font-medium text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-colors"
        >
          <Wand2 className="h-3 w-3" />
          Přeformulovat
        </button>
      </div>

      <ReformulateTaskDialog
        task={task}
        skill={skill}
        help={help}
        open={open}

        onApply={onApply}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
