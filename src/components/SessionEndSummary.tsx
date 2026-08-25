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
    <p className="text-base font-semibold text-success text-center">
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
      {/* Trophy banner. Oranžová smí být tint s tmavým textem (6,60:1) —
          jako plocha pod bílým textem by měla jen 2,8:1. */}
      <div className="relative rounded-3xl border border-[#9A3412]/20 bg-[#FFF1E6] p-7 text-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-2">
          <span className="text-5xl" aria-hidden>🏆</span>
          <h2 className="text-display text-[#9A3412] tracking-tight">
            {t("summary.title")}
          </h2>
          {session.matchedTopic && (
            <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-card text-foreground text-sm font-semibold shadow-e1">
              {getFullTopicTitle(session.matchedTopic)}
            </span>
          )}
        </div>
      </div>

      {/* Statistiky. Karta je bílá, stav nese ikona a číslo — čtyři plné
          pastelové plochy vedle sebe dřív působily jako čtyři různé značky
          a „chybně" bylo červenou plochou, tedy trestem místo informace. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-lg border bg-card p-5 shadow-e1 animate-pop-in">
          <ClipboardList className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-4xl font-extrabold text-foreground">{answered}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.total")}</p>
        </div>
        <div className="rounded-lg border border-success/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <CheckCircle className="w-6 h-6 mx-auto mb-2 text-success" />
          <p className="text-4xl font-extrabold text-success">{correctAlone}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.correct")}</p>
        </div>
        <div className="rounded-lg border border-warning/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <Lightbulb className="w-6 h-6 mx-auto mb-2 text-warning" />
          <p className="text-4xl font-extrabold text-warning">{helpUsed}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.help_used")}</p>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.3s' }}>
          <XCircle className="w-6 h-6 mx-auto mb-2 text-destructive" />
          <p className="text-4xl font-extrabold text-destructive">{wrong}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.wrong")}</p>
        </div>
      </div>

      {/* AI evaluation — bright mint panel */}
      <div className="pt-1">
        {(aiEvalLoading || !evalMinReached) && (
          <div className="rounded-3xl bg-success-muted border border-success/25 p-7 flex flex-col items-center gap-3">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <img src={categoryInfoImg} alt="Sovička" className="w-20 h-20 animate-pulse-scale mix-blend-multiply object-contain" />
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
          <div className="rounded-3xl bg-success-muted border border-success/25 p-5 animate-fade-in">
            <p className="text-base text-foreground flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span className="text-lg font-semibold leading-snug">{aiEvaluation}</span>
            </p>
          </div>
        )}
        {evalMinReached && !aiEvalLoading && !aiEvaluation && (
          <div className="rounded-3xl bg-accent border border-primary/20 p-5">
            <p className="text-base text-accent-foreground flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="font-semibold">{fallbackEval}</span>
            </p>
          </div>
        )}
      </div>

      {/* Action buttons — pill style */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="success"
          size="child"
          className="text-lg rounded-full gap-2 font-bold"
          onClick={onRepeat}
        >
          <RotateCcw className="w-5 h-5" /> {t("summary.repeat")}
        </Button>
        <Button
          variant="outline"
          size="child"
          className="text-lg rounded-full gap-2 border-2 border-primary/30 text-primary font-bold"
          onClick={onNewTopic}
        >
          <Sparkles className="w-5 h-5" /> {t("summary.new_topic")}
        </Button>
      </div>
    </div>
  );
}
