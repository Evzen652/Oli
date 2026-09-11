import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { TROJICE, cisloSlovy, ciselnaUloha, fmt, lzeCist, pick, rnd, sada, type Chyba } from "./_mat";

// Přepsáno 2026-09-11 (audit 5. ročníku). Úlohy byly pevný seznam bez nápověd
// a bez vysvětlení chybných možností; některé možnosti obsahovaly překlepy
// („miliiony“). Teď generátor: čísla se skládají z trojic a chybné možnosti jsou
// typické chyby se zápisem trojic (vynechaná trojice nul, posun o řád,
// padesát tisíc zapsané jako 500 000).
// L1 miliony (čtení a zápis) · L2 miliardy · L3 kolik milionů je v čísle,
// zaokrouhlení na miliony a zápis s prázdnou trojicí uprostřed.

type Trojice = [number, number, number, number]; // miliardy, miliony, tisíce, jednotky
const hodnota = ([b, m, t, u]: Trojice) => b * 1e9 + m * 1e6 + t * 1e3 + u;
const NAZVY = ["miliardy", "miliony", "tisíce", "jednotky"];
const trojiceTxt = (n: number) => fmt(n).split(" ");

/** Typické chyby v zápisu — jen takové, které jde správně přečíst. */
function varianty([b, m, t, u]: Trojice): { v: Trojice; why: string }[] {
  const out: { v: Trojice; why: string }[] = [];
  const nejvyssi = b ? 0 : 1;
  const x: Trojice = [b, m, t, u];
  if (t && t < 100 && t * 10 <= 999) out.push({ v: [b, m, t * 10, u], why: `Trojice tisíců je ${String(t).padStart(3, "0")}, ne ${t * 10}. Chybějící místa vpředu se doplní nulami.` });
  if (u === 0 && t) out.push({ v: nejvyssi ? [0, 0, m, t] : [0, b, m, t], why: "Vypadla poslední trojice nul, takže se všechno posunulo o jeden řád trojic níž." });
  if (t === 0 && (u || nejvyssi === 0)) out.push({ v: nejvyssi ? [0, 0, m, u] : [0, b, m, u], why: "Chybí trojice nul na místě tisíců. I prázdná trojice se musí zapsat: 000." });
  const hl = x[nejvyssi];
  if (hl * 10 <= 999 && lzeCist(hl * 10)) { const v: Trojice = [...x] as Trojice; v[nejvyssi] = hl * 10; out.push({ v, why: `Na začátku je o nulu víc — ${NAZVY[nejvyssi]} jsou ${hl}, ne ${hl * 10}.` }); }
  if (hl % 10 === 0 && lzeCist(hl / 10)) { const v: Trojice = [...x] as Trojice; v[nejvyssi] = hl / 10; out.push({ v, why: `Na začátku chybí nula — ${NAZVY[nejvyssi]} jsou ${hl}, ne ${hl / 10}.` }); }
  if (t && lzeCist(t + 5)) out.push({ v: [b, m, t + 5, u], why: `Trojice tisíců je ${t}, ne ${t + 5}.` });
  if (lzeCist(hl + 1)) { const v: Trojice = [...x] as Trojice; v[nejvyssi] = hl + 1; out.push({ v, why: `Na začátku je ${hl}, ne ${hl + 1}.` }); }
  return out.filter((o) => o.v.every(lzeCist) && hodnota(o.v) !== hodnota(x) && hodnota(o.v) > 0);
}

function nahodne(miliardy: boolean): Trojice {
  const mala = TROJICE.filter((g) => g < 100);
  const b = miliardy ? pick(mala) : 0;
  const m = miliardy ? (Math.random() < 0.7 ? pick(TROJICE) : 0) : pick(mala);
  const t = Math.random() < 0.75 ? pick(TROJICE) : 0;
  const u = miliardy ? 0 : Math.random() < 0.35 ? pick(TROJICE) : 0;
  return [b, m, t, u];
}

function zapis(x: Trojice): PracticeTask | null {
  const n = hodnota(x), slova = cisloSlovy(n);
  const chyby: Chyba[] = varianty(x).map((o) => ({ value: fmt(hodnota(o.v)), why: o.why }));
  const casti = [x[0] && "miliardy", x[1] && "miliony", x[2] && "tisíce", x[3] && "jednotky"].filter(Boolean).join(", ");
  return ciselnaUloha(`Zapiš číslicemi: ${slova}.`, fmt(n), chyby, [
    `Které trojice v čísle „${slova}“ jsou, a které chybí? Máš tu ${casti}.`,
    "Každá trojice (miliardy, miliony, tisíce, jednotky) má v zápisu tři číslice. Prázdnou trojici zapiš jako 000 a chybějící místa vpředu doplň nulami, třeba padesát tisíc je v trojici tisíců 050.",
  ], [
    `Trojice zleva: ${trojiceTxt(n).join(" | ")}`,
    `Zápis: ${fmt(n)}`,
  ]);
}

function cteni(x: Trojice): PracticeTask | null {
  const n = hodnota(x);
  const chyby: Chyba[] = varianty(x).map((o) => ({ value: cisloSlovy(hodnota(o.v)), why: o.why }));
  const trojice = trojiceTxt(n);
  return ciselnaUloha(`Jak přečteš číslo ${fmt(n)}?`, cisloSlovy(n), chyby, [
    `Rozděl číslo zprava po trojicích: ${trojice.join(" | ")}. Jak se jmenuje každá trojice?`,
    "Trojice zleva se jmenují miliardy, miliony, tisíce a jednotky. Přečti každou trojici a přidej její název; trojici samých nul nečteš vůbec.",
  ], [
    `Trojice: ${trojice.join(" | ")}`,
    `Čteme: ${cisloSlovy(n)}`,
  ]);
}

function kolikMilionu(): PracticeTask | null {
  const b = rnd(1, 12), m = pick([0, rnd(1, 9) * 100, rnd(10, 99) * 10]), t = rnd(0, 9) * 100;
  const n = b * 1e9 + m * 1e6 + t * 1e3;
  const key = b * 1000 + m;
  return ciselnaUloha(`Kolik celých milionů je v čísle ${cisloSlovy(n)}?`, fmt(key), [
    ...(m ? [{ value: fmt(m), why: `${m} je jen trojice milionů. Každá miliarda má ale tisíc milionů — i ty se počítají.` }] : []),
    { value: fmt(b), why: `${b} je počet miliard, ne milionů.` },
    ...(m ? [{ value: fmt(b * 1000), why: "Započítaly se jen miliardy převedené na miliony; chybí trojice milionů." }] : []),
    { value: fmt(key * 1000), why: "To je počet tisíců, ne milionů." },
    { value: fmt(b * 100 + m), why: "Jedna miliarda je tisíc milionů, ne sto." },
  ], [
    `V čísle „${cisloSlovy(n)}“ jsou miliardy i miliony. Kolik milionů dá jedna miliarda?`,
    "Jedna miliarda je tisíc milionů. Miliardy převeď na miliony a přičti miliony, které v čísle jsou navíc; tisíce a jednotky do celých milionů nepatří. Výsledek bude vždy víc než tisíc, protože je tu aspoň jedna miliarda.",
  ], [
    `Miliardy na miliony: ${b} × 1 000 = ${fmt(b * 1000)}`,
    `${fmt(b * 1000)} + ${m} = ${fmt(key)} milionů`,
  ]);
}

function zaokrouhli(): PracticeTask | null {
  const m = rnd(2, 98), zbytek = rnd(1, 999) * 1000 + pick([0, rnd(1, 999)]);
  if (Math.floor(zbytek / 100000) === 5 && zbytek % 100000 === 0) return null;
  const n = m * 1e6 + zbytek;
  const nahoru = zbytek >= 500000;
  const key = (nahoru ? m + 1 : m) * 1e6;
  const statisice = Math.floor(zbytek / 100000);
  return ciselnaUloha(`Zaokrouhli číslo ${fmt(n)} na miliony.`, fmt(key), [
    { value: fmt(nahoru ? m * 1e6 : (m + 1) * 1e6), why: `Rozhoduje číslice stotisíců (${statisice}): ${nahoru ? "je 5 nebo víc, zaokrouhluje se nahoru" : "je menší než 5, zaokrouhluje se dolů"}.` },
    { value: fmt(Math.round(n / 1e5) * 1e5), why: "To je zaokrouhlení na statisíce, ne na miliony." },
    { value: fmt(Math.round(n / 1e7) * 1e7 || 1e7), why: "To je zaokrouhlení na desítky milionů." },
    { value: fmt((nahoru ? m + 2 : m - 1) * 1e6), why: "Při zaokrouhlení se trojice milionů změní nejvýš o jedna." },
  ], [
    `Mezi kterými dvěma celými miliony leží číslo ${fmt(n)}? Podívej se na číslici hned za trojicí milionů.`,
    "Na miliony rozhoduje číslice stotisíců: 0 až 4 znamená zaokrouhlit dolů, 5 až 9 nahoru. Všechno za miliony se pak nahradí nulami.",
  ], [
    `Číslice stotisíců: ${statisice}`,
    `${statisice >= 5 ? "5 až 9 — nahoru" : "0 až 4 — dolů"}: ${fmt(key)}`,
  ]);
}

function prazdnaTrojice(): PracticeTask | null {
  const b = pick(TROJICE.filter((g) => g < 20)), t = pick(TROJICE.filter((g) => g < 1000));
  const x: Trojice = [b, 0, t, 0];
  if (!t) return null;
  const n = hodnota(x), slova = cisloSlovy(n);
  return ciselnaUloha(`Zapiš číslicemi: ${slova}.`, fmt(n), [
    { value: fmt(b * 1e6 + t * 1e3), why: "Chybí trojice milionů. Mezi miliardami a tisíci je prázdná trojice 000." },
    { value: fmt(b * 1e9 + t * 1e6), why: `${cisloSlovy(t * 1000)} patří do trojice tisíců, ne milionů.` },
    { value: fmt(b * 1e9 + t), why: "Tisíce se zapsaly jako jednotky; chybí poslední trojice nul." },
  ], [
    `Miliardy (${b}) máš. Kam patří „${cisloSlovy(t * 1000)}“ a která trojice se vůbec neřekne?`,
    "Miliardy mají za sebou tři trojice: miliony, tisíce a jednotky. Trojici, která se neřekne, zapiš jako 000. Nejdřív si napiš miliardy a tři prázdné trojice po třech místech, teprve pak do nich doplň, co v čísle zazní.",
  ], [
    `Trojice zleva: ${trojiceTxt(n).join(" | ")}`,
    `Zápis: ${fmt(n)}`,
  ]);
}

function gen(level: number): PracticeTask[] {
  if (level === 1) return sada(30, (i) => (i % 2 ? cteni(nahodne(false)) : zapis(nahodne(false))));
  if (level === 2) return sada(30, (i) => (i % 2 ? cteni(nahodne(true)) : zapis(nahodne(true))));
  const tvurci = [kolikMilionu, zaokrouhli, prazdnaTrojice];
  return sada(30, (i) => tvurci[i % 3]());
}

export const CISLANADMILIONMILIARDY: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-cisla-nad-milion-miliardy",
    title: "Čísla nad milion, miliardy",
    studentTitle: "Miliardy",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Poznáš velká čísla — milion, miliarda a ještě větší.",
    keywords: ["milion", "miliarda", "velká čísla", "zápis čísel", "čtení čísel", "porovnávání"],
    goals: [
      "Přečíst čísla v řádu milionů a miliard",
      "Zapsat čísla v řádu milionů a miliard číslicemi",
      "Porovnat čísla v řádu milionů a miliard",
      "Orientovat se v příkladech ze skutečného světa",
    ],
    boundaries: ["Bez bilionů a vyšších řádů", "Bez výpočtů s miliardami"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "factual",
    generator: gen,
    helpTemplate: {
      hint: "Milion má 6 nul (1 000 000), miliarda má 9 nul (1 000 000 000). Číslo čteme po skupinách tisíců zprava.",
      steps: [
        "Rozděl číslo zprava po třech číslicích: 2 350 000 000 → 2 | 350 | 000 | 000.",
        "Přiřaď názvy skupin: miliardy | miliony | tisíce | jednotky.",
        "Přečti každou skupinu a přidej název: 'dvě miliardy tři sta padesát milionů'.",
      ],
      commonMistake: "Chyba: záměna milionů a miliard — milion má 6 nul, miliarda 9 nul.",
      example: "2 350 000 000 = dvě miliardy tři sta padesát milionů (2 × miliarda + 350 × milion).",
    },
  },
];
