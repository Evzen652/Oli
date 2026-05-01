import { useState, useEffect } from "react";
import type { SessionData, TopicMetadata } from "@/lib/types";
import { getFullTopicTitle } from "@/lib/types";
import { generateAiEvaluation } from "@/lib/sessionEvaluator";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle, Lightbulb, XCircle, Sparkles, RotateCcw } from "lucide-react";
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
      category: session.matchedTopic.category,
      briefDescription: session.matchedTopic.briefDescription,
      goals: session.matchedTopic.goals,
      inputType: session.matchedTopic.inputType,
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
      {/* Trophy banner — peach/coral pill */}
      <div className="relative bg-gradient-to-r from-rose-200 via-orange-200 to-amber-200 dark:from-rose-900/40 dark:via-orange-900/40 dark:to-amber-900/40 rounded-[2rem] p-7 text-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-5xl drop-shadow-sm" aria-hidden>🏆</span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-800 dark:text-stone-100 tracking-tight">
            {t("summary.title")}
          </h2>
          {session.matchedTopic && (
            <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm font-semibold shadow-sm">
              {getFullTopicTitle(session.matchedTopic)}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid — soft pastel cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-2xl bg-sky-100 dark:bg-sky-900/30 p-5 shadow-sm border border-sky-200/70 dark:border-sky-700/50 animate-pop-in">
          <ClipboardList className="w-6 h-6 mx-auto mb-2 text-sky-600 dark:text-sky-400" />
          <p className="text-4xl font-extrabold text-sky-900 dark:text-sky-100">{answered}</p>
          <p className="text-sm text-sky-700/80 dark:text-sky-300/80 mt-1 font-medium">{t("summary.total")}</p>
        </div>
        <div className="rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 p-5 shadow-sm border border-emerald-200/70 dark:border-emerald-700/50 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
          <p className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-100">{correctAlone}</p>
          <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 mt-1 font-medium">{t("summary.correct")}</p>
        </div>
        <div className="rounded-2xl bg-violet-100 dark:bg-violet-900/30 p-5 shadow-sm border border-violet-200/70 dark:border-violet-700/50 animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <Lightbulb className="w-6 h-6 mx-auto mb-2 text-violet-600 dark:text-violet-400" />
          <p className="text-4xl font-extrabold text-violet-900 dark:text-violet-100">{helpUsed}</p>
          <p className="text-sm text-violet-700/80 dark:text-violet-300/80 mt-1 font-medium">{t("summary.help_used")}</p>
        </div>
        <div className="rounded-2xl bg-rose-100 dark:bg-rose-900/30 p-5 shadow-sm border border-rose-200/70 dark:border-rose-700/50 animate-pop-in" style={{ animationDelay: '0.3s' }}>
          <XCircle className="w-6 h-6 mx-auto mb-2 text-rose-600 dark:text-rose-400" />
          <p className="text-4xl font-extrabold text-rose-900 dark:text-rose-100">{wrong}</p>
          <p className="text-sm text-rose-700/80 dark:text-rose-300/80 mt-1 font-medium">{t("summary.wrong")}</p>
        </div>
      </div>

      {/* AI evaluation — bright mint panel */}
      <div className="pt-1">
        {(aiEvalLoading || !evalMinReached) && (
          <div className="rounded-3xl bg-gradient-to-br from-emerald-200 to-green-200 dark:from-emerald-800/50 dark:to-green-800/50 p-7 shadow-md border border-emerald-300/50 dark:border-emerald-600/50 flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img src={categoryInfoImg} alt="Sovička" className="w-20 h-20 animate-pulse-scale mix-blend-multiply dark:mix-blend-screen object-contain drop-shadow-sm" />
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
          <div className="rounded-3xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-300/60 dark:border-emerald-700/40 p-5 shadow-sm animate-fade-in">
            <p className="text-base text-emerald-900 dark:text-emerald-100 flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-lg font-semibold leading-snug">{aiEvaluation}</span>
            </p>
          </div>
        )}
        {evalMinReached && !aiEvalLoading && !aiEvaluation && (
          <div className="rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 border border-sky-300/60 dark:border-sky-700/40 p-5 shadow-sm">
            <p className="text-base text-sky-900 dark:text-sky-100 flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span className="font-semibold">{fallbackEval}</span>
            </p>
          </div>
        )}
      </div>

      {/* Action buttons — pill style */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="default"
          className="text-lg h-14 rounded-full gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-bold"
          onClick={onRepeat}
        >
          <RotateCcw className="w-5 h-5" /> {t("summary.repeat")}
        </Button>
        <Button
          variant="outline"
          className="text-lg h-14 rounded-full gap-2 bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-bold"
          onClick={onNewTopic}
        >
          <Sparkles className="w-5 h-5" /> {t("summary.new_topic")}
        </Button>
      </div>
    </div>
  );
}
