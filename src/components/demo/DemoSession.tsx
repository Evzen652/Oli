/**
 * DemoSession — plnohodnotné procvičování bez přihlášení a bez DB.
 * Používá stejné UI komponenty jako SessionView (PracticeInputRouter,
 * CheckFeedbackCard, HelpButton, ProgressIndicator, SessionTimer).
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { validateAnswer } from "@/lib/validators";
import { getTopicIllustrationUrl } from "@/lib/prvoukaVisuals";
import { getFullTopicTitle } from "@/lib/types";
import { getAllTopics } from "@/lib/contentRegistry";
import { getSubjectMeta } from "@/lib/subjectRegistry";
import { IllustrationImg } from "@/components/IllustrationImg";
import { PracticeInputRouter } from "@/components/PracticeInputRouter";
import { CheckFeedbackCard } from "@/components/CheckFeedbackCard";
import { HelpButton } from "@/components/HelpButton";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { SessionTimer } from "@/components/SessionTimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OlyLogo } from "@/components/OlyLogo";
import { ArrowLeft } from "lucide-react";

// ── Chválení / kritika (stejné jako v useSessionDispatch) ──────────────────
const PRAISE = [
  "Správně! 🎉", "Výborně! ⭐", "Skvělá práce! 💪", "Tak to má být! 👏",
  "Přesně tak! 🌟", "Bezchybně! ✨", "Paráda! 🎊", "Super! 🙌",
  "Máš to! 💯", "Perfektní! 🏆",
];
const INCORRECT = [
  "To není ono 🤔", "Zkus to ještě jednou 💪", "Tentokrát ne 🙃",
  "Ještě to není správně", "Trochu jinak 🔄", "To nesedí",
  "Zkus přemýšlet 🧐", "Odpověď je jiná", "Podívej se na to znovu 👀",
];
let praiseIdx = 0;
let incorrectIdx = 0;
const nextPraise = () => PRAISE[praiseIdx++ % PRAISE.length];
const nextIncorrect = () => INCORRECT[incorrectIdx++ % INCORRECT.length];

const QUESTION_TITLES = [
  "Zkus si to! 🎯", "Tvůj tah! 🎲", "A teď ty! ✏️",
  "Poradíš si? 💡", "Co myslíš? 🤔", "Jdeme na to! 🚀",
];
let qTitleIdx = 0;
const nextTitle = () => QUESTION_TITLES[qTitleIdx++ % QUESTION_TITLES.length];

// ── Barvy podle předmětu (stejné jako v SessionView) ──────────────────────
function getSubjectColor(subject?: string) {
  switch (subject) {
    case "matematika": return { bg: "from-blue-50 to-blue-100/50", border: "border-l-blue-400", badge: "bg-blue-100 text-blue-700 border-blue-200" };
    case "čeština":    return { bg: "from-purple-50 to-purple-100/50", border: "border-l-purple-400", badge: "bg-purple-100 text-purple-700 border-purple-200" };
    case "prvouka":    return { bg: "from-green-50 to-green-100/50", border: "border-l-green-400", badge: "bg-green-100 text-green-700 border-green-200" };
    default:           return { bg: "from-secondary to-secondary/50", border: "border-l-primary", badge: "bg-secondary text-secondary-foreground" };
  }
}

// ── Typy fází ──────────────────────────────────────────────────────────────
type Phase = "browse" | "practicing" | "done";

// ── Hlavní komponenta ──────────────────────────────────────────────────────
export function DemoSession() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("browse");
  const [topic, setTopic] = useState<TopicMetadata | null>(null);
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const [taskIdx, setTaskIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [loading] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [answeredTask, setAnsweredTask] = useState<PracticeTask | null>(null);
  const [taskResults, setTaskResults] = useState<("correct" | "wrong" | "help")[]>([]);
  const [questionTitle, setQuestionTitle] = useState(nextTitle());
  const [startTime] = useState(() => Date.now());
  const [helpUsed, setHelpUsed] = useState(false);

  // ── Výběr tématu ────────────────────────────────────────────────────────
  const handleTopicSelect = useCallback((t: TopicMetadata) => {
    const count = t.sessionTaskCount ?? 6;
    const all = t.generator(1);
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, count);
    setTopic(t);
    setTasks(shuffled);
    setTaskIdx(0);
    setUserInput("");
    setCheckFeedback(null);
    setLastAnswerCorrect(null);
    setAnsweredTask(null);
    setTaskResults([]);
    setHelpUsed(false);
    setQuestionTitle(nextTitle());
    setPhase("practicing");
  }, []);

  // ── Odeslání odpovědi ────────────────────────────────────────────────────
  const handleAnswerSubmit = useCallback((answer: string) => {
    const task = tasks[taskIdx];
    if (!task) return;
    const result = validateAnswer(answer.trim(), task.correctAnswer.trim(), {
      inputType: topic?.inputType,
    });
    const correct = result.correct;
    setLastAnswerCorrect(correct);
    setAnsweredTask(task);
    setCheckFeedback(correct ? nextPraise() : nextIncorrect());
    setTaskResults(prev => [...prev, helpUsed ? "help" : correct ? "correct" : "wrong"]);
    setHelpUsed(false);
  }, [tasks, taskIdx, topic, helpUsed]);

  const handleTextSubmit = useCallback(() => {
    if (userInput.trim()) handleAnswerSubmit(userInput);
  }, [userInput, handleAnswerSubmit]);

  // ── Pokračovat na další úlohu ────────────────────────────────────────────
  const handleContinue = useCallback(() => {
    const next = taskIdx + 1;
    if (next >= tasks.length) {
      setPhase("done");
    } else {
      setTaskIdx(next);
      setCheckFeedback(null);
      setLastAnswerCorrect(null);
      setAnsweredTask(null);
      setUserInput("");
      setQuestionTitle(nextTitle());
    }
  }, [taskIdx, tasks.length]);

  const handleReset = useCallback(() => {
    setPhase("browse");
    setTopic(null);
    setTasks([]);
    setCheckFeedback(null);
  }, []);

  // ── BROWSE fáze — výběr tématu ───────────────────────────────────────────
  if (phase === "browse") {
    return <DemoTopicBrowser onSelect={handleTopicSelect} onBack={() => navigate("/demo")} />;
  }

  const currentTask = tasks[taskIdx];
  const subjectColors = getSubjectColor(topic?.subject);
  const isTerminal = phase === "done";
  const showPracticeInput = !isTerminal && !checkFeedback && !!currentTask;

  // ── DONE fáze — výsledky ─────────────────────────────────────────────────
  if (phase === "done" && topic) {
    const correctCount = taskResults.filter(r => r === "correct").length;
    const helpCount = taskResults.filter(r => r === "help").length;
    const wrongCount = taskResults.filter(r => r === "wrong").length;
    const pct = Math.round(((correctCount + helpCount) / tasks.length) * 100);
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";
    const msg = pct >= 80
      ? "Skvělý výsledek! Tohle téma ti jde výborně."
      : pct >= 50
      ? "Dobrá práce! Ještě trochu procvičovat a bude to perfektní."
      : "Tohle téma chce ještě trénink — ale nevzdávej to!";

    return (
      <div className="flex min-h-screen flex-col session-bg-gradient">
        <DemoHeader topic={topic} subjectColors={subjectColors} onReset={handleReset} />
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg space-y-5">
            <div className="bg-white rounded-3xl shadow-sm border border-black/[0.05] px-6 py-10 text-center space-y-5">
              <p className="text-5xl">{emoji}</p>
              <div>
                <p className="font-extrabold text-4xl text-foreground tabular-nums">{correctCount + helpCount} / {tasks.length}</p>
                <p className="text-muted-foreground text-sm mt-1">správných odpovědí ({pct} %)</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-emerald-50 px-3 py-3">
                  <p className="font-extrabold text-xl text-emerald-700">{correctCount}</p>
                  <p className="text-xs text-emerald-600 mt-0.5">samostatně</p>
                </div>
                <div className="rounded-2xl bg-sky-50 px-3 py-3">
                  <p className="font-extrabold text-xl text-sky-700">{helpCount}</p>
                  <p className="text-xs text-sky-600 mt-0.5">s nápovědou</p>
                </div>
                <div className="rounded-2xl bg-rose-50 px-3 py-3">
                  <p className="font-extrabold text-xl text-rose-600">{wrongCount}</p>
                  <p className="text-xs text-rose-500 mt-0.5">chyb</p>
                </div>
              </div>
              <p className="text-sm text-foreground font-medium leading-relaxed">{msg}</p>
            </div>
            <div className="space-y-2.5">
              <Button onClick={() => handleTopicSelect(topic)} className="w-full h-12 rounded-2xl text-sm font-bold">
                Zkusit znovu
              </Button>
              <Button variant="outline" onClick={handleReset} className="w-full h-12 rounded-2xl text-sm font-semibold">
                Vybrat jiné téma
              </Button>
              <button onClick={() => navigate("/demo")} className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Zpět do dema
              </button>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              V plné verzi Oli sleduje pokrok a přizpůsobuje obtížnost automaticky.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── PRACTICING fáze ──────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col session-bg-gradient">
      {/* Demo banner */}
      <div className="bg-[#F97316] text-white px-4 py-1.5 text-xs text-center font-medium">
        Demo — výsledky se neukládají
      </div>

      <DemoHeader topic={topic} subjectColors={subjectColors} onReset={handleReset} startTime={startTime} />

      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl flex flex-col space-y-6">

          {/* Téma + ilustrace */}
          {topic && !isTerminal && (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {(() => {
                  const url = getTopicIllustrationUrl(topic);
                  return url ? <img src={url} alt="" className="w-16 h-16 object-contain shrink-0 self-center mix-blend-multiply" /> : null;
                })()}
                <div className="flex-1 space-y-1">
                  <p className="text-xl font-medium text-foreground">
                    <span className="text-muted-foreground">Téma: </span>
                    {getFullTopicTitle(topic)}
                  </p>
                  <p className="text-base text-muted-foreground">{topic.briefDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progress */}
          {!isTerminal && (
            <ProgressIndicator
              current={taskIdx}
              total={tasks.length}
              results={taskResults}
            />
          )}

          {/* Otázka */}
          {showPracticeInput && (
            <div className="space-y-4">
              <h2 className="text-center text-xl font-semibold text-muted-foreground">
                {questionTitle}
              </h2>
              <PracticeInputRouter
                topic={topic!}
                currentTask={currentTask}
                userInput={userInput}
                loading={loading}
                onUserInputChange={setUserInput}
                onAnswerSubmit={handleAnswerSubmit}
                onTextSubmit={handleTextSubmit}
              />
              <div className="flex justify-center">
                <HelpButton
                  skillId={topic!.id}
                  topic={topic}
                  currentTask={currentTask}
                  onHelpOpened={() => setHelpUsed(true)}
                />
              </div>
            </div>
          )}

          {/* Feedback po odpovědi */}
          {checkFeedback && topic && (
            <CheckFeedbackCard
              checkFeedback={checkFeedback}
              lastAnswerCorrect={lastAnswerCorrect}
              answeredTask={answeredTask}
              topic={topic}
              subjectColors={subjectColors}
              loading={false}
              isTerminal={taskIdx + 1 >= tasks.length}
              onContinue={handleContinue}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ── Výběr tématu (bez Supabase — používá getAllTopics()) ──────────────────
const DEMO_GRADE = 3;

function DemoTopicBrowser({
  onSelect, onBack,
}: {
  onSelect: (t: TopicMetadata) => void;
  onBack: () => void;
}) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allTopics = getAllTopics().filter(
    t => DEMO_GRADE >= t.gradeRange[0] && DEMO_GRADE <= t.gradeRange[1]
  );

  const subjects = [...new Set(allTopics.map(t => t.subject))].sort();

  const topicsForSubject = selectedSubject
    ? allTopics.filter(t => t.subject === selectedSubject)
    : [];

  const categories = selectedSubject
    ? [...new Set(topicsForSubject.map(t => t.category))].sort()
    : [];

  const topicsForCategory = selectedCategory
    ? topicsForSubject.filter(t => t.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className="bg-[#F97316] text-white px-4 py-2 text-sm text-center font-medium">
        Demo — procvičování bez registrace
      </div>
      <header className="bg-white border-b border-black/[0.05] shadow-sm">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center gap-3">
          <button
            onClick={selectedCategory ? () => setSelectedCategory(null) : selectedSubject ? () => setSelectedSubject(null) : onBack}
            className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <OlyLogo size="sm" onClick={onBack} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-foreground">
              {selectedCategory ?? selectedSubject ?? "Procvičovat samostatně"}
            </p>
            <p className="text-[10px] text-muted-foreground">Vyber si téma a začni</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 space-y-3">
        {/* Breadcrumb pills */}
        {(selectedSubject || selectedCategory) && (
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <button onClick={() => { setSelectedSubject(null); setSelectedCategory(null); }} className="text-xs text-primary hover:underline">Předměty</button>
            {selectedSubject && <><span className="text-muted-foreground text-xs">/</span><button onClick={() => setSelectedCategory(null)} className="text-xs text-primary hover:underline">{selectedSubject}</button></>}
            {selectedCategory && <><span className="text-muted-foreground text-xs">/</span><span className="text-xs text-foreground font-medium">{selectedCategory}</span></>}
          </div>
        )}

        {/* Výběr předmětu */}
        {!selectedSubject && subjects.map(subj => {
          const sm = getSubjectMeta(subj);
          const count = allTopics.filter(t => t.subject === subj).length;
          return (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className="w-full text-left bg-white rounded-3xl shadow-sm border border-black/[0.05] px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all group"
            >
              <span className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <IllustrationImg src={sm?.image ?? ""} className="h-8 w-8 object-contain" fallback={<span className="text-xl">{sm?.emoji ?? "📚"}</span>} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-foreground">{sm?.label ?? subj}</p>
                <p className="text-sm text-muted-foreground">{count} témat</p>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          );
        })}

        {/* Výběr kategorie */}
        {selectedSubject && !selectedCategory && categories.map(cat => {
          const topicsInCat = topicsForSubject.filter(t => t.category === cat);
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="w-full text-left bg-white rounded-3xl shadow-sm border border-black/[0.05] px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-foreground">{cat}</p>
                <p className="text-sm text-muted-foreground">{topicsInCat.length} {topicsInCat.length === 1 ? "téma" : "témata"}</p>
              </div>
              <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          );
        })}

        {/* Výběr tématu */}
        {selectedCategory && topicsForCategory.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="w-full text-left bg-white rounded-3xl shadow-sm border border-black/[0.05] px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base text-foreground">{t.title}</p>
              <p className="text-sm text-muted-foreground leading-snug">{t.briefDescription}</p>
            </div>
            <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        ))}

        {!selectedSubject && (
          <p className="text-center text-xs text-muted-foreground pt-2">Demo — výsledky se neukládají.</p>
        )}
      </div>
    </div>
  );
}

// ── Header komponenta ──────────────────────────────────────────────────────
function DemoHeader({
  topic, subjectColors, onReset, startTime,
}: {
  topic: TopicMetadata | null;
  subjectColors: ReturnType<typeof getSubjectColor>;
  onReset: () => void;
  startTime?: number;
}) {
  return (
    <header className="relative border-b px-4 py-3 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <OlyLogo size="sm" onClick={onReset} />
          <Button variant="ghost" size="sm" onClick={onReset} className="text-base">
            ← Zpět
          </Button>
          {topic && (
            <Badge className={`text-base capitalize px-3 py-1 border ${subjectColors.badge}`}>
              {topic.subject}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {startTime && (
            <SessionTimer
              startTime={startTime}
              maxSeconds={600}
              isActive={true}
              onTimeExpired={() => {}}
              countUp={true}
            />
          )}
          <Button variant="ghost" size="sm" onClick={onReset} className="text-base">
            ✕
          </Button>
        </div>
      </div>
    </header>
  );
}
