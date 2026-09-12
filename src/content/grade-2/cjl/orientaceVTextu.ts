import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { choice, shuffle, type Distractor } from "@/content/grade-3/_shared";
import { pluralWithNumber } from "@/lib/czechGrammar";

// Přepsáno 2026-09-11 (inventura obsahu). Dřív jen Ano/Ne na všech úrovních,
// 8 úloh na úroveň, jedna nápověda, žádná zpětná vazba. Teď výběr ze čtyř:
// L1 pojmy (věta, nadpis, odstavec), počet vět v krátkém textu, najdi nadpis
// · L2 počet vět s čárkami, kolikátá věta je otázka, nadpis k textu
// · L3 věta, která do textu nepatří, nadpis ke dvěma odstavcům, kde začít nový odstavec.
// Úlohy nad textem počítají věty z textu samy a klíč porovnávají s ručně zadaným.

interface Uloha {
  q: string;
  a: string;
  d: [string, string][];
  h: [string, string];
  e: string;
  emoji: string;
}

function task(u: Uloha): PracticeTask {
  if (u.d.length !== 3) throw new Error(`Úloha „${u.q}“ nemá tři chybné možnosti`);
  const wrong = u.d.map(([value, why]) => ({ value, why })) as [Distractor, Distractor, Distractor];
  return { ...choice(u.q, u.a, wrong, { hints: u.h, explanation: u.e }), emoji: u.emoji };
}

const vet = (n: number) => pluralWithNumber(n, "věta", "věty", "vět");
const slov = (n: number) => pluralWithNumber(n, "slovo", "slova", "slov");
const ORD = ["první", "druhá", "třetí", "čtvrtá", "pátá"];
const ORD_7 = ["první", "druhou", "třetí", "čtvrtou", "pátou"]; // „před … větou“
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Rozdělí text na věty podle . ? ! */
function vety(text: string): string[] {
  return text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
}
const pocetSlov = (text: string) => text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
const pocetCarek = (text: string) => (text.match(/,/g) ?? []).length;
const pocetTecek = (text: string) => (text.match(/\./g) ?? []).length;
const prvniSlova = (s: string, n = 2) => s.split(/\s+/).slice(0, n).join(" ").replace(/[.,?!]$/, "");
function znamenko(s: string): string {
  if (s.endsWith("?")) return "otazníkem";
  if (s.endsWith("!")) return "vykřičníkem";
  return "tečkou";
}

// ── Počet vět ─────────────────────────────────────────────────────────────
type ChybaPoctu = "slova" | "carky" | "tecky" | "min" | "vic";

function pocetVetTask(text: string, klic: number, chyby: ChybaPoctu[], emoji: string): PracticeTask {
  const s = vety(text);
  if (s.length !== klic) throw new Error(`Počet vět v „${text}“ je ${s.length}, klíč ${klic}`);
  const w = pocetSlov(text), c = pocetCarek(text), t = pocetTecek(text);
  const d: [string, string][] = chyby.map((ch) => {
    switch (ch) {
      case "slova": return [String(w), `Text má ${slov(w)}, ale vět je méně. Jedna věta může mít víc slov.`];
      case "carky": return [String(klic + c), "Započítal jsi i čárky. Čárka větu neukončuje, jen odděluje části uvnitř věty."];
      case "tecky": return [String(t), "Počítal jsi jen tečky. Větu ukončuje i otazník a vykřičník."];
      case "min": return [String(klic - 1), `Jednu větu jsi vynechal. Nezapomeň ani na poslední: „${s[s.length - 1]}“`];
      case "vic": return [String(klic + 1), "Jednu větu jsi započítal navíc. Za každou větou stojí jen jedno ukončovací znaménko."];
    }
  });
  const carkovy = c > 0;
  return task({
    q: `Text: „${text}“ Kolik má vět?`,
    a: String(klic),
    emoji,
    d,
    h: [
      `Najdi v textu začínajícím „${prvniSlova(s[0])}“ znaménka, která stojí na konci vět.`,
      `Věta končí tečkou, otazníkem nebo vykřičníkem${carkovy ? ", čárka se nepočítá" : ""}. Projdi text od slova „${prvniSlova(s[0], 1)}“ až na konec a za každým takovým znaménkem si ťukni prstem. Kolikrát jsi ťukl?`,
    ],
    e: `Věty jsou: ${s.map((x) => `„${x}“`).join(" ")} Každá končí tečkou, otazníkem nebo vykřičníkem, proto má text ${vet(klic)}.`,
  });
}

// ── Kolikátá věta končí daným znaménkem ────────────────────────────────────
function kolikataTask(text: string, znak: "?" | "!", klic: string, emoji: string): PracticeTask {
  const s = vety(text);
  const idx = s.findIndex((x) => x.endsWith(znak));
  if (idx < 0 || ORD[idx] !== klic || s.filter((x) => x.endsWith(znak)).length !== 1) throw new Error(`Klíč „${klic}“ nesedí na „${text}“`);
  const co = znak === "?" ? "otázka" : "věta s vykřičníkem";
  const others = s.map((_, j) => j).filter((j) => j !== idx);
  const d: [string, string][] = others.slice(0, 3).map((j) => [ORD[j], `${cap(ORD[j])} věta „${s[j]}“ končí ${znamenko(s[j])}, ne ${znak === "?" ? "otazníkem" : "vykřičníkem"}.`]);
  if (d.length < 3) d.push(["žádná", `${cap(co)} v textu je, poznáš ji podle ${znak === "?" ? "otazníku" : "vykřičníku"} na konci.`]);
  return task({
    q: `Text: „${text}“ Kolikátá věta je ${co}?`,
    a: klic,
    emoji,
    d,
    h: [
      `Podívej se na konec každé věty v textu „${prvniSlova(s[0])}…“. Kde je ${znak === "?" ? "otazník" : "vykřičník"}?`,
      `${znak === "?" ? "Otázka končí otazníkem" : "Hledáš větu, za kterou stojí vykřičník"}. Věty si očísluj od začátku (jedna, dvě, tři…). Text začíná slovy „${prvniSlova(s[0], 3)}“. U kterého čísla stojí věta se znaménkem „${znak}“?`,
    ],
    e: `Věta „${s[idx]}“ končí ${znak === "?" ? "otazníkem, je to otázka" : "vykřičníkem"}. V textu je ${ORD[idx]} v pořadí.`,
  });
}

// ── Věta, která do textu nepatří ──────────────────────────────────────────
function nepatriTask(text: string, klic: string, tema: string, jine: string, emoji: string): PracticeTask {
  const s = vety(text);
  const k = ORD.indexOf(klic);
  if (s.length !== 4 || k < 0) throw new Error(`Text „${text}“ musí mít 4 věty`);
  const d: [string, string][] = s.map((_, j) => j).filter((j) => j !== k)
    .map((j) => [ORD[j], `${cap(ORD[j])} věta „${s[j]}“ je ${tema}, do textu patří.`]);
  return task({
    q: `Text: „${text}“ Kolikátá věta do textu nepatří?`,
    a: klic,
    emoji,
    d,
    h: [
      `O čem je většina vět v textu, který začíná „${prvniSlova(s[0], 3)}“?`,
      `Téma textu poznáš podle toho, o čem mluví skoro všechny věty: je to text ${tema}. Přečti větu po větě a u každé se zeptej, jestli mluví o tom. Věta o něčem úplně jiném do textu nepatří. Pak spočítej, kolikátá je.`,
    ],
    e: `Ostatní věty jsou ${tema}. Věta „${s[k]}“ mluví ${jine}, proto do textu nepatří. Je ${ORD[k]} v pořadí.`,
  });
}

// ── Kde začít nový odstavec ────────────────────────────────────────────────
function odstavecTask(text: string, k: number, t1: string, t2: string, emoji: string): PracticeTask {
  const s = vety(text);
  if (k < 2 || k > s.length - 1) throw new Error(`Hranice odstavce v „${text}“ mimo rozsah`);
  const opt = (j: number) => `před ${ORD_7[j]} větou`;
  const d: [string, string][] = [
    [opt(k - 1), `Věta „${s[k - 1]}“ je ještě ${t1}. Nový odstavec by ji odtrhl od vět, ke kterým patří.`],
    k + 1 < s.length
      ? [opt(k + 1), `Věta „${s[k]}“ už mluví ${t2}, nový odstavec musí začít dřív.`]
      : [opt(k - 2 >= 0 ? k - 2 : 0), `Věty před větou „${s[k]}“ jsou všechny ${t1}, patří k sobě.`],
    ["nikde, je to jedno téma", `Text mluví o dvou různých věcech, ${t1} a ${t2}. Proto potřebuje dva odstavce.`],
  ];
  return task({
    q: `Text: „${text}“ Před kolikátou větou má začít nový odstavec?`,
    a: opt(k),
    emoji,
    d,
    h: [
      `O čem mluví začátek textu „${prvniSlova(s[0], 3)}“ a o čem jeho konec?`,
      `Nový odstavec začíná tam, kde text začne mluvit o něčem jiném. Začátek je ${t1}. Najdi první větu, která už mluví ${t2}, a spočítej, kolikátá je. Před ní odstavec začne.`,
    ],
    e: `Věty na začátku jsou ${t1}. Od věty „${s[k]}“ text mluví ${t2}. Nový odstavec proto začne před ${ORD_7[k]} větou.`,
  });
}

// ── L1 ────────────────────────────────────────────────────────────────────
const POJMY_L1: Uloha[] = [
  {
    q: "Čím začíná každá věta?", a: "velkým písmenem", emoji: "🔠",
    d: [
      ["malým písmenem", "Malé písmeno na začátku věty je chyba. Začátek věty se píše jinak."],
      ["číslicí", "Věta začíná písmenem, ne číslicí."],
      ["čárkou", "Čárka stojí uvnitř věty, nikdy na jejím začátku."],
    ],
    h: [
      "Podívej se na první písmeno kterékoli věty v čítance.",
      "První písmeno věty se píše jinak než písmena uprostřed slov, podobně jako první písmeno tvého jména. Jaké to písmeno je?",
    ],
    e: "Každá věta začíná velkým písmenem. Podle něj poznáme, kde věta začíná.",
  },
  {
    q: "Které znaménko může stát na konci věty?", a: "otazník", emoji: "❓",
    d: [
      ["čárka", "Čárka odděluje části uvnitř věty, větu neukončí."],
      ["pomlčka", "Pomlčka větu neukončuje, konec věty poznáme podle jiných znamének."],
      ["dvojtečka", "Za dvojtečkou věta pokračuje, nekončí."],
    ],
    h: [
      "Jaké znaménko napíšeš za větu, když se na něco ptáš?",
      "Větu ukončují jen tři znaménka: tečka, vykřičník a znaménko, které píšeš za otázku. Najdi mezi možnostmi jedno z těchto tří.",
    ],
    e: "Věta končí tečkou, vykřičníkem nebo otazníkem. Čárka, pomlčka ani dvojtečka větu neukončí.",
  },
  {
    q: "Jak se jmenuje řádek nad textem, který říká, o čem text je?", a: "nadpis", emoji: "📰",
    d: [
      ["odstavec", "Odstavec je několik vět uvnitř textu, ne řádek nad ním."],
      ["poslední věta", "Poslední věta je na konci textu, ne nad ním."],
      ["podpis", "Podpis bývá pod textem a říká, kdo ho napsal, ne o čem je."],
    ],
    h: [
      "Co čteš u článku úplně nahoře, ještě než začneš číst?",
      "Nad textem bývá krátký řádek větším nebo tučným písmem. Prozradí téma a pomůže ti vybrat, co chceš číst. Jak se mu říká?",
    ],
    e: "Nadpis stojí nad textem a říká, o čem text je.",
  },
  {
    q: "Jak se jmenuje několik vět o jedné věci, oddělených od dalších?", a: "odstavec", emoji: "📄",
    d: [
      ["řádek", "Řádek končí na kraji stránky, klidně i uprostřed věty. Nedrží pohromadě jednu věc."],
      ["nadpis", "Nadpis je jen jeden krátký řádek nad textem."],
      ["slovo", "Slovo je jen část věty, ne několik vět."],
    ],
    h: [
      "Jak se jmenuje kousek textu, který začíná na novém řádku kousek od kraje?",
      "Delší text se dělí na menší části. Každá má několik vět o jedné věci a začíná na novém řádku, často trochu odsazená. Když se změní téma, začne další taková část.",
    ],
    e: "Odstavec je několik vět o jedné věci. Nový odstavec začíná na novém řádku.",
  },
  {
    q: "Kde v článku stojí nadpis?", a: "nad textem", emoji: "⬆️",
    d: [
      ["pod textem", "Pod textem bývá podpis autora, ne nadpis."],
      ["uprostřed textu", "Uprostřed textu jsou odstavce. Nadpis čteš dřív než text."],
      ["za poslední větou", "Za poslední větou text končí. Nadpis se čte jako první."],
    ],
    h: [
      "Nadpis se čte jako první. Kde tedy musí být?",
      "Nadpis ti prozradí téma dřív, než začneš číst. Proto ho najdeš na místě, kam se oči podívají nejdřív, když otevřeš stránku s článkem.",
    ],
    e: "Nadpis stojí nad textem, protože ho čteme jako první. Říká, o čem text bude.",
  },
  {
    q: "Podle čeho poznáš, kde věta končí?", a: "podle znaménka za ní", emoji: "🔚",
    d: [
      ["podle konce řádku", "Věta může pokračovat na dalším řádku, konec řádku neznamená konec věty."],
      ["podle čárky", "Čárka je uvnitř věty, větu neukončí."],
      ["podle mezery", "Mezery jsou mezi všemi slovy, i uprostřed věty."],
    ],
    h: [
      "Co stojí za posledním slovem každé věty?",
      "Za poslední slovo věty píšeme tečku, otazník nebo vykřičník. Konec řádku ani mezera o konci věty nic neříkají. Která možnost to vystihuje?",
    ],
    e: "Konec věty poznáme podle tečky, otazníku nebo vykřičníku, které stojí za ní.",
  },
];

const NADPIS_L1: Uloha[] = [
  {
    q: "Text je o psovi Rekovi. Který řádek je jeho nadpis?", a: "Náš pes Rek", emoji: "🐕",
    d: [
      ["Rek rád běhá po zahradě.", "Tahle věta končí tečkou a vypráví jen o jedné věci. Je to věta z textu."],
      ["Každé ráno ho venčím.", "To je věta z textu, končí tečkou. Nadpis je krátký název bez tečky."],
      ["Nejraději má kosti.", "To je věta z textu o tom, co Rek jí, ne název celého textu."],
    ],
    h: [
      "Který řádek je nejkratší a nekončí tečkou?",
      "Nadpis pojmenuje celý text, a proto bývá krátký a nemá tečku. Věty v textu naopak vyprávějí o jednotlivých věcech a tečkou končí. Který řádek pojmenuje celý text o Rekovi?",
    ],
    e: "„Náš pes Rek“ je krátký, nemá tečku a pojmenuje celý text. Ostatní řádky jsou věty z textu.",
  },
  {
    q: "Text vypráví o sobotním výletě. Který řádek je nadpis?", a: "Výlet na hrad", emoji: "🏰",
    d: [
      ["V sobotu jsme jeli na hrad.", "To je první věta textu, končí tečkou."],
      ["Hrad stál na vysokém kopci.", "To je věta z textu, popisuje jen hrad."],
      ["Domů jsme přijeli večer.", "To je poslední věta textu, ne jeho název."],
    ],
    h: [
      "Který řádek by mohl stát nad textem jako jeho jméno?",
      "Věty textu vyprávějí, co se na výletě dělo, a končí tečkou. Nadpis je krátký název celého výletu bez tečky. Který řádek to splňuje?",
    ],
    e: "„Výlet na hrad“ je krátký název bez tečky a shrnuje celý text. Ostatní jsou věty z textu.",
  },
  {
    q: "Text radí, jak zasadit fazoli. Který řádek je nadpis?", a: "Jak roste fazole", emoji: "🌱",
    d: [
      ["Semínko dáme do hlíny.", "To je první krok návodu, věta končí tečkou."],
      ["Každý den ho zalijeme.", "To je další krok návodu, ne název celého textu."],
      ["Za týden vyroste lístek.", "To je věta o výsledku, končí tečkou. Nadpis tečku nemá."],
    ],
    h: [
      "Který řádek pojmenuje celý návod, a ne jen jeden krok?",
      "Kroky návodu jsou věty a končí tečkou. Nadpis stojí nad nimi, je bez tečky a řekne, o čem celý návod je. Který řádek to je?",
    ],
    e: "„Jak roste fazole“ pojmenuje celý návod a nemá tečku. Ostatní řádky jsou jednotlivé kroky.",
  },
  {
    q: "Text je o mé babičce. Který řádek je nadpis?", a: "Moje babička", emoji: "👵",
    d: [
      ["Babička bydlí na vesnici.", "To je věta z textu o tom, kde babička bydlí."],
      ["Peče nejlepší buchty.", "To je věta z textu, končí tečkou."],
      ["Mám ji moc ráda.", "To je věta z textu. Bez okolních vět by nebylo jasné, o kom je."],
    ],
    h: [
      "Který řádek je krátký název bez tečky?",
      "Každá věta textu říká o babičce jednu věc a končí tečkou. Nadpis musí pojmenovat celý text najednou a tečku nemá. Najdi ho.",
    ],
    e: "„Moje babička“ je krátký název bez tečky pro celý text. Ostatní řádky jsou věty.",
  },
];

// ── L2 ────────────────────────────────────────────────────────────────────
const NADPIS_L2: Uloha[] = [
  {
    q: "Text: „Ježek se v zimě schová pod listí. Spí tam až do jara. Nic nejí.“ Který nadpis se hodí?", a: "Jak ježek přezimuje", emoji: "🦔",
    d: [
      ["Ježkova večeře", "V textu se píše, že ježek v zimě nic nejí. O večeři text není."],
      ["Jarní louka", "Jaro je v textu jen konec spánku, text je o zimě."],
      ["Listí na podzim", "Listí je jen místo, kde ježek spí. Text je o ježkovi."],
    ],
    h: [
      "O kom je text a co ten dělá celou zimu?",
      "Dobrý nadpis vystihne celý text, ne jen jedno slovo z něj. Všechny věty mluví o tom, kde ježek tráví zimu a co při tom dělá. Který nadpis říká právě tohle?",
    ],
    e: "Všechny věty popisují, jak ježek tráví zimu. Nadpis „Jak ježek přezimuje“ vystihuje celý text.",
  },
  {
    q: "Text: „Dnes jsme ve škole sázeli semínka. Každý dostal květináč. Za týden vyrostou kytičky.“ Který nadpis se hodí?", a: "Sázíme ve škole", emoji: "🪴",
    d: [
      ["Náš nový květináč", "Květináč je jen jedna věc z textu, text je o sázení."],
      ["Výlet do lesa", "Děti byly ve škole, o lese text není."],
      ["Kytička pro maminku", "O mamince text nemluví. Kytičky teprve vyrostou."],
    ],
    h: [
      "Co děti v textu dělaly a kde?",
      "Nadpis má shrnout celý text. Text vypráví, jak děti ve třídě dávaly semínka do hlíny a čekají na kytičky. Který nadpis říká, co dělaly a kde?",
    ],
    e: "Text je o tom, jak děti ve škole sázely semínka. To vystihuje nadpis „Sázíme ve škole“.",
  },
  {
    q: "Text: „Micka má tři koťata. Jsou malá a hravá. Celý den si hrají s klubíčkem.“ Který nadpis se hodí?", a: "Mickina koťata", emoji: "🐱",
    d: [
      ["Klubíčko vlny", "Klubíčko je jen hračka. Text je o koťatech."],
      ["Velký pes", "O psovi text vůbec nemluví."],
      ["Kočka na lovu", "Text je o hře koťat, ne o lovu."],
    ],
    h: [
      "O kom mluví všechny tři věty?",
      "První věta představí kočku Micku a její mláďata, další věty říkají, jaká jsou a co dělají. Nadpis má pojmenovat to, o čem jsou všechny věty.",
    ],
    e: "Všechny věty jsou o koťatech kočky Micky. Proto se hodí nadpis „Mickina koťata“.",
  },
  {
    q: "Text: „V zimě krmíme ptáčky. Sypeme jim do krmítka zrní. Nejčastěji přilétají sýkorky.“ Který nadpis se hodí?", a: "U krmítka", emoji: "🐦",
    d: [
      ["Sýkorky", "Sýkorky jsou jen jedni z ptáčků. Text je o krmení všech ptáčků."],
      ["Letní den", "Text se odehrává v zimě, ne v létě."],
      ["Zrní z obchodu", "Zrní je jen potrava. O obchodu text nemluví."],
    ],
    h: [
      "Kde se všechno, o čem text vypráví, odehrává?",
      "Text popisuje, jak v zimě sypeme zrní a kdo k nám přilétá. Všechno se děje na jednom místě. Který nadpis pojmenuje to místo a sedí na celý text?",
    ],
    e: "Všechno se v textu děje u krmítka, kam sypeme zrní a přilétají ptáčci. Nadpis „U krmítka“ sedí na celý text.",
  },
  {
    q: "Text: „Tomáš si vzal deštník. Venku celý den pršelo. Kaluže byly všude.“ Který nadpis se hodí?", a: "Deštivý den", emoji: "🌧️",
    d: [
      ["Tomášův nový deštník", "Že je deštník nový, text neříká. Deštník je jen jedna věc z textu."],
      ["Slunečný den", "Celý den pršelo, slunečný den to nebyl."],
      ["Tomáš ve škole", "O škole text nemluví."],
    ],
    h: [
      "Jaké bylo v textu počasí?",
      "Deštník, déšť i kaluže mají něco společného. Nadpis má vystihnout, jaký byl celý den, ne jen jednu věc z textu. Který nadpis to dělá?",
    ],
    e: "Deštník, déšť i kaluže ukazují, že celý den pršelo. Proto se hodí nadpis „Deštivý den“.",
  },
];

// ── L3 ────────────────────────────────────────────────────────────────────
const NADPIS_L3: Uloha[] = [
  {
    q: "Text má dva odstavce. 1.: „Ráno jsme jeli vlakem k babičce.“ 2.: „Odpoledne jsme u babičky pekli perník.“ Který nadpis se hodí k celému textu?", a: "Den u babičky", emoji: "👵",
    d: [
      ["Cesta vlakem", "Cesta vlakem je jen v prvním odstavci. Nadpis musí sedět na oba."],
      ["Pečeme perník", "Pečení je jen ve druhém odstavci. První odstavec je o cestě."],
      ["Naše škola", "O škole nemluví ani jeden odstavec."],
    ],
    h: [
      "Co mají oba odstavce společného?",
      "První odstavec je o cestě, druhý o pečení. Nadpis celého textu musí sedět na oba, tedy na celý den. Kde a s kým děti ten den strávily?",
    ],
    e: "Oba odstavce popisují jeden den: cestu k babičce a pečení u ní. Nadpis „Den u babičky“ sedí na oba.",
  },
  {
    q: "Text má dva odstavce. 1.: „Na jaře kvetou na louce pampelišky.“ 2.: „V létě louku posekáme a suší se seno.“ Který nadpis se hodí k celému textu?", a: "Louka během roku", emoji: "🌼",
    d: [
      ["Žluté pampelišky", "Pampelišky jsou jen v prvním odstavci."],
      ["Sušení sena", "Seno je jen ve druhém odstavci."],
      ["Zimní radovánky", "O zimě text nemluví."],
    ],
    h: [
      "O jakém místě mluví oba odstavce?",
      "První odstavec je o jaru, druhý o létě, ale místo je pořád stejné. Nadpis celého textu musí zahrnout obě roční období. Který to dokáže?",
    ],
    e: "Oba odstavce jsou o louce, jednou na jaře a jednou v létě. Nadpis „Louka během roku“ zahrne obě části.",
  },
  {
    q: "Text má dva odstavce. 1.: „Petr dostal k narozeninám štěně.“ 2.: „Každý den s ním chodí ven a učí ho povely.“ Který nadpis se hodí k celému textu?", a: "Petrův pejsek", emoji: "🐶",
    d: [
      ["Narozeninový dort", "O dortu text nemluví. Narozeniny jsou jen v prvním odstavci."],
      ["Povely pro psy", "Povely jsou jen ve druhém odstavci."],
      ["Petr ve škole", "O škole nemluví ani jeden odstavec."],
    ],
    h: [
      "Kdo se objevuje v obou odstavcích kromě Petra?",
      "První odstavec říká, jak Petr štěně dostal, druhý, co s ním dělá. Nadpis celého textu musí vystihnout to, o čem jsou oba odstavce najednou.",
    ],
    e: "Oba odstavce jsou o Petrově štěněti: jak ho dostal a jak se o něj stará. Proto „Petrův pejsek“.",
  },
  {
    q: "Text má dva odstavce. 1.: „V sobotu jsme stavěli ve sněhu hrad.“ 2.: „V neděli jsme sáňkovali z kopce.“ Který nadpis se hodí k celému textu?", a: "Zimní víkend", emoji: "🛷",
    d: [
      ["Sněhový hrad", "Stavění hradu je jen v prvním odstavci."],
      ["Sáňkování", "Sáňkování je jen ve druhém odstavci."],
      ["Letní prázdniny", "V textu je sníh, nejde o léto."],
    ],
    h: [
      "Které dny text popisuje a jaké bylo roční období?",
      "Sobota a neděle dohromady tvoří jedno slovo. Sníh a sáňky prozradí roční období. Nadpis celého textu musí sedět na oba odstavce najednou.",
    ],
    e: "Sobota a neděle tvoří víkend a sníh ukazuje zimu. Nadpis „Zimní víkend“ sedí na oba odstavce.",
  },
];

function genL1(): PracticeTask[] {
  return [
    ...POJMY_L1.map(task),
    pocetVetTask("Kočka spí. Pes štěká. Ptáci zpívají.", 3, ["slova", "min", "vic"], "🐾"),
    pocetVetTask("Prší. Jdeme rychle domů.", 2, ["slova", "min", "vic"], "☔"),
    pocetVetTask("Kde je Tom? Je venku. Hraje fotbal.", 3, ["slova", "min", "vic"], "⚽"),
    pocetVetTask("Honzík má narozeniny! Dostal kolo.", 2, ["slova", "min", "vic"], "🎂"),
    ...NADPIS_L1.map(task),
  ];
}

function genL2(): PracticeTask[] {
  return [
    pocetVetTask("Na zahradě roste jabloň, hruška a švestka. Jablka už jsou zralá! Kdy je utrhneme?", 3, ["carky", "tecky", "min"], "🍎"),
    pocetVetTask("Máma koupila chleba, mléko, sýr a máslo. Doma uvařila večeři.", 2, ["carky", "min", "vic"], "🛒"),
    pocetVetTask("Pozor! Na silnici je led. Jdi pomalu, drž se zábradlí a dívej se pod nohy.", 3, ["carky", "tecky", "slova"], "🧊"),
    pocetVetTask("Kde máš tašku? Nevím, asi ve škole. Tak běž, ať to stihneš!", 3, ["carky", "tecky", "min"], "🎒"),
    pocetVetTask("Vlak přijel, zastavil a zapískal. Lidé vystoupili. Kdo na nás čeká? Babička!", 4, ["carky", "tecky", "min"], "🚂"),
    kolikataTask("Venku sněží. Půjdeme bobovat? Vezmi si rukavice.", "?", "druhá", "❄️"),
    kolikataTask("Kdo snědl dort? Na talíři zbyly drobky. Byl to pes.", "?", "první", "🍰"),
    kolikataTask("Ráno jsme vstali brzy. Snídali jsme venku. Proč tak brzy? Jeli jsme k moři.", "?", "třetí", "🌊"),
    kolikataTask("Honzík běžel domů. Maminka stála u dveří. Honem se převleč!", "!", "třetí", "🏃"),
    ...NADPIS_L2.map(task),
  ];
}

function genL3(): PracticeTask[] {
  return [
    nepatriTask("Pes Alík hlídá dům. Štěká na cizí lidi. Jahody jsou sladké. V noci spí v boudě.", "třetí", "o psovi Alíkovi", "o jahodách", "🐕"),
    nepatriTask("Na podzim padá listí. Ptáci odlétají na jih. Dny jsou kratší. V létě se koupeme v řece.", "čtvrtá", "o podzimu", "o létě", "🍂"),
    nepatriTask("Babička peče buchty. Moje kolo je modré. Nejdřív umíchá těsto. Pak ho dá do trouby.", "druhá", "o pečení buchet", "o kole", "🥐"),
    nepatriTask("Velryba je největší zvíře. Letadlo startuje. Motory hlasitě hučí. Za chvíli jsme v oblacích.", "první", "o letu letadlem", "o velrybě", "✈️"),
    nepatriTask("Ve škole máme nový koberec. Je zelený a měkký. Sedíme na něm při čtení. Ryby dýchají žábrami.", "čtvrtá", "o koberci ve třídě", "o rybách", "🏫"),
    ...NADPIS_L3.map(task),
    odstavecTask("Máme doma kočku Mourka. Je šedý a rád spí. Náš soused má psa Bobíka. Bobík je velký a hnědý.", 2, "o kočce Mourkovi", "o psovi Bobíkovi", "🐈"),
    odstavecTask("Ve středu jsme byli v zoo. Viděli jsme slony. Sloni se koupali v bazénu. Ve čtvrtek pršelo. Celý den jsme byli doma.", 3, "o středě v zoo", "o deštivém čtvrtku", "🐘"),
    odstavecTask("Můj brácha se jmenuje Ondra. Ondra hraje na kytaru. Moje sestra Eva ráda maluje. Namalovala nám kočku. Obrázek visí v kuchyni.", 2, "o bráchovi Ondrovi", "o sestře Evě", "🎸"),
    odstavecTask("Zima přinesla sníh. Děti stavěly sněhuláky a koulovaly se. Na rybníku bruslily. Pak přišlo jaro. Rozkvetly sněženky.", 3, "o zimě", "o jaru", "⛄"),
    odstavecTask("Náš pes Rek rád běhá. Nejvíc ho baví aportovat. Každý večer spí u krbu. Moje křečice Bára bydlí v kleci. Ráda hlodá mrkev.", 3, "o psovi Rekovi", "o křečici Báře", "🐹"),
  ];
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(genL1());
  if (level === 2) return shuffle(genL2());
  return shuffle(genL3());
}

export const ORIENTACEVTEXTU: TopicMetadata[] = [
  {
    id: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis",
    rvpNodeId: "g2-cjl-komunikacni-a-slohova-vychova-prace-s-textem-orientace-v-textu-veta-odstavec-nadpis",
    title: "Orientace v textu (věta, odstavec, nadpis)",
    studentTitle: "Vyznej se v textu",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Práce s textem",
    briefDescription: "Naučíš se orientovat v textu — věta, odstavec, nadpis.",
    keywords: ["věta", "odstavec", "nadpis", "stránka", "text", "velké písmeno", "tečka"],
    goals: [
      "Vědět, jak začíná a končí věta.",
      "Pochopit, co je odstavec a nadpis.",
      "Orientovat se v knize (stránka, obsah).",
    ],
    boundaries: ["Pouze základní prvky textu.", "Bez složité typografie."],
    gradeRange: [2, 2],
    // Dřív true_false; Ano/Ne smí být jen na L1, proto výběr ze čtyř možností.
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Věta: začíná velkým písmenem, končí . ? ! Odstavec: více vět na jedno téma. Nadpis: říká, o čem text je.",
      steps: ["Přečti text i otázku.", "Věty poznáš podle znaménka na konci (. ? !).", "Nadpis shrnuje celý text, odstavec drží pohromadě jedno téma."],
      commonMistake: "Počítat čárky jako konec věty — čárka větu neukončuje.",
      example: "„Prší. Jdu domů.“ — dvě věty, každá začíná velkým písmenem a končí tečkou.",
    },
  },
];
