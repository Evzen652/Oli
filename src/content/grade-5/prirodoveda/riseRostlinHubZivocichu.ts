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
  { question: "Do které říše patří houby?", correctAnswer: "Do vlastní říše hub", options: ["Do vlastní říše hub", "Do říše rostlin", "Do říše živočichů", "Do říše bakterií"], hints: ["Houby nejsou ani rostliny, ani živočichové."] },
  { question: "Čím se živí rostliny?", correctAnswer: "Fotosyntézou – přeměňují sluneční světlo na cukry", options: ["Fotosyntézou – přeměňují sluneční světlo na cukry", "Loví jiné organismy", "Vstřebávají hotové organické látky z půdy", "Parazitují na jiných rostlinách"], hints: ["Rostliny jsou producenti."] },
  { question: "Jak se jmenuje jedovatá houba s červeným kloboukem s bílými skvrnami?", correctAnswer: "Muchomůrka červená", options: ["Muchomůrka červená", "Hřib smrkový", "Lišká obecná", "Ryzec pravý"], hints: ["Je nebezpečně jedovatá."] },
  { question: "Kolik noh má hmyz?", correctAnswer: "6 noh", options: ["6 noh", "4 nohy", "8 noh", "10 noh"], hints: ["Hmyz patří mezi bezobratlé."] },
  { question: "Kolik noh mají pavouci?", correctAnswer: "8 noh", options: ["8 noh", "6 noh", "4 nohy", "10 noh"], hints: ["Pavouci nejsou hmyz."] },
  { question: "Které živočichy řadíme mezi savce?", correctAnswer: "Živočichy, kteří krmí mláďata mlékem", options: ["Živočichy, kteří krmí mláďata mlékem", "Živočichy s peřím", "Živočichy s šupinami", "Živočichy dýchající žábrami"], hints: ["Savci mají srst a jsou teplokrevní."] },
  { question: "Co je charakteristické pro ptáky?", correctAnswer: "Mají peří a jsou teplokrevní", options: ["Mají peří a jsou teplokrevní", "Mají šupiny a jsou studenokrevní", "Krmí mláďata mlékem", "Dýchají žábrami"], hints: ["Ptáci kladou vajíčka."] },
  { question: "Jak se živí houby?", correctAnswer: "Jsou rozkladači – rozkládají mrtvou organickou hmotu", options: ["Jsou rozkladači – rozkládají mrtvou organickou hmotu", "Fotosyntézou", "Loví jiné organismy", "Pijí jen vodu"], hints: ["Houby vracejí živiny zpět do půdy."] },
  { question: "Co mají společného ryby?", correctAnswer: "Dýchají žábrami a mají ploutve", options: ["Dýchají žábrami a mají ploutve", "Mají srst a krmí mláďata mlékem", "Mají peří a létají", "Dýchají plícemi a jsou teplokrevní"], hints: ["Ryby žijí ve vodě."] },
  { question: "Plazi jsou:", correctAnswer: "Studenokrevní živočichové se suchou pokožkou", options: ["Studenokrevní živočichové se suchou pokožkou", "Teplokrevní živočichové s peřím", "Teplokrevní živočichové se srstí", "Bezobratlí živočichové s šesti nohami"], hints: ["Hadi a ještěrky jsou plazi."] },
  { question: "Který organismus provádí fotosyntézu?", correctAnswer: "Strom", options: ["Strom", "Houba", "Vlk", "Žížala"], hints: ["Potřebuje sluneční světlo a chlorofyl."] },
  { question: "Hřib smrkový je příkladem:", correctAnswer: "Jedlé houby", options: ["Jedlé houby", "Jedovaté houby", "Rostliny", "Živočicha"], hints: ["Je oblíbenou houbou v lese."] },
  { question: "Čím se liší obojživelníci od plazů?", correctAnswer: "Jejich larvy žijí ve vodě", options: ["Jejich larvy žijí ve vodě", "Mají peří", "Jsou teplokrevní", "Mají srst"], hints: ["Žáby jsou obojživelníci."] },
  { question: "Do které skupiny patří hmyz, pavouci a mnohonožky?", correctAnswer: "Bezobratlí", options: ["Bezobratlí", "Obratlovci", "Savci", "Plazi"], hints: ["Nemají páteř."] },
  { question: "Kolik částí těla má hmyz?", correctAnswer: "3 části (hlava, hruď, zadeček)", options: ["3 části (hlava, hruď, zadeček)", "2 části (hlavohruď, zadeček)", "4 části", "1 celek"], hints: ["Pavouk má jen 2 části."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi nahosemennými a krytosemennými rostlinami?", correctAnswer: "Krytosemenné mají semena uzavřená v plodu, nahosemenné nikoliv", options: ["Krytosemenné mají semena uzavřená v plodu, nahosemenné nikoliv", "Nahosemenné mají listy, krytosemenné jehličí", "Nahosemenné kvetou, krytosemenné ne", "Žádný rozdíl není"], hints: ["Jehličnany jsou příkladem nahosemenných."] },
  { question: "Mycelium je:", correctAnswer: "Podhoubí – spleť vláken, které tvoří tělo houby", options: ["Podhoubí – spleť vláken, které tvoří tělo houby", "Druh jedovaté houby", "Název pro klobouk houby", "Zelené vlákno řasy"], hints: ["Vidíme jen plodnici, ale mycelium je skryté v půdě."] },
  { question: "Co znamená, že živočich je 'teplokrevný'?", correctAnswer: "Udržuje stálou tělesnou teplotu bez ohledu na okolí", options: ["Udržuje stálou tělesnou teplotu bez ohledu na okolí", "Žije jen v teplých krajích", "Má teplou srst", "V zimě se zahřívá u ohně"], hints: ["Ptáci a savci jsou teplokrevní."] },
  { question: "Mezi obratlovce NEPATŘÍ:", correctAnswer: "Hmyz", options: ["Hmyz", "Ryby", "Ptáci", "Savci"], hints: ["Obratlovci mají páteř."] },
  { question: "Lišky jsou konzumenti. Co to znamená?", correctAnswer: "Živí se jinými organismy, nevyrábí si potravu sami", options: ["Živí se jinými organismy, nevyrábí si potravu sami", "Vyrábí potravu fotosyntézou", "Jsou rozkladači", "Jsou producenti"], hints: ["Producenti jsou rostliny, konzumenti je jedí."] },
  { question: "Proč jsou houby zařazeny do vlastní říše a ne mezi rostliny?", correctAnswer: "Nemají chlorofyl, nefotosyntetizují a živí se jinak než rostliny", options: ["Nemají chlorofyl, nefotosyntetizují a živí se jinak než rostliny", "Jsou příliš malé", "Rostou jen v lese", "Mají klobouk místo listů"], hints: ["Chlorofyl je potřebný pro fotosyntézu."] },
  { question: "Pavouci patří do skupiny:", correctAnswer: "Členovci (bezobratlí)", options: ["Členovci (bezobratlí)", "Obratlovci", "Savci", "Hmyz"], hints: ["Pavouci mají 8 noh a 2 části těla – nejsou to hmyz."] },
  { question: "Jak se živí plazi v zimě?", correctAnswer: "Upadají do stavu strnulosti, protože jsou studenokrevní", options: ["Upadají do stavu strnulosti, protože jsou studenokrevní", "Létají na jih jako ptáci", "Lovají pod ledem", "Jedí zásoby uložené v létě"], hints: ["Studenokrevní živočichové závisí na teplotě prostředí."] },
  { question: "Mezi měkkýše patří:", correctAnswer: "Šnek zahradní a slimák", options: ["Šnek zahradní a slimák", "Žížala a pijavice", "Ježek a krtek", "Housenka a můra"], hints: ["Měkkýši jsou mělkouši s měkkým tělem."] },
  { question: "Proč mají jehličnany jehličí místo listů?", correctAnswer: "Jehličí lépe odolává mrazu a suchu", options: ["Jehličí lépe odolává mrazu a suchu", "Jehličí fotosyntézu neprovádí", "Jehličí je jedovaté pro ochranu", "Jehlice jsou přeměněné kořeny"], hints: ["Jehličnany jsou stálezelené stromy."] },
  { question: "Co mají společného všichni savci?", correctAnswer: "Mají srst, jsou teplokrevní a krmí mláďata mlékem", options: ["Mají srst, jsou teplokrevní a krmí mláďata mlékem", "Létají nebo plavou", "Kladou vajíčka", "Žijí pouze na souši"], hints: ["Netopýr je také savec."] },
  { question: "Ostnokožci jsou příkladem:", correctAnswer: "Mořských bezobratlých (hvězdice, ježovka)", options: ["Mořských bezobratlých (hvězdice, ježovka)", "Sladkovodních ryb", "Hmyzu", "Plazů"], hints: ["Mají ostny nebo trny na těle."] },
  { question: "Jak se množí nahosemenné rostliny (jehličnany)?", correctAnswer: "Semenami bez obalu – v šiškách", options: ["Semenami bez obalu – v šiškách", "Výtrusy", "Plody s chráněnými semeny", "Oddenky"], hints: ["Šiška je plodní útvar borovice."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Vysvětli rozdíl mezi producentem, konzumentem a rozkladačem v přírodě.", correctAnswer: "Producent vyrábí organické látky (rostlina), konzument je jí (živočich), rozkladač je rozkládá (houba, bakterie)", options: ["Producent vyrábí organické látky (rostlina), konzument je jí (živočich), rozkladač je rozkládá (houba, bakterie)", "Producent je největší, konzument střední, rozkladač nejmenší", "Všichni tři provádějí fotosyntézu různou rychlostí", "Producent loví, konzument utíká, rozkladač stojí"], hints: ["Myslí na tok energie v přírodě."] },
  { question: "Proč jsou obojživelníci závislí na vodě i v dospělosti?", correctAnswer: "Jejich kůže musí být vlhká pro dýchání a rozmnožují se ve vodě", options: ["Jejich kůže musí být vlhká pro dýchání a rozmnožují se ve vodě", "Umí jen plavat, nemohou chodit po souši", "Jsou studenokrevní a potřebují se chladit", "Živí se pouze vodními organismy"], hints: ["Žáby dýchají i kůží."] },
  { question: "Červi (žížaly) patří mezi bezobratlé. Jaký mají ekologický význam?", correctAnswer: "Kypří půdu, zlepšují její strukturu a urychlují rozklad organické hmoty", options: ["Kypří půdu, zlepšují její strukturu a urychlují rozklad organické hmoty", "Jsou jedinou potravou pro ptáky", "Tvoří vrstvu nad půdou a chrání ji před deštěm", "Vyrábějí kyslík pro půdní organismy"], hints: ["Žížaly jsou zemědělcovým přítelem."] },
  { question: "Jaký je rozdíl mezi jedlými a jedovatými houbami z hlediska bezpečnosti?", correctAnswer: "Jedovaté houby obsahují toxiny, které mohou způsobit otravu nebo smrt – nelze je bezpečně rozpoznat bez zkušeností", options: ["Jedovaté houby obsahují toxiny, které mohou způsobit otravu nebo smrt – nelze je bezpečně rozpoznat bez zkušeností", "Jedovaté houby jsou vždy červené", "Jedovaté houby zapáchají", "Jedovaté houby se hned rozkládají po uvaření"], hints: ["Muchovůrka červená je nebezpečná pro svůj atraktivní vzhled."] },
  { question: "Proč jsou krytosemenné rostliny evolučně úspěšnější než nahosemenné?", correctAnswer: "Plod chrání semeno a láká živočichy k šíření semen na větší vzdálenosti", options: ["Plod chrání semeno a láká živočichy k šíření semen na větší vzdálenosti", "Mají více listů než jehličnany", "Rostou rychleji a jsou větší", "Plod je jedovatý pro ochranu před predátory"], hints: ["Semena se šíří díky zvířatům, kteří jedí plody."] },
  { question: "Proč jsou houby důležité v ekosystému lesa?", correctAnswer: "Rozkládají mrtvé dřevo a organismy, vracejí živiny do půdy a tvoří symbiózu s kořeny stromů", options: ["Rozkládají mrtvé dřevo a organismy, vracejí živiny do půdy a tvoří symbiózu s kořeny stromů", "Produkují kyslík pro les", "Chrání stromy před hmyzem svými toxiny", "Tvoří zásobu potravy pro savce"], hints: ["Mykorhiza je symbióza houby a kořene stromu."] },
  { question: "Jak se liší 5 skupin obratlovců z hlediska rozmnožování?", correctAnswer: "Ryby a obojživelníci kladou vajíčka do vody, plazi a ptáci na souši, savci rodí živá mláďata (výjimky existují)", options: ["Ryby a obojživelníci kladou vajíčka do vody, plazi a ptáci na souši, savci rodí živá mláďata (výjimky existují)", "Všichni obratlovci rodí živá mláďata", "Všichni obratlovci kladou vajíčka", "Savci kladou vajíčka a ryby rodí živě"], hints: ["Ptakopysk je savec, který klade vajíčka."] },
  { question: "Proč jsou bakterie a prvoci zařazeni do vlastních říší odděleně od ostatních?", correctAnswer: "Jsou prokaryota nebo jednobuněčné eukaryota – jejich buněčná stavba se zásadně liší od hub, rostlin a živočichů", options: ["Jsou prokaryota nebo jednobuněčné eukaryota – jejich buněčná stavba se zásadně liší od hub, rostlin a živočichů", "Jsou příliš malé na to, abychom je viděli", "Nemají DNA", "Žijí jen v extrémních prostředích"], hints: ["Bakterie nemají jádro buňky."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const RISEROSTLINHUBZIVOCICHU: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-rise-rostlin-hub-zivocichu",
    title: "Říše rostlin, hub, živočichů",
    studentTitle: "Živý svět",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš rozdíly mezi říšemi rostlin, hub a živočichů.",
    keywords: ["říše", "rostliny", "houby", "živočichové", "třídění", "organismy", "fotosyntéza"],
    goals: ["Rozlišit základní říše živých organismů", "Popsat způsob výživy rostlin, hub a živočichů", "Zařadit konkrétní organismy do správné říše"],
    boundaries: ["Neprobírá buněčnou biologii do hloubky", "Neprobírá evoluci"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Vzpomeň si: rostliny fotosyntézují, houby rozkládají, živočichové konzumují jiné organismy.",
      steps: ["1. Zjisti, jak se organismus živí.", "2. Má chlorofyl? → rostlina", "3. Rozkládá mrtvé věci? → houba", "4. Loví nebo spásá jiné organismy? → živočich"],
      commonMistake: "Houby nejsou rostliny – nemají chlorofyl a nefotosyntetizují.",
      example: "Hřib → houba (rozkladač). Dub → rostlina (producent). Zajíc → živočich (konzument).",
    },
  },
];
