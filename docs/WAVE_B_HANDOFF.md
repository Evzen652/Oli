# Wave B — DOKONČENO (2026-09-01)

Cíl vlny: odstranit nález `format/length` — **„správná možnost je ≥ 2× delší než všechny
distraktory"**. Nejdelší možnost je pak správná a dítě uhodne odpověď bez znalosti učiva.

## Stav

| metrika | hodnota |
|---|---|
| `format/length` nálezů | **0** ✅ |
| dotčených témat | **0** ✅ |
| hotovo dávek | **26** — vlna uzavřena |
| branch | `chore/remove-essay-and-ai-authoring` |

> Celkový počet nálezů v korpusu kolísá mezi běhy (pooly se míchají, audit vzorkuje).
> **Stabilní metrika je počet `format/length` a počet témat** — ta se mezi běhy nemění.

## ✅ Vlna uzavřena

Nález `format/length` je **0** ve třech po sobě jdoucích korpusových měřeních.
Všech 39 dotčených témat prošlo GATE 3× s `invarianty: 0`.

Postup napříč session 2026-09-01: 109 → 86 → 67 → 51 → 39 → 28 → 11 → **0**.

Sekce níže je ponechána jako popis metody — pro případnou další vlnu.

---

## Další v pořadí (nejvíc nálezů)

| nálezů | téma |
|---|---|
| 6 | `g5-cjl-…slova-spisovna-a-nespisovna` |
| 6 | `g5-prirodoveda-…vyvoj-cloveka-a-rozmnozovani-etapy-lidskeho-zivota-dospivani` |
| 6 | `g5-prirodoveda-…navyky-a-prevence-navykove-latky-alkohol-nikotin-drogy` |
| 5 | `g3-cjl-veta-jednoducha-souveti` |
| 5 | `g5-matematika-…konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky` |
| 5 | `g5-prirodoveda-…energie-a-jeji-zdroje-obnovitelne-a-neobnovitelne-zdroje-energie` |
| 5 | `g5-prirodoveda-…ekosystemy-a-zivotni-prostredi-potravni-retezec-vztahy-v-ekosystemu` |
| 4 | `g2-cjl-…literarni-zanry-pohadka-rikanky-basen-hadanka` |
| 4 | `g3-prvouka-…minulost-a-soucasnost-minulost-naseho-regionu-povesti` |
| 4 | `g3-cjl-velka-pismena` |

Dávka = **4 témata**. Aktuální pořadí si vždy ověř znovu (krok 1).

## Postup na jednu dávku

1. **Změř a vyber témata.** Zkopíruj `scripts/wave-b/measure.test.ts.txt` do
   `src/test/_wave-b-measure.test.ts`, spusť, smaž.
2. **Najdi soubor tématu.** VŽDY přes přesné `id`, ne přes fragment:
   `grep -rl 'id: "<cele-id>"' src/content/`
   Grep na fragment ID opakovaně vracel `navigation.ts` nebo cizí soubor.
3. **Vypiš vadné úlohy.** `scripts/wave-b/dump.test.ts.txt` → `src/test/_wave-b-dump.test.ts`,
   `TF=<cast-id> npx vitest run …`. Generátor se pouští 6× — **jeden běh ukáže jen podmnožinu**.
4. **Autoruj vyvážené možnosti** (viz „Jak opravovat" níže).
5. **Patchni** některým skriptem z `scripts/wave-b/` — nejdřív `dry`, pak `apply`.
6. `npm run typecheck`
7. **Znovu vypiš** (krok 3) — po opravě se objeví dosud skryté položky. Opakuj do `CELKEM 0`.
8. **GATE 3× po sobě:** `node scripts/audit-topic.mjs <cele-id>` — pooly se míchají, jeden
   běh nestačí. Musí být `BLOK · invarianty: 0`.
9. **Korpusové přeměření** (krok 1) + testy:
   `npx vitest run src/test/frozen-content-unchanged.test.ts src/test/topic-gate.test.ts src/test/content-audit.test.ts`
10. **Freeze**, pokud se měnil ročník 2–4:
    `UPDATE_FROZEN_SNAPSHOT=1 npx vitest run src/test/frozen-content-unchanged.test.ts`
11. **Smaž pomocné testy z `src/test/`**, aktualizuj `PROJECT_STATUS.md` §6 a
    `docs/PENDING_CHANGES.md`, commitni, pushni.

## Jak opravovat

Nález má dvě opačná řešení podle typu úlohy:

- **Třída A — klíč nese navíc meta-text.** „Souvětí *(dvě věty spojené spojkou)*" vs „Věta
  jednoduchá". Řešení: **zkrátit klíč**, závorku přesunout do `explanation`.
- **Třída B — definiční otázka.** Klíč je plná definice, distraktory krátké. Řešení:
  **prodloužit distraktory** na plnohodnotné definice. Vedlejší zisk je větší než samotné
  odstranění tellu: mizí výplňové možnosti („záleží na žánru", „záleží na textu"), které
  nebyly blízkou chybou, ale prázdným místem.
- **Zrcadlový distraktor.** U srovnávacích otázek („povídka vs. bajka") stačí klíč a
  distraktor **prohodit** — délky se vyrovnají samy a vznikne distraktor testující přesně
  tu záměnu, o kterou v úloze jde.

Klíč pod 16 znaků detektor neřeší vůbec (práh je `> 15`).

## Pasti (všechny už jednou zaskočily)

1. **Zkrácení klíče zapne `hint_leak`.** Sdílená nápověda bývá **rejstřík**
   („Encyklopedie = …; Slovník = …"), který byl neškodný jen proto, že klíč měl navíc
   závorku. **Po každém zkrácení klíče zkontroluj sdílenou nápovědu tématu** a přepiš ji
   na **metodu** (jak na to), ne na výčet možností. Stalo se **8×**.
2. **`hint_leak` matchuje i jednotlivá slova z odpovědí.** „od celku k podrobnostem" spadlo
   na odpověď „od celku k detailu", „krok za krokem" na „Chybí krok číslo 3". Metodická
   nápověda se musí vyhnout i běžným slovům, která v odpovědích náhodou figurují.
3. **Zkrácení může zapnout i jiný detektor** — „odpověď se doslova vyskytuje ve znění
   otázky". U vzoru *jarní* je 7. pád ž. r. tvarově shodný s 1. pádem, takže klíč nejde
   zkrátit ani prodloužit; jediná cesta je **přeformulovat zadání**, aby slovo neobsahovalo.
4. **`hint_progression` nelze vždy opravit prohozením.** Kratší druhá nápověda bývá
   *konkrétnější* (zužuje výběr) — prohození by ji posunulo dopředu a prozradilo víc.
   Správně se **prodlužuje**. `hp.mjs` použij jen tam, kde delší nápověda není i návodnější.
5. **Kotva patchru se trefí do distraktoru jiné úlohy.** Proto všechny patchery vyžadují
   kotvu **hned za `correctAnswer: "` / ` a: "`** a odmítnou nejednoznačnou kotvu.
   Když má víc úloh tentýž klíč, použij `pq.mjs` (kotví na text otázky).
6. **Slovo „správně" a šipka `→` v klíči** spouštějí detektor meta-textu — i když šipku
   mají všechny čtyři možnosti. Nahraď čárkami.
7. **Soubory jsou CRLF.** Víceřádkové náhrady v Pythonu spojuj přes zjištěný oddělovač,
   ne přes `\n`.
8. **Před psaním doc-poznámek ověř, co je předexistující.** `git stash` + GATE na HEAD.
   Dvakrát se ukázalo, že téma bylo rozbité už předtím (a jednou naopak, že jsem to
   způsobil sám).
9. **Hranatá závorka v textu MOŽNOSTI láme patchery.** `pv2`/`pv3`/`pv4` hledají konec
   `options` pole naivně přes první `]` v řádku — pokud samotná možnost obsahuje `]`
   (typicky souřadnice, např. „P' = [3; −2]"), patcher pole ukousne uprostřed. Projeví se
   okamžitě jako syntax error v `npm run typecheck` (ne jako tichá chyba) — oprav ručně
   přes `Edit`. Zatím jediný výskyt (geometrie se souřadnicemi bodů).

## Co detektory nehlídají a stejně to najdeš

Při ověřování klíčů se opakovaně objevují chyby, na které žádné pravidlo neexistuje.
Za 12 dávek: cizojazyčné vsuvky (slovensky, anglicky, německy, latinsky, **azbukou**,
chorvatsky), uťatá slova („si zapamato", „se netelefon"), porušená shoda („Jednoletá
trávy", „červené drobné jablíčka"), věcné chyby („ř je tvrdá souhláska", „v létě dopadají
paprsky šikměji", „nůž je životný"), **úlohy bez odpovědi** (klíč sám přiznává, že rozdíl
neexistuje), **nápovědy patřící k jiné úloze**, vykání dítěti v tykajícím tématu a
**přiměřenost ročníku** (L3 čtvrťáků na anemochorii, mikrobiomu, GMO, imprintingu).
**Čti klíče, ne jen délky.**

10. **`pq.mjs` neumí formát `{ correct, distractors }`.** Grade-2 literární žánry
   mají místo `correctAnswer`/`options` dvojici `correct`/`distractors` (a jen 2
   distraktory). `pq.mjs` na nich skončí na „NEAPLIKOVANO, oprav kotvy". Řeš
   regexem kotvícím na text otázky s `assert` na jednu shodu.

## Nástroje v `scripts/wave-b/`

| skript | kotva | formát obsahu |
|---|---|---|
| `pv2.mjs` | `correctAnswer: "` | vše na jednom řádku |
| `pv3.mjs` | ` a: "` | kompaktní `{ q, a, opts }` |
| `pv4.mjs` | `correctAnswer: "` | víceřádkový (+ varianta s `options` inline) |
| `pq.mjs` | **text otázky** | univerzální, pozná formát sám |
| `tx.mjs` | — | prosté textové náhrady ze seznamu |
| `hp.mjs` | — | prohození dvojice nápověd (pozor na past č. 4) |

Volání: `node scripts/wave-b/<skript>.mjs <soubor> dry|apply <zadani.json>`
Formát `zadani.json`: `[[kotva, novy-klic, [distraktor1, distraktor2, distraktor3]], …]`
Skripty hlídají počet úloh a při nejednoznačné kotvě **odmítnou zapsat**.
