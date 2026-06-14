import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL: QA[] = [
  { q: "Co znamená slovo 'koruna' ve větě 'Král nosí zlatou korunu'?", a: "ozdoba hlavy krále", opts: ["ozdoba hlavy krále", "česká měna", "horní část stromu", "starý pozdrav"], e: "Ve větě se mluví o králi — a král nosí korunu jako symbol moci na hlavě. Ostatní významy (peníze, strom) by tu nedávaly smysl." },
  { q: "Co znamená slovo 'koruna' ve větě 'Strom má hustou korunu'?", a: "horní část stromu s větvemi", opts: ["horní část stromu s větvemi", "ozdoba hlavy krále", "česká měna", "odznak"], e: "Věta mluví o stromě, takže koruna tu znamená horní část stromu — všechny větve a listy dohromady. Koruna krále by u stromu nedávala smysl." },
  { q: "Co znamená slovo 'koruna' ve větě 'Jogurt stojí deset korun'?", a: "česká peněžní jednotka", opts: ["česká peněžní jednotka", "ozdoba hlavy krále", "horní část stromu", "odznak"], e: "Věta mluví o ceně jogurtu — a ceny platíme penězi. Koruna je česká měna, takže zde jde o peníze, ne o královskou ozdobu ani strom." },
  { q: "Kolik různých významů má slovo 'koruna'?", a: "více významů — je to slovo mnohoznačné", opts: ["více významů — je to slovo mnohoznačné", "jeden přesný význam — je to jednoznačné", "žádný vlastní význam", "je to cizí slovo"], e: "Slovo 'koruna' může znamenat ozdobu krále, peníze nebo vrchol stromu — má tedy více různých významů, a proto je mnohoznačné." },
  { q: "Co znamená slovo 'list' ve větě 'Napsal jsem dopis na list papíru'?", a: "arch papíru", opts: ["arch papíru", "zelená část rostliny", "kapsa v kabátě", "obálka dopisu"], e: "Ve větě se píše dopis na papír — 'list papíru' tu znamená jeden arch (kus) papíru. Zelený list by tu nedával smysl, protože se nám nepíše na listy ze stromu." },
  { q: "Co znamená slovo 'list' ve větě 'Strom má krásné zelené listy'?", a: "zelená část rostliny", opts: ["zelená část rostliny", "arch papíru", "kapsa v kabátě", "obálka dopisu"], e: "Věta mluví o stromě a jeho zelené části. Listy rostliny jsou ploché zelené části, které vyrůstají z větví — a přesně o těch je tu řeč." },
  { q: "Je slovo 'list' jednoznačné nebo mnohoznačné?", a: "mnohoznačné — má více významů", opts: ["mnohoznačné — má více významů", "jednoznačné — má jen jeden význam", "cizí slovo bez českého ekvivalentu", "vlastní jméno"], e: "Slovo 'list' může znamenat arch papíru i zelený list stromu — má tedy více různých významů, a proto patří mezi mnohoznačná slova." },
  { q: "Co znamená slovo 'hlava' ve větě 'Bolí mě hlava'?", a: "část těla", opts: ["část těla", "vedoucí skupiny", "záhlaví stránky", "hlava kapitoly v knize"], e: "Bolest se cítí v těle — a hlava je část těla na vrcholu krku. Ve větě o bolesti jde jednoznačně o fyzickou část těla, ne o šéfa skupiny." },
  { q: "Co znamená slovo 'hlava' ve větě 'Je to hlava naší skupiny'?", a: "vedoucí, šéf skupiny", opts: ["vedoucí, šéf skupiny", "část těla", "záhlaví stránky", "číslo stránky"], e: "Věta mluví o skupině a jejím vedení. 'Hlava skupiny' tu znamená vedoucího — toho, kdo skupinu řídí. Je to přenesený (obrazný) význam slova." },
  { q: "Je slovo 'hlava' jednoznačné nebo mnohoznačné?", a: "mnohoznačné — má více významů", opts: ["mnohoznačné — má více významů", "jednoznačné — má jen jeden význam", "pouze zeměpisný termín", "zastaralé slovo"], e: "Slovo 'hlava' může znamenat část těla, vedoucího skupiny nebo záhlaví stránky — má více různých významů, a proto je mnohoznačné." },
  { q: "Co znamená slovo 'hřbet' ve větě 'Pohladil jsem koně po hřbetu'?", a: "záda zvířete", opts: ["záda zvířete", "vrchol hory", "záda knihy (hřeben)", "část nohy"], e: "Ve větě hladíme koně — a hřbet je u zvířat záda, horní část těla. Kůň nemá vrchol hory ani záda knihy, takže jde o záda zvířete." },
  { q: "Které slovo je jednoznačné (má jen jeden běžný význam)?", a: "klokan", opts: ["klokan", "hlava", "koruna", "list"], e: "Klokan je jen jedno konkrétní zvíře — australský skokavec. Naopak slova hlava, koruna a list mají více různých významů, takže jsou mnohoznačná." },
  { q: "Co znamená slovo 'pero' ve větě 'Psal jsem perem'?", a: "nástroj na psaní", opts: ["nástroj na psaní", "ptačí pero", "jarní pero (péro)", "pero v závodech"], e: "Psaní je jasný kontext — 'pero' tu znamená nástroj, kterým píšeme. Ptačí pero by se k psaní hodilo jen v pohádce, v dnešní době jde o pero plnicí nebo kuličkové." },
  { q: "Co znamená slovo 'pero' ve větě 'Ptáček ztratil pero'?", a: "část ptačího opeření", opts: ["část ptačího opeření", "nástroj na psaní", "pero v závodech", "jarní péro"], e: "Věta mluví o ptáčkovi — a ptáci mají peří. 'Pero' je jedna jednotlivá část ptačího opeření, kterou ptáčci ztrácí při přepeřování." },
  { q: "Jak poznáme, který význam slova je správný?", a: "podle věty (kontextu), ve které se slovo nachází", opts: ["podle věty (kontextu), ve které se slovo nachází", "podle délky slova", "podle toho, kdo mluví", "podle abecedy"], e: "Slovo samo o sobě může mít více významů, ale věta kolem nám vždy prozradí, co se myslí. Kontext (= okolní věta) je nejlepší vodítko pro správné pochopení." },
  { q: "Které ze slov je mnohoznačné?", a: "zámek", opts: ["zámek", "dub", "tygr", "planeta"], e: "Zámek může být historická budova i mechanizmus na dveřích — má tedy více významů. Dub, tygr a planeta mají každé jen jeden jasný hlavní význam." },
  { q: "Co znamená slovo 'zámek' ve větě 'Dveře mají zámek'?", a: "mechanizmus k zamykání", opts: ["mechanizmus k zamykání", "historická budova", "ozdoba na náramku", "klíč"], e: "Ve větě jsou dveře — a dveře se zamykají zámkem. Jde tu o kovový mechanizmus, do kterého vkládáme klíč, ne o historickou budovu." },
  { q: "Co znamená slovo 'zámek' ve větě 'Navštívili jsme starý zámek'?", a: "historická budova, sídlo šlechty", opts: ["historická budova, sídlo šlechty", "mechanizmus k zamykání", "klíč od dveří", "ozdoba"], e: "Věta mluví o navštívení — a navštěvujeme budovy, ne mechanizmy na dveřích. 'Starý zámek' je historická stavba, kde dříve bydlela šlechta." },
  { q: "Které slovo je jednoznačné?", a: "fotbal", opts: ["fotbal", "les", "ruka", "stůl"], e: "Fotbal je jen jedna konkrétní sportovní hra — nemá jiný běžný význam. Slova jako ruka nebo stůl mohou mít přenesené významy (zlatá ruka, stůl jednání)." },
  { q: "Co znamená slovo 'les' ve větě 'Houby rostou v lese'?", a: "prostor porostlý stromy", opts: ["prostor porostlý stromy", "přezdívka pro hustý vous", "les rukou (zvednuté ruce)", "tmavá barva"], e: "Houby rostou v přírodě mezi stromy — a les je místo, kde roste hodně stromů pohromadě. Jde tu o základní, přímý význam slova." },
  { q: "Je slovo 'les' jednoznačné nebo mnohoznačné?", a: "většinou jednoznačné, ale v přeneseném smyslu může mít další použití", opts: ["většinou jednoznačné, ale v přeneseném smyslu může mít další použití", "vždy jednoznačné", "vždy mnohoznačné jako 'koruna'", "nemá žádný vlastní význam"], e: "Slovo 'les' většinou znamená místo se stromy, ale někdy se používá přeneseně — třeba 'les rukou' (mnoho zvednutých rukou). Není tak mnohoznačné jako koruna, ale má svůj přenesený smysl." },
  { q: "Co znamená slovo 'kolo' ve větě 'Jedu na kole'?", a: "jízdní kolo", opts: ["jízdní kolo", "matematický tvar", "kolo soutěže", "kolo na autě"], e: "Věta říká 'jedu na kole' — jezdíme na jízdním kole. Jde o dopravní prostředek se dvěma koly, na kterém sedíme a šlapeme do pedálů." },
  { q: "Co znamená slovo 'kolo' ve větě 'Postoupili do druhého kola soutěže'?", a: "část soutěže, etapa", opts: ["část soutěže, etapa", "jízdní kolo", "matematický tvar kružnice", "kolo na autě"], e: "Věta mluví o soutěži — a soutěže mají kola (části). 'Druhé kolo' je druhá etapa soutěže, ne jízdní kolo ani geometrický tvar." },
  { q: "Jak se jmenuje slovo, které má jen jeden hlavní význam?", a: "jednoznačné slovo", opts: ["jednoznačné slovo", "mnohoznačné slovo", "synonymum", "antonymum"], e: "Jednoznačné slovo má jen jeden jasný, přesný význam — třeba slovo 'klokan' označuje vždy jen to australské zvíře. Synonymum je slovo se stejným významem, antonymum je slovo opačného významu." },
  { q: "Jak se jmenuje slovo, které má více různých významů?", a: "mnohoznačné slovo", opts: ["mnohoznačné slovo", "jednoznačné slovo", "příbuzné slovo", "cizí slovo"], e: "Mnohoznačné slovo má více různých významů — třeba 'koruna' může být ozdoba hlavy, peníze nebo vrchol stromu. Číslovka 'mnoho' v názvu napovídá, že jde o více významů." },
  { q: "Co znamená slovo 'most' ve větě 'Přešli jsme přes most nad řekou'?", a: "stavba přes řeku nebo propast", opts: ["stavba přes řeku nebo propast", "část šachové hry", "fotbalová obranná pozice", "název ulice"], e: "Věta mluví o přecházení přes řeku — a most je stavba, která nám umožní přejít přes řeku nebo jiný překážku. Jde o přímý, základní význam slova." },
  { q: "Co znamená 'zlatá ruka' (přeneseně)?", a: "šikovný člověk, který umí opravit cokoliv", opts: ["šikovný člověk, který umí opravit cokoliv", "ruka pokrytá zlatem", "šperky na ruce", "rukavice"], e: "'Zlatá ruka' je přenesený (obrazný) výraz — nemyslíme tím skutečné zlato, ale šikovnost. Říkáme to o někom, kdo umí opravit nebo vyrobit cokoliv." },
  { q: "Které slovo označuje jak část obličeje, tak přední část lodi?", a: "nos", opts: ["nos", "oko", "ústa", "hlava"], e: "Slovo 'nos' může znamenat část obličeje (čicháme jím) i přední část lodi. Přední část lodě vypadá trochu jako nos, a tak jsme ji pojmenovali stejně — to je typické pro mnohoznačná slova." },
  { q: "Co znamená slovo 'oko' ve větě 'Uháčkovala oko na svetru'?", a: "smyčka v pletení nebo háčkování", opts: ["smyčka v pletení nebo háčkování", "zrakový orgán", "oko hurikánu", "oko sítě"], e: "Věta mluví o háčkování — a v pletení a háčkování se 'oko' říká jedné smyčce nitě. Jde o přenesený význam, protože smyčka trochu připomíná tvar oka." },
  { q: "Jak se pozná mnohoznačné slovo ve větě?", a: "podíváme se na větu kolem — kontext prozradí, jaký význam se myslí", opts: ["podíváme se na větu kolem — kontext prozradí, jaký význam se myslí", "mnohoznačná slova jsou vždy zvýrazněna", "mnohoznačná slova jsou vždy delší", "poznáme to podle velkého písmena"], e: "Mnohoznačné slovo samo o sobě nevypadá jinak než jiná slova — musíme se podívat na celou větu. Věta kolem nám řekne, v jakém smyslu se slovo použilo." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Jednoznačné slovo = má jen jeden hlavní význam (např. klokan).",
      "Mnohoznačné slovo = má více různých významů (koruna: na hlavě, peníze, strom).",
    ],
    explanation: e,
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
