import { useState, useCallback, useEffect, useRef } from "react";
import type { SessionData, SessionState, PracticeTask, TopicMetadata, Grade } from "@/lib/types";
import { createSession, processState } from "@/lib/sessionOrchestrator";
import { setDiktatFilter } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";
import { useSessionPersistence, clearPersistedSession } from "@/hooks/useSessionPersistence";
import { loadCustomExercises } from "@/lib/customExerciseLoader";
import { filterValidTasks } from "@/lib/taskValidator";
import { markTaskCompleted as markAnonTaskCompleted } from "@/lib/anonProgress";
import { getCurrentAnonGrade } from "@/lib/anonTrial";
import type { DiktatType } from "@/components/DiktatFilterSelect";
import { toast } from "sonner";

const TERMINAL_STATES: SessionState[] = ["END", "STOP_2"];

const PRAISE_VARIANTS = [
  "Správně!", "Výborně!", "Skvělá práce!", "Tak to má být!",
  "Přesně tak!", "Bezchybně!", "Paráda!", "Super!",
  "Máš to!", "Perfektní!", "Jedničková práce!", "Dobře to jde!",
  "Jen tak dál!", "To sedí!", "Správná odpověď!", "Zvládáš to!",
  "Prima!", "Fajn, správně!", "Ano, přesně!", "Bezvadně!",
  "To je ono!", "Máš pravdu!", "Skvěle zvládnuto!", "Bravo!",
  "Žádná chyba!",
];
let praiseIndex = 0;
function getNextPraise(): string {
  const praise = PRAISE_VARIANTS[praiseIndex % PRAISE_VARIANTS.length];
  praiseIndex += 1;
  return praise;
}

const INCORRECT_VARIANTS = [
  "To není ono", "Zkus to ještě jednou", "Tentokrát ne",
  "Ještě to není správně", "Není to úplně přesné", "Trochu jinak",
  "To nesedí", "Tak to nebude", "Ještě zkus přemýšlet",
  "Ne tak docela", "Skoro, ale ne úplně", "To není správná odpověď",
  "Máš to jinak", "Tady je chybka", "Tohle to není",
  "Zatím ne", "Ještě to zkus", "Blízko, ale ne",
  "Podívej se na to znovu", "To úplně nevychází",
  "Zkus jiný postup", "Ještě nad tím popřemýšlej",
  "Není to ono", "Tentokrát se to nepovedlo", "Odpověď je jiná",
];
let incorrectIndex = 0;
function getNextIncorrect(): string {
  const msg = INCORRECT_VARIANTS[incorrectIndex % INCORRECT_VARIANTS.length];
  incorrectIndex += 1;
  return msg;
}

const QUESTION_TITLES = [
  "Zkus si to!", "Tvůj tah!", "A teď ty!",
  "Poradíš si?", "Co myslíš?", "Jdeme na to!",
];
let questionTitleIndex = 0;
function getNextQuestionTitle(): string {
  const t = QUESTION_TITLES[questionTitleIndex % QUESTION_TITLES.length];
  questionTitleIndex += 1;
  return t;
}

// Dekorativní ikony pro rotaci vedle question title — uloženo v Supabase storage
// jako practice-icon-{name}.png.
export const QUESTION_ICONS = [
  "practice-icon-star",
  "practice-icon-lightbulb",
  "practice-icon-rocket",
  "practice-icon-compass",
  "practice-icon-clock",
  "practice-icon-dice",
  "practice-icon-palette",
  "practice-icon-calculator",
  "practice-icon-bell",
];
let questionIconIndex = 0;
function getNextQuestionIcon(): string {
  const icon = QUESTION_ICONS[questionIconIndex % QUESTION_ICONS.length];
  questionIconIndex += 1;
  return icon;
}

export interface SessionDispatchState {
  grade: Grade | null;
  session: SessionData | null;
  output: string;
  practiceQuestion: string | undefined;
  userInput: string;
  isLocked: boolean;
  loading: boolean;
  checkFeedback: string | null;
  lastAnswerCorrect: boolean | null;
  pendingEndSession: SessionData | null;
  revealedAnswer: { answer: string; hint: string } | null;
  explanation: string | null;
  aiEvaluation: string | null;
  aiEvalLoading: boolean;
  evalMinReached: boolean;
  answeredTask: PracticeTask | null;
  /** Index `answeredTask` v `practiceBatch` v okamžiku odpovědi — session.currentTaskIndex
   *  má jinou hodnotu podle toho, jestli šlo o poslední (terminální) úlohu, viz handleAnswerSubmit. */
  answeredTaskIndex: number | null;
  /** Poslední odpověď zvolená žákem — pro cílený feedback v CheckFeedbackCard. */
  selectedAnswer: string;
  questionTitle: string;
  questionIcon: string;
  taskResults: ("correct" | "wrong" | "help")[];
  pendingDiktatTopic: TopicMetadata | null;
}

export interface SessionDispatchActions {
  setGrade: (g: Grade | null) => void;
  setSession: React.Dispatch<React.SetStateAction<SessionData | null>>;
  setOutput: (s: string) => void;
  setUserInput: (s: string) => void;
  setIsLocked: (b: boolean) => void;
  setCheckFeedback: (s: string | null) => void;
  setLastAnswerCorrect: (b: boolean | null) => void;
  setRevealedAnswer: (v: { answer: string; hint: string } | null) => void;
  setExplanation: (s: string | null) => void;
  setAiEvaluation: (s: string | null) => void;
  setAiEvalLoading: (b: boolean) => void;
  setEvalMinReached: (b: boolean) => void;
  setAnsweredTask: (t: PracticeTask | null) => void;
  setPendingDiktatTopic: (t: TopicMetadata | null) => void;
  /** Jen pro obnovu sezení ze zálohy — jinak si výsledky spravuje smyčka sama. */
  setTaskResults: (r: ("correct" | "wrong" | "help")[]) => void;
  handleGradeSelect: (g: Grade) => void;
  handleTopicSelect: (topic: TopicMetadata) => Promise<void>;
  handleDiktatFilterConfirm: (types: DiktatType[]) => Promise<void>;
  handleInputSubmit: () => Promise<void>;
  handleExplainContinue: () => Promise<void>;
  handleAnswerSubmit: (answer: string) => Promise<void>;
  handleTextSubmit: () => Promise<void>;
  handleTimeExpired: () => Promise<void>;
  handleContinueAfterCheck: () => Promise<void>;
  handleRevealAnswer: () => void;
  handleReset: (opts?: { keepBackup?: boolean }) => void;
}

export function useSessionDispatch(): SessionDispatchState & SessionDispatchActions {
  const [pendingDiktatTopic, setPendingDiktatTopic] = useState<TopicMetadata | null>(null);
  const [grade, setGrade] = useState<Grade | null>(() => {
    // Anonymní mód — ročník uložený při onboardingu (single source of truth = trial state)
    const g = getCurrentAnonGrade();
    return (g !== null && g >= 1 && g <= 9) ? (g as Grade) : null;
  });
  const [session, setSession] = useState<SessionData | null>(null);
  const [output, setOutput] = useState("");
  const [practiceQuestion, setPracticeQuestion] = useState<string>();
  const [userInput, setUserInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState<string | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [pendingEndSession, setPendingEndSession] = useState<SessionData | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<{ answer: string; hint: string } | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [aiEvaluation, setAiEvaluation] = useState<string | null>(null);
  const [aiEvalLoading, setAiEvalLoading] = useState(false);
  const [evalMinReached, setEvalMinReached] = useState(true);
  const [answeredTask, setAnsweredTask] = useState<PracticeTask | null>(null);
  const [answeredTaskIndex, setAnsweredTaskIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [questionTitle, setQuestionTitle] = useState(getNextQuestionTitle());
  const [questionIcon, setQuestionIcon] = useState(getNextQuestionIcon());
  const [taskResults, setTaskResults] = useState<("correct" | "wrong" | "help")[]>([]);

  // Auto-persist session to localStorage
  useSessionPersistence(session, taskResults);

  // BUG #4 fix — markovat anon task jako splněný i při částečném pokroku
  // (předčasný odchod ze sezení). Ref nutný — cleanup vidí jen stale closure.
  const latestSessionRef = useRef(session);
  const latestTaskResultsRef = useRef(taskResults);
  const completedRef = useRef(false);
  useEffect(() => { latestSessionRef.current = session; }, [session]);
  useEffect(() => { latestTaskResultsRef.current = taskResults; }, [taskResults]);

  /**
   * Zapíše výsledek úlohy do stavu I do refu naráz.
   *
   * Ref musí být aktuální synchronně — `dispatch` je stabilní callback
   * (deps `[markAssignmentCompleted]`), takže by `taskResults` ze closure
   * viděl navždy prázdné pole z prvního renderu.
   */
  const appendTaskResult = useCallback((r: "correct" | "wrong" | "help") => {
    latestTaskResultsRef.current = [...latestTaskResultsRef.current, r];
    setTaskResults(latestTaskResultsRef.current);
  }, []);

  /** Přepíše výsledky (reset sezení, obnova ze zálohy) — opět stav i ref. */
  const replaceTaskResults = useCallback((next: ("correct" | "wrong" | "help")[]) => {
    latestTaskResultsRef.current = next;
    setTaskResults(next);
  }, []);

  /**
   * Označí anonymní denní úkol za splněný. JEDINÉ místo, kde se počítá skóre.
   *
   * Dřív se počítalo na třech místech a dvě z nich četla `taskResults` ze
   * closure. Unmount cleanup měl ref správně, `handleAnswerSubmit` vycházel
   * správně jen náhodou (recreatuje se na každou změnu `session`, která jde
   * v páru s výsledkem), ale `dispatch` četl vždy prázdné pole — a zapisoval
   * tedy anonymnímu dítěti **skóre 0** pokaždé, když sezení skončilo jinou
   * cestou než odpovědí na poslední úlohu.
   *
   * `requireCorrect` používá jen cleanup na unmount: předčasný odchod bez
   * jediné správné odpovědi se za splněný úkol počítat nemá.
   */
  const completeAnonTask = useCallback((topicId: string | undefined, opts?: { requireCorrect?: boolean }) => {
    if (!topicId) return;
    if (getCurrentAnonGrade() === null) return;
    const results = latestTaskResultsRef.current;
    if (results.length === 0) return;
    const correct = results.filter((r) => r === "correct").length;
    if (opts?.requireCorrect && correct === 0) return;
    markAnonTaskCompleted(topicId, correct / results.length);
    window.dispatchEvent(new CustomEvent("oli-anon-task-completed"));
    completedRef.current = true;
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup na unmount — částečný pokrok při předčasném odchodu.
      if (completedRef.current) return;
      completeAnonTask(latestSessionRef.current?.matchedTopic?.id, { requireCorrect: true });
    };
  }, [completeAnonTask]);

  const markAssignmentCompleted = useCallback(async (skillId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Try child_user_id first, then fallback to parent_user_id (admin/parent preview)
      let child: { id: string } | null = null;
      const { data: childByUser } = await supabase
        .from("children")
        .select("id")
        .eq("child_user_id", user.id)
        .maybeSingle();
      if (childByUser) {
        child = childByUser;
      } else {
        const { data: childByParent } = await supabase
          .from("children")
          .select("id")
          .eq("parent_user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (childByParent) child = childByParent;
      }
      if (!child) return;
      const { data: updated } = await supabase
        .from("parent_assignments")
        .update({ status: "completed" })
        .eq("child_id", child.id)
        .eq("skill_id", skillId)
        .eq("status", "pending")
        .select("id");
      if (updated && updated.length > 0) {
        toast.success("Úkol splněn! 🎉", {
          description: "Tvůj rodič uvidí, že jsi úkol úspěšně zvládl/a.",
        });
      }
    } catch { /* silent */ }
  }, []);

  const dispatch = useCallback(async (currentSession: SessionData, input?: string) => {
    setLoading(true);
    try {
      const s = { ...currentSession, elapsedSeconds: Math.floor((Date.now() - currentSession.startTime) / 1000) };
      const result = await processState(s, input);
      setSession(result.session);
      setOutput(result.output);
      setPracticeQuestion(result.practiceQuestion);
      setUserInput("");
      if (TERMINAL_STATES.includes(result.session.state)) {
        setIsLocked(true);
        setCheckFeedback(null);
        clearPersistedSession();
        // Auto-complete matching parent assignment

        if (result.session.matchedTopic?.id) {
          markAssignmentCompleted(result.session.matchedTopic.id);
          completeAnonTask(result.session.matchedTopic.id);
        }
      }
      return result;
    } catch (err) {
      console.error("[SessionView] dispatch error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [markAssignmentCompleted, completeAnonTask]);

  const handleGradeSelect = useCallback((g: Grade) => {
    setGrade(g);
  }, []);

  const enrichTopicFromDb = useCallback(async (topic: TopicMetadata): Promise<TopicMetadata> => {
    try {
      const { data } = await (supabase as any)
        .from("curriculum_skills")
        .select("session_task_count")
        .eq("code_skill_id", topic.id)
        .maybeSingle();
      if (data?.session_task_count) {
        return { ...topic, sessionTaskCount: data.session_task_count };
      }
    } catch { /* fall through */ }
    return topic;
  }, []);

  const handleTopicSelect = useCallback(async (topic: TopicMetadata) => {
    if (!grade) return;
    if (topic.id === "cz-diktat") {
      setPendingDiktatTopic(topic);
      return;
    }
    // setLoading(true) hned na začátku → SessionView má spolehlivý signál
    // (loading true→false) i pro cesty, které session nevytvoří (prázdné téma).
    setLoading(true);
    try {
      setDiktatFilter(null);
      replaceTaskResults([]);
      const enrichedTopic = await enrichTopicFromDb(topic);

      // Check if this is a DB-only topic (no code generator)
      const isDbOnly = (topic as any)._dbOnly === true;
      let preloadedBatch: PracticeTask[] = [];

      if (isDbOnly) {
        // Load all exercises from custom_exercises table (with format validation)
        preloadedBatch = await loadCustomExercises(topic.id, { inputType: topic.inputType });
        if (preloadedBatch.length === 0) {
          setOutput("Toto cvičení se připravuje. Zkus jiné téma.");
          toast.error("Toto cvičení se připravuje. Zkus jiné téma.");
          return;
        }
      }

      // For topics WITH a generator, also load DB exercises for hybrid mixing
      let dbExercises: PracticeTask[] = [];
      if (!isDbOnly) {
        try {
          dbExercises = await loadCustomExercises(topic.id, { inputType: topic.inputType });
        } catch { /* silent — fallback to pure algo */ }
      }

      const newSession = createSession(grade);
      newSession.matchedTopic = enrichedTopic;
      newSession.childInput = enrichedTopic.title;
      newSession.state = "EXPLAIN" as SessionState;

      // Pre-load custom exercises into the session batch (DB-only topics)
      if (preloadedBatch.length > 0) {
        const taskCount = enrichedTopic.sessionTaskCount ?? 6;
        const validBatch = filterValidTasks(preloadedBatch, topic.inputType);
        newSession.practiceBatch = validBatch.slice(0, taskCount);
        newSession.usedQuestions = newSession.practiceBatch.map(t => t.question);
      }

      // Store DB exercises for hybrid mixing (non-DB-only topics)
      if (dbExercises.length > 0) {
        (newSession as any)._dbExercises = dbExercises;
      }

      // Process EXPLAIN → PRACTICE without an intermediate setSession,
      // jinak by probliknul EXPLAIN screen mezi výběrem tématu a procvičováním.
      const s1 = { ...newSession, elapsedSeconds: 0 };
      const r1 = await processState(s1);
      if (r1.session.state === "EXPLAIN") {
        setExplanation(r1.output);
        const s2 = { ...r1.session, elapsedSeconds: 0 };
        const r2 = await processState(s2);
        setSession(r2.session);
        setOutput(r2.output ?? "");
        setPracticeQuestion(r2.practiceQuestion ?? "");
        setUserInput("");
      } else {
        setSession(r1.session);
        setOutput(r1.output ?? "");
        setPracticeQuestion(r1.practiceQuestion ?? "");
        setUserInput("");
      }
    } catch (err) {
      console.error("[handleTopicSelect] error:", err);
    } finally {
      setLoading(false);
    }
  }, [grade, enrichTopicFromDb, replaceTaskResults]);

  const handleDiktatFilterConfirm = useCallback(async (types: DiktatType[]) => {
    if (!grade || !pendingDiktatTopic) return;
    setDiktatFilter(types);
    setPendingDiktatTopic(null);
    replaceTaskResults([]);
    const enrichedTopic = await enrichTopicFromDb(pendingDiktatTopic);
    const newSession = createSession(grade);
    newSession.matchedTopic = enrichedTopic;
    newSession.childInput = enrichedTopic.title;
    newSession.state = "EXPLAIN" as SessionState;
    const result = await dispatch(newSession);
    if (result?.output) {
      setExplanation(result.output);
    }
  }, [grade, pendingDiktatTopic, dispatch, enrichTopicFromDb, replaceTaskResults]);

  const handleInputSubmit = useCallback(async () => {
    if (!session || isLocked || loading) return;
    if (session.state !== "INPUT_CAPTURE") return;
    if (!userInput.trim()) return;
    await dispatch(session, userInput.trim());
  }, [session, isLocked, loading, userInput, dispatch]);

  const handleExplainContinue = useCallback(async () => {
    if (!session || isLocked || loading) return;
    if (session.state !== "EXPLAIN") return;
    await dispatch(session);
  }, [session, isLocked, loading, dispatch]);

  const handleAnswerSubmit = useCallback(async (answer: string) => {
    if (!session || isLocked || loading) return;
    if (session.state !== "PRACTICE") return;
    setLoading(true);
    try {
      const s = { ...session, elapsedSeconds: Math.floor((Date.now() - session.startTime) / 1000) };
      const answeredTaskSnapshot = session.practiceBatch[session.currentTaskIndex];
      const answeredTaskIdx = session.currentTaskIndex;
      const result = await processState(s, answer);
      setAnsweredTask(answeredTaskSnapshot);
      setAnsweredTaskIndex(answeredTaskIdx);
      setSelectedAnswer(answer);
      setUserInput("");
      const wasCorrect = result.lastAnswerCorrect === true;
      const taskResult: "correct" | "wrong" | "help" = session.helpUsedOnCurrent ? "help" : wasCorrect ? "correct" : "wrong";
      appendTaskResult(taskResult);
      if (TERMINAL_STATES.includes(result.session.state)) {
        setLastAnswerCorrect(wasCorrect);
        const feedbackMsg = wasCorrect ? getNextPraise() : getNextIncorrect();
        setCheckFeedback(feedbackMsg);
        setOutput(feedbackMsg);
        setPracticeQuestion(undefined);
        setPendingEndSession(result.session);
        // `appendTaskResult` výše už ref aktualizoval, takže helper vidí
        // i právě zodpovězenou úlohu.
        completeAnonTask(result.session.matchedTopic?.id);
        return;
      }
      setSession(result.session);
      setLastAnswerCorrect(wasCorrect);
      const feedbackMsg = wasCorrect ? getNextPraise() : getNextIncorrect();
      setCheckFeedback(feedbackMsg);
      setOutput(feedbackMsg);
      setPracticeQuestion(result.practiceQuestion);
    } catch (err) {
      console.error("[SessionView] answer error:", err);
    } finally {
      setLoading(false);
    }
  }, [session, isLocked, loading, appendTaskResult, completeAnonTask]);

  const handleContinueAfterCheck = useCallback(async () => {
    if (!session || loading) return;
    setCheckFeedback(null);
    setLastAnswerCorrect(null);
    setRevealedAnswer(null);
    setAnsweredTask(null);
    setAnsweredTaskIndex(null);
    setSelectedAnswer("");
    setQuestionTitle(getNextQuestionTitle());
    setQuestionIcon(getNextQuestionIcon());
    if (pendingEndSession) {
      setSession(pendingEndSession);
      setOutput("session.ended");
      setIsLocked(true);
      setPendingEndSession(null);
      clearPersistedSession();
      // Auto-complete matching parent assignment
      if (pendingEndSession.matchedTopic?.id) {
        markAssignmentCompleted(pendingEndSession.matchedTopic.id);
      }
      return;
    }
    if (isLocked) return;
    await dispatch(session);
  }, [session, isLocked, loading, dispatch, pendingEndSession, markAssignmentCompleted]);

  const handleRevealAnswer = useCallback(() => {
    if (!session || !session.matchedTopic) return;
    const task = session.practiceBatch[session.currentTaskIndex];
    if (!task) return;
    const help = session.matchedTopic.helpTemplate;
    setRevealedAnswer({
      answer: task.correctAnswer,
      hint: help.hint + " " + help.example,
    });
  }, [session]);

  const handleTextSubmit = useCallback(async () => {
    if (!session || isLocked || loading) return;
    if (session.state === "INPUT_CAPTURE") {
      await handleInputSubmit();
    } else if (session.state === "PRACTICE" && userInput.trim()) {
      await handleAnswerSubmit(userInput.trim());
    }
  }, [session, isLocked, loading, handleInputSubmit, handleAnswerSubmit, userInput]);

  const handleTimeExpired = useCallback(async () => {
    if (!session) return;
    const expired: SessionData = {
      ...session,
      elapsedSeconds: Math.floor((Date.now() - session.startTime) / 1000),
      stopReason: "time_expired",
      state: "STOP_2" as SessionState,
    };
    const result = await processState(expired);
    setSession(result.session);
    setOutput("session.time_expired");
    setIsLocked(true);
    setCheckFeedback(null);
  }, [session]);

  /**
   * Zahodí běžící sezení a vrátí uživatele o úroveň výš.
   *
   * `keepBackup` nechá zálohu v localStorage naživu — použij ho vždy, když
   * dítě jen ODCHÁZÍ (logo, Zpět, ✕, odhlášení). Rozdělaná práce se pak
   * nabídne k obnovení, až se vrátí. Bez něj se 8 z 10 rozpracovaných úloh
   * smaže bez varování jediným kliknutím, což byl nález z UX auditu.
   * Zálohu maže jen dokončené sezení nebo výslovné „Začít znovu".
   */
  const handleReset = useCallback((opts?: { keepBackup?: boolean }) => {
    if (!opts?.keepBackup) clearPersistedSession();
    setSession(null);
    // Anon trial: zachovej grade z localStorage (jinak by GradeSelect ukázal jako bug
    // viz "Zpět" z cvičení = neztratit kontext, ve kterém ročníku dítě je)
    const anonGrade = getCurrentAnonGrade();
    if (anonGrade !== null && anonGrade >= 1 && anonGrade <= 9) {
      setGrade(anonGrade as Grade);
    } else {
      setGrade(null);
    }
    setOutput("");
    setPracticeQuestion(undefined);
    setUserInput("");
    setIsLocked(false);
    setLoading(false);
    setCheckFeedback(null);
    setLastAnswerCorrect(null);
    setRevealedAnswer(null);
    setAnsweredTask(null);
    setAnsweredTaskIndex(null);
    setSelectedAnswer("");
    setExplanation(null);
    setAiEvaluation(null);
    setAiEvalLoading(false);
    setPendingEndSession(null);
    setPendingDiktatTopic(null);
    setDiktatFilter(null);
    replaceTaskResults([]);
  }, [replaceTaskResults]);

  return {
    grade, session, output, practiceQuestion, userInput, isLocked, loading,
    checkFeedback, lastAnswerCorrect, pendingEndSession, revealedAnswer,
    explanation, aiEvaluation, aiEvalLoading, evalMinReached, answeredTask,
    answeredTaskIndex,
    selectedAnswer,
    questionTitle, questionIcon, taskResults, pendingDiktatTopic,
    setTaskResults: replaceTaskResults,
    setGrade, setSession, setOutput, setUserInput, setIsLocked,
    setCheckFeedback, setLastAnswerCorrect, setRevealedAnswer,
    setExplanation, setAiEvaluation, setAiEvalLoading, setEvalMinReached,
    setAnsweredTask, setPendingDiktatTopic,
    handleGradeSelect, handleTopicSelect, handleDiktatFilterConfirm,
    handleInputSubmit, handleExplainContinue, handleAnswerSubmit,
    handleTextSubmit, handleTimeExpired, handleContinueAfterCheck,
    handleRevealAnswer, handleReset,
  };
}

export { TERMINAL_STATES };
