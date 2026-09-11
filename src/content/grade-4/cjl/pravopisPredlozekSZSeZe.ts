import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). Původní pool měl chybné klíče
// i podle vlastního pravidla: „Pracoval ___ soustředěním“ → „s“ (správně
// se soustředěním), „Pomáhal ___ nadšením“ → „se“ (správně s nadšením),
// a u vět se směrem shora dolů („Vypadlo ___ stolu“, „Sníh padal ___
// střechy“) chtěl „ze“, přestože nápověda učila „se střechy“.
//
// Význam „shora dolů“ (s kopce × z kopce) tu záměrně není: dnešní norma
// připouští obojí a doplňovačka s jedním klíčem by dítěti vyčítala
// správnou odpověď. Téma drží dvě jasná pravidla:
//   s/se + 7. pád — s kým? s čím? (dohromady)
//   z/ze + 2. pád — odkud? (zevnitř, odněkud)
// a delší tvar se/ze tam, kde by se krátký špatně vyslovoval.
//
// L1 = krátký tvar s/z · L2 = přibývá se/ze před s, z, š, ž
// L3 = záludné případy (se psem, se mnou, se všemi, s nadšením × se zájmem).

const OPTIONS = ["s", "z", "se", "ze"];

function uloha(veta: string, klic: "s" | "z" | "se" | "ze"): PracticeTask {
  const po = veta.split("___ ")[1] ?? "";
  const slovo = po.split(/[\s,.!?]/)[0];
  const sKym = klic.startsWith("s");
  const dlouhy = klic.length === 2;
  const jina = sKym ? "odkud?" : "s kým? s čím?";
  const optionFeedback: Record<string, string> = {};
  for (const o of OPTIONS) {
    if (o === klic) continue;
    if (o[0] !== klic[0]) {
      optionFeedback[o] = `„${o}“ patří k otázce „${jina}“. Tady se ale ptáme „${sKym ? "s kým? s čím?" : "odkud?"}“.`;
    } else if (dlouhy) {
      optionFeedback[o] = `Krátký tvar by se tu špatně vyslovoval. Píše se delší: „${klic} ${slovo}“.`;
    } else {
      optionFeedback[o] = `Delší tvar píšeme jen tam, kde by se krátký špatně vyslovoval (se sestrou, ze školy). „${klic} ${slovo}“ se vysloví snadno.`;
    }
  }
  return {
    question: `Doplň správnou předložku: „${veta}“`,
    correctAnswer: klic,
    options: [...OPTIONS],
    blanks: [klic],
    optionFeedback,
    hints: [
      `Na jakou otázku odpovídá ve větě slovo „${slovo}“?`,
      `Nejdřív rozhodni podle otázky: s kým, s čím? — nebo odkud? Pak zkus říct předložku nahlas před slovem „${slovo}“: když se krátký tvar špatně vyslovuje, přidej -e.`,
    ],
    explanation: `Ptáme se „${sKym ? "s kým? s čím?" : "odkud?"}“: ${veta.replace("___", klic)}${dlouhy ? ` Delší tvar „${klic}“ je tu proto, že „${klic[0]} ${slovo}“ by se špatně vyslovovalo.` : ""}`,
  };
}

const L1: PracticeTask[] = ([
  ["Šel jsem na procházku ___ tátou.", "s"],
  ["Tomáš přišel ___ kamarádem.", "s"],
  ["Vyšli jsme ___ lesa.", "z"],
  ["Vyndal pero ___ penálu.", "z"],
  ["Hraju si ___ bratrem.", "s"],
  ["Přinesla vodu ___ potoka.", "z"],
  ["Jana jede ___ babičkou k moři.", "s"],
  ["Kočka vyskočila ___ krabice.", "z"],
  ["Pijeme čaj ___ citronem.", "s"],
  ["Vrátili jsme se ___ divadla.", "z"],
  ["Maminka přijela ___ Brna.", "z"],
  ["Na výlet jedu ___ dědou.", "s"],
  ["Voda teče ___ kohoutku.", "z"],
] as [string, "s" | "z"][]).map(([v, k]) => uloha(v, k));

const L2: PracticeTask[] = ([
  ["Odešli jsme ___ školy.", "ze"],
  ["Povídala si ___ sestrou.", "se"],
  ["Vytáhl svačinu ___ batohu.", "z"],
  ["Petr hraje fotbal ___ spolužáky.", "se"],
  ["Vypadl mu klíč ___ kapsy.", "z"],
  ["Vylila vodu ___ džbánu.", "z"],
  ["Mluvil jsem ___ ředitelem.", "s"],
  ["Přijeli jsme ___ Zlína.", "ze"],
  ["Kluci se vrátili ___ hřiště.", "z"],
  ["Babička mluvila ___ sousedkou.", "se"],
  ["Vyběhl ___ zahrady.", "ze"],
  ["Šla jsem na nákup ___ maminkou.", "s"],
  ["Vytáhla svetr ___ šuplíku.", "ze"],
  ["Hrála si ___ žákyní z vedlejší třídy.", "se"],
] as [string, "s" | "z" | "se" | "ze"][]).map(([v, k]) => uloha(v, k));

const L3: PracticeTask[] = ([
  ["Pracoval ___ nadšením celé odpoledne.", "s"],
  ["Úkol psala ___ soustředěním.", "se"],
  ["Přivítala hosty ___ úsměvem.", "s"],
  ["Poslouchal vyprávění ___ zájmem.", "se"],
  ["Tatínek šel ven ___ psem.", "se"],
  ["Ten dopis přišel ___ Švédska.", "ze"],
  ["Rozloučila se ___ všemi kamarády.", "se"],
  ["Strýc se vrátil ___ zahraničí.", "ze"],
  ["Půjdeš ___ mnou do kina?", "se"],
  ["Dostal pohled ___ Prahy.", "z"],
  ["Teta přijela ___ Ostravy.", "z"],
  ["Na schůzku přišla ___ zpožděním.", "se"],
  ["Vylez ___ stanu, už svítí slunce.", "ze"],
  ["Ráda si povídám ___ tetou.", "s"],
] as [string, "s" | "z" | "se" | "ze"][]).map(([v, k]) => uloha(v, k));

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? L3 : level === 2 ? L2 : L1;
  return shuffle(pool);
}

export const PRAVOPISPREDLOZEKSZSEZE: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze",
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predlozek-s-z-se-ze",
    displayName: "Předložky s/z",
    title: "Pravopis předložek (s, z, se, ze)",
    studentTitle: "Předložky s/z",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Pochopíš, kdy psát s/se (s kým, s čím) a kdy z/ze (odkud).",
    keywords: ["předložka", "s", "z", "se", "ze", "pravopis", "předložky"],
    goals: [
      "Rozlišit předložky s/se (s kým, s čím) a z/ze (odkud)",
      "Správně doplnit předložku ve větě",
    ],
    boundaries: ["Nezabývat se předponami s-/z-", "Bez významu „shora dolů“ (s kopce × z kopce), kde norma připouští obojí"],
    gradeRange: [4, 4],
    inputType: "fill_blank",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g4-cjl-jazykova-vychova-stavba-slova-predpona-koren-pripona-koncovka"],
    generator: gen,
    helpTemplate: {
      hint: "s/se = s kým? s čím? (dohromady); z/ze = odkud? (zevnitř, odněkud)",
      steps: [
        "Zeptej se: s kým, s čím? → s/se. Odkud? → z/ze.",
        "Zkus spojení vyslovit: když se krátký tvar špatně říká, napiš se/ze.",
        "Delší tvar bývá před s, z, š, ž (se sestrou, ze školy) a v několika dalších spojeních (se psem, se mnou).",
      ],
      commonMistake: "Psát „se“ i tam, kde se krátký tvar dobře vysloví: správně „s nadšením“, ale „se zájmem“",
      example: "Jdu s tátou. (s kým?) × Jdu ze školy. (odkud?)",
    },
  },
];
