import { useState, useEffect } from "react";
import type { SessionData, TopicMetadata } from "@/lib/types";
import { getFullTopicTitle } from "@/lib/types";
import { generateAiEvaluation } from "@/lib/sessionEvaluator";
import { Button } from "@/components/ui/button";
import { Trophy, ClipboardList, CheckCircle, Lightbulb, XCircle, Sparkles, RotateCcw, BookOpen } from "lucide-react";
import categoryInfoImg from "@/assets/category-info.png";
import { useT } from "@/lib/i18n";

/* Owl loading animation */
function OwlLoadingText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % texts.length), 2500);
    return () => clearInterval(id);
  }, [texts.length]);
  return (
    <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300 text-center">
      {texts[idx]}
      <span className="inline-flex ml-1 gap-0.5">
        <span className="animate-dot-1">.</span>
        <span className="animate-dot-2">.</span>
        <span className="animate-dot-3">.</span>
      </span>
    </p>
  );
}

interface SessionEndSummaryProps {
  session: SessionData;
  onRepeat: () => void;
  onNewTopic: () => void;
}

export function SessionEndSummary({ session, onRepeat, onNewTopic }: SessionEndSummaryProps) {
  const t = useT();
  const [aiEvaluation, setAiEvaluation] = useState<string | null>(null);
  const [aiEvalLoading, setAiEvalLoading] = useState(false);
  const [evalMinReached, setEvalMinReached] = useState(false);

  const helpUsed = session.helpUsedCount;
  const answered = session.currentTaskIndex;
  const wrong = session.errorCount;
  const correctAlone = answered - helpUsed - wrong;

  useEffect(() => {
    if (!session.matchedTopic || answered === 0) return;

    setAiEvalLoading(true);
    setEvalMinReached(false);
    const timer = setTimeout(() => setEvalMinReached(true), 3000);

    // Generate evaluation — AI with local fallback
    generateAiEvaluation({
      topicTitle: getFullTopicTitle(session.matchedTopic),
      totalTasks: answered,
      correctCount: correctAlone,
      wrongCount: wrong,
      helpUsedCount: helpUsed,
      grade: session.grade,
      subject: session.matchedTopic.subject,
    })
      .then((text) => setAiEvaluation(text))
      .catch(() => {})
      .finally(() => setAiEvalLoading(false));

    return () => { clearTimeout(timer); };
  }, []);

  const pct = answered > 0 ? Math.round((correctAlone / answered) * 100) : 0;
  const fallbackEval = pct >= 80
    ? t("summary.great")
    : pct >= 50
      ? t("summary.good")
      : t("summary.try_again");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trophy banner */}
      <div className="relative bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-2xl p-6 text-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
        <div className="relative z-10">
          <Trophy className="w-12 h-12 mx-auto mb-1 text-amber-900" />
          <h2 className="text-2xl font-extrabold text-amber-900">{t("summary.title")}</h2>
          {session.matchedTopic && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-900/15 text-amber-800 text-sm font-semibold">
              {getFullTopicTitle(session.matchedTopic)}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 shadow-md border-2 border-gray-200 dark:border-gray-700 animate-pop-in">
          <p className="text-4xl font-bold text-foreground">{answered}</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1"><ClipboardList className="w-4 h-4" /> {t("summary.total")}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/30 p-5 shadow-md border-2 border-green-200 dark:border-green-700 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-4xl font-bold text-green-600">{correctAlone}</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> {t("summary.correct")}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/30 p-5 shadow-md border-2 border-blue-200 dark:border-blue-700 animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-4xl font-bold text-blue-600">{helpUsed}</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1"><Lightbulb className="w-4 h-4 text-blue-500" /> {t("summary.help_used")}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/30 p-5 shadow-md border-2 border-orange-200 dark:border-orange-700 animate-pop-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-4xl font-bold text-orange-600">{wrong}</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1"><XCircle className="w-4 h-4 text-orange-500" /> {t("summary.wrong")}</p>
        </div>
      </div>

      {/* AI evaluation */}
      <div className="pt-1">
        {(aiEvalLoading || !evalMinReached) && (
          <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/20 p-6 shadow-md border-2 border-emerald-200 dark:border-emerald-700 flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img src={categoryInfoImg} alt="Sovička" className="w-16 h-16 animate-pulse-scale mix-blend-multiply dark:mix-blend-screen object-contain" />
              <span className="absolute inset-0 flex items-center justify-center animate-orbit text-2xl pointer-events-none">📖</span>
              <span className="absolute inset-0 flex items-center justify-center animate-orbit-delayed-1 text-2xl pointer-events-none">✏️</span>
              <span className="absolute inset-0 flex items-center justify-center animate-orbit-delayed-2 text-2xl pointer-events-none">⭐</span>
            </div>
            <OwlLoadingText texts={[
              "Sovička přemýšlí nad tvou prací…",
              "Píšu ti hodnocení…",
              "Už to skoro mám…",
              "Koukám, jak ti to šlo…",
            ]} />
          </div>
        )}
        {evalMinReached && !aiEvalLoading && aiEvaluation && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-400 p-4 shadow-sm animate-fade-in">
            <p className="text-base text-foreground flex items-start gap-2"><Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> <span className="text-lg font-semibold">{aiEvaluation}</span></p>
          </div>
        )}
        {evalMinReached && !aiEvalLoading && !aiEvaluation && (
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-400 p-4 shadow-sm">
            <p className="text-base text-foreground flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> {fallbackEval}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="default"
          className="text-lg h-14 rounded-xl gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-0"
          onClick={onRepeat}
        >
          <RotateCcw className="w-5 h-5" /> {t("summary.repeat")}
        </Button>
        <Button
          variant="outline"
          className="text-lg h-14 rounded-xl gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          onClick={onNewTopic}
        >
          <BookOpen className="w-5 h-5" /> {t("summary.new_topic")}
        </Button>
      </div>
    </div>
  );
}
