import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

/**
 * Hook testy s mocked supabase client.
 *
 * Pokrývá:
 *  - useChildStats: agregace session_logs (sessions, tasks, accuracy,
 *    helpUsed, wrong, daysActive, per-skill rozpis)
 *  - useProfile: profil fetch + update
 *  - useUserRole: role lookup z user_roles
 *
 * Strategie: mockujeme supabase před importem hooku, voláme renderHook
 * s vstupními parametry a čekáme na resolve.
 */

// Setup supabase mock
const supabaseMock = {
  auth: { getUser: vi.fn() },
  from: vi.fn(),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseMock,
}));

// Helper: postavit chain builder s pre-set výsledkem
function mkQueryChain(returnValue: { data?: unknown; error?: unknown; count?: number }) {
  const chain: Record<string, unknown> = {};
  ["select", "eq", "gte", "limit", "order"].forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain);
  });
  chain.maybeSingle = vi.fn().mockResolvedValue(returnValue);
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(returnValue).then(resolve);
  // .update().eq() chain
  chain.update = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: returnValue.error ?? null }),
  });
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─────────────────────────────────────────────────────────
// useChildStats
// ─────────────────────────────────────────────────────────

describe("useChildStats — null childId", () => {
  it("childId=null → vrátí prázdné stats, loading=false", async () => {
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sessions).toBe(0);
    expect(result.current.tasks).toBe(0);
    expect(result.current.accuracy).toBe(0);
    expect(result.current.skills).toEqual([]);
  });
});

describe("useChildStats — happy path s logs", () => {
  it("agreguje session_logs: sessions, tasks, accuracy", async () => {
    supabaseMock.from.mockReturnValue(
      mkQueryChain({
        data: [
          { session_id: "s1", skill_id: "skill-a", correct: true, help_used: false, created_at: "2026-05-01T10:00:00Z" },
          { session_id: "s1", skill_id: "skill-a", correct: true, help_used: false, created_at: "2026-05-01T10:01:00Z" },
          { session_id: "s2", skill_id: "skill-b", correct: false, help_used: false, created_at: "2026-05-02T11:00:00Z" },
          { session_id: "s2", skill_id: "skill-b", correct: true, help_used: true, created_at: "2026-05-02T11:01:00Z" },
        ],
        error: null,
      }),
    );
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats("child-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sessions).toBe(2);
    expect(result.current.tasks).toBe(4);
    // independent (correct + !help_used) = 2 / 4 = 50%
    expect(result.current.accuracy).toBe(50);
    expect(result.current.helpUsed).toBe(1);
    expect(result.current.wrong).toBe(1);
    expect(result.current.daysActive).toBe(2);
  });

  it("per-skill rozpis seřazený podle attempts (sestupně)", async () => {
    supabaseMock.from.mockReturnValue(
      mkQueryChain({
        data: [
          { session_id: "s1", skill_id: "skill-a", correct: true, help_used: false, created_at: "2026-05-01T10:00:00Z" },
          { session_id: "s1", skill_id: "skill-b", correct: true, help_used: false, created_at: "2026-05-01T10:01:00Z" },
          { session_id: "s2", skill_id: "skill-b", correct: false, help_used: false, created_at: "2026-05-02T11:00:00Z" },
          { session_id: "s2", skill_id: "skill-b", correct: true, help_used: true, created_at: "2026-05-02T11:01:00Z" },
        ],
        error: null,
      }),
    );
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats("child-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.skills.length).toBe(2);
    // skill-b má 3 attempts, skill-a 1 → b první
    expect(result.current.skills[0].skillId).toBe("skill-b");
    expect(result.current.skills[0].attempts).toBe(3);
    expect(result.current.skills[1].skillId).toBe("skill-a");
  });

  it("DB error → prázdné stats, loading=false", async () => {
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: null, error: { message: "err" } }));
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats("child-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sessions).toBe(0);
    expect(result.current.skills).toEqual([]);
  });

  it("prázdné data → 0 accuracy", async () => {
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: [], error: null }));
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats("child-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.accuracy).toBe(0);
    expect(result.current.tasks).toBe(0);
  });

  it("logs bez skill_id se přeskočí (žádný crash)", async () => {
    supabaseMock.from.mockReturnValue(
      mkQueryChain({
        data: [
          { session_id: "s1", skill_id: null, correct: true, help_used: false, created_at: "2026-05-01T10:00:00Z" },
          { session_id: "s1", skill_id: "skill-a", correct: true, help_used: false, created_at: "2026-05-01T10:01:00Z" },
        ],
        error: null,
      }),
    );
    const { useChildStats } = await import("@/hooks/useChildStats");
    const { result } = renderHook(() => useChildStats("child-1"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    // jen 1 skill v rozpisu (skill-a)
    expect(result.current.skills.length).toBe(1);
    // ale tasks počítá oba (2)
    expect(result.current.tasks).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────
// useProfile
// ─────────────────────────────────────────────────────────

describe("useProfile", () => {
  it("no auth user → loading=false, profile=null", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { useProfile } = await import("@/hooks/useProfile");
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
  });

  it("auth user + DB row → profile loaded", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(
      mkQueryChain({
        data: { id: "p1", user_id: "user-1", display_name: "Eva", locale: "cs", created_at: "2026-01-01" },
      }),
    );
    const { useProfile } = await import("@/hooks/useProfile");
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile?.display_name).toBe("Eva");
    expect(result.current.profile?.locale).toBe("cs");
  });

  it("updateProfile bez auth → throws", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { useProfile } = await import("@/hooks/useProfile");
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.updateProfile({ display_name: "X" })).rejects.toThrow(/Not authenticated/);
  });

  it("updateProfile s auth + happy path", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(
      mkQueryChain({ data: { id: "p1", user_id: "user-1", display_name: "Eva", locale: "cs", created_at: "x" } }),
    );
    const { useProfile } = await import("@/hooks/useProfile");
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.updateProfile({ display_name: "Pavel" })).resolves.not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────
// useUserRole
// ─────────────────────────────────────────────────────────

describe("useUserRole", () => {
  it("no auth → role=null, loading=false", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    const { useUserRole } = await import("@/hooks/useUserRole");
    const { result } = renderHook(() => useUserRole());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBeNull();
  });

  it("auth user + admin role → role='admin'", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: { role: "admin" } }));
    const { useUserRole } = await import("@/hooks/useUserRole");
    const { result } = renderHook(() => useUserRole());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe("admin");
  });

  it("auth user + parent role → role='parent'", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: { role: "parent" } }));
    const { useUserRole } = await import("@/hooks/useUserRole");
    const { result } = renderHook(() => useUserRole());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe("parent");
  });

  it("auth user + child role → role='child'", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: { role: "child" } }));
    const { useUserRole } = await import("@/hooks/useUserRole");
    const { result } = renderHook(() => useUserRole());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe("child");
  });

  it("auth user bez záznamu v user_roles → role=null", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: null }));
    const { useUserRole } = await import("@/hooks/useUserRole");
    const { result } = renderHook(() => useUserRole());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBeNull();
  });
});
