/**
 * Matematika 6. ročník — Úhel: rýsování a měření úhlu úhloměrem.
 *
 * Stavba podle výpočetního vzoru `../fyzika/mereniDelky.ts`, helpery jen
 * z `./_shared.ts`. Téma emituje výhradně select_one.
 *
 *  • L1 — čtení úhloměru (jeden krok): stupnice s nulou, druh úhlu podle
 *    dvou čísel u rysky, postup rýsování. Slovník: stupnice, rameno, vrchol.
 *  • L2 — jeden výpočetní krok s pojmem: úhel vedlejší, vrcholový (přes
 *    vedlejší), násobek a polovina úhlu, úhel mezi dvěma ryskami.
 *  • L3 — dva kroky / inverze: vedlejší úhly s daným rozdílem či poměrem,
 *    součet vrcholových úhlů, úhel větší než přímý, dvě odměření za sebou.
 *    Distraktory leží na obou stranách klíče, všechny jsou násobky 5.
 *
 * Každý distraktor je výsledek konkrétní chyby spočítaný z týchž čísel:
 * záměna stupnic, záměna vedlejší ↔ vrcholový, doplněk do špatného celku,
 * rysky sečtené místo odečtení, úloha ukončená po prvním kroku.
 *
 * Úhly se vypisují přes `uhel(st * 60)`. α = 90° se nelosuje (vedlejší by
 * splynul s vrcholovým). Úlohy jsou bez obrázku, proto žádný distraktor
 * nepředpokládá čtení rysek z obrázku (dřívější „sousední popsaná ryska“).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { cis, uhel, pick, shuffle, doplnVelkou, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Sablona = () => PracticeTask | null;

const u = (st: number): string => uhel(st * 60);
const PRIMY = u(180);
const PLNY = u(360);

function rozsah(od: number, doo: number, krok = 5): number[] {
  const out: number[] = [];
  for (let x = od; x <= doo; x += krok) out.push(x);
  return out;
}

/** α = násobek 5 od 15° do 165°, bez pravého úhlu. */
const ALFY = rozsah(15, 165).filter((x) => x !== 90);

interface Jmeno {
  n: string; // úhel AVB
  v: string; // vrchol
  a: string; // bod na prvním rameni
  b: string; // bod na druhém rameni
}

const JMENA: Jmeno[] = [
  { n: "AVB", v: "V", a: "A", b: "B" },
  { n: "KLM", v: "L", a: "K", b: "M" },
  { n: "PQR", v: "Q", a: "P", b: "R" },
  { n: "CDE", v: "D", a: "C", b: "E" },
  { n: "XYZ", v: "Y", a: "X", b: "Z" },
  { n: "RST", v: "S", a: "R", b: "T" },
];

const STRATEGIE = [
  "Nakonec zkontroluj, jestli výsledek odpovídá druhu úhlu: ostrý, tupý, nebo větší než přímý?",
  "Zkontroluj, na který úhel se otázka ptá, než vybereš odpověď.",
  "Porovnej výsledek s odhadem: dává taková velikost smysl?",
];

/**
 * select_one úloha + dvě nápovědy. Malá nápověda je jen navádějící věta
 * šablony — výpis „Čísla ze zadání: …“ se nepřidává (žák ta čísla vidí
 * v otázce a v nápovědě nic neříkala). Konkrétní čísla, když pomáhají,
 * píše šablona přímo do věty, a to tak, aby neobsahovala klíč.
 */
function uloha(
  question: string,
  correct: string,
  dis: Distractor[],
  hints: [string, string],
  solutionSteps: string[],
  explanation: string,
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, dis, { hints, solutionSteps, explanation });
  if (!t) return null;
  t.hints = [hints[0], doplnVelkou(hints[0], hints[1], STRATEGIE)];
  return t;
}

/** Doplněk podle druhu úhlu (podmíněný feedback — platí pro každé x). */
function doplnek(x: number): Distractor {
  return x < 90
    ? { value: u(90 - x), why: "Tohle je doplněk do pravého úhlu. Vedlejší úhly dávají dohromady přímý úhel." }
    : { value: u(360 - x), why: "Tohle je doplněk do plného úhlu. Vedlejší úhly dávají dohromady přímý úhel, ne plný." };
}

/** Obě čísla u rysky sečtená — vyjde vždy přímý úhel; chyba jde udělat ze zadání. */
const SOUCET_RYSKY: Distractor = {
  value: PRIMY,
  why: "Tohle je součet obou čísel u rysky, ten vyjde vždy stejně. Úhel se nepočítá, přečte se jedno číslo na správné stupnici.",
};

/**
 * L1 distraktory ke čtení stupnice; první (druhá stupnice) má vlastní text.
 * Všechny vycházejí z čísel v zadání (úloha nemá obrázek). Poslední položka
 * je záloha pro k = 45 / 135, kde druhá stupnice splyne s „od rysky 90“.
 */
function distraktoryCteni(k: number, druhaStupnice: string): Distractor[] {
  const out: Distractor[] = [{ value: u(180 - k), why: druhaStupnice }];
  const rozdil: Distractor = {
    value: u(Math.abs(180 - 2 * k)),
    why: "Tohle je rozdíl obou čísel u rysky. Úhel se nepočítá, přečte se na jedné stupnici.",
  };
  const odPraveho: Distractor = k > 90
    ? { value: u(k - 90), why: "Tohle je, o kolik je úhel větší než pravý. Úhel se čte od nuly, ne od rysky 90." }
    : { value: u(90 - k), why: "Tohle je, kolik úhlu chybí do pravého úhlu. Úhel se čte od nuly, ne od rysky 90." };
  out.push(odPraveho, rozdil, SOUCET_RYSKY, {
    value: u(k > 90 ? 360 - k : 90 + k),
    why: k > 90
      ? "Tohle je, kolik úhlu chybí do plného úhlu. Úhel se čte přímo na stupnici, nic se nedopočítává."
      : "K pravému úhlu jsi přičetl přečtené číslo. Úhel se čte od nuly, ne od rysky 90.",
  });
  return out;
}

// ── L1: čtení úhloměru ─────────────────────────────────────────────────────
function genL1Stupnice(nulaVnejsi: boolean): PracticeTask | null {
  const J = pick(JMENA);
  const al = pick(ALFY);
  const vnejsi = al, vnitrni = 180 - al;
  const k = nulaVnejsi ? vnejsi : vnitrni;
  const nula = nulaVnejsi ? "vnější" : "vnitřní";
  const druha = nulaVnejsi ? "vnitřní" : "vnější";
  const cteni = Math.random() < 0.5
    ? `vnější stupnice ${u(vnejsi)} a vnitřní ${u(vnitrni)}`
    : `vnitřní stupnice ${u(vnitrni)} a vnější ${u(vnejsi)}`;
  const VA = J.v + J.a, VB = J.v + J.b;
  return uloha(
    `Rameno ${VA} leží na nule ${nula} stupnice úhloměru. U ramene ${VB} ukazuje ${cteni}. Jak velký je úhel ${J.n}?`,
    u(k),
    distraktoryCteni(k, "Tohle číslo je na druhé stupnici. Čti tu stupnici, na které leží nula u prvního ramene."),
    [
      `Najdi stupnici, která má u ramene ${VA} nulu, a čti jen tu.`,
      `Úhloměr má dvě stupnice, které běží proti sobě. Úhel ${J.n} přečteš u ramene ${VB} na té stupnici, která u ramene ${VA} začíná nulou; číslo na druhé stupnici k tomuto úhlu nepatří.`,
    ],
    [
      `Nula u ramene ${VA} leží na ${nula} stupnici.`,
      `Na ${nula} stupnici je u ramene ${VB} číslo ${u(k)}.`,
      `Kontrola: čísla u jedné rysky se doplňují do přímého úhlu, ${u(k)} + ${u(180 - k)} = ${PRIMY}.`,
      `Úhel ${J.n} = ${u(k)}`,
    ],
    `Úhel se čte na té stupnici, která u prvního ramene ukazuje nulu — tady na ${nula}. U ramene ${VB} je na ní ${u(k)}. Číslo ${u(180 - k)} patří ${druha} stupnici; ta u ramene ${VA} ukazuje ${PRIMY}, ne nulu.`,
  );
}

function genL1Druh(): PracticeTask | null {
  const J = pick(JMENA);
  const ostry = Math.random() < 0.5;
  const k = pick(ALFY.filter((x) => (ostry ? x < 90 : x > 90)));
  const o = 180 - k;
  const [x, y] = shuffle([k, o]);
  const VA = J.v + J.a, VB = J.v + J.b;
  const druhText = ostry
    ? `Úhel ${J.n} je ostrý, tedy menší než pravý úhel. Číslo ${u(o)} je větší než 90°, takové by patřilo tupému úhlu.`
    : `Úhel ${J.n} je tupý, tedy větší než pravý úhel. Číslo ${u(o)} je menší než 90°, takové by patřilo ostrému úhlu.`;
  return uloha(
    `Úhel ${J.n} je ${ostry ? "ostrý" : "tupý"}. Úhloměr přiložený k rameni ${VA} ukazuje u ramene ${VB} dvě čísla: ${u(x)} a ${u(y)}. Jak velký je úhel ${J.n}?`,
    u(k),
    distraktoryCteni(k, druhText),
    [
      `Nejdřív si ujasni, jestli má být úhel ${J.n} menší, nebo větší než pravý úhel.`,
      `Ostrý úhel je menší než pravý, tupý je větší než pravý a menší než přímý. Z obou čísel u ramene ${VB} je vždy jedno menší a druhé větší než pravý úhel. Vyber to, které odpovídá druhu úhlu ${J.n}.`,
    ],
    [
      `Úhel ${J.n} je ${ostry ? "ostrý, tedy menší" : "tupý, tedy větší"} než 90°.`,
      `Z čísel ${u(x)} a ${u(y)} je ${ostry ? "menší" : "větší"} než 90° jen ${u(k)}.`,
      `Úhel ${J.n} = ${u(k)}`,
    ],
    `U každé rysky úhloměru jsou dvě čísla, která dávají dohromady ${PRIMY}. Jedno patří ostrému úhlu, druhé tupému. Úhel ${J.n} je ${ostry ? "ostrý" : "tupý"}, proto je jeho velikost ${u(k)}.`,
  );
}

function genL1Rysovani(): PracticeTask | null {
  const J = pick(JMENA);
  const al = pick(ALFY);
  const VA = J.v + J.a;
  const kroky = [
    `Střed úhloměru přiložíš do vrcholu ${J.v}.`,
    `Úhloměr natočíš tak, aby rameno ${VA} procházelo ryskou 0.`,
    `Na stupnici, která má nulu u ramene ${VA}, uděláš značku u čísla ${u(al)} a značku spojíš s vrcholem ${J.v}.`,
  ];
  if (Math.random() < 0.5) {
    return uloha(
      `Rýsuješ úhel ${J.n} velikosti ${u(al)} od ramene ${VA}. Kam přiložíš střed úhloměru?`,
      `do vrcholu ${J.v}`,
      [
        { value: `do bodu ${J.a}`, why: `Bod ${J.a} jen určuje, kudy rameno ${VA} vede. Úhel se měří od místa, kde obě ramena začínají.` },
        { value: `do středu úsečky ${VA}`, why: `Střed úsečky ${VA} není bod, ze kterého ramena vycházejí. Střed úhloměru musí ležet přesně ve vrcholu úhlu.` },
        { value: `do libovolného bodu ramene ${VA}`, why: `Kdyby střed úhloměru ležel jinde než ve vrcholu, naměřil bys jiný úhel. Obě ramena vycházejí z bodu ${J.v}.` },
      ],
      [
        `Uvědom si, ze kterého bodu vycházejí obě ramena úhlu ${J.n}.`,
        `Úhloměr měří, jak moc se ramena rozevírají kolem jednoho bodu. Ten bod musí ležet přesně pod středem úhloměru, jinak rýsuješ jiný úhel než ${J.n}.`,
      ],
      kroky,
      `Obě ramena úhlu ${J.n} vycházejí z vrcholu ${J.v} a velikost úhlu udává, jak moc se kolem něj rozevírají. Proto střed úhloměru patří do vrcholu ${J.v}, rameno ${VA} na nulu a značka k číslu ${u(al)}.`,
    );
  }
  return uloha(
    `Rýsuješ úhel ${J.n} velikosti ${u(al)} od ramene ${VA} a střed úhloměru už máš ve vrcholu ${J.v}. Jak úhloměr natočíš?`,
    `rameno ${VA} na rysku 0`,
    [
      { value: `rameno ${VA} na rysku 90`, why: `Od rysky 90 by se úhel neodměřoval od nuly a vyšel by posunutý o pravý úhel. Rameno, od kterého rýsuješ, patří na nulu.` },
      { value: `rameno ${VA} na rysku ${cis(al)}`, why: `U čísla ${cis(al)} se dělá až značka pro druhé rameno. Rameno ${VA}, od kterého rýsuješ, musí ležet na nule.` },
      { value: `rameno ${VA} na rysku ${cis(180 - al)}`, why: `Číslo ${cis(180 - al)} je u značky na druhé stupnici. Rameno ${VA} musí ležet na nule, od ní se úhel odměřuje.` },
    ],
    [
      `Rozmysli si, od kterého čísla stupnice se úhel ${J.n} odměřuje.`,
      `Aby šla velikost úhlu ${J.n} přečíst na stupnici přímo, musí polopřímka ${VA}, od které rýsuješ, začínat u začátku stupnice. Teprve potom hledáš číslo, u kterého uděláš značku.`,
    ],
    kroky,
    `Stupnice úhloměru ukazuje, o kolik stupňů je ryska otočená od začátku stupnice. Když rameno ${VA} leží na nule, přečteš u značky rovnou velikost úhlu ${u(al)}.`,
  );
}

// ── L2: jeden krok s pojmem ────────────────────────────────────────────────
const PRICETL: (x: number) => Distractor = (x) => ({
  value: u(180 + x),
  why: "Úhel jsi k přímému úhlu přičetl. Úhel vedlejší dostaneš, když daný úhel od přímého úhlu odečteš.",
});

function genL2Vedlejsi(): PracticeTask | null {
  const J = pick(JMENA);
  const al = pick(ALFY);
  const K = 180 - al;
  const question = Math.random() < 0.5
    ? `Dvě přímky se protínají a jeden z úhlů, které svírají, měří ${u(al)}. Jak velký je úhel k němu vedlejší?`
    : `Úhel ${J.n} měří ${u(al)}. Jak velký je úhel k němu vedlejší?`;
  return uloha(
    question,
    u(K),
    [
      { value: u(al), why: "Tohle je velikost zadaného úhlu, takovou má úhel vrcholový. Vedlejší úhel dává se zadaným úhlem dohromady přímý úhel." },
      doplnek(al),
      PRICETL(al),
    ],
    [
      "Vedlejší úhly mají jedno rameno společné a jejich zbylá ramena leží na jedné přímce.",
      "Dva vedlejší úhly dají dohromady přímý úhel. Úhel vedlejší tedy dostaneš, když zadaný úhel od přímého úhlu odečteš.",
    ],
    [
      `Vedlejší úhly dávají dohromady přímý úhel: ${PRIMY}.`,
      `${PRIMY} − ${u(al)} = ${u(K)}`,
      `Kontrola: ${u(al)} + ${u(K)} = ${PRIMY}`,
    ],
    `Úhel a úhel k němu vedlejší mají společné rameno a jejich zbylá ramena leží na jedné přímce, dohromady tedy tvoří přímý úhel ${PRIMY}. Proto ${PRIMY} − ${u(al)} = ${u(K)}.`,
  );
}

function genL2Vrcholovy(): PracticeTask | null {
  const g = pick(ALFY);
  const b = 180 - g;
  const question = Math.random() < 0.5
    ? `Úhel β je vedlejší k úhlu o velikosti ${u(g)}. Jak velký je úhel vrcholový k úhlu β?`
    : `Dvě přímky se protínají. Úhel β je vedlejší k úhlu, který měří ${u(g)}. Jak velký je úhel vrcholový k úhlu β?`;
  return uloha(
    question,
    u(b),
    [
      { value: u(g), why: `Úhel ${u(g)} je k úhlu β vedlejší, ne vrcholový. Vrcholový úhel k β je s úhlem β shodný, takže nejdřív spočítej β.` },
      doplnek(g),
      PRICETL(g),
    ],
    [
      "Postupuj ve dvou krocích: nejdřív urči úhel β, potom úhel k němu vrcholový.",
      "Úhel β tvoří se zadaným úhlem přímý úhel, takže ho zjistíš odečtením od přímého úhlu. Vrcholové úhly leží naproti sobě a jsou shodné.",
    ],
    [
      `β = ${PRIMY} − ${u(g)} = ${u(b)}`,
      `Úhel vrcholový k β je s β shodný: ${u(b)}`,
    ],
    `Vedlejší úhly dávají dohromady ${PRIMY}, proto β = ${PRIMY} − ${u(g)} = ${u(b)}. Vrcholové úhly jsou shodné, takže úhel vrcholový k β má také ${u(b)}.`,
  );
}

const KRAT: Record<number, [string, string]> = {
  2: ["dvakrát", "ze dvou"],
  3: ["třikrát", "ze tří"],
};

function genL2Nasobek(): PracticeTask | null {
  if (Math.random() < 0.5) {
    const k = pick([2, 3]);
    const [slovo, ze] = KRAT[k];
    const al = pick(rozsah(15, k === 2 ? 85 : 55).filter((x) => k * x !== 90));
    const K = k * al;
    const soucet = Array<string>(k).fill(u(al)).join(" + ");
    return uloha(
      `Narýsuj úhel ${slovo} větší, než je úhel o velikosti ${u(al)}. Jak velký úhel narýsuješ?`,
      u(K),
      [
        { value: u(al + k), why: `Číslo ${k} jsi k úhlu přičetl. Úhel ${slovo} větší dostaneš násobením, ne sčítáním.` },
        { value: u(180 - K), why: "Tohle je číslo na druhé stupnici. Při rýsování čti stupnici, která má nulu u prvního ramene." },
        { value: u(al), why: `Tohle je velikost zadaného úhlu. Máš narýsovat úhel ${slovo} větší.` },
        { value: u((k + 1) * al), why: `Přidal jsi o jeden úhel navíc. Úhel ${slovo} větší se skládá ${ze} stejných úhlů.` },
      ],
      [
        `Úhel ${slovo} větší vznikne, když zadaný úhel odměříš několikrát za sebou.`,
        `Představ si, že zadaný úhel přikládáš vedle sebe tolikrát, kolikrát má být nový úhel větší. Velikosti se přitom sčítají, takže stačí zadaný úhel vynásobit.`,
      ],
      [
        `Úhel ${slovo} větší = ${soucet}`,
        `${cis(k)} · ${u(al)} = ${u(K)}`,
      ],
      `Úhel ${slovo} větší se skládá ${ze} úhlů o velikosti ${u(al)} položených vedle sebe. Proto ${cis(k)} · ${u(al)} = ${u(K)}.`,
    );
  }
  const al = pick(rozsah(20, 170, 10).filter((x) => x !== 90));
  const K = al / 2;
  return uloha(
    `Úhel o velikosti ${u(al)} rozpůlíš. Jak velká je každá z obou polovin?`,
    u(K),
    [
      { value: u(2 * al), why: "Úhel jsi zdvojnásobil. Polovinu dostaneš dělením dvěma, ne násobením." },
      // čtvrtina jen tam, kde vyjde v celých stupních; jinak nastoupí záloha (celý úhel)
      ...(al % 4 === 0
        ? [{ value: u(al / 4), why: "Úhel jsi dělil dvěma dvakrát, to je čtvrtina. Rozpůlit znamená dělit dvěma jen jednou." }]
        : []),
      { value: u((180 - al) / 2), why: "Tohle je polovina úhlu, který zadaný úhel doplňuje do přímého. Rozpůlit máš zadaný úhel." },
      { value: u(al), why: "Tohle je celý zadaný úhel, ne jeho polovina." },
    ],
    [
      "Rozpůlit znamená rozdělit na dvě stejně velké části.",
      "Obě poloviny jsou stejné a dohromady dají celý zadaný úhel. Velikost jedné poloviny tedy dostaneš dělením.",
    ],
    [
      `Polovina úhlu = ${u(al)} : 2`,
      `${u(al)} : 2 = ${u(K)}`,
      `Kontrola: ${u(K)} + ${u(K)} = ${u(al)}`,
    ],
    `Rozpůlený úhel se skládá ze dvou stejných částí, které dohromady dají ${u(al)}. Každá je proto ${u(al)} : 2 = ${u(K)}.`,
  );
}

function genL2Rysky(): PracticeTask | null {
  const J = pick(JMENA);
  const a = pick(rozsah(10, 80));
  const b = pick(rozsah(a + 15, 175).filter((x) => x !== 90));
  const K = b - a;
  if (K === a || K === 90) return null;
  const VA = J.v + J.a, VB = J.v + J.b;
  return uloha(
    `Úhloměr máš středem ve vrcholu ${J.v}. Rameno ${VA} prochází ryskou ${u(a)} a rameno ${VB} ryskou ${u(b)} téže stupnice. Jak velký je úhel ${J.n}?`,
    u(K),
    [
      { value: u(b), why: "Úhel měříš od první rysky, ne od nuly. Kolik stupňů je mezi oběma ryskami?" },
      { value: u(a + b), why: "Čísla u rysek jsi sečetl. Úhel měříš od první rysky, ne od nuly, proto menší číslo od většího odečti." },
      { value: u(180 - K), why: "Tohle číslo odpovídá druhé stupnici. Obě rysky čteš na téže stupnici a čísla od sebe odečteš." },
      { value: u(a), why: "Tohle je jen poloha prvního ramene na stupnici. Úhel je velikost mezi oběma ryskami." },
    ],
    [
      `Rameno ${VA} neleží na nule, takže úhel ${J.n} nepřečteš přímo.`,
      "Úhel je tolik stupňů, kolik jich na téže stupnici leží mezi oběma ryskami. Menší číslo proto odečti od většího.",
    ],
    [
      `Úhel ${J.n} leží na stupnici mezi ryskami ${u(a)} a ${u(b)}.`,
      `${u(b)} − ${u(a)} = ${u(K)}`,
    ],
    `Kdyby rameno ${VA} leželo na nule, přečetl bys úhel přímo. Stupnice je ale posunutá o ${u(a)}, a proto se tato hodnota musí od ${u(b)} odečíst: ${u(b)} − ${u(a)} = ${u(K)}.`,
  );
}

// ── L3: dva kroky, inverze, úhel větší než přímý ───────────────────────────
const KRAT_L3: Record<number, string> = { 2: "dvakrát", 3: "třikrát", 5: "pětkrát", 8: "osmkrát", 11: "jedenáctkrát" };

function genL3Rozdil(): PracticeTask | null {
  const d = pick(rozsah(10, 80, 10));
  const m = (180 - d) / 2;
  const K = m + d;
  return uloha(
    `Jeden ze dvou vedlejších úhlů je o ${u(d)} větší než druhý. Jak velký je ten větší?`,
    u(K),
    [
      { value: u(90 + d), why: "K polovině přímého úhlu jsi přičetl celý rozdíl. Rozdíl se ale dělí mezi oba úhly, takže větší úhel je nad polovinou přímého úhlu jen o polovinu rozdílu." },
      { value: u(m), why: "Tohle je menší z obou úhlů. Otázka se ptá na větší." },
      { value: u(90 - d), why: "Od poloviny přímého úhlu jsi odečetl celý rozdíl. Tak vyjde úhel menší než polovina přímého, ale hledáš ten větší — a rozdíl se dělí mezi oba úhly." },
      { value: u(d), why: "Tohle je jen rozdíl obou úhlů, ne velikost některého z nich." },
    ],
    [
      "Vedlejší úhly dají dohromady přímý úhel. Rozmysli si, jak by to vypadalo, kdyby byly oba stejně velké.",
      "Když od přímého úhlu odebereš rozdíl, zbydou dvě stejné části a každá je velká jako menší úhel. K menšímu úhlu pak rozdíl zase přičti.",
    ],
    [
      `Od přímého úhlu odečti rozdíl: ${PRIMY} − ${u(d)} = ${u(180 - d)}`,
      `Zbytek rozděl na dvě stejné části: ${u(180 - d)} : 2 = ${u(m)} — to je menší úhel.`,
      `Větší úhel: ${u(m)} + ${u(d)} = ${u(K)}`,
      `Kontrola: ${u(m)} + ${u(K)} = ${PRIMY}`,
    ],
    `Vedlejší úhly dávají dohromady ${PRIMY}. Větší úhel je složený z menšího úhlu a rozdílu, takže po odebrání rozdílu zbydou dva stejné menší úhly: ${u(180 - d)} : 2 = ${u(m)}. Větší úhel je ${u(m)} + ${u(d)} = ${u(K)}.`,
  );
}

function genL3Pomer(): PracticeTask | null {
  const k = pick([2, 3, 5, 8, 11]);
  const slovo = KRAT_L3[k];
  const m = 180 / (k + 1);
  const K = k * m;
  return uloha(
    `Jeden ze dvou vedlejších úhlů je ${slovo} větší než druhý. Jak velký je ten větší?`,
    u(K),
    [
      { value: PRIMY, why: "Přímý úhel jsi rozdělil jen na tolik dílů, kolikrát je větší úhel větší. Jeden díl navíc tvoří menší úhel, takže dílů je o jeden víc." },
      { value: u(m), why: `Tohle je menší z obou úhlů. Větší úhel je ${slovo} větší.` },
      { value: u(90), why: "Přímý úhel jsi rozdělil na dvě stejné části, ale oba úhly stejné nejsou." },
    ],
    [
      "Menší úhel si představ jako jeden díl. Kolik takových dílů má větší úhel a kolik oba úhly dohromady?",
      "Oba vedlejší úhly dohromady tvoří přímý úhel. Rozděl přímý úhel na tolik stejných dílů, kolik jich mají oba úhly dohromady, a větší úhel poskládej z příslušného počtu dílů.",
    ],
    [
      `Menší úhel je ${pad(1, "DÍL")}, větší ${pad(k, "DÍL")}, dohromady ${pad(k + 1, "DÍL")}.`,
      `Jeden díl: ${PRIMY} : ${cis(k + 1)} = ${u(m)}`,
      `Větší úhel: ${cis(k)} · ${u(m)} = ${u(K)}`,
      `Kontrola: ${u(m)} + ${u(K)} = ${PRIMY}`,
    ],
    `Vedlejší úhly dávají dohromady ${PRIMY}. Když menší úhel tvoří ${pad(1, "DÍL")} a větší ${pad(k, "DÍL")}, rozdělí se přímý úhel na ${pad(k + 1, "DÍL")} po ${u(m)}. Větší úhel má ${cis(k)} · ${u(m)} = ${u(K)}.`,
  );
}

// x = 45 by dal součet 90° (v zadání se pravý úhel nelosuje),
// x = 60 součet 120° = klíč (odpověď by stála v zadání)
const X_SOUCET = [...rozsah(15, 85), ...rozsah(95, 115)].filter((x) => x !== 45 && x !== 60);

function genL3Soucet(): PracticeTask | null {
  const x = pick(X_SOUCET);
  const s = 2 * x;
  const K = 180 - x;
  const vrchol: Distractor = { value: u(x), why: "Tohle je velikost jednoho z vrcholových úhlů. Otázka se ptá na úhly k nim vedlejší." };
  const plny: Distractor = { value: u(360 - x), why: "Úhel jsi doplnil do plného úhlu. Vedlejší úhly dávají dohromady přímý úhel." };
  const dis: Distractor[] = x < 90
    ? [
        vrchol,
        { value: u(180 - s), why: "Do přímého úhlu jsi doplnil celý součet. Nejdřív zjisti, jak velký je jeden vrcholový úhel." },
        plny,
        PRICETL(x),
      ]
    : [
        vrchol,
        plny,
        { value: u(s - 180), why: "Od součtu jsi odečetl přímý úhel. Nejdřív zjisti, jak velký je jeden vrcholový úhel, a teprve ten doplň do přímého úhlu." },
        { value: u(360 - s), why: "Do plného úhlu jsi doplnil celý součet. Nejdřív zjisti jeden vrcholový úhel a ten doplň do přímého úhlu." },
      ];
  const question = Math.random() < 0.5
    ? `Dvě přímky se protínají. Součet dvou vrcholových úhlů, které přitom vznikly, je ${u(s)}. Jak velký je každý z úhlů k nim vedlejších?`
    : `Součet dvou vrcholových úhlů při průsečíku dvou přímek je ${u(s)}. Jak velký je každý z úhlů k nim vedlejších?`;
  return uloha(
    question,
    u(K),
    dis,
    [
      "Vrcholové úhly jsou shodné, takže se součet dělí na dvě stejné části.",
      "Nejdřív zjisti velikost jednoho vrcholového úhlu. Úhel k němu vedlejší s ním tvoří přímý úhel, takže ho dostaneš odečtením od přímého úhlu.",
    ],
    [
      `Vrcholové úhly jsou shodné: každý má ${u(s)} : 2 = ${u(x)}.`,
      `Úhel vedlejší: ${PRIMY} − ${u(x)} = ${u(K)}`,
      `Kontrola: ${u(x)} + ${u(K)} = ${PRIMY}`,
    ],
    `Vrcholové úhly jsou shodné, takže každý z nich má polovinu součtu, tedy ${u(x)}. Úhel k němu vedlejší ho doplňuje do přímého úhlu: ${PRIMY} − ${u(x)} = ${u(K)}.`,
  );
}

function genL3Pres(): PracticeTask | null {
  const J = pick(JMENA);
  const m = pick(rozsah(95, 175));
  const K = 360 - m;
  const VA = J.v + J.a, VB = J.v + J.b;
  const question = Math.random() < 0.5
    ? `Úhloměr měří jen do ${PRIMY}. Menší úhel mezi rameny ${VA} a ${VB} naměříš ${u(m)}. Jak velký je druhý úhel, větší než přímý?`
    : `Ramena ${VA} a ${VB} svírají dva úhly. Menší z nich naměříš úhloměrem: ${u(m)}. Jak velký je ten druhý, větší než přímý?`;
  return uloha(
    question,
    u(K),
    [
      { value: u(m), why: "Tohle je menší úhel, který jsi naměřil. Otázka se ptá na druhý úhel mezi stejnými rameny." },
      { value: u(180 - m), why: "Naměřený úhel jsi doplnil jen do přímého úhlu. Oba úhly mezi stejnými rameny tvoří dohromady plný úhel." },
      { value: u(180 + m), why: "K naměřenému úhlu jsi přičetl přímý úhel. Úhel větší než přímý dostaneš, když naměřený úhel odečteš od plného úhlu." },
    ],
    [
      "Úhloměrem změříš jen menší úhel. Druhý úhel mezi stejnými rameny dopočítáš.",
      "Oba úhly, které svírají stejná dvě ramena, dohromady obejdou celý kruh kolem vrcholu. Od plného úhlu tedy odečti naměřený úhel.",
    ],
    [
      `Oba úhly mezi rameny ${VA} a ${VB} tvoří dohromady plný úhel: ${PLNY}.`,
      `${PLNY} − ${u(m)} = ${u(K)}`,
      `Kontrola: ${u(K)} je víc než ${PRIMY}.`,
    ],
    `Dvě ramena z jednoho vrcholu rozdělí rovinu na dva úhly, které dohromady dají plný úhel ${PLNY}. Úhloměr ukáže jen menší z nich, druhý je proto ${PLNY} − ${u(m)} = ${u(K)}.`,
  );
}

function genL3Dve(): PracticeTask | null {
  const J = pick(JMENA);
  const a = pick(ALFY);
  const b = pick(ALFY);
  const S = a + b;
  if (S >= 180 || S === 90) return null;
  const K = 180 - S;
  if (K === a || K === b) return null; // odpověď by stála v zadání
  const VA = J.v + J.a;
  const bezDoplneni: Distractor = {
    value: u(S),
    why: "Tohle je úhel, který vznikl po obou odměřeních. Otázka se ptá na úhel k němu vedlejší, ten výsledek doplňuje do přímého úhlu.",
  };
  const bezB: Distractor = { value: u(180 - a), why: `Do přímého úhlu jsi doplnil jen první úhel ${u(a)}. Druhé odměření jsi vynechal.` };
  let dis: Distractor[];
  if (S < 90) {
    dis = [
      bezDoplneni,
      bezB,
      { value: u(180 - b), why: `Do přímého úhlu jsi doplnil jen druhý úhel ${u(b)}. První odměření jsi vynechal.` },
      { value: u(360 - S), why: "Výsledný úhel jsi doplnil do plného úhlu. Vedlejší úhly dávají dohromady přímý úhel." },
    ];
  } else {
    const r = Math.abs(a - b);
    if (r === 0 || r >= K) return null;
    dis = [
      bezDoplneni,
      bezB,
      { value: u(r), why: "Úhly jsi od sebe odečetl, jako by druhé odměření šlo na opačnou stranu, a výsledek jsi nedoplnil do přímého úhlu. Obě odměření jdou na stejnou stranu, úhly se sčítají." },
    ];
  }
  return uloha(
    `Od ramene ${VA} odměříš úhel ${u(a)} a od nového ramene dál ${u(b)} na stejnou stranu. Jak velký je úhel vedlejší k výslednému úhlu?`,
    u(K),
    dis,
    [
      "Obě odměření jdou na stejnou stranu, takže se úhly od prvního ramene skládají.",
      "Nejdřív zjisti, jak velký úhel svírá první rameno s posledním. Úhel k němu vedlejší s ním pak tvoří přímý úhel, proto ho od přímého úhlu odečti.",
    ],
    [
      `Po prvním odměření: ${u(a)}`,
      `Po druhém odměření: ${u(a)} + ${u(b)} = ${u(S)}`,
      `Úhel vedlejší: ${PRIMY} − ${u(S)} = ${u(K)}`,
    ],
    `Druhé odměření navazuje na první na stejnou stranu, takže první a poslední rameno svírají ${u(a)} + ${u(b)} = ${u(S)}. Úhel vedlejší doplňuje tento úhel do přímého: ${PRIMY} − ${u(S)} = ${u(K)}.`,
  );
}

/** Dvě odměření proti sobě: druhé jde zpět k prvnímu rameni, úhly se odečítají. */
function genL3Zpet(): PracticeTask | null {
  const J = pick(JMENA);
  const a = pick(ALFY.filter((x) => x >= 40));
  const b = pick(ALFY.filter((x) => x < a));
  const S = a - b;
  if (S === 90) return null;
  const K = 180 - S;
  if (K === a || K === b) return null; // odpověď by stála v zadání
  const VA = J.v + J.a;
  const dis: Distractor[] = [
    { value: u(S), why: "Tohle je úhel, který vznikl po obou odměřeních. Otázka se ptá na úhel k němu vedlejší, ten výsledek doplňuje do přímého úhlu." },
    ...(a + b < 180 && a + b !== 90
      ? [{ value: u(180 - a - b), why: "Úhly jsi sečetl, jako by druhé odměření šlo dál. Druhé odměření jde zpět k rameni, proto se úhly odečítají." }]
      : []),
    { value: u(180 - a), why: `Do přímého úhlu jsi doplnil jen první úhel ${u(a)}. Odměření zpět jsi vynechal.` },
    { value: u(360 - S), why: "Výsledný úhel jsi doplnil do plného úhlu. Vedlejší úhly dávají dohromady přímý úhel." },
  ];
  return uloha(
    `Od ramene ${VA} odměříš úhel ${u(a)}. Od nového ramene pak odměříš ${u(b)} zpět, směrem k rameni ${VA}. Jak velký je úhel vedlejší k úhlu, který svírá rameno ${VA} s posledním ramenem?`,
    u(K),
    dis,
    [
      `Druhé odměření jde zpět k rameni ${VA}, takže výsledný úhel je menší než první odměřený.`,
      `Nejdřív zjisti, jak velký úhel svírá rameno ${VA} s posledním ramenem: odměření zpět z prvního úhlu ubere. Úhel k němu vedlejší s ním pak tvoří přímý úhel, proto ho od přímého úhlu odečti.`,
    ],
    [
      `Po prvním odměření: ${u(a)}`,
      `Po odměření zpět: ${u(a)} − ${u(b)} = ${u(S)}`,
      `Úhel vedlejší: ${PRIMY} − ${u(S)} = ${u(K)}`,
    ],
    `Druhé odměření jde opačným směrem, takže z prvního úhlu ubírá: rameno ${VA} a poslední rameno svírají ${u(a)} − ${u(b)} = ${u(S)}. Úhel vedlejší doplňuje tento úhel do přímého: ${PRIMY} − ${u(S)} = ${u(K)}.`,
  );
}

// ── Generátor ──────────────────────────────────────────────────────────────
// L3 má šest šablon = sezení (6 úloh) projde každou právě jednou.
const SABLONY: Record<1 | 2 | 3, Sablona[]> = {
  1: [() => genL1Stupnice(true), () => genL1Stupnice(false), genL1Druh, genL1Rysovani],
  2: [genL2Vedlejsi, genL2Vrcholovy, genL2Nasobek, genL2Rysky],
  3: [genL3Rozdil, genL3Pomer, genL3Soucet, genL3Pres, genL3Dve, genL3Zpet],
};

/** Šablony se střídají dokola: index šablony = pořadí úlohy mod počet šablon. */
function rotace(sablony: Sablona[]): () => PracticeTask {
  const poradi = shuffle(sablony);
  let i = 0;
  return () => losUlohy(poradi[i++ % poradi.length]);
}

function gen(level: number): PracticeTask[] {
  const l = (level >= 3 ? 3 : level <= 1 ? 1 : 2) as 1 | 2 | 3;
  return ruzneUlohy(rotace(SABLONY[l]));
}

// ── Topic ────────────────────────────────────────────────────────────────
export const UHEL_RYSOVANI_MERENI: TopicMetadata[] = [
  {
    id: "g6-mat-uhel-rysovani-mereni-6",
    rvpNodeId: "g6-matematika-geometrie-v-rovine-a-v-prostoru-uhel-uhel-rysovani-mereni-uhlu-uhlomerem",
    displayName: "Měříme a rýsujeme úhly",
    title: "Úhel - rýsování, měření úhlu úhloměrem",
    studentTitle: "Měříme a rýsujeme úhly",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Úhel",
    briefDescription: "Čtení stupnice úhloměru, úhly vedlejší a vrcholové, rýsování násobků.",
    keywords: [
      "úhel", "úhloměr", "stupnice", "měření úhlu", "rýsování úhlu",
      "vedlejší úhly", "vrcholové úhly", "přímý úhel", "plný úhel",
    ],
    goals: [
      "Přečíst velikost úhlu na správné stupnici úhloměru.",
      "Popsat postup rýsování úhlu dané velikosti.",
      "Dopočítat úhel vedlejší a vrcholový, násobek a polovinu úhlu.",
      "Určit úhel větší než přímý a úhel mezi ryskami, které neleží na nule.",
    ],
    boundaries: [
      "Jen celé stupně (násobky 5), bez minut — ty patří sesterskému tématu.",
      "Bez obrázku: zadání se řeší ze slovního popisu.",
      "Bez rovnic a záporných čísel; inverzní úlohy se řeší úvahou.",
      "Žák vybírá ze čtyř možností, nepíše vlastní odpověď.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    recommendedNext: ["g6-mat-trojuhelniky-uhly-vyska-teznice-6"],
    generator: gen,
    helpTemplate: {
      hint: "Úhel čti na stupnici, která má u prvního ramene nulu. Vedlejší úhly dají dohromady přímý úhel, vrcholové jsou shodné.",
      steps: [
        "Střed úhloměru přilož do vrcholu úhlu, jedno rameno na nulu.",
        "Velikost přečti u druhého ramene na stupnici, která začíná nulou.",
        "Úhel vedlejší dopočítej do přímého úhlu, úhel větší než přímý do plného úhlu.",
      ],
      commonMistake: "Čtení čísla z druhé stupnice úhloměru nebo záměna úhlu vedlejšího a vrcholového.",
      example: "Úhel 50° má úhel vedlejší 180° − 50° = 130° a úhel vrcholový 50°.",
    },
  },
];
