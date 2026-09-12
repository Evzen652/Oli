import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby a obsahovaly vymyšlené významy („les — typ šachové figurky,
// věž v nářečí“). Teď: L1 poznat slovo mnohoznačné a jednoznačné · L2 určit
// význam slova ve větě · L3 najít větu, kde má slovo stejný význam.
//
// Doplněno 2026-09-12 (inventura obsahu): L1 měla náhodně losované rozptylovače,
// takže malá nápověda se u dvou úloh opakovala a klíčem jednoznačné úlohy se
// stalo náhodné slovo (na úrovni tak vznikalo jen 6 mnohoznačných úloh).
// Teď se obě banky procházejí deterministicky — každé slovo dostane právě jednu
// úlohu a rozptylovače se berou pevným krokem, takže nápověda je unikátní.
// Zpětná vazba u L2 a L3 pojmenuje význam, který do věty nepatří, ne jen to,
// že je jiný.

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
const JEDNOZNACNA: [string, string][] = [
  ["kyslík", "plyn, který dýcháme"],
  ["tužka", "psací potřeba s tuhou"],
  ["pondělí", "první den v týdnu"],
  ["sedmikráska", "drobná bílá květina"],
  ["trolejbus", "vozidlo, které bere proud z trolejí"],
  ["rohlík", "pečivo do ruky"],
  ["deštník", "věc, která chrání před deštěm"],
  ["brambora", "hlíza, která se jí"],
  ["lednička", "spotřebič, který chladí jídlo"],
  ["žirafa", "zvíře s dlouhým krkem"],
  ["tramvaj", "kolejové vozidlo ve městě"],
  ["ponožka", "kus oblečení na nohu"],
];

// Příklad v nápovědě je schválně slovo, které v žádné z bank není — jinak by
// nápověda u některé úlohy ukazovala přímo na klíč.
const PRIKLAD = "„kolo“ může být jízdní kolo i kolo soutěže";

/**
 * Posuny rozptylovačů pro i-tou úlohu. Jsou vždy tři různé (0 < 1–4 < 6–8),
 * takže trojice je platná, a mění se s `i`, takže se dvě úlohy netrefí do téže
 * trojice (pevný krok 4 by kvůli dělitelnosti dvanácti dal jen čtyři sady).
 */
const posuny = (i: number, zaklad: number): number[] =>
  [zaklad, zaklad + 1 + (i % 4), zaklad + 6 + (i % 3)];

/** Mnohoznačné slovo mezi třemi jednoznačnými. */
function mnohoznacneUloha(i: number): PracticeTask {
  const [slovo, vyznamy] = MNOHOZNACNA[i];
  const d = posuny(i, 0).map((k) => JEDNOZNACNA[(i + k) % JEDNOZNACNA.length]);
  return choice("Které slovo je mnohoznačné (má víc významů)?", slovo,
    d.map(([j, vyznam]) => ({ value: j, why: `„${j}“ znamená vždycky totéž (${vyznam}) — je jednoznačné.` })) as never, {
      hints: [
        `Zkus ke každému ze čtyř slov vymyslet dvě věty, ve kterých znamená něco jiného. Začni třeba u „${d[0][0]}“ a „${d[1][0]}“.`,
        `Mnohoznačné slovo se dá použít ve větách o úplně různých věcech — třeba ${PRIKLAD}. U „${d[0][0]}“ ani u „${d[1][0]}“ to nejde: ${d[0][0]} je ${d[0][1]} a ${d[1][0]} je ${d[1][1]}. Zbylá dvě slova zkus dosadit do dvou různých vět.`,
      ],
      explanation: `„${slovo}“ je mnohoznačné: ${vyznamy}. Ostatní tři slova mají jen jeden význam.`,
    });
}

/** Jednoznačné slovo mezi třemi mnohoznačnými. */
function jednoznacneUloha(i: number): PracticeTask {
  const [slovo, vyznam] = JEDNOZNACNA[i];
  const d = posuny(i, 1).map((k) => MNOHOZNACNA[(i + k) % MNOHOZNACNA.length]);
  return choice("Které slovo je jednoznačné (má jen jeden význam)?", slovo,
    d.map(([s, v]) => ({ value: s, why: `„${s}“ je mnohoznačné: ${v}.` })) as never, {
      hints: [
        `Zkus ke každému ze čtyř slov vymyslet dvě věty, ve kterých znamená něco jiného. Vyzkoušej to nejdřív u „${d[0][0]}“ a „${d[1][0]}“.`,
        `Mnohoznačné slovo se dá použít ve větách o úplně různých věcech — třeba ${PRIKLAD}. Dvě možnosti to tak mají: „${d[0][0]}“ může být ${d[0][1]} a „${d[1][0]}“ může být ${d[1][1]}. Ze zbylých dvou vyber to slovo, které znamená pořád totéž.`,
      ],
      explanation: `„${slovo}“ má jen jeden význam (${vyznam}) — je jednoznačné. Ostatní tři slova se dají použít ve větách o různých věcech.`,
    });
}

/** Chybný význam + proč se do TÉHLE věty nehodí. */
type Chybny = [string, string];
type Vyznam = { slovo: string; veta: string; spravne: string; jine: [Chybny, Chybny, Chybny]; proc: string };
const VYZNAMY: Vyznam[] = [
  { slovo: "koruna", veta: "Ze stromu se ulomila celá koruna.", spravne: "horní část stromu s větvemi", jine: [
    ["ozdoba na hlavě krále", "Královská koruna se ze stromu ulomit nemůže — věta mluví o stromu."],
    ["česká mince", "Mince ze stromu neroste; o penězích tu není řeč."],
    ["vrchol hory", "Vrcholu hory se říká štít, ne koruna, a věta mluví o stromu."],
  ], proc: "Mluví se o stromu, koruna je jeho horní část s větvemi." },
  { slovo: "koruna", veta: "Rohlík stojí tři koruny.", spravne: "česká peněžní jednotka", jine: [
    ["ozdoba na hlavě krále", "Rohlík se neplatí třemi královskými korunami — věta mluví o ceně."],
    ["horní část stromu", "Cena se neudává korunami stromu; o stromu tu není řeč."],
    ["zubní náhrada", "Zubní korunka je náhrada na zub, cenu rohlíku neurčuje."],
  ], proc: "Mluví se o ceně — koruna je peníz." },
  { slovo: "oko", veta: "Na punčoše se jí pustilo oko.", spravne: "očko pleteniny", jine: [
    ["orgán zraku", "Oko, kterým se díváme, na punčoše není — punčocha je upletená z nití."],
    ["kapka tuku na polévce", "Oka tuku plavou na polévce, ne na punčoše."],
    ["otvor v síti na ryby", "Oka v síti vážou rybáři; tady jde o pleteninu."],
  ], proc: "Na punčoše je oko smyčka pleteniny, která se může pustit." },
  { slovo: "list", veta: "Napiš to na čistý list.", spravne: "kus papíru", jine: [
    ["list stromu", "Na list utržený ze stromu se nepíše — věta mluví o psaní."],
    ["dopis", "Dopis je až to, co napíšeš; čistý list je zatím nepopsaný."],
    ["noviny", "Novinám se dřív říkalo list, ale čistý list je nepopsaný papír."],
  ], proc: "Píše se na papír — list je kus papíru." },
  { slovo: "jazyk", veta: "Mluví třemi jazyky.", spravne: "řeč, kterou lidé mluví", jine: [
    ["sval v ústech", "Člověk má v ústech jen jeden jazyk, třemi mluvit nemůže."],
    ["jazyk u boty", "Jazyk u boty je díl obuvi pod tkaničkami, mluvit se jím nedá."],
    ["plamen ohně", "Plamenům se říká ohnivé jazyky, ale nikdo jimi nemluví."],
  ], proc: "Mluví třemi — jde o řeč, například češtinu nebo angličtinu." },
  { slovo: "zámek", veta: "Klíč se v zámku zasekl.", spravne: "zařízení na zamykání", jine: [
    ["velká šlechtická stavba", "Ve šlechtickém sídle se klíč nezasekne — zasekne se v mechanismu."],
    ["hrad na kopci", "Hrad je stavba, a navíc hrad a zámek nejsou totéž."],
    ["sponka do vlasů", "Sponce do vlasů se zámek neříká a klíč do ní nepatří."],
  ], proc: "Klíč se zasekl — zámek je zařízení na zamykání." },
  { slovo: "noha", veta: "Stůl má jednu nohu kratší.", spravne: "podpěra stolu", jine: [
    ["končetina člověka", "Stůl není člověk — jeho nohy jsou podpěry desky."],
    ["tlapa zvířete", "Tlapu má zvíře, nábytek ji nemá."],
    ["pata hory", "Úpatí hory se noha říká jen v přeneseném významu; věta mluví o stole."],
  ], proc: "Mluví se o stole — noha je jeho podpěra." },
  { slovo: "myš", veta: "Klikni myší na obrázek.", spravne: "ovladač počítače", jine: [
    ["drobný hlodavec", "Hlodavec na obrázek neklikne."],
    ["šedá barva", "Myší barva je odstín šedi, klikat se jí nedá."],
    ["past na hlodavce", "Pasti se říká past na myši, sama myš to není."],
  ], proc: "Klikat se dá počítačovou myší." },
  { slovo: "kohoutek", veta: "Zavři kohoutek, teče voda.", spravne: "uzávěr vody", jine: [
    ["malý kohout", "Kohouta na dvoře nikdo nezavírá proto, že teče voda."],
    ["ozdoba na střeše", "Kohoutek na střeše je korouhvička, vodu nezastaví."],
    ["část pušky", "Kohoutek pušky s tekoucí vodou nesouvisí."],
  ], proc: "Teče voda — kohoutek je uzávěr vody." },
  { slovo: "křídlo", veta: "Ve škole otevřeli nové křídlo.", spravne: "boční část budovy", jine: [
    ["část těla ptáka", "Ptačí křídlo se ve škole otevřít nedá."],
    ["hudební nástroj", "Velkému klavíru se říká křídlo, ale ten se neotevírá jako část školy."],
    ["část letadla", "Křídlo letadla ke školní budově nepatří."],
  ], proc: "Mluví se o škole — křídlo je část budovy." },
  { slovo: "pero", veta: "Našla v trávě pero z holuba.", spravne: "ptačí pírko", jine: [
    ["nástroj na psaní", "Psací pero z holuba nepochází."],
    ["pružina v hodinkách", "Pérko v hodinkách je pružina, holub žádnou nemá."],
    ["trávník", "Tráva je ve větě jen místo nálezu, ne význam slova pero."],
  ], proc: "Pero z holuba je ptačí pírko." },
  { slovo: "vlna", veta: "Svetr je z ovčí vlny.", spravne: "srst ovce", jine: [
    ["pohyb vody na moři", "Z mořské vlny se svetr uplést nedá."],
    ["vlnitý pohyb ve vlasech", "Vlny ve vlasech jsou tvar účesu, ne materiál na svetr."],
    ["kmitání zvuku", "Zvuková vlna je fyzikální pojem, plést se z ní nedá."],
  ], proc: "Svetr z ovčí vlny — vlna je ovčí srst." },
  { slovo: "klíč", veta: "Na začátku notové osnovy je houslový klíč.", spravne: "značka na začátku notové osnovy", jine: [
    ["nástroj na odemykání", "V notách se nic neodemyká."],
    ["řešení hádanky", "Klíč k hádance je nápověda k řešení, v notách má klíč jinou úlohu."],
    ["nářadí na šrouby", "Klíč na šrouby patří do dílny, ne do not."],
  ], proc: "V notách je klíč značka na začátku osnovy." },
];

function vyznamUloha(v: Vyznam): PracticeTask {
  return choice(`Co znamená slovo „${v.slovo}“ ve větě „${v.veta}“?`, v.spravne,
    v.jine.map(([j, proc]) => ({ value: j, why: proc })) as never, {
      hints: [
        `Ve větě „${v.veta}“ si všimni slov okolo — co prozradí o významu slova „${v.slovo}“?`,
        `Slovo „${v.slovo}“ má víc významů a rozhoduje souvislost. Projdi nabídnuté významy jeden po druhém a každý si zkus dosadit do věty „${v.veta}“ — smysl dává jen jeden z nich.`,
      ],
      explanation: v.proc,
    });
}

type Stejny = { slovo: string; vzor: string; spravne: string; jine: [Chybny, Chybny, Chybny]; vyznam: string };
const STEJNE: Stejny[] = [
  { slovo: "oko", vzor: "Mrklo na mě jedním okem.", spravne: "Do oka mi spadla řasa.", jine: [
    ["Na polévce plavala oka tuku.", "Oka na polévce jsou kapky tuku, ne orgán zraku."],
    ["Pustilo se mi oko na punčoše.", "Oko na punčoše je smyčka pleteniny."],
    ["Rybář zašil oko v síti.", "Oko v síti je otvor mezi provázky."],
  ], vyznam: "orgán zraku" },
  { slovo: "koruna", vzor: "Král nosil zlatou korunu.", spravne: "Princezně spadla koruna z hlavy.", jine: [
    ["Lípa má hustou korunu.", "Koruna lípy je její horní část s větvemi."],
    ["Zaplatil jsem dvacet korun.", "Tady je koruna peníz, kterým se platí."],
    ["Zubař mi dal na zub korunku.", "Zubní korunka je náhrada nasazená na zub."],
  ], vyznam: "ozdoba na hlavě panovníka" },
  { slovo: "list", vzor: "Na podzim padá listí a každý list je jinak barevný.", spravne: "Na větvi zůstal poslední žlutý list.", jine: [
    ["Podej mi list papíru.", "Tady je list kus papíru."],
    ["Poslal mi dlouhý list z tábora.", "List z tábora znamená dopis."],
    ["Sešit má čtyřicet listů.", "Listy sešitu jsou papírové stránky."],
  ], vyznam: "list stromu" },
  { slovo: "zámek", vzor: "Na kopci stojí starý zámek.", spravne: "Prohlédli jsme si zámek Lednice.", jine: [
    ["Klíč nejde do zámku.", "Zámek u dveří je zařízení na zamykání."],
    ["Na kole mám zámek s kódem.", "Zámek na kole je zamykací zařízení."],
    ["Kufr má rozbitý zámek.", "Zámek u kufru je zavírací mechanismus."],
  ], vyznam: "šlechtické sídlo" },
  { slovo: "jazyk", vzor: "Ve škole se učíme anglický jazyk.", spravne: "Čeština je náš mateřský jazyk.", jine: [
    ["Kousl se do jazyka.", "Kousnout se dá jen do svalu v ústech."],
    ["Pes vyplázl jazyk.", "I tady jde o sval v tlamě, ne o řeč."],
    ["Bota má dlouhý jazyk.", "Jazyk u boty je díl obuvi pod tkaničkami."],
  ], vyznam: "řeč" },
  { slovo: "myš", vzor: "Kočka chytila myš.", spravne: "Ve spíži se objevila myš.", jine: [
    ["Počítačová myš nefunguje.", "Tady je myš ovladač k počítači."],
    ["Kliknu myší na ikonu.", "Klikat se dá jen počítačovou myší."],
    ["Koupil jsem bezdrátovou myš.", "Bezdrátová myš je také ovladač k počítači."],
  ], vyznam: "hlodavec" },
  { slovo: "noha", vzor: "Uklouzl a zlomil si nohu.", spravne: "Bolí mě pravá noha.", jine: [
    ["Stůl má kulaté nohy.", "Nohy stolu jsou podpěry desky."],
    ["Židli se ulomila noha.", "I tady je noha podpěra nábytku."],
    ["Lampa stojí na jedné noze.", "Noha lampy je její stojan."],
  ], vyznam: "končetina člověka" },
  { slovo: "pero", vzor: "Píšu úkol perem.", spravne: "Do penálu jsem si dal nové pero.", jine: [
    ["Kohout má barevná pera.", "Pera kohouta jsou ptačí peří."],
    ["Našla jsem pero z vrány.", "Pero z vrány je ptačí pírko."],
    ["Pták si čechrá pera.", "I tady jde o peří, ne o psací potřebu."],
  ], vyznam: "nástroj na psaní" },
  { slovo: "vlna", vzor: "Na moři byly vysoké vlny.", spravne: "Vlna nás smáčela až po pás.", jine: [
    ["Babička plete z vlny.", "Plete se z ovčí vlny, tedy ze srsti."],
    ["Ovce dávají vlnu.", "Vlna ovcí je jejich srst."],
    ["Svetr je z jemné vlny.", "Svetr je z ovčí srsti, ne z vody."],
  ], vyznam: "vlna na vodě" },
  { slovo: "vlna", vzor: "Babička plete svetr z vlny.", spravne: "Ovce se stříhají kvůli vlně.", jine: [
    ["Vlna převrátila loďku.", "Loďku převrátí vlna na vodě, ne ovčí srst."],
    ["Na jezeře byly malé vlny.", "Vlny na jezeře jsou pohyb vody."],
    ["Zvuk se šíří jako vlna.", "Zvuková vlna je kmitání, plést se z ní nedá."],
  ], vyznam: "ovčí srst" },
  { slovo: "kohoutek", vzor: "Na dvoře kokrhal malý kohoutek.", spravne: "Kohoutek se schoval pod slepici.", jine: [
    ["Kohoutek u vany kape.", "Kohoutek u vany je uzávěr vody."],
    ["Otoč kohoutkem doprava.", "Otáčí se vodovodním kohoutkem."],
    ["Zavřel kohoutek od plynu.", "Kohoutek od plynu je uzávěr potrubí."],
  ], vyznam: "malý kohout" },
  { slovo: "klíč", vzor: "Ztratil jsem klíč od bytu.", spravne: "Klíč od sklepa visí u dveří.", jine: [
    ["Houslový klíč se kreslí na začátek osnovy.", "Houslový klíč je značka v notách."],
    ["Klíčem k úspěchu je trénink.", "Klíč k úspěchu je přenesený význam — to hlavní, co k cíli vede."],
    ["Basový klíč se píše jinak.", "Basový klíč je opět notová značka."],
  ], vyznam: "nástroj na odemykání" },
  { slovo: "křídlo", vzor: "Pták si poranil křídlo.", spravne: "Holub mával křídly.", jine: [
    ["V novém křídle školy jsou dílny.", "Křídlo školy je boční část budovy."],
    ["Pianista hraje na křídlo.", "Křídlo je tady velký klavír."],
    ["Letadlo mělo poškozené křídlo.", "Křídlo letadla je nosná plocha stroje."],
  ], vyznam: "část těla ptáka" },
];

function stejnyUloha(s: Stejny): PracticeTask {
  return choice(`Ve které větě má slovo „${s.slovo}“ stejný význam jako ve větě „${s.vzor}“?`, s.spravne,
    s.jine.map(([j, proc]) => ({ value: j, why: proc })) as never, {
      hints: [
        `Co znamená „${s.slovo}“ ve větě „${s.vzor}“? Stejný význam hledej i v nabídnutých větách.`,
        `Ve vzorové větě má „${s.slovo}“ význam „${s.vyznam}“. Projdi nabídnuté věty a u každé si řekni, co v ní slovo znamená; zůstane ti jediná, kde znamená totéž co ve vzoru.`,
      ],
      explanation: `Ve větě „${s.spravne}“ znamená „${s.slovo}“ totéž co ve vzoru: ${s.vyznam}.`,
    });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    return shuffle([
      ...MNOHOZNACNA.map((_, i) => mnohoznacneUloha(i)),
      ...JEDNOZNACNA.map((_, i) => jednoznacneUloha(i)),
    ]);
  }
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
