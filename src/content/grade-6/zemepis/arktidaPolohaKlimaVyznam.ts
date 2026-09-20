/**
 * Zeměpis 6. ročník — Arktida: poloha, klima, význam (select_one).
 *
 * K tématu nejsou mapy ani obrázky, takže poloha se zadává jen souřadnicemi
 * a slovním popisem (sousedství, oceán, podnebí, vegetace).
 *
 * Gradace:
 *  • L1 — banka jednovětých fakt: co Arktida je (led na moři, ne pevnina),
 *    Severní ledový oceán, polární kruh 66,5° s. š. a pól 90° s. š., Grónsko
 *    jako největší ostrov světa, zvířata, Inuité a Sámové, tundra.
 *  • L2 — řetězec poloha → podnebí → vegetace → život lidí: proč v tundře
 *    nerostou stromy, proč je za polárním kruhem v létě celý den světlo, čím
 *    se živili Inuité, proč lodě plují severní cestou na konci léta, a čím
 *    jedním znakem se Arktida liší od Antarktidy.
 *  • L3 — rozhodnutí o novém, nejmenovaném místě podle souřadnic a popisu
 *    podnebí (Arktida × Antarktida × tundra × mírný pás) a hledání příčiny:
 *    mořský × pevninský led a hladina oceánu, zesilování oteplení odrazem,
 *    otevírání lodních cest, proč je v Arktidě tepleji než v Antarktidě.
 *
 * Chybový model: Arktida jako pevnina nebo světadíl; Grónsko jako světadíl;
 * tučňáci v Arktidě a lední medvědi v Antarktidě; roztátý mořský led zvedá
 * hladinu; polární den způsobený vzdáleností od Slunce; polární kruh zaměněný
 * s obratníkem (23,5°), s pólem (90°) nebo s „kulatými“ 60°.
 *
 * Rotace šablon se nastavuje uvnitř gen(), modul nedrží žádný stav. Dvě věci
 * hlídá gen() navíc, protože obě se projeví až v rámci jednoho sezení:
 *  • souřadnicová úloha bere oblast i znění zadání z pytlíku, takže dvě takové
 *    úlohy za sebou nemají stejnou odpověď ani stejnou větu,
 *  • ze tří zrcadlových otázek o zvířatech jde do sezení jen jedna — dvě z nich
 *    by se daly vyřešit hledáním téhož slova.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import {
  pick,
  pickN,
  shuffle,
  rnd,
  cis,
  sirka,
  losUlohy,
  ruzneUlohy,
  buildChoiceTask as choice,
  type Distractor,
} from "./_shared";

type Tvurce = () => PracticeTask | null;

/** Úloha nesmí obsahovat klíč ve znění — jinak ji vylosujeme znovu. */
function hlidej(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  if (t.question.includes(t.correctAnswer)) return null;
  for (const h of t.hints ?? []) if (h.includes(t.correctAnswer)) return null;
  return t;
}

// ── Faktická banka ─────────────────────────────────────────────────────────

interface Fakt {
  q: string;
  key: string;
  d: [string, string][];
  hints: [string, string];
  explanation: string;
}

const fakt = (f: Fakt): PracticeTask | null =>
  hlidej(
    choice(
      f.q,
      f.key,
      f.d.map(([value, why]): Distractor => ({ value, why })),
      { hints: f.hints, explanation: f.explanation },
    ),
  );

// ── L1 ─────────────────────────────────────────────────────────────────────

/** Zvířata, která v Arktidě opravdu žijí (česká jména podobné délky). */
const ARKTICKA_ZVIRATA = [
  "lední medvěd",
  "mrož lední",
  "sob polární",
  "liška polární",
  "tuleň kroužkovaný",
];

/**
 * Zvířata jižní polární oblasti — klíč obou zrcadlových úloh se losuje odtud,
 * aby si žák nezapamatoval „vždycky tučňák císařský“ místo pravidla o
 * rozdělení polokoulí.
 *
 * Jsou tu jen tučňáci, i když v Antarktidě žije například i tuleň leopardí:
 * s tuleněm jako klíčem by úloha přestala být o polokouli a stala by se
 * hádankou o druhovém jméně („kroužkovaný, nebo leopardí?“), na kterou
 * šesťák nemá jak přijít. Ten rozdíl proto zůstává ve vysvětlení, ne v klíči.
 */
const ANTARKTICKA_ZVIRATA = [
  "tučňák císařský",
  "tučňák oslí",
  "tučňák uzdičkový",
];

/** Tři arktická zvířata jako distraktory ke klíči z jižní polokoule. */
function arktickaNabidka(): string[] {
  return pickN(ARKTICKA_ZVIRATA, 3);
}

/**
 * Varianta, ve které klíčem NENÍ tučňák.
 *
 * Tučňáka pozná i žák, který o ostatních zvířatech nic neví, takže úlohu
 * vyřeší rozpoznáním jediného slova. Tady je klíčem antarktický tuleň a
 * distraktory jsou tři nezaměnitelně severní zvířata — vybrat se dá jedině
 * tak, že žák o těch třech ví, kam patří. Ostatní tuleni se do nabídky
 * nepouštějí: rozhodovat mezi „kroužkovaným“ a „Weddellovým“ by byla hádanka
 * o druhovém jméně, ne o polokouli.
 */
const ANTARKTICKY_TULEN = "tuleň Weddellův";
const SEVERNI_TROJICE = ["lední medvěd", "mrož lední", "sob polární"];

const velke = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

const BANKA_L1: Fakt[] = [
  {
    q: "Co tvoří většinu Arktidy?",
    key: "zamrzlý oceán, tedy led plovoucí na mořské vodě",
    d: [
      ["pevnina pokrytá silným ledovcem, obklopená oceánem", "Takhle vypadá Antarktida na druhém konci Země. Oblast kolem severního pólu vyplňuje z větší části oceán, jehož hladina zamrzá."],
      ["souvislá pevnina, na které leží několik států", "Kolem severního pólu žádná souvislá pevnina není. Pevniny se k oblasti přibližují jen od jihu, uprostřed leží oceán."],
      ["jediný velký ostrov pokrytý celý ledem", "Ani Grónsko takové není: pevninský ledovec pokrývá jeho vnitrozemí, ale pobřežní pás zůstává bez ledu — proto tam lidé žijí. A hlavně je Grónsko jen částí oblasti; její střed tvoří zamrzlá hladina oceánu, ne ostrov."],
    ],
    hints: [
      "Rozmysli si, jestli se kolem severního pólu dá stát na pevné zemi, nebo na zamrzlé hladině.",
      "Pod severním pólem není žádná pevnina, ale voda hluboká několik kilometrů. Rozmysli si, co s hladinou takové vody udělá celoroční mráz — a proč se pak to, co je nahoře, během roku mění v tloušťce i rozloze.",
    ],
    explanation: "Arktidu tvoří z větší části Severní ledový oceán, jehož hladina je pokrytá mořským ledem. Led tam tedy plave na vodě a v létě ho ubývá, v zimě přibývá. Pevnina (Grónsko, severní okraje Evropy, Asie a Severní Ameriky) oblast jen obklopuje.",
  },
  {
    q: "Který oceán z větší části vyplňuje Arktidu?",
    key: "Severní ledový oceán",
    d: [
      ["Atlantský oceán", "Atlantský oceán k oblasti sahá od jihu, mezi Evropou a Severní Amerikou. Kolem samotného pólu ale leží jiný, nejmenší oceán světa."],
      ["Tichý oceán", "Tichý oceán se k oblasti dotýká jen úzkým Beringovým průlivem mezi Asií a Amerikou. Prostor kolem pólu vyplňuje jiný oceán."],
      ["Jižní oceán", "Jižní oceán obklopuje Antarktidu na jižní polokouli. Kolem severního pólu leží oceán s opačným názvem."],
    ],
    hints: [
      "Je to nejmenší a nejchladnější ze světových oceánů a v názvu má obojí — i směr, i to, co je na hladině.",
      "Název oceánu se dá odvodit ze dvou věcí: leží na severní polokouli a jeho hladina je po většinu roku zamrzlá. Obě slova jsou v jeho jméně přímo obsažená.",
    ],
    explanation: "Oblast kolem severního pólu vyplňuje Severní ledový oceán — nejmenší ze světových oceánů. Jeho hladinu pokrývá mořský led a ze tří stran ho obklopují pevniny Evropy, Asie a Severní Ameriky.",
  },
  {
    q: "Na jaké zeměpisné šířce leží severní polární kruh?",
    key: "66,5° s. š.",
    d: [
      ["23,5° s. š.", "Na této rovnoběžce leží obratník Raka. Je mnohem blíž k rovníku a polární den tam nenastává."],
      ["90° s. š.", "To je zeměpisná šířka samotného severního pólu. Hranice polární oblasti leží od pólu ještě pořádný kus na jih."],
      ["60° s. š.", "Je to hezky kulaté číslo, ale žádnou zeměpisnou hranici neoznačuje. Hranice polární oblasti je jinde."],
    ],
    hints: [
      "Hranici polární oblasti spočítáš z šířky pólu a ze sklonu zemské osy, který znáš z ročních dob.",
      "Zemská osa je odkloněná asi o 23,5°. Právě o tenhle úhel je hranice polární oblasti vzdálená od pólu — od šířky pólu tedy sklon osy odečti a vyjde ti hledaná rovnoběžka.",
    ],
    explanation: "Severní polární kruh leží na 66,5° s. š. Spočítá se jako 90° (šířka pólu) − 23,5° (sklon zemské osy). Od téhle rovnoběžky k pólu nastává polární den a polární noc.",
  },
  {
    q: "Na jaké zeměpisné šířce leží severní pól?",
    key: "90° s. š.",
    d: [
      ["66,5° s. š.", "Na téhle rovnoběžce leží severní polární kruh, tedy hranice polární oblasti. Pól je ještě dál na sever."],
      ["180° s. š.", "Zeměpisná šířka se počítá od rovníku k pólu a dál než k pólu jít nejde. Číslo 180° patří zeměpisné délce."],
      ["0° (rovník)", "Nula stupňů je rovník, tedy nejvzdálenější možné místo od pólu."],
    ],
    hints: [
      "Zeměpisná šířka se počítá od rovníku a pól je místo, dál od kterého už na sever nejde jít.",
      "Rovník má nulovou šířku a od něj čísla na sever rostou. Na pólu dosahují svého největšího možného čísla, protože celá čtvrtina obvodu Země dělá právě pravý úhel.",
    ],
    explanation: "Severní pól leží na 90° s. š. Je to největší možná zeměpisná šířka: od rovníku (0°) k pólu je to čtvrtina obvodu Země, tedy pravý úhel. Zeměpisná délka tam už nemá smysl — sbíhají se v něm všechny poledníky.",
  },
  {
    q: "Který ostrov je v Arktidě největší?",
    key: "Grónsko",
    d: [
      ["Island", "Island leží kousek pod severním polárním kruhem, ale je mnohonásobně menší než největší ostrov oblasti."],
      ["Špicberky", "Špicberky jsou souostroví severně od Norska. Leží hluboko v Arktidě, plochou se ale největšímu ostrovu ani zdaleka nevyrovnají."],
      ["Nová země", "Nová země je protáhlé souostroví na severu Ruska. Je výrazně menší než největší ostrov oblasti."],
    ],
    hints: [
      "Hledaný ostrov je zároveň největší ostrov na celé Zemi a patří k Dánskému království.",
      "Ostrov leží mezi Severním ledovým oceánem a Atlantským oceánem, na západ od Islandu. Vnitrozemí pokrývá mohutný pevninský ledovec a lidé žijí jen na pobřeží, kde led není. Žádný jiný ostrov světa není větší.",
    ],
    explanation: "Největší ostrov Arktidy — a zároveň největší ostrov světa — je Grónsko. Leží mezi Severním ledovým a Atlantským oceánem. Jeho vnitrozemí pokrývá silný pevninský ledovec, pobřežní pás zůstává bez ledu a právě tam lidé žijí. Politicky je Grónsko součástí Dánského království, i když má vlastní vládu.",
  },
  {
    q: "Čím je Grónsko?",
    key: "největší ostrov světa",
    d: [
      ["samostatný světadíl", "Světadíl je jeden z velkých celků souše jako Evropa nebo Asie — Grónsko mezi ně nepatří. Zeměpisně se počítá k Severní Americe, i když je opravdu velké."],
      ["poloostrov Severní Ameriky", "Poloostrov je s pevninou spojený. Grónsko je ze všech stran obklopené mořem, takže poloostrov není."],
      ["největší ostrov Antarktidy", "Antarktida leží na opačném konci Země, kolem jižního pólu. Grónsko je na severní polokouli."],
    ],
    hints: [
      "Nejdřív si ujasni kategorii: je Grónsko souš spojená s pevninou, souš obklopená vodou, nebo samostatný celek souše jako Evropa?",
      "Poloostrov je s pevninou spojený, ostrov je ze všech stran obklopený vodou a světadíl je jeden z velkých celků souše. Až kategorii určíš, teprve pak rozhoduj podle velikosti — žádná jiná souš téhož druhu Grónsko na Zemi nepřekoná.",
    ],
    explanation: "Grónsko je největší ostrov světa. Světadíl to není — zeměpisně patří k Severní Americe, politicky k Dánskému království, i když má vlastní vládu. Ostrov od poloostrova poznáš podle toho, že ostrov není s pevninou spojený.",
  },
  {
    q: "Ke kterému světadílu se Grónsko zeměpisně počítá?",
    key: "k Severní Americe",
    d: [
      ["k Evropě", "K Evropě patří Grónsko jen politicky, protože je součástí Dánského království. Zeměpisně leží u jiného světadílu."],
      ["k Asii", "Asie leží na opačné straně Severního ledového oceánu než Grónsko."],
      ["k žádnému, je to samostatný světadíl", "Grónsko je ostrov, ne světadíl. Ostrovy se počítají k nejbližšímu světadílu."],
    ],
    hints: [
      "Podívej se, která pevnina je Grónsku nejblíž: dělí je jen úzké průlivy a moře.",
      "Politická příslušnost a zeměpisné zařazení nemusí být totéž. Grónsko patří k evropskému království, ale samo leží u pevniny na západ od Atlantského oceánu, od níž ho dělí jen úzké průlivy.",
    ],
    explanation: "Grónsko se zeměpisně počítá k Severní Americe, protože leží hned u její pevniny a dělí je jen úzké průlivy. Politicky je součástí Dánského království, tedy evropského státu, i když má vlastní vládu a o většině svých věcí rozhoduje samo — to je ale jiná věc než zeměpisné zařazení.",
  },
  {
    q: "Pevniny kterých tří světadílů obklopují Severní ledový oceán?",
    key: "Evropa, Asie a Severní Amerika",
    d: [
      ["Evropa, Afrika a Asie", "Afrika leží kolem rovníku, od severního pólu hodně daleko. K Severnímu ledovému oceánu nesahá."],
      ["Severní Amerika, Jižní Amerika a Austrálie", "Jižní Amerika i Austrálie leží z velké části na jižní polokouli, k severnímu pólu nedosahují."],
      ["Asie, Austrálie a Antarktida", "Austrálie i Antarktida leží na jižní polokouli, takže severní oceán obklopovat nemohou."],
    ],
    hints: [
      "Projdi si světadíly a nech jen ty, které zasahují daleko na sever, až za polární kruh.",
      "Vyřaď nejdřív všechno, co leží na jižní polokouli nebo kolem rovníku. Ze zbylých světadílů pak vyber ty, jejichž severní okraje přecházejí do tundry a končí u zamrzlého moře.",
    ],
    explanation: "Severní ledový oceán obklopují pevniny Evropy, Asie a Severní Ameriky. Jejich severní okraje tvoří tundra a na ně navazuje zamrzlá hladina oceánu. Právě proto mají k Arktidě blízko státy jako Norsko, Rusko, Kanada nebo USA.",
  },
  {
    q: "Který národ odedávna žije v arktické části Severní Ameriky a v Grónsku?",
    key: "Inuité",
    d: [
      ["Sámové", "Sámové jsou původní obyvatelé evropské tundry v severní Skandinávii a Rusku, ne v Grónsku."],
      ["Aboriginci", "Aboriginci jsou původní obyvatelé Austrálie, tedy z úplně jiné části světa."],
      ["Maorové", "Maorové jsou původní obyvatelé Nového Zélandu na jižní polokouli."],
    ],
    hints: [
      "Hledaný národ se dřív nesprávně označoval jako Eskymáci a živil se lovem tuleňů a ryb.",
      "Vyřaď nejdřív národy z jižní polokoule. Ze zbylých vyber ten, který žije na americké straně polární oblasti a v Grónsku, ne ve Skandinávii.",
    ],
    explanation: "V arktické části Severní Ameriky a v Grónsku odedávna žijí Inuité (dřív nesprávně nazývaní Eskymáci). Živili se lovem tuleňů, ryb a velryb, protože pěstovat plodiny v trvale zmrzlé půdě nejde.",
  },
  {
    q: "Který národ odedávna žije v evropské tundře na severu Skandinávie?",
    key: "Sámové",
    d: [
      ["Inuité", "Inuité žijí v arktické části Severní Ameriky a v Grónsku, ne v Evropě."],
      ["Aboriginci", "Aboriginci jsou původní obyvatelé Austrálie, tedy z jižní polokoule."],
      ["Maorové", "Maorové jsou původní obyvatelé Nového Zélandu na jižní polokouli."],
    ],
    hints: [
      "Hledaný národ žije v Laponsku a odedávna chová soby.",
      "Nejdřív vyřaď národy z jižní polokoule. Ze zbylých dvou pak vyber ten, který žije na evropské straně polární oblasti, tedy v severním Norsku, Švédsku, Finsku a Rusku.",
    ],
    explanation: "V evropské tundře na severu Skandinávie a Ruska (v Laponsku) odedávna žijí Sámové. Tradičně chovají soby a stěhují se s nimi za pastvou. Inuité proti tomu žijí na americké straně Arktidy a v Grónsku.",
  },
  {
    q: "Jak se jmenuje bezlesá krajina s mechy, lišejníky a nízkými keři na pevnině kolem Severního ledového oceánu?",
    key: "tundra",
    d: [
      ["tajga", "Tajga je pás jehličnatých lesů, který leží jižněji. Právě stromy jsou rozdíl — hledaná krajina je bezlesá."],
      ["step", "Step je travnatá krajina mírného pásu, třeba na jihu Ruska. Pro polární oblast typická není."],
      ["savana", "Savana je travnatá krajina tropů se střídáním období dešťů a sucha. S chladným podnebím nesouvisí."],
    ],
    hints: [
      "Je to nejsevernější krajinný pás Země a jeho půda zůstává v hloubce zmrzlá i v létě.",
      "Krajinné pásy jdou od severu k jihu za sebou: nejdřív bezlesý pás u zamrzlého moře, pak jehličnaté lesy, pak listnaté lesy a stepi. Hledáš ten úplně první, nejchladnější.",
    ],
    explanation: "Bezlesá krajina kolem Severního ledového oceánu se jmenuje tundra. Rostou v ní jen mechy, lišejníky a nízké keře, protože léto je krátké a chladné a půda zůstává v hloubce trvale zmrzlá. Jižně od ní navazuje tajga, tedy pás jehličnatých lesů.",
  },
  {
    q: "Jak se jmenuje led, který plave na hladině Severního ledového oceánu?",
    key: "mořský led",
    d: [
      ["pevninský ledovec", "Pevninský ledovec leží na souši, třeba v Grónsku. Led na hladině oceánu vzniká jinak — zamrzáním vody pod ním."],
      ["horský ledovec", "Horský ledovec vzniká ve vysokých horách z napadaného sněhu a pomalu stéká údolím. S hladinou oceánu nesouvisí."],
      ["trvale zmrzlá půda", "Trvale zmrzlá půda je zmrzlá zemina na pevnině pod tundrou, ne led na moři."],
    ],
    hints: [
      "Vznikne přímo tím, že v zimě zamrzne hladina slané vody.",
      "Rozliš, kde led leží: jeden druh leží na souši, jiný ve vysokých horách, další je zmrzlá zemina. Ten hledaný vzniká přímo na hladině a s otepleným létem ho ubývá.",
    ],
    explanation: "Led plovoucí na hladině Severního ledového oceánu se jmenuje mořský led — vzniká zamrzáním samotné mořské vody. Liší se tím od pevninského ledovce, který leží na souši (například v Grónsku), a od trvale zmrzlé půdy v tundře.",
  },
  {
    q: "Jak se jmenuje polární oblast kolem jižního pólu?",
    key: "Antarktida",
    d: [
      ["Arktida", "Arktida je oblast kolem severního pólu, tedy na opačné straně Země."],
      ["Grónsko", "Grónsko je největší ostrov světa a leží na severní polokouli."],
      ["Sibiř", "Sibiř je severní část Asie na severní polokouli, ne polární oblast kolem jižního pólu."],
    ],
    hints: [
      "Je to protějšek severní polární oblasti a tvoří ji pevnina pokrytá mohutným ledovcem.",
      "Vyřaď všechno, co leží na severní polokouli. Zbude oblast, která nepatří žádnému státu, nemá stálé obyvatelstvo a žijí v ní tučňáci — její jméno se od jména severní oblasti liší jen začátkem slova.",
    ],
    explanation: "Oblast kolem jižního pólu se jmenuje Antarktida. Na rozdíl od Arktidy je to pevnina pokrytá mohutným ledovcem, nepatří žádnému státu a nemá stálé obyvatelstvo.",
  },
];

/** Společné poučení obou zrcadlových úloh — rozdělení polokoulí, ne jedno jméno. */
const POLOKOULE_EXPL =
  "Lední medvěd, mrož lední, sob polární, liška polární i tuleň kroužkovaný žijí jen na severní polokouli. Tučňáci naopak žijí téměř výhradně na jižní polokouli a v severní polární oblasti nežijí vůbec. Pozor na tuleně: v Antarktidě žijí také, ale jiné druhy — třeba tuleň leopardí, který tam loví tučňáky.";

/** Zvíře, které v Arktidě nežije (klíč se losuje z antarktické banky). */
function zvireArktida(): PracticeTask | null {
  const klic = pick(ANTARKTICKA_ZVIRATA);
  return hlidej(
    choice(
      "Které z těchto zvířat v Arktidě NEžije?",
      klic,
      arktickaNabidka().map((z): Distractor => ({
        value: z,
        why: `${velke(z)} v Arktidě opravdu žije — patří mezi typická zvířata severní polární oblasti.`,
      })),
      {
        hints: [
          "Tři z nabízených zvířat patří na severní polokouli, jedno jen na tu jižní.",
          "Projdi zvířata jedno po druhém a ptej se, jestli jsi ho viděl ve filmu o severní polární oblasti, nebo o té jižní. Jedno z nich nikdy nepotká lední medvědy, protože žije na opačném konci světa.",
        ],
        explanation: `${velke(klic)} patří mezi zvířata jižní polární oblasti, takže v Arktidě ho nenajdeš. ${POLOKOULE_EXPL}`,
      },
    ),
  );
}

/** Zvíře Antarktidy — zrcadlová úloha, distraktory jsou arktická zvířata. */
function zvireAntarktida(): PracticeTask | null {
  const klic = pick(ANTARKTICKA_ZVIRATA);
  return hlidej(
    choice(
      "Které z těchto zvířat žije v Antarktidě?",
      klic,
      arktickaNabidka().map((z): Distractor => ({
        value: z,
        why: `${velke(z)} žije jen na severní polokouli, v Arktidě. Do oblasti kolem jižního pólu se nikdy nedostane.`,
      })),
      {
        hints: [
          "Hledej zvíře, které na severní polokouli v přírodě nepotkáš.",
          "Tři z nabízených zvířat patří k severní polární oblasti a s oblastí kolem jižního pólu nemají nic společného. Zbývá jediné, které žije naopak na jižní polokouli.",
        ],
        explanation: `${velke(klic)} žije v Antarktidě a v moři kolem ní. ${POLOKOULE_EXPL}`,
      },
    ),
  );
}

/**
 * Třetí varianta téže otázky, kde klíčem není tučňák — rozhoduje se podle
 * toho, kam patří tři severní zvířata, ne podle jediného známého slova.
 */
function zvireTulen(): PracticeTask | null {
  return hlidej(
    choice(
      "Které z těchto zvířat v Arktidě NEžije?",
      ANTARKTICKY_TULEN,
      SEVERNI_TROJICE.map((z): Distractor => ({
        value: z,
        why: `${velke(z)} v Arktidě opravdu žije — patří mezi typická zvířata severní polární oblasti.`,
      })),
      {
        hints: [
          "Tuleni žijí v obou polárních oblastech, jen pokaždé jiné druhy. Rozhodni se proto podle těch tří ostatních zvířat.",
          "Projdi zvířata jedno po druhém a u každého se ptej, jestli patří k severní polární oblasti. Tři z nich tam patří nepochybně — zbylé jméno tedy musí označovat druh z opačného konce Země.",
        ],
        explanation: `Tuleň Weddellův žije u pobřeží Antarktidy a v Arktidě ho nenajdeš. Samo slovo „tuleň“ tedy polokouli neprozradí — rozhoduje druh. ${POLOKOULE_EXPL}`,
      },
    ),
  );
}

// ── L2 ─────────────────────────────────────────────────────────────────────

const BANKA_L2: Fakt[] = [
  {
    q: "Proč v tundře nerostou vzrostlé stromy?",
    key: "Léto je krátké a chladné a půda zůstává zmrzlá.",
    d: [
      ["Slunce tam nikdy nevysvitne, a tak stromům chybí světlo i teplo.", "Světla je tam v létě naopak dost — dny jsou velmi dlouhé a za polárním kruhem Slunce dokonce celé týdny nezapadá. Stromům chybí teplo a půda, do které by zapustily kořeny."],
      ["Stromy tam lidé vykáceli na stavbu domů a lodí.", "Tundra je bezlesá i tam, kde nikdy nikdo nežil. Příčina je přírodní, ne lidská."],
      ["Silný vítr stromy rovnou vyvrací i s kořeny.", "Vítr růst ztěžuje, ale rozhoduje krátké chladné léto a zmrzlá půda, do které kořeny neproniknou."],
    ],
    hints: [
      "Strom potřebuje delší teplé období a hlubokou půdu pro kořeny. Co z toho tundra nenabízí?",
      "Porovnej podmínky v tundře s tím, co strom potřebuje: dost dlouhé teplé období, aby stihl vyrůst a připravit se na zimu, a půdu měkkou dost hluboko, aby v ní udržel kořeny. Obě podmínky tam narazí na tutéž překážku.",
    ],
    explanation: "V tundře trvá teplé období jen pár týdnů a půda pod povrchem zůstává i v létě zmrzlá. Kořeny se do ní nedostanou a strom nestihne vyrůst, takže přežijí jen mechy, lišejníky a nízké keře. Chybějící světlo to není — léto je světlé, jen krátké a chladné.",
  },
  {
    q: "Proč je nad severním polárním kruhem v létě celý den světlo?",
    key: "Zemská osa je skloněná a v létě natáčí sever ke Slunci.",
    d: [
      ["Země je v tu dobu ke Slunci mnohem blíž než v kterékoli jiné roční době.", "Vzdálenost se během roku mění jen málo a stejně pro celou planetu. Navíc je Země Slunci nejblíž v lednu, kdy je na severu zima."],
      ["Slunce v létě svítí mnohem silněji než v zimě.", "Slunce svítí po celý rok prakticky stejně. Mění se jen to, jak je polokoule natočená a jak šikmo paprsky dopadají."],
      ["Země se v létě otáčí kolem své osy pomaleji.", "Otočka kolem osy trvá 24 hodin po celý rok. O polárním dni rozhoduje náklon osy, ne rychlost otáčení."],
    ],
    hints: [
      "Ve stejném okamžiku je za jižním polárním kruhem tma. Co mezi polokoulemi dělá rozdíl?",
      "Kdyby rozhodovala vzdálenost celé Země od Slunce, musely by na tom být obě polokoule stejně. Ony jsou ale v jednu chvíli v opačné situaci, takže příčina musí ležet v tom, jak je Země v prostoru nakloněná.",
    ],
    explanation: "Zemská osa je odkloněná asi o 23,5° a při oběhu míří stále stejným směrem. Půl roku je proto severní polokoule ke Slunci přikloněná: za polárním kruhem se místo při otáčení Země vůbec nedostane do stínu a Slunce nezapadá. Druhou půlku roku je to obráceně a nastává polární noc.",
  },
  {
    q: "Proč loví lední medvěd hlavně na mořském ledu, a ne na souši?",
    key: "Na ledu číhá u dýchacích otvorů na tuleně, svou kořist.",
    d: [
      ["Na souši je pro něj v létě příliš horko, vůbec ji nesnese.", "Medvěd se po souši běžně pohybuje a v létě, když led roztaje, na ní tráví celé týdny. Rozhoduje, kde najde potravu, ne teplota."],
      ["Na ledu ho kořist nezahlédne, protože má bílou srst.", "Bílá srst mu opravdu pomáhá splynout, ale hlavní důvod je jinde — jeho kořist žije ve vodě pod ledem."],
      ["Na souši v Arktidě neroste nic, čím by se nasytil.", "Lední medvěd je šelma a rostliny nejí ani na souši. Loví tam, kde se dá dostat k tuleňům."],
    ],
    hints: [
      "Rozmysli si, čím se lední medvěd živí a kde tahle kořist tráví většinu času.",
      "Zvíře loví tam, kde je jeho potrava. Zkus si nejdřív odpovědět, co lední medvěd jí, potom kde to žije — a nakonec kde se ty dva světy potkávají, tedy kde se kořist musí objevit na povrchu.",
    ],
    explanation: "Hlavní kořistí ledního medvěda jsou tuleni, kteří žijí ve vodě, ale musí dýchat vzduch. Vyplouvají proto k otvorům v ledu a medvěd u nich číhá. Když ledu ubývá, ztrácí medvěd lovecký prostor a hůř se uživí — proto je tání ledu nebezpečné i pro něj.",
  },
  {
    q: "Čím se Inuité odedávna živili?",
    key: "Lovem tuleňů, ryb a velryb u pobřeží i na ledu.",
    d: [
      ["Pěstováním obilí a brambor na polích u pobřeží.", "Půda je v hloubce trvale zmrzlá a teplé období trvá pár týdnů. Pole tam založit nejde."],
      ["Sběrem ovoce a ořechů v lesích kolem pobřeží.", "V tundře žádné lesy nerostou, protože léto je krátké a chladné. Ovoce ani ořechy tam nejsou."],
      ["Chovem krav a prasat ve vytápěných stájích na pobřeží.", "Pro taková zvířata by nebylo kde vzít krmivo — obilí ani tráva tam ve větším množství nerostou."],
    ],
    hints: [
      "Rozmysli si, co v trvale zmrzlé půdě vyroste. A pak se podívej, co je hned vedle, ve vodě.",
      "Začni tím, co v té krajině není: žádná pole, žádné lesy, žádné pastviny pro velká hospodářská zvířata. Zbude jediný zdroj potravy, kterého je naopak dost — a leží hned za pobřežím.",
    ],
    explanation: "V trvale zmrzlé půdě se nedá hospodařit, zato moře je bohaté na živočichy. Inuité proto lovili tuleně, ryby a velryby, z kůží šili oblečení a z tuku měli palivo i světlo. Dodnes je lov v Grónsku a arktické Kanadě důležitý.",
  },
  {
    q: "Proč proplouvají lodě severní mořskou cestou podél Sibiře hlavně na konci léta?",
    key: "Tehdy je mořského ledu nejméně, protože celé léto tál.",
    d: [
      ["Tehdy moře ještě nestihlo od jara zamrznout.", "Je to obráceně: moře zamrzá v zimě a přes léto led taje. Na konci léta je ho proto nejméně."],
      ["Tehdy nastává polární den a je líp vidět na cestu.", "Polární den je už v červnu, tedy dřív. A hlavně lodím nepřekáží tma, ale led."],
      ["Tehdy je voda nejteplejší, a tak lodě plují mnohem rychleji.", "Teplota vody rychlost lodi neurčuje. Rozhoduje, kolik ledu na hladině leží v cestě."],
    ],
    hints: [
      "Překážkou pro loď není tma ani chlad, ale to, co je na hladině. Kdy toho bývá nejméně?",
      "Sleduj, jak se množství ledu mění během roku: přes zimu ho přibývá, od jara do konce léta ubývá. Loď potřebuje takovou chvíli, kdy tání trvalo co nejdéle, ale nové zamrzání ještě nezačalo.",
    ],
    explanation: "Mořského ledu ubývá po celé léto, takže nejméně ho je až na jeho konci, zhruba v srpnu a září. Teprve tehdy je cesta podél sibiřského pobřeží průjezdná. S ubývajícím ledem se okno pro plavbu prodlužuje a zájem o tuhle trasu roste.",
  },
  {
    q: "Proč se v Arktidě staví domy na kůlech kousek nad zemí?",
    key: "Teplo z domu by rozmrazilo půdu pod ním a stavba by se sesula.",
    d: [
      ["Kůly chrání dům před vodou z častých záplav.", "Srážek je v Arktidě naopak málo a záplavy tam nejsou hlavním problémem. Jde o to, co teplo domu udělá se zmrzlou půdou."],
      ["Na kůlech se k domu nedostanou lední medvědi.", "Medvěd by pár kůlů nezastavil. Důvod je stavební, ne obranný."],
      ["Kůly drží dům nad sněhem, protože ho tam napadá nejvíc na světě.", "V polárních oblastech padá srážek málo, sníh se jen dlouho drží. Kvůli jeho množství by se takhle stavět nemuselo."],
    ],
    hints: [
      "Co se stane s trvale zmrzlou půdou, když se na ni postaví vytápěný dům?",
      "Vytápěný dům předává teplo do podloží. Podloží v tundře ale drží pevnost jen proto, že je zmrzlé. Zkus domyslet, co se stane, když tuhle pevnost ztratí právě pod základy stavby.",
    ],
    explanation: "Pevnost podloží v tundře stojí na tom, že je půda zmrzlá. Vytápěný dům postavený přímo na zemi by ji rozmrazil, změnil v měkké bahno a sesedl by se. Kůly proto dům drží nad zemí, aby mezi ním a půdou proudil studený vzduch.",
  },
  {
    q: "Proč se do Arktidy vozí zboží hlavně lodí a letadlem, a ne po silnicích?",
    key: "Většinu oblasti tvoří oceán a zmrzlá půda, kde silnice nevydrží.",
    d: [
      ["Silnice tam zakazuje mezinárodní smlouva o ochraně polární přírody.", "Taková smlouva platí pro Antarktidu, ne pro Arktidu. Kolem severního pólu leží území několika států."],
      ["Lidé tam auta vůbec nemají, jezdí jen na psích spřeženích.", "Auta i sněžné skútry se tam běžně používají. Chybí ale cesty, po kterých by jely na velké vzdálenosti."],
      ["Silnice by tam okamžitě zavál písek z pobřežních dun.", "Písečné duny jsou typické pro pouště, ne pro polární oblast."],
    ],
    hints: [
      "Rozmysli si, po čem by silnice vedla: přes zamrzlý oceán, nebo přes půdu, která v létě povoluje?",
      "Silnice potřebuje pevný a stálý podklad. Zkus si projít, co je v téhle oblasti pod nohama: uprostřed hladina oceánu s pohyblivým ledem, na pevnině půda, která v létě na povrchu rozmrzá a boří se. Ani jedno stálý podklad nedává.",
    ],
    explanation: "Střed Arktidy tvoří oceán, kde silnice vést nelze, a na pevnině leží půda, jejíž povrch v létě rozmrzá a sesedá se. Trvalé cesty se tam udržují jen těžko a draho, takže se zboží vozí loděmi, letadly a v zimě po dočasných ledových cestách.",
  },
  {
    q: "Proč se na mořském ledu Arktidy nedá postavit stálé město?",
    key: "Led se pohybuje, láme a v létě z velké části roztaje.",
    d: [
      ["Led je tak tenký, že by neunesl ani jednoho člověka.", "Mořský led unese člověka i techniku. Problém je, že se hýbe a v létě taje."],
      ["Led je tak hladký, že by na něm žádná stavba nedržela.", "Povrch mořského ledu je naopak rozlámaný a nerovný. Rozhoduje jeho pohyb a tání."],
      ["Led by se pod stavbou propadl, protože je ze slané vody.", "Mořský led je sice kvůli kapsám slané vody měkčí než led na rybníce, ale i tak unese člověka i techniku. Stálému městu vadí něco jiného — celá plocha se posouvá, láme a v létě z velké části zmizí."],
    ],
    hints: [
      "Mořský led není pevná země. Co se s ním děje během roku a co s ním dělá vítr a proudy?",
      "Porovnej mořský led s pevninou: pevnina zůstává na místě a je tam i příští rok. Zkus u ledu projít obojí zvlášť — jestli drží stejné místo a jestli vydrží celý rok.",
    ],
    explanation: "Mořský led je jen zmrzlá vrstva na hladině: vítr a mořské proudy s ním posouvají, kry se na sebe nasouvají a lámou a přes léto velká část ledu roztaje. Stálé stavby proto drží jen na pevnině — na ledu se zakládají nanejvýš dočasné tábory.",
  },
  {
    q: "Čím se od sebe liší tundra a tajga?",
    key: "V tundře nerostou stromy, kdežto tajga je pás jehličnatých lesů.",
    d: [
      ["V tundře roste jehličnatý les, kdežto tajga je bezlesá.", "Je to obráceně. Bezlesý pás leží blíž k pólu, jehličnaté lesy až jižněji od něj."],
      ["V tundře i v tajze roste souvislý les, jen tajga je vyšší.", "V bezlesém pásu u zamrzlého moře žádný souvislý les není — léto je na něj příliš krátké."],
      ["V tundře rostou listnaté lesy, kdežto tajga je travnatá step bez stromů.", "Listnaté lesy ani step se v polární oblasti nevyskytují, obojí patří do mírného pásu."],
    ],
    hints: [
      "Oba pásy leží na severu za sebou. Zeptej se u každého na jedinou věc: rostou tam stromy?",
      "Krajinné pásy se od pólu k rovníku mění podle toho, jak dlouhé a teplé je léto. Vezmi to po řadě od nejchladnějšího: nejdřív pás, kde je léto na stromy příliš krátké, a hned za ním první pás, ve kterém už stromy vydrží.",
    ],
    explanation: "Tundra leží blíž k pólu a je bezlesá — rostou v ní jen mechy, lišejníky a nízké keře, protože léto je krátké a půda v hloubce zmrzlá. Jižněji od ní navazuje tajga, souvislý pás jehličnatých lesů, kde už je léto na stromy dost dlouhé.",
  },
  {
    q: "Proč mají Inuité tradiční oblečení z kůží a kožešin, a ne z látky z bavlny?",
    key: "Kožešina drží teplo i v mrazu a bavlna se tam nepěstuje.",
    d: [
      ["Bavlna je dražší než kožešina z ulovených zvířat.", "Nejde o cenu. Bavlněné oblečení by v arktickém mrazu neochránilo a surovina tam navíc není."],
      ["Kožešina je lehčí, a tak se v ní líp běhá po ledu.", "Kožešinové oblečení lehké není. Rozhoduje, že drží teplo a že je surovina po ruce."],
      ["Bavlna v Arktidě rychle plesniví kvůli velké vlhkosti vzduchu.", "V mrazu udrží vzduch jen málo vodní páry a srážek tam padá málo, takže plíseň problém není. Bavlna tam především nehřeje dost."],
    ],
    hints: [
      "Podívej se na dvě věci: co ten materiál umí v mrazu a odkud ho v Arktidě vzít.",
      "Tradiční oblečení se vždy dělá z toho, co je po ruce. Zkus si projít, co v téhle krajině vyroste a co se tam dá ulovit — a pak porovnej, který z materiálů ochrání před silným mrazem.",
    ],
    explanation: "Bavlna je rostlina teplých krajů, v Arktidě se nepěstuje a v mrazu navíc hřeje špatně. Kožešina a kůže ulovených zvířat naopak drží teplo i při silném mrazu a byly vždy po ruce — ze stejných zvířat měli Inuité i maso a tuk na topení.",
  },
  {
    q: "Proč se Sámové v Laponsku odedávna stěhují se stády sobů z místa na místo?",
    key: "Pastva v tundře je chudá a na jednom místě rychle dojde.",
    d: [
      ["Soby je nutné každou zimu odvést až k rovníku.", "Sobi žijí v chladném podnebí celý rok. Do teplých oblastí se nestěhují."],
      ["Stálé vesnice jim v Laponsku zakazuje mezinárodní smlouva.", "Taková smlouva pro Evropu neplatí. Důvod stěhování je přírodní, ne právní."],
      ["Stáda musí utíkat před ledními medvědy z pobřeží.", "Lední medvědi žijí u mořského ledu, ne ve vnitrozemí Laponska. O stěhování rozhoduje potrava."],
    ],
    hints: [
      "Sobi se živí hlavně lišejníky. Jak rychle asi taková potrava v chladné krajině doroste?",
      "Představ si velké stádo na jednom pastvišti v krajině, kde všechno roste pomalu, protože je léto krátké a chladné. Zkus domyslet, jak dlouho tam potrava vydrží a co musí pastevci udělat, aby ji stádo nevyčerpalo natrvalo.",
    ],
    explanation: "Tundra dává jen chudou pastvu — lišejníky a nízké rostliny dorůstají velmi pomalu. Stádo sobů jedno místo rychle spase, a tak se musí posouvat dál, aby se pastva stihla obnovit. Proto je život Sámů tradičně kočovný.",
  },
  {
    q: "Proč bývá v tundře v létě rozbahněná a podmáčená krajina, přestože tam padá srážek málo?",
    key: "Rozmrzlá voda nemá kam odtéct, hlouběji je půda zmrzlá.",
    d: [
      ["Do tundry přitéká voda z moře při každém přílivu.", "Příliv zaplavuje jen úzký pruh pobřeží. Podmáčená je přitom i tundra daleko ve vnitrozemí."],
      ["V létě tam padá nejvíc srážek na celé severní polokouli.", "Srážek je v polární oblasti naopak velmi málo. Rozhoduje, kam se voda z tajícího sněhu poděje."],
      ["Rozmrzlá voda se v chladu skoro vůbec nevypařuje.", "Vypařování je tam opravdu pomalé, ale hlavní příčina je jinde — voda nemůže vsáknout do hloubky."],
    ],
    hints: [
      "Voda se vsakuje do půdy. Co se stane, když je půda kousek pod povrchem zmrzlá na kámen?",
      "V létě rozmrzne jen tenká vrstva na povrchu, hlouběji zůstává zemina zmrzlá. Zkus si představit, co ta zmrzlá vrstva pro vodu znamená — chová se jako propustná půda, nebo spíš jako dno nádoby?",
    ],
    explanation: "V létě rozmrzne jen tenká vrstva půdy u povrchu, hlouběji zůstává zemina zmrzlá a voda jí neprojde. Roztátý sníh proto zůstává nahoře, krajina se podmáčí a vznikají mělká jezírka a bažiny — i když srážek tam padá opravdu málo.",
  },
];

/**
 * Čím se Arktida liší od Antarktidy — parametrizovaná dvojice znaků.
 *
 * `stem` je součástí dat schválně: dvě takové úlohy mohou v jedné sezoně padnout
 * vedle sebe a se společným zněním vypadaly jako tatáž otázka se zamíchanými
 * možnostmi. Zadání proto pojmenuje konkrétní rozdíl, o který jde.
 */
interface Rozdil {
  stem: string;
  a: string;
  b: string;
  whySwap: string;
  whyA: string;
  whyB: string;
  hint0: string;
  hint1: string;
  expl: string;
}

const ROZDILY: Rozdil[] = [
  {
    stem: "Čím se Arktida liší od Antarktidy v tom, co leží pod ledem?",
    a: "je led z větší části na hladině oceánu",
    b: "leží led na vysoké pevnině",
    whySwap: "Oblasti máš prohozené. Kolem severního pólu je oceán a led plave na jeho hladině, kdežto kolem jižního pólu je pevnina a led leží na ní.",
    whyA: "Tohle platí jen o severní polární oblasti. Kolem jižního pólu je to jinak — tam led leží na pevnině vysoko nad hladinou moře.",
    whyB: "Tohle platí jen o jižní polární oblasti. Kolem severního pólu žádná pevnina není, led tam plave na hladině oceánu.",
    hint0: "Zeptej se u obou oblastí na jednu věc: je pod ledem voda, nebo souš?",
    hint1: "U jedné z polárních oblastí je pod ledem několik kilometrů hluboká voda, u druhé pevnina vysoko nad hladinou moře. Přiřaď obojí správně a rovnou tím vyřadíš i možnosti, které tvrdí, že jsou obě oblasti stejné.",
    expl: "Arktidu tvoří z větší části Severní ledový oceán a led na něm plave. Antarktida je naproti tomu pevnina pokrytá mohutným ledovcem, který leží vysoko nad hladinou moře. Právě proto zvedne tání antarktického a grónského ledu hladinu oceánů, kdežto tání arktického mořského ledu ne.",
  },
  {
    stem: "Čím se Arktida liší od Antarktidy v tom, jaká velká zvířata tam žijí?",
    a: "žije lední medvěd",
    b: "žijí tučňáci",
    whySwap: "Zvířata máš prohozená. Lední medvěd žije jen na severní polokouli a tučňáci na jižní — v přírodě se nikdy nepotkají.",
    whyA: "Lední medvěd žije jen na severní polokouli. V oblasti kolem jižního pólu ho nenajdeš.",
    whyB: "Tučňáci žijí téměř výhradně na jižní polokouli a v oblasti kolem severního pólu nežijí vůbec.",
    hint0: "Obě zvířata žijí v ledu a mrazu, ale každé na jiné polokouli. Na které?",
    hint1: "Vzpomeň si na filmy o polárních oblastech: v jedné loví velká bílá šelma tuleně na ledu, ve druhé se ptáci, kteří neumí létat, tísní ve velkých koloniích. Každý ze snímků pochází z jiné polokoule a ta zvířata se v přírodě nikdy nesetkají.",
    expl: "Lední medvěd žije jen v severní polární oblasti a tučňáci téměř výhradně na jižní polokouli. Jejich areály se vůbec nepřekrývají, takže obrázek ledního medvěda mezi tučňáky nemůže být z přírody. Je to nejčastější záměna obou polárních oblastí.",
  },
  {
    stem: "Čím se Arktida liší od Antarktidy v tom, kdo tam trvale žije?",
    a: "odedávna žijí lidé, například Inuité",
    b: "nikdo trvale nežije",
    whySwap: "Máš to obráceně. V severní polární oblasti žijí lidé po tisíce let, kdežto v té jižní nemá nikdo trvalé bydliště — jsou tam jen výzkumné stanice.",
    whyA: "Trvalé osídlení má jen severní polární oblast. V té jižní žijí vědci vždy jen dočasně, po dobu své výpravy.",
    whyB: "Bez stálých obyvatel je jen jižní polární oblast. Na severu naopak vesnice a města existují po staletí.",
    hint0: "U každé oblasti se zeptej, jestli se tam někdo narodí a zestárne, nebo tam lidé jen dočasně pracují.",
    hint1: "Jedna z oblastí má pobřeží patřící několika státům a v nich obce se školami a obchody. Ve druhé stojí jen výzkumné stanice, kam vědci přiletí na jednu sezonu a zase odletí. Rozhodni podle toho, kde má někdo trvalý domov.",
    expl: "V Arktidě žijí lidé odedávna: Inuité v Grónsku a arktické Kanadě, Sámové v evropské tundře, k tomu města a přístavy na severu Ruska, Kanady a Norska. Antarktida trvalé obyvatelstvo nemá — jsou v ní jen výzkumné stanice a nepatří žádnému státu.",
  },
  {
    stem: "Čím se Arktida liší od Antarktidy v tom, komu oblast patří?",
    a: "leží pobřeží států tří světadílů",
    b: "nevládne žádný stát",
    whySwap: "Máš to obráceně. Kolem severního pólu končí pevniny tří světadílů s hranicemi států, kdežto oblast kolem jižního pólu si žádný stát nepřivlastnil.",
    whyA: "Pobřeží několika států má jen severní polární oblast. V jižní polární oblasti mezinárodní smlouva starší nároky zmrazila a nové zakazuje.",
    whyB: "Bez vlády států je jen jižní polární oblast. Na severu naopak končí území Ruska, Kanady, USA, Norska a Dánského království.",
    hint0: "V jedné z oblastí vede po souši státní hranice, ve druhé žádná. Ve které?",
    hint1: "Jedna polární oblast je obklopená pevninami, na nichž končí území několika velkých států — proto se tam vedou spory o mořské dno a nerostné suroviny. Druhá je samostatná pevnina, kde mezinárodní smlouva starší územní nároky zmrazila a nové zakazuje.",
    expl: "Severní ledový oceán obklopují pevniny Evropy, Asie a Severní Ameriky, takže k Arktidě sahají území Ruska, Kanady, USA, Norska a Dánského království (Grónsko). Antarktida naproti tomu nepatří nikomu: podle Antarktické smlouvy jsou starší územní nároky zmrazené, nové se vznášet nesmí a její pozdější dodatek zakazuje i těžbu nerostů. Povolený je jen mírový výzkum.",
  },
];

function rozdilAntarktida(r: Rozdil): PracticeTask | null {
  return hlidej(
    choice(
      r.stem,
      `V Arktidě ${r.a}, kdežto v Antarktidě ${r.b}.`,
      [
        { value: `V Arktidě ${r.b}, kdežto v Antarktidě ${r.a}.`, why: r.whySwap },
        { value: `V Arktidě i v Antarktidě ${r.a}.`, why: r.whyA },
        { value: `V Arktidě i v Antarktidě ${r.b}.`, why: r.whyB },
      ],
      { hints: [r.hint0, r.hint1], explanation: r.expl },
    ),
  );
}

// ── L3 ─────────────────────────────────────────────────────────────────────

type Oblast = "arktida" | "antarktida" | "tundra" | "mirny";

const OBLAST_TEXT: Record<Oblast, string> = {
  arktida: "v Arktidě, tedy za severním polárním kruhem",
  antarktida: "v Antarktidě, tedy za jižním polárním kruhem",
  tundra: "v tundře, ale ještě před severním polárním kruhem",
  mirny: "v mírném pásu, daleko od obou polárních kruhů",
};

/** Vysvětlení k chybně vybrané oblasti — závisí na tom, co je ve skutečnosti. */
function procNe(volba: Oblast, spravne: Oblast, fi: number, t: number): string {
  if (volba === "arktida") {
    return `Arktida je oblast za severním polárním kruhem, tedy od 66,5° s. š. k pólu. Zadaná šířka ${sirka(fi)} tuhle podmínku nesplňuje.`;
  }
  if (volba === "antarktida") {
    return `Antarktida je oblast za jižním polárním kruhem, tedy od 66,5° j. š. k pólu. Zadaná šířka ${sirka(fi)} tuhle podmínku nesplňuje.`;
  }
  if (volba === "tundra") {
    if (spravne === "mirny") {
      return `V tundře je léto studené a stromy tam nerostou. Tady vystoupí teplota na ${cis(t)} °C a rostou tu listnaté lesy.`;
    }
    // Pozor: tundra je hlavní krajina arktické souše a leží z velké části AŽ ZA
    // polárním kruhem. Odmítat ji kvůli šířce by bylo fakticky obráceně —
    // nesedí jen doplněk „ještě před severním polárním kruhem“ v textu možnosti.
    return spravne === "antarktida"
      ? `Bezlesá krajina tu opravdu je, jenže tahle možnost ji klade před SEVERNÍ polární kruh. Zadaná šířka ${sirka(fi)} má za číslem j. š., takže místo leží na jižní polokouli, a navíc dál od rovníku než 66,5°.`
      : `Bezlesá krajina tundru nevylučuje — tundra je naopak hlavní krajina arktické souše a sahá daleko za polární kruh. Nesedí ale doplněk „ještě před severním polárním kruhem“: zadaná šířka ${sirka(fi)} je větší než 66,5°, takže místo už v polární oblasti leží.`;
  }
  return spravne === "tundra"
    ? `V mírném pásu rostou lesy a léto je teplé. Tady vystoupí teplota jen na ${cis(t)} °C a stromy tu nerostou.`
    : `V mírném pásu Slunce každý den zapadne a rostou tam lesy. Zadaná šířka ${sirka(fi)} leží až za polárním kruhem, kde Slunce v létě celé týdny nezapadá.`;
}

const STANICE = ["Meteorologická stanice", "Měřicí stanice", "Pozorovací stanice"];

/**
 * L3 — určení oblasti z šířky a popisu podnebí (nové, nejmenované místo).
 *
 * `spravne` se nelosuje uvnitř, ale dodává ho gen() z pytlíku, aby dvě takové
 * úlohy v jednom sezení nikdy neměly tutéž odpověď: dvě skoro stejné věty se
 * stejným klíčem za sebou vypadají jako chyba aplikace a žák je po druhé
 * přestane číst. `varianta` ze stejného důvodu střídá dvě znění zadání.
 */
function urciOblast(spravne: Oblast, varianta: number): PracticeTask | null {
  let fi: number;
  let t: number;
  let popis: string;
  if (spravne === "arktida") {
    fi = rnd(72, 88);
    t = rnd(0, 4);
    popis = `V nejteplejším měsíci tu teplota vystoupí jen na ${cis(t)} °C, v létě Slunce několik týdnů vůbec nezapadne a neroste tu žádný strom.`;
  } else if (spravne === "antarktida") {
    // Vnitrozemí jižní polární oblasti netaje ani v létě — kladná teplota by tu
    // byla fyzikálně nemožná (a protiřečila by tématu Antarktida).
    fi = -rnd(74, 88);
    t = -rnd(12, 30);
    popis = `Ani v nejteplejším měsíci tu teplota nevystoupí nad ${cis(t)} °C, v létě Slunce několik týdnů vůbec nezapadne a neroste tu žádný strom.`;
  } else if (spravne === "tundra") {
    // Hranice lesa se kryje s izotermou 10 °C nejteplejšího měsíce: nad ní už
    // roste tajga, takže vyšší číslo by popisu bezlesé krajiny odporovalo.
    fi = rnd(60, 65);
    t = rnd(6, 10);
    popis = `V nejteplejším měsíci tu teplota vystoupí na ${cis(t)} °C, Slunce i v nejdelší den zapadne, i když jen na krátkou chvíli, a rostou tu jen mechy, lišejníky a nízké keře.`;
  } else {
    // Jižní polokoule je v těchhle šířkách oceánská a chladnější: mezi 47° a
    // 52° j. š. skoro není pevnina a nejteplejší měsíc se drží kolem 10–15 °C.
    // Stanice s 20 °C a listnatými lesy by tam byla nemožná.
    const jih = pick([true, false]);
    fi = jih ? -rnd(42, 46) : rnd(42, 52);
    t = jih ? rnd(14, 18) : rnd(17, 22);
    popis = `V nejteplejším měsíci tu teplota vystoupí na ${cis(t)} °C, Slunce zapadá po celý rok každý den a rostou tu listnaté lesy.`;
  }
  const ostatni = (["arktida", "antarktida", "tundra", "mirny"] as Oblast[]).filter((o) => o !== spravne);
  const vysvetleni: Record<Oblast, string> = {
    arktida: `Šířka ${sirka(fi)} je větší než 66,5° a písmena s. š. ukazují na severní polokouli, takže místo leží za severním polárním kruhem — v Arktidě. Odpovídá tomu i popis: Slunce tam v létě celé týdny nezapadá. Bezlesá krajina sama o sobě nerozhoduje — souš kolem Severního ledového oceánu je tundra i daleko za polárním kruhem. O oblasti rozhoduje zeměpisná šířka a polokoule, ne rostlinstvo.`,
    antarktida: `Šířka ${sirka(fi)} je větší než 66,5° a písmena j. š. ukazují na jižní polokouli, takže místo leží za jižním polárním kruhem — v Antarktidě. Sedí i popis: led tam neroztaje ani v nejteplejším měsíci a Slunce v létě celé týdny nezapadá.`,
    tundra: `Šířka ${sirka(fi)} je menší než 66,5°, takže polární kruh leží ještě dál na sever a Slunce tam i v nejdelší den zapadne. Chladné léto a bezlesá krajina ale ukazují na tundru, ne na mírný pás.`,
    mirny: `Šířka ${sirka(fi)} je od 66,5° hodně daleko, Slunce tam každý den zapadá a rostou tam listnaté lesy. To všechno odpovídá mírnému pásu.`,
  };
  const zadani = varianta === 0
    ? `${pick(STANICE)} leží na ${sirka(fi)} ${popis} Kde stanice leží?`
    : `Cestovatel si do deníku zapsal: „Tábor jsme postavili na ${sirka(fi)} ${popis}“ Kde se výprava nachází?`;
  return hlidej(
    choice(
      zadani,
      OBLAST_TEXT[spravne],
      ostatni.map((o): Distractor => ({ value: OBLAST_TEXT[o], why: procNe(o, spravne, fi, t) })),
      {
        hints: [
          "Rozhodni podle dvou věcí najednou: porovnej číslo šířky s hranicí polární oblasti a všimni si, co na tom místě roste.",
          "Postupuj po krocích. Nejdřív porovnej číslo šířky s hranicí polární oblasti: je-li větší, je místo v polární oblasti a Slunce tam v létě celé týdny nezapadá; pak už jen podle písmen za číslem urči polokouli. Je-li číslo menší, rozhodne rostlinstvo — tam, kde rostou jen mechy, lišejníky a nízké keře, je krajina bezlesá, kdežto listnaté lesy patří do mírného pásu.",
        ],
        explanation: vysvetleni[spravne],
      },
    ),
  );
}

const BANKA_L3: Fakt[] = [
  {
    q: "Část mořského ledu v Arktidě roztála. Proč se tím hladina světového oceánu prakticky nezvedne?",
    key: "Plovoucí led svou vodu v oceánu už zabírá, nová voda nepřibude.",
    d: [
      ["Hladina stoupne, protože v oceánu přibude voda z roztátého ledu.", "Plovoucí led svou vodu do oceánu zabírá už teď, ještě než roztaje. Hladinu zvedá až voda, která do oceánu přiteče ze souše."],
      ["Voda z roztátého ledu se vsákne do mořského dna.", "Mořské dno vodu nepohlcuje. Hladina se nemění z úplně jiného důvodu — ta voda už v oceánu byla."],
      ["Voda z roztátého ledu se v Arktidě hned znovu vypaří.", "Vypařování v chladu je slabé a hladinu by to nevysvětlilo. Rozhoduje, že plovoucí led už v oceánu místo zabírá."],
    ],
    hints: [
      "Zkus si to jako sklenici s kostkami ledu: přeteče, až když led roztaje?",
      "Plovoucí těleso vytlačí tolik vody, kolik samo váží. Kostka ledu tedy už předtím, než roztaje, zabírá v nádobě právě tolik místa, kolik z ní vznikne vody. Zkus tenhle pokus přenést z kuchyně na celý oceán.",
    ],
    explanation: "Mořský led plave, takže už teď vytlačuje přesně tolik vody, kolik z něj po roztátí vznikne. Jeho tání proto hladinu prakticky nemění. Nebezpečné je z jiných důvodů: mizí lovecký prostor ledních medvědů a tmavá voda pohlcuje víc slunečního záření.",
  },
  {
    q: "Proč tání pevninského ledovce v Grónsku hladinu oceánu naopak zvedá?",
    key: "Voda z něj přiteče do oceánu ze souše, kde do té doby ležela.",
    d: [
      ["Voda z něj je sladká, a proto zabírá v oceánu víc místa.", "O vzestup hladiny se nestará slanost, ale to, že do oceánu přibude voda, která tam dřív nebyla."],
      ["Voda z něj oceán ochladí a ten se chladem roztáhne.", "Ochlazená voda se naopak trochu smrští. Hladinu zvedá přítok vody ze souše."],
      ["Voda z něj odplaví mořský led, který pak zabere víc místa.", "Mořský led zabírá v oceánu stejné místo, ať plave kdekoli. Rozhoduje, že přibude voda ze souše."],
    ],
    hints: [
      "Porovnej, kde ten led leží teď a kde skončí voda, která z něj vznikne.",
      "U každého ledu si polož jedinou otázku: je jeho voda už součástí oceánu, nebo leží mimo něj? Grónský ledovec spočívá na skále vysoko nad hladinou moře, takže jeho voda zatím v oceánu vůbec není.",
    ],
    explanation: "Grónský ledovec leží na pevnině, vysoko nad hladinou moře, takže jeho voda zatím v oceánu není. Když roztaje, přiteče do oceánu jako přírůstek a hladina stoupne. Právě proto se u tání rozlišuje led na moři a led na souši.",
  },
  {
    q: "Ledu v Arktidě ubývá čím dál rychleji. Čím se to vysvětluje?",
    key: "Bílý led záření odráží, tmavá voda ho pohlcuje a led vedle ní taje dál.",
    d: [
      ["Bílý led záření pohlcuje, kdežto tmavá voda ho odráží zpátky do vesmíru.", "Je to obráceně. Světlé plochy záření odrážejí, tmavé ho pohlcují a ohřívají se — to znáš i z černého trička na slunci."],
      ["Bílý i tmavý povrch pohlcují záření stejně, rozhoduje jen vítr.", "Barva povrchu na pohlcování záření velký vliv má. Vítr led rozhání, ale zrychlující se tání vysvětluje právě rozdíl mezi bílou a tmavou plochou."],
      ["Bílý led pod sebou uzavírá teplo, kterým se voda shora ohřívá.", "Led vodu pod sebou naopak stíní a chrání před sluncem. Rozhoduje, co se děje tam, kde už led roztál."],
    ],
    hints: [
      "Vzpomeň si, jak se na slunci liší černé a bílé tričko, a přenes to na led a vodu.",
      "Když část ledu roztaje, objeví se na jeho místě tmavá vodní plocha. Porovnej, jak se na slunci chová světlý a tmavý povrch, a domysli, co to udělá s ledem, který zůstal hned vedle.",
    ],
    explanation: "Bílý led odráží většinu slunečního záření zpátky, kdežto tmavá mořská voda ho pohlcuje a ohřívá se. Jakmile tedy část ledu roztaje, ohřívá se voda na jeho místě a rozpouští led kolem. Tání tak samo sebe zrychluje, čemuž se říká zesilující se zpětná vazba.",
  },
  {
    q: "Proč s ubývajícím ledem roste zájem států o Arktidu?",
    key: "S menším množstvím ledu jsou průjezdné lodní cesty a dostupné suroviny.",
    d: [
      ["S menším množstvím ledu se tam dá pěstovat obilí a ovoce.", "Půda kolem Severního ledového oceánu zůstává zmrzlá a léto krátké. Pole tam ani po roztátí mořského ledu nebudou."],
      ["S menším množstvím ledu se Arktida promění v novou pevninu.", "Pod arktickým ledem je oceán, ne pevnina. Roztáním tam žádná nová souš nevznikne."],
      ["S menším množstvím ledu po něm budou jezdit nákladní auta.", "Je to obráceně: po ledu se dá jezdit, dokud je silný. S jeho ubýváním možnosti dopravy po ledu naopak mizí."],
    ],
    hints: [
      "Rozmysli si, co ledová pokrývka dosud lodím a těžařům znemožňovala.",
      "Ledová pokrývka fungovala jako překážka. Zkus si vyjmenovat, co za ní leží: nejkratší cesta mezi Evropou a Asií a mořské dno se zásobami surovin. Když překážka slábne, co se s obojím stane?",
    ],
    explanation: "Led dosud bránil plavbě i těžbě. Jak ho ubývá, otevírají se kratší lodní cesty podél Sibiře a Kanady a mořské dno se zásobami ropy, plynu a nerostů se stává dostupným. Proto rostou spory o to, komu arktické dno vlastně patří.",
  },
  {
    q: "Proč bývá v Arktidě tepleji než v Antarktidě, přestože obě oblasti leží stejně daleko od rovníku?",
    key: "Pod arktickým ledem je oceán, který teplo drží déle než pevnina.",
    d: [
      ["Arktida leží blíž k rovníku, a proto je tam tepleji než na jihu.", "Obě oblasti sahají od rovníku stejně daleko — polární kruhy leží na stejné šířce na obou polokoulích."],
      ["Nad Arktidou svítí Slunce v létě déle než nad Antarktidou.", "Délka polárního dne je u obou pólů prakticky stejná a rozdíl v teplotě by nevysvětlila — Antarktida dostává v létě dokonce o něco víc záření. Rozdíl dělá to, co je pod ledem."],
      ["Arktidu ohřívá teplo ze sopek, které v Antarktidě nejsou.", "Sopky jsou i v Antarktidě a podnebí celé oblasti neurčují."],
    ],
    hints: [
      "Podívej se, co je pod ledem každé z obou oblastí, a jak se voda a souš liší v držení tepla.",
      "Voda se pomalu ohřívá, ale také pomalu chladne, kdežto souš rychle obojí. Přidej k tomu ještě nadmořskou výšku: jedna z oblastí je plochá hladina, druhá vysoká náhorní plošina, kde je vzduch chladnější.",
    ],
    explanation: "Pod arktickým ledem leží oceán, který si drží teplo a přes tenký led ho pomalu uvolňuje. Antarktida je naproti tomu vysoká pevnina pokrytá kilometry silným ledovcem a ve velké výšce je vzduch ještě chladnější. Proto tam bývají naměřené nejnižší teploty na Zemi.",
  },
  {
    q: "Proč se o mořské dno v Arktidě vedou spory mezi státy, kdežto o Antarktidu ne?",
    key: "Antarktida je chráněná mezinárodní smlouvou a nevlastní ji nikdo.",
    d: [
      ["Antarktida patří celá Austrálii, a ta tam nikoho nepustí.", "Antarktida nepatří žádnému státu, ani Austrálii. Spravuje ji mezinárodní smlouva."],
      ["Antarktidu obklopuje led tak silný, že k ní loď nedopluje.", "K antarktickému pobřeží lodě běžně plují a zásobují výzkumné stanice. Rozhoduje právní ochrana oblasti."],
      ["Antarktida leží mimo dosah států, takže o ni nikdo nestojí.", "Zájem o Antarktidu je velký, proto vznikla smlouva. Ta nové územní nároky i těžbu zakazuje."],
    ],
    hints: [
      "Porovnej, kdo v každé z oblastí rozhoduje: státy s pobřežím, nebo mezinárodní dohoda?",
      "V jedné z oblastí končí území několika velkých států, které si proto dělají nárok i na dno pod mořem. Druhá oblast má zvláštní právní postavení a platí v ní dohoda, která starší územní nároky zmrazila, nové zakázala a těžbu nedovoluje vůbec.",
    ],
    explanation: "Kolem Severního ledového oceánu končí území Ruska, Kanady, USA, Norska a Dánského království, a ty si nárokují mořské dno se surovinami. Antarktida naproti tomu nepatří nikomu: podle Antarktické smlouvy jsou starší územní nároky zmrazené, nové se vznášet nesmí a její pozdější dodatek zakazuje i těžbu nerostů. Povolený je jen mírový výzkum.",
  },
  {
    q: "Za polárním kruhem trvá polární den celé týdny. Proč přesto ani tehdy v Arktidě horko nebývá?",
    key: "Slunce se drží nízko nad obzorem a paprsky dopadají hodně šikmo.",
    d: [
      ["Slunce sice hřeje, jenže polární den trvá jen několik hodin.", "Polární den trvá týdny až měsíce, ne hodiny. Problém je v úhlu, pod kterým paprsky dopadají."],
      ["Slunce svítí v polárních oblastech slabším světlem než jinde.", "Slunce svítí všude stejně. Liší se jen to, jak šikmo jeho paprsky na povrch dopadají."],
      ["Slunce je tam zakryté mraky po celý polární den.", "Srážek a mraků je v polární oblasti naopak málo. Rozhoduje nízká poloha Slunce nad obzorem."],
    ],
    hints: [
      "Posviť si baterkou kolmo na stůl a pak z hodně malého úhlu. Kdy je světlo na stejné ploše silnější?",
      "Množství tepla na jednom metru čtverečním nezávisí jen na tom, jak dlouho Slunce svítí, ale hlavně na úhlu, pod kterým světlo na povrch dopadne. Blízko pólu se Slunce ani v poledne nedostane vysoko, takže se stejné množství záření rozprostře na mnohem větší plochu.",
    ],
    explanation: "Blízko pólu se Slunce ani v poledne nezvedne vysoko nad obzor, takže paprsky dopadají šikmo a jejich energie se rozprostře na velkou plochu. Navíc bílý sníh a led většinu záření odrážejí. Dlouhý polární den to nevyrovná a teploty zůstávají nízké.",
  },
  {
    q: "Vesnice na severu Sibiře se propadá a domy se naklánějí. Co je nejpravděpodobnější příčinou?",
    key: "Trvale zmrzlá půda pod domy rozmrzá a mění se v měkké bahno.",
    d: [
      ["Mořský led pod vesnicí roztál a vesnice klesla o kus níž.", "Vesnice stojí na pevnině, ne na mořském ledu. Propadá se půda, na níž je postavená."],
      ["Ledovec z hor se nasunul pod domy a nadzvedl je.", "V severosibiřské nížině žádné horské ledovce nejsou. Příčina je v podloží pod samotnou vesnicí."],
      ["Časté zemětřesení, protože tundra leží na okraji desky.", "Sever Sibiře patří mezi klidné oblasti bez častých zemětřesení. Domy se naklánějí kvůli podloží."],
    ],
    hints: [
      "Na čem ta vesnice stojí a co se s takovým podložím děje, když se otepluje?",
      "Podloží v tundře drží stavby jen proto, že je zmrzlé, a tedy tvrdé. Zkus domyslet, co se stane s domem, když jeho základy postupně ztratí pevnou oporu a ta se změní v měkkou hmotu.",
    ],
    explanation: "Stavby v tundře stojí na trvale zmrzlé půdě, která je pevná jen dokud zůstává zmrzlá. Jak se otepluje, rozmrzá do větší hloubky, mění se v měkké bahno a domy, silnice i potrubí se naklánějí a boří. Proto se tam staví na kůlech zapuštěných hluboko do podloží.",
  },
  {
    q: "Proč bývá uprostřed Grónska mnohem chladněji než na jeho pobřeží?",
    key: "Střed ostrova leží vysoko na mohutném ledovci a ve výšce je chladněji.",
    d: [
      ["Střed ostrova leží blíž k severnímu pólu než kterékoli jeho pobřeží.", "Severní pobřeží ostrova sahá k pólu ještě blíž než jeho střed, a přesto je tam v létě tepleji. Rozhoduje nadmořská výška."],
      ["Střed ostrova nedostane v zimě vůbec žádné sluneční světlo, pobřeží ano.", "Polární noc má i severní pobřeží ostrova. Rozdíl mezi středem a okrajem tedy délkou svitu vysvětlit nejde."],
      ["Střed ostrova pokrývá tmavá skála, která teplo rychle vyzáří pryč.", "Střed ostrova pokrývá naopak bílý led — skála je pod ním ukrytá hluboko. Chlad tam dělá hlavně velká výška."],
    ],
    hints: [
      "Porovnej obě místa nejen podle vzdálenosti od pólu, ale i podle toho, jak vysoko nad mořem leží.",
      "Pomůže ti pravidlo z podnebí: s každým kilometrem vzhůru teplota výrazně klesne. Pak si domysli, kam až sahá povrch tam, kde se na pevnině vrší ledovec mocný přes tři kilometry, a kam u moře, kde ledovec končí.",
    ],
    explanation: "Grónský ledovec je uprostřed ostrova přes tři kilometry silný, takže jeho povrch leží vysoko nad hladinou moře — a s nadmořskou výškou teplota klesá stejně jako v horách. Pobřeží je naproti tomu nízko a ohřívá ho moře, takže tam led v létě taje a žijí tam lidé.",
  },
  {
    q: "Proč je pro Inuity ubývající led na moři problém, i když jejich vesnice stojí na pevnině?",
    key: "Po ledu se jezdilo na lov a mezi vesnicemi, teď tahle cesta mizí.",
    d: [
      ["Roztátý led zvedne hladinu moře a pobřežní vesnice postupně zaplaví.", "Led na hladině plave, takže jeho tání hladinu prakticky nezvedne. Ztráta je jiná — mizí plocha, po které se lidé pohybovali."],
      ["Bez ledu se v Arktidě přestane dát lovit, protože ryby z moře zmizí.", "Ryby z moře nemizí, některé se naopak posouvají dál na sever. Mizí ale povrch, po kterém se dalo na lov dojet."],
      ["Lední medvědi se přiblíží k vesnicím a bydlet se v nich už nedá.", "Medvědi se k vesnicím opravdu přibližují, ale lidé se kvůli tomu nestěhují. Hlavní ztráta je cesta po zamrzlém moři."],
    ],
    hints: [
      "Zkus si představit, k čemu zamrzlé moře lidem sloužilo kromě toho, že na něm žila jejich kořist.",
      "Zamrzlé moře nebylo pro Inuity jen kulisou, ale plochou, po které se dalo chodit a jezdit. Zkus domyslet, co se stane s loveckou výpravou a s návštěvou sousední vesnice, když tahle plocha vydrží každý rok kratší dobu.",
    ],
    explanation: "Zamrzlé moře fungovalo v Arktidě jako cesta: po ledu se jezdilo za tuleni i do sousedních vesnic a tuleni se u něj zdržovali. Jak led tenčí a drží kratší část roku, je taková cesta nebezpečná a lovecká sezona se zkracuje. Vesnice samotné stojí na pevnině, takže je tání nezaplaví — mění se způsob obživy, ne poloha vesnice.",
  },
  {
    q: "Proč mají zvířata Arktidy kratší uši a nohy než jejich příbuzní z teplých krajů?",
    key: "Menší výčnělky ztrácejí méně tepla, tělo si ho tak udrží déle.",
    d: [
      ["Menší uši a nohy se zvířeti v hlubokém sněhu tolik nezabořují.", "V hlubokém sněhu pomáhají naopak široké tlapy, jaké má lední medvěd. O velikosti uší rozhoduje ztráta tepla."],
      ["Menší uši a nohy jsou lehčí, a tak zvíře po ledu rychleji utíká.", "Rychlost na velikosti uší nezávisí. Krátké výčnělky mají smysl kvůli hospodaření s teplem."],
      ["Menší uši a nohy zvířeti v tmavé polární noci méně překážejí.", "V polární noci se zvířata orientují sluchem a čichem, malé uši jim v tom nepomáhají. Jde o udržení tepla."],
    ],
    hints: [
      "Porovnej lišku polární s pouštním fenkem, který má obrovské uši. Co uši v každém z obou prostředí dělají?",
      "Teplo tělo ztrácí povrchem a každý výčnělek — ucho, ocas, noha — povrch těla zvětšuje. Zkus si podle toho rozmyslet, co se vyplatí mít malé v mrazu a co naopak velké v horku.",
    ],
    explanation: "Teplo odchází z těla povrchem a velké uši, dlouhé nohy nebo ocas povrch zvětšují. V mrazu se proto vyplatí mít výčnělky malé: liška polární má krátké uši a zavalité tělo, kdežto pouštní fenek má uši obrovské, aby se přebytečného tepla zbavil. Stejné pravidlo platí i pro krátké uši soba nebo ledního medvěda.",
  },
];

// ── Generátor ──────────────────────────────────────────────────────────────

/**
 * Pytlík: vydává prvky v náhodném pořadí, ale každý právě jednou, než se
 * naplní znovu. Drží se uvnitř gen(), takže modul zůstává bez stavu.
 */
function pytlik<T>(prvky: T[]): () => T {
  let zbytek: T[] = [];
  return () => {
    if (zbytek.length === 0) zbytek = shuffle(prvky);
    return zbytek.pop()!;
  };
}

function gen(level: number): PracticeTask[] {
  // Oblast i znění zadání jdou z pytlíku: dvě souřadnicové úlohy v jednom
  // sezení tak nikdy nemají stejnou odpověď ani stejnou šablonu.
  const losOblast = pytlik<Oblast>(["arktida", "antarktida", "tundra", "mirny"]);
  const losZadani = pytlik([0, 1]);
  const urci: Tvurce = () => urciOblast(losOblast(), losZadani());
  // Obě zrcadlové otázky o zvířatech se vylučují — když přijdou obě, řeší se
  // podruhé už jen hledáním téhož slova. Do sezení proto jde jen jedna.
  const zvire: Tvurce = () => pick([zvireArktida, zvireAntarktida, zvireTulen])();
  // Banky taky přes pytlík: bez toho se v jednom sezení opakoval tentýž fakt,
  // shoda vypadla z dedup filtru a na její místo se posunula další šablona —
  // kvůli tomu v sezení přibývaly souřadnicové úlohy nad plánovaný poměr.
  const zBanky = (banka: Fakt[]): Tvurce => {
    const los = pytlik(banka);
    return () => fakt(los());
  };
  const faktL1 = zBanky(BANKA_L1);
  const faktL2 = zBanky(BANKA_L2);
  const faktL3 = zBanky(BANKA_L3);
  const losRozdil = pytlik(ROZDILY);
  const rozdil: Tvurce = () => rozdilAntarktida(losRozdil());

  const sablony: Tvurce[] =
    level === 1
      ? [faktL1, faktL1, zvire, faktL1, faktL1, faktL1]
      : level === 2
        ? [faktL2, faktL2, rozdil, faktL2, faktL2, rozdil]
        : [urci, faktL3, faktL3, urci, faktL3, faktL3];
  let i = 0;
  const genLx = () => losUlohy(sablony[i++ % sablony.length]);
  return ruzneUlohy(() => losUlohy(genLx));
}

// ── Topic ──────────────────────────────────────────────────────────────────
export const ARKTIDA_POLOHA_KLIMA_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-zem-arktida-poloha-klima-vyznam-6",
    rvpNodeId: "g6-zemepis-regiony-sveta-polarni-oblasti-arktida-poloha-klima-vyznam",
    displayName: "Arktida a tání ledu",
    title: "Arktida - poloha, klima, význam",
    studentTitle: "Arktida: led, medvědi a tání",
    subject: "zemepis",
    category: "Regiony světa",
    topic: "Polární oblasti",
    briefDescription: "Poloha Arktidy, její podnebí, život lidí a zvířat a důsledky tání ledu.",
    keywords: [
      "Arktida", "Severní ledový oceán", "severní polární kruh", "mořský led",
      "Grónsko", "tundra", "Inuité", "Sámové", "lední medvěd", "Antarktida",
      "polární den", "tání ledu",
    ],
    goals: [
      "Popsat polohu Arktidy a odlišit ji od Antarktidy (led na moři × led na pevnině).",
      "Odvodit z polohy podnebí, vegetaci tundry a způsob života lidí v Arktidě.",
      "Vysvětlit, proč tání mořského ledu hladinu oceánu nezvedá, kdežto tání pevninského ano.",
    ],
    boundaries: [
      "Bez map a obrázků — poloha se určuje ze souřadnic a slovního popisu.",
      "Politická fakta jen stálá (Antarktická smlouva, státy s arktickým pobřežím).",
      "Žádná čísla závislá na aktuálním roce (rozloha ledu, počet obyvatel).",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Arktida = oblast kolem severního pólu, z větší části zamrzlý Severní ledový oceán; hranice je severní polární kruh 66,5° s. š. Antarktida je naopak pevnina kolem jižního pólu.",
      steps: [
        "Podle zeměpisné šířky rozhodni, jestli je místo za polárním kruhem (66,5°).",
        "Podle písmen s. š. nebo j. š. urči polokouli, a tím i polární oblast.",
        "U tání rozliš, jestli led leží na hladině oceánu, nebo na pevnině.",
      ],
      commonMistake: "Považovat Arktidu za pevninu, hledat tučňáky na severu a myslet si, že roztátý mořský led zvedne hladinu oceánu.",
      example: "Místo na 78° s. š. leží v Arktidě, místo na 78° j. š. v Antarktidě. Grónský ledovec leží na souši, takže jeho tání hladinu oceánu zvedá.",
    },
  },
];
