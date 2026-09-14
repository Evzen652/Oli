/**
 * Dějepis 6. ročník — Doba bronzová a železná, počátky civilizace (categorize).
 *
 * Žák třídí karty do tří košů: doba kamenná / bronzová / železná. Navazuje na
 * `dobaKamennaPeriodizace` (pořadí fází), tady ale nejde o pořadí, nýbrž o ZNAKY
 * doby a jejich důsledky.
 *
 *  • L1 zapamatování — předmět; materiál je většinou nutné poznat z popisu
 *    (slitina mědi a cínu, odlitek, kování, ruda), slovo z názvu koše nese
 *    nanejvýš jedna karta v koši.
 *  • L2 použití — činnost nebo technologie; žák převádí postup → materiál → dobu.
 *  • L3 analýza — společenský či hospodářský důsledek (vzácný cín, poklad
 *    drahého kovu, levná ruda, oppidum, mince), bez slov kámen/kost/kov jako klíče.
 *
 * Zadání všech úrovní se ptá, kdy se věc objevila POPRVÉ (je pro dobu typická) —
 * kostěná jehla nebo lití bronzu přetrvaly i do mladších dob.
 *
 * Koš „Doba kamenná" je nutný: nejčastější chyba je dát neolitický vynález
 * (keramika, zemědělství, broušení) do doby kovů.
 *
 * NIC SE NELOSUJE. Každý koš má na úrovni banku osmi karet = čtyři pevné dvojice.
 * Úloha i (0–15) bere kamennou dvojici a = i % 4, bronzovou b = ⌊i / 4⌋ a
 * železnou c = (a + b) % 4. Dvojice (a, b) je pro každé i jiná, takže vzniká
 * 16 různých úloh na úroveň. Karty míchá až UI (`CategorizeInput`).
 *
 * Nápovědy neobsahují text karet ani název koše. Malá nápověda skládá vodítka
 * dvojic K[a] + B[b]; velká pravidlo úrovně + vodítko Z[c] + DOPLŇUJÍCÍ vodítko
 * bronzové dvojice B2[b] (jiná věta než v malé nápovědě). Dvojice (b, c) určuje
 * úlohu jednoznačně, takže obě nápovědy jsou pro úlohu unikátní.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildCategorizeTask as cat } from "./_shared";

const K = "Doba kamenná";
const B = "Doba bronzová";
const Z = "Doba železná";
const KOSE = [K, B, Z] as const;
type Kos = (typeof KOSE)[number];

/** [text karty, proč patří do koše] */
type Karta = [string, string];

interface Uroven {
  zadani: string;
  pravidlo: string;
  /** Typická chyba dané úrovně — jde do vysvětlení. */
  omyl: string;
  karty: Record<Kos, Karta[]>;
  /** Jedno vodítko na dvojici karet (index dvojice 0–3). Nejmenuje kartu ani koš. */
  vodítka: Record<Kos, string[]>;
  /** Doplňující vodítko bronzové dvojice pro velkou nápovědu (jiné než vodítka[B]). */
  vodítkaB2: string[];
}

const DATACE =
  "Doba bronzová trvala u nás asi od 2000 do 800 př. n. l., doba železná asi od 800 př. n. l. do přelomu letopočtu. Už kolem roku 3000 př. n. l., tedy dřív, než k nám dorazil bronz, vznikly v Mezopotámii a Egyptě první města, písmo a státy.";

const UROVNE: Record<number, Uroven> = {
  1: {
    zadani: "Ve které době se takový předmět objevil poprvé? Roztřiď je.",
    pravidlo:
      "Rozhoduje materiál, ze kterého se věc vyráběla. Kámen a kost lidé jen štípali, brousili a vrtali. Bronz (slitina mědi a cínu) se taví při nižší teplotě než železo, proto se dal lít do forem. Získat železo z rudy bylo náročnější (potřeba vyšší žár a zvláštní pec), proto přišlo nejpozději; hotové železo se pak kovalo.",
    omyl:
      "Pozor na záměnu bronzu a železa: bronz není čistý kov, ale slitina mědi a cínu, a je starší než železo. Kamenná licí forma je nástroj kovolitce, ne kamenný nástroj.",
    karty: {
      [K]: [
        ["Pazourkový hrot šípu", "pazourek se štípal, kov k tomu nebyl potřeba"],
        ["Broušená sekera z tvrdé horniny", "broušení horniny je vynález mladší doby kamenné, tedy neolitu"],
        ["Kostěná jehla", "kost lidé opracovávali dávno před objevem kovů"],
        ["Zrnotěrka na drcení obilí", "první zemědělci drtili obilí mezi dvěma kameny"],
        ["Pěstní klín ze štípaného pazourku", "jeden z nejstarších nástrojů vůbec"],
        ["Vrtaný mlat z tvrdé horniny", "vrtání kamene zvládli už neolitičtí zemědělci"],
        ["Kostěná harpuna na ryby", "rybáři a lovci používali hroty z kosti"],
        ["Srp s pazourkovými čepelemi", "první srpy měly ostří z pazourku"],
      ],
      [B]: [
        ["Sekerka ze slitiny mědi a cínu", "slitina mědi a cínu je bronz"],
        ["Lesklý zlatavý náramek odlitý ve formě", "šperky se odlévaly z bronzu, který se zlatavě leskne"],
        ["Meč odlitý do dvoudílné formy", "meč z bronzu se odlil do formy"],
        ["Bronzová jehlice na spínání oděvu", "jehlice z bronzu spínaly oděv místo spony"],
        ["Kamenná licí forma na sekerky", "do formy se lil roztavený bronz, kámen tu je jen nástroj kovolitce"],
        ["Hliněná licí forma na náramky", "licí formy patří k odlévání bronzu"],
        ["Dýka ze slitiny mědi a cínu", "měď a cín dohromady dávají bronz"],
        ["Srp odlitý z mědi a cínu", "i zemědělské nástroje se odlévaly z bronzu"],
      ],
      [Z]: [
        ["Kovaná radlice", "radlice ze železa se kovala v kovárně"],
        ["Kovaný meč z levného kovu", "železo bylo dostupnější než bronz, a když ho kovář nauhličil, bylo i tvrdší"],
        ["Keltská zlatá mince (duhovka)", "mince razili Keltové v době železné"],
        ["Hřeby do hradeb keltského oppida", "hradby oppid zpevňovaly železné hřeby a oppida stavěli Keltové v době železné"],
        ["Železná sekera", "železné nástroje se rozšířily, když zlevnily"],
        ["Keltská stříbrná mince", "Keltové u nás žili v mladší době železné"],
        ["Srp z kovu, jehož ruda je skoro všude", "železná ruda je hojná, proto byl srp ze železa levnější než bronzový"],
        ["Nůž z kovu získaného z rudy v dýmačce", "v dýmačce se z rudy získávalo železo, ze kterého kovář vykoval nůž"],
      ],
    },
    vodítka: {
      [K]: [
        "Který předmět vznikl jen štípáním nebo broušením kamene, bez jakéhokoli kovu?",
        "Najdi věci, které vznikly bez ohně a bez tavení čehokoli.",
        "Který materiál stačilo najít v přírodě a otlouct, aniž by se tavil?",
        "U čeho vůbec nebyl potřeba kov, ani odlitý, ani kovaný?",
      ],
      [B]: [
        "Který kov nevznikne sám, ale musí se smíchat ze dvou surovin?",
        "Kterou věc bylo možné vyrobit litím, tedy nalitím tekutého kovu do tvaru?",
        "Co by kovolitec potřeboval, aby mohl stejný tvar odlít mnohokrát?",
        "Který kov se dal snadno roztavit a lidé ho znali dřív?",
      ],
      [Z]: [
        "Který kov se nedal jen tak odlít a musel se rozžhavit a tlouct?",
        "Z jakého kovu byly nástroje lidí, kteří už razili mince a stavěli velká opevněná sídla?",
        "Který kov byl levnější a dostupnější a přišel až nakonec?",
        "Který kov se z rudy získával obtížněji, a proto přišel nejpozději?",
      ],
    },
    vodítkaB2: [
      "Lesk a barva napoví: měď smíchaná s cínem dává zlatavou slitinu.",
      "Tvar vzniklý ve formě znamená, že kov byl předtím tekutý. Který kov se tak zpracovával?",
      "Forma sama není pracovní nástroj, ale pomůcka k výrobě kovových věcí. Kterých?",
      "Když znáš obě suroviny, znáš i výsledný kov.",
    ],
  },

  2: {
    zadani: "Ve které době lidé poprvé takto pracovali? Přiřaď činnosti.",
    pravidlo:
      "Postupuj ve dvou krocích: nejdřív urči, s jakým materiálem činnost pracuje, a teprve pak, ve které době se ten materiál poprvé zpracovával. Štípání, broušení a vypalování hlíny zvládli lidé bez kovu. Slitina mědi a cínu, která se lije do formy, je bronz. Kov, který se získává z rudy v dýmačce a pak se kove, je železo.",
    omyl:
      "Pozor: keramiku, zemědělství a broušení vymysleli už lidé mladší doby kamenné (neolitu), doba kovů na ně jen navázala. Hrnčířský kruh a ražbu mincí naopak přinesli až Keltové v době železné.",
    karty: {
      [K]: [
        ["Štípání pazourku na ostré čepele", "štípaný kámen je nejstarší technologie"],
        ["Broušení a vrtání kamene", "broušené nástroje jsou vynález neolitu"],
        ["První obdělávání polí motykou", "zemědělství vzniklo v mladší době kamenné"],
        ["Vypalování hliněných nádob v ohni", "keramiku vypalovali už neolitičtí zemědělci"],
        ["Drcení obilí na kamenném mlýnku", "první zemědělci drtili obilí mezi kameny"],
        ["Šití oděvů kostěnou jehlou", "jehly z kosti znali lidé dávno před kovy"],
        ["Lov se šípy s kamennými hroty", "hroty šípů se štípaly z kamene"],
        ["Opracování kosti a parohu na nástroje", "kost a paroh byly materiál před objevem kovů"],
      ],
      [B]: [
        ["Tavení mědi a přidávání cínu", "smícháním mědi a cínu vzniká bronz"],
        ["Lití slitiny mědi a cínu do formy", "bronz se taví snáz než železo, a proto se lil do forem"],
        ["Výměna baltského jantaru za cín a měď", "baltský jantar se už v době bronzové vyměňoval na dálku za suroviny pro bronz"],
        ["Dálkový obchod s cínem", "cín je vzácný, naleziště jsou v Evropě jen na několika místech (např. Krušné hory, Cornwall), proto se s ním obchodovalo na dálku"],
        ["Výroba licích forem z kamene", "do kamenných forem se odléval bronz"],
        ["Odlévání šperků do hliněné formy", "šperky se odlévaly z bronzu"],
        ["Míchání roztavené mědi s cínem v kelímku", "tak vzniká slitina, tedy bronz"],
        ["Leštění a zdobení odlitku rytím", "bronzový odlitek se po vychladnutí leštil a zdobil rytím"],
      ],
      [Z]: [
        ["Kování nástrojů z kovu, který se nedal odlít", "železo se v pravěku neumělo roztavit a odlít, dalo se jen kovat"],
        ["Vykování sekery z kovu z dýmačky", "v dýmačce se z rudy získávala železná houba, kterou kovář vykoval na nástroj"],
        ["Výroba nádob na hrnčířském kruhu", "hrnčířský kruh k nám přinesli Keltové"],
        ["Ražba mincí", "první mince u nás razili Keltové"],
        ["Získávání kovu z rudy v pícce dýmačce", "v dýmačce se železná ruda neroztavila, ale měnila se v železnou houbu, kterou kovář vykoval"],
        ["Placení penězi na trhu v oppidu", "oppida jsou keltská města doby železné"],
        ["Stavba hradeb keltského oppida", "Keltové stavěli opevněná města v době železné"],
        ["Hledání rudy v bažinách, kde je jí dost", "železná ruda je hojná, bahenní rudu našli lidé skoro všude"],
      ],
    },
    vodítka: {
      [K]: [
        "Při které práci se materiál jen otlouká nebo brousí a nic se netaví?",
        "Kterou činnost zvládli první zemědělci, když se usadili?",
        "Ke které práci stačí jen kámen, oheň, hlína nebo dřevo?",
        "Který materiál lidé zpracovávali, když ještě neznali žádný kov?",
      ],
      [B]: [
        "Při které práci vzniká tekutý kov, který ztuhne do tvaru?",
        "Pro který kov se musela jedna ze surovin shánět daleko?",
        "Která činnost potřebuje formu, do níž se něco nalije?",
        "Která práce patří k výrobě slitiny nebo k úpravě hotového odlitku?",
      ],
      [Z]: [
        "Při které práci kov neteče, ale tvaruje se údery?",
        "Kterou novinku přinesli Keltové do řemesel a obchodu?",
        "Který kov se získával z rudy ve zvláštní pícce, a kde se u nás poprvé platilo?",
        "Která surovina je levná a skoro všude, a kdo stavěl první velká opevněná města?",
      ],
    },
    vodítkaB2: [
      "Když se dva kovy smíchají a nalijí, vzniká slitina. Jak se jmenuje?",
      "Surovina, jejíchž nalezišť je v Evropě málo, se musela vozit zdaleka.",
      "Forma z kamene nebo hlíny je jen pomůcka. Kdo ji potřeboval?",
      "Odlitek musí nejdřív vzniknout z tekuté slitiny, teprve pak se leští.",
    ],
  },

  3: {
    zadani: "Pro kterou dobu je situace typická (kdy poprvé nastala)? Roztřiď popisy.",
    pravidlo:
      "Z popisu odvoď, jaká surovina a technologie za situací stojí. Bez tavení a s prvním zemědělstvím jde o dobu kamennou. Vzácná surovina, kterou je nutné shánět zdaleka, a tedy drahý kov, ukazují na bronz. Surovina dostupná skoro všude, kovárny, opevněná města a ražené mince ukazují na železo.",
    omyl:
      "Pozor na obrácenou logiku: železo není starší proto, že je „obyčejné a levné“. Železná ruda je skoro všude, ale zpracovat ji je těžší, proto přišla později. Cín pro bronz byl vzácný, v Evropě má jen několik nalezišť, obchodovalo se s ním na dálku, a proto byl bronz drahý.",
    karty: {
      [K]: [
        ["Lidé se usazují, protože poprvé pěstují obilí.", "zemědělství a usedlý život začaly v mladší době kamenné"],
        ["Rodina si poprvé staví dům, který neopustí, dokud pole dávají úrodu.", "stálé domy postavili až první zemědělci v mladší době kamenné"],
        ["Ostří nástrojů lidé jen štípou nebo brousí, nic neumějí roztavit.", "kdo neumí nic roztavit, nemá kov, jde tedy o dobu kamennou"],
        ["Nikdo ve vsi neumí rozdělat tak velký žár, aby cokoli roztavil.", "bez tavení nejsou kovy, jde o dobu kamennou"],
        ["Pazourek je tak cenný, že se kvůli němu chodí do dolů daleko od osady.", "neolitičtí lidé těžili kvalitní kámen na nástroje"],
        ["Lovci táhnou za stády zvěře a nikde nezůstanou dlouho, pole ještě neznají.", "kočovný lovecký život bez zemědělství patří do starší doby kamenné"],
        ["Aby se zásoby obilí nezkazily, lidé si poprvé vypalují hliněné zásobnice.", "keramika vznikla u prvních zemědělců v neolitu"],
        ["Sekeru z tvrdé horniny lidé brousí a provrtají, aby na ni nasadili topůrko.", "broušené a vrtané kamenné nástroje jsou neolitické"],
      ],
      [B]: [
        ["Kovodělník musí vzácnou surovinu shánět zdaleka, protože jejích nalezišť je málo.", "cín pro bronz je vzácný, naleziště jsou v Evropě jen na několika místech (např. Krušné hory, Cornwall), proto se s ním obchodovalo na dálku"],
        ["Lidé zakopou do země hromadu sekerek a srpů z drahé slitiny, aby o kov nepřišli.", "hromadné poklady bronzových předmětů (depoty) se ukládaly, protože bronz byl drahý"],
        ["Nový kov je krásný a drahý, nástroje z něj si nemůže dovolit každý.", "bronz byl drahý, protože cín byl vzácný a vozil se zdaleka"],
        ["Baltský jantar se na dálku vyměňuje za cín a měď.", "baltský jantar se už v době bronzové vyměňoval na dálku za suroviny pro bronz"],
        ["Kdo ovládá obchod se vzácným cínem, ten bohatne a vládne okolí.", "bez cínu nebyl bronz, kdo obchod s ním ovládal, zbohatl"],
        ["Každou sekerku lze odlít znovu, stačí mít licí formu.", "bronz se lil do forem, jedna forma dala mnoho kusů"],
        ["Rozbité kovové předměty se neodhazují, přetaví se a použijí k novému lití.", "bronz byl vzácný, a tak se roztavoval a znovu odléval"],
        ["Kovodělník nemá hotovou slitinu, dokud nesežene obě potřebné suroviny.", "bronz je slitina mědi a cínu, bez obou surovin nevznikne"],
      ],
      [Z]: [
        ["Rudu najde skoro každá vesnice, nástroje z nového kovu proto zlevní a rozšíří se.", "železná ruda je hojná, proto železo zlevnilo"],
        ["Na kopci stojí velké opevněné město, jeho kováři vyrábějí levné nástroje pro celý kraj.", "oppida (Závist, Stradonice, Hrazany) stavěli Keltové v době železné a kováři v nich zpracovávali železo"],
        ["Obchodníci platí raženými mincemi místo výměny zboží.", "ražené mince u nás zavedli Keltové v době železné"],
        ["Kovář je vážený řemeslník, bez jeho kovárny se osada neobejde.", "železo se muselo kovat, kovář byl nepostradatelný"],
        ["Hrnčíř vyrábí mnoho stejných nádob rychle díky hrnčířskému kruhu.", "hrnčířský kruh přinesli Keltové v době železné"],
        ["Sekery a srpy zlevní tak, že je má skoro každá rodina.", "železo z hojné rudy bylo levné, a tak se kovové nástroje rozšířily do všech rodin"],
        ["Zemědělci si mohou dovolit kované radlice a zorají i těžší půdu.", "levné kované nástroje ze železa zlepšily zemědělství"],
        ["Dílny v opevněném městě razí mince pro obchod s dalekými kraji.", "ražba mincí v oppidech patří do doby železné"],
      ],
    },
    vodítka: {
      [K]: [
        "Ve které situaci lidé poprvé mění způsob obživy, a co to říká o jejich nástrojích?",
        "Kde se nic netaví a nástroje se jen upravují údery nebo broušením?",
        "Kde je nejcennější surovinou něco, co se nemusí tavit, nebo kde lidé ještě nepěstují?",
        "Která situace popisuje vynálezy prvních zemědělců?",
      ],
      [B]: [
        "Kde je surovina vzácná a drahá? Na který kov byla potřeba?",
        "Kde je nový kov drahý nebo se za jeho suroviny směňuje na dálku?",
        "Kde bohatne ten, kdo má surovinu, a kde se kov tvaruje nalitím?",
        "Kde se kov znovu taví, nebo kde ke vzniku kovu chybí jedna ze dvou surovin?",
      ],
      [Z]: [
        "Kde je surovina dostupná skoro všude, a kde stojí velké opevněné sídlo s kováři?",
        "Kde se platí mincemi a kde je nepostradatelný řemeslník, který kov buší?",
        "Která novinka zrychlila hrnčířskou práci a proč by nástroje najednou zlevnily?",
        "Kde se kov kove a kde se ve městě razí peníze?",
      ],
    },
    vodítkaB2: [
      "Proč by lidé schovávali kov do země? Jen když je hodně cenný.",
      "Drahý je kov, jehož surovina se vozí zdaleka.",
      "Kdo ovládá vzácnou surovinu, ovládá i výrobu kovu, který se lije do forem.",
      "Kov, který se dá snadno roztavit, lze použít znovu; potřebuje ale dvě suroviny.",
    ],
  },
};

const DVOJIC = 4;

function uloha(level: number, i: number): PracticeTask {
  const u = UROVNE[level];
  const a = i % DVOJIC;
  const b = Math.floor(i / DVOJIC) % DVOJIC;
  const c = (a + b) % DVOJIC;
  const idx: Record<Kos, number> = { [K]: a, [B]: b, [Z]: c };
  const dvojice = (k: Kos): Karta[] => u.karty[k].slice(idx[k] * 2, idx[k] * 2 + 2);

  const malaVodítka = i % 2 === 0 ? [u.vodítka[K][a], u.vodítka[B][b]] : [u.vodítka[B][b], u.vodítka[K][a]];
  const hints = [
    `Nerozhoduj naslepo, u každé karty se nejdřív zeptej, s jakým materiálem souvisí. ${malaVodítka.join(" ")}`,
    `${u.pravidlo} ${u.vodítka[Z][c]} ${u.vodítkaB2[b]}`,
  ];

  const popis = KOSE.flatMap((k) => dvojice(k).map(([t, proc]) => `„${t}“ patří do koše ${k}: ${proc}.`));
  return cat(u.zadani, KOSE.map((k) => ({ name: k, items: dvojice(k).map(([t]) => t) })), {
    hints,
    explanation: `${u.pravidlo} ${popis.join(" ")} ${u.omyl} ${DATACE}`,
  });
}

function gen(level: number): PracticeTask[] {
  return Array.from({ length: DVOJIC * DVOJIC }, (_, i) => uloha(level, i));
}

/** Pro test: banky karet dané úrovně (jen čtení). */
export const _BANKY = (level: number): Record<string, string[]> =>
  Object.fromEntries(KOSE.map((k) => [k, UROVNE[level].karty[k].map(([t]) => t)]));

// ── Topic ────────────────────────────────────────────────────────────────
export const DOBA_BRONZOVA_ZELEZNA: TopicMetadata[] = [
  {
    id: "g6-dej-doba-bronzova-zelezna-6",
    rvpNodeId: "g6-dejepis-pravek-vyvoj-cloveka-doba-bronzova-a-zelezna-pocatky-civilizace",
    displayName: "Doba kamenná, bronzová, nebo železná?",
    title: "Doba bronzová a železná, počátky civilizace",
    studentTitle: "Kámen, bronz, nebo železo?",
    subject: "dejepis",
    category: "Pravěk",
    topic: "Vývoj člověka",
    briefDescription: "Roztřídíš předměty, činnosti a situace do doby kamenné, bronzové a železné.",
    keywords: [
      "doba bronzová", "doba železná", "doba kamenná", "bronz", "slitina", "měď", "cín",
      "železo", "kovárna", "dýmačka", "Keltové", "oppidum", "mince", "jantar", "depot",
    ],
    goals: [
      "Přiřadit předmět ke správné pravěké době podle materiálu.",
      "Odvodit dobu z činnosti nebo technologie (lití, kování, štípání).",
      "Posoudit, pro kterou dobu je situace typická, podle dostupnosti surovin, ceny kovu a sídel.",
    ],
    boundaries: [
      "Tři doby: kamenná, bronzová, železná; doba měděná (eneolit) se nerozlišuje.",
      "Lití mědi do forem v době měděné (eneolitu) se tu neprocvičuje; lití do forem se tu vztahuje k bronzu.",
      "Pořadí fází procvičuje téma Pravěk – časová osa, tady jde o znaky dob.",
      "Bez názvů archeologických kultur a bez letopočtů jako klíče.",
    ],
    gradeRange: [6, 6],
    inputType: "categorize",
    defaultLevel: 1,
    sessionTaskCount: 3,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Dobu poznáš podle materiálu a technologie: kámen a kost se opracovávaly, bronz (slitina mědi a cínu) se lil do forem, železo se získávalo z rudy v dýmačce a kovalo.",
      steps: [
        "Urči, s jakým materiálem karta souvisí (kámen, kost, hlína, bronz, železo).",
        "Když materiál není napsaný, odvoď ho z postupu: lití slitiny = bronz, dýmačka a kování = železo.",
        "U situací se ptej na suroviny: vzácný cín shánějící se zdaleka = bronz, levná ruda všude = železo.",
      ],
      commonMistake: "Dát keramiku, zemědělství nebo broušené nástroje do doby kovů — vznikly už v mladší době kamenné.",
      example: "Pazourkový hrot = doba kamenná. Lití slitiny mědi a cínu do formy = doba bronzová. Oppidum a ražené mince = doba železná.",
    },
  },
];
