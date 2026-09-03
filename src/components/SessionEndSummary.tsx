import { useState, useEffect } from "react";
import type { SessionData, TopicMetadata } from "@/lib/types";
import { getChildTopicTitle } from "@/lib/displayNames";
import { generateAiEvaluation } from "@/lib/sessionEvaluator";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, RotateCcw } from "lucide-react";
import categoryInfoImg from "@/assets/category-info.png";
import icoTotal from "@/assets/progress/progress-current.png";
import icoCorrect from "@/assets/progress/progress-correct.png";
import icoHelp from "@/assets/progress/progress-help.png";
import icoWrong from "@/assets/progress/progress-wrong.png";
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
      topicTitle: getChildTopicTitle(session.matchedTopic, session.grade),
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
    // Prázdné deps jsou ZÁMĚR, ne opomenutí: hodnocení se má vygenerovat
    // právě jednou při zobrazení shrnutí. Komponenta se montuje až s finálním
    // sezením, takže `answered`/`correctAlone`/`wrong` už se nemění — doplnění
    // závislostí by jen spouštělo AI volání znovu při každé změně identity
    // `session`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          jako plocha pod bílým textem by měla jen 2,8:1.
          Trofej i obíhající symboly byly do 2026-09-03 systémová emoji.
          Kreslí se na každé platformě jinak a vedle akvarelových ikon
          působily jako cizí těleso — viz `ProgressIndicator`. */}
      <div className="relative rounded-3xl border border-[#9A3412]/20 bg-[#FFF1E6] p-7 text-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-2">
          <Trophy className="w-11 h-11 text-[#9A3412]" aria-hidden />
          <h2 className="text-display text-[#9A3412] tracking-tight">
            {t("summary.title")}
          </h2>
          {session.matchedTopic && (
            <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-card text-foreground text-sm font-semibold shadow-e1">
              {getChildTopicTitle(session.matchedTopic, session.grade)}
            </span>
          )}
        </div>
      </div>

      {/* Statistiky. Karta je bílá, stav nese ikona a číslo — čtyři plné
          pastelové plochy vedle sebe dřív působily jako čtyři různé značky
          a „chybně" bylo červenou plochou, tedy trestem místo informace.

          Ikony jsou tytéž akvarelové kresby jako v `ProgressIndicator`, ne
          lucide. Dítě je vidí u každé úlohy během cvičení — na shrnutí tak
          pozná stejný tvar, ne jinou sadu ve stejném významu. */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-3xl border bg-card p-5 shadow-e1 animate-pop-in">
          <img src={icoTotal} alt="" className="w-7 h-7 mx-auto mb-2 object-contain" />
          <p className="text-4xl font-extrabold text-foreground">{answered}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.total")}</p>
        </div>
        <div className="rounded-3xl border border-success/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.1s' }}>
          <img src={icoCorrect} alt="" className="w-7 h-7 mx-auto mb-2 object-contain" />
          <p className="text-4xl font-extrabold text-success">{correctAlone}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.correct")}</p>
        </div>
        <div className="rounded-3xl border border-warning/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.2s' }}>
          <img src={icoHelp} alt="" className="w-7 h-7 mx-auto mb-2 object-contain" />
          <p className="text-4xl font-extrabold text-warning">{helpUsed}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.help_used")}</p>
        </div>
        <div className="rounded-3xl border border-destructive/30 bg-card p-5 shadow-e1 animate-pop-in" style={{ animationDelay: '0.3s' }}>
          <img src={icoWrong} alt="" className="w-7 h-7 mx-auto mb-2 object-contain" />
          <p className="text-4xl font-extrabold text-destructive">{wrong}</p>
          <p className="text-label text-muted-foreground mt-1">{t("summary.wrong")}</p>
        </div>
      </div>

      {/* Hodnocení od sovičky */}
      <div className="pt-1">
        {(aiEvalLoading || !evalMinReached) && (
          <div className="rounded-3xl border border-success/25 bg-card shadow-e1 p-7 flex flex-col items-center gap-3">
            <img src={categoryInfoImg} alt="Sovička" className="w-24 h-24 animate-pulse-scale mix-blend-multiply object-contain" />
            <OwlLoadingText texts={[
              "Sovička přemýšlí nad tvou prací…",
              "Píšu ti hodnocení…",
              "Už to skoro mám…",
              "Koukám, jak ti to šlo…",
            ]} />
          </div>
        )}
        {evalMinReached && !aiEvalLoading && aiEvaluation && (
          <div className="rounded-3xl border border-success/25 bg-card shadow-e1 p-5 animate-fade-in">
            <p className="text-base text-foreground flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <span className="text-lg font-semibold leading-snug">{aiEvaluation}</span>
            </p>
          </div>
        )}
        {evalMinReached && !aiEvalLoading && !aiEvaluation && (
          <div className="rounded-3xl border border-primary/20 bg-card shadow-e1 p-5">
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
          size="child"
          className="text-lg rounded-full gap-2 font-bold"
          onClick={onRepeat}
        >
          <RotateCcw className="w-5 h-5" /> {t("summary.repeat")}
        </Button>
        <Button
          variant="outline"
          size="child"
          className="text-lg rounded-full gap-2 border border-primary/30 text-primary font-bold"
          onClick={onNewTopic}
        >
          <Sparkles className="w-5 h-5" /> {t("summary.new_topic")}
        </Button>
      </div>
    </div>
  );
}
