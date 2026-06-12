/**
 * Dětské varianty RVP jmen okruhů a témat pro 2. ročník (7–8 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty).
 * Dítě vidí tyto varianty — krátké, srozumitelné, bez odborného žargonu.
 * Ještě jednodušší jazyk než grade-3 (děti jsou o rok mladší).
 */

import type { DisplayMap } from "@/lib/displayNames";

export const DISPLAY_NAMES: DisplayMap = {
  // RVP okruh → dětský název + krátký popis
  categories: {
    "Číslo a početní operace": {
      name: "Počítání",
      description: "Sčítáš, odčítáš a násobíš čísla do 100.",
    },
    "Geometrie v rovině a v prostoru": {
      name: "Tvary a čáry",
      description: "Poznáš bod, přímku a úsečku a změříš její délku.",
    },
    "Závislosti, vztahy a práce s daty": {
      name: "Míry a tabulky",
      description: "Měříš délku, čas a čteš z jednoduchých tabulek.",
    },
    "Nestandardní aplikační úlohy a problémy": {
      name: "Slovní úlohy",
      description: "Vyřešíš krátké příklady ze života.",
    },

    // ── Prvouka ──
    "Lidé a čas": {
      name: "Čas a svátky",
      description: "Poznáš hodiny, kalendář a tradice.",
    },
    "Lidé kolem nás": {
      name: "Lidé kolem nás",
      description: "Kamarádi, sousedé, povolání a slušné chování.",
    },
    "Místo, kde žijeme": {
      name: "Naše obec",
      description: "Poznáš svou obec a místa v ní.",
    },
    "Rozmanitost přírody": {
      name: "Příroda",
      description: "Zvířata, rostliny a roční období.",
    },
    "Člověk a jeho zdraví": {
      name: "Zdraví",
      description: "Jak žít zdravě a pomoci při úrazu.",
    },
  },

  // RVP téma → dětský název + krátký popis
  topics: {
    "Číselný obor 0–100": {
      name: "Čísla do 100",
      description: "Počítáš, čteš a porovnáváš čísla do sta.",
    },
    "Násobení a dělení": {
      name: "Násobilka",
      description: "Naučíš se násobit a dělit malá čísla.",
    },
    "Body, přímky, úsečky": {
      name: "Bod a úsečka",
      description: "Poznáš bod, přímku a úsečku a změříš ji.",
    },
    "Měření a jednotky": {
      name: "Měření",
      description: "Měříš délku, hmotnost, objem a čas.",
    },
    "Práce s daty": {
      name: "Tabulky a řady",
      description: "Čteš z tabulek a doplňuješ řady čísel.",
    },
    "Slovní úlohy": {
      name: "Slovní úlohy",
      description: "Vyřešíš krátký příklad ze života.",
    },

    // ── Prvouka ──
    "Měření času a tradice": {
      name: "Čas a tradice",
      description: "Hodiny, kalendář, Vánoce a Velikonoce.",
    },
    "Soužití lidí": {
      name: "Lidé spolu",
      description: "Kamarádství, povolání a slušné chování.",
    },
    "Obec a okolí": {
      name: "Obec a okolí",
      description: "Tvá obec a důležitá místa v ní.",
    },
    "Domácí a hospodářská zvířata": {
      name: "Domácí zvířata",
      description: "Zvířata a co nám dávají.",
    },
    "Příroda na jaře a v létě": {
      name: "Jaro a léto",
      description: "Květiny, mláďata a teplé počasí.",
    },
    "Příroda na podzim a v zimě": {
      name: "Podzim a zima",
      description: "Listí, sníh a zvířata v zimě.",
    },
    "Prevence a první pomoc": {
      name: "První pomoc",
      description: "Co dělat při úrazu a kam volat.",
    },
    "Zdravý životní styl": {
      name: "Zdravý život",
      description: "Pohyb, spánek, voda a zdravé jídlo.",
    },
  },
} as const;
