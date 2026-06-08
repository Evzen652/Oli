import type { TopicMetadata, PracticeTask } from "@/lib/types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Každý task = seřaď historické události Slovanů a VM Říše ve správném pořadí
const VSECHNY_TASKY: PracticeTask[] = [
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol. n. l.)",
      "Sámova říše – první slovanský stát (623–658)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["Vzpomeň si, co přišlo jako první.", "Začni od příchodu Slovanů v 6. stol."],
    explanation: "Slované přišli nejprve bez vlastního státu. Sámo je roku 623 sjednotil v první říši, Cyril a Metoděj roku 863 přinesli hlaholici — a Velká Morava zanikla roku 906 nájezdy Maďarů.",
  },
  {
    question: "Seřaď slovanské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – Germáni opouštějí střed Evropy (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (7. stol.)",
      "Velkomoravská říše (9. stol.)",
    ],
    hints: ["Zánik Říma byl nejdříve.", "Každá éra přinesla vyšší stupeň organizace."],
    explanation: "Po zániku Říma Germáni opustili střed Evropy a Slované obsadili jejich místo. Postupně se organizovali — od první kmenovosti k Sámově říši a nakonec k mocné Velkomoravské říši.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – Germáni migrují (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["5. stol. → 6. stol. → 623 → 863.", "Zánik Říma byl jako první."],
    explanation: "Zánik Říma v 5. století spustil stěhování národů, které přivedlo Slovany do střední Evropy. Sámo je nejprve sjednotil vojensky roku 623, ale teprve Cyril a Metoděj roku 863 přinesli to nejcennější — první slovanské písmo.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.) – stěhování národů",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623)",
      "Bořivoj – pokřtěn na Velkomoravském dvoře",
    ],
    hints: ["Zánik Říma byl první, Bořivoj poslední.", "Seřaď podle století."],
    explanation: "Stěhování národů otevřelo střed Evropy Slovanům. Sámo vybudoval první slovanský stát, Velkomoravská říše se stala centrem kultury — a odtud přijal křesťanství i Bořivoj, první křesťanský kníže v Čechách.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Rastislav – kníže VM Říše (9. stol.)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Bořivoj přijal křesťanství z VM Říše",
    ],
    hints: ["Sámo byl první, Bořivoj poslední.", "Cyril a Metoděj přišli roku 863."],
    explanation: "Rastislav pozval Cyrila a Metoděje z Byzance roku 863, protože potřeboval věrozvěsty, kteří budou mluvit slovansky. Jejich mise přinesla nejen křesťanství, ale i staroslověnštinu — a víra se šířila dál, až k Bořivojovi v Čechách.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (7. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["Vzpomeň si na pořadí století.", "5. stol. → 6. stol. → 7. stol. → 863."],
    explanation: "Každé století přineslo Slovanům nový milník: 5. stol. — zánik Říma, 6. stol. — Slované přišli, 7. stol. — Sámo je sjednotil, 863 — Cyril a Metoděj přinesli hlaholici. Takto krok po kroku vznikla slovanská kultura.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik Velkomoravské říše (přibližně 830)",
      "Zánik Velkomoravské říše – Maďaři (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["Sámova říše předchází VM Říši.", "Přemyslovci přišli po zániku VM Říše."],
    explanation: "Po Sámově říši trvalo téměř dvě staletí, než vznikla Velkomoravská říše. Maďarský nájezd ji roku 906 zničil, ale Přemyslovci navázali na její kulturní a náboženské dědictví.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Slované přišli nejdříve.", "Zánik VM Říše byl roku 906."],
    explanation: "Slované přišli bez písma — Sámova říše (623) byla první slovanský stát, ale teprve Cyril a Metoděj přinesli v roce 863 hlaholici. Zánik Velké Moravy roku 906 přerušil tento kulturní rozvoj.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Každá éra vybudovala lepší státní organizaci.", "Zánik VM Říše byl roku 906."],
    explanation: "Slované přišli v 6. století, Sámo je sjednotil v 7. století, Velkomoravská říše vznikla v 9. století. Každý nový státní útvar byl mocnější a organizovanější než předchozí.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámo poráží Avary – vznik Sámovy říše (623)",
      "Cyril a Metoděj přeloží bibli do staroslověnštiny",
      "Zánik Velkomoravské říše – Maďaři (906)",
    ],
    hints: ["Sámo porazil Avary roku 623.", "Zánik VM Říše byl roku 906."],
    explanation: "Sámo porazil Avary a ukázal, že Slované dokážou ubránit svou zemi. Cyril a Metoděj dokázali něco jiného — přeložili celý Nový zákon do staroslověnštiny a poprvé tak umožnili Slovanům modlit se v rodném jazyce.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik Velkomoravské říše (přibližně 830)",
      "Zánik VM Říše – nájezdy Maďarů (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["Sámova říše předchází VM Říši.", "Přemyslovci navázali na dědictví VM Říše."],
    explanation: "Zánik Velké Moravy roku 906 nevyhubil slovanskou kulturu — Přemyslovci ji přenesli do Čech. Křesťanství, jazyk i zvyky přešly z moravské tradice přímo do nové přemyslovské státnosti.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice a staroslověnština (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Slované přišli v 6. stol., zánik byl roku 906.", "863 byl rok hlaholice."],
    explanation: "Staroslověnština přežila zánik Velké Moravy: v klášterech Bulharska a Srbska se dál opisovaly texty v tomto jazyce. Z hlaholice, písma Cyrila, se pak vyvinula cyrilice — základ dnešního ruského a bulharského písma.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Vzpomeň si na pořadí: 6. stol. → 623 → 9. stol. → 906.", "Zánik nastal roku 906."],
    explanation: "Maďarské kmeny v 9. století překročily Karpaty a obsadily Panonii. Roku 906 pak porazily Velkomoravskou říši a trvale oddělily Moravu od Slovenska.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Rastislav zve Cyrila a Metoděje z Byzance",
      "Cyril a Metoděj přeloží bibli do staroslověnštiny",
      "Zánik Velkomoravské říše – Maďaři (906)",
    ],
    hints: ["Sámova říše byla první.", "Cyril a Metoděj přišli roku 863."],
    explanation: "Rastislav pozval Cyrila a Metoděje z Byzance záměrně — chtěl omezit vliv Franků na Moravě. Misionáři přinesli slovanský obřad a přeložili bibli do staroslověnštiny, ale zánik říše roku 906 přerušil jejich dílo.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Rastislav – kníže VM Říše (9. stol.)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Bořivoj přijal křesťanství z VM Říše",
    ],
    hints: ["Rastislav byl kníže VM Říše v 9. stol.", "Bořivoj přijal křesťanství jako poslední."],
    explanation: "Cyril a Metoděj přišli na Moravu roku 863 a strávili zde tři roky. Jejich žáci pak přinesli víru i do Čech — pravděpodobně jeden z nich pokřtil Bořivoje přímo na moravském dvoře.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – Germáni migrují (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (7. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["Zánik Říma byl nejdříve.", "5. stol. bylo nejdříve."],
    explanation: "Dominový efekt stěhování národů: zánik Říma → Germáni migrují na západ → Slované obsazují střed Evropy → Sámo je sjednocuje → Cyril a Metoděj přinášejí písmo. Každá událost vyplývá z té předchozí.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámo porází Avary – vznik Sámovy říše (623)",
      "Rastislav zve Cyrila a Metoděje z Byzance",
      "Cyril a Metoděj přeloží bibli do staroslověnštiny",
      "Zánik Velkomoravské říše – Maďaři (906)",
    ],
    hints: ["Sámo byl první, zánik byl poslední.", "Překlad bible předcházel zániku VM Říše."],
    explanation: "Přeložit celý Nový zákon do nového jazyka byl obrovský úkol. Cyril a Metoděj ho splnili na Moravě mezi lety 863–866. Bylo to dílo bez obdoby v tehdejší Evropě.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik VM Říše – Rastislav, Svätopluk (9. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Přemyslovci sjednocují Čechy (906+)",
    ],
    hints: ["623 bylo nejdříve.", "Po zániku VM Říše přišli Přemyslovci."],
    explanation: "Přemyslovci převzali území a tradice Velké Moravy. Christianizace, která začala na Moravě za Rastislava, pokračovala v Čechách pod přemyslovskými knížaty.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["6. stol. → 623 → 863 → 906.", "Zánik byl roku 906."],
    explanation: "Sámova říše roku 623 nebyla náhodou — Sámo organizoval slovanskou obranu proti nájezdným Avarům a po vítězství se stal jejich prvním králem. Byl to zárodek všech pozdějších slovanských států.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Slované přišli v 6. stol.", "Zánik byl roku 906."],
    explanation: "Velkomoravská říše zahrnovala dnešní Moravu, Slovensko, část Čech, Polska i Maďarska. V době největšího rozkvětu za Svätopluka byl to největší slovanský stát na západ od Karpat.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované – příchod do střední Evropy",
      "Sámo – první slovanský stát (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Zánik VM Říše (906)",
    ],
    hints: ["Slované přišli nejdříve, zánik nastal roku 906.", "863 byl rok příchodu Cyrila a Metoděje."],
    explanation: "Rok 863 je jedním z nejdůležitějších dat slovanských dějin. Cyril a Metoděj přinesli hlaholici, staroslověnštinu a křesťanský obřad v národním jazyce — základ slovanské vzdělanosti.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice a staroslověnština (863)",
      "Zánik VM Říše – Maďarové (906)",
      "Přemyslovci sjednocují Čechy",
    ],
    hints: ["623 bylo nejdříve, Přemyslovci přišli po zániku.", "Zánik byl roku 906."],
    explanation: "Maďarský příchod roku 906 trvale změnil mapu Evropy: oddělil Slováky od Čechů. Přemyslovci pak sjednotili Čechy a stali se nástupci moravského dědictví.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované – příchod do střední Evropy (6. stol.)",
      "Rastislav pozval Cyrila a Metoděje z Byzance",
      "Cyril a Metoděj – hlaholice a křesťanství",
      "Zánik VM Říše (906)",
    ],
    hints: ["Slované přišli v 6. stol., zánik nastal roku 906.", "Rastislav pozval CaM ze Byzance roku 863."],
    explanation: "Hlaholice je jednou z mála záměrně vynalezených abeced v dějinách — Cyril ji nevzal z řečtiny ani latiny, ale sestavil nové znaky speciálně pro zvuky slovanštiny. Bylo to geniální dílo jednoho člověka.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (7. stol.) – porážka Avarů",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj na Moravě (863)",
      "Zánik VM Říše (906)",
    ],
    hints: ["7. stol. → VM Říše 9. stol. → 863 → 906.", "Zánik nastal roku 906."],
    explanation: "Velkomoravská říše byla kulturní most mezi byzantskou civilizací a slovanskými kmeny v srdci Evropy. Cyril a Metoděj přinesli z Konstantinopole nejen víru, ale i celou vzdělanostní tradici.",
  },
  {
    question: "Seřaď slovanské mezníky chronologicky.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – Sámo poráží Avary (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Bořivoj pokřtěn – přenos křesťanství do Čech",
    ],
    hints: ["6. stol. → 623 → 863 → Bořivoj.", "Bořivoj byl jako poslední."],
    explanation: "Bořivoj byl pravděpodobně pokřtěn žákem Cyrila a Metoděje, přímo na dvoře moravského knížete. Tak se křesťanská víra přenesla z Velké Moravy do Čech a Přemyslovci se stali součástí křesťanské Evropy.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658) – první slovanský stát",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj – hlaholice a staroslověnština",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["623 bylo nejdříve, zánik byl roku 906.", "VM Říše vznikla v 9. stol."],
    explanation: "Staroslověnština se stala základem pro bulharštinu, srbštinu i ruštinu. Zánik Velké Moravy roku 906 ji na Moravě potlačil, ale cyrilice — vycházející z Cyrila práce — se šíří dodnes ve více než 50 jazycích.",
  },
  {
    question: "Seřaď slovanské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – staroslověnština (863)",
      "Bořivoj – první pokřtěný přemyslovský kníže",
    ],
    hints: ["Slované přišli v 6. stol.", "863 byl rok příchodu Cyrila a Metoděje."],
    explanation: "Bořivoj byl prvním přemyslovským knížetem, který přijal křesťanství — kolem roku 874. Tím propojil Čechy s křesťanskou Evropou a dal základ české kulturní identitě na tisíc let dopředu.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik VM Říše – Rastislav, Svätopluk (9. stol.)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik VM Říše – Přemyslovci sjednocují Čechy (906+)",
    ],
    hints: ["623 bylo nejdříve, Přemyslovci přišli po zániku.", "VM Říše vznikla v 9. stol."],
    explanation: "Za Svätopluka (871–894) dosáhla Velkomoravská říše největšího rozsahu. Po jeho smrti se synové hádali o nástupnictví a oslabená říše podlehla nájezdům Maďarů roku 906.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Germáni odcházejí – Slované přicházejí (5.–6. stol.)",
      "Sámova říše (623)",
      "Rastislav zve Cyrila a Metoděje (863)",
      "Zánik VM Říše – Maďaři (906)",
    ],
    hints: ["Germáni odešli nejdříve, zánik byl roku 906.", "863 byl rok příchodu Cyrila a Metoděje."],
    explanation: "Germánské kmeny v 5. a 6. století odcházely na západ za Rýn a Dunaj. Slované obsazovali opuštěná území — ne válečnou expanzí, ale pozvolnou migrací zemědělských komunit.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623)",
      "VM Říše – kníže Svätopluk (9. stol.)",
      "Zánik VM Říše (906)",
    ],
    hints: ["6. stol. → 623 → Svätopluk → zánik 906.", "Svätopluk vládl v 9. stol."],
    explanation: "Svätopluk byl posledním velkým panovníkem Velké Moravy. Po jeho smrti roku 894 se třem synům nepodařilo udržet říši pohromadě — a Maďaři toho využili.",
  },
  {
    question: "Seřaď slovanské události chronologicky.",
    correctAnswer: "order",
    items: [
      "Sámova říše (623–658)",
      "Vznik VM Říše (9. stol.)",
      "Cyril a Metoděj – hlaholice a křesťanství (863)",
      "Zánik VM Říše (906) – nástup Přemyslovců",
    ],
    hints: ["623 → VM Říše → 863 → zánik 906.", "Zánik byl roku 906."],
    explanation: "Křesťanství přinesené Cyrilem a Metodějem přežilo zánik Velké Moravy. Žáci věrozvěstů pokračovali v jejich díle v Bulharsku, Srbsku i Čechách — duchovní odkaz roku 863 žije dodnes.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů",
      "Slované přicházejí do střední Evropy",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["Zánik Říma byl nejdříve.", "863 byl rok hlaholice."],
    explanation: "Stěhování národů bylo největší migrací v raně středověké Evropě. Slované se rozlili po obrovském území — od Baltiku po Balkán. Sámova říše a Velká Morava jsou jejich první státní útvary.",
  },
];

function gen(_level: number): PracticeTask[] {
  return shuffle(VSECHNY_TASKY).slice(0, 35);
}

export const SLOVANEVELKOMORAVSKARISECYRILAMETODEJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    title: "Slované, Velkomoravská říše, Cyril a Metoděj",
    studentTitle: "Slované a Morava",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš, jak Slované přišli do Čech a kdo přinesl první slovanské písmo.",
    keywords: ["Slované", "Velkomoravská říše", "Cyril", "Metoděj", "hlaholice", "Rastislav", "Sámova říše"],
    goals: [
      "Popsat příchod Slovanů a způsob jejich života",
      "Vysvětlit vznik a zánik Velkomoravské říše",
      "Znát rok 863 a přínos Cyrila a Metoděje",
      "Vysvětlit hlaholici a staroslověnštinu",
    ],
    boundaries: ["Detailní genealogie panovníků není vyžadována", "Byzantská politika není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Slované přišli v 6. stol. Cyril a Metoděj = 863, hlaholice, staroslověnština. VM Říše zanikla 906.",
      steps: [
        "Sámova říše 623–658 = první slovanský stát",
        "VM Říše 9. stol. = Rastislav, Svätopluk",
        "863: Cyril a Metoděj → hlaholice",
        "906: zánik VM Říše → Přemyslovci sjednotí Čechy",
      ],
      commonMistake: "Žáci si pletou Rastislava a Svätopluka — Rastislav pozval Cyrila a Metoděje, Svätopluk byl jeho nástupce.",
      example: "Rastislav (860–870) pozval Cyrila a Metoděje z Byzance roku 863 → přinesli hlaholici.",
    },
  },
];
