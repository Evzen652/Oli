import { useState } from "react";
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
import { Plus, Save, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TopicMetadata } from "@/lib/types";
import type { ExerciseVariant } from "./ExerciseTab";

type FormInputType = "select_one" | "true_false" | "fill_blank" | "short_answer";

const INPUT_TYPE_LABELS: Record<FormInputType, string> = {
  select_one:   "Výběr jedné odpovědi (A/B/C/D)",
  true_false:   "Pravda / Nepravda",
  fill_blank:   "Doplň do věty (___)",
  short_answer: "Krátká volná odpověď",
};

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

  const reset = () => {
    setInputType("select_one");
    setQuestion("");
    setCorrectAnswer("");
    setDistractors(["", "", ""]);
    setHints(["", ""]);
    setExplanation("");
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const handleSave = async () => {
    if (!question.trim()) {
      toast({ description: "Zadej otázku.", variant: "destructive" });
      return;
    }
    if (!correctAnswer.trim()) {
      toast({ description: "Zadej správnou odpověď.", variant: "destructive" });
      return;
    }
    if (inputType === "select_one" && distractors.filter(d => d.trim()).length < 1) {
      toast({ description: "Přidej aspoň 1 nesprávnou možnost.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const options =
        inputType === "select_one"
          ? shuffle([...distractors.filter(d => d.trim()), correctAnswer.trim()])
          : inputType === "true_false"
          ? ["Pravda", "Nepravda"]
          : [];

      const { error } = await (supabase as any).from("custom_exercises").insert({
        skill_id: skill.id,
        question: question.trim(),
        correct_answer: correctAnswer.trim(),
        options,
        hints: hints.filter(h => h.trim()),
        solution_steps: explanation.trim() ? [explanation.trim()] : [],
        source: variant,
        status: "pending",
      });
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
                    : "Napiš otázku…"
                }
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Správná odpověď */}
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

            {/* Nápovědy */}
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
                      setHints(next);
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

            {/* Vysvětlení */}
            <div className="space-y-1.5">
              <Label>
                Vysvětlení
                <span className="text-muted-foreground font-normal ml-1">(nepovinné)</span>
              </Label>
              <Textarea
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Proč je tato odpověď správná…"
                className="min-h-[60px] resize-none"
              />
            </div>
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
