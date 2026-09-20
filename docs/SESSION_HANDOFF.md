# Předání práce — stav k 2026-09-20

> Tenhle soubor je první, co si má nová session přečíst. Detail je
> v `PROJECT_STATUS.md` §6 a `docs/PENDING_CHANGES.md`.
>
> **Dvě větve práce běží vedle sebe:**
>
> 1. **Příprava spuštění** — právní stránky, mobilní obal, bezpečnost,
>    formuláře obchodů. Nejde dál sama od sebe: stojí na osmi rozhodnutích
>    a úkonech, které může udělat jen Evžen — **§2**. Od 13. 9. se v ní
>    nepohnulo, protože všechny zbylé kroky jsou na uživateli.
> 2. **Doplnění 6. ročníku** — fyzika 13/13, dějepis 24/24 (15. 9.),
>    matematika 12/12 a přírodopis 22/22 (16. 9.), **zeměpis 12/18 (20. 9.)**.
>    Šestka na **83 ze 117**. **Na řadě je poslední dávka zeměpisu** (6 témat)
>    podle `GRADE_6_COMPLETION_PLAN.md` — viz §1.
>
> ⚠️ Věta „obsah je hotový a uzavřený“, která tu stála do 13. 9., platila jen
> pro ročníky 1–5. Šestka rozdělaná je.

---

## 0. Než začneš cokoli dělat

Ověř si to `git fetch`em, ne pamětí:

```bash
git fetch origin && git status -sb && git worktree list
```

**Pracovní větev je `main`.** K 14. 9. je všechno pushnuté, `origin/main` je na
`1951c85`, pracovní strom čistý. **Worktree jsou dva** (hlavní repo
a `competent-johnson-de23e8`); pět zastaralých odstraněno 15. 9. bez ztráty
práce — viz `SESSION_PROTOCOL.md` krok 1.
Lokální větve tři: `main`, `chore/remove-essay-and-ai-authoring`,
`claude/cranky-shirley`.

**`push do main = nasazeno na produkci`** (Vercel). Ověřit to odsud nejde —
`gh` v tomhle prostředí není přihlášený, takže
`gh api repos/Evzen652/Oli/commits/<sha>/status` neprojde bez `gh auth login`.
Po každém pushi to uživateli řekni, neprodávej push jako ověřené nasazení.

### Větve na originu, které se neuklidily

`git branch -r` jich ukáže 50. Z toho:

- **22 × `origin/content-fix/*`** — dávky oprav obsahu. Obsahově ověřeno, že
  práce každé z nich je v `main` (viz postup níž); lokální kopie smazané.
- **11 × `origin/wip/content-fix/*`** — pojistky rozdělané práce, devět z nich
  nese obsah lišící se od `main` (překonané mezistavy, ne ztracená práce).
- zbytek jsou starší funkční větve (`feat/*`, `fix/*`, `docs/*`).

Mazání na sdíleném originu je nevratné, takže **čeká na rozhodnutí uživatele**.
Nepoužívej je jako zdroj — aktuální je `main`.

⚠️ **Squash merge nezaznamená větev jako sloučenou.** `git log main..<větev>`
u ní ukáže commity, i když jejich obsah v `main` je (squash má jiný SHA
a žádného rodiče z větve), a `git branch --merged` ji taky nevypíše. Ověřuj
obsahově, jen soubory, na které větev sama sáhla:

```bash
mb=$(git merge-base main $b); files=$(git diff --name-only $mb $b)
git diff main $b -- $files      # prázdné = práce větve je v main
```

Prostý `git diff main $b -- src/content/` **nestačí** a je zavádějící: ukáže
hlavně to, co má `main` navíc z ostatních dávek, takže každá větev vypadá
jako nesloučená. Tohle už jednou stálo hodinu.

---

## 1. Kde jsme skončili

### ▶▶ ZAČNI TADY: zbytek zeměpisu 6. ročníku (6 témat)

**Dvě dávky zeměpisu jsou hotové** — 19.–20. 9., Mapa a glóbus (3), Vesmír
a Země (3), krajinné sféry (4) a polární oblasti (2); detail `PROJECT_STATUS.md`
§6 session 50 a 51. Zbývá poslední dávka: **Afrika (3) + Austrálie a Oceánie (3)**.
Pokud ji rozběhla předchozí session, zkontroluj `git status` a složku
`src/content/grade-6/zemepis/` — nezapojená témata tam leží bez registrace.

Připravené je všechno, co první dávka potřebovala: `zemepis/_shared.ts`
(souřadnice, měřítko, čas) i vzor a pravidla zeměpisu ve STANDARDS. Obrázky
k obsahu v repu nejsou, takže `image_select` ani `diagram_label` nejdou —
úlohy musí jít vyřešit ze slov. Po dávce nezapomeň doplnit **zajímavosti**
do `src/lib/topicInsight.ts`: pro krajinné sféry i regiony tam leží
připravené jako komentář (klíč bez tématu hlásí `topic-insight-coverage`
jako mrtvý, proto se přidává až s tématy).

Poučení z přírodopisu:
- **Po limitu relace může celá dávka spadnout na autorech.** Obnov ji přes
  `resumeFromRunId` — hotové kroky se převezmou z mezipaměti. Tématu, jehož
  kritik nebo opravář nedoběhl, už workflow neřekne „accepted“ (opraveno 19. 9.),
  ale `failures` v notifikaci čti stejně.
- **Dvě dávky souběžně = limit relace.** Pouštěj po jedné (nebo dvě malé).
- **`category`/`topic` kontroluj proti RVP po každé dávce** — autoři je
  posouvali o úroveň níž a testy to zafixovaly.

Poučení z matematiky:
- **Po dávce vždy spusť celou sadu**, ne jen `IDS=…` — `generator-determinism`
  a zámek obsahu chytají jen celkový běh.
- **Sdílený pomocník v dávce = jedna chyba × všechna témata.** Nejčastější nález
  kritiků byl v `_shared.ts`, ne v tématech. Pomocníka před dávkou vyzkoušej
  na několika zadáních.
- Opraváři občas nechají po sobě nekompilovatelný kód — typecheck po dávce
  není formalita.

Poučení ze zeměpisu:
- **`check:keys` rozšiř dřív, než dávku odbavíš.** Bez vzoru neověří ani jeden
  klíč a přepočítat 1 300 úloh očima nejde. Vzory pro měřítko, časová pásma
  a souřadnice jsou ve `scripts/check-keys-arith.ts`.
- **Kontrolu vždy otoč** — podvrhni klíče a ověř, že je skript nahlásí. Dvakrát
  se ukázalo, že chybu má kontrola, ne obsah (číslo „1 100 m“ čtené jako 100,
  let po rovnoběžce počítaný jako po poledníku).

Dvě věci pro každou dávku:

- **Workflow spouštěj přes `scriptPath`, ne podle jména.** Od `1c99986` má
  `.claude/workflows/author-batch.js` LF (hlídá `.gitattributes`) a pravidla
  z 13.–14. 9. Volání `Workflow({name: "author-batch"})` přesto padá na
  „control characters“, i když soubor žádné nemá (ověřeno po bajtech) — chyba
  je v obsluze oprávnění, ne v souboru. `scriptPath` na tentýž soubor funguje.
  Args = pole `{rvpId, label}`, ne věta.
- **Kritici workflow nevidí integraci.** Při zapojení se našly tři vady navíc:
  únik v nápovědě, jiná pomlčka v `topic` (rozbije sdílený klíč tématu)
  a chybějící okruh v `grade-6/displayNames.ts` + `topicInsight.ts`. Po dávce
  pusť `check:*` s `IDS=…`, celou sadu a doporučenou kartu v prohlížeči.

Přípravné práce jsou hotové, na obsahové dávce nic nevisí. Postup je popsaný
v [`docs/GRADE_6_COMPLETION_PLAN.md`](GRADE_6_COMPLETION_PLAN.md), vzor autorské
práce v posledních sedmi commitech fyziky (`30711bf` … `033e069`).

**Než napíšeš první téma, přečti si `docs/CONTENT_AUTHORING.md` §6.4** — kontrakt
odborných typů (`timeline`, `numeric_range`). Dějepis je bude chtít a formát
`correctAnswer` u nich není samozřejmý.

⚠️ **`image_select` ani `diagram_label` použít nejdou** — v repu nejsou žádné
obrázky k obsahu. Je to blokované na grafice, ne na kódu (viz session 45 níž).

### Druhá větev: příprava spuštění

Tady kód není úzké hrdlo. Blokuje **osm úkonů, které Claude udělat
nemůže** (§2) a k nim tři technické věci, které na ně navazují:

| co | stav | kde |
|---|---|---|
| Redirect URLs v Supabase | ⛔ na uživateli | §2 bod 3 |
| Spouštěč úklidu anonymních dat | ⛔ na uživateli | §2 bod 4 |
| Hluboké odkazy (App Links / Universal Links) | blokuje podpisový klíč | §4 |

### Session 43–44 (2026-09-13/14) — fyzika šestky dopsána do konce

**Fyzika 13/13, šestka 18 ze 117** (dějepis 5). Sedm nových témat:
`Látka a těleso`, `Skupenství látek`, `Atomy a molekuly`, `Pohyb částic`,
`Elektrický náboj`, `Elektrický obvod`, `Magnety`. Přibyl okruh
„Elektřina a magnety“ v navigaci šestky.

Co z té dávky platí dál:

- **`ruzneUlohy()` v `grade-6/fyzika/_shared.ts` je povinná.** Bez ní se losuje
  24× a doufá: u tématu s 24 možnými zadáními vyjde v průměru ~15 různých úloh
  a v nejhorším běhu 11 — pod hranicí 12. `generator-task-count.test.ts` na tom
  padal náhodně, typicky jednou ze čtyř.
- **Neshoda z lepení předložky k dosazenému jménu se v jedné dávce objevila
  čtyřikrát** (`z sklo`, `stejná lžičku`, `u jantar`). Šablona potřebuje pád
  navíc jako vlastní pole, ne interpolaci holého jména. **Strojová kontrola na
  to zatím není** — je to námět, ne hotová věc.
- **Binární Ano/Ne mimo L1 jsem v jedné dávce napsal pětkrát.** Ruční hlídání
  na tuhle třídu nestačí; proto vznikl `check:options` (níž).

### Session 45 (2026-09-14) — odborné typy prošly poprvé prohlížečem

Bod 1.6 plánu šestky. `timeline`, `diagram_label`, `image_select`
i `numeric_range` se vykreslí a hodnotí správně — ověřeno anonymním žákovským
režimem (`/student`, bez přihlášení) na běžícím dev serveru, u každého typu
špatná i správná odpověď. Komponenty i validátory existovaly od května, ale
**celý řetěz nikdo neprošel**; testy fixovaly jen formát, který komponenta
odesílá. Tři vady, všechny opravené a pokryté `src/test/odborne-typy-e2e.test.tsx`:

1. **`numeric_range` dostalo textareu na volný text** — router pro něj neměl
   větev a spadl na `default`.
2. **Po chybné odpovědi se ukazoval strojový zápis klíče:** `img-modry`
   (interní id obrázku), `A|B|C` u časové osy i diagramu, `30±1` u tolerance.
   `CorrectAnswerDisplay` znalo jen `drag_order`, `match_pairs` a `categorize`.
3. **Validátor se vybíral jen podle `topic.inputType`**, zatímco komponentu
   vybírá router podle POLÍ úlohy. Při neshodě se odpověď tiše porovnala přes
   `string_exact` — u `diagram_label` to znamená ztrátu tolerance překlepu.

⚠️ **Plán měl u toho bodu chybné zadání** — tvrdil, že `resolveTaskValidation`
má strukturovaná pole převádět na `expected`. To by bylo špatně:
`timelineEvents` je pool v náhodném pořadí a správné pořadí v něm není.
Odvozuje se proto validátor, ne očekávaná hodnota.

**Latentní past:** `input[type=number]` zahodí desetinnou čárku (`3,5` →
prázdné pole a zašedlé tlačítko). Dnes nedosažitelné (celý rejstřík má jediné
téma s číselným vstupem a žádnou desetinnou odpověď), ale fyzika by na to
narazila hned.

### Session 46–47 (2026-09-14) — dvě vodítka, která šla uhodnout bez znalosti

Obě kontroly jsou teď **na nule napříč celým rejstříkem** a obě si předtím
vyžádaly opravu sebe sama. To je ta důležitější část.

**`check:options` — klíč vyčnívá tvarem.** Všechny distraktory začínají týmž
slovem a klíč jiným, takže dítě vybere „ten jiný kus“. Ze 140 nálezů bylo
**38 falešných**: pevná škála, kde má celé téma pořád tutéž čtveřici možností
(„věta jednoduchá / souvětí ze dvou / ze tří / ze čtyř vět“) a klíč mezi nimi
jen rotuje — kdo vybírá tu jinak psanou pokaždé, splete se ve většině úloh.
Skript to teď pozná podle toho, že se tatáž nabídka objevila i s jiným klíčem.
Zbylých 102 opraveno: „Protože…“ 28, „Jen…“ 14, „Aby…“ 9, binární Ano/Ne 7
(tři z nich na L2, kde ten formát nemá co dělat — přepsány na otevřené otázky)
a ~44 jednotlivých.

**`check:length` — klíč je nejdelší možnost.** Skript měřil špatnou věc
**dvakrát po sobě**:

1. počítal poměr klíč / **nejkratší** distraktor a hlásil **1535 úloh** — jenže
   to nic neříká o tom, jestli se dá tipovat: žák vidí všechny čtyři možnosti;
2. po opravě počítal, jak často je klíč nejdelší — a bral i rozdíl jednoho
   znaku („Krajské město“ proti „Hlavní město“), který dítě nevidí.

Teď měří, jak často je klíč **výrazně** nejdelší (≥ 1,25×) a jestli v tom nad
distraktory převažuje aspoň 2,5×. **Naměřeno: plošný problém to nebyl** —
napříč rejstříkem byl výrazně nejdelší možností klíč v 5,6 % úloh a distraktor
ve 13,7 %, délka tedy vedla spíš OD správné odpovědi. Naruby ten poměr obracelo
**25 témat**, nejhorší 64 % proti 8 %. Všechna opravena dopsáním distraktorů
(~380 přepsaných možností); po opravě je poměr 3,7 % ku 12,1 %.

Dvě věci z té dávky, které se vyplatí znát:

- **Vada nemusí být zapsaná v datech.** U `g4-mat-osova-soumernost-4` vznikala
  trojice „písmeno F / G / J“ proti klíči „obdélník“ **losem** při každém
  spuštění. Opravoval se generátor, ne obsah.
- **Hromadná náhrada klíče zasáhla i druhou úlohu se shodným klíčem** a vyrobila
  novou vadu („Čím se liší pověst od pohádky?“ pak odpovídala „protože…“).
  Chytila ji až kontrola pouštěná **po** opravě. Pouštěj ji na obou koncích.

**Zámek obsahu:** `check:options` ho hnul (mění se klíče, 15 témat),
`check:length` ne (mění se jen nabídka).

### Session 41 (2026-09-13) — soukromí a mobilní odkazy

| commit | co |
|---|---|
| `39b4ecc` | odchody z dětské části za rodičovskou bránu + tři drobnosti před vydáním |
| `08707af` | zásady soukromí srovnány s tím, co kód opravdu dělá |
| `b2c9dee` | odkaz z e-mailu vedl v mobilu na `localhost` |

**Zásady soukromí** měly osm míst, kde text mlčel o skutečném zpracování
(odpovědi dítěte, PIN, poznámka rodiče, e-mail z anonymního režimu, hosting
mezi příjemci, lhůty). Opravou prošly i dvě věci, které text sliboval a kód
nedělal: jméno dítěte zmizelo z promptu pro týdenní shrnutí
(`weekly-report/index.ts`) a mazání účtu maže i pozvánku z anonymního režimu
(`delete-account/index.ts` — ta má `child_id = NULL`, takže dřív zůstávala
ležet i s e-mailem).

**Reset hesla a potvrzení registrace z mobilu** vedly do prázdna: obě stránky
stavěly `redirectTo` na `window.location.origin`, což je v obalu
`https://localhost` (původ WebView, ne adresa na internetu). Nově adresu skládá
`adresaProOdkazZEmailu()` v `src/lib/native.ts` — na webu původ aktuální
stránky, v obalu natvrdo `https://oli-edu.com`. Ověřeno reálným voláním
(`recover?redirect_to=http%3A%2F%2Flocalhost%3A8081%2Freset-password`), hlídá
`src/test/email-redirect.test.ts`.

⚠️ **Bez kroku v Supabase to nedojede** — viz §2 bod 3.

### Session 42 (2026-09-13) — lhoucí kontroly a porušený invariant CHECK

Tři věci, které měly společné jedno: **hlídač tvrdil něco jiného, než měřil.**

- **`check:hints` zamlčoval vlastní nálezy** — počítadlo se neinkrementovalo,
  takže souhrn hlásil „0 nápověd“ i pod vypsaným nálezem. Opraveno a ověřeno
  oběma směry.
- **`check:length` nešel spustit** — skript existoval, `npm` skript ne. První
  měření: 1 459 úloh z 18 821 při prahu 1,6× (ne „~45“). ⚠️ **To číslo se 14. 9.
  ukázalo jako bezcenné** — skript měřil poměr ke *nejkratší* možnosti, což
  o uhodnutelnosti nevypovídá. Viz session 46–47.
- **Invariant `CHECK < 60 ms` byl porušený a testová sada červená.**
  `execution-directive.test.ts` padal na 67–118 ms ve třech bězích po sobě.

**Co to způsobovalo:** `sessionOrchestrator.ts` načítal validátory uvnitř
realtime smyčky přes `await import("./validators")`. Rozklad času ukázal
první CHECK **151,2 ms**, medián dalších **3,7 ms**, vlastní validace
**0,43 ms** — tedy 40× rozdíl, který nedělal výpočet, ale studené načtení
modulu. Po převedení na statický import: první CHECK **3,9 ms**, test zelený
třikrát po sobě.

`validators/index.ts` nemá **žádné importy** a Rollup ho stejně balil do
hlavního chunku, takže dynamický import nic neušetřil — jen vnesl do smyčky
náklad, který tam neměl být. V produkci šlo o pomalejší první odpověď
v sezení, ne o síťové volání (chunk byl už stažený); test měřil totéž na
pomalejším zavaděči, a proto padal dřív, než si toho někdo všiml v aplikaci.

⚠️ **Tohle padalo delší dobu.** Poslední doložitelně zelená sada je
`9f3a07b` (17. 7., 4 687 testů). Předání po sloučení obsahu 12. 9. přitom
tvrdilo „4 745 testů prochází“ — buď se sada tehdy nedoběhla celá, nebo se
nález přehlédl. **Před vydáním pouštěj `npm test` celý a dívej se na součet,
ne na poslední řádek.**

### Session 42 (2026-09-13) — pokračování: nápovědy a slovní hodnocení

Po opravě kořene úniku (viz výš) prošlo revizí i slovní hodnocení, které dítě
vidí po sezení. Vygenerovat si skutečný výstup odhalilo tři chyby, které
v žádné kontrole nebyly:

- **Rodové lomítkové tvary** — „Zvládl/a jsi 5 z 6 správně, a úplně sám/sama",
  „můžeš na sebe být hrdý/á", „Nápovědu jsi využil/a 1krát". Projekt má přitom
  pravidlo, že formulace pro dítě jsou bez rodových koncovek; u druháka, který
  se teprve rozečítá, je lomítko navíc překážka.
- **„skoro všechno bylo správně" při plném počtu** — varianty se losují, takže
  dítě s 6 z 6 mohlo dostat větu, že to skoro dokázalo.
- **Rozbitá shoda u názvu tématu** — „Vyjmenovaná slova po B ti evidentně jde".
  Název je jednou v jednotném čísle, jindy v množném, takže jako holý podmět
  shodu neudrží. Řeší předřazené „Téma".

Hlídá `src/test/session-evaluator-text.test.ts` (pět měřítek, každé ověřené
i obráceně — po dočasném vrácení chyby spadne).

⚠️ **Lomítkové tvary jsou i jinde:** `grep` najde ~60 výskytů v 19 souborech,
mimo jiné v `i18n/cs.ts` („Procvičovat si sám/sama", „Zapomněl/a jsem heslo"),
`categoryInfo.ts`, `weeklyReportGenerator.ts` a na dětských obrazovkách.
Opraveno zatím jen slovní hodnocení — zbytek čeká na rozhodnutí.

### Session 40 (2026-09-11/12) — opravný průchod obsahu, uzavřeno

Inventura našla 87 témat k opravě, rozdělených do 22 dávek; každá měla autora
a **nezávislého kritika**. Všech 22 je sloučených do `main` a na produkci
(`origin/main` bylo na `1580cff`). Zámek obsahu přegenerován v `c619cb3`.

**Brány po sloučení:** 4 745 testů, `check:keys` 4 700 klíčů / 0 neshod,
`check:keys:tables` 471 / 0, `audit:agreement` 38 583 úloh bez nálezu,
`audit:content` čistý (**ověřeno osmi běhy po sobě** — audit vzorkuje losovaný
obsah, takže jeden běh nic nedokazuje), `audit:ui` bez nového nálezu, `build` ✓.

Co ten průchod naučil a co platí dál:

- **Nález strojové kontroly nejdřív ručně přepočítej.** Šest z prvních nálezů
  byla chyba kontroly, ne obsahu. Falešná „oprava" správného obsahu je horší
  než nález nechat ležet.
- **`check-hint-leak.ts` nevidí `match_pairs`, `categorize` ani `drag_order`** —
  porovnává nápovědu s `correctAnswer`, a ten je u těch typů jen řetězec
  „match" / „categorize" / „order". Skutečné řešení je v `pairs` / `categories`
  / `items`. Tudy proklouzla nápověda, která rozebrala dvě dvojice ze tří.
- **U geometrie a pojmových témat `check-keys*` nic neověří** — hlásí
  „nepokryto vzorem“. `PASS` z nich tedy není důkaz; kritik musel napsat
  vlastní přepočet klíče ze znění zadání.
- **Tiché mizení úloh:** duplicitní distraktor způsobí, že `ciselnaUloha` vrátí
  `null` a úloha zmizí, aniž to kdokoli pozná.

### Kontroly obsahu, které existují

| příkaz | co dělá | v CI |
|---|---|---|
| `npm run audit:content` | offline audit struktury + shoda přísudku ve všech textových polích úlohy | ano |
| `npm run audit:agreement` | shoda přísudku s číslovkou nad všemi tématy, `REPEATS=30` ≈ 78 000 úloh | ano |
| `npm run check:keys` | **přepočítá klíč z textu zadání**, nepřebírá ho z generátoru (matematika) | ano |
| `npm run check:keys:tables` | totéž pro tabulky, jízdní řády a diagramy | ano |
| `npm run check:hints` | nápověda prozrazující odpověď **obsahem**, ne slovem | ne — měkká |
| `npm run check:options` | klíč vyčnívá **tvarem** (distraktory začínají týmž slovem) | ne — report |
| `npm run check:length` | klíč je **výrazně** nejdelší možnost, a to systematicky | ne — report |
| `npm run audit:ui` | prvek slibuje něco, co nedělá | ano, s baseline |
| `generator-task-count.test.ts` | **téma × úroveň nabídne ≥ 12 různých úloh** — co nevznikne, žádný jiný audit nezkontroluje | ano |
| `hint-structured-leak.test.ts` | únik u `match_pairs` / `categorize` / `drag_order` / `timeline` | ano |

`check:hints`, `check:options` a `check:length` schválně neblokují: nález u nich
není důkaz chyby a CI by padalo na legitimním obsahu. **Všechny tři jsou
k 14. 9. na nule** — jakýkoli nález v nové dávce je tedy tvůj.

⚠️ **Obě kontroly na „vodítko zadarmo“ si vyžádaly opravu sebe sama, než začaly
měřit to, co měly.** `check:options` počítal pevnou škálu (38 falešných ze 140),
`check:length` měřil poměr k nejkratší možnosti a pak i rozdíl jednoho znaku.
Než podle nové kontroly začneš přepisovat obsah, **ručně přepočítej aspoň
hrst nálezů** — falešná oprava správného obsahu je horší než nález nechat
ležet.

⚠️ **`check:hints` do 13. 9. hlásil vždy „0 nápověd“**, i když nálezy nad tím
vypsal — počítadlo se neinkrementovalo. Kdo četl jen poslední řádek, odešel
s tím, že je čisto. Opraveno; ověřeno tématem, kde nález je (hlásí 1)
i tématem, kde není (hlásí 0). **Slepota na `match_pairs` / `categorize` /
`drag_order` trvá** — a kořen úniku níž sedí právě v nich.

Po každé změně obsahu:
`UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`.

---

## 2. Co má udělat Evžen — přesné kroky

Runbook: **https://claude.ai/code/artifact/fd60671e-87be-4aba-bf5e-ed12ac68d18d**
Definice hotového: **https://claude.ai/code/artifact/7551d87a-89ec-4f31-bbce-db3a2b68b299**

1. ⛔ **Proklikat tři scénáře vázané na účet** — registrace rodiče →
   spárování dítěte → smazání účtu, a v Auth → Users ověřit, že účet zmizel.
   **Claude to udělat nesmí** (zakládat účty a zadávat hesla je zakázané).
2. ⚠️ **AI klíče — méně naléhavé, než se tu psalo.** Do 13. 9. tu stálo, že
   „slovní hodnocení a týdenní zpráva bez toho nejsou". **Není to pravda:**
   obojí běží lokálně bez AI — hodnocení přes `generateLocalEvaluation`
   v `src/lib/sessionEvaluator.ts` (Groq byl odstraněn kvůli klíči
   v klientském bundlu, nález C1), týdenní zpráva přes
   `src/lib/weeklyReportGenerator.ts` („No AI needed"). Edge funkce
   `session-evaluation` i `weekly-report` jsou nasazené, ale **aplikace je
   nevolá** — v `src/` na ně není jediné `functions.invoke`.

   `404 model_not_found` navíc není vadný klíč: kód volá Groq model
   `llama-3.3-70b-versatile`, který Groq **vyřadil 16. 8. 2026** (doporučená
   náhrada `openai/gpt-oss-120b` nebo `qwen/qwen3.6-27b`). Model je zadrátovaný
   na třech místech — `analyze-misconceptions`, `weekly-report`, `tutor-chat`.
   `GEMINI_API_KEY` s hláškou „Please pass a valid API key" vypadá na skutečně
   neplatný klíč; kód k tomu volá `gemini-2.0-flash`, zatímco `CLAUDE.md`
   předepisuje `gemini-2.5-flash-lite`.

   **Na rozhodnutí:** z celé AI větve se reálně volá jen
   `analyze-misconceptions` (z `performanceTracker`) a `tutor-chat` (vypnutý
   přes `FEATURES.studentChat`). Buď se `session-evaluation` napojí, nebo se
   zruší — teď je v nejhorším stavu: nasazená, nevolaná, a `legal.ts` ji
   rodičům uvádí mezi místy zpracování dat, takže zásady slibují zpracování,
   které neprobíhá.
3. ✅ **HOTOVO 15. 9.** — Redirect URLs doplněné, ověřeno odkazem z e-mailu
   (odhalilo to vadu `ResetPassword`, opravenou v `e529437`; po nasazení
   uživatel ověřil celý průchod až po formulář nového hesla). Původní zadání:
   **Doplnit Redirect URLs v Supabase** — Authentication → URL Configuration
   → Redirect URLs musí obsahovat `https://oli-edu.com`
   i `https://oli-edu.com/reset-password`. Co tam není, Supabase zahodí
   a přesměruje na Site URL **bez jediné chybové hlášky**. Bez tohohle kroku
   je oprava z `b2c9dee` jen poloviční.
4. ✅ **HOTOVO 15. 9.** — `cron` úloha `anon-cleanup-44d` (denně 3:17 UTC, SQL
   delete stejné jako v edge funkci) je jediná v `cron.job`. Stará
   `anon-cleanup-daily` volala edge funkci přes `net.http_post`, končila na
   5s timeoutu a je zrušená — věta níž „nikdo nevolá“ tedy neplatila ani
   předtím. Zbývá jen upřesnit formulaci v zásadách (maže se 44 dní od
   začátku, ne „bez aktivity“). Původní zadání:
   **Naplánovat úklid anonymních dat.** Zásady soukromí slibují smazání
   serverové kopie po **44 dnech** bez aktivity, ale `action: "cleanup"`
   v `supabase/functions/anon-progress/index.ts` **nikdo nevolá** — žádný cron
   v `.github/workflows/`, žádný `cron.schedule` v migracích. `pg_cron` je
   v migracích povolený, takže jde o jedno naplánování. Ověř
   `select * from cron.job` v dashboardu.
5. ⛔ **Právní kontrola zásad soukromí.** Text je srovnaný s kódem — to je
   technická práce. Jestli formulace obstojí právně, Claude neposoudí,
   a u služby pro děti to není formalita. Sem patří i ověření, že se všemi
   pěti příjemci (`PRIJEMCI` v `src/content/legal.ts`) existuje zpracovatelská
   smlouva, protože to stránka tvrdí.
6. ⛔ **Podpisový klíč pro Android**, ověření domény pro App Links / Universal
   Links, formuláře o datech v obou obchodech (Data Safety / Privacy Nutrition
   Labels). Bez SHA-256 otisku klíče nejde `assetlinks.json` napsat.
7. ⏸ **Čeká na novou doménu (rozhodnutí uživatele 15. 9.).** Web přejde na
   čistě českou doménu `.cz` a ta se koupí **dřív**, než se začne cokoli dělat
   s Google Play a App Store. `appId` se pak odvodí z ní — **do té doby nic
   nevydávat ani nenahrávat do obchodů**. Dopad změny domény (Vercel + 301
   ze staré, Supabase URL Configuration, SMTP + SPF/DKIM, `native.ts`,
   `send-parent-invite`, texty v `ChildAuth` a `InviteParentDialog`) je
   rozepsaný v `PENDING_CHANGES.md`. Původní zadání:
   **Potvrdit `appId`** `com.oliedu.app` v `capacitor.config.ts` — po prvním
   vydání je **nevratný**.
8. **Apple Kids Category, nebo smíšené publikum.**

---

## 3. Co je nasazené

Všech šest edge funkcí vrací 200 (sonda 10. 9.), obě migrace proběhly ručně
v SQL editoru (nejsou v `supabase_migrations`, jsou idempotentní).
**Neověřené:** že po skutečném smazání účtu nezbude řádek v žádné ze 13 tabulek
(patří k §2 bodu 1).

> **Ověřuj sondou, ne čtením** — tenhle soubor nevyjímaje.

---

## 4. Otevřené pro další session

### ✅ Kořen úniku v nápovědě — opraveno 13. 9.

`doplnVelkou` v `grade-5/_shared.ts` si na dorovnání délky velké nápovědy
bral `proc` **dalších** prvků úlohy. Změřeno před opravou: **696 z 1 000 úloh
(69,6 %) v 17 tématech** mělo za závěrečnou větou přilepenou souvislost další
dvojice nebo události. Nejhorší byla `chronologie` na L3, kde se pořadí
odvozuje právě ze souvislostí — tam byl každý doplněk kus řešení.

Opraveno na čtyřech místech (`chronologie`, `parovani`, `trideni`,
`_poradi.ts`): do doplňků jdou **jen obecné strategie**, nikdy `proc` prvků
úlohy. Rejstřík strategií rozšířen na tři věty na kategorii, aby délka vyšla
i bez nich. Hlídá `src/test/hint-structured-leak.test.ts` — měřítko je
konstrukční (co smí stát za pevnou závěrečnou větou), ne heuristické.
Ověřeno obousměrně: po dočasném vrácení kořene test spadl na 786 úlohách.

**Dvě věci se nepotvrdily proti tomu, co tu stálo dřív:**

- **Zámek obsahu přegenerovat netřeba.** Předání tvrdilo, že oprava změní
  zadání; nezměnila — dotkla se jen nápověd, a `frozen-content-unchanged`
  hlídá otázky a klíče. Prošel beze změny.
- **Nebyl to „plošně kompletní únik u tříprvkové úlohy".** U krátkých malých
  nápověd se doplněk vůbec nepřidával (`h1` už délkou stačila), takže L1
  párování bylo často v pořádku. Vada byla podmíněná délkou `h0`.

Ve stejném průchodu opraveno i to, co s `doplnVelkou` nesouviselo a našlo se
cestou:

- **`_poradi.ts` — dvě pole `pravidlo` prozrazovala řešení.** Pravidlo jde celé
  do velké nápovědy, jenže úloha z řady vybírá jen část položek. „Měsíc je
  menší než Země, Jupiter je největší planeta a Slunce je větší než všechny
  planety dohromady" bylo u úlohy „Seřaď vesmírná tělesa od nejmenšího po
  největší" přímo pořadí; pravidlo o časových úsecích zase mluvilo o dni
  a roku i tehdy, když v úloze nebyly. Obojí přepsáno na princip bez jmen
  položek, s poznámkou nad daty, jaký tvar má pravidlo mít.
- **Tři ručně psané nápovědy ve 4. ročníku dávaly celé řešení:** potravní
  řetězce (jmenovaly všechny čtyři lovce), rozmnožování rostlin (tři dvojice
  ze čtyř) a tvar listu (malá nápověda dala lípu, velká zbylé tři stromy).
  Všechny tři přepsány na kotvu + rozlišovací znak, aniž jmenují pravou stranu
  — vzor byl v sousední úloze téhož souboru, která to má správně („Jelena
  uloví jen velká šelma. Rybu chytí pták, který se brodí vodou…").

Hlídá druhé měřítko v témže testu: **velká nápověda smí jmenovat nejvýš jednu
pravou stranu dvojice** (a nepočítají se ty, které stojí už v zadání nebo
v malé nápovědě). Tohle měřítko ty tři nálezy původně našlo.

### 🟠 Mobilní vydání — co zbývá

- **Hluboké odkazy nejsou zapojené vůbec:** `public/.well-known/` neexistuje,
  `AndroidManifest.xml` má jen `MAIN`/`LAUNCHER` (žádný `VIEW`/`BROWSABLE`,
  žádné `autoVerify`), iOS nemá `.entitlements`. Aplikační strana
  (`src/lib/native.ts`, `nastavHlubokeOdkazy`) je hotová. Blokuje podpisový
  klíč (§2 bod 6). Do té doby se odkaz z e-mailu otevře v prohlížeči — heslo
  si uživatel změní tam a do aplikace se přihlásí novým. Funkční, ne hezké.
- **`cap sync` nikdy neproběhl** (chybí `android/app/src/main/assets/`).
  `.gitignore` na jeho výstup je doplněný (`39b4ecc`), takže první sync
  nezanese repo.
- **Podklad pro Data Safety / Privacy Nutrition Labels neexistuje.** Nejblíž je
  `PRIJEMCI` v `legal.ts` a `Privacy.tsx`, ale ani jedno není namapované na
  kategorie formulářů.

### 🟠 Dětská kategorie — zbytky k rozhodnutí

Odchody z dětské části jsou za rodičovskou bránou (`39b4ecc`). Zbývá:

- ✅ **Google Fonts pryč (13. 9.).** Nunito leží v `src/assets/fonts/`
  (variabilní řez z `@fontsource-variable/nunito@5.3.0`, OFL-1.1, licence vedle),
  `@font-face` v `src/index.css`. Byl to jediný odchozí požadavek na dětských
  obrazovkách bez funkční nutnosti. **Dopad na zásady:** příjemce „Google Fonts"
  ze `legal.ts` zmizel, příjemců je teď pět, ne šest. Vedlejší zisk: v mobilním
  obalu bez sítě se dřív písmo nenačetlo vůbec.
  Hlídá `src/test/self-hosted-fonts.test.ts` (čtyři měřítka, každé ověřené
  obráceně) — včetně toho, že se název rodiny v CSS shoduje s Tailwindem;
  na tom už jednou ztroskotalo „Baloo 2", které se stahovalo a nikdy
  nevykreslilo.
- ✅ **`FEATURES.studentChat` i komponenta `TutorChat` smazány (13. 9.).**
  Být `false` nestačilo: `loadOverrides()` čte `localStorage`, takže flag není
  ochrana, jen skrytí — a zásady soukromí rodičům tvrdí „v aplikaci není chat“.
  Slib daný v zásadách nesmí stát na hodnotě, kterou si kdokoli přepne
  z konzole. **Edge funkce `tutor-chat` zůstává nasazená** (odebrat ji jde jen
  z konzole Supabase); její testy proto zůstávají.
- ✅ **`/report` odstraněn z dětské větve routeru (13. 9.).** Rodičovský přehled
  o dítěti patří jen rodiči a adminovi.

  Obojí hlídá `src/test/child-surface.test.ts` — tři měřítka, každé ověřené
  obráceně (po dočasném vrácení vady spadne to a jen to, které ji měří).
- **Dětský e-mail se odvozuje z párovacího kódu** (`child_<kód>@app.internal`).

### 🟠 Zbytky obsahu

Věci, na které kritici narazili a nechali je k rozhodnutí:

- **`crSymboly` L3 je z poloviny počítání letopočtů** — 6 ze 13 úloh je
  odčítání čtyřciferných čísel (1993 − 1415 = 578). Věcně správné, ale číselný
  obor 3. ročníku je do 1000 a nápověda učí písemné odčítání (učivo 4. ročníku).
- ✅ **Klíč jako nejdelší možnost — vyřízeno 14. 9.** Skript měřil špatnou věc
  (poměr k nejkratší možnosti; čísla 1 459 a 1 535 pocházejí odtud). Po
  přeměření na „jak často je klíč **výrazně** nejdelší“ vyšlo, že plošný problém
  to nebyl — 25 témat ano, a všechna jsou opravená. Detail v session 46–47 výš.
- **Dvě kontroly na leak si odporují:** `src/test/topic-gate.test.ts` hledá klíč
  v nápovědě prostým `includes` bez výjimky pro „rejstřík možností", kterou
  `supabase/functions/_shared/hintLeakage.ts` má; a `normalize()` v `hintLeakage`
  odstraňuje `„`, ale ne `“`. Autoři to obcházeli v obsahu — patří opravit
  v kontrolách.
- **`parovani`** (`grade-5/_shared.ts`) končí velkou nápovědu utrženou větou
  o jiné dvojici („…doplň vylučováním. V Římě stojí Koloseum…"). Týká se všech
  témat, která helper používají — souvisí s kořenem výš.
- ✅ **Kontrola „generátor vrátil míň úloh, než má v poolech" existuje** —
  `generator-task-count.test.ts`, minimum 12 na téma × úroveň.
- **`czechAgreementLint` hlásí planý poplach u jmenné části přísudku** —
  „0,3 m **je** 3 desetiny metru" chce opravit na „jsou". Patří do sekce
  „nesmí hlásit" v `czech-agreement-lint.test.ts`.

### 📋 6. ročník — plán doplnění

Šestka je **pilot, ne hotový ročník**: **37 témat ze 117** (fyzika 13/13 hotová,
dějepis 24/24 hotový; čeština, matematika, přírodopis, zeměpis a občanka nezačaty).
Přitom je od 11. 9. otevřená žákům, takže šesťák vidí dva předměty z osmi.
Pětka naproti tomu **hotová je** — 63 z 73 podtémat, zbylých 10 je informatika
vynechaná podle stálého pokynu.

Plán: [`docs/GRADE_6_COMPLETION_PLAN.md`](GRADE_6_COMPLETION_PLAN.md). Dvě věci
z něj stojí za pozornost hned:

- **Pořadí se mění oproti červnovému plánu.** Ten řadil faktické předměty první
  jako „nízké riziko"; to se neprokázalo — kořen úniku v nápovědě seděl právě
  v pomocnících pro faktická témata. Nově: dodělat fyziku a dějepis (ověřené
  vzory), pak matematika, a teprve pak faktický blok.
- ✅ **Všech pět přípravných věcí je hotových** (13. 9.) — `check-hint-leak` vidí
  strukturované typy, `generator-task-count.test.ts` hlídá mizející úlohy,
  navigace i dětské názvy šestky jsou doplněné. Tvrzení, že `vko` chybí
  v `subjectRegistry`, **bylo mylné** — je tam. Zbývají jen **ilustrace čtyř
  předmětů** (fyzika, přírodopis, zeměpis, vko), a ty psaní obsahu nedrží.
- ✅ **Bod 1.6 (smoke test odborných typů) hotový** (14. 9.) — session 45 výš.
- **Stav k 15. 9.: fyzika 13/13 i dějepis 24/24 hotové.** Zbývající předměty
  šestky (čeština, matematika, přírodopis, zeměpis, občanka) nezačaty.

### 🟠 Sliby vs. obsah

Titulek a Open Graph slibují „1. stupeň ZŠ" (1.–5. ročník). Otevřené jsou
**2.–6.**, chybí 1. ročník; 6. ročník má zatím jen fyziku a dějepis.
Otevření 7. ročníku by oslabilo rodičovskou bránu — hlídá `parent-gate.test.ts`.

### 🟠 Drobnější

- **`src/integrations/supabase/types.ts` je zastaralý** (přegenerovaný
  25. 8.). Přegeneruj, ne edituj — příkaz je v `CLAUDE.md`. Očekávej nové
  nullability chyby.
- **Dopsat ověření serverové kopie anonymního pokroku** — `serverRecordTask`
  v `anonProgress.ts` existuje, ale že se zápis provede, ověřené není.
- **Dvě češtinové karty mají tentýž obrázek** („Příbuzná vyjmenovaná"
  a „Pravidla rozhovoru", 3. ročník). Projít mapování napříč předměty.
- **Rozcestník:** levandulová `bg-[#E3EDFD]` je předmětový tint, neměla by být
  pozadím celé karty (v `TopicBrowser` zabírá 72 %).
- **Kontrast primární barvy:** bílá na `#F97316` má 2,79 : 1 (WCAG AA 4,5 : 1).
- **Pohár ve shrnutí** se zobrazí i při 1/6 — odstupňovat?
- **Váha buildu 23,6 MB** (18,5 MB obrázků; **na landing obrázky nesahat bez
  pokynu**).
- **Admin veze ~3 000 řádků vypnuté AI větve.**

---

## 5. Pasti prostředí, které stály čas

### Přibylo 2026-09-14

**Hromadná náhrada řetězce v obsahu zasáhne i úlohu, o které nevíš.** Klíč
„pověst se váže ke skutečnému místu" byl v jednom souboru použitý ve dvou
úlohách; záměna kvůli jedné z nich rozbila tu druhou. Nahrazuj **celý řádek
s kontextem** (`choice("…otázka…", "…klíč…"`), ne holý řetězec — a pusť
kontrolu i **po** opravě, ne jen před ní.

**Prohlížečový panel: `ref` klikne na špatné místo, pokud je stránka
škálovaná.** Čtyři různá tlačítka hlásila tutéž souřadnici a klik nic neudělal.
Spolehlivé je klikat přes DOM (`javascript_tool` + `element.click()`), stejně
jako u vstupů. **A `preview_start` může vrátit jiný port, než na kterém Vite
opravdu běží** — ověř v `preview_logs`, jinak navigace tiše selže.

**Obrázky s `loading="lazy"` se ve skrytém panelu nenačtou** (`complete: false`,
`naturalWidth: 0`). Není to chyba stránky; pro ověření přepni `img.loading` na
`eager` a počkej.

**Anonymní žákovský režim je cesta, jak proklikat obsah bez přihlášení.**
`/student` + `localStorage.setItem("oli_anon_trial", JSON.stringify({startedAt:
new Date().toISOString(), grade: 6}))`. Rozdělané sezení blokuje navigaci
dialogem — smaž `sovicka_session_backup`. Dočasné téma musí být i v
`navigation.ts`, jinak se v okruzích neukáže, a `subject` musí přesně sedět
(`"dejepis"`, ne `"dějepis"`), jinak se založí druhá dlaždice předmětu.

### Přibylo 2026-09-13

**`git worktree remove --force` sleduje junction `node_modules`** a smaže obsah
cíle — tedy `node_modules` **hlavního repa**. Stalo se to při úklidu 22 worktree;
zdrojové soubory ani `package-lock.json` nedotčené, opravil `npm ci`. Než budeš
odstraňovat worktree s junction, počítej s tím.

**Časový test měří i zavaděč, ne jen kód.** `CHECK < 60 ms` padal na 151 ms
při prvním volání a 3,7 ms při dalších — rozdíl dělal `await import()` uvnitř
měřeného úseku. Když časový test padá, **změř první a ustálený běh zvlášť**,
než sáhneš na limit: rozdíl mezi nimi ukáže, jestli je vadný kód, nebo test.

**Nepouštěj `npm run build` souběžně s časovým testem** — zátěž CPU posunula
naměřený CHECK z 68 na 118 ms a vypadalo to jako horší regrese, než jaká byla.

**Browser panel kliká podle jiného souřadnicového rámce, než jaký má stránka**
(screenshot 800×450 vs. viewport 1280×720) — `computer left_click` pak minie
nebo hlásí „mimo viewport". Ověřuj a klikej přes DOM
(`javascript_tool`, `find`, `get_page_text`).

### Ze starších session

- **Vercel: „already connected" neznamená připojeno** (`link.sourceless: true`,
  nejdřív `git disconnect`).
- U React inputů nastav hodnotu přes `HTMLInputElement.prototype` setter
  a pošli `input` event — jinak React o změně neví.
- **Vite si bere vlastní port** — ověř v `preview_logs`, ne podle konfigurace.
- **Konzole v prohlížeči drží zastaralé chyby** — ověřuj po reloadu.
- **Soubory v repu mají smíšené konce řádků (CRLF i LF).** Náhrady skriptem
  nejdřív normalizuj na `\n`, pak vrať původní.
- **Bash tool je Git Bash** — `sed`, `grep`, `head` fungují; pro soubory ale
  preferuj Read/Grep/Glob.
- **PowerShell rozbaluje jednoprvková vnořená pole** — po dávkové náhradě vždy
  `git diff --stat`.
- **Commit message piš Write toolem a commituj přes `git commit -F`**, ne
  `Out-File` (BOM v předmětu).
- **Nikdy `git stash` / `git stash pop` ve worktree.**
- **Dětské a rodičovské plochy vyžadují přihlášení** — heslo Claude zadávat nesmí.

---

## 6. Pravidla, která se opakovaně uplatnila

- **Rodičovská a žákovská část se mění spolu.**
- **Emoji nepatří vedle akvarelů** — viz `docs/ILLUSTRATION_STYLE.md`.
- **Formulace pro dítě bez rodových koncovek** — aplikace pohlaví nezná.
- **Nápověda navádí, neprozrazuje; každá úloha má vlastní obě nápovědy.**
- **Když komentář tvrdí něco, co po změně neplatí, patří opravit v témže commitu.**
- **Když měníš, co se ukládá nebo kam to jde, přepiš i `Privacy.tsx`** — zásady,
  které mlčí o skutečném zpracování, jsou horší než žádné.
- **Hlídač, který se neověří, je jen dekorace** — nové kontrole ukaž chybu,
  kterou má chytat, a přesvědč se, že na ní spadne.
- **Nová kontrola nad obsahem měří nejdřív sebe, až pak obsah.** Obě kontroly
  na „vodítko zadarmo" (`check:options`, `check:length`) hlásily řádově víc
  nálezů, než kolik jich bylo — pokaždé proto, že měřily něco jiného než to, co
  může dítě reálně využít. Než podle nové kontroly přepíšeš obsah, přepočítej
  hrst nálezů ručně.
- **Vodítko existuje jen tehdy, když funguje opakovaně.** Jedna úloha, kde klíč
  vypadá jinak, nic neprozrazuje; teprve když to platí v celém tématu, dá se
  tipovat. Kontroly proto měří téma, ne úlohu.
