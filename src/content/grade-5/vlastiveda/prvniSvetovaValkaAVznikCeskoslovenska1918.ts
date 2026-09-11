import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { chronologie, type Udalost } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni jen deset pevných řad. Teď se skládají z banky
// ověřených událostí: L1 tři s datem, L2 čtyři s datem, L3 čtyři bez data.

const UDALOSTI: Udalost[] = [
  { uroven: 1, co: "Atentát na následníka trůnu Františka Ferdinanda d’Este v Sarajevu", kdy: "28. 6. 1914", klic: 1914.0628,
    proc: "Následník rakouského trůnu byl zastřelen; Rakousko-Uhersko pak obvinilo Srbsko." },
  { uroven: 1, co: "Rakousko-Uhersko vyhlásilo válku Srbsku — začala 1. světová válka", kdy: "28. 7. 1914", klic: 1914.0728,
    proc: "Válka začala přesně měsíc po atentátu v Sarajevu." },
  { uroven: 1, co: "T. G. Masaryk odešel do ciziny bojovat za samostatný stát", kdy: "prosinec 1914", klic: 1914.1218,
    proc: "Z ciziny přesvědčoval vítězné mocnosti, že Češi a Slováci chtějí vlastní stát." },
  { uroven: 1, co: "Vznik samostatného Československa", kdy: "28. 10. 1918", klic: 1918.1028,
    proc: "V Praze byl vyhlášen samostatný stát; proto je 28. října státní svátek." },
  { uroven: 1, co: "Příměří — konec 1. světové války", kdy: "11. 11. 1918", klic: 1918.1111,
    proc: "Německo podepsalo příměří necelé dva týdny po vzniku Československa." },
  { uroven: 1, co: "Masaryk se vrátil do Prahy jako prezident", kdy: "21. 12. 1918", klic: 1918.1221,
    proc: "Prezidentem byl zvolen ještě v cizině, do Prahy dorazil až před Vánoci." },

  { uroven: 2, co: "Vznikla Československá národní rada v Paříži", kdy: "1916", klic: 1916.02,
    proc: "Masaryk, Edvard Beneš a Milan Rastislav Štefánik v ní řídili odboj v cizině." },
  { uroven: 2, co: "Zemřel císař František Josef I.", kdy: "21. 11. 1916", klic: 1916.1121,
    proc: "Po 68 letech vlády ho vystřídal poslední rakouský císař Karel I." },
  { uroven: 2, co: "Bitva u Zborova", kdy: "2. 7. 1917", klic: 1917.0702,
    proc: "Českoslovenští legionáři v Rusku v ní vybojovali slavné vítězství." },
  { uroven: 2, co: "Washingtonská deklarace nezávislosti", kdy: "18. 10. 1918", klic: 1918.1018,
    proc: "Masaryk v USA vyhlásil nezávislost Čechů a Slováků deset dní před 28. říjnem." },
  { uroven: 2, co: "Martinská deklarace — Slováci se připojili ke společnému státu", kdy: "30. 10. 1918", klic: 1918.1030,
    proc: "Slovenští politici se v Martině přihlásili k Československu dva dny po vyhlášení v Praze." },
  { uroven: 2, co: "Masaryk zvolen prvním prezidentem", kdy: "14. 11. 1918", klic: 1918.1114,
    proc: "Prezidenta zvolilo Národní shromáždění, když byl Masaryk ještě v USA." },

  { uroven: 3, co: "Itálie vstoupila do války proti Rakousku-Uhersku", kdy: "květen 1915", klic: 1915.0523,
    proc: "Itálie přešla na stranu Dohody a v Alpách vznikla nová fronta." },
  { uroven: 3, co: "V Rusku padl car", kdy: "březen 1917", klic: 1917.03,
    proc: "Revoluce svrhla cara; Rusko pak z války vystoupilo." },
  { uroven: 3, co: "Do války vstoupily Spojené státy americké", kdy: "duben 1917", klic: 1917.0406,
    proc: "Vstup USA dal Dohodě převahu nad Německem a Rakouskem-Uherskem." },
  { uroven: 3, co: "Milan Rastislav Štefánik zahynul při letecké havárii", kdy: "4. 5. 1919", klic: 1919.0504,
    proc: "Zahynul při návratu do vlasti, necelý rok po vzniku státu." },
  { uroven: 3, co: "Versailleská mírová smlouva s Německem", kdy: "28. 6. 1919", klic: 1919.0628,
    proc: "Mírová konference v Paříži potvrdila nové státy a hranice ve střední Evropě." },
  { uroven: 3, co: "Přijata první československá ústava", kdy: "29. 2. 1920", klic: 1920.0229,
    proc: "Ústava zakotvila Československo jako demokratickou republiku." },
];

function gen(level: number): PracticeTask[] {
  return chronologie(UDALOSTI, level, "z let 1914–1920");
}

export const PRVNISVETOVAVALKAAVZNIKCESKOSLOVENSKA1918: TopicMetadata[] = [
  {
    id: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    rvpNodeId: "g5-vlastiveda-lide-a-cas-20-stoleti-od-t-g-masaryka-po-dnesek-prvni-svetova-valka-a-vznik-ceskoslovenska-1918",
    title: "První světová válka a vznik Československa 1918",
    studentTitle: "1. světová válka",
    subject: "vlastivěda",
    category: "Lidé a čas",
    topic: "20. století - od T. G. Masaryka po dnešek",
    briefDescription: "Pochopíš vznik Československa po první světové válce.",
    keywords: ["první světová válka", "masaryk", "československo", "28. října", "legionáři", "beneš"],
    goals: [
      "Žák uvede příčiny a výsledek první světové války",
      "Žák vysvětlí roli Masaryka při vzniku ČSR",
      "Žák zná datum 28. října 1918 a jeho význam",
    ],
    boundaries: ["Vojenská taktika jednotlivých bitev", "Detailní mírové smlouvy"],
    gradeRange: [5, 5],
    inputType: "drag_order",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Klíčové datum: 28. října 1918 — vznik Československa.",
      steps: [
        "1914: atentát v Sarajevu → začátek 1. světové války",
        "Dohoda vs. Trojspolek",
        "Masaryk v emigraci bojuje za ČSR",
        "28. října 1918: vznik Československa",
        "TGM = 1. prezident",
      ],
      commonMistake: "Zaměňování roku začátku (1914) a konce (1918) války.",
      example: "Legionáři bojovali za Dohodu a pomohli přesvědčit mocnosti, aby ČSR uznaly.",
    },
  },
];
