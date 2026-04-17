# Obsahová roadmapa Oli — ZŠ 1.–9. (homeschool-ready)

> **Cíl:** Aplikace musí být schopna nabídnout kompletní vzdělávací obsah pro žáky 1.–9. ročníku ZŠ,
> aby rodiny preferující domácí výuku mohly Oli využít jako hlavní nástroj.

## Scope

### In-scope (akademické předměty)
| Předmět | Ročníky | Typ |
|---|---|---|
| Matematika | 1.–9. | algoritmický převážně |
| Český jazyk (pravopis, gramatika, sloh) | 1.–9. | smíšený |
| Prvouka | 1.–5. | faktický + pravidla |
| Přírodopis | 6.–9. | faktický (biologie) |
| Dějepis | 6.–9. | čistě faktický |
| Zeměpis | 6.–9. | faktický + práce s mapou |
| Fyzika | 6.–9. | smíšený (výpočty + fakta) |
| Chemie | 8.–9. | smíšený |
| Občanská/rodinná výchova | 6.–9. | konceptuální |

### Explicitně mimo scope
- Výtvarná, hudební, tělesná výchova, pracovní činnosti
- Cizí jazyky (angličtina) — samostatný projekt později

---

## Tři pilíře infrastruktury

### Pilíř 1 — Taxonomie obsahu (`content_type`)
Každá dovednost (`curriculum_skill`) má přiřazen typ:

| Typ | Popis | Kdo validuje správnost | Příklady |
|---|---|---|---|
| `algorithmic` | Pure funkce generuje úlohy, matematická správnost konstrukcí | Unit testy | Sčítání, procenta, rovnice, i/y pravopis |
| `factual` | Úlohy ze schválené Knowledge Base (fakta) | Lidský kurátor | Dějiny (data), zeměpis (města), biologie (druhy) |
| `conceptual` | AI generuje otázky, 3-vrstvá validace + fact-check | AI + humanní review | Občanka, interpretace textu, sloh |
| `mixed` | Kombinace — generátor + KB | Hybrid | Fyzika (výpočet F=ma nad fakty o Newtonovi) |

### Pilíř 2 — Knowledge Base (`curriculum_facts`)
Databázová tabulka s validovanými fakty pro faktické předměty.

**Proč:** AI nikdy nesmí generovat FAKTA z paměti. Halucinace dějepisných dat nebo hlavních
měst je pro vzdělávací aplikaci fatální. AI dostane relevantní fakta jako kontext a
pouze z nich generuje otázky.

**Schema (zjednodušeně):**
```sql
curriculum_facts (
  id, skill_id,
  fact_type,     -- 'date' | 'entity' | 'concept' | 'relation'
  content,       -- strukturovaná data (JSON)
  source,        -- zdroj (učebnice, RVP, wiki)
  validated_by,  -- user_id kurátora
  validated_at,  -- timestamp
  is_active
)
```

**Příklad fact pro dějepis:**
```json
{
  "fact_type": "date",
  "content": {
    "event": "Bitva na Bílé hoře",
    "year": 1620,
    "date": "1620-11-08",
    "location": "Bílá hora, Praha",
    "actors": ["Habsburci", "České stavy"],
    "outcome": "Porážka českých stavů"
  },
  "source": "RVP dějepis 8. ročník"
}
```

### Pilíř 3 — Prerequisite graph (vertikální kontinuita)
Každá dovednost explicitně zná své prerekvizity:

```ts
curriculum_skills.prerequisites: jsonb  // ["math-add-sub-100", "math-multiply"]
```

**Proč:** Když žák v 6. ročníku zaostává se zlomky, adaptivní engine potřebuje vědět,
že prerekvizit je "úvod do zlomků v 5. ročníku" — na ten se vrátit. Bez explicitních
prerekvizit nemá kam.

---

## Vertikální skill tree — matematika (kompletní)

Každý `✅` znamená implementované v kódu (deterministický generátor nebo seed).
`🟡` = částečné (chybí generátor). `❌` = zcela chybí.

### 1.–2. ročník
```
┌─ math-cisla-do-20       ❌  prvních 20 čísel, počítání, numerace
├─ math-add-sub-20        ❌  sčítání/odčítání do 20 (bez přechodu, s přechodem)
├─ math-cisla-do-100      ❌  orientace do 100
├─ math-tvary-zaklad      ❌  kruh, čtverec, trojúhelník, obdélník
└─ math-meri-base         ❌  základní měření (cm, kg, hodina)
```

### 3. ročník ✅ (existuje)
```
┌─ math-add-sub-100       ✅  sčítání/odčítání do 100
├─ math-multiply          ✅  malá násobilka
├─ math-divide            ✅  dělení
├─ math-compare-natural   ✅  porovnávání
├─ math-rounding          ✅  zaokrouhlování na 10
├─ math-order-numbers     ✅  uspořádání čísel
├─ math-shapes            ✅  geometrické útvary
├─ math-perimeter         ✅  obvod
└─ math-measurement       ✅  jednotky
```

### 4. ročník ❌ (BRIDGE — kritické!)
```
┌─ math-add-sub-1000      ❌  sčítání/odčítání do 1000
├─ math-multiply-written  ❌  písemné násobení vícemístných
├─ math-divide-remainder  ❌  dělení se zbytkem
├─ math-round-100         ❌  zaokrouhlování na 100, 1000
├─ math-units-convert     ❌  převody jednotek (mm↔cm↔m)
├─ math-roman-numerals    ❌  římské číslice
└─ math-frac-intro        ❌  úvod do zlomků (část celku) — PREREQUISITE 6. roč.
```

### 5. ročník ❌ (BRIDGE)
```
┌─ math-numbers-million   ❌  čísla do milionu
├─ math-decimal-intro     ❌  desetinná čísla — úvod, porovnání, zaokrouhlování
├─ math-decimal-add-sub   ❌  sčítání/odčítání desetinných
├─ math-frac-same-den-5   ❌  zlomky se stejným jmenovatelem — PREREQUISITE 6.
├─ math-area              ❌  obsah čtverce, obdélníku
└─ math-average-5         ❌  aritmetický průměr (úvod)
```

### 6. ročník 🟡 (zlomky existují, zbytek chybí)
```
┌─ frac-* (9 skillů)       ✅  zlomky (porovnávání, rozšiřování, krácení, +, −, ×, ofNumber)
├─ math-delitelnost-6     🟡  seed SQL existuje, generátor ne
├─ math-desetinna-scitani-6 🟡
├─ math-uhly-6            🟡
├─ math-prvocisla         ❌  prvočísla, rozklad
└─ math-trojuhelnik-6     ❌  trojúhelník (strany, úhly)
```

### 7. ročník ✅ (nově přidáno)
```
┌─ math-procenta-7        ✅  procenta — deterministický generátor
├─ math-cela-cisla-7      ✅  celá čísla — deterministický generátor
├─ math-pomer-7           🟡  seed SQL, generátor ne
├─ math-soumernost-7      🟡
├─ math-objem-kvadr-7     🟡
└─ math-uhly-v-trojuh     ❌  ostrý/tupý/pravoúhlý
```

### 8. ročník 🟡
```
┌─ math-rovnice-8         ✅  lineární rovnice — deterministický generátor
├─ math-mocniny-8         🟡
├─ math-pythagoras-8      🟡
├─ math-vyrazy-8          ❌  výrazy, rozklad
└─ math-kruh-8            ❌  obvod, obsah kruhu
```

### 9. ročník 🟡
```
┌─ math-soustava-rovnic-9 🟡
├─ math-funkce-linearni-9 🟡
├─ math-podobnost-9       🟡
├─ math-urok-9            🟡  finanční matematika
└─ math-telesa-9          ❌  jehlan, kužel, koule
```

---

## Vertikální skill tree — čeština

### 1.–2. ročník ❌
- čtení, psaní, hláskování
- velká písmena (začátek věty, vlastní jména)
- základní interpunkce

### 3. ročník 🟡 (částečně)
- diktáty, pravopis základní ✅
- mluvnice základní ✅
- vyjmenovaná slova ✅

### 4.–5. ročník ❌
- vyjmenovaná slova — pokračování (druhá vlna)
- slovní druhy, skloňování
- mluvnické kategorie (rod, číslo, pád)

### 6.–9. ročník ❌
- větná stavba (hlavní, vedlejší věty)
- stylistika, sloh
- literatura (období, autoři, díla) ← *faktický obsah, potřeba KB*

---

## Vertikální skill tree — prvouka → přírodopis

### Prvouka 1.–5. ❌ (kromě seedů)
- rodina, společnost, bydlení
- tělo, zdraví, hygiena
- příroda (rostliny, zvířata)
- roční období, orientace v čase/prostoru

### Přírodopis 6.–9. ❌
- obecná biologie (buňka, ekosystém)
- zoologie (třídy, druhy) ← *faktický, KB nutná*
- botanika (rostliny, čeledi) ← *faktický*
- člověk, anatomie
- geologie

---

## Vertikální skill tree — dějepis (100 % faktický!)

### 6. ročník — Pravěk, starověk
- Lidská evoluce, doba kamenná
- Mezopotámie, Egypt, Řecko, Řím
- ~50 faktů (data, osoby, místa, události)

### 7. ročník — Středověk
- Stěhování národů, Franská říše
- Byzanc, arabský svět
- České dějiny raný středověk (Přemyslovci)
- ~80 faktů

### 8. ročník — Novověk I.
- Objevy, renesance, reformace
- 30letá válka, Habsburkové
- Osvícenství, průmyslová revoluce
- ~100 faktů

### 9. ročník — Novověk II., moderní dějiny
- 19. století (národní obrození)
- 1. a 2. světová válka
- Komunismus v ČSSR, 1989
- ~100 faktů

---

## Tři fáze implementace

### Fáze I — Infrastruktura (TADY, dnes)
**Cíl:** Platforma je READY hostovat všechen obsah.
- [x] RVP seed pro 6.–9. matematiku (už hotovo)
- [x] 3 deterministické generátory (procenta, celá čísla, rovnice)
- [ ] DB schema: `curriculum_facts`, `content_type`, `prerequisites`, `quality_tier`
- [ ] Taxonomy module — enum `ContentType`, subject taxonomy
- [ ] Extended PREREQUISITE_MAP pro vertikální vazby
- [ ] Fact-checker validator (4. layer) v ai-tutor
- [ ] Coverage dashboard v adminu
- [ ] Quality badges v ExerciseTab

### Fáze II — Obsah (dlouhodobě)
**Cíl:** Skutečný obsah postupně přibývá.
- Algoritmické generátory (priority: matematika bridge 4.-5., čeština i/y, fyzika výpočty)
- Knowledge Base seedování (dějepis 6., zeměpis 6., přírodopis 6.)
- AI-generované + human-validované custom_exercises
- Kurátorský workflow pro přidávání faktů

### Fáze III — Homeschool features (později)
**Cíl:** Rodiny mohou používat Oli jako hlavní výukový nástroj.
- Daily lesson plans (rozvrh dne podle progressu)
- Týdenní/měsíční curricular reporty
- Parent-curator UI (rodič kurátor svého dítěte)
- Oficiální RVP mapping + export pro vysvědčení/evidenci
- Offline mode pro dlouhé cesty

---

## KPI kvality obsahu

Cílový stav pro "production-ready" pro daný ročník:
- **100 % skillů z RVP** pokryto (alespoň jako seed v DB)
- **≥ 80 % algoritmických skillů** má deterministický generátor + unit testy
- **≥ 90 % faktických skillů** má alespoň 20 validovaných faktů v KB
- **0 % halucinací** u faktů (každý fact explicitně přiřazený ke zdroji)
- **3 vrstvy validace** pro každé AI-generované cvičení
- **Lidský review** před `quality_tier = validated`

---

## Governance

- **Fakta v KB musí mít zdroj.** Bez `source` pole se fact nesmí uložit.
- **AI nesmí generovat data/čísla/fakta z paměti.** Vždy skrze RAG z KB.
- **Každý skill má `content_type`** — určuje, jak se validuje a kdo je odpovědný.
- **Žák vidí jen `quality_tier = validated` nebo `ai_validated`.** Raw AI nikdy.
- **Audit log** všech úprav v KB (kdo, kdy, co změnil).

---

## Příští kroky

1. **Dnes (infra):** implementovat DB schema + taxonomii + fact-checker
2. **Týden 1–2:** matematika bridge 4.-5. ročník (generátory)
3. **Týden 3–4:** seed faktů pro dějepis 6. ročník (prvních 50)
4. **Týden 5–6:** integrace RAG do ai-tutor
5. **Průběžně:** postupné seedování dalších předmětů podle priorit
