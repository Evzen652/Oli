/**
 * Stránka pro nové heslo nesmí viset na „Načítání…".
 *
 * Do 2026-09-15 čekala jen na hash `type=recovery` nebo na událost
 * PASSWORD_RECOVERY. Klient Supabase ale token z odkazu zpracuje hned při
 * startu aplikace a adresu vyčistí, takže když se stránka připojila, neviděla
 * ani jedno — a uživatel, který klikl na odkaz z e-mailu, koukal na
 * nekonečné načítání (ověřeno na produkci).
 *
 * Mock tu simuluje přesně ten stav: hash je prázdný a událost už proběhla.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const getSession = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: () => getSession(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      updateUser: vi.fn(),
    },
  },
}));

import ResetPassword from "@/pages/ResetPassword";

function vykresli() {
  return render(
    <MemoryRouter>
      <ResetPassword />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  getSession.mockReset();
  window.location.hash = "";
});

describe("ResetPassword", () => {
  it("token zpracovaný ještě před připojením stránky → ukáže formulář", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    vykresli();
    expect(await screen.findByLabelText("Zadejte nové heslo")).toBeInTheDocument();
  });

  it("bez přihlášení z odkazu → hláška o neplatném odkazu, ne nekonečné načítání", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    vykresli();
    expect(await screen.findByText(/už neplatí/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Poslat nový odkaz" })).toBeInTheDocument();
    expect(screen.queryByText("Načítání…")).not.toBeInTheDocument();
  });

  it("propadlý odkaz (#error=…) → hláška i tehdy, když je uživatel přihlášený", async () => {
    window.location.hash = "#error=access_denied&error_code=otp_expired";
    getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } } });
    vykresli();
    expect(await screen.findByText(/už neplatí/)).toBeInTheDocument();
    expect(screen.queryByLabelText("Zadejte nové heslo")).not.toBeInTheDocument();
  });
});
