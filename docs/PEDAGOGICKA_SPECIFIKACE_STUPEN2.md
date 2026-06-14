# Pedagogická specifikace cvičení (6.–9. ročník)

> **Zdroj:** návrh produktového managera (Claude Chat), adaptováno na architekturu
> OLI 2026-06-15. Platí pro **generování i audit** úloh. **Každá** úloha musí projít
> kontrolním seznamem (sekce 5). Co neprojde → přegeneruje se, nebo `auditFlag: ["needs_review"]`
> s důvodem.
>
> Doplňuje [`STUPEN2_CONTENT_PLAN.md`](STUPEN2_CONTENT_PLAN.md) sekci 6 (triangulační ověření).

## ⚠️ Klíčové omezení platformy: žák VYBÍRÁ, nepíše

Žák **nikdy nepíše volnou odpověď** — jen vybírá / manipuluje s danými prvky.
Povolené typy 2. stupně:
`select_one`, `true_false`, `multi_select`, `match_pairs`, `categorize`,
`drag_order`, `comparison`, `image_select`, `diagram_label`.
**Zakázáno:** `text`, `short_answer`, `number` (volné psaní), `essay`, `fraction`
(jako psaní). I sloh/čeština se procvičuje výběrově (vybrat nejlepší formulaci,
seřadit osnovu = `drag_order`, doplnit slovo = `select_one`).

**Důsledek:** celá pedagogická hodnota leží v **kvalitě možností**. Proto je
jádrem této specifikace **chybový model distraktorů** (sekce 3), ne normalizace
psaných odpovědí (ta je bezpředmětná — odpadá z původní specifikace).

## Princip
„Pedagogicky správně" a „srozumitelně" nejsou pokyny — jsou to cíle rozložené níže
na **ověřitelná kritéria**. Drž se kritérií, ne adjektiv.

---

## 1. ZADÁNÍ

- **Jeden cíl.** Úloha testuje právě jednu dovednost daného RVP podtématu
  (`g{grade}-{subject}-{area}-{topic}-{subtopic}`). Žádné „a zároveň" s nesouvisejícím krokem.
- **Jednoznačnost.** Existuje právě jeden výklad otázky. Žák po přečtení ví, *co* vybrat.
- **Jednotky a forma v zadání, ne v hlavě žáka.** Když může být možnost dvojznačná
  (cm vs cm², zaokrouhlení), zadání to ukotví: „Vypočítej **obsah** obdélníku
  4 × 7 cm (v cm²)." — aby správná volba byla jednoznačná.
- **Soběstačnost.** Vše potřebné je v zadání. Nic se neopírá o znalost, kterou žák
  ročníku nemá nebo kterou aplikace dosud neučila.
- **Jazyk přiměřený ročníku.** Odborný termín jen tehdy, když se právě procvičuje
  — ne náhodná překážka navíc.
- **Správná kognitivní úroveň.** L1 ≤ L2 ≤ L3 (zapamatování → použití → analýza).

**Test:** Pochopil by průměrný žák ročníku, co vybrat, *bez učitele*?

| ✅ | ❌ |
|---|---|
| „Vypočítej obsah obdélníku se stranami 4 cm a 7 cm (v cm²). Vyber výsledek." | „Spočítej obdélník." (obvod? obsah? v čem?) |

---

## 2. NÁPOVĚDA

- **Neprozrazuje výsledek.** Postrkuje k *postupu / pravidlu*, ne k odpovědi.
- **Odstupňovaná** (L1|2|3): první = kam se podívat / čím začít; hlubší = klíčový krok.
- **Akční.** Říká, co *udělat*, ne přeformuluje zadání.
- **Pojmenovává koncept tak, jak se ho žák učil** („použij vzorec pro obsah",
  ne „aplikuj plošnou metriku").
- **Sama o sobě správná.** Chybná nápověda je horší než žádná.
- **Kontextová.** Ne identická pro všechny úlohy tématu (častá vada — viz audit 2026-06-15).

| ✅ | ❌ |
|---|---|
| „Obsah obdélníku spočítáš vynásobením dvou sousedních stran." | „Výsledek je 28." / „Zamysli se." |

---

## 3. MOŽNOSTI A ZPĚTNÁ VAZBA (jádro kvality při výběru)

- **Klíč je prokazatelně správný.** Ověřeno vlastním řešením (sekce 4).
- **Chybový model distraktorů.** KAŽDÝ distraktor = výsledek konkrétní typické chyby
  (provedl jen 1. krok / opačná operace / sečetl vše / zaměnil veličinu — obvod místo
  obsahu / špatný převod jednotky). **Žádné náhodné posuny** (`r±5`, `r±10`), které
  jdou vyloučit odhadem.
- **Distraktor zároveň diagnostikuje.** Protože víme, *kterou* možnost žák klikl,
  víme, *jakou chybu* udělal → vstup pro feedback, adaptaci a report rodiči.
- **Cílený feedback u chyby.** Říká *proč* je to špatně, mířeno na miskoncept
  zvolené možnosti: „Vybral jsi obvod (22). Obsah = 4 × 7 = 28 cm²." Plní se přes
  `PracticeTask.optionFeedback` (mapa možnost→vysvětlení chyby; zařazeno do Fáze 0).
  Generátor s chybovým modelem ho plní rovnou. Dokud engine nepodporuje, použij
  silné `explanation`, které pojmenuje nejčastější chybu (fallback).
- **U správné volby krátce potvrď *proč*** je správná (`explanation`), ať žák ví,
  že to nebyla náhoda.
- **Tón** povzbudivý, přiměřený věku, nikdy zlehčující.

| ✅ | ❌ |
|---|---|
| Možnosti = {28 správně, 22 = obvod, 11 = půlobvod, 56 = 2× obsah}, feedback míří na chybu | Možnosti = {28, 33, 23, 38} (náhodné posuny), feedback „Špatně." |

---

## 4. GENERUJ → OVĚŘ (Critic / self-check)

Pro **každou** úlohu po vygenerování (triangulace, viz plán sekce 6):
1. **Vyřeš naslepo** ze samotného zadání, jako žák — bez pohledu na klíč.
2. Porovnej s uloženým klíčem. Liší se → úloha vadná: přegeneruj nebo oprav klíč.
3. **Projdi každý distraktor:** je jasně špatný a odpovídá konkrétní chybě?
   Náhodný/vyloučitelný odhadem → přepracuj dle chybového modelu.
4. Ověř jednoznačnost: má zadání právě jedno řešení a právě jednu správnou možnost?

U výpočetních (fyzika/chemie/matematika) navíc **deterministický solver** (druhá
nezávislá cesta k výsledku) + plausibility guardy (kladné/celé kde má být, jednotky,
realistická čísla).

---

## 5. KONTROLNÍ SEZNAM (gate — musí projít VŠE)

Zadání:
- [ ] Jeden jasný cíl odpovídající RVP podtématu
- [ ] Právě jeden výklad zadání + právě jedna správná možnost
- [ ] Jednotky / forma ukotveny v zadání (kde hrozí dvojznačnost)
- [ ] Soběstačné, jazyk přiměřený ročníku
- [ ] Náročnost odpovídá cílové úrovni (L1 ≤ L2 ≤ L3)

Nápověda:
- [ ] Neprozrazuje výsledek
- [ ] Akční, věcně správná, kontextová (ne identická pro celé téma)
- [ ] Odstupňovaná podle úrovně

Možnosti a vyhodnocení:
- [ ] Klíč ověřen vlastním řešením naslepo (sekce 4)
- [ ] Každý distraktor = konkrétní typická chyba (chybový model), žádný náhodný posun
- [ ] `explanation` vysvětluje *proč* (postup s mezivýsledky u výpočtů)
- [ ] Tón přiměřený věku

**Při selhání:** úlohu nezveřejňuj — přegeneruj, nebo `auditFlag: ["needs_review"]`
s důvodem, které kritérium selhalo.
