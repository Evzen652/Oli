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
            <div className="mt-4 rounded-xl bg-background/70 p-5 text-base text-secondary-foreground space-y-3">
              <p>
                {t("session.correct_answer")}<span className="font-bold text-foreground">{answeredTask.correctAnswer}</span>
              </p>
              {answeredTask.solutionSteps && answeredTask.solutionSteps.length > 0 ? (
                <>
                  <p className="font-semibold text-foreground">{t("session.procedure")}</p>
                  <ol className="list-decimal list-inside text-base text-muted-foreground space-y-1">
                    {answeredTask.solutionSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </>
              ) : (
                <>
                  <p className="text-base text-muted-foreground">
                    <span className="font-semibold">{t("session.procedure")}</span> {topic.helpTemplate.hint}
                  </p>
                  {topic.helpTemplate.steps && topic.helpTemplate.steps.length > 0 && (
                    <ol className="list-decimal list-inside text-base text-muted-foreground space-y-1">
                      {topic.helpTemplate.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  )}
                </>
              )}
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
