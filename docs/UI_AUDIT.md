# UI audit — detektor chyb typu „slibuje něco, co nedělá"

> `npm run audit:ui` · oprava bezpečné podmnožiny `npm run audit:ui -- --fix`
> Pravidla: [`scripts/uiAudit/rules.mjs`](../scripts/uiAudit/rules.mjs) · testy: [`src/test/ui-audit.test.ts`](../src/test/ui-audit.test.ts)

## Proč vznikl

Audit rodičovského dashboardu (2026-09-04) ukázal, že chyby, které nejvíc kazí
dojem z produktu, mají společný tvar: **prvek slibuje něco, co nedělá.**

- Tlačítko „Skrýt", které neskryje.
- Pole „Poznámky k učení", které nikdo nepřečte.
- Pilulka „🔥 8 dní v řadě", kde dny v řadě nejsou.
- Hotová komponenta, kterou nikdo nerenderuje.
- Prázdná půlobrazovka místo „zatím žádné úkoly".

Ani jednu z nich nechytí typecheck ani testy — kód je validní a všechno
„funguje", jen to neznamená, co tvrdí. Většinu z nich taky nenašel žádný nástroj,
ale **uživatel**, případně náhoda při čtení sousedního řádku.

Zato mají v AST rozpoznatelný otisk. Proto tenhle nástroj.

## Jak je ověřený

Spuštěn proti stromu **před** dnešními opravami (`feed2bf`) našel **všech devět**
chyb, které se toho dne řešily ručně — včetně `open={open || shouldDefaultOpen}`,
kterou v kódu nikdo nenašel a nahlásil ji až uživatel z běžícího UI.

To je jediná validace, která u takového nástroje něco znamená: neukazuje, že
umí najít vymyšlené vzory, ale že by byl našel skutečné chyby dřív než člověk.

## Pravidla

| pravidlo | co hlásí | vzniklo z |
|---|---|---|
| `dead-component` | exportovaná komponenta bez jediného importu | ChildActivityChart, SelfPracticeList |
| `stuck-toggle` | `open={a \|\| b}` s `onOpenChange`, který mění jen `a` | tlačítko „Skrýt" u grafu aktivity |
| `utc-day-key` | `toISOString().slice(0, 10)` jako klíč dne | `useChildStats`, `weeklyReportGenerator`, graf |
| `write-only-state` | `useState`, jehož hodnota se nikde nečte | „Poznámky k učení" |
| `branch-only-action` | handler navěšený jen v dřívější větvi renderu | „Spustit AI analýzu chyb" |
| `empty-state-null` | `if (x.length === 0) return null` | prázdná 460px díra v „Zadaných úkolech" |
| `adhoc-subject-map` | předmět odvozený z prefixu místo z rejstříku | `subjectEmoji()` v grafu |
| `streak-language` | „v řadě" nad `daysActive` | „🔥 8 dní v řadě" |
| `name-in-word` | `replace(/[Žž]ák/g, jméno)` bez hranic slova | `ChildMisconceptions`, `Report` |
| `unused-import` | import, který se v souboru nepoužívá | `useT` v `AssignmentList` |

Každé pravidlo nese v kódu pole `why`, `suggestion` a `origin`. Test to vynucuje —
pravidlo bez odůvodnění neprojde. Když ho někdo bude chtít vypnout, ať přitom
vidí, co tím pouští zpátky.

## Co nástroj NEopravuje sám

Automaticky se opravuje **jedině `unused-import`**, kde je náhrada prokazatelně
bez sémantického dopadu. U všeho ostatního je „oprava" produktové rozhodnutí,
ne mechanická náhrada:

- mrtvá komponenta → *smazat, nebo napojit?* (u grafu aktivity padlo obojí, v tomhle pořadí),
- prázdný stav → *co tam vlastně má stát a co má uživatel udělat?*,
- text o sérii → *přepsat text, nebo sérii doopravdy spočítat?*

Nástroj proto u každého nálezu vypíše PROČ, NÁVRH a PŮVOD — a rozhodnutí nechá
člověku. Autofix, který by tohle hádal, by dělal přesně tu chybu, kterou má hlídat.

## Baseline

Repo má historický dluh, takže guard selže jen na **novém** nálezu — stejný
princip jako [`scripts/typecheck.mjs`](../scripts/typecheck.mjs). Přijaté nálezy
jsou v [`scripts/ui-audit-baseline.json`](../scripts/ui-audit-baseline.json).

**Seznam jen zkracuj.** Přidat se do něj má jen to, co je vědomé rozhodnutí
s odůvodněním — jinak z guardu zbude ozdoba.

```bash
npm run audit:ui                      # guard (běží v CI)
npm run audit:ui -- --all             # včetně baseline
npm run audit:ui -- --fix             # bezpečná podmnožina
npm run audit:ui -- --update-baseline # po vědomém rozhodnutí
npm run audit:ui -- --root <dir>      # jiný strom (starý commit, worktree)
```

## Jak přidat pravidlo

Do `scripts/uiAudit/rules.mjs` a **současně** test do `src/test/ui-audit.test.ts` —
pozitivní i negativní. Ta druhá půlka je důležitější: detektor, který křičí na
běžný kód, se do měsíce vypne. Při stavbě tohohle nástroje spadly do falešných
poplachů tři první verze pravidel:

- `branch-only-action` původně hlásilo každý `handleSubmit` (33 nálezů, z toho 32 v pořádku),
- `stuck-toggle` hlásilo `value={x || "all"}`, což je u Radix Selectu správný idiom,
- `adhoc-subject-map` hlásilo `Report.detectSubject`, který rejstřík volá první a prefixy má jen jako fallback,
- `streak-language` hlásilo „máš **za sebou** 12 úloh", což je česky „mít hotovo", ne série.

Každý z nich stál jedno zpřesnění pravidla. Ten čas se vyplatí — hlučný detektor
je horší než žádný, protože vypadá, že hlídá.
