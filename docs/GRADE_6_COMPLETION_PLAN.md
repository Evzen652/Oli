# Plán doplnění 6. ročníku

> Stav k 2026-09-13. Navazuje na [`STUPEN2_CONTENT_PLAN.md`](STUPEN2_CONTENT_PLAN.md)
> (červen 2026, psaný **před** pilotem) a na [`grade-6/README.md`](../src/content/grade-6/README.md),
> který je kanonický pro pravidla psaní. Tenhle dokument řeší jen jedno: **jak
> dostat šestku z pilotu do hotova.** Čísla jsou změřená v repu, ne převzatá.

---

## 0. Kde jsme

RVP má pro 6. ročník **126 podtémat**. Informatika se podle stálého pokynu
uživatele nezobrazuje, takže do rozsahu nepatří — zbývá **117**.

| předmět | RVP | hotovo | zbývá | charakter |
|---|---:|---:|---:|---|
| fyzika | 13 | 6 | **7** | výpočetní — **vzor ověřen** |
| dějepis | 24 | 12 | **12** | faktický — **vzor ověřen** (15. 9.: +7 pravěk a nejstarší státy) |
| přírodopis | 22 | 0 | **22** | faktický |
| zeměpis | 18 | 0 | **18** | faktický + mapa |
| čeština | 20 | 0 | **20** | smíšený |
| matematika | 12 | 0 | **12** | výpočetní |
| výchova k občanství | 8 | 0 | **8** | konceptuální |
| **celkem (bez informatiky)** | **117** | **11** | **106** | |
| informatika | 9 | 0 | — | mimo rozsah |

**Šestka je přitom otevřená žákům** (`ACTIVE_GRADES = [2, 3, 4, 5, 6]`, od 11. 9.).
Šesťák si tedy ročník vybere a uvidí dva předměty z osmi. To není důvod ročník
zavřít — je to důvod vědět, že plán běží proti živému stavu, ne na zelené louce.

---

## 1. Co musí být hotové dřív, než se napíše první nové téma

Tohle nejsou přípravy „ať je to pěkné". Každá položka je věc, která se při 106
tématech nedá dodělat zpětně, aniž by se přepisoval hotový obsah.

### 1.1 Rozšířit kontrolu úniku na strukturované typy — **nejvyšší priorita**

`scripts/check-hint-leak.ts` porovnává nápovědu s `correctAnswer`. U `match_pairs`,
`categorize` a `drag_order` je `correctAnswer` jen řetězec „match" / „categorize" /
„order" — skutečné řešení leží v `pairs` / `categories` / `items`. **Kontrola je
na ně konstrukčně slepá.**

Přesně tudy prošel únik v 5. ročníku: `doplnVelkou` lepila do velké nápovědy
souvislosti dalších prvků úlohy a postihlo to **696 z 1 000 úloh v 17 tématech**.
Našlo se to až 13. 9., měsíce po zamrazení.

Dějepis, zeměpis a přírodopis šestky na těchhle typech pojedou (chronologie,
přiřazování, třídění) — tedy přesně tam, kde kontrola nevidí. Psát 59 faktických
témat dřív, než se to spraví, znamená vědomě zopakovat tu samou chybu v pětinásobku.

`src/test/hint-structured-leak.test.ts` už měří dvě věci konstrukčně (co smí stát
za pevnou závěrečnou větou; velká nápověda smí jmenovat nejvýš jednu pravou stranu).
Je napsaný proti `grade-5/_shared.ts` — **patří zobecnit, ne kopírovat.**

### 1.2 Doplnit chybějící kontrolu „generátor vrátil míň úloh, než má v poolech"

Duplicitní distraktor způsobí, že `ciselnaUloha` vrátí `null` a úloha tiše zmizí.
**Co nevznikne, žádný audit nezkontroluje** — `audit:content` i `audit:agreement`
kontrolují jen to, co generátor vydal. Požadavek „≥ 12 unikátních úloh na
téma × úroveň" je tím pádem dnes nevymahatelný.

U výpočetních generátorů šestky (fyzika, matematika) je riziko vyšší než na
1. stupni, protože distraktory vznikají z chybového modelu a snadno se potkají.

### 1.3 Navigace pro 6. ročník

`src/content/navigation.ts` má `BY_GRADE` jen pro ročníky 2–5. Šestka je plochá.
U 11 témat to nevadí; u 117 je plochý seznam nepoužitelný. Okruhy se navíc
odvozují od RVP `area`, takže je rozumné je založit **předem** — jinak se
zařazování dodělává zpětně u stovky souborů a `navigation-consistency.test.ts`
(žádní sirotci, žádné téma ve dvou okruzích) padá v dávkách.

### 1.4 Dětská vrstva názvů pro 6. ročník

`src/lib/displayNames.ts` má `BY_GRADE` také jen pro 2–5. Šesťák proto vidí
oficiální názvy okruhů („Měření fyzikálních veličin"). Není to rozbité — témata
mají `studentTitle` — ale dětská vrstva chybí, a čím víc témat přibude, tím dráž
se doplňuje.

### 1.5 Ilustrace čtyř předmětů — **neblokuje psaní obsahu**

- **Ilustrace chybí u čtyř předmětů:** fyzika, přírodopis, zeměpis, vko.
  Existují jen `matematika, čeština, prvouka, přírodověda, vlastivěda, dějepis,
  chemie`. Fyzika běží dnes bez kresby (fallback emoji). Je to práce v admin
  pipeline → Supabase storage, tedy jiný druh úkolu; **psaní obsahu nedrží**,
  drží hezké vydání.

> ⚠️ **Oprava vlastního nálezu (13. 9.):** tenhle bod původně tvrdil, že
> `vko` v `subjectRegistry.ts` vůbec není. **Není to pravda** — je tam jako klíč
> `"výchova k občanství"` s aliasem `vko`. Moje sonda ho nenašla, protože její
> regex nepočítal s klíčem v uvozovkách a s mezerami. Ověřeno pořádně přes
> `resolveSubjectKey()` nad všemi předměty z obsahu i z RVP: **dohledají se
> všechny.** Hlídá to teď i test (`display-names-coverage.test.ts`).
> Je to přesně ten případ, před kterým varuje pravidlo „nález strojové kontroly
> nejdřív ručně přepočítej" — tentokrát jsem tou kontrolou byl já.

### 1.6 Vizuální smoke test odborných typů — ✅ HOTOVO (14. 9.)

`docs/STUPEN2_CONTENT_PLAN.md` §4 Fáze 0 to má jako otevřené: komponenty
i validátory existují a `stupen2-odborne-typy.smoke.test.ts` fixuje formáty, ale
**end-to-end přes UI se to neprošlo.** Zdokumentovaný nález: `resolveTaskValidation`
nepřevádí strukturovaná pole (`timelineEvents`, `diagram`, …) na `expected`, takže
autor musí ručně sladit `correctAnswer`, `inputType` a strukturované pole.

Dějepis šestky bez `timeline` neudělá chronologii pořádně. Ověřit v prohlížeči
jeden testovací topic každého typu, který se v šestce použije — `timeline`,
`diagram_label`, `image_select`, `numeric_range` — **než** se na nich postaví 19 témat.

**Výsledek (14. 9.).** Čtyři dočasná témata se protáhla anonymním žákovským
režimem (`/student`, bez přihlášení) na běžícím dev serveru — vždy jednou
špatná a jednou správná odpověď. **Všechny čtyři typy se vykreslí a hodnotí
správně.** Tři vady, všechny opravené a pokryté testem
(`src/test/odborne-typy-e2e.test.tsx`):

1. **`numeric_range` dostalo textareu na volný text**, ne číselné pole —
   `PracticeInputRouter` pro něj neměl větev a spadl na `default`.
2. **Po chybné odpovědi se dítěti ukazoval strojový zápis klíče:**
   `Správná odpověď: img-modry` (interní id obrázku), `…A|B|C` u timeline
   i diagram_label, `…30±1` u tolerance. `CorrectAnswerDisplay` znalo jen
   `drag_order`, `match_pairs` a `categorize`.
3. **Validátor se vybíral jen podle `topic.inputType`**, zatímco komponentu
   vybírá router podle POLÍ úlohy. Při neshodě se odpověď tiše porovnala přes
   `string_exact` — u `diagram_label` to znamená ztrátu tolerance překlepu.
   `resolveTaskValidation` teď odvozuje validátor z tvaru úlohy.

Původní formulace bodu tvrdila, že `resolveTaskValidation` má strukturovaná
pole převádět na `expected`. **To by bylo špatně** — `timelineEvents` je jen
pool v náhodném pořadí, správné pořadí v něm není. Odvozuje se proto validátor,
ne očekávaná hodnota. Kontrakt pro autory je v `CONTENT_AUTHORING.md` §6.4.

**Co zůstává otevřené:** `image_select` a `diagram_label` nemají v repu žádné
obrázky k obsahu — jsou blokované na grafice, ne na kódu. Dějepis z nich
reálně použije `timeline` a `numeric_range`. A `input[type=number]` zahodí
desetinnou čárku (`3,5` → prázdné pole); dnes to nikoho netrápí, protože celý
rejstřík má jediné téma s číselným vstupem a žádnou desetinnou odpověď.

---

## 2. Pořadí — a v čem se liší od plánu z června

Červnový plán řadil škálování takto: **faktické předměty první** (pipeline,
„nízké riziko"), pak čeština, pak matematika a fyzika.

**Tohle pořadí navrhuji změnit**, a to kvůli tomu, co se od června zjistilo:
„nízké riziko" u faktických předmětů se neprokázalo. Opravný průchod v září
našel **87 vadných témat z 254** a kořen úniku v nápovědě seděl právě v pomocnících
pro faktická témata. Faktické předměty jsou levné na psaní, ne na ověřování.

| # | dávka | témat | proč v tomhle pořadí |
|---|---|---:|---|
| 1 | **dodělat fyziku** | 7 | Vzor je ověřený, okruh „Měření veličin" je 6/6 hotový. Nejlevnější uzavření celého předmětu — a první předmět 2. stupně na 100 %. |
| 2 | **dodělat dějepis** | 19 | Druhý ověřený vzor. Zároveň první skutečná zkouška rozšířené kontroly úniku (bod 1.1) na chronologii. |
| 3 | **matematika** | 12 | Výpočetní vzor z fyziky se přenese. Zlomky, dělitelnost, úhly a osová souměrnost jsou zároveň základ, na kterém stojí procenta 7. ročníku. |
| 4 | **přírodopis** | 22 | Největší faktický blok. Jde až po tom, co kontrola úniku umí strukturované typy. |
| 5 | **zeměpis** | 18 | Faktický + mapa → nový formát (`image_select` / `diagram_label`). Riziko navíc, proto po přírodopisu. |
| 6 | **čeština** | 20 | Smíšený. Mluvnice se dá opřít o vzory z 5. ročníku, literatura je nová. |
| 7 | **výchova k občanství** | 8 | Konceptuální, žádný vzor. Nejmenší blok — vhodný jako poslední, kdy je nejvíc zkušeností. |

Dávka **není celý předmět**. Pracovní jednotka je **jeden RVP okruh (`area`),
typicky 3–6 témat.** Důvod je praktický: velké obsahové dávky v téhle session
opakovaně vyčerpaly kontext (viz uložená poznámka „limit relace u velkých
workflow" a „kontext při dávkovém authoringu"). Menší dávka se také dá celá
zkritizovat, což velká ne.

---

## 3. Jak vypadá jedna dávka

1. **Autor** napíše okruh (3–6 témat) podle `grade-6/README.md`: generátor jako
   čistá funkce, disjunktní `POOL_L1/L2/L3`, ≥ 12 unikátních úloh na téma × úroveň,
   dvě vlastní nápovědy ke každé úloze, `explanation` / `solutionSteps`,
   `optionFeedback` u výběrových typů, distraktor = konkrétní typická chyba.
2. **Nezávislý kritik** — jiná session, která **nevidí úvahy autora**. Úlohu řeší
   znovu ze zadání a teprve pak porovná s klíčem. Tohle je jediná věc, která
   v zářijovém průchodu prokazatelně fungovala; bez ní platí ta 34% chybovost dál.
3. **Brány** (všechny musí projít):
   - `npx tsc --noEmit`
   - `npm run audit:content` — 0 hint_leak / giveaway / self_validation
   - `npm run audit:pedagogical` — difficulty_progression, distractor_quality,
     sentence_complexity
   - `npm run audit:agreement`, `npm run check:hints`, `npm run check:length`
   - `npm run audit:coverage` pro šestku — **0 témat bez L2 a bez L3**
   - `navigation-consistency.test.ts`
   - `npm test` celý, a **dívat se na součet, ne na poslední řádek**
4. **Zamrazení** — `UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`
5. **Zápis** do `grade-6/STATUS.md`, `PROJECT_STATUS.md` §6, `PENDING_CHANGES.md`.

### Čemu nevěřit

- **`PASS` z `check:keys*` není důkaz** u geometrie a pojmových témat — hlásí
  „nepokryto vzorem". Kritik musí napsat vlastní přepočet ze znění zadání.
- **Nález strojové kontroly nejdřív ručně přepočítej.** Šest z prvních nálezů
  zářijového průchodu byla chyba kontroly, ne obsahu. Falešná „oprava" správného
  obsahu je horší než nález nechat ležet.
- **Nová kontrola se musí ověřit obráceně** — ukaž jí chybu, kterou má chytat,
  a přesvědč se, že na ní spadne. `check:hints` do 13. 9. hlásil vždy „0 nápověd",
  i když nálezy nad tím vypsal.

---

## 4. Co by plán mohl shodit

- **Šestka je otevřená během plnění.** Každá dávka jde rovnou před žáky. Buď se
  přijme, že ročník roste po okruzích před očima, nebo se do doby dokončení
  zavře — to je produktové rozhodnutí, ne technické.
- **Titulek a Open Graph slibují „1. stupeň ZŠ".** Otevřené jsou ročníky 2–6.
  Čím kompletnější šestka, tím větší rozpor.
- **Rodičovská brána.** Šestky se netýká, ale jakmile plán pokročí k 7. ročníku,
  Oli začne učit procenta — tedy přesně to, čím se brána překonává.
  Hlídá `parent-gate.test.ts`.
- **Ilustrace pro čtyři předměty** jsou samostatná práce mimo authoring
  (admin pipeline → Supabase storage) a nejdou dělat „při tom".

---

## 5. Odhad

**Neodhaduju termín z hlavy.** Pilot dal 11 témat, ale nese i náklady, které se
podruhé neplatí (zakládání struktury, odvození vzorů).

Doporučený postup: **udělat dávky 1 a 2 (fyzika 7 + první okruh dějepisu) a změřit
skutečnou průchodnost** — kolik témat projde autorem i kritikem za jednu session
a kolik nálezů kritik vrátí. Teprve z těch dvou čísel se dá zbylých ~85 témat
naplánovat s termínem, který něco znamená.

Co se dá říct teď: **106 témat při dávce 3–6 znamená zhruba 20–30 dávek**, každá
s autorem i kritikem. Předchozí kroky z části 1 jsou proti tomu malé — jsou to dny,
ne týdny — ale **musí být první**, protože každý z nich se jinak dodělává zpětně
přes stovku souborů.
