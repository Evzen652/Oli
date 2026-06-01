import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL_L1: PracticeTask[] = [
  {
    question: "Co je glóbus?",
    correctAnswer: "Kulatý model Země",
    options: ["Kulatý model Země", "Plochá mapa světa", "Přístroj pro navigaci", "Dalekohled"],
    hints: ["Je to kulatý — jako Země."],
    solutionSteps: ["Glóbus je zmenšený model Země v kulatém tvaru."],
  },
  {
    question: "Jak se nazývají vodorovné čáry na mapě nebo glóbusu?",
    correctAnswer: "Rovnoběžky – zeměpisná šířka",
    options: [
      "Rovnoběžky (zeměpisná šířka)",
      "Poledníky (zeměpisná délka)",
      "Hora",
      "Průsečíky",
    ],
    hints: ["Jsou rovnoběžné s rovníkem."],
    solutionSteps: ["Rovnoběžky jsou vodorovné čáry měřící zeměpisnou šířku (0°–90°)."],
  },
  {
    question: "Jak se nazývají svislé čáry na mapě nebo glóbusu?",
    correctAnswer: "Poledníky – zeměpisná délka",
    options: [
      "Poledníky (zeměpisná délka)",
      "Rovnoběžky (zeměpisná šířka)",
      "Rovník",
      "Tropické linie",
    ],
    hints: ["Procházejí od severního k jižnímu pólu."],
    solutionSteps: ["Poledníky jsou svislé čáry měřící zeměpisnou délku (0°–180°)."],
  },
  {
    question: "Jaký stupeň zeměpisné šířky má rovník?",
    correctAnswer: "0°",
    options: ["0°", "90°", "180°", "45°"],
    hints: ["Rovník je 'nulová linie'."],
    solutionSteps: ["Rovník má zeměpisnou šířku 0° — dělí Zemi na severní a jižní polokouli."],
  },
  {
    question: "Jaký stupeň zeměpisné šířky má severní pól?",
    correctAnswer: "90° severní šířky",
    options: ["90° severní šířky", "0°", "180°", "45° severní šířky"],
    hints: ["Je to krajní bod na severu."],
    solutionSteps: ["Severní pól leží na 90° severní zeměpisné šířky."],
  },
  {
    question: "Kolik časových pásem má Země?",
    correctAnswer: "24",
    options: ["24", "12", "36", "48"],
    hints: ["Jeden den má 24 hodin."],
    solutionSteps: ["Země má 24 časových pásem — jedno pásmo pro každou hodinu dne."],
  },
  {
    question: "Kolik stupňů zeměpisné délky odpovídá jednomu časovému pásmu?",
    correctAnswer: "15°",
    options: ["15°", "10°", "20°", "24°"],
    hints: ["360° ÷ 24 hodin = ?"],
    solutionSteps: ["360° ÷ 24 = 15° — každé časové pásmo pokrývá 15° zeměpisné délky."],
  },
  {
    question: "Které světové strany existují?",
    correctAnswer: "Sever, jih, východ, západ",
    options: [
      "Sever, jih, východ, západ",
      "Nahoru, dolů, doprava, doleva",
      "Sever, jih, vychod, levý",
      "Severo-západ, jiho-east, upper, lower",
    ],
    hints: ["Základní orientace na mapě."],
    solutionSteps: ["Čtyři světové strany: sever (N), jih (S), východ (E/V), západ (W/Z)."],
  },
  {
    question: "Co ukazuje šipka na kompasu?",
    correctAnswer: "Sever – magnetický pól",
    options: ["Sever (magnetický pól)", "Západ", "Pohyb slunce", "Nejbližší město"],
    hints: ["Kompas se orientuje magnetickým polem Země."],
    solutionSteps: ["Kompasová jehla vždy ukazuje na magnetický sever."],
  },
  {
    question: "Proč se čas liší v různých částech světa?",
    correctAnswer: "Země se otáčí — různé části jsou ke Slunci otočeny v jiný čas",
    options: [
      "Země se otáčí — různé části jsou ke Slunci otočeny v jiný čas",
      "Různé státy si samy vybraly jiný čas",
      "Čas je všude stejný",
      "Slunce se otáčí kolem Země",
    ],
    hints: ["Rotace Země způsobuje střídání dne a noci."],
    solutionSteps: ["Rotace Země (360° za 24 h) způsobuje, že různé části světa mají v tutéž dobu různý čas."],
  },
  {
    question: "Na které světové straně vychází Slunce?",
    correctAnswer: "Na východě",
    options: ["Na východě", "Na západě", "Na severu", "Na jihu"],
    hints: ["Slunce vychází tam, kde Země rotuje směrem k Slunci."],
    solutionSteps: ["Země se otáčí z west na east → Slunce 'vychází' na východě a 'zapadá' na západě."],
  },
  {
    question: "Co je nultý poledník (greenwichský)?",
    correctAnswer: "Výchozí poledník – 0° délky procházející Greenwichem v Londýně",
    options: [
      "Výchozí poledník (0° délky) procházející Greenwichem v Londýně",
      "Poledník procházející Prahou",
      "Rovník",
      "Poledník přes Paříž",
    ],
    hints: ["Jmenuje se podle londýnské čtvrti Greenwich."],
    solutionSteps: ["Nultý (greenwichský) poledník = mezinárodně dohodnutý výchozí poledník pro měření zeměpisné délky."],
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Jak se liší glóbus od mapy a kdy je každý vhodný?",
    correctAnswer: "Glóbus = přesný tvar Země – cestování, ; mapa = detailnější pro konkrétní oblasti",
    options: [
      "Glóbus = přesný tvar Země; mapa = detailnější pro konkrétní oblasti",
      "Glóbus a mapa jsou totéž",
      "Mapa je vždy přesnější",
      "Glóbus se používá jen v muzeích",
    ],
    hints: ["Glóbus nevznikají zkreslení přenesením kulaté Země na ploch papír."],
    solutionSteps: ["Glóbus = kulatý model, přesný; mapa = ploché zkreslení, ale praktičtější pro každodenní použití."],
  },
  {
    question: "Proč jsou poledníky nutné pro určení přesné polohy?",
    correctAnswer: "Rovnoběžky určují sever-jih – šířku, poledníky západ-východ – délku — spolu dávají souřadnice",
    options: [
      "Rovnoběžky určují sever-jih (šířku), poledníky západ-východ (délku) — spolu dávají souřadnice",
      "Poledníky jsou zbytečné — stačí rovnoběžky",
      "Poledníky ukazují jen časová pásma",
      "Rovnoběžky ukazují déllku",
    ],
    hints: ["GPS pracuje s kombinací šířky a délky."],
    solutionSteps: ["Zeměpisná šířka + délka = přesná poloha bodu na Zemi (jako souřadnice v síti)."],
  },
  {
    question: "Proč když je v Praze poledne, je v New Yorku 6 hodin ráno?",
    correctAnswer: "New York leží přibližně 6 časových pásem – 90° západně od Prahy",
    options: [
      "New York leží přibližně 6 časových pásem (90°) západně od Prahy",
      "New York a Praha mají stejný čas",
      "Praha leží blíže k Slunci",
      "Čas se počítá od rovníku",
    ],
    hints: ["Každé 15° = 1 hodina rozdílu."],
    solutionSteps: ["Praha ≈ 15°V; New York ≈ 75°Z → rozdíl ~90° → 6 hodin."],
  },
  {
    question: "Proč letíme-li na západ, zdá se nám den delší?",
    correctAnswer: "Letíme 'za Sluncem' — pohybujeme se ve směru rotace Země na západ",
    options: [
      "Letíme 'za Sluncem' — pohybujeme se ve směru rotace Země na západ",
      "Letadlo letí rychleji než Slunce",
      "Na západ vždy svítí déle Slunce",
      "Západ Evropy má více hodin denního světla",
    ],
    hints: ["Slunce přechází z východu na západ — při letu na západ s ním jdeme."],
    solutionSteps: ["Cestou na západ cestujeme 'se Sluncem' → přidáváme si hodiny ke dni."],
  },
  {
    question: "Jak nultý poledník ovlivňuje počítání světového času?",
    correctAnswer: "Je výchozím bodem pro UTC – koordinovaný světový čas — ostatní pásma se od něj počítají",
    options: [
      "Je výchozím bodem pro UTC — ostatní pásma se od něj počítají",
      "Nultý poledník je jen historická zajímavost",
      "Čas se počítá od rovníku, ne od nultého poledníku",
      "Každá země si vybírá vlastní nultý poledník",
    ],
    hints: ["UTC = Universally Coordinated Time."],
    solutionSteps: ["Nultý poledník = základ UTC. Česko: UTC+1 (zima), UTC+2 (letní čas)."],
  },
  {
    question: "Proč jsou rovnoběžky na glóbusu různě dlouhé?",
    correctAnswer: "Blíže k pólům jsou kratší — Země se k pólům zužuje",
    options: [
      "Blíže k pólům jsou kratší — Země se k pólům zužuje",
      "Všechny rovnoběžky jsou stejně dlouhé",
      "Rovnoběžky na severu jsou delší",
      "Délka závisí na vzdálenosti od nultého poledníku",
    ],
    hints: ["Rovník je nejdelší rovnoběžka."],
    solutionSteps: ["Rovník (0°) je nejdelší rovnoběžka; u pólů (90°) se kružnice zmenšuje až na bod."],
  },
  {
    question: "Proč Česká republika patří do středoevropského časového pásma (UTC+1)?",
    correctAnswer: "Leží přibližně 15°–20° na východ od nultého poledníku",
    options: [
      "Leží přibližně 15°–20° na východ od nultého poledníku",
      "EU nařídila ČR stejný čas jako Německu",
      "Praha leží na nultém poledníku",
      "ČR se rozhodla pro UTC+1 kvůli turistice",
    ],
    hints: ["Každých 15° = 1 hodina."],
    solutionSteps: ["Praha leží přibližně na 14°E → patří do středoevropského pásma UTC+1."],
  },
  {
    question: "Proč používáme kompas místo pouhého pohledu na Slunce?",
    correctAnswer: "Kompas ukazuje sever i v noci, pod mrakem nebo v lese",
    options: [
      "Kompas ukazuje sever i v noci, pod mrakem nebo v lese",
      "Slunce je spolehlivější než kompas",
      "Kompas je jen pro moře",
      "Kompas je nepřesný — Slunce je lepší",
    ],
    hints: ["Kompas funguje nezávisle na počasí a denní době."],
    solutionSteps: ["Kompas využívá magnetické pole Země — pracuje vždy, bez ohledu na viditelnost Slunce."],
  },
  {
    question: "Jak se orientovat na mapě bez kompasu?",
    correctAnswer: "Otočit mapu tak, aby sever na mapě směřoval ke skutečnému severu – Polárka, stín",
    options: [
      "Otočit mapu tak, aby sever na mapě směřoval ke skutečnému severu",
      "Mapu vždy držet s horním okrajem k sobě",
      "Bez kompasu nelze mapu správně orientovat",
      "Sledovat tok řek — vždy tečou na jih",
    ],
    hints: ["V noci pomůže Polárka — vždy na severu."],
    solutionSteps: ["Bez kompasu: Polárka (Polaris), stín o poledni, pohyb Slunce V → Z."],
  },
  {
    question: "Proč jsou na mapách různé barvy (modrá, zelená, hnědá)?",
    correctAnswer: "Modrá = voda, zelená = nížina, hnědá = pohoří — barvy zobrazují výšku a typ povrchu",
    options: [
      "Modrá = voda, zelená = nížina, hnědá = pohoří — barvy zobrazují výšku a typ povrchu",
      "Barvy jsou jen estetické — nemají geografický smysl",
      "Modrá = Evropa, zelená = Afrika",
      "Barvy ukazují různé státy",
    ],
    hints: ["Hypsometrické barvy = barvy výškopisu."],
    solutionSteps: ["Hypsometrické schéma: modrá = voda, zelená = nízko, žlutá = středně, hnědá = hory."],
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Spoj geografické pojmy s jejich definicí.",
    correctAnswer: "Správné přiřazení",
    pairs: [
      { left: "Rovnoběžka", right: "Vodorovná čára, měří zeměpisnou šířku" },
      { left: "Poledník", right: "Svislá čára, měří zeměpisnou délku" },
      { left: "Rovník", right: "Nultá rovnoběžka (0°)" },
      { left: "Nultý poledník", right: "Greenwichský poledník (0°)" },
    ],
    hints: ["Rovnoběžky = vodorovné, poledníky = svislé."],
    solutionSteps: ["Souřadnicová síť: šířka (rovnoběžky) + délka (poledníky)."],
  },
  {
    question: "Vypočítej: Praha leží na 14°E, Londýn na 0°. Jaký je hodinový rozdíl?",
    correctAnswer: "1 hodina – 14°/15° = 0,93 → přibližně 1 pásmo",
    options: [
      "1 hodina (Praha je UTC+1, Londýn UTC+0)",
      "2 hodiny",
      "Žádný rozdíl — mají stejný čas",
      "6 hodin",
    ],
    hints: ["15° = 1 hodina. Praha na 14°E je o ~1 hodinu napřed."],
    solutionSteps: ["Praha: UTC+1 (zimní); Londýn: UTC+0 → rozdíl 1 hodina."],
  },
  {
    question: "Proč mapy světa zkreslují skutečnou velikost kontinentů?",
    correctAnswer: "Kulatou Zemi nelze přenést na plochý papír bez deformace",
    options: [
      "Kulatou Zemi nelze přenést na plochý papír bez deformace",
      "Kartografové dělají záměrné chyby",
      "Kontinenty se skutečně tvarově mění",
      "Mapy jsou vždy přesné bez zkreslení",
    ],
    hints: ["Zkus rozřezat pomerančovou slupku na plochý kousek."],
    solutionSteps: ["Kartografická projekce = matematický převod koule na plochu → vždy nějaké zkreslení."],
  },
  {
    question: "Seřaď od rovníku k severnímu pólu: severní obratník, polární kruh, rovník, severní pól.",
    correctAnswer: "Rovník – 0° → Severní obratník – 23,5° → Polární kruh – 66,5° → Severní pól – 90°",
    items: [
      "Rovník (0°)",
      "Severní obratník (23,5°)",
      "Polární kruh (66,5°)",
      "Severní pól (90°)",
    ],
    hints: ["Rovník je na 0°."],
    solutionSteps: ["0° rovník → 23,5° obratník → 66,5° polární kruh → 90° pól."],
  },
  {
    question: "Proč je čas na letišti Praha (UTC+1) a Tokyo (UTC+9) rozdílný o 8 hodin?",
    correctAnswer: "Praha ≈ 15°V, Tokyo ≈ 140°V → rozdíl 125° → 125÷15 ≈ 8 pásem",
    options: [
      "Praha ≈ 15°V, Tokyo ≈ 140°V → rozdíl 125° → 8 hodin",
      "Japonsko je 12 hodin napřed",
      "Praha a Tokyo mají stejný čas",
      "Rozdíl je 5 hodin",
    ],
    hints: ["Odečti zeměpisné délky a vydel 15."],
    solutionSteps: ["140° - 15° = 125°; 125 ÷ 15 ≈ 8,3 → 8–9 hodinový rozdíl."],
  },
  {
    question: "Proč glóbus nemůže nahradit mapu pro použití ve škole nebo v autě?",
    correctAnswer: "Glóbus je velký, neohebný a nezobrazuje detaily — mapa je praktičtější",
    options: [
      "Glóbus je velký, neohebný a nezobrazuje detaily — mapa je praktičtější",
      "Glóbus je přesnější a tedy vždy lepší",
      "Glóbus lze použít k navigaci v autě",
      "Mapa je méně přesná než glóbus ve všech ohledech",
    ],
    hints: ["Uvažuj o praktičnosti vs. přesnosti."],
    solutionSteps: ["Glóbus: přesný tvar, ale nepraktický. Mapa: zkreslená, ale přenosná a detailní."],
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
    inputType: "select_one",
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
