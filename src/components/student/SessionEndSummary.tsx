import type { SessionData, TaskResult } from '@/lib/engine/types';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useT } from '@/app/LocaleProvider';

interface Props {
  session: SessionData;
  taskResults: TaskResult[];
  aiEvaluation: string | null;
  onReset: () => void;
  onRetry: () => void;
}

export function SessionEndSummary({ session, taskResults, aiEvaluation, onReset, onRetry }: Props) {
  const t = useT();
  const correctCount = taskResults.filter((r) => r.status === 'correct' || r.status === 'help').length;
  const totalTime = Math.floor((Date.now() - session.startTime) / 1000);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 session-bg-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {correctCount / taskResults.length >= 0.8 ? t('session.greatJob') : 'Dobrá prace!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {session.matchedTopic && (
            <p className="text-center text-muted-foreground">
              {session.matchedTopic.topic}
            </p>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Cas: {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          <ProgressIndicator
            total={taskResults.length}
            current={taskResults.length}
            results={taskResults}
          />

          <div className="text-center text-lg font-semibold">
            {correctCount}/{taskResults.length} {t('session.correct')}
          </div>

          {aiEvaluation && (
            <div className="p-4 rounded-lg bg-muted text-sm">
              {aiEvaluation}
            </div>
          )}

          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full" size="lg">
              {t('session.tryAgain')}
            </Button>
            <Button onClick={onReset} variant="outline" className="w-full">
              {t('session.backToTopics')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
