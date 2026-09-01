import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), select_one.
//   L1 = rozpoznání: izolovaná definice jednoho pojmu na otázku
//   L2 = aplikace:   konkrétní scénář → který pojem/krok se uplatňuje
//   L3 = transfer:   hraniční rozlišení (konflikt vs násilí), pořadí kroků,
//                    kombinace dvou principů, tolerance vs respekt
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Co znamená slovo empatie?",
    correctAnswer: "Vcítit se do pocitů druhého člověka",
    options: [
      "Vcítit se do pocitů druhého člověka",
      "Být nejlepší ve třídě",
      "Dělat si, co chci",
      "Mluvit hodně hlasitě",
    ],
    hints: [
      "Empatie má základ ve slově 'cítit' — jde o pocity.",
      "Když vidíš smutného kamaráda a snažíš se pochopit, proč je smutný, projevuješ empatii.",
    ],
    explanation:
      "Empatie znamená umět se vcítit do toho, jak se druhý člověk cítí — zkusit pochopit jeho radost, smutek nebo strach. Je to důležitá součást dobrého přátelství.",
  },
  {
    question: "Co znamená respektovat druhého člověka?",
    correctAnswer: "Brát ohled na jeho pocity a názory",
    options: [
      "Brát ohled na jeho pocity a názory",
      "Vždy s ním souhlasit",
      "Ignorovat, co říká",
      "Dělat vše, co si přeje",
    ],
    hints: [
      "Respekt neznamená souhlas — můžeš mít jiný názor a přesto respektovat druhého.",
      "Respekt není to samé jako poslušnost ani lhostejnost — je to o tom, jak se k druhému chováš navzdory rozdílnému názoru.",
    ],
    explanation:
      "Respekt znamená, že bereme ohled na pocity, názory a potřeby druhého. Nemusíme vždy souhlasit, ale přistupujeme k druhým s úctou a neubližujeme jim.",
  },
  {
    question: "Co je kompromis?",
    correctAnswer: "Řešení, kdy každý trochu ustoupí, aby se dohodli",
    options: [
      "Řešení, kdy každý trochu ustoupí, aby se dohodli",
      "Jeden vyhraje a druhý prohraje",
      "Hádka, která neskončí",
      "Přijmout rozhodnutí dospělého",
    ],
    hints: [
      "Kompromis hledá cestu, která vyhovuje oběma stranám — ne jen jedné.",
      "Každý musí trochu ustoupit od toho, co chce.",
    ],
    explanation:
      "Kompromis je způsob řešení sporu, kdy obě strany trochu ustoupí od svého požadavku a najdou společné řešení. Například: jeden chce hrát fotbal, druhý basketbal — kompromis je odehrát půl hodiny každou hru.",
  },
  {
    question: "Co je spolupráce?",
    correctAnswer: "Společná práce na jednom cíli",
    options: [
      "Společná práce na jednom cíli",
      "Dělat vše sám bez pomoci",
      "Závodit, kdo bude rychlejší",
      "Ignorovat spolužáky",
    ],
    hints: [
      "Spolupráce = spolu + práce. Jde o společné úsilí.",
      "Když táhnou všichni za jeden provaz, dosáhnou cíle snadněji.",
    ],
    explanation:
      "Spolupráce znamená, že lidé pracují společně na dosažení jednoho cíle. Každý přispěje svou silou nebo dovedností a výsledek je lepší, než kdyby každý dělal vše sám.",
  },
  {
    question: "Co znamená tolerance?",
    correctAnswer: "Přijímat a respektovat odlišnosti druhých",
    options: [
      "Přijímat a respektovat odlišnosti druhých",
      "Smát se lidem, kteří jsou jiní",
      "Kamarádit se jen s těmi, kdo jsou jako já",
      "Nikomu nic neříkat",
    ],
    hints: [
      "Lidé jsou různí — jiné záliby, vzhled, zvyky. Tolerance je to přijímat.",
      "Tolerantní člověk neubližuje těm, kdo jsou jiní.",
    ],
    explanation:
      "Tolerance znamená, že přijímáme a respektujeme to, že jsou lidé různí — mají jiné záliby, jiný původ nebo jiné názory. Tolerantní třída je místo, kde se všichni cítí bezpečně.",
  },
  {
    question: "Co je konflikt?",
    correctAnswer: "Neshoda mezi lidmi, kterou lze vyřešit dohodou",
    options: [
      "Neshoda mezi lidmi, kterou lze vyřešit dohodou",
      "Vždy velká rvačka",
      "Kamarádství, které trvá navždy",
      "Soutěž o nejlepší výsledek",
    ],
    hints: [
      "Konflikt není totéž co rvačka — je to neshoda v názoru.",
      "Konflikt nemusí skončit hádkou ani rvačkou — přemýšlej, jakým klidnějším způsobem může skončit, aniž by někdo někomu ublížil.",
    ],
    explanation:
      "Konflikt je neshoda nebo spor mezi lidmi, například různý názor na to, co dělat. Na rozdíl od násilí lze konflikt vyřešit klidnou dohodou, aniž by někomu ublížil.",
  },
  {
    question: "Co je násilí?",
    correctAnswer: "Záměrné ubližování slovem nebo fyzicky",
    options: [
      "Záměrné ubližování slovem nebo fyzicky",
      "Hádka, která skončí dohodou",
      "Rozdílné názory na jednu věc",
      "Soutěž o nejlepší výsledek",
    ],
    hints: [
      "Konflikt lze vyřešit dohodou. Násilí ubližuje záměrně.",
      "Mluvit o problému = konflikt. Bít nebo urážet = násilí.",
    ],
    explanation:
      "Násilí je záměrné ubližování druhému člověku — fyzicky (bití) nebo slovně (urážky, vyhrůžky). Na rozdíl od konfliktu ho nelze vyřešit dohodou, protože už někomu ublížilo.",
  },
  {
    question: "Co znamená naslouchat druhému člověku?",
    correctAnswer: "Pozorně poslouchat, co říká, a snažit se mu porozumět",
    options: [
      "Pozorně poslouchat, co říká, a snažit se mu porozumět",
      "Čekat, až budu moct mluvit já",
      "Dělat u toho jinou činnost",
      "Poslouchat jen polovinu věty",
    ],
    hints: [
      "Naslouchání není totéž jako slyšet zvuk — jde o porozumění.",
      "Pozorný posluchač se dívá na mluvčího a nepřerušuje ho.",
    ],
    explanation:
      "Naslouchat znamená opravdu se soustředit na to, co druhý říká, a snažit se pochopit jeho pohled. Je to základ dobré komunikace i řešení sporů.",
  },
  {
    question: "Co znamená věrnost v kamarádství?",
    correctAnswer: "Být kamarádovi oporou i v těžkých chvílích",
    options: [
      "Být kamarádovi oporou i v těžkých chvílích",
      "Kamarádit se jen, když se mi to hodí",
      "Přidat se vždy k většině proti kamarádovi",
      "Mluvit o kamarádovi za jeho zády",
    ],
    hints: [
      "Věrný kamarád neopustí druhého, ani když je to těžké.",
      "Věrnost se pozná hlavně v nesnázích, ne v pohodě.",
    ],
    explanation:
      "Věrnost znamená, že jsme kamarádovi oporou i tehdy, když se mu nedaří nebo je v nesnázích — nejen když je vše v pořádku.",
  },
  {
    question: "Co znamená být upřímný ke kamarádovi?",
    correctAnswer: "Říkat mu pravdu, i když je nepříjemná",
    options: [
      "Říkat mu pravdu, i když je nepříjemná",
      "Říkat mu jen to, co chce slyšet",
      "Lhát, aby se necítil špatně",
      "Nic mu neříkat a mlčet",
    ],
    hints: [
      "Upřímnost znamená pravdu, ne vždy příjemnou zprávu.",
      "Skutečný kamarád raději řekne pravdu, než by lhal.",
    ],
    explanation:
      "Upřímnost znamená říkat kamarádovi pravdu, i když se mu nemusí líbit. Kamarádství založené na lžích dlouho nevydrží.",
  },
  {
    question: "K čemu slouží pravidla třídy?",
    correctAnswer: "Pomáhají, aby se všichni cítili bezpečně a mohli se učit",
    options: [
      "Pomáhají, aby se všichni cítili bezpečně a mohli se učit",
      "Jsou tu jen na obtěžování žáků",
      "Platí jen pro některé žáky",
      "Slouží k trestání za každou maličkost",
    ],
    hints: [
      "Pravidla platí pro všechny stejně — i pro učitele.",
      "Bez pravidel by ve třídě vládl chaos.",
    ],
    explanation:
      "Pravidla třídy vytvářejí bezpečné prostředí, kde se každý může učit a vyjádřit svůj názor. Platí pro všechny stejně a vznikají společně.",
  },
  {
    question: "Co znamená pomoci kamarádovi v nesnázích?",
    correctAnswer: "Podpořit ho a udělat něco, co mu situaci ulehčí",
    options: [
      "Podpořit ho a udělat něco, co mu situaci ulehčí",
      "Počkat, až problém vyřeší sám",
      "Smát se mu, že to nezvládá",
      "Říct mu, ať se s tím nikomu nesvěřuje",
    ],
    hints: [
      "Pomoc znamená aktivně něco udělat, ne jen přihlížet.",
      "Kamarád v nouzi ocení, když mu někdo nabídne pomoc.",
    ],
    explanation:
      "Pomoci kamarádovi znamená všimnout si, že něco potřebuje, a aktivně mu nabídnout podporu — třeba radu, spolupráci nebo jen vyslechnutí.",
  },
  {
    question: "Co je dohoda při řešení sporu?",
    correctAnswer: "Řešení, se kterým souhlasí obě strany",
    options: [
      "Řešení, se kterým souhlasí obě strany",
      "Rozhodnutí, které vyhovuje jen jedné straně",
      "Rozkaz silnějšího, kterému druhý musí ustoupit",
      "Konec kamarádství kvůli sporu",
    ],
    hints: [
      "Dohoda nefunguje, když je spokojená jen jedna strana a druhá musí prostě ustoupit — přemýšlej, kdo všechno by s ní měl být spokojený.",
      "Není to vítězství jednoho, ale společné řešení.",
    ],
    explanation:
      "Dohoda je výsledek, se kterým souhlasí obě strany sporu. Nemusí být pro každého úplně ideální, ale obě strany ji přijímají jako spravedlivou.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question:
      "Jana a Tomáš se hádají o to, jakou hru hrát. Nakonec se domluví, že hodinu hrají Janinu hru a hodinu Tomášovu. Jak se tomuto řešení říká?",
    correctAnswer: "Kompromis",
    options: ["Kompromis", "Násilí", "Ignorování problému", "Trest"],
    hints: [
      "Oba trochu ustoupili od svého přání.",
      "Řešení vyhovuje oběma stranám.",
    ],
    explanation:
      "Když každý trochu ustoupí a najdou řešení, které vyhovuje oběma, jde o kompromis. Jana a Tomáš takto vyřešili spor o hru.",
  },
  {
    question:
      "Petr a Lukáš se pohádali a oba na sebe křičí. Co by měli udělat jako úplně první krok?",
    correctAnswer: "Uklidnit se",
    options: [
      "Uklidnit se",
      "Křičet ještě hlasitěji",
      "Okamžitě si přestat navždy povídat",
      "Zavolat si na pomoc další spolužáky do hádky",
    ],
    hints: [
      "Ve vzteku se nedá pořádně domluvit.",
      "Teprve po zklidnění lze klidně mluvit.",
    ],
    explanation:
      "Než se dá spor řešit, je třeba se nejprve uklidnit. Ve vzteku lidé často říkají věci, které pak litují, a domluva nefunguje.",
  },
  {
    question:
      "Do třídy přišel nový spolužák, který mluví s jiným přízvukem. Jak se k němu zachováš?",
    correctAnswer: "Přivítám ho a pomůžu mu zapadnout do třídy",
    options: [
      "Přivítám ho a pomůžu mu zapadnout do třídy",
      "Budu se mu smát kvůli přízvuku",
      "Budu ho ignorovat, dokud nezačne mluvit sám",
      "Řeknu ostatním, ať si s ním nepovídají",
    ],
    hints: [
      "Nový spolužák se cítí nejistě — vlídnost mu pomůže.",
      "Tolerance znamená přijímat to, že je někdo jiný.",
    ],
    explanation:
      "Vlídné přivítání a pomoc novému spolužákovi je projevem tolerance — přijímáme, že každý může být trochu jiný, a nikoho to nesnižuje.",
  },
  {
    question:
      "Všimneš si, že tvůj kamarád je ve škole smutný a nemluví. Co uděláš?",
    correctAnswer: "Zeptám se ho, co se stalo, a nabídnu mu pomoc",
    options: [
      "Zeptám se ho, co se stalo, a nabídnu mu pomoc",
      "Budu předstírat, že jsem si ničeho nevšiml",
      "Řeknu ostatním, ať se mu smějí",
      "Počkám, až mi to řekne sám za týden",
    ],
    hints: [
      "Empatie znamená všímat si pocitů druhého.",
      "Zájem o kamaráda ukazuje, že nám na něm záleží.",
    ],
    explanation:
      "Všimnout si smutku kamaráda a zeptat se ho je projevem empatie — snažíme se pochopit, jak se cítí, a nabídnout podporu.",
  },
  {
    question:
      "Skupina žáků má společně postavit model hradu z papíru. Každý dělá jinou část — jeden věž, druhý bránu, třetí hradby. Jak se tomuto společnému postupu říká?",
    correctAnswer: "Spolupráce",
    options: ["Spolupráce", "Soutěž", "Kompromis", "Konflikt"],
    hints: [
      "Každý přispívá svou částí ke společnému cíli.",
      "Zamysli se, jak se nazývá situace, kdy víc lidí dělá různé části jednoho společného díla, aby ho dohromady dokončili.",
    ],
    explanation:
      "Když lidé společně pracují na jednom cíli a každý přispívá svou částí, jde o spolupráci. Výsledek je lepší, než kdyby to dělal jeden sám.",
  },
  {
    question:
      "Kamarádka má jiný názor na to, jaký film je nejlepší. Ty s ní nesouhlasíš, ale vyslechneš ji a neposmíváš se jí. Co tím projevuješ?",
    correctAnswer: "Respekt",
    options: ["Respekt", "Souhlas se vším, co řekne", "Lhostejnost", "Nadřazenost"],
    hints: [
      "Vyslechnout někoho a nezesměšňovat ho, i když s ním nesouhlasíš, je projevem jedné důležité vlastnosti — jak bys jí říkal/a?",
      "Můžeš mít jiný názor a přesto se chovat s úctou.",
    ],
    explanation:
      "Vyslechnout jiný názor a nezesměšňovat ho je projevem respektu. Respekt neznamená souhlas, ale ohled na to, že i druhý má právo na svůj názor.",
  },
  {
    question:
      "Při hádce s bratrem ho necháš domluvit celou větu, díváš se na něj a nepřerušuješ ho. Co tím děláš?",
    correctAnswer: "Nasloucháš mu",
    options: ["Nasloucháš mu", "Ignoruješ ho", "Přerušuješ ho", "Předstíráš, že posloucháš"],
    hints: [
      "Naslouchání znamená nechat druhého domluvit.",
      "Pozorný posluchač se soustředí na mluvčího.",
    ],
    explanation:
      "Nechat druhého domluvit a soustředit se na to, co říká, je naslouchání — pomáhá pochopit jeho pohled a spor lépe vyřešit.",
  },
  {
    question:
      "Ve třídě platí, že když někdo mluví, ostatní mu neskáčou do řeči. Čeho se toto pravidlo týká?",
    correctAnswer: "Vzájemného naslouchání a respektu ve třídě",
    options: [
      "Vzájemného naslouchání a respektu ve třídě",
      "Trestání žáků, kteří se pletou",
      "Toho, kdo smí mluvit jako první každý den",
      "Soutěže, kdo domluví nejdéle",
    ],
    hints: [
      "Pravidlo pomáhá, aby každý dostal prostor mluvit.",
      "Souvisí s nasloucháním a respektem k druhým.",
    ],
    explanation:
      "Pravidlo neskákat si do řeči zajišťuje, že si všichni navzájem naslouchají a respektují se — každý dostane prostor říct svůj názor.",
  },
  {
    question:
      "Tvůj kamarád leží nemocný doma a nemůže do školy. Ty mu po vyučování zajdeš přinést sešity a zápisky. Co tím projevuješ?",
    correctAnswer: "Věrnost a ochotu pomoct",
    options: ["Zvědavost a všetečnost", "Věrnost a ochotu pomoct", "Soutěživost za každou cenu", "Lhostejnost k druhým"],
    hints: [
      "Pravý kamarád je oporou i v těžkých chvílích.",
      "Pomoc nemocnému kamarádovi ukazuje, že nám na něm záleží.",
    ],
    explanation:
      "Navštívit nemocného kamaráda a pomoct mu s učivem je projevem věrnosti a ochoty pomoct — základních znaků dobrého kamarádství.",
  },
  {
    question:
      "Omylem jsi rozbil kamarádovu hračku. Přiznáš mu to a omluvíš se, i když víš, že bude smutný. Co tím projevuješ?",
    correctAnswer: "Upřímnost",
    options: ["Upřímnost", "Zbabělost", "Lhostejnost", "Vychloubání"],
    hints: [
      "Přiznat chybu, i když víš, že z toho bude nepříjemná reakce, ukazuje vlastnost, která je opakem lhaní.",
      "Přiznat chybu je těžší, ale správnější než lhát.",
    ],
    explanation:
      "Přiznat chybu a omluvit se, i když je to nepříjemné, je projevem upřímnosti. Kamarádství postavené na pravdě je pevnější.",
  },
  {
    question: "Spolužák tě o přestávce fyzicky uhodí. Jak správně zareaguješ?",
    correctAnswer: "Řeknu to učiteli nebo jinému dospělému",
    options: [
      "Řeknu to učiteli nebo jinému dospělému",
      "Uhodím ho zpátky",
      "Nic neřeknu a budu se schovávat",
      "Budu si myslet, že jsem si to zasloužil",
    ],
    hints: [
      "Fyzické ubližování je vždy vážná věc, kterou má řešit dospělý.",
      "Oplácení by situaci jen zhoršilo.",
    ],
    explanation:
      "Fyzické násilí se nesmí ignorovat ani oplácet. Správná reakce je říct to dospělému, který dokáže situaci bezpečně vyřešit.",
  },
  {
    question:
      "Ty chceš hrát na hřišti fotbal, kamarád chce hrát na honěnou. Oba chcete najít řešení, které bude vyhovovat vám oběma. Co k tomu především potřebujete udělat?",
    correctAnswer: "Domluvit se a najít společné řešení",
    options: [
      "Domluvit se a najít společné řešení",
      "Počkat, až se ten druhý vzdá",
      "Přestat si spolu hrát",
      "Nechat rozhodnout někoho třetího bez ptaní",
    ],
    hints: [
      "Řešení, které vyhovuje oběma, vzniká domluvou.",
      "Nikdo nemusí úplně vyhrát ani prohrát.",
    ],
    explanation:
      "Když chtějí obě strany najít řešení vyhovující oběma, musí se domluvit — třeba střídáním her nebo kompromisem.",
  },
  {
    question:
      "Dva spolužáci se neshodnou na tom, kterou básničku recitovat na besídce. Nikdo z nich druhému neublížil, jen mají jiný názor. Jak se tato situace nazývá?",
    correctAnswer: "Konflikt",
    options: ["Konflikt", "Násilí", "Kamarádství", "Spolupráce"],
    hints: [
      "Jde jen o neshodu v názoru, ne o ubližování.",
      "Přemýšlej, jak se obecně nazývá stav, kdy se dva lidé neshodnou v názoru, ale nikdo druhému neubližuje.",
    ],
    explanation:
      "Neshoda v názoru bez ubližování je konflikt. Na rozdíl od násilí ho lze vyřešit klidným rozhovorem a dohodou.",
  },
  {
    question:
      "Spolužák má jiné zájmy než ty — sbírá známky, zatímco ty máš rád fotbal. Přesto se s ním bavíš a nezesměšňuješ jeho koníček. Co tím projevuješ?",
    correctAnswer: "Toleranci",
    options: ["Toleranci", "Kompromis", "Násilí", "Lhostejnost"],
    hints: [
      "Tolerance znamená přijímat, že lidé mají různé zájmy.",
      "Nikdo nemusí mít stejné koníčky, aby si mohli rozumět.",
    ],
    explanation:
      "Přijmout, že má spolužák jiné zájmy, a nezesměšňovat ho, je projevem tolerance — respektujeme, že lidé jsou různí, i pokud jde o záliby.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question:
      "Spolužák tě už několik dnů opakovaně schválně strkal a nadával ti, i když jsi mu řekl, ať přestane. Je to ještě konflikt, nebo už jde o něco jiného, a jak správně zareaguješ?",
    correctAnswer: "Jde už o násilí — řeknu to učiteli nebo rodičům",
    options: [
      "Jde už o násilí — řeknu to učiteli nebo rodičům",
      "Je to jen konflikt — počkám, až ho to přestane bavit",
      "Je to jen konflikt — musím mu to oplatit",
      "Jde už o násilí — nikomu to neřeknu, abych nebyl žalobníček",
    ],
    hints: [
      "Opakované záměrné ubližování (strkání, nadávky) už není jen neshoda.",
      "Když se ubližování opakuje a bolí, je třeba přivolat pomoc dospělého.",
    ],
    explanation:
      "Jednorázová neshoda je konflikt, ale opakované záměrné ubližování slovem i fyzicky je už násilí. Správná reakce je nahlásit to dospělému, ne mlčet ani se mstít.",
  },
  {
    question:
      "Pohádal ses s kamarádem o to, kdo bude první na houpačce. Jaké je SPRÁVNÉ pořadí kroků k vyřešení sporu?",
    correctAnswer:
      "Nejdřív se uklidnit, pak si navzájem naslouchat, nakonec najít společné řešení",
    options: [
      "Nejdřív se uklidnit, pak si navzájem naslouchat, nakonec najít společné řešení",
      "Nejdřív najít řešení, pak se uklidnit, nakonec naslouchat",
      "Nejdřív naslouchat, pak se pohádat ještě víc, nakonec se uklidnit",
      "Nejdřív se urazit, pak přestat kamarádit, nakonec se uklidnit",
    ],
    hints: [
      "Ve vzteku se nedá pořádně naslouchat ani hledat řešení.",
      "Teprve po zklidnění má smysl poslouchat druhého a hledat dohodu.",
    ],
    explanation:
      "Správný postup je: nejprve se uklidnit, pak si naslouchat, abychom pochopili pohled druhého, a nakonec spolu najít řešení, které vyhovuje oběma.",
  },
  {
    question:
      "Nový spolužák má jiné náboženství a jiné zvyky u jídla. Ty ho bez problémů necháš být, jaký je, ALE navíc se ho zeptáš na jeho zvyky a bereš vážně, co ti řekne. Co k toleranci navíc přidáváš?",
    correctAnswer: "Respekt — aktivně beru ohled na jeho názory a potřeby",
    options: [
      "Respekt — aktivně beru ohled na jeho názory a potřeby",
      "Nic — tolerance a respekt jsou úplně to samé",
      "Kompromis — musím se vzdát svých zvyků",
      "Násilí — nutím ho, aby se přizpůsobil",
    ],
    hints: [
      "Tolerance = přijmout, že je jiný. Respekt = navíc brát ohled na jeho potřeby a názory.",
      "Zeptat se a brát vážně jeho odpovědi je krok navíc oproti pouhému přijetí.",
    ],
    explanation:
      "Tolerance znamená přijmout, že je někdo jiný. Respekt jde o krok dál — aktivně bereme ohled na jeho potřeby a názory, například se ptáme a bereme vážně odpovědi.",
  },
  {
    question:
      "Kamarád chce hrát jinou hru než ty. Hledáte řešení, které bude fér pro oba. Jak se takové řešení jmenuje, A co k jeho nalezení POTŘEBUJETE nejdřív udělat?",
    correctAnswer: "Kompromis — nejdřív si musíme navzájem naslouchat",
    options: [
      "Kompromis — nejdřív si musíme navzájem naslouchat",
      "Násilí — nejdřív musí jeden ustoupit násilím",
      "Kompromis — nejdřív musíme přestat kamarádit",
      "Soutěž — nejdřív musíme zjistit, kdo je silnější",
    ],
    hints: [
      "Fér řešení pro oba se nazývá kompromis.",
      "Bez naslouchání nezjistíte, co ten druhý vlastně chce.",
    ],
    explanation:
      "Řešení fér pro oba je kompromis. Aby ho šlo najít, musí si obě strany nejdřív navzájem naslouchat, aby pochopily, co ten druhý potřebuje.",
  },
  {
    question:
      "Kamarádi si o přestávce navzájem dělají legraci a smějí se všichni včetně toho, o kom je vtip. Jeden den si ale jeden ze spolužáků všimne, že se určitému spolužákovi vtipy už nelíbí a je z nich smutný, ale ostatní pokračují dál. Co by měli udělat?",
    correctAnswer:
      "Přestat, protože škádlení, které ubližuje, už není zábava, ale násilí",
    options: [
      "Přestat, protože škádlení, které ubližuje, už není zábava, ale násilí",
      "Pokračovat, protože si to začali všichni společně",
      "Smát se ještě víc, aby to nebylo nápadné",
      "Nic neříkat, protože si za to smutný spolužák může sám",
    ],
    hints: [
      "Škádlení je v pořádku, jen dokud se u něj baví všichni — i ten, koho se týká.",
      "Když někomu vtipy ubližují a on je smutný, přestává jít o zábavu.",
    ],
    explanation:
      "Hranice mezi škádlením a ubližováním je v tom, jestli se baví i ten, o kom je vtip. Když je mu z toho smutno, přestává to být zábava a je třeba přestat — jinak jde o ubližování.",
  },
  {
    question:
      "Třída společně vymýšlí nové pravidlo, jak se chovat o přestávkách. Každý navrhne nápad a pak hlasují, které pravidlo se jim líbí nejvíc. Jaké DVA principy se tu uplatňují?",
    correctAnswer: "Spolupráce (společná tvorba) a respekt k názoru většiny",
    options: [
      "Spolupráce (společná tvorba) a respekt k názoru většiny",
      "Násilí (nucení) a lhostejnost",
      "Soutěž (kdo vyhraje) a ignorování ostatních",
      "Kompromis (nikdo nic nenavrhne) a mlčení",
    ],
    hints: [
      "Společné vymýšlení pravidla je spolupráce.",
      "Přijetí výsledku hlasování i těmi, jejichž návrh nevyhrál, je respekt.",
    ],
    explanation:
      "Když třída společně tvoří pravidlo, jde o spolupráci. Přijetí výsledku hlasování, i když nevyhrál váš nápad, je projevem respektu k rozhodnutí většiny.",
  },
  {
    question:
      "Kamarád ti řekl ošklivé slovo jednou v afektu a hned se omluvil. Jiný den tě spolužák opakovaně bije o přestávkách. Liší se tyto dvě situace, a pokud ano, jak s nimi naložíš?",
    correctAnswer:
      "Ano — první je konflikt (domluvíme se), druhé je násilí (řeknu dospělému)",
    options: [
      "Ano — první je konflikt (domluvíme se), druhé je násilí (řeknu dospělému)",
      "Ne — obě situace jsou stejně vážné a řeším je stejně",
      "Ano — obě jsou násilí, obě oplatím stejně",
      "Ne — obě jsou jen legrace, nemusím nic řešit",
    ],
    hints: [
      "Jednorázové slovo v afektu s omluvou je jiné než opakované fyzické ubližování.",
      "Závažnější a opakované ubližování patří vždy dospělému k řešení.",
    ],
    explanation:
      "Jednorázová hádka se slovní omluvou je běžný konflikt, který se dá vyřešit domluvou. Opakované fyzické ubližování je násilí, které je třeba nahlásit dospělému.",
  },
  {
    question:
      "Všimneš si, že spolužák sedí o přestávce sám a vypadá smutně. Co uděláš NEJDŘÍV a co POTOM?",
    correctAnswer:
      "Nejdřív se ho zeptám, co se děje, a pak mu nabídnu, ať si sedne k nám",
    options: [
      "Nejdřív se ho zeptám, co se děje, a pak mu nabídnu, ať si sedne k nám",
      "Nejdřív ho obejdu, potom si o něm budu povídat s ostatními",
      "Nejdřív se mu vysměju, potom ho pozvu mezi nás",
      "Nejdřív nic neudělám, potom počkám, jestli si někdo jiný všimne",
    ],
    hints: [
      "Empatie začíná všimnutím si a zeptáním se.",
      "Po zjištění, co se děje, následuje konkrétní pomoc — třeba pozvání mezi ostatní.",
    ],
    explanation:
      "Empatie znamená všimnout si pocitů druhého a zeptat se, co se děje. Druhým krokem je nabídnout konkrétní pomoc, například pozvat smutného spolužáka mezi sebe.",
  },
  {
    question:
      "Čtyři kamarádi chtějí hrát čtyři různé hry. Tři z nich se dohodnou, že budou hrát jen tu hru, kterou chce jeden nejhlasitější kluk, a ostatní tři návrhy úplně zavrhnou. Je to kompromis?",
    correctAnswer:
      "Ne, ustoupili jen tři — kompromis by zohlednil přání všech",
    options: [
      "Ne, ustoupili jen tři — kompromis by zohlednil přání všech",
      "Ano, protože se nakonec na něčem dohodli",
      "Ano, protože hlasitější názor má vždy přednost",
      "Ne, protože se vůbec nedohodli",
    ],
    hints: [
      "Zamysli se, kdo všechno musel ze svého přání slevit.",
      "Fér řešení pro čtyři kamarády by mohlo být střídání her, aby si zahrál každý.",
    ],
    explanation:
      "Pravý kompromis vyžaduje, aby ustoupily všechny strany, ne jen některé. Když tři ustoupí a jeden ne, jde spíš o prosazení silnějšího názoru než o skutečnou dohodu.",
  },
  {
    question:
      "Ve třídě se opakovaně hádáte o to, kdo bude mazat tabuli. Co uděláte NEJDŘÍV, abyste spor vyřešili natrvalo, a jaké řešení pak zavedete?",
    correctAnswer:
      "Nejdřív si o problému promluvíme, pak zavedeme pravidlo, aby se u mazání střídali všichni podle rozpisu",
    options: [
      "Nejdřív si o problému promluvíme, pak zavedeme pravidlo, aby se u mazání střídali všichni podle rozpisu",
      "Nejdřív se pohádáme ještě víc, pak necháme mazat pořád jednoho",
      "Nejdřív o tom nikdo nemluví, pak si to vyřeší silnější žáci sami",
      "Nejdřív zavedeme pravidlo, pak si teprve promluvíme, jestli je fér",
    ],
    hints: [
      "Opakovaný spor je dobré vyřešit trvalým pravidlem, ne pořád dokola.",
      "Rozpis, kde se všichni střídají, je fér pro každého.",
    ],
    explanation:
      "Když se stejný spor opakuje, je dobré si o něm promluvit a zavést jasné pravidlo (např. rozpis střídání), které spor vyřeší natrvalo a spravedlivě pro všechny.",
  },
  {
    question:
      "Spolužák tvrdí něco, o čem víš, že to není pravda (například že Země je placatá). Být tolerantní znamená, že...",
    correctAnswer:
      "Nechám ho domluvit a slušně mu vysvětlím fakta, ale neurážím ho",
    options: [
      "Nechám ho domluvit a slušně mu vysvětlím fakta, ale neurážím ho",
      "Musím s ním souhlasit, i když vím, že nemá pravdu",
      "Vysměju se mu, že říká nesmysly",
      "Řeknu, že s ním kvůli tomu už nechci kamarádit",
    ],
    hints: [
      "Tolerance neznamená souhlasit se vším, i s fakticky nesprávnou věcí.",
      "Slušně vysvětlit fakta a respektovat člověka jsou dvě různé věci.",
    ],
    explanation:
      "Tolerance a respekt k člověku neznamenají, že musíme souhlasit s nepravdivým tvrzením. Můžeme slušně vysvětlit fakta, aniž bychom se druhému posmívali nebo ho odmítli.",
  },
  {
    question:
      "Skupina spolužáků záměrně nikoho nezve, aby si s nimi hrál, a jednomu spolužáku dlouhodobě říkají, že je hloupý. Je to jen konflikt, a co bys měl/a udělat?",
    correctAnswer: "Ne, je to psychické násilí (šikana) — je třeba to nahlásit dospělému",
    options: [
      "Ne, je to psychické násilí (šikana) — je třeba to nahlásit dospělému",
      "Ano, je to jen běžný konflikt, časem to samo přejde",
      "Ne, je to jen legrace, kterou si dělají všichni",
      "Ano, je to konflikt — ten spolužák si za to může sám",
    ],
    hints: [
      "Opakované vyčleňování a urážky nejsou drobná neshoda — je to dlouhodobé ubližování.",
      "Opakované a úmyslné vyčleňování i urážky patří mezi věci, které dítě nemá řešit samo — komu by ses měl/a v takové situaci svěřit?",
    ],
    explanation:
      "Opakované záměrné vyčleňování a ponižování spolužáka není konflikt, ale forma násilí (šikana). Takovou situaci je vždy třeba nahlásit dospělému, ne ji přecházet.",
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? POOL_L3 : level === 2 ? POOL_L2 : POOL_L1;
  return shuffle(pool);
}

export const VZTAHYKONFLIKTY: TopicMetadata[] = [
  {
    id: "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    rvpNodeId:
      "g3-prvouka-lide-kolem-nas-souziti-a-komunikace-vztahy-mezi-lidmi-reseni-konfliktu",
    title: "Vztahy mezi lidmi, řešení konfliktů",
    studentTitle: "Vztahy a konflikty",
    subject: "prvouka",
    category: "Lidé kolem nás",
    topic: "Soužití a komunikace",
    briefDescription:
      "Poznáš, jak fungují dobré vztahy a jak řešit konflikty.",
    keywords: [
      "empatie",
      "respekt",
      "kompromis",
      "spolupráce",
      "tolerance",
      "konflikt",
      "násilí",
      "kamarádství",
      "pravidla třídy",
      "naslouchání",
    ],
    goals: [
      "Vysvětlit pojmy empatie, respekt, kompromis, spolupráce a tolerance.",
      "Popsat kroky při řešení konfliktu.",
      "Rozlišit konflikt a násilí.",
      "Uvést příklady dobrého kamarádství.",
    ],
    boundaries: [
      "Základní pojmy a situace ze školního a rodinného života, bez psychologické teorie.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Empatie = vcítit se. Respekt = brát ohled. Kompromis = každý trochu ustoupí. Konflikt = neshoda, která se dá vyřešit klidnou dohodou.",
      steps: [
        "Uklidni se.",
        "Klidně mluv a naslouchej.",
        "Hledejte společné řešení.",
        "Dohodněte se na kompromisu.",
      ],
      commonMistake:
        "Záměna konfliktu a násilí — konflikt je neshoda, násilí záměrně ubližuje.",
      example:
        "Jana a Tomáš se hádají o to, jakou hru hrát. Každý trochu ustoupí a střídají se — to je kompromis.",
    },
  },
];
