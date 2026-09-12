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
  choice("Jak zapíšeš, že přímka a je kolmá k přímce b?", "a ⊥ b", [
    { value: "a ∥ b", why: "Dvě svislé čárky znamenají rovnoběžnost, ne kolmost." },
    { value: "a = b", why: "Rovnítko by znamenalo, že jde o jednu a tutéž přímku." },
    { value: "a ∈ b", why: "Tenhle znak se čte „leží na“ a používá se u bodu, ne u dvou přímek." },
  ], { hints: ["Který ze znaků připomíná tvarem roh, tedy dvě čáry svírající pravý úhel?", "Znak pro kolmost vypadá jako obrácené písmeno T — svislá čára narazí na vodorovnou a udělá s ní roh."], explanation: "Kolmost se zapisuje znakem ⊥, který sám vypadá jako dvě čáry svírající pravý úhel." }),
  choice("Jak zapíšeš, že přímky p a q jsou rovnoběžné?", "p ∥ q", [
    { value: "p ⊥ q", why: "Tenhle znak znamená kolmost, tedy pravý úhel." },
    { value: "p ≠ q", why: "Přeškrtnuté rovnítko říká jen to, že se přímky nerovnají." },
    { value: "p → q", why: "Šipka značí směr nebo přechod, o vzájemné poloze přímek nic neříká." },
  ], { hints: ["Který ze znaků je sám nakreslený ze dvou čar, které se nikde nepotkají?", "Znak pro rovnoběžnost tvoří dvě svislé čárky vedle sebe — přesně tak, jak vedou rovnoběžné přímky."], explanation: "Rovnoběžnost se zapisuje znakem ∥, tedy dvěma čárkami, které se nikde neprotnou." }),
  choice("Jak se jmenuje úhel, který je menší než pravý?", "ostrý", [
    { value: "tupý", why: "Tupý úhel je naopak širší než pravý." },
    { value: "přímý", why: "Přímý úhel je rovná čára, tedy 180°." },
    { value: "plný", why: "Plný úhel je celé otočení dokola, tedy 360°." },
  ], { hints: ["Jak vypadá úhel, který je špičatější než roh sešitu?", "Úhly se dělí podle toho, jak jsou široké: do 90°, přesně 90°, mezi 90° a 180° a pak celé otočení."], explanation: "Úhel menší než 90° je špičatý, a proto se mu říká ostrý." }),
  choice("Jak se jmenuje úhel, který je větší než pravý, ale menší než přímý?", "tupý", [
    { value: "ostrý", why: "Ostrý úhel je naopak užší než pravý." },
    { value: "pravý", why: "Pravý úhel má přesně 90°, hledá se úhel širší." },
    { value: "plný", why: "Plný úhel je celé otočení dokola, tedy 360°." },
  ], { hints: ["Představ si roh sešitu, který někdo rozevřel doširoka, ale ještě z něj nevznikla rovná čára.", "Mezi 90° a 180° leží jediný druh úhlu; ostrý je pod 90° a přímý je přesně 180°."], explanation: "Úhel mezi 90° a 180° je rozevřený víc než pravý, a proto se mu říká tupý." }),
  choice("Čím narýsuješ kružnici?", "kružítkem", [
    { value: "trojúhelníkem s ryskou", why: "Ryska slouží k rýsování kolmic a rovnoběžek." },
    { value: "pravítkem", why: "Pravítkem se rýsují jen rovné čáry." },
    { value: "úhloměrem", why: "Úhloměrem se úhly měří, nekreslí se jím kružnice." },
  ], { hints: ["Která pomůcka má hrot, který se zapíchne do středu, a tuhu, která se kolem něj otáčí?", "Kružnice je čára, jejíž všechny body mají od středu stejnou vzdálenost; potřebuješ tedy pomůcku, která tu vzdálenost udrží pořád stejnou."], explanation: "Jen kružítko udrží při otáčení stále stejnou vzdálenost od středu, a proto jím vznikne kružnice." }),
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
    `Nejdřív sečti ${a}° a ${b}°. Součet všech tří úhlů trojúhelníku je vždycky přímý úhel, tedy sto osmdesát stupňů — a kolik do nich tomu součtu chybí, tolik má třetí úhel.`,
  ], [`${a}° + ${b}° = ${a + b}°`, `180° − ${a + b}° = ${c}°`, `Zkouška: ${a}° + ${b}° + ${c}° = 180° ✓`]);
}

function druh(): PracticeTask | null {
  const a = rnd(20, 90), b = rnd(20, 160 - a), c = 180 - a - b;
  if (c < 15) return null;
  // 60°, 60°, 60° by byl i rovnostranný — u takového zadání by byly správně dvě možnosti.
  if (a === 60 && b === 60) return null;
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
    `Od sto osmdesáti stupňů odečti ${a}° i ${b}° a dopočítej třetí úhel. Pak si z těch tří úhlů vyber ten nejširší a porovnej ho s pravým úhlem: je menší než 90°, přesně 90°, nebo větší? Přesně podle toho se druh trojúhelníku pojmenuje.`,
  ], [`Třetí úhel: 180° − ${a}° − ${b}° = ${c}°`, `Úhly jsou ${a}°, ${b}° a ${c}°, nejširší z nich je ${nej}°`, `${nej}° je ${nej < 90 ? "menší než 90°, takže jsou všechny úhly ostré" : nej === 90 ? "přesně 90°, tedy pravý úhel" : "větší než 90°, tedy tupý úhel"} → ${key}`]);
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
    `Které z čísel ${poradi[0]}, ${poradi[1]} a ${poradi[2]} je největší? Zkus sečíst ty dvě zbývající.`,
    `Seřaď délky od nejmenší: ${s1} cm, ${s2} cm, ${s3} cm. Sečti ty dvě nejmenší a součet porovnej s tou největší — pokud je součet menší nebo přesně stejný, konce úseček se při rýsování nikde nepotkají.`,
  ], [`${s1} + ${s2} = ${s1 + s2}`, `${s1 + s2} ${lze ? ">" : s1 + s2 === s3 ? "=" : "<"} ${s3} → ${lze ? "lze" : "nelze"}`]);
}

// [tvar, dvojice rovnoběžných stran, pravé úhly]
// Čtverec a obdélník tady schválně nejsou: jejich vlastnosti se procvičují na
// úrovni I a v L3 by šlo o pouhé vybavení, ne o úvahu nad tvarem.
const TVARY: [string, number, number][] = [
  ["kosočtverec (který není čtverec)", 2, 0], ["lichoběžník", 1, 0], ["pravoúhlý lichoběžník", 1, 2], ["obecný čtyřúhelník", 0, 0], ["kosodélník", 2, 0],
];

const R_POCET: Record<number, string> = {
  0: "žádnou dvojici rovnoběžných stran",
  1: "jednu dvojici rovnoběžných stran",
  2: "dvě dvojice rovnoběžných stran",
  4: "čtyři dvojice rovnoběžných stran",
};
const P_POCET: Record<number, string> = {
  0: "žádný pravý úhel",
  1: "jeden pravý úhel",
  2: "dva pravé úhly",
  4: "čtyři pravé úhly",
};

function tvar(): PracticeTask | null {
  const [nazev, rov, prave] = pick(TVARY);
  const naRov = Math.random() < 0.5;
  const key = naRov ? rov : prave;
  const Nazev = `${nazev[0].toUpperCase()}${nazev.slice(1)}`;
  const zaklad = nazev.split(" (")[0];
  const stav = naRov
    ? (rov === 0 ? `${Nazev} nemá žádné dvě strany rovnoběžné` : `${Nazev} má ${R_POCET[rov]}`)
    : (prave === 0 ? `${Nazev} nemá ani jeden pravý úhel` : `${Nazev} má ${P_POCET[prave]}`);
  const chyby = [0, 1, 2, 4].filter((m) => m !== key).map((m) => ({
    value: String(m),
    why: naRov
      ? (m === 4
        ? `4 je počet stran čtyřúhelníku, ne počet dvojic — jedna dvojice jsou vždycky dvě strany proti sobě. ${stav}.`
        : `${stav}, ne ${R_POCET[m]}. Porovnávej vždy dvojici stran, které leží proti sobě.`)
      : `${stav}. Odpověď ${m} tomu neodpovídá — přilož roh papíru postupně do všech čtyř rohů a přesvědč se.`,
  }));
  return ciselnaUloha(naRov ? `Kolik dvojic rovnoběžných stran má ${nazev}?` : `Kolik pravých úhlů má ${nazev}?`, String(key), chyby, [
    naRov ? `Nakresli si ${zaklad}. Které strany vedou proti sobě a nikdy by se nepotkaly?` : `Nakresli si ${zaklad}. Ve kterých rozích by přesně sedl roh sešitu?`,
    naRov
      ? `Nakresli si ${zaklad} a u každé strany najdi tu, která leží proti ní. Rovnoběžné strany vedou stejným směrem a jsou od sebe všude stejně daleko; počítej dvojice, ne jednotlivé strany — jedna dvojice jsou vždycky dvě strany proti sobě.`
      : `Nakresli si ${zaklad} a přikládej roh papíru postupně do všech čtyř rohů. Počítej jen ty rohy, do kterých roh papíru přesně zapadne; tam, kde je roh užší nebo širší, o pravý úhel nejde.`,
  ], [
    `${Nazev} — strany: ${rov === 0 ? "žádné dvě protější strany nevedou stejným směrem" : R_POCET[rov]}.`,
    `${Nazev} — rohy: ${prave === 0 ? "ani jeden roh není pravý" : P_POCET[prave]}.`,
    naRov ? `Ptáme se na dvojice rovnoběžných stran, a těch je ${rov}.` : `Ptáme se na pravé úhly, a těch je ${prave}.`,
  ]);
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
