# Audit projektu Oli

**Datum:** 2026-09-03 · **Větev:** `chore/remove-essay-and-ai-authoring` · **Rozsah:** celý repozitář

> **Postup ve dvou krocích.** Audit sám proběhl bez jediného zásahu do kódu — zadání
> znělo „nedělej nic, co by mohlo ovlivnit chod a logiku aplikace, když tak napiš jen
> návrh". Nálezy jsou tedy popsané tak, jak byly nalezené.
>
> **Následně byl na vyžádání proveden seznam A** (devět bezrizikových zásahů, viz Fáze 5).
> Seznamy **B** a **C** čekají na rozhodnutí a kódu se zatím nedotkly.
>
> Každý nález níž je **změřený**, ne odhadnutý. U každého je uvedeno, čím se to dá ověřit.
> Kde měření vyvrátilo moji původní domněnku, je to napsané taky.

---

## Shrnutí: pět věcí, které bych řešil první

| # | Nález | Dopad | Náročnost |
|---|---|---|---|
| 1 | **Landing page váží 14,9 MB v PNG** | Rodič na mobilních datech stránku prakticky nenačte | nízká |
| 2 | **Bílý text na značkové oranžové má kontrast 2,80 : 1** (norma 4,5) | Všechna hlavní tlačítka v celé aplikaci | nízká, ale je to rozhodnutí o barvě |
| 3 | **Jeden JS balík 5,2 MB** — dítě stahuje admin i grafy | Rozporuje vlastní princip „čím míň času v systému, tím líp" | střední |
| 4 | **Selhaný dotaz na roli tiše přepne rodiče do dětského rozhraní** | Nefunkční aplikace pro rodiče při výpadku sítě | nízká |
| 5 | **43 z 94 URL ilustrací vrací 400** | Prázdné dlaždice u poloviny témat | nízká |

---

## Fáze 1 — Architektura a závislosti

### 1.1 Rozsah projektu

| Adresář | Souborů | Řádků |
|---|---:|---:|
| `src/content` | 287 | 60 060 |
| `src/lib` | 141 | 21 544 |
| `src/components` | 119 | 21 393 |
| `src/test` | 85 | 14 395 |
| `src/pages` | 17 | 5 482 |
| `src/hooks` | 13 | 1 458 |

Celkem ~125 tisíc řádků TypeScriptu. Poměr testů k produkčnímu kódu (14 tis. / 110 tis.)
a 4 619 procházejících testů je na projekt téhle velikosti nadprůměrný.

### 1.2 Bezpečnostní zranitelnosti

`npm audit`: **17 nálezů — 1 kritický, 9 vysokých, 5 středních, 2 nízké.**

**Jediný, který se dostane k uživateli do prohlížeče:**

```
react-router-dom 6.30.3   moderate   open redirect vedoucí k XSS
react-router     6.30.3              (CVE-2025-68470 a jeho obcházení)
@remix-run/router 1.23.2
```

Zranitelný rozsah je `6.0.0 – 7.17.0`, takže **oprava vyžaduje přechod na v7** — hlavní
verzi s breaking changes. Není to `npm audit fix`, je to migrace.

Zbytek (vitest, vite, esbuild, sharp, js-yaml, ws, postcss, browserslist, nanoid,
brace-expansion, form-data) jsou **vývojové závislosti** — do produkčního balíku se
nedostanou. Kritický nález u `vitest` se týká jeho UI serveru, který se tu nespouští.
Přesto: `vitest@3.2.4 → 3.2.6` je patch bez rizika.

### 1.3 Zastaralé balíčky (hlavní verze pozadu)

| Balíček | Máte | Nejnovější |
|---|---|---|
| react / react-dom | 18.3.1 | 19.2.8 |
| react-router-dom | 6.30.3 | 7.18.3 |
| recharts | 2.15.4 | 3.10.1 |
| zod | 3.25.76 | 4.5.4 |
| lucide-react | 0.462.0 | 1.39.0 |
| tailwind-merge | 2.6.1 | 3.6.0 |
| react-day-picker | 8.10.2 | 10.0.1 |
| sonner | 1.7.4 | 2.0.8 |
| date-fns | 3.6.0 | 4.4.0 |

**Pozor:** `CLAUDE.md` uvádí „React 19 + Vite 5". Ve skutečnosti běží **React 18.3.1**.
Dokumentace lže o stacku — což je nebezpečnější než samotná zastaralost, protože podle ní
se rozhoduje (např. že lze použít `use()` nebo nové Server Components API).

### 1.4 Mrtvé závislosti

- **`zod` a `@hookform/resolvers`** jsou v `dependencies`, ale **nikde v kódu se
  neimportují**. (Ověřeno hledáním všech importů napříč `src`, `e2e`, `scripts`,
  `supabase` a konfiguračními soubory.)
- **`@tanstack/react-query`** je nainstalovaný, `QueryClientProvider` je namontovaný
  v `App.tsx` — ale v celé aplikaci není **jediné volání `useQuery` ani `useMutation`**.
  Provider tedy jen zabírá místo v balíku. `CLAUDE.md` přitom uvádí
  „Data: @tanstack/react-query + Supabase client".
- **22 ze 48 komponent `src/components/ui/`** se nikde neimportuje (accordion,
  carousel, command, drawer, form, menubar, navigation-menu, sidebar, table, …).
  Do balíku se díky tree-shakingu nedostanou, ale drží v `package.json` osm balíčků
  Radixu, které se musí udržovat a hlídat kvůli zranitelnostem.

### 1.5 Past v nástrojích: `npx tsc --noEmit` nekontroluje nic

`tsconfig.json` je solution-style soubor s `"files": []`. Bare `tsc --noEmit` tedy projde
**nula souborů** a vždycky skončí úspěchem:

```
npx tsc --noEmit --listFiles   →   0 řádků výstupu
```

Skutečná kontrola je `npm run typecheck` (`tsc -p tsconfig.app.json --noEmit`) — ta
prochází a kód je čistý, takže **závěr se nemění**, jen metoda. Ale kdokoli (člověk
i agent) ověřuje typy bare příkazem, dostane falešné „prošlo".

**Návrh:** přidat do `tsconfig.json` `"include": []` s komentářem, nebo — lépe —
`"extends"` tak, aby bare běh dělal to, co se očekává.

### 1.6 Vypnuté kontroly mrtvého kódu

`tsconfig.app.json` má `noUnusedLocals: false` a `noUnusedParameters: false`.
Po zapnutí:

```
137 chyb (130× TS6133 nepoužitá proměnná, 5× TS6196, 2× TS6192)
```

Nejvíc: `Landing.tsx` (14), `ProposalReview.tsx` (12), `ChildHomePage.tsx` (7),
`TopicBrowser.tsx` (6), `SessionView.tsx` (5).

`eslint` hlásí **338 chyb a 15 varování**:

| Pravidlo | Počet |
|---|---:|
| `@typescript-eslint/no-unused-vars` | 153 |
| `@typescript-eslint/no-explicit-any` | 134 |
| `prefer-const` | 18 |
| `react-refresh/only-export-components` | 13 |
| `react-hooks/exhaustive-deps` | 9 |
| `no-misleading-character-class` | 7 |

---

## Fáze 2 — Logika a toky

### 2.1 🔴 Selhaný dotaz na roli tiše degraduje rodiče na dítě

`src/hooks/useUserRole.ts:20`

```ts
const { data } = await supabase.from("user_roles").select("role")…
setRole(data?.role as AppRole | null ?? null);
```

Supabase klient **při chybě dotazu nevyhazuje výjimku** — vrací `{ data: null, error }`.
Tady se `error` nedestrukturalizuje vůbec. Když dotaz selže (výpadek sítě, RLS, 500),
`data` je `null`, `role` zůstane `null`.

A `App.tsx:107` má:

```
// Child or no role (backward compat) → practice
```

Takže **přihlášený rodič, kterému selhal jeden dotaz, skončí v dětském procvičování.**
Nedostane chybu, nedostane možnost obnovit — dostane cizí rozhraní.

**Návrh:** destrukturalizovat `error`, při chybě rozlišit „role neznámá" od „role není"
a v prvním případě ukázat stav s tlačítkem „Zkusit znovu".

### 2.2 🔴 Nekonečné načítání bez záchranné brzdy

`App.tsx` má na bootstrap session pojistku:

```ts
const timeout = setTimeout(() => setLoading(false), 3000);  // řádek 137
```

Ale `AuthenticatedRoutes` (`App.tsx:35`) čeká na `useUserRole` a `useProfile`
**bez jakéhokoli timeoutu**. Obě funkce navíc volají `fetchRole()` / `fetchProfile()`
uvnitř `useEffect` **bez `.catch()`**. Když promise odmítne (ne vrátí chybu — odmítne),
`setLoading(false)` se nikdy nezavolá a uživatel zůstane na „Načítám…" natrvalo.

**Návrh:** stejná 3sekundová pojistka jako v `App.tsx`, plus `.catch()` v obou hoocích.

### 2.3 37 volání Supabase ignoruje `error`

Změřeno napříč `src` (mimo testy): 37 míst destrukturalizuje jen `data`.
Nejexponovanější:

```
src/hooks/useUserRole.ts:20          role uživatele
src/hooks/useProfile.ts:20           profil
src/hooks/useSessionDispatch.ts:235  hledání dítěte
src/components/ChildHomePage.tsx     5 volání
src/lib/performanceTracker.ts        3 volání
src/components/ProposalReview.tsx    8 volání (admin)
```

Ve všech případech je výsledek stejný: chyba se tváří jako „prázdný výsledek".
`try/catch` kolem toho **nepomáhá** — Supabase nevyhazuje.

### 2.4 Dva tiché `catch` v dětském toku

```
src/hooks/useSessionDispatch.ts   2×   catch { console.error(...) }
src/lib/sessionOrchestrator.ts    1×
src/hooks/useAdminCurriculum.ts   1×
```

Ten v `handleAnswerSubmit` je nejcitelnější: dítě klikne na odpověď, vyhodnocení
spadne, `loading` se vrátí na `false` — a **nestane se nic**. Žádná hláška, žádná
možnost zkusit to znovu. Slepá ulička.

**Návrh:** toast „Něco se nepovedlo, zkus odpověď odeslat znovu" + zachovat vybranou
odpověď.

Zbytek kódu je na chyby překvapivě čistý: **jediný `console.log`** v celém produkčním
kódu je uvnitř `src/lib/logger.ts`, prázdné `catch` bloky jsou dva (oba v adminu)
a `TODO`/`FIXME` je v celém repu **jedno** (v šabloně).

### 2.5 Jediná globální ErrorBoundary

`ErrorBoundary` obaluje **celý** strom včetně `BrowserRouter` (`App.tsx:157`).
Jakákoli chyba kdekoli → zmizí celá aplikace a jediná cesta ven je
`window.location.href = "/"`, tedy tvrdý reload.

Tři konkrétní problémy:

1. **Dítě uprostřed cvičení přijde o kontext.** (Rozdělaná práce se sice ukládá
   přes `useSessionPersistence`, ale uživatelsky je to „všechno zmizelo".)
2. **Zobrazuje `error.message` syrově** v `<pre>` bloku. Osmiletému dítěti
   se ukáže anglická technická hláška.
3. **Používá emoji 🦉**, tedy přesně to, co se ze zbytku aplikace odstraňovalo.

**Návrh:** druhá, vnořená hranice kolem `<SessionView>` a kolem rout, aby chyba
v jedné obrazovce nesundala celou aplikaci; `error.message` schovat za `import.meta.env.DEV`.

### 2.6 10 volání `localStorage` bez `try/catch`

V Safari v anonymním režimu a při zablokovaných datech stránek `localStorage`
**vyhazuje výjimku**. Projekt to většinou ošetřuje — `src/lib/anonServerSync.ts`
je učebnicový příklad. Jenže ne všude:

| Místo | Proč vadí |
|---|---|
| `src/pages/Onboarding.tsx:152–153` | **první klik nového návštěvníka** („vyber ročník") — výjimka zabije vstup do aplikace |
| `src/components/SessionView.tsx:117` | čte se **během renderu** → výjimka spustí ErrorBoundary |
| `SessionView.tsx:253, 272` | náhled ročníku v adminu |
| `ChildHomePage.tsx:372`, `ParentDashboard.tsx:62` | demo hash |

Nejde o teoretické riziko: `Onboarding` je vrchol trychtýře.

### 2.7 `react-hooks/exhaustive-deps` — 9 nálezů, všechny v adminu

`AdminAIChat` (2), `AdminGenerateIllustrations`, `CreateExerciseDialog`,
`ExerciseTab` (2), `SkillDetail`, `AdminRvpTree` (2).

**Dobrá zpráva:** v dětském ani rodičovském toku není ani jeden. Riziko zastaralých
closures je omezené na administraci.

### 2.8 Chybný regulární výraz nad emoji

`no-misleading-character-class` na 7 místech — třída znaků obsahuje surrogate páry
bez příznaku `u`:

```ts
// src/test/session-evaluator.test.ts:127
expect(r).not.toMatch(/[😊😀💡⭐🎉]/);
```

Bez `u` se to nechová jako „některý z těchto pěti emoji", ale jako „některá z deseti
půlek jejich kódu" — tedy chytá i emoji, o která nejde. Test je **širší, než vypadá**.
Stejný vzorec v aplikačním kódu: `src/components/admin/ExerciseTab.tsx:1297`
(`.replace(/^[📗📘📕]\s*/, "")`).

---

## Fáze 3 — Technická kvalita

### 3.1 239 kopií téže funkce

**`src/lib/content/helpers.ts` exportuje `shuffleArray`.** Přesto si
**239 z 270 souborů** v `src/content/` definuje vlastní lokální `shuffle`.

Ověřil jsem, jestli se implementace neliší — protože kdyby některá používala
`sort(() => Math.random() - 0.5)`, byl by to zkreslený generátor a chyba v obsahu,
ne ve stylu. **Neliší se:**

```
226×  const a = [...arr];   … Fisher–Yates
 13×  const a = arr.slice(); … Fisher–Yates
  0×  sort(() => Math.random())
```

Všechny jsou korektní Fisher–Yates, identické se sdíleným helperem. Jde tedy
o **čistý DRY dluh ~1 200 řádků bez jediného rizika pro správnost**.

**Návrh — ale opatrně:** obsah je podle `CLAUDE.md` „zmrazený" a `runOfflineAudit`
hlídá `frozen_content_unchanged`. Refaktor by musel proběhnout jako jedna
mechanická dávka s následným spuštěním auditu. Užitek je hlavně v tom, že příští
generátor nebude kopírovat pátou generaci copy-paste.

### 3.2 Soubory, které přerostly

| Řádků | Soubor |
|---:|---|
| 1 741 | `src/components/admin/AdminGenerateIllustrations.tsx` |
| 1 569 | `src/pages/AdminDashboard.tsx` |
| 1 500 | `src/components/admin/ExerciseTab.tsx` |
| 1 443 | `src/lib/categoryInfo.ts` |
| 1 373 | `src/components/ProposalReview.tsx` |
| 1 195 | `src/lib/contentAudit.ts` |
| 1 004 | `src/components/ChildHomePage.tsx` |
| 981 | `src/components/SessionView.tsx` |

`AdminGenerateIllustrations` má jednu komponentní funkci o **1 093 řádcích**.
`SessionView` **875**. To už není komponenta, to je modul bez hranic.

### 3.3 Mrtvý obsah v `categoryInfo.ts`

1 443 řádků ručně psaného obsahu (73 hesel: `hook`, `whatIsIt`, `whyWeUseIt`,
`visualExamples`, `funFact`). **Všech 73 klíčů je ze staré taxonomie**, takže
`getCategoryInfo` vrací `null` pro všech 229 témat.

Tohle už se dnes částečně řešilo — `topicInsight.ts` vrátil boxy „k čemu to je"
a „zajímavost" do dialogu. Ale samotný `categoryInfo.ts` v repu zůstává a pořád
ho importuje `ProposalReview`, `useAdminCurriculum` a `curriculumPromptBuilder`.

**Rozhodnutí pro vás:** překlíčovat na RVP názvy (obsah má hodnotu), nebo smazat?

### 3.4 🔴 43 z 94 URL ilustrací vrací chybu

`src/lib/prvoukaVisuals.ts` skládá URL do Supabase storage. Když téma nemá záznam
v mapě, funkce **stejně vyrobí URL** ze slugu (řádek 380 a 388) — spekulativně.

Změřeno přes GET na všech 94 URL, které aplikace pro současný obsah generuje:

```
dostupných:  51 / 94
chybějících: 43 / 94   (HTTP 400)
```

*(Poznámka k metodě: první měření přes HEAD hlásilo 94/94 nedostupných — Supabase
storage na HEAD odpovídá chybou i pro existující soubory. Čísla výše jsou z GET.)*

Chybí celá **fyzika, dějepis, přírodověda, vlastivěda** a velká část prvouky a češtiny.

Dopad je tlumený tím, že `IllustrationImg` má `onError` a přepne na náhradní emoji —
jenže **emoji má jen 17 ze 75 témat**. U zbytku se tedy ukáže prázdné místo.
A v každém případě jde o 43 zbytečných síťových dotazů.

**Návrh:** `getCategoryIllustrationUrl` / `_getTopicImageUrl` mají vracet `null`,
když klíč není v mapě, místo spekulativní URL. Plus doplnit `alt`/fallback pro
zbylých 58 témat.

### 3.5 44 MB nepoužitých obrázků v repozitáři

Ze 121 obrázků v `src/assets/` se **76 nikde neimportuje** — dohromady **44,4 MB**.
Jsou to zdrojové kopie starých `topic-*` a `cat-*` ilustrací, které se nahrály
do Supabase storage (odkud si je aplikace tahá přes `prvoukaVisuals`).

Do buildu se nedostanou, ale zatěžují každý `git clone` a každý checkout.

**Návrh:** přesunout mimo repozitář (nebo do `git lfs`). Data jsou v historii, takže
smazání není nevratné.

### 3.6 Dokumentace

Z 279 exportovaných funkcí (mimo `content/` a testy) je 55 delších než 25 řádků
bez komentáře nad hlavičkou. Naprostá většina jsou ale React komponenty, kde je
vysvětlení ve file-level docblocku — **skutečný problém je délka, ne chybějící JSDoc**
(viz 3.2).

Kvalita komentářů tam, kde jsou, je nadstandardní: běžně vysvětlují *proč*, včetně
zavržených variant. To je vzácné a stojí za udržení.

---

## Fáze 4 — Grafika, UI a přístupnost

### 4.1 🔴 Kontrast: bílý text na značkové oranžové = 2,80 : 1

Změřeno pomocí `@axe-core/playwright` na pěti stránkách proti běžícímu serveru:

| Stránka | Nálezů | Nejzávažnější |
|---|---:|---|
| `/landing` | 19 | bílá na `#F97316` — **2,78 : 1** |
| `/onboarding` | 2 | totéž + `text-orange-500` na krémové **2,68 : 1** |
| `/student` | 2 | totéž |
| `/auth` | 2 | `button[type=submit]` |
| `/demo` | 4 | totéž |

**Norma WCAG 2 AA je 4,5 : 1.** Týká se to `variant="default"`, tedy **každého hlavního
tlačítka v aplikaci** — včetně „Pokračovat" a „Procvičit znovu".

Zajímavé je, že projekt tohle pravidlo **sám zná**. V `SessionEndSummary.tsx` stojí:

> „Oranžová smí být tint s tmavým textem (6,60:1) — jako plocha pod bílým textem
> by měla jen 2,8:1."

Komentář je přesný na dvě desetinná místa. Jen se neuplatnil na tlačítka.

**Spočítané možnosti** (obojí je rozhodnutí o vzhledu značky, proto jen návrh):

| Varianta | Výsledek |
|---|---|
| Ztmavit oranžovou z 53 % na 40 % světlosti → `#C55405` | 4,52 : 1 ✔ — ale je to viditelně jiná barva |
| Nechat `#F97316`, text změnit na `#292524` | 5,41 : 1 ✔ — oranžové tlačítko s tmavým textem |
| Nechat `#F97316`, text `#3F2A1D` | 4,80 : 1 ✔ — měkčí varianta téhož |

### 4.2 `text-muted-foreground` je těsně pod normou

`#78726D` na podkladech aplikace:

```
na #FFFFFF  4,74 : 1  ✔
na #FAF8F5  4,48 : 1  ✘ (o 0,02 pod normou)
na #FFF1E6  4,29 : 1  ✘
na #EAF2FF  4,21 : 1  ✘
na #CCFBF1  4,21 : 1  ✘
```

Týká se to veškerého popisného textu na barevných kartách.

**Spočítaný návrh:** ztmavit token na **`#736D68`** — nejhorší případ pak vychází
4,53 : 1. Rozdíl je okem prakticky nepostřehnutelný, jde o jednu hodnotu v `index.css`.

### 4.3 🔴 Landing page: 14,9 MB obrázků

`Landing.tsx` importuje 20 obrázků. Součet zdrojových velikostí:

```
20 souborů, celkem 14,9 MB
nejtěžší: landing-prehled-pro-rodice.png  1 164 kB
          landing-samostatne-nebo-spolecne.png  1 046 kB
          landing-male-kroky.png  1 044 kB
```

K tomu, změřeno na vykreslené stránce:

- **`loading="lazy"` má 0 z 24 obrázků**
- **21 z 24 je předimenzovaných** víc než 2,5× (např. zdroj 762 px vykreslený na 134 px)
- některé obrázky jsou v DOM dvakrát (mobilní a desktopová varianta), takže se
  **stahují oba**, i když je jeden schovaný

Odhad po převodu na WebP q80 a rozumné šířce: **~1,8 MB místo 14,9 MB.**

Tohle je podle mě nejdražší jediná chyba v projektu — a zároveň nejlevnější na opravu,
protože nevyžaduje žádnou změnu logiky, jen dávkové zpracování souborů
(`sharp` už v devDependencies je).

### 4.4 Jeden balík 5,2 MB pro všechny

```
dist/assets/index-*.js    5 209 kB   (1,39 MB gzip)
dist/assets/index-*.css     146 kB
```

`App.tsx` importuje **všechny stránky staticky** — žádný `React.lazy`, žádné
`manualChunks`. Osmileté dítě tedy stahuje:

- celý administrátorský panel (`AdminDashboard` 1 569 řádků, `ExerciseTab` 1 500,
  `AdminGenerateIllustrations` 1 741 — dohromady ~527 kB zdroje)
- `recharts` (používá ho jen `Report.tsx` pro rodiče)
- `react-markdown` (používá ho jen `AdminAIChat`)
- generátory obsahu **pro všechny ročníky** (grade-4 1 156 kB + grade-5 1 185 kB
  zdroje, i když dítě chodí do druhé třídy)

`CLAUDE.md` uvádí jako architektonický princip: *„Efficiency principle — the less time
child spends in system, the better."* 1,39 MB gzipu před první úlohou jde proti němu.

**Návrh:** `React.lazy` na admin a rodičovské routy + dynamický import ročníkových
generátorů podle `grade`. Je to změna zavádění modulů, ne logiky — ale dotýká se
startu aplikace, takže rozhodně ne bez vašeho souhlasu.

### 4.5 Barvy natvrdo v kódu

```
1 154 výskytů  třídy z Tailwind palety (bg-emerald-500, text-slate-600, …) v 54 souborech
  200 výskytů  hex literály v .ts/.tsx (mimo index.css) ve 14 souborech
```

Nejvíc zasažené: `ExerciseTab.tsx` (140), `ChildHomePage.tsx` (94),
`contentAudit.ts` (63), `ProposalReview.tsx` (61), `AnonStudentPage.tsx` (60).

**A tady je past, na kterou se už jednou narazilo.** `tailwind.config.ts` přemapovává
staré rampy na kanonické. Změřeno:

```
168×  emerald  → green
142×  violet   → brandOrange
128×  slate    → stone
 69×  purple   → brandOrange
 60×  rose     → red
 36×  gray     → stone
 12×  yellow   → amber
  8×  indigo   → brandOrange
  7×  fuchsia  → brandOrange
  3×  lime     → green
─────────────────────────────
633 výskytů ve 43 souborech
```

Z toho **226 míst (violet + purple + indigo + fuchsia) se v kódu čte jako fialová,
ale na obrazovce je značková oranžová.** Přesně tak vznikla „meruňková placka"
v `HelpButton` — autor psal `bg-violet-200`, obrazovka ukázala oranžovou.

Komentář v konfiguraci to přiznává („aliasy jsou most, ne cíl"), ale most stojí
už dlouho a chodí po něm 633 lidí.

**Návrh:** dávkové přepsání `violet/purple/indigo/fuchsia` → `primary`/`brandOrange`
a `slate/gray/zinc/neutral` → `stone` v třídách, pak alias odstranit. Mechanické,
ověřitelné vizuálním diffem, ale je to 633 změn v 43 souborech.

### 4.6 Responzivita — čistá

Testováno na 375 × 812 (mobil):

| Stránka | Vodorovné přetečení |
|---|---|
| `/landing` | žádné (`scrollWidth === clientWidth === 375`) |
| dětský dashboard | žádné (3 „přetékající" prvky jsou uvnitř záměrně posuvného filtru) |
| obrazovka cvičení | žádné |

Tady není co opravovat. Layout drží.

### 4.7 Velikost dotykových cílů

Na dětském dashboardu je **27 tlačítek nižších než 40 px** (filtry „Vše", „Dnes",
„Tento týden" mají 28 px). Formálně to projde — WCAG 2.5.8 (AA) žádá 24 × 24 px.
Ale doporučení pro dotyk je 44 × 44 px a **tohle je aplikace pro děti**, jejichž
jemná motorika je horší než dospělých.

Na obrazovce cvičení jsou odpovědi velké, ale hlavička má 36px prvky — a mezi nimi:

```
✕   38 × 36 px   aria-label: null   title: null
```

Tlačítko, které **ukončuje sezení**, je nejmenším prvkem obrazovky a pro odečítač
obrazovky se jmenuje „✕".

### 4.8 Přístupnost jinak: dobrá

Axe na pěti stránkách nenašel **nic kromě kontrastu** — žádné chybějící popisky,
žádné rozbité ARIA, žádné přeskočené úrovně nadpisů. K tomu:

- **`<img>` bez `alt`: 0** ze všech `.tsx` v projektu
- `src/test/a11y.test.tsx` — 16 testů, všechny procházejí, včetně axe nad
  žákovskými input komponentami
- `<html lang="cs">`, viewport, `inputMode="numeric"` na číselných polích

**Oprava mého vlastního nálezu:** můj první sken hlásil „12 inputů bez popisku".
Byl to **falešný poplach** — regulární výraz `<input[^>]*>` se láme na `=>` uvnitř
JSX atributů, takže neviděl `placeholder`, který tam je. Axe i existující testy
potvrzují, že popisky v pořádku jsou.

### 4.9 Drobnosti

- **`index.html` nemá `<meta name="description">` ani Open Graph tagy.** Landing page
  sdílená na sociální síti nebo v messengeru nemá náhled ani popisek.
- **`Baloo 2` se pořád vyžaduje** v Google Fonts URL, ačkoli `tailwind.config.ts`
  ho v komentáři označuje za odstraněný. *Změřeno: soubory fontu se nestahují* —
  prohlížeč stahuje webfont až když ho něco použije. Cena je tedy jen pár bajtů
  v CSS, ne stovky kilobajtů. (Komentář v konfiguraci tvrdí „jen se stahoval",
  což pro binárky fontu neplatí.)
- **`vercel.json` obsahuje jen SPA rewrite** — žádné bezpečnostní hlavičky
  (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`). U aplikace pro děti s Supabase backendem je to levné doplnění.
- V repozitáři leží soubory, které do něj nejspíš nepatří: `Zdrobneliny_Evzen.xlsx`,
  `zdrobneliny.csv`, `zdrobneliny-excel.csv`, `review-export.md`, `review-prompt.md`,
  `AUDIT_PHASE1.md`, `AUTORUN_REPORT.md`.
- **Žádná tajemství v kódu.** `.env` i `.env.admin` jsou v `.gitignore`, sken na
  API klíče, service_role tokeny a JWT nenašel nic.

---

## Fáze 5 — Co doporučuji a co potřebuje vaše rozhodnutí

### A. Bez rizika — ✅ HOTOVO 2026-09-03

Provedeno na vyžádání po odevzdání auditu. Typecheck 0, testy 4 619/4 619, build prošel.

| # | Zásah | Soubory | Stav |
|---|---|---|---|
| A1 | `aria-label="Ukončit procvičování"` na ✕ (+ nový klíč `session.exit`) | `SessionView.tsx`, `i18n/cs.ts` | ✅ |
| A2 | `loading="lazy"` + `decoding="async"` na ilustrace landingu | `Landing.tsx` | ✅ |
| A3 | `<meta name="description">` + Open Graph | `index.html` | ✅ s výhradou ↓ |
| A4 | Odstraněn `Baloo 2` z Google Fonts URL | `index.html` | ✅ |
| A5 | Bezpečnostní hlavičky + cache pro `/assets` | `vercel.json` | ✅ s výhradou ↓ |
| A6 | `safeStorage` helper místo 9 přímých volání `localStorage` | 5 souborů + nový `lib/safeStorage.ts` | ✅ |
| A7 | Příznak `u` u regulárních výrazů s emoji | `session-evaluator.test.ts`, `ExerciseTab.tsx` | ✅ |
| A8 | Odinstalováno `zod` a `@hookform/resolvers` | `package.json` | ✅ |
| A9 | Opraven popis stacku | `CLAUDE.md` | ✅ |

**Tři věci, které při realizaci dopadly jinak, než zadání znělo:**

1. **A3 — `og:image` chybí schválně.** Náhledový obrázek 1200 × 630 v projektu
   neexistuje a `oli-logo.png` ani `oli-logo-text.png` už nejsou aktuální značka
   (jsou to staré 3D varianty). Odkaz na neexistující soubor je horší než žádný,
   vymýšlet nový vizuál značky mi nepřísluší. `twitter:card` je proto zatím
   `summary`. Až obrázek vznikne, stačí přidat dvě značky a přepnout na
   `summary_large_image` — v `index.html` je o tom poznámka.

2. **A5 — `Content-Security-Policy` jsem záměrně nepřidal.** CSP by musela
   propustit Supabase, Google Fonts, `data:` URL z canvasového odbarvování
   ilustrací a inline styly z Radixu. Špatně nastavená hlavička rozbije aplikaci
   potichu a až v produkci — to je přesně to, co jsem měl nedělat. Ostatní
   hlavičky (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy`, HSTS) riziko nemají. Ověřeno, že aplikaci nikdo
   nevkládá do `<iframe>`, takže `DENY` je bezpečné.

3. **A6 odhalil chybu navíc.** `getOrCreateDemoHash` v `ParentDashboard.tsx`
   měl přímý `setItem` **uvnitř `try`** — a v `catch` větvi **druhý přímý
   `setItem`**. Když úložiště zápis odmítne, první spadne do `catch` a druhý
   spadne znovu, tentokrát bez záchytu. Funkce tedy v prohlížeči se zakázanými
   daty stránek odmítala promise. Obě volání teď jdou přes `writeLocal`.

**Změřený efekt A2:** při načtení landingu se stáhne **12 obrázků z 24** místo všech.
Čtyři dlaždice nad ohybem zůstávají `eager`, aby se nezdrželo první vykreslení.
### B. Potřebuje vaše rozhodnutí — mění chování nebo vzhled

| # | Věc | Otázka pro vás |
|---|---|---|
| B1 | **Kontrast tlačítek** | Ztmavit oranžovou na `#C55405`, nebo nechat barvu a dát tmavý text? Obojí mění vzhled značky. |
| B2 | **`--muted-foreground` → `#736D68`** | Souhlasíte s nepatrným ztmavením popisků? |
| B3 | **Komprese ilustrací landingu** (14,9 MB → ~1,8 MB) | WebP, nebo zůstat u PNG a jen zmenšit rozměry? |
| B4 | **Code splitting** admin/rodič/ročníky | Souhlas s `React.lazy`? Dotýká se startu aplikace. |
| B5 | **react-router 6 → 7** | Jediná zranitelnost, která se dostane k uživateli. Breaking changes. |
| B6 | **`prvoukaVisuals`: přestat vyrábět URL naslepo** | Vrátit `null` místo spekulace = zmizí 43 chybných dotazů, ale i 43 pokusů o obrázek. |
| B7 | **`categoryInfo.ts`** (1 443 řádků mrtvého obsahu) | Překlíčovat na RVP názvy, nebo smazat? |
| B8 | **Odstranění aliasu `violet → brandOrange`** | 633 změn ve 43 souborech. Vyplatí se to teď? |
| B9 | **Sdílený `shuffle` místo 239 kopií** | Sahá do zmrazeného obsahu. Až po dohodě. |
| B10 | **44 MB nepoužitých obrázků** z repa | Smazat (jsou v historii), nebo přesunout do `git lfs`? |
| B11 | **Zapnout `noUnusedLocals`** | Odhalí 137 kusů mrtvého kódu, ale build začne padat, dokud se neuklidí. |

### C. Architektonické — na samostatnou úvahu

- **`SessionView` 981 řádků, `AdminDashboard` 1 569, `AdminGenerateIllustrations` 1 741.**
  Rozdělení je velký, rizikový zásah do funkčního kódu. Doporučuji ho dělat jen tehdy,
  když se ten soubor stejně z jiného důvodu otevře.
- **Chybějící ošetření chyb u 37 volání Supabase** (2.3). Systémové, ale každé místo
  potřebuje vlastní rozhodnutí, co se má stát při selhání. Navrhuji začít u
  `useUserRole` a `useProfile` (2.1, 2.2) — tam je dopad největší a oprava nejmenší.
- **React 18 → 19.** Není nutné, ale odkládáním roste cena.

---

## Co se měřilo čím

| Nález | Nástroj |
|---|---|
| Zranitelnosti | `npm audit --json` |
| Zastaralost | `npm outdated`, `package-lock.json` |
| Typy | `tsc -p tsconfig.app.json --noEmit` (+ `--noUnusedLocals`) |
| Lint | `eslint . --format json` |
| Kontrast | `@axe-core/playwright` proti běžícímu serveru, pak přepočet WCAG vzorcem |
| Responzivita, dotykové cíle | Browser pane 375 × 812, `getBoundingClientRect` |
| Velikost balíku | `vite build` + velikosti v `dist/` |
| Váha obrázků | součet zdrojů importovaných v `Landing.tsx` + `naturalWidth` vs. CSS šířka |
| URL ilustrací | GET na všech 94 vygenerovaných URL |
| Duplicity | vlastní skener 12řádkových normalizovaných bloků |
| Mrtvé závislosti a assety | hledání importů napříč `src`, `e2e`, `scripts`, `supabase`, konfiguracemi |
