/**
 * Dětské varianty RVP jmen okruhů a témat pro 6. ročník (11–12 let).
 *
 * RVP zůstává backbone (mapování na standard, audit, reporty). Žák vidí tyhle
 * varianty. Slovník 6. ročníku smí odborné termíny, které se na 2. stupni
 * zavádějí — „veličina", „jednotka", „pramen", „letopočet" — ale postup se
 * pořád vysvětluje lidsky, ne definicí (viz `grade-6/README.md`).
 *
 * Do 2026-09-13 tenhle soubor neexistoval a `displayNames.BY_GRADE` znal jen
 * ročníky 2–5, takže šesťák četl oficiální názvy okruhů („Měření fyzikálních
 * veličin"). Nerozbité, ale psané pro dospělého.
 *
 * Per-grade — neimportovat z jiných ročníků, každý má vlastní slovník.
 */

import type { DisplayMap } from "@/lib/displayNames";

export const DISPLAY_NAMES: DisplayMap = {
  // RVP okruh → dětský název + krátký popis
  categories: {
    // Fyzika
    "Měření fyzikálních veličin": {
      name: "Měření a veličiny",
      description: "Změříš délku, hmotnost, objem, čas i teplotu a převedeš jednotky.",
    },
    "Látky a tělesa": {
      name: "Z čeho je co",
      description: "Poznáš rozdíl mezi věcí a materiálem, ze kterého je.",
    },
    // Dějepis
    "Úvod do dějepisu": {
      name: "Jak se zkoumá minulost",
      description: "Zjistíš, odkud historici vědí, co se kdysi stalo.",
    },
    Pravěk: {
      name: "Pravěk",
      description: "Seřadíš úseky pravěku podle toho, co lidé uměli vyrobit.",
    },
  },

  // RVP téma → dětský název + krátký popis
  topics: {
    // Fyzika
    "Délka, objem, hmotnost": {
      name: "Délka a hmotnost",
      description: "Měříš základní veličiny a převádíš jejich jednotky.",
    },
    "Hustota, teplota, čas": {
      name: "Hustota a teplota",
      description: "Spočítáš hustotu a pracuješ s teplotou i časem.",
    },
    "Vlastnosti látek": {
      name: "Jaká je ta látka",
      description: "Rozlišíš látku od tělesa a poznáš, v jakém je skupenství.",
    },
    "Částicová stavba látek": {
      name: "Z čeho je to uvnitř",
      description: "Podíváš se na látky zblízka, až na jednotlivé částice.",
    },
    // Dějepis
    "Historie a historické prameny": {
      name: "Prameny o minulosti",
      description: "Poznáš, z čeho se dá vyčíst, jak lidé kdysi žili.",
    },
    "Pomocné vědy historické": {
      name: "Vědy, co pomáhají",
      description: "Každá zkoumá jiný druh nálezu z minulosti.",
    },
    "Vývoj člověka": {
      name: "Vývoj člověka",
      description: "Sleduješ, jak se měnil život lidí v pravěku.",
    },
  },
};
