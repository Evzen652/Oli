import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { ciselnaUloha, pick, rnd, sada, shuffle, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď se generuje tabulka (nebo popis
// sloupcového grafu) a otázky nad ní. Distraktory: hodnota z jiného řádku,
// součet místo rozdílu, zapomenutý řádek při sčítání, součet místo průměru.
// L1 přečíst hodnotu a najít největší · L2 rozdíl a součet · L3 průměr
// a výběr pravdivého tvrzení o tabulce.

interface Tema {
  nadpis: string;
  popisky: string[];
  kde: string[];
  kolik: (kde: string) => string;
  nejvic: string;
  rozdil: (k1: string, k2: string) => string;
  celkem: string;
  prumer: string;
  vic: (k1: string, k2: string) => string;
  nejvicTvrzeni: (k: string) => string;
}

const TEMATA: Tema[] = [
  {
    nadpis: "Prodané zmrzliny", popisky: ["pondělí", "úterý", "středa", "čtvrtek", "pátek"], kde: ["v pondělí", "v úterý", "ve středu", "ve čtvrtek", "v pátek"],
    kolik: (k) => `Kolik zmrzlin se prodalo ${k}?`, nejvic: "Kdy se prodalo nejvíc zmrzlin?",
    rozdil: (a, b) => `O kolik zmrzlin víc se prodalo ${a} než ${b}?`, celkem: "Kolik zmrzlin se prodalo za celý týden?", prumer: "Kolik zmrzlin se prodalo průměrně za den?",
    vic: (a, b) => `${a[0].toUpperCase()}${a.slice(1)} se prodalo víc zmrzlin než ${b}.`, nejvicTvrzeni: (k) => `Nejvíc zmrzlin se prodalo ${k}.`,
  },
  {
    nadpis: "Slunečné dny v měsíci", popisky: ["březen", "duben", "květen", "červen", "září"], kde: ["v březnu", "v dubnu", "v květnu", "v červnu", "v září"],
    kolik: (k) => `Kolik slunečných dní bylo ${k}?`, nejvic: "Ve kterém měsíci bylo nejvíc slunečných dní?",
    rozdil: (a, b) => `O kolik slunečných dní víc bylo ${a} než ${b}?`, celkem: "Kolik slunečných dní bylo ve všech pěti měsících dohromady?", prumer: "Kolik slunečných dní bylo průměrně za měsíc?",
    vic: (a, b) => `${a[0].toUpperCase()}${a.slice(1)} bylo víc slunečných dní než ${b}.`, nejvicTvrzeni: (k) => `Nejvíc slunečných dní bylo ${k}.`,
  },
  {
    nadpis: "Sesbíraný papír (kg)", popisky: ["5. A", "5. B", "5. C", "4. A", "4. B"], kde: ["v 5. A", "v 5. B", "v 5. C", "ve 4. A", "ve 4. B"],
    kolik: (k) => `Kolik kilogramů papíru se sesbíralo ${k}?`, nejvic: "Ve které třídě se sesbíralo nejvíc papíru?",
    rozdil: (a, b) => `O kolik kilogramů papíru víc se sesbíralo ${a} než ${b}?`, celkem: "Kolik kilogramů papíru sesbíraly všechny třídy dohromady?", prumer: "Kolik kilogramů papíru sesbírala průměrně jedna třída?",
    vic: (a, b) => `${a[0].toUpperCase()}${a.slice(1)} se sesbíralo víc papíru než ${b}.`, nejvicTvrzeni: (k) => `Nejvíc papíru se sesbíralo ${k}.`,
  },
  {
    nadpis: "Návštěvníci knihovny", popisky: ["pondělí", "úterý", "středa", "čtvrtek", "pátek"], kde: ["v pondělí", "v úterý", "ve středu", "ve čtvrtek", "v pátek"],
    kolik: (k) => `Kolik návštěvníků přišlo do knihovny ${k}?`, nejvic: "Kdy přišlo do knihovny nejvíc návštěvníků?",
    rozdil: (a, b) => `O kolik návštěvníků víc přišlo ${a} než ${b}?`, celkem: "Kolik návštěvníků přišlo za celý týden?", prumer: "Kolik návštěvníků přišlo průměrně za den?",
    vic: (a, b) => `${a[0].toUpperCase()}${a.slice(1)} přišlo víc návštěvníků než ${b}.`, nejvicTvrzeni: (k) => `Nejvíc návštěvníků přišlo ${k}.`,
  },
];

interface Data { t: Tema; n: number; hodnoty: number[]; typ: "tabulka" | "graf" }

function data(n = rnd(4, 5)): Data {
  const t = pick(TEMATA);
  const s = new Set<number>();
  while (s.size < n) s.add(rnd(3, 40));
  return { t, n, hodnoty: [...s], typ: Math.random() < 0.5 ? "tabulka" : "graf" };
}
const zadani = (d: Data) => d.typ === "tabulka"
  ? `Tabulka: ${d.t.nadpis} — ${d.t.popisky.slice(0, d.n).map((p, i) => `${p} ${d.hodnoty[i]}`).join(" | ")}.`
  : `Graf: sloupcový graf „${d.t.nadpis}“ má sloupce vysoké: ${d.t.popisky.slice(0, d.n).map((p, i) => `${p} ${d.hodnoty[i]}`).join(", ")}.`;

function precti(): PracticeTask | null {
  const d = data(), i = rnd(0, d.n - 1);
  const chyby: Chyba[] = d.hodnoty.map((h, j) => ({ value: h, why: `${h} patří k položce ${d.t.popisky[j]} — přečetl se jiný ${d.typ === "tabulka" ? "řádek" : "sloupec"}.` })).filter((_, j) => j !== i);
  return ciselnaUloha(`${zadani(d)} ${d.t.kolik(d.t.kde[i])}`, d.hodnoty[i], shuffle(chyby), [
    `Najdi v ${d.typ === "tabulka" ? "tabulce" : "grafu"} popisek „${d.t.popisky[i]}“. Pozor, nepleť si ho se sousední položkou ${d.t.popisky[i ? i - 1 : 1]} (${d.hodnoty[i ? i - 1 : 1]}).`,
    `Nejdřív najdi správný popisek, teprve potom čti hodnotu. U každé položky je jen jedno číslo — to, které stojí hned u ní${d.typ === "graf" ? " (výška sloupce)" : ""}. Když si nejsi jistý nebo jistá, přečti popisek i číslo ještě jednou a zkontroluj, že patří k sobě.`,
  ], [`U položky ${d.t.popisky[i]} je ${d.hodnoty[i]}.`]);
}

function nejvic(): PracticeTask | null {
  const d = data();
  const max = Math.max(...d.hodnoty), i = d.hodnoty.indexOf(max);
  const chyby: Chyba[] = d.t.kde.slice(0, d.n).map((k, j) => ({ value: k, why: `${d.t.popisky[j][0].toUpperCase()}${d.t.popisky[j].slice(1)} má ${d.hodnoty[j]} — to není nejvíc.` })).filter((_, j) => j !== i);
  return ciselnaUloha(`${zadani(d)} ${d.t.nejvic}`, d.t.kde[i], shuffle(chyby), [
    `Projdi všechna čísla: ${d.hodnoty.join(", ")}. Které je nejvyšší?`,
    `U tabulky hledáš nejvyšší číslo, u grafu nejvyšší sloupec. Porovnávej postupně: vezmi první číslo a každé další, které je vyšší, si zapamatuj místo něj. Nakonec se podívej, ke kterému popisku patří.`,
  ], [`Nejvyšší hodnota je ${max}, patří k položce ${d.t.popisky[i]}.`]);
}

function rozdil(): PracticeTask | null {
  const d = data();
  const [i, j] = shuffle([...Array(d.n).keys()]).slice(0, 2);
  const [a, b] = [d.hodnoty[i], d.hodnoty[j]];
  if (a <= b || a === 2 * b) return null;
  return ciselnaUloha(`${zadani(d)} ${d.t.rozdil(d.t.kde[i], d.t.kde[j])}`, a - b, [
    { value: a + b, why: "Hodnoty se sečetly. Otázka „o kolik víc“ se řeší odčítáním." },
    { value: a, why: `${a} je jen hodnota u položky ${d.t.popisky[i]}. Ještě od ní odečti ${b}.` },
    { value: a - b + 1, why: `Zkouška: ${b} + ${a - b + 1} = ${b + a - b + 1}, ne ${a}.` },
    { value: a - b - 1, why: `Zkouška: ${b} + ${a - b - 1} = ${a - 1}, ne ${a}.` },
  ], [
    `Najdi obě hodnoty: u položky ${d.t.popisky[i]} je ${a} a u položky ${d.t.popisky[j]} je ${b}. Co s nimi uděláš?`,
    "Otázka „o kolik víc“ se řeší odčítáním: od vyšší hodnoty odečti nižší. Zkouška: nižší hodnota + výsledek = vyšší hodnota.",
  ], [`${d.t.popisky[i]}: ${a}, ${d.t.popisky[j]}: ${b}`, `${a} − ${b} = ${a - b}`]);
}

function celkem(): PracticeTask | null {
  const d = data();
  const s = d.hodnoty.reduce((x, y) => x + y, 0);
  const vynechana = pick(d.hodnoty);
  return ciselnaUloha(`${zadani(d)} ${d.t.celkem}`, s, [
    { value: s - vynechana, why: `Jedna hodnota (${vynechana}) se nezapočítala. Sečti všech ${d.n === 4 ? "čtyř" : "pět"} čísel.` },
    { value: Math.max(...d.hodnoty) * d.n, why: "Nejvyšší hodnota se vynásobila počtem položek. Každá položka má ale jiné číslo." },
    { value: s + 10, why: "Chyba při sčítání desítek." },
    { value: s - 10, why: "Chyba při sčítání desítek — zkontroluj přenos." },
  ], [
    `Sečti postupně všechna čísla: ${d.hodnoty.join(" + ")}.`,
    `Celkem = součet všech hodnot. Sčítej postupně a odškrtávej, co už máš, ať žádnou z ${d.n === 4 ? "čtyř" : "pěti"} položek nevynecháš.`,
  ], [`${d.hodnoty.join(" + ")} = ${s}`]);
}

function prumer(): PracticeTask | null {
  const d = data();
  const s = d.hodnoty.reduce((x, y) => x + y, 0);
  if (s % d.n !== 0) return null;
  const p = s / d.n;
  if (d.hodnoty.includes(p)) return null;
  return ciselnaUloha(`${zadani(d)} ${d.t.prumer}`, p, [
    { value: s, why: `${s} je součet. Průměr dostaneš, když součet vydělíš počtem položek (${d.n}).` },
    { value: Math.max(...d.hodnoty) - Math.min(...d.hodnoty), why: "To je rozdíl nejvyšší a nejnižší hodnoty, ne průměr." },
    { value: p + 1, why: `Zkouška: ${d.n} × ${p + 1} = ${d.n * (p + 1)}, ale součet je ${s}.` },
    { value: p - 1, why: `Zkouška: ${d.n} × ${p - 1} = ${d.n * (p - 1)}, ale součet je ${s}.` },
  ], [
    `Kolik je součet všech hodnot ${d.hodnoty.join(" + ")}? A kolik je položek?`,
    `Průměr = součet všech hodnot ÷ počet položek. Položek je ${d.n === 4 ? "čtyři" : "pět"}, takže součet vyděl ${d.n === 4 ? "čtyřmi" : "pěti"}. Průměr musí ležet mezi nejnižší a nejvyšší hodnotou — tím si výsledek zkontroluješ.`,
  ], [`Součet: ${d.hodnoty.join(" + ")} = ${s}`, `Průměr: ${s} ÷ ${d.n} = ${p}`]);
}

function tvrzeni(): PracticeTask | null {
  const d = data(5);
  const idx = [...Array(5).keys()];
  const max = Math.max(...d.hodnoty), iMax = d.hodnoty.indexOf(max);
  const [i, j] = shuffle(idx).slice(0, 2);
  const [a, b] = d.hodnoty[i] > d.hodnoty[j] ? [i, j] : [j, i];
  const iNe = pick(idx.filter((k) => k !== iMax));
  const [p, q] = shuffle(idx.filter((k) => k !== a && k !== b)).slice(0, 2);
  const soucet = d.hodnoty[p] + d.hodnoty[q];
  const pravdiva = pick([
    { t: d.t.vic(d.t.kde[a], d.t.kde[b]), proc: `${d.hodnoty[a]} je víc než ${d.hodnoty[b]}.` },
    { t: d.t.nejvicTvrzeni(d.t.kde[iMax]), proc: `${max} je nejvyšší hodnota.` },
    { t: `Součet za položky ${d.t.popisky[p]} a ${d.t.popisky[q]} je ${soucet}.`, proc: `${d.hodnoty[p]} + ${d.hodnoty[q]} = ${soucet}.` },
  ]);
  const nepravdive = [
    { value: d.t.vic(d.t.kde[b], d.t.kde[a]), why: `Obráceně: ${d.t.popisky[b]} má ${d.hodnoty[b]}, ${d.t.popisky[a]} má ${d.hodnoty[a]}.` },
    { value: d.t.nejvicTvrzeni(d.t.kde[iNe]), why: `U položky ${d.t.popisky[iNe]} je ${d.hodnoty[iNe]}, nejvíc má ${d.t.popisky[iMax]} (${max}).` },
    { value: `Součet za položky ${d.t.popisky[p]} a ${d.t.popisky[q]} je ${soucet + 10}.`, why: `${d.hodnoty[p]} + ${d.hodnoty[q]} = ${soucet}, ne ${soucet + 10}.` },
  ].filter((n) => n.value !== pravdiva.t);
  const chyby = nepravdive.length >= 3 ? nepravdive : [...nepravdive, { value: d.t.vic(d.t.kde[b], d.t.kde[iMax] === d.t.kde[b] ? d.t.kde[a] : d.t.kde[iMax]), why: "Porovnej obě hodnoty v tabulce." }];
  return ciselnaUloha(`${zadani(d)} Které tvrzení je pravdivé?`, pravdiva.t, chyby, [
    `Ověř každé tvrzení. Začni tím o položkách ${d.t.popisky[a]} (${d.hodnoty[a]}) a ${d.t.popisky[b]} (${d.hodnoty[b]}).`,
    "U každého tvrzení najdi čísla, o kterých mluví, a zkontroluj je: porovnej je, najdi nejvyšší nebo je sečti. Pravdivé je jen jedno — ostatní tři v něčem nesedí, třeba je pořadí obrácené nebo sčítání nevychází.",
  ], [pravdiva.proc]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, (i) => (i % 2 ? nejvic() : precti()));
  if (level === 2) return sada(30, (i) => (i % 2 ? celkem() : rozdil()));
  return sada(30, (i) => (i % 2 ? tvrzeni() : prumer()));
}

export const DIAGRAMYGRAFYCTENIASESTAVOVANITABULEK: TopicMetadata[] = [
  {
    id: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek",
    rvpNodeId: "g5-matematika-zavislosti-vztahy-a-prace-s-daty-prace-s-daty-diagramy-grafy-cteni-a-sestavovani-tabulek",
    title: "Diagramy, grafy, čtení a sestavování tabulek",
    studentTitle: "Grafy a tabulky",
    subject: "matematika",
    category: "Závislosti, vztahy a práce s daty",
    topic: "Práce s daty",
    briefDescription: "Přečteš data z grafu a sestavíš tabulku.",
    keywords: ["graf", "sloupcový graf", "koláčový graf", "tabulka", "data", "průměr", "diagramy"],
    goals: [
      "Přečíst data ze sloupcového, řádkového a koláčového grafu",
      "Zodpovědět otázky o datech z grafu",
      "Sestavit jednoduchou tabulku z dat",
      "Vypočítat průměr z tabulkových dat",
    ],
    boundaries: ["Bez tvorby grafů jako takových — jen čtení a interpretace", "Bez statistických pojmů jako medián, modus"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Při čtení grafu vždy nejprve přečti popisky os a legendu. Pak hledej hodnotu, na kterou se ptáme.",
      steps: [
        "Přečti nadpis grafu — o čem je.",
        "Přečti popis osy (co je na svislé a vodorovné ose).",
        "Najdi sloupec nebo bod, na který se ptáme.",
        "Přečti hodnotu a odpověz.",
      ],
      commonMistake: "Chyba: splést vodorovnou a svislou osu. Svislá osa obvykle ukazuje hodnoty (čísla), vodorovná kategorie.",
      example: "Ze sloupcového grafu oblíbených sportů: fotbal = 12, plavání = 8. Kdo má více příznivců? Fotbal (12 > 8).",
    },
  },
];
