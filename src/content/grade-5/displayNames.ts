/**
 * Dětské varianty RVP jmen okruhů a témat pro 5. ročník (10–11 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty).
 * Dítě vidí tyto varianty — krátké, srozumitelné, bez odborného žargonu.
 *
 * Per-grade — neimportovat z jiných ročníků, každý má vlastní slovník.
 */

import type { DisplayMap } from "@/lib/displayNames";

export const DISPLAY_NAMES: DisplayMap = {
  // RVP okruh → dětský název + krátký popis
  categories: {
    // Matematika
    "Číslo a početní operace": {
      name: "Počítání s čísly",
      description: "Počítáš s velkými i desetinnými čísly a zlomky.",
    },
    "Geometrie v rovině a v prostoru": {
      name: "Geometrie a tvary",
      description: "Rýsuješ tvary, počítáš obvod, obsah i objem těles.",
    },
    "Závislosti, vztahy a práce s daty": {
      name: "Tabulky a grafy",
      description: "Přečteš tabulky a grafy a pracuješ s daty.",
    },
    "Nestandardní aplikační úlohy a problémy": {
      name: "Logické úlohy",
      description: "Vyřešíš slovní a logické úlohy o více krocích.",
    },
    // Český jazyk
    "Jazyková výchova": {
      name: "Pravopis a mluvnice",
      description: "Zvládneš shodu přísudku s podmětem a stavbu vět.",
    },
    "Komunikační a slohová výchova": {
      name: "Čtení, psaní a sloh",
      description: "Čteš s porozuměním a píšeš vlastní slohové práce.",
    },
    "Literární výchova": {
      name: "Knihy a příběhy",
      description: "Poznáš literární žánry a mluvíš o příbězích.",
    },
    // Vlastivěda — Člověk a jeho svět
    "Místo, kde žijeme": {
      name: "Naše vlast a Evropa",
      description: "Poznáš Českou republiku, Evropu, mapy a sousední země.",
    },
    "Lidé a čas": {
      name: "Z naší historie",
      description: "Projdeš dějinami od nejstarších dob po moderní dobu.",
    },
    "Lidé kolem nás": {
      name: "Lidé a společnost",
      description: "Zjistíš, jak spolu lidé žijí, a poznáš svá práva.",
    },
    // Přírodověda — Člověk a jeho svět
    "Rozmanitost přírody": {
      name: "Příroda kolem nás",
      description: "Poznáš ekosystémy, rostliny, živočichy a přírodní jevy.",
    },
    "Člověk a jeho zdraví": {
      name: "Tělo a zdraví",
      description: "Poznáš lidské tělo, smysly a jak o sebe pečovat.",
    },
    // Informatika
    "Algoritmizace a programování": {
      name: "Programování",
      description: "Sestavíš postupy a vyzkoušíš základy programování.",
    },
    "Data, informace a modelování": {
      name: "Data a informace",
      description: "Zjistíš, jak se informace ukládají, třídí a zobrazují.",
    },
    "Digitální technologie": {
      name: "Počítač a technologie",
      description: "Naučíš se ovládat počítač a používat ho bezpečně.",
    },
    "Informační systémy": {
      name: "Jak fungují systémy",
      description: "Poznáš, jak spolu zařízení a programy spolupracují.",
    },
  },

  // RVP téma → dětský název (zatím nevyplněno — fallback na RVP název)
  topics: {},
} as const;
