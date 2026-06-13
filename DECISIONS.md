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
