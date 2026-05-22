/**
 * TopicResultDetail — dětský pohled na výsledek procvičování.
 *
 * Design principy:
 * - Žádný součet chyb v hlavičce
 * - Pozitivní rámování ("Zvládl jsi X z Y")
 * - Max 1 chyba k připomenutí (nejrelevantnější)
 * - Primární akce: "Zkusit znovu"
 * - Pokud 100 %: žádná sekce "Tohle si připomeň"
 */

import { Button } from "@/components/ui/button";
import { getStudentLabel, getStudentLabelColor, getStudentEmoji } from "@/lib/studentLabels";

export interface TaskResultItem {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  wasCorrect: boolean;
  /** Volitelný postup řešení (1-3 kroky) */
  solutionSteps?: string[];
}

interface TopicResultDetailProps {
  topicName: string;
  results: TaskResultItem[];
  onRetry: () => void;
  onClose?: () => void;
}

export function TopicResultDetail({
  topicName,
  results,
  onRetry,
  onClose,
}: TopicResultDetailProps) {
  const correct = results.filter((r) => r.wasCorrect).length;
  const total = results.length;
  const successRate = total > 0 ? correct / total : 0;
  const label = getStudentLabel(successRate);
  const labelColor = getStudentLabelColor(successRate);
  const emoji = getStudentEmoji(successRate);

  // Maximálně 1 chyba k připomenutí — vybere se ta první
  const firstMistake = results.find((r) => !r.wasCorrect);
  const showMistakeSection = successRate < 1 && firstMistake != null;

  return (
    <div className="space-y-5 py-2">
      {/* Hlavička — pozitivní rámování */}
      <div className="text-center space-y-1">
        <p className="text-3xl">{emoji}</p>
        <h2 className="text-xl font-bold text-foreground">{topicName}</h2>
        <p className={`text-base font-semibold ${labelColor}`}>{label}</p>
        <p className="text-sm text-muted-foreground">
          Zvládl jsi {correct} z {total} úloh
        </p>
      </div>

      {/* Připomenutí — jen pokud není 100 % */}
      {showMistakeSection && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Tohle si můžeš ještě připomenout
          </p>
          <p className="text-sm font-medium text-amber-900">
            {firstMistake.question}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-amber-600">→</span>
            <span className="font-semibold text-amber-900">{firstMistake.correctAnswer}</span>
          </div>
          {firstMistake.solutionSteps && firstMistake.solutionSteps.length > 0 && (
            <ol className="mt-1 space-y-0.5 list-decimal list-inside text-xs text-amber-700">
              {firstMistake.solutionSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Akce */}
      <div className="flex flex-col gap-2 pt-1">
        <Button
          onClick={onRetry}
          className="w-full text-base h-12 rounded-xl"
        >
          Zkusit znovu »
        </Button>
        {onClose && (
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-sm text-muted-foreground"
          >
            Zpět
          </Button>
        )}
      </div>
    </div>
  );
}
