import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a obsahovaly vymyšlené významy („les — typ šachové figurky,
// věž v nářečí“). Teď: L1 poznat slovo mnohoznačné a jednoznačné · L2 určit
// význam slova ve větě · L3 najít větu, kde má slovo stejný význam.

const MNOHOZNACNA: [string, string][] = [
  ["oko", "lidské oko, oko na punčoše, oka tuku na polévce"],
  ["koruna", "koruna krále, koruna stromu, česká koruna"],
  ["kohoutek", "malý kohout i vodovodní kohoutek"],
  ["list", "list stromu i list papíru"],
  ["jazyk", "jazyk v ústech i jazyk, kterým mluvíme"],
  ["zámek", "zámek ve městě i zámek u dveří"],
  ["noha", "noha člověka i noha stolu"],
  ["klíč", "klíč od dveří i houslový klíč"],
  ["myš", "myš na poli i počítačová myš"],
  ["křídlo", "křídlo ptáka, křídlo budovy i hudební nástroj"],
  ["pero", "ptačí pero i pero na psaní"],
  ["vlna", "mořská vlna i ovčí vlna"],
];
const JEDNOZNACNA: string[] = ["kyslík", "tužka", "pondělí", "sedmikráska", "trolejbus", "rohlík", "deštník", "brambora", "lednička", "žirafa", "tramvaj", "ponožka"];

function vyber(mnoho: boolean, i: number): PracticeTask {
  const [slovo, vyznamy] = MNOHOZNACNA[i % MNOHOZNACNA.length];
  const jedno = shuffle(JEDNOZNACNA).slice(0, 3);
  if (mnoho) {
    return choice("Které slovo je mnohoznačné (má víc významů)?", slovo,
      jedno.map((j) => ({ value: j, why: `„${j}“ má jen jeden význam — je jednoznačné.` })) as never, {
        hints: [
          `Zkus pro každé slovo vymyslet dvě různé věty. U kterého se význam změní? Začni třeba slovy „${jedno[0]}“ a „${jedno[1]}“.`,
          "Mnohoznačné slovo se hodí do vět o úplně jiných věcech — třeba do věty o přírodě i o penězích.",
        ],
        explanation: `„${slovo}“ je mnohoznačné: ${vyznamy}. Ostatní slova mají jeden význam.`,
      });
  }
  const [j, ...zbyle] = jedno;
  const dalsi = shuffle(MNOHOZNACNA.filter(([s]) => s !== slovo)).slice(0, 2);
  const d = [[slovo, vyznamy], ...dalsi].map(([s, v]) => ({ value: s, why: `„${s}“ je mnohoznačné: ${v}.` }));
  void zbyle;
  return choice("Které slovo je jednoznačné (má jen jeden význam)?", j, d as never, {
    hints: [
      `Zkus pro každé slovo vymyslet dvě různé věty. Má třeba „${slovo}“ nebo „${dalsi[0][0]}“ víc významů?`,
      "Jednoznačné slovo znamená pořád totéž, ať ho použiješ kdekoli; mnohoznačné se hodí do vět o různých věcech.",
    ],
    explanation: `„${j}“ má jen jeden význam — je jednoznačné. Ostatní slova jsou mnohoznačná.`,
  });
}

type Vyznam = { slovo: string; veta: string; spravne: string; jine: [string, string, string]; proc: string };
const VYZNAMY: Vyznam[] = [
  { slovo: "koruna", veta: "Ze stromu se ulomila celá koruna.", spravne: "horní část stromu s větvemi", jine: ["ozdoba na hlavě krále", "česká mince", "vrchol hory"], proc: "Mluví se o stromu, koruna je jeho horní část s větvemi." },
  { slovo: "koruna", veta: "Rohlík stojí tři koruny.", spravne: "česká peněžní jednotka", jine: ["ozdoba na hlavě krále", "horní část stromu", "zubní náhrada"], proc: "Mluví se o ceně — koruna je peníz." },
  { slovo: "oko", veta: "Na punčoše se jí pustilo oko.", spravne: "očko pleteniny", jine: ["orgán zraku", "kapka tuku na polévce", "otvor v síti na ryby"], proc: "Na punčoše je oko smyčka pleteniny, která se může pustit." },
  { slovo: "list", veta: "Napiš to na čistý list.", spravne: "kus papíru", jine: ["list stromu", "dopis", "list na kytaře"], proc: "Píše se na papír — list je kus papíru." },
  { slovo: "jazyk", veta: "Mluví třemi jazyky.", spravne: "řeč, kterou lidé mluví", jine: ["sval v ústech", "jazyk u boty", "plamen ohně"], proc: "Mluví třemi — jde o řeč, například češtinu nebo angličtinu." },
  { slovo: "zámek", veta: "Klíč se v zámku zasekl.", spravne: "zařízení na zamykání", jine: ["velká šlechtická stavba", "hrad na kopci", "sponka do vlasů"], proc: "Klíč se zasekl — zámek je zařízení na zamykání." },
  { slovo: "noha", veta: "Stůl má jednu nohu kratší.", spravne: "podpěra stolu", jine: ["končetina člověka", "tlapa zvířete", "pata hory"], proc: "Mluví se o stole — noha je jeho podpěra." },
  { slovo: "myš", veta: "Klikni myší na obrázek.", spravne: "ovladač počítače", jine: ["drobný hlodavec", "šedá barva", "past na hlodavce"], proc: "Klikat se dá počítačovou myší." },
  { slovo: "kohoutek", veta: "Zavři kohoutek, teče voda.", spravne: "uzávěr vody", jine: ["malý kohout", "ozdoba na střeše", "část pušky"], proc: "Teče voda — kohoutek je uzávěr vody." },
  { slovo: "křídlo", veta: "Ve škole otevřeli nové křídlo.", spravne: "boční část budovy", jine: ["část těla ptáka", "hudební nástroj", "část letadla"], proc: "Mluví se o škole — křídlo je část budovy." },
  { slovo: "pero", veta: "Našla v trávě pero z holuba.", spravne: "ptačí pírko", jine: ["nástroj na psaní", "pružina v hodinkách", "trávník"], proc: "Pero z holuba je ptačí pírko." },
  { slovo: "vlna", veta: "Svetr je z ovčí vlny.", spravne: "srst ovce", jine: ["pohyb vody na moři", "vlnitý pohyb ve vlasech", "kmitání zvuku"], proc: "Svetr z ovčí vlny — vlna je ovčí srst." },
  { slovo: "klíč", veta: "Na začátku notové osnovy je houslový klíč.", spravne: "značka na začátku notové osnovy", jine: ["nástroj na odemykání", "řešení hádanky", "nářadí na šrouby"], proc: "V notách je klíč značka na začátku osnovy." },
];

function vyznamUloha(v: Vyznam): PracticeTask {
  return choice(`Co znamená slovo „${v.slovo}“ ve větě „${v.veta}“?`, v.spravne,
    v.jine.map((j) => ({ value: j, why: `To je jiný význam slova „${v.slovo}“, který se do této věty nehodí.` })) as never, {
      hints: [
        `O čem věta „${v.veta}“ mluví?`,
        `Slovo „${v.slovo}“ má víc významů. Podívej se na ostatní slova ve větě — které z možných významů k nim sedí?`,
      ],
      explanation: v.proc,
    });
}

type Stejny = { slovo: string; vzor: string; spravne: string; jine: [string, string, string]; vyznam: string };
const STEJNE: Stejny[] = [
  { slovo: "oko", vzor: "Mrklo na mě jedním okem.", spravne: "Do oka mi spadla řasa.", jine: ["Na polévce plavala oka tuku.", "Pustilo se mi oko na punčoše.", "Rybář zašil oko v síti."], vyznam: "orgán zraku" },
  { slovo: "koruna", vzor: "Král nosil zlatou korunu.", spravne: "Princezně spadla koruna z hlavy.", jine: ["Lípa má hustou korunu.", "Zaplatil jsem dvacet korun.", "Zubař mi dal na zub korunku."], vyznam: "ozdoba na hlavě panovníka" },
  { slovo: "list", vzor: "Na podzim padá listí a každý list je jinak barevný.", spravne: "Na větvi zůstal poslední žlutý list.", jine: ["Podej mi list papíru.", "Poslal mi dlouhý list z tábora.", "Sešit má čtyřicet listů."], vyznam: "list stromu" },
  { slovo: "zámek", vzor: "Na kopci stojí starý zámek.", spravne: "Prohlédli jsme si zámek Lednice.", jine: ["Klíč nejde do zámku.", "Na kole mám zámek s kódem.", "Kufr má rozbitý zámek."], vyznam: "šlechtické sídlo" },
  { slovo: "jazyk", vzor: "Ve škole se učíme anglický jazyk.", spravne: "Čeština je náš mateřský jazyk.", jine: ["Kousl se do jazyka.", "Pes vyplázl jazyk.", "Bota má dlouhý jazyk."], vyznam: "řeč" },
  { slovo: "myš", vzor: "Kočka chytila myš.", spravne: "Ve spíži se objevila myš.", jine: ["Počítačová myš nefunguje.", "Kliknu myší na ikonu.", "Koupil jsem bezdrátovou myš."], vyznam: "hlodavec" },
  { slovo: "noha", vzor: "Uklouzl a zlomil si nohu.", spravne: "Bolí mě pravá noha.", jine: ["Stůl má kulaté nohy.", "Židli se ulomila noha.", "Lampa stojí na jedné noze."], vyznam: "končetina člověka" },
  { slovo: "pero", vzor: "Píšu úkol perem.", spravne: "Do penálu jsem si dal nové pero.", jine: ["Kohout má barevná pera.", "Našla jsem pero z vrány.", "Pták si čechrá pera."], vyznam: "nástroj na psaní" },
  { slovo: "vlna", vzor: "Na moři byly vysoké vlny.", spravne: "Vlna nás smáčela až po pás.", jine: ["Babička plete z vlny.", "Ovce dávají vlnu.", "Svetr je z jemné vlny."], vyznam: "vlna na vodě" },
  { slovo: "kohoutek", vzor: "Na dvoře kokrhal malý kohoutek.", spravne: "Kohoutek se schoval pod slepici.", jine: ["Kohoutek u vany kape.", "Otoč kohoutkem doprava.", "Zavřel kohoutek od plynu."], vyznam: "malý kohout" },
  { slovo: "klíč", vzor: "Ztratil jsem klíč od bytu.", spravne: "Klíč od sklepa visí u dveří.", jine: ["Houslový klíč se kreslí na začátek osnovy.", "Klíčem k úspěchu je trénink.", "Basový klíč se píše jinak."], vyznam: "nástroj na odemykání" },
  { slovo: "křídlo", vzor: "Pták si poranil křídlo.", spravne: "Holub mával křídly.", jine: ["V novém křídle školy jsou dílny.", "Pianista hraje na křídlo.", "Letadlo mělo poškozené křídlo."], vyznam: "část těla ptáka" },
];

function stejnyUloha(s: Stejny): PracticeTask {
  return choice(`Ve které větě má slovo „${s.slovo}“ stejný význam jako ve větě „${s.vzor}“?`, s.spravne,
    s.jine.map((j) => ({ value: j, why: `Tady má „${s.slovo}“ jiný význam než „${s.vyznam}“.` })) as never, {
      hints: [
        `Co znamená „${s.slovo}“ ve větě „${s.vzor}“?`,
        `Ve vzorové větě má „${s.slovo}“ význam „${s.vyznam}“. Hledej větu, kde znamená totéž, a ostatní vyřaď.`,
      ],
      explanation: `Ve větě „${s.spravne}“ znamená „${s.slovo}“ totéž co ve vzoru: ${s.vyznam}.`,
    });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(Array.from({ length: 16 }, (_, i) => vyber(i % 2 === 0, i)));
  if (level === 2) return shuffle(VYZNAMY.map(vyznamUloha));
  return shuffle(STEJNE.map(stejnyUloha));
}

export const SLOVAJEDNOZNACNAMNOHOZNACNAVICEVYZNAMOVA: TopicMetadata[] = [
  {
    id: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova",
    rvpNodeId: "g5-cjl-jazykova-vychova-nauka-o-slove-slova-jednoznacna-mnohoznacna-vicevyznamova",
    title: "Slova jednoznačná, mnohoznačná, vícevýznamová",
    studentTitle: "Vícevýznamová slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš slova, která mají více různých významů.",
    keywords: ["vícevýznamová", "jednoznačná", "mnohoznačná", "význam slova"],
    goals: [
      "Rozlišit jednoznačná a vícevýznamová slova",
      "Určit správný význam slova podle kontextu věty",
      "Uvést příklady různých významů daného slova",
    ],
    boundaries: [
      "Neprobírá se etymologie slov",
      "Bez hlubší sémantiky nebo jazykovědy",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Vícevýznamová slova mají více různých smyslů. Dívej se na okolní větu – ta ti poví, který smysl je správný.",
      steps: [
        "Přečti celou větu, nejen samotné slovo.",
        "Zamysli se, co by dávalo smysl v daném kontextu.",
        "Zkus si dosadit jiné slovo se stejným smyslem.",
      ],
      commonMistake: "Děti si pletou jednoznačná slova s vícevýznamovými – odborné termíny (kyslík, algebra) mají jen jeden smysl.",
      example: "Slovo 'klíč' – v notách je to hudební symbol, u dveří je to nástroj k odemkání.",
    },
  },
];
