import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

/**
 * Skóre anonymního denního úkolu — regrese na stale closure.
 *
 * `useSessionDispatch` počítal skóre na TŘECH místech. Dvě z nich četla stav
 * `taskResults` přes closure:
 *  - cleanup na unmount měl ref → správně,
 *  - `handleAnswerSubmit` vycházel správně jen náhodou (recreatuje se na každou
 *    změnu `session`, která jde v páru se zápisem výsledku),
 *  - `dispatch` je ale stabilní callback (deps `[markAssignmentCompleted]`),
 *    takže viděl `taskResults` zmrazené z prvního renderu — vždy prázdné pole.
 *    Skóre proto vycházelo **0** pokaždé, když sezení skončilo přes `dispatch`.
 *
 * Ta cesta je reálná: `evaluateStop` vrací STOP_2 při vyčerpání času sezení
 * (8 min pro 2.–3. ročník), takže dítě, které se do limitu nevejde, mělo
 * úkol zapsaný s nulou bez ohledu na to, kolik úloh vyřešilo správně.
 *
 * Test jede přes veřejné API hooku — nešahá na interní helper, aby ho
 * neuzamkl do konkrétní implementace.
 */

// `vi.mock` se hoistuje nad tělo souboru, takže mocky musí vzniknout
// ve `vi.hoisted` — jinak je factory nevidí (performanceTracker si supabase
// vytáhne dřív než by se stihly inicializovat běžné konstanty).
const { supabaseMock, markTaskCompleted } = vi.hoisted(() => ({
  supabaseMock: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    from: vi.fn(),
  },
  markTaskCompleted: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));
vi.mock("@/lib/anonProgress", () => ({ markTaskCompleted }));

vi.mock("@/lib/anonTrial", () => ({
  getCurrentAnonGrade: () => 3,
}));

vi.mock("@/lib/customExerciseLoader", () => ({
  loadCustomExercises: vi.fn().mockResolvedValue([]),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { useSessionDispatch } from "@/hooks/useSessionDispatch";
import { getAllTopics } from "@/lib/contentRegistry";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

/** První téma 3. ročníku s dost úlohami, ať se dá odpovídat opakovaně. */
function pickTopic() {
  const topic = getAllTopics().find(
    (t) => t.gradeRange[0] <= 3 && t.gradeRange[1] >= 3 && t.inputType === "select_one",
  );
  if (!topic) throw new Error("fixture: žádné select_one téma pro 3. ročník");
  return topic;
}

describe("anonymní denní úkol — skóre se počítá ze skutečných výsledků", () => {
  it("konec sezení přes dispatch (vyčerpaný čas) nezapíše nulu", async () => {
    const topic = pickTopic();
    const { result } = renderHook(() => useSessionDispatch());

    await act(async () => { result.current.handleGradeSelect(3); });
    await act(async () => { await result.current.handleTopicSelect(topic); });
    await waitFor(() => expect(result.current.session).not.toBeNull());

    // Odpověz správně na první úlohu → jeden výsledek "correct" v taskResults.
    const task = result.current.session!.practiceBatch[0];
    await act(async () => { await result.current.handleAnswerSubmit(task.correctAnswer); });
    await waitFor(() => expect(result.current.taskResults.length).toBe(1));
    expect(result.current.taskResults[0]).toBe("correct");

    // Posuň start sezení do minulosti → `evaluateStop` vrátí STOP_2
    // a `handleContinueAfterCheck` skončí sezení cestou přes `dispatch`.
    act(() => {
      result.current.setSession({
        ...result.current.session!,
        startTime: Date.now() - 60 * 60 * 1000,
      });
    });
    await act(async () => { await result.current.handleContinueAfterCheck(); });

    await waitFor(() => expect(markTaskCompleted).toHaveBeenCalled());
    const [, score] = markTaskCompleted.mock.calls.at(-1)!;
    // Před opravou tudy prošla vždy 0, protože `dispatch` četl prázdné pole.
    expect(score).toBeGreaterThan(0);
  });

  it("obnova sezení ze zálohy promítne výsledky i do skóre", async () => {
    const topic = pickTopic();
    const { result } = renderHook(() => useSessionDispatch());

    await act(async () => { result.current.handleGradeSelect(3); });
    await act(async () => { await result.current.handleTopicSelect(topic); });
    await waitFor(() => expect(result.current.session).not.toBeNull());

    // Simuluj „Pokračovat" v recovery dialogu: 3 správné, 1 špatná.
    act(() => {
      result.current.setTaskResults(["correct", "correct", "wrong", "correct"]);
      result.current.setSession({
        ...result.current.session!,
        startTime: Date.now() - 60 * 60 * 1000,
      });
    });
    await act(async () => { await result.current.handleContinueAfterCheck(); });

    await waitFor(() => expect(markTaskCompleted).toHaveBeenCalled());
    const [, score] = markTaskCompleted.mock.calls.at(-1)!;
    expect(score).toBeCloseTo(0.75, 5);
  });
});
