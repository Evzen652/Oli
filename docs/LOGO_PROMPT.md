# Prompt pro nové logo Oli (Gemini)

> ## ⛔ VÝSLEDEK: vyzkoušeno 2026-09-01 a ZAMÍTNUTO
>
> Gemini zadání splnil přesně — oranžové peří `#F97316`, teal šála, tmavé brýle,
> žádný zdvižený prst, obě varianty na jednom listu, čisté okraje. **Přesto to
> nefungovalo** a uživatel to zastavil hned po nasazení.
>
> **Poučení, které stálo jedno kolo:** celooranžová sova je monotónní. Dosavadní
> kresba drží pohromadě kontrastem hnědého peří proti krémovému obličeji;
> po přebarvení do jednoho odstínu ta stavba zmizela a zbyla oranžová hmota.
> Naměřené kontrasty seděly (viz tabulka níže) — problém byl v **kompozici barev**,
> ne v jejich jasu. Měření hlídá čitelnost, ne to, jestli kresba drží pohromadě.
>
> **Nasazeno místo toho:** původní hnědá sova na knihách + nápis `#9A3412`.
> Skutečná příčina původní nespokojenosti totiž nebyla sova, ale **nápis** —
> `#F97316` se v kresbě nevyskytuje vůbec (peří je `#C07848` / `#A86030`), takže
> vedle ní vyčnívala. Levnější oprava: přebarvit tři znaky textu, ne celou kresbu.
>
> Prompt níže zůstává použitelný, kdyby se k překreslení někdy vracelo — ale
> **s vědomím, že jednobarevná sova je slepá ulička**.

Stav k 2026-09-01. Navazuje na [`ILLUSTRATION_STYLE.md`](ILLUSTRATION_STYLE.md) §2 —
technická pravidla pro vyříznutí pozadí platí i pro logo.

---

# Kolo 2 — oprava jen zdviženého prstu (aktuální zadání)

Po zamítnutí přebarvení zbyla jediná otevřená výhrada: **zdvižený prst**.
Poučení z kola 1 je jasné — **neměnit nic jiného**. Barvy, brýle, šála, knihy
i kompozice zůstávají přesně jak jsou; jde o jednu lokální opravu, ne o nové logo.

**Přiložit:** `D:\weigle\plocha\Oli_ILUSTRACE\Gemini_Generated_Image_hehj44hehj44hehj.jpg`
(sova na knihách — přesně ta, co je teď nasazená jako logo).

> Edit the attached illustration. Keep EVERYTHING else exactly as it is: the same owl,
> the same brown and cream colours, the same black glasses, the same red neck scarf, the
> same stack of books, the same line style, the same pose, the same framing and the same
> size. This is a small local fix, not a redesign.
>
> Change one single thing: remove the raised arm and the pointing human hand on the left
> side completely. Owls do not have hands. In its place draw the owl's left wing — brown,
> with the same feather shapes, the same colour and the same outline weight as the wing
> already on the right side of the body — resting relaxed against the body and angled
> slightly downward, so that the two wings read as a matching pair.
>
> Do not change the face, the expression, the glasses, the scarf, the feet or the books.
> Do not change any colour or shade. Do not add anything new. Do not zoom, crop or reframe.
> Keep the pure flat white background with a clear margin of empty white on all four
> edges. No text, no letters, no watermark, no border, no drop shadow.

**Proč je to formulované jako „edit", ne jako nový prompt:** při volném generování
model překreslí i to, co měnit neměl — přesně tak vznikla v kole 1 jednobarevná sova.
Věty „keep EVERYTHING else exactly as it is" a „this is a small local fix, not a redesign"
tam nejsou zdvořilost, ale pojistka.

**Až obrázek přijde**, ověřím strojově, že se nezměnilo víc, než mělo: porovnám
histogram barev proti současné kresbě. Když se peří nebo obličej posunou o víc než
pár procent, model překreslil celek a jde se na druhý pokus.

✅ **Hotovo 2026-09-01** (`Gemini_Generated_Image_bcjdufbcjdufbcjd.jpg`). Ověřeno strojově:
paleta se posunula o 6,2 %, krycí plocha klesla o 4,1 % — sedí na odebranou ruku, ne na
překreslení. (Jemné dělení histogramu hlásilo 14,6 %, ale byly to sousední přihrádky
`#1890A8`→`#189090` a `#D83048`→`#D81848`, tedy artefakt kvantizace, ne změna barev.
Skript: `scratchpad/compare-hist.ps1`, přepínač `-Q`.)

---

# Kolo 3 — pózy pro jednotlivá místa v aplikaci

Sova je dnes ve **všech devíti místech stejná**. Cílem je odlišit ji podle kontextu.
Níže je mapa skutečných výskytů v kódu a k ní čtyři samostatné prompty.

| póza | kde se použije | velikost |
|---|---|---|
| **základní** (na knihách) — hotová | `LandingNav`, `SessionView`, `GradeSelect` = logo | 36 / 48 / 80 px |
| **a) pozdrav** | `Onboarding` „Ahoj! Já jsem Oli.", `ChildHomePage` uvítací lišta | 80 / 56 px |
| **b) tip dne** | `ChildHomePage` blok „Tip dne" | 48 px |
| **c) přehled výsledků** | `ParentDashboard` uvítací lišta, `Report` hlavička | 56 / 40 px |
| **d) zadání úkolu** | `AssignmentCreator` záhlaví | 64 px |

**Ke každému promptu přilož `Gemini_Generated_Image_bcjdufbcjdufbcjd.jpg`** — opravenou sovu
bez prstu. Ne starší verzi, jinak se prst vrátí.

⚠️ **Riziko, se kterým je potřeba počítat:** `ILLUSTRATION_STYLE.md` §5 říká, že postavy se
mají generovat **na jednom listu**, protože samostatné běhy rozejdou sytost i tloušťku
kontury. Tady jdeme proti tomu — čtyři samostatná generování. Je to únosné, protože
předlohou je hotová plochá kresba (ne popis stylu), ale **každou pózu je nutné po návratu
porovnat** `compare-hist.ps1` proti předloze. Nad ~8 % posunu palety je to jiná sova.

**Společná pravidla ve všech čtyřech promptech** (nejsou to ozdoby):
- „no human hands or fingers — wings only" — lidská ruka na sově nás stála dvě kola
- „no raised index finger, nothing lecturing" — původní výhrada
- žádné knihy u póz a–d; knihy zůstávají poznávacím znakem **loga**, aby se pózy nepletly
- bílé ploché pozadí + okraj kolem dokola — jinak nejde vyříznout (`ILLUSTRATION_STYLE` §2)
- rekvizity velké a jednoduché: **b) i c) se renderují na 48 a 40 px**, drobnost tam zanikne
- **duhovky výslovně `DARK RED`** — v póze a) je model překreslil na hnědé (zjištěno až detailem;
  při 56–80 px je prstének 1–2 px, takže to není vidět — ale v dalších pózách ať se to neopakuje)

## a) Pozdrav

> Edit the attached illustration. Keep the SAME owl character exactly as it is: the same
> brown and cream colours, the same black glasses, the same red neck scarf, the same amber
> beak and feet, the same DARK RED iris rings around the pupils, the same line style
> and the same level of detail.
>
> Change the pose only: the owl now stands on the ground, waving hello with one wing raised
> beside its head at shoulder height, the other wing relaxed against its body. Head slightly
> tilted, warm open friendly smile, looking straight at the viewer. It should read as
> "hello, nice to meet you".
>
> Remove the stack of books entirely — the owl stands on its own feet. No human hands or
> fingers of any kind, wings only, with feather tips. No raised index finger, no pointing,
> nothing lecturing or authoritative. Nothing else added.
>
> Single figure centred, pure flat white background, a clear margin of empty white on all
> four edges, nothing touching any edge. No text, no letters, no watermark, no border,
> no drop shadow. Portrait format.

## b) Tip dne

> Edit the attached illustration. Keep the SAME owl character exactly as it is: the same
> brown and cream colours, the same black glasses, the same red neck scarf, the same amber
> beak and feet, the same DARK RED iris rings around the pupils, the same line style
> and the same level of detail.
>
> Change the pose only: the owl is winking — one eye closed behind the glasses, the other
> open — head tilted to one side, one wing resting flat on its own chest, the other relaxed
> at its side. Cheerful, warm, slightly playful, as if sharing a friendly tip with a friend.
>
> Remove the stack of books entirely — the owl stands on its own feet. No human hands or
> fingers of any kind, wings only. No raised index finger, no pointing, no light bulb, no
> speech bubble, nothing lecturing. Nothing else added.
>
> Make the wink clearly visible and the shapes bold and simple — this will be displayed
> very small. Single figure centred, pure flat white background, a clear margin of empty
> white on all four edges, nothing touching any edge. No text, no letters, no watermark,
> no border, no drop shadow. Portrait format.

## c) Přehled výsledků

> Edit the attached illustration. Keep the SAME owl character exactly as it is: the same
> brown and cream colours, the same black glasses, the same red neck scarf, the same amber
> beak and feet, the same DARK RED iris rings around the pupils, the same line style
> and the same level of detail.
>
> Change the pose only: the owl stands holding up a simple rectangular chart board in one
> wing, at chest height, tilted slightly towards the viewer. On the board is one bold rising
> line going up to the right, in the same teal as the book in the original image. The other
> wing rests at its side. Calm, confident, reassuring expression, looking at the viewer.
>
> Remove the stack of books entirely — the owl stands on its own feet. No human hands or
> fingers of any kind, wings only. No raised index finger, no pointing, nothing lecturing.
> Nothing else added.
>
> Keep the chart board large and very simple — just the frame and one thick line, no
> numbers, no grid, no small marks — because this will be displayed very small. The board
> must not be white or pale grey: give it a light cream fill like the owl's chest. Single
> figure centred, pure flat white background, a clear margin of empty white on all four
> edges, nothing touching any edge. No text, no letters, no numbers, no watermark, no
> border, no drop shadow. Portrait format.

### ⛔ c) — první pokus zamítnut, opakovat s dodatky (2026-09-02)

`Gemini_Generated_Image_w061v4w061v4w061.jpg` vypadá na první pohled dobře — křídlo, ne ruka,
cedule je velká a jednoduchá. **Ale je to jiná sova**, a to měřitelně:

| co | předloha / ostatní pózy | c) první pokus |
|---|---|---|
| šířka brýlí v boxu 96 px | 31–33 px | **42 px** (o třetinu větší hlava) |
| peří | `#C88050` | `#B06840` (tmavší) |
| brýle | `#000000` | `#081820` (namodralé) |
| šála | `#D82840` | `#C03038` (kalnější) |
| duhovky | tmavě červené | **jantarové, s víčky** |

Vedle ostatních póz to čte jako jiná postava. Je to přesně to riziko, které
`ILLUSTRATION_STYLE.md` §5 popisuje u samostatných generování.

**Prompt na druhý pokus** — k původnímu zadání c) přidej na začátek:

> IMPORTANT: match the attached reference exactly. Do NOT enlarge the head — keep the head
> the same size relative to the body as in the reference. Keep the medium warm brown plumage
> of the reference, do not darken it. Keep the glasses frame PURE BLACK, not navy or blue.
> Keep the eyes large and round with DARK RED iris rings and black pupils — NOT amber, NOT
> yellow, no heavy eyelids, no sleepy expression. Same eye shape as the reference.

## d) Zadání úkolu

> Edit the attached illustration. Keep the SAME owl character exactly as it is: the same
> brown and cream colours, the same black glasses, the same red neck scarf, the same amber
> beak and feet, the same DARK RED iris rings around the pupils, the same line style
> and the same level of detail.
>
> Change the pose only: the owl stands holding a large yellow pencil upright in one wing,
> resting against its shoulder, the other wing relaxed at its side. Attentive, willing,
> ready-to-start expression, looking at the viewer.
>
> Remove the stack of books entirely — the owl stands on its own feet. No human hands or
> fingers of any kind, the wing simply holds the pencil against the body. No raised index
> finger, no pointing, no writing gesture, nothing lecturing. Nothing else added.
>
> Keep the pencil large, thick and simple so it is recognisable when small. Single figure
> centred, pure flat white background, a clear margin of empty white on all four edges,
> nothing touching any edge. No text, no letters, no watermark, no border, no drop shadow.
> Portrait format.

---

## Co se mění proti podkladům v `D:\weigle\plocha\Oli_ILUSTRACE`

1. **Značková oranžová.** Sova je dnes béžovohnědá, nápis „Oli" je `#F97316`. Sjednotit.
2. **Pryč se zdviženým prstem.** Není to ani křídlo — je to **lidská ruka s prsty**.
   Kombinace „ukazovák nahoru + brýle + kniha" čte jako kárající učitel, ne jako průvodce.

## Co k promptu přiložit

Původní ilustraci **`Gemini_Generated_Image_cos1iucos1iucos1.jpg`** (celá stojící sova).
Drží rukopis — tloušťku kontury, tvar brýlí i proporce hlavy — a o ten nechceme přijít.

---

## Prompt (anglicky, ke zkopírování)

> Flat vector children's-app mascot illustration, in exactly the same drawing style as the
> attached reference image: clean even outlines, simple flat colour shapes, soft rounded
> forms, no gradients, no 3D shading, no texture.
>
> The same owl character as in the reference, with these changes:
>
> COLOUR — recolour the plumage to a warm brand orange. Body and wings saturated orange
> `#F97316`. Belly, face disc and inner ear a lighter orange `#FDBA74`. Wing tips, tail and
> shading a deeper burnt orange `#C2410C`. Beak and feet golden amber `#FBBF24`. Keep the
> chunky dark navy `#1E293B` glasses exactly as in the reference — they are the most
> recognisable part of the mark. Neck scarf deep teal `#115E59`.
>
> POSE — standing upright, facing the viewer, both wings relaxed down at its sides, one
> wing tip turned slightly outward in a calm, welcoming way. Head very slightly tilted.
> Warm friendly smile. Relaxed and approachable, like a friend saying hello.
>
> ABSOLUTELY NOT: no raised index finger, no pointing, no human hands or fingers of any kind
> — wings only, with feather tips. No graduation cap or mortarboard, no pointer stick, no
> book, no blackboard, no teaching props. Nothing scolding, lecturing or authoritative.
>
> COMPOSITION — one sheet, landscape 2:1. LEFT: the full standing owl, head to feet. RIGHT:
> a large head-and-shoulders close-up of the same owl, filling most of its half of the sheet.
> Same character, same colours, same line weight in both.
>
> BACKGROUND — pure flat white across the whole sheet. Both figures fully inside the frame
> with a wide band of empty white paper around all four edges and between them; nothing may
> touch or run off any edge. No white or near-white areas anywhere inside the drawing — the
> orange body must form the outer silhouette all the way around. Small white catchlights in
> the eyes are fine. No text, no letters, no watermark, no border, no frame, no drop shadow.

---

## Proč je tam každý požadavek

Nejsou to ozdoby — každý bod odpovídá naměřenému problému:

| požadavek | důvod |
|---|---|
| tři jasové hladiny (`#F97316` / `#FDBA74` / `#C2410C`) | logo se renderuje i v boxu **36 px** (`LandingNav`). Jednolitá oranžová se tam slije ve skvrnu. Naměřený kontrast světlého břicha vůči tělu je 1,66 — těsně nad hranicí rozeznatelnosti. |
| brýle `#1E293B` beze změny | kontrast **5,22** vůči tělu, 14,6 vůči bílé. Jediný prvek, který drží čitelnost na nejmenší velikosti. Proto se nesmí zesvětlit. |
| šála `#115E59`, ne původní karmín | karmín má vůči oranžové kontrast jen **1,68**, teal-600 dokonce **1,34** — jiný odstín, ale skoro stejný **jas**, takže na 36 px splyne. `#115E59` dává 2,71 a zároveň chladný protiklad k teplé značce. Celooranžová varianta: `#7C2D12` (3,34). |
| „no white areas inside" | pozadí se vyřezává flood-fillem od okrajů. Krémový obličej původní sovy má jas 227 — prošel o 17 stupňů. Světlejší odstín by se prokousal a v obličeji vznikla díra. Viz `ILLUSTRATION_STYLE.md` §2.3. |
| „orange body forms the outer silhouette" | světlé břicho má vůči bílé kontrast **1,69**. Kdyby sahalo až k obrysu, silueta se na bílé stránce rozpadne. |
| „nothing may touch any edge" | u hlavy z prvního kola šála přetékala přes spodní okraj a musela se ručně dořezávat. |
| jeden list, obě varianty | doložená zkušenost z avatarů rolí (`ILLUSTRATION_STYLE.md` §5): dvě samostatná generování rozejdou sytost i tloušťku kontury. |
| levá celá / pravá hlava | **logo = celá sova, favikona = hlava.** Dvě různá použití, dvě různá ořezání. |

## Až obrázek přijde

```powershell
# 1) logo — prirozeny pomer stran (box h-20 w-20 + object-contain vyplni vysku)
scripts\make-logo.ps1 -In <list.jpg> -Out src\assets\oli-owl.png -Size 320 -Square $false

# 2) favikona — ctverec
scripts\make-logo.ps1 -In <list.jpg> -Out public\favicon.png -Size 256
```

Skript hlásí `obsah`, `poměr` a počet krycích bílých pixelů uvnitř kresby. Když je bílých
pixelů řádově víc než pár tisíc (odlesky v očích), něco se prokouslo — zvyš `-Thr`.

**Když Gemini oranžovou netrefí přesně**, není potřeba generovat znovu:
`scripts/tint-illustration.ps1` umí plochu přebarvit na konkrétní hex.
