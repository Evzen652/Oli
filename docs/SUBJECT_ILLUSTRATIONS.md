# Ilustrace předmětů — převod do akvarelového rukopisu

Karty cvičení používají kresbu **podle předmětu**, ne podle tématu. Ty dnešní jsou
ve starém stylu „3D Pixar illustration" (edge funkce `generate-prvouka-images`) a vedle
akvarelů na landing page vyčnívají.

## Co měření ukázalo — jiný rozsah, než to na první pohled vypadá

Na obrazovce „Dnešní úkoly" mají dvě různá témata prvouky **tentýž obrázek**. Není to
chyba: `AnonStudentPage.tsx:326` volá `getSubjectMeta(topic.subject)`, tedy kresbu
**předmětu**. Odvozené klíče na téma (`topic-prvouka-cas-a-svatky-hodiny-a-cas` apod.)
ve storage **vůbec neexistují** — ověřeno, vrací 400.

**Není to tedy stovky kreseb, ale třináct.** A z těch existuje sedm:

| předmět | stav | velikost |
|---|---|---|
| matematika | ✅ | **4 196 kB** |
| prvouka | ✅ | **4 196 kB** |
| přírodověda | ✅ | **4 196 kB** |
| dějepis | ✅ | 2 361 kB |
| chemie | ✅ | 2 361 kB |
| vlastivěda | ✅ | 1 049 kB |
| čeština | ✅ | 374 kB |
| angličtina, informatika, fyzika, přírodopis, zeměpis, výchova k občanství | ❌ chybí | — |

⚠️ **Vedlejší nález: velikost.** Sedm kreseb váží dohromady **18,7 MB** a renderují se
v boxech 20–224 px. `subject-matematika.png` má 4,2 MB na kartu velkou 112 px. Nové
kresby mají cíl **512 px / ~120 kB**, což celek srazí zhruba na 0,8 MB.

Chybějící předměty dnes padají na emoji fallback — u druhého stupně je to vidět.

## Kde kresby leží — ✅ přesunuto do projektu (2026-09-02)

Byly v Supabase storage (bucket `prvouka-images`, klíč `subject-{slug}.png`). **Nově jsou
to lokální assety** v `src/assets/subjects/`, importované v `subjectRegistry.ts`.

Důvod: uživatel admin regeneraci ilustrací nikdy nepoužil, takže jediné, co storage
přinášel, byla závislost na nasazení — nahrát tam kresbu uměl jen on. Původní argument
pro storage (regenerace z adminu se propíšou bez buildu, `PROJECT_STATUS.md` 2026-06-17)
tím padá.

**18,3 MB → 2,0 MB** po vyříznutí pozadí a zmenšení na 512 px.

`SubjectMeta.image` je nově **volitelné**. Předmět bez kresby ho prostě nemá a
`IllustrationImg` zobrazí emoji; dřív se pro něj skládala URL, která vracela 404.

⚠️ **Latentní nesoulad:** admin obrazovka „Generovat ilustrace" pořád zapisuje předmětové
kresby do storage, ale aplikace je odtud už nečte. Kdo ji použije, nic v aplikaci
neuvidí. Kategoriové a tématové ilustrace (`prvoukaVisuals.ts`) ve storage zůstávají,
takže obrazovku nelze jen tak vypnout — chce to rozhodnout zvlášť.

### Jak nasadit novou kresbu

```powershell
scripts\make-logo.ps1 -In <orez.png> -Out src\assets\subjects\subject-{slug}.png -Size 512 -Thr 242
scripts\check-white-pockets.ps1 -Files src\assets\subjects\subject-{slug}.png
```

Nový předmět navíc potřebuje `import` a pole `image` v `subjectRegistry.ts`.

---

## Zkušební dvojice: prvouka + matematika

Obě jsou 4,2 MB, obě jsou vidět na první obrazovce a pokrývají dva různé typy motivu —
scénu a předmět. **Na jednom listu**, aby držely rukopis (`ILLUSTRATION_STYLE.md` §5).

**Přilož jako referenci** `src/assets/landing-priprava-na-pisemku.png` (nebo jinou
`landing-*.png`) — drží akvarelový rukopis.

> Watercolour and ink children's picture-book illustration, in exactly the style of the
> attached reference image: hand-painted on rough cold-pressed paper, fine uneven ink
> contour line, transparent pastel washes, visible paper grain, muted pastel palette.
>
> Two separate objects side by side on one sheet, NOT touching, with a wide band of empty
> white paper between them and around all four edges.
>
> LEFT: a small leafy tree with a little bird sitting on one branch and a friendly sun
> peeking out behind the top.
> RIGHT: a pair of old-fashioned balance scales in equilibrium, with two or three simple
> coloured wooden blocks resting in the pans.
>
> Each object bold, simple and centred, drawn large and filling its area — these will be
> displayed as small as 20 px. No text, no letters, no numbers, no people, no background
> scenery. Pure flat white background across the whole sheet, nothing touching any edge.
> No border, no frame, no drop shadow. Wide 2:1 landscape format.

### Proč zrovna tyhle motivy

- **Strom s ptáčkem** — prvouka je „svět kolem nás"; dnešní kresba (sova s chlapcem na
  větvi) je tomu blízko, takže změna nebude působit jako jiný předmět.
- **Váhy s kostkami** — matematika. **Ne počítadlo**: to už je motivem dlaždice
  2. ročníku a opakovat ho by mátlo.

## ✅ Funkční postup (od 2026-09-03) — překreslit starou kresbu, ne vymýšlet novou

Staré 3D ilustrace **nejsou špatné, jen jsou ve starém stylu**. Nejlepší výsledek dá
zadání „překresli tuhle scénu tímhle rukopisem", ne „nakresli něco na téma X".

Originály k přiložení: `D:\weigle\plocha\Oli_ILUSTRACE\stare-predmety\`.

**Přílohy v tomto pořadí:** stará kresba A · stará kresba B · `landing-zlomky-kruh.png`.
Dvě kresby naráz na jednom listu — samostatné běhy rozejdou sytost a konturu
(`ILLUSTRATION_STYLE.md` §5).

### 🐞 Dvě chyby v zadání, obě moje, obě měřitelné

**1. „no people, no background scenery" vysálo z kreseb život** — a bylo to i věcně
špatně. Odůvodnil jsem to čitelností na 20 px, jenže měření ukázalo pravý opak: **stará
hustá scéna je na 20 px čitelnější než osamocený předmět**, protože má barevnou hmotu.
Řídká kresba z pár čar se ztratí dřív. Motiv proto musí mít **souvislou barevnou plochu**.

**2. Jako referenci stylu jsem dal nejbledší akvarel v repu.** Model ji napodobil přesně
— a výsledek byl bledý. Naměřené mediány sytosti:

| kresba | medián sytosti |
|---|---|
| stará přírodověda (cíl) | **78 %** |
| stará matematika (cíl) | **67 %** |
| `landing-zlomky-kruh.png` | **67 %** ← správná reference |
| `landing-diktat.png` | 63 % |
| `landing-priprava-na-pisemku.png` | **40 %** ← špatná reference, kterou jsem použil |
| výsledek s ní | **41 %** |
| výsledek se správnou referencí | **63 %** |

Ze zadání zmizelo slovo „pastel" úplně — model si ho vykládá jako pokyn ke zesvětlení.
Nahrazeno výslovným zákazem (`NOT pale, NOT muted, NOT pastel, NOT faded`) a větou
„match the colour strength of the first two images".

**Sytost výsledku vždy změř** (`scratchpad/sat-compare.ps1`), nespoléhej na dojem —
právě dojem mě nechal poslat špatnou referenci.

### Stav

| předmět | stav |
|---|---|
| matematika, přírodověda | ✅ překresleno do akvarelu |
| prvouka, čeština, vlastivěda, dějepis, chemie | ⏳ stará 3D kresba, čeká na překreslení |
| angličtina, informatika, fyzika, přírodopis, zeměpis, výchova k občanství | ❌ kresba neexistuje, zobrazuje se emoji |

### ⛔ Zavržené první kolo (2026-09-02)

`Gemini_Generated_Image_ax13jz…jpg` — obojí nasazeno jako
`src/assets/subjects/subject-prvouka.png` a `subject-matematika.png`.

**Strom funguje ve všech velikostech**, i na 20 px zůstane čitelný jako zelená koruna
se sluncem. **Váhy na 20 a 28 px téměř mizí** — jsou to tenké šedé linky bez barevné
plochy. Vidět je to na `scratchpad/new-subj-proof.png`.

> 📌 **Pravidlo pro zbývající předměty:** motiv musí mít **souvislou barevnou plochu**,
> ne jen obrysovou kresbu. Kresby se používají i v boxu **20 px**
> (`AssignmentCreator.tsx:210`) a **28 px** (`Report.tsx:389`) — tam přežije jen barevná
> hmota. Strom to má (koruna), váhy ne.

### Pozor při zadání

Tenhle prompt **nemá** „deep saturated colours, NOT pale pastels", které mají motivy
dlaždic ročníků. Je to schválně: dlaždice jsou syté barevné plochy, kdežto karty cvičení
jsou **bílé**, takže tlumený akvarel je tam na místě a sytá kresba by naopak vyčnívala.

---

## Zpracování po návratu

```powershell
# 1) rozdelit list
scratchpad\find-gaps.ps1 -In <list.jpg> -Thr 240 -Tol 6

# 2) orez + vyriznuti pozadi, 512 px kvuli boxu hero (224 px na 2x)
scripts\make-logo.ps1 -In <orez.png> -Out subject-prvouka.png -Size 512 -Thr 242

# 3) POVINNE: uzavrene bile kapsy (misto mezi rameny vah, mezery v koruně stromu)
scripts\check-white-pockets.ps1 -Files subject-prvouka.png
```

Pak nahrát do bucketu `prvouka-images` pod klíč `subject-prvouka.png`
a `subject-matematika.png`. Klíč musí sedět přesně, jinak karta spadne na emoji.

⚠️ Karty používají `mix-blend-multiply` (`AnonStudentPage.tsx:340`), takže na bílém
podkladu vypadá i kresba s bílým pozadím správně — **to ale neznamená, že je v pořádku**.
Na zelené kartě splněného cvičení (`bg-emerald-50`) se bílá projeví. Průhledné pozadí je
proto povinné i tady.
