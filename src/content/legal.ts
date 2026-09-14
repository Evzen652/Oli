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
  // Správcem údajů musí být PRÁVNÍ OSOBA, ne značka. „Oli" je název aplikace;
  // provozuje ji fyzická osoba nepodnikatel, takže tu patří jméno a příjmení.
  nazev: "Evžen Weigl",
  // Nepodniká → žádné IČO. `null` znamená, že se řádek s IČO vůbec nevykreslí.
  ico: null,
  // Záměrně jen obec, ne ulice a číslo popisné. Zásady soukromí jsou veřejná
  // a indexovaná stránka a provozovatel je fyzická osoba — plná domácí adresa
  // by tím byla trvale dohledatelná. Pro uplatnění práv stačí spolehlivý
  // kontakt, ten je e-mailem níž; úplnou adresu sdělí na vyžádání.
  adresa: "Olomouc, Česká republika",
  email: "evzen.weigl@gmail.com",
};

/** Datum účinnosti obou dokumentů. Při každé věcné změně posuň. */
export const UCINNE_OD = "13. 9. 2026";

/**
 * Jak dlouho držíme data po zrušení účtu, než je smažeme natvrdo.
 * Krátká lhůta je pojistka proti omylu („smazal jsem to omylem"), ne archiv.
 *
 * ⚠️ Tvar je **2. pád**, protože jediné místo, kde se lhůta vyskytuje, je
 * vazba „do …". Do 10. 9. 2026 tu stál nominativ a na produkci se četlo
 * „vyřídíme to do třicet dnů". Když přibude použití v jiném pádě, přidej
 * druhou konstantu — neohýbej tuhle.
 */
export const LHUTA_SMAZANI_2P = "třiceti dnů";

/**
 * Jak dlouho žije serverová kopie anonymního pokroku bez další aktivity.
 * Tvar je **6. pád** — používá se výhradně ve vazbě „po … bez aktivity".
 *
 * ⚠️ Musí odpovídat TTL v `supabase/functions/anon-progress/index.ts`
 * (`action === "cleanup"`), kde je 44 dní = 14 dní trialu + 30 dní. Do
 * 13. 9. 2026 tu stálo „dvanácti měsících" a rozcházelo se to s kódem
 * o jedenáct měsíců. Když se změní TTL, změň i tohle — jsou to dvě čísla
 * o téže věci a mají se hlídat navzájem.
 *
 * Úklid vymáhá `pg_cron` úloha **`anon-cleanup-44d`** (naplánovaná ručně
 * v SQL editoru 15. 9. 2026, denně 3:17 UTC). Maže přímo v databázi touž
 * podmínkou jako `action: "cleanup"` — **když měníš TTL, změň ji i tam**
 * (`cron.alter_job`), v repu ani v migracích totiž není.
 *
 * Do 15. 9. běžela jiná úloha, `anon-cleanup-daily`, která edge funkci volala
 * přes `net.http_post`. Její požadavky končily na 5s limitu (`timed_out`),
 * takže nikdo nevěděl, jestli úklid proběhl. Zrušena. Ověření běhu:
 * `select * from cron.job_run_details order by start_time desc`.
 *
 * ⚠️ Pravidlo maže podle `created_at` / `started_at`, tedy **44 dní od
 * začátku**, ne „bez aktivity“, jak zní vazba v zásadách. Maže se dřív, než
 * zásady slibují, takže slib porušen není — formulace je ale nepřesná.
 */
export const LHUTA_ANON_6P = "44 dnech";

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
 *
 * **Google Fonts odsud 13. 9. 2026 zmizel** — písmo Nunito se přestalo tahat
 * z `fonts.googleapis.com` a hostujeme ho sami (`src/assets/fonts/`). Seznam
 * příjemců se tím zkrátil na pět. Kdyby se odkaz na Google vrátil, patří sem
 * příjemce zpátky; hlídá `src/test/self-hosted-fonts.test.ts`.
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
    // Hosting v seznamu do 13. 9. 2026 chyběl. `legal-recipients.test.ts` ho
    // nechytí konstrukčně — hledá `https://` hosty volané Z kódu, a hosting
    // je ten, KDO kód servíruje, takže se ve voláních nikdy neobjeví.
    nazev: "Vercel",
    ucel:
      "Provoz webu — odsud se aplikace načítá. Vercel při každém otevření stránky " +
      "vidí IP adresu a technické údaje prohlížeče. Obsah účtu ani výsledky dětí " +
      "u něj uložené nejsou.",
    umisteni: "mimo EU",
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
];
