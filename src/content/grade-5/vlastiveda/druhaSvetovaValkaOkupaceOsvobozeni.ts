import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení, zadání neodpovídala položkám („obsazení ČSR, konec války…“
// s jinými událostmi uvnitř), první úloha L1 měla položky ve špatném pořadí
// (osvobození Prahy 9. 5. před koncem války 8. 5.) a L3 obsahovala sporné
// „obnovení demokratické ČSR volbami 1946“. Teď se úlohy skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Mnichovská dohoda — pohraničí připadlo Německu", kdy: "září 1938", klic: 1938.0930,
    proc: "V Mnichově se Německo, Itálie, Británie a Francie bez Československa dohodly, že pohraničí musí připadnout Německu." },
  { uroven: 1, co: "Vznik Protektorátu Čechy a Morava", kdy: "15. 3. 1939", klic: 1939.0315,
    proc: "Hitler obsadil zbytek Čech a Moravy ještě před začátkem světové války." },
  { uroven: 1, co: "Německo napadlo Polsko — začala 2. světová válka", kdy: "1. 9. 1939", klic: 1939.0901,
    proc: "Po útoku na Polsko vyhlásily Británie a Francie Německu válku." },
  { uroven: 1, co: "Atentát na Reinharda Heydricha", kdy: "27. 5. 1942", klic: 1942.0527,
    proc: "Parašutisté Jozef Gabčík a Jan Kubiš zaútočili v Praze na nejmocnějšího nacistu v protektorátu." },
  { uroven: 1, co: "Vypálení Lidic", kdy: "10. 6. 1942", klic: 1942.0610,
    proc: "Nacisté se za atentát mstili: Lidice srovnali se zemí, muže postříleli, ženy a děti odvlekli." },
  { uroven: 1, co: "Kapitulace Německa — konec války v Evropě", kdy: "8. 5. 1945", klic: 1945.0508,
    proc: "Německo podepsalo bezpodmínečnou kapitulaci; proto 8. května slavíme Den vítězství." },

  { uroven: 2, co: "Heydrich přijel do Prahy jako zastupující říšský protektor", kdy: "září 1941", klic: 1941.0927,
    proc: "Heydrich hned vyhlásil stanné právo a tvrdě pronásledoval odboj." },
  { uroven: 2, co: "První transport Židů do terezínského ghetta", kdy: "listopad 1941", klic: 1941.1124,
    proc: "Nacisté soustředili Židy z protektorátu v Terezíně a odtud je odváželi do vyhlazovacích táborů." },
  { uroven: 2, co: "Parašutisté Gabčík a Kubiš seskočili u Prahy", kdy: "prosinec 1941", klic: 1941.1228,
    proc: "Výsadek připravila československá vláda v Londýně; na atentát se parašutisté chystali ještě pět měsíců." },
  { uroven: 2, co: "Vypálení osady Ležáky", kdy: "24. 6. 1942", klic: 1942.0624,
    proc: "Dva týdny po Lidicích zničili nacisté i Ležáky, kde se ukrývala vysílačka parašutistů." },
  { uroven: 2, co: "Pražské povstání", kdy: "5. 5. 1945", klic: 1945.0505,
    proc: "Pražané povstali proti okupantům tři dny před koncem války." },
  { uroven: 2, co: "Americká armáda osvobodila Plzeň", kdy: "6. 5. 1945", klic: 1945.0506,
    proc: "Západ Čech osvobodila americká armáda generála Pattona." },
  { uroven: 2, co: "Rudá armáda vstoupila do Prahy", kdy: "9. 5. 1945", klic: 1945.0509,
    proc: "Sovětská vojska dorazila do Prahy den po kapitulaci Německa." },

  { uroven: 3, co: "Německo napadlo Sovětský svaz", kdy: "22. 6. 1941", klic: 1941.0622,
    proc: "Útokem na Sovětský svaz se válka rozšířila na východ a SSSR se přidal ke spojencům." },
  { uroven: 3, co: "Japonsko zaútočilo na Pearl Harbor a do války vstoupily USA", kdy: "prosinec 1941", klic: 1941.1207,
    proc: "Po japonském útoku na americkou námořní základnu vstoupily Spojené státy do války." },
  { uroven: 3, co: "Němci byli poraženi u Stalingradu", kdy: "únor 1943", klic: 1943.0202,
    proc: "Po porážce u Stalingradu začala německá armáda na východě ustupovat." },
  { uroven: 3, co: "Spojenci se vylodili v Normandii", kdy: "6. 6. 1944", klic: 1944.0606,
    proc: "Vyloděním ve Francii otevřeli spojenci druhou frontu na západě Evropy." },
  { uroven: 3, co: "Slovenské národní povstání", kdy: "29. 8. 1944", klic: 1944.0829,
    proc: "Slováci povstali proti fašistickému režimu a německé armádě ještě během války." },
  { uroven: 3, co: "Rudá armáda osvobodila tábor Osvětim", kdy: "27. 1. 1945", klic: 1945.0127,
    proc: "Osvětim byl největší nacistický vyhlazovací tábor; osvobodili ho sovětští vojáci několik měsíců před koncem války." },
  { uroven: 3, co: "Vysídlení většiny Němců z Československa", kdy: "1945–1946", klic: 1945.9,
    proc: "Po válce byla většina Němců z Československa vysídlena; vítězné mocnosti to schválily v Postupimi." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z let 1938–1946");
}

export const DRUHASVETOVAVALKAOKUPACEOSVOBOZENI: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-druha-svetova-valka-okupace-osvobozeni",
    title: "Druhá světová válka, okupace, osvobození",
    studentTitle: "2. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Poznáš, co zažily Čechy za nacistické okupace.",
    keywords: ["druhá světová válka", "protektorát", "heydrich", "lidice", "holocaust", "terezín", "osvobození"],
    goals: [
      "Žák vysvětlí vznik a podstatu Protektorátu Čechy a Morava",
      "Žák popíše holocaust a roli Terezína",
      "Žák uvede, kdo a kdy osvobodil ČSR",
    ],
    boundaries: ["Detailní vojenské operace", "Celá geografie druhé světové války"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčová data: 15. 3. 1939 (Protektorát), 1942 (Heydrich + Lidice), 8. 5. 1945 (konec války).",
      steps: [
        "15. 3. 1939: nacistická okupace — Protektorát",
        "1942: atentát na Heydricha → Lidice a Ležáky",
        "Holocaust: Terezín → deportace → 6 mil. obětí",
        "8. 5. 1945: konec války; západ = Američané, východ = Sověti",
        "Odsun sudetských Němců po 1945",
      ],
      commonMistake: "Zaměňování protektorátu (1939) se začátkem světové války (1939) — protektorát byl o 6 měsíců dříve.",
      example: "Lidice byly vypáleny jako odplata za atentát na Heydricha v červnu 1942.",
    },
  },
];
