# Grade 6 — STATUS (pilot 2. stupně)

> Pilot: **Fyzika** (výpočetní vzor) + **Dějepis** (faktický vzor).
> Ostatní předměty (čeština, matematika, zeměpis, přírodopis, výchova k občanství)
> až po pilotu. `GRADE_6_TOPICS` obsahuje jen hotová témata.

## Fyzika (13 RVP podtémat)

### Měření fyzikálních veličin
- [x] **Délka – jednotky, měření délky** → `fyzika/mereniDelky.ts` ✅ (zlatý vzor: L1→L3, chybový model, optionFeedback)
- [x] **Hmotnost – jednotky, vážení** → `fyzika/mereniHmotnosti.ts` ✅ (mg/g/dkg/kg/t, recept/balení)
- [x] **Objem – jednotky, měření odměrným válcem** → `fyzika/mereniObjemu.ts` ✅ (ml/l/dl/cm³/dm³ + ekvivalence cm³=ml)
- [x] **Hustota – výpočet a měření** → `fyzika/hustota.ts` ✅ (vrchol: ρ=m/V, m=ρ·V, identifikace látky; chybový model = záměna vzorce)
- [x] **Teplota – jednotky, výpočty, kelviny** → `fyzika/mereniTeploty.ts` ✅ (změna teploty, rozdíl přes nulu, °C→K; chybový model = směr + nula)
- [x] **Čas – jednotky, převody, časová osa** → `fyzika/mereniCasu.ts` ✅ (h/min/s základ 60, zbytek, časová osa s přenosem; chybový model = ×100 místo ×60)

**Okruh „Měření veličin": 6/6 hotovo. ✅** Teplota a čas mají jiný charakter (teplota není násobkový převod, čas má základ 60) — vzor obstál.

> Sdílené utility převodových úloh: `fyzika/_shared.ts` (cz/pick/shuffle/buildChoiceTask).
> Společný test: `__tests__/prevodyJednotek.test.ts` (parametrizovaný přes 3 témata, 51 testů).

### Látky a tělesa
- [ ] Látka a těleso – rozlišení, vlastnosti látek
- [ ] Skupenství látek – pevné, kapalné, plynné
- [ ] Atomy, molekuly – úvod do mikrosvěta
- [ ] Pohyb částic – difuze, Brownův pohyb

### Elektrické vlastnosti látek
- [ ] Elektrické pole – kladný a záporný náboj
- [ ] Jednoduchý elektrický obvod – zdroj, vodič, spotřebič, spínač
- [ ] Magnety – magnetické pole, magnetické póly Země

## Dějepis (24 RVP podtémat)
- [ ] _zatím nezahájeno_ (faktický vzor — authoring pipeline)
