import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface Props {
  correct: boolean;
  correctAnswer: string;
  solutionSteps?: string[];
  hints?: string[];
  onContinue: () => void;
}

export function CheckFeedbackCard({ correct, correctAnswer, solutionSteps, hints, onContinue }: Props) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 border-2 space-y-4',
        correct
          ? 'bg-success-bg border-success/30'
          : 'bg-error-bg border-error/30'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{correct ? '\u2713' : '\u2717'}</span>
        <h3 className={cn('text-lg font-bold', correct ? 'text-success' : 'text-error')}>
          {correct ? 'Spravne!' : 'Spatne'}
        </h3>
      </div>

      {!correct && (
        <div className="text-sm">
          <span className="text-muted-foreground">Spravna odpoved: </span>
          <span className="font-semibold">{correctAnswer}</span>
        </div>
      )}

      {solutionSteps && solutionSteps.length > 0 && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Postup reseni:</p>
          <ol className="list-decimal list-inside text-sm space-y-1">
            {solutionSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {!correct && hints && hints.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Napoveda:</p>
          <p>{hints[0]}</p>
        </div>
      )}

      <Button onClick={onContinue} className="w-full" size="lg">
        Pokracovat
      </Button>
    </div>
  );
}
