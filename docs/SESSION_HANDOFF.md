# Předání práce — stav k 2026-09-07

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

**Pracovní větev je `main`.** K 2026-09-07 je `origin/main` na `6da65f2`.

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

Poslední session (2026-09-06 → 07) uzavřela **všechny čtyři blokery obchodů**
a jeden bezpečnostní nález. Jedenáct commitů, `ccfc592` … `6da65f2`:

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

**Kód je hotový. Skoro všechno ostatní čeká na Evžena.**

---

## 2. Co má udělat Evžen — přesné kroky

Runbook se čtrnácti kroky, příkazy, odkazy a kontrolou u každého kroku:

**https://claude.ai/code/artifact/fd60671e-87be-4aba-bf5e-ed12ac68d18d**

Stav a definice hotového (co ještě chybí ke spuštění):

**https://claude.ai/code/artifact/7551d87a-89ec-4f31-bbce-db3a2b68b299**

Nejkratší shrnutí:

```bash
npx supabase login
npx supabase link --project-ref uusaczibimqvaazpaopy
npx supabase secrets set PAIRING_HASH_SALT=<náhodných 32 bajtů hex>
npx supabase db push
npx supabase functions deploy pair-child session-evaluation weekly-report delete-account
```

A čtyři věci k vyplnění nebo rozhodnutí:

1. **Údaje provozovatele** v `src/content/legal.ts` — název, IČO, adresa,
   kontaktní e-mail. Dokud tam stojí `DOPLNIT`, právní stránky to vykreslí
   jako žlutý zástupný text.
2. **Potvrdit `appId`** `com.oliedu.app` v `capacitor.config.ts` — po prvním
   vydání je **nevratný**.
3. **Apple Kids Category, nebo smíšené publikum.** Brána je hotová a povinná
   v obou případech, takže to nic neblokuje — potřebuje se to až do formulářů.
4. **Právní kontrola zásad soukromí.** Není to posudek, u služby pro děti to
   není formalita.

---

## 3. Co je nasazené a co ne — ověřeno 2026-09-06 sondou

| nasazené | NEnasazené |
|---|---|
| `child-relogin`, `set-child-pin`, `anon-progress`, `analyze-misconceptions`, `send-parent-invite`, `generate-prvouka-images`, `ai-curriculum` | **`pair-child`**, `session-evaluation`, `weekly-report`, **`delete-account`** (nová), `exercise-validator` (odcházející, nevadí) |

**Dokumentace k tomuhle byla sedm týdnů zastaralá.** `PENDING_CHANGES` vedl
`child-relogin` a `set-child-pin` jako nenasazené — jsou nasazené. `CLAUDE.md`
tvrdil, že PIN migrace čeká — sloupce `pin_hash`, `pin_failed_attempts`
v databázi **jsou**. Ověřuj sondou, ne čtením.

**Neověřeno:** jestli proběhla migrace `20260719120000_fix_profile_provisioning`
(registrace rodiče vracela 500). Zjistit nešlo — ověření vyžaduje založit účet
a zadat heslo, což Claude dělat nesmí.

---

## 4. Otevřené pro další session

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

## 5. Pasti prostředí, které v téhle session stály čas

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
