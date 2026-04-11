import type { SessionData, SessionState, Grade, PracticeTask } from "./types";
import { getFullTopicTitle } from "./types";
import { getRulesForGrade, evaluateStop } from "./ruleEngine";
import { matchTopic, getPrerequisites, getTopicById } from "./contentRegistry";
import { generateResponse, generatePracticeBatch, generateMockExplain, generateMockBatch } from "./aiExecution";
import { logSession } from "./logger";
import { classifyIntent, CONFUSION_THRESHOLD } from "./preIntent";
import { checkBoundaryViolation } from "./boundaryEnforcement";
import { classifySemanticInput } from "./semanticGate";
import type { SemanticGateResult } from "./semanticGate";
import { recordCheckResult } from "./performanceTracker";
import { computeAdaptiveDecision, clampLevel, type SkillSnapshot } from "./adaptiveEngine";

/** EMA alpha for mastery calculation */
const EMA_ALPHA = 0.3;

/** Filter out already-used questions from a batch and track new ones. */
function deduplicateBatch(batch: PracticeTask[], usedQuestions: string[]): PracticeTask[] {
  const filtered = batch.filter(t => !usedQuestions.includes(t.question));
  return filtered.length > 0 ? filtered : batch; // fallback if all used
}

/** Create a new session. */
export function createSession(grade: Grade): SessionData {
  return {
    id: crypto.randomUUID(),
    state: "INIT",
    grade,
    startTime: Date.now(),
    elapsedSeconds: 0,
    matchedTopic: null,
    childInput: "",
    errorCount: 0,
    confusionCount: 0,
    stopReason: null,
    rules: getRulesForGrade(grade),
    practiceBatch: [],
    currentTaskIndex: 0,
    errorStreak: 0,
    successStreak: 0,
    usedQuestions: [],
    helpUsedCount: 0,
    helpUsedOnCurrent: false,
    currentLevel: 1,
    adaptiveHelpOffered: false,
  };
}

/** Compute EMA mastery from streaks and error count */
function computeMastery(session: SessionData): number {
  const total = session.errorStreak + session.successStreak + session.errorCount;
  if (total === 0) return 0.5;
  const correctRatio = session.successStreak / Math.max(1, session.currentTaskIndex + 1);
  // EMA: blend previous estimate with current observation
  return EMA_ALPHA * correctRatio + (1 - EMA_ALPHA) * 0.5;
}

/**
 * Valid state transitions.
 */
const TRANSITIONS: Record<SessionState, SessionState[]> = {
  INIT: ["INPUT_CAPTURE"],
  INPUT_CAPTURE: ["PRE_INTENT"],
  PRE_INTENT: ["INPUT_CAPTURE", "TOPIC_MATCH", "STOP_1", "STOP_2"],
  TOPIC_MATCH: ["EXPLAIN", "STOP_2"],
  EXPLAIN: ["PRACTICE", "STOP_1", "STOP_2"],
  PRACTICE: ["CHECK", "STOP_1", "STOP_2", "END"],
  CHECK: ["EXPLAIN", "PRACTICE", "STOP_1", "STOP_2", "END"],
  STOP_1: ["EXPLAIN", "INPUT_CAPTURE"],
  STOP_2: ["END"],
  END: [],
};

/** Attempt a state transition. Returns updated session or throws. */
export function transition(session: SessionData, to: SessionState): SessionData {
  const allowed = TRANSITIONS[session.state];
  if (!allowed.includes(to)) {
    throw new Error(`Invalid transition: ${session.state} → ${to}`);
  }
  const updated = { ...session, state: to };
  logSession(updated);
  return updated;
}

/** Process the current state and return next session + output text. */
export async function processState(session: SessionData, userInput?: string): Promise<{
  session: SessionData;
  output: string;
  practiceQuestion?: string;
  lastAnswerCorrect?: boolean;
}> {
  let s = { ...session };

  // Update elapsed time
  s.elapsedSeconds = Math.floor((Date.now() - s.startTime) / 1000);

  switch (s.state) {
    case "INIT": {
      s = transition(s, "INPUT_CAPTURE");
      return {
        session: s,
        output: "S čím potřebuješ pomoct? Popiš, co teď probíráte ve škole.",
      };
    }

    case "INPUT_CAPTURE": {
      if (!userInput?.trim()) {
        return { session: s, output: "Napiš, s čím potřebuješ pomoct." };
      }
      s.childInput = userInput.trim();
      s = transition(s, "PRE_INTENT");
      return processState(s);
    }

    case "PRE_INTENT": {
      let intent = classifyIntent(s.childInput, s.grade);

      // Wrong grade: topic exists but not for this grade → immediate feedback, no AI call
      if (intent === "wrong_grade") {
        s = transition(s, "INPUT_CAPTURE");
        return {
          session: s,
          output: "Toto téma není pro tvůj ročník. Zkus popsat, co probíráte ve škole.",
        };
      }

      // AI Semantic Gate: call directly in core before STOP decision (with timeout)
      if (intent === "nonsense") {
        const semanticResult = await classifySemanticInput(s.childInput);
        if (semanticResult.semantic_valid === true) {
          intent = "confusion";
        }
      }

      if (intent === "unclear_input") {
        s = transition(s, "INPUT_CAPTURE");
        return {
          session: s,
          output: "Zkus popsat, co probíráte ve škole. Například: porovnávání čísel.",
        };
      }

      if (intent === "nonsense") {
        s.stopReason = "nonsense_input";
        s = transition(s, "STOP_2");
        return {
          session: s,
          output: "Nerozumím zadání. Požádej o pomoc rodiče nebo učitele.",
        };
      }

      if (intent === "confusion") {
        s.confusionCount += 1;
        if (s.confusionCount >= CONFUSION_THRESHOLD) {
          s.stopReason = "confusion_threshold";
          s = transition(s, "STOP_1");
          return {
            session: s,
            output: "Zkusíme to jednodušeji. Popiš, co probíráte ve škole.",
          };
        }
        s = transition(s, "INPUT_CAPTURE");
        return {
          session: s,
          output: "Zkus popsat, co probíráte ve škole. Například: porovnávání čísel.",
        };
      }

      // intent === "topical" → proceed to TOPIC_MATCH
      s = transition(s, "TOPIC_MATCH");
      return processState(s);
    }

    case "TOPIC_MATCH": {
      const topic = matchTopic(s.childInput, s.grade);
      if (!topic) {
        s.stopReason = "no_topic_match";
        s = transition(s, "STOP_2");
        return {
          session: s,
          output: "Nepodařilo se najít odpovídající téma. Požádej o pomoc rodiče nebo učitele.",
        };
      }
      s.matchedTopic = topic;
      s = transition(s, "EXPLAIN");
      return processState(s);
    }

    case "EXPLAIN": {
      // Check STOP conditions first
      const stop = evaluateStop(s);
      if (stop === "STOP_2") {
        s.stopReason = "stop_triggered";
        s = transition(s, "STOP_2");
        return {
          session: s,
          output: "Potřebuješ pomoc od dospělého. Požádej rodiče nebo učitele.",
        };
      }

      // If batch has remaining tasks, skip and go straight to PRACTICE
      if (s.practiceBatch.length > 0 && s.currentTaskIndex < s.practiceBatch.length) {
        s = transition(s, "PRACTICE");
        return processState(s);
      }

      // DETERMINISTIC: use topic.generator for instant response (<60ms)
      const aiRequest = {
        type: "explain" as const,
        topic: s.matchedTopic!,
        grade: s.grade,
        childInput: s.childInput,
        previousErrors: s.errorCount,
      };

      const response = generateMockExplain(aiRequest);
      const rawBatch = generateMockBatch(aiRequest, s.currentLevel);
      let batch = deduplicateBatch(rawBatch, s.usedQuestions);

      // Hybrid mixing: inject up to 2 DB exercises into the algo batch
      const dbExercisesExplain: PracticeTask[] = (s as any)._dbExercises ?? [];
      if (dbExercisesExplain.length > 0) {
        const maxDb = 2;
        const dbSlice = dbExercisesExplain
          .filter(t => !s.usedQuestions.includes(t.question))
          .slice(0, maxDb);
        if (dbSlice.length > 0) {
          const algoCount = Math.max(batch.length - dbSlice.length, batch.length - maxDb);
          const combined = [...batch.slice(0, algoCount), ...dbSlice];
          batch = combined.sort(() => Math.random() - 0.5);
        }
      }

      s.practiceBatch = batch;
      s.currentTaskIndex = 0;
      s.usedQuestions = [...s.usedQuestions, ...batch.map(t => t.question)];

      if (stop === "STOP_1") {
        s = transition(s, "STOP_1");
        return { session: s, output: response.content };
      }

      s = transition(s, "PRACTICE");
      return processState(s);
    }

    case "STOP_1": {
      // If no topic matched yet (e.g. confusion_threshold), return to INPUT_CAPTURE
      if (!s.matchedTopic) {
        s = transition(s, "INPUT_CAPTURE");
        return {
          session: s,
          output: "Zkusíme to jinak. Popiš, co probíráte ve škole.",
        };
      }
      // DETERMINISTIC: use mock explain (no async AI call)
      s = transition(s, "EXPLAIN");
      const response = generateMockExplain({
        type: "explain",
        topic: s.matchedTopic,
        grade: s.grade,
        childInput: s.childInput,
        previousErrors: s.errorCount,
      });
      return { session: s, output: response.content };
    }

    case "PRACTICE": {
      // If user submitted an answer → local CHECK (no AI call)
      if (userInput?.trim()) {
        if (s.matchedTopic && checkBoundaryViolation(userInput.trim(), s.matchedTopic)) {
          s.stopReason = "boundary_violation";
          s = transition(s, "STOP_2");
          return { session: s, output: "Potřebuješ pomoc od dospělého. Požádej rodiče nebo učitele." };
        }
        s = transition(s, "CHECK");
        return processState(s, userInput);
      }

      const stop = evaluateStop(s);
      if (stop === "STOP_2") {
        s.stopReason = "stop_triggered";
        s = transition(s, "STOP_2");
        return { session: s, output: "Potřebuješ pomoc od dospělého. Požádej rodiče nebo učitele." };
      }

      // If batch exhausted → END (don't regenerate — batch = fixed set of tasks)
      if (s.practiceBatch.length > 0 && s.currentTaskIndex >= s.practiceBatch.length) {
        s = transition(s, "END");
        return { session: s, output: "Všechny úlohy dokončeny." };
      }

      // Generate initial batch if empty — DETERMINISTIC via topic.generator
      if (s.practiceBatch.length === 0) {
        const rawBatch = generateMockBatch({
          type: "practice",
          topic: s.matchedTopic!,
          grade: s.grade,
          childInput: s.childInput,
          previousErrors: s.errorCount,
        }, s.currentLevel);
        let batch = deduplicateBatch(rawBatch, s.usedQuestions);

        // Hybrid mixing: inject up to 2 DB exercises into the algo batch
        const dbExercises: PracticeTask[] = (s as any)._dbExercises ?? [];
        if (dbExercises.length > 0) {
          const maxDb = 2;
          const dbSlice = dbExercises
            .filter(t => !s.usedQuestions.includes(t.question))
            .slice(0, maxDb);
          if (dbSlice.length > 0) {
            // Take fewer algo tasks to make room
            const algoCount = Math.max(batch.length - dbSlice.length, batch.length - maxDb);
            const combined = [...batch.slice(0, algoCount), ...dbSlice];
            // Shuffle so DB tasks aren't always at the end
            batch = combined.sort(() => Math.random() - 0.5);
          }
        }

        s.practiceBatch = batch;
        s.currentTaskIndex = 0;
        s.usedQuestions = [...s.usedQuestions, ...batch.map(t => t.question)];
      }

      const task = s.practiceBatch[s.currentTaskIndex];
      return {
        session: s,
        output: "Vyřeš úlohu:",
        practiceQuestion: task.question,
      };
    }

    case "CHECK": {
      if (userInput?.trim() && s.matchedTopic && checkBoundaryViolation(userInput.trim(), s.matchedTopic)) {
        s.stopReason = "boundary_violation";
        s = transition(s, "STOP_2");
        return { session: s, output: "Potřebuješ pomoc od dospělého. Požádej rodiče nebo učitele." };
      }

      // Local deterministic evaluation
      const task = s.practiceBatch[s.currentTaskIndex];
      const answer = (userInput || "").trim();
      const correct = task ? answer === task.correctAnswer.trim() : false;

      // Update streaks
      if (correct) {
        s.successStreak += 1;
        s.errorStreak = 0;
        // Track if help was used on this task
        if (s.helpUsedOnCurrent) {
          s.helpUsedCount += 1;
        }
      } else {
        s.errorStreak += 1;
        s.successStreak = 0;
      }

      // Fire-and-forget: record result for persistence (async, non-blocking)
      if (s.matchedTopic && task) {
        recordCheckResult({
          sessionId: s.id,
          skillId: s.matchedTopic.id,
          level: s.matchedTopic.defaultLevel ?? 1,
          exampleId: `${s.matchedTopic.id}_${s.currentTaskIndex}`,
          correct,
          responseTimeMs: 0,
          errorType: correct ? undefined : "wrong_answer",
          helpUsed: s.helpUsedOnCurrent,
        });
      }

      // Adaptive decision (synchronous, deterministic) — using real mastery
      const mastery = computeMastery(s);
      const adaptiveSnapshot: SkillSnapshot = {
        mastery_score: mastery,
        error_streak: s.errorStreak,
        success_streak: s.successStreak,
        attempts_total: s.currentTaskIndex + 1,
      };
      const adaptive = computeAdaptiveDecision(adaptiveSnapshot);

      // ADAPTIVE ENGINE — active: apply levelDelta and offerHelp
      // fallbackToPrerequisite is deferred (requires mid-session topic switch)
      s.currentLevel = clampLevel(s.currentLevel + adaptive.levelDelta);
      s.adaptiveHelpOffered = adaptive.offerHelp;

      if (correct) {
        s.currentTaskIndex += 1;
        s.helpUsedOnCurrent = false; // Reset for next task
        if (s.currentTaskIndex >= s.practiceBatch.length) {
          s = transition(s, "END");
          return { session: s, output: "Správně! Všechny úlohy zvládnuty.", lastAnswerCorrect: true };
        }
        // Same topic with remaining tasks → skip EXPLAIN, go directly to PRACTICE
        s = transition(s, "PRACTICE");
        const next = await processState(s);
        return { ...next, lastAnswerCorrect: true };
      }

      // Wrong answer — advance to next task
      s.errorCount += 1;
      s.currentTaskIndex += 1;
      s.helpUsedOnCurrent = false;

      // Check only time-based stop (the only remaining evaluateStop trigger)
      const stop = evaluateStop(s);
      if (stop === "STOP_2") {
        s.stopReason = "time_expired";
        s = transition(s, "STOP_2");
        return { session: s, output: "Čas vypršel. Požádej o pomoc rodiče nebo učitele.", lastAnswerCorrect: false };
      }

      // If batch complete after wrong answer → END
      if (s.currentTaskIndex >= s.practiceBatch.length) {
        s = transition(s, "END");
        return { session: s, output: "Všechny úlohy dokončeny.", lastAnswerCorrect: false };
      }

      // Same topic → skip EXPLAIN, go directly to PRACTICE
      s = transition(s, "PRACTICE");
      const next = await processState(s);
      return { ...next, lastAnswerCorrect: false };
    }

    case "STOP_2": {
      s = transition(s, "END");
      return {
        session: s,
        output: "Sezení ukončeno. Požádej o pomoc rodiče nebo učitele.",
      };
    }

    case "END": {
      return {
        session: s,
        output: "Sezení bylo ukončeno.",
      };
    }

    default:
      return { session: s, output: "Neznámý stav." };
  }
}