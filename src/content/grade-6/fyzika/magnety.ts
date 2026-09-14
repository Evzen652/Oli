/**
 * Fyzika 6. ročník — Magnety: magnetické pole, magnetické póly Země.
 *
 * Poslední téma fyziky šestky a třetí v okruhu „Elektrické vlastnosti látek“.
 * Uzavírá dvojici sil, které působí na dálku: `elektrickyNaboj.ts` ukázal
 * náboj, tohle magnet. Podobnost mezi nimi je tak velká, že se dá využít —
 * a na jednom místě je zrádná, protože právě tam se liší.
 *
 * **Miskoncepce, na které téma cílí:**
 *  1. Magnet přitáhne každý kov. (Nepřitáhne. Jen železo, nikl, kobalt
 *     a slitiny, ve kterých jsou — hlavně ocel. Hliník, měď, mosaz, stříbro
 *     a zlato nechává být. Celá L1 stojí na téhle jediné věci.)
 *  2. U zeměpisného severu je severní magnetický pól Země. (Je tam jižní.
 *     Jinak by se k němu severní pól magnetky nepřitáhl. Nejvýživnější past
 *     celého tématu a jádro L3.)
 *  3. Magnet se dá rozlomit na samostatný severní a jižní pól. (Nedá. Každý
 *     úlomek má zase oba.)
 *  4. Magnetická síla potřebuje dotyk a neprojde překážkou. (Projde papírem,
 *     dřevem i rukou.)
 *
 * Gradace:
 *  • **L1 rozpoznání** — přitáhne magnet tenhle předmět? Rozhoduje jedině
 *    materiál, ne to, jestli je předmět kovový, lesklý nebo těžký.
 *  • **L2 aplikace** — póly, magnetické pole, rozlomený magnet, dočasně
 *    zmagnetovaný hřebík, co silou projde a co ne.
 *  • **L3 přenos** — Země jako magnet a paralela s nábojem dotažená do konce.
 *
 * ## Rozhodnutí, která stojí za vysvětlení
 *
 * **Paralela s nábojem je vedená záměrně, včetně místa, kde selhává.**
 * Souhlasné póly se odpuzují a nesouhlasné přitahují úplně stejně jako náboje,
 * a nenamagnetované železo magnet jen přitahuje — nikdy neodpuzuje — přesně
 * jako nabité těleso přitahuje nenabitý papírek. Rozdíl je v tom, že náboj se
 * dá oddělit (kladné těleso a záporné těleso existují zvlášť), kdežto pól ne:
 * rozlomený magnet dá zase dva celé magnety. L2 i L3 se na to ptají zvlášť,
 * protože právě tady by přenesená analogie vedla ke špatné odpovědi.
 *
 * **Binární otázka je jen na L1 a má vyváženou nabídku.** Dvě možnosti
 * začínají „Ano“ a dvě „Ne“, ať už je klíč jakýkoli. Bez toho by šel klíč
 * vybrat jako jediný odlišný kus — vada, kterou v téhle dávce hlídá
 * `npm run check:options`.
 *
 * **Materiály v bance jsou ověřené, ne odhadnuté.** Nerezové příbory
 * v bance schválně nejsou: část nerezových ocelí magnetická není a úloha by
 * podle kuchyňské zkušenosti vycházela jednou tak a jednou jinak. Ze stejného
 * důvodu tu nejsou české mince — jsou z pokovené oceli, takže se magnetu
 * chytí, což odporuje tomu, co dítě od „mince“ čeká.
 *
 * **Bez elektromagnetu a bez souvislosti proudu s magnetickým polem.**
 * Patří to k Oerstedovu pokusu do vyšších ročníků; tady zůstávají permanentní
 * magnety.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, buildChoiceTask as task, ruzneUlohy } from "./_shared";

/* ------------------------------------------------------------------ L1 --- */

type Druh = "kovMagneticky" | "kovNemagneticky" | "nekov";

/**
 * Distraktory podle druhu materiálu. Vyvážené tak, aby v každé nabídce byly
 * dvě možnosti „Ano“ a dvě „Ne“ — jinak by se klíč dal poznat podle tvaru,
 * aniž by dítě o magnetech cokoli vědělo.
 */
const CHYBNE: Record<Druh, { value: string; why: string }[]> = {
  kovMagneticky: [
    {
      value: "Ano, ale jen kdyby byl sám namagnetovaný.",
      why: "Namagnetovaný být nemusí. Magnet přitáhne i obyčejné železo, které samo žádným magnetem není.",
    },
    {
      value: "Ne, magnet přitahuje jen jiné magnety.",
      why: "Přitahuje i obyčejné železo. Kdyby ne, neudržel by na lednici jediný hřebík.",
    },
    {
      value: "Ne, magnet přitahuje jen surové železo, ne hotové výrobky z něj.",
      why: "Na tom, jestli jde o surovinu nebo o hotový výrobek, vůbec nezáleží. Magnet přitáhne hřebík i podkovu.",
    },
  ],
  kovNemagneticky: [
    {
      value: "Ano, je to přece kov a kovy magnet přitahuje.",
      why: "Tohle je nejčastější omyl o magnetech. Magnet přitahuje jen železo, nikl a kobalt — ostatní kovy nechává být.",
    },
    {
      value: "Ano, ale musel by být magnet mnohem silnější.",
      why: "Na síle magnetu to nezávisí. Nemagnetický kov nepřitáhne ani ten nejsilnější magnet na světě.",
    },
    {
      value: "Ne, magnet přitahuje jen věci, které jsou samy magnety.",
      why: "Obyčejný hřebík magnet není a přitáhne se. Rozhoduje látka, ne to, jestli je předmět magnet.",
    },
  ],
  nekov: [
    {
      value: "Ano, magnetu se trochu chytí každý předmět.",
      why: "Nechytí. Magnet působí jen na železo, nikl a kobalt, ostatního si vůbec nevšimne.",
    },
    {
      value: "Ano, ale jen kdyby byl magnet silnější.",
      why: "Silnější magnet na tom nic nezmění. Nejde o sílu, ale o látku.",
    },
    {
      value: "Ne, protože je ten předmět příliš lehký.",
      why: "Hmotnost nerozhoduje. Magnet nepřitáhne ani těžký hliníkový blok a lehký ocelový špendlík přitáhne.",
    },
  ],
};

/**
 * Předměty pro L1. Tři tvary téhož jména, protože každý sedí jinam: `co4` do
 * otázky („Přitáhne magnet ocelový hřebík?“), `kdo` do malé nápovědy („z čeho
 * je ocelový hřebík“) a `koho` do velké („u ocelového hřebíku“). Odvodit je
 * z jednoho tvaru nejde a přesně tahle zkratka vyrobila v téhle dávce čtyři
 * neshody.
 */
const PREDMETY: { co4: string; kdo: string; koho: string; druh: Druh; klic: string }[] = [
  {
    co4: "ocelový hřebík",
    kdo: "ocelový hřebík",
    koho: "ocelového hřebíku",
    druh: "kovMagneticky",
    klic: "Ano, je z oceli a v té je železo, které magnet přitahuje.",
  },
  {
    co4: "kancelářskou sponku",
    kdo: "kancelářská sponka",
    koho: "kancelářské sponky",
    druh: "kovMagneticky",
    klic: "Ano, je z ocelového drátu a ocel magnet přitahuje.",
  },
  {
    co4: "železnou podkovu",
    kdo: "železná podkova",
    koho: "železné podkovy",
    druh: "kovMagneticky",
    klic: "Ano, je ze železa, a to magnet přitahuje ze všeho nejlíp.",
  },
  {
    co4: "ocelový šroub",
    kdo: "ocelový šroub",
    koho: "ocelového šroubu",
    druh: "kovMagneticky",
    klic: "Ano, ocel obsahuje železo, takže se magnetu chytí.",
  },
  {
    co4: "plechovku od rajského protlaku",
    kdo: "plechovka od rajského protlaku",
    koho: "plechovky od rajského protlaku",
    druh: "kovMagneticky",
    klic: "Ano, konzervy se dělají z ocelového plechu a ten magnet přitahuje.",
  },
  {
    co4: "špendlík",
    kdo: "špendlík",
    koho: "špendlíku",
    druh: "kovMagneticky",
    klic: "Ano, špendlíky se dělají z oceli a tu magnet přitahuje.",
  },
  {
    co4: "železný klíč od sklepa",
    kdo: "železný klíč od sklepa",
    koho: "železného klíče od sklepa",
    druh: "kovMagneticky",
    klic: "Ano, je ze železa a železo se magnetu chytí.",
  },
  {
    co4: "ocelové nůžky",
    kdo: "ocelové nůžky",
    koho: "ocelových nůžek",
    druh: "kovMagneticky",
    klic: "Ano, čepele jsou z oceli, ve které je železo.",
  },
  {
    co4: "hliníkovou plechovku od limonády",
    kdo: "hliníková plechovka od limonády",
    koho: "hliníkové plechovky od limonády",
    druh: "kovNemagneticky",
    klic: "Ne, hliník magnet nepřitahuje, přestože je to kov.",
  },
  {
    co4: "měděný drát",
    kdo: "měděný drát",
    koho: "měděného drátu",
    druh: "kovNemagneticky",
    klic: "Ne, měď magnet nepřitahuje, i když proud vede výborně.",
  },
  {
    co4: "mosaznou kliku",
    kdo: "mosazná klika",
    koho: "mosazné kliky",
    druh: "kovNemagneticky",
    klic: "Ne, mosaz je slitina mědi a zinku a tu magnet nepřitahuje.",
  },
  {
    co4: "zlatý prsten",
    kdo: "zlatý prsten",
    koho: "zlatého prstenu",
    druh: "kovNemagneticky",
    klic: "Ne, zlato magnet nepřitahuje vůbec.",
  },
  {
    co4: "stříbrnou lžičku",
    kdo: "stříbrná lžička",
    koho: "stříbrné lžičky",
    druh: "kovNemagneticky",
    klic: "Ne, stříbro mezi magnetické kovy nepatří.",
  },
  {
    co4: "alobal",
    kdo: "alobal",
    koho: "alobalu",
    druh: "kovNemagneticky",
    klic: "Ne, alobal je z hliníku a ten magnet nepřitahuje.",
  },
  {
    co4: "skleněnou kuličku",
    kdo: "skleněná kulička",
    koho: "skleněné kuličky",
    druh: "nekov",
    klic: "Ne, sklo magnet nepřitahuje.",
  },
  {
    co4: "dřevěnou tužku",
    kdo: "dřevěná tužka",
    koho: "dřevěné tužky",
    druh: "nekov",
    klic: "Ne, dřevo ani tuha uvnitř magnet nepřitahuje.",
  },
  {
    co4: "plastové pravítko",
    kdo: "plastové pravítko",
    koho: "plastového pravítka",
    druh: "nekov",
    klic: "Ne, plast magnet nepřitahuje.",
  },
  {
    co4: "gumovou pneumatiku od kočárku",
    kdo: "gumová pneumatika od kočárku",
    koho: "gumové pneumatiky od kočárku",
    druh: "nekov",
    klic: "Ne, guma magnet nepřitahuje.",
  },
];

const KROKY_L1 = [
  "Zjisti, z čeho je předmět vyrobený.",
  "Magnet přitahuje železo, nikl, kobalt a slitiny s nimi — hlavně ocel.",
  "Ostatní kovy ani nekovy nepřitahuje, ať jsou jakkoli lesklé, těžké nebo velké.",
];

function genL1(): PracticeTask {
  const p = pick(PREDMETY);
  return task(`Přitáhne magnet ${p.co4}?`, p.klic, CHYBNE[p.druh], {
    hints: [
      `Rozhodni podle jediné věci — z čeho je ${p.kdo}.`,
      `Magnet přitahuje jen železo, nikl a kobalt a slitiny, ve kterých jsou; z těch potkáš nejčastěji ocel. Ostatní kovy jako hliník, měď, mosaz, stříbro a zlato nechává být úplně stejně jako plast, dřevo nebo sklo. Nerozhoduje ani lesk, ani hmotnost, ani to, jestli je předmět kovový. U ${p.koho} se proto ptej jen na materiál.`,
    ],
    solutionSteps: KROKY_L1,
    explanation:
      p.druh === "kovMagneticky"
        ? "Magnet přitahuje železo a slitiny, ve kterých je — především ocel. Tenhle předmět mezi ně patří."
        : "Magnet přitahuje jen železo, nikl a kobalt. Tenhle předmět z žádného z nich není, takže na něj magnet nepůsobí.",
  });
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

const POLE: Polozka[] = [
  {
    otazka:
      "Dva tyčové magnety přiblížíš k sobě tak, že proti sobě míří oba severní póly. Co se stane?",
    klic: "Odpudí se, protože souhlasné póly se odpuzují.",
    chybne: [
      {
        value: "Přitáhnou se, magnety se přitahují vždycky.",
        why: "Vždycky ne. K sobě se táhnou jen nesouhlasné póly, severní k jižnímu.",
      },
      {
        value: "Nestane se nic, dokud se nedotknou.",
        why: "Magnetická síla působí i přes mezeru. Odpuzování ucítíš dřív, než se magnety potkají.",
      },
      {
        value: "Jeden z nich se otočí a pak se přitáhnou.",
        why: "Kdybys je držel volně, otočit by se mohly. Když je držíš pevně, prostě se tlačí od sebe.",
      },
    ],
    h0: "Porovnej jen ta dvě označení pólů, která proti sobě míří.",
    h1: "U magnetů platí totéž pravidlo jako u nábojů: souhlasné se od sebe tlačí pryč, nesouhlasné se k sobě táhnou. Severní proti severnímu i jižní proti jižnímu se tedy odpuzují, severní proti jižnímu se přitahuje. Dotýkat se přitom nemusejí — síla působí přes mezeru.",
    vysvetleni:
      "Souhlasné póly se odpuzují, nesouhlasné přitahují. Je to stejné pravidlo jako u elektrických nábojů.",
  },
  {
    otazka: "Tyčový magnet rozlomíš přesně uprostřed. Co dostaneš?",
    klic: "Dva menší magnety, každý zase se severním i jižním pólem.",
    chybne: [
      {
        value: "Jeden kus se severním pólem a druhý s jižním.",
        why: "Samostatný pól neexistuje. Na každém úlomku se hned objeví i ten druhý.",
      },
      {
        value: "Dva kusy železa, které už nejsou magnetické.",
        why: "Magnetické zůstanou oba. Zlomením se magnetismus neztratí.",
      },
      {
        value: "Dva magnety, každý jen s polovinou jednoho pólu.",
        why: "Půlka pólu nedává smysl. Každý úlomek má celý severní i celý jižní pól.",
      },
    ],
    h0: "Zkus si představit, že bys lámal dál a dál. Co by nakonec zbylo?",
    h1: "Tohle je právě to místo, kde se magnet od náboje liší. Kladné a záporné těleso existují každé zvlášť, kdežto samostatný severní pól nikdo nikdy nenašel. Ať magnet rozlomíš na jakkoli malé kousky, každý z nich bude mít oba póly.",
    vysvetleni:
      "Magnetické póly se nedají oddělit. Každý úlomek magnetu má vždy severní i jižní pól, ať je jakkoli malý.",
  },
  {
    otazka:
      "Magnet drží ocelovou sponku. Mezi magnet a sponku vsuneš list papíru. Co se stane?",
    klic: "Sponka se drží dál — papír magnetické síle nevadí.",
    chybne: [
      {
        value: "Sponka se drží, ale jen proto, že je papír velmi tenký.",
        why: "Na tloušťce papíru to skoro nezáleží. Síla projde i přes několik listů naráz.",
      },
      {
        value: "Sponka spadne, papír magnetickou sílu zastaví.",
        why: "Nezastaví. Magnet drží lístek na lednici přesně díky tomu, že síla papírem projde.",
      },
      {
        value: "Sponka spadne, protože síla projde jen vzduchem.",
        why: "Projde papírem, dřevem, sklem i tvojí rukou. Zastavit se dá jen silnou železnou deskou.",
      },
    ],
    h0: "Vzpomeň si, jak drží lístek s nákupem na dvířkách lednice.",
    h1: "Magnetická síla prochází skrz většinu látek, protože nepůsobí dotykem, ale polem kolem magnetu. Papír, dřevo, sklo ani ruka jí nevadí. Jediné, co ji opravdu odstíní, je vrstva železa — to pole samo pohltí a odvede.",
    vysvetleni:
      "Magnetické pole prochází nemagnetickými látkami. Papír ho nezastaví, jen o svou tloušťku zvětší vzdálenost, a tím sílu o kousek zmenší.",
  },
  {
    otazka: "Na které části tyčového magnetu drží nejvíc železných pilin?",
    klic: "Na obou koncích, tedy u pólů.",
    chybne: [
      {
        value: "Uprostřed, tam je magnet nejmohutnější.",
        why: "Uprostřed se piliny skoro nedrží. Právě tam je magnet nejslabší.",
      },
      {
        value: "Rovnoměrně po celé délce.",
        why: "Rovnoměrně to není. Rozdíl mezi konci a středem je na první pohled vidět.",
      },
      {
        value: "Jen na jednom konci, na tom severním.",
        why: "Oba póly působí stejně silně. Severní není silnější než jižní.",
      },
    ],
    h0: "Zkus si vzpomenout na obrázek magnetu obsypaného pilinami — kde jich je nejvíc?",
    h1: "Magnetické pole je nejsilnější u pólů a směrem ke středu magnetu slábne. Uprostřed tyčového magnetu se póly navzájem vyrovnávají, takže tam piliny skoro nedrží. Oba konce přitom působí stejně silně — severní ani jižní pól není ten hlavní.",
    vysvetleni:
      "Magnetické pole je nejsilnější u pólů a uprostřed magnetu nejslabší. Oba póly jsou přitom stejně silné.",
  },
  {
    otazka:
      "Na papír s magnetem pod ním nasypeš železné piliny a poklepeš. Piliny se seřadí do křivek. Co tím vidíš?",
    klic: "Tvar magnetického pole kolem magnetu.",
    chybne: [
      {
        value: "Samotné magnetické póly.",
        why: "Póly jsou jen dvě místa na magnetu. Křivky ukazují celý prostor kolem něj.",
      },
      {
        value: "Dráhu, po které se magnet pohyboval.",
        why: "Magnet se nehýbal. Křivky vznikly natočením pilin, ne pohybem.",
      },
      {
        value: "Prasklinky v papíře způsobené poklepáním.",
        why: "Papír zůstal celý. Poklepání jen umožnilo pilinám se natočit.",
      },
    ],
    h0: "Piliny jsou samy drobné kousky železa. Ptej se, co je přinutilo se natočit zrovna takhle.",
    h1: "Každá pilina se v poli magnetu natočí do směru, kterým na ni pole působí, a vedle sebe položené piliny tak vykreslí celé čáry. Je to jediný způsob, jak si magnetické pole udělat viditelné — samo o sobě vidět není a poznáš ho jedině podle toho, co udělá s něčím železným.",
    vysvetleni:
      "Železné piliny zviditelní magnetické pole. Křivky, do kterých se seřadí, vedou od jednoho pólu ke druhému a nejhustší jsou právě u pólů.",
  },
  {
    otazka:
      "K nenamagnetovanému ocelovému hřebíku přiložíš jednou severní a podruhé jižní pól magnetu. Jak se hřebík zachová?",
    klic: "Přitáhne se v obou případech stejně.",
    chybne: [
      {
        value: "Severním se přitáhne, jižním odpudí.",
        why: "Odpudit by se mohl jen tehdy, kdyby byl sám magnet. Obyčejné železo magnet vždycky jen přitahuje.",
      },
      {
        value: "Jižním se přitáhne, severním odpudí.",
        why: "Ani obráceně to neplatí. Nenamagnetované železo se nikdy neodpuzuje.",
      },
      {
        value: "Nezachová se nijak, dokud ho sám nenamagnetuješ.",
        why: "Přitáhne se hned. Namagnetovaný předem být nemusí.",
      },
    ],
    h0: "Hřebík sám žádný severní ani jižní pól nemá. Zamysli se, co z toho plyne.",
    h1: "Aby se dvě věci odpuzovaly, musí být obě magnety a mít proti sobě souhlasné póly. Obyčejný hřebík magnet není, takže odpuzovat se nemůže — přiložený magnet v něm teprve póly vytvoří, a vždycky tak, aby se přitáhl. Je to přesně totéž, jako když nabitý hřeben přitáhne nenabitý papírek.",
    vysvetleni:
      "Nenamagnetované železo magnet vždycky jen přitahuje, nikdy neodpuzuje. Odpuzování může nastat jen mezi dvěma magnety se souhlasnými póly.",
  },
  {
    otazka:
      "Hřebík přiložíš k magnetu a on sám začne přitahovat druhý hřebík. Po oddálení od magnetu to přestane. Co se s ním dělo?",
    klic: "V poli magnetu se z něj nakrátko stal slabý magnet.",
    chybne: [
      {
        value: "Přeskočila na něj část magnetu.",
        why: "Magnet nijak neubyl a nic se nepřeneslo. Změnilo se jen uspořádání uvnitř hřebíku.",
      },
      {
        value: "Zahřál se a teplo druhý hřebík přitáhlo.",
        why: "Teplo nic nepřitahuje. A hřebík se přitom ani neohřeje.",
      },
      {
        value: "Druhý hřebík se přitahoval přímo k magnetu přes ten první.",
        why: "Kdyby to bylo takhle, drželo by to i po oddálení magnetu na stejnou vzdálenost. Ono to skončí hned.",
      },
    ],
    h0: "Změna trvala jen tak dlouho, dokud byl hřebík u magnetu. Ptej se, co se v něm mohlo tak rychle vrátit zpátky.",
    h1: "Železo je uvnitř rozdělené na drobné oblasti, které se chovají jako maličké magnety a normálně míří každá jinam, takže se navzájem ruší. V poli magnetu se srovnají do jednoho směru a hřebík začne působit jako magnet. Jakmile pole zmizí, většina oblastí se zase rozběhne a magnetismus skoro celý zmizí.",
    vysvetleni:
      "Železo se v magnetickém poli dočasně zmagnetuje. Po oddálení magnetu se uspořádání uvnitř rozpadne a jev skončí — proto se tomu říká dočasný magnet.",
  },
  {
    otazka:
      "Magnet a železný hřebík odtahuješ od sebe stále dál. Jak se mění síla, kterou na sebe působí?",
    klic: "Rychle slábne, ale nikde nekončí náhle.",
    chybne: [
      {
        value: "Zůstává stejná, dokud se úplně nepřetrhne.",
        why: "Nic se netrhá. Síla slábne plynule od první chvíle.",
      },
      {
        value: "Slábne rovnoměrně, takže na dvojnásobek vzdálenosti klesne na polovinu.",
        why: "Klesá mnohem rychleji než na polovinu. Proto magnet drží zblízka pevně a o pár centimetrů dál skoro vůbec.",
      },
      {
        value: "Za hranicí magnetického pole je přesně nulová.",
        why: "Žádná ostrá hranice pole neexistuje. Síla se jen zmenšuje, až ji nepoznáš.",
      },
    ],
    h0: "Zkus si vybavit, jak se magnet chová těsně u hřebíku a jak o pět centimetrů dál.",
    h1: "Magnetická síla je zblízka velmi silná a s rostoucí vzdáleností padá strmě dolů — mnohem rychleji, než by odpovídalo prostému dělení. Nikde ale nekončí skokem: i daleko od magnetu je pořád nějaká, jen tak slabá, že ji nepoznáš. Je to táž věc jako u elektrické síly.",
    vysvetleni:
      "Magnetická síla se vzdáleností rychle slábne, ale nemá ostrou hranici. Proto magnet drží jen těsně u železa.",
  },
  {
    otazka: "Které z těchto látek magnet přitahuje: železo, hliník, nikl, měď?",
    klic: "Železo a nikl.",
    chybne: [
      {
        value: "Železo, hliník a nikl.",
        why: "Hliník mezi ně nepatří. Je to kov, ale magnet si ho nevšímá.",
      },
      {
        value: "Železo a měď.",
        why: "Měď magnet nepřitahuje. Vede skvěle proud, s magnetem to ale nesouvisí.",
      },
      {
        value: "Všechny čtyři, jsou to kovy.",
        why: "Právě tohle je nejčastější omyl. Magnetické jsou jen tři kovy: železo, nikl a kobalt.",
      },
    ],
    h0: "Projdi si ty čtyři kovy jeden po druhém. Kovovost sama o sobě nerozhoduje.",
    h1: "Magnetické kovy jsou jen tři: železo, nikl a kobalt. K nim se přidávají slitiny, ve kterých jsou — hlavně ocel. Hliník, měď, mosaz, stříbro, zlato ani cín magnet nepřitahuje, přestože to všechno kovy jsou.",
    vysvetleni:
      "Magnet přitahuje železo, nikl a kobalt a jejich slitiny. Ostatní kovy nechává být — být kovem nestačí.",
  },
  {
    otazka:
      "Magnet položíš na rozpálená kamna a necháš ho tam dlouho ležet. Jak to dopadne?",
    klic: "Magnetismus z velké části ztratí.",
    chybne: [
      {
        value: "Zesílí, teplem se magnetismus posiluje.",
        why: "Je to naopak. Teplo uspořádání uvnitř magnetu rozhází.",
      },
      {
        value: "Nezmění se nic, magnetismus na teple nezávisí.",
        why: "Závisí. Nad určitou teplotou magnet svůj magnetismus ztratí úplně.",
      },
      {
        value: "Otočí si póly, sever bude tam, kde byl jih.",
        why: "Póly si magnet sám neprohodí. Slábne, ale nepřevrací se.",
      },
    ],
    h0: "Uvnitř magnetu jsou drobné oblasti srovnané do jednoho směru. Ptej se, co s nimi udělá teplo.",
    h1: "Magnetismus drží na tom, že drobné oblasti uvnitř míří stejným směrem. Teplem se částice pohybují rychleji a to uspořádání se rozháže, takže magnet slábne. Nad určitou teplotou zmizí magnetismus úplně a po vychladnutí se sám nevrátí. Stejně škodí magnetu i silný úder kladivem.",
    vysvetleni:
      "Zahřátí i silný úder magnet oslabí, protože rozhodí uspořádání drobných oblastí uvnitř. Ztracený magnetismus se sám nevrátí.",
  },
  {
    otazka:
      "Magnetka kompasu se po každém zatřesení ustálí pořád ve stejném směru. Proč?",
    klic: "Působí na ni magnetické pole Země.",
    chybne: [
      {
        value: "Je uvnitř zatížená, takže se stočí vždycky stejně.",
        why: "Kdyby rozhodovalo závaží, mířila by dolů, ne k severu. A otočený kompas by ukazoval jinam.",
      },
      {
        value: "Otáčí se za sluncem.",
        why: "Kompas funguje i v noci a ve sklepě, kde slunce není.",
      },
      {
        value: "Ukazuje k nejbližšímu kovovému předmětu.",
        why: "Většina kovů na magnetku nepůsobí vůbec. A v prázdné krajině žádný poblíž není.",
      },
    ],
    h0: "Kompas funguje i uprostřed louky, kde kolem není nic kovového ani nic jiného. Musí tedy jít o něco, co je úplně všude.",
    h1: "Země se chová jako obrovský magnet a kolem sebe má magnetické pole. Magnetka je sama malý magnet, takže se v tom poli natočí stejně jako každá jiná střelka — pokaždé stejným směrem. Proto kompas funguje ve dne, v noci, ve sklepě i uprostřed oceánu.",
    vysvetleni:
      "Země má vlastní magnetické pole a magnetka kompasu se v něm natáčí. Nepotřebuje k tomu ani slunce, ani nic kovového poblíž.",
  },
  {
    otazka:
      "Kompas položíš na kovový pracovní stůl s ocelovou deskou. Co to s ním udělá?",
    klic: "Může ukazovat špatně, protože ocel magnetické pole kolem sebe pokřiví.",
    chybne: [
      {
        value: "Nic, kompas na okolí nereaguje.",
        why: "Reaguje na všechno magnetické ve svém okolí. Proto se měří dál od železa.",
      },
      {
        value: "Bude ukazovat přesněji, ocel pole zesílí.",
        why: "Zesílí ho jen v okolí desky, a hlavně ho zkřiví. Přesnost tím klesne.",
      },
      {
        value: "Přestane fungovat úplně a magnetka se zastaví.",
        why: "Magnetka se točit nepřestane. Jen se ustálí jinam, než by měla.",
      },
    ],
    h0: "Ocelová deska je ze železa. Vzpomeň si, co se s železem v magnetickém poli děje.",
    h1: "Ocel se v magnetickém poli Země sama dočasně zmagnetuje a vytvoří kolem sebe vlastní pole. Magnetka pak reaguje na obojí naráz a ustálí se ve směru, který není severojižní. Proto se kompas nepoužívá na kapotě auta, u zábradlí ani na pracovním stole z plechu.",
    vysvetleni:
      "Železo a ocel v okolí pokřiví magnetické pole a kompas ukáže špatně. Měří se proto dál od kovových konstrukcí.",
  },
];

const ZEME: Polozka[] = [
  {
    otazka:
      "Severní pól magnetky kompasu míří k zeměpisnému severu. Jaký magnetický pól Země tam tedy musí být?",
    klic: "Jižní — k severnímu pólu magnetky se přitáhne jedině pól opačný.",
    chybne: [
      {
        value: "Severní, proto se tomu místu říká severní pól.",
        why: "Severní pól je zeměpisný název, ne magnetický. Dva severní póly by se odpuzovaly a magnetka by se otočila opačně.",
      },
      {
        value: "Žádný, magnetka míří k severu sama od sebe.",
        why: "Sama od sebe se magnetka neustálí nikam. Musí ji natáčet pole Země.",
      },
      {
        value: "Oba naráz, sever i jih leží na témže místě.",
        why: "Póly Země leží každý na opačné straně planety, ne na jednom místě.",
      },
    ],
    h0: "Použij pravidlo o pólech pozpátku: víš, který konec magnetky tam míří, a hledáš, co ho přitahuje.",
    h1: "Magnetka je malý magnet a její severní pól se přitáhne jedině k pólu jižnímu. Když tedy míří k zeměpisnému severu, musí tam být jižní magnetický pól Země. Zní to obráceně, jenže jména zeměpisných pólů vznikla mnohem dřív, než se vůbec vědělo, že Země magnet je.",
    vysvetleni:
      "U zeměpisného severního pólu je jižní magnetický pól Země a naopak. Jména zeměpisných pólů se s magnetickými neshodují, protože vznikla dřív.",
  },
  {
    otazka:
      "Lámeš magnet na stále menší kousky a sháníš takový, který by měl jen severní pól. Co dostaneš?",
    klic: "Pokaždé zase magnet s oběma póly, ať je úlomek jakkoli malý.",
    chybne: [
      {
        value: "Při dost přesném lomu v půli nakonec kousek s jediným pólem.",
        why: "Přesnost s tím nesouvisí. Ani nejpřesnější řez samostatný pól nevyrobí.",
      },
      {
        value: "U velmi silného magnetu úlomek se samotným severním pólem.",
        why: "Síla magnetu na tom nic nemění. Platí to pro každý magnet stejně.",
      },
      {
        value: "U kousku menšího než zrnko písku úlomek, který už žádný pól nemá.",
        why: "Ani tam ne. Oba póly má i ta nejmenší oblast uvnitř železa.",
      },
    ],
    h0: "Porovnej to s nábojem: kladné a záporné těleso existují každé zvlášť. Platí totéž u pólů?",
    h1: "Tady se analogie s elektrickým nábojem láme, a to je na ní to nejcennější. Kladné a záporné těleso držíš v ruce každé zvlášť, ale samostatný magnetický pól nikdo nikdy nenašel. Každý kousek magnetu, ať je jakkoli malý, má vždycky oba — a i to nejmenší uspořádání uvnitř železa se chová jako celý malý magnet.",
    vysvetleni:
      "Samostatný magnetický pól neexistuje. V tom se magnetismus liší od elektrického náboje, kde kladné a záporné těleso existují odděleně.",
  },
  {
    otazka:
      "Nenamagnetovaný hřebík se k magnetu přitáhne vždycky. Dva magnety se ale podle otočení jednou přitáhnou a podruhé odpudí. Čím to je?",
    klic: "Hřebík žádné vlastní póly nemá, takže mu je magnet vytvoří vždy tak, aby se přitáhl.",
    chybne: [
      {
        value: "Hřebík je slabší, a tak na odpuzení nemá sílu.",
        why: "Se silou to nesouvisí. I obrovský kus železa se magnetu jen přitáhne.",
      },
      {
        value: "Hřebík má oba póly naráz, a ty se vyruší.",
        why: "Kdyby se vyrušily, nestalo by se vůbec nic. Hřebík se přitom přitáhne pokaždé.",
      },
      {
        value: "Hřebík se odpudí také, jen je to málo vidět.",
        why: "Neodpudí se nikdy. Odpuzování může nastat jen mezi dvěma magnety.",
      },
    ],
    h0: "U dvou magnetů jsou póly dané předem. U hřebíku ne — ptej se, kdo je tam určí.",
    h1: "Magnet v přiloženém železe teprve póly vytvoří a udělá to vždycky tak, že blíž k němu je pól opačný. Přitažení proto převáží pokaždé. U dvou magnetů jsou naproti tomu póly dané předem, takže otočením se dá dosáhnout obojího. Je to přesně stejné jako u nábojů: dvě nabitá tělesa se podle znamének přitáhnou nebo odpudí, ale nenabitý papírek se přitáhne vždycky.",
    vysvetleni:
      "Nenamagnetované železo se k magnetu přitahuje vždy, protože si póly teprve vytváří. Dva magnety mají póly dané, takže rozhoduje jejich otočení.",
  },
  {
    otazka:
      "Zeměpisný a magnetický pól Země neleží na stejném místě. Co z toho plyne pro kompas?",
    klic: "Ukazuje jen přibližně k severu, odchylku je potřeba na mapě dopočítat.",
    chybne: [
      {
        value: "Kompas je proto k orientaci nepoužitelný.",
        why: "Použitelný je a lidé podle něj plavali kolem světa. Odchylka je malá a dá se na ni počítat.",
      },
      {
        value: "Odchylka je tak malá, že žádný rozdíl nedělá.",
        why: "Na krátkou procházku ne, na dlouhou plavbu nebo let ano. Proto se do map zakresluje.",
      },
      {
        value: "Kompas ukazuje k zeměpisnému severu a magnetický je jinde.",
        why: "Je to naopak — magnetka reaguje na magnetické pole, takže míří k magnetickému pólu.",
      },
    ],
    h0: "Magnetka reaguje na magnetické pole. Ptej se, ke kterému z těch dvou pólů tedy míří.",
    h1: "Kompas se řídí magnetickým polem, takže míří k magnetickému pólu — a ten je od zeměpisného vzdálený stovky kilometrů a navíc se rok od roku posouvá. Rozdíl mezi oběma směry se jmenuje magnetická deklinace, zakresluje se do map a při přesné navigaci se přičítá nebo odečítá.",
    vysvetleni:
      "Kompas ukazuje k magnetickému pólu, ne k zeměpisnému. Rozdíl mezi nimi se do map zakresluje, aby se dal při navigaci započítat.",
  },
  {
    otazka:
      "Jak z obyčejného ocelového hřebíku uděláš magnet, který magnetismus udrží i po odložení?",
    klic: "Přejíždět po něm jedním pólem magnetu pořád stejným směrem.",
    chybne: [
      {
        value: "Rychle s ním o magnet třít sem a tam.",
        why: "Pohyb sem a tam srovná oblasti uvnitř střídavě na obě strany a výsledek se vyruší.",
      },
      {
        value: "Přiložit ho k magnetu a nechat ho tam pár vteřin ležet.",
        why: "Chvíli bude magnetický, jenže po oddálení to skoro celé zmizí. To je dočasný magnet.",
      },
      {
        value: "Zahřát ho a pak přiložit k magnetu.",
        why: "Teplo uspořádání uvnitř rozhází, takže tím magnet spíš zničíš, než vyrobíš.",
      },
    ],
    h0: "Uvnitř železa jsou drobné oblasti, které je potřeba srovnat do jednoho směru. Zamysli se, jak se to dá udělat.",
    h1: "Magnetismus vzniká tím, že se drobné oblasti uvnitř železa srovnají do jednoho směru. Tahy jedním pólem a pořád stejným směrem je postupně srovnají a hřebík zůstane magnetický i po odložení. Tahy sem a tam by je naopak přehazovaly tam a zpátky a výsledek by byl skoro nulový.",
    vysvetleni:
      "Trvalý magnet vznikne opakovanými tahy jedním pólem v jednom směru. Pouhé přiložení dá jen dočasný magnet, který po oddálení magnetismus ztratí.",
  },
  {
    otazka:
      "Vedle kompasu položíš silný magnet. Kam se magnetka ustálí?",
    klic: "K magnetu, protože jeho pole je poblíž mnohem silnější než pole Země.",
    chybne: [
      {
        value: "Pořád k severu, pole Země je silnější.",
        why: "Pole Země je velmi slabé. Magnet položený vedle ho v tom místě snadno přebije.",
      },
      {
        value: "Přesně mezi sever a magnet, oba působí stejně.",
        why: "Stejně nepůsobí. Magnet zblízka vyhraje o mnoho řádů.",
      },
      {
        value: "Bude se točit dokola a neustálí se.",
        why: "Ustálí se docela rychle, jen jinam, než bys chtěl.",
      },
    ],
    h0: "Na magnetku působí obě pole naráz. Ptej se, které z nich je v tom místě silnější.",
    h1: "Magnetické pole Země je překvapivě slabé — o mnoho slabší než pole běžného magnetu z lednice. Na velkou vzdálenost je jediné, co na magnetku působí, jenže jakmile je poblíž skutečný magnet, převáží jeho pole a magnetka se natočí k němu. Právě proto se do blízkosti kompasu nedávají reproduktory, nářadí ani mobil.",
    vysvetleni:
      "Magnetka reaguje na výsledek všech polí naráz. Blízký magnet je zdaleka nejsilnější, takže kompas ukáže na něj, ne k severu.",
  },
  {
    otazka:
      "Magnetické pole Země zasahuje daleko do okolního prostoru. K čemu je to pro život na Zemi dobré?",
    klic: "Odklání nabité částice přilétající od Slunce.",
    chybne: [
      {
        value: "Drží atmosféru u povrchu, aby neulétla.",
        why: "Atmosféru drží gravitace, ne magnetické pole.",
      },
      {
        value: "Udržuje Zemi na oběžné dráze kolem Slunce.",
        why: "Po dráze kolem Slunce Zemi vede gravitace. S magnetismem to nesouvisí.",
      },
      {
        value: "Ohřívá povrch planety.",
        why: "Povrch ohřívá sluneční záření. Magnetické pole žádné teplo nedodává.",
      },
    ],
    h0: "Magnetické pole nepůsobí na teplo, na vzduch ani na pohyb planet. Zbývá tedy to, na co působit umí.",
    h1: "Ze Slunce k nám neustále proudí nabité částice a magnetické pole Země většinu z nich odkloní stranou. Část se jich svede k pólům, kde vznikne polární záře — takže to nejkrásnější, co pole umí, je zároveň důkaz, že funguje. Bez něj by záření povrch zasahovalo mnohem silněji.",
    vysvetleni:
      "Magnetické pole Země odklání nabité částice ze Slunce a chrání tím povrch. Polární záře vzniká tam, kde část těch částic pole svede k pólům.",
  },
  {
    otazka:
      "Magnet zblízka pevně drží železný hřebík, ale hliníkovou lžíci nezvedne ani zblízka. Co z toho plyne?",
    klic: "Nerozhoduje vzdálenost, ale to, z čeho je předmět.",
    chybne: [
      {
        value: "Hliníková lžíce je těžší, proto ji nezvedne.",
        why: "Nezvedne ani hliníkový drátek lehčí než hřebík. Hmotnost do toho nevstupuje.",
      },
      {
        value: "Na hliník je potřeba magnet přiblížit ještě víc.",
        why: "Sebemenší vzdálenost nepomůže. Magnet se může hliníku dotýkat a nestane se nic.",
      },
      {
        value: "Hliník sílu magnetu odráží pryč.",
        why: "Nic se neodráží. Magnet na hliník prostě vůbec nepůsobí.",
      },
    ],
    h0: "Vzdálenost je v obou případech stejná. Zbývá jediná věc, ve které se ty dva předměty liší.",
    h1: "Magnetická síla se sice se vzdáleností mění, jenže tady je vzdálenost u obou předmětů táž. Liší se jen materiál — železo magnet přitahuje a hliník ne. Materiál rozhoduje o tom, jestli síla vznikne vůbec; vzdálenost až o tom, jak bude velká.",
    vysvetleni:
      "Materiál rozhoduje, jestli magnetická síla vznikne. Vzdálenost až o tom, jak silná bude. U nemagnetického kovu nepomůže žádné přiblížení.",
  },
  {
    otazka:
      "Někteří ptáci se při tahu na jih orientují i podle magnetického pole Země. V čem je to pro ně výhodné oproti orientaci podle slunce?",
    klic: "Funguje i v noci a pod mraky.",
    chybne: [
      {
        value: "Je to rychlejší způsob letu.",
        why: "Rychlost letu s orientací nesouvisí. Jde o to, kdy je směr vůbec poznat.",
      },
      {
        value: "Magnetické pole je v každém místě Země stejné.",
        why: "Stejné není — právě proto z něj jde poznat, kde ptáci jsou.",
      },
      {
        value: "Slunce je na jižní polokouli jinde, magnetické pole ne.",
        why: "Póly má pole na obou polokoulích a mění se stejně jako všechno ostatní.",
      },
    ],
    h0: "Porovnej obě možnosti podle toho, kdy jsou k dispozici.",
    h1: "Slunce se dá použít jen za dne a za jasného počasí, kdežto magnetické pole Země je všude a pořád — ve dne, v noci i pod souvislou oblačností. Ptáci obojí kombinují, ale právě magnetický smysl jim dovoluje letět i tehdy, kdy se podle oblohy orientovat nedá.",
    vysvetleni:
      "Magnetické pole Země je k dispozici nepřetržitě, na rozdíl od slunce. Proto je pro orientaci na dlouhých přeletech spolehlivější.",
  },
  {
    otazka:
      "Magnet rozdělíš na dva kusy a ty pak přiložíš k sobě přesně tak, jak byly. Co se stane?",
    klic: "Přitáhnou se a budou držet, protože proti sobě míří opačné póly.",
    chybne: [
      {
        value: "Odpudí se, na lomu vznikly souhlasné póly.",
        why: "Na lomu vznikl na jednom kusu severní a na druhém jižní pól. Proto se přitáhnou.",
      },
      {
        value: "Nestane se nic, lom magnetismus v tom místě zrušil.",
        why: "Nezrušil. Každý úlomek zůstal magnetem s oběma póly.",
      },
      {
        value: "Slepí se natrvalo a magnet bude jako nový.",
        why: "Držet budou, ale slepené nejsou. Dají se zase snadno oddělit.",
      },
    ],
    h0: "Zamysli se, jaké póly musely na obou stranách lomu vzniknout.",
    h1: "Při rozlomení se na obou nových koncích objeví póly, a to tak, aby každý úlomek měl svůj severní i jižní. Konce, které byly předtím u sebe, jsou proto opačné a po přiložení se k sobě zase přitáhnou. Držet budou jako každé dva magnety obrácené k sobě nesouhlasnými póly, ale spojené natrvalo nebudou.",
    vysvetleni:
      "Na lomu vzniknou opačné póly, takže se oba úlomky k sobě zase přitáhnou. Původní magnet tím ale znovu nevznikne.",
  },
  {
    otazka:
      "Magnetka se v poli Země natáčí. Proč se přitom neustálí svisle dolů, k jádru planety?",
    klic: "Je uložená tak, aby se mohla otáčet jen vodorovně.",
    chybne: [
      {
        value: "Magnetické pole Země míří přesně vodorovně.",
        why: "Vodorovně míří jen u rovníku. Blíž k pólům směřuje dost strmě dolů.",
      },
      {
        value: "Jádro Země magnetické není.",
        why: "Právě v jádře pole vzniká. Magnetka se nestáčí dolů z jiného důvodu.",
      },
      {
        value: "Magnetka je pro to příliš lehká.",
        why: "Hmotnost o směru nerozhoduje. Rozhoduje, kolem čeho se magnetka může točit.",
      },
    ],
    h0: "Podívej se, jak je magnetka v kompasu uchycená a kterými směry se vlastně může pohnout.",
    h1: "Pole Země nemíří vodorovně — čím blíž k pólům, tím strměji klesá k zemi. Magnetka v běžném kompasu je ale nasazená na svislém hrotu, takže se může otáčet jedině dokola, ne nahoru a dolů. Ukáže proto jen vodorovný směr pole. Existuje i přístroj, který měří ten sklon, a jmenuje se inklinometr.",
    vysvetleni:
      "Magnetka běžného kompasu se otáčí jen vodorovně, takže ukazuje vodorovnou část pole. Skutečné pole Země přitom blízko pólů míří strmě dolů.",
  },
  {
    otazka:
      "Magnet položíš na stůl a vedle něj o kus dál druhý. Přitahují se, i když se nedotýkají a mezi nimi je jen vzduch. Čím se ta síla přenáší?",
    klic: "Magnetickým polem, které je kolem každého magnetu.",
    chybne: [
      {
        value: "Vzduchem mezi nimi.",
        why: "Ve vzduchoprázdnu by se přitáhly úplně stejně. Vzduch s tím nemá co dělat.",
      },
      {
        value: "Otřesy stolu, po kterém kloužou.",
        why: "Přitahují se i zavěšené na vlákně, kde žádný stůl není.",
      },
      {
        value: "Přímým dotykem, jen je příliš malý, než abys ho viděl.",
        why: "Žádný dotyk tam není. Mezera je vidět a síla přesto působí.",
      },
    ],
    h0: "Je to tentýž problém jako u nabitého hřebenu a papírku — něco musí působení přenést.",
    h1: "Kolem každého magnetu je prostor, ve kterém by na jiný magnet nebo na železo působila síla, a tomu se říká magnetické pole. Existuje i tam, kde není vůbec žádný vzduch, takže vzduchoprázdno mu nevadí. Vidět není a poznáš ho jedině podle toho, co udělá s něčím, co do něj vložíš.",
    vysvetleni:
      "Magnetická síla se přenáší magnetickým polem, ne vzduchem ani dotykem. Je to táž myšlenka jako elektrické pole kolem nabitého tělesa.",
  },
];

const KROKY_L2 = [
  "Rozhodni, jestli jsou obě věci magnety, nebo je jedna jen ze železa.",
  "Dva magnety: souhlasné póly se odpuzují, nesouhlasné přitahují.",
  "Magnet a železo: vždycky přitažení. Pole je nejsilnější u pólů.",
];

const KROKY_L3 = [
  "Magnetka je malý magnet a řídí se pravidlem o pólech.",
  "U zeměpisného severu je proto jižní magnetický pól Země.",
  "Samostatný pól neexistuje — v tom se magnet od náboje liší.",
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
        ? zBanky(pick(POLE), KROKY_L2)
        : zBanky(pick(ZEME), KROKY_L3),
  );
}

export const MAGNETY: TopicMetadata[] = [
  {
    id: "g6-fyz-magnety-6",
    rvpNodeId:
      "g6-fyzika-elektricke-vlastnosti-latek-elektricky-naboj-a-magnetismus-magnety-magneticke-pole-magneticke-poly-zeme",
    displayName: "Magnety",
    title: "Magnety – magnetické pole, magnetické póly Země",
    studentTitle: "Magnety",
    subject: "fyzika",
    category: "Elektrické vlastnosti látek",
    topic: "Elektrický náboj a magnetismus",
    briefDescription: "Zjistíš, co magnet přitáhne a proč kompas ukazuje k severu.",
    keywords: [
      "magnet", "magnetické pole", "severní pól", "jižní pól", "magnetka",
      "kompas", "magnetické póly Země", "železo nikl kobalt", "dočasný magnet",
    ],
    goals: [
      "Rozhodnout podle materiálu, jestli magnet předmět přitáhne.",
      "Použít pravidlo o pólech a vysvětlit, proč se hřebík vždycky jen přitahuje.",
      "Vysvětlit, proč je u zeměpisného severu jižní magnetický pól Země.",
    ],
    boundaries: [
      "Bez elektromagnetu a bez souvislosti elektrického proudu s magnetickým polem.",
      "Bez siločar jako pojmu — pole se popisuje tvarem, do kterého se seřadí piliny.",
      "Bez měření velikosti magnetického pole a bez jednotek.",
      "Nerezové příbory ani mince v bance nejsou: chovají se jinak, než dítě čeká.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-fyz-elektricky-naboj-6"],
    generator: gen,
    helpTemplate: {
      hint: "Magnet přitahuje jen železo, nikl a kobalt a slitiny s nimi — hlavně ocel.",
      steps: [
        "Souhlasné póly se odpuzují, nesouhlasné přitahují.",
        "Nenamagnetované železo se přitahuje vždycky, nikdy se neodpuzuje.",
        "U zeměpisného severu je jižní magnetický pól Země.",
      ],
      commonMistake: "Myslet si, že magnet přitáhne každý kov a že u severního pólu Země je severní magnetický pól.",
      example: "Magnet drží ocelovou sponku přes list papíru, ale hliníkovou fólii nezvedne ani přímým dotykem.",
    },
  },
];
