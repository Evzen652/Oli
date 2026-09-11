import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { urceni, type Kategorie, type Polozka } from "../_urceni";
const zac = (s: string) => s.replace(/[„“]/g, "").split(" ").slice(0, 5).join(" ") + "…";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// zpětné vazby k chybným možnostem. Teď: L1 vybrat věrné převyprávění krátkého
// textu · L2 posoudit, co je na převyprávění špatně (přidává, mění, vynechává,
// nebo je věrné) · L3 vybrat shrnutí, které vystihne celý text, ne jen podrobnost.

// ── L1: věrné převyprávění ───────────────────────────────────────────────────
interface Vernost { text: string; verne: string; zmena: string; pridano: string; opak: string; naCo: string }
const VERNOST: Vernost[] = [
  { text: "Kočka Micka má tři koťata. Všechna jsou černá.", verne: "Micka má tři koťata, samá černá.", zmena: "Micka má tři bílá koťata.", pridano: "Micka má tři černá koťata a jedno z nich je nemocné.", opak: "Micka nemá žádná koťata.", naCo: "kolik mláďat je a jakou mají barvu" },
  { text: "Petr zaspal, a proto přišel do školy pozdě.", verne: "Petr přišel pozdě, protože zaspal.", zmena: "Petr přišel pozdě, protože mu ujel autobus.", pridano: "Petr zaspal, přišel pozdě a paní učitelka se zlobila.", opak: "Petr přišel do školy brzy, protože vstal včas.", naCo: "jaká byla příčina" },
  { text: "V zimě ježek spí v hromadě listí a nic nejí.", verne: "Ježek přes zimu prospí v listí a nepotřebuje potravu.", zmena: "V zimě ježek spí v noře pod zemí a nic nejí.", pridano: "V zimě ježek spí v listí, nic nejí a na jaře má mláďata.", opak: "V zimě ježek neusíná a pořád hledá jídlo.", naCo: "kde zvíře přečká chladné měsíce a jestli se krmí" },
  { text: "Babička upekla koláč s jablky a dala ho sousedům.", verne: "Babička sousedům darovala jablečný koláč, který upekla.", zmena: "Babička upekla koláč se švestkami a dala ho sousedům.", pridano: "Babička upekla koláč s jablky, dala ho sousedům a oni jí přinesli květiny.", opak: "Babička koupila koláč s jablky a snědla ho sama.", naCo: "s čím pečivo bylo a kdo ho dostal" },
  { text: "Vlak do Brna odjíždí v 8 hodin z třetí koleje.", verne: "Ze třetí koleje vyjede v 8 hodin vlak do Brna.", zmena: "Vlak do Brna odjíždí v 9 hodin z třetí koleje.", pridano: "Vlak do Brna odjíždí v 8 hodin z třetí koleje a má jídelní vůz.", opak: "Vlak do Brna dnes nejede.", naCo: "v kolik a odkud souprava vyjíždí" },
  { text: "Anička se bála psa, ale když ho poznala, začala si s ním hrát.", verne: "Anička měla ze psa strach, dokud ho nepoznala; pak si spolu hráli.", zmena: "Anička se bála psa, a proto utekla domů.", pridano: "Anička se bála psa, pak si s ním hrála a nakonec si ho vzala domů.", opak: "Anička se psa nikdy nebála.", naCo: "jak se změnil dívčin vztah ke zvířeti" },
  { text: "Na výlet si vezmi pláštěnku, protože má pršet.", verne: "Kvůli předpovědi deště si na výlet přibal pláštěnku.", zmena: "Na výlet si vezmi plavky, protože má být horko.", pridano: "Na výlet si vezmi pláštěnku, deštník a teplý svetr, protože má pršet.", opak: "Pláštěnku si na výlet neber, bude hezky.", naCo: "co si vzít s sebou a z jakého důvodu" },
  { text: "Lucka vyhrála závod, protože hodně trénovala.", verne: "Díky poctivému tréninku Lucka zvítězila v závodě.", zmena: "Lucka vyhrála závod, protože měla štěstí.", pridano: "Lucka vyhrála závod a dostala zlatý pohár a kolo.", opak: "Lucka závod prohrála, i když trénovala.", naCo: "jak soutěž dopadla a čemu za to vděčí" },
  { text: "Knihovna je v pondělí zavřená, v ostatní dny je otevřená od 9 do 17 hodin.", verne: "Kromě pondělí knihovna otvírá v 9 a zavírá v 17 hodin.", zmena: "Knihovna je v neděli zavřená, jinak je otevřená od 9 do 17 hodin.", pridano: "Knihovna je v pondělí zavřená, jinak je otevřená od 9 do 17 hodin a půjčuje i hry.", opak: "Knihovna je otevřená jen v pondělí.", naCo: "který den se nechodí a jaká je otevírací doba" },
  { text: "Pavel zalil kytky, a proto nezvadly.", verne: "Díky Pavlovu zalévání zůstaly květiny svěží.", zmena: "Kytky nezvadly, protože pršelo.", pridano: "Pavel zalil kytky, nezvadly a jedna z nich vykvetla.", opak: "Pavel kytky nezalil, a tak zvadly.", naCo: "proč rostliny vydržely" },
  { text: "Sova loví v noci, ve dne spí v dutině stromu.", verne: "Přes den sova odpočívá ve stromové dutině a na lov vyráží v noci.", zmena: "Sova loví ve dne a v noci spí v dutině stromu.", pridano: "Sova loví v noci myši i zajíce a ve dne spí v dutině stromu.", opak: "Sova v noci spí a vůbec neloví.", naCo: "kdy pták loví a kde tráví den" },
  { text: "Tomáš si půjčil kolo od bratra a slíbil, že ho vrátí do večera.", verne: "Tomáš dostal bratrovo kolo s tím, že ho večer vrátí.", zmena: "Tomáš si koupil kolo a slíbil, že ho bude šetřit.", pridano: "Tomáš si půjčil kolo od bratra, slíbil, že ho vrátí do večera, a pak spadl do louže.", opak: "Bratr Tomášovi kolo odmítl půjčit.", naCo: "od koho věc má a co přislíbil" },
  { text: "Ve škole bude zítra divadlo, a proto odpadne matematika.", verne: "Zítra se místo matematiky půjde na divadelní představení.", zmena: "Zítra bude ve škole divadlo, a proto odpadne tělocvik.", pridano: "Zítra bude ve škole divadlo o drakovi, a proto odpadne matematika i angličtina.", opak: "Zítra se bude matematika učit dvakrát.", naCo: "co se zítra stane a která hodina se neuskuteční" },
];

function vernostUloha(v: Vernost): PracticeTask {
  return choice(`Text: „${v.text}“ Které převyprávění je věrné?`, v.verne, [
    { value: v.zmena, why: "Mění údaj z textu." },
    { value: v.pridano, why: "Přidává něco, co v textu není." },
    { value: v.opak, why: "Říká opak toho, co je v textu." },
  ], {
    hints: [
      `Co přesně text říká o tom, ${v.naCo}? Zkontroluj to v každé možnosti.`,
      "Věrné převyprávění říká totéž jinými slovy: nic nepřidá, nic důležitého nevynechá a nic nezmění.",
    ],
    explanation: `„${v.verne}“ říká totéž co text, jen jinými slovy.`,
  });
}

// ── L2: co je na převyprávění špatně ─────────────────────────────────────────
const CHYBY: Kategorie[] = [
  { nazev: "přidává informaci navíc", znak: "převyprávění obsahuje údaj, který v původní ukázce není." },
  { nazev: "mění údaj", znak: "převyprávění uvádí jiné číslo, jméno, místo nebo čas než ukázka." },
  { nazev: "vynechává to podstatné", znak: "převyprávění nezmíní to nejdůležitější z ukázky." },
  { nazev: "je věrné", znak: "převyprávění říká totéž co ukázka, jen jinými slovy." },
];
const PR = "přidává informaci navíc", ME = "mění údaj", VY = "vynechává to podstatné", VE = "je věrné";
const R = (text: string, prevypraveni: string, kategorie: string, klic: string, proc: string): Polozka =>
  ({ uroven: 2, slovo: prevypraveni, veta: `Text: „${text}“ Převyprávění: „${prevypraveni}“`, kategorie, klic, proc });

const POSOUZENI: Polozka[] = [
  R("Ve středu jela 5. A na výlet do Kutné Hory. Prohlédli si chrám svaté Barbory a odpoledne se vrátili.", "Ve středu byla 5. A v Kutné Hoře, prohlédla si chrám svaté Barbory a odpoledne byla zpátky.", VE, "den, třída, město i chrám sedí", "Všechny údaje souhlasí, jen jinými slovy — věrné."),
  R("Martin dostal k narozeninám kolo. Hned odpoledne s ním jel k babičce.", "Martin dostal k Vánocům kolo a hned s ním jel k babičce.", ME, "dárek dostal při jiné příležitosti", "Narozeniny se změnily na Vánoce — mění údaj."),
  R("Náš pes Bobík umí podat pac a přinést míček.", "Bobík umí podat pac, přinést míček a skákat přes švihadlo.", PR, "skákání přes švihadlo v ukázce nebylo", "Švihadlo si převyprávění přidalo."),
  R("Hasiči v noci zachránili z hořícího domu dvě děti. Nikdo nebyl zraněn.", "V noci hořel dům a nikdo nebyl zraněn.", VY, "zmizela záchrana dvou dětí, o které ukázka hlavně je", "Chybí to nejdůležitější — záchrana dětí."),
  R("Eliška se učila hrát na klavír tři roky. Letos poprvé vystoupila na koncertě.", "Eliška se klavír učí tři roky a letos měla svůj první koncert.", VE, "délka učení i první koncert souhlasí", "Údaje sedí — věrné."),
  R("Obchod na rohu bude od pondělí otevřený až do 20 hodin.", "Obchod na rohu bude od pondělí otevřený do 18 hodin.", ME, "hodina zavírání je jiná", "Dvacet hodin se změnilo na osmnáct — mění údaj."),
  R("Jirka našel v parku peněženku a odnesl ji na policii.", "Jirka našel v parku peněženku, odnesl ji na policii a dostal odměnu tisíc korun.", PR, "o odměně ukázka nic neříká", "Odměnu si převyprávění vymyslelo."),
  R("Vlaštovky odlétají na zimu do Afriky, protože u nás by nenašly hmyz.", "Vlaštovky na zimu odlétají.", VY, "chybí kam a proč", "Chybí cíl cesty i důvod — vynechává to podstatné."),
  R("Karel a Ondra postavili ze sněhu hrad s věží. Večer ho rozbourala sněhová fréza.", "Karel s Ondrou postavili sněhový hrad s věží, ale večer ho zničila fréza.", VE, "kdo, co i jak to dopadlo sedí", "Údaje souhlasí — věrné."),
  R("Za týden začne škola v přírodě v Krkonoších. Pojede celá třída.", "Za týden začne škola v přírodě na Šumavě. Pojede celá třída.", ME, "pohoří je jiné", "Krkonoše se změnily na Šumavu — mění údaj."),
  R("Maminka koupila na trhu jahody a udělala z nich marmeládu.", "Maminka koupila na trhu jahody, udělala marmeládu a rozdala ji sousedům.", PR, "o sousedech ukázka nemluví", "Rozdávání sousedům si převyprávění přidalo."),
  R("Po silné bouřce spadl v ulici strom a zablokoval silnici. Autobusy proto jezdily objížďkou.", "Po bouřce jezdily autobusy jinudy.", VY, "chybí příčina — spadlý strom", "Bez stromu nevíme, proč autobusy jezdily jinudy."),
  R("Ve čtvrtek přijde do třídy spisovatelka a bude číst ze své nové knihy.", "Ve čtvrtek k nám do třídy přijde spisovatelka a přečte nám kus své nové knihy.", VE, "den, host i to, co bude dělat, sedí", "Údaje souhlasí — věrné."),
];

// ── L3: shrnutí celého textu ─────────────────────────────────────────────────
const DETAIL = "Je to pravda, ale jen jedna podrobnost — ne celý text.";
const OBECNE = "Je to příliš obecné; nic neříká o tomto textu.";
const L3: PracticeTask[] = [
  ["Ježci jsou užiteční pomocníci na zahradě. Loví slimáky a hmyz, který škodí rostlinám. Proto je dobré nechat jim na zahradě hromadu listí, kde mohou přezimovat.", "Ježci pomáhají zahradě, a proto jim máme nechat úkryt.", "Ježci loví slimáky.", "Zvířata jsou zajímavá.", "Ježci škodí rostlinám na zahradě.", "Proč text zmiňuje slimáky i hromadu listí — co mají společného?"],
  ["Kuba celý týden trénoval přihrávky. V sobotu v zápase přihrál na dva góly a tým vyhrál. Trenér ho pochválil.", "Kubův trénink se v zápase vyplatil.", "Trenér Kubu pochválil.", "Fotbal je kolektivní hra.", "Kuba v zápase nepřihrál ani jednou.", "Jak souvisí to, co Kuba dělal přes týden, s tím, co se stalo v sobotu?"],
  ["Voda v přírodě neustále koluje. Vypařuje se z moří, vytváří mraky a jako déšť padá zpět na zem. Odtud stéká do řek a znovu do moře.", "V přírodě stále obíhá voda dokola.", "Z mraků padá déšť.", "Příroda je krásná.", "Voda z moře se nikdy nevypařuje.", "Co mají všechny kroky společného — kde celý děj končí a kde začíná?"],
  ["Babička Marie ztratila brýle. Celý den je hledala po celém domě. Večer je našel vnuk — měla je celou dobu na hlavě.", "Babička marně hledala brýle, které měla na hlavě.", "Vnuk našel brýle večer.", "Brýle se často ztrácejí.", "Babička brýle nechala v obchodě.", "Co je na příběhu vtipné a proč hledání trvalo celý den?"],
  ["Na naší škole vznikl nový kroužek robotiky. Děti si v něm postaví a naprogramují malého robota. Kroužek je každé úterý po vyučování.", "Škola otevřela kroužek, kde děti staví a programují roboty.", "Kroužek robotiky bude každé úterý po škole.", "Roboti jsou moderní a baví hodně dětí.", "Kroužek robotiky se od příštího týdne ruší.", "Co je na škole nového a co se tam žáci naučí?"],
  ["Včely opylují květy. Bez nich by mnoho rostlin neneslo plody a lidé by neměli dost ovoce. Proto je chráníme.", "Včely jsou pro úrodu důležité, a proto je chráníme.", "Včely opylují květy.", "Hmyz žije všude na světě, i ve městech.", "Bez včel by bylo ovoce víc.", "Proč text mluví o ovoci, když je hlavně o hmyzu?"],
  ["Adam dlouho nechtěl jíst zeleninu. Pak si ji sám vypěstoval na zahrádce. Od té doby mu mrkev chutná.", "Vlastní úroda naučila Adama jíst zeleninu.", "Adam má na zahrádce záhon s mrkví.", "Zelenina je zdravá a má hodně vitamínů.", "Adam zeleninu dodnes odmítá jíst.", "Co způsobilo, že se Adamův názor změnil?"],
  ["Město postavilo nové cyklostezky. Víc lidí teď jezdí do práce na kole a v ulicích je méně aut.", "Díky cyklostezkám lidé víc jezdí na kole a aut ubylo.", "Město postavilo cyklostezky.", "Jízda na kole je zdravá pro každého.", "Po stavbě cyklostezek přibylo aut.", "Co se ve městě změnilo a co tu změnu způsobilo?"],
  ["Ema zapomněla doma úkol. Místo výmluvy řekla paní učitelce pravdu. Paní učitelka ocenila její upřímnost a dovolila jí úkol donést zítra.", "Ema řekla pravdu a vyplatilo se jí to.", "Ema zapomněla úkol doma.", "Úkoly jsou důležité pro učení.", "Paní učitelka Emu za pravdu potrestala.", "Co Ema udělala jinak, než by čekal každý, a jak to dopadlo?"],
  ["Na podzim listnaté stromy shazují listí. Šetří tak vodu, protože v zimě ji ze zmrzlé půdy nedostanou.", "Stromy shazují listí, aby v zimě šetřily vodou.", "Půda v zimě zamrzá.", "Stromy jsou různé.", "Stromy shazují listí, protože mají vody moc.", "Jaký důvod text uvádí — čeho by se rostlinám v mrazu nedostávalo?"],
  ["Petr si půjčil od Honzy knihu a omylem ji polil čajem. Druhý den mu koupil novou a omluvil se.", "Petr knihu poškodil, a tak ji Honzovi nahradil a omluvil se.", "Petr pil čaj.", "Knihy se mají půjčovat.", "Petr knihu vrátil politou a mlčel.", "Co se s půjčenou věcí stalo a jak to viník napravil?"],
  ["V lese se nesmí rozdělávat oheň. Stačí jiskra a v suchém létě může shořet celý les. Proto se ohně rozdělávají jen na vyhrazených místech.", "Oheň se smí rozdělat jen na vyhrazeném místě, jinak hrozí požár lesa.", "V létě bývá sucho.", "Oheň je horký.", "V lese je oheň bezpečný, když je léto.", "Proč text varuje, a kde je tedy táborák dovolený?"],
  ["Klára se bála mluvit před třídou. Doma si referát několikrát nahlas přečetla před zrcadlem. Ve škole pak mluvila klidně.", "Klára strach překonala tím, že se dobře připravila.", "Klára má doma zrcadlo.", "Mluvit před lidmi je těžké.", "Klára ve škole nakonec nepromluvila.", "Co Kláře pomohlo a jak dopadl její referát?"],
].map(([text, klic, detail, obecne, chybne, h0]) =>
  choice(`Text: „${text}“ Které shrnutí nejlépe vystihne celý text?`, klic, [
    { value: detail, why: DETAIL },
    { value: obecne, why: OBECNE },
    { value: chybne, why: "Neodpovídá textu — ten říká něco jiného." },
  ], {
    hints: [h0, "Dobré shrnutí obsahuje hlavní myšlenku celého textu, ne jen jednu podrobnost, a nic nemění."],
    explanation: `„${klic}“ vystihuje, o čem je celý text.`,
  }),
);

function gen(level: number): PracticeTask[] {
  if (level >= 3) return shuffle(L3);
  if (level === 2) {
    return urceni(POSOUZENI, CHYBY, 2, (p) => ({
      question: `${p.veta} Jaké je převyprávění?`,
      hints: [
        `Projdi převyprávění „${zac(p.slovo)}“ kousek po kousku a každou informaci najdi i v původní ukázce. Sedí všechno?`,
        `Pomůže tohle: ${p.klic}. Porovnej jména, čísla, místa a důvody v obou verzích a hledej i to, co v převyprávění chybí nebo přebývá.`,
      ],
    }), ["Porovnej jména, čísla, místa a důvody v obou verzích.", "Hledej i to, co v převyprávění chybí nebo přebývá."]);
  }
  return shuffle(VERNOST.map(vernostUloha));
}

export const REPRODUKCEPRIMERENESLOZITEHOSDELENI: TopicMetadata[] = [
  {
    id: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni",
    rvpNodeId: "g5-cjl-komunikacni-a-slohova-vychova-cteni-a-naslouchani-reprodukce-primerene-sloziteho-sdeleni",
    title: "Reprodukce přiměřeně složitého sdělení",
    studentTitle: "Převyprávění",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení a naslouchání",
    briefDescription: "Naučíš se převyprávět text vlastními slovy.",
    keywords: ["reprodukce", "převyprávění", "parafráze", "shrnutí", "porozumění"],
    goals: [
      "Reprodukovat obsah textu vlastními slovy",
      "Rozlišit věrnou a chybnou reprodukci",
      "Zachovat klíčové informace při převyprávění",
    ],
    boundaries: [
      "Bez rozsáhlé literární analýzy",
      "Neprobíráme kritickou analýzu textu podrobně",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Reprodukce = vlastními slovy, ale smysl stejný. 1. Přečti text. 2. Najdi klíčové informace. 3. Formuluj je jinak.",
      steps: [
        "Přečti text a identifikuj klíčové informace.",
        "Odpověz na: kdo, co, kde, kdy, proč, jak?",
        "Napiš/řekni obsah vlastními slovy.",
        "Zkontroluj: jsou v reprodukci všechna klíčová fakta?",
      ],
      commonMistake: "Žáci přidávají informace, které v originálu nejsou, nebo vynechávají klíčová fakta.",
      example: "Originál: 'Sloni jsou největší zvířata na souši.' Reprodukce: 'Sloni jsou suchozemskými rekordmany ve velikosti.'",
    },
  },
];
