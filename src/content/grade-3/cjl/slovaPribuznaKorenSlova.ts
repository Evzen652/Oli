import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QA { q: string; a: string; opts: string[]; e: string }

const POOL: QA[] = [
  { q: "Která slova jsou příbuzná se slovem 'les'?", a: "lesní, lesník, lesopark", opts: ["lesní, lesník, lesopark", "lest, lestivý, lestit", "les, lesk, lesknout", "leze, lezec, lezení"], e: "Lesní, lesník i lesopark mají v sobě kořen LES a všechna nějak souvisejí s lesem. Slovo 'lesk' nebo 'leze' zní podobně, ale les s leskem ani lezením nesouvisí." },
  { q: "Jaký je kořen slov: dům, domek, domácí, domov?", a: "DŮM / DOM", opts: ["DŮM / DOM", "DŮ", "DOMÁ", "DOME"], e: "Ve všech těchto slovech se skrývá část DŮM nebo DOM — domek je malý dům, domácí patří k domu, domov je místo, kde bydlíme. Tato společná část je kořen." },
  { q: "Které slovo NEPATŘÍ do skupiny příbuzných slov se slovem 'voda'?", a: "vodník, vodopád, vodit, vodní — VODIT nepatří", opts: ["vodník, vodopád, vodit, vodní — VODIT nepatří", "vodník je příbuzné", "vodopád je příbuzné", "vodní je příbuzné"], e: "Vodník, vodopád a vodní jsou příbuzná se 'vodou' — všechna nějak souvisejí s vodou. Vodit ale znamená vést někoho za ruku, s vodou nemá nic společného." },
  { q: "Jaký je kořen slov: les, lesní, lesník, lesopark?", a: "LES", opts: ["LES", "LESO", "LE", "LESK"], e: "Slova les, lesní, lesník a lesopark mají všechna společnou část LES. Lesopark je park s lesem, lesník se stará o les — kořen je LES." },
  { q: "Která slova jsou příbuzná se slovem 'hora'?", a: "horský, horolezec, horník", opts: ["horský, horolezec, horník", "hora, horko, horečka", "hora, hodit, honem", "horský, horký, horečka"], e: "Horský znamená 'patřící k hoře', horolezec leze na hory a horník pracuje pod zemí v hoře. Horko a horečka sice znějí podobně, ale nesouvisejí s horou — jsou to o teplotě." },
  { q: "Jaký je kořen slov: hora, horský, horolezec, horník?", a: "HOR", opts: ["HOR", "HORO", "HO", "HORA"], e: "Všechna tato slova mají společnou část HOR — hora, horský, horolezec i horník se nějak týkají hor nebo hornin. Kořen HOR je jejich společná část." },
  { q: "Která slova jsou příbuzná se slovem 'ruka'?", a: "ručka, rukavice, ručník", opts: ["ručka, rukavice, ručník", "ruka, rukovat, rušit", "ručka, ruský, rušno", "rukavice, ručník, rušit"], e: "Ručka je malá ruka, rukavice chrání ruce a ručník je látka na utírání rukou — všechna tato slova mají kořen RUK nebo RUČ a souvisejí s rukou. Rušit nebo ruský s rukou nesouvisejí." },
  { q: "Jaký je kořen slov: škola, školní, školák, školní?", a: "ŠKOL", opts: ["ŠKOL", "ŠKOLA", "ŠKO", "ŠKOLN"], e: "Ve slovech škola, školní a školák se vždy skrývá část ŠKOL. Školní den je den ve škole, školák je žák ve škole — kořen ŠKOL je jejich společná část." },
  { q: "Která slova jsou příbuzná se slovem 'země'?", a: "zemský, zeměpis, zemědělec", opts: ["zemský, zeměpis, zemědělec", "zem, zemdlít, zemřít", "zemský, zemřít, zemdlít", "zeměpis, zemřít, zoologický"], e: "Zemský znamená 'patřící k zemi', zeměpis popisuje zemi a zemědělec obdělává zemi. Zemdlít nebo zemřít znějí podobně, ale s pojmem 'země' nesouvisejí." },
  { q: "Jaký je kořen slov: voda, vodní, vodník, vodopád?", a: "VOD", opts: ["VOD", "VODA", "VO", "VODN"], e: "Vodní, vodník a vodopád — ve všech se skrývá kořen VOD. Vodník žije ve vodě, vodopád je padající voda, vodní znamená 'týkající se vody'." },
  { q: "Která slova jsou příbuzná se slovem 'strom'?", a: "stromový, stromek, stromořadí", opts: ["stromový, stromek, stromořadí", "strom, stromit, strach", "stromek, strop, strouhanka", "stromořadí, strach, stromový"], e: "Stromek je malý strom, stromový znamená 'patřící ke stromům', stromořadí je řada stromů. Strach nebo strop znějí trochu podobně, ale se stromem nesouvisejí." },
  { q: "Jaký je kořen slov: květ, kvetoucí, kvítí, rozkvetlý?", a: "KVET / KVĚT", opts: ["KVET / KVĚT", "KVÉTO", "KV", "KVETU"], e: "Květ, kvetoucí, kvítí i rozkvetlý — všechna tato slova mají společný kořen KVET nebo KVĚT a všechna se týkají kvetení. Rozkvetlý strom je strom, který kvete." },
  { q: "Která slova jsou příbuzná se slovem 'cesta'?", a: "cestovní, cestovatel, procestovat", opts: ["cestovní, cestovatel, procestovat", "cesta, cestovat, čistit", "cesta, cestovat, četník", "cestovní, cestovat, česat"], e: "Cestovní, cestovatel a procestovat mají kořen CEST a všechna nějak souvisejí s cestováním. Čistit nebo česat znějí trochu podobně, ale s cestou nemají nic společného." },
  { q: "Jaký je kořen slov: kniha, knižní, knihovna, knihkupectví?", a: "KNIH / KNIH", opts: ["KNIH", "KNIHO", "KNI", "KNIHK"], e: "Knižní znamená 'týkající se knih', knihovna je místo s knihami, knihkupectví prodává knihy — ve všech slovech najdeme kořen KNIH." },
  { q: "Která slova jsou příbuzná se slovem 'sníh'?", a: "sněžný, sněhulák, sněžit", opts: ["sněžný, sněhulák, sněžit", "sníh, snídat, snít", "sněžit, sniknout, snít", "sněhulák, snézt, snít"], e: "Sněžný, sněhulák a sněžit mají kořen SNĚH nebo SNĚŽ a všechna souvisejí se sněhem. Snídat nebo snít znějí podobně díky 'sn-', ale se sněhem nemají nic společného." },
  { q: "Jaký je kořen slov: ryba, rybník, rybář, rybí?", a: "RYB", opts: ["RYB", "RYBA", "RY", "RYBN"], e: "Ryba, rybník, rybář i rybí — všechna mají kořen RYB. Rybník je nádrž, kde žijí ryby, rybář ryby loví a rybí polévka je z ryb." },
  { q: "Která slova jsou příbuzná se slovem 'kůň'?", a: "koňský, koňar, kůň", opts: ["koňský, koňar, koňmo", "kůň, kůže, koupit", "koňský, koupit, koňmo", "koňar, kousnout, koňský"], e: "Koňský znamená 'patřící koni', koňar se stará o koně a koňmo znamená 'na koni' — všechna mají kořen KOŇ nebo KON. Kůže nebo koupit se koněm netýkají." },
  { q: "Jaký je kořen slov: pes, psí, pejsek, psovod?", a: "PES / PS", opts: ["PES / PS", "PESO", "PE", "PEJSK"], e: "Slova pes, psí, pejsek a psovod mají společný kořen PES nebo PS — psovod vede psa, psí boudu používá pes, pejsek je mazlivé slovo pro psa." },
  { q: "Která slova jsou příbuzná se slovem 'den'?", a: "denní, celodenní, polední", opts: ["denní, celodenní, polední", "den, dění, dýchat", "denní, děsit, denně", "polední, děkovat, denní"], e: "Denní řád je plán na celý den, celodenní znamená 'trvající celý den', polední je uprostřed dne — všechna mají kořen DEN nebo DEN. Děkovat nebo dýchat se dnem nesouvisejí." },
  { q: "Jaký je kořen slov: město, městský, maloměsto, měšťan?", a: "MĚST / MĚŠ", opts: ["MĚST / MĚŠ", "MĚSTE", "MĚ", "MĚSTO"], e: "Městský patří k městu, maloměsto je malé město, měšťan je obyvatel města — kořen je MĚST nebo MĚŠ. Všechna tato slova nějak souvisejí s městem." },
  { q: "Která slova jsou příbuzná se slovem 'vítr'?", a: "větrný, větrník, větrat", opts: ["větrný, větrník, větrat", "vítr, vítězit, vítěz", "větrat, vítěz, větrník", "větrník, vítřit, větrat"], e: "Větrný den je plný větru, větrník se točí od větru, větrat znamená pouštět čerstvý vzduch — všechna mají kořen VĚTR. Vítězit nebo vítěz se větrem nesouvisejí." },
  { q: "Jaký je kořen slov: ptát, otázka, dotaz, zeptat?", a: "PT / TÁZ / TAZ", opts: ["PT / TÁZ / TAZ", "OTÁZKO", "PT", "DOTAZ"], e: "Ptát se, otázka, dotaz a zeptat se — všechna nějak souvisejí s ptaním. Kořen se mění: PT (ptát), TÁZ (otázka), TAZ (dotaz) — ale všechna slova patří do stejné rodiny." },
  { q: "Která slova jsou příbuzná se slovem 'práce'?", a: "pracovní, pracovník, pracovat", opts: ["pracovní, pracovník, pracovat", "práce, pravda, pravý", "pracovní, pravit, pracovat", "pracovat, pravý, pracovník"], e: "Pracovní den je den plný práce, pracovník je člověk, který pracuje, pracovat znamená dělat práci — kořen PRAC nebo PRACOV. Pravda nebo pravý se prací nesouvisejí." },
  { q: "Jaký je kořen slov: sůl, solný, solit, osolit?", a: "SOL", opts: ["SOL", "SŮLE", "SO", "SOLIT"], e: "Sůl, solný, solit i osolit — všechna se týkají soli. Kořen je SOL (v sůl se změní na SŮL kvůli délce, ale základ zůstává stejný). Osolit jídlo znamená přidat do něj sůl." },
  { q: "Která slova jsou příbuzná se slovem 'světlo'?", a: "světelný, svítilna, osvětlení", opts: ["světelný, svítilna, osvětlení", "světlo, světový, světnice", "světelný, světový, svítit", "světlo, svítit, světový"], e: "Světelný výkon se týká světla, svítilna svítí (vydává světlo), osvětlení je zdroj světla — všechna mají kořen SVĚTL nebo SVĚT. Světový nebo světnice mají jiný kořen (svět ve smyslu 'světa')." },
  { q: "Jaký je kořen slov: noc, noční, půlnoc, nocovat?", a: "NOC", opts: ["NOC", "NOCE", "NO", "NOCOV"], e: "Noc, noční, půlnoc i nocovat — všechna se týkají noci. Noční klid je v noci, půlnoc je uprostřed noci, nocovat znamená strávit noc někde — kořen NOC." },
  { q: "Která slova jsou příbuzná se slovem 'zima'?", a: "zimní, zimnička, přezimovat", opts: ["zimní, zimnička, přezimovat", "zima, zimat, zímat", "zimní, zimovat, zímat", "přezimovat, zimat, zima"], e: "Zimní oblečení nosíme v zimě, zimnička je chladnička nebo chlad z zimy, přezimovat znamená přečkat zimu — kořen ZIM. Zímat nebo zimat nejsou skutečná slova." },
  { q: "Jaký je kořen slov: pít, nápoj, napít, výpit?", a: "PÍT / PIT / NAP", opts: ["PÍT / PIT / NAP", "PITÍ", "PI", "NÁPOJ"], e: "Pít, nápoj, napít se — všechna se týkají pití. Kořen se trochu mění: PÍT, PIT, nebo NAP (nápoj), ale všechna slova patří k pití tekutin." },
  { q: "Která slova patří do skupiny se slovem 'zahrada'?", a: "zahradní, zahradník, zahrádka", opts: ["zahradní, zahradník, zahrádka", "zahrada, zacházet, zahrát", "zahradní, zachovat, zahrát", "zahradník, záhada, zahrádka"], e: "Zahradní nábytek patří do zahrady, zahradník se stará o zahradu, zahrádka je malá zahrada — kořen ZAHRAD. Záhada nebo zacházet se zahradou nesouvisejí, i když začínají podobně." },
  { q: "Jaký je kořen slov: oko, oční, očko?", a: "OK / OČ", opts: ["OK / OČ", "OKO", "O", "OČKO"], e: "Oko, oční a očko — všechna se týkají oka. Oční lékař léčí oči, očko je malé oko — kořen se mění mezi OK (oko) a OČ (oční, očko), ale jde o stejnou rodinu slov." },
  { q: "Která slova jsou příbuzná se slovem 'moře'?", a: "mořský, námořník, přímořský", opts: ["mořský, námořník, přímořský", "moře, morát, mořit", "mořský, mořit, modrý", "námořník, morát, mořský"], e: "Mořský vzduch voní mořem, námořník pluje po moři, přímořský kraj leží u moře — kořen MOŘ nebo MOR. Mořit nebo modrý se s mořem nesouvisejí." },
  { q: "Jaký je kořen slov: mluvit, mluvčí, promluva, výmluva?", a: "MLUV", opts: ["MLUV", "MLUVI", "ML", "MLUVIT"], e: "Mluvit, mluvčí, promluva i výmluva — všechna se týkají mluvení. Mluvčí je ten, kdo mluví, promluva je řeč, výmluva je důvod (i když ne vždy pravdivý) — kořen MLUV." },
  { q: "Která slova jsou příbuzná se slovem 'srdce'?", a: "srdečný, srdcový, nesrdečný", opts: ["srdečný, srdcový, nesrdečný", "srdce, srdeční, srdit", "srdečný, srdit, srdco", "srdit, srdco, srdečný"], e: "Srdečný člověk je laskavý (má velké srdce), srdcový tvar připomíná srdce, nesrdečný je překlad slov bez srdce — všechna mají kořen SRDC nebo SRDEČ. Srdit se se srdcem nesouvisí." },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL.slice(0, 15) : level === 2 ? POOL.slice(15, 30) : POOL;
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Příbuzná slova mají stejný kořen — stejnou část, která nese hlavní význam.",
      "Kořen najdeš, když porovnáš více příbuzných slov a najdeš, co mají společného.",
    ],
    explanation: e,
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
