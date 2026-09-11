import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { parovani, type Dvojice } from "../_shared";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy měly jedinou nápovědu bez
// vysvětlení a na úrovni se opakovalo jen pár pevných sad. Teď banka dvojic
// „orgán → co dělá“: L1 hlavní orgány, L2 žlázy a cesta moči, L3 jemnější
// části a vylučování kůží a plícemi.

const DVOJICE: Dvojice[] = [
  { uroven: 1, levy: "zuby", pravy: "rozmělňují potravu",
    proc: "Řezáky potravu ukousnou, stoličky ji rozmělní." },
  { uroven: 1, levy: "jícen", pravy: "trubice, kterou potrava putuje do žaludku",
    proc: "Stěny jícnu posouvají sousto dolů, i když stojíš na hlavě." },
  { uroven: 1, levy: "žaludek", pravy: "vak, kde se potrava mísí se žaludeční šťávou",
    proc: "Žaludeční šťáva je kyselá a ničí i choroboplodné zárodky." },
  { uroven: 1, levy: "tenké střevo", pravy: "místo, kde se živiny vstřebávají do krve",
    proc: "Tenké střevo je dlouhé několik metrů." },
  { uroven: 1, levy: "ledviny", pravy: "čistí krev a tvoří moč",
    proc: "Máme dvě ledviny v zadní části břicha." },
  { uroven: 1, levy: "močový měchýř", pravy: "shromažďuje moč",
    proc: "Když se naplní, cítíme potřebu jít na záchod." },

  { uroven: 2, levy: "tlusté střevo", pravy: "vstřebává se v něm voda ze zbytků potravy",
    proc: "Ze zbytků potravy tu vzniká stolice." },
  { uroven: 2, levy: "játra", pravy: "největší žláza v těle, která odbourává jedy",
    proc: "Játra zpracovávají živiny, odbourávají škodlivé látky a tvoří žluč." },
  { uroven: 2, levy: "slinivka břišní", pravy: "žláza, která tvoří trávicí šťávy a inzulín",
    proc: "Inzulín pomáhá buňkám využít cukr z krve." },
  { uroven: 2, levy: "sliny", pravy: "začínají trávit potravu už v ústech",
    proc: "Sliny sousto zvlhčí a začnou rozkládat škrob." },
  { uroven: 2, levy: "žlučník", pravy: "váček, ve kterém se uchovává žluč",
    proc: "Žlučník vypustí žluč do střeva, když jíme." },
  { uroven: 2, levy: "močovody", pravy: "trubice, které vedou moč z ledvin do měchýře",
    proc: "Z každé ledviny vede jeden močovod." },

  { uroven: 3, levy: "klky", pravy: "výběžky tenkého střeva, které zvětšují plochu pro vstřebávání",
    proc: "Díky klkům má tenké střevo obrovskou vnitřní plochu." },
  { uroven: 3, levy: "žluč", pravy: "pomáhá trávit tuky",
    proc: "Žluč rozdělí tuk na drobné kapičky, které se lépe tráví." },
  { uroven: 3, levy: "potní žlázy", pravy: "vylučují pot a ochlazují tělo",
    proc: "S potem tělo vylučuje vodu a soli." },
  { uroven: 3, levy: "plíce při vylučování", pravy: "odvádějí z těla oxid uhličitý",
    proc: "Oxid uhličitý vzniká v buňkách a vydechujeme ho." },
  { uroven: 3, levy: "močová trubice", pravy: "odvádí moč z měchýře ven z těla",
    proc: "Je to poslední úsek cesty moči." },
  { uroven: 3, levy: "konečník", pravy: "konec trávicí trubice, kudy odchází stolice",
    proc: "Nestrávené zbytky potravy odcházejí z těla ven." },
];

function gen(level: number): PracticeTask[] {
  return parovani(DVOJICE, level, "Spoj orgán s tím, co dělá.");
}

export const TRAVICISOUSTAVAVYLUCOVACISOUSTAVA: TopicMetadata[] = [
  {
    id: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava",
    rvpNodeId: "g5-prirodoveda-clovek-a-jeho-zdravi-lidske-telo-soustavy-travici-soustava-vylucovaci-soustava",
    title: "Trávicí soustava, vylučovací soustava",
    studentTitle: "Trávení a ledviny",
    subject: "přírodověda",
    category: "Člověk a jeho zdraví",
    topic: "Lidské tělo - soustavy",
    briefDescription: "Pochopíš, jak tělo zpracovává jídlo a zbavuje se odpadů.",
    keywords: ["trávení", "žaludek", "střevo", "játra", "ledviny", "enzymy", "vstřebávání", "vylučování"],
    goals: ["Popsat cestu potravy trávicí soustavou", "Vysvětlit funkce jater a pankreatu", "Popsat vylučovací orgány a jejich funkce"],
    boundaries: ["Neprobírá biochemii enzymů do hloubky", "Neprobírá trávicí choroby"],
    gradeRange: [5, 5],
    inputType: "match_pairs",
    contentType: "factual",
    defaultLevel: 1,
    sessionTaskCount: 6,
    generator: gen,
    helpTemplate: {
      hint: "Trávicí cesta: ústa → jícen → žaludek → tenké střevo → tlusté střevo. Vylučování: ledviny (moč), plíce (oxid uhličitý), kůže (pot).",
      steps: [
        "Ústa: zuby + sliny (enzymy).",
        "Žaludek: kyselá žaludeční šťáva.",
        "Tenké střevo: vstřebávání živin přes klky.",
        "Tlusté střevo: vstřebávání vody, tvorba výkalů.",
        "Vylučovací: ledviny (moč), plíce (oxid uhličitý), kůže (pot).",
      ],
      commonMistake: "Inzulín produkuje SLINIVKA (pankreas), ne játra. Játra produkují ŽLUČ.",
      example: "Jablko: ústy rozmělněno, žaludkem natráveno, střevem vstřebáno, zbytek vyloučen.",
    },
  },
];
