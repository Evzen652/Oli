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
    // Matematika
    "Číslo a proměnná": {
      name: "Čísla a počítání",
      description: "Počítáš s desetinnými čísly a zjistíš, co je čím dělitelné.",
    },
    "Geometrie v rovině a v prostoru": {
      name: "Geometrie",
      description: "Úhly, trojúhelníky, souměrnost a krabice, do kterých se něco vejde.",
    },
    "Nestandardní aplikační úlohy a problémy": {
      name: "Úlohy na přemýšlení",
      description: "Úlohy bez naučeného postupu, na které stačí selský rozum.",
    },
    "Závislosti, vztahy a práce s daty": {
      name: "Tabulky a grafy",
      description: "Vyčteš z tabulky i diagramu, co v datech opravdu je.",
    },
    // Přírodopis
    "Obecná biologie": {
      name: "Jak funguje život",
      description: "Buňka, mikroskop, třídění organismů a jak se život na Zemi vyvíjel.",
    },
    "Nebuněční a bakterie": {
      name: "Viry, bakterie a prvoci",
      description: "Nejmenší původci nemocí i užiteční pomocníci, které neuvidíš pouhým okem.",
    },
    "Biologie hub": {
      name: "Houby a lišejníky",
      description: "Jak houby žijí, které se dají jíst a proč lišejník není jeden organismus.",
    },
    "Biologie rostlin": {
      name: "Řasy, mechy a kapradiny",
      description: "Rostliny bez květů a semen — množí se výtrusy.",
    },
    "Biologie živočichů": {
      name: "Živočichové bez páteře",
      description: "Od nezmara přes hlemýždě a žížaly až po hmyz a pavouky.",
    },
    // Zeměpis
    "Geografické informace, zdroje dat, kartografie": {
      name: "Mapa a glóbus",
      description: "Přečteš mapu, spočítáš vzdálenost z měřítka a najdeš místo podle souřadnic.",
    },
    "Přírodní obraz Země": {
      name: "Planeta Země",
      description: "Proč se střídá den a noc, odkud se berou roční doby a co tvoří krajinu.",
    },
    "Regiony světa": {
      name: "Světadíly",
      description: "Afrika, Austrálie a Oceánie i ledové oblasti kolem pólů.",
    },
    // Čeština
    "Jazyková výchova": {
      name: "Mluvnice",
      description: "Slovní druhy, tvary slov, slovní zásoba, stavba věty a výslovnost.",
    },
    // Čeština
    Tvarosloví: {
      name: "Slovní druhy a tvary",
      description: "Poznáš slovní druh ve větě, určíš vzor i slovesnou třídu.",
    },
    "Nauka o slovní zásobě": {
      name: "Slovní zásoba",
      description: "Jak vznikají nová slova a čím se liší synonyma, antonyma a homonyma.",
    },
    Skladba: {
      name: "Stavba věty",
      description: "Najdeš ve větě podmět, přísudek, předmět, přívlastek i doplněk.",
    },
    "Zvuková stránka jazyka": {
      name: "Jak věta zní",
      description: "Přízvuk, melodie věty, pauzy a spisovná výslovnost.",
    },
    // Fyzika
    "Měření fyzikálních veličin": {
      name: "Měření a veličiny",
      description: "Změříš délku, hmotnost, objem, čas i teplotu a převedeš jednotky.",
    },
    "Látky a tělesa": {
      name: "Z čeho je co",
      description: "Poznáš rozdíl mezi věcí a materiálem, ze kterého je.",
    },
    "Elektrické vlastnosti látek": {
      name: "Elektřina a magnety",
      description: "Zjistíš, co se přitahuje, co odpuzuje a proč tě cvakne o kliku.",
    },
    // Dějepis
    "Úvod do dějepisu": {
      name: "Jak se zkoumá minulost",
      description: "Zjistíš, odkud historici vědí, co se kdysi stalo.",
    },
    Pravěk: {
      name: "Pravěk",
      description: "Od prvních lidí přes lovce mamutů až po Kelty a Slovany.",
    },
    Starověk: {
      name: "Nejstarší státy",
      description: "Poznáš, jak žili lidé v Mezopotámii a ve starém Egyptě.",
    },
  },

  // RVP téma → dětský název + krátký popis
  topics: {
    // Matematika
    "Desetinná čísla": {
      name: "Desetinná čísla",
      description: "Násobíš a dělíš desetinnými čísly a řešíš s nimi slovní úlohy.",
    },
    "Dělitelnost přirozených čísel": {
      name: "Co je čím dělitelné",
      description: "Poznáš násobky, dělitele a prvočísla a najdeš společný dělitel.",
    },
    Úhel: {
      name: "Úhly",
      description: "Rozlišíš druhy úhlů, změříš je a sečteš.",
    },
    Trojúhelníky: {
      name: "Trojúhelníky",
      description: "Poznáš druhy trojúhelníků a dopočítáš chybějící úhel.",
    },
    "Krychle a kvádr": {
      name: "Krychle a kvádr",
      description: "Spočítáš, kolik se vejde dovnitř a kolik papíru potřebuješ na obal.",
    },
    "Osová a středová souměrnost": {
      name: "Souměrnost",
      description: "Najdeš osu i střed souměrnosti a obraz bodu.",
    },
    "Logické úlohy": {
      name: "Logické úlohy",
      description: "Vyřešíš hádanku úvahou a spočítáš, kolik je možností.",
    },
    "Práce s daty": {
      name: "Tabulky a diagramy",
      description: "Roztřídíš data a vyčteš z tabulky i diagramu, co v nich je.",
    },
    // Přírodopis
    "Vznik a vývoj života": {
      name: "Jak se vyvíjel život",
      description: "Od vzniku Země přes prvohory až po čtvrtohory a třídění organismů.",
    },
    "Buňka jako základ života": {
      name: "Buňka a mikroskop",
      description: "Z čeho se skládá buňka a jak se pracuje s mikroskopem.",
    },
    "Viry a bakterie": {
      name: "Viry a bakterie",
      description: "Čím se liší, jaké nemoci způsobují a co proti nim pomáhá.",
    },
    "Sinice a prvoci": {
      name: "Sinice a prvoci",
      description: "Vodní květ, trepka, měňavka a nemoci, které prvoci přenášejí.",
    },
    "Houby a lišejníky": {
      name: "Houby a lišejníky",
      description: "Stavba hub, bezpečný sběr a soužití houby s řasou.",
    },
    "Nižší rostliny": {
      name: "Řasy, mechy a kapradiny",
      description: "Rostliny, které se nemnoží semeny, a k čemu jsou v přírodě.",
    },
    "Bezobratlí - žahavci, ploštěnci, hlísti": {
      name: "Nezmar, tasemnice a škrkavka",
      description: "Žahavci a cizopasní červi — jak žijí a jak se před nimi chránit.",
    },
    "Bezobratlí - měkkýši, kroužkovci": {
      name: "Plži, mlži a žížaly",
      description: "Hlemýžď, škeble, chobotnice, žížala i pijavka.",
    },
    "Bezobratlí - členovci (úvod)": {
      name: "Hmyz, pavouci a korýši",
      description: "Poznáš je podle počtu nohou a stavby těla.",
    },
    // Zeměpis
    "Mapa a glóbus": {
      name: "Mapa a glóbus",
      description: "Měřítko, mapové značky, světové strany a zeměpisná síť.",
    },
    "Vesmír a Země": {
      name: "Země ve vesmíru",
      description: "Sluneční soustava, den a noc, roční doby a časová pásma.",
    },
    "Krajinné sféry": {
      name: "Vzduch, voda a pevnina",
      description: "Počasí a podnebí, řeky a oceány, sopky i půda pod nohama.",
    },
    Afrika: {
      name: "Afrika",
      description: "Poušť, savana i deštný les a jak se v nich žije.",
    },
    "Austrálie a Oceánie": {
      name: "Austrálie a Oceánie",
      description: "Světadíl klokanů, korálový útes a tisíce ostrovů v Tichém oceánu.",
    },
    "Polární oblasti": {
      name: "Arktida a Antarktida",
      description: "Ledové oblasti kolem pólů — čím se liší a proč jsou důležité.",
    },
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
    "Elektrický náboj a magnetismus": {
      name: "Náboj a magnety",
      description: "Poznáš sílu, která působí i přes mezeru, bez jediného dotyku.",
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
    "Pravěk na našem území": {
      name: "Pravěk u nás",
      description: "Lovci mamutů, Keltové i Slované žili tam, kde bydlíš ty.",
    },
    "Nejstarší státy - Mezopotámie a Egypt": {
      name: "Mezopotámie a Egypt",
      description: "První města, písmo a zákony vznikly u velkých řek.",
    },
    "Starověká Indie a Čína": {
      name: "Indie a Čína",
      description: "Kasty, Buddhovo učení, Velká čínská zeď i vynález papíru.",
    },
    "Antika - Řecko": {
      name: "Staré Řecko",
      description: "Athény, Sparta, války s Peršany i řečtí bohové.",
    },
    "Antika - Řím": {
      name: "Starý Řím",
      description: "Od založení Říma přes Caesara až po pád západořímské říše.",
    },
  },
};
