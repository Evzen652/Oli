import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Kolik ročních období má ČR?",
    correctAnswer: "4",
    options: ["4", "2", "3", "6"],
    hints: ["Jaro, léto, ..."],
    solutionSteps: ["ČR má 4 roční období: jaro, léto, podzim, zima."],
  },
  {
    question: "Jaký typ podnebí má Česká republika?",
    correctAnswer: "Mírné kontinentální",
    options: ["Tropické horké", "Mírné kontinentální", "Arktické mrazivé", "Pouštní suché"],
    hints: ["ČR leží ve střední Evropě — ani příliš horko, ani příliš zima."],
    solutionSteps: ["ČR má mírné kontinentální podnebí — střídají se 4 roční období."],
  },
  {
    question: "Kde v ČR bývá nejteplejší podnebí?",
    correctAnswer: "Na jižní Moravě – Brno, Znojmo",
    options: ["V Krkonoších", "Na Šumavě", "Na jižní Moravě – Brno, Znojmo", "V Libereckém kraji"],
    hints: ["Jižní oblasti ČR jsou teplejší než severní."],
    solutionSteps: ["Nejteplejší oblasti ČR jsou jižní Morava — Brno a okolí Znojma."],
  },
  {
    question: "Kde v ČR bývá nejchladnější podnebí?",
    correctAnswer: "V horách — Krkonoše, Šumava",
    options: ["Na jižní Moravě", "V Praze", "V Polabské nížině", "V horách — Krkonoše, Šumava"],
    hints: ["V horách je vždy chladněji než v nížinách."],
    solutionSteps: ["Nejchladněji je v horách — v Krkonoších a na Šumavě."],
  },
  {
    question: "Co je to počasí?",
    correctAnswer: "Aktuální stav ovzduší v daném místě a čase",
    options: [
      "Aktuální stav ovzduší v daném místě a čase",
      "Dlouhodobé průměrné teplotní hodnoty oblasti",
      "Složení vzduchu",
      "Předpověď na příštích 10 let",
    ],
    hints: ["Počasí se mění každý den nebo i hodinu."],
    solutionSteps: ["Počasí = aktuální stav atmosféry (teplota, déšť, vítr) v daném místě a čase."],
  },
  {
    question: "Co je to podnebí (klima)?",
    correctAnswer: "Dlouhodobé průměry počasí v dané oblasti",
    options: ["Aktuální počasí za oknem", "Dlouhodobé průměry počasí v dané oblasti", "Teplota vzduchu", "Množství srážek v jeden den"],
    hints: ["Podnebí se nemění každý den — platí pro celou oblast po mnoho let."],
    solutionSteps: ["Podnebí jsou dlouhodobé průměrné podmínky (teplota, srážky, vítr) v dané oblasti."],
  },
  {
    question: "Z čeho se skládá vzduch?",
    correctAnswer: "Hlavně z dusíku a kyslíku",
    options: ["Jen z kyslíku", "Z vodní páry a prachu", "Hlavně z dusíku a kyslíku", "Z oxidu uhličitého a kyslíku"],
    hints: ["Bez jedné z těchto plynů bychom nedýchali."],
    solutionSteps: ["Vzduch tvoří přibližně 78 % dusíku a 21 % kyslíku plus malé množství jiných plynů."],
  },
  {
    question: "Kolik milimetrů srážek ročně průměrně spadne v ČR?",
    correctAnswer: "600–700 mm",
    options: ["100–200 mm", "300–400 mm", "1200–1500 mm", "600–700 mm"],
    hints: ["ČR má mírné srážky — ani sucho, ani tropické deště."],
    solutionSteps: ["V ČR spadne průměrně 600–700 mm srážek ročně."],
  },
  {
    question: "V které části ČR padá více srážek — na západě nebo na východě?",
    correctAnswer: "Na západě ČR – návětrná strana",
    options: ["Na západě ČR – návětrná strana", "Na východě ČR, protože je blíž horám", "Všude v ČR úplně stejně, žádný rozdíl", "Na jihu ČR, poblíž jižní Moravy"],
    hints: ["Déšť přichází ze západ a na návětrné straně hor spadne více srážek."],
    solutionSteps: ["Na západě ČR (návětrná strana) spadá více srážek, protože oblaka přicházejí od Atlantiku."],
  },
  {
    question: "Co je to smog?",
    correctAnswer: "Znečištění ovzduší, zejména v průmyslových oblastech",
    options: ["Druh mlhy na horách", "Znečištění ovzduší, zejména v průmyslových oblastech", "Studená fronta", "Typ letního bouřkového oblaku"],
    hints: ["Smog vidíš jako hnědošedý zákal nad velkoměsty."],
    solutionSteps: ["Smog je znečistění vzduchu výfukovými plyny, průmyslovými emisemi a kouřem."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jaký je rozdíl mezi počasím a podnebím?",
    correctAnswer: "Počasí je aktuální stav, podnebí jsou dlouhodobé průměry",
    options: ["Počasí platí pro celý svět, podnebí pro konkrétní místo", "Podnebí se mění denně, počasí je stálé", "Počasí je aktuální stav, podnebí jsou dlouhodobé průměry", "Jsou to synonyma"],
    hints: ["Dnes prší = počasí. V Praze průměrně 600 mm srážek ročně = podnebí."],
    solutionSteps: ["Počasí = okamžitý stav atmosféry. Podnebí = průměr počasí za mnoho let."],
  },
  {
    question: "Co je to inverze teplot?",
    correctAnswer: "Jev, kdy je v kotlinách v zimě chladnější vzduch než na vrcholech hor",
    options: ["Letní vedro, které panuje jen v nížinách", "Zcela neobvyklé sněžení uprostřed léta", "Oblast s mimořádně vysokým množstvím srážek", "Jev, kdy je v kotlinách v zimě chladnější vzduch než na vrcholech hor"],
    hints: ["Studený vzduch je těžší a klesá do kotlin — proto je tam mlha."],
    solutionSteps: ["Inverze = studený vzduch klesne do kotlin a zůstane tam, zatímco výš je teplejší vzduch."],
  },
  {
    question: "Proč je v horách ČR chladněji než v nížinách?",
    correctAnswer: "S rostoucí nadmořskou výškou klesá teplota vzduchu",
    options: ["S rostoucí nadmořskou výškou klesá teplota vzduchu", "Hory jsou položené mnohem blíže k severu", "V horách svítí slunce mnohem méně často", "V horách žije mnohem méně lidí"],
    hints: ["Vzduch se ochlazuje přibližně o 0,6 °C na každých 100 m nadmořské výšky."],
    solutionSteps: ["Čím výše, tím chladněji — teplota klesá s výškou přibližně o 0,6°C na 100 m."],
  },
  {
    question: "Proč bývá v průmyslových oblastech ČR horší ovzduší?",
    correctAnswer: "Průmyslové továrny a doprava vypouštějí do vzduchu škodlivé látky",
    options: ["Průmyslové oblasti jsou blíže k jihu", "Průmyslové továrny a doprava vypouštějí do vzduchu škodlivé látky", "V průmyslových oblastech je méně zeleně", "Průmyslové oblasti jsou v nížinách"],
    hints: ["Kouř z komínů a výfuky aut znečišťují vzduch."],
    solutionSteps: ["Průmyslové emise a výfukové plyny z dopravy znečišťují vzduch v průmyslových oblastech."],
  },
  {
    question: "Co způsobuje bouřky v létě v ČR?",
    correctAnswer: "Ohřátý vzduch stoupá a vytváří bouřkové mraky – kumulonimbus",
    options: ["Studená fronta ze severu", "Příliv teplého vzduchu z Afriky", "Ohřátý vzduch stoupá a vytváří bouřkové mraky – kumulonimbus", "Výbuchy sopek"],
    hints: ["V létě se vzduch přes den zahřeje, pak stoupá a tvoří oblaka."],
    solutionSteps: ["Přehřátý vzduch stoupá, ochlazuje se a vytváří bouřkové mraky s blesky a přívalovými dešti."],
  },
  {
    question: "Jak se nazývá měřítko teplot, které používáme v ČR?",
    correctAnswer: "Stupně Celsia – °C",
    options: ["Stupně Fahrenheita – °F", "Kelviny – K", "Stupně Réaumura", "Stupně Celsia – °C"],
    hints: ["Voda zamrzá při 0 °C a vaří se při 100 °C."],
    solutionSteps: ["V ČR (a většině světa) měříme teplotu ve stupních Celsia — 0 °C = bod mrazu vody."],
  },
  {
    question: "Proč se používá předpověď počasí?",
    correctAnswer: "Aby se lidé připravili na budoucí počasí — oblékání, zemědělství, letectví",
    options: [
      "Aby se lidé připravili na budoucí počasí — oblékání, zemědělství, letectví",
      "Protože ji sledují jen meteorologové",
      "Předpověď je jen orientační bez praktického využití",
      "Kvůli statistickým výzkumům",
    ],
    hints: ["Předpověď počasí je důležitá pro každodenní rozhodování."],
    solutionSteps: ["Předpověď umožňuje připravit se na déšť, mráz nebo bouřku — je důležitá pro zemědělce, letce i turisty."],
  },
  {
    question: "Kde se v ČR měří počasí a shromažďují data?",
    correctAnswer: "Na meteorologických stanicích a v meteorologickém ústavu – ČHMÚ",
    options: ["Jen v Praze na Václavském náměstí", "Na meteorologických stanicích a v meteorologickém ústavu – ČHMÚ", "Na horách, jen v zimě", "V laboratořích akademie věd"],
    hints: ["Meteorologové měří teplotu, srážky a vítr na speciálních stanicích."],
    solutionSteps: ["ČHMÚ (Český hydrometeorologický ústav) provozuje síť stanic měřící počasí po celé ČR."],
  },
  {
    question: "Jaký vliv má klimatická změna na počasí v ČR?",
    correctAnswer: "Horká léta, sucha, přívalové deště a méně sněhu v zimě",
    options: ["Chladnější léta a více sněhu", "Žádný vliv — ČR je malá země", "Horká léta, sucha, přívalové deště a méně sněhu v zimě", "Více sněhu v horách"],
    hints: ["Klimatická změna způsobuje extrémy a méně předvídatelné počasí."],
    solutionSteps: ["Klimatická změna v ČR způsobuje delší a sušší léta, přívalové deště a kratší zimní sezónu."],
  },
  {
    question: "Co je to suchý vzduch vs. vlhký vzduch?",
    correctAnswer: "Vlhký vzduch obsahuje více vodní páry, suchý méně",
    options: ["Suchý vzduch je teplejší", "Vlhký vzduch je zdravější vždy", "Suchý vzduch obsahuje více kyslíku", "Vlhký vzduch obsahuje více vodní páry, suchý méně"],
    hints: ["Vlhkost vzduchu souvisí s tím, kolik vody se v něm vznáší v podobě páry."],
    solutionSteps: ["Vlhkost vzduchu = množství vodní páry. Vlhký vzduch (u moří a řek) × suchý vzduch (v kontinentálním klimatu)."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Proč je jižní Morava nejteplejší oblastí ČR?",
    correctAnswer: "Leží na jihu, v nížině, s vlivem teplého kontinentálního vzduchu z jihovýchodu",
    options: [
      "Leží na jihu, v nížině, s vlivem teplého kontinentálního vzduchu z jihovýchodu",
      "Protože je tam nejvíce průmyslu",
      "Je chráněna horami před studeným vzduchem",
      "Protože leží u moře",
    ],
    hints: ["Jižní Morava leží níže a blíže středomořskému podnebí."],
    solutionSteps: ["Jižní Morava je teplejší, protože leží v nížině na jihu ČR a dostává teplý vzduch z jihovýchodní Evropy."],
  },
  {
    question: "Co je to studená fronta a co způsobuje?",
    correctAnswer: "Hranice mezi studeným a teplým vzduchem — přináší prudké ochlazení a srážky",
    options: [
      "Zvláštní typ silného, studeného horského větru",
      "Hranice mezi studeným a teplým vzduchem — přináší prudké ochlazení a srážky",
      "Hustá zimní mlha usazená v horských kotlinách",
      "Silná tropická bouřka přicházející od moře",
    ],
    hints: ["Fronta = setkání teplého a studeného vzduchového tělesa."],
    solutionSteps: ["Studená fronta nastane, kdy studený vzduch podlézá teplý — způsobí prudké bouřky a ochlazení."],
  },
  {
    question: "Proč na západ ČR spadá více srážek než na východ?",
    correctAnswer: "Oblaka přicházejí od Atlantiku a na návětrné straně hor vydají víc vody",
    options: ["Západ ČR je blíže Severnímu moři", "Na východě ČR je sušší klima kvůli průmyslu", "Oblaka přicházejí od Atlantiku a na návětrné straně hor vydají víc vody", "Západ je nižší, takže více prší"],
    hints: ["Vzduch přichází od atlantského oceánu ze západu — vydeštuje se na návětrné straně."],
    solutionSteps: ["Vzduch nesoucí vodu přichází od Atlantiku ze západu — na návětrné straně (západ) vypustí více vody než na závětrné (východ)."],
  },
  {
    question: "Jak ovlivňuje les podnebí v okolí?",
    correctAnswer: "Les zadržuje vodu, ochlazuje okolí a zvyšuje vlhkost vzduchu",
    options: ["Les nemá na místní podnebí vůbec žádný vliv", "Les naopak zvyšuje teplotu v celém okolí", "Les naopak způsobuje sucho v okolní krajině", "Les zadržuje vodu, ochlazuje okolí a zvyšuje vlhkost vzduchu"],
    hints: ["Lesy jsou klimatizace pro svět — proč?"],
    solutionSteps: ["Les zadržuje srážky v půdě, odpařuje vodu (ochlazuje) a vytváří vlhčí a chladnější mikroklima."],
  },
  {
    question: "Proč je městské klima v Praze teplejší než okolní krajina?",
    correctAnswer: "Beton a asfalt ukládají teplo, průmysl a doprava produkují teplo — 'tepelný ostrov'",
    options: ["Beton a asfalt ukládají teplo, průmysl a doprava produkují teplo — 'tepelný ostrov'", "Praha leží podstatně jižněji než celá okolní krajina", "Praha má nad sebou trvale méně oblačnosti než okolí", "Praha leží hluboko v nížině, daleko od hor"],
    hints: ["Velká města jsou teplejší než vesnice — proč?"],
    solutionSteps: ["Velká města tvoří 'tepelný ostrov' — beton absorbuje teplo, výfukové plyny a průmysl ho produkují."],
  },
  {
    question: "Co znamená, že ČR má kontinentální klima na rozdíl od přímořského?",
    correctAnswer: "Větší teplotní rozdíly mezi létem a zimou, méně srážek než u moře",
    options: ["ČR má teplejší zimy než přímořské oblasti", "Větší teplotní rozdíly mezi létem a zimou, méně srážek než u moře", "ČR má více srážek než přímořské oblasti", "Kontinentální klima znamená tropická léta"],
    hints: ["Moře vyrovnává teploty — bez moře jsou větší výkyvy."],
    solutionSteps: ["Kontinentální klima = větší rozdíl léto/zima (teplá léta, studené zimy), méně srážek než u oceánu."],
  },
  {
    question: "Co je to ozónová vrstva a proč je důležitá?",
    correctAnswer: "Vrstva v atmosféře chránící Zemi před UV zářením Slunce",
    options: ["Vrstva vzduchu blízko zemského povrchu", "Část atmosféry s nejvíce kyslíku", "Vrstva v atmosféře chránící Zemi před UV zářením Slunce", "Vrstva způsobující skleníkový efekt"],
    hints: ["Bez ní by bylo na Zemi nebezpečné sluneční záření."],
    solutionSteps: ["Ozónová vrstva pohlcuje škodlivé UV záření Slunce a chrání tak živé organismy na Zemi."],
  },
  {
    question: "Jak se mění teplota v průběhu roku v mírném pásmu?",
    correctAnswer: "Nejtepleji v červenci, nejchladněji v lednu; 4 odlišná roční období",
    options: ["Teplota je po celý rok stejná", "Nejtepleji v září, nejchladněji v březnu", "Mírné pásmo nemá zimní období", "Nejtepleji v červenci, nejchladněji v lednu; 4 odlišná roční období"],
    hints: ["Mírné pásmo prochází čtyřmi zřetelně odlišnými obdobími roku."],
    solutionSteps: ["V mírném pásmu je nejtepleji v červenci, nejchladněji v lednu — 4 výrazná roční období."],
  },
  {
    question: "Co způsobuje kyselé deště a jak škodí?",
    correctAnswer: "Průmyslové emise SO2 a NOx, které poškozují lesy, půdu a vodní toky",
    options: ["Průmyslové emise SO2 a NOx, které poškozují lesy, půdu a vodní toky", "Přirozená kyselost obyčejné dešťové vody", "Radioaktivní záření unikající z elektráren", "Vodní pára stoupající z teplých oceánů"],
    hints: ["Kyselé deště jsou způsobeny spalováním fosilních paliv."],
    solutionSteps: ["Kyselé deště vznikají z průmyslových emisí (SO2, NOx), které se ve vodě mění na kyseliny — ničí lesy a ekosystémy."],
  },
  {
    question: "Proč jsou Krkonoše a Šumava nejsrážkovějšími oblastmi ČR?",
    correctAnswer: "Leží na návětrné straně a vlhký vzduch stoupající po svazích se ochlazuje a prší",
    options: ["Jsou to nejchladnější oblasti ČR", "Leží na návětrné straně a vlhký vzduch stoupající po svazích se ochlazuje a prší", "Leží u hranice s Polskem", "V horách je více oblačnosti kvůli nadmořské výšce"],
    hints: ["Vzduch nesoucí vlhkost stoupá po svahu hor — co se stane, když se ochlazuje?"],
    solutionSteps: ["Vlhký vzduch stoupá po svahu hor, ochlazuje se a vydešťuje — proto jsou hory srážkově nejbohatší."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, Math.min(pool.length, 35));
}

export const PODNEBICROVZDUSIPOCASI: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-podnebi-cr-ovzdusi-pocasi",
    rvpNodeId: "g4-vlastiveda-misto-kde-zijeme-ceska-republika-podnebi-cr-ovzdusi-pocasi",
    title: "Podnebí ČR, ovzduší, počasí",
    studentTitle: "Podnebí ČR",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Místo, kde žijeme",
    briefDescription: "Pochopíš rozdíl mezi počasím a podnebím a dozvíš se o klimatu ČR.",
    keywords: ["podnebí", "počasí", "klima", "srážky", "teplota", "smog", "Krkonoše", "jižní Morava"],
    goals: [
      "Rozlišit počasí a podnebí (klima)",
      "Popsat charakteristiky mírného kontinentálního klimatu ČR",
      "Vyjmenovat nejteplejší a nejchladnější oblasti ČR",
      "Vysvětlit základy znečištění ovzduší",
    ],
    boundaries: ["Meteorologické rovnice a čísla nejsou cílem", "Atmosférická fyzika do hloubky není požadována"],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Podnebí = průměr počasí za mnoho let. ČR = mírné kontinentální klima. Nejteplejší = jižní Morava. Nejchladnější = Krkonoše, Šumava.",
      steps: [
        "Rozhodni, ptá-li se otázka na klima nebo aktuální počasí",
        "Vzpomeň si na mapu ČR — kde je teplo a kde chlad",
        "Myšlenka: blíže k jihu = tepleji, výše = chladněji",
      ],
      commonMistake: "Žáci si pletou počasí (aktuální) a klima (dlouhodobý průměr).",
      example: "Dnes v Brně 25°C = počasí. Brno má průměrně 500 mm srážek ročně = klima.",
    },
  },
];
