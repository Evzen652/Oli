import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Level 1 – jednodušší páry (základní pojmy)
const POOL_L1: PracticeTask[] = [
  {
    question: "Spoj geografický pojem s jeho definicí.",
    correctAnswer: "match",
    pairs: [
      { left: "Rovnoběžka", right: "Vodorovná čára na mapě — zeměpisná šířka" },
      { left: "Poledník", right: "Svislá čára na mapě — zeměpisná délka" },
      { left: "Rovník", right: "Nultá rovnoběžka (0°) — dělí Zemi na polokoule" },
      { left: "Nultý poledník", right: "Greenwichský poledník (0°) — výchozí délka" },
    ],
    hints: ["Rovnoběžky jsou vodorovné, poledníky jsou svislé."],
  },
  {
    question: "Spoj světovou stranu s jejím zkratkou a směrem slunce.",
    correctAnswer: "match",
    pairs: [
      { left: "Sever", right: "N — směrem k severnímu pólu" },
      { left: "Jih", right: "S — směrem k jižnímu pólu" },
      { left: "Východ", right: "E (East) — kde vychází slunce" },
      { left: "Západ", right: "W (West) — kde slunce zapadá" },
    ],
    hints: ["Slunce vychází na východě."],
  },
  {
    question: "Spoj zeměpisný pojem s hodnotou nebo charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Severní pól", right: "90° severní šířky" },
      { left: "Rovník", right: "0° zeměpisné šířky" },
      { left: "Nultý poledník", right: "0° zeměpisné délky — Greenwich, Londýn" },
      { left: "Časové pásmo", right: "15° zeměpisné délky = 1 hodina" },
    ],
    hints: ["Severní pól je na 90° severní šířky."],
  },
  {
    question: "Spoj mapu nebo zobrazení s jeho charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "Glóbus", right: "Kulatý model Země — přesný tvar, ale nepraktický" },
      { left: "Mapa", right: "Plochá — zkreslená, ale přenosná a detailní" },
      { left: "Satelitní snímek", right: "Fotografie Země z vesmíru" },
      { left: "Schéma (plán)", right: "Detailní plánek malé oblasti — např. budova" },
    ],
    hints: ["Glóbus je kulatý model."],
  },
  {
    question: "Spoj světovou stranu s tím, co na ni ukazuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Kompas — jehla", right: "Sever (magnetický pól)" },
      { left: "Slunce ráno", right: "Vychází na východě" },
      { left: "Slunce v poledne", right: "Na jihu (na severní polokouli)" },
      { left: "Slunce večer", right: "Zapadá na západě" },
    ],
    hints: ["Kompas ukazuje vždy na sever."],
  },
  {
    question: "Spoj poledník nebo rovnoběžku s jejich funkcí.",
    correctAnswer: "match",
    pairs: [
      { left: "Zeměpisná šířka", right: "Udává polohu sever–jih (rovnoběžky)" },
      { left: "Zeměpisná délka", right: "Udává polohu západ–východ (poledníky)" },
      { left: "GPS souřadnice", right: "Kombinace zeměpisné šířky a délky" },
      { left: "24 časových pásem", right: "Každých 15° = 1 hodina rozdílu" },
    ],
    hints: ["GPS kombinuje šířku i délku."],
  },
  {
    question: "Spoj barvu na mapě s tím, co zobrazuje.",
    correctAnswer: "match",
    pairs: [
      { left: "Modrá", right: "Voda — moře, řeky, jezera" },
      { left: "Zelená", right: "Nížiny — nízká nadmořská výška" },
      { left: "Hnědá", right: "Hory — vysoká nadmořská výška" },
      { left: "Žlutá", right: "Střední nadmořská výška — vrchoviny" },
    ],
    hints: ["Modrá na mapě = voda."],
  },
  {
    question: "Spoj časové pásmo s příkladem města.",
    correctAnswer: "match",
    pairs: [
      { left: "UTC+0 (GMT)", right: "Londýn (v zimě)" },
      { left: "UTC+1 (SEČ)", right: "Praha, Berlín, Paříž (v zimě)" },
      { left: "UTC+2", right: "Finsko, Řecko, Kyjev" },
      { left: "UTC-5", right: "New York (EST)" },
    ],
    hints: ["Praha je UTC+1 v zimě."],
  },
  {
    question: "Spoj zeměpisný pojem s příkladem.",
    correctAnswer: "match",
    pairs: [
      { left: "Rovník", right: "Prochází Brazílií, Kongem, Indonésií" },
      { left: "Obratník Raka", right: "Prochází Mexikem, Egyptem, Indií" },
      { left: "Polární kruh", right: "Prochází Islandem, Norskem, Finskem" },
      { left: "Nultý poledník", right: "Prochází Anglií, Španělskem, Ghanou" },
    ],
    hints: ["Rovník prochází přes střed Afriky."],
  },
  {
    question: "Spoj způsob orientace v terénu s tím, co využívá.",
    correctAnswer: "match",
    pairs: [
      { left: "Kompas", right: "Magnetické pole Země" },
      { left: "GPS", right: "Satelitní signál — přesné souřadnice" },
      { left: "Polárka (hvězda)", right: "Orientace v noci — ukazuje na sever" },
      { left: "Mapa a buzola", right: "Porovnání mapy s okolím" },
    ],
    hints: ["Kompas využívá magnetické pole Země."],
  },
];

// Level 2 – středně těžké páry
const POOL_L2: PracticeTask[] = [
  {
    question: "Spoj zeměpisnou šířku s oblastí, na které leží.",
    correctAnswer: "match",
    pairs: [
      { left: "0° (rovník)", right: "Amazonie, Kongo, Indonésie" },
      { left: "23,5° S (obratník Raka)", right: "Mexiko, Egypt, Indie" },
      { left: "51° S", right: "Londýn, Varšava" },
      { left: "66,5° S (polární kruh)", right: "Severní Norsko, Finsko, Island" },
    ],
    hints: ["Rovník je na 0° zeměpisné šířky."],
  },
  {
    question: "Spoj město s jeho časovým pásmem.",
    correctAnswer: "match",
    pairs: [
      { left: "Praha", right: "UTC+1 (zima) / UTC+2 (léto)" },
      { left: "Londýn", right: "UTC+0 (zima) / UTC+1 (léto)" },
      { left: "New York", right: "UTC-5 (zima) / UTC-4 (léto)" },
      { left: "Tokio", right: "UTC+9 (bez letního času)" },
    ],
    hints: ["Praha je UTC+1 v zimě."],
  },
  {
    question: "Spoj zeměpisnou délku s charakteristikou.",
    correctAnswer: "match",
    pairs: [
      { left: "0° (nultý poledník)", right: "Greenwich, Londýn — výchozí poledník UTC" },
      { left: "15° V", right: "Praha, střední Evropa" },
      { left: "75° Z", right: "New York, USA" },
      { left: "180°", right: "Mezinárodní datová hranice (Tichý oceán)" },
    ],
    hints: ["Praha leží na přibližně 14°–15° východní délky."],
  },
  {
    question: "Spoj typ mapy s jejím použitím.",
    correctAnswer: "match",
    pairs: [
      { left: "Fyzická mapa", right: "Zobrazuje povrch — hory, řeky, moře" },
      { left: "Politická mapa", right: "Zobrazuje státy a hranice" },
      { left: "Klimatická mapa", right: "Zobrazuje podnebné pásy" },
      { left: "Turistická mapa", right: "Detailní — cesty, turistické trasy, pamětihodnosti" },
    ],
    hints: ["Fyzická mapa zobrazuje přírodu."],
  },
  {
    question: "Spoj způsob určení polohy s jeho přesností nebo metodou.",
    correctAnswer: "match",
    pairs: [
      { left: "GPS", right: "Nejpřesnější — metry, satelitní signál" },
      { left: "Kompas a mapa", right: "Orientace v terénu — přibližná poloha" },
      { left: "Zeměpisné souřadnice", right: "Přesná poloha v stupních zeměpisné šířky a délky" },
      { left: "Adresa", right: "Populační záznam — ulice, číslo, město" },
    ],
    hints: ["GPS je nejpřesnější."],
  },
  {
    question: "Spoj poledník s časovým pásmem, které přibližně odpovídá.",
    correctAnswer: "match",
    pairs: [
      { left: "0° (Greenwich)", right: "UTC+0 (GMT)" },
      { left: "15° V", right: "UTC+1 (středoevropský čas)" },
      { left: "30° V", right: "UTC+2 (východoevropský čas)" },
      { left: "45° V", right: "UTC+3 (Moskva)" },
    ],
    hints: ["Každých 15° = 1 hodina rozdílu."],
  },
  {
    question: "Spoj název geografické linie s hodnotou zeměpisné šířky.",
    correctAnswer: "match",
    pairs: [
      { left: "Rovník", right: "0°" },
      { left: "Obratník Raka (sever)", right: "23,5° S" },
      { left: "Obratník Kozoroha (jih)", right: "23,5° J" },
      { left: "Severní polární kruh", right: "66,5° S" },
    ],
    hints: ["Rovník je na 0°."],
  },
  {
    question: "Spoj pojem s jeho vztahem ke kartografii (tvorbě map).",
    correctAnswer: "match",
    pairs: [
      { left: "Projekce", right: "Matematický přepis kulaté Země na plochu" },
      { left: "Měřítko", right: "Poměr vzdáleností na mapě ke skutečnosti" },
      { left: "Legenda", right: "Vysvětlení značek a symbolů na mapě" },
      { left: "Zkreslení", right: "Deformace tvarů nebo vzdáleností při přepisu na plochu" },
    ],
    hints: ["Projekce je přepis kulaté Země na papír."],
  },
  {
    question: "Spoj světovou stranu s pomůckou pro orientaci.",
    correctAnswer: "match",
    pairs: [
      { left: "Sever", right: "Polárka (hvězda Polaris)" },
      { left: "Jih", right: "Slunce v poledne (na severní polokouli)" },
      { left: "Východ", right: "Kde slunce vychází" },
      { left: "Západ", right: "Kde slunce zapadá" },
    ],
    hints: ["Polárka je vždy na severu."],
  },
  {
    question: "Spoj část dne s polohou slunce na obloze.",
    correctAnswer: "match",
    pairs: [
      { left: "Ráno (východ slunce)", right: "Slunce vychází na východě" },
      { left: "Poledne (vrchol slunce)", right: "Slunce je na jihu (na severní polokouli)" },
      { left: "Odpoledne", right: "Slunce se přesouvá od jihu na západ" },
      { left: "Večer (západ slunce)", right: "Slunce zapadá na západě" },
    ],
    hints: ["Slunce vychází na východě, zapadá na západě."],
  },
];

// Level 3 – pokročilé páry
const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj zeměpisnou šířku s klimatickým pásmem.",
    correctAnswer: "match",
    pairs: [
      { left: "0°–23,5°", right: "Tropický pás — celoroční teplo" },
      { left: "23,5°–40°", right: "Subtropický pás — suché léto" },
      { left: "40°–66,5°", right: "Mírný pás — 4 roční období" },
      { left: "66,5°–90°", right: "Polární pás — arktické podmínky" },
    ],
    hints: ["Tropický pás je kolem rovníku (0°–23,5°)."],
  },
  {
    question: "Spoj typ mapy s jejím konkrétním využitím.",
    correctAnswer: "match",
    pairs: [
      { left: "Topografická mapa", right: "Detailní terén — vrstevnice, výšky" },
      { left: "Navigační mapa (GPS)", right: "Přesná poloha vozidla nebo chodce" },
      { left: "Demografická mapa", right: "Hustota obyvatelstva, migrace" },
      { left: "Geologická mapa", right: "Horniny, ložiska nerostů, tektonické zlomy" },
    ],
    hints: ["Topografická mapa zobrazuje vrstevnice."],
  },
  {
    question: "Spoj poledník s přibližnou zeměpisnou polohou a UTC.",
    correctAnswer: "match",
    pairs: [
      { left: "Londýn — Greenwich (0°)", right: "UTC+0" },
      { left: "Praha — 14° V", right: "UTC+1 (zima)" },
      { left: "New York — 74° Z", right: "UTC-5 (zima)" },
      { left: "Tokio — 139° V", right: "UTC+9" },
    ],
    hints: ["Praha je UTC+1 v zimě."],
  },
  {
    question: "Spoj typ projekce s jejím charakteristickým rysem.",
    correctAnswer: "match",
    pairs: [
      { left: "Mercatorova projekce", right: "Zachovává tvary, ale zvětšuje oblasti u pólů" },
      { left: "Valíčková (cylindrická)", right: "Dobrá pro navigaci — zachovává úhly" },
      { left: "Zeměpisná projekce (Peterse)", right: "Zachovává plochu — Afrika je menší než se zdá" },
      { left: "Polární projekce", right: "Pohled z pólu — používá se pro arktické mapy" },
    ],
    hints: ["Mercatorova projekce zvětšuje oblasti u pólů."],
  },
  {
    question: "Spoj globální linii s jejím astronomickým významem.",
    correctAnswer: "match",
    pairs: [
      { left: "Rovník", right: "Den i noc jsou vždy přibližně stejně dlouhé" },
      { left: "Obratník Raka", right: "Nejvyšší bod slunce o letním slunovratu" },
      { left: "Polární kruh", right: "Polární den a polární noc" },
      { left: "Nultý poledník", right: "Základ UTC — světový čas" },
    ],
    hints: ["Polární kruh je spojen s polárním dnem."],
  },
  {
    question: "Spoj pojmenování s příslušným zeměpisným polem.",
    correctAnswer: "match",
    pairs: [
      { left: "φ (fí) — phi", right: "Zeměpisná šířka (latitude)" },
      { left: "λ (lambda)", right: "Zeměpisná délka (longitude)" },
      { left: "UTC (Universal Time Coordinated)", right: "Světový čas — základ pro časová pásma" },
      { left: "WGS84", right: "Standard GPS souřadnic — elipsoid Země" },
    ],
    hints: ["Zeměpisná šířka se označuje φ (fí)."],
  },
  {
    question: "Spoj astronomický jev s jeho příčinou.",
    correctAnswer: "match",
    pairs: [
      { left: "Střídání dne a noci", right: "Rotace Země kolem vlastní osy" },
      { left: "Střídání ročních dob", right: "Revoluce Země kolem Slunce + naklopení osy" },
      { left: "Polární den", right: "Slunce neklesá pod horizont v létě nad polárním kruhem" },
      { left: "Časová pásma", right: "Rotace Země — různé části dostávají slunce v jiný čas" },
    ],
    hints: ["Den a noc = rotace Země."],
  },
  {
    question: "Spoj druh mapy s jeho měřítkem.",
    correctAnswer: "match",
    pairs: [
      { left: "Turistická mapa 1:50 000", right: "1 cm = 500 m — detailní" },
      { left: "Topografická mapa 1:200 000", right: "1 cm = 2 km" },
      { left: "Mapa Evropy 1:5 000 000", right: "1 cm = 50 km" },
      { left: "Mapa světa 1:100 000 000", right: "1 cm = 1000 km" },
    ],
    hints: ["Větší jmenovatel = menší měřítko = více zjednodušená mapa."],
  },
  {
    question: "Spoj orientační pomůcku s přesností nebo metodou.",
    correctAnswer: "match",
    pairs: [
      { left: "Satelitní GPS", right: "Přesnost na metry — 30+ satelitů" },
      { left: "Kompas", right: "Přesnost na stupně — magnetické pole" },
      { left: "Sluneční hodiny", right: "Přesnost hodin — sluneční stín" },
      { left: "Mapy.cz / Google Maps", right: "Kombinace GPS + databáze — metry" },
    ],
    hints: ["Satelitní GPS je nejpřesnější."],
  },
  {
    question: "Spoj zeměpisný pojem s příkladem výpočtu.",
    correctAnswer: "match",
    pairs: [
      { left: "Praha (14° V) vs. Londýn (0°)", right: "Rozdíl 14°; 14÷15 ≈ 1 hodina" },
      { left: "Praha vs. New York (74° Z)", right: "Rozdíl 88°; 88÷15 ≈ 6 hodin" },
      { left: "Praha vs. Tokio (139° V)", right: "Rozdíl 125°; 125÷15 ≈ 8 hodin" },
      { left: "Praha vs. Sydney (151° V)", right: "Rozdíl 137°; 137÷15 ≈ 9 hodin" },
    ],
    hints: ["Praha leží na 14° V, každých 15° = 1 hodina."],
  },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const GLOBUSSVETOVESTRANYNAMAPECASOVAPASMAUVOD: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod",
    rvpNodeId: "g5-vlastiveda-misto-kde-zijeme-evropa-a-svet-globus-svetove-strany-na-mape-casova-pasma-uvod",
    title: "Glóbus, světové strany na mapě, časová pásma (úvod)",
    studentTitle: "Glóbus a mapy",
    subject: "vlastivěda",
    category: "Místo, kde žijeme",
    topic: "Evropa a svět",
    briefDescription: "Pochopíš, jak se orientovat na mapě a glóbusu.",
    keywords: ["glóbus", "mapa", "rovnoběžky", "poledníky", "světové strany", "časová pásma", "rovník"],
    goals: [
      "Žák vysvětlí rozdíl mezi glóbusem a mapou",
      "Žák zná rovnoběžky, poledníky a světové strany",
      "Žák pochopí princip časových pásem",
    ],
    boundaries: ["Matematika kartografických projekcí", "GPS technologie"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "static",
    generator: gen,
    helpTemplate: {
      hint: "Rovnoběžky jsou vodorovné (šířka), poledníky jsou svislé (délka). 15° = 1 hodina.",
      steps: [
        "Glóbus = kulatý model Země",
        "Rovnoběžky = vodorovné čáry (zeměpisná šířka, 0°–90°)",
        "Poledníky = svislé čáry (zeměpisná délka, 0°–180°)",
        "24 časových pásem; každých 15° = 1 hodina",
        "Světové strany: sever, jih, východ, západ",
      ],
      commonMistake: "Záměna rovnoběžek (vodorovné) a poledníků (svislé).",
      example: "Praha leží na 14°V → UTC+1 (středoevropský čas).",
    },
  },
];
