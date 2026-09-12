import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { ciselnaUloha, pick, rnd, sada, shuffle } from "./_mat";

// Přepsáno 2026-09-12 (inventura obsahu). Předchozí verze měla statické
// nápovědy („Všechna čísla jsou záporná…" se opakovalo u 52 úloh) a na L2
// výhradně výčtové úlohy, kde klíč nutně stál ve znění otázky.
//
// Teď: L1 rozpoznání zápisu (číslo vlevo od nuly, teplota pod nulou, hloubka,
// porovnání s nulou) · L2 aplikace na polohu čísla (co leží mezi, soused,
// opačné číslo, seřazení) · L3 posun po ose o několik dílů (oteplení a
// ochlazení přes nulu, patra pod zemí, vzdálenost přes nulu, zpětný výpočet).
// Každá nápověda nese data své úlohy, takže se neopakuje.

/** Záporné číslo s typografickým minusem. */
const Z = (n: number) => (n < 0 ? `−${-n}` : String(n));

// ── Pojistka proti prozrazení ────────────────────────────────────────────────

const bezInterpunkce = (s: string) => s.replace(/(?<!\d)[.,](?!\d)/g, " ").replace(/[;:!?"'„“()×]/g, " ");

function obsahujeCislo(text: string, cislo: string): boolean {
  return new RegExp(`(^|[^\\d.,])${cislo.replace(".", "\\.")}([^\\d.,]|$)`).test(bezInterpunkce(text));
}

/** Číselné jádro klíče — jen tvary, které detektor prozrazení hlídá (číslo, číslo s jednotkou). */
function jadro(key: string): string | null {
  if (/^\d+$/.test(key)) return key;
  return key.match(/^(\d+)\s+\p{L}[\p{L}\s/²³°]*$/u)?.[1] ?? null;
}

/**
 * Pustí dál jen úlohu, jejíž klíč není ve znění otázky ani v nápovědách.
 * U záporného klíče se číselné jádro nehledá: „−7 °C" v nápovědě nikdy nestojí,
 * a číslice za minusem sama odpověď neprozradí (o výsledku rozhoduje znaménko).
 */
function overeno(t: PracticeTask | null): PracticeTask | null {
  if (!t) return null;
  const key = String(t.correctAnswer);
  if (t.question.toLowerCase().includes(key.toLowerCase())) return null;
  if ((t.hints ?? []).some((h) => key.length >= 3 && h.includes(key))) return null;
  const cislo = jadro(key);
  if (cislo && (t.hints ?? []).some((h) => obsahujeCislo(h, cislo))) return null;
  return t;
}

// ── L1 · rozpoznání zápisu ───────────────────────────────────────────────────

function naOse(): PracticeTask | null {
  const n = rnd(2, 15);
  return overeno(ciselnaUloha(
    `Které číslo leží na číselné ose ${pad(n, "DÍL")} vlevo od nuly?`,
    Z(-n),
    [
      { value: Z(n), why: `Číslo ${n} bez znaménka leží ${pad(n, "DÍL")} vpravo od nuly, tedy na opačnou stranu, než zadání říká.` },
      { value: Z(-(n + 1)), why: `O jeden díl dál, než zadání říká. Od nuly se má odpočítat ${pad(n, "DÍL")}.` },
      { value: Z(-(n - 1)), why: `O jeden díl blíž nule. Počítej znovu, prvním dílem od nuly doleva začíná číslo ${Z(-1)}.` },
    ],
    [
      `Od nuly máš jít doleva, a to o ${pad(n, "DÍL")}. Co se píše před číslo, které leží vlevo od nuly?`,
      `Číselná osa má vpravo od nuly čísla kladná a vlevo záporná. Kolik dílů od nuly ujdeš, takové je číslo, a protože jdeš doleva, patří před ně znaménko minus. Počítají se přitom mezery mezi čísly, ne čísla samotná, takže nula sama se jako první díl nepočítá.`,
    ],
    [`Vlevo od nuly leží záporná čísla.`, `${pad(n, "DÍL")} vlevo od nuly je číslo ${Z(-n)}.`],
  ));
}

function teplomer(): PracticeTask | null {
  const n = rnd(2, 25);
  return overeno(ciselnaUloha(
    `Teploměr ukazuje teplotu ${n} °C pod nulou. Jak ji zapíšeš číslem?`,
    `${Z(-n)} °C`,
    [
      { value: `${n} °C`, why: `Bez znaménka jde o ${n} °C nad nulou, tedy o teplotu nad bodem mrazu.` },
      { value: "0 °C", why: "Nula je sám bod mrazu. Teplota pod nulou leží na ose vlevo od něj." },
      { value: `${Z(-(n + 10))} °C`, why: `Číslo nesedí se zadáním: teploměr je ${n} °C pod nulou, ne ${n + 10} °C.` },
    ],
    [
      `Teplota ${n} °C pod nulou leží pod bodem mrazu. Co se na číselné ose píše před čísla, která leží vlevo od nuly?`,
      `Nula na teploměru je bod mrazu. Teploty nad ní se zapisují jako obyčejná kladná čísla, teploty pod ní se znaménkem minus, protože na číselné ose leží vlevo od nuly. Samo číslo přitom říká, o kolik stupňů je teplota od nuly vzdálená, a to se zápisem nemění.`,
    ],
    [`Pod nulou znamená vlevo od nuly, tedy záporné číslo.`, `Teplota ${n} °C pod nulou se zapíše ${Z(-n)} °C.`],
  ));
}

function hloubka(): PracticeTask | null {
  const n = rnd(3, 40), kdo = pick(["Potápěč", "Ponorka", "Kotva"]);
  return overeno(ciselnaUloha(
    `${kdo} je ${n} m pod hladinou. Jak tuhle výšku zapíšeš, když hladina má 0 m?`,
    `${Z(-n)} m`,
    [
      { value: `${n} m`, why: `${n} m bez znaménka by znamenalo ${n} m nad hladinou, třeba na stožáru.` },
      { value: "0 m", why: "Nula je sama hladina. Místo pod hladinou má číslo menší než nula." },
      { value: `${Z(-(n * 10))} m`, why: `Hloubka ze zadání je ${n} m, ne ${n * 10} m — číslo se neshoduje.` },
    ],
    [
      `Hladina znamená nulu a ${kdo.toLowerCase()} se nachází ${n} m pod ní. Co se píše před čísla, která leží pod nulou?`,
      `Když je hladina nula, čísla nad ní jsou kladná (výška nad hladinou) a čísla pod ní záporná (hloubka). Zapisuje se proto stejné číslo jako hloubka, jen se znaménkem minus. Samotné číslo říká, jak daleko od hladiny to je, a znaménko říká, na kterou stranu.`,
    ],
    [`Hladina = 0 m, pod hladinou jsou záporná čísla.`, `Hloubka ${n} m pod hladinou se zapíše ${Z(-n)} m.`],
  ));
}

function porovnejSNulou(): PracticeTask | null {
  const n = rnd(2, 30);
  return overeno(ciselnaUloha(
    `Porovnej číslo ${Z(-n)} s nulou. Co o něm platí?`,
    "je menší než nula",
    [
      { value: "je větší než nula", why: "Větší než nula jsou čísla vpravo od ní, tedy kladná. Číslo se znaménkem minus leží vlevo." },
      { value: "je stejně velké jako nula", why: "Stejná jako nula je jen sama nula, a ta se píše bez znaménka." },
      { value: "leží na ose vpravo od nuly", why: `Vpravo od nuly leží čísla bez minusu. Číslice ${n} za minusem říká jen vzdálenost od nuly, odměřuje se ale na opačnou stranu.` },
    ],
    [
      `Najdi na číselné ose místo pro číslo ${Z(-n)} a místo pro nulu. Které z těch dvou míst leží víc vlevo?`,
      `Na číselné ose hodnoty rostou zleva doprava, takže to, co leží víc vlevo, má vždycky nižší hodnotu. Záporná čísla leží vlevo od nuly bez ohledu na to, jak velká číslice stojí za minusem, a proto nula vyhraje nad každým z nich. Číslice za minusem udává jen vzdálenost od nuly.`,
    ],
    [`Číslo se znaménkem minus leží vlevo od nuly.`, `Co leží vlevo, má nižší hodnotu — nula je tedy větší.`],
  ));
}

// ── L2 · aplikace na polohu čísla ────────────────────────────────────────────

function mezi(): PracticeTask | null {
  const a = -rnd(6, 20), b = a + rnd(4, 10);
  const m = a + Math.floor((b - a) / 2);
  if (m === a || m === b) return null;
  const nizsi = a - rnd(1, 5), vyssi = b + rnd(1, 5);
  return overeno(ciselnaUloha(
    `Které z nabízených čísel leží na číselné ose mezi ${Z(a)} a ${Z(b)}?`,
    Z(m),
    [
      { value: Z(nizsi), why: `${Z(nizsi)} leží ještě vlevo od ${Z(a)}, tedy mimo vyznačený úsek.` },
      { value: Z(vyssi), why: `${Z(vyssi)} leží až vpravo od ${Z(b)}, tedy za koncem úseku.` },
      { value: Z(-a), why: `${Z(-a)} je kladné, a proto leží vpravo od nuly — to je úplně jinde než úsek od ${Z(a)} do ${Z(b)}.` },
    ],
    [
      `Hledané číslo musí ležet napravo od ${Z(a)} a zároveň nalevo od ${Z(b)}. Projdi možnosti a u každé zkontroluj obě podmínky.`,
      `Na číselné ose hodnoty rostou zleva doprava, takže ležet mezi dvěma čísly znamená být napravo od menšího z nich a nalevo od většího. U záporných čísel pozor: čím větší číslice stojí za minusem, tím dál vlevo číslo leží, takže ${Z(a)} je z dvojice to menší. Možnosti proto neposuzuj podle číslic, ale podle místa na ose.`,
    ],
    [`Úsek začíná v ${Z(a)} a končí v ${Z(b)}.`, `Uvnitř úseku leží ${Z(m)} — je napravo od ${Z(a)} a nalevo od ${Z(b)}.`],
  ));
}

function soused(): PracticeTask | null {
  const x = -rnd(2, 12), vpravo = Math.random() < 0.5;
  const smer = vpravo ? "vpravo" : "vlevo";
  const key = x + (vpravo ? 1 : -1);
  return overeno(ciselnaUloha(
    `Které číslo leží na číselné ose hned ${smer} od čísla ${Z(x)}?`,
    Z(key),
    [
      { value: Z(x - (vpravo ? 1 : -1)), why: `To je soused na opačné straně. Od ${Z(x)} se má jít ${smer}.` },
      { value: Z(x + (vpravo ? 2 : -2)), why: `Krok je o díl delší, než má být. Sousední čísla se od ${Z(x)} liší přesně o jedna.` },
      { value: Z(-x), why: `${Z(-x)} leží na druhé straně nuly, ne hned vedle čísla ${Z(x)}.` },
    ],
    [
      `Postav se v duchu na číslo ${Z(x)} a udělej jediný krok ${smer}. Roste přitom hodnota čísla, nebo klesá?`,
      `Sousední čísla na ose se liší přesně o jeden díl. Krok doprava znamená o jedna víc, krok doleva o jedna míň, a u záporných čísel to platí stejně. Číslice za minusem se přitom chová obráceně: směrem doprava se zmenšuje, směrem doleva zvětšuje. Řiď se proto polohou na ose, ne velikostí té číslice.`,
    ],
    [`Sousední čísla se liší o jeden díl.`, `Hned ${smer} od ${Z(x)} leží ${Z(key)}.`],
  ));
}

function opacne(): PracticeTask | null {
  const n = rnd(2, 18);
  return overeno(ciselnaUloha(
    `Které číslo leží na číselné ose stejně daleko od nuly jako ${n}, ale na opačné straně?`,
    Z(-n),
    [
      { value: "0", why: "Nula leží přesně uprostřed mezi oběma čísly, takže sama tou dvojicí není." },
      { value: Z(n), why: `${n} je totéž číslo, které je v zadání — leží na stejné straně nuly, ne na opačné.` },
      { value: Z(-2 * n), why: `${Z(-2 * n)} leží sice vlevo od nuly, ale dvakrát dál, než má být. Vzdálenost od nuly zůstává stejná.` },
    ],
    [
      `Od nuly k číslu ${n} vede cesta dlouhá ${pad(n, "DÍL")}. Stejně dlouhou cestu odpočítej od nuly na opačnou stranu — co se píše před číslo, které tam leží?`,
      `Dvojice čísel, která leží od nuly stejně daleko, ale každé z jiné strany, se liší jedině znaménkem. Vpravo od nuly jsou čísla kladná, vlevo záporná, a počet dílů k nule je u obou stejný. Mění se tedy jen strana, ne vzdálenost od nuly.`,
    ],
    [`Vzdálenost od nuly zůstává ${pad(n, "DÍL")}.`, `Na opačné straně nuly proto leží ${Z(-n)}.`],
  ));
}

function serad(): PracticeTask | null {
  const cisla = new Set<number>([-rnd(5, 15), -rnd(1, 4), rnd(1, 9)]);
  cisla.add(Math.random() < 0.5 ? 0 : -rnd(16, 25));
  if (cisla.size < 4) return null;
  const xs = [...cisla];
  const J = (pole: number[]) => pole.map(Z).join("; ");
  const spravne = [...xs].sort((p, q) => p - q);
  let zamichane = shuffle(xs);
  if (J(zamichane) === J(spravne)) zamichane = [...spravne].reverse();
  return overeno(ciselnaUloha(
    `Seřaď od nejmenšího: ${J(zamichane)}.`,
    J(spravne),
    [
      { value: J([...xs].sort((p, q) => Math.abs(p) - Math.abs(q))), why: "Řadilo se podle číslic bez ohledu na minus. Záporná čísla ale leží vlevo od nuly, takže patří na začátek." },
      { value: J([...spravne].reverse()), why: "To je pořadí od největšího. Od nejmenšího se začíná číslem, které leží na ose nejvíc vlevo." },
      { value: J([...xs].sort((p, q) => (p < 0 && q < 0 ? q - p : p - q))), why: "Záporná čísla jsou seřazená obráceně. To s větší číslicí za minusem leží dál vlevo, a je proto menší." },
    ],
    [
      `Čísla ${J(zamichane)} si rozděl na záporná a kladná: záporná leží vlevo od nuly, kladná vpravo. Které ze záporných je ze všech nejdál vlevo?`,
      `Na číselné ose hodnoty rostou zleva doprava, takže seřadit od nejmenšího znamená vypsat čísla v tom pořadí, v jakém na ose leží zleva. Nejdřív přijdou záporná čísla, a mezi nimi je nejmenší to s největší číslicí za minusem, protože leží nejdál vlevo. Pak následuje nula a nakonec kladná čísla od nejmenšího.`,
    ],
    [`Zleva doprava: nejdřív záporná (od největší číslice za minusem), pak nula a kladná.`, `Správné pořadí: ${J(spravne)}.`],
  ));
}

// ── L3 · posun po ose ────────────────────────────────────────────────────────

function oteplilo(): PracticeTask | null {
  const start = -rnd(2, 12), zmena = rnd(3, 15), konec = start + zmena;
  if (konec === 0) return null;
  const kdy = pick([["Ráno", "do poledne"], ["V noci", "do rána"], ["V pondělí", "do úterý"]]);
  return overeno(ciselnaUloha(
    `${kdy[0]} bylo ${Z(start)} °C, ${kdy[1]} se oteplilo o ${zmena} °C. Jakou teplotu ukazoval teploměr potom?`,
    `${Z(konec)} °C`,
    [
      { value: `${Z(start - zmena)} °C`, why: `Posun šel na špatnou stranu. Oteplení znamená pohyb po ose doprava, tedy od ${Z(start)} směrem k nule, ne od ní.` },
      { value: `${Z(-start + zmena)} °C`, why: `Minus v zadání zůstal bez povšimnutí. Teplota začínala pod nulou, na ${Z(start)} °C, ne na ${-start} °C.` },
      { value: `${Z(-konec)} °C`, why: `Číslo sedí, znaménko ne: po posunu o ${pad(zmena, "DÍL")} doprava z ${Z(start)} je teploměr ${konec > 0 ? "nad" : "pod"} nulou.` },
    ],
    [
      `${kdy[0]} ukazoval teploměr ${Z(start)} °C. Dojdi po ose nejdřív k nule — kolik dílů to je? Zbytek z oteplení o ${zmena} °C pak pokračuje stejným směrem dál.`,
      `Oteplení je posun po číselné ose doprava (na teploměru nahoru), ochlazení doleva. Rozděl si proto cestu na dvě části: z ${Z(start)} k nule a odtud dál. Když je oteplení větší než vzdálenost k nule, teploměr přejde přes nulu do kladných čísel. Když je menší, zůstane teplota pod nulou, jen blíž k ní.`,
    ],
    [
      `Z ${Z(start)} °C k nule: ${pad(-start, "DÍL")}.`,
      konec > 0
        ? `Z oteplení zbývá ${zmena} − ${-start} = ${konec}, teploměr tedy přešel přes nulu.`
        : `Oteplení o ${zmena} °C nestačí na ${pad(-start, "DÍL")} k nule, teplota zůstala pod nulou.`,
      `Výsledek: ${Z(konec)} °C.`,
    ],
  ));
}

function ochladilo(): PracticeTask | null {
  const start = rnd(2, 12), zmena = start + rnd(2, 14), konec = start - zmena;
  const kde = pick(["Na horách", "Na zahradě", "Za oknem"]);
  return overeno(ciselnaUloha(
    `${kde} bylo odpoledne ${start} °C, v noci se ochladilo o ${zmena} °C. Jakou teplotu ukázal teploměr ráno?`,
    `${Z(konec)} °C`,
    [
      { value: `${Z(start + zmena)} °C`, why: "Posun šel nahoru. Ochlazení je pohyb po ose doleva, tedy k menším číslům." },
      { value: `${Z(-konec)} °C`, why: `Číslo sedí, znaménko ne. Ochlazení o ${zmena} °C je víc než ${pad(start, "DÍL")} k nule, takže teplota klesla až pod ni.` },
      { value: "0 °C", why: `U nuly ochlazování neskončilo: z ${start} °C k nule stačí ${pad(start, "DÍL")}, ale ochlazení bylo o ${zmena} °C.` },
    ],
    [
      `${kde} klesla teplota z ${start} °C dolů o ${zmena} °C. Kolik dílů stačí k nule a kolik jich pak ještě zbude pod ni?`,
      `Ochlazení je posun po číselné ose doleva. Nejdřív ujdeš cestu z ${start} °C k nule, a protože je ochlazení větší, zbytek pokračuje pod nulu do záporných čísel. Výsledek se zapisuje se znaménkem minus a říká, o kolik dílů leží vlevo od nuly.`,
    ],
    [
      `Z ${start} °C k nule: ${pad(start, "DÍL")}.`,
      `Zbytek ochlazení: ${zmena} − ${start} = ${zmena - start}, a ten už jde pod nulu.`,
      `Výsledek: ${Z(konec)} °C.`,
    ],
  ));
}

function patra(): PracticeTask | null {
  const start = -rnd(1, 3), nahoru = rnd(2, 8), konec = start + nahoru;
  if (konec === 0) return null;
  return overeno(ciselnaUloha(
    `Výtah stojí v patře ${Z(start)}, tedy pod zemí, a vyjede o ${pad(nahoru, "PATRO")} nahoru. Ve kterém patře zastaví?`,
    Z(konec),
    [
      { value: Z(start - nahoru), why: "Výtah jel podle zadání nahoru, ne dolů — patra se mají zvětšovat." },
      { value: Z(nahoru - start), why: `Minus zůstal bez povšimnutí: výtah začínal pod zemí v patře ${Z(start)}, ne v patře ${-start}.` },
      { value: Z(konec + 1), why: "Přízemí má číslo 0 a cestou nahoru se počítá jako jedno z projetých pater." },
    ],
    [
      `Z patra ${Z(start)} je do přízemí, které má číslo 0, jen kousek. Kolik pater to je a kolik z těch ${pad(nahoru, "PATRO")} pak ještě zbude?`,
      `Patra pod zemí se značí zápornými čísly, přízemí je nula a patra nad zemí kladná čísla. Jízda nahoru je posun po číselné ose doprava. Rozděl si ji proto na dvě části: z patra ${Z(start)} do přízemí a odtud dál nahoru. Přízemí se přitom počítá jako jedno patro na cestě, ne jako mezera navíc.`,
    ],
    [
      `Z patra ${Z(start)} do přízemí: ${pad(-start, "PATRO")}.`,
      `Zbývá ${nahoru} − ${-start} = ${konec}.`,
      `Výtah zastaví v patře ${Z(konec)}.`,
    ],
  ));
}

function vzdalenostPresNulu(): PracticeTask | null {
  const a = -rnd(2, 12), b = rnd(2, 12);
  const d = b - a, chybny = Math.abs(b + a);
  if (chybny === 0 || chybny === d || chybny === d - 1 || chybny === d + 1) return null;
  return overeno(ciselnaUloha(
    `Kolik dílů je na číselné ose mezi čísly ${Z(a)} a ${b}?`,
    pad(d, "DÍL"),
    [
      { value: pad(chybny, "DÍL"), why: `Čísla se odečetla, jako by ležela na stejné straně nuly. Z ${Z(a)} k nule a z nuly k ${b} se ale jde pokaždé jiným úsekem a oba se sčítají.` },
      { value: pad(d + 1, "DÍL"), why: "Počítala se čísla včetně nuly, ne mezery mezi nimi. Díl je mezera mezi dvěma sousedními čísly." },
      { value: pad(d - 1, "DÍL"), why: "Jeden díl vypadl z počítání. Nula leží uvnitř úseku a přes ni se také jde." },
    ],
    [
      `Cesta z ${Z(a)} do ${b} vede přes nulu. Kolik dílů ujdeš z ${Z(a)} k nule a kolik potom z nuly do ${b}?`,
      `Když leží jedno číslo vlevo a druhé vpravo od nuly, rozděl si cestu na dvě části a ty pak sečti. Od ${Z(a)} k nule je tolik dílů, kolik říká číslice za minusem, a od nuly k ${b} tolik, kolik říká samo číslo. Pozor na odečtení obou číslic bez ohledu na minus — tím bys dostal jen rozdíl vzdáleností, ne celou cestu.`,
    ],
    [
      `Z ${Z(a)} k nule: ${pad(-a, "DÍL")}.`,
      `Z nuly k ${b}: ${pad(b, "DÍL")}.`,
      `Celá cesta: ${-a} + ${b} = ${d}, tedy ${pad(d, "DÍL")}.`,
    ],
  ));
}

function zpetnaTeplota(): PracticeTask | null {
  const konec = rnd(-3, 4), zmena = rnd(3, 12), rano = konec - zmena;
  if (konec === 0 || rano >= 0) return null;
  return overeno(ciselnaUloha(
    `V poledne ukazoval teploměr ${Z(konec)} °C, a to je o ${zmena} °C víc než ráno. Jakou teplotu ukazoval ráno?`,
    `${Z(rano)} °C`,
    [
      { value: `${Z(konec + zmena)} °C`, why: `Oteplení se přičetlo ještě jednou. Ráno bylo chladněji než v poledne, takže se od ${Z(konec)} °C jde po ose zpátky doleva.` },
      { value: `${Z(-rano)} °C`, why: `Číslo sedí, znaménko ne: posun o ${pad(zmena, "DÍL")} doleva z ${Z(konec)} končí vlevo od nuly.` },
      { value: "0 °C", why: `Nula je jen bod mrazu na cestě. Z ${Z(konec)} °C se má jít dolů o ${zmena} °C, a to je ještě dál.` },
    ],
    [
      `Ráno bylo chladněji než v poledne, takže se z ${Z(konec)} °C musíš po ose vrátit o ${pad(zmena, "DÍL")}. Kterým směrem?`,
      `Když víš, o kolik teplota stoupla, a znáš výsledek, hledáš začátek — to znamená jít po ose obráceně, tedy doleva. Z ${Z(konec)} °C odpočítej ${pad(zmena, "DÍL")} zpátky${konec > 0 ? ": nejdřív k nule a pak dál pod ni, protože cesta k nule sama tolik dílů nezabere" : ", a protože poledne bylo pod nulou, celá cesta zůstane vlevo od ní"}.`,
    ],
    [
      `Zpětný posun je doleva o ${pad(zmena, "DÍL")}.`,
      konec > 0 ? `Z ${Z(konec)} °C nejdřív k nule a pak ještě dál pod nulu.` : `Poledne bylo pod nulou, takže se jde jen dál doleva.`,
      `Ráno bylo ${Z(rano)} °C. Kontrola: ${Z(rano)} + ${zmena} = ${Z(konec)} ✓`,
    ],
  ));
}

function gen(level: number): PracticeTask[] {
  if (level === 1) {
    const t = [naOse, teplomer, hloubka, porovnejSNulou];
    return sada(30, (i) => t[i % 4]());
  }
  if (level === 2) {
    const t = [mezi, soused, opacne, serad];
    return sada(30, (i) => t[i % 4]());
  }
  const t = [oteplilo, ochladilo, patra, vzdalenostPresNulu, zpetnaTeplota];
  return sada(30, (i) => t[i % 5]());
}

export const ZAPORNACISLANACISELNEOSE: TopicMetadata[] = [
  {
    id: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    rvpNodeId: "g5-matematika-cislo-a-pocetni-operace-velka-cisla-a-desetinna-cisla-zaporna-cisla-na-ciselne-ose",
    title: "Záporná čísla na číselné ose",
    studentTitle: "Záporná čísla",
    subject: "matematika",
    category: "Číslo a početní operace",
    topic: "Velká čísla a desetinná čísla",
    briefDescription: "Pochopíš záporná čísla — třeba teplotu pod nulou.",
    keywords: ["záporná čísla", "číselná osa", "teplota", "porovnávání", "absolutní hodnota", "minus"],
    goals: [
      "Umístit záporné číslo na číselnou osu",
      "Porovnat záporná čísla navzájem i s kladnými",
      "Pochopit záporná čísla v kontextu teploty a hlubiny",
      "Určit vzdálenost čísla od nuly",
    ],
    boundaries: ["Úroveň 3: posun po číselné ose o několik dílů (změna teploty, patra pod zemí); bez písemného počítání se zápornými čísly", "Bez záporných desetinných čísel"],
    gradeRange: [5, 5],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    generator: gen,
    helpTemplate: {
      hint: "Záporná čísla leží vlevo od nuly na číselné ose. Platí: čím větší záporné číslo, tím menší hodnota. Takže −5 < −3 < 0 < 2.",
      steps: [
        "Nakresli si číselnou osu: ... −5, −4, −3, −2, −1, 0, 1, 2, 3, 4, 5 ...",
        "Záporná čísla jsou vlevo od nuly, kladná vpravo.",
        "Číslo více vlevo je menší: −8 < −3.",
        "Každé záporné číslo je menší než nula a než každé kladné číslo.",
      ],
      commonMistake: "Chyba: žáci si myslí, že −8 > −3, protože 8 > 3. Ale na číselné ose −8 leží více vlevo, takže −8 < −3.",
      example: "Porovnej −5 a −2: na číselné ose −5 je vlevo od −2, takže −5 < −2.",
    },
  },
];
