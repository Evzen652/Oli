import type { TopicMetadata, PracticeTask, HelpData } from "../../types";

// ── HELPERS ─────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── SLOVNÍ DRUHY ────────────────────────────────────────────

const SLOVNI_DRUHY_POOL = [
  { sentence: "**Pes** běží po zahradě.", word: "Pes", answer: "podstatné jméno" },
  { sentence: "Maminka **vaří** oběd.", word: "vaří", answer: "sloveso" },
  { sentence: "Na stole leží **červené** jablko.", word: "červené", answer: "přídavné jméno" },
  { sentence: "**Kočka** spí na gauči.", word: "Kočka", answer: "podstatné jméno" },
  { sentence: "Děti si **hrají** venku.", word: "hrají", answer: "sloveso" },
  { sentence: "Vidím **velký** dům.", word: "velký", answer: "přídavné jméno" },
  { sentence: "**Babička** peče koláč.", word: "Babička", answer: "podstatné jméno" },
  { sentence: "Tatínek **čte** noviny.", word: "čte", answer: "sloveso" },
  { sentence: "Na louce rostou **žluté** květiny.", word: "žluté", answer: "přídavné jméno" },
  { sentence: "**Škola** začíná v osm hodin.", word: "Škola", answer: "podstatné jméno" },
  { sentence: "Honza **kreslí** obrázek.", word: "kreslí", answer: "sloveso" },
  { sentence: "Máme **malého** psa.", word: "malého", answer: "přídavné jméno" },
  { sentence: "Na nebi svítí **slunce**.", word: "slunce", answer: "podstatné jméno" },
  { sentence: "Ptáci **zpívají** na stromě.", word: "zpívají", answer: "sloveso" },
  { sentence: "Koupili jsme **nový** stůl.", word: "nový", answer: "přídavné jméno" },
  { sentence: "**Kniha** leží na stole.", word: "Kniha", answer: "podstatné jméno" },
  { sentence: "Sestra **tancuje** na jevišti.", word: "tancuje", answer: "sloveso" },
  { sentence: "V lese stojí **starý** strom.", word: "starý", answer: "přídavné jméno" },
  { sentence: "**Auto** jede po silnici.", word: "Auto", answer: "podstatné jméno" },
  { sentence: "Žáci **počítají** příklady.", word: "počítají", answer: "sloveso" },
  { sentence: "Mám **teplý** čaj.", word: "teplý", answer: "přídavné jméno" },
  { sentence: "**Míč** letí do branky.", word: "Míč", answer: "podstatné jméno" },
  { sentence: "Kamarád **pomáhá** s úkolem.", word: "pomáhá", answer: "sloveso" },
  { sentence: "Na plotě sedí **černý** kos.", word: "černý", answer: "přídavné jméno" },
  { sentence: "**Voda** teče z kohoutku.", word: "Voda", answer: "podstatné jméno" },
  { sentence: "Ema **maluje** obrázek.", word: "maluje", answer: "sloveso" },
  { sentence: "Mám **hezký** svetr.", word: "hezký", answer: "přídavné jméno" },
  { sentence: "**Vlak** přijíždí na nádraží.", word: "Vlak", answer: "podstatné jméno" },
  { sentence: "Babička **pletla** šálu.", word: "pletla", answer: "sloveso" },
  { sentence: "Vedle domu roste **vysoký** strom.", word: "vysoký", answer: "přídavné jméno" },
];

function genSlovniDruhy(_level: number): PracticeTask[] {
  const allOptions = ["podstatné jméno", "sloveso", "přídavné jméno"];
  return shuffleArray(SLOVNI_DRUHY_POOL).slice(0, SLOVNI_DRUHY_POOL.length).map((item) => {
    const opts = shuffleArray([...allOptions]);
    const hintQuestion = item.answer === "podstatné jméno"
      ? `Zeptej se: Kdo? Co? → je „${item.word}" odpověď?`
      : item.answer === "sloveso"
      ? `Zeptej se: Co dělá? → je „${item.word}" činnost?`
      : `Zeptej se: Jaký? Jaká? Jaké? → popisuje „${item.word}" vlastnost?`;
    return {
      question: `Jaký slovní druh je zvýrazněné slovo?\n${item.sentence}`,
      correctAnswer: item.answer,
      options: opts,
      solutionSteps: [
        `Zvýrazněné slovo je „${item.word}".`,
        item.answer === "podstatné jméno"
          ? `Podstatné jméno pojmenovává osoby, zvířata, věci nebo vlastnosti. Ptáme se: Kdo? Co?`
          : item.answer === "sloveso"
          ? `Sloveso vyjadřuje činnost nebo stav. Ptáme se: Co dělá?`
          : `Přídavné jméno popisuje vlastnost podstatného jména. Ptáme se: Jaký? Jaká? Jaké?`,
        `Správná odpověď: ${item.answer}.`,
      ],
      hints: [`Podívej se na slovo „${item.word}" — co vyjadřuje?`, hintQuestion],
    };
  });
}

// ── ROD A ČÍSLO PODSTATNÝCH JMEN ────────────────────────────

const ROD_CISLO_POOL: { word: string; rod: string; cislo: string; singular?: string }[] = [
  { word: "pes", rod: "mužský rod", cislo: "jednotné číslo" },
  { word: "kočka", rod: "ženský rod", cislo: "jednotné číslo" },
  { word: "okno", rod: "střední rod", cislo: "jednotné číslo" },
  { word: "stromy", rod: "mužský rod", cislo: "množné číslo", singular: "strom" },
  { word: "žáby", rod: "ženský rod", cislo: "množné číslo", singular: "žába" },
  { word: "auta", rod: "střední rod", cislo: "množné číslo", singular: "auto" },
  { word: "dům", rod: "mužský rod", cislo: "jednotné číslo" },
  { word: "kniha", rod: "ženský rod", cislo: "jednotné číslo" },
  { word: "město", rod: "střední rod", cislo: "jednotné číslo" },
  { word: "chlapci", rod: "mužský rod", cislo: "množné číslo", singular: "chlapec" },
  { word: "hvězdy", rod: "ženský rod", cislo: "množné číslo", singular: "hvězda" },
  { word: "jablka", rod: "střední rod", cislo: "množné číslo", singular: "jablko" },
  { word: "vlak", rod: "mužský rod", cislo: "jednotné číslo" },
  { word: "voda", rod: "ženský rod", cislo: "jednotné číslo" },
  { word: "slunce", rod: "střední rod", cislo: "jednotné číslo" },
  { word: "ptáci", rod: "mužský rod", cislo: "množné číslo", singular: "pták" },
  { word: "řeky", rod: "ženský rod", cislo: "množné číslo", singular: "řeka" },
  { word: "kolečka", rod: "střední rod", cislo: "množné číslo", singular: "kolečko" },
  { word: "stůl", rod: "mužský rod", cislo: "jednotné číslo" },
  { word: "židle", rod: "ženský rod", cislo: "jednotné číslo" },
  { word: "kuře", rod: "střední rod", cislo: "jednotné číslo" },
  { word: "hrady", rod: "mužský rod", cislo: "množné číslo", singular: "hrad" },
  { word: "trávy", rod: "ženský rod", cislo: "množné číslo", singular: "tráva" },
  { word: "města", rod: "střední rod", cislo: "množné číslo", singular: "město" },
  { word: "hrad", rod: "mužský rod", cislo: "jednotné číslo" },
  { word: "tráva", rod: "ženský rod", cislo: "jednotné číslo" },
  { word: "křeslo", rod: "střední rod", cislo: "jednotné číslo" },
  { word: "medvědi", rod: "mužský rod", cislo: "množné číslo", singular: "medvěd" },
  { word: "myši", rod: "ženský rod", cislo: "množné číslo", singular: "myš" },
  { word: "vajíčka", rod: "střední rod", cislo: "množné číslo", singular: "vajíčko" },
];

function genRodCislo(_level: number): PracticeTask[] {
  const items = shuffleArray(ROD_CISLO_POOL).slice(0, ROD_CISLO_POOL.length);
  return items.map((item, i) => {
    const isRod = i % 2 === 0;
    if (isRod) {
      const isPlural = item.cislo === "množné číslo";
      const hintWord = isPlural && item.singular ? item.singular : item.word;
      const pluralNote = isPlural ? `Převeď do jednotného čísla: ${item.word} → ${hintWord}. ` : "";
      return {
        question: `Urči rod podstatného jména: „${item.word}"`,
        correctAnswer: item.rod,
        options: shuffleArray(["mužský rod", "ženský rod", "střední rod"]),
        solutionSteps: [
          `${pluralNote}Zkus si ke slovu přidat ukazovací zájmeno:`,
          `ten ${hintWord} → mužský rod, ta ${hintWord} → ženský rod, to ${hintWord} → střední rod.`,
          `Správná odpověď: ${item.rod}.`,
        ],
        hints: [
          isPlural
            ? `Převeď do jednotného čísla (${item.word} → ${hintWord}) a zkus: ten ${hintWord}, ta ${hintWord}, to ${hintWord} — co zní správně?`
            : `Zkus si říct: ten ${item.word}, ta ${item.word}, to ${item.word} — co zní správně?`,
          `ten = mužský rod, ta = ženský rod, to = střední rod.`,
        ],
      };
    } else {
      return {
        question: `Urči číslo podstatného jména: „${item.word}"`,
        correctAnswer: item.cislo,
        options: shuffleArray(["jednotné číslo", "množné číslo"]),
        solutionSteps: [
          `Jednotné číslo = jedna věc, množné číslo = víc věcí.`,
          `„${item.word}" — ${item.cislo === "jednotné číslo" ? "je to jedna věc" : "je to víc věcí"}.`,
          `Správná odpověď: ${item.cislo}.`,
        ],
        hints: [`Je „${item.word}" jedna věc, nebo víc věcí?`, `Jednotné číslo = jedna, množné číslo = víc.`],
      };
    }
  });
}

// ── URČOVÁNÍ SLOVES ─────────────────────────────────────────

const SLOVESA_POOL = [
  { sentence: "Já **čtu** knihu.", osoba: "1. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "Ty **běžíš** rychle.", osoba: "2. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "On **píše** dopis.", osoba: "3. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "My **zpíváme** písničku.", osoba: "1. osoba", cislo: "množné", cas: "přítomný čas" },
  { sentence: "Vy **hrajete** fotbal.", osoba: "2. osoba", cislo: "množné", cas: "přítomný čas" },
  { sentence: "Oni **kreslí** obrázky.", osoba: "3. osoba", cislo: "množné", cas: "přítomný čas" },
  { sentence: "Já **jsem běžel** do školy.", osoba: "1. osoba", cislo: "jednotné", cas: "minulý čas" },
  { sentence: "Ty **jsi psala** úkol.", osoba: "2. osoba", cislo: "jednotné", cas: "minulý čas" },
  { sentence: "Ona **zpívala** na koncertě.", osoba: "3. osoba", cislo: "jednotné", cas: "minulý čas" },
  { sentence: "My **jsme hráli** venku.", osoba: "1. osoba", cislo: "množné", cas: "minulý čas" },
  { sentence: "Vy **jste četli** knihu.", osoba: "2. osoba", cislo: "množné", cas: "minulý čas" },
  { sentence: "Oni **malovali** obrázek.", osoba: "3. osoba", cislo: "množné", cas: "minulý čas" },
  { sentence: "Já **budu počítat** příklady.", osoba: "1. osoba", cislo: "jednotné", cas: "budoucí čas" },
  { sentence: "Ty **budeš kreslit** obrázek.", osoba: "2. osoba", cislo: "jednotné", cas: "budoucí čas" },
  { sentence: "On **bude psát** test.", osoba: "3. osoba", cislo: "jednotné", cas: "budoucí čas" },
  { sentence: "My **budeme zpívat** na školní besídce.", osoba: "1. osoba", cislo: "množné", cas: "budoucí čas" },
  { sentence: "Vy **budete tancovat** na plese.", osoba: "2. osoba", cislo: "množné", cas: "budoucí čas" },
  { sentence: "Oni **budou číst** pohádky.", osoba: "3. osoba", cislo: "množné", cas: "budoucí čas" },
  { sentence: "Já **skáču** přes švihadlo.", osoba: "1. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "Ty **jíš** svačinu.", osoba: "2. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "Ona **spí** v posteli.", osoba: "3. osoba", cislo: "jednotné", cas: "přítomný čas" },
  { sentence: "My **jsme jedli** oběd.", osoba: "1. osoba", cislo: "množné", cas: "minulý čas" },
  { sentence: "Ty **budeš spát** u babičky.", osoba: "2. osoba", cislo: "jednotné", cas: "budoucí čas" },
  { sentence: "Vy **pijete** čaj.", osoba: "2. osoba", cislo: "množné", cas: "přítomný čas" },
];

function genSlovesaUrcovani(_level: number): PracticeTask[] {
  const items = shuffleArray(SLOVESA_POOL).slice(0, SLOVESA_POOL.length);
  return items.map((item, i) => {
    const type = i % 3;
    if (type === 0) {
      return {
        question: `Urči osobu zvýrazněného slovesa:\n${item.sentence}`,
        correctAnswer: item.osoba,
        options: shuffleArray(["1. osoba", "2. osoba", "3. osoba"]),
        solutionSteps: [`1. osoba = já/my, 2. osoba = ty/vy, 3. osoba = on/ona/ono/oni.`, `Správná odpověď: ${item.osoba}.`],
        hints: [`Podívej se na větu „${item.sentence.replace(/\*\*/g, '')}" — kdo dělá tu činnost?`, `Já/my = 1. osoba, ty/vy = 2. osoba, on/ona/oni = 3. osoba.`],
      };
    } else if (type === 1) {
      return {
        question: `Urči číslo zvýrazněného slovesa:\n${item.sentence}`,
        correctAnswer: item.cislo,
        options: shuffleArray(["jednotné", "množné"]),
        solutionSteps: [`Jednotné = jeden člověk dělá činnost, množné = víc lidí.`, `Správná odpověď: ${item.cislo}.`],
        hints: [`Ve větě „${item.sentence.replace(/\*\*/g, '')}" — dělá činnost jeden člověk, nebo víc?`, `Jednotné = jeden, množné = víc.`],
      };
    } else {
      return {
        question: `Urči čas zvýrazněného slovesa:\n${item.sentence}`,
        correctAnswer: item.cas,
        options: shuffleArray(["minulý čas", "přítomný čas", "budoucí čas"]),
        solutionSteps: [`Minulý čas = už se to stalo, přítomný = děje se teď, budoucí = teprve se stane.`, `Správná odpověď: ${item.cas}.`],
        hints: [`Ve větě „${item.sentence.replace(/\*\*/g, '')}" — děje se to teď, už se to stalo, nebo se teprve stane?`, `Hledej v tvaru slovesa vodítko: pomocné slovo (budu/jsem) nebo koncovku (-l/-la). To ti napoví, kdy se to děje.`],
      };
    }
  });
}

// ── ZÁKLAD VĚTY ─────────────────────────────────────────────

const ZAKLAD_VETY_POOL = [
  { sentence: "Pes štěká na dvore.", podmet: "pes", prisudek: "štěká", otazka: "Co dělá pes?", odpoved: "štěká", typ: "přísudek" },
  { sentence: "Kočka spí na gauči.", podmet: "kočka", prisudek: "spí", otazka: "Kdo spí na gauči?", odpoved: "kočka", typ: "podmět" },
  { sentence: "Maminka vaří oběd.", podmet: "maminka", prisudek: "vaří", otazka: "Co dělá maminka?", odpoved: "vaří", typ: "přísudek" },
  { sentence: "Ptáci zpívají na stromě.", podmet: "ptáci", prisudek: "zpívají", otazka: "Kdo zpívá na stromě?", odpoved: "ptáci", typ: "podmět" },
  { sentence: "Auto jede po silnici.", podmet: "auto", prisudek: "jede", otazka: "Co dělá auto?", odpoved: "jede", typ: "přísudek" },
  { sentence: "Děti si hrají venku.", podmet: "děti", prisudek: "hrají", otazka: "Kdo si hraje venku?", odpoved: "děti", typ: "podmět" },
  { sentence: "Slunce svítí na obloze.", podmet: "slunce", prisudek: "svítí", otazka: "Co dělá slunce?", odpoved: "svítí", typ: "přísudek" },
  { sentence: "Babička peče koláč.", podmet: "babička", prisudek: "peče", otazka: "Kdo peče koláč?", odpoved: "babička", typ: "podmět" },
  { sentence: "Vlak přijíždí na nádraží.", podmet: "vlak", prisudek: "přijíždí", otazka: "Co dělá vlak?", odpoved: "přijíždí", typ: "přísudek" },
  { sentence: "Žáci počítají příklady.", podmet: "žáci", prisudek: "počítají", otazka: "Kdo počítá příklady?", odpoved: "žáci", typ: "podmět" },
  { sentence: "Vítr fouká do stromů.", podmet: "vítr", prisudek: "fouká", otazka: "Co dělá vítr?", odpoved: "fouká", typ: "přísudek" },
  { sentence: "Květiny rostou na zahradě.", podmet: "květiny", prisudek: "rostou", otazka: "Co dělají květiny?", odpoved: "rostou", typ: "přísudek" },
  { sentence: "Honza kreslí obrázek.", podmet: "Honza", prisudek: "kreslí", otazka: "Kdo kreslí obrázek?", odpoved: "Honza", typ: "podmět" },
  { sentence: "Déšť padá z mraků.", podmet: "déšť", prisudek: "padá", otazka: "Co dělá déšť?", odpoved: "padá", typ: "přísudek" },
  { sentence: "Ryby plavou v rybníce.", podmet: "ryby", prisudek: "plavou", otazka: "Kdo plave v rybníce?", odpoved: "ryby", typ: "podmět" },
  { sentence: "Učitelka vysvětluje úlohu.", podmet: "učitelka", prisudek: "vysvětluje", otazka: "Kdo vysvětluje úlohu?", odpoved: "učitelka", typ: "podmět" },
  { sentence: "Sníh padá z oblohy.", podmet: "sníh", prisudek: "padá", otazka: "Co dělá sníh?", odpoved: "padá", typ: "přísudek" },
  { sentence: "Medvěd spí v jeskyni.", podmet: "medvěd", prisudek: "spí", otazka: "Kdo spí v jeskyni?", odpoved: "medvěd", typ: "podmět" },
  { sentence: "Jablko padlo ze stromu.", podmet: "jablko", prisudek: "padlo", otazka: "Co udělalo jablko?", odpoved: "padlo", typ: "přísudek" },
  { sentence: "Moucha bzučí u okna.", podmet: "moucha", prisudek: "bzučí", otazka: "Kdo bzučí u okna?", odpoved: "moucha", typ: "podmět" },
];

function genZakladVety(_level: number): PracticeTask[] {
  const items = shuffleArray(ZAKLAD_VETY_POOL).slice(0, ZAKLAD_VETY_POOL.length);
  return items.map((item) => {
    const words = item.sentence.replace(/[.,!?]/g, "").split(" ").filter(w => w.length > 1).map(w => w.toLowerCase());
    const distractors = words.filter(w => w !== item.odpoved.toLowerCase()).slice(0, 2);
    const opts = shuffleArray([item.odpoved, ...distractors]);
    return {
      question: `${item.sentence}\n${item.otazka}`,
      correctAnswer: item.odpoved,
      options: opts,
      solutionSteps: [
        item.typ === "podmět"
          ? `Podmět je ten, kdo dělá činnost. Ptáme se: Kdo? Co?`
          : `Přísudek vyjadřuje, co podmět dělá. Ptáme se: Co dělá?`,
        `Správná odpověď: „${item.odpoved}".`,
      ],
      hints: [item.typ === "podmět" ? `Kdo nebo co „${item.prisudek}"? Najdi ve větě toho, kdo to dělá.` : `Co dělá „${item.podmet}"? Najdi ve větě činnost.`, `Ve větě „${item.sentence}" hledej ${item.typ === "podmět" ? "podmět (kdo/co)" : "přísudek (co dělá)"}.`],
    };
  });
}

// ── HELP TEMPLATES ──────────────────────────────────────────

const HELP_SLOVNI_DRUHY: HelpData = {
  hint: "Podstatná jména pojmenovávají věci (kdo? co?), slovesa říkají, co se děje (co dělá?), a přídavná jména popisují vlastnosti (jaký?).",
  steps: [
    "Přečti si větu a najdi zvýrazněné slovo.",
    "Zeptej se: Je to věc, osoba nebo zvíře? → podstatné jméno (kdo? co?).",
    "Vyjadřuje to činnost nebo stav? → sloveso (co dělá?).",
    "Popisuje to vlastnost? → přídavné jméno (jaký? jaká? jaké?).",
  ],
  commonMistake: 'Pozor na slovesa, která nevypadají jako činnost — třeba "spí" nebo "leží". I ty jsou slovesa, protože odpovídají na otázku "Co dělá?".',
  example: '"Velký pes běží." — velký = přídavné jméno, pes = podstatné jméno, běží = sloveso.',
  visualExamples: [
    {
      label: "Jak poznat slovní druh?",
      illustration: "🐕 PODSTATNÉ JMÉNO → Kdo? Co?\n   pes, kočka, stůl, škola\n\n🏃 SLOVESO → Co dělá?\n   běží, spí, čte, vaří\n\n🎨 PŘÍDAVNÉ JMÉNO → Jaký? Jaká? Jaké?\n   velký, červená, hezké, rychlý",
    },
  ],
};

const HELP_ROD_CISLO: HelpData = {
  hint: "Rod poznáš podle zájmena TEN/TA/TO. Číslo poznáš podle toho, jestli je to jedna věc nebo víc věcí.",
  steps: [
    "Řekni si ke slovu: ten…, ta…, to…",
    "Které zní správně? ten = mužský, ta = ženský, to = střední.",
    "Pro číslo: je to jedna věc (jednotné) nebo víc (množné)?",
  ],
  commonMistake: 'Pozor na slova jako "kuře" — říkáme "to kuře", takže je to střední rod, i když je to zvíře!',
  example: '"stůl" — ten stůl → mužský rod, jednotné číslo. "židle" — ta židle → ženský rod.',
  visualExamples: [
    {
      label: "Rod podstatných jmen",
      illustration: "🔵 Mužský rod: TEN pes, TEN dům, TEN strom\n🔴 Ženský rod: TA kočka, TA škola, TA voda\n🟢 Střední rod: TO okno, TO auto, TO kuře",
    },
  ],
};

const HELP_SLOVESA_URCOVANI: HelpData = {
  hint: "Osoba ti řekne, KDO dělá činnost (já/ty/on). Číslo ti řekne, KOLIK jich je. Čas říká, KDY se to děje.",
  steps: [
    "Osoba: já/my = 1. osoba, ty/vy = 2. osoba, on/ona/oni = 3. osoba.",
    "Číslo: jeden člověk = jednotné, víc lidí = množné.",
    "Čas: už se to stalo = minulý, děje se teď = přítomný, teprve se stane = budoucí.",
  ],
  commonMistake: 'Pozor na budoucí čas — poznáš ho podle slova "budu/budeš/bude". Třeba "budu psát" = budoucí čas.',
  example: '"Ty běžíš." — 2. osoba, jednotné číslo, přítomný čas.',
  visualExamples: [
    {
      label: "Přehled osob a časů",
      illustration: "👤 OSOBA:\n  1. já/my  |  2. ty/vy  |  3. on/ona/oni\n\n⏰ ČAS:\n  ⬅️ minulý (běžel)  |  ⏺️ přítomný (běží)  |  ➡️ budoucí (poběží)\n\n🔢 ČÍSLO:\n  jednotné (já běžím)  |  množné (my běžíme)",
    },
  ],
};

const HELP_ZAKLAD_VETY: HelpData = {
  hint: "Každá věta má základ: podmět (kdo/co) a přísudek (co dělá). Podmět je ten, kdo dělá činnost. Přísudek říká, co podmět dělá.",
  steps: [
    "Přečti si větu.",
    "Zeptej se: KDO to dělá? nebo CO to dělá? → to je podmět.",
    "Zeptej se: CO dělá podmět? → to je přísudek.",
  ],
  commonMistake: 'Pozor — podmět nemusí být vždy na začátku věty! Třeba "Na stromě zpívají ptáci." — podmět je "ptáci", ne "na stromě".',
  example: '"Pes štěká na dvore." — Kdo štěká? Pes (podmět). Co dělá pes? Štěká (přísudek).',
  visualExamples: [
    {
      label: "Podmět a přísudek",
      illustration: "🐕 Pes   štěká   na dvore.\n   ━━━    ━━━━\n  PODMĚT  PŘÍSUDEK\n\nKdo? → pes\nCo dělá? → štěká",
    },
  ],
};

// ── TOPIC METADATA ──────────────────────────────────────────

export const MLUVNICE_TOPICS: TopicMetadata[] = [
  {
    id: "cz-slovni-druhy",
    title: "Slovní druhy",
    subject: "čeština",
    category: "Mluvnice",
    topic: "Slovní druhy",
    briefDescription: "Procvičíš si rozpoznávání podstatných jmen, sloves a přídavných jmen ve větách.",
    keywords: ["slovní druhy", "podstatné jméno", "sloveso", "přídavné jméno", "jaký slovní druh"],
    goals: ["Naučíš se rozpoznat podstatné jméno, sloveso a přídavné jméno ve větě."],
    boundaries: ["Pouze 3 základní slovní druhy", "Žádné číslovky ani zájmena"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genSlovniDruhy,
    helpTemplate: HELP_SLOVNI_DRUHY,
  },
  {
    id: "cz-rod-cislo",
    title: "Rod a číslo podstatných jmen",
    subject: "čeština",
    category: "Mluvnice",
    topic: "Rod a číslo podstatných jmen",
    briefDescription: "Procvičíš si určování rodu (mužský, ženský, střední) a čísla (jednotné, množné) u podstatných jmen.",
    keywords: ["rod podstatných jmen", "číslo podstatných jmen", "mužský rod", "ženský rod", "střední rod", "jednotné číslo", "množné číslo"],
    goals: ["Naučíš se správně určit rod a číslo podstatného jména."],
    boundaries: ["Pouze podstatná jména", "Žádné skloňování"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genRodCislo,
    helpTemplate: HELP_ROD_CISLO,
  },
  {
    id: "cz-slovesa-urcovani",
    title: "Určování sloves",
    subject: "čeština",
    category: "Mluvnice",
    topic: "Určování sloves",
    briefDescription: "Procvičíš si určování osoby, čísla a času u sloves ve větách.",
    keywords: ["osoba slovesa", "číslo slovesa", "čas slovesa", "určování sloves", "minulý čas", "přítomný čas", "budoucí čas"],
    goals: ["Naučíš se určit osobu, číslo a čas slovesa ve větě."],
    boundaries: ["Pouze osoba, číslo a čas", "Žádný vid ani způsob"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genSlovesaUrcovani,
    helpTemplate: HELP_SLOVESA_URCOVANI,
  },
  {
    id: "cz-zaklad-vety",
    title: "Základ věty",
    subject: "čeština",
    category: "Mluvnice",
    topic: "Základ věty",
    briefDescription: "Procvičíš si hledání podmětu a přísudku v jednoduché větě.",
    keywords: ["základ věty", "podmět", "přísudek", "kdo co dělá", "stavba věty"],
    goals: ["Naučíš se najít podmět (kdo/co) a přísudek (co dělá) v jednoduché větě."],
    boundaries: ["Pouze jednoduché věty", "Žádná souvětí"],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genZakladVety,
    helpTemplate: HELP_ZAKLAD_VETY,
  },
];
