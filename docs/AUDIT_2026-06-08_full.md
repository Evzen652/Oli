# Komplexní audit Oli — 2026-06-08

> Technický + pedagogický + bezpečnostní audit. Proveden autonomně 3 paralelními agenty.
> **Soubory nebyly měněny** — toto je čistě hodnocení + prioritizovaný akční plán.
> Rozsah: celý `src/`, `supabase/migrations/`, `supabase/functions/`.

---

## 0. Executive summary — TOP priority

| # | Oblast | Severita | Nález | Akce čí |
|---|--------|----------|-------|---------|
| C1 | Bezpečnost | 🔴 CRITICAL | **Groq API klíč je v klientském bundlu** (`VITE_GROQ_API_KEY`) — kdokoli ho vytáhne z prohlížeče a utrácí kredity | **Uživatel** (rotovat klíč) + dev |
| C2 | Bezpečnost | 🔴 CRITICAL | Edge funkce `generate-prvouka-images` bez auth se service-role → lze přepsat ilustrace v dětské app / finanční DoS | Dev |
| B | Technika | 🟠 HIGH | **„67 padajících testů" má ≥6 příčin, NE jen whitelist** (moje včerejší tvrzení bylo chybné). Nejvážnější: `classifyIntent` přestal odmítat nesmyslné/out-of-scope vstupy (~40 selhání) — možná funkční regrese boundary brány | Dev (prošetřit) |
| P1 | Pedagogika | 🟠 HIGH | **Vymyšlené/zkomolené názvy druhů** v g4 přírodovědě (ekosystémy) — faktické chyby prezentované dětem | Dev/obsah |
| P2 | Pedagogika | 🟠 HIGH | Hinty u historických „seřaď" úloh **prozrazují celé chronologické pořadí** | Dev/obsah |

**Co vyžaduje TVOJI akci (ne dev):** rotace Groq klíče v Groq dashboardu (C1).

---

## 1. BEZPEČNOSTNÍ AUDIT

Celkově: architektura „anon key je veřejný, bezpečnost na RLS" je u **datových tabulek dodržena dobře**. Většina tabulek má korektní admin-only RLS. Díry jsou v (a) klientském Groq klíči a (b) neautentizovaných edge funkcích se service-role.

### 🔴 CRITICAL

**C1 — Groq API klíč v klientském bundlu**
`src/lib/aiClient.ts:6-34`, `src/components/admin/AdminContentAudit.tsx:116-120`
`VITE_GROQ_API_KEY` se přes `import.meta.env` zapéká do JS bundlu a posílá v `Authorization: Bearer` přímo na `api.groq.com`. Vše s prefixem `VITE_` je veřejně čitelné v prohlížeči (DevTools). Kdokoli klíč vytáhne → neomezené utrácení Groq kreditů na účet majitele. Komentář v kódu problém přiznává, ale je aktivní.
→ **Oprava:** (1) okamžitě rotovat klíč v Groq dashboardu; (2) přesunout všechna Groq volání do edge funkce (vzor `_shared/aiCall.ts` čtoucí `Deno.env.get("GROQ_API_KEY")`); (3) smazat `VITE_GROQ_API_KEY` z buildů. **Pozn.:** dotýká se nové funkce „Přeformulovat" (ta volá `callAi`→Groq z klienta).

**C2 — `generate-prvouka-images`: service-role edge funkce bez auth**
`supabase/functions/generate-prvouka-images/index.ts:395-424`, `supabase/config.toml:9-10`
`verify_jwt=false` + service-role klíč + žádná kontrola volajícího. Větev `save-image` zapisuje libovolný base64 do veřejného bucketu `prvouka-images` s `upsert:true` → neautentizovaný útočník může **přepsat existující ilustrace** (vložení nevhodného obsahu do dětské app) nebo spustit drahá AI generování (finanční DoS).
→ **Oprava:** přidat JWT + admin-role gate na začátek handleru (vzor `ai-curriculum/index.ts:99-135`).

### 🟠 HIGH

**H1 — `generate-logo`: stejný vzor jako C2** (`supabase/functions/generate-logo/index.ts:20`) — neautentizované placené AI generování. Přidat admin gate.

**H2 — `send-parent-invite`: neautentizovaný email endpoint** (`supabase/functions/send-parent-invite/index.ts:127-189`) — `verify_jwt=false`, kdokoli s veřejným anon klíčem může posílat e-maily na libovolnou adresu s libovolným `childName` → email bombing, phishing („pozvánka od dítěte"), vyčerpání Resend kvóty, DB spam do `parent_invitations`. Vyžadovat JWT + rate-limit + (pro anon mód) captcha.

**H3 — `parent_invitations` UPDATE politika `USING(true)`** (`supabase/migrations/20260524180000_parent_invitations.sql:43-46`) — kterýkoli klient může UPDATEovat jakýkoli řádek pozvánky, zná-li/uhodne `id` → cizí pozvánky hromadně přepnout na `expired` (DoS propojení) nebo `accepted`. Použito v `Auth.tsx:85-88`. Přesunout UPDATE do edge funkce se service-role, nebo zúžit na vazbu k přihlášenému uživateli. **Ne `USING(true)`.**

**H4 — Storage bucket `prvouka-images` INSERT/UPDATE bez role restrikce** (`supabase/migrations/20260218124245_...sql:11-19`) — politiky „Service role can upload" mají jen `bucket_id=` bez role check → kterýkoli authenticated uživatel (i dítě) může nahrávat/přepisovat soubory. Doplnit `has_role(auth.uid(),'admin')`.

### 🟡 MEDIUM

- **M1** — `Auth.tsx:79-89`: po registraci klient volá `user_roles.insert({role:'parent'})`, ale **neexistuje INSERT politika pro non-adminy** → insert pod RLS selže (chyba ignorována). Bezpečnostně pozitivní (nelze self-escalovat na admin), ale funkčně: přiřazení role parent je nespolehlivé a invite se označí `accepted`, aniž vznikne propojení rodič-dítě v `children`. Řešit v edge funkci se service-role.
- **M2** — CORS `Allow-Origin: *` na všech edge funkcích. U funkcí s korektní JWT+role kontrolou OK; v kombinaci s C2/H1/H2 usnadňuje zneužití. Po opravě auth zvážit omezení na `oli-edu.com`.
- **M3** — `student_misconceptions` read-path přes `(supabase as any)` je RLS-krytý a bezpečný (uvedeno pro úplnost; bez akce).

### 🟢 LOW

- **L1** — `config.toml:1` `project_id="frxjmwmslxdrdhgcjicn"`, ale klient cílí na `uusaczibimqvaazpaopy` → ověřit, zda se `verify_jwt` nastavení aplikuje na živý projekt (nebo je to stará/jiná konfigurace).
- **L2** — Chybové hlášky propisují interní detaily (`send-parent-invite/index.ts:204`, `aiClient.ts:48`) — vracet generickou hlášku, detail jen do `console.error`.
- **L3** — ~48× `(supabase as any)` — **není bezpečnostní díra** (RLS server vynucuje), jen ztráta typové bezpečnosti. Regenerovat `types.ts`.

### ✅ Pozitivní (bez akce)
- Anon/publishable key v repu je **OK by design**; žádné `.env` se secrety v gitu.
- `pair-child` gated párovacím kódem; `analyze-misconceptions` má JWT+IDOR guard (vzor); `tutor-chat` má anti-leak postfiltr; `user_roles` neumožňuje self-escalation na admin; AI secrets jen z `Deno.env`.

**Počty:** CRITICAL 2 · HIGH 4 · MEDIUM 3 · LOW 3

---

## 2. TECHNICKÝ AUDIT

### 🟠 HIGH — Premisa „67 testů = whitelist" je CHYBNÁ

**Padá 17 test souborů s ≥6 různými kořenovými příčinami.** Whitelist `inputType` opraví jen **2 z 67**. (Potvrzeno: všech 67 je **pre-existující** — stejný počet na čistém HEAD i s mými změnami, takže to není regrese z 2026-06-08, ale starší dluh.)

| Cluster | Příčina | Soubory | ~počet |
|---------|---------|---------|--------|
| A | whitelist `inputType` chybí `true_false` | `topic-invariants.test.ts:42-53` | 2 |
| **B** | **`classifyIntent`/keyword-matching vrací `topical` místo `unclear_input`/`nonsense`/`wrong_grade`** — nová obsahová klíčová slova matchují dříve odmítané vstupy. **Možná funkční regrese boundary/security brány, ne jen test.** | `preintent*`, `red-team`, `security`, `system-stress`, `stress-test-a`, `keyword-conflicts`, `multi-role-flow`, `prvouka-visuals` | ~40+ |
| C | generátor produkuje `correctAnswer`, který není v `options` (vyjmenovaná slova, rýmy) | `generator-validation.test.ts` | 9 |
| D | rozpor spec: `validateTaskForInputType` vyžaduje `match_pairs ≥3`, test očekává „≥2 → valid" | `lib-utilities.test.ts:246` vs `taskValidator.ts:54` | 1 |
| E | i18n: `parent.greeting` neobsahuje placeholder `{name}` | `i18n-completeness.test.ts` | 1 |
| F | chybí topic `cz-sloh-vypraveni` v `allTopics` | `sloh-topics.test.ts` | 1 |

→ **Akce:** cluster **B** prošetřit prioritně (může znamenat, že žák reálně dostane „téma" na nesmyslný/out-of-scope vstup). Cluster A je triviální (+`true_false` do whitelistu). C/D/E/F řešit jednotlivě.

### 🟡 MEDIUM — nový kód z této session

- **`seededRandom.ts:36-44`** — `withSeededRandom` globálně přepisuje `Math.random`. Bezpečné **jen pro synchronní** generátory (ověřeno: 0 async generátorů), ale invariant nikde nevynucený. Async `fn` by tiše rozbil determinismus. Doporučení: JSDoc „fn MUSÍ být synchronní" + dev-guard `if (result instanceof Promise) throw`. Reentrance/výjimky OK.
- **`ReformulateTaskDialog.tsx:55-184`** — `parseVariants` **5× duplikovaný** + **bez typové validace**. Pokud AI vrátí `{"variants":["a","b"]}` místo `[["a"],["b"]]` u list-fieldů, render spadne na `.map is not a function`. Sjednotit do 1 helperu + `Array.isArray` guard.
- **`ExerciseTab.tsx:889`** — seed-effect má neúplné deps (chybí `skill.generator`, `skill.defaultLevel`); v praxi neškodné (skill immutable), ale porušuje `exhaustive-deps`.
- **`ExerciseTab.tsx` ~498,527,546,921,985,1022** — **zbytečné `(supabase as any)`**: `custom_exercises` JE v `types.ts:260`, cast maskuje chyby v názvech sloupců. (`admin_reviewed_cards` cast je naopak legitimní — po migraci přegenerovat typy.)
- **`handleReformulate` (AITaskRow)** volá edge funkci `ai-tutor` a **není za feature flagem** (na rozdíl od `generate()`). Ověřit, zda `ai-tutor` ještě žije; jinak je to mrtvá/rozbitá cesta (legacy AI-batch, nahrazená `ReformulateButtons`→Groq).
- **ESLint nelze spustit** — flat config má rozbitý plugin (`recommended undefined`). Samostatný problém; `npm run lint` selhává.

### 🟢 LOW
- `useExerciseReview.ts` — `reviewedRef` pattern je redundantní vůči funkčnímu setState updateru (funguje, jen lze zjednodušit). `persist` fire-and-forget bez `console.debug` v catch (těžší diagnostika).
- `ExerciseTab.tsx:1199` hardcoded `<p>1</p>` „typ vstupu". `SavedExercisesList` `colorClass` prop nepoužitý.
- `SavedExercisesList` effect na `[saved]` může přepsat ručně zvolený tab po refetchi (UX drobnost).

### ✅ Architektonické invarianty — DODRŽENY
CHECK <60ms (realtime smyčka nevolá síť/AI) · Generator = čistá funkce (0 async, 0 DB/AI) · Fire-and-forget persistence · AI stateless · žádná gamifikace. `tsc --noEmit` prochází (exit 0).

---

## 3. PEDAGOGICKÝ AUDIT

*(Informatika dle pravidla vynechána.)*
Auditní nástroje: **815 tasků, 84 % OK**, 134 obsahových + 124 pedagogických problémů.

### 🟠 HIGH

**P1 — Vymyšlené/zkomolené názvy druhů** (`src/content/grade-4/prirodoveda/lesLoukaPoleRybnikRostlinyAZivocichove.ts`)
Match-páry prezentují dětem jako fakta: „Slepice polní koroptev", „Čolník obecný" (→ čolek), „Leklík/Klouzatec (ryba)", „Snovač polní" (snovač je africký pták), „Marulka (Potentilla)" (Potentilla = mochna), „Zemník (brambor)", „Ořešník pěti". Neexistují / chybně zařazené. → Nahradit ověřenými českými druhy. **Vysoká priorita — přírodovědná fakta.**

**P2 — Hinty prozrazují celé pořadí** (`grade-4/vlastiveda/lucemburkoveKarelIvAJehoDoba.ts`, `mistrJanHusHusitskeValky.ts` a další drag_order historie)
První nápověda obsahuje kompletní správnou sekvenci, např. `"1310 → 1347 → 1355 → 1378."`. To je celá odpověď. Gradace navíc obrácená (hint2 užší než hint1). → První hint = strategie („kdo nastoupil první?"), nikdy celá sekvence.

### 🟡 MEDIUM

- **Historicky nepřesné pojmy** (`grade-4/vlastiveda/polohaCrVEvropeSousedniStaty.ts`) — „Českomoravské království" (neexistoval útvar; správně „Země Koruny české"), datace „Rakousko-Uhersko od 1526" (vzniklo 1867). Přeformulovat.
- **CJL g3 hint_leaky (~94)** — nápověda obsahuje správné slovo (synonyma, spojky, velká písmena). Přeformulovat na metakognitivní navádění.
- **12 neadaptivních generátorů** — `function gen(_level)` ignoruje úroveň (historická vlastivěda, ekosystémy, magické čtverce). Buď rozdělit pool na L1/L2/L3 (vzor: `polohaCrVEvropeSousedniStaty.ts`), nebo dokumentovat jako single-level + upravit audit.
- **Ekosystémy: cíle ≠ úlohy** — generátor dělá jen match „spoj druh s ekosystémem", ale `goals` slibují potravní řetězce/patra lesa; úlohy nemají hints ani explanation.
- **`wordProblems5.ts:215`** — `"${poSkupin} dětí"` pro hodnotu 4 → „4 dětí" (správně „4 děti"). Použít helper.

### 🟢 LOW
- Překlepy v drag_order `items` viditelné žákovi: „kralem", „korunován česky král", „první lucemburský krale", „Ořešník pěti". Korektura.
- `multiply.ts` — pro `×1` hint prozradí odpověď („7 = ?"). `fracOfNumber.ts:27,29`, `shapes.ts:42` — inline skloňování místo `czechGrammar`.

### ✅ Pozitivní
- **Nově přidané `explanation` v g4 vlastivědě (Lucemburkové, Hus) jsou kvalitní, unikátní, kauzální** a faktograficky správné — silná stránka.
- **`rounding4.ts`** = referenční vzor: matematicky správný, plně adaptivní L1/L2/L3, hinty bez prozrazení, kauzální solutionSteps + visualExamples.

---

## 4. Prioritizovaný akční plán

### P0 — okamžitě (bezpečnost)
1. **C1** Rotovat Groq klíč (Groq dashboard) + přesunout volání do edge funkce. ⚠️ *vyžaduje tvoji akci.*
2. **C2** Auth gate na `generate-prvouka-images` (přepis ilustrací útočníkem).

### P1 — vysoká
3. **H1–H4** Auth gaty (`generate-logo`, `send-parent-invite`) + zúžit `parent_invitations` UPDATE z `USING(true)` + role restrikce bucketu.
4. **Cluster B** Prošetřit `classifyIntent`/keyword regresi — reálně přestal odmítat nesmysl/out-of-scope?
5. **P1 pedagogika** Opravit vymyšlené druhy v ekosystémech.
6. **P2 pedagogika** Přepsat hinty historických drag_order úloh (neprozrazovat pořadí).

### P2 — střední
7. `parseVariants` sjednotit + validovat tvar (crash risk).
8. Test cluster A (+`true_false`), C, D, E, F — jednotlivě.
9. Odstranit zbytečné `(supabase as any)` u `custom_exercises`.
10. CJL g3 hint_leaky + neadaptivní generátory + historické pojmy.
11. Opravit ESLint flat config.

### P3 — nízká
12. Překlepy v items, inline skloňování, `withSeededRandom` JSDoc/guard, chybové hlášky (L2), `config.toml` project_id (L1).

---

## 5. Poznámka — korekce dřívějšího tvrzení
Včera (před tímto auditem) jsem v PENDING_CHANGES uvedl, že „67 padajících testů = zastaralý `inputType` whitelist". **To bylo chybné.** Audit ukázal ≥6 příčin; whitelist je jen 2 z 67. Nejvážnější je cluster B (možná regrese boundary brány). PENDING_CHANGES opraven.
