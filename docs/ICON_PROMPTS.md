# Prompty pro chybějící akvarelové ikony

Stav k 2026-09-03. Doplňuje [`ILLUSTRATION_STYLE.md`](ILLUSTRATION_STYLE.md) —
tady jsou jen konkrétní zadání pro kousky rozhraní, které ještě drží starý styl.

## Proč vůbec

Aplikace má dvě generace obrázků, které se potkávají na jedné obrazovce:

1. **Akvarel s inkoustovou konturou** — landing page, ilustrace předmětů,
   ikony průběhu (`src/assets/progress/`). Tohle je současný rukopis.
2. **Plochý vektorový klipart** — maskot v dialozích, žárovka u nápovědy.
   Zbytek po starším kole. Vedle akvarelu působí jako vlepený z jiné aplikace.

Seznam níž je to, co ze skupiny 2 ještě zbývá.

## Reference, kterou přiložit ke KAŽDÉMU promptu

`src/assets/landing-zlomky-kruh.png`

**Ne** `landing-priprava-na-pisemku.png` — to je nejbledší akvarel v repu
(medián sytosti 40 %). Model ho jednou napodobil na procento přesně a výsledek
byl bez života. Správná reference má sytost 67 %, tedy stejnou jako staré
3D kresby, které se uživateli líbily.

**Slovo „pastel" do promptu nepatří.** Spolehlivě vede k vyblednutí.

## Společná část promptu

> Watercolour illustration with a loose ink outline, in the exact style of the
> attached reference image. Saturated pigment, visible brush texture, slightly
> uneven contour that does not close perfectly. Pure white background, single
> object centred, no text, no frame, no shadow under the object. Square image,
> at least 1024×1024.

## Jednotlivá zadání

### 1. Pohár — hlavička shrnutí procvičování

Nahradí lucide ikonu `Trophy` v `src/components/SessionEndSummary.tsx`.
Cílový soubor: `src/assets/progress/summary-trophy.png`

> A simple two-handled trophy cup on a low base. Warm gold and amber pigment
> with a terracotta ink outline. Friendly and modest, not a sports prize —
> this is for a nine-year-old who finished a practice session, not a champion.
> No stars, no confetti, no laurel wreath.

Terakotová kontura proto, že hlavička shrnutí je v `#9A3412`.

### 2. Sovička — hlavička dialogu „Co je dobré vědět"

Nahradí `src/assets/good-to-know.png` (plochý klipart s obličejem a knihou).
Cílový soubor: `src/assets/good-to-know.png` (stejná cesta, ať se nemění import)

> A small owl leaning over an open book, seen from the side, reading. Brown and
> cream plumage, warm orange beak. Calm and absorbed — **no raised finger, no
> pointing gesture, no wagging wing.** The owl is reading, not lecturing.
> No glasses that dominate the face.

Zdvižený prst je výslovně zakázaný — uživatel ho odmítl u loga se slovy, že
„působí školometsky". Totéž platí tady.

### 3. (volitelně) Lupa — ikona boxu „Zajímavost"

Dnes tam je akvarelová žárovka z `progress-help.png`, sdílená s nápovědou.
Funguje, ale vlastní ikona by oba významy rozlišila.
Cílový soubor: `src/assets/progress/insight-magnifier.png`

> A magnifying glass held at a slight angle, wooden handle, brass ring, clear
> glass. Warm amber and brown pigment. Nothing behind the lens — the glass is
> empty, so the icon reads at 24 px.

## Po stažení — povinný postup

Platí beze zbytku postup z `docs/SUBJECT_ILLUSTRATIONS.md`:

1. `scripts/make-logo.ps1` — odříznout pozadí. **Vyšší práh = VÍC obsahu.**
   U kreseb na zrnitém papíře je potřeba jít s prahem DOLŮ, jinak se do
   obsahového rámečku započítá zrno a kresba se zbytečně zmenší.
2. `scripts/check-white-pockets.ps1` — **povinné, ne „na oko".** Uzavřené bílé
   kapsy (uvnitř ucha poháru, mezi držadly) záplavová výplň od okrajů nedosáhne.
   U počítadla jich takhle zbylo 11 449 pixelů, tedy čtvrtina obrázku, a při
   pohledu na náhled to nebylo vidět.
3. Náhled ve skutečné velikosti (24 px, 28 px) — ikona se musí poznat z jedné
   barevné plochy, ne z detailu.
4. Změřit sytost proti referenci (`scratchpad/sat-compare.ps1`). Cíl ~67 %.
