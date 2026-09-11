import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { shuffle, rnd } from "./_mat";
import { choice } from "../_shared";

// Přepsáno 2026-09-11 (audit 4. ročníku). L3 pracovala se souřadnicemi se
// zápornými čísly (bod [−2, 3]) — záporná čísla na 1. stupni nejsou.
// L1 byla jen Ano/Ne, L2 měla 6 a L3 4 různé úlohy. Teď:
// L1: vyber útvar (ne)souměrný (32 úloh z pevných dvojic) · L2: kolik os souměrnosti má útvar
// L3: vlastnosti osové souměrnosti (vzdálenost od osy, délky, vodorovná osa).

// Dvojice se stejným indexem nesdílejí slovo („písmeno“, „trojúhelník“,
// „číslice“): nápověda jmenuje útvar z protější řady a nesmí napovědět
// slovem z klíče.
const SOUMERNE = ["čtverec", "obdélník", "kruh", "rovnostranný trojúhelník", "rovnoramenný trojúhelník", "srdce", "motýl", "pěticípá hvězda", "domeček se stříškou", "písmeno A", "písmeno M", "písmeno T", "písmeno H", "písmeno V", "písmeno U", "písmeno W"];
const NESOUMERNE = ["písmeno F", "písmeno G", "písmeno J", "písmeno L", "písmeno P", "písmeno R", "písmeno S", "písmeno Z", "písmeno N", "různostranný trojúhelník", "kosodélník", "číslice 7", "číslice 4", "číslice 2", "číslice 6", "otazník"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function vyber(k: number, soumerny: boolean): PracticeTask {
  const [moje, protejsi] = soumerny ? [SOUMERNE, NESOUMERNE] : [NESOUMERNE, SOUMERNE];
  const klic = moje[k];
  const jmenovany = protejsi[k];
  const zbytek = protejsi.filter((o) => o !== jmenovany);
  // Klíč nesmí být nápadně nejdelší („rovnostranný trojúhelník“ mezi třemi písmeny).
  let ostatni: string[];
  do ostatni = [jmenovany, ...shuffle(zbytek).slice(0, 2)];
  while (klic.length > 15 && klic.length >= 2 * Math.max(...ostatni.map((o) => o.length)));
  return choice(soumerny ? "Který útvar je osově souměrný?" : "Který útvar NENÍ osově souměrný?", klic,
    ostatni.map((o) => ({ value: o, why: soumerny ? `${cap(o)} nejde přeložit tak, aby se obě poloviny překryly.` : `${cap(o)} osově souměrný je — dá se přeložit tak, že se poloviny překryjí.` })) as never, {
      hints: [
        `Začni třeba u možnosti „${jmenovany}“. Dá se přeložit tak, aby se obě půlky přesně překryly?`,
        `Osově souměrný útvar má čáru (osu), podél které ho přeložíš a obě části se přesně kryjí. ${soumerny ? "Hledej jedinou možnost, u které to jde" : "Hledej jedinou možnost, u které to nejde"} — zkus svislý, vodorovný i šikmý přehyb.`,
      ],
      explanation: soumerny
        ? `${cap(klic)} se dá přeložit podél osy tak, že se obě poloviny překryjí — je osově souměrný.`
        : `${cap(klic)} nejde přeložit tak, aby se poloviny překryly — osově souměrný není.`,
    });
}

interface Osy { tvar: string; pocet: string; proc: string }
const OSY: Osy[] = [
  { tvar: "čtverec", pocet: "4", proc: "Čtverec má dvě osy přes středy stran a dvě po úhlopříčkách." },
  { tvar: "obdélník", pocet: "2", proc: "Obdélník má jednu svislou a jednu vodorovnou osu. Po úhlopříčce se překrýt nedá." },
  { tvar: "rovnostranný trojúhelník", pocet: "3", proc: "Každým vrcholem rovnostranného trojúhelníku vede jedna osa." },
  { tvar: "rovnoramenný trojúhelník", pocet: "1", proc: "Osa vede jen vrcholem mezi rameny a středem základny." },
  { tvar: "různostranný trojúhelník", pocet: "0", proc: "Různostranný trojúhelník nemá žádnou osu — žádné dvě strany nejsou stejné." },
  { tvar: "kruh", pocet: "nekonečně mnoho", proc: "Kruh se dá přeložit podle kterékoli přímky jdoucí středem." },
  { tvar: "písmeno H", pocet: "2", proc: "Písmeno H má svislou i vodorovnou osu." },
  { tvar: "písmeno A", pocet: "1", proc: "Písmeno A má jen svislou osu." },
  { tvar: "písmeno E", pocet: "1", proc: "Písmeno E má jen vodorovnou osu." },
  { tvar: "písmeno F", pocet: "0", proc: "Písmeno F nejde přeložit tak, aby se poloviny překryly." },
  { tvar: "kosodélník", pocet: "0", proc: "Kosodélník nemá žádnou osu, i když má protější strany stejné." },
  { tvar: "písmeno X", pocet: "2", proc: "Písmeno X má svislou i vodorovnou osu." },
  { tvar: "písmeno O (kulaté)", pocet: "nekonečně mnoho", proc: "Kulaté O je kruh — osa vede kterýmkoli směrem přes střed." },
];
const POCTY = ["0", "1", "2", "3", "4", "nekonečně mnoho"];

function osy(o: Osy): PracticeTask {
  const spatne = shuffle(POCTY.filter((p) => p !== o.pocet)).slice(0, 3);
  return choice(`Kolik os souměrnosti má ${o.tvar}?`, o.pocet,
    spatne.map((p) => ({ value: p, why: o.proc })) as never, {
      hints: [
        `Kolika různými způsoby jde ${o.tvar} přeložit, aby se obě části překryly?`,
        `Zkus v duchu přehnout ${o.tvar} svisle, vodorovně i šikmo přes roh. Každé přeložení, při kterém se části přesně kryjí, je jedna osa.`,
      ],
      explanation: o.proc,
    });
}

const L3: PracticeTask[] = [
  choice("Bod leží 3 cm vlevo od osy souměrnosti. Kde leží jeho obraz?", "3 cm vpravo od osy", [
    { value: "3 cm vlevo od osy", why: "Obraz leží na druhé straně osy." },
    { value: "6 cm vpravo od osy", why: "Obraz je od osy stejně daleko jako bod, ne dvakrát dál." },
    { value: "přímo na ose", why: "Na ose leží obraz jen bodu, který na ose už je." },
  ], {
    hints: ["Na které straně osy obraz leží a jak daleko?", "Při osové souměrnosti se bod „přeloží“ přes osu. Obraz je na druhé straně, ale stejně daleko od osy."],
    explanation: "Obraz leží na druhé straně osy ve stejné vzdálenosti — 3 cm vpravo.",
  }),
  choice("Bod leží přímo na ose souměrnosti. Kde leží jeho obraz?", "na stejném místě", [
    { value: "o 1 cm vedle", why: "Bod na ose se při přeložení nepohne." },
    { value: "na druhém konci osy", why: "Bod se po ose nepřesouvá." },
    { value: "nemá žádný obraz", why: "Obraz má — splývá s bodem." },
  ], {
    hints: ["Co se stane s bodem na přehybu, když papír přeložíš?", "Body na ose se při přeložení nepohnou — přehyb se sám na sebe překryje."],
    explanation: "Bod na ose je sám sobě obrazem — zůstane na stejném místě.",
  }),
  choice("Úsečka AB měří 5 cm. Co platí o jejím obrazu v osové souměrnosti?", "má stejnou délku jako AB", [
    { value: "je dvakrát delší než AB", why: "Obraz se nezvětšuje — má stejnou délku." },
    { value: "je poloviční oproti AB", why: "Obraz se nezmenšuje — má stejnou délku." },
    { value: "jeho délka záleží na ose", why: "Délka se v osové souměrnosti nemění nikdy, ať je osa kdekoli." },
  ], {
    hints: ["Změní se velikost obrázku, když papír přeložíš a obkreslíš ho?", "Osová souměrnost útvar jen „převrátí“ na druhou stranu. Velikost ani tvar se nezmění."],
    explanation: "Osová souměrnost zachovává délky — obraz úsečky AB měří také 5 cm.",
  }),
  choice("Které písmeno má vodorovnou osu souměrnosti?", "E", [
    { value: "A", why: "A má svislou osu, ne vodorovnou." },
    { value: "M", why: "M má svislou osu, ne vodorovnou." },
    { value: "F", why: "F nemá žádnou osu." },
  ], {
    hints: ["Které písmeno vypadá stejně nahoře i dole?", "Vodorovná osa vede zleva doprava přes střed. Horní a dolní polovina se musí překrýt."],
    explanation: "E má stejnou horní a dolní polovinu — jeho osa je vodorovná.",
  }),
  choice("Které písmeno má svislou i vodorovnou osu souměrnosti?", "H", [
    { value: "A", why: "A má jen svislou osu." },
    { value: "E", why: "E má jen vodorovnou osu." },
    { value: "T", why: "T má jen svislou osu." },
  ], {
    hints: ["Které písmeno se překryje, když ho přeložíš zleva doprava i shora dolů?", "Hledej písmeno, které vypadá stejně vlevo i vpravo a zároveň nahoře i dole. U ostatních možností funguje nejvýš jeden z těch dvou přehybů."],
    explanation: "H se překryje při svislém i vodorovném přeložení — má obě osy.",
  }),
  choice("Který útvar má víc os souměrnosti než obdélník?", "čtverec", [
    { value: "rovnoramenný trojúhelník", why: "Ten má jen jednu osu, obdélník dvě." },
    { value: "kosodélník", why: "Kosodélník nemá žádnou osu." },
    { value: "různostranný trojúhelník", why: "Ten nemá žádnou osu." },
  ], {
    hints: ["Kolik os má obdélník a kolik ostatní útvary?", "Obdélník má dvě osy. Hledej útvar, který se dá přeložit ještě jinak — třeba i po úhlopříčce."],
    explanation: "Čtverec má 4 osy, obdélník jen 2.",
  }),
  choice("Proč obdélník nejde přeložit po úhlopříčce tak, aby se poloviny překryly?", "má různě dlouhé sousední strany", [
    { value: "je na přeložení příliš velký", why: "Velikost nerozhoduje." },
    { value: "nemá v rozích pravé úhly", why: "Obdélník pravé úhly má." },
    { value: "má čtyři rohy jako každý čtyřúhelník", why: "Čtverec má také čtyři rohy a po úhlopříčce překládat jde." },
  ], {
    hints: ["Čím se obdélník liší od čtverce?", "Po úhlopříčce by se dlouhá strana musela překrýt s krátkou. To nejde."],
    explanation: "Sousední strany obdélníku jsou různě dlouhé, a proto se po úhlopříčce nepřekryjí.",
  }),
  choice("Tvoje tvář v zrcadle je příkladem…", "osové souměrnosti", [
    { value: "zvětšení obrázku", why: "Obraz v zrcadle není větší." },
    { value: "posunutí obrázku", why: "V zrcadle se strany prohodí, nejen posunou." },
    { value: "otočení obrázku", why: "Zrcadlo obraz neotáčí, ale převrací." },
  ], {
    hints: ["Když zvedneš pravou ruku, kterou ruku zvedne obraz v zrcadle?", "Zrcadlo vytvoří obraz na druhé straně, stejně velký a převrácený — jako přeložení papíru přes osu."],
    explanation: "Zrcadlo převrací obraz jako osová souměrnost — zrcadlo je osa.",
  }),
  choice("Jak ověříš, že je obrázek osově souměrný?", "přeložím ho podél osy", [
    { value: "změřím jeho obvod", why: "Obvod o souměrnosti nic neřekne." },
    { value: "spočítám jeho barvy", why: "Barvy o souměrnosti nic neřeknou." },
    { value: "otočím ho vzhůru nohama", why: "Otočení není přeložení podél osy." },
  ], {
    hints: ["Co uděláš s papírem, abys zjistil nebo zjistila, jestli se poloviny kryjí?", "Stačí papír přehnout po předpokládané ose a podívat se, jestli se obě části přesně překryjí."],
    explanation: "Obrázek přeložíme podél osy — když se poloviny kryjí, je osově souměrný.",
  }),
  choice("Kolik os souměrnosti má pravidelný šestiúhelník (plástev včel)?", "6", [
    { value: "3", why: "Tři osy vedou vrcholy, další tři středy stran — celkem šest." },
    { value: "2", why: "Os je víc — vede jimi každý protější pár vrcholů i stran." },
    { value: "0", why: "Pravidelný šestiúhelník je souměrný." },
  ], {
    hints: ["Kolik vrcholů má šestiúhelník?", "Osy vedou přes protější vrcholy a přes středy protějších stran. Spočítej oba druhy."],
    explanation: "Tři osy vedou protějšími vrcholy a tři středy protějších stran — celkem 6.",
  }),
  choice("Motýl má jedno křídlo nakreslené. Jak nakreslíš druhé, aby byl souměrný?", "stejně velké, na druhé straně těla", [
    { value: "dvakrát větší", why: "Obraz má stejnou velikost." },
    { value: "na stejné straně těla", why: "Obraz leží na druhé straně osy." },
    { value: "otočené vzhůru nohama", why: "Křídlo se převrací podle osy, ne otáčí." },
  ], {
    hints: ["Co je u motýla osou souměrnosti?", "Osou je tělo motýla. Druhé křídlo je zrcadlovým obrazem prvního — přemýšlej, na kterou stranu ho zrcadlo přenese a jestli ho zvětší."],
    explanation: "Druhé křídlo nakreslíme jako obraz podle osy (těla): stejně velké, na druhé straně.",
  }),
  choice("Která číslice je osově souměrná?", "8", [
    { value: "7", why: "Sedmička nejde přeložit tak, aby se poloviny kryly." },
    { value: "4", why: "Čtyřka nemá osu souměrnosti." },
    { value: "2", why: "Dvojka nemá osu souměrnosti." },
  ], {
    hints: ["Která číslice vypadá stejně nahoře i dole nebo vlevo i vpravo?", "Zkus číslice v duchu přeložit. Jen jedna se překryje — její horní a dolní část jsou stejné."],
    explanation: "Osmička má stejnou horní i dolní polovinu (a i levou a pravou) — je osově souměrná.",
  }),
  choice("Bod A leží 5 cm od osy souměrnosti. Jak daleko je od svého obrazu A′?", "10 cm", [
    { value: "5 cm", why: "To je jen vzdálenost od osy. Obraz leží ještě stejný kus za osou." },
    { value: "2,5 cm", why: "Obraz není blíž — leží za osou ve stejné vzdálenosti jako A." },
    { value: "15 cm", why: "Na každé straně osy je jen jeden stejný kus, ne tři." },
  ], {
    hints: ["Jak daleko od osy leží obraz A′?", "Obraz A′ leží na druhé straně osy stejně daleko jako bod A. Vzdálenost A od A′ je tedy součet dvou stejných kusů."],
    explanation: "A je 5 cm před osou a A′ 5 cm za ní, dohromady 5 + 5 = 10 cm.",
  }),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return shuffle(SOUMERNE.flatMap((_, k) => [vyber(k, true), vyber(k, false)]));
  if (level === 2) return shuffle(OSY.map(osy));
  return shuffle(L3);
}

export const OSOVA_SOUMERNOST: TopicMetadata[] = [
  {
    id: "g4-mat-osova-soumernost-4",
    rvpNodeId: "g4-matematika-geometrie-v-rovine-a-v-prostoru-soumernost-osova-soumernost-osa-soumerne-utvary",
    displayName: "Osová souměrnost",
    title: "Osová souměrnost",
    studentTitle: "Osová souměrnost",
    subject: "matematika",
    category: "Geometrie v rovině a v prostoru",
    topic: "Souměrnost",
    briefDescription: "Poznáš souměrné tvary a najdeš jejich osu.",
    keywords: [
      "osová souměrnost", "osa souměrnosti", "souměrný útvar",
      "zrcadlení", "překládání", "symetrie",
    ],
    goals: [
      "Rozpoznat, zda je útvar osově souměrný.",
      "Nakreslit osu souměrnosti daného útvaru.",
      "Určit počet os souměrnosti základních útvarů.",
    ],
    boundaries: [
      "Pouze osová (zrcadlová) souměrnost.",
      "Nezahrnuje středovou souměrnost.",
      "Nezahrnuje rotační symetrii.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: ["g4-mat-trojuhelnik-druhy-stran-4"],
    generator: gen,
    helpTemplate: {
      hint: "Útvar je osově souměrný, pokud ho lze přeložit podél osy souměrnosti tak, aby se obě poloviny dokonale překryly (jako motýlí křídla).",
      steps: [
        "Zkus mentálně přeložit útvar podél svislé osy.",
        "Překrývají se obě půlky? → osa souměrnosti existuje.",
        "Zkus i vodorovnou a šikmou osu.",
        "Kolikrát to funguje = počet os souměrnosti.",
      ],
      commonMistake: "Obdélník má 2 osy souměrnosti (ne 4 jako čtverec) — úhlopříčky obdélníku NEJSOU osy souměrnosti.",
      example: "Čtverec: 4 osy (2 přes středy stran, 2 úhlopříčky). Obdélník: 2 osy (přes středy stran).",
    },
  },
];
