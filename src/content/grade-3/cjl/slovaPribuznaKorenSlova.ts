import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 3. ročníku). Otázky „Jaký je kořen slov: les,
// lesní…?" měly odpověď přímo ve znění, L3 byla sjednocením nižších úrovní
// a nápověda byla u všech úloh stejná. Teď rodiny slov s pastmi (slovo, které
// jen podobně začíná):
// L1 které slovo je příbuzné se základním slovem · L2 které slovo mezi
// příbuzná nepatří · L3 stejný kořen jako odvozené slovo (nejdřív najít
// základní slovo).

interface Rodina { zaklad: string; pribuzna: [string, string, string]; pasti: [string, string, string] }
const R = (zaklad: string, pribuzna: [string, string, string], pasti: [string, string, string]): Rodina => ({ zaklad, pribuzna, pasti });

const RODINY_A: Rodina[] = [
  R("les", ["lesní", "lesník", "lesnatý"], ["lesk", "lest", "lezec"]),
  R("voda", ["vodník", "vodní", "vodopád"], ["vodit", "vozík", "vosa"]),
  R("hora", ["horský", "horolezec", "pohoří"], ["horko", "hořet", "horký"]),
  R("ruka", ["rukavice", "ručník", "ručka"], ["rušit", "ruský", "rum"]),
  R("škola", ["školák", "školní", "školka"], ["skála", "šikovný", "škoda"]),
  R("země", ["zemský", "zeměpis", "pozemek"], ["zemřít", "zemdlít", "zeď"]),
  R("strom", ["stromek", "stromový", "stromořadí"], ["strop", "strach", "struna"]),
  R("sníh", ["sněhulák", "sněžit", "zasněžený"], ["snídat", "snít", "snop"]),
  R("ryba", ["rybník", "rybář", "rybí"], ["rybíz", "rychlý", "rýma"]),
  R("den", ["denní", "polední", "denně"], ["děkovat", "dělat", "deka"]),
  R("vítr", ["větrný", "větrník", "větrat"], ["vítěz", "vítat", "věta"]),
  R("noc", ["noční", "půlnoc", "nocovat"], ["nos", "nosit", "novina"]),
  R("kniha", ["knižní", "knihovna", "knihkupec"], ["kníže", "knoflík", "knedlík"]),
];
const RODINY_B: Rodina[] = [
  R("práce", ["pracovat", "pracovní", "pracovník"], ["pravda", "pravý", "prach"]),
  R("pes", ["psí", "pejsek", "psovod"], ["pestrý", "pěst", "pero"]),
  R("oko", ["oční", "očko", "očička"], ["okno", "okurka", "okap"]),
  R("mluvit", ["mluvčí", "promluva", "výmluva"], ["mlýn", "mlha", "mléko"]),
  R("srdce", ["srdečný", "srdíčko", "srdnatý"], ["srna", "srp", "srst"]),
  R("moře", ["mořský", "námořník", "přímoří"], ["mokrý", "most", "moucha"]),
  R("zahrada", ["zahradní", "zahradník", "zahrádka"], ["zahrát", "zahřát", "zahodit"]),
  R("dům", ["domek", "domov", "domácí"], ["dým", "důl", "duch"]),
  R("kůň", ["koník", "koňský", "koníček"], ["kouř", "kousek", "koule"]),
  R("cesta", ["cestovat", "cestovní", "cestovatel"], ["cena", "celý", "cedit"]),
  R("sůl", ["solit", "solný", "slánka"], ["sova", "sotva", "sokol"]),
  R("světlo", ["světelný", "svítilna", "rozsvítit"], ["svatý", "svetr", "svačina"]),
  R("zima", ["zimní", "přezimovat", "zimník"], ["zítra", "zisk", "zívat"]),
];

function pribuzne(r: Rodina): PracticeTask {
  const [a] = r.pribuzna;
  // Příklad do nápovědy nesmí klíč obsahovat (lesník × lesní).
  const b = r.pribuzna.slice(1).find((w) => !w.includes(a)) ?? r.pribuzna[2];
  return choice(`Které slovo je příbuzné se slovem „${r.zaklad}“?`, a,
    r.pasti.map((p) => ({ value: p, why: `„${p}“ jen podobně začíná, významem se slovem „${r.zaklad}“ nesouvisí.` })) as never, {
      hints: [
        `Které slovo z nabídky má stejný kořen i podobný význam jako „${r.zaklad}“?`,
        `Příbuzné slovo nese stejný význam jako „${r.zaklad}“ — třeba „${b}“. Past: slovo může začínat podobně a znamenat něco úplně jiného.`,
      ],
      explanation: `„${a}“ patří do rodiny slova „${r.zaklad}“ — má stejný kořen a souvisí s ním významem.`,
    });
}

function nepatri(r: Rodina): PracticeTask {
  const [past] = r.pasti;
  // Pevné pořadí: jedna rodina = jedna úloha (zamíchání by dělalo „nové“ úlohy se stejnou nápovědou).
  const vse = [...r.pribuzna, past].sort((x, y) => x.localeCompare(y, "cs"));
  return choice(`Které slovo nepatří mezi slova příbuzná se slovem „${r.zaklad}“: ${vse.join(", ")}?`, past,
    r.pribuzna.map((p) => ({ value: p, why: `„${p}“ příbuzné je — má stejný kořen jako „${r.zaklad}“ a souvisí s ním významem.` })) as never, {
      hints: [
        `Co znamená „${r.zaklad}“? U každého slova z nabídky se zeptej, jestli s tím významem souvisí.`,
        "Příbuzná slova mají stejný kořen i podobný význam. Jedno slovo jen podobně zní, ale znamená něco úplně jiného.",
      ],
      explanation: `„${past}“ jen podobně zní, ale se slovem „${r.zaklad}“ významem nesouvisí. Ostatní slova do rodiny patří.`,
    });
}

function stejnyKoren(r: Rodina): PracticeTask {
  const [odvozene, , klic] = r.pribuzna;
  return choice(`Které slovo má stejný kořen jako „${odvozene}“?`, klic,
    r.pasti.map((p) => ({ value: p, why: `„${p}“ jen podobně začíná — s „${odvozene}“ nemá společný význam.` })) as never, {
      hints: [
        `K jakému základnímu slovu patří „${odvozene}“? Najdi v nabídce další slovo z téže rodiny.`,
        `„${odvozene}“ patří ke slovu „${r.zaklad}“. Slovo se stejným kořenem musí souviset i s významem, ne jen podobně začínat.`,
      ],
      explanation: `„${odvozene}“ i „${klic}“ patří do rodiny slova „${r.zaklad}“ — mají stejný kořen.`,
    });
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(RODINY_A).map(pribuzne);
  if (level === 2) return shuffle(RODINY_B).map(nepatri);
  return shuffle(RODINY_A).map(stejnyKoren);
}

export const SLOVAPRIBYZNAKOREN: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-pribuzna-koren-slova",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-pribuzna-koren-slova",
    title: "Slova příbuzná, kořen slova",
    studentTitle: "Příbuzná slova",
    illustrationDesc: "strom s kořeny, na větvích visí cedulky se slovy les, lesní, lesník, u kořene nápis kořen LES, veselé kreslené prostředí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Naučíš se najít příbuzná slova a jejich společný kořen.",
    keywords: ["příbuzná slova", "kořen slova", "rodina slov", "slovní základy"],
    goals: [
      "Rozpoznat skupinu příbuzných slov.",
      "Najít kořen v příbuzných slovech.",
      "Odlišit příbuzná slova od nepříbuzných.",
    ],
    boundaries: ["Jen základní skupiny příbuzných slov", "Bez předpon a přípon do hloubky"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Příbuzná slova mají stejný kořen: les → lesní, lesník, lesopark. Kořen = společná část.",
      steps: [
        "Přečti si všechna slova a hledej, co mají společného.",
        "Porovnej: les, lesní, lesník — společná část je LES — to je kořen.",
      ],
      commonMistake: "Záměna podobně znějících slov (les × lesk) — nestačí znění, musí být i příbuzný význam.",
      example: "dům, domek, domácí, domov — kořen DŮM/DOM. Všechna slova nějak souvisejí s pojmem 'dům'.",
    },
  },
];
