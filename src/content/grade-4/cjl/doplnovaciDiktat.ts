import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { iy, skupina, urovenJednoPravidlo, urovenMix, urovenVyznam, type Polozka } from "@/content/_diktat";

// Doplňovací diktát pro 4. ročník (2026-09-26).
//
// Čtvrtá třída přibírá stavbu slova: předpony vy-/vý-, s-/z-/vz-, předložky
// s/z a skloňování podle vzorů. Vyjmenovaná slova se předpokládají ze
// 3. ročníku a slouží jako „rušivé pozadí“ v L2 — právě to dělá z cvičení
// diktát, ne další cvičení na jedno pravidlo.
//
// L1 předpona vy-/vý- · L2 promíchané předpony, předložky a starší jevy
// L3 dvojice s- × z-, kde rozhoduje význam (správa × zpráva, sbít × zbít),
//    a pády u vzorů, kde o koncovce rozhoduje role slova ve větě.

const PREDPONA_VY = "předpona vy-/vý- se vždycky píše s y";

// ── L1 — předpona vy-/vý- ────────────────────────────────────────────

const L1: Polozka[] = [
  iy("Pták v_letěl z hnízda.", "vyletěl", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("V sobotu jedeme na v_let.", "výlet", "ý", PREDPONA_VY, "Předpona vý- se píše s y. Tady je dlouhá — ý."),
  iy("Kluk v_skočil z lavice.", "vyskočil", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Dostal jsem v_bornou známku.", "výbornou", "ý", PREDPONA_VY, "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Dědeček nám v_právěl pohádku.", "vyprávěl", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Učitel nám to trpělivě v_světlil.", "vysvětlil", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Jaká je v_ška té věže?", "výška", "ý", PREDPONA_VY, "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Do cíle jsem v_držel běžet.", "vydržel", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Naše třída v_hrála soutěž.", "vyhrála", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Po jídle si musíš v_čistit zuby.", "vyčistit", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Na lavici leží hotový v_kres.", "výkres", "ý", PREDPONA_VY, "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Vojáci ráno v_razili na pochod.", "vyrazili", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Z okna je pěkný v_hled.", "výhled", "ý", PREDPONA_VY, "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Strom za rok v_rostl o metr.", "vyrostl", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
];

// ── L2 — promíchaná pravidla ─────────────────────────────────────────

/**
 * Předpona nebo předložka s- × z-. Zpětná vazba u chybné možnosti je
 * odvozená z `proc`, ne z obecné poučky: u předložek rozhoduje pád,
 * u předpon význam, a jedno vysvětlení by na oboje nesedělo.
 */
const sz = (veta: string, slovo: string, spravne: "s" | "z", pravidlo: string, proc: string): Polozka =>
  skupina(veta, slovo, spravne, [
    [spravne === "s" ? "z" : "s", `Tady ne — správně je „${slovo}“. ${proc}`],
  ], pravidlo, proc);

const L2: Polozka[] = [
  iy("Ráno jsme v_šli brzy z domu.", "vyšli", "y", PREDPONA_VY, "Předpona vy- se píše s krátkým y."),
  iy("Na okně stojí v_soká váza.", "vysoká", "y", "„vysoký“ je vyjmenované slovo po V", "„Vysoký“ je vyjmenované slovo po V — krátké y."),
  iy("Nesmíš se nikomu posm_vat.", "posmívat", "í", "„posmívat se“ patří k slovu smích a mezi vyjmenovaná nepatří", "„Posmívat se“ souvisí se „smích“ — vyjmenované slovo to není, píše se í."),
  iy("Na zahradě bzučel hm_z.", "hmyz", "y", "„hmyz“ je vyjmenované slovo po M", "„Hmyz“ je vyjmenované slovo po M — krátké y."),
  sz("Turista sešel _ kopce dolů.", "z kopce", "z", "předložka z se pojí s 2. pádem", "Předložka „z“ se pojí s 2. pádem (z čeho? z kopce) a znamená směr odněkud."),
  sz("Mluvil jsem o tom _ učitelem.", "s učitelem", "s", "předložka s se pojí se 7. pádem", "Předložka „s“ se pojí se 7. pádem (s kým? s učitelem) a znamená společně."),
  sz("Vytáhl sešit _e skříně.", "ze skříně", "z", "předložka z se pojí s 2. pádem", "Předložka „ze“ se pojí s 2. pádem (ze skříně) a znamená směr odněkud."),
  sz("Na výlet pojedu _e sestrou.", "se sestrou", "s", "předložka s se pojí se 7. pádem", "Předložka „se“ se pojí se 7. pádem (s kým? se sestrou)."),
  sz("Před cestou si musím _balit batoh.", "sbalit", "s", "předpona s- znamená dohromady", "Předpona „s-“ znamená dát dohromady — sbalit věci k sobě."),
  sz("Papír se v kapse celý _mačkal.", "zmačkal", "z", "předpona z- znamená změnu stavu", "Předpona „z-“ vyjadřuje změnu stavu — papír se stal zmačkaným."),
  sz("Lopatou _hrnul sníh na hromadu.", "shrnul", "s", "předpona s- znamená dohromady", "Předpona „s-“ znamená dohromady — shrnout sníh na jedno místo."),
  sz("Mléko v teple _kyslo.", "zkyslo", "z", "předpona z- znamená změnu stavu", "Předpona „z-“ vyjadřuje změnu stavu — mléko se stalo kyselým."),
  sz("Ze střechy _padal starý sníh.", "spadal", "s", "předpona s- znamená shora dolů", "Předpona „s-“ znamená pohyb shora dolů — spadnout ze střechy."),
  sz("Barva na slunci úplně _bledla.", "zbledla", "z", "předpona z- znamená změnu stavu", "Předpona „z-“ vyjadřuje změnu stavu — barva se stala bledou."),
];

// ── L3 — rozhoduje význam ────────────────────────────────────────────

const L3: Polozka[] = [
  sz("V rádiu běžela _práva o počasí.", "zpráva", "z", "rozhoduje význam slova", "„Zpráva“ je sdělení, novina. Píše se se z."),
  sz("O dům se stará _práva budovy.", "správa", "s", "rozhoduje význam slova", "„Správa“ znamená spravování, vedení. Píše se s s."),
  sz("Truhlář _bil dvě desky dohromady.", "sbil", "s", "rozhoduje význam slova", "„Sbít“ znamená stlouct dohromady. Píše se s s."),
  sz("Nikdo nesmí nikoho _bít.", "zbít", "z", "rozhoduje význam slova", "„Zbít“ znamená ztlouct někoho. Píše se se z."),
  sz("Rodiče mi _volili jet na tábor.", "svolili", "s", "rozhoduje význam slova", "„Svolit“ znamená dovolit, souhlasit. Píše se s s."),
  sz("Třída si _volila svého zástupce.", "zvolila", "z", "rozhoduje význam slova", "„Zvolit“ znamená vybrat hlasováním. Píše se se z."),
  sz("Nemá smysl si pořád _těžovat.", "stěžovat", "s", "rozhoduje význam slova", "„Stěžovat si“ znamená naříkat. Píše se s s."),
  sz("Déšť nám hodně _těžoval cestu.", "ztěžoval", "z", "rozhoduje význam slova", "„Ztěžovat“ znamená dělat něco těžším. Píše se se z."),
  sz("Tabuli po hodině _mažeme.", "smažeme", "s", "rozhoduje význam slova", "„Smazat“ znamená setřít dohromady pryč. Píše se s s."),
  sz("Od bláta si _mazal kalhoty.", "zmazal", "z", "rozhoduje význam slova", "„Zmazat“ znamená ušpinit — změna stavu. Píše se se z."),
  sz("Podpisem smlouvu _tvrdíme.", "stvrdíme", "s", "rozhoduje význam slova", "„Stvrdit“ znamená potvrdit. Píše se s s."),
  sz("Chleba na vzduchu _tvrdl.", "ztvrdl", "z", "rozhoduje význam slova", "„Ztvrdnout“ znamená stát se tvrdým — změna stavu. Píše se se z."),
  sz("Musíme si _jednat schůzku.", "sjednat", "s", "rozhoduje význam slova", "„Sjednat“ znamená domluvit. Píše se s s."),
  sz("Učitel ve třídě _jednal pořádek.", "zjednal", "z", "rozhoduje význam slova", "„Zjednat pořádek“ znamená udělat pořádek. Píše se se z."),
  iy("Na drátě seděli ptác_.", "ptáci", "i", "je to 1. pád množného čísla u rodu mužského životného", "„Ptáci“ je 1. pád množného čísla, rod mužský životný (vzor pán) — koncovka -i."),
  iy("Děti na zahradě krmily pták_.", "ptáky", "y", "je to 4. pád množného čísla u vzoru pán", "„Ptáky“ je 4. pád množného čísla (koho, co?) — koncovka -y."),
  iy("Na dvoře hlasitě štěkali ps_.", "psi", "i", "je to 1. pád množného čísla u rodu mužského životného", "„Psi“ je 1. pád množného čísla, rod mužský životný — koncovka -i."),
  iy("Každý večer venčíme naše ps_.", "psy", "y", "je to 4. pád množného čísla u vzoru pán", "„Psy“ je 4. pád množného čísla (koho, co venčíme?) — koncovka -y."),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return urovenJednoPravidlo(L1, "Před prázdným místem je začátek slova — podívej se, jestli tam není předpona.");
  if (level === 2) return urovenMix(L2);
  return urovenVyznam(L3);
}

export const DOPLNOVACIDIKTAT4: TopicMetadata[] = [
  {
    id: "g4-cjl-doplnovaci-diktat",
    // Diktát nemá v RVP vlastní uzel — je to formát napříč jevy. Kotví se
    // proto na hlavní pravopisný uzel ročníku, který procvičuje nejvíc.
    rvpNodeId: "g4-cjl-jazykova-vychova-stavba-slova-pravopis-predpon-vy-vy-s-z-vz",
    title: "Doplňovací diktát",
    studentTitle: "Diktát",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Doplníš chybějící písmeno a sám poznáš, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "pravopis", "předpony", "předložky", "vy- vý-", "s z vz"],
    goals: [
      "Poznat, o jaký pravopisný jev ve větě jde.",
      "Správně psát předponu vy-/vý- a rozlišit předpony s- a z-.",
      "Vybrat předložku s nebo z podle pádu.",
      "Rozhodnout podle významu tam, kde s- a z- mění smysl slova.",
    ],
    boundaries: [
      "Jevy 4. ročníku — předpony, předložky, vzory podstatných jmen; vyjmenovaná slova jako opakování.",
      "Bez shody přísudku s podmětem (je v 5. ročníku).",
      "Jedno chybějící písmeno ve větě.",
    ],
    gradeRange: [4, 4],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "V diktátu nejdřív zjisti, o jaké pravidlo jde — teprve potom doplňuj.",
      steps: [
        "Přečti si celou větu a ujasni si, co znamená.",
        "Je prázdné místo na začátku slova? Pak jde nejspíš o předponu nebo předložku.",
        "Předpona vy-/vý- má vždycky y. Předpona s- = dohromady nebo shora dolů, z- = změna stavu.",
        "Předložka: s kým, s čím (7. pád) → s. Z čeho, odkud (2. pád) → z.",
        "Uvnitř slova po obojetné souhlásce se ptej na vyjmenovaná slova.",
      ],
      commonMistake: "Dítě se řídí tím, co slyší. Jenže „s“ i „z“ znějí ve slově skoro stejně — rozhodnout musí význam: „sbít desky“ (dohromady) × „zbít někoho“ (ublížit).",
      example: "„V rádiu běžela _práva.“ → sdělení → zpráva. „O dům se stará _práva budovy.“ → spravování → správa.",
    },
  },
];
