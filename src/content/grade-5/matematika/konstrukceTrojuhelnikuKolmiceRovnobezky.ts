import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice } from "../_shared";
import { ciselnaUloha, pick, rnd, sada, shuffle } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď: L1 pojmy (kolmice, rovnoběžky,
// pravý úhel, druhy trojúhelníků) · L2 dopočítat třetí úhel trojúhelníku
// a určit jeho druh podle úhlů · L3 kdy jde trojúhelník sestrojit (součet dvou
// kratších stran) a rovnoběžné strany a pravé úhly čtyřúhelníků.

const L1: PracticeTask[] = [
  choice("Co jsou kolmice?", "dvě přímky, které svírají pravý úhel", [
    { value: "dvě přímky, které se nikdy neprotnou", why: "To jsou rovnoběžky." },
    { value: "dvě přímky, které svírají úhel 45°", why: "Kolmice svírají 90°, ne 45°." },
    { value: "dvě stejně dlouhé úsečky", why: "Kolmost nezávisí na délce." },
  ], { hints: ["Jak vypadá místo, kde se potkají dvě hrany listu papíru?", "Kolmé čáry se protnou a vytvoří čtyři shodné rohy po 90° — jako roh sešitu nebo stolu."], explanation: "Kolmice se protínají pod pravým úhlem (90°)." }),
  choice("Co jsou rovnoběžky?", "přímky, které se nikdy neprotnou", [
    { value: "přímky, které svírají pravý úhel", why: "To jsou kolmice." },
    { value: "přímky, které se protnou v jednom bodě", why: "To jsou různoběžky." },
    { value: "přímky různé délky", why: "Přímky jsou nekonečné, délku nemají." },
  ], { hints: ["Jak vypadají koleje, když se díváš podél trati?", "Rovnoběžky jsou od sebe všude stejně daleko, proto se nikde nesetkají."], explanation: "Rovnoběžky se nikdy neprotnou." }),
  choice("Jakou pomůcku použiješ k narýsování kolmice?", "trojúhelník s ryskou", [
    { value: "kružítko", why: "Kružítkem se rýsují kružnice." },
    { value: "gumu", why: "Gumou se maže." },
    { value: "obyčejné pravítko bez rysky", why: "Na něm není vyznačený pravý úhel." },
  ], { hints: ["Na které pomůcce je vyznačený pravý úhel?", "Ryska je čára uprostřed pomůcky, kolmá k její delší hraně; přiložíš ji k přímce a narýsuješ kolmici."], explanation: "Kolmice se rýsuje trojúhelníkem s ryskou." }),
  choice("Kolik stupňů má pravý úhel?", "90°", [
    { value: "180°", why: "180° má přímý úhel." },
    { value: "45°", why: "45° je polovina pravého úhlu." },
    { value: "360°", why: "360° je plný úhel." },
  ], { hints: ["Jaký úhel má roh čtverce?", "Přímý úhel (rovná čára) má 180° a pravý je jeho polovina."], explanation: "Pravý úhel má 90°." }),
  choice("Jaký je součet všech tří úhlů v trojúhelníku?", "180°", [
    { value: "90°", why: "90° má jen pravý úhel." },
    { value: "360°", why: "360° je součet úhlů čtyřúhelníku." },
    { value: "270°", why: "To jsou tři pravé úhly — trojúhelník je mít nemůže." },
  ], { hints: ["Co dostaneš, když trojúhelníku utrhneš všechny tři rohy a přiložíš je vedle sebe?", "Tři úhly trojúhelníku dohromady vytvoří přímý úhel — rovnou čáru."], explanation: "Součet úhlů v trojúhelníku je 180°." }),
  choice("Který trojúhelník má jeden pravý úhel?", "pravoúhlý", [
    { value: "ostroúhlý", why: "Ostroúhlý má všechny úhly ostré, menší než 90°." },
    { value: "tupoúhlý", why: "Tupoúhlý má jeden úhel tupý, přes 90°." },
    { value: "rovnostranný", why: "Rovnostranný se určuje podle stran a má úhly po 60°." },
  ], { hints: ["Jak se jmenuje trojúhelník, který má roh jako čtverec?", "Trojúhelníky dělíme podle úhlů: ostroúhlý má všechny úhly ostré (pod 90°), tupoúhlý jeden tupý (přes 90°) — a zbývá ten s rohem 90°."], explanation: "Trojúhelník s pravým úhlem je pravoúhlý." }),
  choice("Který trojúhelník má všechny strany stejně dlouhé?", "rovnostranný", [
    { value: "rovnoramenný", why: "Rovnoramenný má shodné jen dvě strany." },
    { value: "pravoúhlý", why: "Pravoúhlý se určuje podle úhlu." },
    { value: "různostranný", why: "Různostranný má každou stranu jinak dlouhou." },
  ], { hints: ["Co napovídá začátek slova rovno-?", "Rovnoramenný má shodné dvě strany (ramena), různostranný žádnou dvojici."], explanation: "Všechny strany shodné má rovnostranný trojúhelník." }),
  choice("Jak poznáš, že jsou dvě přímky rovnoběžné?", "jsou od sebe všude stejně daleko", [
    { value: "protínají se pod pravým úhlem", why: "To jsou kolmice." },
    { value: "mají stejnou délku", why: "Přímky délku nemají." },
    { value: "obě jsou nakreslené stejnou tužkou", why: "Barva ani tužka nerozhodují." },
  ], { hints: ["Co musí platit, aby se dvě přímky nikde nesetkaly?", "Změř vzdálenost přímek na dvou různých místech. U rovnoběžek se naměřené číslo nemění."], explanation: "Rovnoběžky mají všude stejnou vzdálenost." }),
  choice("Kolik kolmic k přímce p můžeš vést bodem A?", "právě jednu", [
    { value: "dvě", why: "Druhá by splynula s první." },
    { value: "nekonečně mnoho", why: "Bodem vede nekonečně mnoho přímek, ale kolmá k p je jen jedna." },
    { value: "žádnou", why: "Kolmici lze vést každým bodem." },
  ], { hints: ["Zkus přiložit trojúhelník s ryskou k přímce tak, aby hrana procházela bodem. Kolika způsoby to jde?", "Daným bodem vede k dané přímce jediná kolmice; rovnoběžka s přímkou vede bodem také jen jedna."], explanation: "Bodem vede k přímce právě jedna kolmice." }),
  choice("Jaké strany má obdélník?", "protější strany jsou rovnoběžné a sousední kolmé", [
    { value: "sousední strany jsou rovnoběžné", why: "Sousední strany se protínají v rohu." },
    { value: "žádné strany nejsou kolmé", why: "Obdélník má čtyři pravé úhly." },
    { value: "všechny strany se protínají v jednom bodě", why: "Protější strany se nikdy neprotnou." },
  ], { hints: ["Podívej se na list papíru: jaké rohy má a jak vedou okraje naproti sobě?", "Obdélník má čtyři pravé rohy; okraje naproti sobě se nikdy nesetkají."], explanation: "V obdélníku jsou protější strany rovnoběžné a sousední na sebe kolmé." }),
  choice("Dvě silnice se kříží pod pravým úhlem. Jak o nich řekneš?", "jsou na sebe kolmé", [
    { value: "jsou rovnoběžné", why: "Rovnoběžky se nekříží." },
    { value: "jsou shodné", why: "Shodnost se týká velikosti." },
    { value: "jsou souměrné", why: "Souměrnost je něco jiného." },
  ], { hints: ["Jaký roh vznikne na takové křižovatce?", "Když se čáry protnou a všechny čtyři rohy jsou pravé (90°), mluvíme o kolmicích."], explanation: "Přímky, které svírají pravý úhel, jsou kolmé." }),
  choice("Jaký úhel svírají dvě rovnoběžky?", "žádný, nikdy se neprotnou", [
    { value: "pravý, stejně jako kolmice", why: "Pravý úhel svírají kolmice." },
    { value: "přímý, jako rovná čára", why: "Přímý úhel je rovná čára, ne dvě přímky." },
    { value: "ostrý, protože jsou blízko", why: "Ostrý úhel svírají různoběžky." },
  ], { hints: ["Kde by se rovnoběžky musely setkat, aby mezi nimi vznikl úhel?", "Úhel vzniká jen tam, kde se dvě čáry protnou."], explanation: "Rovnoběžky se neprotínají, úhel nesvírají." }),
  choice("Jak se jmenuje trojúhelník, který má jeden úhel tupý?", "tupoúhlý", [
    { value: "ostroúhlý", why: "Ostroúhlý má všechny úhly ostré." },
    { value: "pravoúhlý", why: "Pravoúhlý má úhel přesně 90°." },
    { value: "rovnoramenný", why: "Rovnoramenný se určuje podle stran." },
  ], { hints: ["Jak se jmenuje úhel, který je širší než pravý?", "Úhel do 90° je ostrý, přesně 90° pravý a od 90° do 180° tupý; trojúhelník se jmenuje podle takového úhlu."], explanation: "Trojúhelník s tupým úhlem je tupoúhlý." }),
];

function tretiUhel(): PracticeTask | null {
  const a = rnd(20, 100), b = rnd(20, 150 - a), c = 180 - a - b;
  if (c < 10 || c === a || c === b || String(a).includes(String(c)) || String(b).includes(String(c))) return null;
  return ciselnaUloha(`V trojúhelníku má jeden úhel ${a}° a druhý ${b}°. Kolik stupňů má třetí úhel?`, c, [
    { value: 180 - a, why: `Odečetl se jen první úhel. Od součtu musíš odečíst oba: ${a}° i ${b}°.` },
    { value: 360 - a - b, why: "360° je součet úhlů čtyřúhelníku. V trojúhelníku je součet 180°." },
    { value: a + b, why: "To je součet dvou známých úhlů. Třetí úhel je to, co jim chybí do 180°." },
  ], [
    `Kolik stupňů mají dohromady úhly ${a}° a ${b}°?`,
    "Součet všech tří úhlů trojúhelníku je vždy přímý úhel, tedy sto osmdesát stupňů. Od něj odečti oba známé úhly.",
  ], [`${a}° + ${b}° = ${a + b}°`, `180° − ${a + b}° = ${c}°`, `Zkouška: ${a}° + ${b}° + ${c}° = 180° ✓`]);
}

function druh(): PracticeTask | null {
  const a = rnd(20, 90), b = rnd(20, 160 - a), c = 180 - a - b;
  if (c < 15) return null;
  const nej = Math.max(a, b, c);
  const key = nej < 90 ? "ostroúhlý" : nej === 90 ? "pravoúhlý" : "tupoúhlý";
  const why: Record<string, string> = {
    "ostroúhlý": `Ostroúhlý by musel mít všechny úhly pod 90°, ale třetí úhel je ${c}° a největší ${nej}°.`,
    "pravoúhlý": `Pravoúhlý má úhel přesně 90°. Úhly jsou ${a}°, ${b}° a ${c}°.`,
    "tupoúhlý": `Tupoúhlý má úhel přes 90°. Úhly jsou ${a}°, ${b}° a ${c}° — žádný není tupý.`,
    "rovnostranný": "Rovnostranný se určuje podle stran a má všechny úhly 60°.",
  };
  const chyby = ["ostroúhlý", "pravoúhlý", "tupoúhlý", "rovnostranný"].filter((k) => k !== key).map((k) => ({ value: k, why: why[k] }));
  return ciselnaUloha(`Trojúhelník má úhly ${a}° a ${b}°. Jaký je podle úhlů?`, key, shuffle(chyby), [
    `Úhly ${a}° a ${b}° znáš. Kolik stupňů má třetí úhel?`,
    "Dopočítej třetí úhel (součet je sto osmdesát stupňů). Pak rozhoduje nejširší úhel: jsou všechny ostré (pod 90°), je jeden pravý (90°), nebo je jeden tupý (přes 90°)?",
  ], [`Třetí úhel: 180° − ${a}° − ${b}° = ${c}°`, `Nejširší úhel: ${nej}° → ${key}`]);
}

const ANO = "ano, dvě kratší strany jsou dohromady delší než nejdelší";
const NE = "ne, dvě kratší strany nejsou dohromady delší než nejdelší";

function nerovnost(): PracticeTask | null {
  const s = [rnd(2, 12), rnd(2, 12), rnd(3, 20)].sort((x, y) => x - y);
  const [s1, s2, s3] = s;
  if (s1 === s2 && s2 === s3) return null;
  const lze = s1 + s2 > s3;
  const poradi = shuffle(s);
  return ciselnaUloha(`Lze sestrojit trojúhelník se stranami ${poradi[0]} cm, ${poradi[1]} cm a ${poradi[2]} cm?`, lze ? ANO : NE, [
    { value: lze ? NE : ANO, why: `${s1} + ${s2} = ${s1 + s2}, a to ${lze ? "je víc" : s1 + s2 === s3 ? "je přesně tolik" : "je méně"} než ${s3}.${!lze && s1 + s2 === s3 ? " Při rovnosti by se strany složily do úsečky." : ""}` },
    { value: "ano, trojúhelník jde sestrojit z jakýchkoli stran", why: "Z příliš krátkých stran se konce nepotkají." },
    { value: "ne, všechny strany musí být stejně dlouhé", why: "Trojúhelník může mít strany různé délky." },
  ], [
    `Kolik centimetrů je ${s1} cm + ${s2} cm? A je to víc než ${s3} cm?`,
    "Trojúhelník jde sestrojit jen tehdy, když je součet dvou menších úseček víc než ta třetí; jinak se jejich konce nepotkají.",
  ], [`${s1} + ${s2} = ${s1 + s2}`, `${s1 + s2} ${lze ? ">" : s1 + s2 === s3 ? "=" : "<"} ${s3} → ${lze ? "lze" : "nelze"}`]);
}

// [tvar, dvojice rovnoběžných stran, pravé úhly]
const TVARY: [string, number, number][] = [
  ["čtverec", 2, 4], ["obdélník", 2, 4], ["kosočtverec (který není čtverec)", 2, 0], ["lichoběžník", 1, 0], ["pravoúhlý lichoběžník", 1, 2], ["obecný čtyřúhelník", 0, 0], ["kosodélník", 2, 0],
];

function tvar(): PracticeTask | null {
  const [nazev, rov, prave] = pick(TVARY);
  const naRov = Math.random() < 0.5;
  const key = naRov ? rov : prave;
  const moznosti = naRov ? [0, 1, 2, 4] : [0, 1, 2, 4];
  const chyby = moznosti.filter((m) => m !== key).map((m) => ({ value: String(m), why: naRov ? `${nazev[0].toUpperCase()}${nazev.slice(1)} má ${rov === 0 ? "žádnou dvojici" : rov === 1 ? "jednu dvojici" : "dvě dvojice"} rovnoběžných stran.` : `${nazev[0].toUpperCase()}${nazev.slice(1)} má ${prave === 0 ? "žádný pravý úhel" : prave === 2 ? "dva pravé úhly" : "čtyři pravé úhly"}.` }));
  return ciselnaUloha(naRov ? `Kolik dvojic rovnoběžných stran má ${nazev}?` : `Kolik pravých úhlů má ${nazev}?`, String(key), chyby, [
    naRov ? `Nakresli si ${nazev.split(" (")[0]}. Které strany vedou proti sobě a nikdy by se nepotkaly?` : `Nakresli si ${nazev.split(" (")[0]}. Ve kterých rozích by přesně sedl roh sešitu?`,
    naRov ? "Rovnoběžné strany jsou naproti sobě a jsou od sebe všude stejně daleko. Počítej dvojice, ne jednotlivé strany — jedna dvojice jsou vždy dvě strany proti sobě." : "Pravý úhel poznáš trojúhelníkem s ryskou nebo rohem papíru. Zkontroluj všechny čtyři rohy jeden po druhém a počítej jen ty, do kterých roh papíru přesně zapadne.",
  ], [`${nazev}: ${rov === 0 ? "žádná dvojice" : rov === 1 ? "1 dvojice" : "2 dvojice"} rovnoběžných stran, ${prave} pravé úhly`.replace("0 pravé úhly", "žádný pravý úhel").replace("4 pravé úhly", "4 pravé úhly")]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1);
  if (level === 2) return sada(30, (i) => (i % 2 ? druh() : tretiUhel()));
  return sada(30, (i) => (i % 3 === 2 ? tvar() : nerovnost()));
}

export const KONSTRUKCETROJUHELNIKUKOLMICEROVNOBEZKY: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-konstrukce-a-obsah-konstrukce-trojuhelniku-kolmice-rovnobezky",
    title: "Konstrukce trojúhelníku, kolmice, rovnoběžky",
    studentTitle: "Rýsování a konstrukce",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Konstrukce a obsah",
    briefDescription: "Naučíš se rýsovat kolmice, rovnoběžky a trojúhelníky.",
    keywords: ["kolmice", "rovnoběžky", "trojúhelník", "úhel", "90°", "180°", "konstrukce", "rýsování"],
    goals: [
      "Vysvětlit, co jsou kolmice a rovnoběžky",
      "Znát vlastnosti trojúhelníku (součet úhlů 180°)",
      "Rozlišit druhy trojúhelníků",
      "Sestrojit kolmici a rovnoběžku ke dané přímce",
    ],
    boundaries: ["Bez výpočtu obsahu a obvodu trojúhelníku", "Bez sinus/kosinus"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Kolmice svírají úhel 90°. Rovnoběžky se nikdy neprotnou. Součet úhlů v trojúhelníku = 180°.",
      steps: [
        "Kolmice: použij úhelník (pravý úhel = 90°).",
        "Rovnoběžky: zachovej stejnou vzdálenost od přímky v každém bodě.",
        "Trojúhelník: součet všech tří úhlů je vždy 180°.",
      ],
      commonMistake: "Chyba: záměna kolmice a rovnoběžky. Kolmice = kříží se pod 90°, rovnoběžky = nekříží se nikdy.",
      example: "Trojúhelník s úhly 60° a 80°: třetí úhel = 180° − 60° − 80° = 40°.",
    },
  },
];
