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

const POOL_L1: QA[] = [
  { q: "V textu o slonech je hlavní myšlenkou:", a: "Sloni jsou největší suchozemská zvířata.", opts: ["Sloni jsou největší suchozemská zvířata.", "Sloni mají šedou kůži.", "Sloni žijí v Africe i Asii.", "Sloni jedí přibližně 150 kg potravy denně."], e: "Hlavní myšlenka shrnuje to nejdůležitější, co text o slonech říká — že jsou největší suchozemská zvířata. Barva kůže, místo výskytu nebo množství potravy jsou jen doplňující detaily, které by mohly chybět a text by stále dával smysl." },
  { q: "Jaká informace je podstatná pro celý text o požáru?", a: "Vypukl velký požár a hasiči zasahovali.", opts: ["Vypukl velký požár a hasiči zasahovali.", "Jeden z hasičů měl červenou helmu.", "Hasičské auto bylo umyté.", "Psi v okolí štěkali."], e: "Podstatná informace nese hlavní obsah textu — že vypukl požár a hasiči zasahovali. Barva helmy, čisté auto nebo štěkající psi jsou drobnosti, bez kterých by smysl textu zůstal stejný." },
  { q: "Jaká informace je okrajová v textu o přírodní katastrofě?", a: "Záchranáři měli oranžové vesty.", opts: ["Záchranáři měli oranžové vesty.", "Záplava poškodila 200 domů.", "Tisíce lidí musely opustit domovy.", "Voda dosáhla výšky dvou metrů."], e: "Okrajová informace text jen zpestřuje, ale nemění jeho smysl — barva vest záchranářů s katastrofou nesouvisí. Počet poškozených domů, lidé bez domova nebo výška vody naopak ukazují, jak vážná katastrofa byla, a jsou tedy podstatné." },
  { q: "Co je podstatná informace?", a: "Informace, bez které by text nedával smysl", opts: ["Informace, bez které by text nedával smysl", "Každá informace v textu", "Detail, který text zpestřuje", "Informace v závorce"], e: "Podstatná informace je ta, kterou nelze vynechat — bez ní by text ztratil smysl nebo hlavní myšlenku. Detail, který text jen zpestřuje, ani umístění v závorce o důležitosti nerozhodují." },
  { q: "Co je okrajová informace?", a: "Doplňující detail, který text nezásadně mění", opts: ["Doplňující detail, který text nezásadně mění", "Hlavní téma textu", "Nejdůležitější sdělení", "Závěr textu"], e: "Okrajová informace je jen doplňující detail — když ji vynecháme, text se nezmění v tom hlavním. Hlavní téma i nejdůležitější sdělení jsou naopak podstatné a závěr nemusí být okrajový vůbec." },
  { q: "V textu o výletě do zoo: Která informace je podstatná?", a: "Navštívili jsme zoo a viděli mnoho zvířat.", opts: ["Navštívili jsme zoo a viděli mnoho zvířat.", "Autobus měl klimatizaci.", "Jedna ze spolužaček zapomněla svačinu.", "Průvodce byl vysoký pán s brýlemi."], e: "Podstatná je věta o samotném výletu — že jsme byli v zoo a viděli zvířata. Klimatizace v autobuse, zapomenutá svačina nebo vzhled průvodce jsou jen vedlejší detaily, které s hlavním tématem výletu přímo nesouvisí." },
  { q: "Jak poznáme podstatnou informaci?", a: "Ptáme se: Co by chybělo, kdybych ji vynechal?", opts: ["Ptáme se: Co by chybělo, kdybych ji vynechal?", "Je to nejdelší věta v textu", "Je to první věta odstavce", "Je to věta s vykřičníkem"], e: "Podstatnou informaci poznáme tak, že si ji zkusíme odmyslet — pokud bez ní text ztratí smysl, je podstatná. Délka věty, její pořadí ani vykřičník o důležitosti nerozhodují." },
  { q: "V textu o vynálezu letadla: Která informace je podstatná?", a: "Bratři Wrightové poprvé úspěšně vzlétli v roce 1903.", opts: ["Bratři Wrightové poprvé úspěšně vzlétli v roce 1903.", "Letadlo bylo vyrobeno ze dřeva.", "Jeden bratr byl starší než druhý.", "Den byl slunečný."], e: "Text je o vynálezu letadla, proto je podstatná samotná událost prvního úspěšného letu v roce 1903. Materiál letadla, věk bratrů nebo počasí jsou jen doplňky, které vynález nevysvětlují." },
  { q: "V textu o zvířatech: Která informace je okrajová?", a: "Tygr má oranžovo-černé pruhy.", opts: ["Tygr má oranžovo-černé pruhy.", "Tygr je největší z kočkovitých šelem.", "Tygři žijí v Asii.", "Tygři jsou ohrožení vyhynutím."], e: "Barva pruhů je jen vnější detail, který o tygrovi nic zásadního neříká, proto je okrajová. To, že je tygr největší šelma, kde žije a že je ohrožen, jsou důležité informace o jeho životě." },
  { q: "Při shrnutí textu vybíráme:", a: "jen podstatné informace, okrajové vynecháváme", opts: ["jen podstatné informace, okrajové vynecháváme", "všechny informace z textu", "jen okrajové informace", "první větu každého odstavce"], e: "Shrnutí má být stručné, proto do něj dáváme jen podstatné informace a okrajové detaily vynecháme. Kdybychom opisovali vše nebo jen první věty odstavců, nebylo by to shrnutí, ale skoro celý text." },
  { q: "Text o školní olympiádě: Která informace je podstatná?", a: "Naše škola zvítězila ve štafetě.", opts: ["Naše škola zvítězila ve štafetě.", "Jeden závodník měl zelené tkaničky.", "Diváci jedli zmrzlinu.", "Pořadatel olympiády měl modré tričko."], e: "Podstatný je výsledek olympiády — že naše škola zvítězila ve štafetě. Zelené tkaničky, zmrzlina diváků nebo barva trička pořadatele jsou jen drobnosti, které průběh ani výsledek nemění." },
  { q: "Proč rozlišujeme podstatné a okrajové informace?", a: "Abychom se zaměřili na to, co je pro pochopení textu klíčové", opts: ["Abychom se zaměřili na to, co je pro pochopení textu klíčové", "Abychom text zkrátili", "Abychom se naučili psát rychleji", "Abychom text zapomněli"], e: "Rozlišování nám pomáhá soustředit se na to nejdůležitější, abychom textu opravdu porozuměli. Není cílem text jen zkrátit nebo zapomenout — jde o to vědět, co je hlavní a co jen doplněk." },
  { q: "Text o moři: Která informace je podstatná?", a: "Oceány pokrývají více než 70 % povrchu Země.", opts: ["Oceány pokrývají více než 70 % povrchu Země.", "Námořník měl námořnické tričko.", "Vlny se třpytily v slunci.", "Voda v moři je slaná a studená."], e: "Údaj, že oceány pokrývají přes 70 % povrchu Země, je důležitý fakt o moři. Tričko námořníka nebo třpytící se vlny jsou jen ozdobné detaily, které o významu moře nic nevypovídají." },
  { q: "V textu o vesmíru: Která informace je okrajová?", a: "Astronaut měl bílý skafandr.", opts: ["Astronaut měl bílý skafandr.", "Měsíc obíhá kolem Země.", "Slunce je hvězda.", "Vesmír se stále rozrůstá."], e: "Barva skafandru je jen detail, který o vesmíru nic podstatného neříká, proto je okrajová. To, že Měsíc obíhá Zemi, že Slunce je hvězda a že se vesmír rozpíná, jsou důležité poznatky o vesmíru." },
  { q: "Příklad podstatné informace v článku o zdraví:", a: "Pravidelné cvičení snižuje riziko srdečních chorob.", opts: ["Pravidelné cvičení snižuje riziko srdečních chorob.", "Lékař nosil bílý plášť.", "Nemocnice byla velká budova.", "Čekárna měla modré židle."], e: "V článku o zdraví je podstatná rada, která čtenáři pomáhá — že cvičení snižuje riziko nemocí srdce. Bílý plášť lékaře, velikost budovy nebo barva židlí se zdravím čtenáře nesouvisí." },
  { q: "Okrajová informace v textu zpestřuje: ale bez ní:", a: "text by stále dával smysl", opts: ["text by stále dával smysl", "text by byl nepochopitelný", "text by ztratil hlavní téma", "text by byl příliš krátký"], e: "Právě podle toho okrajovou informaci poznáme — když ji odebereme, text dál dává smysl a hlavní téma zůstane. Kdyby se text bez ní stal nepochopitelným, byla by to informace podstatná." },
];

const POOL_L2: QA[] = [
  { q: "Přečti: 'Hroch tráví většinu života ve vodě. Kůže hrocha je citlivá na sluneční záření.' Která informace je podstatnější?", a: "Hroch tráví většinu života ve vodě — vysvětluje chování", opts: ["Hroch tráví většinu života ve vodě — vysvětluje chování", "Kůže hrocha je citlivá — podstatnější", "Obě jsou stejně důležité", "Ani jedna není podstatná"], e: "Podstatnější je věta o životě ve vodě, protože vysvětluje hrochovo chování — a citlivá kůže je vlastně jen důvod, proč se ve vodě zdržuje. Druhá věta tak hlavní informaci jen doplňuje, není sama hlavní." },
  { q: "Jak rozlišíme podstatné od okrajového v delším textu?", a: "Ptáme se: Co je hlavní téma? Co se bez toho neobejde?", opts: ["Ptáme se: Co je hlavní téma? Co se bez toho neobejde?", "Podstatné je, co je nejdéle popsáno", "Podstatné je, co je v závorce", "Podstatné je vždy první věta"], e: "Nejdřív si určíme hlavní téma a pak hledáme informace, bez kterých by se text neobešel — to jsou podstatné. Délka popisu, závorka ani pořadí věty samy o sobě o důležitosti nerozhodují." },
  { q: "Příklad: 'Voda je základem života. Lidské tělo tvoří z 60 % voda.' — podstatná informace:", a: "Obě věty jsou podstatné — vysvětlují téma", opts: ["Obě věty jsou podstatné — vysvětlují téma", "Pouze první věta", "Pouze druhá věta", "Ani jedna není podstatná"], e: "Obě věty se týkají hlavního tématu — jak je voda důležitá pro život — a jedna druhou potvrzuje konkrétním údajem. Proto nelze ani jednu označit za pouhý okrajový detail." },
  { q: "Proč autoři píšou okrajové informace?", a: "Aby text byl živější, konkrétnější a zajímavější", opts: ["Aby text byl živější, konkrétnější a zajímavější", "Protože nevědí, co je důležité", "Protože musí splnit délku textu", "Protože jsou to chyby"], e: "Okrajové informace nejsou chyby ani výplň — autor je přidává schválně, aby byl text barvitější a poutavější. Dobrý autor moc dobře ví, co je hlavní a co je jen ozdoba." },
  { q: "Jak při čtení zprávy poznáme, co je podstatné?", a: "Otázky co/kdo/kde/kdy/proč → ty odpovědi jsou podstatné", opts: ["Otázky co/kdo/kde/kdy/proč → ty odpovědi jsou podstatné", "Podstatné jsou jen přídavná jména", "Podstatné jsou jen příslovce", "Podstatná je délka věty"], e: "Zpráva odpovídá na otázky kdo, co, kde, kdy a proč — a právě tyto odpovědi tvoří jádro sdělení. Druh slova ani délka věty o tom, co je podstatné, nerozhodují." },
  { q: "Přečti: 'Praha je hlavní město České republiky. Leží na řece Vltavě.' — okrajová informace:", a: "Leží na Vltavě — doplňující detail (pokud se text zabývá statusem hlavního města)", opts: ["Leží na Vltavě — doplňující detail (pokud se text zabývá statusem hlavního města)", "Praha je hlavní město — okrajové", "Obě jsou podstatné", "Ani jedna není podstatná"], e: "Když je tématem to, že Praha je hlavní město, je tato věta podstatná a poloha na Vltavě ji jen doplňuje. Co je podstatné a co okrajové, totiž vždy závisí na hlavním tématu textu." },
  { q: "Jak napsat stručné shrnutí textu?", a: "Vybrat jen podstatné informace — téma + hlavní myšlenka", opts: ["Vybrat jen podstatné informace — téma + hlavní myšlenka", "Opsat text doslova", "Napsat jen okrajové detaily", "Přidat vlastní myšlenky"], e: "Shrnutí zachytí téma a hlavní myšlenku vlastními slovy a okrajové detaily vynechá. Není to doslovný opis textu ani místo pro vlastní nápady — ty do shrnutí nepatří." },
  { q: "V novinovém článku o závodu: 'Závod vyhrál Jan Novák. Startovní číslo měl 47.' — podstatná informace:", a: "Závod vyhrál Jan Novák.", opts: ["Závod vyhrál Jan Novák.", "Startovní číslo bylo 47.", "Obě jsou stejně podstatné.", "Ani jedna není podstatná."], e: "Hlavní zprávou článku je, kdo závod vyhrál — tedy Jan Novák. Jeho startovní číslo je jen doplňující detail, který výsledek závodu nijak nemění." },
  { q: "Při psaní referátu vybíráme:", a: "podstatné informace, okrajové vynecháváme", opts: ["podstatné informace, okrajové vynecháváme", "jen nejzajímavější okrajové detaily", "vše, co najdeme", "jen první a poslední větu každého odstavce"], e: "Referát má posluchače poučit o hlavních věcech, proto vybíráme podstatné informace a okrajové vynecháme. Kdybychom dali jen zajímavé detaily nebo opsali vše, referát by ztratil jasné téma." },
  { q: "Jak zjistíme, co je v textu okrajové?", a: "Ptáme se: Dá text smysl i bez této informace?", opts: ["Ptáme se: Dá text smysl i bez této informace?", "Okrajové je vždy v závorce", "Okrajové je vždy podtržené", "Okrajové je kratší věta"], e: "Stačí si informaci odmyslet — pokud text i bez ní dává smysl, je okrajová. Okrajovou informaci nepoznáme podle závorky, podtržení ani podle délky věty." },
  { q: "Přečti: 'Chobotnice má 8 chapadel. Má modrou krev.' — podstatnější informace pro téma 'zvláštní vlastnosti chobotnice'?", a: "Má modrou krev — výjimečnější a méně známá vlastnost", opts: ["Má modrou krev — výjimečnější a méně známá vlastnost", "8 chapadel — všichni to vědí", "Obě jsou stejně podstatné", "Ani jedna není podstatná"], e: "Téma je o zvláštních vlastnostech, a modrá krev je opravdu neobvyklá a překvapivá. Osm chapadel sice platí, ale skoro každý to ví, takže pro toto téma je to méně podstatné." },
  { q: "Co je 'shrnutí' textu?", a: "Stručná výpověď o hlavních myšlenkách bez okrajových detailů", opts: ["Stručná výpověď o hlavních myšlenkách bez okrajových detailů", "Opis celého textu", "Výpis klíčových slov", "Celý text napsaný jiným stylem"], e: "Shrnutí krátce řekne hlavní myšlenky a okrajové detaily vypustí. Není to opis celého textu, ani jen výčet slov — má dát rychlý a srozumitelný přehled o tom nejdůležitějším." },
  { q: "Okrajová informace je v textu:", a: "doplňující, zajímavá, ale pro pochopení nutná není", opts: ["doplňující, zajímavá, ale pro pochopení nutná není", "nejdůležitější", "nejdelší", "vždy na konci odstavce"], e: "Okrajová informace text obohacuje a může být zajímavá, ale pro pochopení hlavní myšlenky nutná není. Nejdůležitější bývá informace podstatná a okrajová není ani nejdelší, ani vázaná na konec odstavce." },
  { q: "Přečti: 'Slunce je hvězda vzdálená 150 mil. km. Svítí žlutobíle.' — podstatná informace:", a: "Slunce je hvězda vzdálená 150 mil. km.", opts: ["Slunce je hvězda vzdálená 150 mil. km.", "Svítí žlutobíle.", "Obě jsou podstatné.", "Ani jedna není podstatná."], e: "Podstatné je, co Slunce je a jak daleko je od nás — to je hlavní fakt o Slunci. Barva světla je jen doplňující detail, který hlavní sdělení nemění." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Podstatná informace: bez ní text nedává smysl",
      "Okrajová informace: text dává smysl i bez ní — jen doplňuje",
      "Ptej se: Dá text smysl bez této informace? Ano → okrajová; Ne → podstatná",
    ],
    explanation: e,
  }));
}

export const ROZLISENIPODSTATNYCHAOKRAJOVYCHINFORMACI: TopicMetadata[] = [
  {
    id: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    rvpNodeId: "g4-cjl-komunikacni-a-slohova-vychova-cteni-rozliseni-podstatnych-a-okrajovych-informaci",
    displayName: "Hlavní a vedlejší info",
    title: "Rozlišení podstatných a okrajových informací",
    studentTitle: "Hlavní a vedlejší info",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Komunikační a slohová výchova",
    briefDescription: "Naučíš se rozlišit, co je v textu důležité a co okrajové.",
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
    recommendedNext: ["g4-cjl-komunikacni-a-slohova-vychova-cteni-vyhledavani-klicovych-slov-a-hlavni-myslenky"],
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
