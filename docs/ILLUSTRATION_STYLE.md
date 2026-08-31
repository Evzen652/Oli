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

## 5. Zadání: avatary výběru role (čeká se na kresby)

Dnešní stav v `src/lib/roleImages.ts`: styl „Pixar 3D cartoon", generováno
**za běhu z cizí domény** přímo na přihlašovací stránce.

> Přepsat jen prompt v tom souboru **nestačí** — vyzkoušeno. Flux na 256 px
> zadání neudrží: ignoroval pohlaví, barvu vlasů i oblečení, přimaloval bílé
> tričko s nápisem a rámeček. Kresby musí vzniknout stejnou cestou jako
> těch 19 na landing page (Gemini).

**Nejdůležitější krok: přiložit referenci.** Do Gemini dát jako vzor stylu
`src/assets/landing-propojeni-s-rodicem.png` — je na ní jak maminka, tak
chlapec, tedy obě postavy i celý rukopis najednou.

**Formát:** čtverec, portrét po ramena (dlaždice je 64 × 64 px, celá postava
by se v ní ztratila), **čistě bílé pozadí** s okrajem kolem postavy.
Vyříznutí pozadí pak udělá `scripts/fix-landing-alpha.ps1` — ručně
neodstraňovat, prokousalo by to pleť.

### Prompt — rodič

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
