import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL_L1: QA[] = [
  { q: "Jaký druh zájmena je 'nikdo'?", a: "záporné", opts: ["záporné", "neurčité", "osobní", "tázací"] },
  { q: "Jaký druh zájmena je 'já'?", a: "osobní", opts: ["osobní", "přivlastňovací", "ukazovací", "tázací"] },
  { q: "Jaký druh zájmena je 'můj'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "neurčité"] },
  { q: "Jaký druh zájmena je 'ten'?", a: "ukazovací", opts: ["ukazovací", "osobní", "tázací", "přivlastňovací"] },
  { q: "Jaký druh zájmena je 'kdo'?", a: "tázací", opts: ["tázací", "osobní", "záporné", "neurčité"] },
  { q: "Jaký druh zájmena je 'někdo'?", a: "neurčité", opts: ["neurčité", "osobní", "záporné", "tázací"] },
  { q: "Jaký druh zájmena je 'nic'?", a: "záporné", opts: ["záporné", "neurčité", "tázací", "osobní"] },
  { q: "Jaký druh zájmena je 'ona'?", a: "osobní", opts: ["osobní", "ukazovací", "přivlastňovací", "vztažné"] },
  { q: "Jaký druh zájmena je 'tvůj'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "tázací"] },
  { q: "Jaký druh zájmena je 'který'?", a: "tázací nebo vztažné", opts: ["tázací nebo vztažné", "osobní", "přivlastňovací", "záporné"] },
  { q: "Jaký druh zájmena je 'tento'?", a: "ukazovací", opts: ["ukazovací", "osobní", "neurčité", "přivlastňovací"] },
  { q: "Jaký druh zájmena je 'žádný'?", a: "záporné", opts: ["záporné", "neurčité", "ukazovací", "tázací"] },
  { q: "Jaký druh zájmena je 'my'?", a: "osobní", opts: ["osobní", "přivlastňovací", "vztažné", "tázací"] },
  { q: "Jaký druh zájmena je 'něco'?", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"] },
  { q: "Jaký druh zájmena je 'jejich'?", a: "přivlastňovací", opts: ["přivlastňovací", "osobní", "ukazovací", "vztažné"] },
  { q: "Jaký druh zájmena je 'jenž'?", a: "vztažné", opts: ["vztažné", "tázací", "záporné", "neurčité"] },
];

const POOL_L2: QA[] = [
  { q: "Která zájmena jsou osobní?", a: "já, ty, on, ona, ono, my, vy, oni, ony", opts: ["já, ty, on, ona, ono, my, vy, oni, ony", "ten, tento, onen", "někdo, něco, nějaký", "kdo, co, jaký"] },
  { q: "Která zájmena jsou přivlastňovací?", a: "můj, tvůj, jeho, její, náš, váš, jejich", opts: ["můj, tvůj, jeho, její, náš, váš, jejich", "já, ty, on, ona", "ten, tento, tamten", "nikdo, nic, žádný"] },
  { q: "Která zájmena jsou ukazovací?", a: "ten, tento, tenhle, onen, tamten", opts: ["ten, tento, tenhle, onen, tamten", "já, ty, on", "kdo, co, jaký", "někdo, něco, nějaký"] },
  { q: "Která zájmena jsou záporná?", a: "nikdo, nic, žádný, nijaký", opts: ["nikdo, nic, žádný, nijaký", "někdo, něco, nějaký", "kdo, co, jaký", "ten, tento, onen"] },
  { q: "Která zájmena jsou tázací?", a: "kdo, co, jaký, který, čí", opts: ["kdo, co, jaký, který, čí", "jenž, který, co", "někdo, něco, nějaký", "nikdo, nic, žádný"] },
  { q: "Která zájmena jsou vztažná?", a: "který, jenž, co (ve větě vedlejší)", opts: ["který, jenž, co (ve větě vedlejší)", "kdo, co (tázací)", "ten, tento", "někdo, něco"] },
  { q: "Urči druh zájmena 'co' ve větě: 'Co děláš?'", a: "tázací", opts: ["tázací", "vztažné", "neurčité", "záporné"] },
  { q: "Urči druh zájmena 'co' ve větě: 'Přišel, co slíbil.'", a: "vztažné", opts: ["vztažné", "tázací", "neurčité", "záporné"] },
  { q: "Urči druh zájmena 'jaký' ve větě: 'Jaký je to člověk?'", a: "tázací", opts: ["tázací", "vztažné", "neurčité", "ukazovací"] },
  { q: "Urči druh zájmena: 'náš' (naše škola)", a: "přivlastňovací", opts: ["přivlastňovací", "ukazovací", "osobní", "neurčité"] },
  { q: "Urči druh zájmena 'někdo' ve větě: 'Někdo klepal na dveře.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"] },
  { q: "Urči druh zájmena 'se' ve větě: 'Dívám se na oblohu.'", a: "osobní (zvratné)", opts: ["osobní (zvratné)", "přivlastňovací", "ukazovací", "vztažné"] },
  { q: "Urči druh zájmena 'sám' ve větě: 'Udělal to sám.'", a: "neurčité (důrazové)", opts: ["neurčité (důrazové)", "záporné", "osobní", "přivlastňovací"] },
  { q: "Urči druh zájmena: 'onen' (onen vzdálený svět)", a: "ukazovací", opts: ["ukazovací", "osobní", "neurčité", "tázací"] },
  { q: "Urči druh zájmena 'nijaký'.", a: "záporné", opts: ["záporné", "neurčité", "tázací", "ukazovací"] },
  { q: "Urči druh zájmena 'čí' ve větě: 'Čí je tato taška?'", a: "tázací", opts: ["tázací", "vztažné", "přivlastňovací", "neurčité"] },
];

const POOL_L3: QA[] = [
  { q: "V jakém pádu je zájmeno 'mě' ve větě: 'Neviděl mě.'?", a: "4. pád (koho neviděl? mě)", opts: ["4. pád (koho neviděl? mě)", "2. pád", "3. pád", "6. pád"] },
  { q: "Urči druh a pád zájmena 'sobě' ve větě: 'Koupila si to pro sebe.'", a: "osobní zvratné, 4. pád (sebe)", opts: ["osobní zvratné, 4. pád (sebe)", "přivlastňovací, 2. pád", "osobní, 3. pád", "neurčité, 4. pád"] },
  { q: "Urči druh: 'všechno' ve větě: 'Zvládl všechno.'", a: "neurčité", opts: ["neurčité", "záporné", "ukazovací", "tázací"] },
  { q: "Urči druh: 'leckdo' ve větě: 'Leckdo by se divil.'", a: "neurčité", opts: ["neurčité", "záporné", "osobní", "tázací"] },
  { q: "Urči druh zájmena v souvětí: 'Přišel chlapec, který byl hodný.'", a: "vztažné (který)", opts: ["vztažné (který)", "tázací (který)", "ukazovací", "neurčité"] },
  { q: "Urči druh: 'málokdo' ve větě: 'Málokdo o tom ví.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"] },
  { q: "Urči druh a pád zájmena 'jejich' ve větě: 'To je jejich dům.'", a: "přivlastňovací, přívlastek (gen.)", opts: ["přivlastňovací, přívlastek (gen.)", "osobní, 2. pád", "ukazovací", "vztažné"] },
  { q: "Urči druh: 'nikterak' ve větě: 'Nikterak se nespěchá.'", a: "záporné příslovce (od záporného zájmena)", opts: ["záporné příslovce (od záporného zájmena)", "záporné zájmeno", "neurčité zájmeno", "tázací příslovce"] },
  { q: "Urči druh: 'tentýž' ve větě: 'Přišel tentýž člověk.'", a: "ukazovací (totožnostní)", opts: ["ukazovací (totožnostní)", "neurčité", "osobní", "tázací"] },
  { q: "Urči druh: 'kdekdo' ve větě: 'O tom věděl kdekdo.'", a: "neurčité", opts: ["neurčité", "záporné", "tázací", "osobní"] },
  { q: "Urči druh: 'sebe' ve větě: 'Myslí jen na sebe.'", a: "osobní zvratné", opts: ["osobní zvratné", "přivlastňovací", "záporné", "neurčité"] },
  { q: "Urči druh: 'jiný' ve větě: 'Přijel jiný vlak.'", a: "neurčité", opts: ["neurčité", "ukazovací", "záporné", "tázací"] },
  { q: "Urči druh zájmena 'jaký' ve větě: 'Nevím, jaký bude výsledek.'", a: "vztažné (uvozuje větu vedlejší)", opts: ["vztažné (uvozuje větu vedlejší)", "tázací", "neurčité", "ukazovací"] },
  { q: "Urči druh: 'kdosi' ve větě: 'Kdosi zavolal z neznámého čísla.'", a: "neurčité", opts: ["neurčité", "záporné", "osobní", "tázací"] },
  { q: "Urči druh: 'veškerý' ve větě: 'Využil veškerý čas.'", a: "neurčité (totalizační)", opts: ["neurčité (totalizační)", "ukazovací", "záporné", "tázací"] },
  { q: "Urči, co zájmena nahrazují v textu.", a: "jména (podstatná, přídavná) — zabraňují opakování", opts: ["jména (podstatná, přídavná) — zabraňují opakování", "slovesa", "příslovce", "předložky"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Osobní: já, ty, on, ona, my, vy, oni",
      "Přivlastňovací: můj, tvůj, jeho, náš, váš, jejich",
      "Ukazovací: ten, tento, onen, tamten",
      "Tázací: kdo, co, jaký, který — ptáme se",
      "Vztažná: který, jenž, co — uvozují větu vedlejší",
      "Neurčitá: někdo, něco, leckdo, kdekdo",
      "Záporná: nikdo, nic, žádný, nijaký",
    ],
    solutionSteps: [
      "Zeptej se: Co zájmeno vyjadřuje?",
      "Označuje osobu? → osobní",
      "Přivlastňuje? → přivlastňovací",
      "Ukazuje? → ukazovací",
      "Ptá se? → tázací; uvozuje vedlejší větu? → vztažné",
      "Neujasňuje? → neurčité; popírá? → záporné",
    ],
  }));
}

export const ZAJMENADRUHYZAJMEN: TopicMetadata[] = [
  {
    id: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    rvpNodeId: "g4-cjl-jazykova-vychova-tvaroslovi-zajmena-druhy-zajmen",
    title: "Zájmena - druhy zájmen",
    studentTitle: "Druhy zájmen",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Jazyková výchova",
    briefDescription: "Poznáš druhy zájmen a naučíš se je rozlišovat ve větách.",
    keywords: ["zájmeno", "osobní", "přivlastňovací", "ukazovací", "tázací", "vztažné", "neurčité", "záporné"],
    goals: [
      "Rozlišit druhy zájmen",
      "Určit druh zájmena ve větě",
    ],
    boundaries: ["Bez pokročilého skloňování zájmen", "Bez záporných příslovcí"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "7 druhů: osobní, přivlastňovací, ukazovací, tázací, vztažná, neurčitá, záporná",
      steps: [
        "Označuje osobu (já, ty, on)? → osobní",
        "Přivlastňuje (můj, tvůj)? → přivlastňovací",
        "Ukazuje (ten, tento)? → ukazovací",
        "Ptá se (kdo, co)? → tázací; uvozuje větu vedlejší? → vztažné",
        "Neujasňuje (někdo, něco)? → neurčité; popírá (nikdo, nic)? → záporné",
      ],
      commonMistake: "Záměna tázacího 'který' a vztažného 'který': tázací = ptáme se, vztažné = uvozuje větu vedlejší",
      example: "Jaký druh zájmena je 'nikdo'? → záporné",
    },
  },
];
