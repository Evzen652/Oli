/**
 * Dějepis 6. ročník — Hominizace: od australopitéka po člověka rozumného (select_one).
 *
 * Dovednost: poznat vývojový stupeň člověka podle znaku (chůze po dvou,
 * vyráběný nástroj, oheň, pohřbívání, figurální umění) a vyvodit, co daný druh
 * uměl a co ještě ne. Chronologii úseků pravěku procvičuje dobaKamennaPeriodizace,
 * tady jde o vztah druh ↔ schopnost.
 *
 *  • L1 — od jednoho znaku k druhu („Který z těchto druhů…“), bez kombinací a negací.
 *  • L2 — od popisu nálezu nebo tlupy (2–3 znaky, i negace) k druhu.
 *  • L3 — (a) anachronismus: co se u druhu ještě NEMOHLO objevit;
 *         (b) příčina a důsledek / co nález prozrazuje, čtyři stejně stavěné možnosti.
 *
 * Chybový model (každý distraktor = jedna z nich):
 *  1. jméno bráno doslova („vzpřímený“ = první chodil vzpřímeně, „zručný“ = umí všechno),
 *  2. anachronismus (pravěk jako jedna doba, pozdější výdobytky starším druhům),
 *  3. lineární představa (neandrtálec = přímý předek, přisoudí mu malby a sošky),
 *  4. použil = vyrobil (australopitek jako výrobce nástrojů; obrácená příčina).
 *
 * Fakta v rozsahu učebnic 6. ročníku, formulovaná opatrně tam, kde je věda
 * dál než učebnice: prvenství v chůzi po dvou jen „z pěti druhů“, člověk
 * zručný jako „první pravidelný výrobce“ nástrojů, u pohřbívání bez prvenství,
 * neandrtálci se upírají jen malby zvířat a sošky (ne jakékoli značky), oheň
 * a odchod z Afriky vedle sebe, ne jako příčina a důsledek.
 *
 * Úlohy jsou deterministické: každá podoba otázky dá jednu úlohu
 * (L1 12, L2 15, L3 12 + 6), náhodné je jen pořadí možností.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice } from "./_shared";

type Druh = "A" | "H" | "E" | "N" | "S";

const NAZEV: Record<Druh, string> = {
  A: "Australopitek",
  H: "Člověk zručný",
  E: "Člověk vzpřímený",
  N: "Neandrtálec",
  S: "Člověk rozumný",
};

/** Co druh opravdu uměl — druhá půlka zpětné vazby u distraktoru. */
const CO_UMEL: Record<Druh, string> = {
  A: "Australopitek chodil po dvou, měl malý mozek a nástroje si pravidelně nevyráběl.",
  H: "Člověka zručného učebnice spojují s prvními pravidelně vyráběnými kamennými nástroji, oheň ale ještě neznal.",
  E: "Člověk vzpřímený jako první odešel z Afriky, naučil se používat oheň a vyráběl pěstní klín.",
  N: "Neandrtálec žil v Evropě v době ledové a pohřbíval mrtvé; malby zvířat ani sošky po něm nenacházíme.",
  S: "Člověk rozumný je dnešní člověk; lovci doby ledové malovali zvířata v jeskyních a lovci mamutů na Moravě vytvářeli sošky.",
};

interface Forma {
  q: string;
  klic: Druh;
  /** [druh, konkrétní chyba, kterou žák udělal — bez opakování faktu z CO_UMEL] */
  distr: [Druh, string][];
  hints: [string, string];
  proc: string;
}

function zForem(f: Forma): PracticeTask {
  return choice(
    f.q,
    NAZEV[f.klic],
    f.distr.map(([d, chyba]) => ({ value: NAZEV[d], why: `${chyba} ${CO_UMEL[d]}` })),
    { hints: f.hints, explanation: f.proc },
  );
}

// ── L1 — od jednoho znaku k druhu ────────────────────────────────────────
const L1: Forma[] = [
  {
    q: "Který z těchto druhů chodil po dvou jako první?",
    klic: "A",
    distr: [
      ["E", "Jméno mate: po dvou chodil už dávno před ním jiný druh. Člověk vzpřímený dostal jméno při objevu."],
      ["H", "Nástroje se vyrábějí volnýma rukama, takže po dvou se chodilo už před prvními výrobci nástrojů."],
      ["N", "Neandrtálec žil až velmi pozdě, chůzi po dvou zdědil po dávných předcích."],
    ],
    hints: [
      "Otázka se ptá, kdo z nabízených druhů chodil po dvou nejdřív. Nenech se zmást jménem druhu, které zní podobně jako slovo v otázce.",
      "Chůze po dvou je nejstarší ze znaků, které tu sledujeme: přišla dřív než výroba nástrojů, oheň, hroby i umění. Hledej proto nejstarší z nabízených druhů.",
    ],
    proc: "Australopitek je nejstarší z pěti druhů a už chodil po dvou, proto z nich chodil po dvou jako první. Pozdější druhy chůzi po dvou zdědily; jméno člověka vzpřímeného s ní nesouvisí.",
  },
  {
    q: "Který z těchto druhů měl nejmenší mozek?",
    klic: "A",
    distr: [
      ["H", "Mozek se ve vývoji zvětšoval a tento druh ho měl už větší než jeho předchůdce."],
      ["E", "Jméno o velikosti mozku nic neříká, tento druh měl mozek už mnohem větší."],
      ["N", "Neandrtálec měl mozek velký, podobně jako dnešní lidé."],
    ],
    hints: [
      "Mozek se ve vývoji člověka postupně zvětšoval. Malý mozek tedy ukazuje na začátek, nebo na konec vývoje?",
      "Seřaď si nabízené druhy od nejstaršího. Hledáš ten, který stojí úplně na začátku řady.",
    ],
    proc: "Nejmenší mozek měl australopitek, protože je nejstarší z pěti druhů a u pozdějších druhů se mozek postupně zvětšoval.",
  },
  {
    q: "Který z těchto druhů je v učebnicích znám jako první pravidelný výrobce kamenných nástrojů?",
    klic: "H",
    distr: [
      ["A", "Kámen nebo klacek, jak ho našel, možná použil, ale použít neznamená pravidelně vyrábět."],
      ["E", "Pěstní klín už vyráběl, jenže jednoduché nástroje uměl už jeho předchůdce."],
      ["N", "Nástroje vyráběl také, ale přišel až mnohem později."],
    ],
    hints: [
      "Rozliš dvě věci: kámen jen sebrat ze země, nebo ho sám upravovat. Otázka se ptá na to druhé.",
      "Starší druh kámen nanejvýš sebral, pozdější druhy už navazovaly na hotovou dovednost a vyráběly dokonalejší nástroje. Hledej druh přesně na tom předělu.",
    ],
    proc: "Člověk zručný je znám jako první pravidelný výrobce kamenných nástrojů, proto dostal jméno zručný. Kámen možná občas upravovali už jeho předkové, pravidelná výroba se ale spojuje s ním.",
  },
  {
    q: "Který z těchto druhů se jako první naučil používat oheň?",
    klic: "E",
    distr: [
      ["H", "Jméno „zručný“ neznamená, že uměl všechno."],
      ["A", "Pravěk nebyl jedna doba, kdy se všechno dělo najednou; nejstarší druh oheň neznal."],
      ["N", "Neandrtálec oheň znal, ale už před ním ho používal člověk vzpřímený, první tedy nebyl."],
    ],
    hints: [
      "Oheň je novinka, která přišla až po prvních kamenných nástrojích. Který druh navázal na jejich výrobce?",
      "Seřaď si druhy od nejstaršího a u každého se zeptej: znal už oheň? Hledáš ten první, u kterého odpověď zní ano.",
    ],
    proc: "Oheň se jako první naučil používat člověk vzpřímený, proto je to jeho novinka. Starší druhy oheň ještě neznaly, neandrtálec a člověk rozumný ho převzali.",
  },
  {
    q: "Který z těchto druhů jako první opustil Afriku a rozšířil se do Asie a Evropy?",
    klic: "E",
    distr: [
      ["A", "Nejstarší druh Afriku neopustil."],
      ["S", "Dnešní člověk se rozšířil po celém světě, ale až dlouho po jiném druhu."],
      ["N", "Neandrtálec už v Evropě žil, ale z Afriky poprvé odešli jeho dávní předci."],
    ],
    hints: [
      "Kolébkou lidstva je Afrika. Dva nejstarší z pěti druhů ji neopustily.",
      "Tento druh měl už dlouhé nohy a zvládal vytrvalou chůzi na velké vzdálenosti. Hledej druh, který přišel hned po prvních výrobcích kamenných nástrojů.",
    ],
    proc: "Z Afriky jako první odešel člověk vzpřímený, proto se jeho nálezy objevují i v Asii a Evropě. Starší druhy zůstaly v Africe, pozdější odcházely až po něm.",
  },
  {
    q: "Který z těchto druhů jako první vyráběl pěstní klín?",
    klic: "E",
    distr: [
      ["H", "Vyráběl jen jednoduše otlučené oblázky, pěstní klín je propracovanější."],
      ["A", "Použít kámen neznamená vyrobit pěstní klín, ten vyžadoval pečlivé otloukání z obou stran."],
      ["N", "Neandrtálec nástroje vyráběl, ale pěstní klín znal už jeho dávný předchůdce."],
    ],
    hints: [
      "Pěstní klín je kámen otlučený z obou stran do tvaru mandle. Je jednodušší, nebo složitější než první otlučené oblázky?",
      "Nejdřív přišly jednoduché otlučené oblázky, pěstní klín až u jejich nástupce. Hledej druh, který navázal na první výrobce nástrojů.",
    ],
    proc: "Pěstní klín jako první vyráběl člověk vzpřímený, protože navázal na jednoduché nástroje člověka zručného a zdokonalil je.",
  },
  {
    q: "Který z těchto druhů už pohřbíval své mrtvé?",
    klic: "N",
    distr: [
      ["A", "Hroby jsou pozdní novinka, nejstarší druh je nezanechal."],
      ["H", "Pravěk nebyl jedna doba — první výrobci nástrojů hroby nezanechali."],
      ["E", "Hroby po něm archeologové nenacházejí."],
    ],
    hints: [
      "Pohřbívání je jedna z posledních novinek pravěku. Ze čtyř nabízených druhů jen jeden žil dost pozdě.",
      "Pohřeb svědčí o tom, že tlupa přemýšlela o smrti. Hledej druh, který žil v Evropě v době ledové a jehož hroby archeologové našli.",
    ],
    proc: "Neandrtálec už mrtvé pohřbíval, proto je správnou odpovědí. Starší druhy hroby nezanechaly.",
  },
  {
    q: "Který z těchto druhů měl zavalité, silné tělo přizpůsobené chladu doby ledové?",
    klic: "N",
    distr: [
      ["A", "Nejstarší druh žil v teplé Africe a dobu ledovou v Evropě nezažil."],
      ["S", "Dobou ledovou také prošel, ale měl štíhlejší postavu."],
      ["E", "Tento druh byl vysoký a štíhlý, s dlouhýma nohama na vytrvalou chůzi."],
    ],
    hints: [
      "Zavalité tělo s krátkými končetinami ztrácí méně tepla. Který druh žil v Evropě v době ledové ještě před příchodem dnešních lidí?",
      "Vyřaď nejstarší druh z teplé Afriky i dnešní lidi. Ze zbylých hledej druh, jehož pozůstatky se našly i v moravských jeskyních Šipka a Kůlna.",
    ],
    proc: "Zavalité tělo měl neandrtálec, protože žil v Evropě v době ledové a podsaditá postava mu pomáhala udržet teplo.",
  },
  {
    q: "Který z těchto druhů potkali lidé našeho druhu po příchodu do Evropy?",
    klic: "N",
    distr: [
      ["E", "Tento druh žil v Evropě mnohem dřív a v době příchodu našich předků už tam nebyl."],
      ["A", "Nejstarší druh do Evropy vůbec nepřišel."],
      ["H", "První výrobci nástrojů Afriku neopustili a vymřeli dávno předtím."],
    ],
    hints: [
      "Setkat se mohou jen druhy, které žily na stejném místě ve stejné době. Kdo žil v Evropě těsně před příchodem našich předků?",
      "Pozor na představu jedné řady „jeskynní člověk → my“. Jeden z nabízených druhů nebyl naším předkem, ale sousedem, který nějakou dobu žil vedle nás.",
    ],
    proc: "Lidé našeho druhu potkali v Evropě neandrtálce, protože ten tam ještě žil v době jejich příchodu. Později vymřel.",
  },
  {
    q: "Po kterém z těchto druhů známe malby zvířat na stěnách jeskyní?",
    klic: "S",
    distr: [
      ["N", "Neandrtálec nebyl přímým předkem dnešních lidí."],
      ["E", "Malby zvířat jsou až úplně poslední novinka, starší druhy je nevytvářely."],
      ["H", "Pravěk nebyl jedna doba — první výrobci nástrojů ještě nemalovali."],
    ],
    hints: [
      "Umění je nejmladší ze všech znaků. Který z nabízených druhů přišel jako poslední?",
      "Malby zvířat na stěnách jeskyní, například v Lascaux nebo v Altamiře, vytvořili lovci z doby ledové. Rozmysli si, ke kterému druhu patřili a jestli jde o druh, který žije dodnes.",
    ],
    proc: "Malby zvířat v jeskyních známe od člověka rozumného, protože takové umění je nejmladší novinka pravěku. Po starších druzích ani po neandrtálci malby zvířat nenacházíme.",
  },
  {
    q: "Který z těchto druhů vytvářel drobné sošky zvířat a žen?",
    klic: "S",
    distr: [
      ["N", "Neandrtálec nebyl přímým předkem lovců mamutů, kteří sošky vytvářeli."],
      ["E", "Umění je až poslední novinka, tento druh sošky nevytvářel."],
      ["H", "První výrobci nástrojů ještě nic nezdobili ani nevyřezávali."],
    ],
    hints: [
      "Soška není nástroj k lovu, ale umělecké dílo. Umění patří k nejmladším znakům vývoje.",
      "Vzpomeň si na sošky lovců mamutů z Moravy, třeba Věstonickou venuši z pálené hlíny nebo řezby z mamutoviny z Předmostí a Pavlova. Ke kterému druhu tito lovci patřili?",
    ],
    proc: "Sošky vytvářeli lovci mamutů, tedy člověk rozumný, protože sošky zvířat a žen známe až od tohoto druhu. Neandrtálec žil v Evropě před ním, ale sošky po něm nenacházíme.",
  },
  {
    q: "Ke kterému druhu ve vývoji člověka patříme my, dnešní lidé?",
    klic: "S",
    distr: [
      ["N", "Neandrtálec žil souběžně s našimi předky, dnešní lidé nepocházejí přímo z něj."],
      ["E", "Tento druh žil dávno před námi a vymřel."],
      ["H", "Tento druh žil na začátku vývoje a dávno vymřel."],
    ],
    hints: [
      "Dnešní lidé stojí na úplném konci vývoje. Který z nabízených druhů žil jako poslední?",
      "Zeptej se u každé možnosti, jestli druh ještě žije, nebo vymřel. Pozor na představu jedné řady „jeskynní lidé → my“: ne každý pozdní druh je náš přímý předek.",
    ],
    proc: "Dnešní lidé patří k druhu člověk rozumný, protože je to jediný druh člověka, který dosud žije. Ostatní druhy vymřely, neandrtálec žil souběžně s našimi předky.",
  },
];

// ── L2 — od nálezu nebo popisu tlupy k druhu ─────────────────────────────
const L2: Forma[] = [
  {
    q: "Archeologové našli v Africe kostru malého tvora s mozkem jen o málo větším, než má šimpanz. Podle tvaru pánve chodil po dvou. Kdo to byl?",
    klic: "A",
    distr: [
      ["H", "Tento druh měl mozek už znatelně větší."],
      ["E", "Jméno mate: po dvou chodil i starší druh a tento už měl mozek mnohem větší."],
      ["N", "Neandrtálec nežil v Africe a měl velký mozek."],
    ],
    hints: [
      "Nález má dva znaky: malý mozek a chůzi po dvou. Druh musí sedět na oba.",
      "Mozek se ve vývoji postupně zvětšoval. Hledej druh, který už chodil po dvou, ale mozek měl ještě skoro stejný jako lidoopi.",
    ],
    proc: "Kostra patří australopitékovi, protože chodil po dvou a mozek měl jen o málo větší než šimpanz. Pozdější druhy měly mozek větší.",
  },
  {
    q: "Archeologové našli v Africe kosti zvířat a vedle nich ostře otlučené kameny, ale žádné stopy ohně. Kdo tu nejspíš tábořil?",
    klic: "H",
    distr: [
      ["A", "Kámen nanejvýš sebral, jak ho našel; ostře otlučené kameny ukazují na pravidelnou výrobu."],
      ["E", "Nástroje vyráběl také, ale nález bez ohně lépe sedí na staršího výrobce nástrojů."],
      ["S", "Nález jednoduchých kamenů bez ohně lépe sedí na mnohem starší druh."],
    ],
    hints: [
      "Otlučený kámen je vyrobený nástroj. Napovídá ale i to, co se nenašlo.",
      "Najdi druh, který už kámen opracovával, ale oheň ještě neovládal. Výroba nástrojů přišla dřív než oheň, takže hledáš úsek mezi těmito dvěma novinkami.",
    ],
    proc: "Nejspíš tu tábořil člověk zručný, protože už otloukal kameny do ostré hrany, ale oheň ještě neznal.",
  },
  {
    q: "Archeologové našli stopy ohně a pěstní klín, ale žádné kresby ani hroby. Kdo tu nejspíš žil?",
    klic: "E",
    distr: [
      ["N", "V nálezu není nic, co by ukazovalo až na tento pozdější druh; všechno sedí na staršího."],
      ["H", "Jméno „zručný“ neznamená, že uměl všechno — pěstní klín tu ukazuje na jeho nástupce."],
      ["S", "V nálezu není nic, co by ukazovalo až na nejmladší druh."],
    ],
    hints: [
      "Všimni si, co v nálezu chybí: kresby a hroby. Chybějící věc sama nic nedokazuje, ale napovídá.",
      "Stopy ohně a pěstní klín vymezují druh zdola, chybějící hroby a kresby shora. Hledej druh, který oheň už znal, ale mrtvé ještě nepohřbíval.",
    ],
    proc: "Nejspíš tu žil člověk vzpřímený, protože znal oheň a pěstní klín a nic v nálezu neukazuje na pozdější druh.",
  },
  {
    q: "V moravské jeskyni Šipka archeologové našli pozůstatky lidí z doby ledové, kteří tu žili ještě před lovci mamutů. Kdo to byl?",
    klic: "N",
    distr: [
      ["A", "Nejstarší druh do Evropy nedošel."],
      ["S", "Lovci mamutů patřili k tomuto druhu, nález je ale starší než oni."],
      ["E", "Do Evropy přišel mnohem dřív. Kosti z doby ledové v moravských jeskyních patří až neandrtálcům."],
    ],
    hints: [
      "Rozhodují dva údaje: doba ledová v Evropě a doba ještě před lovci mamutů.",
      "Lovci mamutů byli dnešní lidé, takže ti nepřicházejí v úvahu. Hledej druh, který před nimi žil v Evropě v době ledové a jehož pozůstatky se našly v moravských jeskyních.",
    ],
    proc: "V jeskyni Šipka se našly pozůstatky neandrtálce, protože v Evropě v době ledové žil ještě před příchodem lovců mamutů.",
  },
  {
    q: "Archeologové našli v Dolních Věstonicích sošku ženy z pálené hlíny a kosti mamutů. Kdo sošku vytvořil?",
    klic: "S",
    distr: [
      ["N", "Neandrtálec v době lovců mamutů už nežil."],
      ["E", "Umění je nejmladší novinka, tento druh sošky nevytvářel."],
      ["H", "První výrobci nástrojů nevytvářeli umělecká díla."],
    ],
    hints: [
      "Soška není nástroj, ale umělecké dílo. A kosti mamutů prozrazují, čím se tlupa živila.",
      "Umění je poslední novinka vývoje. Rozmysli si, ke kterému druhu patřili lovci mamutů z Dolních Věstonic a zda jde o druh, ze kterého pocházíme.",
    ],
    proc: "Věstonickou venuši vytvořili lovci mamutů, tedy člověk rozumný, protože sošky se objevují až u tohoto druhu.",
  },
  {
    q: "Popis tlupy: přes den sbírá plody na okraji savany, na noc vyleze do korun stromů a po zemi chodí po dvou; oheň nezná a kameny nijak neupravuje. O který druh jde?",
    klic: "A",
    distr: [
      ["H", "Popis vylučuje jakoukoli úpravu kamene."],
      ["E", "Popis vylučuje oheň."],
      ["N", "Neandrtálec žil v Evropě, ne na africké savaně."],
    ],
    hints: [
      "Tlupa věci jen sbírá a nic neupravuje. Zamysli se, co to říká o jejím místě ve vývoji.",
      "Nejdřív vyřaď druhy, které znaly oheň. Ze zbylých vyber ten, který kámen ještě neopracovával — sebraný kámen není vyrobený nástroj.",
    ],
    proc: "Jde o australopitéka, protože chodil po dvou, ale kámen si pravidelně neupravoval a oheň neznal.",
  },
  {
    q: "Popis tlupy: z oblázků otlouká ostré úlomky na krájení masa, žije jen v Africe a oheň ještě nezná. O který druh jde?",
    klic: "H",
    distr: [
      ["A", "Ostré úlomky na krájení masa ukazují na pravidelnou výrobu nástrojů."],
      ["E", "Otloukat kámen uměl také, ale zbytek popisu na něj nesedí."],
      ["S", "Dnešní člověk oheň znal a rozšířil se po světě."],
    ],
    hints: [
      "Tlupa si nástroje sama vyrábí, ale ještě nezná oheň a neopustila Afriku.",
      "Nejdřív vyřaď druhy, které znaly oheň nebo žily i mimo Afriku. Ze zbylých vyber ten, který kámen už sám opracovával.",
    ],
    proc: "Jde o člověka zručného, protože už vyráběl kamenné nástroje, oheň ale neznal a žil jen v Africe.",
  },
  {
    q: "Popis tlupy: vytrvale putuje z Afriky až do Asie a vyrábí pěstní klíny, mrtvé ale ještě nepohřbívá. O který druh jde?",
    klic: "E",
    distr: [
      ["H", "Tento druh Afriku neopustil."],
      ["A", "Nejstarší druh žil jen v Africe."],
      ["N", "Mimo Afriku žil také, jenže popis vylučuje hroby."],
    ],
    hints: [
      "Tlupa opouští Afriku, ale nepohřbívá. Jde tedy o druh mezi dvěma novinkami.",
      "Zjisti, který druh jako první odešel z Afriky. Pak ověř, že ještě nepohřbíval mrtvé.",
    ],
    proc: "Jde o člověka vzpřímeného, protože jako první odešel z Afriky do Asie a vyráběl pěstní klín; hroby ale ještě nezanechal.",
  },
  {
    q: "Popis tlupy: žije v Evropě v době ledové, zná oheň a mrtvé ukládá do hrobů, ale zvířata na stěny jeskyní nemaluje. O který druh jde?",
    klic: "N",
    distr: [
      ["A", "Nejstarší druh oheň neznal a v Evropě nežil."],
      ["S", "Pohřbíval, ale malby zvířat po něm známe — to popis vylučuje."],
      ["E", "Hroby po něm nenacházíme."],
    ],
    hints: [
      "Popis říká, co tlupa dělá, i co nedělá. Druh musí pohřbívat, ale ještě nemalovat.",
      "Pohřbívání je předposlední novinka, malby zvířat ta poslední. Hledej druh, který se dostal až k pohřbívání, ale malby zvířat po sobě nezanechal.",
    ],
    proc: "Jde o neandrtálce, protože žil v Evropě v době ledové a pohřbíval mrtvé, ale malby zvířat v jeskyních známe až od člověka rozumného.",
  },
  {
    q: "Popis tlupy: v době ledové loví mamuty, tábory si staví pod širým nebem a z mamutoviny vyřezává sošky. O který druh jde?",
    klic: "S",
    distr: [
      ["N", "Velká zvířata lovil také, ale nebyl přímým předkem dnešních lidí."],
      ["E", "Tento druh ještě nic nevyřezával."],
      ["H", "Pravěk nebyl jedna doba — první výrobci nástrojů umění neznali."],
    ],
    hints: [
      "Soška je umělecké dílo. Který znak je ve vývoji člověka nejmladší?",
      "Lov velkých zvířat zvládaly i starší druhy, rozhodují proto sošky. Hledej druh, se kterým se sošky objevily poprvé, a nezaměň ho s druhem, který v Evropě žil před ním.",
    ],
    proc: "Jde o člověka rozumného, protože sošky z mamutoviny vyřezávali lovci mamutů, kteří patřili k tomuto druhu.",
  },
  {
    q: "Archeologové našli otisky stop tvorů, kteří kráčeli po dvou nohou po sopečném popelu dávno před prvními výrobci nástrojů. Kdo je zanechal?",
    klic: "A",
    distr: [
      ["E", "Jméno mate: vzpřímeně chodil už starší druh, stopy jsou starší než nástroje."],
      ["H", "Stopy jsou starší než tento druh."],
      ["N", "Neandrtálec žil až mnohem později."],
    ],
    hints: [
      "Stopy jsou starší než první vyráběné nástroje. Který druh žil ještě před jejich výrobci?",
      "Chůze po dvou se objevila dřív než nástroje. Najdi prvního výrobce nástrojů a pak se podívej, který druh stojí ve vývoji ještě před ním.",
    ],
    proc: "Stopy zanechal australopitek, protože chodil po dvou ještě dříve, než se objevili první výrobci nástrojů.",
  },
  {
    q: "Archeologové našli v Africe jen jednoduše otlučené oblázky olduvajské kultury, ještě žádné pěstní klíny. Který druh je podle učebnic nejspíš vyrobil?",
    klic: "H",
    distr: [
      ["A", "Učebnice ho za výrobce těchto nástrojů nepovažují."],
      ["E", "Nález bez pěstních klínů ukazuje na staršího výrobce."],
      ["S", "Dnešní člověk vyráběl propracované nástroje a přišel až na konci vývoje."],
    ],
    hints: [
      "Otlučený oblázek je nejjednodušší vyrobený nástroj. Kdo stál na začátku pravidelné výroby nástrojů?",
      "Pěstní klín a jemnější nástroje přišly později. Hledej druh, který oblázky už otloukal, ale pěstní klín ještě neznal.",
    ],
    proc: "Olduvajské oblázky učebnice připisují člověku zručnému, protože je znám jako první pravidelný výrobce nástrojů a pěstní klín ještě nevyráběl.",
  },
  {
    q: "Archeologové našli v Evropě i v Asii pěstní klíny a stopy ohně z doby, kdy ještě nikdo nepohřbíval mrtvé. Kdo je zanechal?",
    klic: "E",
    distr: [
      ["H", "Tento druh Afriku neopustil."],
      ["N", "Neandrtálec už pohřbíval, nález je z doby před tím."],
      ["A", "Nejstarší druh žil jen v Africe."],
    ],
    hints: [
      "Nález je mimo Afriku, obsahuje oheň a pochází z doby před pohřbíváním.",
      "Mimo Afriku se jako první dostal druh, který vyráběl pěstní klín. Ověř, že tento druh ještě nepohřbíval mrtvé.",
    ],
    proc: "Zanechal je člověk vzpřímený, protože jako první odešel z Afriky, vyráběl pěstní klín a používal oheň; hroby ještě nezanechal.",
  },
  {
    q: "V moravské jeskyni Kůlna archeologové našli kosti a nástroje lovců z doby ledové, kteří tu žili dřív než lovci mamutů. Kdo to byl?",
    klic: "N",
    distr: [
      ["A", "Nejstarší druh do Evropy nikdy nepřišel."],
      ["S", "Lovci mamutů patřili k tomuto druhu, nález je ale starší."],
      ["E", "Do Evropy přišel mnohem dřív. Kosti lovců z doby ledové v jeskyni Kůlna patří až neandrtálcům."],
    ],
    hints: [
      "Rozhoduje doba ledová v Evropě a to, že lovci tu byli dřív než lovci mamutů.",
      "Lovci mamutů byli dnešní lidé, takže vypadávají. Ze starších druhů hledej ten, který v době ledové obýval evropské jeskyně a jehož nálezy známe i z Moravy.",
    ],
    proc: "V jeskyni Kůlna žil neandrtálec, protože v době ledové obýval evropské jeskyně ještě před příchodem lovců mamutů.",
  },
  {
    q: "Archeologové našli u Předmostí u Přerova hromadný hrob lovců mamutů. Ke kterému druhu patřili?",
    klic: "S",
    distr: [
      ["N", "V době lovců mamutů už nežil."],
      ["E", "Tento druh ještě nepohřbíval."],
      ["H", "První výrobci nástrojů hroby nezanechali ani mamuty v Evropě nelovili."],
    ],
    hints: [
      "Hrob sám nerozhoduje, pohřbívalo víc druhů. Klíčové je, kdo byli lovci mamutů.",
      "Lovci mamutů z Předmostí a Dolních Věstonic jsou známí i vyřezávanými a hliněnými soškami. Který druh vytvářel sošky?",
    ],
    proc: "Lovci mamutů z Předmostí patřili k člověku rozumnému, protože stejní lovci vytvářeli i sošky. Pohřbívání samo o sobě nestačí, mrtvé pohřbíval i neandrtálec.",
  },
];

// ── L3a — anachronismus: co se u druhu ještě NEMOHLO objevit ──────────────
interface Vec {
  text: string;
  rank: number;
  /** Proč to u pozdějšího druhu už být mohlo. */
  fakt: string;
  /** Jen rank 1: proč to patří k australopitékovi (bez kruhu „protože to měl australopitek“). */
  a?: string;
  /** Jednorázová událost, ne dovednost — pozdější druhy ji nedědí, jako distraktor jen u vlastního druhu. */
  neDedi?: true;
}
const VECI: Vec[] = [
  { text: "chůze po dvou nohou", rank: 1, fakt: "po dvou chodil už australopitek a pozdější druhy to zdědily", a: "chůze po dvou byla právě jeho novinka" },
  { text: "sběr plodů a kořínků", rank: 1, fakt: "plody a kořínky sbírali už australopitéci", a: "plody a kořínky byly jeho hlavní potravou" },
  { text: "kámen sebraný ze země", rank: 1, fakt: "kámen, jak ho našel, dokázal použít už australopitek", a: "kámen, jak ho našel, dokázal použít" },
  { text: "život v tlupě", rank: 1, fakt: "v tlupách žili už australopitéci", a: "žil ve skupinách, podobně jako dnešní lidoopi" },
  { text: "útěk před šelmami", rank: 1, fakt: "před šelmami se museli mít na pozoru už australopitéci", a: "byl malý a šelmy ho často lovily" },
  { text: "ostrý otlučený kámen", rank: 2, fakt: "kámen do ostré hrany otloukal už člověk zručný" },
  { text: "táborový oheň", rank: 3, fakt: "oheň používal už člověk vzpřímený" },
  { text: "pěstní klín z pazourku", rank: 3, fakt: "pěstní klín vyráběl už člověk vzpřímený" },
  { text: "cesta z Afriky do Asie", rank: 3, fakt: "z Afriky jako první odešel člověk vzpřímený", neDedi: true },
  { text: "hrob se zemřelým lovcem", rank: 4, fakt: "mrtvé pohřbíval už neandrtálec" },
  { text: "malba zvířat v jeskyni", rank: 5, fakt: "malby zvířat známe až od člověka rozumného" },
  { text: "vyřezávaná soška ženy", rank: 5, fakt: "sošky známe až od člověka rozumného" },
];

interface Tvar { rank: number; nom: string; gen: string; lok: string; novinka: string }
/** Pády jako vlastní pole — žádné lepení předložky k holému jménu. */
const TVARY: Tvar[] = [
  { rank: 1, nom: "australopitek", gen: "australopitéka", lok: "australopitékovi", novinka: "je nejstarší z pěti druhů a jeho novinkou byla chůze po dvou" },
  { rank: 2, nom: "člověk zručný", gen: "člověka zručného", lok: "člověku zručném", novinka: "přišel po australopitékovi a učebnice s ním spojují první pravidelnou výrobu kamenných nástrojů" },
  { rank: 3, nom: "člověk vzpřímený", gen: "člověka vzpřímeného", lok: "člověku vzpřímeném", novinka: "přišel po člověku zručném, jako první odešel z Afriky a naučil se používat oheň" },
  { rank: 4, nom: "neandrtálec", gen: "neandrtálce", lok: "neandrtálci", novinka: "přišel po člověku vzpřímeném a už pohřbíval mrtvé" },
];
const DRUH_PODLE_RANKU = ["", "australopitek", "člověk zručný", "člověk vzpřímený", "neandrtálec", "člověk rozumný"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const RAMCE: { q: (t: Tvar) => string; h0: (t: Tvar) => string; konec: string }[] = [
  {
    q: (t) => `Která z těchto věcí se u ${t.gen} ještě NEMOHLA objevit?`,
    h0: (t) => `Urči, kam ve vývoji patří ${t.nom}, a u každé ze čtyř věcí se zeptej, jestli ji znal on sám, nebo někdo před ním.`,
    konec: "Věc, se kterou přišel až některý pozdější druh, se u něj ještě objevit nemohla.",
  },
  {
    q: (t) => `Spisovatel píše příběh o životě ${t.gen}. Která z těchto věcí by v příběhu byla chyba?`,
    h0: (t) => `Chyba v příběhu je věc, kterou vymyslel až druh žijící po ${t.lok}. Projdi možnosti jednu po druhé.`,
    konec: "Chybou v příběhu je jen věc, se kterou přišel teprve některý pozdější druh.",
  },
  {
    q: (t) => `Muzeum chystá výstavu o životě ${t.gen}. Která z těchto věcí na ni NEPATŘÍ?`,
    h0: (t) => `Na výstavu o životě ${t.gen} patří jen to, co do jeho doby už patřilo. Porovnej každou věc s jeho místem ve vývoji.`,
    konec: "Na výstavu nepatří věc, kterou lidé začali dělat až po něm.",
  },
];

function genL3a(): PracticeTask[] {
  const out: PracticeTask[] = [];
  for (const t of TVARY) {
    const pozdejsi = VECI.filter((v) => v.rank > t.rank);
    const vlastni = VECI.filter((v) => v.rank === t.rank);
    const starsi = VECI.filter((v) => v.rank < t.rank && !v.neDedi).reverse(); // nejbližší (nejtěžší) první
    const krok = Math.max(1, Math.floor(pozdejsi.length / 3));
    RAMCE.forEach((r, f) => {
      const klic = pozdejsi[(f * krok) % pozdejsi.length];
      let distr: Vec[];
      if (starsi.length === 0) {
        // nejstarší druh: rotace po trojicích z vlastní banky, ať se sady nepřekrývají celé
        distr = [0, 1, 2].map((i) => vlastni[(3 * f + i) % vlastni.length]);
      } else {
        const own = vlastni[f % vlastni.length];
        const rest = [...vlastni.filter((v) => v !== own), ...starsi];
        distr = [own, rest[(2 * f) % rest.length], rest[(2 * f + 1) % rest.length]];
      }
      out.push(
        choice(
          r.q(t),
          klic.text,
          distr.map((v) => ({
            value: v.text,
            why: t.rank === 1
              ? `Tohle do života ${t.gen} patří, protože ${v.a}.`
              : v.rank === t.rank
                ? `Tohle je naopak novinka právě ${t.gen}, takže u něj být mohla. Myslet si, že to neuměl, je opačná chyba než anachronismus.`
                : `Tohle u ${t.gen} už být mohlo, protože ${v.fakt}. Co přišlo dřív, to pozdější druhy převzaly.`,
          })),
          {
            hints: [
              r.h0(t),
              `${cap(t.nom)} ${t.novinka}. Všechno, co přišlo dřív, už mohl znát. ${r.konec}`,
            ],
            explanation: `${cap(klic.text)} patří až k druhu ${DRUH_PODLE_RANKU[klic.rank]}, který přišel později než ${t.nom}. Proto u ${t.gen} tahle věc ještě být nemohla, zatímco ostatní tři možnosti do jeho doby už patřily.`,
          },
        ),
      );
    });
  }
  return out;
}

// ── L3b — příčina a důsledek ─────────────────────────────────────────────
interface Pricina { q: string; klic: string; distr: [string, string][]; hints: [string, string]; proc: string }
const PRICINY: Pricina[] = [
  {
    q: "Proč mohli předkové člověka začít vyrábět nástroje?",
    klic: "Protože chodili po dvou a měli volné ruce.",
    distr: [
      ["Protože je výroba nástrojů naučila chodit po dvou.", "Obrácená příčina a důsledek: po dvou se chodilo dřív, než vznikl první vyrobený nástroj."],
      ["Protože jim oheň ukázal, jak kámen rozbít.", "Anachronismus: oheň ovládl až člověk vzpřímený, nástroje se vyráběly už před ním."],
      ["Protože nástroje odkoukali od lovců mamutů.", "Anachronismus: lovci mamutů byli dnešní lidé a žili až na konci vývoje."],
    ],
    hints: [
      "Čím se kámen drží a opracovává? A co muselo tělo změnit, aby na to mělo čas i během pohybu?",
      "Příčina musí přijít dřív než důsledek. Seřaď si, co se ve vývoji objevilo nejdřív: změna způsobu pohybu, výroba nástrojů, oheň, nebo umění? Výroba nástrojů nemůže být příčinou sama sebe.",
    ],
    proc: "Předkové člověka mohli vyrábět nástroje, protože chůze po dvou jim uvolnila ruce. Chůze po dvou přišla dávno předtím, pravidelnou výrobu nástrojů učebnice spojují až s člověkem zručným.",
  },
  {
    q: "Proč mohli lidé přežít zimu i v chladnějších krajích Evropy?",
    klic: "Protože se u ohně mohli ohřát.",
    distr: [
      ["Protože si uměli otlouct ostrý kámen.", "Ostrý kámen se vyráběl už dávno předtím a zimu sám nezažene."],
      ["Protože pohřbívali své mrtvé.", "Pohřbívání s přežitím zimy nesouvisí."],
      ["Protože chodili po dvou nohou.", "Po dvou chodil už australopitek v teplé Africe; proti zimě to nepomáhá."],
    ],
    hints: [
      "Co potřebuje tvor, který přišel z teplé Afriky, aby přežil mrazivou noc?",
      "U každé možnosti se zeptej, jestli opravdu může zahřát. Pozor na věci, které jsou pravdivé, ale se zimou nesouvisejí.",
    ],
    proc: "Lidé přežili zimu v chladnějších krajích Evropy, protože se u ohně ohřáli a oheň je chránil. Používat oheň se naučil už člověk vzpřímený a pozdější druhy ho převzaly.",
  },
  {
    q: "Malíř v tmavé jeskyni namaloval bizona, i když žádný bizon u něj nebyl. Co to o něm prozrazuje?",
    klic: "Že si uměl zvíře představit v hlavě.",
    distr: [
      ["Že uměl rozdělat oheň, aby v jeskyni viděl.", "Světlo potřeboval, ale oheň znal už člověk vzpřímený; o představivosti to nic neříká."],
      ["Že měl barvy z hlíny a uhlí.", "Materiál barev ukazuje, čím maloval, ne jak přemýšlel."],
      ["Že to byl neandrtálec.", "Malby zvířat po neandrtálcích nenacházíme, známe je od člověka rozumného."],
    ],
    hints: [
      "Zamysli se, co musí malíř umět v hlavě, když maluje zvíře, které zrovna nevidí.",
      "U každé možnosti se zeptej: vypovídá to něco o tom, co se děje v malířově hlavě? Nebo jen o tom, čím a kde maloval?",
    ],
    proc: "Malba prozrazuje představivost, protože malíř bizona namaloval, i když ho zrovna neviděl. Takové malby zvířat známe od člověka rozumného.",
  },
  {
    q: "Proč vědci usuzují, že neandrtálci přemýšleli o smrti?",
    klic: "Protože své mrtvé ukládali do hrobů.",
    distr: [
      ["Protože žili v jeskyních v době ledové.", "Život v jeskyni souvisí s ochranou před zimou, ne se smrtí."],
      ["Protože malovali lovecké výjevy na stěny.", "Malby zvířat a loveckých výjevů po neandrtálcích nenacházíme, známe je od člověka rozumného."],
      ["Protože uměli rozdělat a udržet oheň.", "Oheň znal už člověk vzpřímený, se smrtí nesouvisí."],
    ],
    hints: [
      "Které stopy v jeskyni by prozradily, že tlupa brala smrt svého člena vážně?",
      "Hledej doklad, který souvisí přímo se smrtí, ne s běžným životem tlupy. Pamatuj také, co neandrtálci podle nálezů opravdu dělali a co patří až člověku rozumnému.",
    ],
    proc: "O smrti neandrtálci přemýšleli, protože mrtvé pohřbívali. Pohřeb není potřeba k přežití, proto svědčí o tom, že na zemřelých tlupě záleželo.",
  },
  {
    q: "Proč se člověk rozumný po příchodu do Evropy setkal s neandrtálcem?",
    klic: "Protože oba žili v Evropě ve stejné době.",
    distr: [
      ["Protože se z neandrtálce přímo vyvinul.", "Lineární představa: neandrtálec není přímý předek dnešních lidí, žil souběžně s nimi."],
      ["Protože neandrtálec přišel do Evropy až po něm.", "Obrácené pořadí: neandrtálec žil v Evropě dřív, člověk rozumný přišel za ním."],
      ["Protože ho neandrtálci naučili malovat zvířata.", "Malby zvířat po neandrtálcích nenacházíme, malovat je tedy nenaučili."],
    ],
    hints: [
      "Nakresli si časovou osu Evropy v době ledové a vyznač, kdy tam žil neandrtálec a kdy přišel člověk rozumný.",
      "Setkat se mohou jen druhy, jejichž doby se na časové ose aspoň zčásti překrývají. Pozor na představu jedné řady „jeskynní člověk → my“: neandrtálec není přímý předek dnešních lidí.",
    ],
    proc: "Člověk rozumný se s neandrtálcem setkal, protože po příchodu do Evropy tam neandrtálci ještě nějakou dobu žili. Dnešní lidé tedy nepocházejí přímo z neandrtálce.",
  },
  {
    q: "Proč mohl člověk zručný krájet maso, i když neměl ostré zuby ani drápy?",
    klic: "Protože si otloukl kámen do ostré hrany.",
    distr: [
      ["Protože maso nejdřív změkčil nad ohněm.", "Anachronismus: oheň ovládl až člověk vzpřímený."],
      ["Protože používal pěstní klín z pazourku.", "Anachronismus: pěstní klín vyráběl až člověk vzpřímený."],
      ["Protože ostrý kámen vždycky jen našel na zemi.", "Použít neznamená vyrobit: člověk zručný kámen pravidelně upravoval, a tím se lišil od starších předků."],
    ],
    hints: [
      "Čím nahradí ostré zuby tvor, který je sám nemá? Mysli na nástroj, ne na tělo.",
      "Rozliš, jestli tvor nástroj jen našel, nebo si ho sám upravil — právě tím se lišil od svých předchůdců. Pozor také na věci, které přišly až s pozdějšími druhy.",
    ],
    proc: "Člověk zručný krájel maso, protože si sám otloukal kámen do ostré hrany. Oheň ani pěstní klín ještě neznal.",
  },
];

function genL3b(): PracticeTask[] {
  return PRICINY.map((p) =>
    choice(p.q, p.klic, p.distr.map(([value, why]) => ({ value, why })), { hints: p.hints, explanation: p.proc }),
  );
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return L1.map(zForem);
  if (level === 2) return L2.map(zForem);
  // L3: prostřídat obě podoby, aby první úlohy nebyly všechny stejného typu.
  const a = genL3a();
  const b = genL3b();
  const out: PracticeTask[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

// ── Topic ────────────────────────────────────────────────────────────────
export const HOMINIZACE: TopicMetadata[] = [
  {
    id: "g6-dej-hominizace-6",
    rvpNodeId: "g6-dejepis-pravek-vyvoj-cloveka-hominizace-od-australopiteka-po-homo-sapiens",
    displayName: "Vývoj člověka",
    title: "Hominizace – od australopitéka po Homo sapiens",
    studentTitle: "Jak se vyvíjel člověk",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Vývoj člověka",
    briefDescription: "Poznáš, co uměl australopitek, neandrtálec i člověk rozumný a co ještě ne.",
    keywords: [
      "hominizace", "vývoj člověka", "australopitek", "člověk zručný", "člověk vzpřímený",
      "neandrtálec", "člověk rozumný", "Homo sapiens", "oheň", "pěstní klín", "Věstonická venuše",
    ],
    goals: [
      "Přiřadit znak (chůze po dvou, nástroj, oheň, pohřeb, umění) ke druhu, se kterým ho spojujeme.",
      "Poznat druh podle popisu archeologického nálezu.",
      "Rozpoznat anachronismus a vysvětlit příčiny změn ve vývoji člověka.",
    ],
    boundaries: [
      "Jen pět druhů: australopitek, člověk zručný, člověk vzpřímený, neandrtálec, člověk rozumný.",
      "Bez letopočtů jako odpovědi a bez sporných otázek o křížení druhů.",
      "Řazení epoch pravěku procvičuje téma Časová osa pravěku.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Každý druh přinesl novinku a pozdější druhy ji převzaly: chůze po dvou → výroba nástrojů → odchod z Afriky a oheň → pohřbívání → malby zvířat a sošky.",
      steps: [
        "Najdi v otázce znak nebo nález (nástroj, oheň, hrob, malba…).",
        "Urči, se kterým druhem se ten znak objevil poprvé.",
        "Ověř i to, co v otázce chybí: co druh ještě neuměl.",
      ],
      commonMistake: "Brát jméno doslova (po dvou chodil už australopitek, ne až člověk vzpřímený) nebo přisoudit malby zvířat a sošky neandrtálci.",
      example: "Stopy ohně a pěstní klín, ale žádné hroby → nejspíš člověk vzpřímený.",
    },
  },
];
