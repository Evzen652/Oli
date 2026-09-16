/**
 * Přírodopis 6. ročník — Mikroskop, práce s mikroskopem (select_one).
 *
 * Chybový model:
 *  • zvětšení okuláru a objektivu se sečte místo vynásobení (zpátky se odečte místo vydělení),
 *  • záměna sesterských částí (okulár ↔ objektiv, makrošroub ↔ mikrošroub, clona ↔ zrcátko/kondenzor),
 *  • obraz se bere jako nepřevrácený → sklíčko se posune špatným směrem,
 *  • začít největším zvětšením / zaostřovat makrošroubem při pohledu do okuláru.
 *
 *  • L1 — část ↔ funkce a jednoduchý součin zvětšení.
 *  • L2 — správný postup v situaci, mokrý preparát, zvětšení ve slovní úloze, porovnání sestav.
 *  • L3 — obrácený výpočet, kolikrát se zvětšení změnilo, převrácený obraz, diagnóza potíže,
 *         důsledek většího zvětšení, skutečná velikost.
 *
 * Rotace šablon se nastavuje v `gen()` (žádný stav na úrovni modulu).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pick, pickN, buildChoiceTask as choice, losUlohy, ruzneUlohy, type Distractor } from "./_shared";
import { cis } from "../matematika/_shared";

const c = cis;
const x = (n: number) => `${cis(n)}×`;
const krat = (n: number) => `${cis(n)}krát`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Stav {
  i: number;
  a: number;
  b: number;
  c: number;
}

// ── Části mikroskopu ─────────────────────────────────────────────────────
interface Cast {
  nazev: string;
  pl?: boolean;
  /** Dokončení otázky „Která část mikroskopu …?“ */
  core: string;
  /** Vlastní znění otázky (u sklíček, která nejsou pevnou částí mikroskopu). */
  otazka?: string;
  /** Možnost u otázky „K čemu slouží …?“ */
  funkce: string;
  /** Věta o části (začíná názvem) — do zpětné vazby a vysvětlení. */
  veta: string;
  /** Kde část je (bez slovesa). */
  poloha: string;
  /** Malá nápověda k otázce „Která část…“ — nejmenuje část. */
  napoveda: string;
  sestry: string[];
}

const CASTI: Cast[] = [
  {
    nazev: "okulár",
    core: "je čočka úplně nahoře, do které se při pozorování díváš okem",
    funkce: "Do této čočky se díváš okem a zvětšuje obraz.",
    veta: "Okulár je čočka nahoře u oka, do něj se díváš.",
    poloha: "úplně nahoře na konci tubusu",
    napoveda: "Hledaná čočka je u tvého oka, ne dole u preparátu.",
    sestry: ["objektiv", "tubus", "kondenzor"],
  },
  {
    nazev: "objektiv",
    core: "je čočka dole, těsně nad pozorovaným preparátem",
    funkce: "Je těsně nad preparátem a zvětšuje ho jako první.",
    veta: "Objektiv je čočka dole u preparátu, do něj se okem nedíváš.",
    poloha: "dole pod tubusem, našroubovaný v otočném kotouči",
    napoveda: "Hledaná čočka je dole u sklíčka, okem se do ní nedíváš.",
    sestry: ["okulár", "revolverový měnič", "kondenzor"],
  },
  {
    nazev: "revolverový měnič",
    core: "se otáčí, když chceš vyměnit objektiv za silnější",
    funkce: "Otáčením této části se vyměňují objektivy.",
    veta: "Revolverový měnič je otočný kotouč, kterým se vyměňují objektivy.",
    poloha: "otočný kotouč na spodním konci tubusu",
    napoveda: "Hledaná část nese několik čoček najednou a dá se s ní otáčet.",
    sestry: ["objektiv", "tubus", "makrošroub"],
  },
  {
    nazev: "stolek",
    core: "je vodorovná deska, na kterou pokládáš sklíčko s preparátem",
    funkce: "Na tuto část se pokládá sklíčko s preparátem.",
    veta: "Stolek je deska, na kterou se klade sklíčko s preparátem.",
    poloha: "vodorovná deska s otvorem uprostřed mikroskopu",
    napoveda: "Hledaná část má uprostřed otvor, kterým prochází světlo zespodu.",
    sestry: ["podstavec", "podložní sklíčko", "svorky"],
  },
  {
    nazev: "svorky",
    pl: true,
    core: "přidržují sklíčko, aby se na stolku neposouvalo",
    funkce: "Přidržují sklíčko, aby na stolku neklouzalo.",
    veta: "Svorky jsou dvě pružné destičky, které drží sklíčko na stolku.",
    poloha: "dvě pružné kovové destičky na stolku",
    napoveda: "Hledáš dvě pružné kovové destičky přímo na desce pod objektivem.",
    sestry: ["stolek", "krycí sklíčko", "clona"],
  },
  {
    nazev: "clona",
    core: "řídí, kolik světla projde k preparátu",
    funkce: "Zmenšuje nebo zvětšuje otvor pro světlo.",
    veta: "Clona řídí, kolik světla projde k preparátu, sama světlo nepřivádí.",
    poloha: "pod stolkem a ovládá se malou páčkou",
    napoveda: "Hledaná část je pod stolkem a funguje podobně jako duhovka v oku, která zvětšuje a zmenšuje zornici.",
    sestry: ["zrcátko", "kondenzor", "objektiv"],
  },
  {
    nazev: "zrcátko",
    core: "odráží světlo z okna nebo z lampy nahoru do mikroskopu",
    funkce: "Odráží do mikroskopu světlo z okna nebo lampy.",
    veta: "Zrcátko světlo do mikroskopu přivádí, ale neřídí, kolik ho projde.",
    poloha: "úplně dole nad podstavcem a dá se natáčet",
    napoveda: "Hledaná část je úplně dole a natáčíš ji směrem ke světlu.",
    sestry: ["clona", "kondenzor", "okulár"],
  },
  {
    nazev: "makrošroub",
    core: "slouží k hrubému zaostření, kdy se objektiv posune o velký kus",
    funkce: "Hrubě zaostřuje, posouvá o velký kus.",
    veta: "Makrošroub je velký šroub na hrubé zaostření, posouvá o velký kus.",
    poloha: "velký šroub po straně ramene",
    napoveda: "Hledáš ten větší ze dvou šroubů po straně mikroskopu.",
    sestry: ["mikrošroub", "revolverový měnič", "rameno"],
  },
  {
    nazev: "mikrošroub",
    core: "slouží k jemnému doostření, kdy se objektiv posune jen nepatrně",
    funkce: "Jemně doostřuje, posouvá jen nepatrně.",
    veta: "Mikrošroub je malý šroub na jemné doostření, posouvá jen nepatrně.",
    poloha: "menší šroub po straně ramene",
    napoveda: "Hledáš ten menší ze dvou šroubů po straně mikroskopu.",
    sestry: ["makrošroub", "revolverový měnič", "clona"],
  },
  {
    nazev: "tubus",
    core: "je dutá trubice, která spojuje obě čočky nad sebou",
    funkce: "Spojuje okulár s objektivy jako trubice.",
    veta: "Tubus je trubice mezi okulárem a objektivy.",
    poloha: "trubice v horní části mikroskopu",
    napoveda: "Hledaná část je dutá a nahoře je v ní zasunutá čočka pro oko.",
    sestry: ["rameno", "revolverový měnič", "stolek"],
  },
  {
    nazev: "rameno",
    core: "je zahnutý držák, za který se mikroskop drží při přenášení",
    funkce: "Za tuto část se mikroskop drží při přenášení.",
    veta: "Rameno je zahnutý držák, za který se mikroskop nese.",
    poloha: "zahnutý díl, který spojuje tubus s podstavcem",
    napoveda: "Hledaná část je zahnutý díl mezi horní trubicí a spodní nohou.",
    sestry: ["podstavec", "tubus", "stolek"],
  },
  {
    nazev: "podstavec",
    core: "je těžká spodní noha, díky které mikroskop pevně stojí",
    funkce: "Nese celý mikroskop, aby pevně stál.",
    veta: "Podstavec je těžká spodní část, na které mikroskop stojí.",
    poloha: "úplně dole a dotýká se lavice",
    napoveda: "Hledaná část je úplně dole a dotýká se lavice.",
    sestry: ["rameno", "stolek", "zrcátko"],
  },
  {
    nazev: "kondenzor",
    core: "je pod stolkem a soustřeďuje světlo přesně do místa preparátu",
    funkce: "Soustřeďuje světlo přesně na preparát.",
    veta: "Kondenzor je soustava čoček pod stolkem, která světlo soustředí na preparát.",
    poloha: "pod stolkem a má v sobě malé čočky",
    napoveda: "Hledaná část má v sobě čočky a paprsky sbíhá podobně jako lupa.",
    sestry: ["clona", "zrcátko", "objektiv"],
  },
  {
    nazev: "podložní sklíčko",
    core: "",
    otazka: "Na co při přípravě mokrého preparátu kápneš kapku vody se vzorkem?",
    funkce: "Na toto sklíčko se kápne kapka vody se vzorkem.",
    veta: "Podložní sklíčko je silnější sklíčko, na které se kape vzorek.",
    poloha: "silnější obdélníkové sklíčko",
    napoveda: "Hledáš silnější obdélníkové sklíčko, které při přípravě leží dole.",
    sestry: ["krycí sklíčko", "stolek", "svorky"],
  },
  {
    nazev: "krycí sklíčko",
    core: "",
    otazka: "Čím při přípravě mokrého preparátu přikryješ kapku vody se vzorkem?",
    funkce: "Přikrývá kapku, aby byla plochá a nevysychala.",
    veta: "Krycí sklíčko je tenké čtvercové sklíčko, které kapku přikrývá.",
    poloha: "tenké čtvercové sklíčko",
    napoveda: "Hledáš tenké a křehké čtvercové sklíčko.",
    sestry: ["podložní sklíčko", "svorky", "clona"],
  },
];

const CAST = new Map(CASTI.map((k) => [k.nazev, k]));
const cast = (n: string): Cast => CAST.get(n)!;

const KONTRAST: Record<string, string> = {
  "objektiv|okulár": "Do okuláru se díváš, objektiv je dole u preparátu.",
  "makrošroub|mikrošroub": "Makrošroub posouvá o velký kus, mikrošroub jen nepatrně.",
  "clona|zrcátko": "Zrcátko světlo přivádí, clona řídí, kolik ho projde.",
  "clona|kondenzor": "Kondenzor světlo soustřeďuje, clona řídí, kolik ho projde.",
  "kondenzor|zrcátko": "Zrcátko světlo přivádí, kondenzor ho soustřeďuje na preparát.",
  "krycí sklíčko|podložní sklíčko": "Na podložní sklíčko se kape, krycí sklíčko kapku přikrývá.",
};
const kontrast = (a: string, b: string) => KONTRAST[[a, b].sort().join("|")] ?? "";
const dela = (k: Cast) => (k.pl ? "dělají" : "dělá");

// L1a — která část dělá tohle
function l1Cast(k: Cast): PracticeTask | null {
  const otazka = k.otazka ?? (k.pl ? `Které části mikroskopu ${k.core}?` : `Která část mikroskopu ${k.core}?`);
  const core = k.otazka ? `se hodí k tomuto kroku přípravy: ${k.funkce.charAt(0).toLowerCase()}${k.funkce.slice(1, -1)}` : k.core;
  return choice(
    otazka,
    k.nazev,
    k.sestry.map((s) => ({ value: s, why: kontrast(k.nazev, s) || cast(s).veta })),
    {
      hints: [
        k.napoveda,
        `U každé nabízené možnosti si nejdřív řekni, kde na mikroskopu je a co dělá. Hledáš ${k.pl ? "ty části, které" : "tu, která"} ${core}.`,
      ],
      explanation: `${k.veta} Ostatní nabízené části vypadají podobně nebo jsou blízko, ale dělají něco jiného.`,
    },
  );
}

// L1b — k čemu slouží část
function l1Funkce(k: Cast): PracticeTask | null {
  return choice(
    `K čemu slouží ${k.nazev} u mikroskopu?`,
    k.funkce,
    k.sestry.map((s) => {
      const d = cast(s);
      return { value: d.funkce, why: `Tohle ${dela(d)} ${d.nazev}, ne ${k.nazev}. ${kontrast(k.nazev, s) || k.veta}` };
    }),
    {
      hints: [
        `${cap(k.nazev)} ${k.pl ? "jsou" : "je"} ${k.poloha}. Co asi dělá část na takovém místě?`,
        `Každá nabízená možnost popisuje jinou součástku. U každé si řekni, o kterou jde, a vyber tu, která patří k součástce „${k.nazev}“.`,
      ],
      explanation: `${k.veta} Ostatní možnosti popisují jiné části mikroskopu.`,
    },
  );
}

// L1c — jednoduchý součin zvětšení
/** Všech devět sestav z L1 (okulár 5/10/15 × objektiv 4/10/40), prostřídané. */
const SESTAVY_L1: [number, number][] = [
  [10, 40], [5, 4], [15, 10], [10, 4], [5, 40], [15, 4], [10, 10], [5, 10], [15, 40],
];

function l1Zvetseni([ok, ob]: [number, number]): PracticeTask | null {
  const z = ok * ob;
  return choice(
    `Mikroskop má okulár ${x(ok)} a objektiv ${x(ob)}. Jaké je celkové zvětšení?`,
    x(z),
    [
      { value: x(ok + ob), why: `Tady jsou čísla sečtená: ${c(ok)} + ${c(ob)} = ${c(ok + ob)}. Zvětšení okuláru a objektivu se ale násobí, ne sčítá.` },
      { value: x(ob), why: "To je jen zvětšení objektivu. Obraz zvětšuje ještě okulár, proto se obě čísla násobí." },
      { value: x(z * 10), why: `Na konci přebývá nula. Znásob ${c(ok)} · ${c(ob)} znovu a pečlivě spočítej nuly.` },
      { value: x(ok), why: "To je jen zvětšení okuláru. Obraz zvětšuje i objektiv, proto se obě čísla násobí." },
    ],
    {
      hints: [
        `Okulár zvětšuje ${krat(ok)}, objektiv ${krat(ob)}. Jakou početní operací spojíš dvě zvětšení, která jdou za sebou?`,
        "Objektiv zvětší preparát a okulár pak ten zvětšený obraz zvětší ještě jednou. Proto je celkové zvětšení zvětšení okuláru krát zvětšení objektivu.",
      ],
      solutionSteps: [
        "Celkové zvětšení = zvětšení okuláru · zvětšení objektivu.",
        `${c(ok)} · ${c(ob)} = ${c(z)}, obraz je tedy ${krat(z)} větší než preparát.`,
      ],
      explanation: `Objektiv zvětší preparát ${krat(ob)} a okulár ten obraz zvětší ještě ${krat(ok)}. Zvětšení se proto násobí: ${c(ok)} · ${c(ob)} = ${c(z)}.`,
    },
  );
}

function genL1(st: Stav): PracticeTask | null {
  const typ = st.i++ % 3;
  if (typ === 0) return l1Cast(CASTI[st.a++ % CASTI.length]);
  if (typ === 1) return l1Funkce(CASTI[st.b++ % CASTI.length]);
  return l1Zvetseni(SESTAVY_L1[st.c++ % SESTAVY_L1.length]);
}

// ── L2 ───────────────────────────────────────────────────────────────────
const OBJEKTY = [
  "blánu z cibule",
  "kapku vody z tůňky",
  "lístek mechu",
  "lístek vodního moru",
  "pyl z lísky",
  "chloupky z listu kopřivy",
];

interface Jmeno {
  j: string;
  rod: "m" | "f";
}
/** Pro přípravu preparátu jen pevné vzorky — voda z tůňky se na sklíčko kape rovnou. */
const PEVNE_OBJEKTY = OBJEKTY.filter((o) => o !== "kapku vody z tůňky");

const JMENA: Jmeno[] = [
  { j: "Jana", rod: "f" },
  { j: "Tomáš", rod: "m" },
  { j: "Eliška", rod: "f" },
  { j: "Matěj", rod: "m" },
  { j: "Klára", rod: "f" },
  { j: "Vojta", rod: "m" },
];
const minule = (jm: Jmeno, tvar: string) => (jm.rod === "f" ? `${tvar}a` : tvar);

const KONTEXTY = ["V kroužku přírodopisu", "Na hodině přírodopisu", "Doma u vlastního mikroskopu", "Na exkurzi v laboratoři"];

interface Situace {
  otazka: (obj: string) => string;
  klic: string;
  distr: Distractor[];
  napoveda: (obj: string) => string;
  pravidlo: string;
  proc: string;
}

const POSTUP: Situace[] = [
  {
    otazka: (o) => `Chceš pozorovat ${o}. Preparát už leží na stolku pod svorkami. Jaký objektiv nastavíš jako první?`,
    klic: "Objektiv s nejmenším zvětšením",
    distr: [
      { value: "Objektiv s největším zvětšením", why: "Při největším zvětšení vidíš jen malý kousek a preparát se hledá těžko. Objektiv je navíc těsně u sklíčka a snadno ho rozbiješ." },
      { value: "Objektiv se středním zvětšením", why: "Na začátku potřebuješ co největší přehled. Ten dá jen nejslabší objektiv, silnější se nasazují až potom." },
      { value: "Objektiv, který je zrovna nasazený", why: "Není to jedno. Kdyby byl nasazený silný objektiv, preparát bys těžko našel a mohl bys rozbít sklíčko." },
    ],
    napoveda: (o) => `Než začneš pozorovat ${o}, rozmysli si: při kterém zvětšení uvidíš největší část preparátu?`,
    pravidlo: "Pozorování se vždy začíná tím zvětšením, při kterém je vidět nejvíc a objektiv je nejdál od sklíčka. Silnější objektiv se nasazuje, až když máš to, co hledáš, uprostřed.",
    proc: "Pozorování se začíná nejmenším zvětšením: vidíš největší část preparátu, snadno najdeš, co hledáš, a objektiv je daleko od sklíčka.",
  },
  {
    otazka: (o) => `Chceš pozorovat ${o}. Preparát je hotový a mikroskop stojí na lavici. Kam preparát položíš?`,
    klic: "Na stolek a přichytíš ho svorkami",
    distr: [
      { value: "Na podstavec, co nejblíž ke světlu", why: "Podstavec jen nese mikroskop. Světlo prochází preparátem až nad otvorem ve stolku." },
      { value: "Na stolek a svorky nepoužiješ", why: "Bez svorek sklíčko na stolku klouže a při posouvání ztratíš pozorované místo." },
      { value: "Na zrcátko, ať je dobře nasvícený", why: "Zrcátko jen odráží světlo nahoru. Preparát patří výš, na stolek nad otvor." },
    ],
    napoveda: (o) => `Aby šlo pozorovat ${o}, musí preparát ležet tam, kudy prochází světlo pod objektivem. Která část má uprostřed otvor?`,
    pravidlo: "Preparát leží na části s otvorem, kterým prochází světlo, a aby se nehýbal, přidrží se kovovými destičkami.",
    proc: "Preparát se pokládá na stolek nad otvor, kterým prochází světlo, a přichytí se svorkami, aby neklouzal.",
  },
  {
    otazka: (o) => `Na stolku leží preparát, na kterém chceš pozorovat ${o}, a máš nastavené nejmenší zvětšení. Jak přiblížíš objektiv ke sklíčku?`,
    klic: "Makrošroubem a díváš se přitom ze strany",
    distr: [
      { value: "Makrošroubem a díváš se přitom do okuláru", why: "Při pohledu do okuláru nevidíš, jak blízko je objektiv ke sklíčku, a snadno do něj narazíš." },
      { value: "Mikrošroubem a díváš se přitom ze strany", why: "Mikrošroub posouvá jen nepatrně, přiblížení by trvalo velmi dlouho. Na velký posun je makrošroub." },
      { value: "Rukou zvedneš sklíčko až k objektivu", why: "Sklíčko má ležet na stolku pod svorkami. Vzdálenost se nastavuje šroubem, ne rukou." },
    ],
    napoveda: (o) => `Chceš pozorovat ${o}. Objektiv se má dostat těsně nad preparát, ale nesmí do něj narazit. Odkud nejlépe uvidíš mezeru mezi nimi?`,
    pravidlo: "Na velký posun slouží větší ze dvou šroubů. Mezeru mezi objektivem a sklíčkem ale uvidíš jen zboku, do okuláru ji nevidíš.",
    proc: "Objektiv se přibližuje makrošroubem, protože posouvá o velký kus, a díváš se ze strany, abys viděl mezeru a nenarazil do sklíčka.",
  },
  {
    otazka: (o) => `Objektiv je už těsně nad sklíčkem, na kterém chceš pozorovat ${o}. Co uděláš jako další krok?`,
    klic: "Díváš se do okuláru a objektiv pomalu oddaluješ",
    distr: [
      { value: "Díváš se do okuláru a objektiv dál přibližuješ", why: "Objektiv je už u sklíčka. Dalším přibližováním do něj narazíš a sklíčko rozbiješ." },
      { value: "Díváš se do okuláru a hned nasadíš silný objektiv", why: "Nejdřív musíš mít obraz ostrý při malém zvětšení. Silný objektiv se nasazuje až potom." },
      { value: "Díváš se ze strany a objektiv přitlačíš na sklíčko", why: "Objektiv se sklíčka nesmí dotknout, poškrábal by se a sklíčko by prasklo." },
    ],
    napoveda: (o) => `Chceš pozorovat ${o}, ale blíž ke sklíčku už objektiv jít nemůže. Kterým směrem ho tedy budeš posouvat, když hledáš ostrý obraz?`,
    pravidlo: "Zaostřuje se vždy směrem od sklíčka: díváš se do okuláru a objektiv vzdaluješ, dokud obraz nezaostří. Tak do sklíčka nikdy nenarazíš.",
    proc: "Když je objektiv u sklíčka, zaostřuje se oddalováním při pohledu do okuláru. Objektiv se tak od sklíčka vzdaluje a nemůže do něj narazit.",
  },
  {
    otazka: (o) => `Pozoruješ ${o} při největším zvětšení a obraz je trochu neostrý. Čím ho doostříš?`,
    klic: "Jen mikrošroubem a jemným pootočením",
    distr: [
      { value: "Makrošroubem a pořádným otočením", why: "Makrošroub posouvá o velký kus. Silný objektiv je těsně nad sklíčkem a snadno do něj narazí." },
      { value: "Clonou a jejím pootevřením", why: "Clona mění hlavně to, kolik světla projde. Rozostřený obraz jí nezaostříš, to jde jen šroubem." },
      { value: "Revolverovým měničem a pootočením", why: "Revolverový měnič vyměňuje objektivy, obraz jím nedoostříš." },
    ],
    napoveda: (o) => `Když pozoruješ ${o} při největším zvětšení, je objektiv těsně nad preparátem. Který šroub posouvá tak málo, že nehrozí náraz?`,
    pravidlo: "Při velkém zvětšení se smí točit jen menším ze dvou šroubů, protože posouvá nepatrně a objektiv do sklíčka nenarazí.",
    proc: "Při velkém zvětšení se doostřuje jen mikrošroubem. Posouvá nepatrně, takže objektiv těsně nad sklíčkem nenarazí.",
  },
  {
    otazka: (o) => `Máš přenést mikroskop ze skříně na lavici, kde budeš pozorovat ${o}. Jak ho poneseš?`,
    klic: "Oběma rukama, za rameno a pod podstavcem",
    distr: [
      { value: "Jednou rukou za rameno, druhou neseš sklíčka", why: "Mikroskop je těžký a jednou rukou ho neudržíš jistě. Sklíčka doneseš zvlášť." },
      { value: "Oběma rukama za tubus s okulárem", why: "Za tubus se mikroskop nenosí, okulár z něj může vypadnout a tubus se poškodí." },
      { value: "Jednou rukou za stolek jako tašku", why: "Stolek není držadlo. Mikroskop by se mohl vysmeknout a ohnout." },
    ],
    napoveda: (o) => `Než začneš pozorovat ${o}, mikroskop musí bezpečně doputovat na lavici. Kolik rukou na to potřebuješ?`,
    pravidlo: "Mikroskop se nese oběma rukama: jedna drží zahnutý držák, druhá podpírá těžkou spodní část zespodu.",
    proc: "Mikroskop je těžký a křehký, proto se nese oběma rukama: jednou za rameno, druhou pod podstavcem.",
  },
];

const PREPARAT: Situace[] = [
  {
    otazka: (o) => `Chystáš mokrý preparát, na kterém chceš pozorovat ${o}. Co uděláš jako první?`,
    klic: "Kápneš vodu doprostřed podložního sklíčka",
    distr: [
      { value: "Přiložíš krycí sklíčko na suché podložní", why: "Kapka se vzorkem musí být na sklíčku dřív. Pod přiložené krycí sklíčko už ji nedostaneš." },
      { value: "Položíš prázdné sklíčko na stolek a zaostříš", why: "Na prázdném sklíčku není co zaostřit. Preparát se nejdřív připraví a pak se dává pod mikroskop." },
      { value: "Kápneš vodu na krycí sklíčko a otočíš ho", why: "Krycí sklíčko je tenké a křehké. Kapka se dává na silnější podložní sklíčko." },
    ],
    napoveda: (o) => `Mokrý preparát má tři vrstvy: dole sklíčko, uprostřed kapka se vzorkem, nahoře další sklíčko. Čím začneš, když chceš pozorovat ${o}?`,
    pravidlo: "Mokrý preparát se staví odspodu: nejdřív voda na silnější sklíčko, do ní vzorek a teprve nakonec tenké sklíčko navrch.",
    proc: "Mokrý preparát se připravuje odspodu: na podložní sklíčko se kápne voda, do ní se vloží vzorek a nakonec se přiloží krycí sklíčko.",
  },
  {
    otazka: (o) => `Na podložním sklíčku máš kapku vody a v ní ${o}. Jak přiložíš krycí sklíčko?`,
    klic: "Šikmo od kraje kapky a pomalu ho spustíš",
    distr: [
      { value: "Rovně shora a pevně ho přitlačíš prstem", why: "Při přiložení rovně se pod sklíčkem uzavře vzduch a vzniknou bubliny. Tlakem navíc tenké sklíčko praskne." },
      { value: "Rovně shora a necháš ho na kapku spadnout", why: "Když sklíčko dopadne celou plochou, vzduch nemá kudy uniknout a pod sklíčkem zůstanou bubliny." },
      { value: "Šikmo, ale kapku vody předtím odsaješ", why: "Mokrý preparát vodu potřebuje. Bez ní vzorek rychle vyschne a pod sklíčkem bude plno vzduchu." },
    ],
    napoveda: (o) => `Chceš pozorovat ${o}, a proto pod krycím sklíčkem nesmí zůstat vzduch. Jak sklíčko přiložit, aby vzduch měl kudy uniknout?`,
    pravidlo: "Když tenké sklíčko dopadne na kapku celou plochou najednou, vzduch nemá kudy utéct. Voda ho musí vytlačovat postupně z jedné strany na druhou.",
    proc: "Krycí sklíčko se přikládá šikmo od kraje kapky a pomalu se spouští, aby vzduch unikl a pod sklíčkem nezůstaly bubliny.",
  },
];

function l2Situace(s: Situace, obj: string): PracticeTask | null {
  return choice(s.otazka(obj), s.klic, s.distr, {
    hints: [s.napoveda(obj), `${s.pravidlo} Platí to stejně, ať pozoruješ ${obj}, nebo cokoli jiného.`],
    explanation: s.proc,
  });
}

const OK2 = [5, 8, 10, 12, 15, 16, 20];
const OB2 = [4, 10, 20, 40, 60, 100];

function l2Zvetseni(): PracticeTask | null {
  const jm = pick(JMENA);
  const ok = pick(OK2);
  const ob = pick(OB2.slice(1));
  const pred = pick(OB2.filter((v) => v < ob));
  const z = ok * ob;
  // Školní světelný mikroskop nad 1 000× nezvětšuje.
  if (z > 1000) return null;
  return choice(
    `${pick(KONTEXTY)} ${minule(jm, "pozoroval")} ${jm.j} ${pick(OBJEKTY)} s okulárem ${x(ok)} a objektivem ${x(pred)}. Teď ${minule(jm, "přepnul")} na objektiv ${x(ob)}. Jak velké je teď celkové zvětšení?`,
    x(z),
    [
      { value: x(ok + ob), why: `Tady jsou čísla sečtená: ${c(ok)} + ${c(ob)}. Zvětšení okuláru a objektivu se násobí, ne sčítá.` },
      { value: x(ok * pred), why: `To je zvětšení s původním objektivem ${x(pred)}. Po přepnutí se počítá s novým objektivem.` },
      { value: x(ob), why: "To je jen zvětšení nového objektivu. Obraz zvětšuje ještě okulár, proto se obě čísla násobí." },
      { value: x(z * 10), why: `Na konci přebývá nula. Znásob ${c(ok)} · ${c(ob)} znovu a pečlivě spočítej nuly.` },
    ],
    {
      hints: [
        `Po přepnutí platí okulár ${x(ok)} a nový objektiv ${x(ob)}. Který objektiv ze zadání už nehraje roli?`,
        "Celkové zvětšení se počítá z okuláru a z objektivu, který je právě nasazený: zvětšení okuláru krát zvětšení objektivu. Původní objektiv do výpočtu nepatří.",
      ],
      solutionSteps: [
        `Nasazený je okulár ${x(ok)} a objektiv ${x(ob)}, původní objektiv ${x(pred)} už neplatí.`,
        `Celkové zvětšení = ${c(ok)} · ${c(ob)} = ${c(z)}.`,
      ],
      explanation: `Po přepnutí se počítá s novým objektivem. Zvětšení okuláru a objektivu se násobí: ${c(ok)} · ${c(ob)} = ${c(z)}.`,
    },
  );
}

interface Sestava {
  o: number;
  b: number;
  p: number;
  s: number;
}
const SESTAVY: Sestava[] = [5, 10, 15, 20]
  .flatMap((o) => OB2.map((b) => ({ o, b, p: o * b, s: o + b })))
  .filter((v) => v.p <= 1000);
const sestava = (v: Sestava) => `okulár ${x(v.o)} a objektiv ${x(v.b)}`;

function l2Sestavy(): PracticeTask | null {
  const jm = pick(JMENA);
  const obj = pick(OBJEKTY);
  const vyber = pickN(SESTAVY, 4);
  if (new Set(vyber.map((v) => v.p)).size !== 4) return null;
  const maxP = Math.max(...vyber.map((v) => v.p));
  const klic = vyber.find((v) => v.p === maxP)!;
  const maxS = Math.max(...vyber.map((v) => v.s));
  const nejSoucet = vyber.filter((v) => v.s === maxS);
  // Past: sestava s největším součtem nesmí být ta správná.
  if (nejSoucet.length !== 1 || nejSoucet[0] === klic) return null;
  const maxB = Math.max(...vyber.map((v) => v.b));
  return choice(
    `${jm.j} si pro ${obj} může vybrat jednu ze čtyř sestav okuláru a objektivu. Která sestava zvětšuje nejvíc?`,
    sestava(klic),
    vyber
      .filter((v) => v !== klic)
      .map((v) => ({
        value: sestava(v),
        why:
          v === nejSoucet[0]
            ? `Tahle sestava má největší součet čísel (${c(v.o)} + ${c(v.b)} = ${c(v.s)}). Zvětšení se ale násobí: ${c(v.o)} · ${c(v.b)} = ${c(v.p)}, a jiná sestava dá víc.`
            : v.b === maxB
              ? `Tahle sestava má nejsilnější objektiv, ale slabší okulár. Rozhoduje součin obou: ${c(v.o)} · ${c(v.b)} = ${c(v.p)}, a jiná sestava dá víc.`
              : `Tahle sestava dá ${c(v.o)} · ${c(v.b)} = ${c(v.p)}. Jiná sestava dá větší součin.`,
      })),
    {
      hints: [
        `${jm.j} nemá vybírat podle jednoho velkého čísla. U každé sestavy pro ${obj} nejdřív spočítej celkové zvětšení a pak výsledky porovnej.`,
        "Celkové zvětšení sestavy je zvětšení okuláru krát zvětšení objektivu. Pozor, sestava s největším součtem čísel nemusí mít největší součin. Spočítej všechny čtyři součiny.",
      ],
      solutionSteps: vyber.map((v) => `${sestava(v)}: ${c(v.o)} · ${c(v.b)} = ${c(v.p)}`),
      explanation: `Zvětšení okuláru a objektivu se násobí: ${vyber.map((v) => `${c(v.o)} · ${c(v.b)} = ${c(v.p)}`).join(", ")}. Největší součin má sestava ${sestava(klic)}.`,
    },
  );
}

function genL2(st: Stav): PracticeTask | null {
  const typ = st.i++ % 4;
  if (typ === 0) return l2Situace(POSTUP[st.a++ % POSTUP.length], pick(OBJEKTY));
  if (typ === 1) return l2Situace(PREPARAT[st.b++ % PREPARAT.length], pick(PEVNE_OBJEKTY));
  if (typ === 2) return l2Zvetseni();
  return l2Sestavy();
}

// ── L3 ───────────────────────────────────────────────────────────────────
const RADA_OB = [4, 10, 20, 40, 60, 100];
const RADA_OK = [5, 8, 10, 12, 15, 16, 20];

// L3a — obrácený výpočet
function l3Obraceny(): PracticeTask | null {
  const ok = pick(RADA_OK);
  const ob = pick(RADA_OB);
  if (ok === ob) return null;
  const t = ok * ob;
  if (t > 1000) return null;
  const hledamObjektiv = Math.random() < 0.5;
  const dane = hledamObjektiv ? ok : ob;
  const klic = hledamObjektiv ? ob : ok;
  // „320×“ obsahuje „20×“ — klíč by se objevil ve znění otázky i nápovědy.
  if (x(t).includes(x(klic))) return null;
  const danyNazev = hledamObjektiv ? "okulár" : "objektiv";
  const hledany = hledamObjektiv ? "objektiv" : "okulár";
  const d: Distractor[] = [
    { value: x(t - dane), why: `Tady je zvětšení odečtené: ${c(t)} − ${c(dane)}. Okulár a objektiv se ale násobí, a zpátky se proto dělí.` },
  ];
  if (t % 10 === 0 && dane !== 10) {
    d.push({ value: x(t / 10), why: `Škrtnutí jedné nuly by platilo jen pro zvětšení 10×. Tady ${danyNazev} zvětšuje ${x(dane)}, takže se dělí číslem ${c(dane)}.` });
  }
  d.push(
    { value: x(t + dane), why: "Sčítat tu nejde. Celkové zvětšení je součin, a zpátky se proto dělí." },
    { value: x(dane), why: `To je zvětšení, které má ${danyNazev} podle zadání. Hledá se ${hledany}.` },
    { value: x(t * dane), why: "Tady je zvětšení ještě jednou vynásobené. Zpátky se ale dělí, ne násobí." },
  );
  return choice(
    `Celkové zvětšení mikroskopu je ${x(t)} a ${danyNazev} zvětšuje ${x(dane)}. Jaký ${hledany} je nasazený?`,
    x(klic),
    d,
    {
      hints: [
        `Celkové zvětšení ${x(t)} vzniklo spojením okuláru a objektivu, ${danyNazev} z toho dává ${x(dane)}. Jakou operací se spojují, a jaká operace ji tedy vrací zpátky?`,
        `Celkové zvětšení je zvětšení okuláru krát zvětšení objektivu. Když jedno z nich chybí, vyděl celkové zvětšení ${x(t)} tím, které znáš (tady ${danyNazev}em ${x(dane)}). Výsledek si ověř násobením.`,
      ],
      solutionSteps: [
        `Celkové zvětšení = okulár · objektiv, takže ${hledany} = celkové zvětšení : ${danyNazev}.`,
        `${c(t)} : ${c(dane)} = ${c(klic)}.`,
        `Zkouška: ${c(dane)} · ${c(klic)} = ${c(t)}.`,
      ],
      explanation: `Zvětšení okuláru a objektivu se násobí, zpátky se proto dělí: ${c(t)} : ${c(dane)} = ${c(klic)}. Nasazený ${hledany} tedy zvětšuje ${x(klic)}.`,
    },
  );
}

// L3b — kolikrát se zvětšení změnilo
const DVOJICE: [number, number][] = [
  [4, 20], [4, 40], [10, 40], [10, 20], [10, 100], [20, 40], [20, 60], [10, 60], [20, 100], [4, 100],
];

function l3Kolikrat(): PracticeTask | null {
  const jm = pick(JMENA);
  const ok = pick([5, 10, 15, 20]);
  const [a, b] = pick(DVOJICE);
  const k = b / a;
  if (ok * b > 1000) return null;
  return choice(
    `${jm.j} ${minule(jm, "pozoroval")} ${pick(OBJEKTY)} s okulárem ${x(ok)} a objektivem ${x(a)}. Pak ${minule(jm, "přepnul")} na objektiv ${x(b)}. Kolikrát je teď celkové zvětšení větší než předtím?`,
    krat(k),
    [
      { value: krat(b - a), why: `Tady jsou objektivy odečtené: ${c(b)} − ${c(a)} = ${c(b - a)}. To říká, o kolik je číslo větší, ne kolikrát. „Kolikrát“ se zjistí dělením.` },
      { value: krat(k * ok), why: "Okulár se nezměnil, takže změnu způsobila jen výměna objektivu. Okulárem už znovu nenásob." },
      { value: krat(b), why: `${x(b)} je zvětšení nového objektivu, ne změna. Porovnej nové a staré zvětšení dělením.` },
      { value: krat(ok * b), why: "To je nové celkové zvětšení, ne to, kolikrát vzrostlo. Nové zvětšení se ještě musí vydělit starým." },
    ],
    {
      hints: [
        `Spočítej celkové zvětšení před přepnutím a po něm. Okulár ${x(ok)} zůstal stejný, objektiv se změnil z ${x(a)} na ${x(b)}.`,
        `„Kolikrát“ se zjišťuje dělením: nové celkové zvětšení vyděl starým. Protože ${jm.j} ${minule(jm, "nechal")} stejný okulár, stačí vydělit zvětšení nového objektivu zvětšením starého. Okulár ${x(ok)} tedy do výpočtu vůbec nemusíš zahrnout.`,
      ],
      solutionSteps: [
        `Předtím: ${c(ok)} · ${c(a)} = ${c(ok * a)}. Potom: ${c(ok)} · ${c(b)} = ${c(ok * b)}.`,
        `${c(ok * b)} : ${c(ok * a)} = ${c(k)}, stejně jako ${c(b)} : ${c(a)} = ${c(k)}.`,
      ],
      explanation: `Okulár se nezměnil, takže celkové zvětšení vzrostlo tolikrát, kolikrát je silnější nový objektiv: ${c(b)} : ${c(a)} = ${c(k)}. Zvětšení je teď ${krat(k)} větší.`,
    },
  );
}

// L3c — převrácený obraz
interface Utvar {
  acc: string;
  nom: string;
  suf: string;
}
const UTVARY: Utvar[] = [
  { acc: "buňku cibule", nom: "buňka", suf: "a" },
  { acc: "trepku", nom: "trepka", suf: "a" },
  { acc: "měňavku", nom: "měňavka", suf: "a" },
  { acc: "zrnko pylu", nom: "zrnko", suf: "o" },
  { acc: "vířníka", nom: "vířník", suf: "" },
];
type Strana = "L" | "P" | "H" | "D";
const OKRAJ: Record<Strana, string> = { L: "levého", P: "pravého", H: "horního", D: "dolního" };
const SMER: Record<Strana, string> = { L: "doleva", P: "doprava", H: "nahoru", D: "dolů" };
const OPAK: Record<Strana, Strana> = { L: "P", P: "L", H: "D", D: "H" };

function l3Obraz(): PracticeTask | null {
  const u = pick(UTVARY);
  const s = pick(["L", "P", "H", "D"] as Strana[]);
  const pohybObrazu = OPAK[s];
  return choice(
    `V okuláru vidíš ${u.acc} u ${OKRAJ[s]} okraje zorného pole. Kterým směrem posuneš sklíčko, aby se ${u.nom} ${`dostal${u.suf}`} doprostřed?`,
    `Sklíčko posunu ${SMER[s]}`,
    [
      { value: `Sklíčko posunu ${SMER[pohybObrazu]}`, why: "Tímhle směrem se má pohnout obraz, ne sklíčko. Mikroskop obraz převrací, proto se obraz posune opačně než sklíčko." },
      { value: "Sklíčko nechám a pootočím makrošroubem", why: "Makrošroub jen zaostřuje, obraz do stran neposouvá. Posunout se musí sklíčko." },
      { value: "Sklíčko posunu doprostřed stolku, obraz se srovná sám", why: "Obraz se sám nesrovná a na směru záleží. Obraz se v zorném poli pohybuje opačně než sklíčko, proto sklíčko posuneš opačně, než se má pohnout obraz." },
      { value: "Sklíčko nechám a pootočím objektivem", why: "Otáčením se mění objektivy, obraz se tím do stran neposune. Posunout se musí sklíčko." },
    ],
    {
      hints: [
        `${cap(u.nom)} je u ${OKRAJ[s]} okraje. Kterým směrem se musí pohnout obraz, aby se ${`dostal${u.suf}`} doprostřed?`,
        `Mikroskop obraz převrací, takže se obraz v zorném poli pohybuje opačně než sklíčko. Nejdřív urči, kam se má posunout obraz, aby se ${u.nom} ${`dostal${u.suf}`} od ${OKRAJ[s]} okraje doprostřed, a sklíčko pak posuň přesně obráceně.`,
      ],
      explanation: `Mikroskop obraz převrací, proto se obraz pohybuje opačně než sklíčko. ${cap(u.nom)} je u ${OKRAJ[s]} okraje, obraz se tedy musí pohnout ${SMER[pohybObrazu]}, a sklíčko proto posuneš ${SMER[s]}.`,
    },
  );
}

// L3d — diagnóza potíže
interface Diagnoza {
  otazka: (o: string) => string;
  klic: string;
  distr: Distractor[];
  napoveda: string;
  pravidlo: string;
  proc: string;
}
const DIAGNOZY: Diagnoza[] = [
  {
    otazka: (o) => `Pozoruješ ${o}, přepneš na objektiv s největším zvětšením a obraz náhle ztmavne. Co pomůže?`,
    klic: "Víc otevřít clonu nebo přidat světlo",
    distr: [
      { value: "Pootočit makrošroubem, až se rozjasní", why: "Makrošroub mění ostrost, ne jas. Při velkém zvětšení navíc hrozí, že objektiv narazí do sklíčka." },
      { value: "Víc přivřít clonu, aby byl obraz ostřejší", why: "Přivřená clona pustí ještě méně světla a obraz ztmavne víc. Při větším zvětšení se clona musí otevřít, ne zavřít." },
      { value: "Vyměnit krycí sklíčko za tenčí", why: "Tloušťka krycího sklíčka jas skoro nezmění. Tmavší obraz je důsledek většího zvětšení." },
    ],
    napoveda: "Obraz ztmavl hned po přepnutí na silnější objektiv. Která část mikroskopu řídí, kolik světla projde?",
    pravidlo: "Při větším zvětšení se stejné světlo rozloží na menší kousek preparátu zvětšený do velkého obrazu, a obraz proto tmavne. Pomůže jen víc světla.",
    proc: "Při větším zvětšení obraz tmavne. Pomůže víc otevřít clonu nebo přidat světlo (natočit zrcátko, zesílit lampu).",
  },
  {
    otazka: (o) => `Pozoruješ ${o} při velkém zvětšení, ale místo ostrého obrazu vidíš jen rozmazanou šmouhu. Co uděláš?`,
    klic: "Doostříš obraz jemně mikrošroubem",
    distr: [
      { value: "Doostříš obraz rychle makrošroubem", why: "Při velkém zvětšení je objektiv těsně nad sklíčkem. Makrošroub posouvá o velký kus a objektiv by narazil." },
      { value: "Víc otevřeš clonu, aby bylo světleji", why: "Clonou se obraz nezaostří. Rozmazaný obraz se musí doostřit šroubem." },
      { value: "Přepneš na ještě větší zvětšení", why: "Neostrý obraz se větším zvětšením nespraví, jen se víc rozmaže." },
    ],
    napoveda: "Rozmazaný obraz znamená, že objektiv není ve správné výšce. Čím se ta výška mění při velkém zvětšení?",
    pravidlo: "Neostrost se spraví zaostřením. Při velkém zvětšení je objektiv blízko sklíčka, proto se smí točit jen šroubem, který posouvá nepatrně.",
    proc: "Rozmazaný obraz je neostrý. Při velkém zvětšení se doostřuje jen mikrošroubem, protože posouvá nepatrně a objektiv nenarazí.",
  },
  {
    otazka: (o) => `Pozoruješ ${o} a v obraze se objevily černé kroužky se světlým středem. Co to nejspíš je?`,
    klic: "Vzduchové bubliny pod krycím sklíčkem",
    distr: [
      { value: "Buňky s velkým tmavým jádrem", why: "Buňky nemají dokonale kulatý černý obrys se světlým středem. Tak vypadá vzduch uzavřený ve vodě." },
      { value: "Zrnka prachu na čočce okuláru", why: "Prach na okuláru vypadá jako drobné tečky a otáčí se s okulárem. Kroužky se světlým středem jsou bubliny." },
      { value: "Stíny od svorek na stolku", why: "Svorky drží sklíčko mimo zorné pole, jejich stín do obrazu nezasahuje." },
    ],
    napoveda: "Kroužky mají silný tmavý obrys a světlý střed. Co mohlo zůstat uzavřené ve vodě pod tenkým sklíčkem?",
    pravidlo: "Když se krycí sklíčko přiloží špatně, uzavře se pod ním vzduch. Vzduch ve vodě vypadá v mikroskopu jako kroužek s černým obrysem.",
    proc: "Černé kroužky se světlým středem jsou vzduchové bubliny, které zůstaly pod krycím sklíčkem, když se nepřikládalo šikmo.",
  },
  {
    otazka: (o) => `Pozoruješ ${o} a obraz kazí vzduchové bubliny pod krycím sklíčkem. Jak jim příště předejdeš?`,
    klic: "Krycí sklíčko přiložíš šikmo od kraje kapky",
    distr: [
      { value: "Krycí sklíčko přitlačíš prstem silněji", why: "Tlakem bubliny nezmizí a tenké sklíčko praskne. Vzduch musí uniknout už při přikládání." },
      { value: "Krycí sklíčko položíš rovně na kapku", why: "Když sklíčko dopadne celou plochou, vzduch nemá kudy uniknout. Právě tak bubliny vznikají." },
      { value: "Kápneš na sklíčko méně vody", why: "Méně vody bublinám nepředejde, spíš naopak: když vody nestačí, zůstane pod krycím sklíčkem vzduch snáz a vzorek vyschne. Rozhoduje hlavně, jak se sklíčko přiloží." },
    ],
    napoveda: "Bubliny vznikají při přikládání krycího sklíčka. Jak ho přiložit, aby vzduch měl kudy uniknout?",
    pravidlo: "Bubliny vznikají, když tenké sklíčko dopadne na kapku celou plochou najednou a vzduch zůstane uvězněný. Vymysli, jak ho pokládat, aby voda vytlačovala vzduch postupně do strany.",
    proc: "Bublinám se předejde tak, že se krycí sklíčko přiloží šikmo od kraje kapky a pomalu se spustí, takže vzduch unikne.",
  },
  {
    otazka: (o) => `Spolužák pozoroval ${o} při největším zvětšení a sklíčko se mu rozbilo. Co nejspíš udělal špatně?`,
    klic: "Točil makrošroubem a díval se do okuláru",
    distr: [
      { value: "Použil příliš tenké krycí sklíčko", why: "Krycí sklíčka jsou tenká vždycky. Rozbije je až objektiv, který do nich narazí." },
      { value: "Nechal clonu otevřenou naplno", why: "Clona mění jen množství světla, sklíčko rozbít nemůže." },
      { value: "Kápl na podložní sklíčko moc vody", why: "Přebytek vody sklíčko nerozbije, nanejvýš zamokří stolek." },
    ],
    napoveda: "Při největším zvětšení je objektiv těsně nad sklíčkem. Co ho mohlo posunout až do sklíčka?",
    pravidlo: "Při velkém zvětšení stačí malý posun a objektiv narazí. Proto se tu smí točit jen šroubem pro jemné doostření.",
    proc: "Sklíčko se nejčastěji rozbije tak, že se při velkém zvětšení točí makrošroubem a objektiv narazí do sklíčka. Tady se smí používat jen mikrošroub.",
  },
  {
    otazka: (o) => `Pozoruješ ${o} u okna, ale zorné pole je úplně tmavé, i když preparát leží na místě. Co zkontroluješ?`,
    klic: "Natočení zrcátka ke světlu a otevření clony",
    distr: [
      { value: "Zaostření obrazu jemným mikrošroubem", why: "Neostrý obraz je rozmazaný, ale ne úplně černý. Úplná tma znamená, že do mikroskopu nejde světlo." },
      { value: "Upevnění sklíčka pod oběma svorkami", why: "Svorky drží sklíčko na místě, se světlem nemají nic společného." },
      { value: "Čistotu krycího sklíčka nad vzorkem", why: "Špinavé sklíčko obraz zašpiní, ale úplnou tmu nezpůsobí." },
    ],
    napoveda: "Úplná tma znamená, že do mikroskopu nejde světlo. Které části světlo přivádějí a pouštějí dál?",
    pravidlo: "Světlo z okna musí odrazit šikmé zrcadélko dole a pak projít otvorem, který se dá přivřít. Zkontroluj obě místa.",
    proc: "Když je zorné pole úplně tmavé, do mikroskopu nejde světlo. Zkontroluje se, jestli zrcátko míří ke světlu a jestli je clona otevřená.",
  },
  {
    otazka: (o) => `Pozoruješ ${o}, máš nasazený objektiv s největším zvětšením a v zorném poli nemůžeš nic najít. Co uděláš?`,
    klic: "Přepneš na nejmenší zvětšení a hledáš znovu",
    distr: [
      { value: "Otevřeš víc clonu a hledáš dál", why: "Světlo nepomůže, když je pole tak malé, že vzorek v něm vůbec není." },
      { value: "Točíš makrošroubem, dokud se něco neobjeví", why: "Při největším zvětšení makrošroubem snadno rozbiješ sklíčko. Navíc hledání nepomůže ostření." },
      { value: "Připravíš nový preparát, tenhle je prázdný", why: "Preparát prázdný být nemusí. Při velkém zvětšení vidíš jen malý kousek a vzorek je mimo něj." },
    ],
    napoveda: "Při největším zvětšení vidíš jen malý kousek preparátu. Při kterém zvětšení se hledá nejsnáz?",
    pravidlo: "Čím větší zvětšení, tím menší část preparátu vidíš. Vzorek se proto hledá při malém zvětšení, posune se doprostřed a teprve pak se zvětšuje.",
    proc: "Při největším zvětšení je zorné pole malé. Vzorek se najde při nejmenším zvětšení, posune se doprostřed a teprve pak se přepne na silnější objektiv.",
  },
];

function l3Diagnoza(dg: Diagnoza, obj: string): PracticeTask | null {
  return choice(dg.otazka(obj), dg.klic, dg.distr, {
    hints: [`${dg.napoveda} (Pozoruješ ${obj}.)`, `${dg.pravidlo} Platí to stejně, ať pozoruješ ${obj}, nebo cokoli jiného.`],
    explanation: dg.proc,
  });
}

// L3e — důsledek většího zvětšení
interface Dusledek {
  ptam: string;
  klic: string;
  distr: Distractor[];
  napoveda: string;
  proc: string;
}
const DUSLEDKY: Dusledek[] = [
  {
    ptam: "Jak se změní velikost části preparátu, kterou v zorném poli vidíš?",
    klic: "Uvidíš menší část než předtím",
    distr: [
      { value: "Uvidíš větší část než předtím", why: "Obraz je sice větší, ale do zorného pole se ho vejde méně. Vidíš tedy menší kousek preparátu." },
      { value: "Uvidíš stejně velkou část jako předtím", why: "Zorné pole zůstává stejně velké, ale je v něm víc zvětšený, tedy menší kousek preparátu." },
      { value: "Uvidíš najednou celý preparát", why: "Celý preparát nevidíš ani při nejmenším zvětšení, při větším uvidíš ještě menší kousek." },
    ],
    napoveda: "Představ si, že fotku přiblížíš na mobilu. Vejde se na displej víc, nebo méně z celého obrázku?",
    proc: "Při větším zvětšení se zmenšuje zorné pole: detaily jsou větší, ale vidíš menší část preparátu.",
  },
  {
    ptam: "Co se stane s jasem obrazu, když clonu ani světlo nezměníš?",
    klic: "Obraz bude tmavší než předtím",
    distr: [
      { value: "Obraz bude světlejší než předtím", why: "Světla nepřibylo, ale rozloží se na větší obraz. Obraz proto tmavne." },
      { value: "Obraz bude stejně jasný jako předtím", why: "Při větším zvětšení se stejné světlo rozloží do většího obrazu, a obraz proto ztmavne." },
      { value: "Obraz bude barevnější než předtím", why: "Zvětšení barvy nepřidává. Změní se hlavně velikost a jas obrazu." },
    ],
    napoveda: "Množství světla zůstává stejné, ale obraz se zvětší. Na jak velkou plochu se to světlo rozloží?",
    proc: "Při větším zvětšení se stejné světlo rozloží do většího obrazu, proto obraz tmavne a je třeba otevřít clonu nebo přidat světlo.",
  },
  {
    ptam: "Jak se změní to, co v zorném poli vidíš?",
    klic: "Vše bude větší a uvidíš toho méně",
    distr: [
      { value: "Vše bude větší a uvidíš toho víc", why: "Větší obraz se do stejného zorného pole vejde jen zčásti. Uvidíš toho méně." },
      { value: "Vše bude menší a uvidíš toho víc", why: "Tak by to bylo při přepnutí na slabší objektiv. Silnější objektiv zvětšuje." },
      { value: "Nic se nezmění, jen to bude ostřejší", why: "Silnější objektiv obraz zvětší. Ostrost se naopak musí znovu doladit." },
    ],
    napoveda: "Zorné pole je pořád stejně velké kolečko. Co se stane, když do něj dáš víc zvětšený obraz?",
    proc: "Silnější objektiv detaily zvětší, ale do stejného zorného pole se vejde menší kousek preparátu, takže toho uvidíš méně.",
  },
  {
    ptam: "Jak daleko od sklíčka bude po přepnutí objektiv?",
    klic: "Blíž ke sklíčku než předtím",
    distr: [
      { value: "Dál od sklíčka než předtím", why: "Silnější objektivy jsou delší a končí blíž u sklíčka. Proto se s nimi pracuje opatrně." },
      { value: "Stejně daleko jako předtím", why: "Silnější objektiv je delší, takže jeho čočka je blíž u sklíčka." },
      { value: "Až na sklíčku, musí se ho dotýkat", why: "Objektiv se sklíčka nikdy nedotýká, poškrábal by se a sklíčko by prasklo." },
    ],
    napoveda: "Porovnej délku objektivů v revolverovém měniči. Který z nich zasahuje níž?",
    proc: "Silnější objektiv je delší a jeho čočka je blíž u sklíčka. Proto se při velkém zvětšení doostřuje jen mikrošroubem.",
  },
];
const PREPNUTI: [number, number][] = [[4, 10], [4, 40], [10, 40], [10, 100], [4, 100]];

function l3Dusledek(du: Dusledek, obj: string): PracticeTask | null {
  const [a, b] = pick(PREPNUTI);
  return choice(
    `Pozoruješ ${obj} s objektivem ${x(a)} a přepneš na objektiv ${x(b)}. ${du.ptam}`,
    du.klic,
    du.distr,
    {
      hints: [
        `${du.napoveda} (Přepínáš z objektivu ${x(a)} na ${x(b)}.)`,
        `Větší zvětšení mění tři věci naráz: velikost detailů, velikost viditelné části preparátu a jas obrazu. Když při pozorování přepneš na objektiv ${x(b)}, promysli si každou z nich zvlášť.`,
      ],
      explanation: du.proc,
    },
  );
}

// L3f — skutečná velikost
interface Vzorek {
  nom: string;
  velky: string;
  realne: number[];
}
const VZORKY: Vzorek[] = [
  { nom: "buňka cibule", velky: "velká", realne: [0.1, 0.2, 0.25, 0.3] },
  { nom: "trepka", velky: "velká", realne: [0.2, 0.25, 0.3] },
  { nom: "měňavka", velky: "velká", realne: [0.1, 0.2, 0.4, 0.5] },
  { nom: "zrnko pylu", velky: "velké", realne: [0.02, 0.03, 0.04, 0.05] },
  { nom: "vířník", velky: "velký", realne: [0.1, 0.2, 0.3, 0.5] },
];
const ZVETSENI_F = [40, 100, 200, 400];
const zaokr = (n: number) => Math.round(n * 10000) / 10000;

function l3Velikost(): PracticeTask | null {
  const v = pick(VZORKY);
  const r = pick(v.realne);
  const z = pick(ZVETSENI_F);
  const s = zaokr(r * z);
  if (!Number.isInteger(s) || s < 2 || s > 60) return null;
  const mm = (n: number) => `${c(zaokr(n))} mm`;
  return choice(
    `Při zvětšení ${x(z)} se ${v.nom} v mikroskopu zdá ${v.velky} ${mm(s)}. Jak ${v.velky} je ve skutečnosti?`,
    mm(r),
    [
      { value: mm(s * z), why: "Tady je zdánlivá velikost ještě vynásobená zvětšením. Mikroskop ale předmět zvětšil, takže skutečná velikost je menší a dělí se." },
      { value: mm(r * 10), why: `Tady je chyba v řádu: ${c(zaokr(r * 10))} · ${c(z)} = ${c(zaokr(r * 10 * z))}, ne ${c(s)}. Při dělení ohlídej, o kolik míst se posune desetinná čárka.` },
      { value: mm(s), why: "To je velikost obrazu v mikroskopu. Skutečná velikost je tolikrát menší, kolikrát mikroskop zvětšuje." },
      { value: mm(s / 10), why: `Tady je dělení jen číslem 10. Mikroskop ale zvětšuje ${x(z)}.` },
    ],
    {
      hints: [
        `Mikroskop ukazuje obraz ${krat(z)} větší, než je ${v.nom} doopravdy. Jakou operací se od obrazu dostaneš zpátky ke skutečné velikosti?`,
        `Obraz je tolikrát větší, kolikrát mikroskop zvětšuje. Skutečnou velikost proto dostaneš, když velikost obrazu (${mm(s)}) vydělíš zvětšením. Výsledek ověř násobením: skutečná velikost krát zvětšení musí dát velikost obrazu.`,
      ],
      solutionSteps: [
        "Skutečná velikost = velikost obrazu : zvětšení.",
        `${c(s)} : ${c(z)} = ${c(r)}, tedy ${mm(r)}.`,
        `Zkouška: ${c(r)} · ${c(z)} = ${c(s)}.`,
      ],
      explanation: `Mikroskop zvětšuje ${x(z)}, takže obraz je ${krat(z)} větší než skutečnost. Skutečná velikost je ${c(s)} : ${c(z)} = ${mm(r)}.`,
    },
  );
}

function genL3(st: Stav): PracticeTask | null {
  const typ = st.i++ % 6;
  if (typ === 0) return l3Obraceny();
  if (typ === 1) return l3Kolikrat();
  if (typ === 2) return l3Obraz();
  if (typ === 3) return l3Diagnoza(DIAGNOZY[st.a++ % DIAGNOZY.length], pick(OBJEKTY));
  if (typ === 4) return l3Dusledek(DUSLEDKY[st.b++ % DUSLEDKY.length], pick(OBJEKTY));
  return l3Velikost();
}

function gen(level: number): PracticeTask[] {
  // Rotace šablon se nastavuje tady — generátor si mezi voláními nic nepamatuje.
  const st: Stav = { i: 0, a: 0, b: 7, c: 0 };
  if (level === 1) return ruzneUlohy(() => losUlohy(() => genL1(st)));
  st.b = 0;
  if (level === 2) return ruzneUlohy(() => losUlohy(() => genL2(st)));
  return ruzneUlohy(() => losUlohy(() => genL3(st)));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const MIKROSKOP: TopicMetadata[] = [
  {
    id: "g6-pri-mikroskop-6",
    rvpNodeId: "g6-prirodopis-obecna-biologie-bunka-jako-zaklad-zivota-mikroskop-prace-s-mikroskopem",
    displayName: "Mikroskop a zvětšení",
    title: "Mikroskop - práce s mikroskopem",
    studentTitle: "Mikroskop a zvětšení",
    subject: "prirodopis",
    category: "Obecná biologie",
    topic: "Buňka jako základ života",
    briefDescription: "Části mikroskopu, správný postup pozorování a výpočet celkového zvětšení.",
    keywords: [
      "mikroskop", "okulár", "objektiv", "zvětšení", "makrošroub", "mikrošroub",
      "clona", "preparát", "krycí sklíčko", "podložní sklíčko", "zorné pole",
    ],
    goals: [
      "Poznat části světelného mikroskopu a vědět, k čemu slouží.",
      "Postupovat při pozorování správně a bezpečně.",
      "Spočítat celkové zvětšení jako součin zvětšení okuláru a objektivu.",
      "Zdůvodnit, co se změní při větším zvětšení a proč je obraz převrácený.",
    ],
    boundaries: [
      "Jen světelný (školní) mikroskop, ne elektronový.",
      "Výpočty jen s celými zvětšeními z běžné řady, skutečná velikost vychází čistě.",
      "Mokrý preparát jen základní postup (kapka vody, krycí sklíčko), bez barvení.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Celkové zvětšení = zvětšení okuláru · zvětšení objektivu. Pozoruje se od nejmenšího zvětšení, při velkém zvětšení se ostří jen mikrošroubem a obraz je převrácený.",
      steps: [
        "Najdi v zadání zvětšení okuláru a objektivu.",
        "Celkové zvětšení spočítej násobením, chybějící údaj dělením.",
        "U postupu si vybav bezpečné pořadí: nejmenší zvětšení, přiblížit ze strany, ostřit oddalováním.",
      ],
      commonMistake: "Sečíst zvětšení okuláru a objektivu (10× a 40× dá 50×) místo vynásobení (400×).",
      example: "Okulár 10× a objektiv 40× dají celkové zvětšení 10 · 40 = 400×.",
    },
  },
];
