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
  { question: "Jaká zvířata jsou stěhovavá (odlétají do tepla)?", correctAnswer: "Vlaštovka, čáp, kukačka, labuť – v části populace", options: ["Vlaštovka, čáp, kukačka, labuť – v části populace", "Vrabec, sýkorka, kos", "Jelen, srnec", "Kapr, štika"] },
  { question: "Kde přezimuje vlaštovka?", correctAnswer: "V Africe", options: ["V Africe", "V jižní Evropě", "V České republice — schovává se", "V Azii"] },
  { question: "Jmenuj 3 typické savce ČR.", correctAnswer: "Jelen, liška, veverka – nebo srnec, bobr, zajíc, vydra...", options: ["Jelen, liška, veverka – nebo srnec, bobr, zajíc, vydra...", "Lev, tygr, slon", "Velryba, tuleň, delfín", "Krokodýl, leguán, chameleon"] },
  { question: "Co je hibernace (zimní spánek)?", correctAnswer: "Hluboký spánek v zimě — snížení metabolismu, tělesné teploty; zajíc a liška nespí, ježek ano", options: ["Hluboký spánek v zimě — snížení metabolismu, tělesné teploty; zajíc a liška nespí, ježek ano", "Zimní migrace na jih", "Letní odpočinek v horkých dnech", "Každodenní spánek v noci"] },
  { question: "Jak se nazývá přední končetina ptáků?", correctAnswer: "Křídlo – přizpůsobená přední končetina obratlovce", options: ["Křídlo – přizpůsobená přední končetina obratlovce", "Ploutev", "Pazour", "Tlapka"] },
  { question: "Jaký pták staví čeleď hnízdo na střeše?", correctAnswer: "Čáp bílý", options: ["Čáp bílý", "Sýkorka", "Datel", "Kukačka"] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší savci od ostatních obratlovců v péči o mláďata?", correctAnswer: "Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", options: ["Kojí mláďata mlékem z mléčných žláz — přímá výživa matkou", "Mláďata jsou ihned samostatná", "Vejce zahřívají oba rodiče stejně jako ptáci", "Savci mláďata neopečovávají"] },
  { question: "Proč jsou savci a ptáci teplokrevní?", correctAnswer: "Udržují stálou tělesnou teplotu metabolismem — nezávislost na teplotě prostředí", options: ["Udržují stálou tělesnou teplotu metabolismem — nezávislost na teplotě prostředí", "Jsou teplokrevní jen v létě", "Teplo získávají ze slunce jako plazi", "Teplota jejich těla závisí na okolí"] },
  { question: "Jak probíhá migrace ptáků — co je navigace?", correctAnswer: "Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", options: ["Ptáci využívají hvězdy, sluneční pozici, magnetické pole Země a paměť trasy", "Ptáci se orientují jen podle větru", "Navigace probíhá jen pomocí zraku a paměti", "Ptáci migrují náhodně — teplota je naviguje"] },
  { question: "Co je imprinting (vtiskávání) u ptáků?", correctAnswer: "Mládě si v kritické fázi brzy po vylíhnutí zapamato tvar rodiče – nebo náhrady — trvalý vzor", options: ["Mládě si v kritické fázi brzy po vylíhnutí zapamato tvar rodiče – nebo náhrady — trvalý vzor", "Učení se zpěvu od rodičů celý rok", "Schopnost ptáků napodobit lidský hlas", "Vrozené chování ptáků nezávislé na zkušenosti"] },
  { question: "Proč velryba potřebuje vynořovat?", correctAnswer: "Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", options: ["Dýchá vzduch plícemi — každých 15–30 minut se nadechuje přes dýchací otvory – průduchy", "Vynořuje se pro sluneční světlo k fotosyntéze kůže", "Vynořuje se pro snížení tělesné teploty", "Velryba nevynořuje — dýchá pod vodou rozpuštěný kyslík"] },
  { question: "Jaké jsou rozdíly mezi vrubozobými (kachna, labuť) a brodivými ptáky (volavka, čáp)?", correctAnswer: "Vrubozobí: ploché zobáky, plovací blány, na vodě. Brodivé: dlouhé nohy a zobáky, loví ryby brodením.", options: ["Vrubozobí: ploché zobáky, plovací blány, na vodě. Brodivé: dlouhé nohy a zobáky, loví ryby brodením.", "Oba typy jsou totožné — liší se jen barvou.", "Brodivé ptáci plavou lépe než vrubozobí.", "Vrubozobí loví ryby, brodivé jedí trávu."] },
  { question: "Proč netopýr létá v noci?", correctAnswer: "Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", options: ["Echolokace — vysílá ultrazvuk a orientuje se odrazem, lov nočního hmyzu", "Netopýr vidí nejlépe v úplné tmě", "Netopýr se bojí slunečního světla", "Netopýr loví v noci, protože přes den spí kvůli teplu"] },
  { question: "Jaký je rozdíl mezi zajícem a králíkem?", correctAnswer: "Zajíc: žije na polích, hnízdí v jamce – zajíčci jsou hned vidění . Králík: hloubí nory, žije ve skupinách.", options: ["Zajíc: žije na polích, hnízdí v jamce – zajíčci jsou hned vidění . Králík: hloubí nory, žije ve skupinách.", "Jsou to totéž — zajíc je divočák králíka.", "Králík je větší než zajíc.", "Zajíc je domácí zvíře, králík divoký."] },
  { question: "Jaký je rozdíl mezi stěhovavým a tažným ptákem?", correctAnswer: "Stěhovavý = pravidelně migruje do teplých krajů. Tažný = přesnější synonymum – oba pojmy se překrývají .", options: ["Stěhovavý = pravidelně migruje do teplých krajů. Tažný = přesnější synonymum – oba pojmy se překrývají .", "Stěhovavý létá v hejnech, tažný sám.", "Tažný letí na sever, stěhovavý na jih.", "Jsou to různé druhy ptáků."] },
  { question: "Co je placenta a u jakých savců ji najdeme?", correctAnswer: "Orgán zajišťující výživu plodu v děloze — u placentálních savců – většina savců", options: ["Orgán zajišťující výživu plodu v děloze — u placentálních savců – většina savců", "Zásobní tuk savců pro zimní spánek", "Koža savců zajišťující regulaci teploty", "Orgán produkující mléko po porodu"] },
  { question: "Jaký je ekologický vliv bobra na krajinu?", correctAnswer: "Staví hráze → tvoří rybníky → zadržuje vodu v krajině, zvyšuje biodiverzitu", options: ["Staví hráze → tvoří rybníky → zadržuje vodu v krajině, zvyšuje biodiverzitu", "Bobr kácí stromy a zhoršuje ekosystém", "Bobr nemá vliv na okolní krajinu", "Bobr podmáčí půdu a způsobuje povodně"] },
  { question: "Jak se liší zobák dravých ptáků od pěvců?", correctAnswer: "Dravci: zahnutý, silný zobák pro trhání masa. Pěvci: různé tvary přizpůsobené pro semena nebo hmyz.", options: ["Dravci: zahnutý, silný zobák pro trhání masa. Pěvci: různé tvary přizpůsobené pro semena nebo hmyz.", "Dravci mají zobák delší než pěvci.", "Pěvci mají zahnutý zobák, dravci rovný.", "Všechny ptáky mají stejně tvarovaný zobák."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Co je konvergentní evoluce a uveď příklad u savců?", correctAnswer: "Nezávislý vývoj podobných znaků u nepříbuzných druhů — ploutve delfína a ryby – různí předci", options: ["Nezávislý vývoj podobných znaků u nepříbuzných druhů — ploutve delfína a ryby – různí předci", "Vývoj příbuzných druhů do různých prostředí", "Přizpůsobení celých populací na jedno prostředí", "Paralelní vývoj dvou druhů ve stejném prostředí"] },
  { question: "Co je adaptivní radiace a uveď příklad u ptáků?", correctAnswer: "Rychlé evoluční většení z jednoho předka do různých ekologických nik — Darwinovy pěnkavy na Galapágách", options: ["Rychlé evoluční většení z jednoho předka do různých ekologických nik — Darwinovy pěnkavy na Galapágách", "Migrace ptáků do nových oblastí", "Zánik druhů způsobený adaptací na jedno prostředí", "Rychlé množení jednoho druhu v přelidněném ekosystému"] },
  { question: "Proč jsou monotremata (ptakopysk, ježura) výjimečná?", correctAnswer: "Jsou to savci snášející vejce — kombinují znaky plazů (vejce) a savců – kojení", options: ["Jsou to savci snášející vejce — kombinují znaky plazů (vejce) a savců – kojení", "Jsou to plazi kojící mláďata jako savci", "Jsou to ptáci s ocasem savce", "Monotremata jsou vyhynulá — žádní žijí"] },
  { question: "Co je sociální organizace u ptáků a savců?", correctAnswer: "Různé struktury — samotáři, páry, smečky, kolonie — ovlivněné potravní strategií a reprodukcí", options: ["Různé struktury — samotáři, páry, smečky, kolonie — ovlivněné potravní strategií a reprodukcí", "Ptáci jsou vždy sólisté, savci vždy ve smečkách", "Sociální organizace závisí jen na velikosti živočicha", "Všichni ptáci žijí v hejnech, savci sólo"] },
  { question: "Proč netopýři hibernují?", correctAnswer: "Hmyz, jejich potrava, v zimě mizí — hibernace šetří energii, snižuje metabolismus a teplotu těla", options: ["Hmyz, jejich potrava, v zimě mizí — hibernace šetří energii, snižuje metabolismus a teplotu těla", "Netopýři migrují na jih jako ptáci", "Netopýři hibernují jen v extrémně chladných oblastech", "Hibernace je obranná reakce na zkrácení dne"] },
  { question: "Jak probíhá echolokace u delfínů?", correctAnswer: "Delfín vysílá sonarové kliky – ultrazvuk přes melon — echo odhalí tvar, vzdálenost a pohyb kořisti", options: ["Delfín vysílá sonarové kliky – ultrazvuk přes melon — echo odhalí tvar, vzdálenost a pohyb kořisti", "Delfín echolokuje pomocí očí v infračerveném záření", "Echolokace probíhá jen při lovu v temné hloubce oceánu", "Delfíni echolokaci nevyužívají — orientují se zrakem"] },
  { question: "Proč jsou ptačí kosti duté?", correctAnswer: "Snižují hmotnost těla — lehčí kostra usnadňuje létání při zachování pevnosti", options: ["Snižují hmotnost těla — lehčí kostra usnadňuje létání při zachování pevnosti", "Duté kosti jsou pevnější než plné", "Duté kosti slouží jako zásobárna vzduchu pro dýchání", "Dutost kosti je náhodný evoluční znak bez funkce"] },
  { question: "Co je mozek savců výjimečný oproti ostatním obratlovcům?", correctAnswer: "Velká mozková kůra – neokortex — umožňuje učení, paměť a komplexní chování", options: ["Velká mozková kůra – neokortex — umožňuje učení, paměť a komplexní chování", "Savčí mozek je větší, ale jinak totožný s ptačím", "Savci mají nejmenší mozek ze všech obratlovců", "Mozek savců je schopen fotosyntézy ze slunečního záření"] },
  { question: "Co je altriální vs. prekociální mládě?", correctAnswer: "Altriální: narozeno bezmocné, potřebuje péči (savci, zpívající ptáci). Prekociální: hned po porodu schopné pohybu – kachna, kůň .", options: ["Altriální: narozeno bezmocné, potřebuje péči (savci, zpívající ptáci). Prekociální: hned po porodu schopné pohybu – kachna, kůň .", "Altriální jsou velcí, prekociální malí živočichové.", "Prekociální mláďata jsou vždy savci, altriální ptáci.", "Rozdíl závisí jen na prostředí, nikoli na biologii druhu."] },
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
    briefDescription: "Poznáš znaky savců a ptáků a naučíš se je rozeznávat na konkrétních příkladech.",
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
