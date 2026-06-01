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
  { q: "V textu o slonech je hlavní myšlenkou:", a: "Sloni jsou největší suchozemská zvířata.", opts: ["Sloni jsou největší suchozemská zvířata.", "Sloni mají šedou kůži.", "Sloni žijí v Africe i Asii.", "Sloni jedí přibližně 150 kg potravy denně."] },
  { q: "Jaká informace je podstatná pro celý text o požáru?", a: "Vypukl velký požár a hasiči zasahovali.", opts: ["Vypukl velký požár a hasiči zasahovali.", "Jeden z hasičů měl červenou helmu.", "Hasičské auto bylo umyté.", "Psi v okolí štěkali."] },
  { q: "Jaká informace je okrajová v textu o přírodní katastrofě?", a: "Záchranáři měli oranžové vesty.", opts: ["Záchranáři měli oranžové vesty.", "Záplava poškodila 200 domů.", "Tisíce lidí musely opustit domovy.", "Voda dosáhla výšky dvou metrů."] },
  { q: "Co je podstatná informace?", a: "Informace, bez které by text nedával smysl", opts: ["Informace, bez které by text nedával smysl", "Každá informace v textu", "Detail, který text zpestřuje", "Informace v závorce"] },
  { q: "Co je okrajová informace?", a: "Doplňující detail, který text nezásadně mění", opts: ["Doplňující detail, který text nezásadně mění", "Hlavní téma textu", "Nejdůležitější sdělení", "Závěr textu"] },
  { q: "V textu o výletě do zoo: Která informace je podstatná?", a: "Navštívili jsme zoo a viděli mnoho zvířat.", opts: ["Navštívili jsme zoo a viděli mnoho zvířat.", "Autobus měl klimatizaci.", "Jedna ze spolužaček zapomněla svačinu.", "Průvodce byl vysoký pán s brýlemi."] },
  { q: "Jak poznáme podstatnou informaci?", a: "Ptáme se: Co by chybělo, kdybych ji vynechal?", opts: ["Ptáme se: Co by chybělo, kdybych ji vynechal?", "Je to nejdelší věta v textu", "Je to první věta odstavce", "Je to věta s vykřičníkem"] },
  { q: "V textu o vynálezu letadla: Která informace je podstatná?", a: "Bratři Wrightové poprvé úspěšně vzlétli v roce 1903.", opts: ["Bratři Wrightové poprvé úspěšně vzlétli v roce 1903.", "Letadlo bylo vyrobeno ze dřeva.", "Jeden bratr byl starší než druhý.", "Den byl slunečný."] },
  { q: "V textu o zvířatech: Která informace je okrajová?", a: "Tygr má oranžovo-černé pruhy.", opts: ["Tygr má oranžovo-černé pruhy.", "Tygr je největší z kočkovitých šelem.", "Tygři žijí v Asii.", "Tygři jsou ohrožení vyhynutím."] },
  { q: "Při shrnutí textu vybíráme:", a: "jen podstatné informace, okrajové vynecháváme", opts: ["jen podstatné informace, okrajové vynecháváme", "všechny informace z textu", "jen okrajové informace", "první větu každého odstavce"] },
  { q: "Text o školní olympiádě: Která informace je podstatná?", a: "Naše škola zvítězila ve štafetě.", opts: ["Naše škola zvítězila ve štafetě.", "Jeden závodník měl zelené tkaničky.", "Diváci jedli zmrzlinu.", "Pořadatel olympiády měl modré tričko."] },
  { q: "Proč rozlišujeme podstatné a okrajové informace?", a: "Abychom se zaměřili na to, co je pro pochopení textu klíčové", opts: ["Abychom se zaměřili na to, co je pro pochopení textu klíčové", "Abychom text zkrátili", "Abychom se naučili psát rychleji", "Abychom text zapomněli"] },
  { q: "Text o moři: Která informace je podstatná?", a: "Oceány pokrývají více než 70 % povrchu Země.", opts: ["Oceány pokrývají více než 70 % povrchu Země.", "Námořník měl námořnické tričko.", "Vlny se třpytily v slunci.", "Voda v moři je slaná a studená."] },
  { q: "V textu o vesmíru: Která informace je okrajová?", a: "Astronaut měl bílý skafandr.", opts: ["Astronaut měl bílý skafandr.", "Měsíc obíhá kolem Země.", "Slunce je hvězda.", "Vesmír se stále rozrůstá."] },
  { q: "Příklad podstatné informace v článku o zdraví:", a: "Pravidelné cvičení snižuje riziko srdečních chorob.", opts: ["Pravidelné cvičení snižuje riziko srdečních chorob.", "Lékař nosil bílý plášť.", "Nemocnice byla velká budova.", "Čekárna měla modré židle."] },
  { q: "Okrajová informace v textu zpestřuje: ale bez ní:", a: "text by stále dával smysl", opts: ["text by stále dával smysl", "text by byl nepochopitelný", "text by ztratil hlavní téma", "text by byl příliš krátký"] },
];

const POOL_L2: QA[] = [
  { q: "Přečti: 'Hroch tráví většinu života ve vodě. Kůže hrocha je citlivá na sluneční záření.' Která informace je podstatnější?", a: "Hroch tráví většinu života ve vodě — vysvětluje chování", opts: ["Hroch tráví většinu života ve vodě — vysvětluje chování", "Kůže hrocha je citlivá — podstatnější", "Obě jsou stejně důležité", "Ani jedna není podstatná"] },
  { q: "Jak rozlišíme podstatné od okrajového v delším textu?", a: "Ptáme se: Co je hlavní téma? Co se bez toho neobejde?", opts: ["Ptáme se: Co je hlavní téma? Co se bez toho neobejde?", "Podstatné je, co je nejdéle popsáno", "Podstatné je, co je v závorce", "Podstatné je vždy první věta"] },
  { q: "Příklad: 'Voda je základem života. Lidské tělo tvoří z 60 % voda.' — podstatná informace:", a: "Obě věty jsou podstatné — vysvětlují téma", opts: ["Obě věty jsou podstatné — vysvětlují téma", "Pouze první věta", "Pouze druhá věta", "Ani jedna není podstatná"] },
  { q: "Proč autoři píšou okrajové informace?", a: "Aby text byl živější, konkrétnější a zajímavější", opts: ["Aby text byl živější, konkrétnější a zajímavější", "Protože nevědí, co je důležité", "Protože musí splnit délku textu", "Protože jsou to chyby"] },
  { q: "Jak při čtení zprávy poznáme, co je podstatné?", a: "Otázky co/kdo/kde/kdy/proč → ty odpovědi jsou podstatné", opts: ["Otázky co/kdo/kde/kdy/proč → ty odpovědi jsou podstatné", "Podstatné jsou jen přídavná jména", "Podstatné jsou jen příslovce", "Podstatná je délka věty"] },
  { q: "Přečti: 'Praha je hlavní město České republiky. Leží na řece Vltavě.' — okrajová informace:", a: "Leží na Vltavě — doplňující detail (pokud se text zabývá statusem hlavního města)", opts: ["Leží na Vltavě — doplňující detail (pokud se text zabývá statusem hlavního města)", "Praha je hlavní město — okrajové", "Obě jsou podstatné", "Ani jedna není podstatná"] },
  { q: "Jak napsat stručné shrnutí textu?", a: "Vybrat jen podstatné informace — téma + hlavní myšlenka", opts: ["Vybrat jen podstatné informace — téma + hlavní myšlenka", "Opsat text doslova", "Napsat jen okrajové detaily", "Přidat vlastní myšlenky"] },
  { q: "V novinovém článku o závodu: 'Závod vyhrál Jan Novák. Startovní číslo měl 47.' — podstatná informace:", a: "Závod vyhrál Jan Novák.", opts: ["Závod vyhrál Jan Novák.", "Startovní číslo bylo 47.", "Obě jsou stejně podstatné.", "Ani jedna není podstatná."] },
  { q: "Při psaní referátu vybíráme:", a: "podstatné informace, okrajové vynecháváme", opts: ["podstatné informace, okrajové vynecháváme", "jen nejzajímavější okrajové detaily", "vše, co najdeme", "jen první a poslední větu každého odstavce"] },
  { q: "Jak zjistíme, co je v textu okrajové?", a: "Ptáme se: Dá text smysl i bez této informace?", opts: ["Ptáme se: Dá text smysl i bez této informace?", "Okrajové je vždy v závorce", "Okrajové je vždy podtržené", "Okrajové je kratší věta"] },
  { q: "Přečti: 'Chobotnice má 8 chapadel. Má modrou krev.' — podstatnější informace pro téma 'zvláštní vlastnosti chobotnice'?", a: "Má modrou krev — výjimečnější a méně známá vlastnost", opts: ["Má modrou krev — výjimečnější a méně známá vlastnost", "8 chapadel — všichni to vědí", "Obě jsou stejně podstatné", "Ani jedna není podstatná"] },
  { q: "Co je 'shrnutí' textu?", a: "Stručná výpověď o hlavních myšlenkách bez okrajových detailů", opts: ["Stručná výpověď o hlavních myšlenkách bez okrajových detailů", "Opis celého textu", "Výpis klíčových slov", "Celý text napsaný jiným stylem"] },
  { q: "Okrajová informace je v textu:", a: "doplňující, zajímavá, ale pro pochopení nutná není", opts: ["doplňující, zajímavá, ale pro pochopení nutná není", "nejdůležitější", "nejdelší", "vždy na konci odstavce"] },
  { q: "Přečti: 'Slunce je hvězda vzdálená 150 mil. km. Svítí žlutobíle.' — podstatná informace:", a: "Slunce je hvězda vzdálená 150 mil. km.", opts: ["Slunce je hvězda vzdálená 150 mil. km.", "Svítí žlutobíle.", "Obě jsou podstatné.", "Ani jedna není podstatná."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Podstatná informace: bez ní text nedává smysl",
      "Okrajová informace: text dává smysl i bez ní — jen doplňuje",
      "Ptej se: Dá text smysl bez této informace? Ano → okrajová; Ne → podstatná",
    ],
    solutionSteps: [
      "Přečti text a urči hlavní téma.",
      "Pro každou informaci se zeptej: Je tato informace nutná pro pochopení tématu?",
      "Nutná → podstatná; zbytečná pro téma → okrajová",
    ],
  }));
}

export const ROZLISENIPODSTATNYCHAOKRAJOVYCHINFORMACI: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    title: "Rozlišení podstatných a okrajových informací",
    studentTitle: "Hlavní a vedlejší info",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rozlišit, co je v textu důležité a co jen doplňující detail.",
    keywords: ["podstatná informace", "okrajová informace", "shrnutí", "hlavní myšlenka", "čtení s porozuměním"],
    goals: [
      "Rozlišit podstatné a okrajové informace v textu",
      "Sestavit stručné shrnutí textu",
    ],
    boundaries: ["Bez pokročilé argumentační analýzy", "Bez novinových textů s manipulací"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Podstatná = bez ní text nedává smysl; okrajová = text dává smysl i bez ní (jen doplňuje)",
      steps: [
        "Urči hlavní téma textu.",
        "Pro každou informaci se zeptej: Je nutná pro pochopení tématu?",
        "Nutná → podstatná; pouze doplňující → okrajová.",
      ],
      commonMistake: "Záměna zajímavé informace a podstatné informace — zajímavá detail může být okrajový",
      example: "Text o slonech: 'Sloni jsou největší suchozemská zvířata.' = podstatné; 'Mají šedou kůži.' = okrajové",
    },
  },
];
