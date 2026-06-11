import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Save, X, Check, Trash2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TopicMetadata } from "@/lib/types";
import type { ExerciseVariant } from "./ExerciseTab";

type FormInputType = "select_one" | "true_false" | "fill_blank" | "short_answer" | "match_pairs" | "multi_select";

const INPUT_TYPE_LABELS: Record<FormInputType, string> = {
  select_one:   "Výběr jedné odpovědi (A/B/C/D)",
  true_false:   "Pravda / Nepravda",
  fill_blank:   "Doplň do věty (___)",
  short_answer: "Krátká volná odpověď",
  match_pairs:  "Spoj páry (levá ↔ pravá)",
  multi_select: "Vyber vše správné (více odpovědí)",
};

// ──────────────────────────────────────────────────────────
// Shared subcomponents
// ──────────────────────────────────────────────────────────

function HintsFields({ hints, onChange }: {
  hints: string[];
  onChange: (hints: string[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        Nápovědy
        <span className="text-muted-foreground font-normal ml-1">(nepovinné)</span>
      </Label>
      <div className="space-y-2">
        {hints.map((h, i) => (
          <Input
            key={i}
            value={h}
            onChange={e => {
              const next = [...hints];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={
              i === 0
                ? "Nápověda 1 — navede směr, neprozradí odpověď…"
                : "Nápověda 2 — konkrétnější krok…"
            }
          />
        ))}
      </div>
    </div>
  );
}

function ExplanationField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>
        Vysvětlení
        <span className="text-muted-foreground font-normal ml-1">(nepovinné)</span>
      </Label>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Proč je tato odpověď správná…"
        className="min-h-[60px] resize-none"
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// match_pairs editor
// ──────────────────────────────────────────────────────────

type Pair = { left: string; right: string };

function MatchPairsEditor({ pairs, onChange }: {
  pairs: Pair[];
  onChange: (pairs: Pair[]) => void;
}) {
  const update = (i: number, side: "left" | "right", val: string) => {
    const next = pairs.map((p, idx) => idx === i ? { ...p, [side]: val } : p);
    onChange(next);
  };
  const remove = (i: number) => onChange(pairs.filter((_, idx) => idx !== i));
  const add = () => onChange([...pairs, { left: "", right: "" }]);

  return (
    <div className="space-y-1.5">
      <Label>
        Páry
        <span className="text-muted-foreground font-normal ml-1">(min. 3, max. 8)</span>
      </Label>
      <div className="space-y-2">
        {pairs.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={p.left}
              onChange={e => update(i, "left", e.target.value)}
              placeholder={`Levá strana ${i + 1}…`}
              className="flex-1"
            />
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              value={p.right}
              onChange={e => update(i, "right", e.target.value)}
              placeholder={`Pravá strana ${i + 1}…`}
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={pairs.length <= 3}
              onClick={() => remove(i)}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      {pairs.length < 8 && (
        <Button type="button" size="sm" variant="outline" onClick={add} className="gap-1.5 mt-1">
          <Plus className="h-3.5 w-3.5" /> Přidat pár
        </Button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// multi_select editor
// ──────────────────────────────────────────────────────────

type MultiOption = { text: string; correct: boolean };

function MultiSelectEditor({ options, onChange }: {
  options: MultiOption[];
  onChange: (options: MultiOption[]) => void;
}) {
  const updateText = (i: number, text: string) => {
    onChange(options.map((o, idx) => idx === i ? { ...o, text } : o));
  };
  const toggleCorrect = (i: number) => {
    onChange(options.map((o, idx) => idx === i ? { ...o, correct: !o.correct } : o));
  };
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  const add = () => onChange([...options, { text: "", correct: false }]);

  return (
    <div className="space-y-1.5">
      <Label>
        Možnosti
        <span className="text-muted-foreground font-normal ml-1">
          — klikni na tlačítko vpravo pro označení správné
        </span>
      </Label>
      <div className="space-y-2">
        {options.map((o, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={o.text}
              onChange={e => updateText(i, e.target.value)}
              placeholder={`Možnost ${i + 1}…`}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => toggleCorrect(i)}
              title={o.correct ? "Správná — klik odznačí" : "Nesprávná — klik označí jako správnou"}
              className={`shrink-0 h-8 w-8 rounded-md border-2 flex items-center justify-center transition-colors ${
                o.correct
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-border bg-background text-muted-foreground hover:border-emerald-300"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={options.length <= 2}
              onClick={() => remove(i)}
              className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
      {options.length < 8 && (
        <Button type="button" size="sm" variant="outline" onClick={add} className="gap-1.5 mt-1">
          <Plus className="h-3.5 w-3.5" /> Přidat možnost
        </Button>
      )}
      <p className="text-xs text-muted-foreground">
        Správné: {options.filter(o => o.correct).length} / {options.length}
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// CreateExerciseDialog
// ──────────────────────────────────────────────────────────

interface Props {
  skill: TopicMetadata;
  variant: ExerciseVariant;
  onSaved: () => void;
}

export function CreateExerciseDialog({ skill, variant, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [inputType, setInputType] = useState<FormInputType>("select_one");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [distractors, setDistractors] = useState(["", "", ""]);
  const [hints, setHints] = useState(["", ""]);
  const [explanation, setExplanation] = useState("");
  const [pairs, setPairs] = useState<Pair[]>([
    { left: "", right: "" },
    { left: "", right: "" },
    { left: "", right: "" },
  ]);
  const [multiOptions, setMultiOptions] = useState<MultiOption[]>([
    { text: "", correct: true },
    { text: "", correct: true },
    { text: "", correct: false },
    { text: "", correct: false },
  ]);

  const reset = () => {
    setInputType("select_one");
    setQuestion("");
    setCorrectAnswer("");
    setDistractors(["", "", ""]);
    setHints(["", ""]);
    setExplanation("");
    setPairs([{ left: "", right: "" }, { left: "", right: "" }, { left: "", right: "" }]);
    setMultiOptions([
      { text: "", correct: true },
      { text: "", correct: true },
      { text: "", correct: false },
      { text: "", correct: false },
    ]);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const validate = (): string | null => {
    if (!question.trim()) return "Zadej otázku.";
    if (inputType === "match_pairs") {
      const filledPairs = pairs.filter(p => p.left.trim() && p.right.trim());
      if (filledPairs.length < 3) return "Vyplň aspoň 3 páry.";
      const lefts = filledPairs.map(p => p.left.trim().toLowerCase());
      const rights = filledPairs.map(p => p.right.trim().toLowerCase());
      if (new Set(lefts).size !== lefts.length) return "Levé strany párů musí být unikátní.";
      if (new Set(rights).size !== rights.length) return "Pravé strany párů musí být unikátní.";
      return null;
    }
    if (inputType === "multi_select") {
      const filled = multiOptions.filter(o => o.text.trim());
      if (filled.length < 2) return "Vyplň aspoň 2 možnosti.";
      const correct = filled.filter(o => o.correct);
      if (correct.length < 1) return "Označ aspoň 1 správnou odpověď.";
      if (correct.length === filled.length) return "Aspoň jedna možnost musí být nesprávná.";
      return null;
    }
    if (!correctAnswer.trim()) return "Zadej správnou odpověď.";
    if (inputType === "select_one" && distractors.filter(d => d.trim()).length < 1) {
      return "Přidej aspoň 1 nesprávnou možnost.";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast({ description: err, variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let row: Record<string, unknown>;

      if (inputType === "match_pairs") {
        const filledPairs = pairs.filter(p => p.left.trim() && p.right.trim());
        row = {
          skill_id: skill.id,
          question: question.trim(),
          correct_answer: "match",
          options: [],
          pairs: filledPairs,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
          source: variant,
          status: "pending",
        };
      } else if (inputType === "multi_select") {
        const filled = multiOptions.filter(o => o.text.trim());
        const correctOnes = filled.filter(o => o.correct).map(o => o.text.trim());
        row = {
          skill_id: skill.id,
          question: question.trim(),
          correct_answer: correctOnes.join(","),
          options: filled.map(o => o.text.trim()),
          correct_answers: correctOnes,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
          source: variant,
          status: "pending",
        };
      } else {
        const options =
          inputType === "select_one"
            ? shuffle([...distractors.filter(d => d.trim()), correctAnswer.trim()])
            : inputType === "true_false"
            ? ["Pravda", "Nepravda"]
            : [];
        row = {
          skill_id: skill.id,
          question: question.trim(),
          correct_answer: correctAnswer.trim(),
          options,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
          source: variant,
          status: "pending",
        };
      }

      const { error } = await (supabase as any).from("custom_exercises").insert(row);
      if (error) throw error;

      toast({ description: "Cvičení uloženo — schvalte v sekci níže ✓" });
      onSaved();
      handleClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Nepodařilo se uložit.";
      toast({ description: msg, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-1.5 border-dashed border-foreground/30 hover:border-foreground/60"
      >
        <Plus className="h-3.5 w-3.5" />
        Přidat cvičení ručně
      </Button>

      <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base">
              Nové cvičení — <span className="text-muted-foreground font-normal">{skill.studentTitle ?? skill.title}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-1">
            {/* Typ cvičení */}
            <div className="space-y-1.5">
              <Label>Typ cvičení</Label>
              <Select
                value={inputType}
                onValueChange={v => {
                  setInputType(v as FormInputType);
                  setCorrectAnswer("");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(INPUT_TYPE_LABELS) as [FormInputType, string][]).map(([k, label]) => (
                    <SelectItem key={k} value={k}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Otázka */}
            <div className="space-y-1.5">
              <Label>Otázka</Label>
              {inputType === "fill_blank" && (
                <p className="text-xs text-muted-foreground">
                  Použij <code className="bg-muted px-1 rounded">___</code> (podtržítka) jako místo k doplnění.
                </p>
              )}
              <Textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder={
                  inputType === "fill_blank"
                    ? "Pes je ___ zvíře."
                    : inputType === "match_pairs"
                    ? "Spoj hlavní města s jejich státem."
                    : inputType === "multi_select"
                    ? "Která z následujících zvířat jsou savci?"
                    : "Napiš otázku…"
                }
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* match_pairs editor */}
            {inputType === "match_pairs" && (
              <MatchPairsEditor pairs={pairs} onChange={setPairs} />
            )}

            {/* multi_select editor */}
            {inputType === "multi_select" && (
              <MultiSelectEditor options={multiOptions} onChange={setMultiOptions} />
            )}

            {/* Správná odpověď (pro ostatní typy) */}
            {inputType !== "match_pairs" && inputType !== "multi_select" && (
              <div className="space-y-1.5">
                <Label>Správná odpověď</Label>
                {inputType === "true_false" ? (
                  <div className="grid grid-cols-2 gap-2">
                    {["Pravda", "Nepravda"].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setCorrectAnswer(opt)}
                        className={`rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                          correctAnswer === opt
                            ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {correctAnswer === opt && <Check className="inline h-3.5 w-3.5 mr-1 text-emerald-600" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Input
                    value={correctAnswer}
                    onChange={e => setCorrectAnswer(e.target.value)}
                    placeholder="Správná odpověď…"
                  />
                )}
              </div>
            )}

            {/* Distraktory (select_one) */}
            {inputType === "select_one" && (
              <div className="space-y-1.5">
                <Label>
                  Nesprávné možnosti
                  <span className="text-muted-foreground font-normal ml-1">(distraktory — správná se přidá automaticky)</span>
                </Label>
                <div className="space-y-2">
                  {distractors.map((d, i) => (
                    <Input
                      key={i}
                      value={d}
                      onChange={e => {
                        const next = [...distractors];
                        next[i] = e.target.value;
                        setDistractors(next);
                      }}
                      placeholder={`Nesprávná možnost ${i + 1}…`}
                    />
                  ))}
                </div>
              </div>
            )}

            <HintsFields hints={hints} onChange={setHints} />
            <ExplanationField value={explanation} onChange={setExplanation} />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button variant="ghost" onClick={handleClose} disabled={saving}>
              <X className="h-4 w-4 mr-1" /> Zrušit
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-1.5">
              <Save className="h-4 w-4" />
              {saving ? "Ukládám…" : "Uložit do návrhů"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ──────────────────────────────────────────────────────────
// EditExerciseDialog — úprava již uloženého cvičení
// ──────────────────────────────────────────────────────────

function inferInputType(ex: {
  correct_answer: string;
  options?: string[];
  question: string;
  pairs?: Pair[];
  correct_answers?: string[];
}): FormInputType {
  if (Array.isArray(ex.pairs) && ex.pairs.length > 0) return "match_pairs";
  if (Array.isArray(ex.correct_answers) && ex.correct_answers.length > 0) return "multi_select";
  if (Array.isArray(ex.options) && ex.options.includes("Pravda") && ex.options.includes("Nepravda")) {
    return "true_false";
  }
  if (Array.isArray(ex.options) && ex.options.length >= 2) return "select_one";
  if (ex.question.includes("___")) return "fill_blank";
  return "short_answer";
}

interface EditProps {
  exercise: {
    id: string;
    question: string;
    correct_answer: string;
    options?: string[];
    hints?: string[];
    solution_steps?: string[];
    pairs?: Pair[];
    correct_answers?: string[];
  };
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}

export function EditExerciseDialog({ exercise, open, onOpenChange, onSaved }: EditProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [inputType, setInputType] = useState<FormInputType>(() => inferInputType(exercise));
  const [question, setQuestion] = useState(exercise.question);
  const [correctAnswer, setCorrectAnswer] = useState(exercise.correct_answer);
  const [distractors, setDistractors] = useState<string[]>(() => {
    const d = (exercise.options ?? []).filter(o => o !== exercise.correct_answer);
    return d.length >= 3 ? d : [...d, ...Array(3 - d.length).fill("")];
  });
  const [hints, setHints] = useState<string[]>(() => {
    const h = exercise.hints ?? [];
    return h.length >= 2 ? h : [...h, ...Array(2 - h.length).fill("")];
  });
  const [explanation, setExplanation] = useState(exercise.solution_steps?.[0] ?? "");
  const [pairs, setPairs] = useState<Pair[]>(() => {
    const p = exercise.pairs ?? [];
    return p.length >= 3 ? p : [...p, ...Array(Math.max(0, 3 - p.length)).fill({ left: "", right: "" })];
  });
  const [multiOptions, setMultiOptions] = useState<MultiOption[]>(() => {
    const correctSet = new Set(exercise.correct_answers ?? []);
    return (exercise.options ?? []).map(o => ({ text: o, correct: correctSet.has(o) }));
  });

  useEffect(() => {
    setInputType(inferInputType(exercise));
    setQuestion(exercise.question);
    setCorrectAnswer(exercise.correct_answer);
    const d = (exercise.options ?? []).filter(o => o !== exercise.correct_answer);
    setDistractors(d.length >= 3 ? d : [...d, ...Array(3 - d.length).fill("")]);
    const h = exercise.hints ?? [];
    setHints(h.length >= 2 ? h : [...h, ...Array(2 - h.length).fill("")]);
    setExplanation(exercise.solution_steps?.[0] ?? "");
    const p = exercise.pairs ?? [];
    setPairs(p.length >= 3 ? p : [...p, ...Array(Math.max(0, 3 - p.length)).fill({ left: "", right: "" })]);
    const correctSet = new Set(exercise.correct_answers ?? []);
    setMultiOptions((exercise.options ?? []).map(o => ({ text: o, correct: correctSet.has(o) })));
  }, [exercise.id]);

  const validate = (): string | null => {
    if (!question.trim()) return "Zadej otázku.";
    if (inputType === "match_pairs") {
      const filledPairs = pairs.filter(p => p.left.trim() && p.right.trim());
      if (filledPairs.length < 3) return "Vyplň aspoň 3 páry.";
      const lefts = filledPairs.map(p => p.left.trim().toLowerCase());
      const rights = filledPairs.map(p => p.right.trim().toLowerCase());
      if (new Set(lefts).size !== lefts.length) return "Levé strany párů musí být unikátní.";
      if (new Set(rights).size !== rights.length) return "Pravé strany párů musí být unikátní.";
      return null;
    }
    if (inputType === "multi_select") {
      const filled = multiOptions.filter(o => o.text.trim());
      if (filled.length < 2) return "Vyplň aspoň 2 možnosti.";
      const correct = filled.filter(o => o.correct);
      if (correct.length < 1) return "Označ aspoň 1 správnou odpověď.";
      if (correct.length === filled.length) return "Aspoň jedna možnost musí být nesprávná.";
      return null;
    }
    if (!correctAnswer.trim()) return "Zadej správnou odpověď.";
    if (inputType === "select_one" && distractors.filter(d => d.trim()).length < 1) {
      return "Přidej aspoň 1 nesprávnou možnost.";
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      toast({ description: err, variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let update: Record<string, unknown>;

      if (inputType === "match_pairs") {
        const filledPairs = pairs.filter(p => p.left.trim() && p.right.trim());
        update = {
          question: question.trim(),
          correct_answer: "match",
          options: [],
          pairs: filledPairs,
          correct_answers: null,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
        };
      } else if (inputType === "multi_select") {
        const filled = multiOptions.filter(o => o.text.trim());
        const correctOnes = filled.filter(o => o.correct).map(o => o.text.trim());
        update = {
          question: question.trim(),
          correct_answer: correctOnes.join(","),
          options: filled.map(o => o.text.trim()),
          correct_answers: correctOnes,
          pairs: null,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
        };
      } else {
        const options =
          inputType === "select_one"
            ? shuffle([...distractors.filter(d => d.trim()), correctAnswer.trim()])
            : inputType === "true_false"
            ? ["Pravda", "Nepravda"]
            : [];
        update = {
          question: question.trim(),
          correct_answer: correctAnswer.trim(),
          options,
          pairs: null,
          correct_answers: null,
          hints: hints.filter(h => h.trim()),
          solution_steps: explanation.trim() ? [explanation.trim()] : [],
        };
      }

      const { error } = await (supabase as any)
        .from("custom_exercises")
        .update(update)
        .eq("id", exercise.id);

      if (error) throw error;

      toast({ description: "Cvičení aktualizováno ✓" });
      onSaved();
      onOpenChange(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Nepodařilo se uložit.";
      toast({ description: msg, variant: "destructive" });
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onOpenChange(false); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Upravit cvičení</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <div className="space-y-1.5">
            <Label>Typ cvičení</Label>
            <Select
              value={inputType}
              onValueChange={v => {
                setInputType(v as FormInputType);
                setCorrectAnswer("");
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(INPUT_TYPE_LABELS) as [FormInputType, string][]).map(([k, label]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Otázka</Label>
            {inputType === "fill_blank" && (
              <p className="text-xs text-muted-foreground">
                Použij <code className="bg-muted px-1 rounded">___</code> jako místo k doplnění.
              </p>
            )}
            <Textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={
                inputType === "fill_blank"
                  ? "Pes je ___ zvíře."
                  : inputType === "match_pairs"
                  ? "Spoj hlavní města s jejich státem."
                  : inputType === "multi_select"
                  ? "Která z následujících zvířat jsou savci?"
                  : "Napiš otázku…"
              }
              className="min-h-[80px] resize-none"
            />
          </div>

          {inputType === "match_pairs" && (
            <MatchPairsEditor pairs={pairs} onChange={setPairs} />
          )}

          {inputType === "multi_select" && (
            <MultiSelectEditor options={multiOptions} onChange={setMultiOptions} />
          )}

          {inputType !== "match_pairs" && inputType !== "multi_select" && (
            <div className="space-y-1.5">
              <Label>Správná odpověď</Label>
              {inputType === "true_false" ? (
                <div className="grid grid-cols-2 gap-2">
                  {["Pravda", "Nepravda"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCorrectAnswer(opt)}
                      className={`rounded-lg border-2 py-2.5 text-sm font-medium transition-colors ${
                        correctAnswer === opt
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {correctAnswer === opt && <Check className="inline h-3.5 w-3.5 mr-1 text-emerald-600" />}
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <Input
                  value={correctAnswer}
                  onChange={e => setCorrectAnswer(e.target.value)}
                  placeholder="Správná odpověď…"
                />
              )}
            </div>
          )}

          {inputType === "select_one" && (
            <div className="space-y-1.5">
              <Label>
                Nesprávné možnosti
                <span className="text-muted-foreground font-normal ml-1">(distraktory)</span>
              </Label>
              <div className="space-y-2">
                {distractors.map((d, i) => (
                  <Input
                    key={i}
                    value={d}
                    onChange={e => {
                      const next = [...distractors];
                      next[i] = e.target.value;
                      setDistractors(next);
                    }}
                    placeholder={`Nesprávná možnost ${i + 1}…`}
                  />
                ))}
              </div>
            </div>
          )}

          <HintsFields hints={hints} onChange={setHints} />
          <ExplanationField value={explanation} onChange={setExplanation} />
        </div>

        <DialogFooter className="gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            <X className="h-4 w-4 mr-1" /> Zrušit
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            <Save className="h-4 w-4" />
            {saving ? "Ukládám…" : "Uložit změny"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
