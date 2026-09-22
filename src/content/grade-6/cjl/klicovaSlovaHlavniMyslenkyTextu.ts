/**
 * Čeština 6. ročník — Klíčová slova, téma a hlavní myšlenka textu (select_one).
 *
 * Navazuje na grade-4/cjl/vyhledavaniKlicovychSlovAHlavniMyslenky.ts, kde jsou
 * definice pojmů (co je klíčové slovo, téma, hlavní myšlenka) a jednoduché
 * ukázky. Tady se definice NEOPAKUJÍ — žák rovnou pracuje s ukázkami.
 *
 *  • L1 — rozpoznání (rozcvička nad 5. ročník). Ukázka 3 věty, téma je
 *    v textu vyjádřené skoro doslova.
 *    – "O čem text je?" → klíč je krátké sousloví (téma).
 *    – "Ve které trojici jsou jen klíčová slova textu?" → klíč jsou tři slova z textu.
 *  • L2 — použití. Ukázka 4–5 vět, text ZAČÍNÁ příběhem nebo příkladem
 *    a pointa (hlavní myšlenka) je uprostřed nebo na konci, ne v 1. větě.
 *    – "Která věta vystihuje hlavní myšlenku?" → klíč je VLASTNÍ parafráze
 *      pointy (ne doslovná věta z textu — díky tomu se klíč nikdy neobjeví
 *      v zadání), distraktory jsou 1. věta (doslova), jedna detailní věta
 *      (doslova) a obecné tvrzení.
 *    – "Který nadpis nejlépe vystihuje hlavní myšlenku textu?" → klíč je vlastní nadpis
 *      (parafráze pointy), distraktory: nadpis podle jednoho odstavce,
 *      příliš obecný nadpis, nadpis podle úvodu.
 *  • L3 — analýza a přenos. Ukázka má 4 věty ve tvaru: (1) vyvracený omyl
 *    („Mnoho lidí si myslí…“), (2) skutečnost („Ve skutečnosti…“),
 *    (3) konkrétní doklad, (4) odbočující věta, která s hlavní myšlenkou
 *    nesouvisí (ale sama o sobě pravdivá).
 *    – "Co chce autor čtenáři sdělit?" → klíč = vlastní shrnutí (v textu
 *      doslova nestojí), distraktory: vyvracený omyl, přehnané zobecnění,
 *      tvrzení mimo text.
 *    – "Který závěr z textu vyplývá?" → klíč = úsudek podložený textem
 *      (na rozdíl od domyšleného), distraktory: domyšlené tvrzení,
 *      vyvracený omyl, přehnané zobecnění.
 *    – "Která věta do textu nepatří, protože neslouží hlavní myšlence?"
 *      → text je očíslovaný `(1)…(4)`, možnosti jsou "věta 1"…"věta 4"
 *      (ne doslovný text věty jako možnost — klíč by se jinak nutně objevil
 *      v zadání, protože ukázku musí žák vidět celou). Pořadí odbočující
 *      věty v očíslovaném textu se mezi ukázkami střídá (pozice 1–4), aby
 *      nešlo hádat podle polohy.
 *
 * Proč klíč u L2/L3 (kromě "nepatří") NENÍ doslovná věta z ukázky: ukázka je
 * vždy celá vypsaná v `question` (žák musí text vidět, aby na otázku
 * odpověděl), takže doslovná věta z textu by se jako klíč objevila přímo
 * v zadání. Parafráze tenhle problém řeší a zároveň odpovídá duchu úrovní
 * L2/L3 (přeformulovat vlastními slovy, ne najít a opsat větu).
 *
 * Chybový model (viz spec):
 *  1) vybere první větu / úvodní příběh místo pointy (L2, L3 mimo "nepatří"),
 *  2) vybere zajímavý detail z jedné věty (L1, L2),
 *  3) zobecní příliš, takže by odpověď seděla na spoustu jiných textů (L1–L3),
 *  4) domyslí obsah, který v textu není, nebo vezme za myšlenku omyl, který
 *     text právě vyvrací (L3).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Builder = () => PracticeTask | null;

// Nápovědy podle TYPU otázky — strategie, neprozrazují výsledek.
// hints[1] je vždy aspoň o pětinu delší než hints[0], aby k ní `buildChoiceTask`
// nepřilepil obecnou radu „Dosaď každou možnost zpátky do věty…“, která
// u otázky nad celou ukázkou nedává smysl (viz doplnVelkou v _shared).
const HINTS_TEMA: [string, string] = [
  "Zeptej se u každé věty: o kom nebo o čem mluví? Co mají všechny věty společné?",
  "Vyřaď možnost, která sedí jen na jednu větu, i tu, která by seděla skoro na jakýkoli text. Téma musí pokrýt všechny věty ukázky a nic k nim nepřidávat.",
];
const HINTS_KLICOVA: [string, string] = [
  "Klíčová slova nesou to, o čem text je. Která slova se týkají celého textu, ne jen jedné věty?",
  "Zkontroluj, jestli se tvoje trojice slov hodí na celý text, ne jen na jednu větu. Jméno, číslo nebo drobná podrobnost téma samy neřeknou a úplně obecná slova by seděla na cokoli.",
];
const HINTS_MYSLENKA: [string, string] = [
  "Zeptej se u každé věty: vysvětlují ostatní věty právě tuhle?",
  "Zakryj jednu větu. Pochopí čtenář text i bez ní? Pokud ano, není hlavní. Pointa bývá až na konci, kde autor z příběhu něco vyvodí.",
];
const HINTS_NADPIS: [string, string] = [
  "Dobrý nadpis vystihuje, k čemu text nakonec dojde. Kde autor z příběhu něco vyvozuje?",
  "Vyzkoušej každý nadpis na celý text: nesedí jen na úvod nebo na jednu příhodu? A neseděl by stejně dobře i na úplně jiný text o podobné věci?",
];
const HINTS_SDELENI: [string, string] = [
  "Najdi v textu slova „ale“, „ve skutečnosti“, „přesto“ — co autor tvrdí po nich?",
  "U každé možnosti si ukaž prstem, která věta textu ji dokazuje. Když takovou větu nenajdeš, je to domněnka navíc. Pozor i na tvrzení, které autor sám vyvrací.",
];
const HINTS_ZAVER: [string, string] = [
  "Závěr musí mít v textu oporu. Která věta textu uvádí konkrétní doklad?",
  "U každé možnosti si ukaž prstem, která věta textu ji dokazuje. Když takovou větu nenajdeš, je to domněnka navíc. Pozor i na slova „úplně“, „nikdy“, „každý“ — text tak daleko často nejde.",
];
const HINTS_NEPATRI: [string, string] = [
  "Nejdřív si řekni, co chce text hlavně sdělit. Pak u každé věty zjisti, jestli k tomu něco přidává.",
  "Zkus každou větu vynechat — přijde text o něco důležitého k hlavní myšlence? Věta, bez které se sdělení vůbec nezmění, je jen odbočka od tématu.",
];

// ── L1 — rozpoznání tématu a klíčových slov ─────────────────────────────────
interface UkazkaL1 {
  veta: [string, string, string];
  /** Tři slova z textu, která tvoří jádro tématu (nesou to, o čem text je). */
  klicova: [string, string, string];
  /** Téma jako krátké sousloví „jak…“. */
  tema: string;
  /** Trojice s JEDNÍM zajímavým vedlejším slovem místo jednoho klíčového. */
  kwVedlejsi: [string, string, string];
  /** Trojice slov, která v textu JSOU, ale jsou okrajová (jména, čísla, čas, místo, podrobnosti). */
  kwNepodstatna: [string, string, string];
  /** Trojice obecných nadřazených slov blízkých tématu, která by seděla na spoustu jiných textů. */
  kwObecne: [string, string, string];
  /** Příliš obecné téma. */
  temaObecne: string;
  /** Detail z jedné věty povýšený na téma. */
  temaDetail: string;
  /** Téma, které text vůbec neříká. */
  temaMimo: string;
}

const BANKA_L1: UkazkaL1[] = [
  {
    veta: [
      "Tomáš chodí každé úterý do kroužku robotiky.",
      "V kroužku staví roboty ze stavebnice a učí se je programovat.",
      "Nejradši má chvíli, kdy robot poprvé rozsvítí světýlka a pohne se sám.",
    ],
    klicova: ["robot", "kroužek", "staví"],
    tema: "jak Tomáš staví a programuje roboty v kroužku",
    kwVedlejsi: ["robot", "světýlka", "staví"],
    kwNepodstatna: ["Tomáš", "úterý", "poprvé"],
    kwObecne: ["technika", "zábava", "škola"],
    temaObecne: "jak trávit čas v kroužku",
    temaDetail: "jak robot poprvé rozsvítí světýlka",
    temaMimo: "jak si vybrat správný kroužek",
  },
  {
    veta: [
      "Šestá třída jela na jarní výlet na hrad.",
      "Žáci si nejdřív vybírali, který hrad navštíví, a pak si balili batohy.",
      "Na hradě je nejvíc bavila prohlídka sklepení s pověstí o strašidle.",
    ],
    klicova: ["výlet", "hrad", "třída"],
    tema: "jak třída jela na výlet na hrad",
    kwVedlejsi: ["výlet", "strašidlo", "třída"],
    kwNepodstatna: ["šestá", "nejdřív", "sklepení"],
    kwObecne: ["cestování", "škola", "zábava"],
    temaObecne: "jak trávit čas ve škole",
    temaDetail: "jak žáky bavila pověst o strašidle",
    temaMimo: "jak vznikl hrad, který třída navštívila",
  },
  {
    veta: [
      "Anna si z útulku přivezla domů psa jménem Bady.",
      "Bady byl nejdřív plachý, ale Anna se mu každý den věnovala a chodila s ním na procházky.",
      "Teď je z Badyho veselý pes, který Anně běhá naproti ke dveřím.",
    ],
    klicova: ["pes", "útulek", "procházky"],
    tema: "jak se Anna stará o psa z útulku",
    kwVedlejsi: ["pes", "dveře", "procházky"],
    kwNepodstatna: ["Anna", "Bady", "každý den"],
    kwObecne: ["zvíře", "domov", "péče"],
    temaObecne: "jak se starat o zvíře",
    temaDetail: "jak byl pes Bady nejdřív plachý",
    temaMimo: "jak Anna vybírala jméno pro psa",
  },
  {
    veta: [
      "Rodina Novákových doma třídí odpad do tří barevných popelnic.",
      "Papír dávají do modré, plasty do žluté a sklo do zelené.",
      "Díky třídění vyhodí mnohem méně odpadu do černé popelnice se směsným odpadem.",
    ],
    klicova: ["odpad", "třídí", "popelnice"],
    tema: "jak rodina třídí doma odpad",
    kwVedlejsi: ["odpad", "třídí", "modré"],
    kwNepodstatna: ["Novákových", "tří", "černé"],
    kwObecne: ["příroda", "domácnost", "barvy"],
    temaObecne: "jak se chovat k životnímu prostředí",
    temaDetail: "jak vypadají barevné popelnice u Novákových",
    temaMimo: "kam se recyklovaný odpad odváží",
  },
  {
    veta: [
      "Kristýna si každý večer bere mobil do postele a prohlíží sociální sítě.",
      "Poslední dobou usíná mnohem později a ráno je unavená.",
      "Když si jednou mobil nechala v kuchyni, usnula rychleji a vyspala se líp.",
    ],
    klicova: ["mobil", "usíná", "postel"],
    tema: "jak mobil v posteli ovlivňuje Kristýnin spánek",
    kwVedlejsi: ["mobil", "usíná", "kuchyně"],
    kwNepodstatna: ["Kristýna", "jednou", "ráno"],
    kwObecne: ["technika", "zdraví", "rodina"],
    temaObecne: "jak být zdravý",
    temaDetail: "jak si Kristýna jednou nechala mobil v kuchyni",
    temaMimo: "jak dlouho by měl trvat spánek",
  },
  {
    veta: [
      "Bobři si na potoce staví hráz z klacků, bahna a kamenů.",
      "Hráz zadrží vodu a vytvoří klidné jezírko, kde si bobr postaví svůj domek.",
      "Hráz bobři opravují skoro každou noc, protože ji voda pořád trochu poškozuje.",
    ],
    klicova: ["bobr", "hráz", "staví"],
    tema: "jak si bobři stavějí hráz na potoce",
    kwVedlejsi: ["bobr", "hráz", "klacky"],
    kwNepodstatna: ["bahno", "noc", "kameny"],
    kwObecne: ["zvíře", "krajina", "příroda"],
    temaObecne: "jak zvířata žijí u vody",
    temaDetail: "jak bobři skoro každou noc opravují hráz",
    temaMimo: "kolik bobrů žije v jednom jezírku",
  },
  {
    veta: [
      "První jízdní kola neměla pedály — jezdec se od země odrážel nohama.",
      "Později dostalo kolo pedály a po nich i řetěz.",
      "Dnešní kola mají navíc přehazovačku, díky které se šlape i do kopce snadněji.",
    ],
    klicova: ["kolo", "pedály", "řetěz"],
    tema: "jak se jízdní kolo postupně vylepšovalo",
    kwVedlejsi: ["kolo", "pedály", "kopec"],
    kwNepodstatna: ["jezdec", "země", "noha"],
    kwObecne: ["doprava", "technika", "sport"],
    temaObecne: "jak funguje doprava",
    temaDetail: "jak se dnes šlape do kopce snadněji",
    temaMimo: "kdo jízdní kolo vynalezl jako první",
  },
  {
    veta: [
      "Žáci osmé třídy vydávají školní časopis jednou za měsíc.",
      "Píšou do něj rozhovory se spolužáky, vtipy a novinky ze školy.",
      "Časopis pak tisknou na papír a rozdávají ho o přestávkách po celé škole.",
    ],
    klicova: ["časopis", "píšou", "škola"],
    tema: "jak žáci vydávají školní časopis",
    kwVedlejsi: ["časopis", "píšou", "přestávky"],
    kwNepodstatna: ["osmé", "jednou", "papír"],
    kwObecne: ["kultura", "zábava", "čtení"],
    temaObecne: "jak trávit čas ve škole",
    temaDetail: "jak žáci tisknou časopis na papír",
    temaMimo: "kdo časopis založil jako první",
  },
];

function taskTema(u: UkazkaL1): PracticeTask | null {
  const text = u.veta.join(" ");
  return buildChoiceTask(
    `Text: „${text}“ O čem text je?`,
    u.tema,
    [
      { value: u.temaObecne, why: "Tohle platí o spoustě podobných textů, tenhle konkrétní to nevystihuje." },
      { value: u.temaDetail, why: "Je to v textu pravda, ale jen v jedné větě; zbytek textu se točí kolem něčeho jiného." },
      { value: u.temaMimo, why: "Tohle text vůbec neříká — v ukázce to nikde nestojí." },
    ],
    {
      hints: HINTS_TEMA,
      explanation: `Text je o tom, ${u.tema}. Všechny věty textu se k tomu vztahují.`,
    },
  );
}

function taskKlicova(u: UkazkaL1): PracticeTask | null {
  const text = u.veta.join(" ");
  const correct = u.klicova.join(", ");
  return buildChoiceTask(
    `Text: „${text}“ Ve které trojici jsou jen klíčová slova textu?`,
    correct,
    [
      { value: u.kwVedlejsi.join(", "), why: "Jedno slovo v této trojici je jen zajímavý vedlejší detail, ne to hlavní, o čem text je." },
      { value: u.kwNepodstatna.join(", "), why: "Tahle slova v textu jsou, ale jsou to jen vedlejší údaje (jméno, číslo, čas, místo nebo podrobnost). Téma samy o sobě nevystihnou." },
      { value: u.kwObecne.join(", "), why: "Tahle slova jsou tak obecná, že by seděla na spoustu jiných textů. V ukázce navíc vůbec nestojí." },
    ],
    {
      hints: HINTS_KLICOVA,
      explanation: `Slova „${correct}“ nesou to, o čem text je — dohromady z nich poznáš téma (${u.tema}). Ostatní trojice obsahují vedlejší detail, okrajové údaje nebo slova, která by seděla na jakýkoli text.`,
    },
  );
}

function poolL1(): Builder[] {
  const out: Builder[] = [];
  for (const u of BANKA_L1) {
    out.push(() => taskTema(u));
    out.push(() => taskKlicova(u));
  }
  return out;
}

// ── L2 — hlavní myšlenka a nadpis (pointa NENÍ v 1. větě) ───────────────────
interface UkazkaL2 {
  veta: [string, string, string, string, string];
  /** Index věty (0–4) použité jako "zajímavý detail" distraktor. */
  detailIdx: number;
  /** Vlastní parafráze pointy — NENÍ doslovná věta z textu. */
  hlavniMyslenka: string;
  /** Obecné tvrzení, které by sedělo na spoustu podobných textů. */
  myslenkaObecna: string;
  nadpisSpravny: string;
  nadpisDetail: string;
  nadpisObecny: string;
  nadpisUvod: string;
}

const BANKA_L2: UkazkaL2[] = [
  {
    veta: [
      "Filip začal chodit na kroužek keramiky, protože ho bavilo tvarování hlíny.",
      "První misky se mu kroutily a praskaly v peci.",
      "Filip ale nepřestal chodit, zkoušel nové postupy a poslouchal rady lektorky.",
      "Po půl roce vytvořil misku, kterou si doma denně používá celá rodina.",
      "Filipův úspěch ukazuje, že vytrvalost je pro zvládnutí řemesla důležitější než počáteční talent.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "Trpělivé zkoušení nakonec pomůže víc než to, jak je někdo od začátku šikovný.",
    myslenkaObecna: "Keramika je zajímavý a kreativní koníček.",
    nadpisSpravny: "Jak vytrvalost pomohla zvládnout keramiku",
    nadpisDetail: "Proč se Filipovi první misky kroutily a praskaly v peci",
    nadpisObecny: "Kroužky ve škole",
    nadpisUvod: "Filip začíná s keramikou",
  },
  {
    veta: [
      "Třída se vydala na výlet do jeskyně, kterou většina žáků předem neznala.",
      "Zpočátku každý hleděl jen na sebe a strkali se, kdo půjde první.",
      "V úzké chodbě si pak museli svítit jeden druhému na cestu baterkami.",
      "Když jeden žák uvízl v úzkém průlezu, ostatní mu pomohli vylézt ven.",
      "Výlet do jeskyně žáky naučil, že si ve složité situaci musí navzájem pomáhat.",
    ],
    detailIdx: 3,
    hlavniMyslenka: "V náročné chvíli se osvědčí, když si lidé navzájem pomůžou.",
    myslenkaObecna: "Výlety jsou pro třídu vždycky zábavné.",
    nadpisSpravny: "Jak si žáci ve složité situaci pomohli",
    nadpisDetail: "Jak jeden žák uvízl v úzkém průlezu jeskyně",
    nadpisObecny: "Školní výlety",
    nadpisUvod: "Třída jede na neznámý výlet",
  },
  {
    veta: [
      "Ema si přivedla domů plachého psa Rexe, který se bál i vlastního stínu.",
      "První týden se Rex schovával pod postelí a nejedl z ruky.",
      "Ema mu každý den nosila piškoty a mluvila na něj tichým hlasem.",
      "Po měsíci si k ní Rex konečně lehl na klín a nechal se pohladit.",
      "Rexův příběh ukazuje, že trpělivost dokáže i vystrašené zvíře naučit důvěře.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "I hodně plachému zvířeti pomůže získat důvěru trpělivá a pravidelná péče.",
    myslenkaObecna: "Psi jsou věrní a oblíbení kamarádi.",
    nadpisSpravny: "Jak trpělivost naučila psa důvěře",
    nadpisDetail: "Rex se schovává pod postelí",
    nadpisObecny: "Zvířata doma",
    nadpisUvod: "Ema si přivádí domů plachého psa",
  },
  {
    veta: [
      "Škola vyhlásila soutěž, která třída vytřídí za měsíc nejvíc papíru a plastu.",
      "Šestá B nejdřív sbírala jen PET lahve, které se válely ve třídě na lavicích.",
      "Pak si žáci všimli, že podobně můžou třídit i doma, a začali nosit odpad z domova.",
      "Za měsíc šestá B odevzdala tolik odpadu, že se stala vítězem soutěže.",
      "Soutěž ukázala, že malý zvyk se dá snadno přenést i mimo školu a má velký dopad.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "Malý zvyk se dá snadno přenést i mimo školu, a tak roste jeho dopad.",
    myslenkaObecna: "Třídění odpadu je pro životní prostředí důležité.",
    nadpisSpravny: "Jak se malý zvyk přenesl i domů",
    nadpisDetail: "Sbírání PET lahví ve třídě",
    nadpisObecny: "Životní prostředí",
    nadpisUvod: "Škola vyhlašuje soutěž ve třídění",
  },
  {
    veta: [
      "Vojta si stěžoval, že v poslední době špatně usíná a ráno je unavený.",
      "Večer si bral mobil do postele a scrolloval videa, dokud ho nezačaly pálit oči.",
      "Lékařka mu poradila, aby mobil hodinu před spaním odložil do jiné místnosti.",
      "Vojta to zkusil týden a usínal mnohem rychleji než předtím.",
      "Vojtova zkušenost ukazuje, že mobil před spaním může zhoršovat usínání.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "Když mobil před spaním odložíme, můžeme usínat snáz.",
    myslenkaObecna: "Zdravý spánek je pro děti důležitý.",
    nadpisSpravny: "Jak odložení mobilu pomohlo usínání",
    nadpisDetail: "Pálení očí od scrollování videí",
    nadpisObecny: "Spánek a zdraví",
    nadpisUvod: "Vojta si stěžuje na špatné usínání",
  },
  {
    veta: [
      "Na malém potoce se objevila rodina bobrů a začala stavět hráz.",
      "Hráz nejdřív zpomalila tok vody a kolem břehů vznikla mokřina.",
      "Do mokřiny se brzy nastěhovaly žáby, vážky a vodní ptáci, kteří tam předtím nebyli.",
      "Místní rybáři si stěžovali, že jim bobří hráz zabránila v přístupu k oblíbenému místu.",
      "Bobří hráz tak nakonec přinesla přírodě nový domov pro spoustu druhů zvířat.",
    ],
    detailIdx: 3,
    hlavniMyslenka: "Bobří hráz dokáže vytvořit nový domov pro spoustu jiných zvířat.",
    myslenkaObecna: "Zvířata svým chováním mění přírodu kolem sebe.",
    nadpisSpravny: "Jak bobří hráz vytvořila nový domov pro zvířata",
    nadpisDetail: "Proč si místní rybáři stěžují na bobří hráz u potoka",
    nadpisObecny: "Zvířata u vody",
    nadpisUvod: "U potoka se objevila rodina bobrů",
  },
  {
    veta: [
      "První jízdní kola z počátku 19. století neměla pedály ani řetěz.",
      "Jezdec se musel od země odrážet nohama jako na koloběžce.",
      "Později někdo vymyslel připevnit k přednímu kolu pedály, takže se dalo šlapat.",
      "Ještě později přidali výrobci řetěz, který poháněl zadní kolo, a mnohem později přehazovačku, se kterou se snáz jede do kopce.",
      "Jízdní kolo tak postupně vylepšovala řada nápadů, ne jeden vynálezce najednou.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "Jízdní kolo se postupně zlepšovalo díky nápadům víc lidí, ne jednoho vynálezce.",
    myslenkaObecna: "Kolo je dodnes oblíbený dopravní prostředek.",
    nadpisSpravny: "Jak kolo vylepšila řada nápadů, ne jeden vynálezce",
    nadpisDetail: "Proč se na prvních kolech jezdilo odrážením nohama jako na koloběžce",
    nadpisObecny: "Dopravní prostředky",
    nadpisUvod: "První kola neměla pedály ani řetěz",
  },
  {
    veta: [
      "Šestá A se rozhodla založit vlastní školní časopis.",
      "Nejdřív každý psal svůj článek sám a časopis vycházel nepravidelně jednou za dva měsíce.",
      "Pak si žáci rozdělili role: kdo píše, kdo kreslí a kdo časopis tiskne.",
      "Od té doby vychází časopis pravidelně každý měsíc a baví to víc žáků než dřív.",
      "Časopis ukázal, že rozdělení práce pomáhá udržet společný projekt živý.",
    ],
    detailIdx: 1,
    hlavniMyslenka: "Když si žáci rozdělí práci na projektu, udrží ho živý déle.",
    myslenkaObecna: "Školní časopisy jsou pro žáky užitečné.",
    nadpisSpravny: "Jak rozdělení práce udrželo časopis živý",
    nadpisDetail: "Časopis nejdřív vycházel nepravidelně",
    nadpisObecny: "Školní aktivity",
    nadpisUvod: "Šestá A zakládá vlastní časopis",
  },
];

function taskHlavniMyslenka(u: UkazkaL2): PracticeTask | null {
  const text = u.veta.join(" ");
  return buildChoiceTask(
    `Text: „${text}“ Která věta vystihuje hlavní myšlenku?`,
    u.hlavniMyslenka,
    [
      { value: u.veta[0], why: "Tahle věta jen uvádí do tématu. Ostatní věty nevysvětlují ji, ale to, co přijde dál." },
      { value: u.veta[u.detailIdx], why: "Je to v textu pravda, ale jen v jedné větě; zbytek textu se točí kolem něčeho jiného." },
      { value: u.myslenkaObecna, why: "Tohle platí o spoustě podobných textů, tenhle konkrétní to nevystihuje." },
    ],
    {
      hints: HINTS_MYSLENKA,
      explanation: `${u.hlavniMyslenka} To je pointa celého textu — ostatní věty k ní směřují.`,
    },
  );
}

function taskNadpis(u: UkazkaL2): PracticeTask | null {
  const text = u.veta.join(" ");
  return buildChoiceTask(
    `Text: „${text}“ Který nadpis nejlépe vystihuje hlavní myšlenku textu?`,
    u.nadpisSpravny,
    [
      { value: u.nadpisDetail, why: "Tenhle nadpis sedí jen na jednu část textu, ne na celek." },
      { value: u.nadpisObecny, why: "Tenhle nadpis je tak obecný, že by seděl na spoustu jiných textů." },
      { value: u.nadpisUvod, why: "Tenhle nadpis popisuje jen úvod příběhu, ne to, k čemu text nakonec dojde." },
    ],
    {
      hints: HINTS_NADPIS,
      explanation: `Nadpis „${u.nadpisSpravny}“ vystihuje pointu textu, ne jen úvod nebo jeden detail.`,
    },
  );
}

function poolL2(): Builder[] {
  const out: Builder[] = [];
  for (const u of BANKA_L2) {
    out.push(() => taskHlavniMyslenka(u));
    out.push(() => taskNadpis(u));
  }
  return out;
}

// ── L3 — analýza a přenos (protiklad + odbočující věta) ─────────────────────
interface UkazkaL3 {
  /** (1) vyvracený omyl — "Mnoho lidí si myslí, že…" */
  s1: string;
  /** (2) skutečnost — "Ve skutečnosti…" */
  s2: string;
  /** (3) konkrétní doklad. */
  s3: string;
  /** Odbočující věta — pravdivá, ale nesouvisí s hlavní myšlenkou. */
  sOdb: string;
  /** Pozice odbočující věty v očíslovaném textu pro otázku (c), 1–4. */
  odbPos: 1 | 2 | 3 | 4;
  /** (a) Co chce autor sdělit — vlastní shrnutí, NENÍ doslovná věta. */
  klicA: string;
  dVyvracenyA: string;
  dPrehnaneA: string;
  dNeniVTextA: string;
  /** (b) Který závěr vyplývá — úsudek podložený textem. */
  klicB: string;
  dDomyslenyB: string;
  dVyvracenyB: string;
  dPrehnaneB: string;
}

const BANKA_L3: UkazkaL3[] = [
  {
    s1: "Mnoho lidí si myslí, že prohlížení mobilu těsně před spaním pomáhá se uklidnit a rychleji usnout.",
    s2: "Ve skutečnosti světlo z displeje i napínavý obsah mohou usínání naopak oddálit.",
    s3: "Lidé, kteří mobil hodinu před spaním odloží, podle průzkumů často usínají snáz.",
    sOdb: "Mobily dnes lidé používají i k placení v obchodě nebo k navigaci na cestách.",
    odbPos: 4,
    klicA: "Mobil těsně před spaním usínání spíš ztěžuje, než aby pomáhal.",
    dVyvracenyA: "Mobil před spaním pomáhá se uklidnit a rychleji usnout.",
    dPrehnaneA: "Mobil v jakoukoli denní dobu každému kazí spánek.",
    dNeniVTextA: "Modré světlo z displeje mobilu dětem trvale poškozuje sítnici oka.",
    klicB: "Odložení mobilu před spaním může pomoct rychlejšímu usínání.",
    dDomyslenyB: "Mobil trvale poškozuje zrak.",
    dVyvracenyB: "Mobil před spaním pomáhá se rychleji uklidnit.",
    dPrehnaneB: "Každý, kdo večer použije mobil, bude mít problémy se spánkem.",
  },
  {
    s1: "Mnoho lidí si myslí, že v keramice uspěje jen ten, kdo má od přírody šikovné ruce.",
    s2: "Ve skutečnosti lektoři pozorují, že žáci, kteří vytrvale zkoušejí znovu, dosáhnou lepších výsledků než ti s přirozeným talentem, kteří to po prvním nepovedeném kusu vzdají.",
    s3: "Filip měl první misky křivé a popraskané, ale po měsících zkoušení uměl vytočit rovnou mísu na první pokus.",
    sOdb: "Keramický kroužek se koná ve stejné budově, kde má škola i tělocvičnu a jídelnu.",
    odbPos: 1,
    klicA: "Vytrvalé zkoušení rozhoduje v řemesle víc než vrozený talent.",
    dVyvracenyA: "V keramice uspěje jen ten, kdo má od přírody šikovné ruce.",
    dPrehnaneA: "Na talentu pro řemeslo vůbec nezáleží.",
    dNeniVTextA: "Keramika je mezi žáky ze všech školních kroužků ten nejoblíbenější.",
    klicB: "Kdo u řemesla vydrží zkoušet i po neúspěchu, časem se zlepší.",
    dDomyslenyB: "Filip se po škole stane profesionálním hrnčířem a otevře si dílnu.",
    dVyvracenyB: "Talent je pro úspěch v keramice nejdůležitější.",
    dPrehnaneB: "Každý, kdo zkusí keramiku, zvládne úplně cokoliv.",
  },
  {
    s1: "Mnoho žáků si před výletem myslelo, že v jeskyni hlavně záleží na tom, kdo bude nejrychlejší.",
    s2: "Ve skutečnosti se v úzké a tmavé chodbě ukázalo, že bez vzájemné pomoci se dál nikdo nedostane.",
    s3: "Když jeden žák uvízl v úzkém průlezu, ostatní mu posvítili baterkou a společně ho vytáhli ven.",
    sOdb: "Jeskyně, kterou třída navštívila, je veřejnosti otevřená jen o víkendech.",
    odbPos: 2,
    klicA: "Ve složité situaci se vyplatí spolupracovat, ne jen hledět na sebe.",
    dVyvracenyA: "V jeskyni hlavně záleží na tom, kdo je nejrychlejší.",
    dPrehnaneA: "Bez pomoci ostatních se člověk nikdy nikam nedostane.",
    dNeniVTextA: "Jeskyně byla pro třídu příliš nebezpečná a výlet tam neměl vůbec být.",
    klicB: "Spolupráce pomohla žákovi dostat se z úzkého průlezu ven.",
    dDomyslenyB: "Žáci se do té jeskyně po tomhle zážitku už nikdy nechtějí vrátit.",
    dVyvracenyB: "V jeskyni je nejdůležitější být první.",
    dPrehnaneB: "Bez kamarádů se člověk nikdy nikam nedostane.",
  },
  {
    s1: "Mnoho lidí čeká, že pes z útulku si na nový domov zvykne během pár dnů.",
    s2: "Ve skutečnosti plachému psovi trvá získání důvěry k novým lidem často několik týdnů i měsíců.",
    s3: "Rex první týdny na Emu vůbec nereagoval, ale protože mu Ema denně nosila piškoty a mluvila na něj tichým hlasem, po dvou měsících si k ní lehl a nechal se pohladit.",
    sOdb: "Útulek, odkud Rex pochází, se stará také o kočky a králíky.",
    odbPos: 3,
    klicA: "Získat důvěru vystrašeného psa trvá týdny až měsíce, ne pár dní.",
    dVyvracenyA: "Pes z útulku si na nový domov zvykne během pár dnů.",
    dPrehnaneA: "Vystrašený pes si na člověka nikdy úplně nezvykne.",
    dNeniVTextA: "Rex byl v útulku týraný, a proto se lidí bál ještě dlouho po příchodu.",
    klicB: "Pravidelná trpělivá péče pomohla vystrašenému psovi získat důvěru.",
    dDomyslenyB: "Rex se jednou stane cvičeným záchranářským psem, protože je chytrý.",
    dVyvracenyB: "Pes z útulku si zvykne na nový domov téměř hned.",
    dPrehnaneB: "Každý vystrašený pes potřebuje přesně měsíc, aby si zvykl.",
  },
  {
    s1: "Mnoho lidí si myslí, že třídění odpadu jednou rodinou nemá na životní prostředí žádný vliv.",
    s2: "Ve skutečnosti papír, který jedna domácnost za rok vytřídí, ušetří dřevo zhruba ze dvou stromů.",
    s3: "Šestá B rozšířila třídění ze třídy i domů a za měsíc odevzdala nejvíc odpadu ze všech tříd.",
    sOdb: "Škola, kam žáci chodí, byla postavena před více než padesáti lety.",
    odbPos: 1,
    klicA: "I třídění v jediné rodině má na přírodu skutečný dopad.",
    dVyvracenyA: "Třídění odpadu jednou rodinou nemá na životní prostředí žádný vliv.",
    dPrehnaneA: "Třídění odpadu úplně vyřeší znečištění celé planety.",
    dNeniVTextA: "Škola dostala za třídění odpadu peněžní odměnu.",
    klicB: "Třídění papíru v jedné domácnosti ročně ušetří dřevo ze stromů.",
    dDomyslenyB: "Šestá B příští rok přestane odpad třídit, protože už soutěž vyhrála.",
    dVyvracenyB: "Třídění odpadu jednou rodinou nic nezmění.",
    dPrehnaneB: "Bez třídění odpadu by zanikl celý les.",
  },
  {
    s1: "Mnoho lidí považuje bobry žijící u potoka jen za škůdce, kteří zabírají cizí pozemek.",
    s2: "Ve skutečnosti hráz, kterou bobři postaví, zadrží vodu v krajině a vytvoří mokřinu pro spoustu jiných druhů.",
    s3: "Do mokřiny kolem bobří hráze se brzy nastěhovaly žáby, vážky i vodní ptáci, kteří tam předtím nebyli.",
    sOdb: "Bobr je největší evropský hlodavec a může vážit i přes dvacet kilogramů.",
    odbPos: 2,
    klicA: "Bobři svou hrází přírodě spíš prospívají, než aby jí škodili.",
    dVyvracenyA: "Bobři jsou jen škůdci, kteří zabírají cizí pozemek.",
    dPrehnaneA: "Bobři dokážou vyřešit úplně veškeré sucho v krajině.",
    dNeniVTextA: "Bobry do potoka schválně vysadili lidé, aby jim postavili rybník.",
    klicB: "Díky bobří hrázi získaly místo k životu i další druhy živočichů.",
    dDomyslenyB: "Bobři svou hrází brzy zaplaví celé okolní pole i cestu k vesnici.",
    dVyvracenyB: "Bobři krajině jen škodí.",
    dPrehnaneB: "Díky bobrům už v okolí nikdy nebude sucho.",
  },
  {
    s1: "Mnoho lidí si myslí, že jízdní kolo v podobě, jakou známe dnes, vymyslel jeden šikovný vynálezce.",
    s2: "Ve skutečnosti se dnešní kolo vyvíjelo postupně — nejdřív bez pedálů, pak s pedály u předního kola a nakonec s řetězem a přehazovačkou.",
    s3: "Každou z těchto úprav navrhl jiný výrobce v jiné zemi a v jiné době.",
    sOdb: "Dnešní silniční kola váží často méně než deset kilogramů.",
    odbPos: 3,
    klicA: "Dnešní kolo je výsledkem nápadů mnoha lidí, ne jednoho vynálezce.",
    dVyvracenyA: "Jízdní kolo v dnešní podobě vymyslel jeden šikovný vynálezce.",
    dPrehnaneA: "Na vzniku kola se podílel úplně každý cyklista na světě.",
    dNeniVTextA: "První jízdní kolo mělo malý motor, takže se na něm nemuselo šlapat.",
    klicB: "Dnešní kolo vzniklo postupným spojením nápadů více výrobců.",
    dDomyslenyB: "Dnešní jízdní kolo už je dokonalé a dál se nedá nijak vylepšit.",
    dVyvracenyB: "Kolo vymyslel jeden člověk najednou.",
    dPrehnaneB: "Kolo vylepšil úplně každý, kdo ho kdy použil.",
  },
  {
    s1: "Mnoho lidí si myslí, že hmyzí hotel na školní zahradě je jen hezká dekorace, které si hmyz stejně nevšimne.",
    s2: "Ve skutečnosti se do dutých stébel rákosu a děr v hmyzím hotelu brzy nastěhovaly včely samotářky a slunéčka.",
    s3: "Slunéčka v hotelu přes zimu přespávala a na jaře se rozletěla po zahradě lovit mšice.",
    sOdb: "Škola má na zahradě také záhon s jahodami, které žáci sklízejí v červnu.",
    odbPos: 4,
    klicA: "Hmyzí hotel není jen dekorace, hmyz ho opravdu využívá.",
    dVyvracenyA: "Hmyzí hotel je jen hezká dekorace, které si hmyz nevšimne.",
    dPrehnaneA: "Hmyzí hotel do zahrady přiláká úplně všechny druhy hmyzu na světě.",
    dNeniVTextA: "Hmyzí hotel postavila škola z plastu.",
    klicB: "Slunéčka z hmyzího hotelu na jaře pomáhají zahradě tím, že loví mšice.",
    dDomyslenyB: "Škola postaví na zahradě další hmyzí hotely, protože se ten první osvědčil.",
    dVyvracenyB: "Hmyzí hotel je zbytečná dekorace.",
    dPrehnaneB: "Bez hmyzího hotelu by na zahradě nežil vůbec žádný hmyz.",
  },
];

function taskSdeleni(u: UkazkaL3): PracticeTask | null {
  const text = [u.s1, u.s2, u.s3, u.sOdb].join(" ");
  const distractors: Distractor[] = [
    { value: u.dVyvracenyA, why: "Autor tohle tvrzení v textu naopak vyvrací — všimni si slova „Ve skutečnosti“, po kterém říká pravý opak." },
    { value: u.dPrehnaneA, why: "Tohle jde dál, než text tvrdí — autor nic takového netvrdí a neříká, že to platí úplně vždy a pro každého." },
    { value: u.dNeniVTextA, why: "Tohle text vůbec neříká — v ukázce to nikde nestojí." },
  ];
  return buildChoiceTask(`Text: „${text}“ Co chce autor čtenáři sdělit?`, u.klicA, distractors, {
    hints: HINTS_SDELENI,
    explanation: `${u.klicA} To je hlavní sdělení textu, ne jen jeden z detailů nebo domněnka navíc.`,
  });
}

function taskZaver(u: UkazkaL3): PracticeTask | null {
  const text = [u.s1, u.s2, u.s3, u.sOdb].join(" ");
  const distractors: Distractor[] = [
    { value: u.dDomyslenyB, why: "Text tohle netvrdí ani nenaznačuje — je to vymyšlené navíc." },
    { value: u.dVyvracenyB, why: "Text tohle tvrzení naopak vyvrací." },
    { value: u.dPrehnaneB, why: "Tohle jde dál, než text tvrdí — z toho, co text uvádí, neplyne, že to platí úplně vždy a pro každého." },
  ];
  return buildChoiceTask(`Text: „${text}“ Který závěr z textu vyplývá?`, u.klicB, distractors, {
    hints: HINTS_ZAVER,
    explanation: `${u.klicB} Tenhle závěr má v textu oporu, i když ho autor doslova takhle nenapsal.`,
  });
}

/** Vloží odbočující větu na pozici `odbPos` mezi tři "kmenové" věty. */
function orderSentences(u: UkazkaL3): string[] {
  const arr = [u.s1, u.s2, u.s3];
  arr.splice(u.odbPos - 1, 0, u.sOdb);
  return arr;
}

function taskNepatri(u: UkazkaL3): PracticeTask | null {
  const ordered = orderSentences(u);
  const numbered = ordered.map((s, i) => `(${i + 1}) ${s}`).join(" ");
  const correct = `věta ${u.odbPos}`;
  const distractors: Distractor[] = [1, 2, 3, 4]
    .filter((n) => n !== u.odbPos)
    .map((n) => ({
      value: `věta ${n}`,
      why: `Věta „${ordered[n - 1]}“ patří k hlavní myšlence textu — mluví přímo o tématu, ne o něčem vedlejším.`,
    }));
  return buildChoiceTask(
    `Text: „${numbered}“ Která věta do textu nepatří, protože neslouží hlavní myšlence?`,
    correct,
    distractors,
    {
      hints: HINTS_NEPATRI,
      explanation: `Věta „${u.sOdb}“ sice v textu je, ale netýká se toho, co chce text hlavně sdělit — ostatní věty se k hlavní myšlence vztahují, tahle ne.`,
    },
  );
}

function poolL3(): Builder[] {
  const out: Builder[] = [];
  for (const u of BANKA_L3) {
    out.push(() => taskSdeleni(u));
    out.push(() => taskZaver(u));
    out.push(() => taskNepatri(u));
  }
  return out;
}

// ── Generátor ────────────────────────────────────────────────────────────────
/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), 24, pool.length * 3);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const KLICOVA_SLOVA_HLAVNI_MYSLENKY_TEXTU: TopicMetadata[] = [
  {
    id: "g6-cjl-klicova-slova-hlavni-myslenky-textu-6",
    rvpNodeId: "g6-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-klicova-slova-hlavni-myslenky-textu",
    title: "Klíčová slova a hlavní myšlenka textu",
    studentTitle: "O čem text je a co chce říct",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Najdeš klíčová slova, téma a hlavní myšlenku krátkého textu.",
    keywords: ["klíčová slova", "hlavní myšlenka", "téma textu", "čtení s porozuměním", "nadpis", "závěr z textu"],
    goals: [
      "Najít v krátkém textu klíčová slova a určit, o čem text je.",
      "Rozlišit hlavní myšlenku textu od detailu, příliš obecného tvrzení a tvrzení, které v textu není.",
      "Odvodit z textu podložený závěr a rozpoznat větu, která nesouvisí s hlavní myšlenkou.",
    ],
    boundaries: [
      "Navazuje na grade-4/cjl/vyhledavaniKlicovychSlovAHlavniMyslenky.ts, kde jsou definice pojmů — tady se definice neopakují, jen se rovnou pracuje s ukázkami.",
      "Žádné psaní vlastního textu (sloh) — žák jen vybírá ze čtyř možností.",
      "Ukázky jsou vlastní krátké texty (3–5 vět) ze života 11–12letých, ne úryvky z chráněných děl.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Zkus text shrnout do pár slov: o kom nebo o čem mluví každá věta? To, co mají všechny věty společné, je klíčové.",
      steps: [
        "Přečti si text a všimni si slov, která se týkají celého textu, ne jen jedné věty.",
        "Zkus text shrnout jednou větou vlastními slovy — to je hlavní myšlenka.",
        "Porovnej svou větu se čtyřmi možnostmi a vyber tu, která sedí na celý text, ne jen na jednu větu.",
      ],
      commonMistake: "Vybrat první větu textu nebo zajímavý detail místo pointy, anebo naopak tvrzení tak obecné, že by sedělo na skoro každý text.",
      example: "„Ve skutečnosti se v úzké a tmavé chodbě ukázalo, že bez vzájemné pomoci se dál nikdo nedostane.“ — tohle není detail ani domněnka navíc, ale to hlavní, co chce text sdělit.",
    },
  },
];
