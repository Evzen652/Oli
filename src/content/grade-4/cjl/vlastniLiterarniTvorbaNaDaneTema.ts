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

const POOL_L1: QA[] = [
  { q: "Co je téma ve vlastním textu?", a: "O čem chceme psát — základní myšlenka příběhu", opts: ["O čem chceme psát — základní myšlenka příběhu", "Jak dlouhý bude text", "Kdo napsal text", "Kde text vyjde"] },
  { q: "Co je motiv v textu?", a: "Opakující se prvek nebo myšlenka (voda, přátelství, cesta)", opts: ["Opakující se prvek nebo myšlenka (voda, přátelství, cesta)", "Délka textu", "Jméno autora", "Pravopis v textu"] },
  { q: "Proč si před psaním sestavíme osnovu?", a: "Abychom věděli, co a v jakém pořadí napíšeme", opts: ["Abychom věděli, co a v jakém pořadí napíšeme", "Abychom text zkrátili", "Abychom opravili pravopis", "Abychom zjistili téma"] },
  { q: "Co je styl autora?", a: "Způsob, jakým autor píše — volba slov, délka vět, tón", opts: ["Způsob, jakým autor píše — volba slov, délka vět, tón", "Délka textu", "Téma textu", "Jméno autora"] },
  { q: "Čím text oživíme?", a: "Přídavnými jmény, přímou řečí, živým popisem", opts: ["Přídavnými jmény, přímou řečí, živým popisem", "Mnoha daty a čísly", "Jen podstatnými jmény", "Bez jakýchkoli přívlastků"] },
  { q: "Co je osnova vlastního textu?", a: "Plán textu: úvod, zápletka, vyvrcholení, závěr", opts: ["Plán textu: úvod, zápletka, vyvrcholení, závěr", "Výsledný text celý napsaný", "Jen závěr textu", "Jen téma a název"] },
  { q: "Jak napsat dobrý začátek příběhu?", a: "Zaujmout čtenáře otázkou, popisem nebo přímou řečí", opts: ["Zaujmout čtenáře otázkou, popisem nebo přímou řečí", "Začít dlouhým popisem počasí", "Uvést všechny postavy najednou", "Začít závěrem příběhu"] },
  { q: "Jak napsat dobrý konec příběhu?", a: "Uzavřít příběh a splnit příslib úvodu (rozuzlení)", opts: ["Uzavřít příběh a splnit příslib úvodu (rozuzlení)", "Přestat psát uprostřed věty", "Začít nový příběh", "Opakovat úvod doslova"] },
  { q: "Co je přídavné jméno a proč ho používat v textu?", a: "Zpřesňuje popis — 'starý dům' je konkrétnější než 'dům'", opts: ["Zpřesňuje popis — 'starý dům' je konkrétnější než 'dům'", "Nahrazuje podstatné jméno", "Vyjadřuje děj", "Vyjadřuje místo"] },
  { q: "Co je přímá řeč v příběhu a proč ji použít?", a: "Slova postav — oživuje text, ukazuje jejich charakter", opts: ["Slova postav — oživuje text, ukazuje jejich charakter", "Popis prostředí příběhu", "Komentář autora", "Shrnutí příběhu"] },
  { q: "Co je to 'brainstorming' před psaním?", a: "Zapisujeme všechny nápady na téma bez kritiky", opts: ["Zapisujeme všechny nápady na téma bez kritiky", "Opravujeme pravopis v hotovém textu", "Čteme text nahlas", "Píšeme konec příběhu jako první"] },
  { q: "Co je revize textu?", a: "Čteme hotový text a opravujeme ho — obsah, styl, pravopis", opts: ["Čteme hotový text a opravujeme ho — obsah, styl, pravopis", "První psaní bez oprav", "Čtení textu spolužákovi", "Vydání textu"] },
  { q: "Co je úvod příběhu?", a: "Uvede čtenáře do příběhu — kde, kdy, kdo", opts: ["Uvede čtenáře do příběhu — kde, kdy, kdo", "Největší napětí příběhu", "Rozuzlení příběhu", "Ponaučení na konci"] },
  { q: "Co je zápletka?", a: "Problém nebo událost, která rozhýbe příběh", opts: ["Problém nebo událost, která rozhýbe příběh", "Klidný úvod bez napětí", "Popis prostředí", "Rozuzlení příběhu"] },
  { q: "Proč je důležité psát vlastní text?", a: "Rozvíjí kreativitu, vyjadřovací schopnosti a fantazii", opts: ["Rozvíjí kreativitu, vyjadřovací schopnosti a fantazii", "Je to povinnost ve škole — nic víc", "Abychom se naučili opisovat", "Abychom psali rychleji"] },
  { q: "Jak vybrat vhodné téma pro vlastní text?", a: "Vybereme, co nás zajímá nebo o čem víme — pak lépe píšeme", opts: ["Vybereme, co nás zajímá nebo o čem víme — pak lépe píšeme", "Vybereme nejdelší téma", "Vybereme téma, o kterém nic nevíme", "Vybereme náhodně"] },
];

const POOL_L2: QA[] = [
  { q: "Jak zapracovat motiv přátelství do příběhu?", a: "Ukažeme postavy, jak si pomáhají nebo spolu prožívají těžké chvíle", opts: ["Ukažeme postavy, jak si pomáhají nebo spolu prožívají těžké chvíle", "Napíšeme slovo 'přátelství' co nejvíce", "Vložíme definici přátelství", "Popíšeme fyzický popis přátel"] },
  { q: "Co je nejsilnější místo v příběhu?", a: "Vyvrcholení — kdy příběh dosáhne největšího napětí", opts: ["Vyvrcholení — kdy příběh dosáhne největšího napětí", "Úvod — kdy začíná příběh", "Závěr — kdy příběh končí", "Zápletka — kdy začíná problém"] },
  { q: "Jak popsat prostředí v příběhu?", a: "Zapojit smysly: co vidíme, slyšíme, cítíme, hmatáme", opts: ["Zapojit smysly: co vidíme, slyšíme, cítíme, hmatáme", "Jen vyjmenovat objekty v prostředí", "Napsat souřadnice místa", "Nepolohu prostředí neuvádíme"] },
  { q: "Jak psát dialog (přímou řeč) správně?", a: "Uvozovky + uvozovací věta: „Pojď," řekl Honza.", opts: ["Uvozovky + uvozovací věta: „Pojď," řekl Honza.", "Bez uvozovek — prostý text", "Jen tučné písmo", "V závorce"] },
  { q: "Co je metafora v textu?", a: "Přirovnání bez 'jako': 'Petr je lev.' (přeneseně statečný)", opts: ["Přirovnání bez 'jako': 'Petr je lev.' (přeneseně statečný)", "Přirovnání s 'jako': 'Petr je jako lev.'", "Popis fyzického vzhledu", "Přímá řeč postavy"] },
  { q: "Co je přirovnání (simile) v textu?", a: "Přirovnání se 'jako': 'Petr běží jako vítr.'", opts: ["Přirovnání se 'jako': 'Petr běží jako vítr.'", "Přirovnání bez 'jako'", "Citát z jiné knihy", "Faktická informace"] },
  { q: "Jak si udělat poznámky před psaním?", a: "Brainstorming: klíčová slova, osnova, hlavní myšlenka", opts: ["Brainstorming: klíčová slova, osnova, hlavní myšlenka", "Přečíst jiný text a zkopírovat ho", "Napsat rovnou celý text", "Požádat kamaráda o nápady"] },
  { q: "Jak obohatit text synonymy?", a: "Nahradíme opakující se slovo jiným s podobným významem", opts: ["Nahradíme opakující se slovo jiným s podobným významem", "Slovo zdvojíme: 'šel šel'", "Slovo vypustíme", "Přidáme překlad slova"] },
  { q: "Co je kompozice textu?", a: "Celková stavba textu — jak jsou části uspořádány", opts: ["Celková stavba textu — jak jsou části uspořádány", "Délka textu v počtu slov", "Pravopis a interpunkce", "Téma a motiv"] },
  { q: "Jak zapsat reflexi po napsání textu?", a: "Co se mi povedlo? Co bych příště udělal jinak?", opts: ["Co se mi povedlo? Co bych příště udělal jinak?", "Opsat text podruhé", "Přeložit text do angličtiny", "Spočítat délku textu"] },
  { q: "Co je 'show, don't tell' v psaní?", a: "Ukazujeme situaci (nepřímá), namísto přímého sdělení", opts: ["Ukazujeme situaci (nepřímá), namísto přímého sdělení", "Říkáme přímo, co chceme čtenáři říct", "Opisujeme text jiného autora", "Jen píšeme fakta"] },
  { q: "Jak prodloužit krátký příběh?", a: "Přidat popis prostředí, novou scénu nebo vedlejší postavu", opts: ["Přidat popis prostředí, novou scénu nebo vedlejší postavu", "Opakovat první odstavec", "Napsat závěr znovu", "Přidat seznam slov"] },
  { q: "Co je rytmus textu?", a: "Střídání krátkých a dlouhých vět — tempo čtení", opts: ["Střídání krátkých a dlouhých vět — tempo čtení", "Počet slov v textu", "Téma textu", "Použité přídavné jméno"] },
  { q: "Jaký typ textu napíše 4. třída nejčastěji?", a: "Vypravování a popis (oba typy se učí v 4. ročníku)", opts: ["Vypravování a popis (oba typy se učí v 4. ročníku)", "Odborný článek", "Filozofická esej", "Dramatický monolog"] },
];

function gen(level: number): PracticeTask[] {
  const pool = level === 1 ? POOL_L1 : level === 2 ? POOL_L2 : shuffle([...POOL_L1, ...POOL_L2]);
  const selected = shuffle(pool).slice(0, Math.min(pool.length, 16));
  return selected.map(({ q, a, opts }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle(opts),
    hints: [
      "Téma = o čem text je; motiv = opakující se prvek",
      "Osnova = plán textu (úvod → zápletka → vyvrcholení → závěr)",
      "Text oživíme: přídavná jména, přímá řeč, živý popis",
    ],
    solutionSteps: [
      "Zvolíme téma a promyslíme, co chceme říct.",
      "Sestavíme osnovu: úvod → zápletka → vyvrcholení → závěr.",
      "Píšeme a oživujeme přídavnými jmény a přímou řečí.",
      "Revidujeme: zkontrolujeme obsah, styl, pravopis.",
    ],
  }));
}

export const VLASTNILITERARNITVORBANADANETEMA: TopicMetadata[] = [
  {
    id: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    rvpNodeId: "g4-cjl-literarni-vychova-prace-s-textem-vlastni-literarni-tvorba-na-dane-tema",
    title: "Vlastní literární tvorba na dané téma",
    studentTitle: "Píšu svůj příběh",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Literární výchova",
    briefDescription: "Naučíš se psát vlastní příběh s osnovou, živým popisem a správnou přímou řečí.",
    keywords: ["vlastní tvorba", "téma", "motiv", "osnova", "přímá řeč", "styl", "popis", "vypravování"],
    goals: [
      "Sestavit osnovu pro vlastní příběh",
      "Použít přídavná jména a přímou řeč pro oživení textu",
      "Napsat ucelený příběh s úvodem, zápletkou, vyvrcholením a závěrem",
    ],
    boundaries: ["Bez pokročilých literárních technik", "Bez esejů a odborných textů"],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Téma=o čem; motiv=opakující se prvek; osnova=plán; text oživíme přídavnými jmény a přímou řečí",
      steps: [
        "Zvolíme téma a vymyslíme osnovu (úvod → zápletka → vyvrcholení → závěr).",
        "Píšeme první verzi — bez oprav.",
        "Oživíme text: přídavná jména, přímá řeč, živý popis.",
        "Revidujeme: obsah, styl, pravopis.",
      ],
      commonMistake: "Zapomenutí osnovy → chaotický text bez logického průběhu",
      example: "Téma: přátelství. Motiv: pomoc v těžké chvíli. Osnova: 1. Ztratil se pes. 2. Kamarádi ho hledají. 3. Najdou ho. 4. Jsou radi za přátelství.",
    },
  },
];
