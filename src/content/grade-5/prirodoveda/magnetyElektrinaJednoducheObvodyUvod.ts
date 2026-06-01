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
  { question: "Co se stane, když k sobě přiblížíme dva stejné póly magnetu?", correctAnswer: "Odpuzují se", options: ["Odpuzují se", "Přitahují se", "Nic se nestane", "Jeden z magnetů ztratí magnetismus"], hints: ["Stejné póly se odpuzují, různé přitahují."] },
  { question: "Kolik pólů má magnet?", correctAnswer: "Dva – severní – S a jižní – J", options: ["Dva – severní (S) a jižní (J)", "Jeden – jen severní", "Čtyři – dva severní a dva jižní", "Žádný – magnetismus se projeví až stykem"], hints: ["Každý magnet má severní i jižní pól."] },
  { question: "Co jsou vodiče elektřiny?", correctAnswer: "Látky, které dobře vedou elektrický proud – kovy: měď, hliník", options: ["Látky, které dobře vedou elektrický proud (kovy: měď, hliník)", "Látky, které elektrický proud nepropustí", "Látky, ve kterých vzniká elektřina třením", "Jakékoli kovové předměty bez výjimky"], hints: ["Elektrické vedení je z mědi nebo hliníku."] },
  { question: "Co jsou izolanty?", correctAnswer: "Látky, které nevedou elektrický proud – plast, guma, dřevo", options: ["Látky, které nevedou elektrický proud (plast, guma, dřevo)", "Látky, které vedou proud lépe než kovy", "Látky, ve kterých se tvoří statická elektřina", "Vrstvy uvnitř elektrického kabelu"], hints: ["Izolanty chrání před úrazem elektrickým proudem."] },
  { question: "Co tvoří jednoduchý elektrický obvod?", correctAnswer: "Zdroj – baterie + vodič + spotřebič – žárovka, motor", options: ["Zdroj (baterie) + vodič + spotřebič (žárovka, motor)", "Pouze baterie a žárovka bez vodičů", "Generátor + vzduch + spotřebič", "Zdroj + izolanty + spotřebič"], hints: ["Obvod musí být uzavřený – musí elektrický proud nepřetržitě téct."] },
  { question: "Co je statická elektřina?", correctAnswer: "Elektrický náboj vzniklý třením dvou předmětů – balónek + vlasy", options: ["Elektrický náboj vzniklý třením dvou předmětů (balónek + vlasy)", "Elektřina ze statické baterie bez pohybu", "Elektřina, která nepohání žádný spotřebič", "Elektřina z elektrárny po síti"], hints: ["Blesk je příkladem výboje statické elektřiny."] },
  { question: "Co je to zkrat (krátký spoj)?", correctAnswer: "Obvod bez spotřebiče – proud teče přímo z + na −, přehřívá vodiče", options: ["Obvod bez spotřebiče – proud teče přímo z + na −, přehřívá vodiče", "Přerušení elektrického obvodu", "Příliš mnoho spotřebičů v jednom obvodu", "Stav, kdy baterie je vybitá"], hints: ["Zkrat může způsobit požár – proto máme pojistky."] },
  { question: "Co je elektromagnet?", correctAnswer: "Magnet vytvořený elektrickým proudem procházejícím cívkou s jádrem", options: ["Magnet vytvořený elektrickým proudem procházejícím cívkou s jádrem", "Přírodní magnet z magnetovce", "Trvalý magnet vyrobený z oceli", "Baterie s magnetickými vlastnostmi"], hints: ["Elektromagnet lze zapnout a vypnout přerušením proudu."] },
  { question: "Proč má Země magnetické pole?", correctAnswer: "Pohybující se tekuté železo v zemském jádru vytváří přirozený elektromagnet", options: ["Pohybující se tekuté železo v zemském jádru vytváří přirozený elektromagnet", "Země je obrovský trvalý magnet ze žuly", "Sluneční vítr nabíjí zemský povrch magneticky", "Magnetické pole způsobuje Měsíc svým pohybem"], hints: ["Kompas ukazuje na magnetický severní pól Země."] },
  { question: "Co chrání elektrické obvody před zkratem?", correctAnswer: "Pojistky nebo jističe – přeruší obvod při nebezpečném proudu", options: ["Pojistky nebo jističe – přeruší obvod při nebezpečném proudu", "Izolanty obalující vodiče", "Transformátory snižující napětí", "Elektromagnety odpojující baterii"], hints: ["Pojistky jsou v každé domácnosti v elektrickém rozvaděči."] },
  { question: "Které materiály přitahuje magnet?", correctAnswer: "Železo, ocel, nikl a kobalt – feromagnetické kovy", options: ["Železo, ocel, nikl a kobalt (feromagnetické kovy)", "Všechny kovy bez výjimky", "Pouze zlato a stříbro", "Kovy i dřevo, pokud jsou suché"], hints: ["Měď a hliník magnet nepřitahuje."] },
  { question: "Co je kompas a jak funguje?", correctAnswer: "Přístroj s magnetickou střelkou ukazující na magnetický severní pól Země", options: ["Přístroj s magnetickou střelkou ukazující na magnetický severní pól Země", "Přístroj měřící elektrický proud v obvodu", "Přístroj měřící sílu magnetického pole magnetu", "Přístroj pro orientaci podle hvězd"], hints: ["Kompas funguje díky zemskému magnetickému poli."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Proč se různé póly magnetů přitahují a stejné odpuzují?", correctAnswer: "Magnetické pole teče od severního k jižnímu pólu – různé póly se doplňují – pole se spojí, stejné póly vytváří odpor – pole se střetnou", options: ["Magnetické pole teče od severního k jižnímu pólu – různé póly se doplňují (pole se spojí), stejné póly vytváří odpor (pole se střetnou)", "Je to náhoda – záleží na materiálu magnetu", "Stejné póly se přitahují, různé odpuzují – záleží na orientaci", "Magnety se přitahují jen kovové, plastové se odpuzují vždy"], hints: ["Magnetické siločáry vycházejí ze severního pólu a vstupují do jižního."] },
  { question: "Jak se liší sériové a paralelní zapojení spotřebičů v obvodu?", correctAnswer: "Sériové: spotřebiče za sebou – přerušení jednoho přeruší celý obvod. Paralelní: spotřebiče vedle sebe – každý má vlastní cestu a funguje nezávisle.", options: ["Sériové: spotřebiče za sebou – přerušení jednoho přeruší celý obvod. Paralelní: spotřebiče vedle sebe – každý má vlastní cestu a funguje nezávisle.", "Sériové = více větví, paralelní = jedna větev", "V sériovém zapojení žárovky svítí jasněji", "Paralelní zapojení vyžaduje silnější baterii"], hints: ["Vánoční řetězy: sériové (přeruší se celý) vs. paralelní (přeruší se jen jedna větev)."] },
  { question: "Co je to elektrický odpor a jak ovlivňuje obvod?", correctAnswer: "Odpor – v ohmech omezuje průtok proudu. Větší odpor = méně proudu při stejném napětí – zákon: U = R × I", options: ["Odpor (v ohmech) omezuje průtok proudu. Větší odpor = méně proudu při stejném napětí (zákon: U = R × I)", "Odpor zesiluje elektrický proud v obvodu", "Odpor přerušuje obvod při přetížení jako pojistka", "Odpor je míra toho, kolik elektřiny spotřebič spotřebuje za hodinu"], hints: ["Ohm (Ω) je jednotka elektrického odporu."] },
  { question: "Proč je bezpečné dotknout se plastové části kabelu, ale nebezpečné holé kovové části?", correctAnswer: "Plast je izolátor – neprochází jím proud. Kov je vodič – elektrický proud projde do těla a může způsobit úraz", options: ["Plast je izolátor – neprochází jím proud. Kov je vodič – elektrický proud projde do těla a může způsobit úraz", "Kov je studenější, proto je nebezpečný, plast je teplejší a bezpečnější", "Nebezpečné je pouze napětí vyšší než 1 000 V – domácí napětí je bezpečné", "Holé kovové části jsou nebezpečné jen při mokrých rukou"], hints: ["Lidské tělo vede elektřinu – proto jsme při kontaktu s živým vodičem v ohrožení."] },
  { question: "Jak pracuje elektromagnet v jeřábu šrotovniště?", correctAnswer: "Elektrickým proudem se cívka s kovovým jádrem stane magnetem – přitáhne železo. Vypnutím proudu magnet ztratí sílu a uvolní náklad.", options: ["Elektrickým proudem se cívka s kovovým jádrem stane magnetem – přitáhne železo. Vypnutím proudu magnet ztratí sílu a uvolní náklad.", "Trvalý magnet s vypínačem přitahuje veškerý kov v okolí", "Jeřáb používá vakuové přísavky, ne magnety", "Elektromagnet přitahuje i plast a hliník díky vysokému napětí"], hints: ["Výhoda elektromagnetu: lze zapnout a vypnout. Trvalý magnet nelze."] },
  { question: "Co způsobuje blesk a jak je příbuzný se statickou elektřinou?", correctAnswer: "V bouřkovém oblaku třením vzduchových proudů vzniká statická elektřina. Při dostatečném napětí se výboj probije vzduchem jako blesk.", options: ["V bouřkovém oblaku třením vzduchových proudů vzniká statická elektřina. Při dostatečném napětí se výboj probije vzduchem jako blesk.", "Blesk je elektrický proud tekoucí mezi mraky a Sluncem", "Blesk vzniká chemickou reakcí vody a dusíku v oblacích", "Blesk je způsoben magnetickým polem Země, které narušuje mraky"], hints: ["Hromosvod odvádí výboj bezpečně do země."] },
  { question: "Proč hromosvod chrání budovu před bleskem?", correctAnswer: "Hromosvod – kovová tyč na střeše + vodič do země nabídne blesku cestu s nejmenším odporem – proud odteče do Země mimo budovu", options: ["Hromosvod (kovová tyč na střeše + vodič do země) nabídne blesku cestu s nejmenším odporem – proud odteče do Země mimo budovu", "Hromosvod odráží blesk zpět do mraku", "Hromosvod rozptyluje elektrický náboj v okolním vzduchu", "Hromosvod absorbuje energii blesku a přemění ji na teplo"], hints: ["Elektrický proud vždy hledá cestu s nejmenším odporem."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Jak funguje elektrický motor na základní fyzikální principu?", correctAnswer: "Elektrický proud v cívce vytváří magnetické pole. Toto pole reaguje s trvalým magnetem – vzniká síla, která otáčí cívkou – magnetická síla → pohybová energie.", options: ["Elektrický proud v cívce vytváří magnetické pole. Toto pole reaguje s trvalým magnetem – vzniká síla, která otáčí cívkou (magnetická síla → pohybová energie).", "Motor přeměňuje elektřinu na teplo, teplo pohybuje písty.", "Cívka v magnetu přitahuje části motoru střídavě k severnímu a jižnímu pólu.", "Motor funguje na principu statické elektřiny akumulované v cívce."], hints: ["Ampéreův zákon: proud + magnetické pole → síla."] },
  { question: "Co je elektromagnetická indukce a kde se používá?", correctAnswer: "Pohyb vodiče v magnetickém poli nebo změna pole v okolí vodiče vytváří elektrický proud. Základ pro generátory, dynamonky a transformátory.", options: ["Pohyb vodiče v magnetickém poli nebo změna pole v okolí vodiče vytváří elektrický proud. Základ pro generátory, dynamonky a transformátory.", "Indukce je vedení elektřiny přes vzduch bez vodiče.", "Elektromagnetická indukce popisuje, jak magnet přitahuje kov.", "Indukce probíhá jen v supravodičích při nízkých teplotách."], hints: ["Faradayův zákon indukce – základ pro výrobu elektřiny v elektrárnách."] },
  { question: "Proč se kolem vodičů s proudem vytváří magnetické pole?", correctAnswer: "Pohybující se elektrony – elektrický proud vytváří magnetické pole – elektřina a magnetismus jsou dvě stránky téhož jevu – elektromagnetismus.", options: ["Pohybující se elektrony (elektrický proud) vytváří magnetické pole – elektřina a magnetismus jsou dvě stránky téhož jevu (elektromagnetismus).", "Magnetické pole vzniká v každém kovu, proud ho jen zesiluje.", "Elektrony v pohybu produkují teplo, které magnetizuje okolní materiál.", "Magnetické pole kolem vodiče vytváří napětí, ne proud."], hints: ["Ørsted v roce 1820 objevil, že proud otáčí kompasovou střelkou."] },
  { question: "Proč se Země chová jako obrovský magnet a co to znamená pro orientaci na souši?", correctAnswer: "Tekuté železo v zemském vnějším jádru se pohybuje a vytváří elektrické proudy → magnetické pole. Kompas ukazuje na magnetický severní pól, který není totožný s geografickým severem.", options: ["Tekuté železo v zemském vnějším jádru se pohybuje a vytváří elektrické proudy → magnetické pole. Kompas ukazuje na magnetický severní pól, který není totožný s geografickým severem.", "Zemský magnetický pól je na geografickém severu a kompas ho přesně ukazuje.", "Magnetické pole Země vzniká třením tektotionických desek o sebe.", "Kompas reaguje na gravitaci Měsíce, ne na zemský magnetismus."], hints: ["Magnetická deklinace = úhel mezi magnetickým a geografickým severem."] },
  { question: "Proč musíme bezpečně zacházet s elektřinou v domácnosti?", correctAnswer: "Domácí elektřina – 230 V je dostatečná k tomu, aby způsobila srdeční zástavu. Tělo vede proud – kontakt s živým vodičem je smrtelně nebezpečný.", options: ["Domácí elektřina (230 V) je dostatečná k tomu, aby způsobila srdeční zástavu. Tělo vede proud – kontakt s živým vodičem je smrtelně nebezpečný.", "Domácí elektřina je bezpečná – nebezpečné je jen napětí nad 10 000 V.", "Nebezpečné je jen střídavé napětí – baterie (stejnosměrné) jsou vždy bezpečné.", "Tělo nepropouští elektrický proud – nebezpečné jsou jen tepelné efekty."], hints: ["Již 50 mA procházejícím přes srdce může způsobit smrt."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const MAGNETYELEKTRINAJEDNODUCHEOBVODYUVOD: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-energie-a-jeji-zdroje-magnety-elektrina-jednoduche-obvody-uvod",
    title: "Magnety, elektřina - jednoduché obvody (úvod)",
    studentTitle: "Magnety a elektřina",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Energie a její zdroje",
    briefDescription: "Poznáš, jak fungují magnety a jak sestavit jednoduchý elektrický obvod.",
    keywords: ["magnet", "elektřina", "obvod", "vodič", "izolant", "póly", "statická elektřina", "elektromagnet"],
    goals: ["Popsat vlastnosti magnetů a magnetické pole", "Vysvětlit, co je vodič a izolant", "Sestavit jednoduchý elektrický obvod"],
    boundaries: ["Neprobírá Ohmův zákon matematicky", "Neprobírá střídavý proud"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Magnet: S a J pól – stejné odpuzují, různé přitahují. Obvod: zdroj + vodič + spotřebič.",
      steps: [
        "1. Magnet: S a J pól. Stejné = odpuzují. Různé = přitahují.",
        "2. Vodiče: kovy (měď, hliník). Izolanty: plast, guma.",
        "3. Jednoduchý obvod: baterie + vodič + žárovka (uzavřený okruh).",
        "4. Zkrat: obvod bez spotřebiče → nebezpečí přehřátí.",
      ],
      commonMistake: "Obvod musí být UZAVŘENÝ – přerušený obvod nefunguje.",
      example: "Baterie (1,5 V) → vodič (měď) → žárovka → zpět do baterie = svítí.",
    },
  },
];
