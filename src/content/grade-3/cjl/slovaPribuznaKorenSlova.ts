import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[] }

const POOL: QA[] = [
  { q: "Která slova jsou příbuzná se slovem 'les'?", a: "lesní, lesník, lesopark", opts: ["lesní, lesník, lesopark", "lest, lestivý, lestit", "les, lesk, lesknout", "leze, lezec, lezení"] },
  { q: "Jaký je kořen slov: dům, domek, domácí, domov?", a: "DŮM / DOM", opts: ["DŮM / DOM", "DŮ", "DOMÁ", "DOME"] },
  { q: "Které slovo NEPATŘÍ do skupiny příbuzných slov se slovem 'voda'?", a: "vodník, vodopád, vodit, vodní — VODIT nepatří", opts: ["vodník, vodopád, vodit, vodní — VODIT nepatří", "vodník je příbuzné", "vodopád je příbuzné", "vodní je příbuzné"] },
  { q: "Jaký je kořen slov: les, lesní, lesník, lesopark?", a: "LES", opts: ["LES", "LESO", "LE", "LESK"] },
  { q: "Která slova jsou příbuzná se slovem 'hora'?", a: "horský, horolezec, horník", opts: ["horský, horolezec, horník", "hora, horko, horečka", "hora, hodit, honem", "horský, horký, horečka"] },
  { q: "Jaký je kořen slov: hora, horský, horolezec, horník?", a: "HOR", opts: ["HOR", "HORO", "HO", "HORA"] },
  { q: "Která slova jsou příbuzná se slovem 'ruka'?", a: "ručka, rukavice, ručník", opts: ["ručka, rukavice, ručník", "ruka, rukovat, rušit", "ručka, ruský, rušno", "rukavice, ručník, rušit"] },
  { q: "Jaký je kořen slov: škola, školní, školák, školní?", a: "ŠKOL", opts: ["ŠKOL", "ŠKOLA", "ŠKO", "ŠKOLN"] },
  { q: "Která slova jsou příbuzná se slovem 'země'?", a: "zemský, zeměpis, zemědělec", opts: ["zemský, zeměpis, zemědělec", "zem, zemdlít, zemřít", "zemský, zemřít, zemdlít", "zeměpis, zemřít, zoologický"] },
  { q: "Jaký je kořen slov: voda, vodní, vodník, vodopád?", a: "VOD", opts: ["VOD", "VODA", "VO", "VODN"] },
  { q: "Která slova jsou příbuzná se slovem 'strom'?", a: "stromový, stromek, stromořadí", opts: ["stromový, stromek, stromořadí", "strom, stromit, strach", "stromek, strop, strouhanka", "stromořadí, strach, stromový"] },
  { q: "Jaký je kořen slov: květ, kvetoucí, kvítí, rozkvetlý?", a: "KVET / KVĚT", opts: ["KVET / KVĚT", "KVÉTO", "KV", "KVETU"] },
  { q: "Která slova jsou příbuzná se slovem 'cesta'?", a: "cestovní, cestovatel, procestovat", opts: ["cestovní, cestovatel, procestovat", "cesta, cestovat, čistit", "cesta, cestovat, četník", "cestovní, cestovat, česat"] },
  { q: "Jaký je kořen slov: kniha, knižní, knihovna, knihkupectví?", a: "KNIH / KNIH", opts: ["KNIH", "KNIHO", "KNI", "KNIHK"] },
  { q: "Která slova jsou příbuzná se slovem 'sníh'?", a: "sněžný, sněhulák, sněžit", opts: ["sněžný, sněhulák, sněžit", "sníh, snídat, snít", "sněžit, sniknout, snít", "sněhulák, snézt, snít"] },
  { q: "Jaký je kořen slov: ryba, rybník, rybář, rybí?", a: "RYB", opts: ["RYB", "RYBA", "RY", "RYBN"] },
  { q: "Která slova jsou příbuzná se slovem 'kůň'?", a: "koňský, koňar, kůň", opts: ["koňský, koňar, koňmo", "kůň, kůže, koupit", "koňský, koupit, koňmo", "koňar, kousnout, koňský"] },
  { q: "Jaký je kořen slov: pes, psí, pejsek, psovod?", a: "PES / PS", opts: ["PES / PS", "PESO", "PE", "PEJSK"] },
  { q: "Která slova jsou příbuzná se slovem 'den'?", a: "denní, celodenní, polední", opts: ["denní, celodenní, polední", "den, dění, dýchat", "denní, děsit, denně", "polední, děkovat, denní"] },
  { q: "Jaký je kořen slov: město, městský, maloměsto, měšťan?", a: "MĚST / MĚŠ", opts: ["MĚST / MĚŠ", "MĚSTE", "MĚ", "MĚSTO"] },
  { q: "Která slova jsou příbuzná se slovem 'vítr'?", a: "větrný, větrník, větrat", opts: ["větrný, větrník, větrat", "vítr, vítězit, vítěz", "větrat, vítěz, větrník", "větrník, vítřit, větrat"] },
  { q: "Jaký je kořen slov: ptát, otázka, dotaz, zeptat?", a: "PT / TÁZ / TAZ", opts: ["PT / TÁZ / TAZ", "OTÁZKO", "PT", "DOTAZ"] },
  { q: "Která slova jsou příbuzná se slovem 'práce'?", a: "pracovní, pracovník, pracovat", opts: ["pracovní, pracovník, pracovat", "práce, pravda, pravý", "pracovní, pravit, pracovat", "pracovat, pravý, pracovník"] },
  { q: "Jaký je kořen slov: sůl, solný, solit, osolit?", a: "SOL", opts: ["SOL", "SŮLE", "SO", "SOLIT"] },
  { q: "Která slova jsou příbuzná se slovem 'světlo'?", a: "světelný, svítilna, osvětlení", opts: ["světelný, svítilna, osvětlení", "světlo, světový, světnice", "světelný, světový, svítit", "světlo, svítit, světový"] },
  { q: "Jaký je kořen slov: noc, noční, půlnoc, nocovat?", a: "NOC", opts: ["NOC", "NOCE", "NO", "NOCOV"] },
  { q: "Která slova jsou příbuzná se slovem 'zima'?", a: "zimní, zimnička, přezimovat", opts: ["zimní, zimnička, přezimovat", "zima, zimat, zímat", "zimní, zimovat, zímat", "přezimovat, zimat, zima"] },
  { q: "Jaký je kořen slov: pít, nápoj, napít, výpit?", a: "PÍT / PIT / NAP", opts: ["PÍT / PIT / NAP", "PITÍ", "PI", "NÁPOJ"] },
  { q: "Která slova jsou příbuzná se slovem 'vlak'?", a: "vlakový, nádraží... Ne — vlakový, průvodčí ne", opts: ["vlakový, vlakotvorba, vlakový jízdní řád", "vlak, vlást, vlasti", "vlakový, vláčet, vlast", "vlak, vlachý, vlago"] },
  { q: "Jaký je kořen slov: bít, bitva, porazit... — správně: boj, bojový, bojovník?", a: "BOJ", opts: ["BOJ", "BOJE", "BO", "BOJOV"] },
  { q: "Která slova patří do skupiny se slovem 'zahrada'?", a: "zahradní, zahradník, zahrádka", opts: ["zahradní, zahradník, zahrádka", "zahrada, zacházet, zahrát", "zahradní, zachovat, zahrát", "zahradník, záhada, zahrádka"] },
  { q: "Jaký je kořen slov: oko, oční, brýle... správně: oko, oční, očko?", a: "OK / OČ", opts: ["OK / OČ", "OKO", "O", "OČKO"] },
  { q: "Která slova jsou příbuzná se slovem 'moře'?", a: "mořský, námořník, přímořský", opts: ["mořský, námořník, přímořský", "moře, morát, mořit", "mořský, mořit, modrý", "námořník, morát, mořský"] },
  { q: "Jaký je kořen slov: mluvit, mluvčí, promluva, výmluva?", a: "MLUV", opts: ["MLUV", "MLUVI", "ML", "MLUVIT"] },
  { q: "Která slova jsou příbuzná se slovem 'srdce'?", a: "srdečný, srdcový, upřímnosrdečný", opts: ["srdečný, srdcový, nesrdečný", "srdce, srdeční, srdit", "srdečný, srdit, srdco", "srdit, srdco, srdečný"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Příbuzná slova mají stejný kořen — stejnou část, která nese hlavní význam.",
      "Kořen najdeš, když porovnáš více příbuzných slov a najdeš, co mají společného.",
    ],
    solutionSteps: [
      "Zkus si říct různá slova s podobným významem.",
      "Najdi společnou část — to je kořen (např. LES v les, lesní, lesník).",
    ],
  }));
}

export const SLOVAPRIBYZNAKOREN: TopicMetadata[] = [
  {
    id: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-pribuzna-koren-slova",
    rvpNodeId: "g3-cjl-jazykova-vychova-nauka-o-slove-slova-pribuzna-koren-slova",
    title: "Slova příbuzná, kořen slova",
    studentTitle: "Příbuzná slova",
    illustrationDesc: "strom s kořeny, na větvích visí cedulky se slovy les, lesní, lesník, u kořene nápis kořen LES, veselé kreslené prostředí",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Nauka o slově",
    briefDescription: "Naučíš se najít příbuzná slova a jejich společný kořen.",
    keywords: ["příbuzná slova", "kořen slova", "rodina slov", "slovní základy"],
    goals: [
      "Rozpoznat skupinu příbuzných slov.",
      "Najít kořen v příbuzných slovech.",
      "Odlišit příbuzná slova od nepříbuzných.",
    ],
    boundaries: ["Jen základní skupiny příbuzných slov", "Bez předpon a přípon do hloubky"],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Příbuzná slova mají stejný kořen: les → lesní, lesník, lesopark. Kořen = společná část.",
      steps: [
        "Přečti si všechna slova a hledej, co mají společného.",
        "Porovnej: les, lesní, lesník — společná část je LES — to je kořen.",
      ],
      commonMistake: "Záměna podobně znějících slov (les × lesk) — nestačí znění, musí být i příbuzný význam.",
      example: "dům, domek, domácí, domov — kořen DŮM/DOM. Všechna slova nějak souvisejí s pojmem 'dům'.",
    },
  },
];
