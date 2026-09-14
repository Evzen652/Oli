/**
 * Dějepis 6. ročník — Náboženství, vědy a kultura starověkého Východu (categorize).
 *
 * Žák přiřazuje výtvory k civilizaci: Mezopotámie / Egypt / Fénicie a Palestina.
 *  • L1 zapamatování: dva koše, čtyři výtvory a zvyky uvedené jménem z učebnice.
 *  • L2 použití: tři koše, šest věd a náboženských představ bez jména řeky či národa.
 *  • L3 analýza/transfer: tři koše, šest POPISŮ BEZ JMÉNA nebo dnešního dědictví.
 *    V každé úloze dvě klamavé položky: stupňovitá stavba, která není pyramida
 *    (zikkurat s chrámem nahoře), a písmo na kameni, které není hieroglyf.
 *
 * Chybový model (typické záměny, na které položky míří):
 *  – zikkurat × pyramida (obě velké posvátné stavby),
 *  – klínové písmo / abeceda přisouzené Egyptu („staré písmo = hieroglyfy"),
 *  – šedesátková soustava × kalendář s 365 dny,
 *  – víra v jediného Boha přenesená na Egypt nebo Mezopotámii.
 *
 * Indie a Čína sem nepatří (vlastní RVP podtémata). Achnatonův kult Atona se
 * záměrně nepoužívá.
 *
 * Unikátnost: úlohy se skládají DETERMINISTICKY z pevných indexů banky
 * (dvojice položek v každém koši), klíč dedupu = seřazené obsahy košů.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildCategorizeTask as cat } from "./_shared";

const M = "Mezopotámie";
const E = "Egypt";
const F = "Fénicie a Palestina";

/** [text položky, druh stopy (do nápovědy), proč patří do koše (do vysvětlení)] */
type Vytvor = [string, string, string];

// ── L1: ikonické výtvory jménem ──────────────────────────────────────────
const L1: Record<string, Vytvor[]> = {
  [M]: [
    ["Zikkurat", "stavba", "stupňovitá chrámová věž z cihel z říční hlíny"],
    ["Epos o Gilgamešovi", "příběh", "jeden z nejstarších zapsaných příběhů (eposů), psaný na hliněných tabulkách"],
    ["Chammurapiho zákoník", "zákony", "zákony babylonského krále vytesané klínovým písmem"],
    ["Klínové písmo na hliněných tabulkách", "písmo", "znaky vtlačené do hlíny, protože mezi Eufratem a Tigridem byla hlína všude"],
    ["Bůh Marduk", "bohové", "hlavní bůh Babylonu, jeden z mnoha mezopotámských bohů"],
    ["Brána bohyně Ištar v Babylonu", "stavba", "brána z cihel v Babylonu zasvěcená mezopotámské bohyni"],
    ["Knihovna hliněných tabulek v Ninive", "písmo", "asyrská knihovna, knihy byly hliněné tabulky"],
    ["Pečetní válečky s obrázky vtlačenými do hlíny", "hlína", "váleček s vyrytými obrázky se kutálel po vlhké hlíně a otiskl značku majitele, hlína byla hlavní materiál Mezopotámie"],
  ],
  [E]: [
    ["Pyramida", "stavba", "kamenná hrobka faraona"],
    ["Mumifikace", "pohřeb", "Egypťané uchovávali tělo pro posmrtný život"],
    ["Kniha mrtvých", "pohřeb", "svitek s kouzly, který dávali zemřelým do hrobu"],
    ["Hieroglyfy na papyru", "písmo", "obrázkové znaky psané na papyrus z rostliny od Nilu"],
    ["Bůh slunce Re (Ra)", "bohové", "bůh slunce, jeden z nejdůležitějších egyptských bohů"],
    ["Bohyně Isis", "bohové", "egyptská bohyně, manželka Usira"],
    ["Bůh Usir, vládce podsvětí", "bohové", "egyptský bůh, který soudil zemřelé"],
    ["Velká sfinga u pyramid v Gíze", "stavba", "kamenná socha, která hlídá pyramidy faraonů"],
  ],
};

// ── L2: vědy a náboženské představy (bez jména řeky nebo národa v položce) ─
const L2: Record<string, Vytvor[]> = {
  [M]: [
    ["Šedesátková početní soustava", "počítání", "Mezopotámci počítali po šedesáti, protože 60 jde beze zbytku dělit mnoha čísly; odtud máme 60 minut v hodině"],
    ["Znamení zvěrokruhu podle pozorování hvězd", "hvězdy", "kněží v Mezopotámii rozdělili oblohu na znamení zvěrokruhu"],
    ["Dělení kruhu na 360 stupňů", "počítání", "360 je šest šedesátek, takové číslo se hodilo lidem, kteří počítali po šedesáti"],
    ["Zákony, podle kterých soudil král Chammurapi", "zákony", "Chammurapi vládl v Babylonu mezi Eufratem a Tigridem a zákony nechal vytesat klínovým písmem"],
    ["Víra v mnoho bohů v čele s Mardukem", "bohové", "Marduk byl hlavní bůh Babylonu, vedle něj uctívali další bohy"],
    ["Škola písařů, kteří psali klínové písmo", "písmo", "klínové písmo se tlačilo do hlíny, které měla Mezopotámie u řek dost"],
    ["Epos o potopě světa a hrdinovi Gilgamešovi", "příběh", "epos o Gilgamešovi zapsali klínovým písmem na hliněné tabulky v Mezopotámii"],
    ["Záznamy o pohybu Měsíce a planet na hliněných tabulkách", "hvězdy", "babylonští kněží zapisovali pozorování oblohy klínovým písmem do hlíny"],
  ],
  [E]: [
    ["Kalendář s 365 dny", "kalendář", "kalendář s 365 dny vznikl v Egyptě z potřeby předpovědět každoroční záplavy Nilu"],
    ["Vyměřování polí (geometrie)", "pole", "záplavy Nilu smývaly hranice polí, a tak je Egypťané museli pokaždé vyměřit znovu"],
    ["Víra v posmrtný soud před bohem Usirem", "víra", "Egypťané věřili, že každého zemřelého čeká soud před Usirem, bohem podsvětí; proto chystali mumie a hrobky"],
    ["Vážení srdce zemřelého na soudu boha Usira", "pohřeb", "Egypťané věřili, že na soudu před Usirem se srdce zemřelého vážilo proti pírku bohyně Maat"],
    ["Znalost lidského těla z balzamování", "lékařství", "při balzamování mrtvých Egypťané poznávali lidské tělo"],
    ["Psaní na listy z rostliny papyrus", "psací materiál", "papyrus rostl v bažinách u Nilu, a tak Egypťané psali na papyrus, ne do hlíny"],
    ["Víra v mnoho bohů, mezi nimiž vynikal bůh slunce Re", "bohové", "Egypťané uctívali mnoho bohů a bůh slunce Re patřil k nejdůležitějším"],
    ["Předpověď povodně podle východu hvězdy Sírius", "hvězdy", "když vyšel Sírius, začínala povodeň na Nilu"],
  ],
  [F]: [
    ["Hláskové písmo (abeceda) s asi 22 znaky", "písmo", "Féničané psali jeden znak pro jednu hlásku (souhlásku), ne stovky obrázků jako v hieroglyfech"],
    ["Víra v jediného Boha", "víra", "jediného Boha uctívali Hebrejové v Palestině, Egypťané i Mezopotámci měli mnoho bohů"],
    ["Posvátné knihy, které křesťané nazývají Starý zákon", "posvátná kniha", "hebrejskou Bibli sepisovali po staletí Hebrejové (Židé), křesťané ji převzali jako Starý zákon"],
    ["Deset přikázání", "zákony", "podle Bible přinesl Deset přikázání Hebrejům jejich vůdce Mojžíš jako zákony jediného Boha"],
    ["Barvení látek drahým purpurem z mořských plžů", "řemeslo", "purpur vyráběli Féničané na pobřeží moře"],
    ["Písmo, z něhož vznikla řecká a později latinská abeceda", "písmo", "Řekové převzali písmo od fénických obchodníků a přidali znaky pro samohlásky, z řecké abecedy vznikla latinská"],
    ["Pravidlo odpočívat každý sedmý den", "víra", "den odpočinku (sabat) přikazovala Hebrejům jejich víra v jediného Boha"],
    ["Chrám jediného Boha v Jeruzalémě", "víra", "jediného Boha uctívali Hebrejové a Jeruzalém byl jejich hlavní město s chrámem"],
  ],
};

// ── L3: popisy bez jména a dnešní dědictví ───────────────────────────────
const L3_M: Vytvor[] = [
  ["Hodina má 60 minut a minuta 60 sekund.", "čas", "počítání po šedesáti pochází z Mezopotámie"],
  ["Úhloměr dělí celý kruh na 360 stupňů.", "počítání", "360 = šest šedesátek, dědictví mezopotámského počítání"],
  ["Horoskop v časopise pracuje s dvanácti znameními zvěrokruhu.", "hvězdy", "znamení zvěrokruhu popsali mezopotámští kněží"],
  ["Písař tlačil seříznutou rákosovou tyčinkou do vlhké hlíny znaky podobné malým klínkům.", "psací materiál", "znaky jako klínky vtlačené do hlíny jsou klínové písmo"],
  ["Jeden z nejstarších zapsaných příběhů o králi, který marně hledal nesmrtelnost, se dochoval na hliněných tabulkách.", "příběh", "je to Epos o Gilgamešovi a hliněné tabulky jsou psací materiál Mezopotámie"],
];
/** Klamavá stupňovitá stavba: není to pyramida, stopou jsou cihly a chrám nahoře. */
const L3_STAVBA: Vytvor[] = [
  ["Na vrcholu stupňovité věže z nepálených cihel stál chrám boha města.", "stavba", "věž z cihel s chrámem nahoře je zikkurat, ne hrobka jako pyramida"],
  ["Stupňovitá stavba z cihel nebyla hrobem, ale nahoře nesla svatyni boha.", "stavba", "cihly a svatyně nahoře ukazují na zikkurat, pyramida byla kamenná hrobka"],
  ["Věž z cihel ze sušené říční hlíny měla na nejvyšším stupni chrám.", "stavba", "cihly z říční hlíny a chrám nahoře jsou znaky zikkuratu"],
];
/** Klamavé písmo na kameni: není to hieroglyf. [položka, koš] */
const L3_KAMEN: [Vytvor, string][] = [
  [["Na černém kamenném sloupu jsou klínovým písmem vytesány zákony „oko za oko, zub za zub“.", "písmo", "je to kámen, ale písmo je klínové, jde o Chammurapiho zákoník"], M],
  [["Nápis na kamenném sarkofágu krále z přístavu Byblos má znaky, z nichž každý znamená jednu souhlásku, žádný celé slovo.", "písmo", "sarkofág z kamene svádí k Egyptu, ale znak pro jednu souhlásku je fénické hláskové písmo (Byblos byl fénický přístav), hieroglyfů byly stovky"], F],
  [["Na kameni vytesaný nápis používá jen asi 22 znaků, a přesto se jím dá zapsat každé slovo.", "písmo", "asi 22 znaků je fénická abeceda, egyptské hieroglyfy měly stovky znaků"], F],
];
const L3_E: Vytvor[] = [
  ["Kněží čekali, až se na obloze znovu objeví hvězda Sírius, protože pak začínala povodeň.", "hvězdy", "Sírius ohlašoval záplavy Nilu v Egyptě"],
  ["Balzamovači tělo zemřelého vysušili solí a zabalili do plátna.", "pohřeb", "balzamování a mumie patří k egyptské víře v posmrtný život"],
  ["Náš rok s 365 dny má předka v kalendáři zemědělců od velké africké řeky.", "kalendář", "365denní kalendář vznikl v Egyptě podle záplav Nilu"],
  ["Po každé povodni museli úředníci znovu vyměřovat hranice polí.", "pole", "vyměřování polí po záplavách Nilu dalo vzniknout geometrii"],
  ["Slovo papír pochází z názvu rostliny papyrus, ze které se vyráběl psací materiál.", "psací materiál", "papyrus rostl u Nilu v Egyptě"],
  ["Zemřelý musel před soudem dokázat, že jeho srdce není těžší než pírko.", "pohřeb", "Egypťané věřili, že na soudu před Usirem, bohem podsvětí, se srdce zemřelého vážilo proti pírku bohyně Maat"],
  ["Hrobka vládce měla čtyři hladké kamenné stěny sbíhající se do špičky.", "stavba", "kamenná hrobka s hladkými stěnami do špičky je egyptská pyramida, zikkurat byl stupňovitý a z cihel"],
  ["Do hrobu dávali zemřelému malé sošky služebníků, kteří za něj měli pracovat na polích v podsvětí.", "pohřeb", "sošky služebníků (ušebti) patří k egyptské víře v posmrtný život, stejně jako mumie a Kniha mrtvých"],
];
const L3_F: Vytvor[] = [
  ["Obchodníci si zjednodušili psaní: jeden znak znamenal jednu hlásku (souhlásku).", "písmo", "jeden znak pro jednu hlásku je fénické hláskové písmo, hieroglyfů i klínových znaků byly stovky"],
  ["Tento národ jako jediný v okolí nesměl svého Boha zobrazovat sochou ani obrazem.", "víra", "Hebrejové uctívali jediného Boha bez soch, Egypťané i Mezopotámci měli mnoho bohů a jejich sochy"],
  ["Naše abeceda má předka v písmu námořních obchodníků z pobřeží Středozemního moře.", "písmo", "abeceda pochází od fénických obchodníků, od nich ji převzali Řekové"],
  ["Posvátné knihy, které dodnes čtou Židé i křesťané, sepsali po staletí předkové dnešních Židů.", "posvátná kniha", "posvátné knihy (hebrejskou Bibli, křesťané jí říkají Starý zákon) sepsali Hebrejové (Židé)"],
  ["Podle Bible vyvedl vůdce svůj národ z otroctví v Egyptě a přinesl mu od Boha zákony.", "zákony", "příběh se odehrává v Egyptě, ale je hebrejský: Mojžíš vyvedl Hebreje do Palestiny a přinesl jim Desatero"],
  ["Žalmy, písně chválící jediného Boha, se dodnes zpívají v synagogách i kostelech.", "víra", "žalmy složili Hebrejové, kteří jako jediní v okolí uctívali jediného Boha"],
];
/** Položky L3_F bez stopy „písmo“ — do koše k nápisu na kameni, aby se stopa neopakovala. */
const L3_F_BEZ_PISMA = [1, 3, 4, 5];

const ZADANI: Record<number, string> = {
  1: "Rozhodni u čtyř výtvorů a zvyků, jestli pocházejí z Mezopotámie, nebo z Egypta.",
  2: "Roztřiď šest objevů a náboženských představ do tří skupin.",
  3: "Podle popisu nebo dnešní stopy urči, ze které starověké civilizace věc pochází.",
};

/** Všechny dvojice indexů 0..n-1 (i < j) v pevném pořadí. */
function dvojice(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}
const vezmi = (bank: Vytvor[], d: [number, number]): Vytvor[] => [bank[d[0]], bank[d[1]]];

function sestav(level: number, kose: { name: string; items: Vytvor[] }[]): PracticeTask {
  const vse = kose.flatMap((k) => k.items.map((it) => ({ it, g: k.name })));
  const stopy = [...new Set(vse.map((x) => x.it[1]))].sort((a, b) => a.localeCompare(b, "cs"));
  const h0 =
    level === 1
      ? "Nejdřív si ke každé z obou civilizací vybav řeku a hlavní materiál: z čeho stavěli a na co psali."
      : "Nejdřív si ke každé civilizaci vybav řeku nebo moře a hlavní materiál: z čeho stavěli a na co psali.";
  const h1Zaklad =
    "Hledej v popisu stopu: materiál, řeku, způsob psaní, počet bohů. Rozhodují konkrétní podrobnosti, protože psaní nebo hvězdy znala každá civilizace.";
  const h1Stopy = `Stopy v této úloze se týkají těchto oblastí: ${stopy.join(", ")}.`;
  const h1L3 =
    level === 3
      ? " U stupňovité stavby se ptej, jestli je z cihel a co stojí nahoře. U nápisu v kameni rozhoduje druh písma a počet znaků, ne materiál. Příběh se může odehrávat v jedné zemi, a přitom patřit jinému národu."
      : "";
  return cat(
    ZADANI[level],
    kose.map((k) => ({ name: k.name, items: k.items.map((it) => it[0]) })),
    {
      hints: [h0, `${h1Zaklad} ${h1Stopy}${h1L3}`],
      explanation: vse.map((x) => `„${x.it[0].replace(/\.$/, "")}“ patří do skupiny ${x.g}: ${x.it[2]}.`).join(" "),
    },
  );
}

const P8 = dvojice(8); // 28 dvojic
/** Dvojice L3_F bez páru dvou položek o písmu (0 a 2). */
const P6F = dvojice(6).filter(([a, b]) => !(a === 0 && b === 2)); // 14 dvojic

function uloha(level: number, i: number): PracticeTask {
  if (level === 1) {
    return sestav(1, [
      { name: M, items: vezmi(L1[M], P8[(i * 3 + 5) % 28]) },
      { name: E, items: vezmi(L1[E], P8[i % 28]) },
    ]);
  }
  if (level === 2) {
    return sestav(2, [
      { name: M, items: vezmi(L2[M], P8[(i * 3 + 1) % 28]) },
      { name: E, items: vezmi(L2[E], P8[i % 28]) },
      { name: F, items: vezmi(L2[F], P8[(i * 5 + 2) % 28]) },
    ]);
  }
  // L3: v Mezopotámii vždy klamavá stavba, písmo na kameni jednou v M, jindy v F.
  const stavba = L3_STAVBA[i % 3];
  const [kamen, kamenKos] = L3_KAMEN[(i * 2 + 1) % 3];
  const mItems: Vytvor[] = kamenKos === M ? [stavba, kamen] : [stavba, L3_M[(i * 2) % 5]];
  const fItems: Vytvor[] =
    kamenKos === F ? [kamen, L3_F[L3_F_BEZ_PISMA[i % 4]]] : vezmi(L3_F, P6F[(i * 4 + 3) % 14]);
  return sestav(3, [
    { name: M, items: mItems },
    { name: E, items: vezmi(L3_E, P8[i % 28]) },
    { name: F, items: fItems },
  ]);
}

function gen(level: number): PracticeTask[] {
  const out = new Map<string, PracticeTask>();
  for (let i = 0; i < 24; i++) {
    const t = uloha(level, i);
    out.set(t.categories!.map((c) => [...c.items].sort().join("+")).join("|"), t);
  }
  return [...out.values()];
}

// ── Topic ────────────────────────────────────────────────────────────────
export const KULTURA_STAROVEKEHO_VYCHODU: TopicMetadata[] = [
  {
    id: "g6-dej-kultura-staroveky-vychod-6",
    rvpNodeId:
      "g6-dejepis-starovek-nejstarsi-staty-mezopotamie-a-egypt-nabozenstvi-vedy-a-kultura-starovekeho-vychodu",
    displayName: "Náboženství, vědy a kultura starověkého Východu",
    title: "Náboženství, vědy a kultura starověkého Východu",
    studentTitle: "Víra a vynálezy starověkého Východu",
    subject: "dejepis",
    category: "Starověk",
    topic: "Nejstarší státy - Mezopotámie a Egypt",
    briefDescription: "Přiřadíš bohy, stavby, písmo a objevy k civilizacím starověkého Východu.",
    keywords: [
      "starověký Východ", "Mezopotámie", "Egypt", "Fénicie", "Palestina", "Hebrejové",
      "zikkurat", "pyramida", "klínové písmo", "hieroglyfy", "abeceda", "šedesátková soustava",
      "kalendář", "mumifikace", "jediný Bůh", "hebrejská Bible",
    ],
    goals: [
      "Přiřadit náboženský, vědecký nebo kulturní výtvor k civilizaci starověkého Východu.",
      "Rozlišit zikkurat a pyramidu, klínové písmo, hieroglyfy a hláskové písmo.",
      "Poznat v dnešním světě dědictví starověkého Východu (60 minut, 365 dní, abeceda).",
    ],
    boundaries: [
      "Jen Mezopotámie, Egypt a Fénicie s Palestinou; Indie a Čína mají vlastní téma.",
      "Jen nesporná učebnicová fakta, u počtu znaků abecedy stojí „asi“.",
      "Nezahrnuje Achnatonův kult Atona.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Ke každé civilizaci si vybav řeku nebo moře a materiál: Mezopotámie = Eufrat a Tigris, hlína a cihly; Egypt = Nil, kámen a papyrus; Fénicie a Palestina = pobřeží moře; Féničané obchod, purpur a abeceda, Hebrejové víra v jediného Boha.",
      steps: [
        "Najdi v položce stopu: materiál, řeku, způsob psaní, počet bohů nebo číslo.",
        "Rozhodni, ke které civilizaci ta stopa vede.",
        "U stavby se ptej, jestli je to hrobka, nebo chrám; u písma, kolik mělo znaků.",
      ],
      commonMistake: "Dát stupňovitý zikkurat do Egypta, protože vypadá jako pyramida, nebo přisoudit víru v jediného Boha Egyptu.",
      example: "Hodina má 60 minut = počítání po šedesáti z Mezopotámie. Kalendář s 365 dny = Egypt a záplavy Nilu.",
    },
  },
];
