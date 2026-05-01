import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export interface EssayGrade {
  score: number;
  praise: string;
  suggestions: string[];
  errors?: string[];
}

interface Props {
  /** Zadání slohu (např. "Napiš krátký vyprávěcí text o tvém oblíbeném zvířeti") */
  prompt: string;
  /** Min počet slov před odesláním (default 30) */
  minWords?: number;
  /** Cílový ročník (přiměřená přísnost AI) */
  gradeMin?: number;
  /** Žák klikl "Pokračovat" — předá score (0-100) jako string orchestratoru */
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

/**
 * EssayInput — sloh / krátký vyprávěcí text s AI hodnocením (Fáze 11).
 *
 * Flow:
 *   1) Žák napíše text → "Odeslat ke kontrole"
 *   2) Edge fn `evaluate-essay` vrátí skóre + pochvalu + tipy
 *   3) Žák vidí AI feedback in-place, klikne "Pokračovat"
 *   4) onSubmit(String(score)) → orchestrator porovná přes essayValidator
 *
 * Účel: humanitní obsah (sloh, vyprávění, popis) bez jediné správné odpovědi.
 * Score ≥ 60 = passing (default threshold v task.correctAnswer).
 */
export function EssayInput({ prompt, minWords = 30, gradeMin, onSubmit, disabled }: Props) {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [grading, setGrading] = useState(false);
  const [grade, setGrade] = useState<EssayGrade | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const tooShort = wordCount < minWords;

  const handleEvaluate = async () => {
    if (tooShort || grading || disabled) return;
    setGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke("evaluate-essay", {
        body: {
          prompt,
          essay: text,
          grade_min: gradeMin,
          min_words: minWords,
        },
      });
      if (error) throw error;
      const result: EssayGrade = {
        score: typeof data?.score === "number" ? data.score : 0,
        praise: data?.praise ?? "",
        suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
        errors: Array.isArray(data?.errors) ? data.errors : undefined,
      };
      setGrade(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Hodnocení slohu se nepodařilo. Zkus to znovu.";
      toast({ description: msg, variant: "destructive" });
    } finally {
      setGrading(false);
    }
  };

  const handleContinue = () => {
    if (!grade || disabled) return;
    onSubmit(String(grade.score));
  };

  if (grade) {
    const passed = grade.score >= 60;
    return (
      <div className="space-y-4">
        <div
          className={`rounded-2xl border-2 p-5 ${
            passed
              ? "border-emerald-300 bg-emerald-50/60"
              : "border-amber-300 bg-amber-50/60"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">{grade.score}/100</p>
              <p className="text-sm text-muted-foreground">
                {passed ? "Pěkná práce!" : "Skoro to bylo — koukni na tipy."}
              </p>
            </div>
          </div>
          {grade.praise && (
            <p className="text-base text-foreground/90 leading-relaxed mb-3">
              <Sparkles className="inline h-4 w-4 text-amber-500 mr-1" />
              {grade.praise}
            </p>
          )}
          {grade.suggestions.length > 0 && (
            <div className="border-t border-foreground/10 pt-3 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tipy ke zlepšení
              </p>
              <ul className="list-disc list-inside text-sm text-foreground/85 space-y-1">
                {grade.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {grade.errors && grade.errors.length > 0 && (
            <div className="border-t border-foreground/10 pt-3 mt-3 space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Drobnosti
              </p>
              <ul className="list-disc list-inside text-sm text-foreground/75 space-y-1">
                {grade.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button
          onClick={handleContinue}
          disabled={disabled}
          className="w-full text-lg h-12 rounded-xl gap-2"
        >
          Pokračovat
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Napiš souvislý text. Minimálně <strong>{minWords} slov</strong>.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Začni psát…"
        className="min-h-[180px] text-base border-2 rounded-xl resize-none"
        disabled={grading || disabled}
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs font-medium ${
            tooShort ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {wordCount} slov {tooShort && `(ještě ${minWords - wordCount})`}
        </span>
        <Button
          onClick={handleEvaluate}
          disabled={tooShort || grading || disabled}
          className="rounded-xl gap-1.5 h-11"
        >
          {grading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {grading ? "Hodnotím…" : "Odeslat ke kontrole"}
        </Button>
      </div>
    </div>
  );
}
