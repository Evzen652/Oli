import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { iy, skupina, urovenJednoPravidlo, urovenMix, urovenVyznam, type Polozka } from "@/content/_diktat";

// Doplňovací diktát pro 3. ročník (2026-09-26).
//
// Třetí třída přibírá obojetné souhlásky a vyjmenovaná slova — to je tady
// hlavní jev. Věty se vědomě NEPŘEKRÝVAJÍ s tématem „Vyjmenovaná slova“
// (`vyjmenovanaSlova.ts`): stejné dvojice význam × zápis by dítě řešilo
// podruhé na stejném materiálu. Proto jsou tu jiná vyjmenovaná slova
// a v L3 jiné dvojice (my × mi, pyl × pil, vysel × visel, nabýt × nabít).
//
// L1 jedno pravidlo (vyjmenovaná slova) · L2 pravidla promíchaná
// (vyjmenovaná + tvrdé/měkké + velká písmena) · L3 dvojice, kde o zápisu
// rozhoduje význam.

const VYJM = (s: string, slovo: string) => `„${slovo}“ patří mezi vyjmenovaná slova po ${s} nebo do jejich rodiny`;
const TVRDA = "po tvrdé souhlásce (h, ch, k, r, d, t, n) se píše y/ý";
const MEKKA = "po měkké souhlásce (ž, š, č, ř, c, j) se píše i/í";

// ── L1 — vyjmenovaná slova ───────────────────────────────────────────

const L1: Polozka[] = [
  iy("Do pokoje koupili nový náb_tek.", "nábytek", "y", VYJM("B", "nábytek"), "„Nábytek“ patří do rodiny vyjmenovaného slova „dobytek“ — po B se píše y."),
  iy("Ob_vatelé vesnice slavili posvícení.", "obyvatelé", "y", VYJM("B", "obyvatelé"), "„Obyvatel“ patří k vyjmenovanému slovu „bydlit“ — po B se píše y."),
  iy("Na obloze se zablesklo a bl_skalo.", "blýskalo", "ý", VYJM("L", "blýskalo"), "„Blýskat se“ je vyjmenované slovo po L. Samohláska je dlouhá — ý."),
  iy("Sl_šel jsi ten zvuk?", "slyšel", "y", VYJM("L", "slyšel"), "„Slyšet“ je vyjmenované slovo po L — krátké y."),
  iy("Lék se špatně pol_ká.", "polyká", "y", VYJM("L", "polyká"), "„Polykat“ je vyjmenované slovo po L — krátké y."),
  iy("Na louce bzučí hm_z.", "hmyz", "y", VYJM("M", "hmyz"), "„Hmyz“ je vyjmenované slovo po M — krátké y."),
  iy("Musím si to ještě rozm_slet.", "rozmyslet", "y", VYJM("M", "rozmyslet"), "„Rozmyslet“ patří k vyjmenovanému slovu „mysl“ — po M se píše y."),
  iy("Za tu chybu budeš p_kat.", "pykat", "y", VYJM("P", "pykat"), "„Pykat“ je vyjmenované slovo po P — krátké y."),
  iy("Netop_r loví za tmy.", "netopýr", "ý", VYJM("P", "netopýr"), "„Netopýr“ je vyjmenované slovo po P. Samohláska je dlouhá — ý."),
  iy("Na větvi seděla s_kora.", "sýkora", "ý", VYJM("S", "sýkora"), "„Sýkora“ je vyjmenované slovo po S. Samohláska je dlouhá — ý."),
  iy("Babička s_pe ptákům zrní.", "sype", "y", VYJM("S", "sype"), "„Sypat“ je vyjmenované slovo po S — krátké y."),
  iy("Ten strom je opravdu v_soký.", "vysoký", "y", VYJM("V", "vysoký"), "„Vysoký“ je vyjmenované slovo po V — krátké y."),
  iy("Na nový rozvrh si musíš zv_knout.", "zvyknout", "y", VYJM("V", "zvyknout"), "„Zvykat si“ patří k vyjmenovanému slovu „zvyk“ — po V se píše y."),
  iy("Jak se to město naz_vá?", "nazývá", "ý", VYJM("Z", "nazývá"), "„Nazývat“ je vyjmenované slovo po Z. Samohláska je tu dlouhá — ý."),
  iy("Jaz_k je sval v ústech.", "jazyk", "y", VYJM("Z", "jazyk"), "„Jazyk“ je vyjmenované slovo po Z — krátké y."),
];

// ── L2 — promíchaná pravidla ─────────────────────────────────────────

const velke = (veta: string, slovo: string, V: string, druh: string): Polozka =>
  skupina(veta, slovo, V, [
    [V.toLowerCase(), `„${slovo}“ je vlastní jméno, a ta se píšou s velkým písmenem.`],
  ], "velké písmeno ve vlastních jménech", `${druh} je vlastní jméno — píše se s velkým písmenem.`);

const L2: Polozka[] = [
  iy("U potoka stojí starý ml_n.", "mlýn", "ý", VYJM("L", "mlýn"), "„Mlýn“ je vyjmenované slovo po L. Samohláska je dlouhá — ý."),
  iy("P_cha předchází pád.", "pýcha", "ý", VYJM("P", "pýcha"), "„Pýcha“ je vyjmenované slovo po P. Samohláska je dlouhá — ý."),
  iy("Po obědě jsem úplně s_tý.", "sytý", "y", VYJM("S", "sytý"), "„Sytý“ je vyjmenované slovo po S — krátké y."),
  iy("U řeky žije v_dra.", "vydra", "y", VYJM("V", "vydra"), "„Vydra“ je vyjmenované slovo po V — krátké y."),
  iy("Na talíři zůstal zb_tek večeře.", "zbytek", "y", VYJM("B", "zbytek"), "„Zbytek“ je od slovesa „zbýt“, tedy z rodiny vyjmenovaného „být“ — obojetná je tu B, proto y."),
  iy("Ráno jsme ch_tili velkou rybu.", "chytili", "y", TVRDA, "CH je tvrdá souhláska, proto se píše y."),
  iy("Malá koč_čka spala v košíku.", "kočička", "i", MEKKA, "Č je měkká souhláska, proto se píše i."),
  iy("Na stole leží č_stý ubrus.", "čistý", "i", MEKKA, "Č je měkká souhláska, proto se píše i."),
  iy("Na dvoře kdákaly slep_ce.", "slepice", "i", MEKKA, "C je měkká souhláska, proto se píše i."),
  iy("Na poli se zlatí ž_to.", "žito", "i", MEKKA, "Ž je měkká souhláska, proto se píše i."),
  velke("O prázdninách pojedeme do _rahy.", "Prahy", "P", "Název města"),
  velke("Řeka _abe se vlévá do moře.", "Labe", "L", "Název řeky"),
  velke("Nejvyšší česká hora je _něžka.", "Sněžka", "S", "Název hory"),
  velke("Moje kamarádka se jmenuje _va.", "Eva", "E", "Křestní jméno"),
  velke("Rodina _ovákových bydlí vedle.", "Novákových", "N", "Příjmení"),
  velke("V létě jsme byli u řeky _tavy.", "Otavy", "O", "Název řeky"),
];

// ── L3 — rozhoduje význam ────────────────────────────────────────────

const L3: Polozka[] = [
  iy("Podej m_ prosím tu knihu.", "mi", "i", "„mi“ znamená „mně“ a mezi vyjmenovaná slova nepatří", "„Mi“ znamená „mně“ — zájmeno. Vyjmenované slovo to není, píše se i."),
  iy("M_ jsme o tom vůbec nevěděli.", "My", "y", "„my“ je vyjmenované slovo po M", "„My“ je zájmeno z řady vyjmenovaných slov po M — píše se y."),
  iy("Včely přenášejí p_l z květu na květ.", "pyl", "y", VYJM("P", "pyl"), "„Pyl“ je vyjmenované slovo po P — prášek z květů."),
  iy("Dědeček p_l čaj z hrnku.", "pil", "i", "„pil“ je od slovesa pít a mezi vyjmenovaná slova nepatří", "„Pil“ je od slovesa „pít“ — vyjmenované slovo to není, píše se i."),
  iy("Sedlák na jaře v_sel obilí.", "vysel", "y", "je to předpona vy-, a ta se vždycky píše s y", "„Vysel“ je sloveso „sít“ s předponou vy-. Vyjmenované slovo to není — y je tu kvůli předponě."),
  iy("Kabát v_sel na věšáku.", "visel", "i", "„visel“ je od slovesa viset a mezi vyjmenovaná slova nepatří", "„Visel“ je od slovesa „viset“ — vyjmenované slovo to není, píše se i."),
  iy("Musím nab_t vybitý mobil.", "nabít", "í", "„nabít“ je od slovesa bít a mezi vyjmenovaná slova nepatří", "„Nabít“ je od „bít“ (tlouct, plnit energií) — píše se i."),
  iy("Chtěl bych nab_t nové zkušenosti.", "nabýt", "ý", VYJM("B", "nabýt"), "„Nabýt“ je od vyjmenovaného „být“ (získat) — píše se y."),
  iy("Vlčice v noci v_la na měsíc.", "vyla", "y", VYJM("V", "vyla"), "„Vyla“ je od vyjmenovaného slovesa „výt“ — píše se y."),
  iy("Maminka v_la věnec z kopretin.", "vila", "i", "„vila“ je od slovesa vít, tedy splétat, a mezi vyjmenovaná slova nepatří", "„Vila“ je od slovesa „vít“ (splétat) — vyjmenované slovo to není, píše se i."),
  iy("V zoo jsme viděli m_vala.", "mývala", "ý", VYJM("M", "mývala"), "„Mýval“ patří k vyjmenovanému „mýt“ — to zvíře si potravu omývá."),
  iy("Dřív jsem m_val delší vlasy.", "míval", "í", "„míval“ je od slovesa mít a mezi vyjmenovaná slova nepatří", "„Míval“ je od slovesa „mít“ (vlastnit) — vyjmenované slovo to není, píše se i."),
  iy("Kovář b_l kladivem do železa.", "bil", "i", "„bil“ je od slovesa bít, tedy tlouct, a mezi vyjmenovaná slova nepatří", "„Bil“ je od slovesa „bít“ (tlouct) — píše se i."),
  iy("Chci jednou b_t lékařem.", "být", "ý", VYJM("B", "být"), "„Být“ znamená existovat — vyjmenované slovo po B, píše se y."),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return urovenJednoPravidlo(L1, "Před prázdným místem je obojetná souhláska — patří to slovo mezi vyjmenovaná, nebo do jejich rodiny?");
  if (level === 2) return urovenMix(L2);
  return urovenVyznam(L3);
}

export const DOPLNOVACIDIKTAT3: TopicMetadata[] = [
  {
    id: "g3-cjl-doplnovaci-diktat",
    // Diktát nemá v RVP vlastní uzel — je to formát napříč jevy. Kotví se
    // proto na hlavní pravopisný uzel ročníku, který procvičuje nejvíc.
    rvpNodeId: "g3-cjl-jazykova-vychova-pravopis-vyjmenovana-slova-po-b-l-m-p-s-v-z",
    title: "Doplňovací diktát",
    studentTitle: "Diktát",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Doplníš chybějící písmeno a sám poznáš, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "pravopis", "vyjmenovaná slova", "velká písmena", "doplň písmeno"],
    goals: [
      "Poznat, o jaký pravopisný jev ve větě jde.",
      "Použít pravidlo pro vyjmenovaná slova, tvrdé a měkké souhlásky i velká písmena.",
      "Rozhodnout podle významu u slov, která znějí stejně (pyl × pil, vysel × visel).",
    ],
    boundaries: [
      "Jevy 3. ročníku — vyjmenovaná slova, tvrdé a měkké souhlásky, vlastní jména.",
      "Bez předpon s-/z-/vz- a bez shody přísudku s podmětem (přijdou později).",
      "Jedno chybějící písmeno ve větě.",
    ],
    gradeRange: [3, 3],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "V diktátu nejdřív zjisti, o jaké pravidlo jde — teprve potom doplňuj.",
      steps: [
        "Přečti si celou větu, ať víš, co znamená.",
        "Podívej se na písmeno těsně před prázdným místem.",
        "Obojetná (b, l, m, p, s, v, z)? → je to vyjmenované slovo, nebo příbuzné? Ano → y/ý, ne → i/í.",
        "Tvrdá (h, ch, k, r) → y/ý. Měkká (ž, š, č, ř, c, j) → i/í.",
        "Je to začátek jména osoby, města, řeky nebo hory? → velké písmeno.",
      ],
      commonMistake: "Dítě si vybaví pravidlo pro vyjmenovaná slova a použije ho i tam, kde je souhláska tvrdá nebo měkká. A u stejně znějících slov rozhoduje význam, ne zvuk: „pyl“ z květu, ale „pil“ čaj.",
      example: "„Včely přenášejí p_l.“ → prášek z květů → pyl. „Dědeček p_l čaj.“ → od slovesa pít → pil.",
    },
  },
];
