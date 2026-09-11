import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { posilNapovedy } from "../_shared";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────
// Disjunktní pooly obtížnosti (L1 < L2 < L3), drag_order chronologie.
//   L1 = rozpoznání: 3 velké mezníky s velkým rozestupem (Slované → Sámo → Velká Morava)
//   L2 = aplikace:   4 události se stoletím (zánik Říma 5. → Slované 6. → 623 → 863)
//   L3 = transfer:   5 událostí; těsná sekvence 9. stol. (863 → 883 → 906) uvnitř
//                    existence Velké Moravy vyžaduje rozlišení dějů v jednom století
// `items` jsou ve SPRÁVNÉM chronologickém pořadí (UI je zamíchá).
// ─────────────────────────────────────────────────────────

const POOL_L1: PracticeTask[] = [
  {
    question: "Seřaď slovanské státy a mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů (6. stol.)", "Sámova říše (7. stol.)", "Velkomoravská říše (9. stol.)"],
    hints: ["Slované přišli nejdříve — v 6. století.", "Velká Morava je z 9. století, nejpozdější."],
    explanation: "Slované přišli do střední Evropy v 6. století. V 7. století je Sámo sjednotil v první slovanský stát. V 9. století vznikla mocná Velkomoravská říše.",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů (6. stol.)", "Cyril a Metoděj na Moravě (863)", "Zánik Velké Moravy (906)"],
    hints: ["Která událost je udaná jen stoletím? Převeď ho na roky.", "Velká Morava zanikla roku 906 — nejpozději."],
    explanation: "Slované přišli v 6. století. Roku 863 přišli na Moravu Cyril a Metoděj s hlaholicí. Roku 906 Velkomoravská říše zanikla.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Sámova říše (623)", "Cyril a Metoděj (863)", "Zánik Velké Moravy (906)"],
    hints: ["Sámova říše (623) byla nejdříve.", "Velká Morava zanikla roku 906."],
    explanation: "Sámo vytvořil první slovanský stát roku 623. Roku 863 přišli Cyril a Metoděj. Roku 906 Velkomoravská říše zanikla.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů (6. stol.)", "Sámova říše (623)", "Cyril a Metoděj (863)"],
    hints: ["Šesté století jsou roky 501 až 600. Je to před rokem 623, nebo po něm?", "Cyril a Metoděj přišli až roku 863."],
    explanation: "Slované přišli v 6. století. Roku 623 je Sámo sjednotil v první stát. Roku 863 přinesli Cyril a Metoděj slovanské písmo.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Zánik Říma (5. stol.)", "Příchod Slovanů (6. stol.)", "Velkomoravská říše (9. stol.)"],
    hints: ["Zánik Říma byl jako první — v 5. století.", "Velká Morava je z 9. století."],
    explanation: "Zánik Říma v 5. století spustil stěhování národů. V 6. století přišli Slované. V 9. století vznikla Velkomoravská říše.",
  },
  {
    question: "Seřaď slovanské státy od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů (6. stol.)", "Sámova říše (623–658)", "Velkomoravská říše (9. stol.)"],
    hints: ["Slované přišli nejdříve.", "Velká Morava (9. stol.) je nejpozdější."],
    explanation: "Slované přišli v 6. století. Roku 623 vznikla Sámova říše — první slovanský stát. V 9. století ji vystřídala mocná Velkomoravská říše.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Cyril a Metoděj (863)", "Bořivoj pokřtěn na moravském dvoře", "Zánik Velké Moravy (906)"],
    hints: ["Cyril a Metoděj přišli roku 863 — nejdříve.", "Velká Morava zanikla roku 906."],
    explanation: "Cyril a Metoděj přišli roku 863. Krátce poté přijal na velkomoravském dvoře křest Bořivoj, první křesťanský kníže v Čechách. Roku 906 Velká Morava zanikla.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Zánik Říma (5. stol.)", "Příchod Slovanů (6. stol.)", "Sámova říše (7. stol.)"],
    hints: ["Zánik Říma byl nejdříve.", "Sámova říše je ze 7. století."],
    explanation: "Zánik Říma v 5. století uvolnil střed Evropy. V 6. století přišli Slované. V 7. století je Sámo sjednotil v první slovanský stát.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Příchod Slovanů (6. stol.)", "Velkomoravská říše (9. stol.)", "Zánik Velké Moravy (906)"],
    hints: ["Dvě události jsou z Velké Moravy. Co musí přijít dřív — vznik, nebo zánik?", "Zánik (906) je konec Velké Moravy."],
    explanation: "Slované přišli v 6. století. V 9. století vznikla Velkomoravská říše. Roku 906 zanikla nájezdy kočovných Maďarů.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Sámova říše (623)", "Velkomoravská říše (9. stol.)", "Zánik Velké Moravy (906)"],
    hints: ["Sámova říše (623) byla nejdříve.", "Velká Morava zanikla roku 906."],
    explanation: "Sámo vytvořil první slovanský stát roku 623. V 9. století vznikla Velkomoravská říše, která roku 906 zanikla.",
  },
];

const POOL_L2: PracticeTask[] = [
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše – první slovanský stát (623–658)",
      "Cyril a Metoděj přišli na Moravu (863)",
      "Zánik Velkomoravské říše (906)",
    ],
    hints: ["Porovnej letopočty; u století si vzpomeň, že 6. století jsou roky 501 až 600.", "Cyril a Metoděj (863) přišli před zánikem Velké Moravy (906)."],
    explanation: "Slované přišli bez vlastního státu. Sámo je roku 623 sjednotil v první říši. Cyril a Metoděj roku 863 přinesli hlaholici. Velká Morava zanikla roku 906 nájezdy Maďarů.",
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
    hints: ["Zánik Říma byl nejdříve.", "Sámova říše (7. stol.) je před Velkou Moravou (9. stol.)."],
    explanation: "Po zániku Říma Germáni opustili střed Evropy a Slované obsadili jejich místo. Postupně se organizovali — od kmenů k Sámově říši a nakonec k mocné Velkomoravské říši.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů (5. stol.)",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Sámova říše (623–658)",
      "Cyril a Metoděj – hlaholice (863)",
    ],
    hints: ["Zánik Říma byl jako první.", "Sámova říše (623) je před příchodem Cyrila a Metoděje (863)."],
    explanation: "Zánik Říma v 5. století spustil stěhování národů, které přivedlo Slovany do střední Evropy. Sámo je sjednotil roku 623. Teprve Cyril a Metoděj roku 863 přinesli první slovanské písmo.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.) – stěhování národů",
      "Slované přicházejí do střední Evropy (6. stol.)",
      "Cyril a Metoděj (863)",
      "Bořivoj – pokřtěn na velkomoravském dvoře",
    ],
    hints: ["Zánik Říma byl první, Bořivoj poslední.", "Bořivoj se dal pokřtít až po příchodu Cyrila a Metoděje (863)."],
    explanation: "Stěhování národů otevřelo střed Evropy Slovanům. Cyril a Metoděj přinesli roku 863 křesťanství i písmo. Na velkomoravském dvoře pak přijal křest Bořivoj — první křesťanský kníže v Čechách.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Najdi dvojici událostí z 9. a 10. století a rozhodni, která byla dřív.", "Cyril a Metoděj (863) přišli před zánikem (906)."],
    explanation: "Slované přišli v 6. století, Sámo je sjednotil roku 623, Cyril a Metoděj přinesli písmo roku 863 a Velká Morava zanikla roku 906.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Velkomoravská říše (9. stol.)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Zánik Říma byl nejdříve.", "Velká Morava vznikla v 9. stol. a roku 906 zanikla."],
    explanation: "Zánik Říma (5. stol.) uvolnil střed Evropy. Slované přišli v 6. století. V 9. století vznikla Velkomoravská říše, která roku 906 zanikla.",
  },
  {
    question: "Seřaď slovanské události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623–658)",
      "Velkomoravská říše (9. stol.)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Dva státy jsou slovanské. Který vznikl dřív — Sámova říše, nebo Velká Morava?", "Sámova říše je před Velkou Moravou."],
    explanation: "Slované přišli v 6. století. Sámo vytvořil první stát (623–658). V 9. století vznikla Velkomoravská říše, která roku 906 zanikla.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Zánik Říma byl nejdříve.", "Cyril a Metoděj (863) přišli před zánikem Velké Moravy (906)."],
    explanation: "Zánik Říma (5. stol.), Sámova říše (623), příchod Cyrila a Metoděje (863) a zánik Velké Moravy (906) — čtyři mezníky raných slovanských dějin.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (7. stol.)",
      "Cyril a Metoděj (863)",
    ],
    hints: ["Zánik Říma byl jako první.", "Sámova říše (7. stol.) je před Cyrilem a Metodějem (863)."],
    explanation: "Zánik Říma spustil stěhování národů. Slované přišli v 6. století, Sámo je sjednotil v 7. století. Roku 863 přinesli Cyril a Metoděj slovanské písmo.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj – hlaholice (863)",
      "Bořivoj pokřtěn na moravském dvoře",
    ],
    hints: ["Bořivoj nemá letopočet. Pokřtil se před příchodem věrozvěstů, nebo po něm?", "Bořivoj se dal pokřtít až po příchodu Cyrila a Metoděje (863)."],
    explanation: "Slované přišli v 6. století, Sámo je sjednotil roku 623. Cyril a Metoděj přinesli roku 863 hlaholici. Krátce poté přijal na Moravě křest kníže Bořivoj.",
  },
];

const POOL_L3: PracticeTask[] = [
  {
    question: "Seřaď události 9. století a okolí od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Bořivoj pokřtěn na moravském dvoře (asi 883)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Pozor na těsný konec: 863 → 883 → 906, vše v době Velké Moravy.", "Bořivoj se dal pokřtít až po příchodu Cyrila a Metoděje."],
    explanation: "Slované (6. stol.), Sámo (623). V době Velké Moravy jdou tři děje těsně za sebou: příchod Cyrila a Metoděje (863), křest Bořivoje (asi 883) a zánik říše (906).",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Začátek je jasný podle století.", "Konec pozor: Cyril a Metoděj (863) jsou před zánikem (906), oba v 9. stol."],
    explanation: "Zánik Říma (5. stol.), Slované (6. stol.), Sámova říše (623). V 9. století pak příchod Cyrila a Metoděje (863) a zánik Velké Moravy (906) — dva děje v jednom století je třeba rozlišit.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Bořivoj pokřtěn (asi 883)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Sámova říše (623) je uprostřed.", "Bořivoj (asi 883) se dal pokřtít před zánikem Velké Moravy (906)."],
    explanation: "Zánik Říma (5. stol.), Slované (6. stol.), Sámova říše (623). Bořivoj přijal křest asi roku 883, tedy v době Velké Moravy, která zanikla roku 906.",
  },
  {
    question: "Seřaď mezníky raných dějin od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Bořivoj pokřtěn (asi 883)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Slované a Sámo tvoří starší část.", "Těsná řada: 863 → 883 → 906 vyžaduje přesnost."],
    explanation: "Slované (6. stol.), Sámo (623). Vrchol Velké Moravy tvoří tři těsné děje: Cyril a Metoděj (863), křest Bořivoje (asi 883) a zánik říše (906).",
  },
  {
    question: "Seřaď události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma – stěhování národů (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623–658)",
      "Velkomoravská říše vzniká (9. stol.)",
      "Cyril a Metoděj (863)",
    ],
    hints: ["Velká Morava vznikla na počátku 9. stol., Cyril a Metoděj přišli roku 863.", "Cyril a Metoděj přišli až do už existující Velké Moravy."],
    explanation: "Zánik Říma (5. stol.), Slované (6. stol.), Sámova říše (623–658). Velkomoravská říše vznikla na počátku 9. století a Cyril a Metoděj do ní přišli roku 863.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Bořivoj pokřtěn (asi 883)",
    ],
    hints: ["Začátek podle století.", "Bořivoj (asi 883) se dal pokřtít až po Cyrilu a Metoději (863)."],
    explanation: "Zánik Říma (5. stol.), Slované (6. stol.), Sámova říše (623). Cyril a Metoděj přišli roku 863 a krátce poté, asi roku 883, přijal křest kníže Bořivoj.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Velkomoravská říše (9. stol.)",
      "Cyril a Metoděj (863)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Velká Morava existovala už před příchodem Cyrila a Metoděje (863).", "Zánik (906) je úplný konec."],
    explanation: "Slované (6. stol.), Sámo (623). Velkomoravská říše vznikla na počátku 9. století, Cyril a Metoděj do ní přišli roku 863 a roku 906 říše zanikla.",
  },
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj – hlaholice (863)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["První tři podle století a roku.", "Cyril a Metoděj (863) i zánik (906) jsou v 9. století — rozliš je."],
    explanation: "Zánik Říma (5. stol.), Slované (6. stol.), Sámova říše (623). Cyril a Metoděj přinesli hlaholici roku 863 a Velká Morava zanikla roku 906 — obě události 9. století je třeba přesně seřadit.",
  },
  {
    question: "Seřaď od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: [
      "Slované přicházejí (6. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Bořivoj pokřtěn (asi 883)",
      "Bořivoj přenáší křesťanství do Čech",
    ],
    hints: ["Bořivoj se nejdřív dal pokřtít, pak křesťanství přinesl domů.", "Vše po roce 863, kdy přišli Cyril a Metoděj."],
    explanation: "Slované (6. stol.), Sámo (623), Cyril a Metoděj (863). Bořivoj přijal na Moravě křest (asi 883) a poté přenesl křesťanství do Čech jako první křesťanský kníže.",
  },
  {
    question: "Seřaď slovanské mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: [
      "Zánik Říma (5. stol.)",
      "Sámova říše (623)",
      "Cyril a Metoděj (863)",
      "Bořivoj pokřtěn (asi 883)",
      "Zánik Velké Moravy (906)",
    ],
    hints: ["Zánik Říma a Sámo tvoří starší část.", "Konec pozor: 863 → 883 → 906 jdou blízko po sobě."],
    explanation: "Zánik Říma (5. stol.), Sámova říše (623). Tři děje 9. století jdou těsně za sebou: Cyril a Metoděj (863), křest Bořivoje (asi 883) a zánik Velké Moravy (906).",
  },
];

// Doplněno 2026-09-11: pravidla chtějí aspoň 12 různých úloh na úroveň.
const EXTRA_L1: PracticeTask[] = [
  {
    question: "Seřaď události Velké Moravy od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Sámova říše (623)","Cyril a Metoděj přišli na Moravu (863)","Bořivoj pokřtěn (asi 883)"],
    hints: ["Porovnej letopočty v závorkách.", "Sámova říše je ze 7. století, zbylé dvě události z 9. století. U nich rozhodne, který rok je menší."],
    explanation: "Sámova říše vznikla roku 623. Cyril a Metoděj přišli na Moravu roku 863 a asi o dvacet let později se na moravském dvoře dal pokřtít český kníže Bořivoj.",
  },
  {
    question: "Seřaď od nejstarší události po nejnovější.",
    correctAnswer: "order",
    items: ["Slované přicházejí (6. stol.)","Sámova říše (623)","Zánik Velké Moravy (906)"],
    hints: ["Kterou z událostí určuje jen století, a ne přesný rok?", "Šesté století jsou roky 501 až 600 — tedy před rokem 623. Velká Morava zanikla až na počátku 10. století."],
    explanation: "Slované přišli do našich zemí v 6. století. Roku 623 vznikla Sámova říše, první známý slovanský stát. Velká Morava zanikla kolem roku 906.",
  },
];
const EXTRA_L2: PracticeTask[] = [
  {
    question: "Seřaď mezníky raných slovanských dějin od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Slované přicházejí (6. stol.)","Sámova říše (623)","Velkomoravská říše vzniká (kolem 833)","Bořivoj pokřtěn (asi 883)"],
    hints: ["Nejdřív urči, co se stalo v 6. a v 7. století.", "Velká Morava vznikla kolem roku 833 a Bořivoj se dal pokřtít o padesát let později, když už tam působil Metoděj."],
    explanation: "Slované přišli v 6. století, Sámova říše vznikla roku 623, Velkomoravská říše kolem roku 833 a kníže Bořivoj se dal pokřtít asi roku 883.",
  },
  {
    question: "Seřaď slovanské státy a události od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Zánik Říma (5. stol.)","Sámova říše (623)","Velkomoravská říše vzniká (kolem 833)","Cyril a Metoděj (863)"],
    hints: ["Která událost se stala ještě před příchodem Slovanů?", "Řím zanikl v 5. století. Cyril a Metoděj přišli do už existující Velké Moravy, tedy až po jejím vzniku."],
    explanation: "Západořímská říše zanikla v 5. století. Roku 623 vznikla Sámova říše, kolem roku 833 Velká Morava a roku 863 do ní přišli Cyril a Metoděj.",
  },
];
const EXTRA_L3: PracticeTask[] = [
  {
    question: "Seřaď mezníky od nejstaršího po nejnovější.",
    correctAnswer: "order",
    items: ["Zánik Říma (5. stol.)","Sámova říše (623)","Velkomoravská říše vzniká (kolem 833)","Cyril a Metoděj (863)","Zánik Velké Moravy (906)"],
    hints: ["Tři události se týkají Velké Moravy. Která z nich musí být první?", "Nejdřív musela Velká Morava vzniknout (kolem 833), pak do ní přišli věrozvěsti (863) a nakonec zanikla (906). Před tím vším byl Řím a Sámova říše."],
    explanation: "Řím zanikl v 5. století, Sámova říše vznikla roku 623. Velká Morava vznikla kolem roku 833, roku 863 přišli Cyril a Metoděj a kolem roku 906 říše zanikla.",
  },
  {
    question: "Seřaď události 9. století a jejich předehru od nejstarší po nejnovější.",
    correctAnswer: "order",
    items: ["Slované přicházejí (6. stol.)","Velkomoravská říše vzniká (kolem 833)","Cyril a Metoděj (863)","Bořivoj pokřtěn (asi 883)","Zánik Velké Moravy (906)"],
    hints: ["Čtyři události jsou z 9. a 10. století. Seřaď je podle přesných roků.", "Pořadí v 9. století: nejdřív vznik říše, pak příchod věrozvěstů, po dvaceti letech Bořivojův křest a nakonec zánik na počátku 10. století."],
    explanation: "Slované přišli v 6. století. Velká Morava vznikla kolem roku 833, Cyril a Metoděj přišli roku 863, Bořivoj se dal pokřtít asi roku 883 a říše zanikla kolem roku 906.",
  },
];

const DOPLNEK: Record<number, string> = {
  "1": "Letopočet v závorce ti napoví: čím menší číslo, tím dřív se to stalo. Století přečti jako stovky let.",
  "2": "Když je v závorce století, převeď ho na roky: 6. století jsou roky 501 až 600, takže je dřív než rok 623.",
  "3": "Několik událostí z 9. století jde těsně po sobě — rozhodují přesné roky, ne století."
};

const [P1, P2, P3] = posilNapovedy(
  [[...POOL_L1, ...EXTRA_L1], [...POOL_L2, ...EXTRA_L2], [...POOL_L3, ...EXTRA_L3]],
  DOPLNEK,
);

function gen(level: number): PracticeTask[] {
  const pool = level >= 3 ? P3 : level === 2 ? P2 : P1;
  return shuffle(pool);
}

export const SLOVANEVELKOMORAVSKARISECYRILAMETODEJ: TopicMetadata[] = [
  {
    id: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    rvpNodeId: "g4-vlastiveda-lide-a-cas-nejstarsi-dejiny-ceskych-zemi-slovane-velkomoravska-rise-cyril-a-metodej",
    title: "Slované, Velkomoravská říše, Cyril a Metoděj",
    studentTitle: "Slované a Velká Morava",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "Lidé a čas",
    briefDescription: "Poznáš první Slovany u nás: Sámovu říši, Velkou Moravu, Cyrila a Metoděje.",
    keywords: ["Slované", "Sámova říše", "Velká Morava", "Cyril a Metoděj", "hlaholice", "Bořivoj", "906"],
    goals: [
      "Vědět, kdy přišli Slované do střední Evropy",
      "Znát Sámovu říši a Velkou Moravu",
      "Znát přínos Cyrila a Metoděje (863, hlaholice)",
      "Vědět, kdy Velká Morava zanikla",
    ],
    boundaries: ["Přesné datování raného středověku není povinné", "Detailní politika není cílem"],
    gradeRange: [4, 4],
    inputType: "drag_order",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Slované (6. stol.) → Sámova říše (623) → Velká Morava (9. stol.) → Cyril a Metoděj (863) → Bořivoj (asi 883) → zánik (906).",
      steps: [
        "Slované přišli v 6. století",
        "Sámova říše = první slovanský stát (623)",
        "Cyril a Metoděj = hlaholice, 863",
        "Velká Morava zanikla roku 906 (nájezdy Maďarů)",
      ],
      commonMistake: "Žáci si pletou pořadí dějů 9. století: Cyril a Metoděj (863), křest Bořivoje (asi 883) a zánik Velké Moravy (906).",
      example: "Slované 6. stol. → Sámo 623 → Cyril a Metoděj 863 → Bořivoj 883 → zánik 906.",
    },
  },
];
