import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChildActivityChart } from "@/components/ChildActivityChart";

/**
 * Regrese: tlačítko "Skrýt"/"Zobrazit" u panelu "Aktivita za 7 dní" nešlo
 * zavřít, když byla nějaká aktivita — `open={open || shouldDefaultOpen}` je
 * vždy `true`, pokud je `shouldDefaultOpen` (odvozené z dat, ne z uživatelské
 * akce) `true`. Oprava: výchozí stav se nastaví přes `useEffect` jen při
 * změně dat, další toggle plně řídí uživatel.
 */

const { supabaseMock } = vi.hoisted(() => ({
  supabaseMock: { from: vi.fn() },
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: supabaseMock,
}));

function mkQueryChain(returnValue: { data?: unknown; error?: unknown }) {
  const chain: Record<string, unknown> = {};
  ["select", "eq", "gte", "lte", "order"].forEach((m) => {
    chain[m] = vi.fn().mockReturnValue(chain);
  });
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(returnValue).then(resolve);
  return chain;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ChildActivityChart — collapse toggle", () => {
  it("s aktivitou: panel je defaultně otevřený a Skrýt ho skutečně zavře", async () => {
    supabaseMock.from.mockReturnValue(
      mkQueryChain({
        data: [
          { created_at: new Date().toISOString(), correct: true, help_used: false, skill_id: "skill-a" },
        ],
        error: null,
      }),
    );

    render(<ChildActivityChart childId="child-1" />);

    await waitFor(() => expect(screen.getByText("Skrýt")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Aktivita za 7 dní"));

    await waitFor(() => expect(screen.getByText("Zobrazit")).toBeInTheDocument());
  });

  it("bez aktivity: panel je defaultně zavřený a jde ho otevřít", async () => {
    supabaseMock.from.mockReturnValue(mkQueryChain({ data: [], error: null }));

    render(<ChildActivityChart childId="child-2" />);

    await waitFor(() => expect(screen.getByText("Zobrazit")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Aktivita za 7 dní"));

    await waitFor(() => expect(screen.getByText("Skrýt")).toBeInTheDocument());
  });
});
