/**
 * Fyzika 6. ročník — Pohyb částic: difúze a Brownův pohyb.
 *
 * Čtvrté a poslední téma okruhu „Látky a tělesa“ a druhé téma podokruhu
 * „Částicová stavba látek“. `atomyMolekuly.ts` postavilo částice a mezery mezi
 * nimi, ale nechalo je stát. Tady se rozpohybují — a teprve tím se z modelu
 * stane něco, co doopravdy něco vysvětluje.
 *
 * **Miskoncepce, na kterých téma stojí, jsou tři a jdou proti sobě do patra:**
 *  1. Difúze potřebuje míchání nebo proud. (Nepotřebuje. Proběhne v naprostém
 *     klidu, míchání ji jen urychlí.)
 *  2. V pevné látce částice stojí. (Kmitají kolem svých míst a občas se
 *     prosmýknou k sousedům — proto difúze v kovech trvá roky, ne že neprobíhá.)
 *  3. Pod mikroskopem u Brownova pohybu vidíme molekuly. (Vidíme zrnko.
 *     Molekuly jsou o několik řádů menší a zůstávají neviditelné — vidíme
 *     jenom jejich důsledek.)
 *
 * Gradace:
 *  • **L1 rozpoznání** — teplota mění rychlost pohybu částic. Dva stejné
 *    pokusy při dvou teplotách, žák určí, kde děj proběhne dřív.
 *  • **L2 aplikace** — vysvětli difúzi na běžné situaci a poznej ji i tam,
 *    kde ji nikdo nečeká (splasklý balonek, olovo ve zlatě, kyslík v rybníce).
 *  • **L3 přenos** — Brownův pohyb. Žák musí z pozorování vyloučit proudění,
 *    život i klesání a dojít k jediné zbylé příčině: nárazům neviditelných
 *    částic. To je jiná myšlenková operace než L2 — usuzuje se tu na něco,
 *    co vidět není.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **L1 je parametrická, L2 a L3 jsou banky.** U L1 je jádro jediné (vyšší
 * teplota = rychlejší pohyb částic), takže se dá otáčet dějem i dvojicí teplot
 * a vyjde z toho několik desítek různých úloh. L2 a L3 jsou pojmové: každá
 * otázka má vlastní situaci i vlastní chybný model a ten se z parametru
 * odvodit nedá. Obě mají po dvanácti ručně psaných položkách.
 *
 * **Čtvrtá možnost u L1 je pokaždé jiná a vázaná na ten který děj.** Kdyby
 * byla společná, dítě by si po třech úlohách zapamatovalo, že se nikdy nevybírá
 * — a čtyři možnosti by fakticky byly tři. Každý děj proto nese svoji vlastní
 * záludnost („bez zamíchání se nerozpustí“, „v horké vodě barva zbledne“).
 *
 * **Známé omezení L1: klíčem je vždycky ta teplejší strana.** Dítě, které se
 * naučí jen „vyber teplejší“, projde, aniž by cokoli chápalo. Obrácená otázka
 * („kde to bude trvat déle?“) by to zlomila, jenže u sedmi z devíti dějů míří
 * čtvrtá možnost na tu chladnější stranu, takže by se po obrácení shodla
 * s klíčem. Přepsat ji by znamenalo obětovat právě tu nejsilnější past —
 * chladnější strana se špatným zdůvodněním. Na L1 to nechávám tak, jak to je,
 * protože rozpoznání pravidla je jejím úkolem; rozlišovací práci dělá L2 a L3.
 *
 * **Prachová zrnka v paprsku slunce tu záměrně nejsou**, přestože se nabízejí.
 * Za jejich pohybem stojí hlavně proudění teplého vzduchu, ne nárazy molekul,
 * takže jako příklad Brownova pohybu nejsou poctivá. Místo nich je v L3
 * učebnicový pokus s kouřem v uzavřené krabičce.
 *
 * **Bez difúzního koeficientu, střední volné dráhy a rovnic.** Šestka na ně
 * nemá aparát; téma vystačí se slovním modelem.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/* ------------------------------------------------------------------ L1 --- */

/**
 * Dvojice teplot zvlášť pro vodu a zvlášť pro místnost — 40 °C je v hrnku
 * běžná teplota, v pokoji nesmysl. Rozdíl je všude aspoň 20 °C, aby byl
 * výsledek pokusu jednoznačný i ve skutečnosti, ne jen v zadání.
 */
const TEPLOTY: Record<"voda" | "mistnost", number[][]> = {
  voda: [
    [5, 40], [10, 50], [15, 60], [20, 70],
    [8, 35], [12, 45], [18, 55], [25, 65],
  ],
  mistnost: [
    [5, 26], [8, 30], [10, 28], [12, 32], [6, 24], [14, 34],
  ],
};

/**
 * `kdeTeple` a `kdeChladne` jsou hotové předložkové vazby, ne holé podstatné
 * jméno — „v teplejší vodě“ × „v teplejším hrnku“ × „v teplejší spíži“ se
 * z jednoho tvaru odvodit nedá. Táž zásada jako `zLatky` v `latkaATeleso.ts`.
 *
 * `zvlast` je čtvrtá možnost vázaná na konkrétní děj. `stejneVeci` je celá
 * hotová věta, ne jen podstatné jméno: první verze skládala v nápovědě
 * „stejná “ + jméno v akuzativu a vyráběla „stejná lžičku rozpustné kávy“.
 * Ke všemu mluvila o nádobě i tam, kde se pokus dělá ve spíži. Rod, pád
 * i to, v čem pokus běží, proto patří do dat.
 */
interface DejL1 {
  prostredi: "voda" | "mistnost";
  /** Popis pokusu; dostane oba teplotní údaje už hotové. */
  zadani: (chladna: string, tepla: string) => string;
  otazka: string;
  kdeTeple: string;
  kdeChladne: string;
  procChladne: string;
  zvlast: { value: string; why: string };
  stejneVeci: string;
  /** Krátká vazba „u čeho“ do velké nápovědy, ať není u všech úloh stejná. */
  naCo: string;
  vysvetleni: string;
}

const DEJE_L1: DejL1[] = [
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `V jedné sklenici je voda o teplotě ${a}, ve druhé ${b}. Do obou najednou vložíš stejnou kostku cukru a ani v jedné nezamícháš.`,
    otazka: "Kde se cukr rozpustí dřív?",
    kdeTeple: "v teplejší vodě",
    kdeChladne: "v chladnější vodě",
    procChladne:
      "V chladu se částice vody pohybují pomaleji, takže z kostky odnášejí částice cukru později.",
    zvlast: {
      value: "bez zamíchání se nerozpustí ani v jedné",
      why: "Míchání rozpouštění urychlí, ale potřeba k němu není. Částice vody se pohybují samy a cukr rozpustí i ve stojící sklenici.",
    },
    stejneVeci: "Kostka cukru je v obou sklenicích úplně stejná.",
    naCo: "u rozpouštění cukru",
    vysvetleni:
      "Čím je voda teplejší, tím rychleji se pohybují její částice. Častěji a prudčeji narážejí do kostky cukru a rychleji z ní odnášejí částice do celé sklenice.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `Do jednoho hrnku naliješ vodu o teplotě ${a} a do druhého ${b}. Do obou zároveň ponoříš stejný čajový sáček a nemícháš.`,
    otazka: "Ve kterém hrnku se voda obarví dřív?",
    kdeTeple: "v teplejším hrnku",
    kdeChladne: "v chladnějším hrnku",
    procChladne:
      "Ve studené vodě se barvivo ze sáčku uvolňuje také, jen mnohem pomaleji.",
    zvlast: {
      value: "v chladnějším, horká voda chuť čaje zničí",
      why: "Horká voda chuť čaje opravdu mění. Barvivo z něj ale uvolní rychleji, ne pomaleji — a otázka je na barvu.",
    },
    stejneVeci: "Čajový sáček je v obou hrncích úplně stejný.",
    naCo: "u louhování čaje",
    vysvetleni:
      "Barvivo se ze sáčku dostává do vody pohybem částic. V horké vodě se částice pohybují rychleji, takže se voda obarví dřív.",
  },
  {
    prostredi: "mistnost",
    zadani: (a, b) =>
      `V jedné místnosti je ${a} a ve druhé ${b}. V obou otevřeš u okna stejnou lahvičku s vonným olejem a vzduch nikde neproudí.`,
    otazka: "Ve které místnosti ucítíš vůni u dveří dřív?",
    kdeTeple: "v teplejší místnosti",
    kdeChladne: "v chladnější místnosti",
    procChladne:
      "V chladu se částice vůně i vzduchu pohybují pomaleji, takže k nosu doletí později.",
    zvlast: {
      value: "v chladnější, v teple se vůně vypaří dřív, než doletí",
      why: "Vypařuje se rychleji, to sedí. Právě proto se v teple vůně šíří rychleji — uvolní se jí víc a pohybuje se svižněji.",
    },
    stejneVeci: "Lahvička s vonným olejem je v obou místnostech úplně stejná.",
    naCo: "u šíření vůně vzduchem",
    vysvetleni:
      "Vůně se místností šíří pohybem svých částic mezi částicemi vzduchu. V teple jsou všechny rychlejší, takže vůně urazí cestu ke dveřím dřív.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `Do jedné sklenice naliješ vodu o teplotě ${a} a do druhé ${b}. Do obou opatrně kápneš stejnou kapku potravinářského barviva a necháš je stát.`,
    otazka: "Ve které sklenici se barva rozšíří do celé vody dřív?",
    kdeTeple: "v teplejší vodě",
    kdeChladne: "v chladnější vodě",
    procChladne:
      "Ve studené vodě se barva rozšíří taky, jen jí to bude trvat mnohem déle.",
    zvlast: {
      value: "v chladnější, studená voda je hustší a barvu roznese líp",
      why: "Studená voda je opravdu o kousek hustší. Na rychlost promíchání to ale nemá vliv — rozhoduje rychlost pohybu částic a ta je v teple větší.",
    },
    stejneVeci: "Kapka barviva je v obou sklenicích úplně stejná.",
    naCo: "u rozptylování barviva",
    vysvetleni:
      "Barva se vodou rozšiřuje difúzí, tedy samovolným promícháním částic. Čím je voda teplejší, tím rychleji se částice pohybují a tím dřív je obarvená celá sklenice.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `Do jedné sklenice naliješ vodu o teplotě ${a} a do druhé ${b}. Do obou naráz hodíš stejnou šumivou tabletu.`,
    otazka: "Ve které sklenici se tableta rozpustí dřív?",
    kdeTeple: "v teplejší vodě",
    kdeChladne: "v chladnější vodě",
    procChladne: "Ve studené vodě tableta šumí déle a rozpouští se pomaleji.",
    zvlast: {
      value: "v chladnější, protože tam bublinky vydrží déle",
      why: "Bublinky v chladu opravdu vydrží déle. Tabletu ale rozpouštějí nárazy částic vody a ty jsou v teple rychlejší.",
    },
    stejneVeci: "Šumivá tableta je v obou sklenicích úplně stejná.",
    naCo: "u rozpouštění šumivé tablety",
    vysvetleni:
      "Tabletu rozpouštějí částice vody, které do ní narážejí. V teplé vodě se pohybují rychleji, takže tableta zmizí dřív.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `V jednom hrnci je voda o teplotě ${a}, ve druhém ${b}. Do obou dáš stejnou barvu na vajíčka a stejné vejce.`,
    otazka: "Ve kterém hrnci se skořápka obarví dřív?",
    kdeTeple: "v teplejší vodě",
    kdeChladne: "v chladnější vodě",
    procChladne:
      "Ve studené lázni se vejce obarví taky, jen po mnohem delší době.",
    zvlast: {
      value: "v chladnější, v horké vodě barva zbledne",
      why: "Barva v horké vodě nebledne. Naopak se rychleji dostane ke skořápce, protože se částice pohybují svižněji.",
    },
    stejneVeci: "Barva na vajíčka i vejce jsou v obou hrncích úplně stejné.",
    naCo: "u barvení skořápky",
    vysvetleni:
      "Částice barvy se dostávají ke skořápce pohybem ve vodě. Čím je voda teplejší, tím je jejich pohyb rychlejší a tím dřív je vejce barevné.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `V jedné sklenici je voda o teplotě ${a}, ve druhé ${b}. Na dno obou opatrně naliješ stejnou lžíci hustého sirupu a ani jednou nezamícháš.`,
    otazka: "Ve které sklenici bude sladká celá voda dřív?",
    kdeTeple: "v teplejší vodě",
    kdeChladne: "v chladnější vodě",
    procChladne:
      "Ve studené vodě postupuje sirup ode dna mnohem pomaleji.",
    zvlast: {
      value: "v žádné, sirup je těžký a zůstane u dna",
      why: "Ze začátku u dna opravdu leží. Pohyb částic ho ale postupně roznese po celé sklenici i bez míchání.",
    },
    stejneVeci: "Lžíce sirupu je v obou sklenicích úplně stejná.",
    naCo: "u sirupu, který leží na dně",
    vysvetleni:
      "Sirup se vodou rozšíří difúzí. Pohyb částic je v teplé vodě rychlejší, takže se sladkost dostane ke hladině dřív.",
  },
  {
    prostredi: "voda",
    zadani: (a, b) =>
      `Do jednoho hrnku dáš vodu o teplotě ${a} a do druhého ${b}. Do obou nasypeš stejnou lžičku rozpustné kávy a necháš je být.`,
    otazka: "Ve kterém hrnku bude hnědá celá voda dřív?",
    kdeTeple: "v teplejším hrnku",
    kdeChladne: "v chladnějším hrnku",
    procChladne:
      "Ve studené vodě se káva rozpustí také, jen se s tím bude dlouho párat.",
    zvlast: {
      value: "v chladnějším, protože v horké vodě se káva srazí",
      why: "Rozpustná káva se nesráží. V horké vodě se dokonce rozpustí rychleji, protože do jejích zrnek narážejí rychlejší částice vody.",
    },
    stejneVeci: "Lžička kávy je v obou hrncích úplně stejná.",
    naCo: "u rozpouštění kávy",
    vysvetleni:
      "Zrnka kávy se rozpouštějí nárazy částic vody. V teplé vodě jsou tyhle nárazy častější a prudší, takže je hrnek hnědý dřív.",
  },
  {
    prostredi: "mistnost",
    zadani: (a, b) =>
      `V jedné spíži je ${a} a ve druhé ${b}. V každé necháš na talíři stejný kousek rozkrojené cibule a vzduch nikde neproudí.`,
    otazka: "Ve které spíži bude cibule cítit v celém prostoru dřív?",
    kdeTeple: "v teplejší spíži",
    kdeChladne: "v chladnější spíži",
    procChladne:
      "V chladu se částice vůně uvolňují i pohybují pomaleji, takže to trvá déle.",
    zvlast: {
      value: "v chladnější, chlad vůni zesiluje",
      why: "Chlad vůni naopak tlumí — proto se potraviny dávají do lednice. Částic se uvolní méně a pohybují se pomaleji.",
    },
    stejneVeci: "Kousek cibule je v obou spížích úplně stejný.",
    naCo: "u vůně uvolňované z cibule",
    vysvetleni:
      "Z cibule se uvolňují částice vůně a ty se promíchají se vzduchem. V teple se uvolňují rychleji a rychleji se i pohybují, takže je cibule cítit dřív.",
  },
];

const KROKY_L1 = [
  "Oba pokusy se liší jedinou věcí — teplotou.",
  "Vyšší teplota znamená rychlejší pohyb částic.",
  "Rychlejší pohyb částic znamená rychlejší promíchání, tedy dřívější výsledek.",
];

function genL1(): PracticeTask {
  const d = pick(DEJE_L1);
  const [ch, te] = pick(TEPLOTY[d.prostredi]);
  const chladna = `${ch} °C`;
  const tepla = `${te} °C`;
  return task(
    `${d.zadani(chladna, tepla)} ${d.otazka}`,
    `${d.kdeTeple} (${tepla})`,
    [
      { value: `${d.kdeChladne} (${chladna})`, why: d.procChladne },
      {
        value: "v obou stejně rychle",
        why: "Stejně to nebude. Teplota mění rychlost pohybu částic a právě na ní celý děj závisí.",
      },
      d.zvlast,
    ],
    {
      hints: [
        `Jediný rozdíl mezi oběma pokusy je teplota. ${d.stejneVeci}`,
        `Teplota látky říká, jak rychle se v ní pohybují částice: čím tepleji, tím svižněji. Rychlejší částice se častěji a prudčeji potkávají, takže se obě látky promíchají dřív. Platí to i ${d.naCo}. Rozhoduj proto podle toho, kde je teplota vyšší, ne podle toho, co se ti u té které věci zdá z kuchyně.`,
      ],
      solutionSteps: KROKY_L1,
      explanation: d.vysvetleni,
    },
  );
}

/* --------------------------------------------------------------- L2, L3 --- */

/** Ručně psaná položka banky: celá úloha včetně vlastního chybového modelu. */
interface Polozka {
  otazka: string;
  klic: string;
  chybne: { value: string; why: string }[];
  h0: string;
  h1: string;
  vysvetleni: string;
}

const DIFUZE: Polozka[] = [
  {
    otazka:
      "Na dno sklenice s klidnou vodou opatrně kápneš inkoust a vůbec nemícháš. Za hodinu je obarvená celá voda až k hladině. Čím to je?",
    klic: "Částice inkoustu i vody se samy neustále pohybují a postupně se promíchaly.",
    chybne: [
      {
        value: "Voda ve sklenici proudila a inkoust roznesla.",
        why: "Sklenice stála v klidu. Difúze žádný proud nepotřebuje — stačí jí pohyb samotných částic.",
      },
      {
        value: "Inkoust je těžší než voda, a tak se rozlil po dně.",
        why: "Kdyby šlo jen o klesání, zůstal by inkoust dole. Obarvila se ale i voda u hladiny.",
      },
      {
        value: "Inkoust se ve vodě rozpustil, a proto zmizel.",
        why: "Nikam nezmizel — voda je přece obarvená. Jeho částice jsou pořád ve sklenici, jen rozptýlené.",
      },
    ],
    h0: "Všimni si, že se obarvila i voda nad kapkou, tedy proti směru, kterým by inkoust klesal.",
    h1: "Tomuhle samovolnému promíchání dvou látek se říká difúze. Neděje se proto, že by něco teklo nebo padalo, ale proto, že se částice obou látek neustále pohybují a při tom se dostávají mezi sebe. Proud ani míchání děj jen urychlí, potřeba k němu nejsou.",
    vysvetleni:
      "Difúze je samovolné promíchání dvou látek způsobené neustálým pohybem jejich částic. Probíhá i v naprosto klidné kapalině a do všech směrů, takže se obarví i voda nad kapkou.",
  },
  {
    otazka:
      "Olověnou a zlatou destičku k sobě pevně přitiskneš a necháš je pět let ležet. Potom se ve zlatě najde olovo a v olovu zlato, i když se destičky nikdy nezahřály. Jak je to možné?",
    klic: "I v pevné látce se částice pohybují — kmitají kolem svých míst a občas se prosmýknou k sousedům.",
    chybne: [
      {
        value: "V pevné látce jsou částice nehybné, kovy se musely spojit chemicky.",
        why: "Nehybné částice neexistují v žádném skupenství. V pevné látce se pohybují nejméně, a proto to trvá roky.",
      },
      {
        value: "Prach mezi destičkami obě látky promíchal.",
        why: "Prach by zůstal na rozhraní. Olovo se ale našlo uvnitř zlata, kam se dostat nemohl.",
      },
      {
        value: "Difúze probíhá jen v kapalinách a plynech.",
        why: "V pevných látkách probíhá také, jen ze všech tří skupenství nejpomaleji.",
      },
    ],
    h0: "Pokus trval pět let, a přesto se něco stalo. Zeptej se, co se v pevném kovu vůbec může hýbat.",
    h1: "Částice se pohybují v každém skupenství, liší se jen tím jak. V plynu létají volně, v kapalině se posouvají kolem sebe a v pevné látce kmitají kolem svých stálých míst. Právě proto je difúze v pevné látce nejpomalejší ze všech — ale nezastaví se, jen potřebuje mnohem víc času.",
    vysvetleni:
      "Difúze probíhá ve všech třech skupenstvích, nejrychleji v plynech a nejpomaleji v pevných látkách. Tenhle pokus se skutečně dělal a je jedním z důkazů, že částice pevné látky nestojí na místě.",
  },
  {
    otazka:
      "Nafouknutý balonek necháš viset v pokoji. Za pár dní je splasklý, i když na něm není ani jedna dírka. Co se stalo?",
    klic: "Částice plynu se prosmýkly mezi částicemi gumy a postupně unikly ven.",
    chybne: [
      {
        value: "Guma se sama od sebe smrštila.",
        why: "Guma se sama nesmrští. Kdyby plyn zůstal uvnitř, balonek by zůstal napnutý.",
      },
      {
        value: "Vzduch uvnitř zestárl a zmenšil svůj objem.",
        why: "Vzduch nestárne. Ubylo ho, protože jeho částice odešly ven skrz gumu.",
      },
      {
        value: "V balonku musí být dírka, jinak by to nešlo.",
        why: "Nemusí. Mezi částicemi gumy jsou mezery a částice plynu jsou tak malé, že jimi projdou.",
      },
    ],
    h0: "Guma je pro tvoje oko souvislá, jenže na úrovni částic souvislá není.",
    h1: "I pevná látka je poskládaná z částic a mezi nimi jsou mezery. Částice plynu jsou o hodně menší, takže se těmi mezerami dokážou po jedné prodrat ven. Je to pomalá difúze skrz stěnu — u tenkého balonku ji poznáš za pár dní, u silnější nádoby by trvala mnohem déle.",
    vysvetleni:
      "Balonek splaskne difúzí plynu skrz stěnu. Částice plynu procházejí mezerami mezi částicemi gumy, a čím menší částice plyn má, tím dřív balonek splaskne.",
  },
  {
    otazka:
      "V rohu místnosti otevřeš lahvičku s voňavkou. Vzduch nikde neproudí, a přesto vůni za chvíli cítíš i u protější stěny. Proč?",
    klic: "Částice vůně se samy pohybují a promíchají se s částicemi vzduchu.",
    chybne: [
      {
        value: "Vzduch v místnosti vždycky trochu proudí a vůni roznese.",
        why: "Průvan to urychlí, ale difúze proběhne i v úplně klidném vzduchu.",
      },
      {
        value: "Vůně je lehčí než vzduch, takže vystoupá ke stropu a odtud padá dolů.",
        why: "Pak by byla cítit napřed u stropu a teprve potom dole. Ona se ale šíří do všech stran naráz.",
      },
      {
        value: "Voňavka ohřeje vzduch kolem sebe a ten vůni odnese.",
        why: "Voňavka vzduch neohřívá. Částice vůně se pohybují samy, i když je všude stejná teplota.",
      },
    ],
    h0: "Zadání schválně říká, že vzduch neproudí. Bez proudění musí vůni přenést něco jiného.",
    h1: "Částice vůně se od okamžiku otevření lahvičky pohybují na všechny strany a cestou se míchají mezi částice vzduchu. Tomu se říká difúze a nepotřebuje k ní ani průvan, ani teplo navíc. Průvan by ji jen urychlil, protože by celé chuchvalce vzduchu přemístil naráz.",
    vysvetleni:
      "Vůně se šíří difúzí: její částice se neuspořádaně pohybují a promíchávají se se vzduchem. V plynu je difúze nejrychlejší ze všech skupenství, proto ji poznáš během chvilky.",
  },
  {
    otazka: "Ve kterém skupenství proběhne difúze nejrychleji?",
    klic: "v plynném",
    chybne: [
      {
        value: "v kapalném",
        why: "V kapalině je difúze pomalejší než v plynu — částice se tam tísní vedle sebe a navzájem si překážejí.",
      },
      {
        value: "v pevném",
        why: "V pevné látce je difúze vůbec nejpomalejší. Částice tam jen kmitají kolem svých míst.",
      },
      {
        value: "ve všech třech stejně rychle",
        why: "Stejně rychle ne. Rozhoduje, jak volně se částice mohou pohybovat, a to se skupenství od skupenství hodně liší.",
      },
    ],
    h0: "Srovnej, jak volně se částice v jednotlivých skupenstvích mohou pohybovat.",
    h1: "Rychlost difúze závisí na tom, jak velké mezery mezi částicemi jsou a jak volně se v nich částice pohybují. V plynu jsou mezery obrovské a částice létají volně, v kapalině se posouvají natěsno kolem sebe a v pevné látce zůstávají na svých místech. Podle toho si skupenství seřaď.",
    vysvetleni:
      "Difúze je nejrychlejší v plynech, pomalejší v kapalinách a nejpomalejší v pevných látkách. Rozhoduje volnost pohybu částic a velikost mezer mezi nimi.",
  },
  {
    otazka:
      "Čerstvé okurky zaliješ slaným nálevem s kořením a necháš je několik dní v klidu stát. Po pár dnech jsou slané a okořeněné i uvnitř. Jak se tam sůl dostala?",
    klic: "Částice soli a koření pronikly difúzí z nálevu dovnitř okurky.",
    chybne: [
      {
        value: "Okurka nálev nasála dírkami ve slupce jako houba.",
        why: "Okurka žádné takové dírky nemá. Částice soli se dostávají dovnitř mezi částice okurky, ne kanálky.",
      },
      {
        value: "Nálev je nutné každý den promíchat, jinak dovnitř nic nepronikne.",
        why: "Míchání by děj urychlilo, ale potřeba není. Difúze proběhne i v naprostém klidu.",
      },
      {
        value: "Sůl se uvnitř okurky sama vytvořila.",
        why: "Sůl nevzniká z ničeho. Všechna, kterou v okurce najdeš, přišla z nálevu.",
      },
    ],
    h0: "Sklenice s okurkami celou dobu stála. Musí tedy stačit to, co se děje samo od sebe.",
    h1: "Částice soli a koření se v nálevu neustále pohybují a při tom pronikají i do okurky, kde jich je málo. Přesně tak funguje každé nakládání i solení masa — nic se nemíchá a stejně to projde skrz naskrz. Jediné, co je k tomu potřeba, je čas.",
    vysvetleni:
      "Nakládání je difúze v kapalině. Částice soli a koření se samovolně promíchávají a pronikají tam, kde jich je méně — tedy dovnitř okurky.",
  },
  {
    otazka: "Odkud se v rybníce bere kyslík, který ryby dýchají?",
    klic: "Molekuly kyslíku ze vzduchu pronikají difúzí přes hladinu do vody.",
    chybne: [
      {
        value: "Ryby si ho berou přímo z molekul vody.",
        why: "Kyslík je v molekule vody pevně spojený s vodíkem a ryby ho z ní uvolnit neumějí. Dýchají kyslík rozpuštěný mezi molekulami vody.",
      },
      {
        value: "Dostane se do ní jen tam, kde voda teče přes jez.",
        why: "Peřej to hodně urychlí, protože promíchá vodu se vzduchem. Do úplně klidné hladiny ale kyslík přechází také.",
      },
      {
        value: "Vzniká ve vodě sám, když se voda ohřeje.",
        why: "Teplem kyslík nevzniká. Teplá voda ho naopak udrží méně než studená.",
      },
    ],
    h0: "Nad hladinou je vzduch a v něm spousta kyslíku. Zbývá vysvětlit, jak se dostane pod hladinu.",
    h1: "Na rozhraní vzduchu a vody se částice obou látek neustále potkávají a míchají, takže molekuly kyslíku přecházejí do vody a zůstávají rozpuštěné mezi jejími molekulami. Proto se do akvárií dává vzduchování — bublinky zvětší plochu, na které se voda se vzduchem potkává.",
    vysvetleni:
      "Kyslík se do vody dostává difúzí přes hladinu a zůstává v ní rozpuštěný. Ryby ho odebírají žábrami, ne z molekul vody.",
  },
  {
    otazka: "Proč proběhne difúze v teplé látce rychleji než ve studené?",
    klic: "Částice se při vyšší teplotě pohybují rychleji, takže se promíchají dřív.",
    chybne: [
      {
        value: "Teplem se částice zvětší a zaberou víc místa.",
        why: "Částice si svou velikost drží. Teplem se mění rychlost jejich pohybu a rozestupy mezi nimi, ne ony samy.",
      },
      {
        value: "Teplem částic přibude.",
        why: "Počet částic se zahřátím nemění. Kdyby přibývaly, byla by zahřátá látka těžší.",
      },
      {
        value: "Teplo částice rozpustí a ty pak lépe procházejí.",
        why: "Teplo částice nerozpouští. Jen je rozpohybuje rychleji.",
      },
    ],
    h0: "Teplota látky je vlastně údaj o tom, jak rychle se v ní částice pohybují.",
    h1: "Čím vyšší teplota, tím rychleji se částice pohybují. Rychlejší částice urazí za stejnou dobu delší dráhu a častěji se potkají s částicemi té druhé látky, takže se obě promíchají dřív. Pozor na dvě obvyklé záměny: teplem se částice ani nezvětšují, ani jich nepřibývá.",
    vysvetleni:
      "Rychlost difúze roste s teplotou, protože teplota je mírou rychlosti neuspořádaného pohybu částic. Velikost ani počet částic se přitom nemění.",
  },
  {
    otazka:
      "Inkoust se ve sklenici rozptýlil do celé vody. Proč se sám nestáhne zpátky do jedné kapky, ani kdybys čekal sebedéle?",
    klic: "Částice se pohybují bez jakéhokoli řádu na všechny strany, takže se samy do jednoho místa neseřadí.",
    chybne: [
      {
        value: "Protože je voda příliš studená; v horké by se kapka zase složila.",
        why: "Teplem by se pohyb částic jen zrychlil. Směr mu nedá ani horká voda.",
      },
      {
        value: "Protože se částice inkoustu přilepily na částice vody.",
        why: "Nic se nelepí. Částice inkoustu se mezi částicemi vody volně pohybují dál.",
      },
      {
        value: "Protože se částice inkoustu ve vodě rozpadly na menší.",
        why: "Nerozpadly se. Jsou celé a pořád ve sklenici, jen rozmístěné po celém objemu.",
      },
    ],
    h0: "Zamysli se nad tím, jestli má pohyb částic nějaký směr nebo řád.",
    h1: "Difúze má jediný směr proto, že se částice pohybují bez jakéhokoli řádu. Z místa, kde jich je hodně, se jich hodně rozběhne pryč — a odjinud jich zpátky přiletí jen málo. Rozptýlení je tím pádem výsledkem obrovského množství náhod a ty se samy do původního uspořádání nevrátí.",
    vysvetleni:
      "Difúze probíhá samovolně jen jedním směrem: od většího nahromadění k menšímu. Zpátky by se látky musely dostat zásahem zvenčí, samy se neseřadí.",
  },
  {
    otazka:
      "Do jedné sklenice s vodou a do druhé s hustým sirupem kápneš stejnou kapku barviva. Obě jsou stejně teplé a obě necháš v klidu stát. Kde se barva rozšíří pomaleji?",
    klic: "v sirupu",
    chybne: [
      {
        value: "ve vodě",
        why: "Ve vodě se částice posouvají snáz než v hustém sirupu, takže je difúze naopak rychlejší.",
      },
      {
        value: "v obou stejně rychle",
        why: "Stejně ne. Čím hustší kapalina, tím obtížněji se v ní částice protlačují kolem sebe.",
      },
      {
        value: "v sirupu se barva nerozšíří vůbec",
        why: "Rozšíří, jen to trvá mnohem déle. Sirup je pořád kapalina a jeho částice se pohybují.",
      },
    ],
    h0: "Obě kapaliny jsou stejně teplé. Liší se tím, jak snadno se v nich dá pohybovat.",
    h1: "Rychlost difúze závisí nejen na teplotě, ale i na tom, jak volně se částice mohou posouvat kolem sebe. V hustém sirupu si překážejí mnohem víc než ve vodě, takže se barvivo protlačuje pomaleji. Je to týž důvod, proč je difúze v pevné látce nejpomalejší ze všech.",
    vysvetleni:
      "Čím hustší kapalina, tím pomalejší difúze. Částice se v ní obtížněji posouvají kolem sebe, i když se pohybují stejně živě jako ve vodě.",
  },
  {
    otazka:
      "Do hrnce s polévkou nasypeš sůl a vůbec nezamícháš. Co bude s polévkou za několik hodin?",
    klic: "Bude slaná v celém hrnci.",
    chybne: [
      {
        value: "Slaná bude jen u dna, kde sůl leží.",
        why: "Ze začátku ano. Částice soli se ale samy rozejdou po celém hrnci.",
      },
      {
        value: "Slaná bude jen ta vrstva, do které sůl klesla.",
        why: "Difúze se nezastaví na žádné vrstvě. Částice soli se postupně dostanou všude.",
      },
      {
        value: "Sůl zůstane na dně nerozpuštěná, dokud se nezamíchá.",
        why: "Míchání rozpouštění urychlí, ale není k němu potřeba — částice vody se pohybují samy.",
      },
    ],
    h0: "Zeptej se, jestli částice soli potřebují ke svému rozchodu po hrnci lžíci.",
    h1: "Po rozpuštění se částice soli pohybují mezi částicemi polévky na všechny strany. Z místa, kde jich je nejvíc, se jich nejvíc rozběhne pryč, takže se postupně rozmístí rovnoměrně po celém objemu. Míchání celý děj zkrátí z hodin na vteřiny, ale výsledek je stejný.",
    vysvetleni:
      "Rozpuštěná sůl se hrncem rozšíří difúzí i bez míchání. Míchání jen zrychlí to, co by se stalo samo.",
  },
  {
    otazka:
      "Kousek rozkrojené cibule necháš na talíři v lednici. Druhý den je cibulí cítit i máslo v úplně jiné přihrádce. Čím to je?",
    klic: "Částice vůně z cibule se pohybovaly vzduchem a difúzí pronikly i do másla.",
    chybne: [
      {
        value: "V lednici běží ventilátor, který vůni rozfoukal.",
        why: "Proudění by děj urychlilo, ale difúze proběhne i v úplně klidném vzduchu.",
      },
      {
        value: "Máslo se od cibule nakazilo bakteriemi.",
        why: "S bakteriemi to nesouvisí. Cítíš částice vůně, které se do másla dostaly vzduchem.",
      },
      {
        value: "Chlad v lednici vůni zesiluje, a proto je cítit dál.",
        why: "Chlad vůni naopak tlumí. Právě proto se potraviny chladí.",
      },
    ],
    h0: "Cibule s máslem se nikdy nedotkly. Mezi nimi byl jen vzduch.",
    h1: "Z cibule se uvolňují částice vůně, ty se promíchají se vzduchem v lednici a nakonec pronikají i do másla. Difúze proběhne postupně přes obě rozhraní: z cibule do vzduchu a ze vzduchu do másla. V chladu je pomalá, proto to trvá celý den a ne pár minut.",
    vysvetleni:
      "Vůně přešla difúzí z cibule do vzduchu a ze vzduchu do másla. Proto se silně vonící potraviny ukládají do uzavřených nádob — stěna nádoby difúzi zastaví.",
  },
];

const BROWN: Polozka[] = [
  {
    otazka:
      "V kapce vody, která stojí naprosto v klidu, sleduješ pod mikroskopem zrnko pylu. Neustále se nepravidelně cuká sem a tam. Co ho rozhýbává?",
    klic: "Ze všech stran do něj narážejí molekuly vody a nárazy se nikdy přesně nevyrovnají.",
    chybne: [
      {
        value: "Pylové zrnko je živé a plave si samo.",
        why: "Stejně se cuká i zrnko sazí nebo rozdrceného skla, které živé není. Život to tedy být nemůže.",
      },
      {
        value: "Voda v kapce proudí a zrnko unáší.",
        why: "Kdyby voda proudila, plula by všechna zrnka stejným směrem. Ona se přitom cukají každé jinam.",
      },
      {
        value: "Zrnko je lehčí než voda, a proto stoupá vzhůru.",
        why: "Pak by se pohybovalo pořád jedním směrem. Ono se ale hází nahoru, dolů i do stran.",
      },
    ],
    h0: "Zadání ti zavírá dvě cesty naráz: kapka stojí v klidu a pohyb je nepravidelný.",
    h1: "Když vyloučíš proudění, život i klesání, zbude jediné vysvětlení — do zrnka musí něco strkat. Nic jiného než částice vody v kapce tam není. Naráží jich do zrnka ohromné množství ze všech stran, jenže pokaždé trochu jinak, takže se převaha jednou nakloní sem a hned nato jinam.",
    vysvetleni:
      "Neuspořádaný pohyb drobných zrnek v kapalině nebo plynu se jmenuje Brownův pohyb. Způsobují ho nárazy molekul, které se ze všech stran nikdy úplně nevyrovnají.",
  },
  {
    otazka:
      "Dvě zrnka pylu leží v kapce vody kousek od sebe. Jak se budou pohybovat?",
    klic: "Každé nezávisle na tom druhém a pokaždé jiným směrem.",
    chybne: [
      {
        value: "Obě stejným směrem, protože je unáší tentýž proud vody.",
        why: "Právě tohle se nestane a je to důkaz, že v kapce žádný proud není.",
      },
      {
        value: "Obě k sobě, protože se zrnka navzájem přitahují.",
        why: "Zrnka se nepřitahují. Každé řídí jen nárazy molekul, které se u něj zrovna sejdou.",
      },
      {
        value: "Obě od sebe do stran, jako by se odpuzovala.",
        why: "Ani to ne. Směr pohybu je náhodný a nemá žádné pravidlo.",
      },
    ],
    h0: "Zkus domyslet, jak by pokus dopadl, kdyby zrnka nesl proud vody.",
    h1: "Tohle pozorování je vlastně celý důkaz. Proud vody by všechna zrnka nesl stejným směrem a to by vypadalo úplně jinak. Když se každé cuká jinam, musí ho řídit něco, co působí zvlášť u něj — a to jsou nárazy molekul v jeho nejbližším okolí.",
    vysvetleni:
      "Zrnka se v Brownově pohybu pohybují nezávisle na sobě. Právě tím se pozná, že je nenese proudění, ale náhodné nárazy částic.",
  },
  {
    otazka:
      "Pod mikroskopem sleduješ malé i velké zrnko v téže kapce vody. Velké se cuká mnohem méně. Proč?",
    klic: "Do velkého zrnka naráží tolik molekul najednou, že se nárazy z různých stran skoro vyrovnají.",
    chybne: [
      {
        value: "Velké zrnko je těžké, takže do něj molekuly nenarazí.",
        why: "Narážejí do něj pořád, a dokonce jich je víc. Jen se jejich účinky navzájem srovnají.",
      },
      {
        value: "Kolem velkého zrnka je molekul vody méně.",
        why: "Molekul je všude v kapce stejně nahusto. Velikost zrnka na to nemá vliv.",
      },
      {
        value: "Velké zrnko se cuká stejně, jen to není vidět.",
        why: "Rozdíl je skutečný a dá se změřit. Není to klam oka.",
      },
    ],
    h0: "Přemýšlej, kolik molekul narazí za okamžik do malého zrnka a kolik do velkého.",
    h1: "U malého zrnka se v jednom okamžiku potká jen několik nárazů, takže stačí pár navíc z jedné strany a zrnko sebou trhne. Do velkého zrnka jich mezitím buší celé zástupy ze všech stran naráz a jejich převaha se skoro vyruší. Proto se velké zrnko sotva hne, zatímco malé lítá.",
    vysvetleni:
      "Čím menší zrnko, tím výraznější Brownův pohyb. U velkých těles se nárazy vyrovnají natolik, že žádné cukání nepozorujeme.",
  },
  {
    otazka: "Co při Brownově pohybu v mikroskopu skutečně uvidíš?",
    klic: "Jen zrnko. Molekuly vody jsou příliš malé, než aby je mikroskop ukázal.",
    chybne: [
      {
        value: "Zrnko i jednotlivé molekuly vody, jak do něj narážejí.",
        why: "Molekuly jsou mnohotisíckrát menší než zrnko a v mikroskopu je nevidíš. Poznáš je jen podle toho, co se zrnkem dělají.",
      },
      {
        value: "Jen molekuly vody, zrnko je na ně moc velké.",
        why: "Je to přesně naopak — zrnko je jediné, co je vidět.",
      },
      {
        value: "Zrnko a mezery mezi molekulami vody.",
        why: "Mezery mezi molekulami jsou ještě menší než molekuly samotné. Vidět nejsou.",
      },
    ],
    h0: "Srovnej si velikost zrnka a velikost molekuly vody.",
    h1: "Brownův pohyb je tak cenný právě proto, že ukazuje něco neviditelného přes něco viditelného. Molekuly zůstávají skryté, ale jejich nárazy pohnou zrnkem, které už vidět je. Je to stejné, jako když z pohupování bójky poznáš vlny, i kdybys na hladinu neviděl.",
    vysvetleni:
      "V mikroskopu je vidět jen zrnko. Pohyb molekul se z něj dá odvodit, ale samotné molekuly viditelné nejsou — a právě proto byl Brownův pohyb důkazem jejich existence.",
  },
  {
    otazka: "Kapku s pylovými zrnky opatrně zahřeješ. Co se stane s jejich cukáním?",
    klic: "Bude rychlejší, protože molekuly vody narážejí častěji a prudčeji.",
    chybne: [
      {
        value: "Ustane, protože se voda začne vypařovat.",
        why: "Vypařování probíhá na hladině a zrnkům nevadí. Pohyb se naopak zrychlí.",
      },
      {
        value: "Zpomalí se, protože teplá voda klade menší odpor.",
        why: "Menší odpor by pohyb neztlumil. A hlavně: v teple se molekuly pohybují rychleji.",
      },
      {
        value: "Nezmění se, teplota s pohybem zrnka nesouvisí.",
        why: "Souvisí, a hodně. Teplota je mírou rychlosti pohybu částic.",
      },
    ],
    h0: "Cukání zrnka řídí molekuly vody. Zeptej se tedy, co s nimi udělá zahřátí.",
    h1: "Vyšší teplota znamená rychlejší pohyb molekul vody. Rychlejší molekuly do zrnka narážejí častěji a při každém nárazu mu předají víc, takže zrnko poskakuje živěji. Brownův pohyb se tím stává i nepřímým teploměrem — z jeho živosti se dá poznat, jak je látka teplá.",
    vysvetleni:
      "S rostoucí teplotou je Brownův pohyb výraznější. Ukazuje se tím, že teplota látky je vlastně mírou rychlosti neuspořádaného pohybu jejích částic.",
  },
  {
    otazka:
      "Na dně sklenice leží zrnko písku. Proč u něj žádné cukání nepozoruješ, i když do něj molekuly vody narážejí?",
    klic: "Zrnko písku je proti molekulám obrovské a těžké, takže se nárazy ze všech stran vyrovnají.",
    chybne: [
      {
        value: "Písek je pevná látka, a proto na něj molekuly vody nepůsobí.",
        why: "Působí na každé těleso bez rozdílu. Pylové zrnko je také pevné a cuká se.",
      },
      {
        value: "U dna už žádné molekuly vody nejsou.",
        why: "Molekuly jsou v celé sklenici, u dna stejně jako u hladiny.",
      },
      {
        value: "Cuká se, jen je ten pohyb pro oko moc rychlý.",
        why: "Pohyb tam prakticky není, ne že by byl rychlý. Nárazy se na tak velkém tělese vyruší.",
      },
    ],
    h0: "Vzpomeň si na rozdíl mezi malým a velkým zrnkem a dovedni ho do konce.",
    h1: "Čím je těleso větší, tím víc molekul do něj naráží naráz a tím dokonaleji se převahy z jednotlivých stran vyruší. Zrnko písku je proti molekule vody jako hora proti kamínku, takže výsledná převaha nestačí ani na to, aby s ním pohnula. Brownův pohyb proto vidíme jen u velmi drobných částeček.",
    vysvetleni:
      "Brownův pohyb je pozorovatelný jen u tělísek srovnatelně drobných, řádově tisícin milimetru. U větších těles se nárazy molekul dokonale vyrovnají.",
  },
  {
    otazka:
      "Zakreslíš dráhu, po které se pylové zrnko během minuty pohybovalo. Jak bude vypadat?",
    klic: "jako lomená čára, která pořád mění směr",
    chybne: [
      {
        value: "jako přímka mířící stále stejným směrem",
        why: "Přímka by znamenala, že zrnko něco tlačí jedním směrem. Nárazy molekul přicházejí ze všech stran.",
      },
      {
        value: "jako kruh, po kterém zrnko obíhá dokola",
        why: "Kruh je pravidelná dráha a Brownův pohyb žádné pravidlo nemá.",
      },
      {
        value: "jako pravidelné kmitání sem a tam",
        why: "Kmitání by se opakovalo se stejným rozkmitem. Tenhle pohyb se neopakuje nikdy.",
      },
    ],
    h0: "Pohyb je neuspořádaný — a to musí být na obrázku dráhy poznat.",
    h1: "Zrnko urazí kousek jedním směrem, pak do něj z jiné strany narazí převaha molekul a ono zahne. Výsledkem je klikatá lomená čára bez jakéhokoli řádu, kde se úseky liší délkou i směrem. Kdyby dráha byla přímka, kruh nebo pravidelné kmitání, muselo by za ní stát něco uspořádaného.",
    vysvetleni:
      "Dráha zrnka při Brownově pohybu je nepravidelná lomená čára. Její nahodilost je právě tím, co dokazuje neuspořádaný pohyb molekul.",
  },
  {
    otazka:
      "Proč se Brownův pohyb považuje za důkaz toho, že se látky skládají z částic?",
    klic: "Zrnkem muselo něco strkat a nic jiného než neviditelné částice kapaliny v kapce není.",
    chybne: [
      {
        value: "Protože se zrnko pod mikroskopem rozpadlo na jednotlivé částice.",
        why: "Zrnko se nerozpadá. Zůstává celé a jen se cuká.",
      },
      {
        value: "Protože jsou pod mikroskopem částice kapaliny vidět.",
        why: "Vidět nejsou. Poznají se jedině podle toho, co dělají se zrnkem.",
      },
      {
        value: "Protože se zrnko pohybuje pravidelně jako hodiny.",
        why: "Pohybuje se nepravidelně. Kdyby byl pohyb pravidelný, ukazoval by spíš na nějaký stroj než na náhodné nárazy.",
      },
    ],
    h0: "Vyjmenuj si, co všechno bylo v pokusu vyloučeno, a podívej se, co zbylo.",
    h1: "Postup je stejný jako u detektiva. Kapka stojí, takže odpadá proudění. Cukají se i neživá zrnka, takže odpadá život. Sousední zrnka míří jinam, takže odpadá společná příčina zvenčí. Zbude jediné: do zrnka naráží něco velmi malého a velmi početného, co samo vidět není.",
    vysvetleni:
      "Brownův pohyb je nepřímý důkaz částicové stavby látek. Částice samotné vidět nejsou, ale jejich nárazy pohnou tělískem, které vidět je.",
  },
  {
    otazka:
      "V uzavřené skleněné krabičce se vzduchem sleduješ pod mikroskopem částečky kouře. Vzduch v krabičce nikam neproudí, a přesto se částečky nepravidelně cukají. Co z toho plyne?",
    klic: "Brownův pohyb probíhá i v plynech, protože i molekuly vzduchu se neustále pohybují.",
    chybne: [
      {
        value: "Krabička netěsní a dovnitř fouká.",
        why: "Krabička je uzavřená. A i kdyby foukalo, letěly by částečky společně jedním směrem.",
      },
      {
        value: "Brownův pohyb je jen v kapalinách, tohle musí být něco jiného.",
        why: "Je to totéž. Molekuly se pohybují v každém skupenství, tedy i ve vzduchu.",
      },
      {
        value: "Kouř je horký, a proto sám stoupá vzhůru.",
        why: "Stoupání by byl pohyb jedním směrem. Tyhle částečky se cukají na všechny strany.",
      },
    ],
    h0: "Porovnej to s pylem v kapce vody. Co je jinak a co zůstává stejné?",
    h1: "Jediný rozdíl proti pokusu s pylem je skupenství okolní látky. Molekuly vzduchu se pohybují dokonce rychleji než molekuly vody, jen jich je v každém okamžiku u částečky méně, protože jsou v plynu daleko od sebe. Výsledek je stejný: náhodné nárazy, které se nikdy nevyrovnají, a nepravidelné poskakování.",
    vysvetleni:
      "Brownův pohyb probíhá v kapalinách i v plynech. V obou skupenstvích ho způsobuje týž neuspořádaný pohyb molekul okolní látky.",
  },
  {
    otazka: "Co mají společného difúze a Brownův pohyb?",
    klic: "Obojí způsobuje neustálý neuspořádaný pohyb částic.",
    chybne: [
      {
        value: "Obojí potřebuje proudění nebo míchání.",
        why: "Ani jedno. Obojí proběhne i v naprosto klidné látce.",
      },
      {
        value: "Obojí probíhá jen v kapalinách.",
        why: "Obojí se odehrává i v plynech a difúze dokonce i v pevných látkách.",
      },
      {
        value: "Obojí ustane, jakmile látku ochladíš.",
        why: "Ochlazením se to jen zpomalí. Zastavit se to nedá.",
      },
    ],
    h0: "Obojí má stejnou příčinu, jen se pokaždé pozná na něčem jiném.",
    h1: "U difúze se pohyb částic pozná podle toho, že se dvě látky samy promíchají. U Brownova pohybu podle toho, že se cuká viditelné zrnko. Příčina je přitom jediná — částice se neustále a neuspořádaně pohybují. Obojí je proto jen dvojí pohled na tutéž věc.",
    vysvetleni:
      "Difúze i Brownův pohyb jsou projevy téhož: neustálého neuspořádaného pohybu částic. Liší se jen tím, na čem se dají pozorovat.",
  },
  {
    otazka:
      "Kapku s pylem necháš stát celý den ve tmě, v naprostém klidu a v chladné místnosti. Co uvidíš druhý den pod mikroskopem?",
    klic: "Zrnka se budou cukat dál, jen o něco pomaleji.",
    chybne: [
      {
        value: "Zrnka budou v klidu, protože se všechno usadilo.",
        why: "Brownův pohyb nikdy neustává. Klid, tma ani čas ho nezastaví.",
      },
      {
        value: "Zrnka se budou cukat rychleji, protože se za noc nahromadila energie.",
        why: "Nic se nehromadí. V chladu se pohyb naopak trochu zpomalí.",
      },
      {
        value: "Zrnka zmizí, protože se ve vodě rozpustí.",
        why: "Pyl se ve vodě nerozpouští. Zůstane tam a bude se cukat dál.",
      },
    ],
    h0: "Ptej se, co by muselo molekuly vody přimět, aby se zastavily.",
    h1: "Pohyb částic není nic, co by se dalo spotřebovat nebo co by se opotřebovalo. Dokud má látka nějakou teplotu, částice se pohybují — a teplotu má vždycky. V chladu jsou pomalejší, takže bude cukání o něco línější, ale nezmizí ani po roce.",
    vysvetleni:
      "Brownův pohyb je trvalý a neustávající. Ochlazením se zpomalí, ale zastavit ho nelze, protože pohyb částic nikdy neustává.",
  },
  {
    otazka:
      "Molekuly vzduchu se řítí rychleji než dopravní letadlo. Přesto ti vůně z druhého konce pokoje dojde k nosu až za desítky vteřin. Proč to trvá tak dlouho?",
    klic: "Molekuly do sebe cestou neustále narážejí, takže postupují klikatě a přímou cestu neurazí.",
    chybne: [
      {
        value: "Molekuly vůně jsou o mnoho pomalejší než molekuly vzduchu.",
        why: "O něco pomalejší jsou, ale zdaleka ne tolik. Zdržují je hlavně srážky, ne malá rychlost.",
      },
      {
        value: "Velká rychlost platí až pro horký vzduch, v pokoji je pohyb pomalý.",
        why: "I v pokoji se molekuly pohybují stovkami metrů za vteřinu. Jen se skoro nikam nedostanou.",
      },
      {
        value: "Vůně se šíří, teprve až se vzduch v pokoji dá do pohybu.",
        why: "Nemusí se hýbat vůbec. Difúze proběhne i v naprosto klidném vzduchu.",
      },
    ],
    h0: "Rychlost není totéž co vzdálenost od startu, když se cestou pořád zahýbá.",
    h1: "Molekula vůně sice letí ohromnou rychlostí, jenže po pár tisícinách milimetru narazí do molekuly vzduchu a odrazí se jinam. Za vteřinu takových srážek zažije nepředstavitelné množství, takže urazí obrovskou dráhu, ale od místa startu se vzdálí jen o kousek. Proto je difúze v plynu nejrychlejší ze všech skupenství, a přesto na lidský pohled pomalá.",
    vysvetleni:
      "Molekuly se pohybují velmi rychle, ale kvůli neustálým srážkám postupují klikatou dráhou. Vzdálenost od výchozího místa proto roste mnohem pomaleji než ušlá dráha.",
  },
];

const KROKY_L2 = [
  "Zjisti, co se v situaci promíchalo s čím.",
  "Ptej se, jestli to šlo i bez míchání a bez proudění.",
  "Difúze je samovolné promíchání způsobené pohybem částic a probíhá ve všech skupenstvích.",
];

const KROKY_L3 = [
  "Vylučuj: proudění, život, klesání, stoupání.",
  "Co zbude, musí být příčinou — nárazy neviditelných částic.",
  "Menší tělísko a vyšší teplota znamenají výraznější Brownův pohyb.",
];

function zBanky(p: Polozka, kroky: string[]): PracticeTask {
  return task(p.otazka, p.klic, p.chybne, {
    hints: [p.h0, p.h1],
    solutionSteps: kroky,
    explanation: p.vysvetleni,
  });
}

function gen(level: number): PracticeTask[] {
  return ruzneUlohy(() =>
    level === 1
      ? genL1()
      : level === 2
        ? zBanky(pick(DIFUZE), KROKY_L2)
        : zBanky(pick(BROWN), KROKY_L3),
  );
}

export const POHYB_CASTIC: TopicMetadata[] = [
  {
    id: "g6-fyz-pohyb-castic-6",
    rvpNodeId: "g6-fyzika-latky-a-telesa-casticova-stavba-latek-pohyb-castic-difuze-brownuv-pohyb",
    displayName: "Pohyb částic",
    title: "Pohyb částic – difuze, Brownův pohyb",
    studentTitle: "Pohyb částic",
    subject: "fyzika",
    category: "Látky a tělesa",
    topic: "Částicová stavba látek",
    briefDescription: "Částice se nikdy nezastaví — a poznáš to na vůni i pod mikroskopem.",
    keywords: [
      "difúze", "Brownův pohyb", "pohyb částic", "neuspořádaný pohyb",
      "teplota a rychlost částic", "promíchání látek", "nárazy molekul",
    ],
    goals: [
      "Určit podle teploty, ve které ze dvou stejných situací proběhne děj dřív.",
      "Vysvětlit běžné jevy difúzí a poznat ji i v pevných látkách.",
      "Odvodit z pozorování Brownova pohybu, že do tělíska narážejí neviditelné částice.",
    ],
    boundaries: [
      "Bez difúzního koeficientu, střední volné dráhy a jakýchkoli vzorců.",
      "Bez osmózy a polopropustných blan — ty patří do přírodopisu.",
      "Bez stavby atomu a bez chemických značek.",
      "Rychlost částic se popisuje slovy, nepočítá se.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-atomy-molekuly-6"],
    generator: gen,
    helpTemplate: {
      hint: "Částice se pohybují pořád a samy od sebe. Čím je látka teplejší, tím rychleji.",
      steps: [
        "U dvou stejných pokusů rozhoduje teplota — vyšší znamená rychlejší děj.",
        "Když se dvě látky promíchají samy, je to difúze. Proudění k ní potřeba není.",
        "Když se drobné tělísko cuká v klidné kapalině, narážejí do něj částice.",
      ],
      commonMistake: "Myslet si, že difúze potřebuje míchání nebo proud a že v pevné látce částice stojí.",
      example: "Balonek splaskne i bez dírky: částice plynu se prosmýknou mezerami mezi částicemi gumy.",
    },
  },
];
