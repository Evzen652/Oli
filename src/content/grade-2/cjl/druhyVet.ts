import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív 8 úloh na úroveň, jedna nápověda,
// žádná zpětná vazba. Teď tři oddělené banky:
// L1 poznat druh věty podle smyslu a znaménka · L2 vybrat větu, která splní
// záměr mluvčího (zeptat se / sdělit / požádat) · L3 přeměnit větu na jiný druh,
// doplnit znaménko a zároveň určit druh, poznat oznamovací větu s tázacím slovem.

type Typ = "O" | "T" | "R";
const NAZEV: Record<Typ, string> = { O: "oznamovací", T: "tázací", R: "rozkazovací" };
const ZNAK: Record<Typ, string> = {
  O: "něco sděluje a končí tečkou",
  T: "ptá se a končí otazníkem",
  R: "přikazuje nebo prosí a končí vykřičníkem",
};
const UCEL: Record<Typ, string> = {
  O: "jen něco sděluje",
  T: "se na něco ptá a čeká odpověď",
  R: "někomu přikazuje nebo ho o něco prosí",
};
const ZNAMENKO: Record<Typ, string> = { O: "tečka", T: "otazník", R: "vykřičník" };
const ZNAMENKO4: Record<Typ, string> = { O: "tečku", T: "otazník", R: "vykřičník" };
const ZNAMENKO7: Record<Typ, string> = { O: "tečkou", T: "otazníkem", R: "vykřičníkem" };
const EMOJI: Record<Typ, string> = { O: "💬", T: "❓", R: "❗" };
const PRAVIDLO = "Oznamovací věta končí tečkou, tázací otazníkem, rozkazovací vykřičníkem.";

type Veta = [string, Typ];
const fb = ([s, t]: Veta): Distractor => ({ value: s, why: `„${s}“ je věta ${NAZEV[t]} — ${ZNAK[t]}.` });
const tri = (d: Veta[]) => d.map(fb) as [Distractor, Distractor, Distractor];

// ── L1: Která věta o … je tázací / oznamovací / rozkazovací? ─────────────────
interface L1Item { o: string; typ: Typ; s: string; proc: string; d: Veta[] }
const L1: L1Item[] = [
  { o: "psovi", typ: "T", s: "Kde je náš pes?", proc: "se ptá, kde pes je", d: [["Pes spí v boudě.", "O"], ["Alíku, pojď ke mně!", "R"], ["Pes má hnědé uši.", "O"]] },
  { o: "škole", typ: "R", s: "Sbal si aktovku!", proc: "přikazuje, co má žák udělat", d: [["Ve škole je dnes veselo.", "O"], ["Kdy začíná vyučování?", "T"], ["Učitelka píše na tabuli.", "O"]] },
  { o: "počasí", typ: "O", s: "Venku sněží.", proc: "sděluje, jaké je počasí", d: [["Bude zítra pršet?", "T"], ["Vezmi si čepici!", "R"], ["Je venku zima?", "T"]] },
  { o: "kočce", typ: "T", s: "Proč kočka mňouká?", proc: "se ptá na důvod", d: [["Kočka pije mléko.", "O"], ["Micko, slez ze stolu!", "R"], ["Nalij Micce mléko!", "R"]] },
  { o: "snídani", typ: "R", s: "Dojez rohlík!", proc: "přikazuje, co má někdo udělat", d: [["Snídáme v kuchyni.", "O"], ["Máš rád kakao?", "T"], ["Rohlík je čerstvý.", "O"]] },
  { o: "lese", typ: "O", s: "V lese roste mnoho hub.", proc: "sděluje, co roste v lese", d: [["Rostou tam hříbky?", "T"], ["Nechoď daleko od cesty!", "R"], ["Kde je tvůj košík?", "T"]] },
  { o: "zahradě", typ: "T", s: "Kdo zalil kytky?", proc: "se ptá, kdo to udělal", d: [["Na zahradě kvetou tulipány.", "O"], ["Zalij rajčata!", "R"], ["Tatínek seká trávu.", "O"]] },
  { o: "hřišti", typ: "R", s: "Hoď mi míč!", proc: "vyzývá kamaráda, co má udělat", d: [["Na hřišti je hodně dětí.", "O"], ["Kdo vyhrál závod?", "T"], ["Pepa skáče přes švihadlo.", "O"]] },
  { o: "obchodě", typ: "O", s: "V obchodě prodávají ovoce.", proc: "sděluje, co se v obchodě prodává", d: [["Kolik stojí jablka?", "T"], ["Kup chleba!", "R"], ["Máte čerstvé rohlíky?", "T"]] },
  { o: "výletě", typ: "T", s: "Kam pojedeme na výlet?", proc: "se ptá, kam se pojede", d: [["Jedeme vlakem k babičce.", "O"], ["Nezapomeň svačinu!", "R"], ["Svítí sluníčko.", "O"]] },
  { o: "knížce", typ: "R", s: "Přečti mi pohádku!", proc: "prosí, aby někdo něco udělal", d: [["Kniha leží na stole.", "O"], ["Čí je ta kniha?", "T"], ["Pohádka má šťastný konec.", "O"]] },
  { o: "zimě", typ: "O", s: "V zimě se brzy stmívá.", proc: "sděluje, co se v zimě děje", d: [["Postavíme sněhuláka?", "T"], ["Obleč si rukavice!", "R"], ["Kdy napadne sníh?", "T"]] },
  { o: "ptácích", typ: "T", s: "Proč ptáci odlétají na jih?", proc: "se ptá na důvod", d: [["Vlaštovky odlétají na podzim.", "O"], ["Nasyp ptáčkům zrní!", "R"], ["Sýkorka zpívá na stromě.", "O"]] },
  { o: "koupání", typ: "R", s: "Pojď do vody!", proc: "vyzývá, co má někdo udělat", d: [["Voda je teplá.", "O"], ["Umíš plavat?", "T"], ["Děti se cákají v bazénu.", "O"]] },
  { o: "oslavě", typ: "O", s: "Dnes mám narozeniny.", proc: "sděluje, co se dnes slaví", d: [["Kolik je ti let?", "T"], ["Sfoukni svíčky!", "R"], ["Kdo přinesl dort?", "T"]] },
];

function l1(x: L1Item): PracticeTask {
  return {
    ...choice(`Která věta o ${x.o} je ${NAZEV[x.typ]}?`, x.s, tri(x.d), {
      hints: [
        `Věta ${NAZEV[x.typ]} ${UCEL[x.typ]}. Která z vět o ${x.o} to dělá?`,
        `Projdi každou větu o ${x.o} a zeptej se: sděluje, ptá se, nebo přikazuje? Pak zkontroluj znaménko na konci — věta ${NAZEV[x.typ]} končí ${ZNAMENKO7[x.typ]}.`,
      ],
      explanation: `„${x.s}“ ${x.proc}, proto je to věta ${NAZEV[x.typ]}. Na konci má ${ZNAMENKO4[x.typ]}.`,
    }),
    emoji: EMOJI[x.typ],
  };
}

// ── L2: Kterou větu řekne, aby splnil svůj záměr? ────────────────────────────
interface L2Item { q: string; kdo: string; cil: string; typ: Typ; s: string; proc: string; d: Veta[] }
const L2: L2Item[] = [
  { q: "Eva nemá hodinky a chce znát čas. Co řekne?", kdo: "Eva", cil: "se zeptat na čas", typ: "T", s: "Kolik je hodin?", proc: "se ptá na čas", d: [["Je už pozdě.", "O"], ["Podívej se na hodiny!", "R"], ["Hodiny visí na zdi.", "O"]] },
  { q: "Maminka chce, aby Jirka umyl nádobí. Co mu řekne?", kdo: "maminka", cil: "Jirkovi říct, co má udělat", typ: "R", s: "Jirko, umyj nádobí!", proc: "přikazuje Jirkovi, co má udělat", d: [["Jirka umyl nádobí.", "O"], ["Umyl jsi nádobí?", "T"], ["Nádobí je v dřezu.", "O"]] },
  { q: "Tomáš se chce pochlubit novým kolem. Co řekne kamarádům?", kdo: "Tomáš", cil: "kamarádům něco sdělit", typ: "O", s: "Dostal jsem nové kolo.", proc: "sděluje novinku", d: [["Půjčíš mi kolo?", "T"], ["Podej mi helmu!", "R"], ["Kdo má kolo?", "T"]] },
  { q: "Babička hledá Lucku. Kterou větou se na ni zeptá?", kdo: "babička", cil: "zjistit, kde Lucka je", typ: "T", s: "Kde je Lucka?", proc: "se ptá, kde Lucka je", d: [["Lucka je na zahradě.", "O"], ["Lucko, pojď domů!", "R"], ["Lucka si hraje.", "O"]] },
  { q: "Paní učitelka chce, aby děti otevřely čítanky. Co řekne?", kdo: "paní učitelka", cil: "dětem říct, co mají udělat", typ: "R", s: "Otevřete si čítanky!", proc: "vyzývá děti, co mají udělat", d: [["Děti mají čítanky.", "O"], ["Máte čítanky?", "T"], ["Čítanka je nová.", "O"]] },
  { q: "Petr chce mamince povědět, co viděl v lese. Co řekne?", kdo: "Petr", cil: "mamince něco sdělit", typ: "O", s: "V lese jsem viděl srnku.", proc: "sděluje, co Petr viděl", d: [["Viděla jsi srnku?", "T"], ["Pojď se mnou do lesa!", "R"], ["Kde bydlí srnky?", "T"]] },
  { q: "Ondra prosí Kláru o pastelku. Kterou větu jí řekne?", kdo: "Ondra", cil: "Kláru o něco poprosit", typ: "R", s: "Kláro, podej mi pastelku!", proc: "prosí Kláru, co má udělat", d: [["Klára má pastelky.", "O"], ["Kde je moje pastelka?", "T"], ["Pastelka spadla pod lavici.", "O"]] },
  { q: "Děda chce vědět, jestli bude pršet. Kterou větu řekne?", kdo: "děda", cil: "se zeptat na počasí", typ: "T", s: "Bude dnes pršet?", proc: "se ptá na počasí", d: [["Dnes bude pršet.", "O"], ["Vezmi si deštník!", "R"], ["Venku je zataženo.", "O"]] },
  { q: "Sestra se chce zeptat kamarádky na jméno. Co řekne?", kdo: "sestra", cil: "se zeptat na jméno", typ: "T", s: "Jak se jmenuješ?", proc: "se ptá na jméno", d: [["Jmenuji se Ema.", "O"], ["Řekni mi své jméno!", "R"], ["Ema má hezké jméno.", "O"]] },
  { q: "Kuba chce oznámit, že vyhrál závod. Kterou větu řekne?", kdo: "Kuba", cil: "oznámit novinku", typ: "O", s: "Vyhrál jsem závod.", proc: "sděluje, co se stalo", d: [["Kdo vyhrál závod?", "T"], ["Běž rychleji!", "R"], ["Poběžíš taky?", "T"]] },
  { q: "Tatínek chce, aby pes přestal štěkat. Co mu řekne?", kdo: "tatínek", cil: "psovi říct, co má udělat", typ: "R", s: "Rexi, přestaň štěkat!", proc: "přikazuje psovi, co má udělat", d: [["Pes štěká na kočku.", "O"], ["Proč pes štěká?", "T"], ["Rex je hlídací pes.", "O"]] },
  { q: "Anička chce mamince oznámit, že dostala jedničku. Co řekne?", kdo: "Anička", cil: "mamince sdělit novinku", typ: "O", s: "Dostala jsem jedničku.", proc: "sděluje novinku ze školy", d: [["Dostala jsi jedničku?", "T"], ["Pochval mě!", "R"], ["Z čeho byla písemka?", "T"]] },
  { q: "Filip chce, aby kamarád zavřel dveře. Co mu řekne?", kdo: "Filip", cil: "kamarádovi říct, co má udělat", typ: "R", s: "Zavři dveře!", proc: "přikazuje kamarádovi, co má udělat", d: [["Dveře jsou otevřené.", "O"], ["Kdo otevřel dveře?", "T"], ["Venku táhne.", "O"]] },
  { q: "Mirka neví, v kolik hodin začíná film. Co řekne?", kdo: "Mirka", cil: "se zeptat na čas", typ: "T", s: "Kdy začne film?", proc: "se ptá na čas", d: [["Film začíná v pět.", "O"], ["Pusť ten film!", "R"], ["Film je o zvířatech.", "O"]] },
];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function l2(x: L2Item): PracticeTask {
  const d = x.d.map(([s, t]) => ({ value: s, why: `„${s}“ je věta ${NAZEV[t]} — ${ZNAK[t]}. ${cap(x.kdo)} ale chce ${x.cil}.` })) as [Distractor, Distractor, Distractor];
  return {
    ...choice(x.q, x.s, d, {
      hints: [
        `Co chce ${x.kdo} udělat — něco sdělit, na něco se zeptat, nebo o něco požádat?`,
        `Když chceme něco sdělit, řekneme větu oznamovací. Když se ptáme, řekneme větu tázací. Když přikazujeme nebo prosíme, řekneme větu rozkazovací. Vyber tu, která se hodí k tomu, co chce ${x.kdo}.`,
      ],
      explanation: `${cap(x.kdo)} chce ${x.cil}. Věta „${x.s}“ ${x.proc}, je to věta ${NAZEV[x.typ]} — přesně k tomu slouží.`,
    }),
    emoji: EMOJI[x.typ],
  };
}

// ── L3: přeměna věty, znaménko + druh zároveň, tázací slovo v oznamovací větě ──
interface Rucni { q: string; a: string; d: [Distractor, Distractor, Distractor]; h: [string, string]; e: string; emoji: string }

const PREMENA: Rucni[] = [
  {
    q: "Změň větu „Tomáš zavřel okno.“ na rozkazovací. Která vznikne?", a: "Tomáši, zavři okno!",
    d: [
      { value: "Zavřel Tomáš okno?", why: "Tahle věta se ptá — je tázací, ne rozkazovací." },
      { value: "Tomáš zavře okno.", why: "Změnil se jen čas. Věta pořád jen sděluje, je oznamovací." },
      { value: "Tomáš okno nezavřel.", why: "Tohle je zápor, věta pořád jen sděluje — je oznamovací." },
    ],
    h: ["Rozkazovací věta Tomášovi říká, co má udělat. Jak bys na něj zavolal?", "Při rozkazu oslovíme toho, komu přikazujeme, a sloveso dáme do rozkazu (jako „sedni“, „podej“). Na konci je vykřičník. Hledej větu, která Tomášovi přikazuje."],
    e: "Rozkazovací věta přikazuje: oslovíme Tomáše a řekneme mu „zavři“. Proto „Tomáši, zavři okno!“ s vykřičníkem.", emoji: "🪟",
  },
  {
    q: "Změň větu „Pes spí.“ na tázací. Která věta vznikne?", a: "Spí pes?",
    d: [
      { value: "Pes nespí.", why: "To je zápor — věta pořád jen sděluje, je oznamovací." },
      { value: "Spi, pejsku!", why: "Tahle věta psovi přikazuje — je rozkazovací." },
      { value: "Pes už spal.", why: "Změnil se jen čas. Věta pořád sděluje, je oznamovací." },
    ],
    h: ["Tázací věta se ptá. Jak by ses zeptal, jestli pes spí?", "Otázku, na kterou odpovíš ano, nebo ne, často poznáš podle toho, že sloveso stojí na začátku. Na konci je otazník. Hledej větu, na kterou můžeš odpovědět."],
    e: "Z oznámení uděláme otázku tak, že dáme sloveso dopředu a na konec otazník: „Spí pes?“ Na tu větu se dá odpovědět ano, nebo ne.", emoji: "🐕",
  },
  {
    q: "Změň větu „Zavři okno!“ na oznamovací. Která věta vznikne?", a: "Petr zavřel okno.",
    d: [
      { value: "Zavřeš okno?", why: "Tahle věta se ptá — je tázací." },
      { value: "Zavřete okno!", why: "Pořád je to rozkaz, jen pro víc lidí — věta je rozkazovací." },
      { value: "Kdo zavřel okno?", why: "Tahle věta se ptá, kdo to udělal — je tázací." },
    ],
    h: ["Oznamovací věta jen sděluje, co se stalo nebo co je. Která věta nic nepřikazuje ani se neptá?", "Z rozkazu uděláš oznámení tak, že řekneš, co někdo udělal nebo dělá. Taková věta končí tečkou a nikomu nic nepřikazuje."],
    e: "„Petr zavřel okno.“ jen sděluje, co se stalo — nikomu nic nepřikazuje a na nic se neptá. Proto je oznamovací a končí tečkou.", emoji: "🪟",
  },
  {
    q: "Změň otázku „Kdo přišel?“ na oznamovací větu. Která to je?", a: "Přišla babička.",
    d: [
      { value: "Kdy přijde babička?", why: "Tahle věta se pořád ptá — je tázací." },
      { value: "Babičko, pojď dál!", why: "Tahle věta babičku vyzývá — je rozkazovací." },
      { value: "Kdo to zvoní?", why: "Tahle věta se ptá — je tázací." },
    ],
    h: ["Oznamovací věta na otázku „Kdo přišel?“ odpovídá. Která věta to jen sdělí?", "Oznámení neobsahuje tázací slovo (kdo, kdy, kde) a končí tečkou. Najdi větu, která prostě řekne, co se stalo."],
    e: "„Přišla babička.“ sděluje, kdo přišel — odpovídá na otázku a končí tečkou. Proto je oznamovací.", emoji: "🚪",
  },
  {
    q: "Změň větu „Děti uklízejí hračky.“ na rozkazovací. Která vznikne?", a: "Děti, ukliďte hračky!",
    d: [
      { value: "Uklízejí děti hračky?", why: "Sloveso je vpředu a na konci otazník — věta se ptá, je tázací." },
      { value: "Děti uklidily hračky.", why: "Změnil se jen čas. Věta pořád sděluje, je oznamovací." },
      { value: "Kdo uklidí hračky?", why: "Tahle věta se ptá — je tázací." },
    ],
    h: ["Jak bys dětem řekl, co mají udělat s hračkami?", "V rozkazu oslovíme ty, komu přikazujeme, a sloveso dáme do rozkazu (když mluvíme k více dětem: „pojďte“, „sedněte si“). Na konci je vykřičník."],
    e: "Rozkazovací věta dětem přikazuje: oslovíme je a řekneme „ukliďte“. Proto „Děti, ukliďte hračky!“ s vykřičníkem.", emoji: "🧸",
  },
  {
    q: "Změň větu „Lucka zpívá.“ na tázací. Která věta vznikne?", a: "Zpívá Lucka?",
    d: [
      { value: "Lucko, zpívej!", why: "Tahle věta Lucku vyzývá — je rozkazovací." },
      { value: "Lucka nezpívá.", why: "To je zápor — věta pořád jen sděluje, je oznamovací." },
      { value: "Lucka bude zpívat.", why: "Změnil se jen čas. Věta pořád sděluje, je oznamovací." },
    ],
    h: ["Jak by ses zeptal, jestli Lucka zpívá?", "U otázky, na kterou odpovíš ano, nebo ne, dáme sloveso na začátek a na konec otazník. Zápor ani jiný čas z věty otázku neudělají."],
    e: "Sloveso „zpívá“ jsme dali dopředu a na konec otazník: „Zpívá Lucka?“ Věta se ptá, je tázací.", emoji: "🎤",
  },
  {
    q: "Změň větu „Venku prší.“ na tázací. Která věta vznikne?", a: "Prší venku?",
    d: [
      { value: "Venku neprší.", why: "To je zápor — věta pořád jen sděluje, je oznamovací." },
      { value: "Venku pršelo.", why: "Změnil se jen čas. Věta pořád sděluje, je oznamovací." },
      { value: "Zůstaň venku!", why: "Tahle věta někomu přikazuje — je rozkazovací." },
    ],
    h: ["Chceš zjistit, jaké je venku počasí. Jak se zeptáš?", "Otázku bez tázacího slova poznáš podle toho, že sloveso jde na začátek a na konci je otazník. Věta se zápornou nebo minulou formou pořád jen sděluje."],
    e: "Z oznámení „Venku prší.“ je otázka, když dáme sloveso dopředu a na konec otazník: „Prší venku?“", emoji: "🌧️",
  },
];

// Znaménko + druh zároveň. [kontext, věta bez znaménka, druh, co věta dělá, špatné znaménko pro správný druh, malá nápověda]
const ZNAMENKA: [string, string, Typ, string, Typ, string][] = [
  ["", "Kde máš boty", "T", "se ptá, kde boty jsou", "O", "Na začátku věty je slovo „kde“. K čemu takové slovo slouží?"],
  ["", "Obleč si bundu", "R", "někomu přikazuje, co má udělat", "T", "Slovo „obleč“ někomu něco říká. Oznamuje, ptá se, nebo přikazuje?"],
  ["Ema odpovídá kamarádovi:", "Bydlím v Brně", "O", "odpovídá a sděluje, kde Ema bydlí", "R", "Ema na otázku odpovídá. Co tedy její věta dělá?"],
  ["Maminka volá:", "Petře, pojď na oběd", "R", "volá Petra a vyzývá ho", "O", "Maminka Petra oslovuje a chce, aby něco udělal. Jaká je to věta?"],
  ["", "Kolik je ti let", "T", "se ptá na věk", "R", "Věta začíná slovem „kolik“. Co od tebe chce?"],
];

function znamenko([ctx, veta, typ, proc, spatne, h0]: (typeof ZNAMENKA)[number]): PracticeTask {
  const lab = (z: Typ, t: Typ) => `${ZNAMENKO[z]} – ${NAZEV[t]}`;
  const znak: Record<Typ, string> = { O: ".", T: "?", R: "!" };
  const ostatni = (["O", "T", "R"] as Typ[]).filter((t) => t !== typ);
  const d = [
    ...ostatni.map((t) => ({ value: lab(t, t), why: `„${veta}“ ${proc}, takže není věta ${NAZEV[t]} — ta ${ZNAK[t]}.` })),
    { value: lab(spatne, typ), why: `Druh věty sedí, ale věta ${NAZEV[typ]} nekončí ${ZNAMENKO7[spatne]}.` },
  ] as [Distractor, Distractor, Distractor];
  const q = `${ctx ? ctx + " " : ""}„${veta}_“ Doplň znaménko a urči druh věty.`;
  return {
    ...choice(q, lab(typ, typ), d, {
      hints: [h0, `Nejdřív rozhodni, co věta „${veta}“ dělá: sděluje, ptá se, nebo přikazuje? Tím máš druh věty. Znaménko pak k druhu patří: ${PRAVIDLO}`],
      explanation: `„${veta}${znak[typ]}“ ${proc}. Je to věta ${NAZEV[typ]}, a proto na konec patří ${ZNAMENKO4[typ]}.`,
    }),
    emoji: EMOJI[typ],
  };
}

const TAZACI_SLOVO: Rucni[] = [
  {
    q: "Která věta je oznamovací, i když obsahuje slovo „kde“?", a: "Vím, kde je klíč.",
    d: [
      { value: "Kde je můj klíč?", why: "Tahle věta se opravdu ptá a končí otazníkem — je tázací." },
      { value: "Najdi mi klíč!", why: "Tahle věta přikazuje — je rozkazovací." },
      { value: "Kde jsi nechal klíče?", why: "Tahle věta se ptá a čeká odpověď — je tázací." },
    ],
    h: ["Slovo „kde“ ještě neznamená otázku. Která věta se na nic neptá?", "Podívej se, jestli věta čeká odpověď a jak končí. Věta, která jen sděluje, co víme, je oznamovací a končí tečkou — i když je v ní slovo „kde“."],
    e: "„Vím, kde je klíč.“ se na nic neptá — sděluje, že to vím. Proto je oznamovací a končí tečkou, přestože obsahuje slovo „kde“.", emoji: "🔑",
  },
  {
    q: "Která věta je oznamovací, i když obsahuje slovo „kdy“?", a: "Nevím, kdy přijede vlak.",
    d: [
      { value: "Kdy jede vlak?", why: "Tahle věta se ptá a končí otazníkem — je tázací." },
      { value: "Pospěš si na vlak!", why: "Tahle věta přikazuje — je rozkazovací." },
      { value: "Kdy přijedeš?", why: "Tahle věta se ptá a čeká odpověď — je tázací." },
    ],
    h: ["Slovo „kdy“ ještě neznamená otázku. Která věta nečeká odpověď?", "Rozhoduje, co věta dělá, a znaménko na konci. Věta, která jen sděluje, co nevíme, je oznamovací a končí tečkou — i když je v ní slovo „kdy“."],
    e: "„Nevím, kdy přijede vlak.“ jen sděluje, že to nevím. Na nic se přímo neptá, proto je oznamovací a končí tečkou.", emoji: "🚆",
  },
];

const rucni = (x: Rucni): PracticeTask => ({ ...choice(x.q, x.a, x.d, { hints: x.h, explanation: x.e }), emoji: x.emoji });

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1).map(l1);
  if (level === 2) return shuffle(L2).map(l2);
  return shuffle([...PREMENA.map(rucni), ...ZNAMENKA.map(znamenko), ...TAZACI_SLOVO.map(rucni)]);
}

export const DRUHYVET: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-druhy-vet-oznamovaci-tazaci-rozkazovaci",
    title: "Druhy vět (oznamovací, tázací, rozkazovací)",
    studentTitle: "Jaká je to věta?",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Práce s textem",
    briefDescription: "Rozlišíš oznamovací, tázací a rozkazovací věty.",
    keywords: ["druhy vět", "oznamovací", "tázací", "rozkazovací", "tečka", "otazník", "vykřičník"],
    goals: [
      "Rozlišit oznamovací, tázací a rozkazovací větu.",
      "Vědět, čím každý druh věty končí (. ? !).",
    ],
    boundaries: ["Pouze 3 druhy vět.", "Bez přacích a zvolacích vět."],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Oznamovací (.) sděluje, tázací (?) se ptá, rozkazovací (!) přikazuje.",
      steps: ["Přečti větu.", "Sděluje, ptá se nebo přikazuje?", "Sděluje → oznamovací, ptá → tázací, přikazuje → rozkazovací."],
      commonMistake: "Záměna tázací a rozkazovací věty — tázací čeká na odpověď, rozkazovací ne.",
      example: "Pes štěká. → oznamovací. Kde je pes? → tázací. Pojď sem! → rozkazovací.",
    },
  },
];
