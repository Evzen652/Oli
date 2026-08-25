# Design systém Oli

> Vzniklo z designového auditu (2026-08-25). Zdroj pravdy pro barvy, tvary
> a typografii. Když píšeš novou komponentu, ber hodnoty odsud — ne z hlavy.

## Proč to vzniklo

Aplikace působila jako tři různé produkty: landing oranžový, žákovské
a rodičovské UI fialové, admin indigo. Měření ukázalo příčinu:

| Problém | Rozsah |
|---|---|
| Natvrdo psané barevné třídy | ~1700 (proti 1647 tokenovým) |
| Paralelní šedé rampy | 5 (`slate` 167 + `gray` 40 + `stone` 25) |
| Paralelní zelené rampy | 4 (`emerald` 258 + `green` 147 + `teal` 28 + `lime` 7) |
| Paralelní fialové rampy | 4 (`violet` 193 + `purple` 86 + `indigo` 19 + `fuchsia` 11) |
| Rádiusy | 7 různých, 592 výskytů |
| Stínové škály | 2 běžely současně (Tailwind + vlastní `soft-*`) |
| Mapy předmětových barev | 6 nezávislých → matematika se vykreslovala ve 3 odstínech |
| Tlačítka obcházející `<Button>` | 138 (41 % všech) |

Nejvýmluvnější detail: na `/admin` se vedle sebe renderovaly **dvě oranžové**
— `rgb(249,116,21)` z tokenu a `rgb(249,115,22)` z natvrdo psaného hexu.

## Barvy

### Primární — borůvková

Značková barva je **`#5A45E0`**. Důvody volby: aplikace už fialová de facto
byla (309 výskytů), fialová je jediné velké místo na barevném kruhu
nekolidující se sémantikou, a splňuje kontrast.

| token | hex | kontrast s bílým textem |
|---|---|---|
| `--primary` | `#5A45E0` | **6,25 : 1** ✅ |
| `--primary-hover` | `#4A37C4` | **7,97 : 1** ✅ |
| `--accent` | `#F3F1FE` | tint |
| `--accent-foreground` | `#3B2A9E` | 9,36 : 1 na tintu ✅ |

### Oranžová patří sově, ne tlačítkům

**Tvrdé pravidlo: oranžová a jantarová nikdy nenesou bílý text.**
Změřeno: `#F97316` má s bílou jen **2,80 : 1**, `#EA580C` **3,56 : 1** —
obojí pod normou WCAG AA (4,5 : 1). Oranžová navíc v cvičení označuje
chybnou odpověď, takže jako barva značky kolidovala s významem.

Oranžová smí být: peří sovy, ilustrace, tint-čip s tmavě oranžovým textem
(`#9A3412` na `#FFF1E6` = 6,60 : 1 ✅).

### Sémantické barvy — po jedné

| role | fill (bílý text) | tint | kontrast |
|---|---|---|---|
| Správně | `#15803D` | `#E3F3E8` | 5,02 : 1 ✅ |
| Chyba | `#DC2626` | `#FDEAEA` | 4,83 : 1 ✅ |
| Nápověda | text `#B45309` | `#FEF6E7` | 5,02 : 1 ✅ |

U dětí **nedělej „špatně" červenou plochou** — karta zůstane neutrální,
červená jde jen do okraje a textu.

### Neutrály — jedna teplá rampa

Krémová základna je to nejlepší, co appka vizuálně má; studená `slate` ji
kazila. Proto je `slate`/`gray`/`zinc`/`neutral` přemapované na teplou `stone`.

| role | hex |
|---|---|
| `--background` | `#FAF9F6` |
| `--card` | `#FFFFFF` |
| `--muted` | `#F2F0EA` |
| `--border` | `#E7E2D9` (dekorativní) |
| `--input` | `#857D74` (okraj ovládacího prvku, 4,05 : 1 ✅) |
| `--foreground` | `#1C1917` |
| `--muted-foreground` | `#78716C` (4,56 : 1 ✅) |

## Tvary

> **Karta i tlačítko = 16 px. Menší ovládací prvek = 10 px. Cokoli kulatého = full.**

| hodnota | co | třída |
|---|---|---|
| 6 px | checkbox, radio, mini-tag | `rounded-sm` |
| 10 px | input, select, dropdown, malé tlačítko | `rounded-md` |
| **16 px** | **karta, panel, modal, tlačítko ≥40 px** | `rounded-lg`/`xl`/`2xl` |
| 24 px | sekce landingu, hero | `rounded-3xl` |
| full | pilulka, avatar, ikonové tlačítko | `rounded-full` |

`xl` i `2xl` jsou **aliasy na 16 px** — tím se 254 existujících volání
sjednotilo bez editace komponent.

## Stíny

> **Ležím = nic. Dá se na mě kliknout = e1. Vznáším se = e2.**

| úroveň | kde |
|---|---|
| žádný | statická karta, panel, řádek seznamu — oddělení nese `border` |
| `shadow-e1` | interaktivní karta, tlačítko, sticky hlavička |
| `shadow-e2` | modal, dropdown, toast + **hover** e1 plochy |

Staré třídy (`sm`/`md`/`lg`/`soft-*`) jsou přemapované na tyto dvě.
Stíny jsou teple neutrální `rgba(41,37,36)` — studený stín na krémovém
papíru působí špinavě.

### Hover — jeden pohyb

Nepoužívej `hover:scale-105`/`1.02`/`1.01` (dřív tři různé na jedné obrazovce):

```
hover:  shadow-e2 + -translate-y-[1px]
active: translate-y-0 + scale-[0.98]
focus:  ring-2 ring-primary ring-offset-2
```

## Typografie

**Jedno písmo: Nunito.** Baloo 2 se nikdy nevykreslil — v konfiguraci chyběly
uvozovky kolem názvu s mezerou, takže prohlížeč deklaraci zahodil; font se
stahoval při každém načtení a nezobrazil se.

| token | px | váha | kde |
|---|---|---|---|
| display | 34 | 800 | hero, „Správně!" |
| h1 | 26 | 800 | název stránky |
| h2 | 21 | 700 | název karty, znění otázky |
| h3 | 17 | 700 | podnadpis |
| body-lg | 17 | 400 | **default v dětské části** |
| body | 15 | 400 | **default v rodič/admin** |
| label | 13 | 600 | popisky polí |
| caption | 12 | 500 | metadata — **absolutní minimum** |

**Nic pod 12 px.** Rodičovská část měla základní text 11–12 px, což je pod
hranicí komfortu u produktu, který má prodat důvěryhodnost.

### Dítě vs. rodič — stejné písmo, jiné měřítko

| | dítě | rodič / admin |
|---|---|---|
| základní text | 17 px | 15 px |
| min. výška tlačítka | **56 px** | 40 px |
| rytmus mezi bloky | 24 px | 16 px |

Rodič musí poznat, že je to **stejná aplikace, kterou používá jeho dítě** —
odlišnost nese měřítko a prostor, ne jiné písmo.

## Kde smí zůstat pestrost

**Barvu nesou obrázky, ne UI.** Ilustrace a sova jsou zdroj radosti;
rozhraní kolem nich má být tiché, aby vynikly.

Zůstává:
- **předmětové rozlišení**, ale jen jako 40×40 dlaždice ikony, 3px linka
  nebo chip — **nikdy** jako pozadí celé karty (karta je vždy bílá)
- **stavy zpětné vazby** (zelená/červená/jantarová), po jednom odstínu
- **rampa zvládnutí** — 4 kroky neutrál → zelená
- **ilustrace, sova, konfety** — tady se nedrž zpátky

| předmět | ink | tint |
|---|---|---|
| Matematika | `#1D4ED8` | `#E3EDFD` |
| Čeština | `#A81E52` | `#FDE7EF` |
| Prvouka | `#0F766E` | `#E0F2F0` |
| Přírodověda | `#3F6212` | `#EDF3E1` |
| Vlastivěda | `#92400E` | `#FAEEE2` |
| Angličtina | `#7E22CE` | `#F5E9FD` |

## Co zbývá dodělat

- [ ] `ui/button.tsx` — base `rounded-lg`, přidat varianty `success`/`warning`/`answer` (min-h 56) a size `child`
- [ ] `ui/card.tsx` — `rounded-lg`, bez stínu default, prop `interactive`
- [ ] `ui/badge.tsx` — varianty `success`/`warning`/`info` (zmizí důvod pro 63 ručních pilulek)
- [ ] Odstranit inline přepisy v `SessionView`, `SessionEndSummary`, `CheckFeedbackCard`, `TopicBrowser`
- [ ] `BackButton` postavit na `buttonVariants` (má vlastní rádius, šeď i focus ring)
- [ ] Typografická škála do `tailwind.config.ts` + zvednout písmo v `/parent` a `/admin`
- [ ] `subjectRegistry.ts` jako **jediná** mapa předmětů (smazat `SUBJECT_DOT`, `SUBJECT_COLORS`, `SUBJECT_META`, `SUBJECT_CARD_STYLES`, `FALLBACK_PALETTES`); doplnit angličtinu/informatiku (dnes náhodná barva z hashe)
- [ ] Landing: 6 pastelových karet → bílé karty s ikonovým akcentem
- [ ] Logo: zrušit gradientní text (`-webkit-text-fill-color: transparent` bez `color` fallbacku — při nenačtení fontu nápis **zmizí**), dvě varianty plnou barvou

Odloženo: dark mode (dnes nepoužitelný — `soft-*` stíny mají natvrdo studené
`rgba(15,23,42)`, předmětové proměnné nemají `.dark` override), admin
(interní, spraven „dost dobře" přemapováním).
