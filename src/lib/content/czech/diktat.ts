import type { TopicMetadata, PracticeTask, HelpData } from "../../types";
import { DIKTAT_POOL } from "../../diktatPool";
import type { DiktatItem } from "../../diktatPool";

// ── HELPERS ─────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── DIKTAT FILTER ───────────────────────────────────────────

let _diktatActiveTypes: string[] | null = null;

export function setDiktatFilter(types: string[] | null) {
  _diktatActiveTypes = types;
}

// ── GENERATOR ───────────────────────────────────────────────

function genDiktat(_level: number): PracticeTask[] {
  const pool = _diktatActiveTypes && _diktatActiveTypes.length > 0
    ? DIKTAT_POOL.filter(item => _diktatActiveTypes!.includes(item.type))
    : DIKTAT_POOL;

  const byType: Record<string, DiktatItem[]> = {};
  for (const item of pool) {
    if (!byType[item.type]) byType[item.type] = [];
    byType[item.type].push(item);
  }

  const types = shuffleArray(Object.keys(byType));
  const selected: DiktatItem[] = [];
  for (const type of types) {
    const available = shuffleArray(byType[type]);
    selected.push(...available.slice(0, 20));
    if (selected.length >= 60) break;
  }

  while (selected.length < 60) {
    const remaining = pool.filter(item => !selected.includes(item));
    if (remaining.length === 0) break;
    selected.push(shuffleArray(remaining)[0]);
  }

  return shuffleArray(selected.slice(0, 60)).map((item) => ({
    question: `Doplň: ${item.sentence}`,
    correctAnswer: item.answer,
    options: shuffleArray([...item.options]),
    solutionSteps: [
      `Zjisti, jaké pravopisné pravidlo platí.`,
      item.rule,
      `Správná odpověď: „${item.answer}".`,
    ],
    hints: [`Ve větě „${item.sentence}" — o jaký pravopisný jev jde? (y/i po souhlásce, párová souhláska, velké písmeno?)`, `Urči typ souhlásky nebo pravidlo, které platí — a podle toho doplň.`],
  }));
}

// ── HELP TEMPLATE ───────────────────────────────────────────

const HELP_DIKTAT: HelpData = {
  hint: "V diktátu musíš nejdřív poznat, jaké pravopisné pravidlo platí — a pak ho správně použít.",
  steps: [
    "Přečti si větu a najdi místo s chybějícím písmenem.",
    "Zjisti, o jaký pravopisný jev jde: y/i po souhlásce? Párová souhláska? Velké písmeno?",
    "Použij správné pravidlo: vyjmenovaná slova, tvrdé/měkké souhlásky, párové souhlásky, nebo vlastní jméno.",
    "Zkontroluj: dává doplněné slovo ve větě smysl?",
  ],
  commonMistake: "Nejčastější chyba: žák zapomene rozlišit, jestli souhláska je tvrdá, měkká, nebo obojetná — a použije špatné pravidlo.",
  example: "\"Na louce stála kob_la.\" → obojetná souhláska B → je to vyjmenované slovo? → kobyla ANO → y.",
  visualExamples: [
    {
      label: "Jak na doplňovací diktát",
      illustration:
        "1️⃣ Najdi pravidlo:\n" +
        "   y/i? → Jaká je souhláska před ním?\n" +
        "   🟫 tvrdá (h,ch,k,r) → vždy Y\n" +
        "   🟦 měkká (ž,š,č,ř,c,j) → vždy I\n" +
        "   🟨 obojetná (b,l,m,p,s,v,z) → vyjmenované?\n\n" +
        "   d/t, b/p, z/s...? → párová souhláska\n" +
        "   💡 Zkus jiný tvar slova!\n\n" +
        "   P/p? → vlastní jméno = VELKÉ",
    },
    {
      label: "Příklady z diktátu",
      illustration:
        "🟨 kob_la → B je obojetná → kobyla = vyjm. → Y ✅\n" +
        "🟫 r_ba → R je tvrdá → vždy Y ✅\n" +
        "🟦 c_rkus → C je měkká → vždy I ✅\n" +
        "🔤 le_ → led/let? → ledy → D ✅\n" +
        "🏙️ _raha → vlastní jméno → P ✅",
    },
  ],
};

// ── TOPIC METADATA ──────────────────────────────────────────

export const DIKTAT_TOPICS: TopicMetadata[] = [
  {
    id: "cz-diktat",
    title: "Doplňovací diktát",
    subject: "čeština",
    category: "Diktát",
    topic: "Doplňovací diktát",
    briefDescription: "Doplníš chybějící písmena do vět — a musíš sám poznat, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "doplň", "pravopisné cvičení", "doplňování"],
    goals: ["Naučíš se použít správné pravopisné pravidlo v celé větě — ne jen u izolovaného slova."],
    boundaries: [
      "Pouze pravopisné jevy pro daný ročník",
      "Žádné složité souvětí",
      "Jedno chybějící písmeno na větu",
    ],
    gradeRange: [3, 3],
    practiceType: "result_only",
    defaultLevel: 2,
    inputType: "select_one",
    generator: genDiktat,
    helpTemplate: HELP_DIKTAT,
  },
];
