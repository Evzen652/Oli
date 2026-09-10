# Ilustrace — rukopis a technická pravidla

Závazné pro každou novou kresbu v aplikaci. Vzniklo z oprav 19 akvarelových
ilustrací na landing page (2026-08-31) — každý bod dole už jednou něco rozbil.

---

## 1. Rukopis

Landing page má **akvarel s inkoustovou konturou**, dětská knížka:

- jemná ručně tažená kontura (uhel / hnědočerný inkoust), mírně nepravidelná
- akvarelové laznění mokrým do mokrého, viditelná struktura hrubého papíru
- tlumená pastelová paleta: korálová, šalvějová a mátová zelená, hořčicová
  žlutá, zaprášená petrolejová, teplá okrová
- pod objektem měkká šedomodrá kaluž stínu
- žádný rámeček, žádný text

**Postavy jsou opakující se, ne pokaždé jiné:**

| postava | vzhled |
|---|---|
| chlapec (~8 let) | rozcuchané světle hnědé vlasy, růžové tváře, **korálová mikina**, olivové manšestráky, oranžové tenisky |
| maminka (~35) | polodlouhé kaštanové vlasy, **mátový oversize svetr**, džíny, oranžové tenisky |

> ⚠️ V `supabase/functions/generate-prvouka-images` je pořád starší styl
> **„3D Pixar illustration"** (obrázky témat prvouky). Nové kresby do něj
> nepatří — vedle akvarelů vyčnívají. Přesně tohle byl problém u avatarů
> výběru role.

---

## 2. Technická pravidla pro prompt

Kresby se vyřezávají z bílého papíru (průhledné PNG). Automat hledá pozadí
**flood-fillem od okrajů**, ne podle jasu. Z toho plyne:

1. **Pozadí čistě bílé a ploché.** Žádný přechod, žádný stín u okraje.
2. **Objekt se nesmí dotýkat okraje.** Kolem dokola nech bílý okraj, jinak se
   výplň pozadí nedostane okolo objektu.
3. **Žádná bílá ani skoro bílá plocha uvnitř kresby.** Bílé tričko, bílý papír,
   bílé sklo. Buď se prokoušou (vzniknou díry), nebo zůstanou jako krycí bílý
   flek v barevné kartě. Reálné případy: deska knihy zmizela, výplň
   přesýpacích hodin zůstala bílá, čočka lupy byla bílý kotouč.
4. **Pleť sytě teplá, ne bledá.** Světlá akvarelová pleť má jas těsně pod
   prahem a starý dewhite ji prokousal — obličeje pak prosvítaly pozadím karty.
5. **Bez propletených děr.** Svlaky opěradla, ucho hrnku, mezery mezi končetinou
   a tělem — každá uzavřená díra je ruční rozhodnutí, jestli je pozadí, nebo
   kresba. Portrét po ramena je tím pádem bezpečnější než celá scéna.

   > ⚠️ **Tohle se NEDÁ zkontrolovat okem — musí se to změřit.**
   > Na bílém náhledu se bílý flek neprojeví vůbec a na barevném podkladu ho
   > při velikosti dlaždice oko přehlédne. U počítadla (`grade-2.png`) takhle
   > prošlo **11 449 krycích bílých pixelů, tedy 25 % kresby** — mezery mezi
   > řadami kuliček — přestože složení na sytou oranžovou vypadalo v pořádku
   > a bylo odškrtnuté jako ověřené.
   >
   > ```powershell
   > scripts\check-white-pockets.ps1 -Files (Get-ChildItem src\assets\*.png).FullName
   > ```
   >
   > Podíl nad ~1 % krycí plochy = prověřit. Skript nic nemaže, jen hlásí —
   > rozhodnout, jestli je bílá pozadí (mezery v počítadle) nebo kresba
   > (stránky knihy), musí člověk podle bbox. Oprava pak přes
   > `fix-landing-alpha.ps1 -ScanOnly` → `-ClearIds`.
6. **Jeden objekt uprostřed, nic navíc po straně.** Prázdná židle vedle
   chlapce udělala kompozici 1,38 : 1, postava se scvrkla na třetinu šířky a
   karta působila nevyváženě vedle ostatních.
7. **Žádný text, písmena, vodoznak.**

## 3. Když se pozadí nevyřezává

Obrázky mimo `DewhiteImg` (např. avatary výběru role v `src/lib/roleImages.ts`)
mají mít **pozadí v odstínu dlaždice**, ne bílé — jinak vznikne bílý čtverec
v barevné dlaždici.

**Dewhite v prohlížeči na ně nepouštěj.** Pracuje podle jasu kdekoli v kresbě,
takže sežere pleť a odlesky (naměřeno 11 % krycích pixelů). Proto mají landing
obrázky `preprocessed`.

## 4. Než kresbu nasadíš

- Slož ji na **skutečnou barvu karty**, ne na bílou — na bílé nejsou vidět ani
  prosvítající obličeje, ani zbylé bílé fleky.
  `scripts/fix-landing-alpha.ps1 -In obr.png -ScanOnly` vypíše uzavřené kapsy.
- Opravy alfy: `scripts/fix-landing-alpha.ps1`, přebarvení plochy:
  `scripts/tint-illustration.ps1`. Oba mají v hlavičce postup.
- **Pixely čti přes `LockBits`.** `Graphics.DrawImage` premultiplikuje a u
  alfa 0 vynuluje RGB, tedy zničí data, která k opravě potřebuješ.
- Ilustrace na landing page **neměň bez výslovného zadání.**

---

## 5. Avatary výběru role — HOTOVO (2026-08-31)

`src/assets/role-rodic.png` + `role-zak.png`, lokální assety, 256 × 256.
Dřív se generovaly za běhu z `image.pollinations.ai` ve stylu „Pixar 3D cartoon".

> Přepsat jen prompt u té runtime služby **nestačilo** — vyzkoušeno a zavrženo.
> Flux na 256 px zadání neudržel: ignoroval pohlaví, barvu vlasů i oblečení,
> přimaloval bílé tričko s nápisem a rámeček. Kresby musí vzniknout stejnou
> cestou jako těch 19 na landing page, tedy v **Gemini**.

**Klíčové kroky, které rozhodly o výsledku:**

1. **Přiložit referenci stylu** — `src/assets/landing-propojeni-s-rodicem.png`
   (je na ní maminka i chlapec, tedy obě postavy a rukopis najednou).
2. **Obě postavy na jednom listu**, ne dvě samostatná generování. Jinak se
   rozejde sytost, tloušťka kontury i odstín pleti.
3. **Výřez podle velikosti hlavy, ne podle obsahu.** Model hlavy nesrovnal ani
   když si o to prompt řekl — maminčina byla 330 px, chlapcova 270 px, tedy
   o 22 % menší. Prosté rozříznutí listu by dalo v dlaždicích viditelně různě
   velké obličeje.

**Reprodukce** (skript dá bit po bitu totéž, co je nasazené):

```powershell
scripts\split-portrait-sheet.ps1 -In <list.jpg> -Measure   # zmerit hlavy
scripts\split-portrait-sheet.ps1 -In <list.jpg> -OutDir out `
  -Subjects "role-rodic:366:79:330;role-zak:1110:109:270" -Size 256
scripts\fix-landing-alpha.ps1 -In out\role-rodic.png -Out src\assets\role-rodic.png
```

**Velikost:** dlaždice je 64 px, na 3× retinu stačí 192 px. 256 px dává 4×
rezervu a soubor ~107 kB; 512 px je zbytečných ~410 kB na dlaždici.

### Prompt — dvojice na jednom listu (použitý)

> Watercolour and ink children's picture-book illustration, in exactly the style
> of the attached reference image: hand-painted on rough cold-pressed paper, fine
> uneven ink contour line, transparent pastel washes, visible paper grain, muted
> pastel palette.
>
> Two separate head-and-shoulders portraits side by side on one sheet, NOT
> interacting, NOT touching, with a wide band of empty white paper between them
> and around all four edges.
>
> LEFT portrait: the same mother character as in the reference — early thirties,
> shoulder-length chestnut brown hair, oversized mint green knitted sweater, rosy
> cheeks, warm calm smile, facing the viewer.
>
> RIGHT portrait: the same boy character as in the reference — about eight years
> old, tousled light brown hair, round rosy cheeks, coral red hoodie, cheerful
> open smile, facing the viewer.
>
> Both heads exactly the same size and at the same eye level. Pure flat white
> background across the whole sheet, nothing else in the frame. No white or pale
> grey clothing, no text, no letters, no border, no frame, no drop shadow, no
> vignette. Wide 2:1 landscape format.

### Past: „maminka" vyšla jako dospívající dívka (vyřešeno napodruhé)

První pokus dal na kartě „Jsem rodič" obličej, který čte jako starší sestra.
Druhý pokus s opravou níže už sedí — nasazené soubory jsou z něj.
Souřadnice hlav pro reprodukci: `role-rodic:368:78:330;role-zak:1106:109:270`.

Dvě příčiny, obě se budou opakovat:

1. **Reference sama je mladistvá.** Na `landing-propojeni-s-rodicem.png` čte
   maminka jako dospělá hlavně proto, že je **větší než dítě vedle ní**. V
   portrétu po ramena měřítko zmizí a zbude mladá tvář. „Same character as in
   the reference" tedy dospělost NEPŘENESE — u obličeje se musí reference
   vědomě přebít.
2. **„Rosy cheeks" je dětský signál.** Napsané u obou postav; u dospělé
   vyrobilo velké kulaté tváře. U rodiče vynechat, stejně jako pihy.

Opravený popis dospělé postavy (zbytek promptu pro dvojici zůstává):

> LEFT portrait: a woman aged about 38, clearly an adult — longer oval face,
> defined cheekbones and jawline, fine laugh lines at the corners of the eyes,
> eyes normally sized and set at the vertical midpoint of the head. NOT a teenager,
> NOT a young girl, no freckles, no big round blushed cheeks, no large childlike
> eyes. Shoulder-length chestnut brown hair as in the reference, oversized mint
> green knitted sweater as in the reference, warm calm smile, facing the viewer.

**Tip na čitelnost role:** dát mamince stejné **barevné puntíkované brýle**,
jaké jsou na `landing-prehled-pro-rodice.png` (karta „Přehled pro rodiče").
Brýle jsou srozumitelný signál dospělosti a zároveň propojí rodičovskou roli
napříč aplikací.

**Přegenerovat vždy celou dvojici**, ne jen jednu postavu — jinak se rozejde
rukopis. Chlapec z prvního pokusu je v pořádku, takže slouží jako kontrola:
když nový vyjde jinak, něco se v promptu rozjelo.

### Prompt — rodič (samostatně)

> Watercolour and ink children's picture-book illustration in exactly the style
> of the attached reference: hand-painted on rough cold-pressed paper, fine
> uneven ink contour line, transparent pastel washes, visible paper grain.
> The same mother character as in the reference — early thirties, shoulder-length
> chestnut brown hair, oversized mint green knitted sweater, rosy cheeks, warm
> calm smile, looking at the viewer. Head and shoulders only, centred, with a
> clear margin of empty paper on all four sides. Pure flat white background,
> nothing else in the frame. No white or pale grey clothing, no text, no letters,
> no border, no frame, no drop shadow. Square format.

### Prompt — žák

> Watercolour and ink children's picture-book illustration in exactly the style
> of the attached reference: hand-painted on rough cold-pressed paper, fine
> uneven ink contour line, transparent pastel washes, visible paper grain.
> The same boy character as in the reference — about eight years old, tousled
> light brown hair, round rosy cheeks, coral red hoodie, cheerful open smile,
> looking at the viewer. Head and shoulders only, centred, with a clear margin
> of empty paper on all four sides. Pure flat white background, nothing else in
> the frame. No white or pale grey clothing, no text, no letters, no border,
> no frame, no drop shadow. Square format.

Každý požadavek v promptech odpovídá jednomu bodu z §2 — nejsou to ozdoby.
Zvlášť „margin of empty paper on all four sides" a „no white clothing":
bez nich se pozadí nedá vyříznout a v kresbě vzniknou bílé díry.

---

## 6. Hlavička shrnutí sezení — HOTOVO (2026-09-10)

`src/assets/summary-done.png` + `summary-time-expired.png`, 256 × 256, ~90 kB.
Nahradily lucide `Trophy` a `Hourglass` v `SessionEndSummary.tsx`.

**Velikost:** zobrazuje se v 80 px, takže 256 px dá 3,2× rezervu. 512 px vyšlo
na 340 kB za ikonu — u buildu, který už nese 18,5 MB obrázků, to nemá co dělat.

**Reference stylu do promptu:** `src/assets/landing-male-kroky.png` — jediná
z devatenácti, která je předmětové zátiší, ne postava.

### Prompty (použité)

> Watercolour and ink children's picture-book illustration in exactly the style
> of the attached reference: hand-painted on rough cold-pressed paper, fine
> uneven ink contour line, transparent pastel washes wet-into-wet, visible paper
> grain, muted pastel palette.
>
> A single classic two-handled trophy cup standing on a small plinth, seen
> straight from the front, centred. The cup bowl is warm muted ochre and mustard
> brass, softly shaded, sitting on a warm brown wooden base. Two curved handles,
> one on each side. A soft grey-blue watercolour shadow puddle under the plinth.
>
> Muted and hand-painted, NOT shiny, NOT metallic, NOT glossy, no lens flare,
> no sparkles, no stars, no glow, no rays, no confetti. All highlights painted
> as pale ochre or cream washes — never white and never pale grey. No white or
> near-white areas anywhere inside the drawing.
>
> One single object in the frame, nothing beside it. Pure flat white background
> with a clear wide margin of empty white paper on all four sides. No engraved
> plate, no text, no letters, no numbers, no watermark, no border, no frame,
> no vignette, no drop shadow beyond the soft watercolour puddle. Square format.

Druhý stav je tentýž prompt s jiným předmětem:

> A single hourglass standing upright on a small wooden base, seen straight from
> the front, centred. Wooden frame in warm ochre, sand collected in the lower
> bulb in muted mustard yellow. The glass bulbs painted as pale sage and dusty
> teal washes, never white and never empty paper — no unpainted area inside the
> glass. A soft grey-blue watercolour shadow puddle under the base.

Tři klauzule, které nejsou ozdoba a odpovídají bodům z §2:

- **žádné jiskřičky, hvězdičky ani záře** — z téhle obrazovky se zrovna
  vyhazovaly `Sparkles`, protože znamenají „tohle psala AI";
- **odlesky v okrové, ne bílé** — bílý odlesk uprostřed kresby není díra,
  kterou by výplň od okrajů vzala, ale krycí flek (§2 bod 3);
- **žádná rytá cedulka** — na podstavec trofeje model skoro vždy dopíše text.

### Reprodukce

```powershell
# 1) ořez na obsah + čtverec
scripts\crop-square.ps1 -In <gemini.jpg> -Out done256.png -Size 256

# 2) sken uzavřených kapes — ČÍSLA ID PLATÍ JEN PRO TEN SOUBOR
scripts\fix-landing-alpha.ps1 -In done256.png -ScanOnly

# 3) vyříznutí pozadí + kapes, náhled na barvě banneru
scripts\fix-landing-alpha.ps1 -In done256.png -Out src\assets\summary-done.png `
  -ClearIds 9,8 -Preview nahled.png -PreviewBg "#FFF1E6"

# 4) kontrola
scripts\check-white-pockets.ps1 -Files src\assets\summary-done.png
```

Naměřeno: pohár 0,1 %, hodiny 0,1 % krycí bílé.

**Které kapsy se vyřezávaly.** U poháru dvě — mezery mezi uchy a tělem
(`id=9`, `id=8`), tedy přesně případ „ucho hrnku" z §2 bodu 5. U hodin taky
dvě — svislé mezery mezi dřevěnými sloupky a sklem (`id=0`, `id=1`). Bledé
plochy **uvnitř** skla jsou kresba, ne pozadí; nechat je tam byl záměr.

### ⚠️ `mix-blend-multiply` tady nefunguje — vyzkoušeno a zavrženo

Napoprvé se obrázek složil přes `mix-blend-multiply` na banner `#FFF1E6`
s úvahou, že násobení bílé tím pozadím dá zpátky přesně tu barvu, takže se
pozadí nemusí vyřezávat vůbec. **Na obrazovce z toho byl bílý čtverec.**

Obalový `div` v hlavičce má `relative z-10`, čímž zakládá vlastní stacking
context — element se pak násobí s prázdným pozadím toho kontextu, ne s bannerem.
U sovičky o kus níž (`bg-card`, bílá) tahle chyba nikdy nepraskla, protože bílá
na bílé není vidět. **Multiply tedy není doložený vzor téhle aplikace, jen
doposud neviditelná chyba** — nové kresby vyřezávej do alfy.

---

## 7. Předměty kolem sovičky — HOTOVO (2026-09-10)

`src/assets/drift-book.png`, `drift-star.png`, `drift-pencil.png`, 128 × 128,
21–31 kB. Vznášejí se kolem sovičky v `SessionEndSummary.tsx`, když skládá
hodnocení.

**Co tu bylo předtím.** Do `95edaf6` (3. 9.) kolem sovičky obíhala po kruhu tři
systémová emoji 📖 ✏️ ⭐ (`animate-orbit`, `-delayed-1`, `-delayed-2`). Emoji šla
pryč se všemi ostatními — každá platforma je kreslí jinak. CSS pro `orbit` se
tehdy smazalo taky, takže se dráha psala znovu.

**Obíhání, ne drift (2026-09-11).** Nejdřív se místo kruhu zkusil pomalý
drift (posun o pár pixelů, 13/16/19 s na dráhu) s úvahou, že kroužení na
3 vteřiny poutá pozornost. V praxi to nefungovalo: panel je na obrazovce jen
3 s, za tu dobu předmět urazil čtvrtinu dráhy a vypadal jako statický obrázek.
Uživatel chtěl kroužení zpátky. `oli-orbit` v `index.css`: poloměr 68 px,
4 s na otáčku, rozestup 120°, předmět se otáčí zpátky, aby držel orientaci.
Pod `prefers-reduced-motion: reduce` se dráha **pozastaví**, nezruší — jinak
by se všechny tři slily do středu přes sovičku.

Soubory se dál jmenují `drift-*.png`; název je historický.

### Generování

Jeden list, všechny tři objekty najednou — po samostatných bězích se rozejde
sytost i tloušťka kontury a vedle sebe je to vidět (viz §5). Prompt je stejný
jako v §6 s tímto tělem:

> Three separate small objects in a single row on one sheet, evenly spaced, NOT
> touching, NOT overlapping, with a wide band of empty white paper between them
> and around all four edges.
>
> LEFT: an open book seen from a slight angle, cover in muted sage green, pages
> in warm cream and pale ochre — never white.
> CENTRE: a simple five-pointed star, painted in muted mustard yellow and warm ochre.
> RIGHT: a wooden pencil lying diagonally, warm ochre wood, coral red painted
> body, muted graphite tip.
>
> All three drawn at the same scale and the same visual weight, each fitting
> inside an equally sized square. Simple bold shapes with very few interior
> details — they will be displayed very small.
>
> Flat floating objects: no shadow, no shadow puddle, no ground, no surface,
> nothing under them.

⚠️ **„no shadow puddle" je tu naopak než v §6.** U poháru je šedomodrá kaluž
povinná, protože stojí na podstavci. Tyhle se vznášejí, takže by je stín
přilepil k neexistující podlaze.

### Rozřezání listu

```powershell
# zmerit, jak velky je ktery predmet
scripts\split-object-row.ps1 -In <list.jpg> -OutDir out -Names "book","star","pencil" `
  -Threshold 225 -Measure

# rozrezat natesno ke kazdemu predmetu
scripts\split-object-row.ps1 -In <list.jpg> -OutDir out -Names "book","star","pencil" `
  -Threshold 225 -Size 128 -Tight
```

**`-Threshold 225`, ne výchozích 232.** List z Gemini nemá bílé pozadí, ale
krémový papír s viditelnou strukturou (~247,244,236). Na 232 se do bboxu
započítala zrnitost papíru a hvězda vyšla jako 475 × 425 px místo 221 × 215 —
tedy větší než kniha, což je nesmysl, který by se dál nesl do velikostí.

**`-Tight` je tu nutnost, ne volba.** Bez něj dostanou všechny tři společnou
stranu čtverce podle největšího z nich. Kniha pak vyplní 83 % dlaždice, tužka
66 % a hvězda 44 %, takže se při stejné CSS třídě vykreslí každá jinak velká —
napoprvé z toho byla hvězda o polovinu menší, než měla být. S `-Tight` řídí
poměry výhradně CSS (`w-9` / `w-6` / `w-9`).

**Bílá u knihy je v pořádku.** `check-white-pockets` hlásí 18,2 % krycí bílé
s bboxem uvnitř knihy — to je levá stránka, tedy kresba. Panel má bílou kartu,
takže není vidět; vyříznout ji by udělalo díru.
