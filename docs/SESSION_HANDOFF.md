# Předání práce — stav k 2026-09-10

> Tenhle soubor je první, co si má nová session přečíst. Detail je
> v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.
>
> **Fáze se změnila.** Do konce srpna se dělal obsah (Wave B, přiměřenost
> ročníku, pozice správných odpovědí). Od začátku září se dělá **příprava
> spuštění** — právní stránky, mazání účtu, mobilní obal, dětská kategorie,
> bezpečnost. Starší poznatky z obsahové fáze jsou v historii tohohle souboru
> (`git log -p docs/SESSION_HANDOFF.md`) a v `PENDING_CHANGES.md`.

---

## 0. Než začneš cokoli dělat

Ověř si to `git fetch`em, ne pamětí:

```bash
git fetch origin && git status -sb && git worktree list
```

**Pracovní větev je `main`.** K 2026-09-10 je `origin/main` na `d9e61b5`
a pracovní strom je čistý — všechno je pushnuté.

**Od 10. 9. platí `push do main = nasazeno na produkci.`** Sedm týdnů to
neplatilo (viz §1), takže pokud sis to odvykl, odvykni si to zpátky.

### ⚠️ Past, na kterou v tomhle repu narazíš hned

Worktree `competent-johnson-de23e8` sedí na větvi `session-task-binding-v2`,
která **sleduje zastaralou vzdálenou větev** `chore/remove-essay-and-ai-authoring`.
`git status` tam proto hlásí `[ahead 29]` — ale vůči **špatné** větvi. Skutečný
stav je, že všech 29 commitů **na `origin/main` je**.

Pushovalo se z něj explicitně:

```bash
git push origin session-task-binding-v2:main
```

**Na druhém PC to nic neznamená** — tam stačí normální `git pull` na `main`.

### Worktree, ve kterých nepracuj

`git worktree list` jich ukáže sedm. Většina sedí na starých commitech
(`fd45fe5`, `feed2bf`). Než v některém začneš, přepni ho na `main` a udělej
`git pull` — jinak píšeš proti kódu, který už neexistuje. Tahle záměna už
jednou stála celý task.

---

## 1. Kde jsme skončili

### Session 2026-09-09/10 — appka je poprvé celá venku a ověřená

Do téhle session byl hotový kód, ale **nic z toho neběželo**. Teď běží:

| commit | co |
|---|---|
| `0ad36e9` | údaje provozovatele v právních stránkách |
| `df34a36` | lhůty stály v prvním pádě za předložkou |
| `7aaebcd` | proč Vercel nikdy nedeployoval z pushů |
| `d9e61b5` | Vercel napojen na GitHub, push zase nasazuje |

**Nasazeno a ověřeno skutečným voláním** (ne výpisem z nasazení): dvě
migrace, secret `PAIRING_HASH_SALT`, čtyři edge funkce, produkční web.
Podrobnosti v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.

### Co proklikal Claude na ostré produkci (10. 9.)

**Celá dětská cesta bez registrace projde.** Landing → onboarding → volba
ročníku → doporučená cvičení → šestiúlohové sezení → shrnutí. Bez chyby
v konzoli. Ověřeno konkrétně:

- ročníky **2, 3, 4** otevřené, 1/5/6 „brzy" — slib sedí se skutečností;
- špatná odpověď vysvětlí **proč**, ne jen správný klíč;
- obě úrovně nápovědy existují a jsou různé;
- dlouhé možnosti se přepnou do jednoho sloupce;
- shrnutí počítá správně (6 celkem, 3 správně, 2 s nápovědou, 1 špatně).

**Nejcennější zjištění — degradace při rozbité AI je poctivá.** Přímé
volání `session-evaluation` vrací `500 AI gateway error 400: "Please pass
a valid API key"`, ale dítě nevidí chybu ani zaseknuté „Sovička přemýšlí…" —
zobrazí se lokálně složená věta. Zároveň to dokazuje, že řetěz Groq → Google
opravdu proběhne.

**Podezření, které se NEpotvrdilo:** v konzoli svítí `No authenticated user,
skipping persistence`, což vypadalo jako rozpor se zásadami soukromí (slibují
serverovou kopii anonymního pokroku). `anonProgress.ts` ale má
`serverRecordTask` — dual-write na server. Hláška je z jiného subsystému
(`PerformanceTracker`). **Dokončeno to nebylo**, session skončila dřív; ber
jako otevřené, ne uzavřené.

### Session 2026-09-06 → 07 — čtyři blokery obchodů

Jedenáct commitů, `ccfc592` … `6da65f2`:

| commit | co |
|---|---|
| `ccfc592` | vstupní obrazovky na tokeny, zaregistrován `--foreground-soft` |
| `ede40fb` | zásady soukromí a podmínky použití (`/soukromi`, `/podminky`) |
| `ec4957b` | mazání účtu — edge funkce, dialog, `/smazani-uctu` |
| `ca0fd31` | obal aplikace přes Capacitor (android + ios) |
| `2adf6ea` | rodičovská brána (Play Families / Apple Kids) |
| `477336a` | párovací kód — CSPRNG + limit pokusů |
| `8525b39` | dlaždice statistik dostaly tint |
| `3c2294a` | dětský modál — pryč se sbalenými sekcemi |
| `3cb0cdf` | chip předmětu se uřízl o horní hranu |
| `3c5b605` | prázdný stav „Úkoly od rodiče" |
| `6da65f2` | tři okruhy matematiky měly tentýž obrázek |

**Kód i nasazení jsou hotové.** Zbytek čeká na Evžena — a je to výhradně to,
co Claude dělat nesmí (účty, hesla, udělování přístupů, formuláře obchodů).

---

## 2. Co má udělat Evžen — přesné kroky

Runbook se čtrnácti kroky, příkazy, odkazy a kontrolou u každého kroku:

**https://claude.ai/code/artifact/fd60671e-87be-4aba-bf5e-ed12ac68d18d**

Stav a definice hotového (co ještě chybí ke spuštění):

**https://claude.ai/code/artifact/7551d87a-89ec-4f31-bbce-db3a2b68b299**

⚠️ **Blok příkazů, co tu stál dřív (`supabase login` / `link` / `db push`),
je pryč schválně — ta cesta nefungovala.** Migrace se nakonec pouštěly ručně
v SQL editoru. Nasazení už proběhlo, takže se to netýká běžného provozu; kdyby
bylo potřeba nasadit znovu, přečti si `PENDING_CHANGES` dřív, než to zkusíš
přes CLI.

Co zbývá:

1. ⛔ **Proklikat tři scénáře vázané na účet** — registrace rodiče →
   spárování dítěte → smazání účtu, a v Auth → Users ověřit, že účet zmizel.
   **Claude to udělat nesmí** (zakládat účty a zadávat hesla je zakázané
   i na výslovné vyžádání) a je to jediná část, která doopravdy dokáže,
   že celá cesta funguje. Dětskou cestu bez registrace Claude proklikal —
   viz §1.
2. ⛔ **Opravit oba AI klíče.** `GROQ_API_KEY` se ověří, ale nemá přístup
   k modelu (`404 model_not_found` u dvou různých); `GEMINI_API_KEY` vrací
   „Please pass a valid API key". Spuštění to neblokuje (degradace je
   ověřená, viz §1), ale slovní hodnocení a týdenní zpráva bez toho nejsou.
3. **Potvrdit `appId`** `com.oliedu.app` v `capacitor.config.ts` — po prvním
   vydání je **nevratný**.
4. **Apple Kids Category, nebo smíšené publikum.** Brána je hotová a povinná
   v obou případech, takže to nic neblokuje — potřebuje se to až do formulářů.
5. **Právní kontrola zásad soukromí.** Není to posudek, u služby pro děti to
   není formalita.
6. **Podpisový klíč pro Android**, ověření domény pro App Links / Universal
   Links, formuláře o datech v obou obchodech.

---

## 3. Co je nasazené — ověřeno 2026-09-10 voláním

**Všechno.** Sonda vrací 200 u všech šesti funkcí, žádná 404. `pair-child`
vrací 404 na neplatný kód a `delete-account` 400 bez potvrzovacího slova —
ten kód se tím poprvé prokazatelně **spustil**, ne jen nahrál.

Migrace `20260719120000_fix_profile_provisioning` (registrace rodiče vracela
500) **proběhla**. Napoprvé spadla na `23505 duplicate key` — guard kontroloval
`user_id`, ale primární klíč je `id`; opraveno a doběhla.

Migrace nejsou zapsané v `supabase_migrations`, protože šly mimo CLI. Obě jsou
idempotentní, takže pozdější `db push` je jen zopakuje bez škody.

**Co ověřené NENÍ:** že po skutečném smazání účtu nezbude řádek v žádné
ze 13 tabulek. Že funkce odmítne volání bez potvrzení, ověřené je — samotný
výmaz ne, protože k tomu je potřeba účet.

> Historická poznámka, ať se nevrací: do 9. 9. tahle sekce vedla polovinu
> funkcí jako nenasazené a `CLAUDE.md` tvrdil, že PIN migrace čeká. Obojí
> bylo sedm týdnů nepravda a plánovalo se podle toho. **Ověřuj sondou, ne
> čtením** — tenhle soubor nevyjímaje.

---

## 4. Otevřené pro další session

### 🟠 Dvě češtinové karty mají tentýž obrázek

Nález z proklikání 10. 9.: v „Dnes ti Oli doporučuje" (3. ročník) mají
**Příbuzná vyjmenovaná** i **Pravidla rozhovoru** stejnou ilustraci ABC.
Stejná třída chyby jako `6da65f2` (tři okruhy matematiky měly tentýž
obrázek) — takže to nejspíš není jednorázovka a stojí za to projít mapování
napříč předměty, ne opravit jen tyhle dvě.

### 🟠 Druhá nápověda je blízko prozrazení

U `g3-prvouka-…-ziva-a-neziva-priroda` zní druhý stupeň „Jsou to drobná
zrnka horniny." u otázky, kde je správně **Písek**. To už je definice, ne
navedení. U druhého stupně obhajitelné, ale pravidlo z `CLAUDE.md` říká
*navádí na strategii, neprozrazuje výsledek* — stojí za rozhodnutí, kde
u L2 nápověd leží hranice.

### 🟠 Dopsat ověření serverové kopie anonymního pokroku

Rozdělané z 10. 9., viz §1. Zásady soukromí slibují serverovou kopii;
`serverRecordTask` v `anonProgress.ts` existuje, ale že se zápis opravdu
provede a co přesně ukládá, ověřené není. Zásady, které slibují víc než
kód dělá, jsou problém — ne kosmetika.

### 🟠 Krok 2 rozcestníku — podklad karet, pak teprve kresby

Nález z 7. 9., zapsaný v `PENDING_CHANGES`. Původní diagnóza („3D obrázky si
nesou vlastní fialové pozadí") **byla chybná** — změřeno, obrázky jsou
průhledné PNG a levandulová je **náš vlastní** předmětový tint `bg-[#E3EDFD]`.

`subjectRegistry.ts` u `tintClass` píše: *„dlaždice ikony, chip, jemný podklad.
**Ne pozadí celé karty.**"* V `TopicBrowser` zabírá **72 % plochy karty**.

Tohle je nejspíš větší důvod, proč rozcestník nevypadá jako zbytek aplikace,
než rukopis kreseb — a opraví se bez jediného nového obrázku. **Udělat před
generováním**, jinak se nové kresby posuzují na podkladu, který sám nesedí.

### 🟠 Sliby vs. obsah

Titulek a Open Graph slibují „1. stupeň ZŠ" (1.–5. ročník). Otevřené jsou
**2., 3. a 4.** Buď stáhnout slib, nebo doplnit obsah. V popiscích obchodů je
nesoulad důvod k zamítnutí.

### 🟠 Kontrast primární barvy

Bílá na `#F97316` má **2,79 : 1** na každém primárním tlačítku; WCAG AA žádá
4,5 : 1. Oprava je jeden token, ale ztmaví značku. **Rozhodnutí uživatele.**

### 🟠 Váha buildu

`dist` má 23,6 MB, z toho **18,5 MB obrázků** (jednotlivé landing PNG ~1 MB)
a JS jeden chunk 5,1 MB / 1,4 MB gzip bez code splittingu. Na mobilních datech
to je hodně. **Na landing obrázky nesahat bez pokynu uživatele.**

### 🟠 Dětský e-mail se odvozuje z párovacího kódu

`pair-child` skládá `child_<kód>@app.internal`. Identita účtu je tím navázaná
na krátkou hádatelnou hodnotu a po přegenerování kódu už neodpovídá. Je to
změna schématu účtů, ne oprava limitu — čeká na rozhodnutí.

### 🟠 Admin veze ~3 000 řádků vypnuté větve

AI tvorba obsahu je za `adminAiContentCreator: false`, ale kód zůstal
(`AdminAIPanel`, `AdminAIChat`, `ExerciseValidator`, `ReformulateTaskDialog`,
mrtvá `ContentCoverageDashboard`). Navíc: cvičení schválené v adminu jde do DB,
kde ho `runOfflineAudit` nevidí a freeze neklíčuje.

---

## 5. Pasti prostředí, které stály čas

### Přibylo 2026-09-10

**Vercel: „already connected" neznamená připojeno.** Projekt měl
`link.sourceless: true` — vazbu, která existuje jen jako metadata a z pushů
nestaví. `vercel git connect` na ni odpoví „already connected" a nic
neopraví; musí se nejdřív `git disconnect`. Pod tím ležel omezený přístup
Vercel App k repozitáři na GitHubu. **Ani jedno není v dashboardu vidět**,
obojí se čte z API (token má CLI v `%APPDATA%\com.vercel.cli\Data\auth.json`).

**Browser panel doručuje kliknutí nespolehlivě.** Při proklikávání se
opakovaně stalo, že screenshot byl o krok pozadu a klik podle jeho souřadnic
minul, případně se nedoručil vůbec. `ref` z `read_page` zastarává po scrollu
a míří jinam. Co fungovalo: `get_page_text` / `find` na ověření skutečného
stavu DOM, protože **DOM je aktuální i když screenshot ne**. Než z toho
usoudíš, že je rozbité tlačítko, ověř stav přes DOM — jednou jsem takhle
málem nahlásil chybu, která neexistovala.

**Skrytý panel = viewport 0×0** a prázdné `read_page`. Pomůže `tabs_select`
plus `resize_window` na konkrétní rozměr.

### Ze starších session

**Bash tool nemá coreutils.** `sed`, `cat`, `head`, `grep`, `ls` — „command not
found". Používej PowerShell nebo Read/Grep/Glob.

**PowerShell rozbaluje jednoprvková vnořená pole.** `@( @("a","b") )` není pole
polí, ale plochý dvouprvkový řetězec, takže `foreach` iteruje po **znacích**.
Dávkový skript takhle nahradil v jednom souboru každé `b` za `g` (286×) — a jen
v tom souboru, který měl v tabulce jedinou dvojici. Po dávkové náhradě vždy
zkontroluj `git diff --stat`.

**Commit message piš Write toolem, ne `Out-File -Encoding utf8`.** PS 5.1 tím
zapíše BOM a git ho vezme jako součást předmětu (`﻿style(ui): …`, viz `8525b39`).

**Here-string má CRLF, soubory v repu LF.** Náhrady víceřádkových bloků přes
`.Replace()` proto tiše nenajdou nic. Používej Edit tool.

**Konzole v prohlížeči drží zastaralé chyby.** Poznáš to podle starého `?t=`
razítka a odkazu na stránku, ze které jsi dávno odešel. Ověřuj až po reloadu —
v téhle session tři „chyby" byly mezistavy HMR, které dávno neplatily.

**Screenshot se rozchází s DOM, když je stránka odscrollovaná.** Vrací prázdný
snímek. Měř přes `javascript_tool`, screenshot dělej po čerstvé navigaci.

**Vite si bere vlastní port.** Harness hlásil 59083, server běžel na **8082**.
Ověř si to v `preview_logs`.

**Dětské a rodičovské plochy vyžadují přihlášení**, takže je Claude živě
neuvidí (heslo zadávat nesmí). Ověřovat se dá náhledem složeným ze skutečných
tříd — v téhle session to fungovalo třikrát.

---

## 6. Pravidla, která se v téhle session opakovaně uplatnila

- **Rodičovská a žákovská část se mění spolu.** `ChildActivityBadge` ↔
  `StatPill`, texty přes `skillFeedback.ts`.
- **Sbalení není zhuštění, je to schování.** Pro rodiče volba, pro dítě
  smazání s klutrem navíc.
- **Emoji nepatří vedle akvarelů** — viz `docs/ILLUSTRATION_STYLE.md`.
- **Formulace pro dítě bez rodových koncovek** — aplikace pohlaví nezná.
- **Když komentář tvrdí něco, co po změně neplatí, patří opravit v témže
  commitu.** Zastaralá dokumentace v téhle session opakovaně vedla k nesprávným
  závěrům.
