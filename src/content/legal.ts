/**
 * Údaje pro právní stránky (Zásady soukromí, Podmínky použití).
 *
 * ⚠️ ČTYŘI HODNOTY DOLE MUSÍ VYPLNIT PROVOZOVATEL. Nejsou vymyšlené schválně —
 * identita správce údajů a kontakt pro uplatnění práv jsou právně závazné údaje
 * a nikdo je za tebe uhodnout nemůže. Dokud tam zůstane `DOPLNIT`, stránky to
 * vykreslí jako viditelný žlutý zástupný text a ve vývoji navíc hlásí banner —
 * schválně, aby nešly nasadit nedopatřením.
 *
 * Bez vyplnění NEODEVZDÁVEJ do Google Play ani App Store: obojí vyžaduje
 * funkční URL se zásadami a kontrolují ji při review.
 */

/** Značka nevyplněné hodnoty. Stránky ji rozpoznají a zvýrazní. */
export const DOPLNIT = "DOPLNIT" as const;

export interface Provozovatel {
  /** Obchodní firma nebo jméno a příjmení fyzické osoby. */
  nazev: string;
  /** IČO, pokud podnikáš. U fyzické osoby nepodnikatele nech `null`. */
  ico: string | null;
  /** Sídlo / místo podnikání — ulice, město, PSČ. */
  adresa: string;
  /** E-mail pro uplatnění práv subjektu údajů. Musí být funkční a čtený. */
  email: string;
}

/**
 * ⚠️ VYPLŇ. Viz hlavička souboru.
 */
export const PROVOZOVATEL: Provozovatel = {
  nazev: DOPLNIT,
  ico: DOPLNIT,
  adresa: DOPLNIT,
  email: DOPLNIT,
};

/** Datum účinnosti obou dokumentů. Při každé věcné změně posuň. */
export const UCINNE_OD = "6. 9. 2026";

/**
 * Jak dlouho držíme data po zrušení účtu, než je smažeme natvrdo.
 * Krátká lhůta je pojistka proti omylu („smazal jsem to omylem"), ne archiv.
 */
export const LHUTA_SMAZANI = "třicet dnů";

/** Jak dlouho žije serverová kopie anonymního pokroku bez další aktivity. */
export const LHUTA_ANON = "dvanáct měsíců";

/** Je hodnota nevyplněná? */
export function chybi(v: string | null): boolean {
  return v === DOPLNIT;
}

/** Zbývá něco vyplnit? Používá dev banner na právních stránkách. */
export function chybiCokoliv(): boolean {
  return Object.values(PROVOZOVATEL).some((v) => chybi(v as string | null));
}

/**
 * Třetí strany, kterým se data dostanou do rukou. Seznam je odvozený z kódu,
 * ne z představy — každá položka odpovídá konkrétnímu volání:
 *
 *   Supabase   — `src/integrations/supabase/client.ts`, všechny edge funkce
 *   Jazykový   — `supabase/functions/_shared/aiCall.ts` routuje podle toho, který
 *   model        klíč je nastavený: Groq (`api.groq.com`) nebo Google
 *                (`generativelanguage.googleapis.com`). Používá
 *                `session-evaluation`, `weekly-report`, `analyze-misconceptions`.
 *                **Lovable AI Gateway se nepoužívá** (rozhodnutí 2026-09-09).
 *   Resend     — `api.resend.com` v `send-parent-invite`
 *   WhatsApp   — `wa.me` v `InviteParentDialog.tsx` (odkaz se skládá v prohlížeči,
 *                telefonní číslo se na server neposílá)
 *   Google     — `fonts.googleapis.com` v `index.html` (písmo Nunito)
 *
 * Když přibude volání ven, PATŘÍ SEM. Zásady, které příjemce zamlčí, jsou horší
 * než žádné — a přesně na tohle hlídá `src/test/legal-recipients.test.ts`.
 * Ten test tenhle seznam už jednou zachránil: chyběl v něm Groq i WhatsApp.
 */
export interface Prijemce {
  nazev: string;
  ucel: string;
  umisteni: string;
}

export const PRIJEMCI: Prijemce[] = [
  {
    nazev: "Supabase",
    ucel: "Databáze, přihlašování a serverové funkce. Zde jsou uložena všechna data účtu.",
    umisteni: "Evropská unie",
  },
  {
    nazev: "Poskytovatel jazykového modelu (Groq nebo Google)",
    ucel:
      "Slovní hodnocení po procvičování a týdenní shrnutí pro rodiče. Posílá se téma, " +
      "úroveň a počet správných odpovědí — ne jméno dítěte ani text jeho odpovědí. " +
      "Který z těch dvou se použije, závisí na aktuálním nastavení služby.",
    umisteni: "mimo EU",
  },
  {
    nazev: "Resend",
    ucel: "Odeslání e-mailu s pozvánkou pro rodiče a týdenního přehledu.",
    umisteni: "mimo EU",
  },
  {
    nazev: "WhatsApp (Meta)",
    ucel:
      "Jen když si pozvánku pro rodiče vyberete poslat přes WhatsApp. Telefonní číslo " +
      "zůstává ve vašem zařízení a k nám se neodesílá — otevře se jen WhatsApp " +
      "s předvyplněnou zprávou. Že jste zprávu poslali, se ale dozví WhatsApp.",
    umisteni: "mimo EU",
  },
  {
    nazev: "Google Fonts",
    ucel:
      "Načtení písma Nunito při otevření stránky. Google se tím dozví IP adresu " +
      "návštěvníka. Nejde o cílení reklamy ani sledování napříč weby.",
    umisteni: "mimo EU",
  },
];
