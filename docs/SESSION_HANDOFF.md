# Předání práce — stav k 2026-09-11

> Tenhle soubor je první, co si má nová session přečíst. Detail je
> v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.
>
> **Fáze:** od září se dělá **příprava spuštění** (právní stránky, mazání
> účtu, mobilní obal, bezpečnost). Session 37 (10.–11. 9.) se ale vrátila
> k obsahu, protože audit ukázal, že 4. ročník má slabé nápovědy a 5. a 6.
> ročník nebyly otevřené — obojí je teď hotové, viz §1.

---

## 0. Než začneš cokoli dělat

Ověř si to `git fetch`em, ne pamětí:

```bash
git fetch origin && git status -sb && git worktree list
```

**Pracovní větev je `main`.** K 2026-09-11 je všechno pushnuté — `origin/main`
je na commitu s tímhle předáním. Session 37 pracovala ve worktree
`session-handoff-docs-2dfc1f` na větvi `claude/pokracujeme-52f713`, která
sleduje `main`; pushovalo se přes `git push origin HEAD:main`.

**`push do main = nasazeno na produkci`** (Vercel, ověř
`gh api repos/Evzen652/Oli/commits/<sha>/status`).

### ⚠️ Past, na kterou v tomhle repu narazíš hned

Worktree `competent-johnson-de23e8` sedí na větvi `session-task-binding-v2`,
která **sleduje zastaralou vzdálenou větev** `chore/remove-essay-and-ai-authoring`.
`git status` tam hlásí „ahead" vůči **špatné** větvi. Pushovalo se z něj
explicitně `git push origin session-task-binding-v2:main`. Na druhém PC stačí
normální `git pull` na `main`.

### Worktree, ve kterých nepracuj

`git worktree list` jich ukáže víc. Většina sedí na starých commitech. Než
v některém začneš, přepni ho na `main` a udělej `git pull` — jinak píšeš
proti kódu, který už neexistuje.

---

## 1. Kde jsme skončili

### Session 37 (2026-09-10/11) — audit obsahu, 5. a 6. ročník otevřené

| commit | co |
|---|---|
| `3abac35` | audit 4. ročníku, 5. a 6. ročník připravené ke zveřejnění |
| `b156da7` | rodičovská brána počítá procenta, `ACTIVE_GRADES = [2, 3, 4, 5, 6]` |
| `226fce9` | hlavička cvičení psala „Dejepis" (slug místo popisku) |
| `eda02e9` | `select_one` porovnává přesně včetně velikosti písmen (`option_exact`) |
| poslední | 3. ročník: offline audit obsahu **72 → 0 nálezů** + toto předání |

**Stav obsahu:** `npm run audit:content` hlásí **0 problémů** (229 témat,
~11 950 úloh), všech 4 717 testů prochází, zámek obsahu
(`frozen-content.snapshot.json`) přegenerován pro ročníky 2–6.

**Na produkci ověřeno v prohlížeči:** ročníky 5 a 6 jdou vybrat, brána
chce „X % z Y", sezení 5. i 6. ročníku projde, hlavička píše „Dějepis",
„praha" už se u velkých písmen nehodnotí jako správně.

**Ve 3. ročníku přepsáno** (každé téma 3 oddělené banky, ≥ 13 úloh na úroveň,
vlastní nápovědy + zpětná vazba u chybných možností):
- 9 slohových témat + vyhledávání informací;
- slovní druhy, podstatná jména, synonyma, kořen slova, vyjmenovaná
  a příbuzná slova (doplňuje se jen grafém y/ý/i/í — `grade-3/_iy.ts`);
- matematika: převody délky, převody hmotnosti/objemu/času, malá násobilka,
  ×10/×100 a dělení se zbytkem.

Sdílení pomocníci `grade-3/_shared.ts` (`choice`, `urcovaci`, `shuffle`).

### ▶▶ ROZPRACOVÁNO (session 38, 2026-09-11): hromadné opravy — varianta A běží

Uživatel zvolil **A (všech 87)**. Na PC1 spuštěn workflow `content-fix-87`
(skript `scripts/workflows/content-fix-87.js`, dávky
`scripts/workflows/content-fix-87.args.json` — 22 dávek). Session přerušena
(došel kredit), workflow nedoběhl.

**Jak workflow pracuje:** každá dávka = autor ve **vlastním git worktree** a
větvi `content-fix/<dávka>` (proč worktree: `docs-check` i brána načítají celý
registr témat, takže rozepsaný soubor jednoho agenta by shodil kontroly všem
ostatním) → pak nezávislý **kritik** (Generator→Critic) ve stejné větvi,
commit „fix(content): kontrola …“. Na `main` nikdo nesahá, snapshot se
nepřegeneruje (dělá se až při slučování).

**Stav k přerušení (po dvou bězích, oba spadly na limitu relace).
Všechno je pushnuté na origin, na `main` NIC z obsahu není:**

| dávky | stav | kde |
|---|---|---|
| `g2mat-a`, `g2mat-b` | ✅ autor **i kritik** hotov | `origin/content-fix/*` |
| `g2mat-c`, `g2mat-d`, `g2cjl-a…d`, `g2prv-a`, `g2prv-b`, `g3mat-a…c`, `g3prv-a…c`, `g3cjl-a…c` (17) | 🟠 autor hotov, **kritik chybí** | `origin/content-fix/*` |
| `g5mat-a`, `g5mat-b`, `g4-6-mix` (3) | 🔴 rozdělané, **bez commitu** — jen snapshot, NEOVĚŘENÉ | `origin/wip/content-fix/*` (větev `content-fix/*` je u nich ještě na starém commitu) |

- Ověření stavu dávky: `git log --oneline -2 origin/content-fix/<dávka>` —
  commit „fix(content): **kontrola** …“ = kritik doběhl.
- Co kritik u dvou hotových dávek našel: 11 chyb v 6 tématech (mj. klíč, který
  nesouhlasil s vlastním řešením). **To je důvod, proč se zbylých 17 dávek nesmí
  slučovat bez kritika** — samotná brána i `docs-check` je propustily.

**Past, která tohle zdržela:** obě spadnutí byl limit relace, ne chyba obsahu.
Po pádu zůstanou worktree `.claude/worktrees/wf_*` (někdy `locked`) a větve
`content-fix/*` na základním commitu; nový běh pak neumí udělat
`git checkout -b`. Před dalším pokusem: `git worktree unlock/remove --force`
+ `git branch -D` u dávek bez práce (WIP si napřed zachraň přes
`git stash create` a push na `wip/content-fix/*`, viz výše).

**Pokračování (nová session, „use a workflow“):**
1. **Nejdřív kritik pro 17 dávek**, kde chybí (`critPrompt` ve skriptu; kritik
   pracuje ve worktree dané větve, a když už neexistuje, založí si nový:
   `git worktree add … content-fix/<dávka>` + junction na `node_modules`).
   Pusť je po ~8 dávkách na běh, ať se vejdeš do limitu.
2. Pak 3 nedokončené dávky autorem: `g5mat-a`, `g5mat-b`, `g4-6-mix` — výchozí
   bod je `origin/wip/content-fix/<dávka>` (neověřený!), pak kritik.
   `REPO` je ve skriptu natvrdo `C:\Users\Evzen\Desktop\OLI` — na druhém PC uprav.
3. Slučování (inline, ne agent): každou větev `git merge --squash` / 
   `git cherry-pick --no-commit` do `main` pracovního stromu → přegeneruj zámek
   `UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`
   → `npm test`, `npm run audit:content`, `npm run typecheck`,
   `IDS=<všech 87> npx vite-node scripts/docs-check.ts` → shrnutí uživateli →
   commit **až po souhlasu**. Push do `main` = produkce.

### ▶ DALŠÍ KROK: hromadné opravy obsahu podle inventury

Po posledním commitu session 37 proběhla **inventura celého obsahu** (workflow,
13 agentů): **`docs/CONTENT_INVENTORY.md`** (čitelný přehled po tématech)
a `docs/content-inventory-2026-09-11.json` (surová data s nálezy a soubory).

- 142 témat v pořádku / jen záměrné výjimky, **40 k cílené úpravě, 47 k přepisu
  generátoru**. Těžiště: 2. ročník (41 témat) a nepřepsaná část 3. ročníku.
  4.–6. ročník je skoro čistý.
- Hlavní nálezy: chybí zpětná vazba u chybných možností (~5 400 úloh), jedna
  malá nápověda pro celou úroveň (~2 700), chybí druhá nápověda (~1 600),
  < 12 unikátních úloh na úroveň. Offline audit (`audit:content` = 0) to
  nevidí — měří jen strukturu; tohle našel `scripts/docs-check.ts`.
- **Vidí to děti už teď:** brána FAIL u `g2-mat-mereni-casu`,
  `g2-mat-mereni-delky` a skupin dě/tě/ně; `g3-mat-tabulky-diagramy` radí
  „Sečti“ místo „odečti“; `g2-mat-bod-primka-usecka` má nejednoznačnou otázku.

**Uživatel chce opravy pustit workflowem (víc agentů najednou)** — zatím
nerozhodl mezi: A) všech 87 najednou (doporučeno), B) nejdřív 3 chyby
viditelné dětem, C) po ročnících. Návrh: ~15 agentů po 5–6 tématech z
inventury, úpravy přímo v souborech témat (nepřekrývají se), každý musí mít
svá témata čistá v `audit-topic` + `docs-check`; zámek obsahu, testy,
dokumentaci a commit dělá až jeden závěrečný krok. Inventuru jde zopakovat
skriptem `scripts/workflows/content-inventory.js` (args: `wt`, `groups` =
id témat po `ročník|předmět`).

Nástroje: `node scripts/audit-topic.mjs <id>` (brána),
`IDS=a,b npx vite-node scripts/docs-check.ts` (všechny úlohy, přísné),
`npm run audit:content` (offline audit celku).

### Session 2026-09-09/10 — appka poprvé celá venku

Vercel napojen na GitHub (`d9e61b5`), nasazeny migrace, secret
`PAIRING_HASH_SALT`, čtyři edge funkce. Dětská cesta bez registrace
proklikaná na produkci. Degradace při rozbité AI je poctivá (dítě vidí
lokálně složenou větu, ne chybu). Detail v historii tohoto souboru.

---

## 2. Co má udělat Evžen — přesné kroky

Runbook: **https://claude.ai/code/artifact/fd60671e-87be-4aba-bf5e-ed12ac68d18d**
Definice hotového: **https://claude.ai/code/artifact/7551d87a-89ec-4f31-bbce-db3a2b68b299**

1. ⛔ **Proklikat tři scénáře vázané na účet** — registrace rodiče →
   spárování dítěte → smazání účtu, a v Auth → Users ověřit, že účet zmizel.
   **Claude to udělat nesmí** (zakládat účty a zadávat hesla je zakázané).
2. ⛔ **Opravit oba AI klíče.** `GROQ_API_KEY` nemá přístup k modelu
   (`404 model_not_found`), `GEMINI_API_KEY` vrací „Please pass a valid API
   key". Spuštění to neblokuje, ale slovní hodnocení a týdenní zpráva bez toho nejsou.
3. **Potvrdit `appId`** `com.oliedu.app` v `capacitor.config.ts` — po prvním
   vydání je **nevratný**.
4. **Apple Kids Category, nebo smíšené publikum.**
5. **Právní kontrola zásad soukromí.**
6. **Podpisový klíč pro Android**, ověření domény pro App Links / Universal
   Links, formuláře o datech v obou obchodech.

---

## 3. Co je nasazené

Všech šest edge funkcí vrací 200 (sonda 10. 9.), obě migrace proběhly ručně
v SQL editoru (nejsou v `supabase_migrations`, jsou idempotentní).
**Neověřené:** že po skutečném smazání účtu nezbude řádek v žádné ze 13 tabulek.

> **Ověřuj sondou, ne čtením** — tenhle soubor nevyjímaje.

---

## 4. Otevřené pro další session

### 🟠 Zbytky obsahu (docs-check, ne offline audit)
- `g3-cjl-velka-pismena` L1 nemá zpětnou vazbu u chybných možností a sdílí
  obecné nápovědy. Možnosti „Praha / praha / PRAHA" jsou záměr (s `option_exact`
  je to legitimní úloha), ale feedback chybí.
- Matematické generátory 3. ročníku, které se v session 37 nepřepisovaly,
  mají pořád malou nápovědu společnou pro celou úroveň.
- Výčtové úlohy („Které z čísel … je největší?") mají klíč ve znění
  z podstaty — brána je bere jako výjimku.

### 🟠 Sliby vs. obsah
Titulek a Open Graph slibují „1. stupeň ZŠ" (1.–5. ročník). Otevřené jsou
**2.–6.**, chybí 1. ročník. 6. ročník má zatím jen fyziku a dějepis.
Otevření 7. ročníku by oslabilo rodičovskou bránu — hlídá `parent-gate.test.ts`.

### 🟠 Dvě češtinové karty mají tentýž obrázek
„Příbuzná vyjmenovaná" i „Pravidla rozhovoru" (3. ročník) mají stejnou
ilustraci ABC. Projít mapování napříč předměty, ne opravit jen tyhle dvě.

### 🟠 Dopsat ověření serverové kopie anonymního pokroku
Zásady soukromí slibují serverovou kopii; `serverRecordTask` v
`anonProgress.ts` existuje, ale že se zápis provede, ověřené není.

### 🟠 Rozcestník — podklad karet, pak teprve kresby
Levandulová je náš předmětový tint `bg-[#E3EDFD]`, který podle
`subjectRegistry.ts` nemá být pozadím celé karty (v `TopicBrowser` zabírá 72 %).

### 🟠 Rozhodnutí uživatele
- Kontrast primární barvy: bílá na `#F97316` má 2,79 : 1 (WCAG AA 4,5 : 1).
- Pohár ve shrnutí se zobrazí i při 1/6 — odstupňovat?
- Dětský e-mail se odvozuje z párovacího kódu (`child_<kód>@app.internal`).
- Váha buildu 23,6 MB (18,5 MB obrázků; **na landing obrázky nesahat bez pokynu**).
- Admin veze ~3 000 řádků vypnuté AI větve.

---

## 5. Pasti prostředí, které stály čas

### Přibylo 2026-09-11 (obsah)

**Brána obsahu:** `node scripts/audit-topic.mjs <topicId>` (PASS/FAIL)
a `npm run audit:content` (celý offline audit). Co detektory berou:
- **Únik v nápovědě** = kterékoli slovo odpovědi o ≥ 4 znacích se objeví
  v nápovědě **i jako část jiného slova** („lesní" v „lesník", „slov" ve „slova").
- **Formát:** správná možnost nesmí být ≥ 2× delší než všechny distraktory;
  distraktor nesmí být obsažen v klíči (i bez ohledu na velikost písmen,
  „Rohlík!" v „…jeden rohlík."); šipky „→" a slovo „správně" v klíči
  čte jako meta-text.
- **Klíč ve znění otázky** je povolený jen s předponou `Text:` (úlohy
  na porozumění textu).
- **Úrovně** se počítají rozdílem (`getTierTasks`): L2 bere jen úlohy, které
  nejsou v L1. Překrývající se výřezy jednoho seznamu dají na L3 skoro nic.

**Soubory v repu mají smíšené konce řádků (CRLF i LF).** Náhrady skriptem
nejdřív normalizuj na `\n`, pak vrať původní. Regexy se zpětnými lomítky
nepiš přes bash heredoc s escapováním — Write toolem do `.cjs`.

**Zámek obsahu po změně:**
`UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`.

### Přibylo 2026-09-10

**Vercel: „already connected" neznamená připojeno** (`link.sourceless: true`,
musí se nejdřív `git disconnect`). **Browser panel doručuje kliknutí
nespolehlivě** — ověřuj stav přes DOM (`get_page_text`, `find`,
`javascript_tool`); skrytý panel = viewport 0×0. U React inputů nastav
hodnotu přes `HTMLInputElement.prototype` setter a pošli `input` event.

### Ze starších session

- **Bash tool je Git Bash** — `sed`, `grep`, `head` fungují; pro soubory
  ale preferuj Read/Grep/Glob.
- **PowerShell rozbaluje jednoprvková vnořená pole** — po dávkové náhradě vždy
  `git diff --stat`.
- **Commit message piš Write toolem a commituj přes `git commit -F`**, ne
  `Out-File` (BOM v předmětu) ani here-string.
- **Konzole v prohlížeči drží zastaralé chyby** — ověřuj po reloadu.
- **Vite si bere vlastní port** — ověř v `preview_logs`.
- **Dětské a rodičovské plochy vyžadují přihlášení** — heslo Claude zadávat nesmí.

---

## 6. Pravidla, která se opakovaně uplatnila

- **Rodičovská a žákovská část se mění spolu.**
- **Emoji nepatří vedle akvarelů** — viz `docs/ILLUSTRATION_STYLE.md`.
- **Formulace pro dítě bez rodových koncovek** — aplikace pohlaví nezná.
- **Nápověda navádí, neprozrazuje; každá úloha má vlastní obě nápovědy.**
- **Když komentář tvrdí něco, co po změně neplatí, patří opravit v témže commitu.**
