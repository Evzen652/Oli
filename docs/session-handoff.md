# Session Handoff — 2026-06-03

> Tento soubor byl automaticky vytvořen při přechodu mezi PC.
> Po přečtení ho můžeš smazat nebo nechat jako historii.

---

## Co jsme dělali (dnešní session)

### 1. Fix admin preview — prázdné kategorie
**Soubor:** `src/components/SessionView.tsx`
**Problém:** Admin preview defaultně volil grade 3, ale obsah existuje jen pro grade 4 a 5 → prázdný TopicBrowser.
**Oprava:** Změněn default z grade 3 na grade 4.
**Commit:** `1e24c86`

### 2. Ilustrace — systémové řešení
**Problém:** Ilustrace u témat neodpovídaly látce (barevné abstraktní bloby místo konkrétních scén).
**Kořenová příčina:** Generický fallback `"colorful 3D objects representing X"` → AI model ignoruje obsah.

**Co bylo implementováno (commit `fb004a0`):**
- `src/lib/types.ts` — nové pole `illustrationDesc?: string` na `TopicMetadata`
  - Autor obsahu napíše 1 větu: CO JE na obrázku (ne co se dítě naučí)
  - Příklad: `"dítě píše příběh tužkou do sešitu, kolem knih a kelímku s pastelkami"`
- `src/components/admin/AdminGenerateIllustrations.tsx` — nové helper funkce:
  - `buildConcreteTopicDesc(meta)` — subject/category-aware vizuální scéna z keywords
  - `buildCategoryDesc(catTopics)` — stejné pro okruhy
  - Nahrazují generický fallback pro všechny grade-N témata
- `src/content/grade-4/cjl/vlastniLiterarniTvorbaNaDaneTema.ts` — přidán `illustrationDesc` (prototyp)
- `src/content/grade-4/TEMPLATE.ts` — zdokumentováno nové pole

**Jak používat dál:**
1. V adminu → Ilustrace → filtruj předmět/ročník → **Přegenerovat** → nový fallback použije konkrétní scénu
2. Při psaní nového obsahu (grade-N session): přidej `illustrationDesc: "..."` k tématu

---

## Audit: OLI grade-4 vs. RVP ZV + reálné ŠVP

### OLI vs. RVP — 72/72 podtémat, 100% pokrytí ✅

| Předmět | RVP grade-4 | OLI grade-4 |
|---|---|---|
| Český jazyk a lit. | 22 | 22 ✅ |
| Matematika | 14 | 14 ✅ |
| Přírodověda | 13 | 13 ✅ |
| Vlastivěda | 13 | 13 ✅ |
| Informatika | 10 | 10 ✅ |
| **Celkem** | **72** | **72** ✅ |

### OLI vs. reálné ŠVP — výsledky deep research

Analyzovány: **ZŠ Josefská Příbram** (sídlištní), **ZŠ Velké Meziříčí** (menší město), **ZŠ Mileč** (málotřídka). Zdroje ověřeny trojím adversariálním hlasováním.

---

#### 🔑 KLÍČOVÉ ZJIŠTĚNÍ č. 1 — RVP závazné výstupy jsou AŽ na konci 5. ročníku

> *"RVP ZV stanovuje závazné výstupy pouze na konci 5. ročníku; distribuce učiva do 4. nebo 5. ročníku je plně v kompetenci školy."* (Potvrzeno 3:0)

**Dopad na OLI:** OLI grade-4 je postaven na RVP grade-4 datasetu, který je správný jako celek pro 4.–5. ročník — ale školy si samy dělí, co jde do 4. a co do 5. třídy. **Část obsahu, který OLI řadí do grade-4, některé školy učí až ve 5. třídě.**

---

#### 📐 Matematika — OK, ale s nuancemi

**Co ŠVP potvrzují shodně:**
- Přirozená čísla do 1 000 000
- Písemné sčítání, odčítání, násobení (jedno- i dvojciferným), dělení jednociferným
- Zlomky: polovina, třetina, čtvrtina, pětina, desetina
- Geometrie: obdélník, čtverec, pravoúhlý trojúhelník, osy souměrnosti
- Obsah pomocí čtvercové sítě (mm², cm², m²)
- Kalkulačka, římské číslice

**Nutná poznámka:** ZŠ Josefská má 5 hodin/týden matematiky v grade-4. Obsah OLI odpovídá.

---

#### 🏛️ Vlastivěda — pozor, historický rozsah je na hraně

**Co ŠVP potvrzují:**
- Světové strany, kompas, čtení map ✅ (OLI má)
- Pravěk, Slované/Velká Morava, Přemyslovci, Karel IV., husitské války ✅ (OLI má)

**Co ŠVP přidávají NAD rámec OLI grade-4:**
- ZŠ Mileč má v grade-4 i: **habsburská monarchie, Bílá hora, třicetiletá válka, Rudolf II., Komenský, Marie Terezie, Josef II.**
- OLI tato témata nemá vůbec — nejsou ani v RVP grade-4 datasetu (jsou grade-5 nebo vyšší)
- **Riziko: část škol (zejména málotřídky) tato témata zařazuje do 4. třídy**

---

#### 🌿 Přírodověda — OK

**Co ŠVP potvrzují:**
- Společenstva: les, louka, voda, pole — živočichové a rostliny ✅
- Běžné zemědělské plodiny ✅
- Orientace na mapě ČR (sdíleno s vlastivědou — škola si dělí sama)

OLI přírodověda odpovídá standardnímu ŠVP rozsahu.

---

#### 💻 Informatika — VELKÁ ZMĚNA od 2021

> *"Revize RVP ZV z roku 2021 zavedla Informatiku jako novou samostatnou vzdělávací oblast. Pro 1. stupeň bylo zavedení povinné od září 2023."* (Potvrzeno 3:0)

**Ve školním roce 2024/2025 tedy všechny školy 1. stupně musí mít informatiku.**

**OLI informatika (10 témat) odpovídá revizi 2021 ✅** — algoritmizace, data, digitální technologie.

**Pozor:** Původní starší ŠVP (před 2021) mají "ICT" místo "Informatika" — jiný obsah (práce s aplikacemi, internet, bezpečnost). Školy které aktualizovaly ŠVP až teď mohou mít přechodový stav.

---

### Závěrečné hodnocení

| Oblast | Shoda s ŠVP | Poznámka |
|---|---|---|
| Matematika | ✅ Vysoká | Obsah sedí, dotace 4–5h/týden |
| Čeština | ✅ Vysoká | Vzory podst. jmen — část škol dává do 5. třídy |
| Přírodověda | ✅ Vysoká | Standard napříč školami |
| Vlastivěda | 🟡 Střední | Chybí habsburská monarchie (ale ta je grade-5) |
| Informatika | ✅ Vysoká | Povinné od 2023, OLI odpovídá revizi 2021 |

**Hlavní závěr:** OLI grade-4 neodboč­il. Obsah je správný. Hlavní riziko je, že **RVP výstupy jsou závazné až na konci 5. třídy** — a školy si samy dělí rozložení. Část žáků přijde na téma dřív nebo později než OLI předpokládá. To není chyba OLI, je to vlastnost systému.

---

## Stav repozitáře

Branch: `main` — vše pushnuté.
Poslední commity:
- `fb004a0` — feat: illustrationDesc field + concrete visual fallback
- `1e24c86` — fix: admin preview defaults to grade 4
- `09c1698` — fix(types): pridat true_false do InputType union

## Otevřené úkoly

- [ ] DNS migrace oli-edu.com na Cloudflare (Resend email domain verification — MX pro `send.oli-edu.com`)
  - Potřeba přidat: `send.oli-edu.com MX 10 feedback-smtp.us-east-1.amazonses.com`
  - Pak nastavit `RESEND_FROM_EMAIL="Oli <noreply@oli-edu.com>"` v Supabase secrets
- [ ] Přegenerovat ilustrace grade-4 s novým fallbackem (admin → Ilustrace → Přegenerovat)
- [ ] `illustrationDesc` doplnit pro zbývající grade-4 témata (volitelně — generátor dá rozumný fallback)
- [ ] Zvážit přidání habsburské monarchie/Bílé hory do grade-5 vlastivěda (pro školy co to učí ve 4. třídě)
