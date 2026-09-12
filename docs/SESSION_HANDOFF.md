# Předání práce — stav k 2026-09-12

> Tenhle soubor je první, co si má nová session přečíst. Detail je
> v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.
>
> **Fáze:** od září se dělá **příprava spuštění** (právní stránky, mazání
> účtu, mobilní obal, bezpečnost) — ta stojí na čtyřech rozhodnutích
> uživatele, viz §2. Session 38–39 (11.–12. 9.) se ale vrátily k obsahu,
> protože inventura našla 87 témat k opravě. **Ten průchod je z 86 %
> hotový a chybí u něj poslední tři kontroly — začni tím, viz §1.**

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

### ⚠️ Worktree: 22 jich patří k opravám obsahu

`git worktree list` ukáže 23 položek. Kromě hlavního repa je to
**22 worktree `.claude/worktrees/wf_84b89ce1-8c0-*`** — jeden na každou dávku
oprav obsahu, každý má checkoutnutou svou větev `content-fix/<dávka>`.
Nejsou locked a `node_modules` junction v nich funguje. U 19 dávek je práce
hotová a sloučená, takže ty worktree už jsou k ničemu; potřebné jsou jen
`8c0-20`, `8c0-21` a `8c0-22` (viz §1). Až se sloučí i ty, můžeš celou sadu
uklidit `git worktree remove --force` + `git branch -D`.

> Starší verze tohohle souboru tu varovala před worktree
> `competent-johnson-de23e8` se zastaralým remote. **Ten už v repu není** —
> ověřeno 12. 9. přes `git worktree list`.

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

### ▶▶ ZAČNI TADY: opravy obsahu, zbývají tři kontroly (12. 9.)

**Kde to stojí:** inventura našla 87 témat k opravě, rozdělených do 22 dávek.
Každá dávka = autor napíše/opraví, pak ji projde **nezávislý kritik**.

| stav | dávek | témat |
|---|---|---|
| ✅ autor i kritik, **sloučeno do `main`** | 22 | 87 |

**Opravný průchod je hotový.** Všech 22 dávek má autora i nezávislého kritika
a všechno je sloučené do `main`. Poslední tři dávky (12. 9., squash commity):

| dávka | commit autora | kritik | squash v `main` |
|---|---|---|---|
| `g5mat-a` | `6363b28` | `28b5be6` | `7c62066` |
| `g5mat-b` | `46fc9e8` | `9068e1d` | `c908b90` |
| `g4-6-mix` | `59f79ab` | `d50de2d` | `65a666f` |

Zámek obsahu přegenerován v `c619cb3` (sedm témat změnilo zadání nebo klíč).

✅ **Pushnuto na produkci 12. 9.** — `origin/main` je na `1580cff`.
Nasazení samo ověřené není: `gh` tu není přihlášený, takže
`gh api repos/Evzen652/Oli/commits/<sha>/status` neprojde bez `gh auth login`.

✅ **Uklizeno 12. 9.** — 22 worktree `wf_84b89ce1-8c0-*` odstraněno, smazány
větve `content-fix/*` (22) i pomocné `worktree-wf_*` (22). Zbývá **jeden**
worktree (hlavní repo) a tři větve: `main`, `chore/remove-essay-and-ai-authoring`,
`claude/cranky-shirley`.

⚠️ **Squash merge nezaznamená větev jako sloučenou** — `git log main..<větev>`
u ní ukáže commity, i když jejich obsah v `main` je (squash má jiný SHA
a žádného rodiče z větve). `git branch --merged` ji proto taky nevypíše.
Ověřuj obsahově, ne podle commitů:
```bash
mb=$(git merge-base main $b); files=$(git diff --name-only $mb $b)
git diff main $b -- $files      # prázdné = práce větve je v main
```
Prostý `git diff main $b -- src/content/` **nestačí** a je zavádějící: ukáže
hlavně to, co má `main` navíc z ostatních dávek, takže každá větev vypadá
jako nesloučená.

📌 **`origin/wip/content-fix/*` (11 větví) zůstaly.** Devět z nich nese obsah
lišící se od `main` — jsou to překonané mezistavy z doby před finálními
commity autora a kritika, ne ztracená práce. Mazat je nikdo neověřil do
hloubky a je to nevratné na sdíleném originu, takže to čeká na rozhodnutí.

⚠️ **Větve dávek sáhly jen na své obsahové soubory.** `git diff main` v nich
ukazuje i dokumentaci a skripty, ale to je pohyb `main` od merge-base, ne
změna větve — `git merge --squash` proto nic v dokumentaci nepřepíše.
Ověřuj to `git diff $(git merge-base main HEAD) HEAD --stat`, ne `git diff main`.

Větve `origin/wip/content-fix/*` jsou tím **překonané** — byly to pojistky
rozdělané práce, dnes je všechno v commitech. Nepoužívej je.

#### Postup jedné kontroly (ověřený, ~15–20 min na dávku o 3 tématech)

1. `cd` do worktree dávky. Worktree existují, nejsou locked a `node_modules`
   junction v nich funguje.
2. **Nejdřív strojové kontroly, ať nečteš to, co spočítá skript.** Pusť je
   rovnou z větve s `IDS=<témata dávky>`:
   ```
   IDS=<témata> npx vite-node scripts/check-keys-arith.ts
   IDS=<témata> npx vite-node scripts/check-keys-tables.ts
   IDS=<témata> npx vite-node scripts/lint-agreement.ts
   IDS=<témata> npx vite-node scripts/check-hint-leak.ts
   ```
   ⚠️ **Nekopíruj je z `main`.** Dřívější znění tvrdilo, že ve větvi nejsou —
   **jsou tam a jsou s `main` shodné** (ověřeno 12. 9. na `g5mat-a`). Kdo je
   zkopíruje, smaže při úklidu skutečné soubory větve; vrací je
   `git checkout -- scripts/… src/lib/czechAgreementLint.ts`.

   ⚠️ **U geometrie a pojmových témat tyhle skripty nic neověří** — hlásí
   „nepokryto vzorem" u všech úloh, protože neumí jejich tvar zadání.
   `PASS` z nich tedy není důkaz. U `g5mat-a` musel kritik napsat vlastní
   přepočet klíče ze znění zadání (parser + vlastní tabulky os) — teprve ten
   ověřil 6 974 úloh.

   ⚠️ **`check-hint-leak.ts` nevidí `match_pairs`, `categorize` ani
   `drag_order`.** Porovnává nápovědu s `correctAnswer`, a ten je u těch typů
   jen řetězec „match" / „categorize" / „order" — skutečné řešení je v
   `pairs` / `categories` / `items`. U `g4-6-mix` tak proklouzla nápověda,
   která rozebrala dvě dvojice ze tří a třetí nechala vyjít vylučováním.
   U těchhle typů si napiš vlastní kontrolu: *kolik dvojic/položek nápověda
   rozebere?* Jedna je záměr (ukázková úvaha), dvě a víc řeší úlohu.
3. Co skript nepokryje, vyřeš sám a porovnej s klíčem. Šablonovaná zpětná
   vazba: kontroluj, že čísla v ní sedí ke konkrétní úloze — tam se chyby
   schovávají.
4. `node scripts/audit-topic.mjs <id>`, `IDS=<id> npx vite-node scripts/docs-check.ts`,
   `npm run typecheck`. Celý `npm test` ve worktree nespouštěj.
5. Commit `fix(content): kontrola …` do `content-fix/<dávka>` + push té větve.
   **Když kritik nic nenajde, udělej prázdný commit** `--allow-empty` se stejným
   prefixem — jinak `git log` nerozliší „proběhlo bez nálezu" od „neproběhlo".

⚠️ **Nález strojové kontroly nejdřív ručně přepočítej.** 12. 9. bylo šest
z prvních nálezů chybou kontroly, ne obsahu (koncovka -ek jako genitiv,
„4 jen", přivlastňovací „nohy 4 kachen", trojčlenný výraz, oddělovač tisíců,
štítek „Na kole"). Falešná „oprava" správného obsahu je horší než nález
nechat ležet.

#### Co mají kritici u těchhle tří dávek ověřit přednostně

Autoři sami hlásí, co opravili — kritik to má potvrdit nezávisle:
- `g5mat-b`: ✅ **ověřeno 12. 9.** — u řady se střídavými kroky
  (`8, 13, 10, 15, 12, 17, ?`) byl **klíč 22 místo 14** a správná odpověď se
  nabízela jako distraktor. Po opravě vychází 14 a 22 je distraktor.
  **Tahle chyba je pořád na `main`, tedy v produkci**, dokud se dávka nesloučí.
  Kritik našel navíc pět ručně psaných tvarů po číslovce, dvě vadné vazby
  a nejednoznačné zadání „Kolik pravých úhlů má lichoběžník?" — detail
  v `PROJECT_STATUS.md` §6, session 40.
- `g5mat-a`: ✅ **ověřeno 12. 9.** — tři z pěti převodů jednotek obsahu na
  větší jednotku se opravdu negenerovaly (duplicitní distraktor →
  `ciselnaUloha` vracela `null`) a po opravě se generuje všech pět. Kritik
  našel navíc tři chyby v textech kolem klíče (tvar „3 řad", zpětná vazba
  u „4 osy" si odporovala u H/I/O/X, nepravdivé zobecnění o trojúhelnících) —
  detail v `PROJECT_STATUS.md` §6, session 40.
- `g4-6-mix`: ✅ **ověřeno 12. 9.** — klíč „bouřka" v zadání doslova nestojí
  („prudký déšť s hromy a blesky") a nápovědy u diagramů nesou všechny řádky.
  Kritik našel navíc **nápovědu, která řešila celou úlohu** (u párování
  evropských států rozebrala dvě dvojice ze tří), rozptylovač neodpovídající
  chybě, kterou popisuje, klíč uhodnutelný podle délky, dva popisy tématu
  slibující látku, která v úlohách není, jeden vymyšlený význam a index, kvůli
  kterému se polovina banky nikdy nestala klíčem — detail
  v `PROJECT_STATUS.md` §6, session 40b.

#### Slučování do `main` (inline, ne agent)

```
git merge --squash content-fix/<dávka>   # pro každou ze tří
UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts
npm test && npm run audit:content && npm run check:keys && npm run check:keys:tables
REPEATS=12 npm run audit:agreement && npm run audit:ui && npm run build
```

⚠️ **Past:** `frozen_content_unchanged` spadne, dokud se snapshot
nepřegeneruje — zadání nebo klíč se mění u
`konstrukceTrojuhelnikuKolmiceRovnobezky` (+5 úloh),
`scitaniAOdcitaniDesetinnychCisel` („6,0" místo „6"),
`ulohyNezavisleNaBeznychPostupech…` (opravený klíč) a po `g4-6-mix` ještě
u `slovaJednoznacnaMnohoznacnaVicevyznamova` (L1 16 → 24 úloh),
`periodizaceLetopocet` (jiný rozptylovač) a
`evropskeStatyAEuSousedniZemeCrPodrobne` (kratší velká nápověda).

Push do `main` = nasazení na produkci, tedy až po shrnutí uživateli.

#### ✅ `audit:content` už nehlásí nic

Audit vzorkuje losovaný obsah, takže vady vyplavou jen v části běhů (zhruba
1 ze 4–10) — **jeden běh proto není důkaz, pouštěj ho ve smyčce.** Poslední
zbývající nález (u nákupní úlohy `scitaniAOdcitaniDesetinnychCisel` se správná
odpověď náhodou shodovala s jednou z cen v zadání) opravila `g5mat-b`.
Po sloučení ověřeno osmi běhy po sobě — čisté.

Druhý nález téhož druhu (`g4-mat-cisla-do-milionu-4` měl u čtení čísel jen
tři možnosti, protože slovní klíč nemá číselnou pojistku na doplnění
distraktorů) je už opravený přímo na `main`.

**Jak takový nález chytit:** pusť audit ve smyčce a zastav se na prvním,
který má `Problémů > 0` — jednotlivý běh nic neukáže.

### Kontroly obsahu, které od 12. 9. existují

| příkaz | co dělá | v CI |
|---|---|---|
| `npm run audit:content` | offline audit struktury (a nově shoda přísudku ve VŠECH textových polích úlohy) | ano |
| `npm run audit:agreement` | shoda přísudku s číslovkou nad všemi tématy, `REPEATS=30` ≈ 78 000 úloh | ano |
| `npm run check:keys` | **přepočítá klíč z textu zadání**, nepřebírá ho z generátoru (matematika) | ano |
| `npm run check:keys:tables` | totéž pro tabulky, jízdní řády a diagramy (měřítko kroužku, zpoždění spoje) | ano |
| `npm run check:hints` | nápověda, která prozrazuje odpověď **obsahem**, ne slovem | ne — je měkká |
| `npm run check:length` | klíč nápadně delší než distraktory (dá se tipovat podle délky) | ne — report |

`check:hints` a `check:length` schválně nic neblokují: nález u nich není
důkaz chyby a CI by padalo na legitimním obsahu.

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

### 🟠 Zbytky obsahu — co zůstává i po opravném průchodu

Tohle **není** seznam z inventury (ten je z 86 % vyřízený, viz §1), ale věci,
na které kritici narazili a nechali je k rozhodnutí:

- **`crSymboly` L3 je z poloviny počítání letopočtů** — 6 ze 13 úloh je
  odčítání čtyřciferných čísel (1993 − 1415 = 578). Věcně správné, ale
  číselný obor 3. ročníku je do 1000 a nápověda učí písemné odčítání, což je
  učivo 4. ročníku.
- **Klíč bývá nejdelší možnost** (~45 úloh napříč tématy). Žák může tipovat
  podle délky. Změř to `npm run check:length`.
- **Výčtové úlohy** („Které z čísel … je největší?", „Najdi sloveso ve větě")
  mají klíč ve znění z podstaty — brána i `docs-check` je berou jako výjimku
  a je to správně.
- **Dvě kontroly na leak si odporují:** `src/test/topic-gate.test.ts` hledá
  klíč v nápovědě prostým `includes` bez výjimky pro „rejstřík možností",
  kterou `supabase/functions/_shared/hintLeakage.ts` má; a `normalize()`
  v `hintLeakage` odstraňuje `„`, ale ne `“`. Autoři to museli obcházet
  v obsahu — patří to opravit v kontrolách.
- **`parovani` v `src/content/grade-5/_shared.ts`** skládá velkou nápovědu tak,
  že končí utrženou větou o jiné dvojici („…doplň vylučováním. V Římě stojí
  Koloseum…"). Týká se všech témat, která helper používají.
- **Tiché mizení úloh:** duplicitní distraktor způsobí, že `ciselnaUloha`
  vrátí `null` a úloha zmizí, aniž to kdokoli pozná (stalo se u tří z pěti
  převodů jednotek obsahu). Stálo by za kontrolu „generátor vrátil míň úloh,
  než kolik má v poolech" — co nevznikne, žádný audit nezkontroluje.

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
