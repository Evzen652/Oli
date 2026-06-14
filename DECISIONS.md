# DECISIONS — autonomní audit 2026-06-14

Rozhodnutí učiněná během autonomní audit session (větev `auto/audit-2026-06-14`).
Formát: **Rozhodnutí** → *Zdůvodnění* → *Zvážené alternativy*.

---

## D1 — Oprava rozbitého ESLint configu

**Rozhodnutí:** `eslint.config.js` opraven na `reactHooks.configs['recommended-latest']`
(dříve `reactHooks.configs.flat.recommended`, který v nainstalované verzi
`eslint-plugin-react-hooks` 5.x neexistuje → ESLint se vůbec nespustil).

*Zdůvodnění:* Lint byl kompletně nefunkční (`TypeError: Cannot read properties of
undefined (reading 'recommended')`) — neběžel ani v CI. Plugin exportuje
`recommended-legacy | recommended | recommended-latest`; flat-config preset je
`recommended-latest`.

*Alternativy:* (a) downgrade pluginu na verzi s `configs.flat` — zamítnuto, jde proti
směru migrace a je invazivnější; (b) `configs.recommended` — nejednoznačné mezi
verzemi, `recommended-latest` je explicitně flat.

## D2 — ESLint respektuje `_`-prefix pro záměrně nevyužité identifikátory

**Rozhodnutí:** Přidáno pravidlo `@typescript-eslint/no-unused-vars` s
`argsIgnorePattern/varsIgnorePattern/caughtErrorsIgnorePattern: '^_'`.

*Zdůvodnění:* Kód už konvenci `_`-prefixu používá (`gen(_level)`, `catch (_)`).
Config ji jen nezohledňoval, takže legitimní vzory padaly jako chyby.

*Alternativy:* přejmenovat všechny `_`-parametry (zbytečná churn) nebo přidat
`eslint-disable` komentáře (šum) — obojí horší.

## D3 — ESLint povoluje NBSP (U+00A0) v textech

**Rozhodnutí:** `no-irregular-whitespace` nastaveno `skipStrings/skipTemplates/skipComments/skipRegExps: true`.

*Zdůvodnění:* České NBSP je záměrné v zobrazovaném textu (formátování čísel „1 000 000",
pevné mezery). Ověřeno, že flagované znaky jsou skutečně U+00A0 v template literálech.
Pravidlo dál hlídá NBSP v kódových pozicích.

*Alternativy:* nahradit NBSP obyčejnými mezerami — zamítnuto, zhoršilo by typografii
a sazbu čísel pro děti.

## D4 — Pre-existující lint dluh NEopravuji plošně

**Rozhodnutí:** Po opravě configu zůstává ~339 errorů v `src/` a ~2900 v
`supabase/functions/`. NEspouštím plošný `eslint --fix` ani ruční opravu všech.
Opraveny jen: (a) můj nový kód (0 chyb), (b) 3 konkrétní nálezy v content souborech (viz D5).

*Zdůvodnění:* Dluh vznikl tím, že lint nikdy neběžel (rozbitý config). Drtivá většina je
kosmetika (`no-explicit-any` v Deno edge funkcích, `prefer-const`, `no-useless-escape`).
Plošná auto-oprava 3000+ míst napříč celým codebase je široký rizikový zásah mimo smysl
auditu „funguje aplikace / jsou tam reálné bugy". Zadání pro takový případ říká zvolit
rozumné řešení a zapsat ho sem.

*Alternativy:* (a) `eslint --fix` na vše — zamítnuto: obří šumový diff, riziko subtilních
změn (regex escape), churn v souborech jiných sessions; (b) ignorovat úplně — zamítnuto,
config fix má reálnou hodnotu. **Doporučení k revizi:** samostatný cleanup PR po předmětech.

## D5 — Autorský obsah nezapojený do generátoru: zachovat, ne mazat

**Rozhodnutí:** Nevyužité `POOL_L3` (g5 volby) a `HORY` (g4 povrch ČR) označeny
`_`-prefixem + `TODO(review)` komentářem místo smazání. Stray import `form`
(g4 zlomek) odstraněn.

*Zdůvodnění:* `POOL_L3` jsou 4 autorské L3 úlohy (drag_order/match_pairs), nezapojené
protože téma je `select_one` (emitovaly by nekompatibilní úlohy — souvisí se známým
problémem „mixed-type tasks" v PENDING_CHANGES). `HORY` je autorská geografická data
(6 pohoří). Obojí je hodnotná pedagogická práce, ne stray kód — mazat by byla ztráta.

*Alternativy:* (a) smazat — zamítnuto, ztráta obsahu; (b) zapojit do generátoru —
mimo rozsah (vyžaduje změnu inputType/restrukturalizaci, rozhodnutí content ownera).
Flagováno k revizi.

## D6 — Triáž 37 failujících testů: opravit reálné, dokumentovat baseline

**Rozhodnutí:** Z 37 failů (baseline dle PROJECT_STATUS ~39, tj. mé předchozí změny
nepřidaly regrese) opraveno 6 reálných/stale, zbytek (31) ponechán jako dokumentovaný
pre-existující baseline.

**Opraveno:**
- `pisemneNasobeni` L3 — **reálný bug generátoru**: `Math.random()*90+11` dávalo
  rozsah 11–**100** místo 11–99. Oprava `*90`→`*89`.
- `content-registry` (3) — stale testy: grade-2 už má statický obsah (40 témat, ne 0);
  ročníky 6–9 zatím prázdné (test čekal 3–9); legacy ID `math-compare-natural-numbers-100`
  neexistuje → dynamický výběr z registry.
- `db-curriculum` (1) — stejný legacy ID → dynamický výběr.
- `prvouka-visuals` (1) — edge case: plně prázdný vstup do `getTopicIllustrationUrl`
  vrací null (konzistentní s okolními aserce); test sjednocen na `toBeNull()`.

**Ponecháno jako baseline (NEopravovat autonomně):**
- **Boundary enforcement** — `red-team` (4) + `system-stress` (3): `BOUNDARY_RULES` v
  `boundaryEnforcement.ts` klíčovaný starými ID (`math-*`, `frac_*`), runtime kontrola
  neaktivní pro grade-N. PENDING_CHANGES to flagují jako **bezpečnostně relevantní vlastní
  fokus task**. Slepý remap by riskoval false-positive STOP_2 blokující děti (nesprávné
  numericRange) — riziková akce, mimo autonomní rozsah.
- **execution-directive** (4) + **keyword-conflicts** (3) — rodina Cause B (topic-matching
  po migraci ID); session flow nedojde do PRACTICE pro testovací vstupy.
- **generator-validation** (3) — Cause C (mixed-type tasks: téma `select_one` emituje
  match_pairs/categorize). Spec rozhodnutí content ownera.
- **lib-utilities** (1) — Cause D: spec rozpor match_pairs ≥2 vs ≥3. Spec rozhodnutí, ne bug.
- **sloh-topics** (1) + **security** (1) — Cause F: stale fixtures s mazanými legacy ID.
- **i18n-completeness** (1) — Cause E: `parent.greeting` bez `{name}`.
- **content-audit** (1) — offline přehled (počty se mění s obsahem).

*Zdůvodnění:* Spec-disagreementy (match_pairs ≥2/≥3) a bezpečnostní remap vyžadují
rozhodnutí ownera; stale fixtures vyžadují znalost správných náhradních ID. Riziko
zavlečení regresí nebo produkčních false-positives převažuje nad hodnotou „zelené sady"
v autonomním režimu. Doporučení: samostatné fokus tasky (zejm. boundary remap).

## D7 — Boundary enforcement VYŘAZEN z odpovědní cesty (ne remap)

**Rozhodnutí:** Místo remapu `BOUNDARY_RULES` na grade-N ID **vyřazena celá kontrola
hranic na odpovědi**: odebrány volání `checkBoundaryViolation` z `sessionOrchestrator`
(PRACTICE + CHECK) i z offline `contentAudit`; smazán modul `boundaryEnforcement.ts`
a test `boundary-deep.test.ts`; legacy boundary testy v red-team/system-stress/security/
preintent-boundaries aktualizovány. (Schváleno uživatelem 2026-06-14.)

*Zdůvodnění:* Hloubková analýza ukázala, že plánovaný remap by byl **nebezpečný**.
Boundary enforcement je relikt éry AI tutora (volný text). V dnešní architektuře
(`select_one`/`true_false`) jde živá odpověď přes `processState(s, answer)`, kde
`answer` = **kurátorovaná možnost**. Kontrola funguje jen proto, že je neaktivní
(pravidla na starých ID). Aktivace remapem by:
- ukončila session (STOP_2) při kliknutí na legitimní možnost „150" u grade-3 (čísla do
  1000) — testy přitom kódovaly rozsah [0,100], což pro grade-3 neplatí;
- spustila violation u možnosti obsahující slovo „násobení"/„sčítání".
AI tutor je dle CLAUDE.md deprecated → mechanismus je vestigiální.

*Ověření:* testy 31→22 failů (boundary cluster vyřešen, 0 regresí), tsc 0, live
ověřeno (numerická odpověď zpracována normálně, žádný STOP_2, čistá konzole).

*Alternativy:* (a) **remap na grade-N** — ZAMÍTNUTO (produkční false-positives,
ukončování dětských sezení); (b) **gate dle inputType** (skip pro select_one) — funkční,
ale drží latentně mrtvý mechanismus bez živého free-text obsahu; (c) nechat neaktivní +
skip testy — ZAMÍTNUTO, ponechává mrtvý kód a maskuje záměr. Vyřazení je nejčistší
odraz architektury.

## D8 — Nezapojený obsah `_POOL_L3` / `_HORY`: vyřešeno (zapojit/smazat dle typu)

**Rozhodnutí:** (řeší otevřený bod z D5)
- **`_HORY`** (g4 povrch ČR) → **SMAZÁNO**. Byla to redundantní datová tabulka 6 pohoří;
  všechna její fakta (Sněžka 1603, Praděd 1492, …) už pokrývají autorské otázky v
  POOL_L1/L2/L3. Žádná ztráta obsahu.
- **`_POOL_L3`** (g5 volby) → **ČÁSTEČNĚ ZAPOJENO**. Ze 6 úloh byly 4 select_one
  („proč" otázky — dělba moci, rozdíl voleb, komunismus, volební právo) zapojeny do L3
  (`gen` L3 = POOL_L2 + POOL_L3). 2 nekompatibilní úlohy (drag_order `items` /
  match_pairs `pairs`) odstraněny, protože téma je `select_one`. Opraveny překlepy
  („komunikistický" → „komunistický", „volba stránek" → „volba stran").

*Zdůvodnění:* Recovery hodnotného autorského obsahu (4 náročné L3 otázky → reálná
gradace obtížnosti) bez zavlečení mixed-type problému (Cause C). Data bez přidané
hodnoty (HORY) raději pryč než držet mrtvá.

*Ověření:* volby prochází generator-validation na všech úrovních; tsc 0, lint 0,
žádné `items`/`pairs` nezůstaly. (Kolísání celkového počtu failů 22↔23 je
nedeterminismus pre-existujících Cause C témat, ne regrese — ověřeno 12 vs 10
mezi běhy.)

*Alternativy:* (a) `_POOL_L3` celé smazat — zamítnuto, ztráta 4 dobrých otázek;
(b) převést drag_order/match_pairs na samostatné categorize téma — mimo rozsah
(nové téma, restrukturalizace); (c) `_HORY` zapojit generátorem — zbytečné, fakta
už v poolech.
