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
