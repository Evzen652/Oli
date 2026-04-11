import { useState } from 'react';
import type { TopicMetadata, PracticeTask } from '@/lib/engine/types';
import { getHelpForTopic } from '@/lib/ai/helpEngine';
import { Button } from '@/components/ui/button';
import { useT } from '@/app/LocaleProvider';

interface Props {
  topic: TopicMetadata | null;
  task: PracticeTask;
  onHelpUsed: () => void;
}

export function HelpButton({ topic, task, onHelpUsed }: Props) {
  const t = useT();
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSheet, setShowSheet] = useState(false);

  const hints = task.hints ?? [];
  const helpData = getHelpForTopic(topic);

  const revealNextHint = () => {
    if (revealedHints < hints.length) {
      setRevealedHints((prev) => prev + 1);
      onHelpUsed();
    }
  };

  return (
    <div className="space-y-3">
      {/* Progressive hints */}
      {hints.length > 0 && (
        <div className="space-y-2">
          {hints.slice(0, revealedHints).map((hint, i) => (
            <div key={i} className="p-3 rounded-lg bg-warning-bg border border-warning/30 text-sm">
              {hint}
            </div>
          ))}
          {revealedHints < hints.length && (
            <Button variant="outline" size="sm" onClick={revealNextHint}>
              {t('help.button')}
            </Button>
          )}
        </div>
      )}

      {/* Full help sheet button */}
      {helpData && (
        <>
          <Button variant="ghost" size="sm" onClick={() => { setShowSheet(true); onHelpUsed(); }}>
            {t('help.goodToKnow')}
          </Button>

          {showSheet && (
            <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowSheet(false)}>
              <div
                className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('help.goodToKnow')}</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowSheet(false)}>
                      {t('common.close')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">{t('help.hint')}</h3>
                      <p className="text-sm text-muted-foreground">{helpData.hint}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">{t('help.steps')}</h3>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        {helpData.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">{t('help.example')}</h3>
                      <p className="text-sm text-muted-foreground">{helpData.example}</p>
                    </div>

                    <div className="p-3 rounded-lg border-2 border-destructive/30 bg-error-bg">
                      <h3 className="font-semibold mb-1">{t('help.commonMistake')}</h3>
                      <p className="text-sm">{helpData.commonMistake}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
