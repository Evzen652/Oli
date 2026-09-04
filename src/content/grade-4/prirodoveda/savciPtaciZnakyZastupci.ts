import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  { question: "Jaký je nejzákladnější znak savců?", correctAnswer: "Kojí mláďata mlékem", options: ["Kojí mláďata mlékem", "Mají peří", "Snáší vejce", "Jsou chladnokrevní"] },
  { question: "Je člověk savec?", correctAnswer: "Ano — má srst – chlupy a kojí mláďata", options: ["Ne — člověk je samostatná skupina", "Ano — má srst – chlupy a kojí mláďata", "Ano, ale jen kulturně, ne biologicky", "Ne — nechodí po čtyřech"] },
  { question: "Je velryba savec?", correctAnswer: "Ano — dýchá vzduch plícemi a kojí mláďata", options: ["Ne — žije ve vodě jako ryba", "Ano, ale pouze v letních měsících", "Ano — dýchá vzduch plícemi a kojí mláďata", "Ne — nemá srst"] },
  { question: "Je netopýr savec?", correctAnswer: "Ano — jediný létající savec, kojí mláďata", options: ["Ne — létá, takže je to pták", "Ano, ale je to výjimka bez srsti", "Ne — je to hmyz", "Ano — jediný létající savec, kojí mláďata"] },
  { question: "Jaký je nejzákladnější znak ptáků?", correctAnswer: "Peří – opeření tělo", options: ["Peří – opeření tělo", "Létání", "Snášení vajec", "Zobák"] },
  { question: "Je tučňák pták?", correctAnswer: "Ano — má peří a snáší vejce, ale nelétá", options: ["Ne — je to savec žijící v moři", "Ano — má peří a snáší vejce, ale nelétá", "Ne — létající ptáci jsou jediní praví ptáci", "Ano, ale je to savec s peřím"] },
  { question: "Je pštros pták?", correctAnswer: "Ano — má peří, ale nelétá; je nejrychlejší běhající pták", options: ["Ne — je příliš velký na to, aby byl pták", "Ne — je to savec s peřím", "Ano — má peří, ale nelétá; je nejrychlejší běhající pták", "Ano, ale jen v zoologické klasifikaci"] },
  { question: "Jaká zvířata jsou stálá (zimují v ČR)?", correctAnswer: "Vrabec, sýkorka, kos, holub, straka", options: ["Vlaštovka, čáp, kukačka", "Jelen, srnec, liška", "Kapr, štika, pstruh", "Vrabec, sýkorka, kos, holub, straka"] },
  { question: "Kteří ptáci jsou stěhovaví?", correctAnswer: "Vlaštovka, čáp a kukačka", options: ["Vlaštovka, čáp a kukačka", "Vrabec, sýkorka a kos", "Jelen, srnec a divočák", "Kapr, štika a okoun"] },
  { question: "Kde přezimuje vlaštovka?", correctAnswer: "V Africe", options: ["V jižní Evropě", "V Africe", "V České republice — schovává se", "V Azii"] },
  { question: "Jmenuj 3 typické savce ČR.", correctAnswer: "Jelen, liška, veverka", options: ["Lev, tygr a slon", "Velryba, tuleň, delfín", "Jelen, liška, veverka", "Krokodýl, leguán, chameleon"] },
  { question: "Co je zimní spánek?", correctAnswer: "Hluboký spánek přes celou zimu", options: ["Zimní stěhování na jih", "Letní odpočinek v horku", "Každodenní spánek v noci", "Hluboký spánek přes celou zimu"] },
  { question: "Jak se nazývá přední končetina ptáků?", correctAnswer: "Křídlo", options: ["Křídlo", "Ploutev", "Pazour", "Tlapka"] },
  { question: "Jaký pták staví čeleď hnízdo na střeše?", correctAnswer: "Čáp bílý", options: ["Sýkorka", "Čáp bílý", "Datel", "Kukačka"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší savci od ostatních obratlovců v péči o mláďata?", correctAnswer: "Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", options: ["Mláďata jsou ihned samostatná", "Vejce zahřívají oba rodiče stejně jako ptáci", "Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", "Savci mláďata neopečovávají"] },
  { question: "Proč jsou savci a ptáci teplokrevní?", correctAnswer: "Udrží si stálou teplotu těla", options: ["Jsou teplokrevní jen v létě", "Teplo berou ze slunce jako plazi", "Teplota těla jim kolísá s okolím", "Udrží si stálou teplotu těla"] },
  { question: "Jak probíhá migrace ptáků — co je navigace?", correctAnswer: "Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", options: ["Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", "Ptáci se orientují jen podle větru", "Navigace probíhá jen pomocí zraku a paměti", "Ptáci migrují náhodně — teplota je naviguje"] },
  { question: "Proč housata chodí všude za matkou?", correctAnswer: "Hned po vylíhnutí si ji zapamatují", options: ["Naučí se to až po roce života", "Hned po vylíhnutí si ji zapamatují", "Umějí napodobit lidský hlas", "Je to vrozené, nic se neučí"] },
  { question: "Proč velryba potřebuje vynořovat?", correctAnswer: "Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", options: ["Vynořuje se pro sluneční světlo k fotosyntéze kůže", "Vynořuje se pro snížení tělesné teploty", "Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", "Velryba nevynořuje — dýchá pod vodou rozpuštěný kyslík"] },
  { question: "Jak se liší kachna a labuť od volavky a čápa?", correctAnswer: "Vrubozobí plavou, brodiví se brodí", options: ["Oba typy jsou úplně stejné", "Brodiví plavou lépe než vrubozobí", "Vrubozobí loví ryby, brodiví trávu", "Vrubozobí plavou, brodiví se brodí"] },
  { question: "Proč netopýr létá v noci?", correctAnswer: "Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", options: ["Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", "Netopýr vidí nejlépe v úplné tmě", "Netopýr se bojí slunečního světla", "Netopýr loví v noci, protože přes den spí kvůli teplu"] },
  { question: "Jaký je rozdíl mezi zajícem a králíkem?", correctAnswer: "Zajíc žije na poli, králík v noře", options: ["Králík žije na poli, zajíc v noře", "Zajíc žije na poli, králík v noře", "Králík je větší než zajíc", "Zajíc je domácí, králík divoký"] },
  { question: "Proč někteří ptáci odlétají na zimu?", correctAnswer: "V zimě u nás nenajdou potravu", options: ["Nesnesou tmu krátkých dnů", "Chtějí poznat jiné krajiny", "V zimě u nás nenajdou potravu", "Odlétají za lepší vodou"] },
  { question: "Jak se živí mládě savce před narozením?", correctAnswer: "Z těla matky ještě v břiše", options: ["Z tuku uloženého na zimu", "Z mléka hned po narození", "Ze žloutku uvnitř vejce", "Z těla matky ještě v břiše"] },
  { question: "Jak bobr mění krajinu kolem řeky?", correctAnswer: "Staví hráze a zadržuje vodu", options: ["Staví hráze a zadržuje vodu", "Kácí stromy a škodí lesu", "Nemá na krajinu žádný vliv", "Podmáčí půdu a působí povodně"] },
  { question: "Jak se liší zobák dravých ptáků od pěvců?", correctAnswer: "Dravci mají zahnutý zobák na maso", options: ["Dravci mají zobák delší než pěvci", "Dravci mají zahnutý zobák na maso", "Pěvci mají zahnutý zobák, dravci rovný", "Všichni ptáci mají stejný zobák"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Velryba žije celý život v moři a plave jako ryba. Podle čeho poznáš, že mezi ryby nepatří?", correctAnswer: "Dýchá plícemi a mládě kojí mlékem", options: ["Podle ploutví a hladké kůže bez šupin", "Podle toho, že žije ve slané vodě", "Dýchá plícemi a mládě kojí mlékem", "Podle toho, že klade vejce na mořské dno"], hints: ["Nedívej se na to, kde zvíře žije, ale jak dýchá a čím krmí mláďata."] },
  { question: "Netopýr létá a v noci loví hmyz podobně jako vlaštovka. Proč ho přesto řadíme jinam než ji?", correctAnswer: "Má srst a rodí živá mláďata, která kojí", options: ["Protože létá jen v noci, a ne ve dne", "Protože jeho křídla jsou pokrytá peřím", "Protože se za letu orientuje sluchem", "Má srst a rodí živá mláďata, která kojí"], hints: ["Rozhodují stavba těla a péče o mláďata, ne způsob pohybu."] },
  { question: "Pták má krátký, silný a kuželovitý zobák. Čím se nejspíš živí?", correctAnswer: "Semeny, která jím rozlouskne", options: ["Semeny, která jím rozlouskne", "Masem, které jím trhá na kusy", "Nektarem z hlubokých květů", "Rybami, které jím propichuje"], hints: ["Tvar zobáku prozradí potravu. Na co se hodí krátký a silný nástroj?"] },
  { question: "Savec má dlouhé špičáky a ostré zuby. Čím se nejspíš živí?", correctAnswer: "Loví jiná zvířata a žere maso", options: ["Spásá trávu na louce", "Loví jiná zvířata a žere maso", "Rozemílá tvrdá zrna", "Saje nektar z květů"], hints: ["K čemu se hodí špičatý a ostrý zub — k trhání, nebo k drcení?"] },
  { question: "Vlaštovka na podzim odlétá, sýkora u nás zůstává. Co o tom rozhoduje?", correctAnswer: "Zda pták najde svou potravu i v zimě", options: ["Velikost ptáka — menší ptáci odlétají", "Barva peří — tmaví ptáci zůstávají", "Zda pták najde svou potravu i v zimě", "Stáří ptáka — mladí odlétají vždy"], hints: ["Vlaštovka loví hmyz, sýkora zobe i semena. Co je v lednu k sehnání?"] },
  { question: "Proč savci nemusí na zimu odlétat do teplých krajin?", correctAnswer: "Srst je udrží v teple a potravu si najdou i v zimě", options: ["Protože v zimě vůbec nic nejedí", "Protože se jim v zimě zrychlí dýchání", "Protože všichni savci zimu prospí", "Srst je udrží v teple a potravu si najdou i v zimě"], hints: ["Čím je savec pokrytý a co mu to v mrazu dává?"] },
  { question: "Ptakopysk klade vejce. Proč ho přesto řadíme mezi savce?", correctAnswer: "Mláďata kojí mlékem a tělo má pokryté srstí", options: ["Mláďata kojí mlékem a tělo má pokryté srstí", "Protože žije ve vodě jako mnozí savci", "Protože má zobák podobný kachnímu", "Protože mezi savce byl zařazen omylem"], hints: ["Který znak mají všichni savci, i ti nejpodivnější?"] },
  { question: "Kachňata běhají hned po vylíhnutí, mláďata kosa leží holá v hnízdě. Co z toho plyne pro rodiče?", correctAnswer: "Kosí rodiče musí mláďata v hnízdě dlouho krmit, kachní ne", options: ["Kachní rodiče se o mláďata starají mnohem déle", "Kosí rodiče musí mláďata v hnízdě dlouho krmit, kachní ne", "Oba druhy rodičů se starají úplně stejně dlouho", "Mláďata kosa se osamostatní dřív než kachňata"], hints: ["Kdo si potravu neobstará sám, potřebuje, aby ji někdo nosil."] },
  { question: "Proč jsou ptačí kosti uvnitř duté?", correctAnswer: "Aby bylo tělo lehčí a pták se udržel ve vzduchu", options: ["Aby se do nich vešlo více kostní dřeně", "Aby byly pevnější než kosti plné", "Aby bylo tělo lehčí a pták se udržel ve vzduchu", "Aby si v nich pták ukládal zásoby potravy"], hints: ["Co musí pták při letu překonávat — a co mu to usnadní?"] },
  { question: "Sova se snese na kořist tak, že ji myš neslyší přilétat. Který znak jí to umožňuje?", correctAnswer: "Měkké okraje peří, které tlumí zvuk letu", options: ["Duté kosti, díky nimž je lehká", "Ostré drápy na silných nohou", "Velké oči přizpůsobené vidění ve tmě", "Měkké okraje peří, které tlumí zvuk letu"], hints: ["Všechny nabídnuté znaky sova opravdu má. Hledej ten jediný, který souvisí se zvukem."] },
  { question: "Liška má v zimě mnohem hustší srst než v létě. K čemu jí to je?", correctAnswer: "Hustá srst ji chrání před chladem", options: ["Hustá srst ji chrání před chladem", "Aby ji nebylo ve sněhu vidět", "Aby po sněhu rychleji běhala", "Aby unesla víc ulovené potravy"], hints: ["Co potřebuje teplokrevné zvíře v mrazu nejvíc udržet?"] },
  { question: "Který znak mají savci a ptáci společný?", correctAnswer: "Stálou tělesnou teplotu", options: ["Tělo pokryté srstí", "Stálou tělesnou teplotu", "Kojení mláďat mlékem", "Tělo pokryté peřím"], hints: ["Tři z nabídnutých znaků patří jen jedné skupině. Hledej ten čtvrtý."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 45);
}

export const SAVCIPTACIZNAKYZASTUPCI: TopicMetadata[] = [
  {
    id: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-savci-ptaci-znaky-zastupci",
    rvpNodeId: "g4-prirodoveda-rozmanitost-prirody-ziva-priroda-zivocichove-savci-ptaci-znaky-zastupci",
    title: "Savci, ptáci - znaky, zástupci",
    studentTitle: "Savci a ptáci",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Rozmanitost přírody",
    briefDescription: "Poznáš znaky savců a ptáků a naučíš se je rozeznávat.",
    keywords: ["savci", "ptáci", "srst", "peří", "teplokrevní", "kojení", "migrace", "stěhování", "velryba", "netopýr"],
    goals: [
      "Vyjmenovat znaky savců a ptáků",
      "Uvést příklady savců a ptáků v ČR",
      "Vysvětlit, proč velryba a netopýr jsou savci",
      "Rozlišit stálé a stěhovavé ptáky",
    ],
    boundaries: [
      "Neprobírá podrobnou anatomii ani genetiku — patří na 2. stupeň",
      "Neprobírá evoluční pojmy (konvergentní evoluce, adaptivní radiace)",
      "Neprobírá odbornou fyziologii (metabolismus, echolokace, hibernace)",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Savci: srst + kojení. Ptáci: peří + vejce. Velryba a netopýr jsou savci!",
      steps: [
        "1. Savci: srst/chlupy, teplokrevní, kojí mláďata mlékem.",
        "2. Ptáci: peří, teplokrevní, vejce, křídla.",
        "3. Stěhovavé: vlaštovka, čáp → Afrika. Stálé: vrabec, sýkorka.",
        "4. Netopýr = savec (létá). Velryba = savec (plave). Tučňák = pták (nelétá).",
      ],
      commonMistake: "Velryba NENÍ ryba — je to savec, dýchá vzduch plícemi.",
      example: "Netopýr: má srst, kojí mláďata, má echolokaci — to jsou savčí znaky.",
    },
  },
];
