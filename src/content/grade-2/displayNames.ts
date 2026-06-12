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
  },
} as const;
