import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { doplnIY, type Dopln } from "../_iy";

// Přepsáno 2026-09-11 (audit 3. ročníku). Úrovně byly překrývající se výřezy
// jednoho seznamu (na L3 zbyly čtyři nové úlohy). Teď tři oddělené banky:
// L1 doplnit y/ý ve slově příbuzném s vyjmenovaným · L2 najít příbuzné slovo
// mezi slovy s i/í · L3 příbuzná slova s předponou nebo v jiném tvaru a slova,
// která jen podobně znějí (letiště, bílý).

const D = (veta: string, slovo: string, g: Dopln["g"], s: string, proc: string): Dopln => ({ veta, slovo, g, s, proc });

const L1: Dopln[] = [
  D("Napiš na obálku své b_dliště.", "bydliště", "y", "B", "„Bydliště“ patří k vyjmenovanému „bydlit“ — Y."),
  D("Pes má v boudě pěkný příb_tek.", "příbytek", "y", "B", "„Příbytek“ patří k vyjmenovanému „bydlit, byt“ — Y."),
  D("Každý ob_vatel města dostal leták.", "obyvatel", "y", "B", "„Obyvatel“ je vyjmenované slovo po B — Y."),
  D("Na svahu jezdil zkušený l_žař.", "lyžař", "y", "L", "„Lyžař“ patří k vyjmenovanému „lyže“ — Y."),
  D("Opatrně pol_kej tabletu.", "polykej", "y", "L", "„Polykat“ je vyjmenované slovo po L — Y."),
  D("Dostala jsem skvělou m_šlenku.", "myšlenku", "y", "M", "„Myšlenka“ patří k vyjmenovanému „myslet“ — Y."),
  D("Prášek na praní voní jako m_dlo.", "mýdlo", "ý", "M", "„Mýdlo“ patří k vyjmenovanému „mýt“ — dlouhé Ý."),
  D("Bonbony byly v malém p_tlíku.", "pytlíku", "y", "P", "„Pytlík“ patří k vyjmenovanému „pytel“ — Y."),
  D("Páv je p_šný na svůj ocas.", "pyšný", "y", "P", "„Pyšný“ patří k vyjmenovanému „pýcha“ — krátké Y."),
  D("Polévka nás dobře nas_tila.", "nasytila", "y", "S", "„Nasytit“ patří k vyjmenovanému „sytý“ — Y."),
  D("Letadlo stoupalo do v_šky.", "výšky", "ý", "V", "„Výška“ patří k vyjmenovanému „vysoký“ — dlouhé Ý."),
  D("Na nový dům si musíme zv_knout.", "zvyknout", "y", "V", "„Zvyknout“ patří k vyjmenovanému „zvykat“ — Y."),
  D("V hodině jsme dělali jaz_kové cvičení.", "jazykové", "y", "Z", "„Jazykový“ patří k vyjmenovanému „jazyk“ — Y."),
];

// [vyjmenované slovo, souhláska, příbuzné slovo, tři slova s i/í po stejné souhlásce]
const L2: [string, string, string, [string, string, string]][] = [
  ["být", "B", "bydlet", ["bidlo", "bitva", "bílý"]], ["lyže", "L", "lyžař", ["lízat", "líný", "lípa"]],
  ["myslet", "M", "myšlenka", ["milovat", "místo", "mistr"]], ["pytel", "P", "pytlík", ["pila", "pivo", "písek"]],
  ["sytý", "S", "nasytit", ["síto", "sirka", "síla"]], ["vysoký", "V", "výška", ["vidět", "víla", "vítr"]],
  ["zvykat", "V", "zvyklost", ["vítat", "vidle", "víko"]], ["jazyk", "Z", "jazykový", ["zima", "zítra", "získat"]],
  ["mýt", "M", "umyvadlo", ["milý", "míč", "mísa"]], ["slyšet", "L", "neslyšný", ["slina", "slíbit", "klíč"]],
  ["brzy", "Z", "brzký", ["zima", "zisk", "zívat"]], ["pýcha", "P", "pyšný", ["pilný", "písmeno", "pískat"]],
  ["kobyla", "B", "kobylka", ["kobliha", "bílek", "bizon"]],
];

function pribuzne([vyjm, s, klic, jina]: [string, string, string, [string, string, string]]): PracticeTask {
  return choice(`Které slovo je příbuzné s vyjmenovaným slovem „${vyjm}“?`, klic,
    jina.map((w) => ({ value: w, why: `„${w}“ se slovem „${vyjm}“ nesouvisí — proto se v něm po ${s} píše i/í.` })) as never, {
      hints: [
        `Co znamená „${vyjm}“? Které slovo z nabídky s tím významem souvisí?`,
        `Příbuzné slovo má stejný kořen i podobný význam jako „${vyjm}“, a proto se v něm také píše y/ý. Ostatní slova jen začínají stejnou souhláskou.`,
      ],
      explanation: `„${klic}“ patří do rodiny vyjmenovaného slova „${vyjm}“, proto se píše s y/ý.`,
    });
}

const L3: Dopln[] = [
  D("Nový náb_tek je pěkný.", "nábytek", "y", "B", "„Nábytek“ patří k vyjmenovanému „bydlit, byt“ — Y."),
  D("Zab_dleli se v nové chatě.", "zabydleli", "y", "B", "„Zabydlet se“ patří k „bydlit“ — Y i s předponou."),
  D("Včely op_lují květy.", "opylují", "y", "P", "„Opylovat“ patří k vyjmenovanému „pyl“ — Y."),
  D("Ten člověk je nesl_šící.", "neslyšící", "y", "L", "„Neslyšící“ patří k vyjmenovanému „slyšet“ — Y."),
  D("Letadlo přistálo na let_šti.", "letišti", "i", "L", "„Letiště“ patří k „letět“, ne k vyjmenovanému slovu — píše se I."),
  D("Maminka vařila b_linkový čaj.", "bylinkový", "y", "B", "„Bylinkový“ patří k vyjmenovanému „bylina“ — Y."),
  D("Celý týden jsme l_žovali.", "lyžovali", "y", "L", "„Lyžovat“ patří k „lyže“ — Y."),
  D("Děti radostně v_skaly.", "výskaly", "ý", "V", "„Výskat“ je vyjmenované slovo po V — dlouhé Ý."),
  D("Na trhu prodávali malé s_rečky.", "sýrečky", "ý", "S", "„Sýreček“ patří k „sýr“ — dlouhé Ý."),
  D("Umyj si ruce v um_vadle.", "umyvadle", "y", "M", "„Umyvadlo“ patří k vyjmenovanému „mýt“ — Y."),
  D("Na podlaze ležela b_lá peříčka.", "bílá", "í", "B", "„Bílý“ vyjmenované slovo ani jeho rodina není — Í."),
  D("Dlouho přem_šlel o úkolu.", "přemýšlel", "ý", "M", "„Přemýšlet“ patří k „myslet“ — tady dlouhé Ý."),
  D("Dědeček pos_pal cestu pískem.", "posypal", "y", "S", "„Posypat“ patří k vyjmenovanému „sypat“ — Y."),
];

function gen(level: number): PracticeTask[] {
  if (level === 2) return shuffle(L2).map(pribuzne);
  const pool = level === 1 ? L1 : L3;
  return shuffle(pool).map((d) => doplnIY(d, level === 1
    ? [
      `Ve větě „${d.veta}“: ke kterému vyjmenovanému slovu po ${d.s} doplňované slovo patří?`,
      "Slova příbuzná s vyjmenovanými se píšou stejně jako vyjmenované slovo — s y/ý. Najdi základní slovo a pak poslechni, jestli je samohláska krátká, nebo dlouhá.",
    ]
    : [
      `Ve větě „${d.veta}“: patří slovo do rodiny vyjmenovaného slova, nebo jen podobně zní?`,
      "Předpona ani jiný tvar na pravopisu nic nemění — rozhoduje rodina slova. Slova, která s vyjmenovaným jen podobně znějí, se píšou s i/í. Pak rozhodni o délce samohlásky.",
    ]));
}

export const SLOVAPRIBYZNAVANJE: TopicMetadata[] = [
  {
    id: "g3-cjl-slova-pribuzna-vyjmenovana",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-slova-pribuzna-k-vyjmenovanym-slovum-psani-i-y-po-obojet-sou",
    title: "Slova příbuzná k vyjmenovaným slovům, psaní i/y po obojet. souhláskách",
    studentTitle: "Příbuzná vyjmenovaná",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Správně napíšeš i/y ve slovech příbuzných k vyjmenovaným.",
    keywords: ["vyjmenovaná slova", "příbuzná slova", "i/y", "pravopis", "obojetné souhlásky"],
    goals: ["Rozpoznat slova příbuzná k vyjmenovaným.", "Správně psát y/ý ve slovech příbuzných.", "Zdůvodnit pravopis odkazem na vyjmenované slovo."],
    boundaries: ["Základní příbuzná slova po B, L, M, P, S, V, Z."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Příbuzné slovo ke vyjmenovanému = také se píše s Y. Hledej, ke které rodině patří.",
      steps: ["Určím, po které souhlásce píšu (B, L, M, P, S, V, Z).", "Vzpomenu si na vyjmenovaná slova.", "Patří toto slovo do jejich rodiny? Pak Y.", "Nepatří? Pak I."],
      commonMistake: "'bydlet' — příbuzné k 'být' (vyjmenované) → píšeme Y.",
      example: "lyžař → příbuzné k 'lyže' (vyjmenované po L) → píšeme Y: lyžař.",
    },
  },
];
