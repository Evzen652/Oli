/**
 * Dětské varianty RVP jmen okruhů a témat pro 3. ročník (8–9 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty).
 * Dítě vidí tyto varianty — krátké, srozumitelné, bez odborného žargonu.
 */

import type { DisplayMap } from "@/lib/displayNames";

export const DISPLAY_NAMES: DisplayMap = {
  // RVP okruh → dětský název + krátký popis
  categories: {
    // Matematika
    "Číslo a početní operace": {
      name: "Počítání s čísly",
      description: "Sčítáš, odčítáš, násobíš a dělíš čísla do 1000.",
    },
    "Geometrie v rovině a v prostoru": {
      name: "Tvary kolem nás",
      description: "Poznáš různé tvary, narýsuješ úsečku a spočítáš obvod.",
    },
    "Závislosti, vztahy a práce s daty": {
      name: "Tabulky a míry",
      description: "Přečteš jízdní řád, porovnáš jednotky a pracuješ s tabulkami.",
    },
    "Nestandardní aplikační úlohy a problémy": {
      name: "Slovní úlohy",
      description: "Vyřešíš úlohy ze života s více kroky výpočtu.",
    },
    // Český jazyk — Jazyková výchova
    "Jazyková výchova": {
      name: "Pravopis a mluvnice",
      description: "Naučíš se správně psát a pochopit stavbu slov a vět.",
    },
    // Český jazyk — Komunikační a slohová výchova
    "Komunikační a slohová výchova": {
      name: "Čtení, psaní a sloh",
      description: "Čteš s porozuměním, píšeš úhledně a tvoříš různé texty.",
    },
    // Český jazyk — Literární výchova
    "Literární výchova": {
      name: "Knihy a příběhy",
      description: "Poznáš pohádky, básně i povídky a naučíš se o nich mluvit.",
    },
    // Prvouka — Člověk a jeho svět
    "Místo, kde žijeme": {
      name: "Domov a okolí",
      description: "Poznáš svůj domov, obec a cestu do školy podle mapy.",
    },
    "Lidé kolem nás": {
      name: "Lidé kolem nás",
      description: "Poznáš rodinu, kamarády a jak se k sobě lidé chovají.",
    },
    "Lidé a čas": {
      name: "Čas a minulost",
      description: "Zjistíš, jak měříme čas a jak se žilo dřív než dnes.",
    },
    "Rozmanitost přírody": {
      name: "Příroda kolem nás",
      description: "Poznáš rostliny, zvířata a roční období v přírodě.",
    },
    "Člověk a jeho zdraví": {
      name: "Tělo a zdraví",
      description: "Poznáš lidské tělo a naučíš se, jak o sebe pečovat.",
    },
  },

  // RVP téma → dětský název + krátký popis
  topics: {
    // Matematika — Číslo a početní operace
    "Číselný obor 0–1000": {
      name: "Čísla do 1000",
      description: "Čteš, zapisuješ a porovnáváš čísla do tisíce.",
    },
    "Násobilka": {
      name: "Násobilka a dělení",
      description: "Zvládneš celou násobilku a dělení se zbytkem.",
    },
    // Matematika — Geometrie v rovině a v prostoru
    "Rovinné útvary": {
      name: "Tvary a obvod",
      description: "Narýsuješ kružnici, spočítáš obvod trojúhelníku a obdélníku.",
    },
    // Matematika — Závislosti, vztahy a práce s daty
    "Měření a jednotky": {
      name: "Míry a jednotky",
      description: "Převedeš délky, hmotnosti i čas mezi různými jednotkami.",
    },
    "Práce s daty": {
      name: "Tabulky a diagramy",
      description: "Přečteš jízdní řád a porozumíš jednoduchým diagramům.",
    },
    // Matematika — Nestandardní úlohy
    "Slovní a logické úlohy": {
      name: "Slovní úlohy",
      description: "Vyřešíš úlohy, kde musíš počítat ve dvou nebo více krocích.",
    },
    // CJL — Jazyková výchova
    "Nauka o slově": {
      name: "Slova a jejich příbuzní",
      description: "Poznáš synonyma, antonyma, slova příbuzná a mnohovýznamová.",
    },
    "Pravopis": {
      name: "Správné psaní",
      description: "Naučíš se psát vyjmenovaná slova, velká písmena a i/y.",
    },
    "Skladba": {
      name: "Stavba věty",
      description: "Pochopíš, jak se věty spojují a z čeho se skládají.",
    },
    "Tvarosloví": {
      name: "Slovní druhy",
      description: "Poznáš podstatná jména, slovesa i ostatní slovní druhy.",
    },
    // CJL — Komunikační a slohová výchova
    "Čtení": {
      name: "Čtení s porozuměním",
      description: "Čteš plynně a umíš z textu vybrat důležité informace.",
    },
    "Psaní": {
      name: "Úhledné psaní",
      description: "Píšeš úhledně a kontroluješ svůj písemný projev.",
    },
    "Slohová výchova": {
      name: "Tvorba textů",
      description: "Napíšeš popis, vypravování, dopis nebo omluvenku.",
    },
    // CJL — Literární výchova
    "Literární druhy a žánry": {
      name: "Pohádky, básně a povídky",
      description: "Rozlišíš pohádku, báseň, bajku i povídku a řekneš, čím se liší.",
    },
    "Práce s textem": {
      name: "Porozumění textu",
      description: "Najdeš v textu hlavní myšlenku a převypravíš přečtený příběh.",
    },
  },
} as const;
