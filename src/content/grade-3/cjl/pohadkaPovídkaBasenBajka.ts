import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string; hints?: string[] }

const POOL_L1: QA[] = [
  { q: "Co je pohádka?", a: "Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", opts: ["Příběh s nadpřirozenými bytostmi (víly, draci, čarodějnice)", "Příběh ze skutečného života", "Báseň s rýmy", "Příběh o zvířatech s ponaučením"], e: "Pohádka je příběh, kde se dějí věci, které v opravdovém životě nejdou — třeba víly kouzlí nebo draci chrlí oheň. To jsou nadpřirozené bytosti a jevy, díky nim poznáme, že čteme pohádku." },
  {
    q: "Jak typicky začíná pohádka?",
    a: "Bylo nebylo... / Za sedmero horami...",
    opts: ["Bylo nebylo... / Za sedmero horami...", "Jednoho večera jsem šel domů...", "Dnes ráno...", "V přírodě žijí..."],
    e: "Pohádky začínají zvláštními frázemi jako 'Bylo nebylo' nebo 'Za sedmero horami', které nám hned říkají: tohle je vymyšlený příběh z dávných časů.",
    hints: [
      "Pohádky mívají zvláštní úvodní frázi, která hned říká, že jde o vymyšlený příběh z dávných časů.",
      "Zkus si vzpomenout, jak začínají klasické pohádky, které znáš z knížek.",
    ],
  },
  { q: "Co je bajka?", a: "Krátký příběh se zvířaty, který má ponaučení", opts: ["Krátký příběh se zvířaty, který má ponaučení", "Pohádka s draky", "Báseň bez rýmu", "Skutečný příběh ze života"], e: "Bajka má vždy dvě věci najednou: zvířata, která se chovají jako lidé, a ponaučení — krátkou moudrou větu na konci. Bez ponaučení by to nebyla bajka." },
  { q: "Kdo napsal bajky o zvířatech ve starověku?", a: "Ezop (řecký spisovatel)", opts: ["Ezop (řecký spisovatel)", "Erben", "Němcová", "Andersen"], e: "Ezop žil ve starém Řecku před více než 2 500 lety a napsal stovky bajek jako 'Liška a vrána' nebo 'Zajíc a želva'. Erben a Němcová jsou čeští spisovatelé, Andersen psal pohádky." },
  { q: "Co je povídka?", a: "Kratší příběh ze skutečného (nebo reálně možného) života", opts: ["Kratší příběh ze skutečného (nebo reálně možného) života", "Dlouhý román", "Báseň s rýmy", "Pohádka se šťastným koncem"], e: "Povídka vypráví o věcech, které by se mohly opravdu stát. Nenajdeme v ní víly ani mluvící zvířata a je kratší než román." },
  { q: "Co je báseň?", a: "Literární útvar psaný ve verších, s rýmem nebo rytmem", opts: ["Literární útvar psaný ve verších, s rýmem nebo rytmem", "Příběh s dějem", "Popis přírody v próze", "Bajka se zvířaty"], e: "Báseň poznáme podle veršů, tedy krátkých řádků, jejichž konce se rýmují. Ostatní žánry jsou psané v normálních větách." },
  { q: "Jak poznáme bajku?", a: "Zvířata mluví a jednají jako lidé, text končí ponaučením", opts: ["Zvířata mluví a jednají jako lidé, text končí ponaučením", "Pohádkové bytosti jako draci", "Rýmy a strofy", "Jen popis přírody"], e: "V bajce se zvířata chovají jako lidé a vždy na konci najdeme ponaučení, třeba 'Pýcha předchází pád'. Tohle spojení je typické jen pro bajku." },
  { q: "Jak se jmenuje pohádkový hrdina, který zachraňuje princeznu?", a: "Princ / Rytíř (typická pohádková postava)", opts: ["Princ / Rytíř (typická pohádková postava)", "Ježibaba", "Posel", "Rolník"], e: "V pohádkách se opakují stálé postavy — princ nebo rytíř bývá hrdina, který zachraňuje princeznu. Ježibaba je naopak záporná postava." },
];

const POOL_L2: QA[] = [
  { q: "Pohádka od Boženy Němcové je:", a: "Zlatovláska nebo O dvanácti měsíčkách", opts: ["Zlatovláska nebo O dvanácti měsíčkách", "Malá mořská víla (Andersen)", "Popelka (Perrault)", "Červená Karkulka"], e: "Božena Němcová sebrala a napsala mnoho pohádek — třeba Zlatovlásku. Malá mořská víla je od Andersena a Červená Karkulka od Charlese Perraulta." },
  {
    q: "Čím se liší pohádka od povídky?",
    a: "Pohádka má nadpřirozené bytosti, povídka je ze skutečného života",
    opts: ["Pohádka má nadpřirozené bytosti, povídka je ze skutečného života", "Pohádka je kratší", "Povídka má rýmy", "Žádný rozdíl"],
    e: "Rozdíl je v tom, jestli se příběh mohl opravdu stát. V pohádce jsou kouzelné předměty, víly, draci. V povídce se děje jen to, co je reálně možné.",
    hints: [
      "Přemýšlej, jestli se v jednom z obou žánrů dějí věci, které v reálném životě nemohou nastat (kouzla, mluvící zvířata, draci).",
      "Jedna z možností popisuje kouzelný svět, druhá popisuje svět, jaký doopravdy existuje.",
    ],
  },
  { q: "Ponaučení bajky bývá:", a: "Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", opts: ["Krátká moudrá věta na konci (Kdo jiné jámu kopá...)", "Dlouhé moralizující vyprávění", "Jen nadpis", "Uprostřed textu"], e: "Ponaučení bajky je vždy krátká výstižná věta na konci příběhu, aby vynikla jako závěr." },
  { q: "Karel Čapek napsal:", a: "Povídky, romány (detektivky, sci-fi)", opts: ["Povídky, romány (detektivky, sci-fi)", "bajky", "staré pověsti", "pohádky s draky"], e: "Karel Čapek je autor povídek a románů, například vědeckofantastických děl. Bajky psal Ezop, staré pověsti Jirásek." },
  {
    q: "Jaký literární žánr je 'Červená Karkulka'?",
    a: "Pohádka",
    opts: ["Pohádka", "Bajka", "Povídka", "Báseň"],
    e: "Červená Karkulka je pohádka — mluvící vlk, který předstírá, že je babička, je typický nadpřirozený pohádkový prvek.",
    hints: [
      "Mluvící vlk, který předstírá, že je někdo jiný, je typický nadpřirozený prvek.",
      "Bajka = zvířata + ponaučení. Povídka = reálný život. Báseň = verše. Co zbývá z těch čtyř žánrů?",
    ],
  },
  { q: "Jaký literární žánr je příběh 'Liška a vrána' (liška chválí vránu, vrána pustí sýr)?", a: "Bajka (zvířata + ponaučení)", opts: ["Bajka (zvířata + ponaučení)", "Pohádka", "Povídka", "Báseň"], e: "Liška a vrána je bajka — zvířata se chovají jako lidé a příběh končí ponaučením: nenech se chytit na lichotky." },
  { q: "Text je psán v odstavcích, bez rýmu, vypráví o dvou dětech, které si hrají na hřišti. Jaký je to žánr?", a: "Povídka (reálný život, próza, bez pohádkových prvků)", opts: ["Povídka (reálný život, próza, bez pohádkových prvků)", "Pohádka", "Bajka", "Báseň"], e: "Děti hrající si na hřišti jsou reálná, obyčejná situace bez kouzel a mluvících zvířat — to je znak povídky." },
  { q: "Text: 'Byl jednou jeden zakletý princ, který se mohl vysvobodit jen políbením.' Jaký žánr?", a: "Pohádka (kouzlo, zakletí)", opts: ["Pohádka (kouzlo, zakletí)", "Povídka", "Bajka", "Báseň"], e: "Zakletí a vysvobození políbením je nadpřirozený, kouzelný prvek typický pro pohádku." },
];

const POOL_L3: QA[] = [
  { q: "Příběh má mluvící zvíře, ale NEKONČÍ ponaučením. Může to být bajka?", a: "Ne — bajka musí mít i ponaučení, jinak jde spíš o pohádku se zvířecí postavou", opts: ["Ne — bajka musí mít i ponaučení, jinak jde spíš o pohádku se zvířecí postavou", "Ano, stačí, že zvíře mluví", "Ano, protože zvířata vždy tvoří bajku", "Ne — bajka nesmí mít zvířata"], e: "Mluvící zvíře samo o sobě bajku nedělá — bajka musí mít i závěrečné ponaučení. Bez něj jde spíš o pohádku se zvířecí postavou." },
  { q: "Příběh o dítěti, které se ztratí v obchodním domě a najde ho maminka, je:", a: "Povídka (reálná situace, bez kouzel)", opts: ["Povídka (reálná situace, bez kouzel)", "Pohádka", "Bajka", "Báseň"], e: "Ztracení a nalezení v obchodním domě se může opravdu stát, nejsou tam kouzla ani mluvící zvířata — to je povídka." },
  { q: "V příběhu vystupuje mluvící liška, odehrává se v moderním velkoměstě a nemá žádné ponaučení na konci. Je to spíš:", a: "Pohádka (mluvící zvíře jako pohádková bytost, chybí ponaučení bajky)", opts: ["Pohádka (mluvící zvíře jako pohádková bytost, chybí ponaučení bajky)", "Bajka", "Povídka", "Báseň"], e: "Mluvící zvíře je nadpřirozený prvek jako v pohádce. Bez ponaučení to ale nemůže být bajka — chybí jí povinná podmínka." },
  { q: "Krátký příběh: liška chválí vránu, aby jí vzala sýr, a na konci stojí věta 'Nenech se chytit na lichotky.' Co dokazuje, že jde o bajku?", a: "Zvířata jednají jako lidé A zároveň je na konci explicitní ponaučení", opts: ["Zvířata jednají jako lidé A zároveň je na konci explicitní ponaučení", "Jen to, že vystupují zvířata", "Jen to, že má krátký text", "Jen to, že má šťastný konec"], e: "Bajku poznáme podle obou znaků najednou — zvířata s lidskými vlastnostmi a jasné ponaučení na konci. Samotná přítomnost zvířat nebo krátkost textu nestačí." },
  { q: "Příběh o obyčejném klukovi, který jednoho dne najde kouzelnou lampu s duchem. Jaký žánr to nejspíš je?", a: "Pohádka (kouzelný předmět je nadpřirozený prvek)", opts: ["Pohádka (kouzelný předmět je nadpřirozený prvek)", "Povídka", "Bajka", "Báseň"], e: "Kouzelná lampa a duch jsou nadpřirozené prvky, které z příběhu dělají pohádku, i když hlavní hrdina je obyčejný kluk." },
  { q: "Který žánr NEMÁ povinně ponaučení na konci, i když v něm mohou vystupovat mluvící zvířata?", a: "Pohádka (na rozdíl od bajky, kde je ponaučení povinné)", opts: ["Pohádka (na rozdíl od bajky, kde je ponaučení povinné)", "Bajka", "Obojí musí mít ponaučení", "Ani jeden žánr nemá zvířata"], e: "Ponaučení je povinná součást jen u bajky. Pohádka může mít mluvící zvířata, ale nemusí končit ponaučením." },
  {
    q: "Kniha vypráví o skutečné rodině, která se stěhuje do nového města — bez kouzel, beze zvířat, co mluví. Jaký žánr?",
    a: "Povídka",
    opts: ["Povídka", "Pohádka", "Bajka", "Báseň"],
    e: "Stěhování rodiny bez kouzel a mluvících zvířat je reálná situace — takový příběh patří mezi povídky.",
    hints: [
      "Bez kouzel a bez mluvících zvířat — jen normální rodina a stěhování.",
      "Pohádka = nadpřirozené bytosti. Bajka = zvířata + ponaučení. Báseň = verše. Co zbývá z těch čtyř žánrů?",
    ],
  },
  { q: "Čím se liší báseň od pohádky, bajky a povídky?", a: "Je psaná ve verších s rýmem, ne v souvislé próze", opts: ["Je psaná ve verších s rýmem, ne v souvislé próze", "Nesmí mít žádné postavy", "Musí být vždy o zvířatech", "Nesmí mít děj"], e: "Báseň se od ostatních tří žánrů liší především formou zápisu — je psaná ve verších s rýmem, zatímco pohádka, bajka i povídka jsou psané v souvislé próze." },
  { q: "Text má krátké rýmované řádky a vypráví o pohádkové princezně a drakovi. Je to pohádka, nebo báseň?", a: "Je to báseň s pohádkovým obsahem (rozhoduje forma zápisu — verše)", opts: ["Je to báseň s pohádkovým obsahem (rozhoduje forma zápisu — verše)", "Je to pohádka, protože má princeznu a draka", "Je to bajka, protože má draka", "Je to povídka"], e: "O tom, zda je text báseň, rozhoduje forma zápisu — krátké rýmované verše. Pohádkové téma (princezna, drak) může mít text napsaný jak v próze (pohádka), tak ve verších (báseň)." },
  { q: "Příběh o lišce, která si stěžuje sousedům na počasí a nakonec si s nimi jen popovídá u čaje — bez ponaučení. Je to bajka?", a: "Ne — chybí ponaučení, i když liška jedná jako člověk", opts: ["Ne — chybí ponaučení, i když liška jedná jako člověk", "Ano, protože liška mluví", "Ano, protože je to krátký příběh", "Ano, protože liška je zvíře"], e: "I když liška jedná jako člověk, bez závěrečného ponaučení nejde o bajku — to je klíčový rozlišovací znak, který tady chybí." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 16).map(({ q, a, opts, e, hints }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: hints ?? ["Pohádka = nadpřirozené bytosti. Bajka = zvířata + ponaučení. Povídka = reálný život. Báseň = verše.", "Typický začátek pohádky: 'Bylo nebylo...'"],
    explanation: e,
  }));
}

export const POHADKAPOVIDKA: TopicMetadata[] = [
  {
    id: "g3-cjl-pohadka-povidka-basen-bajka",
    rvpNodeId: "g3-cjl-literarni-vychova-literarni-druhy-a-zanry-pohadka-povidka-basen-bajka",
    title: "Pohádka, povídka, báseň, bajka",
    studentTitle: "Žánry literatury",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární druhy a žánry",
    briefDescription: "Poznáš rozdíl mezi pohádkou, povídkou, básní a bajkou.",
    keywords: ["pohádka", "povídka", "báseň", "bajka", "literární žánry", "nadpřirozené bytosti", "ponaučení"],
    goals: ["Rozlišit pohádku, povídku, báseň a bajku.", "Uvést typické znaky každého žánru.", "Přiřadit konkrétní text ke správnému žánru."],
    boundaries: ["Základní žánry pro 3. ročník."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Pohádka: nadpřirozené bytosti. Bajka: zvířata + ponaučení. Povídka: reálný život. Báseň: verše a rýmy.",
      steps: ["Přečti ukázku.", "Jsou tam bytosti jako víly, draci? → pohádka.", "Mluví zvířata a text má ponaučení? → bajka.", "Je to psáno ve verších? → báseň.", "Jinak: povídka."],
      commonMistake: "Příběh se zvířaty ≠ vždy bajka — bajka musí mít ponaučení.",
      example: "Liška a vrána (liška pochválí vránu, aby dostala sýr) = bajka. Ponaučení: Nenech se chytit na lichotky.",
    },
  },
];
