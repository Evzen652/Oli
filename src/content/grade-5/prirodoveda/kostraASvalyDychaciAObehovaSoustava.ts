import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni se opakovalo jen pár pevných sad. Teď banka dvojic
// „orgán → k čemu slouží“: L1 kosti a hlavní orgány, L2 cévy a dýchací
// cesty, L3 krev a oba krevní oběhy.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "lebka", pravy: "chrání mozek",
    proc: "Lebka je pevná kostěná schránka kolem mozku." },
  { uroven: 1, levy: "žebra", pravy: "chrání srdce a plíce",
    proc: "Žebra tvoří s hrudní kostí a páteří hrudní koš." },
  { uroven: 1, levy: "páteř", pravy: "hlavní opora těla, ve které je uložená mícha",
    proc: "Páteř se skládá z obratlů a drží tělo vzpřímené." },
  { uroven: 1, levy: "srdce", pravy: "pumpuje krev do celého těla",
    proc: "Srdce je dutý sval, který se stahuje celý život." },
  { uroven: 1, levy: "plíce", pravy: "párový orgán v hrudníku, kterým dýcháme",
    proc: "Do plic proudí vzduch a krev v nich získává kyslík." },
  { uroven: 1, levy: "krev", pravy: "tekutina, která proudí cévami",
    proc: "Krev rozvádí po těle kyslík a živiny a odnáší odpadní látky." },

  { uroven: 2, levy: "tepny", pravy: "cévy, které vedou krev ze srdce",
    proc: "Tepny mají silné stěny, protože v nich je vysoký tlak." },
  { uroven: 2, levy: "žíly", pravy: "cévy, které vedou krev do srdce",
    proc: "Žíly mají chlopně, které nedovolí krvi téct zpátky." },
  { uroven: 2, levy: "vlásečnice", pravy: "nejtenčí cévy, kde krev předává kyslík buňkám",
    proc: "Vlásečnice jsou tenčí než vlas a prostupují celé tělo." },
  { uroven: 2, levy: "průdušnice", pravy: "trubice, kterou proudí vzduch do plic",
    proc: "Průdušnice se v hrudníku dělí na dvě průdušky." },
  { uroven: 2, levy: "klouby", pravy: "pohyblivá spojení kostí",
    proc: "Díky kloubům můžeme ohnout koleno, loket nebo prsty." },
  { uroven: 2, levy: "šlachy", pravy: "pevné pruhy, které spojují svaly s kostmi",
    proc: "Když se sval stáhne, šlacha zatáhne za kost a ta se pohne." },
  { uroven: 2, levy: "bránice", pravy: "plochý sval pod plícemi, který pomáhá při dýchání",
    proc: "Když se bránice stáhne, plíce se roztáhnou a nasají vzduch." },

  { uroven: 3, levy: "červené krvinky", pravy: "přenášejí kyslík",
    proc: "Obsahují červené barvivo, na které se kyslík naváže." },
  { uroven: 3, levy: "bílé krvinky", pravy: "bojují proti choroboplodným zárodkům",
    proc: "Bílé krvinky jsou součástí obranyschopnosti těla." },
  { uroven: 3, levy: "krevní destičky", pravy: "pomáhají srážet krev při poranění",
    proc: "Díky nim se malá rána sama zacelí strupem." },
  { uroven: 3, levy: "plicní sklípky", pravy: "drobné váčky v plicích, kde se vyměňují plyny",
    proc: "Kyslík z vdechnutého vzduchu v nich přechází do krve a oxid uhličitý z krve ven." },
  { uroven: 3, levy: "malý krevní oběh", pravy: "vede krev ze srdce do plic a zpět",
    proc: "V plicích se krev zbaví oxidu uhličitého a nabere kyslík." },
  { uroven: 3, levy: "velký krevní oběh", pravy: "vede krev ze srdce do celého těla a zpět",
    proc: "Krev jím roznáší kyslík a živiny ke všem orgánům." },
  { uroven: 3, levy: "kostní dřeň", pravy: "měkká tkáň uvnitř kostí, kde vznikají krvinky",
    proc: "Kosti tedy nejen drží tělo, ale i vyrábějí krev." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj část těla s tím, k čemu slouží.");
}

export const KOSTRAASVALYDYCHACIAOBEHOVASOUSTAVA: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-kostra-a-svaly-dychaci-a-obehova-soustava",
    title: "Kostra a svaly, dýchací a oběhová soustava",
    studentTitle: "Kostra a krev",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak funguje kostra, svaly, plíce a srdce.",
    keywords: ["kostra", "svaly", "srdce", "plíce", "krev", "plicní sklípky", "tepny", "žíly", "klouby"],
    goals: ["Popsat funkce kostry a svalů", "Vysvětlit princip dýchání a výměny plynů", "Popsat malý a velký krevní oběh"],
    boundaries: ["Neprobírá biochemii krve", "Neprobírá kardiovaskulární choroby do hloubky"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Kostra: 206 kostí. Dýchání: nos → plíce → plicní sklípky → krev. Srdce: malý (plíce) + velký (tělo) oběh.",
      steps: [
        "Kostra: opora + ochrana + pohyb + krvetvorba.",
        "Dýchání: nos → hrtan → průdušnice → plíce → plicní sklípky.",
        "Plicní sklípky: kyslík do krve, oxid uhličitý ven.",
        "Srdce: malý oběh (plíce), velký oběh (tělo).",
        "Krev: červené krvinky (kyslík), bílé krvinky (obrana), destičky (srážení).",
      ],
      commonMistake: "Tepny vedou krev OD srdce. Žíly vedou krev K srdci.",
      example: "Vdech: bránice dolů → plíce se rozepnou → vzduch dovnitř. Výdech: bránice nahoru → plíce se smrsknou.",
    },
  },
];
