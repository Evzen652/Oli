/**
 * Přírodověda 4. ročník — Bezobratlí a obratlovci (úvodní třídění).
 *
 * Přepsáno 2026-09-11. Předchozí verze měla na všech třech úrovních stejný
 * typ úlohy bez nápověd a vysvětlení a obsahovala věcné chyby: stonožka
 * zařazená jako hmyz (stonožka hmyz není — má mnohem víc nohou),
 * neexistující „kapr stříbřitý“ a „jezerní kapr“, skupinu ostnokožců
 * a hatérii novozélandskou, které 4. ročník nezná, a nejednotné názvy
 * skupin (jednou „Pták“, jindy „Ryby“).
 *
 * Všechny úlohy jsou match_pairs (téma typy nemíchá). Každá úloha má právě
 * jedno úplné přiřazení — na pravé straně se žádná skupina neopakuje.
 *
 * Gradace:
 *  • L1 — typičtí obratlovci a hmyz: kapr, kos, liška, včela.
 *  • L2 — skupiny bezobratlých (pavoukovci, měkkýši, korýši, červi)
 *         a první zvířata, která klamou (slepýš, stínka, netopýr).
 *  • L3 — znaky, podle kterých se třídí, vývoj mláďat, dýchání a zvířata,
 *         jejichž vzhled nebo prostředí svádí k chybě.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { match, shuffle } from "./_shared";

const Q_GROUP = "Spoj živočicha se skupinou, do které patří.";
const g = (...p: [string, string][]) => p.map(([left, right]) => ({ left, right }));

const POOL_L1: PracticeTask[] = [
  match(Q_GROUP, g(["Kapr", "Ryby"], ["Skokan", "Obojživelníci"], ["Ještěrka", "Plazi"], ["Kos", "Ptáci"]), {
    hints: ["Začni tím, kdo dýchá žábrami.", "Kos má peří, ještěrka suchou kůži se šupinami a skokan holou vlhkou kůži a mládě pulce."],
    explanation: "Kapr dýchá žábrami — ryba. Skokan má holou vlhkou kůži a vyvíjí se z pulce — obojživelník. Ještěrka má suchou šupinatou kůži — plaz. Kos má peří — pták.",
  }),
  match(Q_GROUP, g(["Štika", "Ryby"], ["Ropucha", "Obojživelníci"], ["Užovka", "Plazi"], ["Liška", "Savci"]), {
    hints: ["Kdo z nich má srst?", "Užovka je had se šupinami. Ropucha klade vajíčka do vody, štika v ní celý život plave."],
    explanation: "Štika je dravá ryba. Ropucha je obojživelník, klade vajíčka do vody. Užovka je had, tedy plaz. Liška má srst a kojí mláďata — savec.",
  }),
  match(Q_GROUP, g(["Pstruh", "Ryby"], ["Čolek", "Obojživelníci"], ["Sýkora", "Ptáci"], ["Ježek", "Savci"]), {
    hints: ["Kdo z nich má bodliny, pod kterými je srst?", "Sýkora létá a má peří. Čolek žije na jaře v tůni a pstruh v horském potoce."],
    explanation: "Pstruh je ryba potoků. Čolek je obojživelník, na jaře žije ve vodě. Sýkora je pták. Ježek je savec — bodliny jsou přeměněné chlupy a mláďata kojí.",
  }),
  match(Q_GROUP, g(["Zmije", "Plazi"], ["Vrabec", "Ptáci"], ["Srnec", "Savci"], ["Lín", "Ryby"]), {
    hints: ["Který z nich je had?", "Vrabec má peří, srnec srst a lín žije v bahnitém rybníce."],
    explanation: "Zmije je jedovatý had, tedy plaz. Vrabec je pták, srnec savec a lín ryba.",
  }),
  match(Q_GROUP, g(["Včela", "Hmyz"], ["Pes", "Savci"], ["Holub", "Ptáci"], ["Želva", "Plazi"]), {
    hints: ["Kdo z nich má šest nohou?", "Želva má krunýř a šupiny a klade vejce. Holub má peří a pes srst."],
    explanation: "Včela má šest nohou a tři části těla — hmyz. Pes je savec, holub pták. Želva je plaz — má krunýř a šupiny a klade vejce.",
  }),
  match(Q_GROUP, g(["Motýl", "Hmyz"], ["Veverka", "Savci"], ["Čáp", "Ptáci"], ["Mlok", "Obojživelníci"]), {
    hints: ["Mlok vypadá jako ještěrka, ale má holou vlhkou kůži.", "Motýl se vylíhne z kukly a má šest nohou. Veverka má huňatý ocas a čáp dlouhý zobák a peří."],
    explanation: "Motýl je hmyz. Veverka je savec a čáp pták. Mlok vypadá jako ještěrka, ale má holou vlhkou kůži a jeho larvy žijí ve vodě — je to obojživelník.",
  }),
  match(Q_GROUP, g(["Mravenec", "Hmyz"], ["Kočka", "Savci"], ["Kachna", "Ptáci"], ["Candát", "Ryby"]), {
    hints: ["Který z nich žije celý život pod vodou?", "Mravenec má šest nohou, kachna peří a plovací blány a kočka srst."],
    explanation: "Mravenec je hmyz. Kočka je savec. Kachna plave, ale má peří — je to pták. Candát je ryba.",
  }),
  match(Q_GROUP, g(["Slunéčko sedmitečné", "Hmyz"], ["Kráva", "Savci"], ["Sova", "Ptáci"], ["Rosnička", "Obojživelníci"]), {
    hints: ["Rosnička je malá zelená žabka.", "Slunéčko je červený brouček se sedmi tečkami. Kráva dává mléko a sova v noci loví myši."],
    explanation: "Slunéčko je brouk, tedy hmyz. Kráva kojí tele mlékem — savec. Sova je pták. Rosnička je žába, tedy obojživelník.",
  }),
  match(Q_GROUP, g(["Čmelák", "Hmyz"], ["Zajíc", "Savci"], ["Okoun", "Ryby"], ["Krokodýl", "Plazi"]), {
    hints: ["Který z nich má tvrdé šupiny a klade vejce na břehu?", "Čmelák bzučí na květech, zajíc se pase na poli a okoun dýchá pod vodou žábrami."],
    explanation: "Čmelák je hmyz, zajíc savec a okoun ryba. Krokodýl je plaz — má tvrdé šupiny a klade vejce na souši, i když hodně času tráví ve vodě.",
  }),
  match(Q_GROUP, g(["Moucha", "Hmyz"], ["Kůň", "Savci"], ["Labuť", "Ptáci"], ["Žába", "Obojživelníci"]), {
    hints: ["Kdo z nich začíná život jako pulec?", "Moucha má šest nohou a křídla, kůň srst a labuť peří."],
    explanation: "Moucha je hmyz. Kůň je savec, labuť pták. Žába začíná život jako pulec ve vodě a dospělá žije i na souši — obojživelník.",
  }),
  match(Q_GROUP, g(["Kobylka", "Hmyz"], ["Medvěd", "Savci"], ["Datel", "Ptáci"], ["Sumec", "Ryby"]), {
    hints: ["Který z nich má vousy a žije na dně řeky?", "Kobylka skáče v trávě na šesti nohách. Medvěd má hustou srst a datel peří."],
    explanation: "Kobylka je hmyz. Medvěd je savec. Datel je pták. Sumec je velká ryba s vousy, žije u dna řek a rybníků.",
  }),
  match(Q_GROUP, g(["Vosa", "Hmyz"], ["Jelen", "Savci"], ["Káně", "Ptáci"], ["Chameleon", "Plazi"]), {
    hints: ["Který z nich mění barvu kůže?", "Vosa má žihadlo a šest nohou, jelen parohy a srst a káně krouží nad polem."],
    explanation: "Vosa je hmyz. Jelen je savec a káně dravý pták. Chameleon je plaz — má šupinatou kůži, kterou umí měnit barvu.",
  }),
];

const POOL_L2: PracticeTask[] = [
  match(Q_GROUP, g(["Pavouk křižák", "Pavoukovci"], ["Hlemýžď", "Měkkýši"], ["Rak říční", "Korýši"], ["Žížala", "Červi"]), {
    hints: ["Který z nich má osm nohou?", "Hlemýžď má měkké tělo a ulitu, rak tvrdý krunýř a klepeta a žížala tělo z článků bez nohou."],
    explanation: "Pavouk má osm nohou — pavoukovec. Hlemýžď má měkké tělo a ulitu — měkkýš. Rak má krunýř a klepeta — korýš. Žížala má článkované tělo — červ.",
  }),
  match(Q_GROUP, g(["Klíště", "Pavoukovci"], ["Slimák", "Měkkýši"], ["Moucha", "Hmyz"], ["Pijavka", "Červi"]), {
    hints: ["Klíště vypadá jako brouček, ale spočítej mu nohy.", "Klíště má osm nožek jako pavouk. Slimák je hlemýžď bez ulity a pijavka žije ve vodě a přisává se."],
    explanation: "Klíště má osm nožek, je to pavoukovec, ne hmyz. Slimák je měkkýš bez ulity. Moucha má šest nohou — hmyz. Pijavka je červ.",
  }),
  match(Q_GROUP, g(["Sekáč", "Pavoukovci"], ["Škeble", "Měkkýši"], ["Slunéčko", "Hmyz"], ["Stínka", "Korýši"]), {
    hints: ["Stínka žije pod kameny na zahradě — ale příbuzná je s rakem.", "Sekáč má dlouhé nohy a je jich osm. Škeble má dvě lastury a slunéčko je brouk."],
    explanation: "Sekáč má osm dlouhých nohou — pavoukovec. Škeble je měkkýš se dvěma lasturami. Slunéčko je hmyz. Stínka žije na souši, ale je to korýš, příbuzný raka.",
  }),
  match(Q_GROUP, g(["Štír", "Pavoukovci"], ["Chobotnice", "Měkkýši"], ["Krab", "Korýši"], ["Komár", "Hmyz"]), {
    hints: ["Chobotnice nemá kosti ani ulitu, ale je příbuzná s hlemýžděm.", "Štír má osm nohou jako pavouk, krab krunýř a klepeta a komár šest nohou a křídla."],
    explanation: "Štír má osm nohou — pavoukovec. Chobotnice má měkké tělo — měkkýš. Krab má krunýř a klepeta — korýš. Komár je hmyz.",
  }),
  match(Q_GROUP, g(["Slepýš", "Plazi"], ["Netopýr", "Savci"], ["Mlok", "Obojživelníci"], ["Tučňák", "Ptáci"]), {
    hints: ["Slepýš vypadá jako had, ale je to ještěrka bez nohou.", "Netopýr létá, ale má srst. Tučňák nelétá, ale má peří. Mlok má holou vlhkou kůži."],
    explanation: "Slepýš je beznohá ještěrka — plaz. Netopýr má srst a kojí — savec. Mlok má holou vlhkou kůži — obojživelník. Tučňák má peří — pták.",
  }),
  match(Q_GROUP, g(["Velryba", "Savci"], ["Žralok", "Ryby"], ["Želva", "Plazi"], ["Čolek", "Obojživelníci"]), {
    hints: ["Dvě zvířata žijí v moři, ale jen jedno dýchá žábrami.", "Velryba se chodí nadechovat k hladině a kojí mládě. Želva má krunýř a čolek holou kůži."],
    explanation: "Velryba dýchá plícemi a kojí — savec. Žralok dýchá žábrami — ryba. Želva je plaz s krunýřem. Čolek je obojživelník.",
  }),
  match(Q_GROUP, g(["Kudlanka", "Hmyz"], ["Skákavka", "Pavoukovci"], ["Krevetka", "Korýši"], ["Plzák", "Měkkýši"]), {
    hints: ["Plzák je velký slimák ze zahrady.", "Kudlanka má šest nohou a přední nohy jako kudly. Skákavka je malý pavouk a krevetka má tenký krunýř."],
    explanation: "Kudlanka je hmyz. Skákavka je malý skákající pavouk — pavoukovec. Krevetka má krunýř — korýš. Plzák je slimák — měkkýš.",
  }),
  match(Q_GROUP, g(["Vážka", "Hmyz"], ["Slíďák", "Pavoukovci"], ["Humr", "Korýši"], ["Slávka", "Měkkýši"]), {
    hints: ["Slávka je mořská mušle se dvěma lasturami.", "Vážka má šest nohou a čtyři křídla. Slíďák je pavouk, který loví na zemi, a humr má velká klepeta."],
    explanation: "Vážka je hmyz. Slíďák je pavouk — pavoukovec. Humr má krunýř a klepeta — korýš. Slávka je mušle — měkkýš.",
  }),
  match(Q_GROUP, g(["Losos", "Ryby"], ["Rak", "Korýši"], ["Klíště", "Pavoukovci"], ["Včela", "Hmyz"]), {
    hints: ["Jen jeden z nich má páteř.", "Rak má krunýř, klíště osm nožek a včela šest nohou."],
    explanation: "Losos je ryba, jediný obratlovec z této čtveřice. Rak je korýš, klíště pavoukovec a včela hmyz — všichni tři jsou bezobratlí.",
  }),
  match(Q_GROUP, g(["Užovka", "Plazi"], ["Žížala", "Červi"], ["Chobotnice", "Měkkýši"], ["Moucha", "Hmyz"]), {
    hints: ["Užovka i žížala jsou dlouhé a nemají nohy. Jen jedna z nich má páteř.", "Užovka má šupiny a uvnitř kostru s páteří. Žížala je měkká, kostru nemá a její tělo se skládá z kroužků — článků."],
    explanation: "Užovka je had s kostrou — plaz. Žížala nemá kostru, tělo má z článků — červ. Chobotnice je měkkýš a moucha hmyz.",
  }),
  match(Q_GROUP, g(["Ptakopysk", "Savci"], ["Pštros", "Ptáci"], ["Mořský koník", "Ryby"], ["Mlok", "Obojživelníci"]), {
    hints: ["Mořský koník vypadá jako šachová figurka, ale dýchá žábrami.", "Ptakopysk sice klade vejce, ale mláďata kojí a má srst. Pštros nelétá, ale má peří. Mlok má holou vlhkou kůži."],
    explanation: "Ptakopysk kojí a má srst — savec. Pštros má peří — pták. Mořský koník dýchá žábrami — je to ryba. Mlok je obojživelník.",
  }),
  match(Q_GROUP, g(["Delfín", "Savci"], ["Slepýš", "Plazi"], ["Úhoř", "Ryby"], ["Blecha", "Hmyz"]), {
    hints: ["Úhoř vypadá jako had, ale dýchá žábrami.", "Delfín se chodí nadechovat na hladinu, slepýš je ještěrka bez nohou a blecha skáče na šesti nohách."],
    explanation: "Delfín je savec. Slepýš je plaz. Úhoř je ryba, i když vypadá jako had. Blecha je hmyz.",
  }),
];

const Q_SIGN = "Spoj živočicha se znakem, podle kterého ho zařadíš.";
const Q_TRICK = "Spoj zvíře se skupinou. Nenech se zmást tím, jak vypadá nebo kde žije.";

const POOL_L3: PracticeTask[] = [
  match(Q_SIGN, g(["Moucha", "Šest nohou a tykadla"], ["Pavouk", "Osm nohou, bez tykadel"], ["Hlemýžď", "Měkké tělo a ulita"], ["Rak", "Krunýř a klepeta"]), {
    hints: ["Začni tím, že spočítáš nohy.", "Hmyz má šest nohou, pavoukovci osm. Kdo z nich nohy nemá vůbec a nosí domeček?"],
    explanation: "Hmyz (moucha) má šest nohou a tykadla. Pavoukovci (pavouk) mají osm nohou a tykadla nemají. Měkkýši (hlemýžď) mají měkké tělo, často s ulitou. Korýši (rak) mají krunýř a klepeta.",
  }),
  match(Q_SIGN, g(["Kapr", "Šupiny a žábry"], ["Kos", "Peří a zobák"], ["Liška", "Srst a kojení"], ["Ještěrka", "Suchá kůže se šupinami"]), {
    hints: ["Dvě zvířata mají šupiny. Jen jedno z nich žije ve vodě.", "Kos má něco, co nemá nikdo jiný ze čtveřice. Liška krmí mláďata tak, jak to umějí jen savci."],
    explanation: "Ryby (kapr) mají šupiny a dýchají žábrami. Ptáci (kos) mají peří a zobák. Savci (liška) mají srst a kojí. Plazi (ještěrka) mají suchou kůži se šupinami a dýchají plícemi.",
  }),
  match(Q_SIGN, g(["Skokan", "Holá vlhká kůže"], ["Užovka", "Suchá kůže se šupinami"], ["Pstruh", "Dýchá žábrami"], ["Holub", "Tělo pokryté peřím"]), {
    hints: ["Skokan i užovka žijí u vody. Čím se liší jejich kůže?", "Žába je na dotek slizká a vlhká, had suchý a šupinatý. Kdo z nich nedýchá plícemi?"],
    explanation: "Obojživelníci (skokan) mají holou vlhkou kůži. Plazi (užovka) mají suchou kůži se šupinami. Ryby (pstruh) dýchají žábrami. Ptáci (holub) mají peří.",
  }),
  match(Q_SIGN, g(["Žížala", "Tělo z článků, bez nohou"], ["Klíště", "Osm nožek"], ["Slimák", "Měkké tělo bez ulity"], ["Brouk", "Šest nohou a tvrdé krovky"]), {
    hints: ["Klíště je malé, ale počet nožek ho prozradí.", "Žížala se skládá z kroužků. Slimák je jako hlemýžď, jen bez domečku. Brouk má na zádech tvrdé krytky."],
    explanation: "Žížala je červ s tělem z článků. Klíště má osm nožek — pavoukovec. Slimák je měkkýš bez ulity. Brouk je hmyz se šesti nohama a tvrdými krovkami.",
  }),
  match("Spoj skupinu živočichů s jejím znakem.", g(["Obratlovci", "Páteř uvnitř těla"], ["Hmyz", "Šest nohou"], ["Pavoukovci", "Osm nohou"], ["Měkkýši", "Měkké tělo, často s ulitou"]), {
    hints: ["Podle čeho se obratlovci jmenují?", "Obratle tvoří páteř. Pak spočítej nohy u hmyzu a pavouka a vzpomeň si na hlemýždě."],
    explanation: "Obratlovci mají páteř složenou z obratlů. Hmyz má šest nohou, pavoukovci osm. Měkkýši mají měkké tělo bez kostry, často chráněné ulitou.",
  }),
  match(Q_TRICK, g(["Velryba", "Savci"], ["Slepýš", "Plazi"], ["Mořský koník", "Ryby"], ["Stínka", "Korýši"]), {
    hints: ["Každé z těch zvířat vypadá jako něco jiného, než je.", "Velryba vypadá jako ryba, slepýš jako had, mořský koník jako koník a stínka jako brouk. Rozhoduj podle toho, jak dýchají a jaké mají tělo."],
    explanation: "Velryba dýchá plícemi a kojí — savec. Slepýš je beznohá ještěrka — plaz. Mořský koník dýchá žábrami — ryba. Stínka má krunýř a mnoho nožek — korýš.",
  }),
  match(Q_TRICK, g(["Netopýr", "Savci"], ["Tučňák", "Ptáci"], ["Úhoř", "Ryby"], ["Mlok", "Obojživelníci"]), {
    hints: ["Netopýr létá, tučňák ne. O zařazení to nerozhoduje.", "Rozhoduje tělo: srst, peří, žábry, nebo holá vlhká kůže. Kdo má co?"],
    explanation: "Netopýr má srst a kojí — savec. Tučňák má peří — pták. Úhoř dýchá žábrami — ryba. Mlok vypadá jako ještěrka, ale má holou vlhkou kůži — obojživelník.",
  }),
  match(Q_TRICK, g(["Pavouk", "Pavoukovci"], ["Ptakopysk", "Savci"], ["Želva", "Plazi"], ["Krab", "Korýši"]), {
    hints: ["Želva i krab mají tvrdý obal. Jen jedna z nich má páteř.", "Pavouk není hmyz, ptakopysk kojí a krab má klepeta. Kam tedy patří želva?"],
    explanation: "Pavouk má osm nohou — pavoukovec, ne hmyz. Ptakopysk kojí — savec. Želva má krunýř, ale i páteř a šupiny — plaz. Krab má krunýř a klepeta — korýš.",
  }),
  match(Q_SIGN, g(["Včela", "Tři části těla a šest nohou"], ["Štír", "Osm nohou a jedovatý ocas"], ["Chobotnice", "Měkké tělo s chapadly"], ["Krevetka", "Krunýř a mnoho nožek"]), {
    hints: ["Štír má klepeta, ale spočítej mu nohy.", "Včela má hlavu, hruď a zadeček. Chobotnice nemá kostru ani krunýř, krevetka má tenký krunýř."],
    explanation: "Včela je hmyz se třemi částmi těla a šesti nohama. Štír má osm nohou — pavoukovec. Chobotnice je měkkýš s chapadly. Krevetka je korýš s krunýřem.",
  }),
  match("Spoj živočicha s tím, jak se vyvíjejí jeho mláďata.", g(["Skokan", "Z vajíček se vylíhnou pulci ve vodě"], ["Motýl", "Housenka se zakuklí"], ["Kos", "Mládě se vylíhne z vejce v hnízdě"], ["Srnec", "Mládě se narodí a pije mléko"]), {
    hints: ["Kdo z nich prochází proměnou přes kuklu?", "Žába začíná ve vodě jako pulec, pták se líhne v hnízdě a savec kojí. Zbývá motýl."],
    explanation: "Skokan klade vajíčka do vody, z nich jsou pulci. Motýl se vyvíjí přes housenku a kuklu. Kosovi se mláďata líhnou z vajec v hnízdě. Srnec rodí živé mládě a kojí ho.",
  }),
  match("Spoj živočicha s tím, čím dýchá.", g(["Kapr", "Žábrami"], ["Velryba", "Plícemi"], ["Žížala", "Celým povrchem těla"], ["Včela", "Drobnými otvory na těle"]), {
    hints: ["Kdo z nich musí na hladinu, aby se nadechl?", "Žížala nemá plíce ani žábry, dýchá vlhkou kůží. Hmyz má po stranách těla drobné dýchací otvory."],
    explanation: "Kapr dýchá žábrami. Velryba plícemi, proto se vynořuje. Žížala dýchá celým povrchem vlhkého těla. Hmyz dýchá drobnými otvory po stranách těla.",
  }),
  match("Spoj bezobratlého živočicha s tím, čím se chrání.", g(["Hlemýžď", "Ulita"], ["Rak", "Krunýř"], ["Brouk", "Tvrdé krovky"], ["Včela", "Žihadlo"]), {
    hints: ["Kdo se schová do svého domečku?", "Rak má tvrdý obal celého těla, brouk tvrdá přední křídla a včela se brání bodnutím."],
    explanation: "Hlemýžď se schová do ulity. Rak má tvrdý krunýř. Brouk má přední křídla přeměněná na tvrdé krovky. Včela se brání žihadlem.",
  }),
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool);
}

export const BEZOBRATLIAOBRATLOVCIUVODNITRIDENI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-bezobratli-a-obratlovci-uvodni-trideni",
    title: "Bezobratlí a obratlovci (úvodní třídění)",
    studentTitle: "Třídění živočichů",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Naučíš se třídit živočichy a rozlišíš bezobratlé od obratlovců.",
    keywords: ["bezobratlí", "obratlovci", "hmyz", "pavoukovci", "měkkýši", "korýši", "červi", "ryby", "obojživelníci", "plazi", "ptáci", "savci"],
    goals: [
      "Vysvětlit rozdíl mezi bezobratlými a obratlovci",
      "Zařadit typické živočichy do správné skupiny",
      "Popsat znaky každé skupiny obratlovců",
      "Popsat znaky hmyzu, pavoukovců, měkkýšů a korýšů",
    ],
    boundaries: ["Podrobná taxonomie a latinské názvy nejsou náplní 4. ročníku"],
    gradeRange: [4, 4],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív rozhodni: má živočich páteř? Pak podle těla — srst, peří, šupiny, holá kůže, počet nohou.",
      steps: [
        "Obratlovci: ryby, obojživelníci, plazi, ptáci, savci.",
        "Hmyz má 6 nohou, pavoukovci 8.",
        "Měkkýši mají měkké tělo, korýši krunýř a klepeta.",
        "Nerozhoduj podle toho, kde zvíře žije nebo jestli létá.",
      ],
      commonMistake: "Pavouk ani klíště nejsou hmyz — mají 8 nohou, ne 6.",
      example: "Slepýš vypadá jako had, ale je to beznohá ještěrka — plaz.",
    },
  },
];
