import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { iy, skupina, shoda, urovenJednoPravidlo, urovenMix, urovenVyznam, type Polozka } from "@/content/_diktat";

// Doplňovací diktát pro 6. ročník (2026-09-26).
//
// Šestá třída sjednocuje, co se dosud učilo po kouskách: koncovky podle
// vzorů, shoda, velká písmena. L3 proto míří na dvě věci, kde chybují
// i dospělí — několikanásobný podmět s různými rody a velká písmena
// ve VÍCESLOVNÝCH názvech (Karlův most × Nové Město na Moravě).
//
// L1 koncovky podstatných jmen podle vzorů · L2 promíchané jevy
// L3 podmět s různými rody a víceslovné vlastní názvy.

const ZIVOTNY = "u rodu mužského životného je v 1. pádě množného čísla koncovka -i";
const NEZIVOTNY = "u rodu mužského neživotného je v 1. i 4. pádě množného čísla koncovka -y";
const ZENSKY = "u rodu ženského (vzor žena) je v 1. i 4. pádě množného čísla koncovka -y";

// ── L1 — koncovky podstatných jmen podle vzorů ───────────────────────

const L1: Polozka[] = [
  iy("V lese rostou statné dub_.", "duby", "y", NEZIVOTNY, "„Duby“ — rod mužský neživotný (vzor hrad), 1. pád množného čísla, koncovka -y."),
  iy("Na drátě seděli tři kos_.", "kosi", "i", ZIVOTNY, "„Kosi“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("Rybáři chytili dva kapr_.", "kapry", "y", "ve 4. pádě množného čísla má i rod mužský životný koncovku -y", "„Kapry“ — 4. pád množného čísla (koho, co chytili?), koncovka -y."),
  iy("Před domem stojí vysoké topol_.", "topoly", "y", NEZIVOTNY, "„Topoly“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("Nad polem letěli holub_.", "holubi", "i", ZIVOTNY, "„Holubi“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("Kolem zahrady stojí nové plot_.", "ploty", "y", NEZIVOTNY, "„Ploty“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("V čisté řece plavou pstruz_.", "pstruzi", "i", ZIVOTNY, "„Pstruzi“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("Na poli od rána pracují traktor_.", "traktory", "y", NEZIVOTNY, "„Traktory“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("Na návsi rostou staré líp_.", "lípy", "y", ZENSKY, "„Lípy“ — rod ženský (vzor žena), 1. pád množného čísla, koncovka -y."),
  iy("Na louce se pásly srn_.", "srny", "y", ZENSKY, "„Srny“ — rod ženský (vzor žena), koncovka -y."),
  iy("Ve třídě sedí pilní žác_.", "žáci", "i", ZIVOTNY, "„Žáci“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("Do lesa jsme šli na hřib_.", "hřiby", "y", NEZIVOTNY, "„Hřiby“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("Na lavici ležely nové sešit_.", "sešity", "y", NEZIVOTNY, "„Sešity“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("Na skále hnízdili sokol_.", "sokoli", "i", ZIVOTNY, "„Sokoli“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("V zoo jsme viděli lv_.", "lvy", "y", "ve 4. pádě množného čísla má i rod mužský životný koncovku -y", "„Lvy“ — 4. pád množného čísla (koho, co jsme viděli?), koncovka -y."),
];

// ── L2 — promíchané jevy ─────────────────────────────────────────────

/** Velké × malé písmeno v jednoslovném vlastním jméně. */
const velke = (veta: string, slovo: string, V: string, proc: string): Polozka =>
  skupina(veta, slovo, V, [
    [V.toLowerCase(), `„${slovo}“ je vlastní jméno — píše se s velkým písmenem.`],
  ], "velké písmeno ve vlastních jménech", proc);

const L2: Polozka[] = [
  iy("Na poli dozrávaly klas_.", "klasy", "y", NEZIVOTNY, "„Klasy“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  iy("Do úlu se vraceli včelař_"
    + " s medem.", "včelaři", "i", ZIVOTNY, "„Včelaři“ — rod mužský životný (vzor pán), 1. pád množného čísla, koncovka -i."),
  iy("Před školou parkovaly autobus_.", "autobusy", "y", NEZIVOTNY, "„Autobusy“ — rod mužský neživotný (vzor hrad), koncovka -y."),
  shoda("Sportovci na hřišti dlouho trénoval_.", "trénovali", "i", "Podmět „sportovci“ je rod mužský životný, proto -i."),
  shoda("Lodě v přístavu kotvil_ celou noc.", "kotvily", "y", "Podmět „lodě“ je rod ženský, proto -y."),
  shoda("Telata se pásl_ na louce.", "pásla", "a", "Podmět „telata“ je rod střední, proto -a."),
  iy("Ráno jsme v_razili ještě za tmy.", "vyrazili", "y", "předpona vy- se vždycky píše s y", "Předpona vy- se píše s krátkým y."),
  iy("Z rozhledny byl nádherný v_hled.", "výhled", "ý", "předpona vý- se vždycky píše s y", "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Na louce bzučel hm_z.", "hmyz", "y", "„hmyz“ je vyjmenované slovo po M", "„Hmyz“ je vyjmenované slovo po M — krátké y."),
  iy("Ten úkol si musím ještě rozm_slet.", "rozmyslet", "y", "„rozmyslet“ patří k vyjmenovanému slovu „mysl“ po M", "„Rozmyslet“ patří do rodiny vyjmenovaného slova po M — píše se y."),
  velke("Na výlet jsme jeli do _rna.", "Brna", "B", "Název města je vlastní jméno."),
  velke("Řeka _tava se vlévá do Vltavy.", "Otava", "O", "Název řeky je vlastní jméno."),
  velke("O prázdninách jsme byli v _horvatsku.", "Chorvatsku", "C", "Název státu je vlastní jméno."),
  velke("Knihu napsal spisovatel Karel _apek.", "Čapek", "Č", "Příjmení je vlastní jméno."),
];

// ── L3 — několikanásobný podmět a víceslovné názvy ───────────────────

/** Ve víceslovném názvu se druhé slovo píše velkým jen tehdy, je-li samo vlastním jménem. */
const nazev = (veta: string, nazevCely: string, spravne: string, proc: string): Polozka =>
  skupina(veta, nazevCely, spravne, [
    [spravne === spravne.toUpperCase() ? spravne.toLowerCase() : spravne.toUpperCase(),
      `Tady ne — správně je „${nazevCely}“. ${proc}`],
  ], "velká písmena ve víceslovných názvech", proc);

const L3: Polozka[] = [
  shoda("Maminka a tatínek přijel_ až večer.", "přijeli", "i", "Podmět je několikanásobný a „tatínek“ je rod mužský životný — ten rozhoduje, proto -i."),
  shoda("Dívky a jejich maminky upekl_ buchty.", "upekly", "y", "Oba členy podmětu jsou rodu ženského, mužský životný tu není — proto -y."),
  shoda("Na zahradě rostl_ stromy a keře.", "rostly", "y", "Podmět „stromy a keře“ je rod mužský neživotný — proto -y, ne -i."),
  shoda("Pes a kočka spal_ u kamen.", "spali", "i", "„Pes“ je rod mužský životný a v několikanásobném podmětu má přednost — proto -i."),
  shoda("Koťata a štěňata si hrál_ na dvoře.", "hrála", "a", "Oba členy podmětu jsou rodu středního — proto -a."),
  shoda("Auta a autobusy stál_ v koloně.", "stály", "y", "„Auta“ je rod střední, „autobusy“ rod mužský neživotný. Mužský životný chybí, proto -y."),
  shoda("Bratři odjeli ráno a vrátil_ se v neděli.", "vrátili", "i", "Podmět druhé věty není vyjádřený — platí „bratři“ z věty první, rod mužský životný."),
  shoda("Chlapci a děvčata soutěžil_ společně.", "soutěžili", "i", "Několikanásobný podmět obsahuje „chlapci“ — rod mužský životný. Ten má přednost před rodem středním, proto -i."),
  nazev("Přes Vltavu vede Karlův _ost.", "Karlův most", "m", "„Most“ je obecné podstatné jméno, ne vlastní jméno — v názvu se píše malým písmenem."),
  nazev("Socha stojí na Václavském _áměstí.", "Václavské náměstí", "n", "„Náměstí“ je obecné podstatné jméno — v názvu se píše malým písmenem."),
  nazev("V Praze jsme navštívili Národní _ivadlo.", "Národní divadlo", "d", "„Divadlo“ je obecné podstatné jméno — v názvu se píše malým písmenem."),
  nazev("Žijeme v České _epublice.", "Česká republika", "r", "„Republika“ je obecné podstatné jméno — v názvu státu se píše malým písmenem."),
  nazev("Babička bydlí v Novém _ěstě na Moravě.", "Nové Město na Moravě", "M", "Tady je „Město“ součástí vlastního jména obce, proto velké M."),
  nazev("Vlak jede do Hradce _rálové.", "Hradec Králové", "K", "„Králové“ je součástí vlastního jména města, proto velké K."),
  nazev("Lázně jsou v Karlových _arech.", "Karlovy Vary", "V", "„Vary“ jsou součástí vlastního jména města, proto velké V."),
  nazev("Loď pluje po Severním ledovém _ceánu.", "Severní ledový oceán", "o", "„Oceán“ je obecné podstatné jméno — v názvu se píše malým písmenem."),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return urovenJednoPravidlo(L1, "Urči rod a číslo podstatného jména a najdi jeho vzor — podle něj se řídí koncovka.");
  if (level === 2) return urovenMix(L2);
  return urovenVyznam(L3);
}

export const DOPLNOVACIDIKTAT6: TopicMetadata[] = [
  {
    id: "g6-cjl-doplnovaci-diktat",
    // Diktát nemá v RVP vlastní uzel — je to formát napříč jevy. Kotví se
    // proto na hlavní pravopisný uzel ročníku, který procvičuje nejvíc.
    rvpNodeId: "g6-cjl-jazykova-vychova-tvaroslovi-podstatna-jmena-sklonovani-mluvnicke-kategorie",
    title: "Doplňovací diktát",
    studentTitle: "Diktát",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Doplníš chybějící písmeno a sám poznáš, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "pravopis", "koncovky podstatných jmen", "shoda", "velká písmena"],
    goals: [
      "Určit vzor podstatného jména a podle něj napsat koncovku.",
      "Zvládnout shodu i u několikanásobného podmětu s různými rody.",
      "Rozhodnout o velkém písmenu ve víceslovných vlastních názvech.",
      "Poznat, o jaký pravopisný jev ve větě vůbec jde.",
    ],
    boundaries: [
      "Jevy do 6. ročníku — koncovky podle vzorů, shoda, velká písmena; předpony a vyjmenovaná slova jako opakování.",
      "Bez pravopisu přejatých slov a bez složitých souvětí s interpunkcí.",
      "Jedno chybějící písmeno ve větě.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "Nejdřív urči, o jaký jev jde: koncovka podle vzoru, shoda s podmětem, nebo velké písmeno?",
      steps: [
        "Je prázdné místo na konci podstatného jména? Urči rod, číslo, pád a vzor.",
        "Rod mužský životný v 1. pádě množného čísla → -i. Neživotný a 4. pád → -y.",
        "Je to koncovka přísudku v minulém čase? Najdi podmět a urči jeho rod.",
        "U několikanásobného podmětu stačí jediný člen rodu mužského životného a píše se -i.",
        "Je to vlastní název o více slovech? Velké písmeno má jen to slovo, které je samo vlastním jménem.",
      ],
      commonMistake: "U víceslovných názvů žáci píšou velké písmeno u všech slov. Obecné podstatné jméno v názvu ale zůstává malé: „Karlův most“, „Václavské náměstí“, „Česká republika“ — na rozdíl od „Nové Město na Moravě“, kde je „Město“ součástí jména obce.",
      example: "„Přes Vltavu vede Karlův _ost.“ → most je obecné jméno → malé m. Ale „v Novém _ěstě na Moravě“ → součást jména obce → velké M.",
    },
  },
];
