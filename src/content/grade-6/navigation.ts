/**
 * Vlastní 2-úrovňová navigace pro 6. ročník: předmět → okruh → téma.
 *
 * Stejný princip jako u ročníků 2–5 — čistě display vrstva, RVP pole
 * (`category` / `topic` / `id`) zůstávají beze změny. Každé téma je v právě
 * jednom okruhu, hlídá `src/test/navigation-consistency.test.ts`.
 *
 * **Zakládá se dřív, než je čím naplnit.** Šestka má dnes 11 témat ze 117
 * a plochý seznam by jim ještě stačil; při 117 už ne. Struktura vzniká teď,
 * aby každá další dávka jen přidala `topicIds` do existujícího okruhu —
 * dodělávat zařazení zpětně u stovky témat je práce navíc a
 * `navigation-consistency.test.ts` by do té doby padal v dávkách.
 *
 * Okruhy sledují RVP `area`, ale pojmenované jsou pro dítě. Nový okruh se
 * zakládá až ve chvíli, kdy do něj něco patří — prázdná dlaždice je horší než
 * žádná (viz `docs/UI_AUDIT.md`, pravidlo o prázdné díře místo prázdného stavu).
 */

import type { SubjectNav } from "../navigation";

export const GRADE6_NAVIGATION: SubjectNav[] = [
  {
    subject: "fyzika",
    okruhy: [
      {
        id: "mereni-velicin",
        name: "Měření a veličiny",
        description: "Změříš délku, hmotnost, objem, čas i teplotu a převedeš jednotky.",
        emoji: "📏",
        topicIds: [
          "g6-fyz-mereni-delky-6",
          "g6-fyz-mereni-hmotnosti-6",
          "g6-fyz-mereni-objemu-6",
          "g6-fyz-mereni-casu-6",
          "g6-fyz-mereni-teploty-6",
          "g6-fyz-hustota-6",
        ],
      },
      {
        id: "latky-a-telesa",
        name: "Z čeho je co",
        description: "Poznáš rozdíl mezi věcí a materiálem, ze kterého je.",
        emoji: "🧱",
        topicIds: [
          "g6-fyz-latka-a-teleso-6",
          "g6-fyz-skupenstvi-latek-6",
          "g6-fyz-atomy-molekuly-6",
          "g6-fyz-pohyb-castic-6",
        ],
      },
      {
        id: "elektrina-a-magnetismus",
        name: "Elektřina a magnety",
        description: "Zjistíš, co se přitahuje, co odpuzuje a proč tě cvakne o kliku.",
        emoji: "⚡",
        topicIds: [
          "g6-fyz-elektricky-naboj-6",
          "g6-fyz-elektricky-obvod-6",
        ],
      },
    ],
  },
  {
    subject: "dejepis",
    okruhy: [
      {
        id: "jak-se-zkouma-minulost",
        name: "Jak se zkoumá minulost",
        description: "Zjistíš, odkud historici vědí, co se kdysi stalo.",
        emoji: "🔎",
        topicIds: [
          "g6-dej-co-je-dejepis-6",
          "g6-dej-historicke-prameny-6",
          "g6-dej-pomocne-vedy-historicke-6",
          "g6-dej-periodizace-letopocet-6",
        ],
      },
      {
        id: "pravek",
        name: "Pravěk",
        description: "Seřadíš úseky pravěku podle toho, co lidé uměli vyrobit.",
        emoji: "🦴",
        topicIds: ["g6-dej-doba-kamenna-periodizace-6"],
      },
    ],
  },
];
