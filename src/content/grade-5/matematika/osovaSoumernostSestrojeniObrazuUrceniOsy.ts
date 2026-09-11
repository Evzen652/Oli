import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { choice } from "../_shared";
import { ciselnaUloha, pick, rnd, sada, shuffle } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností. Teď: L1 pojmy (osa, obraz bodu, souměrné
// tvary, osy čtverce, kruhu a trojúhelníků) · L2 počet os u písmen a dalších
// obrazců · L3 obraz bodu ve čtvercové síti podle svislé nebo vodorovné osy.

const L1: PracticeTask[] = [
  choice("Co je osa souměrnosti?", "přímka, podle které se obrazec dá přeložit na sebe", [
    { value: "nejdelší strana obrazce", why: "Osa nemusí být strana." },
    { value: "přímka, která obrazec rozdělí na dvě libovolné části", why: "Obě části musí být zrcadlově stejné." },
    { value: "bod uprostřed obrazce", why: "Osa je přímka, ne bod." },
  ], { hints: ["Co se stane, když osově souměrný obrázek složíš napůl přes osu?", "Obě poloviny se po přeložení přesně kryjí — jedna je zrcadlovým obrazem druhé."], explanation: "Osa souměrnosti je přímka, podle které se obrazec přeloží tak, že se obě poloviny kryjí." }),
  choice("Kde leží obraz bodu v osové souměrnosti?", "stejně daleko od osy jako bod, ale na druhé straně", [
    { value: "dvakrát dál od osy než bod", why: "Vzdálenost od osy se nemění." },
    { value: "vždy přímo na ose", why: "Na ose leží jen obraz bodu, který na ose už je." },
    { value: "na stejné straně osy jako bod", why: "Obraz je za osou, jako odraz za zrcadlem." },
  ], { hints: ["Představ si zrcadlo: kde za ním vidíš svůj odraz?", "Obraz leží na kolmici k ose, v téže vzdálenosti od ní, jakou má původní bod, jen za osou."], explanation: "Obraz bodu je stejně daleko od osy, na opačné straně." }),
  choice("Který z těchto tvarů je osově souměrný?", "srdce", [
    { value: "písmeno F", why: "F se v zrcadle změní v jiný tvar." },
    { value: "číslice 7", why: "Sedmička souměrná není." },
    { value: "písmeno Z", why: "Z nemá žádnou osu souměrnosti." },
  ], { hints: ["Který tvar můžeš přeložit napůl tak, aby se obě půlky kryly?", "Zkus si každý tvar představit se zrcátkem postaveným přesně uprostřed."], explanation: "Srdce má svislou osu souměrnosti." }),
  choice("Co v přírodě je osově souměrné?", "křídla motýla", [
    { value: "ulita šneka", why: "Ulita je stočená do spirály." },
    { value: "rozbitý kámen", why: "Úlomky mají nepravidelný tvar." },
    { value: "klikatá řeka", why: "Řeka se vine nepravidelně." },
  ], { hints: ["Co vypadá, jako by ho někdo vytiskl a pak přeložil napůl?", "Souměrné věci mají levou a pravou polovinu jako zrcadlové obrazy."], explanation: "Motýlí křídla jsou souměrná podle těla motýla." }),
  choice("Bod leží přímo na ose souměrnosti. Kde je jeho obraz?", "ve stejném místě jako bod", [
    { value: "na opačné straně osy", why: "Bod na ose má od osy vzdálenost nula." },
    { value: "dvakrát dál od osy", why: "Dvakrát nula je pořád nula." },
    { value: "nikde, obraz nemá", why: "Obraz má každý bod." },
  ], { hints: ["Jak daleko od osy je bod, který leží přímo na ní?", "Obraz má od osy tutéž vzdálenost co bod. Když je vzdálenost nulová, obraz a bod splynou."], explanation: "Bod na ose je sám sobě obrazem." }),
  choice("Kolik os souměrnosti má čtverec?", "4", [
    { value: "2", why: "Kromě dvou os středem stran má čtverec i dvě osy v úhlopříčkách." },
    { value: "1", why: "Čtverec se dá přeložit víc způsoby." },
    { value: "8", why: "Tolik způsobů přeložení čtverec nemá." },
  ], { hints: ["Podle kterých čar můžeš čtvercový papír přeložit, aby se půlky kryly?", "Čtverec se dá přeložit podle obou středních příček i podle obou úhlopříček."], explanation: "Čtverec má 4 osy: 2 střední příčky a 2 úhlopříčky." }),
  choice("Kolik os souměrnosti má kruh?", "nekonečně mnoho", [
    { value: "jednu", why: "Kruh se dá přeložit podle kteréhokoli průměru." },
    { value: "dvě", why: "Průměrů je víc než dva." },
    { value: "čtyři", why: "Průměrů je víc než čtyři." },
  ], { hints: ["Kolika způsoby můžeš přeložit kulatou placku napůl?", "Každá přímka, která prochází středem kruhu, ho rozdělí na dvě shodné poloviny."], explanation: "Každý průměr kruhu je osou souměrnosti." }),
  choice("Jak zkontroluješ, že je obrázek osově souměrný?", "přiložím zrcátko na osu nebo ho přeložím", [
    { value: "změřím jeho obvod", why: "Obvod o souměrnosti nic neřekne." },
    { value: "spočítám jeho strany", why: "Počet stran souměrnost neurčí." },
    { value: "otočím ho vzhůru nohama", why: "Otočení není přeložení." },
  ], { hints: ["Co ti ukáže druhou polovinu obrázku, když zakryješ tu první?", "Zrcadlo postavené na osu ukáže přesně chybějící polovinu; stejně funguje přeložení papíru."], explanation: "Souměrnost ověříme zrcátkem nebo přeložením." }),
  choice("Kolik os souměrnosti má obdélník, který není čtverec?", "2", [
    { value: "4", why: "Úhlopříčky obdélníku osami nejsou — po přeložení se půlky nekryjí." },
    { value: "1", why: "Obdélník se dá přeložit podél i napříč." },
    { value: "0", why: "Obdélník souměrný je." },
  ], { hints: ["Zkus přeložit obdélníkový papír podle úhlopříčky. Kryjí se půlky?", "Obdélník se dá přeložit jen podle čar spojujících středy protějších stran."], explanation: "Obdélník má 2 osy — střední příčky." }),
  choice("Kolik os souměrnosti má rovnoramenný trojúhelník, který není rovnostranný?", "1", [
    { value: "3", why: "Tři osy má jen rovnostranný trojúhelník." },
    { value: "2", why: "Druhá osa by vyžadovala další shodné strany." },
    { value: "0", why: "Rovnoramenný trojúhelník souměrný je." },
  ], { hints: ["Kde se potkávají dvě stejně dlouhá ramena?", "Osa vede vrcholem mezi rameny a středem základny."], explanation: "Rovnoramenný trojúhelník má jednu osu." }),
  choice("Je písmeno N osově souměrné?", "ne, žádnou osu nemá", [
    { value: "ano, má svislou osu", why: "Po svislém přeložení se N obrátí." },
    { value: "ano, má vodorovnou osu", why: "Po vodorovném přeložení se N obrátí." },
    { value: "ano, má dvě osy", why: "N nemá ani jednu osu." },
  ], { hints: ["Zkus N přeložit svisle a pak vodorovně. Kryjí se půlky?", "N se v zrcadle změní na obrácené N; stejné zůstane jen po otočení, a to osová souměrnost není."], explanation: "Písmeno N osu souměrnosti nemá." }),
  choice("Bod posuneme blíž k ose. Co se stane s jeho obrazem?", "obraz se také přiblíží k ose", [
    { value: "obraz se vzdálí od osy", why: "Obraz se hýbe stejně jako bod." },
    { value: "obraz zůstane na místě", why: "Obraz závisí na poloze bodu." },
    { value: "obraz přeskočí na stejnou stranu", why: "Obraz je vždy za osou." },
  ], { hints: ["Když přistoupíš k zrcadlu, co udělá tvůj odraz?", "Vzdálenost od osy mají bod i jeho zrcadlový protějšek vždy stejnou — mění se společně."], explanation: "Obraz je stejně daleko od osy jako bod, takže se přiblíží také." }),
  choice("Kolik os souměrnosti má rovnostranný trojúhelník?", "3", [
    { value: "1", why: "Osu má každý vrchol, ne jen jeden." },
    { value: "2", why: "Vrcholy jsou tři." },
    { value: "6", why: "Každá osa vede jedním vrcholem, osy se nezdvojují." },
  ], { hints: ["Kolik má rovnostranný trojúhelník vrcholů? Každým z nich může vést jedna osa.", "Osa vede vždy vrcholem a středem protější strany."], explanation: "Rovnostranný trojúhelník má 3 osy." }),
];

// Velká tiskací písmena: [písmeno, počet os, popis os]
const PISMENA: [string, number, string][] = [
  ["A", 1, "jedna svislá osa"], ["B", 1, "jedna vodorovná osa"], ["C", 1, "jedna vodorovná osa"], ["D", 1, "jedna vodorovná osa"], ["E", 1, "jedna vodorovná osa"],
  ["H", 2, "svislá i vodorovná osa"], ["I", 2, "svislá i vodorovná osa"], ["K", 1, "jedna vodorovná osa"], ["M", 1, "jedna svislá osa"], ["O", 2, "svislá i vodorovná osa"],
  ["T", 1, "jedna svislá osa"], ["U", 1, "jedna svislá osa"], ["V", 1, "jedna svislá osa"], ["W", 1, "jedna svislá osa"], ["X", 2, "svislá i vodorovná osa"],
  ["Y", 1, "jedna svislá osa"], ["F", 0, "žádná osa"], ["G", 0, "žádná osa"], ["L", 0, "žádná osa"], ["P", 0, "žádná osa"], ["R", 0, "žádná osa"], ["S", 0, "žádná osa"], ["Z", 0, "žádná osa"], ["J", 0, "žádná osa"],
];

function pismeno(): PracticeTask | null {
  const [p, n, popis] = pick(PISMENA);
  const chyby = ["0", "1", "2", "4"].filter((v) => v !== String(n)).map((v) => ({
    value: v,
    why: Number(v) > n ? `Písmeno ${p} tolik os nemá — má ${popis}.` : `Nějakou osu jsi přehlédl nebo přehlédla — písmeno ${p} má ${popis}.`,
  }));
  return ciselnaUloha(`Kolik os souměrnosti má velké tiskací písmeno ${p}?`, String(n), chyby, [
    `Zkus si písmeno ${p} představit přeložené svisle napůl. Kryjí se půlky? A co vodorovně?`,
    "Osa souměrnosti rozdělí písmeno na dvě zrcadlově stejné půlky. U tiskacích písmen vyzkoušej svislou a vodorovnou osu — každou zvlášť.",
  ], [`${p}: ${popis}`]);
}

// Obrazce, které nejsou v L1: [název, počet os, chyby]
const OBRAZCE: [string, string, [string, string][]][] = [
  ["kosočtverec (který není čtverec)", "2", [["4", "Kosočtverec nemá pravé úhly, osy středem stran nemá."], ["1", "Kosočtverec má osy v obou úhlopříčkách."], ["0", "Kosočtverec je souměrný podle úhlopříček."]]],
  ["pravidelný šestiúhelník", "6", [["3", "Kromě os vrcholy má i osy středy stran."], ["2", "Pravidelný šestiúhelník má os víc."], ["12", "Každá osa vede dvěma protějšími vrcholy nebo středy stran — os je tolik, kolik stran."]]],
  ["pravidelný pětiúhelník", "5", [["1", "Osa vede každým vrcholem, ne jen jedním."], ["10", "Každá osa vede vrcholem a středem protější strany — os je tolik, kolik vrcholů."], ["0", "Pravidelný pětiúhelník souměrný je."]]],
  ["kosodélník", "0", [["2", "Kosodélník po přeložení podle úhlopříčky ani středních příček nesedí."], ["1", "Žádné přeložení kosodélníku nedá dvě kryjící se půlky."], ["4", "Kosodélník osy nemá."]]],
  ["různostranný trojúhelník", "0", [["1", "Osa by potřebovala dvě stejně dlouhé strany."], ["3", "Tři osy má jen rovnostranný trojúhelník."], ["2", "Různostranný trojúhelník osy nemá."]]],
  ["rovnoramenný lichoběžník", "1", [["2", "Lichoběžník se dá přeložit jen svisle, středem obou základen."], ["0", "Rovnoramenný lichoběžník souměrný je."], ["4", "Tolik os lichoběžník nemá."]]],
  ["půlkruh", "1", [["2", "Po vodorovném přeložení se půlkruh nekryje."], ["0", "Půlkruh se dá přeložit podle kolmice ke straně ve středu."], ["nekonečně mnoho", "To má jen celý kruh."]]],
  ["ovál (elipsa)", "2", [["nekonečně mnoho", "To má kruh; ovál je protáhlý."], ["1", "Ovál se dá přeložit podél i napříč."], ["4", "Šikmo se ovál přeložit nedá."]]],
];

function obrazec(): PracticeTask | null {
  const [nazev, n, chyby] = pick(OBRAZCE);
  return ciselnaUloha(`Kolik os souměrnosti má ${nazev}?`, n, chyby.map(([value, why]) => ({ value, why })), [
    `Nakresli si ${nazev.split(" (")[0]}. Podle kterých čar ho můžeš přeložit, aby se půlky přesně kryly?`,
    "U mnohoúhelníků hledej osy vrcholy a středy stran. U pravidelných mnohoúhelníků je os tolik, kolik mají stran.",
  ], [`${nazev}: ${n === "0" ? "žádná osa" : n === "1" ? "jedna osa" : `${n} os`}`.replace("2 os", "2 osy").replace("nekonečně mnoho os", "nekonečně mnoho os")]);
}

function obrazBodu(): PracticeTask | null {
  const svisla = Math.random() < 0.5;
  const a = rnd(1, 6), b = rnd(1, 6);
  if (a === b) return null;
  const [tam, zpet, druha] = svisla ? ["vlevo od osy", "vpravo od osy", "nad spodním okrajem"] : ["nad osou", "pod osou", "od levého okraje"];
  const P = (x: number, strana: string, y: number) => `${pad(x, "ČTVEREČEK")} ${strana}, ${pad(y, "ČTVEREČEK")} ${druha}`;
  const key = P(a, zpet, b);
  return ciselnaUloha(`Ve čtvercové síti je ${svisla ? "svislá" : "vodorovná"} osa. Bod A leží ${pad(a, "ČTVEREČEK")} ${tam} a ${pad(b, "ČTVEREČEK")} ${druha}. Kde leží jeho obraz?`, key, [
    { value: P(a, tam, b), why: "To je místo samotného bodu. Obraz leží za osou." },
    { value: P(b, zpet, a), why: "Čísla se prohodila. Vzdálenost od osy i druhá souřadnice zůstanou stejné." },
    { value: P(2 * a, zpet, b), why: "Obraz je od osy stejně daleko jako bod, ne dvakrát dál." },
  ], [
    `Jak daleko od osy je bod A (${pad(a, "ČTVEREČEK")})? Na kterou stranu osy se obraz dostane?`,
    `Obraz leží za osou ve stejné vzdálenosti od ní. Ta druhá vzdálenost (${druha}) se nemění, protože se posouváš jen ${svisla ? "vodorovně" : "svisle"}.`,
  ], [`Vzdálenost od osy: ${pad(a, "ČTVEREČEK")} → obraz ${zpet}`, `${druha[0].toUpperCase()}${druha.slice(1)}: beze změny (${b})`]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(L1);
  if (level === 2) return sada(24, (i) => (i % 3 === 2 ? obrazec() : pismeno()));
  return sada(30, obrazBodu);
}

export const OSOVASOUMERNOSTSESTROJENIOBRAZUURCENIOSY: TopicMetadata[] = [
  {
    id: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    rvpNodeId: "g5-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-sestrojeni-obrazu-urceni-osy",
    title: "Osová souměrnost - sestrojení obrazu, určení osy",
    studentTitle: "Osová souměrnost",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Souměrnost",
    briefDescription: "Poznáš osovou souměrnost a naučíš se sestrojit obraz.",
    keywords: ["osová souměrnost", "osa souměrnosti", "zrcadlový obraz", "přeložení", "souměrný"],
    goals: [
      "Vysvětlit, co je osová souměrnost",
      "Určit osy souměrnosti obrazce",
      "Sestrojit obraz bodu nebo úsečky při osové souměrnosti",
      "Rozpoznat osově souměrné tvary v přírodě a každodenním životě",
    ],
    boundaries: ["Bez středové souměrnosti", "Bez analytické geometrie"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Osová souměrnost je jako přeložení papíru nebo zrcadlový odraz. Bod a jeho obraz jsou stejně daleko od osy, na opačných stranách.",
      steps: [
        "Najdi osu souměrnosti (přímku překládání).",
        "Z každého bodu veď kolmici na osu.",
        "Odměř stejnou vzdálenost na druhou stranu.",
        "Spoj body — to je obraz.",
      ],
      commonMistake: "Chyba: obraz není stejně daleko od osy jako originál. Vzdálenost bodu od osy = vzdálenost obrazu od osy.",
      example: "Čtverec se stranou 4 cm má 4 osy souměrnosti: 2 přes střednice stran, 2 přes úhlopříčky.",
    },
  },
];
