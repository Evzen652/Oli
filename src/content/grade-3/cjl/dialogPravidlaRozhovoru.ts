import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL: { q: string; a: string; opts: string[]; e: string }[] = [
  { q: "Co je dialog?", a: "Rozhovor mezi dvěma nebo více lidmi", opts: ["Rozhovor mezi dvěma nebo více lidmi", "Dopis příteli", "Monolog jedné osoby", "Vědecký text"], e: "Dialog je rozhovor, kdy spolu mluví dvě nebo více osob — navzájem si odpovídají. Monolog je naopak, když mluví jen jedna osoba a nikdo jí neodpovídá." },
  { q: "Jak zapisujeme přímou řeč?", a: "Do uvozovek (dolni+horni) + uvozovaci veta", opts: ["Do uvozovek (dolni+horni) + uvozovaci veta", "Bez uvozovek, proste do textu", "Do zavorek", "Kurzivou bez uvozovek"], e: "Přímá řeč jsou přesná slova, která někdo říká, a ta musíme dát do uvozovek, aby bylo jasné, kde ta slova začínají a kde končí. K tomu přidáme uvozovací větu, jako třeba 'řekla maminka'." },
  { q: "Pravidlo slušného rozhovoru č. 1:", a: "Neskáčeme druhému do řeči — počkáme, než domluví", opts: ["Neskáčeme druhému do řeči — počkáme, než domluví", "Mluvíme co nejrychleji", "Opakujeme, co říká druhý", "Díváme se jinam"], e: "Když druhého přerušíme uprostřed věty, nedáme mu šanci dokončit myšlenku a může ho to mrzet. Počkat, než dodomluví, je základní pravidlo slušnosti." },
  { q: "Jak oslovíme dospělého člověka, kterého neznáme?", a: "Pane/paní + příjmení, nebo jen Pane/paní", opts: ["Pane/paní + příjmení, nebo jen Pane/paní", "Hej ty", "Křestním jménem", "Nijak"], e: "Dospělého, kterého neznáme, oslovíme vždy 'Pane' nebo 'Paní', případně přidáme příjmení. Oslovení 'Hej ty' nebo jen křestním jménem by bylo nezdvořilé." },
  { q: "Co říkáme, když vstoupíme do místnosti s lidmi?", a: "Dobrý den (pozdravíme)", opts: ["Dobrý den (pozdravíme)", "Nic neříkáme", "Ahoj všem (vždy)", "Promiňte, musím odejít"], e: "Pozdrav při vstupu do místnosti je základní zdvořilost — dáváme tím najevo, že si ostatních všímáme a vážíme si jich. 'Ahoj' říkáme jen lidem, které dobře známe." },
  { q: "Jak zapíšeme dialog v textu?", a: "Každý mluvčí začíná na novém řádku s pomlčkou nebo uvozovkami", opts: ["Každý mluvčí začíná na novém řádku s pomlčkou nebo uvozovkami", "Vše dohromady bez odlišení", "Každý mluvčí jinak barevně", "Čísly (1:, 2:, 3:)"], e: "Díky novému řádku pro každého mluvčího je ihned vidět, kdy přichází na řadu někdo jiný. Kdybychom vše psali dohromady, čtenář by se ztratil v tom, kdo co říká." },
  { q: "Co je přímá řeč?", a: "Doslova citovaná slova mluvčí osoby", opts: ["Doslova citovaná slova mluvčí osoby", "Popis děje", "Vypravování bez řeči", "Poznámka autora"], e: "Přímá řeč znamená, že zapíšeme přesně ta slova, která někdo pronesl — jako bychom ho nahrávali. Proto ji dáváme do uvozovek, aby bylo jasné, že jde o doslova řečená slova." },
  { q: "Jak projevíme, že posloucháme druhého?", a: "Díváme se na něj, kýváme, reagujeme", opts: ["Díváme se na něj, kýváme, reagujeme", "Díváme se do telefonu", "Přerušujeme ho", "Odcházíme"], e: "Oční kontakt, přikývnutí nebo krátká reakce ('rozumím', 'aha') dávají mluvčímu najevo, že ho posloucháme a zajímáme se o to, co říká. Dívat se do telefonu je nezdvořilé." },
  { q: "Jak zahájíme telefonní rozhovor?", a: "Pozdravíme a představíme se", opts: ["Pozdravíme a představíme se", "Rovnou řekneme, co chceme", "Ticho — čekáme", "Řekneme jen 'Halo'"], e: "Na telefonu druhá strana nevidí, kdo volá, proto je důležité nejprve pozdravit a říct své jméno. Rovnou začít tím, co chceme, by bylo nezdvořilé a matoucí." },
  { q: "Veta: (uvozovka)Pojd si hrat!(uvozovka) rekla Anicka. — Kde jsou uvozovky?", a: "Kolem prime reci — kolem slov, ktera nekdo rika", opts: ["Kolem prime reci — kolem slov, ktera nekdo rika", "Kolem jmena Anicka", "Kolem slova rekla", "Nejsou potreba"], e: "Uvozovky vždy obklopují přesná slova, která někdo říká — tedy přímou řeč. Slovo 'řekla' je součást uvozovací věty, ta uvozovky nepotřebuje." },
  { q: "Jak správně ukončíme rozhovor?", a: "Rozloučíme se (Na shledanou / Ahoj)", opts: ["Rozloučíme se (Na shledanou / Ahoj)", "Odejdeme bez slova", "Řekneme 'konec'", "Přestaneme mluvit"], e: "Rozloučení je stejně důležité jako pozdrav na začátku — dáváme tím najevo, že si druhého vážíme a rozhovor jsme zakončili přátelsky. Odejít bez slova je nezdvořilé." },
  { q: "Co říkáme, když chceme vstoupit do skupinového rozhovoru?", a: "Prominete, smím se zeptat? / Přidám se...", opts: ["Prominete, smím se zeptat? / Přidám se...", "Hned začneme mluvit", "Nahlas zavoláme", "Nic — počkáme navěky"], e: "Zdvořilá žádost o slovo ('Prominete, smím se zeptat?') ukazuje, že respektujeme ostatní a nechceme jim skákat do řeči. Začít mluvit bez dovolení by ostatní vyrušilo." },
];

function gen(level: number): PracticeTask[] {
  return shuffle(POOL).slice(0, 16).map(({ q, a, opts, e }) => ({
    question: q,
    correctAnswer: a,
    options: shuffle([...opts]),
    hints: ["Dialog = rozhovor. Přímou řeč píšeme do uvozovek.", "Pravidla: nasloucháme, neskáčeme do řeči, zdravíme, rozloučíme se."],
    explanation: e,
  }));
}

export const DIALOGPRAVIDLA: TopicMetadata[] = [
  {
    id: "g3-cjl-dialog-pravidla",
    rvpNodeId: "g3-cjl-komunikacni-a-slohova-vychova-slohova-vychova-dialog-pravidla-rozhovoru",
    title: "Dialog - pravidla rozhovoru",
    studentTitle: "Pravidla rozhovoru",
    subject: "čeština",
    category: "Komunikační a slohová výchova",
    topic: "Slohová výchova",
    briefDescription: "Naučíš se pravidla slušného rozhovoru a jak zapsat přímou řeč.",
    keywords: ["dialog", "rozhovor", "přímá řeč", "uvozovky", "pravidla", "zdvořilost", "oslovení"],
    goals: ["Znát pravidla slušného rozhovoru.", "Zapsat přímou řeč s uvozovkami.", "Správně oslovit dospělého a pozdravit."],
    boundaries: ["Základní pravidla, bez dramatizace."],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Dialog: neskaceme do reci, nasloucháme, zdravíme. Přímá řeč: uvozovky + slova + kdo řekl.",
      steps: ["Pozdrav.", "Neskáčeme do řeči.", "Přímou řeč dáme do uvozovek.", "Na závěr se rozloučíme."],
      commonMistake: "Zapomenutí uvozovek u přímé řeči.",
      example: "Ucitelka se zeptala: (uvozovka)Jak se jmenujes?(uvozovka) Tomas odpovedel: (uvozovka)Jmenuji se Tomas.(uvozovka)",
    },
  },
];
