# Motivy na dlaždicích ročníků — zadání pro Gemini

Dlaždice výběru ročníku ([`Onboarding.tsx`](../src/pages/Onboarding.tsx)) nesou motiv
stěžejního učiva. Mapování drží [`src/lib/gradeIllustrations.ts`](../src/lib/gradeIllustrations.ts).

**Hotovo:** 2., 3., 4. ročník (`Gemini_Generated_Image_7herku…jpg`).
**Zbývá:** 1., 5.–9. — ročníky zatím bez obsahu, ale kresby se dělají dopředu.

## Odkud se motivy vzaly

Nejsou vymyšlené. U ročníků 2–4 z prvního okruhu v `src/content/grade-N/navigation.ts`,
u zbytku z `data/rvp_data.json` — vždy **téma, které se v daném ročníku objevuje poprvé**
(porovnáno proti všem nižším ročníkům):

| ročník | co je pro ročník nové | motiv |
|---|---|---|
| 1 | `pocatecni-cteni`, `pocatecni-psani`, `ciselny-obor-0-20` | tabulka s velkým psacím **a** |
| 2 | „Počítání do 100" | počítadlo ✅ |
| 3 | „Vyjmenovaná slova" | kniha s **Y** ✅ |
| 4 | „Velká čísla", „Zlomky" | koláč na čtvrtiny ✅ |
| 5 | `velka-cisla-a-desetinna-cisla` | skládací metr |
| 6 | `uhel`, `trojuhelniky` + **nové předměty** (zeměpis, dějepis, fyzika, přírodopis) | globus |
| 7 | `pomer-a-procenta`, `ctyruhelniky`, `shodnost-trojuhelniku` | kružítko a trojúhelník |
| 8 | **chemie** (nový předmět), `linearni-rovnice`, `druha-mocnina` | baňka s barevnou kapalinou |
| 9 | `telesa`, `funkce`, `financni-matematika` | kužel, koule a válec |

Globus u šestky a baňka u osmičky nesou navíc informaci, která dítě zajímá:
**v šestce začíná druhý stupeň, v osmičce přibývá chemie.**

## Společná pravidla (proč jsou v promptu)

- **Sytá barva a tmavá kontura, ne bledé pastely.** Dlaždice má sytost 75 % — bledý motiv
  na ní zanikne. Na tom ztroskotaly stávající `cat-*.png` / `topic-*.png`.
- **Jeden velký jednoduchý objekt.** Renderuje se na ~130 px; cokoli členitého je změť.
- **Bez textu** kromě jediného písmene tam, kde je součástí motivu (`a`, `Y`).
- **Čistě bílé pozadí a okraj kolem dokola** — jinak nejde vyříznout
  ([`ILLUSTRATION_STYLE.md`](ILLUSTRATION_STYLE.md) §2).
- **Pozor na uzavřené díry** (mezery v kružítku, mezi tělesy). Po vyříznutí je **nutné**
  spustit `scripts\check-white-pockets.ps1` — počítadlo na tomhle propadlo, viz §2.5.

**Ke každému promptu přilož `Gemini_Generated_Image_7herku7herku7her.jpg`** (hotové motivy
2–4), aby nové kresby držely stejný rukopis.

---

## List A — ročníky 1, 5, 6

> Watercolour and ink children's picture-book illustration, in exactly the style of the
> attached reference image: hand-painted on rough cold-pressed paper, fine uneven ink
> contour line, transparent washes, visible paper grain.
>
> Three separate simple objects side by side on one sheet, NOT touching, with a wide band
> of empty white paper between them and around all four edges.
>
> LEFT: a small school writing slate in a wooden frame, with one large handwritten
> lowercase letter "a" chalked on it.
> MIDDLE: a folding carpenter's ruler, partly unfolded into a zig-zag, with visible
> measuring marks.
> RIGHT: a globe on a stand, with simple green continents on a blue ocean.
>
> Each object bold, simple and centred, drawn large and filling its area — these will be
> displayed very small. Strong dark ink outlines and deep saturated colours, NOT pale
> pastels. No text apart from the single letter "a", no numbers, no people, no background
> scenery, no shadows. Pure flat white background across the whole sheet. Wide 3:1
> landscape format.

## List B — ročníky 7, 8, 9

> Watercolour and ink children's picture-book illustration, in exactly the style of the
> attached reference image: hand-painted on rough cold-pressed paper, fine uneven ink
> contour line, transparent washes, visible paper grain.
>
> Three separate simple objects side by side on one sheet, NOT touching, with a wide band
> of empty white paper between them and around all four edges.
>
> LEFT: a pair of drawing compasses standing open, next to a triangular set square.
> MIDDLE: a conical laboratory flask filled with bright coloured liquid.
> RIGHT: three solid geometric shapes standing together — a cone, a sphere and a cylinder,
> each a different colour.
>
> Each object bold, simple and centred, drawn large and filling its area — these will be
> displayed very small. Strong dark ink outlines and deep saturated colours, NOT pale
> pastels. No text, no numbers, no people, no background scenery, no shadows. Pure flat
> white background across the whole sheet. Wide 3:1 landscape format.

---

## Zpracování po návratu

```powershell
# 1) najdi jednotlive kresby na listu (toleruje zrno papiru)
scratchpad\find-gaps.ps1 -In <list.jpg> -Thr 240 -Tol 6

# 2) pro kazdou: orez + vyriznuti pozadi
scripts\make-logo.ps1 -In <orez.png> -Out src\assets\grade-N.png -Size 256 -Thr 242

# 3) POVINNE: kontrola uzavrenych bilych kapes
scripts\check-white-pockets.ps1 -Files src\assets\grade-N.png
#    podil nad ~1 % -> fix-landing-alpha.ps1 -ScanOnly, pak -ClearIds
```

Nakonec doplnit ročník do `BY_GRADE` v `src/lib/gradeIllustrations.ts`. Dokud tam není,
dlaždice zobrazuje holé číslo — to je záměr, ne chyba: **kresba znamená „ročník má obsah".**
Až se kresby nasadí i pro neaktivní ročníky, tenhle signál zanikne a bude potřeba rozlišit
dostupnost jinak (dnes to nese ještě odbarvení a popisek „BRZY").
