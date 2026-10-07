/**
 * Mazání jednoho dítěte — `supabase/functions/delete-child`.
 *
 * Proč: rodičovský přehled mazal dítě přímo z klienta (`children.delete()`)
 * a dialog přitom slibuje „Všechna data budou nenávratně ztracena". Zůstával
 * účet dítěte v auth (s jeho jménem v metadatech), `student_skill_level`
 * a řádky pod jeho `user_id`. Edge funkce se v testech nespouští (Deno,
 * service role), takže měřítka jsou konstrukční — nad zdrojákem:
 *
 *  1. funkce maže pro dítě VŠECHNO, co pro dítě maže `delete-account`
 *     (dva seznamy, které se snadno rozejdou — přibude tabulka jen v jednom);
 *  2. vlastnictví se ověřuje proti rodiči z JWT, ne proti tělu požadavku;
 *  3. cizí dítě nedostane 404 — ta znamená „funkce nenasazená" a klient by
 *     podle ní přešel na staré mazání;
 *  4. klient maže přes funkci, ne napřímo.
 *
 * Ověřeno obráceně (2026-10-07): po odebrání `student_skill_level` z funkce
 * padá měřítko 1, po přepnutí odpovědi na 404 měřítko 3, po vrácení
 * přímého `children.delete()` do `deleteChild` měřítko 4.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { funkceNedostupna } from "@/lib/edgeFunctionError";

const cti = (p: string) => readFileSync(resolve(__dirname, "../..", p), "utf-8");
const FUNKCE = cti("supabase/functions/delete-child/index.ts");
const UCET = cti("supabase/functions/delete-account/index.ts");
const HOOK = cti("src/hooks/useChildren.ts");

/** Dvojice „tabulka.sloupec" ze všech volání `smaz("…", "…", …)`. */
function mazane(src: string): Set<string> {
  return new Set([...src.matchAll(/smaz\("([a-z_]+)",\s*"([a-z_]+)"/g)].map((m) => `${m[1]}.${m[2]}`));
}

/** To, co `delete-account` maže jen kvůli rodiči, k jednomu dítěti nepatří. */
const JEN_RODIC = new Set([
  "parent_invitations.email",       // pozvánky na e-mail rodiče
  "parent_assignments.parent_user_id",
  "children.parent_user_id",        // všechny děti rodiče
]);

describe("delete-child", () => {
  it("maže pro dítě všechno, co pro něj maže delete-account", () => {
    const funkce = mazane(FUNKCE);
    const chybi = [...mazane(UCET)].filter((t) => !JEN_RODIC.has(t) && !funkce.has(t));
    expect(chybi).toEqual([]);
  });

  it("maže i účet dítěte v auth a samotný řádek dítěte", () => {
    expect(FUNKCE).toMatch(/auth\.admin\.deleteUser\(/);
    expect(FUNKCE).toMatch(/\.from\("children"\)\s*\.delete\(\)/);
  });

  it("dítě musí patřit rodiči z JWT", () => {
    expect(FUNKCE).toMatch(/const uid = userData\.user\.id;/);
    // výběr i smazání řádku dítěte jsou omezené na rodiče
    expect(FUNKCE.match(/\.eq\("parent_user_id", uid\)/g)?.length).toBeGreaterThanOrEqual(2);
    // rodič se nesmí dostat mezi auth id mazaného dítěte
    expect(FUNKCE).toMatch(/childUserId !== uid/);
  });

  it("cizí nebo neexistující dítě dostane 403, ne 404", () => {
    expect(FUNKCE).not.toMatch(/,\s*404\)/);
    expect(FUNKCE.match(/"Dítě nenalezeno\." \}, 403\)/g)?.length).toBe(2);
    // a klient 403 za nenasazenou funkci nepovažuje
    expect(funkceNedostupna({ context: { status: 403 } })).toBe(false);
    expect(funkceNedostupna({ context: { status: 404 } })).toBe(true);
  });

  it("vyžaduje potvrzovací slovo", () => {
    expect(FUNKCE).toMatch(/body\.confirm !== "SMAZAT"/);
    expect(HOOK).toMatch(/confirm: "SMAZAT"/);
  });

  it("klient maže přes funkci; napřímo jen když funkce nasazená není", () => {
    const telo = HOOK.slice(HOOK.indexOf("const deleteChild"), HOOK.indexOf("}, [fetchChildren]);", HOOK.indexOf("const deleteChild")));
    expect(telo).toMatch(/functions\.invoke\("delete-child"/);
    const prime = telo.indexOf('.from("children")');
    expect(prime, "přímé mazání jen ve větvi pro nenasazenou funkci").toBeGreaterThan(telo.indexOf("funkceNedostupna(error)"));
  });
});
