import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { iy, shoda, urovenJednoPravidlo, urovenMix, urovenVyznam, type Polozka } from "@/content/_diktat";

// Doplňovací diktát pro 5. ročník (2026-09-26).
//
// Hlavní jev páté třídy je shoda přísudku s podmětem — koncovka -i/-y/-a
// v minulém čase. L1 má podmět vždy vyjádřený a hned před přísudkem.
// L3 ho schovává: podmět je několikanásobný, nebo stojí až v předchozí
// větě. To je přesně ten krok navíc, kvůli kterému děti chybují.
//
// L1 shoda s vyjádřeným podmětem · L2 promíchané jevy (shoda, koncovky
// přídavných jmen, předpony, vyjmenovaná slova) · L3 podmět, který se
// musí nejdřív najít.

// ── L1 — podmět je vyjádřený a stojí hned u přísudku ─────────────────

const L1: Polozka[] = [
  shoda("Chlapci si hrál_ na hřišti.", "hráli", "i", "Podmět „chlapci“ je rod mužský životný, proto -i."),
  shoda("Dívky si hrál_ na zahradě.", "hrály", "y", "Podmět „dívky“ je rod ženský, proto -y."),
  shoda("Koťata si hrál_ s klubkem.", "hrála", "a", "Podmět „koťata“ je rod střední, proto -a."),
  shoda("Stromy rostl_ podél cesty.", "rostly", "y", "Podmět „stromy“ je rod mužský neživotný, proto -y."),
  shoda("Ptáci odletěl_ na jih.", "odletěli", "i", "Podmět „ptáci“ je rod mužský životný, proto -i."),
  shoda("Lodě připlul_ do přístavu.", "připluly", "y", "Podmět „lodě“ je rod ženský, proto -y."),
  shoda("Okna byl_ dokořán.", "byla", "a", "Podmět „okna“ je rod střední, proto -a."),
  shoda("Psi štěkal_ na kolemjdoucí.", "štěkali", "i", "Podmět „psi“ je rod mužský životný, proto -i."),
  shoda("Kočky spal_ na peci.", "spaly", "y", "Podmět „kočky“ je rod ženský, proto -y."),
  shoda("Housata plaval_ v rybníku.", "plavala", "a", "Podmět „housata“ je rod střední, proto -a."),
  shoda("Hasiči přijel_ včas.", "přijeli", "i", "Podmět „hasiči“ je rod mužský životný, proto -i."),
  shoda("Židle stál_ u stolu.", "stály", "y", "Podmět „židle“ je rod ženský, proto -y."),
  shoda("Města ležel_ blízko řeky.", "ležela", "a", "Podmět „města“ je rod střední, proto -a."),
  shoda("Traktory oral_ pole.", "oraly", "y", "Podmět „traktory“ je rod mužský neživotný, proto -y."),
];

// ── L2 — promíchané jevy ─────────────────────────────────────────────

const L2: Polozka[] = [
  shoda("Sousedé postavil_ nový plot.", "postavili", "i", "Podmět „sousedé“ je rod mužský životný, proto -i."),
  shoda("Květiny na okně uvadl_.", "uvadly", "y", "Podmět „květiny“ je rod ženský, proto -y."),
  shoda("Štěňata usnul_ v košíku.", "usnula", "a", "Podmět „štěňata“ je rod střední, proto -a."),
  shoda("Autobusy odjel_ z nádraží.", "odjely", "y", "Podmět „autobusy“ je rod mužský neživotný, proto -y."),
  iy("Před domem stojí star_ dub.", "starý", "ý", "tvrdé přídavné jméno v 1. pádě rodu mužského má koncovku -ý", "„Starý“ je tvrdé přídavné jméno (vzor mladý), 1. pád rodu mužského — koncovka -ý."),
  iy("Venku je příjemné jarn_ počasí.", "jarní", "í", "měkké přídavné jméno má koncovku -í ve všech rodech", "„Jarní“ je měkké přídavné jméno (vzor jarní) — koncovka -í."),
  iy("Na návštěvu přišli mlad_ lidé.", "mladí", "í", "tvrdé přídavné jméno u rodu mužského životného v množném čísle má koncovku -í", "„Mladí lidé“ — rod mužský životný v množném čísle, proto -í."),
  iy("Potkali jsme na ulici ciz_ lidi.", "cizí", "í", "měkké přídavné jméno má koncovku -í", "„Cizí“ je měkké přídavné jméno — koncovka -í."),
  iy("Do pokoje koupili nov_ nábytek.", "nový", "ý", "tvrdé přídavné jméno v 1. pádě rodu mužského má koncovku -ý", "„Nový“ je tvrdé přídavné jméno, 1. pád rodu mužského neživotného — koncovka -ý."),
  iy("Ráno jsme v_razili na výlet.", "vyrazili", "y", "předpona vy- se vždycky píše s y", "Předpona vy- se píše s krátkým y."),
  iy("Z kopce byl pěkný v_hled.", "výhled", "ý", "předpona vý- se vždycky píše s y", "Předpona vý- se píše s y a je tu dlouhá — ý."),
  iy("Ten chlapec je velmi b_strý.", "bystrý", "y", "„bystrý“ je vyjmenované slovo po B", "„Bystrý“ je vyjmenované slovo po B — píše se krátké y."),
  iy("Na svůj výkon byl právem p_šný.", "pyšný", "y", "„pyšný“ patří k vyjmenovanému slovu „pýcha“ po P", "„Pyšný“ patří k vyjmenovanému slovu „pýcha“ — po P se píše y. Tady je samohláska krátká."),
  iy("Na louce bzučel hm_z.", "hmyz", "y", "„hmyz“ je vyjmenované slovo po M", "„Hmyz“ je vyjmenované slovo po M — krátké y."),
];

// ── L3 — podmět se musí nejdřív najít ────────────────────────────────

const L3: Polozka[] = [
  shoda("Maminka a tatínek přišl_ pozdě domů.", "přišli", "i", "Podmět je několikanásobný a jeden jeho člen („tatínek“) je rod mužský životný — ten rozhoduje, proto -i."),
  shoda("Kluci a holky si spolu hrál_.", "hráli", "i", "V několikanásobném podmětu je „kluci“ rod mužský životný — ten má přednost, proto -i."),
  shoda("Dívky a jejich maminky vařil_ oběd.", "vařily", "y", "Oba členy podmětu jsou rodu ženského, žádný mužský životný tu není — proto -y."),
  shoda("Na zahradě rostl_ stromy a keře.", "rostly", "y", "Podmět „stromy a keře“ je rod mužský neživotný — proto -y, ne -i."),
  shoda("Pes a kočka spal_ vedle sebe.", "spali", "i", "„Pes“ je rod mužský životný a v několikanásobném podmětu rozhoduje — proto -i."),
  shoda("Lavice a židle stál_ u zdi.", "stály", "y", "Oba členy podmětu jsou rodu ženského — proto -y."),
  shoda("Koťata a štěňata si hrál_ na dvoře.", "hrála", "a", "Oba členy podmětu jsou rodu středního — proto -a."),
  shoda("Učitelé a žáci vyrazil_ na výlet.", "vyrazili", "i", "Oba členy podmětu jsou rodu mužského životného — proto -i."),
  shoda("Auta a autobusy stál_ v koloně.", "stály", "y", "„Auta“ je rod střední, „autobusy“ rod mužský neživotný. Mužský životný tu není, proto -y."),
  shoda("Bratři odjeli a vrátil_ se až v neděli.", "vrátili", "i", "Podmět v druhé větě není vyjádřený — platí „bratři“ z věty první, rod mužský životný, proto -i."),
  shoda("Lodě vypluly ráno a připlul_ až večer.", "připluly", "y", "Nevyjádřený podmět je „lodě“ z první věty, rod ženský — proto -y."),
  shoda("Koťata se probudila a začal_ si hrát.", "začala", "a", "Nevyjádřený podmět je „koťata“ z první věty, rod střední — proto -a."),
  shoda("Zvířata v zoo dostal_ ráno krmení.", "dostala", "a", "Podmět „zvířata“ je rod střední, proto -a — i když je od přísudku dál."),
  shoda("Naši sportovci na hřišti dlouho trénoval_.", "trénovali", "i", "Podmět „sportovci“ je rod mužský životný, proto -i — i když mezi ním a přísudkem stojí další slova."),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return urovenJednoPravidlo(L1, "Najdi podmět — to slovo, které říká, KDO nebo CO dělá. Podle jeho rodu se řídí koncovka přísudku.");
  if (level === 2) return urovenMix(L2);
  return urovenVyznam(L3);
}

export const DOPLNOVACIDIKTAT5: TopicMetadata[] = [
  {
    id: "g5-cjl-doplnovaci-diktat",
    // Diktát nemá v RVP vlastní uzel — je to formát napříč jevy. Kotví se
    // proto na hlavní pravopisný uzel ročníku, který procvičuje nejvíc.
    rvpNodeId: "g5-cjl-jazykova-vychova-skladba-shoda-prisudku-s-podmetem",
    title: "Doplňovací diktát",
    studentTitle: "Diktát",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Doplníš chybějící písmeno a sám poznáš, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "pravopis", "shoda přísudku s podmětem", "koncovky přídavných jmen"],
    goals: [
      "Najít podmět, i když není hned u přísudku nebo není vyjádřený.",
      "Určit rod podmětu a podle něj napsat koncovku přísudku.",
      "Zvládnout několikanásobný podmět, kde rozhoduje rod mužský životný.",
      "Poznat, o jaký pravopisný jev ve větě vůbec jde.",
    ],
    boundaries: [
      "Jevy 5. ročníku — shoda přísudku s podmětem, koncovky přídavných jmen; předpony a vyjmenovaná slova jako opakování.",
      "Bez skloňování podle všech vzorů (to je v 6. ročníku).",
      "Jedno chybějící písmeno ve větě.",
    ],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "U shody nejdřív najdi podmět a urči jeho rod — teprve pak piš koncovku.",
      steps: [
        "Zeptej se: kdo nebo co to dělá? To je podmět.",
        "Když podmět ve větě není, hledej ho ve větě předchozí.",
        "Urči rod podmětu: mužský životný → -i, ženský nebo mužský neživotný → -y, střední → -a.",
        "U několikanásobného podmětu stačí jediný člen rodu mužského životného a píše se -i.",
        "Pokud nejde o shodu, podívej se, jestli nejde o předponu nebo o vyjmenované slovo.",
      ],
      commonMistake: "Dítě se řídí slovem, které stojí nejblíž přísudku, místo aby našlo skutečný podmět. Ve větě „Na zahradě rostly stromy a keře“ není podmět „zahrada“, ale „stromy a keře“.",
      example: "„Pes a kočka spal_ vedle sebe.“ → v podmětu je „pes“, rod mužský životný → spali.",
    },
  },
];
