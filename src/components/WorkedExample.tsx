import type { PracticeTask, TopicMetadata } from "@/lib/types";
import { CorrectAnswerDisplay, ExplanationDisplay } from "@/components/CheckFeedbackCard";
import { TaskVisual } from "@/components/TaskVisual";
import { useT } from "@/lib/i18n";
import { Check } from "lucide-react";

const OPTION_TYPES = new Set(["select_one", "true_false", "multi_select"]);

/**
 * Vyřešený ukázkový příklad v „Co je dobré vědět": zadání (s obrázkem),
 * správná odpověď zvýrazněná mezi možnostmi, u každé chybné možnosti proč
 * je špatně (`optionFeedback`) a postup řešení. Nic z toho není nový
 * obsah — je to tatáž data, která dítě dosud vidělo až PO chybě.
 *
 * `intro={false}` vynechá úvodní větu — dev náhled ukazuje úloh víc pod sebou.
 */
export function WorkedExample({ task, topic, intro = true }: { task: PracticeTask; topic: TopicMetadata; intro?: boolean }) {
  const t = useT();
  const correct = new Set([task.correctAnswer, ...(task.correctAnswers ?? [])]);
  const options = OPTION_TYPES.has(topic.inputType) && task.options?.length ? task.options : null;

  return (
    <div className="space-y-4" data-testid="worked-example">
      {intro && <p className="text-sm text-muted-foreground">{t("session.worked_example_intro")}</p>}
      <p className="text-lg font-extrabold leading-snug text-foreground">{task.question}</p>
      {task.visual && <TaskVisual visual={task.visual} />}
      {options ? (
        <ul className="space-y-2">
          {options.map((o) => {
            const ok = correct.has(o);
            const why = !ok ? task.optionFeedback?.[o] : undefined;
            return (
              <li
                key={o}
                className={`rounded-xl border px-4 py-2.5 ${
                  ok ? "border-success bg-success-muted font-bold text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  {ok && <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden />}
                  <span className={ok ? "" : "line-through decoration-muted-foreground/50"}>{o}</span>
                </div>
                {why && <p className="mt-1 text-sm text-muted-foreground">{why}</p>}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-xl border border-success bg-success-muted px-4 py-2.5 text-foreground">
          <CorrectAnswerDisplay task={task} topic={topic} />
        </div>
      )}
      <ExplanationDisplay task={task} topic={topic} fallbackHint={false} />
    </div>
  );
}
