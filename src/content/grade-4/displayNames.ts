/**
 * Dětské varianty RVP jmen okruhů a témat pro 4. ročník (9–10 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty).
 * Dítě vidí tyto varianty — krátké, srozumitelné, bez odborného žargonu.
 *
 * Pravidla viz `src/content/grade-4/README.md` sekce "Tone of voice".
 *
 * Per-grade — neimportovat z jiných ročníků, každý má vlastní slovník.
 */

import type { DisplayMap } from "@/lib/displayNames";

export const DISPLAY_NAMES: DisplayMap = {
  // RVP okruh → dětský název + krátký popis
  categories: {
    "Číslo a početní operace": {
      name: "Počítání s čísly",
      description: "Naučíš se počítat s čísly až do milionu a poznáš zlomky.",
    },
    "Geometrie v rovině a v prostoru": {
      name: "Tvary a prostor",
      description: "Poznáš tvary, spočítáš obvod a obsah a najdeš osu souměrnosti.",
    },
    "Závislosti, vztahy a práce s daty": {
      name: "Tabulky a vzorce",
      description: "Přečteš tabulky a grafy a spočítáš průměr.",
    },
    "Nestandardní aplikační úlohy a problémy": {
      name: "Logické hádanky",
      description: "Vyřešíš logické hlavolamy a najdeš skryté vzory.",
    },
    // Český jazyk
    "Jazyková výchova": {
      name: "Pravopis a mluvnice",
      description: "Naučíš se vyjmenovaná slova, slovní druhy a stavbu vět.",
    },
    "Komunikační a slohová výchova": {
      name: "Čtení, psaní a sloh",
      description: "Čteš s porozuměním a tvoříš vlastní texty.",
    },
    "Literární výchova": {
      name: "Knihy a příběhy",
      description: "Poznáš básně, pohádky a příběhy a umíš o nich mluvit.",
    },
    // Vlastivěda + Přírodověda — Člověk a jeho svět
    "Místo, kde žijeme": {
      name: "Naše vlast",
      description: "Poznáš Českou republiku, kraje, mapy a světové strany.",
    },
    "Lidé kolem nás": {
      name: "Lidé kolem nás",
      description: "Poznáš, jak spolu lidé žijí, pracují a pomáhají si.",
    },
    "Lidé a čas": {
      name: "Z naší historie",
      description: "Projdeš dějinami od pravěku až po vznik Československa.",
    },
    "Rozmanitost přírody": {
      name: "Příroda a přírodověda",
      description: "Poznáš ekosystémy, rostliny, živočichy a přírodní jevy.",
    },
    "Člověk a jeho zdraví": {
      name: "Tělo a zdraví",
      description: "Poznáš lidské tělo a naučíš se, jak o sebe pečovat.",
    },
    // Informatika
    "Algoritmizace a programování": {
      name: "Programování",
      description: "Sestavíš postupy a vyzkoušíš si základy programování.",
    },
    "Data, informace a modelování": {
      name: "Data a informace",
      description: "Zjistíš, jak se informace ukládají, třídí a zobrazují.",
    },
    "Digitální technologie": {
      name: "Počítač a technologie",
      description: "Naučíš se ovládat počítač a používat ho bezpečně.",
    },
  },

  // RVP téma → dětský název + krátký popis
  topics: {
    // Číslo a početní operace
    "Číselný obor 0–1 000 000": {
      name: "Velká čísla",
      description: "Pracuješ s velkými čísly — čteš je, zapisuješ a zaokrouhluješ.",
    },
    "Písemné početní operace": {
      name: "Počítání pod sebou",
      description: "Sčítáš, odčítáš, násobíš a dělíš velká čísla pod sebou.",
    },
    "Zlomky": {
      name: "Zlomky",
      description: "Pochopíš zlomky a naučíš se s nimi počítat.",
    },
    // Geometrie v rovině a v prostoru
    "Obvod a obsah": {
      name: "Obvod a obsah",
      description: "Spočítáš obvod i obsah čtverce a obdélníku.",
    },
    "Rovinné útvary": {
      name: "Rovinné tvary",
      description: "Poznáš trojúhelníky, rovnoběžky a kolmice.",
    },
    "Souměrnost": {
      name: "Souměrnost",
      description: "Najdeš souměrné tvary a jejich osu.",
    },
    // Závislosti, vztahy a práce s daty
    "Práce s daty": {
      name: "Tabulky a grafy",
      description: "Přečteš tabulky, poznáš grafy a spočítáš průměr.",
    },
    // Nestandardní aplikační úlohy a problémy
    "Logické úlohy": {
      name: "Hlavolamy",
      description: "Vyřešíš magické čtverce a najdeš vzory v číselných řadách.",
    },
  },
} as const;
