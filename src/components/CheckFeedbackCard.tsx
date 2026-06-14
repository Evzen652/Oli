import type { PracticeTask, TopicMetadata } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

interface CheckFeedbackCardProps {
  checkFeedback: string;
  lastAnswerCorrect: boolean | null;
  answeredTask: PracticeTask | null;
  topic: TopicMetadata | null;
  subjectColors: { border: string; bg: string };
  loading: boolean;
  isTerminal: boolean;
  onContinue: () => void;
}

/** Zobrazení správné odpovědi dle typu úlohy */
function CorrectAnswerDisplay({ task, topic }: { task: PracticeTask; topic: TopicMetadata }) {
  const inputType = topic.inputType;

  if (inputType === "drag_order" && task.items && task.items.length > 0) {
    return (
      <div className="space-y-1">
        <p className="font-semibold text-foreground">Správné pořadí:</p>
        <ol className="list-decimal list-inside space-y-1 text-base text-muted-foreground">
          {task.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>
    );
  }

  if (inputType === "match_pairs" && task.pairs && task.pairs.length > 0) {
    return (
      <div className="space-y-1">
        <p className="font-semibold text-foreground">Správné páry:</p>
        <ul className="space-y-1 text-base text-muted-foreground">
          {task.pairs.map((p, i) => (
            <li key={i}>{p.left} → {p.right}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (inputType === "categorize" && task.categories && task.categories.length > 0) {
    return (
      <div className="space-y-2">
        <p className="font-semibold text-foreground">Správné zařazení:</p>
        {task.categories.map((cat, i) => (
          <div key={i}>
            <p className="font-medium text-foreground text-sm">{cat.name}:</p>
            <p className="text-sm text-muted-foreground">{cat.items.join(", ")}</p>
          </div>
        ))}
      </div>
    );
  }

  // Výchozí: prostý text
  return (
    <p>
      Správná odpověď: <span className="font-bold text-foreground">{task.correctAnswer}</span>
    </p>
  );
}

/** Kontextové vysvětlení proč je odpověď správná */
function ExplanationDisplay({ task, topic }: { task: PracticeTask; topic: TopicMetadata }) {
  // Per-task explanation má vždy nejvyšší prioritu (pro všechny typy)
  if (task.explanation) {
    return (
      <p className="text-base text-muted-foreground leading-relaxed">
        {task.explanation}
      </p>
    );
  }

  // Matematika: step-by-step postup
  if (task.solutionSteps && task.solutionSteps.length > 0) {
    // Jeden krok → prostý odstavec (žádné matoucí „1."); víc kroků → číslovaný seznam
    if (task.solutionSteps.length === 1) {
      return (
        <p className="text-base font-bold text-foreground leading-relaxed">
          {task.solutionSteps[0]}
        </p>
      );
    }
    return (
      <ol className="list-decimal list-inside text-base text-muted-foreground space-y-1">
        {task.solutionSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    );
  }

  // Ordering/matching bez explanation: nezobrazovat helpTemplate (je opakující se a generické)
  const inputType = topic.inputType;
  if (inputType === "drag_order" || inputType === "match_pairs" || inputType === "categorize") {
    return null;
  }

  // Ostatní typy: fallback na helpTemplate.hint
  if (topic.helpTemplate?.hint) {
    return (
      <p className="text-base text-muted-foreground leading-relaxed">
        {topic.helpTemplate.hint}
      </p>
    );
  }

  return null;
}

export function CheckFeedbackCard({
  checkFeedback,
  lastAnswerCorrect,
  answeredTask,
  topic,
  subjectColors,
  loading,
  isTerminal,
  onContinue,
}: CheckFeedbackCardProps) {
  const t = useT();
  return (
    <>
      <Card className={`border-2 rounded-2xl overflow-hidden border-l-4 ${subjectColors.border} bg-gradient-to-br ${subjectColors.bg} ${lastAnswerCorrect ? "animate-pop-in" : "animate-shake"}`}>
        <CardContent className="p-6">
          <h2 className={`text-2xl font-bold mb-3 ${lastAnswerCorrect ? "text-green-600" : "text-orange-600"}`}>
            {checkFeedback}
          </h2>
          {lastAnswerCorrect && (
            <div className="flex justify-center gap-2 mb-2">
              {["🎉", "⭐", "✨", "🌟", "🎊"].map((emoji, i) => (
                <span key={i} className="animate-float-up text-2xl" style={{ animationDelay: `${i * 0.1}s` }}>{emoji}</span>
              ))}
            </div>
          )}
          {answeredTask && topic && (
            <div className="mt-4 rounded-xl bg-white p-5 text-base text-secondary-foreground space-y-3">
              {/* Správná odpověď — jen při špatné odpovědi */}
              {!lastAnswerCorrect && (
                <CorrectAnswerDisplay task={answeredTask} topic={topic} />
              )}

              {/* Vysvětlení proč — vždy, u správné i špatné odpovědi */}
              <ExplanationDisplay task={answeredTask} topic={topic} />
            </div>
          )}
        </CardContent>
      </Card>

      {!isTerminal && (
        <div className="text-center">
          <Button onClick={onContinue} disabled={loading} className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            {loading ? t("session.processing") : t("session.continue")}
          </Button>
        </div>
      )}
    </>
  );
}
