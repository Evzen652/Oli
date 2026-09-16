/**
 * Přírodopis 6. ročník — Sinice: výskyt a význam, vodní květ (select_one).
 *
 * Faktické téma → tři disjunktní banky (POOL_L1/L2/L3). Každá položka má vlastní
 * znění, vlastní dvojici nápověd a vlastní vysvětlení.
 *
 * Chybový model (každý distraktor = jedna typická chyba šesťáka):
 *  • sinice jsou rostliny nebo řasy, protože jsou zelené a mají chlorofyl;
 *  • vodní květ = kvetoucí lekníny, okřehek nebo pyl na hladině (název brán doslova);
 *  • vodní květ vzniká ve studené čisté vodě / zelená voda = zdravá voda;
 *  • vodní květ je neškodný (stačí neponořit hlavu, nenapít se) — a opačně:
 *    sinice jsou jen škodlivé a kyslík nevyrábějí; ryby hynou, protože je sinice „sežerou“.
 *
 *  • L1 — zapamatování: krátká přímá otázka → jeden fakt.
 *  • L2 — použití: situace u rybníka, přehrady, koupaliště, se psem, s bazénkem.
 *  • L3 — analýza a přenos, čtyři šablony rovnoměrně:
 *      (a) poznej organismus z popisu znaků (jádro × chlorofyl),
 *      (b) porovnej dvě vody lišící se v jedné podmínce a urči, kde a proč vznikne vodní květ,
 *      (c) spoj znak s funkcí nebo důsledkem,
 *      (d) rozhodni spor dvou lidí o neznámém případu.
 *
 * Zdraví: jediná rada je bezpečná — ve vodním květu se nekoupat, psa do vody
 * nepouštět, po nechtěném kontaktu se osprchovat, řídit se hlášením hygieny.
 * Převařování vody se nezmiňuje vůbec.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask as choice, losUlohy, ruzneUlohy, pick, type Distractor } from "./_shared";

interface Polozka {
  q: string;
  correct: string;
  distractors: Distractor[];
  hints: [string, string];
  explanation: string;
}

const ROSTLINA = "Chlorofyl mají i sinice, ale nemají buněčné jádro. Proto se řadí k bakteriím, ne k rostlinám ani k řasám.";
const KVET = "Slovo „květ“ je tady obrazné. Vodní květ je přemnožení drobných sinic, nic v něm nekvete.";
const STUDENA = "Sinice se nejvíc množí v teplé stojaté vodě s velkým množstvím živin, tedy v létě. Ve studené vodě se množí pomalu.";
const NESKODNY = "Mnohé sinice uvolňují jedovaté látky, které dráždí kůži celého těla a způsobují vyrážku i alergii. Okem nepoznáš, jestli jsou jedovaté, proto se ve vodním květu nekoupej vůbec.";

// ── L1 — ZAPAMATOVÁNÍ: přímá otázka → jeden fakt ────────────────────────────
export const POOL_L1: Polozka[] = [
  {
    q: "Co platí o buňce sinice?",
    correct: "Nemá buněčné jádro, ale má chlorofyl",
    distractors: [
      { value: "Má buněčné jádro jako buňka rostlin", why: ROSTLINA },
      { value: "Nemá buněčné jádro ani chlorofyl", why: "Tak vypadá například hnilobná bakterie. Sinice chlorofyl mají, a proto dělají fotosyntézu." },
      { value: "Má buněčné jádro a brvy jako trepka", why: "Brvy a buněčné jádro má prvok trepka. Sinice jádro nemají." },
    ],
    hints: [
      "U buňky sinice si polož dvě otázky: je v ní jádro? A má zelené barvivo?",
      "Vzpomeň si, podle čeho vědci sinice zařadili k bakteriím, a ověř, jestli sinice umí fotosyntézu.",
    ],
    explanation: "Buňka sinice nemá buněčné jádro, tím se podobá bakteriím. Na rozdíl od většiny bakterií ale má zelené barvivo chlorofyl a umí fotosyntézu.",
  },
  {
    q: "Jak se jmenuje zelené barvivo, díky kterému sinice dělají fotosyntézu?",
    correct: "Chlorofyl",
    distractors: [
      { value: "Kyslík", why: "Kyslík sinice při fotosyntéze vyrábějí. Je to plyn, ne barvivo." },
      { value: "Oxid uhličitý", why: "Oxid uhličitý sinice při fotosyntéze spotřebovávají. Je to bezbarvý plyn, ne barvivo." },
      { value: "Voda", why: "Voda je k fotosyntéze potřeba, ale je bezbarvá. Zelenou barvu dává sinicím jiná látka." },
    ],
    hints: [
      "Hledáš barvivo, ne látku, která do fotosyntézy vstupuje nebo z ní vychází.",
      "Tři možnosti jsou suroviny nebo produkty fotosyntézy a žádná z nich není zelená. Stejné zelené barvivo mají i listy rostlin.",
    ],
    explanation: "Zelené barvivo, které zachytává světlo pro fotosyntézu, je chlorofyl. Voda a oxid uhličitý jsou suroviny fotosyntézy, kyslík je její produkt.",
  },
  {
    q: "Který plyn sinice uvolňují do okolí při fotosyntéze?",
    correct: "Kyslík",
    distractors: [
      { value: "Oxid uhličitý", why: "Oxid uhličitý sinice při fotosyntéze naopak spotřebovávají." },
      { value: "Dusík", why: "Dusík tvoří většinu vzduchu, ale fotosyntézou nevzniká." },
      { value: "Sirovodík", why: "Páchnoucí sirovodík vzniká při hnití na dně bez vzduchu, ne při fotosyntéze." },
    ],
    hints: [
      "Sinice dělají fotosyntézu stejně jako zelené rostliny. Který plyn rostliny při ní uvolňují?",
      "Při fotosyntéze se jeden plyn spotřebuje a jiný uvolní. Uvolněný plyn potřebují k dýchání ryby i lidé.",
    ],
    explanation: "Při fotosyntéze sinice spotřebovávají oxid uhličitý a vodu a uvolňují kyslík. Proto jsou pro vodu užitečné.",
  },
  {
    q: "Kde všude v přírodě žijí sinice?",
    correct: "Ve vodě, ve vlhké půdě i na kůře stromů",
    distractors: [
      { value: "Jen v mořích, protože potřebují slanou vodu", why: "Sinice žijí ve sladkých i slaných vodách, ve vlhké půdě i na kůře stromů. Slanou vodu nutně nepotřebují." },
      { value: "Pouze v čisté pitné vodě z vodovodu", why: "Sinice žijí hlavně v přírodě: v rybnících, v mořích, ve vlhké půdě i na kůře stromů. Na vodu z vodovodu omezené nejsou." },
      { value: "Jen uvnitř těl zvířat jako cizopasníci", why: "Sinice nejsou cizopasníci. Samy si vyrábějí živiny fotosyntézou." },
    ],
    hints: [
      "Sinice potřebují ke svému životu vlhko a světlo. Která možnost nabízí takových míst nejvíc?",
      "Vzpomeň si na tmavý slizký povlak na vlhkých skalách nebo na kameni u potoka. Sinice nejsou cizopasníci a nejsou vázané na jediný druh vody.",
    ],
    explanation: "Sinice žijí ve sladkých i slaných vodách, ve vlhké půdě, na kůře stromů a na vlhkých skalách. Potřebují vlhko a světlo, cizopasníci to nejsou.",
  },
  {
    q: "Na kterém neobvyklém místě mohou sinice žít?",
    correct: "V horkých pramenech",
    distractors: [
      { value: "Ve vroucí vodě na sporáku", why: "Ve vroucí vodě sinice nepřežijí. Snesou horkou vodu pramenů, ne var." },
      { value: "V naprosté tmě hluboko v zemi", why: "Sinice potřebují světlo k fotosyntéze. V naprosté tmě žít nemohou." },
      { value: "V suchém prachu na půdě domu", why: "Na půdě domu je sucho a šero. Sinice rostou jen za vlhka a na světle." },
    ],
    hints: [
      "Hledej místo, kde je voda a světlo, i když je tam velké horko.",
      "Sinice snesou i velmi teplou vodu, ale bez vody a světla nerostou a var nepřežijí. Vyřaď proto suchá, tmavá a vroucí místa.",
    ],
    explanation: "Sinice žijí i v horkých pramenech, kde je voda velmi teplá. Potřebují ale vodu a světlo, takže v suchu ani ve tmě nerostou a var nepřežijí.",
  },
  {
    q: "S kterým organismem se sinice spojuje v lišejníku?",
    correct: "S houbou",
    distractors: [
      { value: "S mechem", why: "Mech je rostlina a lišejník se s ním často plete. Lišejník je ale soužití houby a řasy nebo sinice." },
      { value: "S kapradinou", why: "Kapradina je rostlina. V lišejníku žije sinice (nebo řasa) spolu s houbou." },
      { value: "Se stromem", why: "Lišejník na kůře stromu jen roste, strom není jeho součástí. Tvoří ho houba spolu s řasou nebo sinicí." },
    ],
    hints: [
      "Lišejník tvoří dva partneři: jeden dělá fotosyntézu, druhý fotosyntézu nedělá.",
      "Sinice v lišejníku vyrábí živiny. Druhý partner fotosyntézu neumí a k rostlinám nepatří. Mech, kapradina ani strom to proto nejsou.",
    ],
    explanation: "Lišejník je soužití houby a řasy nebo sinice. Sinice vyrábí fotosyntézou živiny a houba jí dává oporu a vodu.",
  },
  {
    q: "Jak se jmenuje soužití houby a sinice?",
    correct: "Lišejník",
    distractors: [
      { value: "Mech", why: "Mech je samostatná rostlina, žádné soužití to není." },
      { value: "Plíseň", why: "Plíseň je jen houba, sinice v ní nežije." },
      { value: "Okřehek", why: "Okřehek je drobná vodní rostlina, ne soužití houby a sinice." },
    ],
    hints: [
      "Hledáš organismus, který roste třeba na kůře stromů a skládá se ze dvou partnerů.",
      "Tento organismus bývá šedozelený nebo žlutý a roste na kamenech a kmenech. Mech, plíseň i okřehek jsou jen jeden organismus, ne dva.",
    ],
    explanation: "Soužití houby a sinice (nebo řasy) se jmenuje lišejník. Mech a okřehek jsou rostliny, plíseň je houba.",
  },
  {
    q: "Jak se nazývá přemnožení sinic ve vodě?",
    correct: "Vodní květ",
    distractors: [
      { value: "Rybniční pyl", why: "Pyl pochází z rostlin a sinice ho netvoří. Přemnožení sinic má jiný název." },
      { value: "Leknínový porost", why: "Lekníny jsou vodní rostliny. Přemnožení sinic s nimi nemá nic společného." },
      { value: "Okřehkový koberec", why: "Okřehek je drobná plovoucí rostlina. Zelený koberec okřehku není přemnožení sinic." },
    ],
    hints: [
      "Název přemnožení sinic zní, jako by voda kvetla, i když nic nekvete.",
      "Pyl, lekníny i okřehek patří k rostlinám. Hledáš dvouslovný název, ve kterém je voda a slovo spojené s kvetením.",
    ],
    explanation: "Přemnožení sinic ve vodě se nazývá vodní květ. Slovo „květ“ je obrazné, sinice nekvetou.",
  },
  {
    q: "Kdy se vodní květ objevuje nejčastěji?",
    correct: "V létě, když je voda teplá",
    distractors: [
      { value: "Na jaře, když taje sníh a led", why: STUDENA },
      { value: "V zimě, když je voda pod ledem", why: STUDENA },
      { value: "Na podzim, když do vody padá listí", why: "Na podzim se voda ochlazuje a sinice se množí pomaleji. Nejvíc se jim daří v teplé vodě." },
    ],
    hints: [
      "Sinice se nejrychleji množí, když je hodně světla a tepla. Které roční období to je?",
      "Studená voda množení sinic zpomaluje. Vyber období, kdy se voda v rybnících nejvíc prohřeje a slunce svítí nejdéle.",
    ],
    explanation: "Vodní květ vzniká hlavně v létě. Voda je teplá, je hodně světla a sinice se rychle množí.",
  },
  {
    q: "Podle čeho poznáš vodní květ?",
    correct: "Voda je zelená, zakalená a plná zrníček",
    distractors: [
      { value: "Na hladině plavou žluté pyly stromů", why: KVET },
      { value: "Voda je průzračná a je vidět na dno", why: STUDENA },
      { value: "Na hladině kvetou bílé lekníny", why: KVET },
    ],
    hints: [
      "Vodní květ tvoří nesmírně mnoho drobných zelených organismů. Jak to změní vzhled vody?",
      "Když je ve vodě obrovské množství sinic, voda ztratí průzračnost a změní barvu. Jejich kolonie vypadají jako drobná zrníčka. Nic přitom nekvete.",
    ],
    explanation: "Při vodním květu je voda zelená, zakalená a jsou v ní zrníčka jako krupice. U břehu bývá zelený povlak. Pyl ani lekníny s tím nesouvisí.",
  },
  {
    q: "Jakou barvu mívají sinice?",
    correct: "Modrozelenou",
    distractors: [
      { value: "Žlutou jako pyl", why: "Pyl patří rostlinám, sinice ho netvoří. Sinice mají zelené a modré barvivo." },
      { value: "Hnědou jako houby", why: "Sinice nejsou houby. Mají zelené a modré barvivo, a tak vypadají modrozeleně." },
      { value: "Bílou jako plíseň", why: "Plíseň je houba bez chlorofylu. Sinice chlorofyl mají, a proto jsou barevné." },
    ],
    hints: [
      "Sinice mají zelené barvivo chlorofyl a k němu ještě jedno barvivo navíc.",
      "Kromě zeleného chlorofylu mají sinice i modré barvivo. Spoj ty dvě barvy dohromady. Houby a plísně chlorofyl nemají, a tak s nimi sinice barvou nesouvisí.",
    ],
    explanation: "Sinice mají zelený chlorofyl a modré barvivo. Proto bývají modrozelené.",
  },
  {
    q: "Čím byly sinice důležité v dávné minulosti Země?",
    correct: "Patřily k prvním, kdo vyráběl kyslík",
    distractors: [
      { value: "Patřily k prvním rostlinám na souši", why: ROSTLINA },
      { value: "Patřily k prvním živočichům v moři", why: "Sinice nejsou živočichové. Neživí se jinými organismy, samy si vyrábějí živiny." },
      { value: "Vytvořily první ložiska uhlí", why: "Uhlí vzniklo hlavně z pravěkých rostlin, například přesliček a plavuní. Sinice jsou důležité jinak." },
    ],
    hints: [
      "Sinice dělají fotosyntézu. Co fotosyntézou vzniká a co to znamenalo pro Zemi?",
      "Na mladé Zemi skoro chyběl plyn, který dnes dýcháme. Organismy s fotosyntézou ho začaly vyrábět jako jedny z prvních. Sinice nejsou rostliny ani živočichové.",
    ],
    explanation: "Sinice patří k nejstarším organismům, které vyráběly kyslík. Díky tomu se kyslík postupně dostal do vody i do vzduchu.",
  },
  {
    q: "Jak mohou sinice žít?",
    correct: "Jednotlivě, v koloniích nebo ve vláknech",
    distractors: [
      { value: "Pouze jako velké rostliny s listy", why: ROSTLINA },
      { value: "Jen jako cizopasníci v těle ryb", why: "Sinice nejsou cizopasníci. Samy si vyrábějí živiny fotosyntézou." },
      { value: "Jako drobní živočichové s brvami", why: "Brvy má prvok trepka. Sinice nejsou živočichové ani prvoci." },
    ],
    hints: [
      "Sinice jsou drobné. Mohou žít samy, ale také se shlukovat.",
      "Buňky sinic se po rozdělení někdy nerozejdou a zůstanou u sebe, buď v chomáčku, nebo v řadě za sebou. Listy ani brvy sinice nemají.",
    ],
    explanation: "Sinice žijí jednotlivě, v koloniích (shlucích) nebo ve vláknech (buňky v řadě za sebou). Nejsou to rostliny, živočichové ani cizopasníci.",
  },
  {
    q: "Čím se sinice liší od zelených řas?",
    correct: "Nemají buněčné jádro",
    distractors: [
      { value: "Nemají zelené barvivo", why: "Zelené barvivo chlorofyl mají sinice i řasy." },
      { value: "Nevyrábějí žádný kyslík", why: "Sinice i řasy dělají fotosyntézu a obě kyslík vyrábějí." },
      { value: "Nežijí nikdy ve vodě", why: "Sinice i řasy žijí hlavně ve vodě." },
    ],
    hints: [
      "Sinice i řasy jsou zelené a dělají fotosyntézu. Hledej rozdíl uvnitř buňky.",
      "Barvivo, výroba kyslíku i život ve vodě jsou u sinic a řas stejné. Liší se tím, co mají řasy v buňce navíc stejně jako rostliny.",
    ],
    explanation: "Řasy mají buněčné jádro, sinice ne. Chlorofyl, fotosyntézu a život ve vodě mají obě skupiny společné.",
  },
  {
    q: "Co sinice potřebují k fotosyntéze?",
    correct: "Světlo, vodu a oxid uhličitý",
    distractors: [
      { value: "Potravu z těl jiných organismů", why: "Potravu z jiných organismů přijímají živočichové a houby. Sinice si živiny vyrábějí samy." },
      { value: "Jen vodu, světlo nepotřebují", why: "Bez světla fotosyntéza neprobíhá. Světlo sinice potřebují." },
      { value: "Tmu a vlhko jako houby v lese", why: "Houby fotosyntézu nedělají, a tak jim tma nevadí. Sinice bez světla fotosyntézu nezvládnou." },
    ],
    hints: [
      "Fotosyntéza u sinic probíhá stejně jako v listech rostlin. Co k ní listy potřebují?",
      "K fotosyntéze je potřeba energie ze slunce, jedna tekutina a jeden plyn ze vzduchu. Potravu z jiných organismů sinice nepřijímají.",
    ],
    explanation: "K fotosyntéze sinice potřebují světlo, vodu a oxid uhličitý. Vyrobí z nich živiny a uvolní kyslík.",
  },
  {
    q: "Jak velká je jedna buňka sinice?",
    correct: "Tak malá, že ji uvidíš jen mikroskopem",
    distractors: [
      { value: "Velká jako list leknínu", why: "List leknínu je vidět okem a skládá se z obrovského množství buněk. Jedna buňka sinice je vidět jen mikroskopem." },
      { value: "Velká jako lísteček okřehku", why: "Okřehek je rostlina viditelná okem. Buňka sinice je mnohem menší." },
      { value: "Jako zrnko krupice, dobře viditelná okem", why: "Zrníčka ve vodním květu jsou celé kolonie tisíců buněk. Jedna buňka sinice je mnohem menší." },
    ],
    hints: [
      "Zrníčka, která vidíš ve vodním květu, jsou shluky mnoha buněk. Jak malá je pak jedna buňka?",
      "Jedna sinice je jen jediná buňka, drobná podobně jako bakterie, jen o něco větší. Rostliny a jejich listy jsou z miliónů buněk. Zamysli se, jakým přístrojem se tak malé věci pozorují.",
    ],
    explanation: "Buňka sinice je tak malá, že ji uvidíš jen mikroskopem. Okem vidíme až kolonie nebo vlákna mnoha buněk.",
  },
];

// ── L2 — POUŽITÍ: fakt v konkrétní situaci ──────────────────────────────────
export const POOL_L2: Polozka[] = [
  {
    q: "Je srpen. Jana přijde k rybníku a vidí zelenou zakalenou vodu se zeleným povlakem u břehu. Co udělá?",
    correct: "Koupat se nebude a najde si čistší vodu",
    distractors: [
      { value: "Koupat se bude, jen nepotopí hlavu", why: NESKODNY },
      { value: "Koupat se bude, zelená voda je zdravá", why: "Zelená zakalená voda zdravá není. Zbarvují ji přemnožené sinice, které mohou uvolňovat jedovaté látky." },
      { value: "Koupat se nebude, protože voda je na koupání moc studená", why: "Koupat se opravdu nemá, ale ne kvůli chladu. Zelená zakalená voda je v srpnu teplá a nebezpečná je kvůli sinicím." },
    ],
    hints: [
      "Zelená zakalená voda v létě a povlak u břehu jsou znaky jednoho jevu. Jak ten jev působí na kůži?",
      "Teplo, zelený zákal a povlak prozrazují přemnožené sinice. Jejich látky mohou dráždit celé tělo, nejen ústa a oči. Rozhodni, jestli do takové vody vůbec lézt, a zkontroluj i důvod.",
    ],
    explanation: "Zelená zakalená voda s povlakem v létě je vodní květ. Sinice mohou uvolňovat jedovaté látky, které dráždí kůži celého těla, proto se v takové vodě nekoupe vůbec, ani bez potápění.",
  },
  {
    q: "Tomáš jde se psem kolem přehrady. U břehu je zelená kaše ze sinic a pes se žene do vody. Co má Tomáš udělat?",
    correct: "Psa do vody nepustí a vezme ho na vodítko",
    distractors: [
      { value: "Psa do vody nepustí, protože by vodu zakalil", why: "Psa opravdu nepouštěj, ale ne kvůli zakalení. Vodu zakalily sinice a psovi škodí jejich látky, které by spolkl." },
      { value: "Psa pustí, jen mu nedovolí vodu pít", why: "Pes si vodu olizuje ze srsti, takže ji spolkne i bez pití. Do vodního květu nesmí vůbec." },
      { value: "Psa pustí jen k břehu, kde je mělko", why: "U břehu se sinice hromadí nejvíc. Právě tam je zelená kaše nejhustší." },
    ],
    hints: [
      "Pes nemůže poznat, že je voda nebezpečná. Co by se stalo, kdyby si pak olizoval srst?",
      "Zelená kaše u břehu je nahromaděný vodní květ. Pes by vodu spolykal při plavání i při olizování srsti. Rozhodni, jestli pro něj existuje bezpečná část té vody, a ověř i důvod.",
    ],
    explanation: "Sinice ohrožují i psy. Pes vodu polyká a olizuje si ji ze srsti, a u břehu je sinic nejvíc. Proto ho do vodního květu nepouštěj vůbec.",
  },
  {
    q: "Filip se omylem vykoupal v rybníce se zelenou zakalenou vodou. Co má udělat hned potom?",
    correct: "Osprchovat se a oblečení vyprat",
    distractors: [
      { value: "Nechat vodu na kůži uschnout", why: "Když voda na kůži uschne, jedovaté látky sinic na ní zůstanou a dál ji dráždí." },
      { value: "Nic, protože sinice neškodí", why: NESKODNY },
      { value: "Opláchnout se o kus dál v rybníce", why: "V celém rybníce jsou sinice. Opláchnutí ve stejné vodě nepomůže." },
    ],
    hints: [
      "Na kůži a plavkách zůstaly látky ze zelené vody. Jak se jich zbavíš?",
      "Jedovaté látky sinic dráždí kůži, dokud na ní zůstávají. Potřebuješ je smýt vodou, ve které sinice nejsou, a zbavit se jich i z oblečení.",
    ],
    explanation: "Po nechtěném koupání ve vodním květu se osprchuj čistou vodou a oblečení vyper. Tak smyješ jedovaté látky sinic, které dráždí kůži.",
  },
  {
    q: "Proč se vodní květ objevuje hlavně v teplých měsících roku?",
    correct: "V teplé vodě a na světle se sinice rychle množí",
    distractors: [
      { value: "V létě sinice kvetou jako rostliny na louce", why: KVET },
      { value: "V létě je voda čistší, a sinicím se tak daří", why: "Letní voda není čistší, naopak v ní bývá víc živin. Sinicím svědčí teplo, světlo a živiny, ne čistota." },
      { value: "V létě do vody padá pyl, ze kterého sinice rostou", why: "Sinice z pylu nevznikají. Pyl patří rostlinám, sinice se množí dělením buněk, a to v teplé vodě na světle nejrychleji." },
    ],
    hints: [
      "Porovnej vodu v rybníce v červenci a v březnu. Čím se liší?",
      "V létě je voda teplejší a slunce svítí déle. Zvaž, jak teplo a světlo ovlivní organismy, které dělají fotosyntézu. Nic přitom nekvete.",
    ],
    explanation: "V létě je voda teplá a světla je hodně. Sinice se pak množí velmi rychle a vznikne vodní květ.",
  },
  {
    q: "Zemědělec hnojí pole až k břehu rybníka. Proč tím pomáhá vzniku vodního květu?",
    correct: "Hnojiva se splaví do vody a sinice z nich mají živiny",
    distractors: [
      { value: "Hnojiva zabarví vodu do zelena, sinice v ní nejsou", why: "Zelenou barvu vody dělají samotné sinice, ne hnojiva." },
      { value: "Hnojiva ochladí vodu a chladná voda sinicím svědčí", why: "Hnojiva vodu neochlazují. Sinicím navíc svědčí teplá voda, ne chladná. Z hnojiv mají živiny." },
      { value: "Hnojiva obsahují semínka, ze kterých sinice vyrostou", why: "Sinice semena nemají, množí se dělením buněk. Z hnojiv nevyrostou, jen z nich čerpají živiny." },
    ],
    hints: [
      "Hnojivo dodává rostlinám na poli živiny. Kam se dostane, když zaprší?",
      "Déšť splachuje hnojivo z pole do rybníka. Zvaž, komu ve vodě ty živiny pomůžou růst a množit se. Hnojivo nic nebarví a neobsahuje semínka.",
    ],
    explanation: "Hnojiva se z pole splaví do rybníka. Pro sinice jsou to živiny, a tak se přemnoží a vznikne vodní květ.",
  },
  {
    q: "Malá obec vypouští odpadní vody z domácností do rybníka uprostřed vesnice. Co se tam v létě může stát?",
    correct: "Sinice se díky živinám přemnoží a voda zezelená",
    distractors: [
      { value: "Sinice vyhynou, protože potřebují čistou vodu", why: "Sinice čistou vodu nepotřebují. Živiny z odpadních vod jim naopak pomáhají rychle se množit." },
      { value: "Na hladině rozkvetou lekníny z odpadních vod", why: KVET },
      { value: "Nic se nestane, sinice živiny z vody nepotřebují", why: "Sinice živiny z vody potřebují. Čím víc jich je, tím rychleji se množí." },
    ],
    hints: [
      "Odpadní vody obsahují hodně živin. Co udělají živiny a letní teplo s organismy v rybníce?",
      "Odpadní vody působí podobně jako hnojivo. V teplé stojaté vodě s mnoha živinami se některé drobné organismy začnou prudce množit. Lekníny z odpadu nerostou.",
    ],
    explanation: "Odpadní vody přinášejí do rybníka živiny. V létě se sinice díky nim přemnoží, voda zezelená a vznikne vodní květ.",
  },
  {
    q: "Úřad, který hlídá čistotu vody (hygienická stanice), hlásí, že voda na koupališti u přehrady je kvůli sinicím nevhodná ke koupání. Jak se zachováš?",
    correct: "Koupat se nebudu, dokud hygiena hlášení nezmění",
    distractors: [
      { value: "Koupat se nebudu, ale psa do vody pustím", why: "Sám se správně nekoupeš, ale psovi voda se sinicemi škodí také. Pes ji polyká a olizuje si ji ze srsti." },
      { value: "Koupat se budu, když voda nebude moc zelená", why: "Sinice nemusí být okem vidět. Hygiena vodu měří, a její hlášení je proto spolehlivější." },
      { value: "Koupat se budu, když se potom osprchuji", why: "Sprcha pomáhá po nechtěném koupání. Neznamená, že se ve vodním květu koupat smíš." },
    ],
    hints: [
      "Hygienická stanice vodu měří. Proč je její hlášení spolehlivější než pohled na vodu?",
      "Hygiena vydává hlášení, protože látky sinic mohou dráždit kůži celého těla. Sprcha jen pomáhá po nechtěném kontaktu. Zvaž, komu všemu taková voda škodí.",
    ],
    explanation: "Když hygiena hlásí, že je voda kvůli sinicím nevhodná ke koupání, nekoupej se a nepouštěj do ní ani psa. Sinice mohou škodit celé kůži a nemusí být ani vidět.",
  },
  {
    q: "Jakub měl po koupání v zeleném zakaleném rybníce vyrážku a svědění. Co ji nejspíš způsobilo?",
    correct: "Jedovaté látky přemnožených sinic",
    distractors: [
      { value: "Pyl z kvetoucích leknínů ve vodě", why: KVET },
      { value: "Chlorofyl, který sinice mají v buňkách", why: "Chlorofyl je neškodné zelené barvivo, mají ho i listy. Kůži dráždí jiné látky sinic." },
      { value: "Chladná voda, na kterou nebyl zvyklý", why: "Zelená zakalená voda je v létě teplá. Vyrážku způsobily jedovaté látky sinic." },
    ],
    hints: [
      "Zelená zakalená voda prozrazuje, co se v rybníce přemnožilo. Co to vylučuje do vody?",
      "Přemnožené sinice mohou uvolňovat do vody látky, které dráždí kůži. Zelené barvivo chlorofyl ani pyl to nedělají.",
    ],
    explanation: "Zelená zakalená voda je vodní květ. Mnohé sinice uvolňují jedovaté látky, které způsobují vyrážku, svědění a alergie.",
  },
  {
    q: "Maminka se ptá, jaké potíže hrozí dětem po koupání ve vodě plné sinic. Co jí odpovíš?",
    correct: "Vyrážka, svědění, alergie a potíže se zažíváním",
    distractors: [
      { value: "Žádné, protože sinice jsou pro lidi neškodné", why: NESKODNY },
      { value: "Jen spálení od slunce, sinice samy nic nedělají", why: "Spálení způsobuje slunce. Sinice navíc uvolňují látky, které dráždí kůži a škodí zažívání." },
      { value: "Jen rýma, protože voda se sinicemi je studená", why: STUDENA },
    ],
    hints: [
      "Sinice uvolňují do vody jedovaté látky. Kde na těle se jejich působení projeví?",
      "Látky ze sinic dráždí kůži a po spolknutí vody škodí i trávení. Hledej možnost, která jmenuje potíže s kůží i se zažíváním.",
    ],
    explanation: "Jedovaté látky sinic způsobují vyrážku, svědění, alergie a po spolknutí vody i zažívací potíže.",
  },
  {
    q: "Proč jsou sinice v přiměřeném množství užitečné pro život v rybníce?",
    correct: "Vyrábějí kyslík a jsou potravou drobných živočichů",
    distractors: [
      { value: "Nejsou užitečné, vodu jen otravují a kalí", why: "Jen přemnožené sinice škodí. Jinak vyrábějí kyslík a jsou potravou živočichů." },
      { value: "Spotřebovávají kyslík, a tím vodu čistí", why: "Sinice kyslík fotosyntézou vyrábějí. A spotřeba kyslíku vodu nečistí." },
      { value: "Kvetou a lákají do rybníka opylující hmyz", why: KVET },
    ],
    hints: [
      "Sinice dělají fotosyntézu. Co při ní vzniká a kdo to ve vodě potřebuje?",
      "Při fotosyntéze vzniká plyn, který ryby dýchají. Drobní vodní živočichové se navíc sinicemi živí. Sinice nekvetou.",
    ],
    explanation: "Sinice vyrábějí fotosyntézou kyslík a slouží jako potrava drobných vodních živočichů. Škodlivé jsou až při přemnožení.",
  },
  {
    q: "Na vlhké stinné straně kmene buku roste modrozelený povlak se sinicemi. Proč na suchém písku na slunci neroste souvislý modrozelený povlak?",
    correct: "V suchém písku chybí vlhko, které sinice potřebují",
    distractors: [
      { value: "Na slunci je moc světla a sinice světlo nesnášejí", why: "Sinice světlo potřebují k fotosyntéze. Na slunečném písku jim chybí voda." },
      { value: "Sinice žijí jen na stromech jako jejich cizopasníci", why: "Sinice nejsou cizopasníci a stromům nic neberou. Na kůře najdou vlhko." },
      { value: "V písku chybí houby, bez kterých sinice nežijí", why: "S houbou žijí sinice hlavně v lišejníku. Většina sinic žije bez hub." },
    ],
    hints: [
      "Porovnej vlhkou kůru stromu a suchý písek. Co má kůra navíc?",
      "Povlak k růstu potřebuje dvě věci: světlo a vodu. Světla je na slunečném písku dost, takže rozhoduje ta druhá podmínka.",
    ],
    explanation: "Sinice rostou a množí se jen za vlhka, v suchu jen přečkávají. Na vlhké kůře mají vodu i světlo, na suchém písku jim voda chybí.",
  },
  {
    q: "Kristýna chce v létě plavat v zatopeném lomu. Jak si předem ověří, jestli voda není plná sinic?",
    correct: "Podívá se na hlášení hygieny o kvalitě vody",
    distractors: [
      { value: "Ochutná vodu, jestli není hořká", why: "Vodu s možnými sinicemi nikdy neochutnávej. Jedovaté látky nepoznáš chutí." },
      { value: "Podívá se, jestli na hladině kvetou lekníny", why: KVET },
      { value: "Nic, protože v lomech sinice nežijí", why: "Sinice žijí ve všech sladkých vodách, i v zatopených lomech." },
    ],
    hints: [
      "Kdo v létě pravidelně měří, jak čistá je voda ke koupání?",
      "Sinice nemusí být okem vidět a chutí je nepoznáš. Spolehlivé je měření vody, které zveřejňuje úřad pro zdraví.",
    ],
    explanation: "Hygienická stanice v létě měří vodu ke koupání a hlásí výskyt sinic. Taková informace je spolehlivější než pohled nebo chuť.",
  },
  {
    q: "Pan Svoboda chce ze zeleného zakaleného rybníka napustit dětský bazének. Co mu poradíš?",
    correct: "Bazének z rybníka nenapouštět, sinice by v něm zůstaly",
    distractors: [
      { value: "Bazének napustit, sinice se v něm samy ztratí", why: "Sinice se v bazénku neztratí. V teplé vodě na slunci se mohou dál množit." },
      { value: "Bazének napustit, když voda den postojí na slunci", why: STUDENA },
      { value: "Bazének napustit, když vyloví zelené chuchvalce", why: "Většina sinic je tak malá, že je nevyloviš. Jedovaté látky zůstanou ve vodě." },
    ],
    hints: [
      "Zelená zakalená voda obsahuje sinice. Zmizí, když vodu přelijeme jinam?",
      "Sinice jsou z velké části okem neviditelné a v teplé vodě na slunci se dál množí. Jejich látky dráždí dětskou kůži.",
    ],
    explanation: "Voda z rybníka s vodním květem obsahuje sinice i jejich jedovaté látky. V bazénku se neztratí, naopak se na slunci dál množí. Proto ji nepoužívej.",
  },
  {
    q: "Proč vodní květ vzniká spíš v rybníce než v rychle tekoucí řece?",
    correct: "V rybníce voda stojí, a tak se tam sinice hromadí",
    distractors: [
      { value: "V řece je voda teplejší a sinice teplo nesnášejí", why: "Rychle tekoucí řeka bývá chladnější než rybník. A sinicím teplo naopak svědčí." },
      { value: "V rybníce kvetou lekníny a jejich pyl vytvoří květ", why: KVET },
      { value: "V řece je víc živin a těch mají sinice příliš mnoho", why: "Víc živin by sinicím naopak pomohlo. V řece je proud odnáší dřív, než se přemnoží." },
    ],
    hints: [
      "Porovnej, jak se pohybuje voda v řece a v rybníce.",
      "Zamysli se, co se v řece děje s drobnými organismy ve vodě a jak dlouho zůstanou na jednom místě.",
    ],
    explanation: "Ve stojaté vodě rybníka zůstávají sinice na místě a v teple se přemnoží. V řece je proud odnáší.",
  },
  {
    q: "V akváriu u okna se objevil modrozelený slizký povlak. Co to nejspíš je?",
    correct: "Sinice, kterým svědčí světlo a živiny",
    distractors: [
      { value: "Plíseň, která roste díky světlu", why: "Plíseň je houba a fotosyntézu nedělá. Světlo jí k růstu nepomáhá." },
      { value: "Mech, který prorostl ze dna", why: "Mech má lístky a lodyžky, netvoří slizký povlak na skle." },
      { value: "Pyl, který napadal z pokojovek", why: KVET },
    ],
    hints: [
      "Všimni si barvy povlaku a toho, kde akvárium stojí.",
      "Modrozelená barva prozrazuje dvě barviva, zelené a modré. Akvárium u okna má hodně světla a ve vodě bývá dost živin z krmení.",
    ],
    explanation: "Modrozelený slizký povlak jsou sinice. U okna mají hodně světla a z krmení dost živin, a tak se rychle množí.",
  },
  {
    q: "Kamarád tvrdí, že sinice jsou jen škodlivé a bylo by nejlepší je všechny vyhubit. Co mu odpovíš?",
    correct: "Nemá pravdu, sinice vyrábějí kyslík a živí živočichy",
    distractors: [
      { value: "Má pravdu, sinice kyslík jen spotřebovávají", why: "Sinice kyslík fotosyntézou vyrábějí. Jsou jedním z jeho důležitých zdrojů." },
      { value: "Má pravdu, sinice žijí jen ve vodním květu", why: "Sinice žijí i ve vlhké půdě, na kůře stromů a v lišejnících. Většinou nikomu neškodí." },
      { value: "Nemá pravdu, sinice jsou rostliny a zdobí vodu", why: ROSTLINA },
    ],
    hints: [
      "Škodí sinice pořád, nebo jen když se přemnoží?",
      "Škodlivý je až vodní květ. Jinak sinice dělají fotosyntézu a jsou součástí potravy ve vodě. Sinice nejsou rostliny.",
    ],
    explanation: "Sinice škodí jen při přemnožení. Jinak vyrábějí kyslík a jsou potravou drobných živočichů, takže je příroda potřebuje.",
  },
  {
    q: "Lukáš má po koupání v zeleném zakaleném rybníce svědivou vyrážku, která se pořád horší. Co je nejrozumnější?",
    correct: "Umýt kůži čistou vodou a ukázat vyrážku lékaři",
    distractors: [
      { value: "Vyrážku poškrábat, aby svědění rychleji přešlo", why: "Škrábání kůži ještě víc podráždí a rána se může zanítit. Kůži umyj a zhoršující se vyrážku ukaž lékaři." },
      { value: "Vykoupat se znovu, rybník vyrážku zase opláchne", why: "Vyrážku způsobila právě voda z rybníka. Další koupání v ní potíže jen zhorší." },
      { value: "Namazat kůži opalovacím krémem a dál nic neřešit", why: "Opalovací krém chrání před sluncem, látky sinic z kůže neodstraní. Vyrážka, která se horší, patří k lékaři." },
    ],
    hints: [
      "Vyrážku způsobily látky z vody. Co s nimi na kůži uděláš a kdo posoudí, že se potíže horší?",
      "Nejdřív je potřeba odstranit z kůže to, co ji dráždí, a to vodou bez sinic. Když se potíže nelepší, nerozhoduj sám a obrať se na odborníka.",
    ],
    explanation: "Kůži umyj čistou vodou, aby na ní nezůstaly látky sinic. Vyrážka, která se horší, patří k lékaři. Škrábání i další koupání potíže zhorší.",
  },
  {
    q: "Eliška u rybníka nabere vodu do průhledné sklenice a prohlédne si ji proti světlu. Co v ní uvidí, pokud je v rybníce vodní květ?",
    correct: "Drobná zelená zrníčka, která se vznášejí ve vodě",
    distractors: [
      { value: "Průzračnou vodu s několika lístky okřehku", why: "Okřehek je drobná rostlina s lístky, ne sinice. Při vodním květu voda průzračná není." },
      { value: "Žlutý prášek z pylu usazený na dně sklenice", why: "Pyl patří rostlinám a s vodním květem nesouvisí. Vodní květ tvoří drobné kolonie sinic." },
      { value: "Několik drobných korýšů, kteří ve vodě poskakují", why: "Poskakující drobní korýši, například perloočky, žijí v mnoha rybnících. Vodní květ tvoří nepohyblivá zelená zrníčka sinic." },
    ],
    hints: [
      "Vodní květ tvoří obrovské množství drobných organismů. Jakou barvu mají a jak se ve vodě chovají?",
      "Kolonie sinic jsou tak malé, že je okem vidíš jen jako tečky, a samy neskáčou. Voda s nimi ztrácí průzračnost.",
    ],
    explanation: "Ve vodě s vodním květem jsou vidět drobná zelená zrníčka jako krupice. Jsou to kolonie sinic a voda je kvůli nim zakalená.",
  },
];

// ── L3 (a) — poznej organismus z popisu znaků ───────────────────────────────
interface Organismus { nazev: string; jadro: boolean; chlorofyl: boolean; popis: string; }
export const ORGANISMY: Organismus[] = [
  { nazev: "Sinice", jadro: false, chlorofyl: true, popis: "nemá buněčné jádro, ale má zelené barvivo chlorofyl" },
  { nazev: "Hnilobná bakterie", jadro: false, chlorofyl: false, popis: "nemá buněčné jádro a nemá ani chlorofyl" },
  { nazev: "Zelená řasa", jadro: true, chlorofyl: true, popis: "má buněčné jádro a má zelené barvivo chlorofyl" },
  { nazev: "Trepka", jadro: true, chlorofyl: false, popis: "má buněčné jádro, ale nemá chlorofyl" },
];
const MISTA = ["v tůni u lesa", "v rybníce za školou", "v příkopu u silnice", "v zahradním jezírku", "ve slepém rameni řeky"];

function rozdil(o: Organismus, a: Organismus): string {
  const v: string[] = [];
  if (o.jadro !== a.jadro) {
    v.push(`${o.nazev} ${o.jadro ? "má" : "nemá"} buněčné jádro, organismus z popisu ${a.jadro ? "ho má" : "ho nemá"}.`);
  }
  if (o.chlorofyl !== a.chlorofyl) {
    v.push(`${o.nazev} ${o.chlorofyl ? "má" : "nemá"} chlorofyl, organismus z popisu ${a.chlorofyl ? "ho má" : "ho nemá"}.`);
  }
  if (o.chlorofyl && a.chlorofyl) v.push("Zelená barva sama nestačí, rozhoduje buněčné jádro.");
  return v.join(" ");
}

function genPoznej(): PracticeTask | null {
  const a = pick(ORGANISMY);
  const misto = pick(MISTA);
  const q = `V atlasu je popis drobného organismu, který žije ${misto}: ${a.popis}. Co je to za organismus?`;
  const vysvetleni = `Rozhodují dva znaky. Bez jádra jsou sinice a hnilobná bakterie, s jádrem zelená řasa a trepka. Chlorofyl mají sinice a zelená řasa, hnilobná bakterie ani trepka ho nemají. Organismus z popisu ${a.jadro ? "má" : "nemá"} buněčné jádro a ${a.chlorofyl ? "má" : "nemá"} chlorofyl, takže je to ${a.nazev.toLowerCase()}.`;
  return choice(
    q,
    a.nazev,
    ORGANISMY.filter((o) => o !== a).map((o) => ({ value: o.nazev, why: rozdil(o, a) })),
    {
      hints: [
        `Organismus ${misto} ${a.jadro ? "má" : "nemá"} buněčné jádro a chlorofyl ${a.chlorofyl ? "má" : "nemá"}. Které dvě skupiny z nabídky jsou ${a.jadro ? "s jádrem" : "bez jádra"}?`,
        `U organismu ${misto} rozhoduj ve dvou krocích. Nejdřív vyřaď dvě skupiny, které buněčné jádro ${a.jadro ? "nemají" : "mají"}. Pak ze zbylých dvou vyber podle toho, že organismus chlorofyl ${a.chlorofyl ? "má" : "nemá"}, tedy ${a.chlorofyl ? "umí" : "neumí"} fotosyntézu.`,
      ],
      explanation: vysvetleni,
    },
  );
}

// ── L3 (b) — porovnej dvě vody ──────────────────────────────────────────────
interface Voda { nazev: string; misto: string; mesic: string; stav: string; }
export const RIZIKOVE: Voda[] = [
  { nazev: "mělkého rybníka u vesnice", misto: "mělký rybník u vesnice", mesic: "v srpnu", stav: "je teplá, stojí a stékají do ní hnojiva z polí" },
  { nazev: "rybníka uprostřed vesnice", misto: "rybník uprostřed vesnice", mesic: "v červenci", stav: "je teplá, stojí a vtékají do ní odpadní vody z obce" },
  { nazev: "zátoky přehrady", misto: "zátoka přehrady", mesic: "v srpnu", stav: "je teplá, stojí a přitékají do ní hnojiva z luk" },
  { nazev: "tůně u kukuřičného pole", misto: "tůň u kukuřičného pole", mesic: "v červenci", stav: "je teplá, stojí a déšť do ní splachuje hnojiva" },
  { nazev: "rybníka pod kravínem", misto: "rybník pod kravínem", mesic: "v srpnu", stav: "je teplá, stojí a stéká do ní hnůj z výběhu" },
  { nazev: "požární nádrže", misto: "požární nádrž za vsí", mesic: "v červenci", stav: "je teplá, stojí a vtékají do ní odpadní vody z chat" },
  { nazev: "jezírka v parku", misto: "mělké jezírko v parku", mesic: "v srpnu", stav: "je teplá, stojí a vtékají do ní odpadní vody z města" },
  { nazev: "slepého ramene řeky", misto: "slepé rameno řeky", mesic: "v červenci", stav: "je teplá, stojí a splavují se do ní hnojiva z polí" },
];
/**
 * Druhá voda se od rizikové liší JEN v jedné podmínce (`chybi`), takže úlohu
 * nerozhodne počítání „tři proti nule“: žák musí najít, v čem se vody liší.
 */
type Podminka = "ziviny" | "teplo" | "proud";
interface BezpecnaVoda extends Voda { chybi: Podminka; }
export const BEZPECNE: BezpecnaVoda[] = [
  { nazev: "zatopeného lomu v lese", misto: "zatopený lom v lese", mesic: "v srpnu", stav: "je teplá a stojí, ale nic do ní nestéká", chybi: "ziviny" },
  { nazev: "písníku uprostřed lesa", misto: "písník uprostřed lesa", mesic: "v červenci", stav: "je teplá a stojí, ale kolem nejsou pole ani domy", chybi: "ziviny" },
  { nazev: "rybníka pod polem", misto: "rybník pod polem", mesic: "v březnu", stav: "stojí a stékají do ní hnojiva, ale je ještě studená", chybi: "teplo" },
  { nazev: "tůně u pastviny", misto: "tůň u pastviny", mesic: "v dubnu", stav: "stojí a stéká do ní hnůj, ale je ještě studená", chybi: "teplo" },
  { nazev: "potoka pod vesnicí", misto: "potok pod vesnicí", mesic: "v srpnu", stav: "je teplá a vtékají do ní odpadní vody, ale rychle teče", chybi: "proud" },
  { nazev: "mlýnského náhonu u pole", misto: "mlýnský náhon u pole", mesic: "v červenci", stav: "je teplá a stékají do ní hnojiva, ale rychle proudí", chybi: "proud" },
];

const velke = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function podleRozdilu(chybi: Podminka, R: string, S: string) {
  switch (chybi) {
    case "ziviny":
      return {
        klic: `Ve vodě ${R}, protože do ní přicházejí živiny`,
        distraktory: [
          { value: `Ve vodě ${S}, protože čistá voda sinicím svědčí víc`, why: "Sinicím nesvědčí čistá voda, ale živiny. Bez jejich přísunu se nepřemnoží, i když je teplo." },
          { value: "Ve vodě A i B stejně, protože obě jsou teplé a stojaté", why: "Teplo a stojatá voda nestačí. Sinice se přemnoží jen tam, kde mají dost živin." },
          { value: `Ve vodě ${R}, protože je v ní víc světla`, why: `Voda ${R} je správně, ale ne kvůli světlu. Světla mají v létě obě vody dost, liší se přísunem živin.` },
        ],
        rozdil: `Obě vody jsou v létě teplé a stojí. Liší se přísunem živin: do vody ${R} se dostávají hnojiva nebo odpadní vody, do vody ${S} nic.`,
        proc: "nepřicházejí do ní živiny",
      };
    case "teplo":
      return {
        klic: `Ve vodě ${R}, protože je v ní dost tepla`,
        distraktory: [
          { value: `Ve vodě ${S}, protože na jaře se sinice množí nejrychleji`, why: "Na jaře je voda ještě studená a sinice se v ní množí pomalu. Přemnoží se až v létě v teple." },
          { value: "Ve vodě A i B stejně, protože do obou přicházejí živiny", why: "Živiny samy nestačí. Ve studené jarní vodě se sinice množí pomalu, vodní květ potřebuje i teplo." },
          { value: `Ve vodě ${R}, protože v ní voda stojí`, why: `Voda ${R} je správně, ale ne proto. Voda stojí v obou, liší se teplotou.` },
        ],
        rozdil: `Obě vody stojí a přicházejí do nich živiny. Liší se teplotou: voda ${R} je v létě teplá, voda ${S} je na jaře ještě studená.`,
        proc: "je ještě studená",
      };
    case "proud":
      return {
        klic: `Ve vodě ${R}, protože sinice v ní zůstávají na místě`,
        distraktory: [
          { value: `Ve vodě ${S}, protože proud jí přináší víc živin`, why: "Živiny mají obě vody. Proud ale sinice odnáší dřív, než se stačí přemnožit." },
          { value: "Ve vodě A i B stejně, protože obě jsou teplé a mají živiny", why: "Teplo a živiny nestačí. V rychle tekoucí vodě proud sinice odnáší a nenahromadí se." },
          { value: `Ve vodě ${R}, protože je v ní teplejší voda`, why: `Voda ${R} je správně, ale ne proto. Teplé jsou obě vody, liší se tím, jestli voda stojí, nebo teče.` },
        ],
        rozdil: `Obě vody jsou teplé a přicházejí do nich živiny. Liší se pohybem: voda ${R} stojí, voda ${S} rychle teče.`,
        proc: "rychle teče a proud sinice odnáší",
      };
  }
}

function genVody(): PracticeTask | null {
  const r = pick(RIZIKOVE);
  const b = pick(BEZPECNE);
  const rizikovaJeA = Math.random() < 0.5;
  const [A, B] = rizikovaJeA ? [r, b] : [b, r];
  const R = rizikovaJeA ? "A" : "B";
  const S = rizikovaJeA ? "B" : "A";
  const p = podleRozdilu(b.chybi, R, S);
  const q = `Porovnej dvě vody. Voda A je ${A.misto} ${A.mesic}: ${A.stav}. Voda B je ${B.misto} ${B.mesic}: ${B.stav}. Ve které z nich vznikne vodní květ spíš?`;
  return choice(q, p.klic, p.distraktory, {
    hints: [
      `Sinice se přemnoží, jen když platí tři podmínky naráz. Které z nich platí u ${A.nazev} a které u ${B.nazev}?`,
      `Projdi u ${A.nazev} i u ${B.nazev} teplotu, pohyb vody a přísun látek do vody. Co mají obě vody společné, nerozhoduje. Najdi podmínku, ve které se liší, a zkontroluj i důvod v odpovědi.`,
    ],
    solutionSteps: [
      "Vodní květ potřebuje tři podmínky naráz: teplo, stojatou vodu a přísun živin.",
      p.rozdil,
      `Ve vodě ${R} platí všechny tři podmínky, a proto tam vodní květ vznikne spíš.`,
    ],
    explanation: `Vodní květ vzniká jen tam, kde platí všechny tři podmínky naráz. ${velke(r.misto)} ${r.mesic} je splňuje všechny, ${b.misto} ${b.mesic} ne, protože ${p.proc}.`,
  });
}

// ── L3 (c) — znak → funkce nebo důsledek ────────────────────────────────────
export const POOL_L3_ZNAK: Polozka[] = [
  {
    q: "Sinice mají chlorofyl a na světle dělají fotosyntézu. Co z toho plyne pro vodu v rybníce během slunečného dne?",
    correct: "Přes den v ní přibývá kyslíku",
    distractors: [
      { value: "Přes den v ní ubývá kyslíku", why: "Při fotosyntéze se kyslík uvolňuje, takže ho přes den přibývá, ne ubývá." },
      { value: "Přes den v ní přibývá oxidu uhličitého", why: "Oxid uhličitý se při fotosyntéze spotřebovává. Přes den ho spíš ubývá." },
      { value: "Přes den se v ní rozpouští chlorofyl", why: "Chlorofyl zůstává v buňkách sinic. Do vody se neuvolňuje." },
    ],
    hints: [
      "Spoj dva kroky: co sinice na světle dělají a jaký plyn při tom vzniká?",
      "Fotosyntéza probíhá jen za světla. Při ní se jeden plyn z vody spotřebuje a druhý se do vody uvolní. Zeptej se, kterého plynu tedy za slunečného dne přibývá.",
    ],
    explanation: "Chlorofyl umožňuje fotosyntézu. Ta běží na světle a uvolňuje kyslík, takže ho ve vodě přes den přibývá.",
  },
  {
    q: "Vodní květ v rybníce koncem léta odumírá a klesá ke dnu. Proč tam mohou začít hynout ryby?",
    correct: "Při rozkladu mrtvých sinic ubývá kyslíku",
    distractors: [
      { value: "Mrtvé sinice ryby napadnou a sežerou", why: "Sinice ryby nežerou. Rybám škodí, že při rozkladu odumřelých sinic ubývá kyslíku." },
      { value: "Mrtvé sinice uvolní příliš mnoho kyslíku", why: "Mrtvé sinice fotosyntézu nedělají. Při jejich rozkladu se kyslík naopak spotřebovává." },
      { value: "Voda se ochladí a ryby chlad nesnesou", why: "Ryby v našich rybnících chladnou vodu snášejí. Hynou kvůli nedostatku kyslíku." },
    ],
    hints: [
      "Mrtvé sinice na dně rozkládají bakterie. Co bakterie při rozkladu spotřebovávají?",
      "Rozkládající bakterie dýchají a berou z vody stejný plyn, jaký potřebují ryby. Když je mrtvých sinic obrovské množství, tohoto plynu ve vodě ubude.",
    ],
    explanation: "Odumřelé sinice rozkládají bakterie a spotřebovávají přitom kyslík. Když je sinic moc, kyslík ve vodě dojde a ryby se udusí.",
  },
  {
    q: "Sinice žijí v lišejníku spolu s houbou. Co z tohoto soužití získává houba?",
    correct: "Živiny, které sinice vyrobí fotosyntézou",
    distractors: [
      { value: "Oporu a úkryt, které jí sinice poskytuje", why: "Je to naopak: oporu a úkryt dává v lišejníku houba sinici. Houba od sinice dostává živiny." },
      { value: "Vodu, kterou jí sinice nasaje z okolí", why: "Vodu nasává a drží houba, ne sinice. Sinice houbě za to dává živiny." },
      { value: "Chlorofyl, díky kterému pak houba sama vyrábí živiny", why: "Houba chlorofyl nezíská a živiny si sama vyrábět neumí. Dostává od sinice hotové." },
    ],
    hints: [
      "Houba fotosyntézu neumí, sinice ano. Co tedy houbě chybí?",
      "Rozmysli si, kdo v soužití co umí: houba drží vodu a obaluje partnera, partner s chlorofylem vyrábí ze světla potravu a dělí se o ni.",
    ],
    explanation: "Houba neumí fotosyntézu, a tak od sinice dostává živiny. Sinice za to má u houby oporu, úkryt a vodu.",
  },
  {
    q: "Pod mikroskopem pozoruješ modrozelené buňky. Jsou zelené jako buňky listu, ale na rozdíl od nich v nich nenajdeš tmavé kulaté tělísko, které řídí život buňky. Kam tyto organismy patří?",
    correct: "Patří k bakteriím, přestože jsou zelené",
    distractors: [
      { value: "Patří k rostlinám, protože jsou zelené", why: "Tělísko, které v buňkách chybí, je buněčné jádro. Rostlinné buňky ho mají, takže buňky bez jádra k rostlinám nepatří, i když jsou zelené." },
      { value: "Patří k řasám, protože mají chlorofyl", why: "Chlorofyl mají řasy i sinice. Řasy ale mají buněčné jádro, tyto buňky ne." },
      { value: "Patří k prvokům, protože jsou drobné", why: "Prvoci mají buněčné jádro. Tyto buňky ho nemají, proto patří k bakteriím." },
    ],
    hints: [
      "Který znak je pro zařazení důležitější: barva, nebo stavba buňky?",
      "Nejdřív pojmenuj tělísko, které v buňkách chybí. Pak si vzpomeň, která skupina organismů ho také nemá, přestože je většinou bezbarvá.",
    ],
    explanation: "Tělísko, které řídí život buňky, je buněčné jádro. Organismy se řadí podle stavby buňky, a buňky bez jádra patří k bakteriím, i když mají chlorofyl. Jsou to sinice.",
  },
  {
    q: "Kde v hlubokém jezeře bude sinic nejvíc?",
    correct: "U hladiny, kam proniká nejvíc světla",
    distractors: [
      { value: "U dna, kde je voda nejstudenější", why: STUDENA },
      { value: "U dna v bahně, kde je tma a klid", why: "Ve tmě sinice fotosyntézu nezvládnou. Potřebují světlo, a to je u hladiny." },
      { value: "Všude stejně, na světle nezáleží", why: "Na světle sinicím záleží, bez něj fotosyntéza neběží. Hlouběji je ho méně." },
    ],
    hints: [
      "Spoj dva kroky: jak si sinice vyrábějí živiny a co k tomu potřebují?",
      "Zamysli se, jak se ve vodě s rostoucí hloubkou mění podmínky a která z nich je pro výrobu živin nezbytná.",
    ],
    explanation: "Světla ve vodě s hloubkou ubývá. Sinice ho potřebují k fotosyntéze, proto se drží u hladiny. Tam také vidíme vodní květ.",
  },
  {
    q: "Vodní květ vytvoří na hladině hustou zelenou vrstvu. Proč pod ní vodní rostliny na dně rostou hůř?",
    correct: "Vrstva sinic jim zastíní světlo",
    distractors: [
      { value: "Sinice se přisají na jejich kořeny", why: "Sinice nejsou cizopasníci a na kořeny se nepřisávají. Rostlinám berou světlo." },
      { value: "Sinice jim odeberou jejich chlorofyl", why: "Sinice mají vlastní chlorofyl a rostlinám ho neberou. Rostlinám chybí světlo." },
      { value: "Vrstva sinic ochladí vodu u dna", why: STUDENA },
    ],
    hints: [
      "Rostliny na dně potřebují k fotosyntéze totéž co sinice u hladiny. Co jim hustá vrstva nahoře vezme?",
      "Hustá vrstva na hladině funguje jako závěs. Rostliny na dně pak nemají dost toho, bez čeho fotosyntéza neběží.",
    ],
    explanation: "Hustá vrstva sinic na hladině zachytí světlo. Rostliny na dně ho pak mají málo a hůř dělají fotosyntézu.",
  },
];

// ── L3 (d) — rozhodni spor o neznámém případu ───────────────────────────────
export const POOL_L3_SPOR: Polozka[] = [
  {
    q: "Hygienická stanice (úřad, který hlídá čistotu vody) hlásí, že je v přehradě vodní květ. Tomáš říká, že stačí neponořit hlavu pod vodu. Eva říká, že se tam nemá koupat vůbec. Kdo má pravdu a proč?",
    correct: "Eva, protože látky sinic mohou dráždit kůži celého těla",
    distractors: [
      { value: "Tomáš, protože sinice škodí jen po spolknutí", why: "Spolknutá voda škodí zažívání, ale látky sinic dráždí i kůži. Neponoření hlavy proto nepomůže." },
      { value: "Tomáš, protože sinice škodí jen očím a uším", why: "Sinice nepůsobí jen na oči a uši. Jejich látky mohou dráždit kůži po celém těle." },
      { value: "Eva, protože voda v přehradě je moc studená", why: "Eva má pravdu, ale ne kvůli teplotě. Vodní květ vzniká v teplé vodě a škodí celé kůži." },
    ],
    hints: [
      "Zvaž nejdřív, kterou částí těla se ve vodě dotýkáš sinic. Pak posuď oba názory.",
      "Při koupání je ve vodě celé tělo, nejen hlava. Pozor, správná osoba musí mít i správný důvod.",
    ],
    explanation: "Pravdu má Eva. Jedovaté látky sinic mohou dráždit kůži celého těla, takže neponoření hlavy nepomůže. Okem nepoznáš, jestli jsou sinice jedovaté, proto se ve vodním květu nekoupe vůbec.",
  },
  {
    q: "Voda na koupališti vypadá průzračně, ale hygiena ji kvůli sinicím označila za nevhodnou. Petr říká, že je čistá, tak se koupat mohou. Lucie se chce řídit hlášením. Kdo má pravdu?",
    correct: "Lucie, protože sinice nemusí být okem vidět",
    distractors: [
      { value: "Petr, protože sinice jsou vždy vidět jako zeleň", why: "Na začátku přemnožení nemusí být sinice vidět. Hygiena je zjistí měřením." },
      { value: "Petr, protože v čisté vodě sinice nikdy nežijí", why: STUDENA },
      { value: "Lucie, protože v průzračné vodě je sinic nejvíc", why: "Lucie má pravdu, ale ne proto. Nejvíc sinic je v zelené zakalené vodě, jen je nemusí být vidět hned." },
    ],
    hints: [
      "Stačí se na vodu podívat, abys poznal, jestli v ní jsou sinice?",
      "Hygiena vodu zkoumá měřením, ne pohledem. Jedna buňka sinice je vidět jen mikroskopem. Posuď, čí důvod je pravdivý.",
    ],
    explanation: "Pravdu má Lucie. Sinice jsou drobné a na začátku přemnožení nemusí být vidět. Hlášení hygieny vychází z měření, proto je spolehlivější.",
  },
  {
    q: "Dědeček tvrdí, že zelený zakalený rybník v srpnu je zdravý, protože v něm kypí život. Vnučka Anna s tím nesouhlasí. Kdo má pravdu?",
    correct: "Anna, protože jde nejspíš o přemnožené sinice",
    distractors: [
      { value: "Dědeček, protože zelená voda má nejvíc kyslíku", why: "Přes den může mít zelená voda kyslíku hodně, ale v noci a při rozkladu odumřelých sinic ho prudce ubývá. Zelená zakalená voda zdravá není." },
      { value: "Dědeček, protože sinice ve vodě nikdy neškodí", why: NESKODNY },
      { value: "Anna, protože zelená voda je vždy otrávená", why: "Anna má pravdu, ale ne z tohoto důvodu. Zeleň vody nemusí vždy znamenat jed, zelená zakalená voda v létě ale bývá vodní květ." },
    ],
    hints: [
      "Spoj tři znaky ze zadání: zelená barva, zákal a srpen. Co prozrazují?",
      "Letní zelený zákal je typický znak jednoho jevu. Zvaž, jestli je ten jev pro vodu a lidi zdravý. Správná osoba musí mít i přesný důvod.",
    ],
    explanation: "Pravdu má Anna. Zelená zakalená voda v létě bývá vodní květ, tedy přemnožené sinice. Mohou uvolňovat jedovaté látky a při rozkladu odumřelých sinic ubývá ve vodě kyslíku.",
  },
  {
    q: "Na skle akvária i na kameni v potoce je zelený povlak. Honza tvrdí, že zelený povlak ve vodě tvoří vždycky sinice. Klára říká, že to může být i zelená řasa a rozhodne až mikroskop. Kdo má pravdu?",
    correct: "Klára, protože zelené jsou obě skupiny a liší se jádrem",
    distractors: [
      { value: "Honza, protože zelený povlak dělají jen sinice", why: "Zelený povlak dělají i zelené řasy, na kamenech dokonce často. Barva nerozhodne, rozhodne buněčné jádro." },
      { value: "Honza, protože zelené řasy žijí jen v moři", why: "Zelené řasy žijí i ve sladké vodě, v akváriu i na kamenech v potoce." },
      { value: "Klára, protože sinice nemají žádný chlorofyl", why: "Klára má pravdu, ale ne proto. Sinice chlorofyl mají, od řas je odlišuje chybějící jádro." },
    ],
    hints: [
      "Které organismy z učiva jsou zelené a mohou ve vodě tvořit povlak?",
      "Barva sama nerozhoduje. Vzpomeň si, co by bylo pod mikroskopem vidět uvnitř buňky u jedné a u druhé skupiny. Ověř i důvod vybrané osoby.",
    ],
    explanation: "Pravdu má Klára. Zelený povlak mohou tvořit sinice i zelené řasy, obě mají chlorofyl. Rozlišit je jde až pod mikroskopem: řasy mají buněčné jádro, sinice ne.",
  },
  {
    q: "Kůň na pastvině pije z tůně, kde je u břehu zelená kaše ze sinic. Farmář Otakar říká, že tak velkému zvířeti to neublíží. Veterinářka Jitka chce koně napájet jinde. Kdo má pravdu?",
    correct: "Jitka, protože látky sinic mohou uškodit i velkým zvířatům",
    distractors: [
      { value: "Otakar, protože velké zvíře takovou vodu vždy snese", why: "Velké tělo před jedy sinic neochrání. Kůň navíc pije velké množství vody každý den." },
      { value: "Otakar, protože zvířata závadnou vodu poznají a nepijí ji", why: "Zvířata vodní květ nepoznají. Psi, krávy i koně takovou vodu klidně pijí." },
      { value: "Jitka, protože kůň by vodu v tůni zakalil", why: "Jitka má pravdu, ale ne proto. Vodu zakalily sinice a koni škodí jejich jedovaté látky, které vypije." },
    ],
    hints: [
      "Zvaž, jestli velikost těla ochrání před jedem, který zvíře vypije s vodou.",
      "Zvíře pije znovu a znovu. Zamysli se, jestli jedy sinic přestanou působit ve velkém těle a jestli zvíře samo pozná, že voda škodí. Ověř i důvod vybrané osoby.",
    ],
    explanation: "Pravdu má Jitka. Sinice mohou uvolňovat jedovaté látky a zvíře je vypije s vodou. Velké tělo ho neochrání a samo zvíře závadnou vodu nepozná. Proto se napájí jinde.",
  },
  {
    q: "Ondra si myslí, že vodní květ vznikne v každém rybníce, kde žijí sinice. Marie tvrdí, že ne všude. Kdo má pravdu?",
    correct: "Marie, protože sinice se přemnoží jen v teple a s živinami",
    distractors: [
      { value: "Marie, protože sinice se přemnoží jen ve studené vodě", why: STUDENA },
      { value: "Ondra, protože sinice se množí pořád stejně rychle", why: "Rychlost množení sinic závisí na teplotě, světle a živinách. Proto vodní květ nevzniká všude." },
      { value: "Ondra, protože vodní květ dělá pyl, který je všude", why: KVET },
    ],
    hints: [
      "Množí se sinice v zimě stejně rychle jako v létě?",
      "Sinice žijí v mnoha vodách, ale přemnoží se jen za určitých podmínek. Vzpomeň si, co musí voda mít a jaké má být počasí. Ověř i důvod u vybrané osoby.",
    ],
    explanation: "Pravdu má Marie. Sinice žijí v mnoha vodách, ale přemnoží se jen v teplé stojaté vodě s dostatkem živin.",
  },
];

// ── Generátor ───────────────────────────────────────────────────────────────
const vytvor = (p: Polozka): PracticeTask | null =>
  choice(p.q, p.correct, p.distractors, { hints: p.hints, explanation: p.explanation });

/** Deterministicky projde celou banku úrovně — každá položka dá jednu úlohu. */
function zBanky(pool: Polozka[]): PracticeTask[] {
  let i = 0;
  return ruzneUlohy(() => losUlohy(() => vytvor(pool[i++ % pool.length])), pool.length, pool.length);
}

function gen(level: number): PracticeTask[] {
  if (level <= 1) return zBanky(POOL_L1);
  if (level === 2) return zBanky(POOL_L2);
  // L3: čtyři šablony se střídají rovnoměrně. Počítadlo žije jen uvnitř gen().
  let k = 0;
  let iZnak = 0;
  let iSpor = 0;
  const sablony: (() => PracticeTask | null)[] = [
    genPoznej,
    genVody,
    () => vytvor(POOL_L3_ZNAK[iZnak++ % POOL_L3_ZNAK.length]),
    () => vytvor(POOL_L3_SPOR[iSpor++ % POOL_L3_SPOR.length]),
  ];
  return ruzneUlohy(() => losUlohy(sablony[k++ % sablony.length]));
}

// ── Topic ───────────────────────────────────────────────────────────────────
export const SINICE_VYSKYT_VYZNAM: TopicMetadata[] = [
  {
    id: "g6-pri-sinice-vyskyt-vyznam-6",
    rvpNodeId: "g6-prirodopis-nebunecni-a-bakterie-sinice-a-prvoci-sinice-vyskyt-vyznam",
    displayName: "Sinice a vodní květ",
    title: "Sinice - výskyt a význam",
    studentTitle: "Sinice a vodní květ",
    subject: "prirodopis",
    category: "Nebuněční a bakterie",
    topic: "Sinice a prvoci",
    briefDescription: "Kde žijí sinice, k čemu jsou dobré a proč pozor na vodní květ.",
    keywords: [
      "sinice", "vodní květ", "chlorofyl", "fotosyntéza", "kyslík", "buněčné jádro",
      "lišejník", "hnojiva", "koupání", "hygiena", "bakterie",
    ],
    goals: [
      "Poznat sinice podle znaků: nemají buněčné jádro, mají chlorofyl a vyrábějí kyslík.",
      "Vědět, kde sinice žijí a k čemu jsou v přírodě užitečné.",
      "Vysvětlit, proč vzniká vodní květ, a rozhodnout, jestli se v takové vodě koupat.",
    ],
    boundaries: [
      "Bez latinských názvů a bez pojmu prokaryota.",
      "Stavba buňky jen na úrovni „má / nemá jádro, má / nemá chlorofyl“.",
      "Zdravotní rady jen bezpečné: nekoupat se, psa do vody nepouštět, osprchovat se.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Sinice nemají buněčné jádro, ale mají chlorofyl a vyrábějí kyslík. Vodní květ je jejich přemnožení v teplé stojaté vodě s hodně živinami.",
      steps: [
        "Organismus poznáš podle dvou znaků: má buněčné jádro? Má chlorofyl?",
        "U vody zkontroluj teplo, stojatou vodu a přísun živin (hnojiva, odpadní vody).",
        "Když je voda zelená a zakalená nebo to hlásí hygiena, nekoupej se a psa do vody nepouštěj.",
      ],
      commonMistake: "Myslet si, že sinice jsou rostliny, protože jsou zelené, nebo že ve vodním květu stačí neponořit hlavu pod vodu.",
      example: "Mělký rybník v srpnu, do kterého stékají hnojiva, se spíš zazelená než studená horská bystřina v dubnu.",
    },
  },
];
