/**
 * Živý náhled cvičení v admin editoru — vykreslí rozpracovanou úlohu přesně
 * tak, jak ji uvidí žák (přes stejný `PracticeInputRouter` jako session), plus
 * neblokující obsahová varování (hint-leak / giveaway).
 *
 * Náhled je „best effort": interaktivní vstupy (klikání, spojování) nic
 * nevyhodnocují — callbacky jsou no-op. Slouží k vizuální kontrole tvaru úlohy.
 */
import { useMemo, useState } from "react";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";
import { detectExerciseWarnings, type ExerciseWarning } from "@/lib/exerciseWarnings";
import type { InputType, PracticeTask, TopicMetadata } from "@/lib/types";
import { AlertTriangle, Eye } from "lucide-react";

export type PreviewInputType =
  | "select_one" | "true_false" | "fill_blank" | "short_answer" | "match_pairs" | "multi_select";

export interface ExercisePreviewProps {
  inputType: PreviewInputType;
  question: string;
  correctAnswer: string;
  distractors: string[];
  hints: string[];
  pairs: { left: string; right: string }[];
  multiOptions: { text: string; correct: boolean }[];
}

// Typy, které `PracticeInputRouter` bezpečně vykreslí jen z form dat.
// fill_blank potřebuje strukturu `blanks`, short_answer je volný text — pro ně
// ukážeme statický fallback místo (možná prázdného) routeru.
const ROUTER_TYPES = new Set<PreviewInputType>([
  "select_one", "true_false", "multi_select", "match_pairs",
]);

const ROUTER_INPUT_TYPE: Record<PreviewInputType, InputType> = {
  select_one: "select_one",
  true_false: "true_false",
  multi_select: "multi_select",
  match_pairs: "match_pairs",
  fill_blank: "fill_blank",
  short_answer: "text",
};

/** Poskládá zobrazované možnosti + jednotný string správné odpovědi z form dat. */
function composeAnswer(p: ExercisePreviewProps): { options: string[]; correctAnswer: string } {
  switch (p.inputType) {
    case "match_pairs":
      return { options: [], correctAnswer: "match" };
    case "multi_select": {
      const filled = p.multiOptions.filter((o) => o.text.trim());
      const correct = filled.filter((o) => o.correct).map((o) => o.text.trim());
      return { options: filled.map((o) => o.text.trim()), correctAnswer: correct.join(",") };
    }
    case "true_false":
      return { options: ["Pravda", "Nepravda"], correctAnswer: p.correctAnswer.trim() };
    case "select_one": {
      const ds = p.distractors.filter((d) => d.trim()).map((d) => d.trim());
      const correct = p.correctAnswer.trim();
      // Deterministické pořadí (bez shuffle) — náhled nesmí blikat mezi rendery.
      return { options: correct ? [correct, ...ds] : ds, correctAnswer: correct };
    }
    default:
      return { options: [], correctAnswer: p.correctAnswer.trim() };
  }
}

function buildPreviewTask(p: ExercisePreviewProps, options: string[], correctAnswer: string): PracticeTask {
  const base: PracticeTask = { question: p.question.trim(), correctAnswer };
  switch (p.inputType) {
    case "match_pairs":
      return { ...base, pairs: p.pairs.filter((x) => x.left.trim() && x.right.trim()) };
    case "multi_select":
      return { ...base, options, correctAnswers: correctAnswer ? correctAnswer.split(",") : [] };
    case "select_one":
    case "true_false":
      return { ...base, options };
    default:
      return base;
  }
}

const WARNING_LABEL: Record<ExerciseWarning["category"], string> = {
  hint_leak: "Nápověda prozrazuje",
  giveaway_question: "Giveaway v otázce",
  giveaway_option: "Giveaway v možnosti",
};

export function ExercisePreview(props: ExercisePreviewProps) {
  const [userInput, setUserInput] = useState("");

  const { options, correctAnswer } = useMemo(() => composeAnswer(props), [props]);

  const task = useMemo(
    () => buildPreviewTask(props, options, correctAnswer),
    [props, options, correctAnswer],
  );

  const warnings = useMemo(
    () => detectExerciseWarnings({
      inputType: props.inputType,
      question: props.question,
      correctAnswer,
      options,
      hints: props.hints,
    }),
    [props.inputType, props.question, correctAnswer, options, props.hints],
  );

  const topic = { inputType: ROUTER_INPUT_TYPE[props.inputType] } as unknown as TopicMetadata;
  const hasQuestion = props.question.trim().length > 0;

  return (
    <div className="space-y-3 rounded-2xl border-2 border-dashed border-violet-200 dark:border-violet-900 bg-violet-50/40 dark:bg-violet-950/20 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" /> Náhled — jak úlohu uvidí žák
      </p>

      {!hasQuestion ? (
        <p className="text-sm text-muted-foreground italic py-2">
          Zadej otázku a náhled se zobrazí.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-base font-semibold text-foreground leading-snug">
            {props.question.trim()}
          </p>

          {ROUTER_TYPES.has(props.inputType) ? (
            <PracticeInputRouter
              topic={topic}
              currentTask={task}
              userInput={userInput}
              loading={false}
              onUserInputChange={setUserInput}
              onAnswerSubmit={() => {}}
              onTextSubmit={() => {}}
            />
          ) : (
            <div className="rounded-xl border-2 border-border bg-background/60 p-3 text-sm text-muted-foreground">
              {props.inputType === "fill_blank"
                ? "Žák doplní chybějící část do věty (___)."
                : "Žák napíše volnou odpověď."}
            </div>
          )}
        </div>
      )}

      {/* Neblokující varování */}
      {warnings.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs text-amber-800 dark:text-amber-200"
            >
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                <span className="font-semibold">{WARNING_LABEL[w.category]}:</span> {w.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
