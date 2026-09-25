import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { iy, skupina, urovenJednoPravidlo, urovenMix, urovenVyznam, type Polozka } from "@/content/_diktat";

// Doplňovací diktát pro 2. ročník (2026-09-26).
//
// Vědomé omezení: druhá třída zná jen tvrdé a měkké souhlásky, skupiny
// dě-tě-ně-bě-pě-vě-mě a velké písmeno ve vlastních jménech. Obojetné
// souhlásky ani vyjmenovaná slova tu NEJSOU — ty se probírají až ve třetí
// třídě, takže by dítě nemělo podle čeho rozhodnout.
//
// L1 jedno pravidlo (i/y po tvrdé × měkké) · L2 pravidla promíchaná, dítě
// musí nejdřív poznat, o jaký jev jde · L3 stejně znějící slovo, o zápisu
// rozhoduje význam nebo výslovnost (lípa × Lípa, dým × divadlo).

// ── L1 — i/y po tvrdých a měkkých souhláskách ────────────────────────

const TVRDA = "po tvrdé souhlásce (h, ch, k, r, d, t, n) se píše y/ý";
const MEKKA = "po měkké souhlásce (ž, š, č, ř, c, j, ď, ť, ň) se píše i/í";

const L1: Polozka[] = [
  iy("R_ba plave v potoce.", "ryba", "y", TVRDA, "R je tvrdá souhláska, proto se píše y. „Ryba“ má samohlásku krátkou."),
  iy("Na okně stojí k_tka.", "kytka", "y", TVRDA, "K je tvrdá souhláska, proto se píše y."),
  iy("Kočka ch_tá myš.", "chytá", "y", TVRDA, "CH je tvrdá souhláska, proto se píše y."),
  iy("T_gr je velká kočka.", "tygr", "y", TVRDA, "T je tvrdá souhláska a ve slabice „ty“ se vyslovuje tvrdě, proto se píše y."),
  iy("Na poli roste velká d_ně.", "dýně", "ý", TVRDA, "D je tvrdá souhláska, proto se píše y. Ve slově „dýně“ je samohláska dlouhá — ý."),
  iy("Osel hlasitě h_ká.", "hýká", "ý", TVRDA, "H je tvrdá souhláska, proto se píše y. „Hýká“ se vyslovuje dlouze — ý."),
  iy("Ž_rafa má dlouhý krk.", "žirafa", "i", MEKKA, "Ž je měkká souhláska, proto se píše i. Samohláska je krátká."),
  iy("Na keři rostou š_pky.", "šípky", "í", MEKKA, "Š je měkká souhláska, proto se píše i. Ve slově „šípky“ je samohláska dlouhá — í."),
  iy("Po jídle mám č_sté ruce.", "čisté", "i", MEKKA, "Č je měkká souhláska, proto se píše i. Samohláska je krátká."),
  iy("Nesmíš tak kř_čet.", "křičet", "i", MEKKA, "Ř je měkká souhláska, proto se píše i."),
  iy("Maminka krájí c_buli.", "cibuli", "i", MEKKA, "C je měkká souhláska, proto se píše i."),
  iy("Dědeček koupil j_zdenku.", "jízdenku", "í", MEKKA, "J je měkká souhláska, proto se píše i. Ve slově „jízdenka“ je samohláska dlouhá — í."),
  iy("V lese jsme našli velký hř_b.", "hřib", "i", MEKKA, "Ř je měkká souhláska, proto se píše i. Houba se píše „hřib“ s krátkým i."),
];

// ── L2 — promíchaná pravidla ─────────────────────────────────────────

/** Skupiny dě, tě, ně, bě, pě, vě: píše se ě, ne „je“ a ne holé „e“. */
const e = (veta: string, slovo: string, proc: string): Polozka =>
  skupina(veta, slovo, "ě", [
    ["je", `Ve slově „${slovo}“ slyšíme „je“, ale píše se ě. Zápis „je“ by tu byl chybný.`],
    ["e", `Chybí háček. Bez něj by se slovo „${slovo}“ četlo tvrdě a znělo by jinak.`],
  ], "skupiny dě, tě, ně, bě, pě, vě", proc);

/** Vlastní jméno × obecné slovo: rozhoduje jen velké písmeno. */
const velke = (veta: string, slovo: string, V: string, proc: string): Polozka =>
  skupina(veta, slovo, V, [
    [V.toLowerCase(), `„${slovo}“ je vlastní jméno, a ta se píšou s velkým písmenem.`],
  ], "velké písmeno ve vlastních jménech", proc);

const L2: Polozka[] = [
  iy("Na talíři mám r_ži.", "rýži", "ý", TVRDA, "R je tvrdá souhláska, proto se píše y. „Rýže“ se vyslovuje dlouze — ý."),
  iy("Každou ch_bu jde opravit.", "chybu", "y", TVRDA, "CH je tvrdá souhláska, proto se píše y."),
  iy("Slon má velké uš_.", "uši", "i", MEKKA, "Š je měkká souhláska, proto se píše i."),
  iy("Babička uvařila kaš_.", "kaši", "i", MEKKA, "Š je měkká souhláska, proto se píše i."),
  e("Na zahradě si hrají d_ti.", "děti", "Ve skupině „dě“ se píše ě, i když slyšíme „dje“."),
  e("Na okně kvete kv_tina.", "květina", "Ve skupině „vě“ se píše ě, i když slyšíme „vje“."),
  e("Bratr už um_l počítat do sta.", "uměl", "Ve skupině „mě“ se píše ě, i když slyšíme „mně“."),
  e("Na ruce máme p_t prstů.", "pět", "Ve skupině „pě“ se píše ě, i když slyšíme „pje“."),
  e("Do školy jdeme v pond_lí.", "pondělí", "Ve skupině „dě“ se píše ě."),
  e("Na sn_hu jsou stopy.", "sněhu", "Ve skupině „ně“ se píše ě."),
  e("Pes b_há po zahradě.", "běhá", "Ve skupině „bě“ se píše ě, i když slyšíme „bje“."),
  e("Ztratil jsem důležitou v_c.", "věc", "Ve skupině „vě“ se píše ě."),
  velke("Naše kočka se jmenuje _icka.", "Micka", "M", "Jméno zvířete je vlastní jméno — píše se s velkým písmenem."),
  velke("Bydlíme ve městě _rno.", "Brno", "B", "Název města je vlastní jméno — píše se s velkým písmenem."),
  velke("Vlak jede podél řeky _ltavy.", "Vltavy", "V", "Název řeky je vlastní jméno — píše se s velkým písmenem."),
  velke("Můj kamarád se jmenuje _avel.", "Pavel", "P", "Jméno člověka je vlastní jméno — píše se s velkým písmenem."),
  velke("V zimě pojedeme na _něžku.", "Sněžku", "S", "Název hory je vlastní jméno — píše se s velkým písmenem."),
];

// ── L3 — rozhoduje význam nebo výslovnost ────────────────────────────

/** Obecné slovo × vlastní jméno, které zní úplně stejně. */
const male = (veta: string, slovo: string, m: string, proc: string): Polozka =>
  skupina(veta, slovo, m, [
    [m.toUpperCase(), `Tady „${slovo}“ není jméno, ale obyčejné slovo — velké písmeno sem nepatří.`],
  ], "vlastní × obecné jméno", proc);

const L3: Polozka[] = [
  male("Na návsi roste stará _ípa.", "lípa", "l", "Tady jde o strom. Obyčejné slovo se píše s malým písmenem."),
  velke("Babička bydlí ve vesnici _ípa.", "Lípa", "L", "Tady je to název vesnice, tedy vlastní jméno — velké L."),
  male("V zoologické zahradě řve _ev.", "lev", "l", "Tady jde o zvíře. Obyčejné slovo se píše s malým písmenem."),
  velke("Můj bratranec se jmenuje _ev.", "Lev", "L", "Tady je to křestní jméno, tedy vlastní jméno — velké L."),
  male("V noci v lese vyje _lk.", "vlk", "v", "Tady jde o zvíře. Obyčejné slovo se píše s malým písmenem."),
  velke("Náš soused se jmenuje pan _lk.", "Vlk", "V", "Tady je to příjmení, tedy vlastní jméno — velké V."),
  iy("Odpoledne jdeme do d_vadla.", "divadla", "i", "ve slabice di se d vyslovuje měkce", "Ve slabice „di“ se d vyslovuje měkce (ďi), a proto se píše i — přestože D je tvrdá souhláska."),
  iy("Z komína stoupá d_m.", "dým", "ý", "ve slabice dy se d vyslovuje tvrdě", "Ve slabice „dý“ se d vyslovuje tvrdě, a proto se píše y. Samohláska je dlouhá."),
  iy("V pokoji bylo úplné t_cho.", "ticho", "i", "ve slabice ti se t vyslovuje měkce", "Ve slabice „ti“ se t vyslovuje měkce (ťi), a proto se píše i."),
  iy("Nové bot_ mě tlačí.", "boty", "y", "ve slabice ty se t vyslovuje tvrdě", "Ve slabice „ty“ se t vyslovuje tvrdě, a proto se píše y."),
  iy("Pod postelí není n_c.", "nic", "i", "ve slabice ni se n vyslovuje měkce", "Ve slabice „ni“ se n vyslovuje měkce (ňi), a proto se píše i."),
  iy("Náš pes má čtyři noh_.", "nohy", "y", "po tvrdém h se píše y", "H je tvrdá souhláska, proto se píše y."),
  iy("Spát chodíme v osm hod_n.", "hodin", "i", "ve slabice di se d vyslovuje měkce", "Ve slabice „di“ se d vyslovuje měkce (ďi), a proto se píše i."),
  iy("Na obloze nen_ ani mráček.", "není", "í", "ve slabice ni se n vyslovuje měkce", "Ve slabice „ní“ se n vyslovuje měkce (ňí), a proto se píše i. Samohláska je dlouhá."),
];

function gen(level: number): PracticeTask[] {
  if (level === 1) return urovenJednoPravidlo(L1, "Podívej se na souhlásku těsně před prázdným místem — je tvrdá, nebo měkká?");
  if (level === 2) return urovenMix(L2);
  return urovenVyznam(L3);
}

export const DOPLNOVACIDIKTAT2: TopicMetadata[] = [
  {
    id: "g2-cjl-doplnovaci-diktat",
    // Diktát nemá v RVP vlastní uzel — je to formát napříč jevy. Kotví se
    // proto na hlavní pravopisný uzel ročníku, který procvičuje nejvíc.
    rvpNodeId: "g2-cjl-jazykova-vychova-zvukova-stranka-jazyka-pravopis-tvrdych-a-mekkych-souhlasek-i-y-po-souhlaskach",
    title: "Doplňovací diktát",
    studentTitle: "Diktát",
    subject: "čeština",
    category: "Jazyková výchova",
    topic: "Pravopis",
    briefDescription: "Doplníš chybějící písmeno a sám poznáš, jaké pravidlo platí.",
    keywords: ["diktát", "doplňovací diktát", "pravopis", "doplň písmeno", "tvrdé a měkké souhlásky", "ě", "velké písmeno"],
    goals: [
      "Poznat, o jaký pravopisný jev ve větě jde.",
      "Použít správné pravidlo: tvrdá × měkká souhláska, skupiny s ě, velké písmeno.",
      "Rozhodnout podle významu tam, kde dvě slova znějí stejně.",
    ],
    boundaries: [
      "Jen jevy 2. ročníku — tvrdé a měkké souhlásky, dě-tě-ně-bě-pě-vě, vlastní jména.",
      "Bez obojetných souhlásek a vyjmenovaných slov (ty přijdou ve 3. ročníku).",
      "Jedno chybějící písmeno ve větě.",
    ],
    gradeRange: [2, 2],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    generator: gen,
    helpTemplate: {
      hint: "V diktátu nejdřív zjisti, o jaké pravidlo jde — teprve potom doplňuj.",
      steps: [
        "Přečti si celou větu, ať víš, o čem je.",
        "Najdi prázdné místo a podívej se na písmeno těsně před ním.",
        "Je to souhláska? Tvrdá → y/ý, měkká → i/í. Slyšíš „je“? → píše se ě.",
        "Je to začátek jména osoby, města, řeky nebo hory? → velké písmeno.",
        "Nakonec poslechni, jestli je samohláska krátká, nebo dlouhá.",
      ],
      commonMistake: "Dítě použije pravidlo, které si zrovna pamatuje, místo aby nejdřív poznalo, o jaký jev jde. Pozor hlavně na d, t, n: jsou tvrdé, ale ve slabikách di, ti, ni se píše i (divadlo, ticho, nic).",
      example: "„Z komína stoupá d_m.“ → slabika dý se vyslovuje tvrdě → dým. Ale „do d_vadla“ → slabika di se vyslovuje měkce → divadla.",
    },
  },
];
