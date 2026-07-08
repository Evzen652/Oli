# Handoff — oprava generátorů úloh podle review exportu

> Vytvořeno 2026-07-08. Zdroj: nezávislý review souboru `review-export.md`
> (6116 úloh, 154 generátorů, 5 předmětů, 2.–4. ročník).
> Plný work order: `D:\weigle\stažené soubory\cc-prompt-oli-review.md` (u uživatele).

Novou session začni tím, že si přečteš tento soubor + `review-export.md`, pak pracuj
po prioritách shora. Po každé skupině oprav spusť audit a ukaž výsledek.

## ⚠️ Klíčové zjištění z předchozí session (mění P0)

**P0 NENÍ produkční bug.** Runtime porovnání `select_one` jde přes `stringExactValidator`
([src/lib/validators/index.ts:772](../src/lib/validators/index.ts)), který normalizuje:
```js
s.trim().toLowerCase().replace(/\s+/g," ").normalize("NFC")
```
→ Žák s odpovědí „Ano" na klíč „ano" je označen **správně**. Case/diakritika/whitespace
se srovnávají. Framing review „může trestat žáky" tedy neplatí. Fix (sjednotit velikost
klíče s možností) má smysl jen pro **hygienu exportu/auditu**, ne jako urgentní prod bug.
→ Přeřaď P0 z „VYSOKÁ/prod" na „hygiena, nízká priorita".

## Kde jsou klíčové soubory

- **Runtime validátory:** `src/lib/validators/index.ts` (`stringExactValidator`, `getValidator`,
  mapování inputType→validator kolem ř. 767).
- **Formát-validátor úloh:** `src/lib/taskValidator.ts` (`validateTaskForInputType`).
- **Úrovně I/II/III (rozdílové pravidlo):** `src/lib/levelCoverage.ts` (`getTierTasks`, `maxAvailableLevel`).
- **Audit:** `src/lib/contentAudit.ts` + testy `src/test/content-audit.test.ts`,
  `src/test/audit-new-checks.test.ts`, admin UI `src/components/admin/AdminContentAudit.tsx`.
- **Generátory:** `src/content/grade-{2,3,4}/{matematika,cjl,prvouka,prirodoveda,vlastiveda}/*.ts`
  (vzor: pooly `POOL_L1/L2/L3` + `gen(level)`). **Informatika se needituje** (mimo rozsah).
- **Sdílené content helpery:** `src/lib/content/helpers.ts`, `src/lib/content/math/*`, `.../czech/*`.
- **Regenerace exportu:** `EXPORT_REVIEW=1 npx vitest run src/test/review-export.test.ts`
  (skript `src/test/review-export.test.ts`, defaultně skipnutý).

## ZAMČENO (freeze) — neměnit otázku ani klíč

Ověřeno jako správné, smí se měnit jen forma/struktura (distraktory, velikost písmen,
chybějící úroveň), NIKDY znění otázky ani správná odpověď:
- Veškerá aritmetika (692 úloh), veškerá faktografie (Přír/Vlast/Prvouka),
  ověřené české pravopisné/tvaroslovné klíče (vyjmenovaná, i/y, dě-tě-ně…, vzory, s/z, syn/antonyma, slovní druhy).

**Vynutit snapshotem:** před prací vygeneruj deterministický snapshot (otázka+klíč, zafixovaný
seed) a přidej audit `frozen_content_unchanged`, který padá při změně.

## Pořadí práce

1. **Snapshot zamčeného obsahu** + audit `frozen_content_unchanged`.
2. **P1 (BUG 4)** — generátor předpon `g4-cjl-…-pravopis-predpon-vy-vy-s-z-vz`: „zdal", „spochodovala"
   ap. → projdi celý slovní fond, každá (předpona+základ) musí být spisovné slovo a věta konzistentní.
3. **P2 (BUG 2)** — neunikátní možnosti (hl. `g4-mat-zlomek-cast-celku-4` 56 úloh): ve sdíleném
   options helperu zaručit n různých možností + 1 správná; u řazení `g3-mat-cisla-do-1000` unikátní vstupy.
4. **P0 (BUG 1, hygiena)** — sjednotit velikost klíče s možností (111 úloh, 3 generátory čtení/reklama/předpony).
5. **PED-1** — pravopis 1. stupně: možnosti = sporný grafém (i/í/y/ý), ne celá chybná slova.
6. **PED-2** — kalibrace úrovní L1<L2<L3 (např. `g3-mat-nasobilka-6-10`).
7. **P3/PED-3** — variabilita + naplnit L3 (geometrie, přír/vlast s 1 unikátní úlohou).
8. **PED-4** — víc produkčních formátů (doplň/napiš) u pravopisu/tvarosloví.
9. **BUG 3 (ověřit)** — Přírodověda: 100 % úloh bez `Nápověda (úloha)` — záměr (šablona), nebo výpadek?
10. **Audit invarianty** do `runOfflineAudit`: `answer_key_matches_one_option`, `options_distinct`,
    `prefix_words_are_valid`, `min_unique_tasks_per_tier`, `tier_population`, `frozen_content_unchanged`.

Aritmetiku, faktografii ani ověřené české klíče needituj. Každou opravu ověř tak, že audit projde.
