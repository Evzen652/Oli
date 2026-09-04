import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Otazka {
  q: string;
  a: string;
  opts: string[];
  e: string;
}

interface Text {
  text: string;
  otazky: Otazka[];
}

/**
 * Systémové dluhy Balík 1B (2026-07-10): rozšíření z 3 na 8 textů (CONTENT_AUTHORING.md
 * 5.2 — čtení s porozuměním rotuje 6-8 textů). Disjunktní pooly podle skutečné kognitivní
 * náročnosti otázky, ne podle textu samotného:
 *
 *   L1 — přímé vyhledání faktu v textu (kdo/kde/co), krátké jednoduché texty.
 *   L2 — spojení dvou informací / příčina-důsledek přes spojky (proč/jak/kdy).
 *   L3 — hlavní myšlenka, odvozený závěr, řetězec příčina→důsledek — informace
 *        není doslova v jedné větě, dítě ji musí poskládat z celého textu.
 */

const TEXTY_L1: Text[] = [
  {
    text: "Máša má psa Boba. Bob je velký hnědý pes. Každý den ho Máša venčí v parku. Bob rád honí míč a plave v rybníku. Večer spí vedle Máši na koberci.",
    otazky: [
      { q: "Jak se jmenuje Mášin pes?", a: "Bob", opts: ["Bob", "Max", "Brok", "Rex"], e: "V textu je napsáno 'Máša má psa Boba' — jméno psa je tedy Bob. Max, Brok ani Rex v textu nejsou zmíněni." },
      { q: "Kde Máša venčí psa?", a: "V parku", opts: ["V parku", "V lese", "Na zahradě", "U řeky"], e: "Text říká 'Každý den ho Máša venčí v parku' — odpověď je přímo v textu. Les, zahrada ani řeka v textu nejsou." },
      { q: "Co Bob rád dělá?", a: "Honí míč a plave", opts: ["Honí míč a plave", "Jen spí", "Hlídá dům", "Hraje si s kočkou"], e: "V textu stojí 'Bob rád honí míč a plave v rybníku' — obě činnosti jsou správně. Spí sice také, ale to dělá každý pes, text zdůrazňuje honičku a plavání." },
      { q: "Kde Bob večer spí?", a: "Vedle Máši na koberci", opts: ["Vedle Máši na koberci", "V boudě na zahradě", "V kuchyni pod stolem", "V posteli s Mášou"], e: "Text říká 'Večer spí vedle Máši na koberci' — to je přesná odpověď z textu. Bouda, kuchyň ani postel v textu nejsou zmíněny." },
    ],
  },
  {
    text: "V zimě přišla do zahrady liška. Byla červená s bílým ocasem. Hledala jídlo, protože měla hlad. Zahradník ji uviděl a dal jí kousek chleba. Liška vzala chléb a utekla do lesa.",
    otazky: [
      { q: "Co hledala liška v zahradě?", a: "Jídlo, protože měla hlad", opts: ["Nového kamaráda na hraní", "Jídlo, protože měla hlad", "Noru, kde by přespala", "Vodu k napití"], e: "Text přímo říká 'Hledala jídlo, protože měla hlad' — důvod i odpověď jsou jasně napsané. Noru, kamaráda ani vodu liška nehledala." },
      { q: "Kdo dal lišce chleba?", a: "Zahradník", opts: ["Zahradník", "Dítě", "Farmář", "Pes"], e: "V textu je napsáno 'Zahradník ji uviděl a dal jí kousek chleba' — chléb dala lišce zahradník, ne dítě ani farmář." },
      { q: "Jakou barvu měla liška?", a: "Červenou s bílým ocasem", opts: ["Šedou jako myška", "Červenou s bílým ocasem", "Hnědou s černými skvrnami", "Černobílou jako straka"], e: "Text popisuje lišku jako 'červenou s bílým ocasem' — to jsou dvě barvy najednou. Hnědá, šedá ani černobílá v textu nejsou." },
      { q: "Kam liška s chlebem utekla?", a: "Do lesa", opts: ["Do lesa", "Do nory pod zahradou", "Na pole", "K sousedům"], e: "Text končí větou 'Liška vzala chléb a utekla do lesa' — přesně tam liška odešla. Nora, pole ani sousedé v textu nejsou." },
    ],
  },
  {
    text: "Petr a Jana jdou do školy každý den spolu. Škola je daleko, proto jezdí autobusem. V autobuse se Petr vždy učí slovíčka a Jana čte knížku. Na zastávce se rozloučí a každý jde do své třídy.",
    otazky: [
      { q: "Jak Petr a Jana jezdí do školy?", a: "Autobusem", opts: ["Autobusem", "Pěšky", "Autem", "Na kole"], e: "Text říká 'proto jezdí autobusem' — slovo 'proto' ukazuje, že autobusem jezdí kvůli tomu, že škola je daleko. Auto, kolo ani chůze v textu nejsou zmíněny." },
      { q: "Co dělá Petr v autobuse?", a: "Učí se slovíčka", opts: ["Učí se slovíčka", "Čte knížku", "Spí", "Poslouchá hudbu"], e: "V textu stojí 'Petr vždy učí slovíčka' — Jana čte knížku, ale Petr se učí slovíčka. Je důležité si všimnout, kdo dělá co." },
      { q: "Proč jezdí autobusem?", a: "Protože škola je daleko", opts: ["Protože škola je daleko", "Protože prší", "Protože je zima", "Protože chtějí"], e: "Text jasně říká 'Škola je daleko, proto jezdí autobusem' — slovo 'proto' označuje příčinu. O dešti ani zimě text nic neříká." },
      { q: "Co dělají Petr a Jana na zastávce?", a: "Rozloučí se", opts: ["Rozloučí se", "Čekají na rodiče", "Nastupují do auta", "Kupují svačinu"], e: "Text říká 'Na zastávce se rozloučí a každý jde do své třídy' — na zastávce se loučí, ne čekají na rodiče ani kupují svačinu." },
    ],
  },
];

const TEXTY_L2: Text[] = [
  {
    text: "Tomáš si o víkendu postavil s tátou papírového draka. V sobotu ráno vyšli na louku, ale vůbec nefoukal vítr, a tak drak nelétal. Odpoledne se zvedl vítr a drak konečně vzlétl vysoko nad stromy. Tomáš byl moc šťastný a běžel s drakem po louce.",
    otazky: [
      { q: "Proč drak ráno nelétal?", a: "Protože nefoukal vítr", opts: ["Protože nefoukal vítr", "Protože byl moc těžký", "Protože pršelo", "Protože se přetrhla nit"], e: "Text říká 'vůbec nefoukal vítr, a tak drak nelétal' — spojka 'a tak' ukazuje příčinu: bez větru drak neletí." },
      { q: "Kdy drak konečně vzlétl?", a: "Odpoledne, když se zvedl vítr", opts: ["Odpoledne, když se zvedl vítr", "Hned ráno", "Až druhý den", "Večer po setmění"], e: "Text popisuje: 'Odpoledne se zvedl vítr a drak konečně vzlétl' — vzlétl odpoledne, ne ráno ani druhý den." },
      { q: "S kým Tomáš draka stavěl?", a: "S tátou", opts: ["S tátou", "Se sestrou", "S kamarádem", "Sám"], e: "V textu stojí 'Tomáš si o víkendu postavil s tátou papírového draka' — pomáhal mu táta." },
      { q: "Jak se Tomáš cítil, když drak vzlétl?", a: "Byl šťastný", opts: ["Byl šťastný", "Byl smutný", "Byl unavený", "Byl vystrašený"], e: "Text říká 'Tomáš byl moc šťastný a běžel s drakem po louce' — radost je přímo napsaná." },
    ],
  },
  {
    text: "Babička má na zahradě záhon jahod a záhon rajčat. Na jaře záhony okopala a zasadila nové sazenice. V létě musí zahradu každý den zalévat, protože je velké horko. Na podzim babička sklízí poslední rajčata a zahradu připravuje na zimu.",
    otazky: [
      { q: "Co babička dělá na zahradě na jaře?", a: "Okopává záhony a sází sazenice", opts: ["Okopává záhony a sází sazenice", "Sklízí jahody", "Zalévá kvůli horku", "Připravuje zahradu na zimu"], e: "Text říká 'Na jaře záhony okopala a zasadila nové sazenice' — to patří k jaru, ne k létu nebo podzimu." },
      { q: "Proč musí babička v létě zahradu zalévat?", a: "Protože je velké horko", opts: ["Protože je velké horko", "Protože prší málo", "Protože to nařídil soused", "Protože rostliny jsou nemocné"], e: "V textu stojí 'protože je velké horko' — to je přímo uvedený důvod zalévání." },
      { q: "Co babička sklízí na podzim?", a: "Poslední rajčata", opts: ["Poslední rajčata", "První jahody", "Brambory", "Květiny"], e: "Text popisuje: 'Na podzim babička sklízí poslední rajčata' — přesně tuto plodinu sklízí na podzim." },
      { q: "Co má babička na zahradě?", a: "Záhon jahod a záhon rajčat", opts: ["Záhon jahod a záhon rajčat", "Jen záhon brambor", "Ovocný sad", "Skleník s okurkami"], e: "Text začíná 'Babička má na zahradě záhon jahod a záhon rajčat' — to jsou přesně dvě plodiny, které pěstuje." },
    ],
  },
  {
    text: "Kryštof chtěl najít knihu o dinosaurech. Šel proto do knihovny ve svém městě. Nejdřív hledal sám v regálech, ale knihu nemohl najít. Pak požádal o pomoc knihovnici, a ta mu knihu během chvilky našla. Kryštof si knihu půjčil a doma ji celou přečetl za jeden víkend.",
    otazky: [
      { q: "Proč šel Kryštof do knihovny?", a: "Chtěl najít knihu o dinosaurech", opts: ["Chtěl najít knihu o dinosaurech", "Chtěl si vrátit vypůjčenou knihu", "Měl tam schůzku s kamarádem", "Chtěl si jen číst časopis"], e: "Text říká 'Kryštof chtěl najít knihu o dinosaurech. Šel proto do knihovny' — spojka 'proto' ukazuje důvod jeho cesty." },
      { q: "Kdo nakonec Kryštofovi pomohl knihu najít?", a: "Knihovnice", opts: ["Knihovnice", "Kamarád", "Táta", "Nikdo, našel ji sám"], e: "V textu stojí 'požádal o pomoc knihovnici, a ta mu knihu během chvilky našla' — pomohla mu knihovnice." },
      { q: "Co Kryštof dělal nejdřív, než požádal o pomoc?", a: "Hledal sám v regálech", opts: ["Hledal sám v regálech", "Zeptal se hned knihovnice", "Šel domů bez knihy", "Zavolal kamarádovi"], e: "Text popisuje pořadí: 'Nejdřív hledal sám v regálech, ale knihu nemohl najít. Pak požádal o pomoc' — nejdřív hledal sám." },
      { q: "Za jak dlouho Kryštof knihu přečetl?", a: "Za jeden víkend", opts: ["Za jeden víkend", "Za jeden měsíc", "Za jeden den ve škole", "Nepřečetl ji vůbec"], e: "Poslední věta textu říká 'doma ji celou přečetl za jeden víkend' — to je přesná doba." },
    ],
  },
];

const TEXTY_L3: Text[] = [
  {
    text: "Ondra se učí hrát na housle už půl roku. Zpočátku mu to nešlo a často chtěl housle nechat ležet v pouzdru. Paní učitelka mu ale řekla, že i ona se jako malá dlouho trápila, než jí to začalo jít. Ondra si vzpomněl na její slova pokaždé, když ho cvičení nebavilo, a nepřestal zkoušet. Po několika měsících denního cvičení zahrál na školním koncertě svou první celou skladbu bez chyby. Rodiče v sále mu potleskem tleskali nejdéle ze všech.",
    otazky: [
      { q: "Co je hlavní poučení z příběhu?", a: "Vytrvalost a cvičení přinesou úspěch", opts: ["Vytrvalost a cvičení přinesou úspěch", "Housle jsou pro děti moc těžký nástroj", "Učitelka byla na Ondru přísná", "Koncerty jsou nudné"], e: "Celý příběh ukazuje, jak Ondra vytrval navzdory obtížím a díky pravidelnému cvičení uspěl — to je hlavní myšlenka, ne jednotlivá věta." },
      { q: "Proč Ondra nepřestal cvičit, i když ho to nebavilo?", a: "Vzpomněl si na slova paní učitelky", opts: ["Vzpomněl si na slova paní učitelky", "Rodiče mu za cvičení platili", "Bál se, že housle rozbije", "Chtěl být lepší než spolužáci"], e: "Text říká, že si 'vzpomněl na její slova pokaždé, když ho cvičení nebavilo, a nepřestal zkoušet' — to ho motivovalo pokračovat." },
      { q: "Co se stalo dřív — Ondrovy potíže s hraním, nebo jeho vystoupení na koncertě?", a: "Nejdřív potíže, potom koncert", opts: ["Nejdřív potíže, potom koncert", "Nejdřív koncert, potom potíže", "Obojí se stalo ve stejný den", "Potíže se stejně nikdy nevyřešily"], e: "Text popisuje vývoj v čase: zpočátku potíže → cvičení → nakonec úspěšný koncert. Potíže tedy byly dřív." },
      { q: "Proč Ondru povzbudilo, co mu řekla paní učitelka?", a: "Zjistil, že i ona měla stejné potíže a překonala je", opts: ["Zjistil, že i ona měla stejné potíže a překonala je", "Slíbila mu za to odměnu", "Řekla mu, že housle vrátí", "Pochválila jeho první skladbu"], e: "Učitelka mu řekla, že se 'jako malá dlouho trápila, než jí to začalo jít' — Ondra viděl, že potíže lze překonat, protože se to podařilo i jí." },
      { q: "Jak dlouho se Ondra učil hrát, než zahrál svou první celou skladbu?", a: "Necelý rok (půl roku plus několik měsíců)", opts: ["Necelý rok (půl roku plus několik měsíců)", "Jeden týden", "Přesně jeden rok a půl", "Celý svůj život"], e: "Text říká, že se učí 'už půl roku', a skladbu zahrál 'po několika měsících denního cvičení' navíc — dohromady je to necelý rok." },
      { q: "Jak rodiče reagovali na Ondrovo vystoupení?", a: "Tleskali mu nejdéle ze všech", opts: ["Tleskali mu nejdéle ze všech", "Odešli dřív domů", "Byli zklamaní z jeho výkonu", "Nevšimli si ho"], e: "Poslední věta textu říká 'Rodiče v sále mu potleskem tleskali nejdéle ze všech' — to je jejich reakce." },
    ],
  },
  {
    text: "Rodina Novákových si na sobotu naplánovala celodenní výlet do hor. Ještě před odjezdem si táta všiml tmavých mraků na obloze a raději vzal s sebou pláštěnky. Cestou nahoru sice chvíli mrholilo, ale rodina se schovala pod skálu a počkala, až přestane. Odpoledne se obloha vyjasnila a oni došli až na vrchol, odkud viděli celé údolí. Cestou zpátky byli všichni unavení, ale spokojení, a doma si hned naplánovali další podobný výlet.",
    otazky: [
      { q: "Co nejlépe vystihuje celý příběh?", a: "Rodina i přes nepříznivé počasí zvládla výlet a byla spokojená", opts: ["Rodina i přes nepříznivé počasí zvládla výlet a byla spokojená", "Výlet se kvůli dešti úplně zrušil", "Rodina zabloudila v horách", "Táta zapomněl pláštěnky doma"], e: "Příběh ukazuje, že rodina se s deštěm vyrovnala (schovala se, počkala) a nakonec došla na vrchol a byla spokojená — to je hlavní myšlenka." },
      { q: "Proč si táta vzal s sebou pláštěnky?", a: "Všiml si tmavých mraků na obloze", opts: ["Všiml si tmavých mraků na obloze", "Slyšel předpověď v rádiu cestou", "Máma mu to nařídila", "Bral je s sebou vždycky, i když je nepotřebuje"], e: "Text říká 'Ještě před odjezdem si táta všiml tmavých mraků na obloze a raději vzal s sebou pláštěnky' — reagoval na to, co viděl." },
      { q: "Co rodina udělala, když cestou nahoru mrholilo?", a: "Schovala se pod skálu a počkala", opts: ["Schovala se pod skálu a počkala", "Vrátila se domů", "Pokračovala v dešti dál bez zastávky", "Zavolala si taxi"], e: "Text popisuje: 'rodina se schovala pod skálu a počkala, až přestane' — to byla jejich reakce na déšť." },
      { q: "Díky čemu se rodina nakonec dostala až na vrchol?", a: "Počkali, až se počasí zlepší, a pokračovali dál", opts: ["Počkali, až se počasí zlepší, a pokračovali dál", "Vzdali se cesty na vrchol", "Jeli zbytek cesty autem", "Vrchol nakonec vůbec nenašli"], e: "Text ukazuje řetězec: mrholilo → schovali se a počkali → 'Odpoledne se obloha vyjasnila a oni došli až na vrchol' — trpělivost jim pomohla výlet dokončit." },
      { q: "Co rodina viděla z vrcholu?", a: "Celé údolí", opts: ["Celé údolí", "Sousední město", "Moře", "Jen mlhu"], e: "Text říká 'odkud viděli celé údolí' — to byl výhled z vrcholu." },
      { q: "Co plánování dalšího výletu hned po návratu domů naznačuje o tom, jak se rodině výlet líbil?", a: "Výlet se jim i přes potíže moc líbil", opts: ["Výlet se jim i přes potíže moc líbil", "Výlet se jim vůbec nelíbil", "Byli na výlet naštvaní", "Chtěli příště jet jinam, protože litovali"], e: "Text říká, že si 'doma hned naplánovali další podobný výlet' — kdyby se jim výlet nelíbil, další stejný by neplánovali." },
    ],
  },
];

function textyToTasks(texty: Text[]): PracticeTask[] {
  const tasks: PracticeTask[] = [];
  for (const t of texty) {
    for (const o of t.otazky) {
      tasks.push({
        question: `Přečti si text:\n\n${t.text}\n\n${o.q}`,
        correctAnswer: o.a,
        options: shuffle([...o.opts]),
        hints: ["Přečti text pozorně a hledej odpověď přímo v textu.", "Pokud si nejsi jistý, přečti text znovu."],
        explanation: o.e,
      });
    }
  }
  return shuffle(tasks);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return textyToTasks(TEXTY_L1);
  if (level === 2) return textyToTasks(TEXTY_L2);
  return textyToTasks(TEXTY_L3);
}

export const PLYNULECTENI: TopicMetadata[] = [
  {
    id: "g3-cjl-plynule-cteni-porozumeni",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-cteni-plynule-cteni-s-porozumenim-delsich-textu",
    title: "Plynulé čtení s porozuměním delších textů",
    studentTitle: "Čtu s porozuměním",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Čtení",
    briefDescription: "Přečteš text a správně odpovíš na otázky o jeho obsahu.",
    keywords: ["čtení", "porozumění", "text", "otázky", "obsah", "odpovědi z textu"],
    goals: ["Přečíst text a porozumět mu.", "Najít odpovědi na otázky přímo v textu.", "Rozlišit důležité a méně důležité informace.", "Odvodit hlavní myšlenku a závěr, které nejsou v textu doslova napsané."],
    boundaries: ["Texty přiměřené 3. ročníku.", "L1/L2 texty max 5 vět; L3 texty o něco delší (6 vět) — cíleně procvičují 'delší text' z názvu tématu."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Přečti text 2×. Při hledání odpovědi se vrať k textu a hledej konkrétní informaci nebo si poskládej odpověď z více vět.",
      steps: ["Přečti celý text.", "Přečti otázku.", "Vrať se k textu a najdi odpověď (nebo spoj víc informací dohromady).", "Vyber správnou možnost."],
      commonMistake: "Odpovídání z hlavy bez opření o text — vždy se vrať k textu.",
      example: "Text: 'Bob je hnědý pes.' Otázka: Jakou barvu má Bob? → Hledám v textu: 'hnědý'.",
    },
  },
];
