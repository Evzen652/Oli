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

const POOL: QA[] = [
  { q: "Co znamená slovo 'koruna' ve větě 'Král nosí zlatou korunu'?", a: "ozdoba hlavy krále", opts: ["ozdoba hlavy krále", "česká měna", "horní část stromu", "starý pozdrav"] },
  { q: "Co znamená slovo 'koruna' ve větě 'Strom má hustou korunu'?", a: "horní část stromu s větvemi", opts: ["horní část stromu s větvemi", "ozdoba hlavy krále", "česká měna", "odznak"] },
  { q: "Co znamená slovo 'koruna' ve větě 'Jogurt stojí deset korun'?", a: "česká peněžní jednotka", opts: ["česká peněžní jednotka", "ozdoba hlavy krále", "horní část stromu", "odznak"] },
  { q: "Kolik různých významů má slovo 'koruna'?", a: "více významů — je to slovo mnohoznačné", opts: ["více významů — je to slovo mnohoznačné", "jeden přesný význam — je to jednoznačné", "žádný vlastní význam", "je to cizí slovo"] },
  { q: "Co znamená slovo 'list' ve větě 'Napsal jsem dopis na list papíru'?", a: "arch papíru", opts: ["arch papíru", "zelená část rostliny", "kapsa v kabátě", "obálka dopisu"] },
  { q: "Co znamená slovo 'list' ve větě 'Strom má krásné zelené listy'?", a: "zelená část rostliny", opts: ["zelená část rostliny", "arch papíru", "kapsa v kabátě", "obálka dopisu"] },
  { q: "Je slovo 'list' jednoznačné nebo mnohoznačné?", a: "mnohoznačné — má více významů", opts: ["mnohoznačné — má více významů", "jednoznačné — má jen jeden význam", "cizí slovo bez českého ekvivalentu", "vlastní jméno"] },
  { q: "Co znamená slovo 'hlava' ve větě 'Bolí mě hlava'?", a: "část těla", opts: ["část těla", "vedoucí skupiny", "záhlaví stránky", "hlava kapitoly v knize"] },
  { q: "Co znamená slovo 'hlava' ve větě 'Je to hlava naší skupiny'?", a: "vedoucí, šéf skupiny", opts: ["vedoucí, šéf skupiny", "část těla", "záhlaví stránky", "číslo stránky"] },
  { q: "Je slovo 'hlava' jednoznačné nebo mnohoznačné?", a: "mnohoznačné — má více významů", opts: ["mnohoznačné — má více významů", "jednoznačné — má jen jeden význam", "pouze zeměpisný termín", "zastaralé slovo"] },
  { q: "Co znamená slovo 'hřbet' ve větě 'Pohladil jsem koně po hřbetu'?", a: "záda zvířete", opts: ["záda zvířete", "vrchol hory", "záda knihy (hřeben)", "část nohy"] },
  { q: "Které slovo je jednoznačné (má jen jeden běžný význam)?", a: "klokan", opts: ["klokan", "hlava", "koruna", "list"] },
  { q: "Co znamená slovo 'pero' ve větě 'Psal jsem perem'?", a: "nástroj na psaní", opts: ["nástroj na psaní", "ptačí pero", "jarní pero (péro)", "pero v závodech"] },
  { q: "Co znamená slovo 'pero' ve větě 'Ptáček ztratil pero'?", a: "část ptačího opeření", opts: ["část ptačího opeření", "nástroj na psaní", "pero v závodech", "jarní péro"] },
  { q: "Jak poznáme, který význam slova je správný?", a: "podle věty (kontextu), ve které se slovo nachází", opts: ["podle věty (kontextu), ve které se slovo nachází", "podle délky slova", "podle toho, kdo mluví", "podle abecedy"] },
  { q: "Které ze slov je mnohoznačné?", a: "zámek", opts: ["zámek", "dub", "tygr", "planeta"] },
  { q: "Co znamená slovo 'zámek' ve větě 'Dveře mají zámek'?", a: "mechanizmus k zamykání", opts: ["mechanizmus k zamykání", "historická budova", "ozdoba na náramku", "klíč"] },
  { q: "Co znamená slovo 'zámek' ve větě 'Navštívili jsme starý zámek'?", a: "historická budova, sídlo šlechty", opts: ["historická budova, sídlo šlechty", "mechanizmus k zamykání", "klíč od dveří", "ozdoba"] },
  { q: "Které slovo je jednoznačné?", a: "fotbal", opts: ["fotbal", "les", "ruka", "stůl"] },
  { q: "Co znamená slovo 'les' ve větě 'Houby rostou v lese'?", a: "prostor porostlý stromy", opts: ["prostor porostlý stromy", "přezdívka pro hustý vous", "les rukou (zvednuté ruce)", "tmavá barva"] },
  { q: "Je slovo 'les' jednoznačné nebo mnohoznačné?", a: "většinou jednoznačné, ale v přeneseném smyslu může mít další použití", opts: ["většinou jednoznačné, ale v přeneseném smyslu může mít další použití", "vždy jednoznačné", "vždy mnohoznačné jako 'koruna'", "nemá žádný vlastní význam"] },
  { q: "Co znamená slovo 'kolo' ve větě 'Jedu na kole'?", a: "jízdní kolo", opts: ["jízdní kolo", "matematický tvar", "kolo soutěže", "kolo na autě"] },
  { q: "Co znamená slovo 'kolo' ve větě 'Postoupili do druhého kola soutěže'?", a: "část soutěže, etapa", opts: ["část soutěže, etapa", "jízdní kolo", "matematický tvar kružnice", "kolo na autě"] },
  { q: "Jak se jmenuje slovo, které má jen jeden hlavní význam?", a: "jednoznačné slovo", opts: ["jednoznačné slovo", "mnohoznačné slovo", "synonymum", "antonymum"] },
  { q: "Jak se jmenuje slovo, které má více různých významů?", a: "mnohoznačné slovo", opts: ["mnohoznačné slovo", "jednoznačné slovo", "příbuzné slovo", "cizí slovo"] },
  { q: "Co znamená slovo 'most' ve větě 'Přešli jsme přes most nad řekou'?", a: "stavba přes řeku nebo propast", opts: ["stavba přes řeku nebo propast", "část šachové hry", "fotbalová obranná pozice", "název ulice"] },
  { q: "Co znamená 'zlatá ruka' (přeneseně)?", a: "šikovný člověk, který umí opravit cokoliv", opts: ["šikovný člověk, který umí opravit cokoliv", "ruka pokrytá zlatem", "šperky na ruce", "rukavice"] },
  { q: "Co je příklad mnohoznačného slova s významem 'část obličeje' i 'nos lodi'?", a: "nos", opts: ["nos", "oko", "ústa", "hlava"] },
  { q: "Co znamená slovo 'oko' ve větě 'Uháčkovala oko na svetru'?", a: "smyčka v pletení nebo háčkování", opts: ["smyčka v pletení nebo háčkování", "zrakový orgán", "oko hurikánu", "oko sítě"] },
  { q: "Jak se pozná mnohoznačné slovo ve větě?", a: "podíváme se na větu kolem — kontext prozradí, jaký význam se myslí", opts: ["podíváme se na větu kolem — kontext prozradí, jaký význam se myslí", "mnohoznačná slova jsou vždy zvýrazněna", "mnohoznačná slova jsou vždy delší", "poznáme to podle velkého písmena"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Jednoznačné slovo = má jen jeden hlavní význam (např. klokan).",
      "Mnohoznačné slovo = má více různých významů (koruna: na hlavě, peníze, strom).",
    ],
    solutionSteps: [
      "Přečti celou větu, ve které se slovo nachází.",
      "Podívej se, co se v té větě děje — kontext ti prozradí správný význam.",
    ],
  }));
}

export const SLOVAJEDNOZNACNAMNOHO: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-vyznam-slova-slova-jednoznacna-a-mnohoznacna",
    title: "Slova jednoznačná a mnohoznačná",
    studentTitle: "Jedno slovo, víc významů",
    illustrationDesc: "velký nápis KORUNA uprostřed, od něj šipky ke třem obrázkům — královská koruna, mince a strom s korunou, veselé kreslené provedení",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Poznáš, že jedno slovo může mít více různých významů.",
    keywords: ["jednoznačná slova", "mnohoznačná slova", "polysémie", "kontext", "význam slov"],
    goals: [
      "Rozlišit jednoznačná a mnohoznačná slova.",
      "Určit správný význam slova podle věty.",
      "Uvést příklady různých významů mnohoznačného slova.",
    ],
    boundaries: ["Základní příklady z každodenního jazyka", "Bez homonym (stejný tvar, jiný původ)"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Mnohoznačné slovo: 'koruna' = na hlavě krále / peníze / horní část stromu. Vždy hledej kontext věty.",
      steps: [
        "Přečti si celou větu, ne jen samotné slovo.",
        "Podle kontextu (co se v větě děje) urči, jaký význam se zde myslí.",
      ],
      commonMistake: "Žáci si vyberou první/nejčastější význam bez ohledu na větu.",
      example: "'List papíru' = arch papíru. 'List stromu' = zelená část rostliny. Stejné slovo, jiný kontext!",
    },
  },
];
