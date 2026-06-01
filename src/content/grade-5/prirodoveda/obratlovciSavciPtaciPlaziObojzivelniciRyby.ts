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
  { question: "Co mají společného všichni obratlovci?", correctAnswer: "Mají páteř (obratel)", options: ["Mají páteř (obratel)", "Mají peří nebo srst", "Jsou teplokrevní", "Kladou vejce"], hints: ["Obratlovci = živočichové s páteří."] },
  { question: "Jak se živí savci svá mláďata?", correctAnswer: "Mlékem (mléčné žlázy)", options: ["Mlékem (mléčné žlázy)", "Přežvykovanou potravou", "Hmyzem jako ptáci", "Mláďata si shání potravu sama"], hints: ["Savci = mammalia – z latinského 'mamma' (prs)."] },
  { question: "Co je charakteristické pro ptáky?", correctAnswer: "Mají peří, jsou teplokrevní, kladou vejce", options: ["Mají peří, jsou teplokrevní, kladou vejce", "Mají šupiny a jsou studenokrevní", "Krmí mláďata mlékem", "Mají 4 nohy a srst"], hints: ["Peří je jedinečným znakem ptáků."] },
  { question: "Proč jsou plazi studenokrevní?", correctAnswer: "Jejich tělesná teplota závisí na okolním prostředí – nemohou si ji sami regulovat", options: ["Jejich tělesná teplota závisí na okolním prostředí – nemohou si ji sami regulovat", "Mají chladnou krev pro chlazení mozku", "Žijí v studených oblastech, proto mají studenou krev", "Studenokrevní = mají teplotu 0 °C"], hints: ["Ještěrka se hřeje na slunci, aby získala energii."] },
  { question: "Čím dýchají ryby?", correctAnswer: "Žábrami", options: ["Žábrami", "Plícemi", "Kůží", "Žábrami i plícemi zároveň"], hints: ["Žábry filtrují kyslík z vody."] },
  { question: "Co je charakteristické pro obojživelníky?", correctAnswer: "Larvy (pulci) žijí ve vodě, dospělci žijí i na souši", options: ["Larvy (pulci) žijí ve vodě, dospělci žijí i na souši", "Celý život žijí pouze ve vodě", "Mají šupiny a jsou studenokrevní jak ryby", "Mají peří a létají jako ptáci"], hints: ["'Obojživelník' = žije v obou prostředích."] },
  { question: "Jak se jmenuje největší skupina savců v ČR?", correctAnswer: "Netopýři (řád Chiroptera)", options: ["Netopýři (řád Chiroptera)", "Hlodavci (myši, veverky)", "Šelmy (vlk, liška)", "Kopytníci (jelen, srnec)"], hints: ["Netopýři jsou jedini létající savci."] },
  { question: "Proč jsou ptáci teplokrevní?", correctAnswer: "Mohou být aktivní za různých teplot a letět i ve výšce kde je chladno", options: ["Mohou být aktivní za různých teplot a letět i ve výšce kde je chladno", "Teplokrevnost jim pomáhá při krmení mlékem", "Peří je tak dobré, že udržuje teplo automaticky", "Ptáci jsou teplokrevní, aby se mohli ponořit pod vodu"], hints: ["Teplokrevnost = stálá teplota těla bez ohledu na prostředí."] },
  { question: "Který živočich je obojživelník?", correctAnswer: "Žába skokán", options: ["Žába skokán", "Ještěrka zelená", "Kapr obecný", "Netopýr ušatý"], hints: ["Pulci jsou larvy žáb."] },
  { question: "Co mají ryby místo nohou?", correctAnswer: "Ploutve", options: ["Ploutve", "Křídla", "Šupiny", "Paže"], hints: ["Ploutve slouží k plavání."] },
  { question: "Který plaz je nejrozšířenější v ČR?", correctAnswer: "Ještěrka obecná", options: ["Ještěrka obecná", "Krokodýl nilský", "Mlok skvrnitý", "Rosnička zelená"], hints: ["Ještěrky jsou studenokrevní a mají šupiny."] },
  { question: "Co mají společného netopýr a velryba?", correctAnswer: "Oba jsou savci – mají srst (netopýr) nebo vlasy (velryba) a krmí mláďata mlékem", options: ["Oba jsou savci – mají srst (netopýr) nebo vlasy (velryba) a krmí mláďata mlékem", "Oba žijí ve vodě", "Oba létají nebo plavou – způsob pohybu je to, co je spojuje", "Oba kladou vajíčka a jsou studenokrevní"], hints: ["Velryba je savec – vydechuje vzduch, krmí mláďata mlékem."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jak se liší vejcorodí savci od ostatních savců?", correctAnswer: "Vejcorodí savci (ptakopysk, ježura) kladou vejce, ale mláďata kojí mlékem – kombinují znaky plazů a savců", options: ["Vejcorodí savci (ptakopysk, ježura) kladou vejce, ale mláďata kojí mlékem – kombinují znaky plazů a savců", "Vejcorodí savci neexistují – savci vždy rodí živá mláďata", "Ptakopysk je plaz, ne savec – klade vejce jako ještěrka", "Vejcorodí savci krmí mláďata mlékem i potravou z přírody"], hints: ["Ptakopysk = australský savec s kačeřím zobákem a jedem."] },
  { question: "Proč se obojživelníci nemohou vzdálit od vody po celý život?", correctAnswer: "Dospělci dýchají vlhkou kůží (kožní dýchání) a rozmnožují se ve vodě – jejich vejce nemají tvrdý obal, musí být vlhká", options: ["Dospělci dýchají vlhkou kůží (kožní dýchání) a rozmnožují se ve vodě – jejich vejce nemají tvrdý obal, musí být vlhká", "Obojživelníci jsou studenokrevní a voda je udržuje teplé", "Žábry mohou být použity pouze v blízkosti vody", "Potravou obojživelníků jsou pouze vodní organismy"], hints: ["Suchá kůže žáby = asfyxie (udušení). Vajíčka bez obalu = dehydratace."] },
  { question: "Jak se liší šupiny ryb od šupin plazů?", correctAnswer: "Šupiny ryb jsou překrývající se destičky z kosti a hmoty. Šupiny plazů jsou z rohoviny (keratin) – tvrdší a suchší, přizpůsobené životu na souši.", options: ["Šupiny ryb jsou překrývající se destičky z kosti a hmoty. Šupiny plazů jsou z rohoviny (keratin) – tvrdší a suchší, přizpůsobené životu na souši.", "Šupiny ryb i plazů jsou totéž – liší se jen barvou", "Šupiny plazů jsou z ledu, ryb z kovu", "Ryby nemají šupiny – mají hladkou kůži pokrytou slizem"], hints: ["Ryby: šupiny s hlenem pro klouzavost. Plazi: suché šupiny pro ochranu."] },
  { question: "Proč létají ptáci – co jsou adaptace pro let?", correctAnswer: "Lehká dutá kost, křídla (přeměněné přední končetiny), peří, silné hrudní svaly, vzdušné vaky v těle – vše snižuje hmotnost a zvyšuje aerodynamiku", options: ["Lehká dutá kost, křídla (přeměněné přední končetiny), peří, silné hrudní svaly, vzdušné vaky v těle – vše snižuje hmotnost a zvyšuje aerodynamiku", "Ptáci létají díky peří, které je tak lehké, že nadlehčuje tělo", "Křídla ptáků jsou stejná jako u netopýrů – obě skupiny jsou příbuzné", "Ptáci létají díky metabolismu, který produkuje nadlehčující plyn"], hints: ["Dutá kost = pevná ale lehká. Vzdušné vaky = zásobárna vzduchu při letu."] },
  { question: "Co jsou stěhovaví ptáci a proč migrují?", correctAnswer: "Migrují na zimu do teplých krajů za potravou a příznivým klimatem – jejich potrava (hmyz) v zimě zmizí", options: ["Migrují na zimu do teplých krajů za potravou a příznivým klimatem – jejich potrava (hmyz) v zimě zmizí", "Stěhují se kvůli rozmnožování – hnízdit jezdí na jih", "Migrují, protože jsou teplokrevní a zima je pro ně nebezpečná", "Migrují na sever v létě, kde je více denního světla"], hints: ["Vlaštovka: léto v ČR → zima v Africe (přes 10 000 km)."] },
  { question: "Jak se liší vejce ptáků od vajec obojživelníků?", correctAnswer: "Ptačí vejce: tvrdá vápenatá skořápka chrání před vyschnutím – ptáci mohou hnízdit na souši. Obojživelníci: měkká gelatinová vejce musí být ve vodě.", options: ["Ptačí vejce: tvrdá vápenatá skořápka chrání před vyschnutím – ptáci mohou hnízdit na souši. Obojživelníci: měkká gelatinová vejce musí být ve vodě.", "Ptačí vejce jsou tvrdší, protože ptáci jsou větší", "Obojživelníci kladou vejce na souši, ptáci do vody", "Vejce ptáků i obojživelníků jsou stejná – liší se jen barvou"], hints: ["Tvrdá skořápka = klíč k životu na souši. Obojživelníci to nezvládli."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Proč jsou obojživelníci považováni za bioindikátory znečištění prostředí?", correctAnswer: "Propustná kůže absorbuje vodu i toxiny přímo. Citliví na pH, pesticidy a teplotu vody – jejich úbytek signalizuje zhoršení kvality prostředí.", options: ["Propustná kůže absorbuje vodu i toxiny přímo. Citliví na pH, pesticidy a teplotu vody – jejich úbytek signalizuje zhoršení kvality prostředí.", "Obojživelníci jsou indikátoři, protože jsou nejstarší skupinou obratlovců.", "Žáby měří pH vody pomocí speciálních receptorů.", "Bioindikátory jsou jen rostliny – živočichové se pohybují a nejsou spolehliví."], hints: ["Bioindikátor = organismus citlivý na změny prostředí."] },
  { question: "Co ukazuje evoluce velryb o přizpůsobení savců prostředí?", correctAnswer: "Velryby se vyvinuly ze suchozemských savců (příbuzní hrochů). Vrátily se do vody a ztratily zadní nohy, vyvinuly ploutve – ale zachovaly mléčné žlázy a dýchání plícemi.", options: ["Velryby se vyvinuly ze suchozemských savců (příbuzní hrochů). Vrátily se do vody a ztratily zadní nohy, vyvinuly ploutve – ale zachovaly mléčné žlázy a dýchání plícemi.", "Velryby jsou příbuzné rybám – přizpůsobily se ze starých obratlovců.", "Velryby jsou původně vodní živočichové, jen vzdáleně příbuzní savcům.", "Velryby jsou prapůvodní savci – suchozemci se vyvinuli z nich."], hints: ["Pakicetus = předek velryb z před 50 milionů let žijící na souši."] },
  { question: "Proč jsou plazi vázáni na teplé klima, zatímco savci a ptáci žijí i v arktické zimě?", correctAnswer: "Plazi jsou studenokrevní – závisí na okolní teplotě pro metabolismus. Savci a ptáci jsou teplokrevní – udržují stálou teplotu vnitřně, takže mohou být aktivní i v mraze.", options: ["Plazi jsou studenokrevní – závisí na okolní teplotě pro metabolismus. Savci a ptáci jsou teplokrevní – udržují stálou teplotu vnitřně, takže mohou být aktivní i v mraze.", "Plazi mají tenkou kůži bez ochrany – proto je mráz zabíjí přímo.", "Savci a ptáci mají větší zásoby tuku, které je zahřívají.", "Plazi migrují v zimě jako stěhovaví ptáci, proto je nenajdeme na severu."], hints: ["Tučňák v Antarktidě = teplokrevný pták. Krokodýl = studenokrevný plaz jen v tropech."] },
  { question: "Jak se přizpůsobily ryby k životu v různých hloubkách oceánu?", correctAnswer: "Hlubinné ryby: průhledná těla, orgány pro bioluminiscenci (vlastní světlo), odolný tlak díky absenci plynového měchýře. Mělkovodní: barevné zbarvení, měchýř pro hloubkový profil.", options: ["Hlubinné ryby: průhledná těla, orgány pro bioluminiscenci (vlastní světlo), odolný tlak díky absenci plynového měchýře. Mělkovodní: barevné zbarvení, měchýř pro hloubkový profil.", "Hlubinné ryby jsou jen zmenšené verze mělkovodních ryb.", "Všechny ryby se přizpůsobily stejně – hloubka nehraje roli.", "Hlubinné ryby dýchají jinak – plícemi místo žábrami."], hints: ["Bioluminiscence = vlastní světlo jako lákadlo nebo maskování ve tmě."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OBRATLOVCISAVCIPTACIPLAZIOBOJZIVELNICIRYBY: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    rvpNodeId: "g5-prirodoveda-rozmanitost-prirody-trideni-organismu-obratlovci-savci-ptaci-plazi-obojzivelnici-ryby",
    title: "Obratlovci - savci, ptáci, plazi, obojživelníci, ryby",
    studentTitle: "Skupiny obratlovců",
    subject: "přírodověda",
    category: "Rozmanitost přírody",
    topic: "Třídění organismů",
    briefDescription: "Poznáš 5 skupin obratlovců a jejich hlavní znaky.",
    keywords: ["obratlovci", "savci", "ptáci", "plazi", "obojživelníci", "ryby", "teplokrevní", "studenokrevní"],
    goals: ["Vyjmenovat 5 skupin obratlovců", "Popsat hlavní znaky každé skupiny", "Zařadit konkrétní živočichy do správné skupiny"],
    boundaries: ["Neprobírá fylogenetiku obratlovců", "Neprobírá anatomii do hloubky"],
    gradeRange: [5, 5],
    inputType: "select_one",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "5 skupin: ryby (žábry), obojživelníci (voda+souš), plazi (šupiny, studenokrevní), ptáci (peří), savci (srst, mléko).",
      steps: [
        "1. Ryby: žábry, ploutve, šupiny, voda.",
        "2. Obojživelníci: larvy ve vodě, dospělci i na souši.",
        "3. Plazi: šupiny, studenokrevní, suchá kůže.",
        "4. Ptáci: peří, teplokrevní, vejce.",
        "5. Savci: srst, teplokrevní, kojení mlékem.",
      ],
      commonMistake: "Velryba je SAVEC (kojí mlékem), ne ryba. Delfín také.",
      example: "Žába = obojživelník. Had = plaz. Holub = pták. Pes = savec.",
    },
  },
];
