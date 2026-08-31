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
  { question: "Je člověk savec?", correctAnswer: "Ano — má srst – chlupy a kojí mláďata", options: ["Ano — má srst – chlupy a kojí mláďata", "Ne — člověk je samostatná skupina", "Ano, ale jen kulturně, ne biologicky", "Ne — nechodí po čtyřech"] },
  { question: "Je velryba savec?", correctAnswer: "Ano — dýchá vzduch plícemi a kojí mláďata", options: ["Ano — dýchá vzduch plícemi a kojí mláďata", "Ne — žije ve vodě jako ryba", "Ano, ale pouze v letních měsících", "Ne — nemá srst"] },
  { question: "Je netopýr savec?", correctAnswer: "Ano — jediný létající savec, kojí mláďata", options: ["Ano — jediný létající savec, kojí mláďata", "Ne — létá, takže je to pták", "Ano, ale je to výjimka bez srsti", "Ne — je to hmyz"] },
  { question: "Jaký je nejzákladnější znak ptáků?", correctAnswer: "Peří – opeření tělo", options: ["Peří – opeření tělo", "Létání", "Snášení vajec", "Zobák"] },
  { question: "Je tučňák pták?", correctAnswer: "Ano — má peří a snáší vejce, ale nelétá", options: ["Ano — má peří a snáší vejce, ale nelétá", "Ne — je to savec žijící v moři", "Ne — létající ptáci jsou jediní praví ptáci", "Ano, ale je to savec s peřím"] },
  { question: "Je pštros pták?", correctAnswer: "Ano — má peří, ale nelétá; je nejrychlejší běhající pták", options: ["Ano — má peří, ale nelétá; je nejrychlejší běhající pták", "Ne — je příliš velký na to, aby byl pták", "Ne — je to savec s peřím", "Ano, ale jen v zoologické klasifikaci"] },
  { question: "Jaká zvířata jsou stálá (zimují v ČR)?", correctAnswer: "Vrabec, sýkorka, kos, holub, straka", options: ["Vrabec, sýkorka, kos, holub, straka", "Vlaštovka, čáp, kukačka", "Jelen, srnec, liška", "Kapr, štika, pstruh"] },
  { question: "Kteří ptáci jsou stěhovaví?", correctAnswer: "Vlaštovka, čáp a kukačka", options: ["Vrabec, sýkorka a kos", "Vlaštovka, čáp a kukačka", "Jelen, srnec a divočák", "Kapr, štika a okoun"] },
  { question: "Kde přezimuje vlaštovka?", correctAnswer: "V Africe", options: ["V Africe", "V jižní Evropě", "V České republice — schovává se", "V Azii"] },
  { question: "Jmenuj 3 typické savce ČR.", correctAnswer: "Jelen, liška, veverka", options: ["Lev, tygr a slon", "Jelen, liška, veverka", "Velryba, tuleň, delfín", "Krokodýl, leguán, chameleon"] },
  { question: "Co je zimní spánek?", correctAnswer: "Hluboký spánek přes celou zimu", options: ["Zimní stěhování na jih", "Hluboký spánek přes celou zimu", "Letní odpočinek v horku", "Každodenní spánek v noci"] },
  { question: "Jak se nazývá přední končetina ptáků?", correctAnswer: "Křídlo", options: ["Ploutev", "Křídlo", "Pazour", "Tlapka"] },
  { question: "Jaký pták staví čeleď hnízdo na střeše?", correctAnswer: "Čáp bílý", options: ["Čáp bílý", "Sýkorka", "Datel", "Kukačka"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší savci od ostatních obratlovců v péči o mláďata?", correctAnswer: "Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", options: ["Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", "Mláďata jsou ihned samostatná", "Vejce zahřívají oba rodiče stejně jako ptáci", "Savci mláďata neopečovávají"] },
  { question: "Proč jsou savci a ptáci teplokrevní?", correctAnswer: "Udrží si stálou teplotu těla", options: ["Jsou teplokrevní jen v létě", "Udrží si stálou teplotu těla", "Teplo berou ze slunce jako plazi", "Teplota těla jim kolísá s okolím"] },
  { question: "Jak probíhá migrace ptáků — co je navigace?", correctAnswer: "Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", options: ["Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", "Ptáci se orientují jen podle větru", "Navigace probíhá jen pomocí zraku a paměti", "Ptáci migrují náhodně — teplota je naviguje"] },
  { question: "Proč housata chodí všude za matkou?", correctAnswer: "Hned po vylíhnutí si ji zapamatují", options: ["Naučí se to až po roce života", "Hned po vylíhnutí si ji zapamatují", "Umějí napodobit lidský hlas", "Je to vrozené, nic se neučí"] },
  { question: "Proč velryba potřebuje vynořovat?", correctAnswer: "Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", options: ["Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", "Vynořuje se pro sluneční světlo k fotosyntéze kůže", "Vynořuje se pro snížení tělesné teploty", "Velryba nevynořuje — dýchá pod vodou rozpuštěný kyslík"] },
  { question: "Jak se liší kachna a labuť od volavky a čápa?", correctAnswer: "Vrubozobí plavou, brodiví se brodí", options: ["Oba typy jsou úplně stejné", "Vrubozobí plavou, brodiví se brodí", "Brodiví plavou lépe než vrubozobí", "Vrubozobí loví ryby, brodiví trávu"] },
  { question: "Proč netopýr létá v noci?", correctAnswer: "Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", options: ["Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", "Netopýr vidí nejlépe v úplné tmě", "Netopýr se bojí slunečního světla", "Netopýr loví v noci, protože přes den spí kvůli teplu"] },
  { question: "Jaký je rozdíl mezi zajícem a králíkem?", correctAnswer: "Zajíc žije na poli, králík v noře", options: ["Králík žije na poli, zajíc v noře", "Zajíc žije na poli, králík v noře", "Králík je větší než zajíc", "Zajíc je domácí, králík divoký"] },
  { question: "Proč někteří ptáci odlétají na zimu?", correctAnswer: "V zimě u nás nenajdou potravu", options: ["Nesnesou tmu krátkých dnů", "V zimě u nás nenajdou potravu", "Chtějí poznat jiné krajiny", "Odlétají za lepší vodou"] },
  { question: "Jak se živí mládě savce před narozením?", correctAnswer: "Z těla matky ještě v břiše", options: ["Z tuku uloženého na zimu", "Z těla matky ještě v břiše", "Z mléka hned po narození", "Ze žloutku uvnitř vejce"] },
  { question: "Jak bobr mění krajinu kolem řeky?", correctAnswer: "Staví hráze a zadržuje vodu", options: ["Kácí stromy a škodí lesu", "Staví hráze a zadržuje vodu", "Nemá na krajinu žádný vliv", "Podmáčí půdu a působí povodně"] },
  { question: "Jak se liší zobák dravých ptáků od pěvců?", correctAnswer: "Dravci mají zahnutý zobák na maso", options: ["Dravci mají zobák delší než pěvci", "Dravci mají zahnutý zobák na maso", "Pěvci mají zahnutý zobák, dravci rovný", "Všichni ptáci mají stejný zobák"] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Co je konvergentní evoluce a uveď příklad u savců?", correctAnswer: "Nezávislý vývoj podobných znaků u nepříbuzných druhů — ploutve delfína a ryby – různí předci", options: ["Nezávislý vývoj podobných znaků u nepříbuzných druhů — ploutve delfína a ryby – různí předci", "Vývoj příbuzných druhů do různých prostředí", "Přizpůsobení celých populací na jedno prostředí", "Paralelní vývoj dvou druhů ve stejném prostředí"] },
  { question: "Co je adaptivní radiace a uveď příklad u ptáků?", correctAnswer: "Rychlé evoluční většení z jednoho předka do různých ekologických nik — Darwinovy pěnkavy na Galapágách", options: ["Rychlé evoluční většení z jednoho předka do různých ekologických nik — Darwinovy pěnkavy na Galapágách", "Migrace ptáků do nových oblastí", "Zánik druhů způsobený adaptací na jedno prostředí", "Rychlé množení jednoho druhu v přelidněném ekosystému"] },
  { question: "Čím je ptakopysk mezi savci výjimečný?", correctAnswer: "Klade vejce, ale kojí mláďata", options: ["Je to plaz, který kojí mláďata", "Klade vejce, ale kojí mláďata", "Je to pták s ocasem savce", "Už dávno vyhynul, žádní nežijí"] },
  { question: "Co je sociální organizace u ptáků a savců?", correctAnswer: "Různé struktury — samotáři, páry, smečky, kolonie — ovlivněné potravní strategií a reprodukcí", options: ["Různé struktury — samotáři, páry, smečky, kolonie — ovlivněné potravní strategií a reprodukcí", "Ptáci jsou vždy sólisté, savci vždy ve smečkách", "Sociální organizace závisí jen na velikosti živočicha", "Všichni ptáci žijí v hejnech, savci sólo"] },
  { question: "Proč netopýři hibernují?", correctAnswer: "Hmyz, jejich potrava, v zimě mizí — hibernace šetří energii, snižuje metabolismus a teplotu těla", options: ["Hmyz, jejich potrava, v zimě mizí — hibernace šetří energii, snižuje metabolismus a teplotu těla", "Netopýři migrují na jih jako ptáci", "Netopýři hibernují jen v extrémně chladných oblastech", "Hibernace je obranná reakce na zkrácení dne"] },
  { question: "Jak probíhá echolokace u delfínů?", correctAnswer: "Delfín vysílá sonarové kliky – ultrazvuk přes melon — echo odhalí tvar, vzdálenost a pohyb kořisti", options: ["Delfín vysílá sonarové kliky – ultrazvuk přes melon — echo odhalí tvar, vzdálenost a pohyb kořisti", "Delfín echolokuje pomocí očí v infračerveném záření", "Echolokace probíhá jen při lovu v temné hloubce oceánu", "Delfíni echolokaci nevyužívají — orientují se zrakem"] },
  { question: "Proč jsou ptačí kosti duté?", correctAnswer: "Snižují hmotnost těla — lehčí kostra usnadňuje létání při zachování pevnosti", options: ["Snižují hmotnost těla — lehčí kostra usnadňuje létání při zachování pevnosti", "Duté kosti jsou pevnější než plné", "Duté kosti slouží jako zásobárna vzduchu pro dýchání", "Dutost kosti je náhodný evoluční znak bez funkce"] },
  { question: "Co je mozek savců výjimečný oproti ostatním obratlovcům?", correctAnswer: "Velká mozková kůra – neokortex — umožňuje učení, paměť a komplexní chování", options: ["Velká mozková kůra – neokortex — umožňuje učení, paměť a komplexní chování", "Savčí mozek je větší, ale jinak totožný s ptačím", "Savci mají nejmenší mozek ze všech obratlovců", "Mozek savců je schopen fotosyntézy ze slunečního záření"] },
  { question: "Čím se liší mládě kachny od mláděte kosa?", correctAnswer: "Kachňata hned chodí, kosí mláďata ne", options: ["Kosí mláďata hned chodí, kachňata ne", "Kachňata hned chodí, kosí mláďata ne", "Obě mláďata jsou hned samostatná", "Obě mláďata jsou hned bezmocná"] },
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
    boundaries: ["Podrobná anatomie a genetika nejsou náplní 4. ročníku"],
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
