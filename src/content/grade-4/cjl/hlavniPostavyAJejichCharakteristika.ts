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
  { q: "Jak poznáme hlavní postavu v příběhu?", a: "Nejvíce se vyskytuje, příběh se točí kolem ní", opts: ["Nejvíce se vyskytuje, příběh se točí kolem ní", "Je to vždy dospělý muž", "Je zmíněna jen jednou", "Je nejkrásnější v příběhu"], e: "Hlavní postava je ta, o které se vypráví nejvíc a kolem které se odehrává děj. Nemusí to být dospělý ani ten nejkrásnější — důležité je, že je středem příběhu." },
  { q: "Co jsou fyzické vlastnosti postavy?", a: "Jak postava vypadá: výška, vlasy, oči, postava", opts: ["Jak postava vypadá: výška, vlasy, oči, postava", "Jak se postava chová k ostatním", "Co postava říká a myslí", "Čím postava pracuje"], e: "Fyzické vlastnosti popisují vnější vzhled — co na postavě vidíme očima, třeba výšku, vlasy nebo postavu. To, jak se chová nebo co si myslí, patří k vlastnostem povahovým." },
  { q: "Co jsou psychické vlastnosti postavy?", a: "Charakter: odvážný, lstivý, laskavý, sobecký", opts: ["Charakter: odvážný, lstivý, laskavý, sobecký", "Jak postava vypadá fyzicky", "Věk a jméno postavy", "Kde postava bydlí"], e: "Psychické vlastnosti popisují povahu — jaká postava je uvnitř, jak jedná a smýšlí. Vzhled, věk nebo bydliště nám o povaze nic neřeknou." },
  { q: "Co je přímá charakteristika postavy?", a: "Autor přímo říká, jaká postava je: 'Petr je odvážný.'", opts: ["Autor přímo říká, jaká postava je: 'Petr je odvážný.'", "Postava ukazuje vlastnosti svým jednáním", "Jiná postava mluví o hlavní postavě", "Přímá řeč hlavní postavy"], e: "U přímé charakteristiky autor vlastnost rovnou pojmenuje slovy ('Petr je odvážný'). Když se vlastnost pozná až z jednání, jde o charakteristiku nepřímou." },
  { q: "Co je nepřímá charakteristika postavy?", a: "Vlastnosti poznáme z chování, řeči a jednání postavy", opts: ["Vlastnosti poznáme z chování, řeči a jednání postavy", "Autor přímo říká, jaká postava je", "Jméno postavy nám říká vše", "Popis oblečení postavy"], e: "U nepřímé charakteristiky autor vlastnost neřekne přímo — necháme ji vyplynout z toho, jak postava jedná a mluví. Když autor řekne 'je odvážný', je to naopak charakteristika přímá." },
  { q: "Příklad přímé charakteristiky:", a: "'Jana je velmi hodná a pomáhá všem v nouzi.'", opts: ["'Jana je velmi hodná a pomáhá všem v nouzi.'", "'Jana skočila do řeky, aby zachránila tonoucího.'", "'Jana řekla: Pomůžu ti!'", "'Jana dostal cenu za statečnost.'"], e: "Tato věta vlastnost přímo pojmenuje slovem 'hodná' — to je přímá charakteristika. Ostatní možnosti vlastnost jen naznačují přes čin nebo řeč, ty by byly nepřímé." },
  { q: "Příklad nepřímé charakteristiky:", a: "'Skočil do řeky a zachránil tonoucího.' → odvážný", opts: ["'Skočil do řeky a zachránil tonoucího.' → odvážný", "'Petr je odvážný.'", "'Řekli mu, že je odvážný.'", "'Dostal vyznamenání za statečnost.'"], e: "Z odvážného činu si sami domyslíme, že je postava odvážná — vlastnost není řečena přímo, proto je charakteristika nepřímá. Věta 'Petr je odvážný' by vlastnost pojmenovala přímo." },
  { q: "Čím se liší hlavní a vedlejší postava?", a: "Hlavní = střed příběhu; vedlejší = doplňuje příběh", opts: ["Hlavní = střed příběhu; vedlejší = doplňuje příběh", "Hlavní je vždy hodná, vedlejší zlá", "Hlavní je dospělá, vedlejší dítě", "Nejsou žádné vedlejší postavy"], e: "Hlavní postava je středem děje, vedlejší ho jen doplňují a pomáhají nebo brání hlavní postavě. Rozdíl není ve věku ani v tom, kdo je hodný nebo zlý." },
  { q: "Co nám o postavě může říct přímá řeč?", a: "Jak postava mluví, co si myslí a jaké má hodnoty", opts: ["Jak postava mluví, co si myslí a jaké má hodnoty", "Jen věk postavy", "Jen fyzický popis", "Jak se jmenuje"], e: "Z toho, co a jak postava říká, poznáme její povahu, názory i hodnoty. Věk, vzhled ani jméno se z přímé řeči většinou nedozvíme." },
  { q: "Záporná postava v pohádce má typicky vlastnosti:", a: "závist, lstivost, krutost, sobeckost", opts: ["závist, lstivost, krutost, sobeckost", "odvaha, laskavost, upřímnost", "výška, barva vlasů, věk", "povolání, bydliště, záliby"], e: "Záporná (zlá) postava se pozná podle špatných povahových vlastností jako závist nebo krutost. Odvaha a laskavost patří kladným postavám a výška či věk jsou jen vnější údaje." },
  { q: "Kladná postava v pohádce má typicky vlastnosti:", a: "odvaha, laskavost, upřímnost, pracovitost", opts: ["odvaha, laskavost, upřímnost, pracovitost", "závist, lstivost, krutost", "výška, barva vlasů, věk", "povolání, bydliště, záliby"], e: "Kladná (hodná) postava má dobré povahové vlastnosti jako odvaha a laskavost. Závist a krutost patří záporným postavám a výška nebo věk povahu nepopisují." },
  { q: "Jak se postava vyvíjí v příběhu?", a: "Může se změnit — naučí se, poroste, změní názor", opts: ["Může se změnit — naučí se, poroste, změní názor", "Postava je vždy stejná od začátku do konce", "Postava vždy zesiluje fyzicky", "Postava vždy zemře na konci"], e: "Zajímavá postava se během příběhu vyvíjí — něco se naučí, dospěje nebo změní názor. Není pravda, že by zůstávala vždy stejná nebo vždy nutně zemřela." },
  { q: "Vypravěč v příběhu:", a: "Vypráví příběh — může být uvnitř nebo vně příběhu", opts: ["Vypráví příběh — může být uvnitř nebo vně příběhu", "Je vždy hlavní postavou", "Je vždy zápornou postavou", "Je vždy dítětem"], e: "Vypravěč je ten, kdo příběh vypráví — někdy je sám jednou z postav, jindy stojí mimo děj a jen ho líčí. Nemusí být hlavní ani zápornou postavou." },
  { q: "Jak poznáme postavu z pohádky?", a: "Je jednodimenzionální — jasně dobrá nebo zlá", opts: ["Je jednodimenzionální — jasně dobrá nebo zlá", "Je složitá s rozporuplnými vlastnostmi", "Nikdy nemluví", "Je vždy zvíře"], e: "Pohádkové postavy bývají jednoduché a jasně rozdělené na dobré a zlé. Složitější postavy s rozpornými vlastnostmi najdeme spíš v povídkách a románech." },
  { q: "Jaká slova popisují fyzické vlastnosti?", a: "vysoký, blonďatý, štíhlý, s modrýma očima", opts: ["vysoký, blonďatý, štíhlý, s modrýma očima", "odvážný, laskavý, sobecký", "rychlý, chytrý, pilný", "šťastný, smutný, naštvaný"], e: "Fyzické vlastnosti popisují vzhled — výšku, barvu vlasů, postavu nebo oči. Slova jako odvážný nebo chytrý popisují povahu, ne to, jak postava vypadá." },
  { q: "Jaká slova popisují psychické vlastnosti?", a: "odvážný, laskavý, sobecký, lstivý, upřímný", opts: ["odvážný, laskavý, sobecký, lstivý, upřímný", "vysoký, blonďatý, štíhlý", "rychlý, pomalý, hlasitý", "červený, zelený, modrý"], e: "Psychické vlastnosti popisují povahu — jaká postava je uvnitř, jako odvážný nebo upřímný. Slova vysoký nebo modrý popisují jen vzhled, ne charakter." },
];

const POOL_L2: QA[] = [
  { q: "Přečti: 'Petr mlčky pomohl přenést těžké bedny bez toho, aby ho kdokoli žádal.' Co tím chce autor říct?", a: "Petr je obětavý a pracovitý (nepřímá charakteristika)", opts: ["Petr je obětavý a pracovitý (nepřímá charakteristika)", "Petr je silný (fyzická vlastnost)", "Petr je tichý (přímá charakteristika)", "Bedny byly těžké"], e: "Z toho, že Petr pomohl sám od sebe a bez vyzvání, poznáme jeho povahu — je obětavý a pracovitý. Vlastnost není řečena přímo, vyplývá z jeho jednání, proto jde o nepřímou charakteristiku." },
  { q: "Přečti: 'Marta se usmívala na každého, kdo šel kolem.' Co vyvozujeme?", a: "Marta je přátelská a otevřená", opts: ["Marta je přátelská a otevřená", "Marta je zlá a lstivá", "Marta je smutná", "Marta je fyzicky aktivní"], e: "Úsměv na každého ukazuje přátelskou a otevřenou povahu — to si z jejího chování domyslíme. Zlost nebo smutek by se projevily úplně jinak." },
  { q: "Jak se liší postava v pohádce a v povídce?", a: "Pohádková = jednodimenzionální; v povídce = komplexnější", opts: ["Pohádková = jednodimenzionální; v povídce = komplexnější", "Jsou stejné", "V pohádce je vždy dospělá; v povídce dítě", "V pohádce není hlavní postava"], e: "Pohádkové postavy bývají jednoduché a jasně dobré nebo zlé, kdežto v povídce jsou složitější a opravdovější. Rozdíl není ve věku postav." },
  { q: "Příklad vývoje postavy v příběhu:", a: "Zlý statkář pochopí, že záleží na přátelství, a změní se.", opts: ["Zlý statkář pochopí, že záleží na přátelství, a změní se.", "Hodný chlapec zůstane hodný celý příběh.", "Drak celý příběh plní příkazy.", "Princezna čeká celý příběh bez pohybu."], e: "O vývoji mluvíme, když se postava během příběhu změní — statkář se ze zlého stane lepším. V ostatních možnostech postava zůstává po celou dobu stejná." },
  { q: "Co je 'round character' (plná postava)?", a: "Komplexní postava s rozporuplnými vlastnostmi — ne jen dobrá nebo zlá", opts: ["Komplexní postava s rozporuplnými vlastnostmi — ne jen dobrá nebo zlá", "Postava, která je fyzicky silná", "Postava z pohádky", "Postava bez jména"], e: "Plná postava má víc různých, někdy i protichůdných vlastností, takže působí jako skutečný člověk. Postava jen dobrá nebo jen zlá (třeba z pohádky) je naopak jednoduchá." },
  { q: "Autor řekne: 'Honza byl vždy první, kdo se nabídl k práci.' — jaký typ charakteristiky?", a: "nepřímá (jednání ukazuje pracovitost)", opts: ["nepřímá (jednání ukazuje pracovitost)", "přímá (autor říká přímo)", "fyzická", "psychická přímá"], e: "Autor neřekne 'Honza je pracovitý', ale ukáže jeho čin, ze kterého to poznáme — to je nepřímá charakteristika. Přímá by vlastnost pojmenovala rovnou slovem." },
  { q: "Jakou roli hrají vedlejší postavy?", a: "Doplňují příběh, pomáhají nebo brání hlavní postavě", opts: ["Doplňují příběh, pomáhají nebo brání hlavní postavě", "Jsou vždy záporné", "Jsou vždy kladné", "Nevyskytují se v příbězích"], e: "Vedlejší postavy stojí kolem hlavní postavy a děj doplňují — někdy jí pomáhají, jindy překážejí. Nejsou tedy vždy jen kladné, ani vždy jen záporné." },
  { q: "Jak popsat postavu při charakteristice?", a: "Fyzické vlastnosti → psychické vlastnosti → chování → vztahy", opts: ["Fyzické vlastnosti → psychické vlastnosti → chování → vztahy", "Jméno → věk → pohlaví → konec", "Abecedně", "Jen přímou řečí"], e: "Postavu popisujeme od vzhledu k povaze a chování až po vztahy k ostatním — jdeme tak od toho, co vidíme, k tomu, co je hlubší. Pouhý výčet jména a věku ani abeceda postavu nevystihnou." },
  { q: "Záporná postava: 'Královna záviděla sněhurce její krásu a přikázala ji zabít.' — jaká vlastnost?", a: "závist a krutost", opts: ["závist a krutost", "upřímnost a odvaha", "laskavost a obětavost", "pracovitost a pilnost"], e: "Královna druhé závidí a chce jí ublížit — to ukazuje závist a krutost, typické vlastnosti záporné postavy. Laskavost ani odvaha by vedly k úplně jinému jednání." },
  { q: "Jak vyjádříme sympatie nebo antipatie k postavě?", a: "Záleží na jejích vlastnostech a jednání — co dělá a říká", opts: ["Záleží na jejích vlastnostech a jednání — co dělá a říká", "Záleží na délce popisu postavy", "Záleží na fyzickém popisu", "Záleží na jménu postavy"], e: "Jestli nám je postava sympatická, určuje hlavně to, jak jedná a co říká — podle jejích činů ji máme rádi, nebo ne. Délka popisu ani jméno na to nemají vliv." },
  { q: "Protagonista je:", a: "Hlavní postava příběhu — hrdina", opts: ["Hlavní postava příběhu — hrdina", "Záporná postava", "Vedlejší postava", "Vypravěč"], e: "Protagonista je hlavní postava, hrdina, kolem kterého se příběh točí. Jeho protivníkem je antagonista — to je naopak ten, kdo mu stojí v cestě." },
  { q: "Antagonista je:", a: "Protivník hlavní postavy — překáží nebo bojuje proti ní", opts: ["Protivník hlavní postavy — překáží nebo bojuje proti ní", "Hlavní hrdina", "Vedlejší postava pomáhající hrdinovi", "Vypravěč"], e: "Antagonista je protivník hrdiny — staví se mu do cesty nebo proti němu bojuje. Hlavní hrdina je naopak protagonista." },
  { q: "Proč autor nevykreslí vždy postavu přímou charakteristikou?", a: "Nepřímá je živější — čtenář si sám vyvozuje vlastnosti", opts: ["Nepřímá je živější — čtenář si sám vyvozuje vlastnosti", "Autor neumí psát přímou charakteristiku", "Přímá charakteristika je zakázána", "Čtenáři se nepřímá nelíbí"], e: "Když si vlastnost domyslíme sami z jednání postavy, příběh je živější a zajímavější než suché 'je odvážný'. Není to proto, že by autor přímou charakteristiku neuměl nebo směl." },
  { q: "Příklad komplexní postavy:", a: "Detektiv, který je chytrý, ale závisí na whisky a je osamělý", opts: ["Detektiv, který je chytrý, ale závisí na whisky a je osamělý", "Pohádkový princ, který je vždy hodný", "Drak, který je vždy zlý", "Víla, která vždy pomáhá"], e: "Komplexní postava má dobré i slabé stránky zároveň — detektiv je chytrý, ale i osamělý a se závislostí. Princ, drak ani víla mají jen jednu jasnou vlastnost, proto jsou jednoduší." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Hlavní postava = střed příběhu, nejvíce se vyskytuje",
      "Fyzické vlastnosti = jak vypadá; psychické = jak se chová",
      "Přímá charakteristika = autor říká přímo; nepřímá = z jednání a řeči postavy",
    ],
    explanation: e,
  }));
}

export const HLAVNIPOSTAVYAJEJICHCHARAKTERISTIKA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-hlavni-postavy-a-jejich-charakteristika",
    title: "Hlavní postavy a jejich charakteristika",
    studentTitle: "Postavy v příbězích",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se analyzovat postavy v příbězích a rozlišit přímou a nepřímou charakteristiku.",
    keywords: ["hlavní postava", "charakteristika", "fyzické vlastnosti", "psychické vlastnosti", "přímá charakteristika", "nepřímá charakteristika"],
    goals: [
      "Rozlišit fyzické a psychické vlastnosti postavy",
      "Rozlišit přímou a nepřímou charakteristiku",
      "Určit hlavní a vedlejší postavu",
    ],
    boundaries: ["Bez literárněvědné terminologie", "Bez psychologické analýzy"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Fyzické = vzhled; psychické = charakter; přímá = autor říká přímo; nepřímá = z jednání postavy",
      steps: [
        "Kdo je hlavní postava? → nejvíce se vyskytuje",
        "Fyzické vlastnosti: jak vypadá (vlasy, oči, postava)?",
        "Psychické vlastnosti: jak se chová (odvážný, laskavý...)?",
        "Přímá char. = autor říká; nepřímá = z jednání/řeči/myšlenek",
      ],
      commonMistake: "Záměna přímé a nepřímé charakteristiky — 'Je hodný.' = přímá; 'Pomohl bez ptaní.' = nepřímá",
      example: "Přímá: 'Jana je velmi odvážná.' Nepřímá: 'Jana skočila do řeky, aby zachránila tonoucího.'",
    },
  },
];
