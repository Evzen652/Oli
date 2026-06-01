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
  { question: "Co je cyklus (smyčka) v programování?", correctAnswer: "Opakování skupiny příkazů vícekrát", options: ["Opakování skupiny příkazů vícekrát", "Jednorázový příkaz", "Proměnná s číslem", "Podmíněný blok"], hints: ["Cyklus = opakování."] },
  { question: "Kolikrát se provede blok uvnitř 'opakuj 5 krát'?", correctAnswer: "5krát", options: ["5krát", "1krát", "Nekonečněkrát", "0krát"], hints: ["Číslo v bloku říká, kolikrát se opakuje."] },
  { question: "Co je podprogram (funkce)?", correctAnswer: "Pojmenovaná skupina příkazů, kterou lze volat opakovaně", options: ["Pojmenovaná skupina příkazů, kterou lze volat opakovaně", "Typ proměnné", "Podmínka v programu", "Pozadí scény"], hints: ["Podprogram = balíček příkazů se jménem."] },
  { question: "Jaký cyklus se opakuje stále dokola bez konce?", correctAnswer: "Navždy – nekonečná smyčka", options: ["Navždy (nekonečná smyčka)", "Opakuj 1 krát", "Opakuj 0 krát", "Podmínkový blok"], hints: ["Nekonečná smyčka nikdy neskončí sama."] },
  { question: "Proč používáme cykly v programování?", correctAnswer: "Abychom nemuseli psát stejné příkazy vícekrát", options: ["Abychom nemuseli psát stejné příkazy vícekrát", "Aby program byl pomalejší", "Aby program skočil na jiné místo", "Aby se spustil jiný program"], hints: ["Cyklus šetří opakování kódu."] },
  { question: "Co se stane po skončení cyklu 'opakuj 3 krát'?", correctAnswer: "Program pokračuje dalším příkazem za cyklem", options: ["Program pokračuje dalším příkazem za cyklem", "Program se zastaví", "Program se restartuje", "Cyklus se opakuje znovu"], hints: ["Po dokončení cyklu program jde dál."] },
  { question: "K čemu slouží podprogram?", correctAnswer: "Umožňuje použít skupinu příkazů na více místech bez opakování kódu", options: ["Umožňuje použít skupinu příkazů na více místech bez opakování kódu", "Spouští nový program", "Zastaví cyklus", "Nastaví proměnnou"], hints: ["Podprogram = znovupoužitelný kód."] },
  { question: "Příkazy 'jdi 10 kroků, otoč se 90°' opakuji 4krát. Co se nakreslí?", correctAnswer: "Čtverec", options: ["Čtverec", "Trojúhelník", "Kruh", "Hvězda"], hints: ["4 strany + 4 pravé úhly = jaký tvar?"] },
  { question: "Jaký cyklus se provede přesně N krát a pak skončí?", correctAnswer: "Opakuj N krát", options: ["Opakuj N krát", "Navždy", "Opakuj dokud", "Podmínka pokud"], hints: ["N určuje přesný počet opakování."] },
  { question: "Co je nekonečná smyčka?", correctAnswer: "Cyklus, který nikdy sám neskončí", options: ["Cyklus, který nikdy sám neskončí", "Cyklus, který se provede 100krát", "Cyklus s podmínkou", "Podprogram bez jména"], hints: ["Nekonečná = bez konce."] },
  { question: "Jak se jinak říká podprogramu v programování?", correctAnswer: "Funkce nebo procedura", options: ["Funkce nebo procedura", "Cyklus", "Podmínka", "Proměnná"], hints: ["Podprogram má více jmen — funkce, procedura, blok."] },
  { question: "Co se provede uvnitř cyklu 'opakuj 0 krát'?", correctAnswer: "Nic — příkazy se neprovede vůbec", options: ["Nic — příkazy se neprovede vůbec", "Příkazy se provedou jednou", "Příkazy se provedou nekonečněkrát", "Program se zastaví"], hints: ["0 opakování = nula provedení."] },
];

const POOL_L2: PracticeTask[] = [
  { question: "Jaký je rozdíl mezi 'opakuj N krát' a 'opakuj dokud'?", correctAnswer: "'Opakuj N krát' se zastaví po N opakováních, 'opakuj dokud' závisí na podmínce", options: ["'Opakuj N krát' se zastaví po N opakováních, 'opakuj dokud' závisí na podmínce", "Jsou totéž", "'Opakuj dokud' se provede přesně N krát", "'Opakuj N krát' nikdy neskončí"], hints: ["Co řídí ukončení každého cyklu?"] },
  { question: "Proč je výhodné použít podprogram místo opakování kódu?", correctAnswer: "Chybu opravím na jednom místě a platí pro celý program", options: ["Chybu opravím na jednom místě a platí pro celý program", "Program je rychlejší", "Není to výhodné", "Program zabere méně místa v počítači"], hints: ["Co se stane, když musíš opravit chybu na 10 místech?"] },
  { question: "Co se stane, pokud zavolám podprogram uvnitř cyklu?", correctAnswer: "Podprogram se provede tolikrát, kolikrát se cyklus opakuje", options: ["Podprogram se provede tolikrát, kolikrát se cyklus opakuje", "Podprogram se provede jen jednou", "Program se zastaví", "Podprogram se ignoruje"], hints: ["Cyklus opakuje vše uvnitř, včetně volání podprogramu."] },
  { question: "Jak se nazývá situace, kdy cyklus nikdy neskončí kvůli chybě?", correctAnswer: "Nekonečná smyčka – infinite loop", options: ["Nekonečná smyčka (infinite loop)", "Podmíněný skok", "Rekurze", "Funkce"], hints: ["Smyčka, která neskončí = nekonečná smyčka."] },
  { question: "Kolik stran nakreslím cyklem 'opakuj 6 krát: jdi 50, otoč se 60°'?", correctAnswer: "6 stran — pravidelný šestiúhelník", options: ["6 stran — pravidelný šestiúhelník", "4 strany", "8 stran", "3 strany"], hints: ["360 ÷ 60 = 6 — počet stran odpovídá počtu otočení."] },
  { question: "Jak se podprogram liší od cyklu?", correctAnswer: "Podprogram je pojmenovaná skupina příkazů, cyklus je opakování příkazů", options: ["Podprogram je pojmenovaná skupina příkazů, cyklus je opakování příkazů", "Jsou totéž", "Cyklus je pojmenovaný, podprogram opakuje", "Podprogram se opakuje donekonečna"], hints: ["Funkce = název + příkazy; cyklus = opakování."] },
  { question: "Proč je výhodné pojmenovat podprogram popisným jménem (např. 'nakresliCtverec')?", correctAnswer: "Program je přehledný a srozumitelný pro ostatní programátory", options: ["Program je přehledný a srozumitelný pro ostatní programátory", "Program je rychlejší", "Podprogram se provede rychleji", "Nelze jinak pojmenovat"], hints: ["Dobrý název = kód se čte jako text."] },
  { question: "Kolikrát se provede příkaz uvnitř cyklu 'opakuj dokud x > 5', pokud x začíná na 1 a každým krokem se zvyšuje o 1?", correctAnswer: "5krát – x = 1, 2, 3, 4, 5, pak x = 6 → podmínka nesplněna", options: ["5krát (x = 1, 2, 3, 4, 5, pak x = 6 → podmínka nesplněna)", "6krát", "Nekonečněkrát", "0krát"], hints: ["Kdy podmínka 'x > 5' přestane platit?"] },
  { question: "Co se stane, pokud podmínka cyklu 'opakuj dokud' není nikdy splněna?", correctAnswer: "Cyklus se neprovede ani jednou", options: ["Cyklus se neprovede ani jednou", "Cyklus se provede jednou", "Cyklus se provede nekonečněkrát", "Program spadne"], hints: ["Podmínka musí platit, aby se cyklus spustil."] },
  { question: "Jaký vzorec platí pro otočení při kreslení pravidelného n-úhelníku cyklem?", correctAnswer: "360 ÷ n stupňů na každé otočení", options: ["360 ÷ n stupňů na každé otočení", "180 ÷ n stupňů", "n × 90 stupňů", "360 × n stupňů"], hints: ["Celkové otočení při obkreslení tvaru = 360°."] },
];

const POOL_L3: PracticeTask[] = [
  { question: "Kolik příkazů ušetřím, pokud místo 5× zapsaného bloku 'pohni 10, otoč 90' (= 10 řádků) použiji cyklus 'opakuj 5×: pohni 10, otoč 90' (= 3 řádky)?", correctAnswer: "7 příkazů – 10 - 3 = 7", options: ["7 příkazů (10 - 3 = 7)", "5 příkazů", "10 příkazů", "0 příkazů"], hints: ["10 původních řádků minus 3 s cyklem = ?"] },
  { question: "Jak nakreslím trojúhelník cyklem? Kolik stupňů na otočení a kolikrát?", correctAnswer: "Opakuj 3×: jdi 100 kroků, otoč se o 120 stupňů", options: ["Opakuj 3×: jdi 100 kroků, otoč se o 120 stupňů", "Opakuj 3×: jdi 100 kroků, otoč se o 90 stupňů", "Opakuj 4×: jdi 100 kroků, otoč se o 90 stupňů", "Opakuj 3×: jdi 100 kroků, otoč se o 60 stupňů"], hints: ["360 ÷ 3 stran = ? stupňů na otočení."] },
  { question: "Podprogram 'pozdrav' říká 'Ahoj'. Volám ho 3× v cyklu. Kolikrát se zobrazí 'Ahoj'?", correctAnswer: "3krát", options: ["3krát", "1krát", "0krát", "Nekonečněkrát"], hints: ["Cyklus 3× × 1 pozdrav = ?"] },
  { question: "Co je výstup programu: nastav x na 1; opakuj 4 krát: přidej k x číslo 2; vypiš x?", correctAnswer: "9 – 1 + 2 + 2 + 2 + 2 = 9", options: ["9 (1 + 2 + 2 + 2 + 2 = 9)", "8", "7", "5"], hints: ["Začni na 1 a přidávej 2 čtyřikrát."] },
  { question: "Cyklus 'opakuj dokud skóre < 10': skóre začíná na 0, každý krok +3. Kolikrát se cyklus provede?", correctAnswer: "4krát – 0→3→6→9→12, při 12 podmínka skončí", options: ["4krát (0→3→6→9→12, při 12 podmínka skončí)", "3krát", "5krát", "10krát"], hints: ["Proveď kroky: 0, 3, 6, 9 → cyklus pokračuje; 12 → cyklus skončí."] },
  { question: "Jak se nazývá situace, kdy podprogram volá sám sebe?", correctAnswer: "Rekurze", options: ["Rekurze", "Nekonečná smyčka", "Cyklus", "Podmínka"], hints: ["Podprogram, který volá sám sebe = rekurze (pokročilé téma)."] },
  { question: "Proč může nekonečná smyčka způsobit problém?", correctAnswer: "Program nikdy neskončí a zablokuje počítač nebo aplikaci", options: ["Program nikdy neskončí a zablokuje počítač nebo aplikaci", "Program se provede dvakrát rychleji", "Program přeskočí ostatní příkazy", "Program nakreslí jiný tvar"], hints: ["Co se stane, když program neví, kdy má skončit?"] },
  { question: "Mám podprogram 'nakresliCtverec'. Volám ho 5× s různými velikostmi. Kolikrát se provede kód uvnitř podprogramu?", correctAnswer: "5krát — jednou pro každé volání", options: ["5krát — jednou pro každé volání", "1krát", "20krát", "0krát"], hints: ["Každé volání podprogramu provede jeho kód jednou."] },
  { question: "Jakou výhodu má použití parametru v podprogramu (např. 'nakresliCtverec(velikost)')?", correctAnswer: "Jeden podprogram lze použít pro různé velikosti bez opakování kódu", options: ["Jeden podprogram lze použít pro různé velikosti bez opakování kódu", "Podprogram je rychlejší", "Program zabere méně paměti", "Nelze použít parametry v podprogramech"], hints: ["Parametr = nastavitelná hodnota, která se předá podprogramu."] },
  { question: "Kolikrát se cyklus 'opakuj N krát' provede, pokud N = 0?", correctAnswer: "0krát — cyklus se vůbec neprovede", options: ["0krát — cyklus se vůbec neprovede", "1krát", "N neurčuje počet opakování", "Záleží na příkazech uvnitř"], hints: ["N = 0 znamená nula opakování."] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : POOL_L3;
  return shuffle(pool).slice(0, 30);
}

export const OPAKOVANICYKLYPRIPRAVENEPODPROGRAMY: TopicMetadata[] = [
  {
    id: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-opakovani-cykly-pripravene-podprogramy",
    rvpNodeId: "g5-informatika-algoritmizace-a-programovani-programovani-v-blokovem-prostredi-opakovani-cykly-pripravene-podprogramy",
    title: "Opakování (cykly), připravené podprogramy",
    studentTitle: "Cykly a podprogramy",
    subject: "informatika",
    category: "Algoritmizace a programování",
    topic: "Programování v blokovém prostředí",
    briefDescription: "Naučíš se používat cykly a podprogramy v programování.",
    keywords: ["cyklus", "smyčka", "opakování", "podprogram", "funkce", "opakuj N krát", "navždy"],
    goals: [
      "Rozumí pojmům cyklus, smyčka, podprogram.",
      "Použije cyklus 'opakuj N krát' pro opakování příkazů.",
      "Vysvětlí, proč se podprogramy používají pro znovupoužití kódu.",
    ],
    boundaries: ["Rekurze", "Cykly ve výkonnostních algoritmech", "Textové programování"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Cyklus = příkazy v závorce se opakují. Podprogram = pojmenovaná skupina příkazů, kterou zavoláš jménem.",
      steps: [
        "Rozhodnu, které příkazy chci opakovat.",
        "Zvolím typ cyklu: 'opakuj N krát' nebo 'opakuj dokud podmínka'.",
        "Příkazy vložím dovnitř cyklu.",
        "Pokud skupinu příkazů použiji na více místech, vytvořím podprogram.",
      ],
      commonMistake: "Zapomenutí aktualizovat podmínku v cyklu 'opakuj dokud' — program běží donekonečna.",
      example: "Cyklus: opakuj 4×: pohni 100, otoč 90° → nakreslí čtverec. Podprogram: 'nakresliCtverec' → zavolám ho kdekoliv.",
    },
  },
];
