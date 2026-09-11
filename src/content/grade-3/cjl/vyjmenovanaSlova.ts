import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";
import { doplnIY, type Dopln } from "../_iy";

// Přepsáno 2026-09-11 (audit 3. ročníku). Úrovně byly překrývající se výřezy
// jednoho seznamu (na L3 zbyly čtyři nové úlohy) a nápověda byla u všech
// úloh stejná. Teď tři oddělené banky:
// L1 doplnit y/ý ve vyjmenovaném slově · L2 poznat vyjmenované slovo mezi
// slovy s i/í · L3 stejně znějící slova, kde rozhoduje význam (mýt × mít,
// být × bít, výr × vír).

const D = (veta: string, slovo: string, g: Dopln["g"], s: string, proc: string): Dopln => ({ veta, slovo, g, s, proc });

const L1: Dopln[] = [
  D("Na farmě žil velký b_k.", "býk", "ý", "B", "„Býk“ je vyjmenované slovo po B, proto Ý; vyslovuje se dlouze."),
  D("Chtěl bych b_t kosmonautem.", "být", "ý", "B", "„Být“ je vyjmenované slovo po B — dlouhé Ý."),
  D("Kob_la se pásla na louce.", "kobyla", "y", "B", "„Kobyla“ je vyjmenované slovo po B — krátké Y."),
  D("V zimě jezdíme na l_žích.", "lyžích", "y", "L", "„Lyže“ je vyjmenované slovo po L, i tvar „lyžích“ má Y."),
  D("Strýc je úplně l_sý.", "lysý", "y", "L", "„Lysý“ je vyjmenované slovo po L — krátké Y."),
  D("Na umyvadle leží m_dlo.", "mýdlo", "ý", "M", "„Mýdlo“ patří k vyjmenovanému „mýt“ — dlouhé Ý."),
  D("Včely sbírají p_l.", "pyl", "y", "P", "„Pyl“ je vyjmenované slovo po P — krátké Y."),
  D("Brambory jsou v p_tli.", "pytli", "y", "P", "„Pytel“ je vyjmenované slovo po P, i „v pytli“ má Y."),
  D("Na chleba si dám s_r.", "sýr", "ý", "S", "„Sýr“ je vyjmenované slovo po S — dlouhé Ý."),
  D("Pan Novák má s_na a dceru.", "syna", "y", "S", "„Syn“ je vyjmenované slovo po S — krátké Y."),
  D("V noci houká v_r.", "výr", "ý", "V", "„Výr“ (sova) je vyjmenované slovo po V — dlouhé Ý."),
  D("Vlk začal v_t na měsíc.", "výt", "ý", "V", "„Výt“ je vyjmenované slovo po V — dlouhé Ý."),
  D("Jaz_k máme v puse.", "jazyk", "y", "Z", "„Jazyk“ je vyjmenované slovo po Z — krátké Y."),
];

// [souhláska, vyjmenované slovo, tři slova s i/í po stejné souhlásce, druhé znění otázky]
const L2: [string, string, [string, string, string], boolean][] = [
  ["B", "býk", ["bílý", "bída", "bič"], false], ["B", "dobytek", ["bílek", "bizon", "bitva"], true],
  ["L", "slyšet", ["slina", "klín", "líný"], false], ["L", "plynout", ["plivat", "plíce", "lípa"], true],
  ["M", "myslet", ["milovat", "mistr", "místo"], false], ["M", "hmyz", ["smích", "mince", "míra"], true],
  ["P", "pytel", ["pila", "pivo", "písek"], false], ["P", "pykat", ["pilot", "píšťala", "pití"], true],
  ["S", "sýkora", ["síto", "silný", "sirka"], false], ["S", "sypat", ["síla", "sídlo", "sít"], true],
  ["V", "vysoký", ["vidět", "vítr", "víla"], false], ["V", "zvykat", ["vidle", "vinout", "vítat"], true],
  ["Z", "nazývat", ["zima", "zítra", "získat"], false],
];

function ktere([s, vyjm, jina, druhe]: [string, string, [string, string, string], boolean]): PracticeTask {
  return choice(druhe ? `Které z těchto slov je vyjmenované slovo po ${s}?` : `Které slovo patří mezi vyjmenovaná slova po ${s}?`, vyjm,
    jina.map((w) => ({ value: w, why: `„${w}“ mezi vyjmenovaná slova po ${s} nepatří — proto se v něm píše i/í.` })) as never, {
      hints: [
        druhe
          ? `Které slovo z nabídky se píše s y po ${s}? Vyjmenuj si řadu po ${s} nahlas.`
          : `Zkus si říct vyjmenovaná slova po ${s}. Které slovo z nabídky v té řadě zazní?`,
        `Ostatní slova v nabídce se píšou s i/í, protože mezi vyjmenovaná nepatří. Když si nejsi jistý nebo jistá, řekni si celou řadu po ${s} od začátku.`,
      ],
      explanation: `„${vyjm}“ je vyjmenované slovo po ${s}, proto se píše s y/ý. Ostatní slova mezi vyjmenovaná nepatří.`,
    });
}

const L3: Dopln[] = [
  D("Musím si m_t ruce.", "mýt", "ý", "M", "„Mýt“ znamená umývat — je to vyjmenované slovo, dlouhé Ý."),
  D("Chci m_t psa.", "mít", "í", "M", "„Mít“ znamená vlastnit — to vyjmenované slovo není, píše se Í."),
  D("Kovář začal b_t do železa.", "bít", "í", "B", "„Bít“ znamená tlouct — vyjmenované slovo to není, píše se Í."),
  D("Chtěla bych b_t doma.", "být", "ý", "B", "„Být“ znamená existovat, zůstávat — vyjmenované slovo, Ý."),
  D("V lese houká v_r.", "výr", "ý", "V", "„Výr“ je sova — vyjmenované slovo, Ý."),
  D("Ve vodě se točil v_r.", "vír", "í", "V", "„Vír“ je točící se proud vody — vyjmenované slovo to není, Í."),
  D("Vlci začali v_t.", "výt", "ý", "V", "„Výt“ je zvuk vlka — vyjmenované slovo, Ý."),
  D("Maminka začala v_t věnec.", "vít", "í", "V", "„Vít“ věnec znamená splétat — vyjmenované slovo to není, Í."),
  D("L_že nechte v chodbě.", "Lyže", "y", "L", "„Lyže“ je vyjmenované slovo po L — krátké Y."),
  D("Kočka l_že mléko.", "líže", "í", "L", "„Líže“ je od slova lízat — vyjmenované slovo to není, Í."),
  D("Na zahradě rostou b_liny.", "byliny", "y", "B", "„Bylina“ je vyjmenované slovo po B — krátké Y."),
  D("Na louce kvetou b_lé kopretiny.", "bílé", "í", "B", "„Bílý“ vyjmenované slovo není — píše se Í."),
  D("Po obědě jsem s_tý.", "sytý", "y", "S", "„Sytý“ je vyjmenované slovo po S — krátké Y."),
];

function gen(level: number): PracticeTask[] {
  if (level === 2) return shuffle(L2).map(ktere);
  const pool = level === 1 ? L1 : L3;
  return shuffle(pool).map((d) => doplnIY(d, level === 1
    ? [
      `Ve větě „${d.veta}“: patří doplňované slovo mezi vyjmenovaná slova po ${d.s}?`,
      "Po obojetných souhláskách b, f, l, m, p, s, v, z píšeme y/ý jen ve vyjmenovaných slovech a ve slovech příbuzných. Pak ještě poslechni, jestli je samohláska krátká, nebo dlouhá.",
    ]
    : [
      `Co znamená doplňované slovo ve větě „${d.veta}“? Patří k vyjmenovanému slovu, nebo jen podobně zní?`,
      "Stejně znějící slova se píšou podle významu — y/ý dostane jen to slovo, které patří do řady vyjmenovaných slov nebo do jejich rodiny. Pak rozhodni o délce samohlásky.",
    ]));
}

export const VYJMENOVANASLOVA: TopicMetadata[] = [
  {
    id: "g3-cjl-vyjmenovana-slova",
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-vyjmenovana-slova-po-b-l-m-p-s-v-z",
    title: "Vyjmenovaná slova po B, L, M, P, S, V, Z",
    studentTitle: "Vyjmenovaná slova",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Naučíš se vyjmenovaná slova a správně doplníš i/y.",
    keywords: ["vyjmenovaná slova", "B L M P S V Z", "pravopis", "i/y", "bylina", "lyže", "mýdlo"],
    goals: ["Znát vyjmenovaná slova po B, L, M, P, S, V, Z.", "Správně doplnit i/y po obojetných souhláskách.", "Zdůvodnit pravopis vyjmenovaným slovem."],
    boundaries: ["Vyjmenovaná slova dle RVP pro 3. ročník.", "Bez složitých příbuzných odvozenin."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Po B, L, M, P, S, V, Z píšeme Y jen ve vyjmenovaných slovech a jejich příbuzných. Jinak I.",
      steps: ["Podívej se, po které souhlásce píšu.", "Vybavím si seznam vyjmenovaných slov pro tuto souhlásku.", "Je to vyjmenované (nebo příbuzné)? → Y. Není? → I."],
      commonMistake: "'být' (vyjmenované → Y) vs 'bít' (bít holí → I) — jsou to různá slova!",
      example: "mýdlo: po M, je vyjmenované → Y. milovat: po M, ale není vyjmenované → I.",
    },
  },
];
