/**
 * Matematika 6. ročník — Násobení a dělení desetinných čísel.
 *
 * Stavba podle výpočetního vzoru `fyzika/mereniDelky.ts`, helpery výhradně
 * z `./_shared`. Žák jen VYBÍRÁ (select_one): výsledky jsou desetinná čísla
 * a číselné pole by zahodilo čárku.
 *
 *  • L1 — rozcvička z 5. ročníku: desetinné číslo · nebo : jednociferné
 *    přirozené číslo; kolik desetinných míst bude mít součin.
 *  • L2 — jádro 6. ročníku: „Vypočítej součin/podíl …“ s desetinným
 *    činitelem i dělitelem, přirozené číslo : desetinné číslo.
 *  • L3 — transfer: slovní úlohy (cena, stříhání na kusy), doplnění
 *    chybějícího čísla do rovnosti dvou podílů (inverze, násobek 10 i 100),
 *    odhad bez výpočtu, dvoukrokový příklad.
 *
 * Čísla se drží jako celé číslo + počet desetinných míst (`Dc`), takže se
 * klíč počítá bez chyb plovoucí čárky a dělení se staví zpětně (beze zbytku,
 * nejvýš dvě desetinná místa). Každý distraktor je výsledek konkrétní chyby
 * spočítaný z týchž čísel (chybný počet desetinných míst, posun čárky jen
 * v děliteli, záměna operace, násobení „po částech“).
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { pad } from "@/lib/czechGrammar";
import { cis, rnd, pick, buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

// ── Přesná aritmetika desetinných čísel ────────────────────────────────────
const P10 = [1, 10, 100, 1000, 10000, 100000];

/** Desetinné číslo = celé číslo `n` s `d` desetinnými místy (3,6 → {36, 1}). */
interface Dc {
  n: number;
  d: number;
}

const hod = (x: Dc): number => x.n / P10[x.d];
const c = (x: Dc): string => cis(hod(x));

/** Zkrátí nuly na konci za čárkou (2,40 → 2,4). */
function zkrat(x: Dc): Dc {
  let { n, d } = x;
  while (d > 0 && n % 10 === 0) {
    n /= 10;
    d--;
  }
  return { n, d };
}

/** Náhodné desetinné číslo s `d` místy a nenulovou poslední číslicí. */
function nahodne(min: number, max: number, d: number): Dc {
  let n = rnd(min, max);
  while (n % 10 === 0) n = rnd(min, max);
  return { n, d };
}

const cele = (k: number): Dc => ({ n: k, d: 0 });
const soucin = (a: Dc, b: Dc): Dc => zkrat({ n: a.n * b.n, d: a.d + b.d });
const posun = (a: Dc, o: number): Dc =>
  o >= 0 ? zkrat({ n: a.n * P10[Math.max(0, o - a.d)], d: Math.max(0, a.d - o) }) : zkrat({ n: a.n, d: a.d - o });

/** Přesný podíl a : b, jen když vyjde beze zbytku na nejvýš `maxMist` desetinných míst. */
function podil(a: Dc, b: Dc, maxMist = 2): Dc | null {
  const citatel = a.n * P10[b.d] * P10[maxMist];
  const jmenovatel = b.n * P10[a.d];
  if (citatel % jmenovatel !== 0) return null;
  return zkrat({ n: citatel / jmenovatel, d: maxMist });
}

const MISTA = ["", "jedno desetinné místo", "dvě desetinná místa", "tři desetinná místa", "čtyři desetinná místa"];
const O_MISTA = ["", "o jedno místo", "o dvě místa", "o tři místa"];
const NUL = ["", "jednu nulu", "dvě nuly", "tři nuly"];

/** Zápis bez zkrácení nul na konci (Dc {120, 3} → „0,120“). */
function zapisSNulami(x: Dc): string {
  if (x.d === 0) return cis(x.n);
  const cela = Math.floor(x.n / P10[x.d]);
  const des = String(x.n % P10[x.d]).padStart(x.d, "0");
  return `${cis(cela)},${des}`;
}

/** Peněžní částka: celé koruny bez čárky, s haléři vždy na dvě místa (24,80 Kč). */
function kc(v: number): string {
  const s = cis(v);
  const i = s.indexOf(",");
  if (i < 0) return `${s} Kč`;
  return `${s.padEnd(i + 3, "0")} Kč`;
}

// ── Kontrola hotové úlohy ──────────────────────────────────────────────────
/** Obsahuje text klíč jako samostatné číslo (krátký klíč) nebo podřetězec (delší)? */
function obsahuje(text: string, klic: string): boolean {
  if (klic.length >= 3) return text.includes(klic);
  const esc = klic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\d,])${esc}(?![\\d]|,\\d)`).test(text);
}

/**
 * Úloha se čtyřmi možnostmi, nebo `null` (pak `losUlohy` táhne znovu), když
 * distraktory splynou, nápověda nebo zadání obsahují klíč, nebo jsou obě
 * nápovědy stejné.
 */
function uloha(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: string[]; solutionSteps: string[]; explanation: string },
): PracticeTask | null {
  if (obsahuje(question, correct)) return null;
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (!t) return null;
  // Sdílený helper připojí k malé nápovědě „Čísla ze zadání: 0,9, 3,25.“ —
  // čárka v seznamu se tu plete s desetinnou čárkou a čísla už stojí v textu
  // kroku. Řádek proto odstraníme; každý první krok tohoto tématu obsahuje
  // čísla z konkrétní úlohy sám.
  const hints = (t.hints ?? []).map((h) => h.replace(/ Čísla ze zadání: .*\.$/, ""));
  t.hints = hints;
  if (hints.some((h) => obsahuje(h, correct))) return null;
  if (hints.length < 2 || hints[0] === hints[1]) return null;
  return t;
}

// ── Generátor ──────────────────────────────────────────────────────────────
function gen(level: number): PracticeTask[] {
  const tvor = level === 1 ? genL1 : level === 2 ? genL2 : genL3;
  return ruzneUlohy(() => losUlohy(tvor));
}

// ── L1 — rozcvička: desetinné číslo a jednociferné přirozené číslo ─────────
function genL1(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.4) return l1Nasobeni();
  if (r < 0.75) return l1Deleni();
  return l1Mista();
}

function l1Nasobeni(): PracticeTask | null {
  const d = pick([1, 1, 2]);
  const a = d === 1 ? nahodne(12, 99, 1) : nahodne(101, 599, 2);
  const k = rnd(2, 9);
  const vysl = soucin(a, cele(k));
  const celaCast = Math.floor(a.n / P10[d]);
  const zlomek = a.n % P10[d];
  const bezCarky = a.n * k;

  const distractors: Distractor[] = [];
  if (d === 1 && zlomek * k >= 10) {
    distractors.push({
      value: cis(celaCast * k + (zlomek * k) / 100),
      why: `Násobil jsi zvlášť celou část (${cis(celaCast)} · ${k}) a zvlášť desetiny (${cis(zlomek)} · ${k}) a výsledky napsal za sebe. Desetinné číslo násob celé naráz jako přirozené číslo, čárku dopiš až nakonec.`,
    });
  }
  const prenos = Math.floor((zlomek * k) / P10[d]);
  if (prenos > 0) {
    distractors.push({
      value: cis(celaCast * k + ((zlomek * k) % P10[d]) / P10[d]),
      why: `Ztratil jsi přenos přes desetinnou čárku: desetinná část dala po vynásobení víc než jeden celek a ten patří k celým. Násob celé číslo naráz, jako by čárka nebyla.`,
    });
  }
  distractors.push(
    {
      value: cis(hod(vysl) * 10),
      why: `Čárka je o jedno místo vpravo. Druhý činitel je přirozené číslo, takže součin má stejný počet desetinných míst jako ${c(a)}.`,
    },
    {
      value: cis(hod(vysl) / 10),
      why: `Oddělil jsi o jedno desetinné místo víc, než má činitel ${c(a)}. Přirozené číslo ${k} žádné desetinné místo nepřidává.`,
    },
    {
      value: cis(hod(a) + k),
      why: `Sčítal jsi místo násobení. Znaménko · znamená násobení.`,
    },
  );

  const zkraceno = zkrat({ n: bezCarky, d }).d < d;
  return uloha(`Kolik je ${c(a)} · ${k}?`, c(vysl), distractors, {
    hints: [
      `Krok 1: Vynásob čísla, jako by v nich čárka nebyla: ${cis(a.n)} · ${k}.`,
      `Krok 2: Spočítej, kolik číslic je v činiteli ${c(a)} za čárkou, a stejný počet číslic odděl čárkou zprava i ve výsledku.`,
      `Krok 3: Odhadem ověř, že výsledek je zhruba ${k}krát větší než ${c(a)}.`,
    ],
    solutionSteps: [
      `Bez čárky: ${cis(a.n)} · ${k} = ${cis(bezCarky)}`,
      `Činitel ${c(a)} má ${MISTA[d]}, proto v čísle ${cis(bezCarky)} oddělíme zprava ${MISTA[d]}.`,
      `${c(a)} · ${k} = ${c(vysl)}${zkraceno ? " (nulu na konci za čárkou vynecháme)" : ""}`,
    ],
    explanation: `Desetinné číslo násobíme jako přirozené a čárku umístíme podle desetinných míst činitelů. ${c(a)} má ${MISTA[d]}, přirozené číslo ${k} nemá žádné, proto má součin také ${MISTA[d]}: ${c(a)} · ${k} = ${c(vysl)}.`,
  });
}

function l1Deleni(): PracticeTask | null {
  const d = pick([1, 1, 2]);
  const vysl = d === 1 ? nahodne(2, 99, 1) : nahodne(11, 299, 2);
  const k = rnd(2, 9);
  const delenec: Dc = { n: vysl.n * k, d };
  // Dělenec má být desetinné číslo se všemi d místy (7,2 : 3, ne 7,20 : 3).
  if (delenec.n % 10 === 0) return null;
  return uloha(
    `Kolik je ${c(delenec)} : ${k}?`,
    c(vysl),
    [
      {
        value: cis(hod(vysl) * 10),
        why: `Čárku v podílu jsi posunul o místo doprava. Při dělení přirozeným číslem patří čárka v podílu přesně tam, kde ji při dělení překročíš v dělenci.`,
      },
      {
        value: cis(hod(vysl) / 10),
        why: `Čárku v podílu jsi napsal o místo dřív. Zkus zkoušku: výsledek vynásobený číslem ${k} musí dát zpět ${c(delenec)}.`,
      },
      {
        value: c(soucin(delenec, cele(k))),
        why: `Násobil jsi místo dělení. Znaménko : znamená dělení, výsledek musí být menší než ${c(delenec)}.`,
      },
    ],
    {
      hints: [
        `Krok 1: Děl jako přirozená čísla a desetinnou čárku napiš do podílu ve chvíli, kdy ji v dělenci ${c(delenec)} překročíš.`,
        `Krok 2: Při dělení přirozeným číslem ${k} se čárka v podílu neposouvá: je na stejném místě jako v dělenci.`,
        `Krok 3: Zkouškou ověř, že podíl vynásobený číslem ${k} dá zpět dělenec.`,
      ],
      solutionSteps: [
        `Bez čárky: ${cis(delenec.n)} : ${k} = ${cis(vysl.n)}`,
        `Dělenec ${c(delenec)} má ${MISTA[d]}, stejně tolik jich má podíl: ${c(delenec)} : ${k} = ${c(vysl)}`,
        `Zkouška: ${c(vysl)} · ${k} = ${c(delenec)}`,
      ],
      explanation: `Dělíme-li desetinné číslo přirozeným číslem, počítáme jako s přirozenými čísly a čárku v podílu napíšeme, jakmile ji překročíme v dělenci. Proto ${c(delenec)} : ${k} = ${c(vysl)}, což potvrdí zkouška ${c(vysl)} · ${k} = ${c(delenec)}.`,
    },
  );
}

function l1Mista(): PracticeTask | null {
  const [d1, d2] = pick([[1, 1], [1, 1], [1, 2], [2, 1]]);
  const x = d1 === 1 ? nahodne(2, 99, 1) : nahodne(2, 399, 2);
  const y = d2 === 1 ? nahodne(2, 99, 1) : nahodne(2, 399, 2);
  // Končí-li součin bez čárky nulou, desetinné místo se zkrátí a pravidlo
  // „součet míst“ by dalo jiný počet, než kolik má výsledek zapsaný.
  if ((x.n * y.n) % 10 === 0) return null;
  const soucet = d1 + d2;
  const cislic = (c(x) + c(y)).replace(/\D/g, "").length;
  return uloha(
    `Kolik desetinných míst má součin ${c(x)} · ${c(y)}?`,
    pad(soucet, "MÍSTO"),
    [
      {
        value: pad(Math.max(d1, d2), "MÍSTO"),
        why: `Opsal jsi počet desetinných míst jen jednoho činitele. Počet desetinných míst součinu je SOUČET desetinných míst obou činitelů.`,
      },
      {
        value: pad(cislic, "MÍSTO"),
        why: `Spočítal jsi všechny číslice obou činitelů, i ty před čárkou. Počítají se jen číslice za desetinnou čárkou.`,
      },
      {
        value: pad(0, "MÍSTO"),
        why: `Součin dvou desetinných čísel je také desetinné číslo. Násobíš sice jako přirozená čísla, ale čárku pak musíš dopsat.`,
      },
    ],
    {
      hints: [
        `Krok 1: Násobit nemusíš, stačí spočítat číslice za čárkou zvlášť u čísla ${c(x)} a zvlášť u čísla ${c(y)}.`,
        `Krok 2: Počty číslic za čárkou u ${c(x)} a u ${c(y)} sečti. Tolik míst oddělíš čárkou v součinu.`,
      ],
      solutionSteps: [
        `${c(x)} má ${MISTA[d1]}, ${c(y)} má ${MISTA[d2]}.`,
        `Součin má dohromady ${MISTA[soucet]}: ${cis(x.n)} · ${cis(y.n)} = ${cis(x.n * y.n)}, tedy ${c(x)} · ${c(y)} = ${c(soucin(x, y))}.`,
      ],
      explanation: `Počet desetinných míst součinu je součet desetinných míst činitelů. Tady dává součin bez čárky číslo, které nekončí nulou, takže se žádné místo nezkrátí a součin má ${MISTA[soucet]}.`,
    },
  );
}

// ── L2 — desetinné · desetinné, dělení desetinným číslem ───────────────────
function genL2(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.4) return l2Soucin();
  if (r < 0.75) return l2Podil();
  return l2PrirozenyDelenec();
}

function l2Soucin(): PracticeTask | null {
  const x = nahodne(2, 99, 1);
  const y = Math.random() < 0.6 ? nahodne(2, 99, 1) : { n: pick([5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 125, 150]), d: 2 };
  if (y.n % 10 === 0) return null;
  const surovy = { n: x.n * y.n, d: x.d + y.d };
  const vysl = zkrat(surovy);
  if (vysl.d > 2) return null;
  const zkraceno = vysl.d !== surovy.d;
  // Součin s nezkrácenými nulami (0,120): cis() by nuly na konci zahodil.
  const surovyText = zapisSNulami(surovy);
  const jednaNula = surovy.d - vysl.d === 1;
  const w1 = Math.floor(x.n / P10[x.d]), f1 = x.n % P10[x.d];
  const w2 = Math.floor(y.n / P10[y.d]), f2 = y.n % P10[y.d];
  return uloha(
    `Vypočítej součin ${c(x)} · ${c(y)}.`,
    c(vysl),
    [
      {
        value: cis(hod(vysl) * 10),
        why: `Oddělil jsi desetinná místa jen jednoho činitele. Počet desetinných míst součinu je SOUČET desetinných míst obou činitelů.`,
      },
      {
        value: cis(hod(vysl) / 10),
        why: `Oddělil jsi o jedno desetinné místo víc, než mají oba činitele dohromady.`,
      },
      {
        value: cis(w1 * w2 + (f1 * f2) / P10[x.d + y.d]),
        why: `Násobil jsi zvlášť celé části (${cis(w1)} · ${cis(w2)}) a zvlášť desetinné části. Desetinné číslo násob celé naráz jako přirozené číslo, čárku dopiš až nakonec.`,
      },
      {
        value: cis(hod(x) + hod(y)),
        why: `Sčítal jsi místo násobení. Znaménko · znamená násobení.`,
      },
    ],
    {
      hints: [
        `Krok 1: Vynásob čísla, jako by v nich čárka nebyla: ${cis(x.n)} · ${cis(y.n)}.`,
        `Krok 2: Sečti počty desetinných míst obou činitelů ${c(x)} a ${c(y)} a tolik míst odděl ve výsledku čárkou zprava.`,
        `Krok 3: Nuly na konci za desetinnou čárkou pak můžeš vynechat.`,
      ],
      solutionSteps: [
        `Bez čárek: ${cis(x.n)} · ${cis(y.n)} = ${cis(surovy.n)}`,
        `${c(x)} má ${MISTA[x.d]}, ${c(y)} má ${MISTA[y.d]}, dohromady ${MISTA[surovy.d]}.`,
        ...(zkraceno
          ? [
              `V čísle ${cis(surovy.n)} oddělíme zprava ${MISTA[surovy.d]}: ${surovyText}.`,
              `${jednaNula ? "Nula" : "Nuly"} na konci za čárkou hodnotu nemění, proto ${jednaNula ? "ji" : "je"} vynecháme: ${c(x)} · ${c(y)} = ${surovyText} = ${c(vysl)}`,
            ]
          : [`${c(x)} · ${c(y)} = ${c(vysl)}`]),
      ],
      explanation: zkraceno
        ? `Desetinná čísla násobíme jako přirozená a v součinu oddělíme tolik desetinných míst, kolik mají činitelé dohromady (${MISTA[surovy.d]}), takže dostaneme ${surovyText}. Nuly na konci za desetinnou čárkou hodnotu nemění, proto je můžeme vynechat: ${c(x)} · ${c(y)} = ${c(vysl)}.`
        : `Desetinná čísla násobíme jako přirozená a v součinu oddělíme tolik desetinných míst, kolik mají činitelé dohromady (${MISTA[surovy.d]}). Proto ${c(x)} · ${c(y)} = ${c(vysl)}.`,
    },
  );
}

function l2Podil(): PracticeTask | null {
  const delitel: Dc = Math.random() < 0.6
    ? { n: pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25, 35, 45]), d: 1 }
    : { n: pick([4, 5, 6, 8, 12, 15, 25, 35, 45, 125]), d: 2 };
  const vysl: Dc = delitel.d === 1 && Math.random() < 0.5 ? nahodne(11, 99, 1) : cele(rnd(2, 40));
  const delenec: Dc = { n: delitel.n * vysl.n, d: delitel.d + vysl.d };
  // Dělenec: desetinné číslo se všemi místy (ne 4,50 ani 12,0).
  if (delenec.n % 10 === 0 || delenec.d > 2) return null;
  const nasobek = P10[delitel.d];
  const upravenyDelenec = posun(delenec, delitel.d);
  const upravenyDelitel = cele(delitel.n);
  return uloha(
    `Vypočítej podíl ${c(delenec)} : ${c(delitel)}.`,
    c(vysl),
    [
      {
        value: cis(hod(vysl) / nasobek),
        why: `Posunul jsi čárku jen v děliteli (počítal jsi ${c(delenec)} : ${c(upravenyDelitel)}). Dělence a dělitele musíš vynásobit STEJNÝM číslem (10, 100), jinak se podíl změní.`,
      },
      {
        value: cis(hod(vysl) * 10),
        why: `V dělenci jsi posunul čárku o jedno místo víc než v děliteli. Obě čísla musíš vynásobit stejným číslem (${cis(nasobek)}).`,
      },
      {
        value: c(soucin(delenec, delitel)),
        why: hod(delitel) < 1
          ? `Násobil jsi místo dělení. Dělíš-li číslem menším než 1, výsledek je VĚTŠÍ než dělenec, takže menší číslo nemůže být správně.`
          : `Násobil jsi místo dělení. Znaménko : znamená dělení.`,
      },
      {
        value: cis(hod(vysl) * 100),
        why: `V dělenci jsi posunul čárku o dvě místa víc než v děliteli. Obě čísla musíš vynásobit stejným číslem (${cis(nasobek)}).`,
      },
    ],
    {
      hints: [
        `Krok 1: Dělitel ${c(delitel)} převeď na přirozené číslo: posuň v něm čárku ${O_MISTA[delitel.d]} doprava.`,
        `Krok 2: O stejný počet míst posuň čárku i v dělenci ${c(delenec)}; podíl se tím nezmění.`,
        `Krok 3: Pak děl upraveným dělitelem ${c(upravenyDelitel)} jako obvykle a výsledek ověř zkouškou.`,
      ],
      solutionSteps: [
        `Obě čísla vynásobíme ${cis(nasobek)}: ${c(delenec)} : ${c(delitel)} = ${c(upravenyDelenec)} : ${c(upravenyDelitel)}`,
        `${c(upravenyDelenec)} : ${c(upravenyDelitel)} = ${c(vysl)}`,
        `Zkouška: ${c(vysl)} · ${c(delitel)} = ${c(delenec)}`,
      ],
      explanation: `Desetinným číslem neumíme dělit přímo, proto dělence i dělitele vynásobíme ${cis(nasobek)}. Podíl se tím nezmění a dělitel je přirozené číslo: ${c(upravenyDelenec)} : ${c(upravenyDelitel)} = ${c(vysl)}.`,
    },
  );
}

function l2PrirozenyDelenec(): PracticeTask | null {
  const delitel: Dc = pick([
    { n: 2, d: 1 }, { n: 3, d: 1 }, { n: 4, d: 1 }, { n: 5, d: 1 }, { n: 6, d: 1 },
    { n: 8, d: 1 }, { n: 25, d: 2 }, { n: 75, d: 2 }, { n: 5, d: 2 }, { n: 15, d: 2 },
    { n: 12, d: 2 }, { n: 4, d: 2 },
  ]);
  const vysl = cele(rnd(4, 300));
  const delenecDc = soucin(delitel, vysl);
  if (delenecDc.d !== 0 || delenecDc.n < 2 || delenecDc.n > 150) return null;
  const N = delenecDc.n;
  const nasobek = P10[delitel.d];
  return uloha(
    `Vypočítej podíl ${cis(N)} : ${c(delitel)}.`,
    c(vysl),
    [
      {
        value: cis(hod(vysl) / nasobek),
        why: `Dělitele jsi upravil na ${cis(delitel.n)}, ale dělenec ${cis(N)} jsi nechal beze změny. Dělence a dělitele musíš vynásobit STEJNÝM číslem, k dělenci tedy připiš ${NUL[delitel.d]}.`,
      },
      {
        value: c(soucin(cele(N), delitel)),
        why: `Násobil jsi místo dělení. Dělíš-li číslem menším než 1, výsledek je VĚTŠÍ než dělenec, takže menší číslo nemůže být správně.`,
      },
      {
        value: cis(hod(vysl) * 10),
        why: `K dělenci jsi připsal o jednu nulu víc, než o kolik míst se posunula čárka v děliteli.`,
      },
      {
        value: cis(hod(vysl) / (nasobek * 10)),
        why: `Posunul jsi čárku jen v děliteli a navíc o jedno místo víc. Obě čísla vynásob stejným číslem (${cis(nasobek)}).`,
      },
    ],
    {
      hints: [
        `Krok 1: Dělitel ${c(delitel)} převeď na přirozené číslo posunutím čárky ${O_MISTA[delitel.d]} doprava.`,
        `Krok 2: Dělenec ${cis(N)} vynásob stejným číslem, tedy k němu připiš ${NUL[delitel.d]}, a pak děl.`,
        `Krok 3: Dělíš číslem menším než 1, takže výsledek musí vyjít větší než ${cis(N)}.`,
      ],
      solutionSteps: [
        `Obě čísla vynásobíme ${cis(nasobek)}: ${cis(N)} : ${c(delitel)} = ${cis(N * nasobek)} : ${cis(delitel.n)}`,
        `${cis(N * nasobek)} : ${cis(delitel.n)} = ${c(vysl)}`,
        `Zkouška: ${c(vysl)} · ${c(delitel)} = ${cis(N)}`,
      ],
      explanation: `I přirozené číslo musíme vynásobit stejným číslem jako desetinného dělitele, aby se podíl nezměnil. Protože ${c(delitel)} je menší než 1, vejde se do čísla ${cis(N)} víckrát, než je ${cis(N)}: podíl je ${c(vysl)}.`,
    },
  );
}

// ── L3 — slovní úlohy, ekvivalence, odhad, dva kroky ───────────────────────
function genL3(): PracticeTask | null {
  const r = Math.random();
  if (r < 0.15) return l3CenaZaKilogram();
  if (r < 0.28) return l3Nakup();
  if (r < 0.43) return l3Kusy();
  if (r < 0.63) return l3Ekvivalence();
  if (r < 0.8) return l3Odhad();
  return l3DvaKroky();
}

interface Osoba {
  jmeno: string;
  koupil: string;
  zaplatil: string;
}
const OSOBY: Osoba[] = [
  { jmeno: "Ema", koupil: "koupila", zaplatil: "zaplatila" },
  { jmeno: "Tomáš", koupil: "koupil", zaplatil: "zaplatil" },
  { jmeno: "Klára", koupil: "koupila", zaplatil: "zaplatila" },
  { jmeno: "Petr", koupil: "koupil", zaplatil: "zaplatil" },
  { jmeno: "Anna", koupil: "koupila", zaplatil: "zaplatila" },
  { jmeno: "Jakub", koupil: "koupil", zaplatil: "zaplatil" },
  { jmeno: "Lucie", koupil: "koupila", zaplatil: "zaplatila" },
  { jmeno: "Marek", koupil: "koupil", zaplatil: "zaplatil" },
];

/** Zboží v 2. pádě (kolik kilogramů čeho) a rozumné ceny za 1 kg. */
const ZBOZI: { gen: string; ceny: number[] }[] = [
  { gen: "jablek", ceny: [24, 28, 32, 36, 40] },
  { gen: "hrušek", ceny: [32, 36, 44, 48] },
  { gen: "třešní", ceny: [80, 96, 120, 140] },
  { gen: "brambor", ceny: [16, 18, 20, 24] },
  { gen: "sýra", ceny: [160, 180, 220, 240] },
  { gen: "rajčat", ceny: [48, 56, 64, 72] },
  { gen: "švestek", ceny: [36, 40, 52, 60] },
];

const HMOTNOSTI: Dc[] = [
  { n: 4, d: 1 }, { n: 5, d: 1 }, { n: 6, d: 1 }, { n: 8, d: 1 }, { n: 12, d: 1 },
  { n: 15, d: 1 }, { n: 25, d: 1 }, { n: 35, d: 1 }, { n: 25, d: 2 }, { n: 75, d: 2 },
  { n: 125, d: 2 },
];

function l3CenaZaKilogram(): PracticeTask | null {
  const os = pick(OSOBY);
  const zb = pick(ZBOZI);
  const m = pick(HMOTNOSTI);
  const cena = cele(pick(zb.ceny));
  const celkem = soucin(m, cena);
  if (celkem.d !== 0) return null; // cena nákupu v celých korunách
  const nasobek = P10[m.d];
  const mensiNez1 = hod(m) < 1;
  return uloha(
    `${os.jmeno} ${os.koupil} ${c(m)} kg ${zb.gen} za ${c(celkem)} Kč. Kolik stojí 1 kg?`,
    kc(hod(cena)),
    [
      {
        value: kc(hod(soucin(celkem, m))),
        why: mensiNez1
          ? `Násobil jsi místo dělení. Dělíš-li číslem menším než 1, výsledek je VĚTŠÍ než dělenec, takže cena 1 kg musí být vyšší než ${c(celkem)} Kč.`
          : `Násobil jsi místo dělení. Cenu 1 kg dostaneš, když cenu nákupu vydělíš počtem kilogramů.`,
      },
      {
        value: kc(hod(cena) / nasobek),
        why: `Posunul jsi čárku jen v děliteli ${c(m)}. Cenu ${c(celkem)} musíš vynásobit stejným číslem (${cis(nasobek)}), jinak se podíl změní.`,
      },
      {
        value: kc(hod(cena) * 10),
        why: `Cenu ${c(celkem)} jsi vynásobil ${cis(nasobek * 10)}, ale hmotnost ${c(m)} jen ${cis(nasobek)}. Obě čísla vynásob stejným číslem (${cis(nasobek)}).`,
      },
      {
        value: kc(hod(celkem)),
        why: `To je cena celého nákupu, ne jednoho kilogramu. Vyděl ji hmotností ${c(m)} kg.`,
      },
    ],
    {
      hints: [
        `Krok 1: Cenu jednoho kilogramu zjistíš dělením: cena nákupu : počet kilogramů, tady ${c(celkem)} : ${c(m)}.`,
        `Krok 2: Dělitel ${c(m)} převeď na přirozené číslo posunutím čárky ${O_MISTA[m.d]} doprava a stejně vynásob i cenu ${c(celkem)}.`,
        mensiNez1
          ? `Krok 3: Nákup vážil méně než 1 kg, takže 1 kg musí stát víc, než ${os.zaplatil} ${os.jmeno}.`
          : `Krok 3: Nákup vážil víc než 1 kg, takže 1 kg musí stát méně než celý nákup.`,
      ],
      solutionSteps: [
        `Cena 1 kg = ${c(celkem)} : ${c(m)}`,
        `Obě čísla vynásobíme ${cis(nasobek)}: ${cis(hod(celkem) * nasobek)} : ${cis(m.n)} = ${c(cena)}`,
        `Zkouška: ${c(m)} · ${c(cena)} = ${c(celkem)} Kč`,
      ],
      explanation: `Cena jednoho kilogramu je cena nákupu vydělená hmotností. Dělitel ${c(m)} upravíme na přirozené číslo a cenu vynásobíme stejně, takže 1 kg ${zb.gen} stojí ${c(cena)} Kč.`,
    },
  );
}

function l3Nakup(): PracticeTask | null {
  const os = pick(OSOBY);
  const zb = pick(ZBOZI);
  const m = pick(HMOTNOSTI);
  // Cena za kilogram s haléři (24,8 Kč), nákup ale vyjde v celých korunách.
  const zaklad = pick(zb.ceny) * 10;
  const cena = nahodne(zaklad - 9, zaklad + 9, 1);
  const celkem = soucin(m, cena);
  if (celkem.d !== 0) return null;
  const obracene = podil(cena, m);
  const distractors: Distractor[] = [
    {
      value: kc(hod(celkem) * 10),
      why: `V součinu jsi oddělil málo desetinných míst. Počet desetinných míst součinu je SOUČET desetinných míst obou činitelů.`,
    },
    {
      value: kc(hod(celkem) / 10),
      why: `V součinu jsi oddělil o jedno desetinné místo víc, než mají činitelé ${c(m)} a ${c(cena)} dohromady.`,
    },
  ];
  if (obracene) {
    distractors.push({
      value: kc(hod(obracene)),
      why: `Dělil jsi místo násobení. Cenu nákupu dostaneš, když cenu 1 kg vynásobíš počtem kilogramů.`,
    });
  }
  distractors.push({
    value: kc(hod(cena) + hod(m)),
    why: `Sčítal jsi cenu a hmotnost. Za každý kilogram se platí cena 1 kg, proto se násobí.`,
  });
  return uloha(
    `${os.jmeno} ${os.koupil} ${c(m)} kg ${zb.gen}. Kilogram stojí ${kc(hod(cena))}. Kolik ${os.zaplatil}?`,
    kc(hod(celkem)),
    distractors,
    {
      hints: [
        `Krok 1: Cena nákupu = cena 1 kg · počet kilogramů, tady ${c(cena)} · ${c(m)} (${kc(hod(cena))} je totéž co ${c(cena)} Kč).`,
        `Krok 2: Vynásob čísla bez čárek a v součinu odděl tolik desetinných míst, kolik jich mají ${c(cena)} a ${c(m)} dohromady.`,
        `Krok 3: Odhadni: ${c(m)} kg je ${hod(m) < 1 ? "méně" : "víc"} než 1 kg, takže nákup stojí ${hod(m) < 1 ? "méně" : "víc"} než jeden kilogram.`,
      ],
      solutionSteps: [
        `Cena ${kc(hod(cena))} = ${c(cena)} Kč (nula na konci za čárkou hodnotu nemění).`,
        `Bez čárek: ${cis(cena.n)} · ${cis(m.n)} = ${cis(cena.n * m.n)}`,
        `Činitelé mají dohromady ${MISTA[cena.d + m.d]}, proto ${c(cena)} · ${c(m)} = ${c(celkem)}`,
        `${os.jmeno} ${os.zaplatil} ${c(celkem)} Kč.`,
      ],
      explanation: `Cena nákupu je cena jednoho kilogramu krát počet kilogramů. Součin ${c(cena)} · ${c(m)} má tolik desetinných míst, kolik mají činitelé dohromady, a po vynechání nul vyjde ${c(celkem)} Kč.`,
    },
  );
}

interface Material {
  co: string;
  zajmeno: string;
  sloveso: string;
}
const MATERIALY: Material[] = [
  { co: "Stuha", zajmeno: "ji", sloveso: "stříhá" },
  { co: "Provaz", zajmeno: "ho", sloveso: "řeže" },
  { co: "Látka", zajmeno: "ji", sloveso: "stříhá" },
  { co: "Lišta", zajmeno: "ji", sloveso: "řeže" },
  { co: "Drát", zajmeno: "ho", sloveso: "stříhá" },
  { co: "Hadice", zajmeno: "ji", sloveso: "řeže" },
];
const KUSY: Dc[] = [
  { n: 15, d: 2 }, { n: 2, d: 1 }, { n: 25, d: 2 }, { n: 3, d: 1 }, { n: 35, d: 2 },
  { n: 4, d: 1 }, { n: 45, d: 2 }, { n: 6, d: 1 }, { n: 75, d: 2 }, { n: 8, d: 1 },
  { n: 12, d: 1 }, { n: 15, d: 1 },
];

function l3Kusy(): PracticeTask | null {
  const mat = pick(MATERIALY);
  const jmeno = pick(OSOBY).jmeno;
  const kus = pick(KUSY);
  const pocet = rnd(4, 30);
  const delka = soucin(kus, cele(pocet));
  if (delka.d === 0) return null; // délka má být desetinné číslo
  const nasobek = P10[kus.d];
  return uloha(
    `${mat.co} měří ${c(delka)} m. ${jmeno} ${mat.zajmeno} ${mat.sloveso} na kusy po ${c(kus)} m. Kolik kusů získá?`,
    cis(pocet),
    [
      {
        value: cis(pocet / nasobek),
        why: `Posunul jsi čárku jen v délce jednoho kusu. Délku ${c(delka)} musíš vynásobit stejným číslem (${cis(nasobek)}), jinak se podíl změní.`,
      },
      {
        value: cis(pocet * 10),
        why: `V celkové délce jsi posunul čárku o jedno místo víc než v délce kusu. Obě čísla vynásob stejným číslem (${cis(nasobek)}).`,
      },
      {
        value: c(soucin(delka, kus)),
        why: `Násobil jsi místo dělení. Počet kusů zjistíš dělením: celková délka : délka jednoho kusu.`,
      },
      {
        value: cis(pocet / (nasobek * 10)),
        why: `Posunul jsi čárku jen v délce kusu, a navíc o jedno místo víc. Obě čísla vynásob stejným číslem (${cis(nasobek)}).`,
      },
    ],
    {
      hints: [
        `Krok 1: Počet kusů zjistíš dělením: celková délka : délka jednoho kusu, tady ${c(delka)} : ${c(kus)}.`,
        `Krok 2: Dělitel ${c(kus)} převeď na přirozené číslo posunutím čárky ${O_MISTA[kus.d]} doprava a o stejný počet míst posuň čárku i v čísle ${c(delka)}.`,
        `Krok 3: Kus je kratší než celý materiál, takže kusů musí být víc než jeden.`,
      ],
      solutionSteps: [
        `Počet kusů = ${c(delka)} : ${c(kus)}`,
        `Obě čísla vynásobíme ${cis(nasobek)}: ${c(posun(delka, kus.d))} : ${cis(kus.n)} = ${cis(pocet)}`,
        `Zkouška: ${cis(pocet)} · ${c(kus)} = ${c(delka)} m`,
      ],
      explanation: `Ptáme se, kolikrát se ${c(kus)} m vejde do ${c(delka)} m, a to je dělení. Dělitele i dělence vynásobíme ${cis(nasobek)}, podíl se nezmění a vyjde ${cis(pocet)}.`,
    },
  );
}

function l3Ekvivalence(): PracticeTask | null {
  const delitel: Dc = Math.random() < 0.5
    ? { n: pick([2, 3, 4, 5, 6, 8, 12, 15, 16, 24, 25]), d: 1 }
    : { n: pick([4, 5, 6, 8, 12, 15, 16, 24, 25, 35, 45]), d: 2 };
  const vysl: Dc = Math.random() < 0.6 ? cele(rnd(2, 60)) : nahodne(11, 99, 1);
  const delenec = soucin(delitel, vysl);
  if (delenec.d === 0 || delenec.d > 2 || hod(delenec) >= 1000) return null;
  const db = delitel.d;
  // Násobek není vždy ten nejmenší možný (1,6 → 16 i 1,6 → 160): žák musí
  // násobek sám vyčíst z dvojice čísel, ne jen mechanicky posunout čárku.
  const e = db + (Math.random() < 0.5 ? 0 : 1);
  const M = P10[e];
  if (hod(delenec) * M >= 100000) return null;
  const novyDelitel = posun(delitel, e); // vždy přirozené číslo
  const novyDelenec = posun(delenec, e);
  const hledamDelence = Math.random() < 0.5;
  const zadani = `Doplň číslo místo otazníku tak, aby oba podíly byly stejné: ${c(delenec)} : ${c(delitel)} = ${
    hledamDelence ? `? : ${c(novyDelitel)}` : `${c(novyDelenec)} : ?`
  }.`;
  const vyslText = `Tohle je výsledek podílu ${c(delenec)} : ${c(delitel)}. Místo otazníku ale patří ${hledamDelence ? "dělenec" : "dělitel"} druhého příkladu.`;

  if (hledamDelence) {
    const mene = posun(delenec, e - 1);
    return uloha(
      zadani,
      c(novyDelenec),
      [
        {
          value: c(mene),
          why: e - 1 === 0
            ? `Dělence jsi nechal beze změny, ale dělitel se z ${c(delitel)} změnil na ${c(novyDelitel)}, tedy ${cis(M)}krát. Dělence musíš vynásobit stejným číslem.`
            : `Dělence jsi vynásobil jen ${cis(M / 10)}, ale dělitel se z ${c(delitel)} změnil na ${c(novyDelitel)}, tedy ${cis(M)}krát. Obě čísla musí být vynásobená stejným číslem.`,
        },
        {
          value: c(posun(delenec, e + 1)),
          why: `Dělence jsi vynásobil ${cis(M * 10)}, ale dělitel se z ${c(delitel)} změnil na ${c(novyDelitel)}, tedy jen ${cis(M)}krát. Obě čísla musí být vynásobená stejným číslem.`,
        },
        { value: c(vysl), why: vyslText },
        {
          value: c(delenec),
          why: `Dělence jsi nechal beze změny, ale dělitel se ${cis(M)}krát zvětšil. Dělence musíš vynásobit stejným číslem.`,
        },
      ],
      {
        hints: [
          `Krok 1: Porovnej dělitele ${c(delitel)} a ${c(novyDelitel)}: kolikrát se zvětšil? Posun čárky o jedno místo doprava znamená násobení 10, o dvě místa násobení 100.`,
          `Krok 2: Podíl se nezmění, jen když dělence i dělitele vynásobíš stejným číslem. Dělence ${c(delenec)} proto vynásob tím číslem, které jsi zjistil u dělitele.`,
        ],
        solutionSteps: [
          `Dělitel: ${c(delitel)} · ${cis(M)} = ${c(novyDelitel)}, zvětšil se ${cis(M)}krát.`,
          `Dělenec musíme vynásobit stejně: ${c(delenec)} · ${cis(M)} = ${c(novyDelenec)}`,
          `Kontrola: ${c(delenec)} : ${c(delitel)} = ${c(vysl)} a také ${c(novyDelenec)} : ${c(novyDelitel)} = ${c(vysl)}`,
        ],
        explanation: `Vynásobíme-li dělence i dělitele stejným číslem, podíl se nezmění. Dělitel se z ${c(delitel)} změnil na ${c(novyDelitel)}, tedy ${cis(M)}krát, proto i dělenec musí být ${cis(M)}krát větší: ${c(novyDelenec)}.`,
      },
    );
  }

  const mene = posun(delitel, e - 1);
  return uloha(
    zadani,
    c(novyDelitel),
    [
      {
        value: c(mene),
        why: e - 1 === 0
          ? `Dělitele jsi nechal beze změny, ale dělenec se z ${c(delenec)} změnil na ${c(novyDelenec)}, tedy ${cis(M)}krát. Dělitele musíš vynásobit stejným číslem.`
          : `Dělitele jsi vynásobil jen ${cis(M / 10)}, ale dělenec se z ${c(delenec)} změnil na ${c(novyDelenec)}, tedy ${cis(M)}krát. Obě čísla musí být vynásobená stejným číslem.`,
      },
      {
        value: c(posun(delitel, e + 1)),
        why: `Dělitele jsi vynásobil ${cis(M * 10)}, ale dělenec se z ${c(delenec)} změnil na ${c(novyDelenec)}, tedy jen ${cis(M)}krát. Obě čísla musí být vynásobená stejným číslem.`,
      },
      { value: c(vysl), why: vyslText },
      {
        value: c(delitel),
        why: `Dělitele jsi nechal beze změny, ale dělenec se ${cis(M)}krát zvětšil. Dělitele musíš vynásobit stejným číslem.`,
      },
    ],
    {
      hints: [
        `Krok 1: Porovnej dělence ${c(delenec)} a ${c(novyDelenec)}: kolikrát se zvětšil? Posun čárky o jedno místo doprava znamená násobení 10, o dvě místa násobení 100.`,
        `Krok 2: Podíl se nezmění, jen když dělence i dělitele vynásobíš stejným číslem. Dělitele ${c(delitel)} proto vynásob tím číslem, které jsi zjistil u dělence.`,
      ],
      solutionSteps: [
        `Dělenec: ${c(delenec)} · ${cis(M)} = ${c(novyDelenec)}, zvětšil se ${cis(M)}krát.`,
        `Dělitel musíme vynásobit stejně: ${c(delitel)} · ${cis(M)} = ${c(novyDelitel)}`,
        `Kontrola: ${c(delenec)} : ${c(delitel)} = ${c(vysl)} a také ${c(novyDelenec)} : ${c(novyDelitel)} = ${c(vysl)}`,
      ],
      explanation: `Vynásobíme-li dělence i dělitele stejným číslem, podíl se nezmění. Dělenec se z ${c(delenec)} změnil na ${c(novyDelenec)}, tedy ${cis(M)}krát, proto i dělitel musí být ${cis(M)}krát větší: ${c(novyDelitel)}.`,
    },
  );
}

type Vyraz = { a: number; op: "·" | ":"; b: Dc };
const textVyrazu = (v: Vyraz): string => `${cis(v.a)} ${v.op} ${c(v.b)}`;

/** Přesná hodnota výrazu, nebo null, když by vyšla perioda či víc než 2 místa. */
function hodnotaVyrazu(v: Vyraz): Dc | null {
  if (v.op === "·") {
    const s = soucin(cele(v.a), v.b);
    return s.d <= 2 ? s : null;
  }
  return podil(cele(v.a), v.b);
}

const MENSI_NEZ_1: Dc[] = [
  { n: 2, d: 1 }, { n: 4, d: 1 }, { n: 5, d: 1 }, { n: 6, d: 1 }, { n: 8, d: 1 },
  { n: 25, d: 2 }, { n: 75, d: 2 },
];
const VETSI_NEZ_1: Dc[] = [
  { n: 12, d: 1 }, { n: 15, d: 1 }, { n: 16, d: 1 }, { n: 25, d: 1 }, { n: 24, d: 1 },
];

function l3Odhad(): PracticeTask | null {
  const N = pick([12, 18, 24, 30, 36, 40, 48, 54, 60, 72, 84, 90, 96, 120]);
  const vetsi = Math.random() < 0.6;
  const m1 = pick(MENSI_NEZ_1);
  let m2 = pick(MENSI_NEZ_1);
  while (m2.n === m1.n && m2.d === m1.d) m2 = pick(MENSI_NEZ_1);
  const v = pick(VETSI_NEZ_1);
  const k = rnd(2, 9);

  const klic: Vyraz = vetsi ? { a: N, op: ":", b: m1 } : { a: N, op: "·", b: m2 };
  const chyby: { v: Vyraz; why: string }[] = vetsi
    ? [
        { v: { a: N, op: ":", b: v }, why: `Dělíš číslem větším než 1, takže výsledek je menší než ${cis(N)}.` },
        { v: { a: N, op: ":", b: cele(k) }, why: `Dělení přirozeným číslem větším než 1 výsledek zmenšuje, vyjde méně než ${cis(N)}.` },
        { v: { a: N, op: "·", b: m2 }, why: `Násobení nemusí vždy zvětšovat: násobíš-li číslem menším než 1, výsledek je menší než ${cis(N)}.` },
      ]
    : [
        { v: { a: N, op: ":", b: m1 }, why: `Dělíš-li číslem menším než 1, výsledek je VĚTŠÍ než dělenec, tedy větší než ${cis(N)}.` },
        { v: { a: N, op: "·", b: v }, why: `Násobíš číslem větším než 1, takže výsledek je větší než ${cis(N)}.` },
        { v: { a: N, op: "·", b: cele(k) }, why: `Násobení přirozeným číslem větším než 1 výsledek zvětšuje, vyjde víc než ${cis(N)}.` },
      ];

  const vse = [klic, ...chyby.map((x) => x.v)];
  const hodnoty = vse.map(hodnotaVyrazu);
  if (hodnoty.some((h) => h === null)) return null;
  const smer = vetsi ? "větší" : "menší";
  const cisla = [...new Set(vse.map((x) => hod(x.b)))].sort((p, q) => p - q).map(cis);

  return uloha(
    `Který příklad má výsledek ${smer} než ${cis(N)}? Nepočítej, jen odhadni.`,
    textVyrazu(klic),
    chyby.map((x) => ({ value: textVyrazu(x.v), why: x.why })),
    {
      hints: [
        `Krok 1: Hledáš výsledek ${smer} než ${cis(N)}. U každého příkladu si všimni, jestli násobíš, nebo dělíš.`,
        `Krok 2: Porovnej s jedničkou čísla ${cisla.join(", ")}. Dělení číslem menším než 1 a násobení číslem větším než 1 výsledek zvětšuje, ostatní ho zmenšují.`,
      ],
      solutionSteps: vse.map((x, i) => {
        const h = hodnoty[i] as Dc;
        return `${textVyrazu(x)} = ${c(h)}, to je ${hod(h) > N ? "víc" : "méně"} než ${cis(N)}`;
      }),
      explanation: vetsi
        ? `Výsledek větší než dělenec dá jen dělení číslem menším než 1: kolikrát se ${c(m1)} vejde do ${cis(N)}, je víc než ${cis(N)}. Dělení číslem větším než 1 i násobení číslem menším než 1 výsledek zmenšují.`
        : `Výsledek menší než ${cis(N)} dá jen násobení číslem menším než 1: vezmeš jen část z ${cis(N)}. Dělení číslem menším než 1 i násobení číslem větším než 1 výsledek zvětšují.`,
    },
  );
}

const DELITELE_DVA_KROKY: Dc[] = [
  { n: 5, d: 2 }, { n: 2, d: 1 }, { n: 3, d: 1 }, { n: 4, d: 1 }, { n: 5, d: 1 },
  { n: 6, d: 1 }, { n: 8, d: 1 }, { n: 25, d: 2 }, { n: 12, d: 1 }, { n: 15, d: 1 },
  { n: 12, d: 2 },
];

function l3DvaKroky(): PracticeTask | null {
  const z = pick(DELITELE_DVA_KROKY);
  const nasobek = P10[z.d];
  if (Math.random() < 0.55) {
    // (x · y) : z
    const x = nahodne(2, 49, 1);
    const y = nahodne(2, 49, 1);
    const p = soucin(x, y);
    const r = podil(p, z);
    if (!r || hod(r) < 0.1 || hod(r) > 100 || p.d === 0) return null;
    return uloha(
      `Kolik vyjde (${c(x)} · ${c(y)}) : ${c(z)}?`,
      c(r),
      [
        {
          value: cis(hod(r) / nasobek),
          why: `Ve druhém kroku jsi posunul čárku jen v děliteli ${c(z)}. Dělence a dělitele musíš vynásobit STEJNÝM číslem, jinak se podíl změní.`,
        },
        {
          value: c(soucin(p, z)),
          why: `Ve druhém kroku jsi násobil místo dělení. Za závorkou je znaménko :, výsledek závorky se dělí.`,
        },
        {
          value: cis(hod(r) * 10),
          why: `V prvním kroku jsi v součinu oddělil jen jedno desetinné místo. Počet desetinných míst součinu je SOUČET desetinných míst obou činitelů.`,
        },
        {
          value: cis(hod(r) / 10),
          why: `V prvním kroku jsi v součinu oddělil o jedno desetinné místo víc, než mají činitelé dohromady.`,
        },
      ],
      {
        hints: [
          `Krok 1: Nejdřív vypočítej závorku, tedy součin ${c(x)} · ${c(y)}; desetinná místa obou činitelů sečti.`,
          `Krok 2: Výsledek závorky vyděl číslem ${c(z)}: v děliteli i v dělenci posuň čárku ${O_MISTA[z.d]} doprava.`,
          `Krok 3: Dělíš-li číslem menším než 1, musí výsledek vyjít větší než hodnota závorky.`,
        ].filter((h) => hod(z) < 1 || !h.startsWith("Krok 3")),
        solutionSteps: [
          `Závorka: ${c(x)} · ${c(y)} = ${c(p)}`,
          `${c(p)} : ${c(z)} = ${c(posun(p, z.d))} : ${cis(z.n)} = ${c(r)}`,
        ],
        explanation: `Závorka má přednost: ${c(x)} · ${c(y)} = ${c(p)} (desetinná místa činitelů se sčítají). Pak dělíme desetinným číslem, takže dělence i dělitele vynásobíme ${cis(nasobek)} a vyjde ${c(r)}.`,
      },
    );
  }
  // (a : z) · y
  const q: Dc = Math.random() < 0.5 ? cele(rnd(2, 40)) : nahodne(11, 99, 1);
  const a = soucin(z, q);
  if (a.d === 0 || a.d > 2) return null;
  const y = nahodne(2, 99, 1);
  const r = soucin(q, y);
  if (r.d > 2) return null;
  return uloha(
    `Kolik vyjde (${c(a)} : ${c(z)}) · ${c(y)}?`,
    c(r),
    [
      {
        value: cis(hod(r) / nasobek),
        why: `V prvním kroku jsi posunul čárku jen v děliteli ${c(z)}. Dělence a dělitele musíš vynásobit STEJNÝM číslem, jinak se podíl změní.`,
      },
      {
        value: c(soucin(soucin(a, z), y)),
        why: hod(z) < 1
          ? `V závorce jsi násobil místo dělení. Dělíš-li číslem menším než 1, výsledek je VĚTŠÍ než dělenec.`
          : `V závorce jsi násobil místo dělení. Znaménko : v závorce znamená dělení.`,
      },
      {
        value: cis(hod(r) * 10),
        why: `Ve druhém kroku jsi v součinu oddělil málo desetinných míst. Počet desetinných míst součinu je SOUČET desetinných míst obou činitelů.`,
      },
      {
        value: cis(hod(r) / 10),
        why: `Ve druhém kroku jsi v součinu oddělil o jedno desetinné místo víc, než mají činitelé dohromady.`,
      },
    ],
    {
      hints: [
        `Krok 1: Nejdřív vypočítej závorku ${c(a)} : ${c(z)}: dělitele převeď na přirozené číslo a dělence uprav stejně.`,
        `Krok 2: Výsledek závorky vynásob číslem ${c(y)} a v součinu odděl tolik desetinných míst, kolik mají oba činitelé dohromady.`,
      ],
      solutionSteps: [
        `Závorka: ${c(a)} : ${c(z)} = ${c(posun(a, z.d))} : ${cis(z.n)} = ${c(q)}`,
        `${c(q)} · ${c(y)} = ${c(r)}`,
      ],
      explanation: `Závorka má přednost. Při dělení desetinným číslem vynásobíme dělence i dělitele ${cis(nasobek)}, takže závorka dá ${c(q)}. Pak násobíme a desetinná místa činitelů sečteme: ${c(q)} · ${c(y)} = ${c(r)}.`,
    },
  );
}

// ── Topic ────────────────────────────────────────────────────────────────
export const NASOBENI_A_DELENI_DESETINNYCH_CISEL: TopicMetadata[] = [
  {
    id: "g6-mat-nasobeni-a-deleni-desetinnych-cisel-6",
    rvpNodeId: "g6-matematika-cislo-a-promenna-desetinna-cisla-nasobeni-a-deleni-desetinnych-cisel",
    displayName: "Násobení a dělení desetinných čísel",
    title: "Násobení a dělení desetinných čísel",
    studentTitle: "Násobíme a dělíme desetinná čísla",
    subject: "matematika",
    category: "Číslo a proměnná",
    topic: "Desetinná čísla",
    briefDescription: "Vynásobíš a vydělíš desetinná čísla a správně umístíš desetinnou čárku.",
    keywords: [
      "desetinná čísla", "násobení desetinných čísel", "dělení desetinných čísel",
      "desetinná čárka", "desetinné místo", "součin", "podíl", "dělitel", "dělenec",
      "posun čárky", "odhad výsledku", "slovní úloha",
    ],
    goals: [
      "Vynásobit dvě desetinná čísla a umístit čárku podle součtu desetinných míst činitelů.",
      "Vydělit desetinným číslem: posunout čárku v děliteli i v dělenci o stejný počet míst.",
      "Odhadnout, zda násobení nebo dělení číslem menším než 1 výsledek zvětší, či zmenší.",
      "Použít násobení a dělení desetinných čísel ve slovní úloze o ceně a délce.",
    ],
    boundaries: [
      "Výsledky mají nejvýš dvě desetinná místa a dělení vychází beze zbytku.",
      "Bez zlomků, procent a záporných čísel.",
      "Násobení a dělení jednociferným přirozeným číslem jen jako rozcvička na první úrovni.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "algorithmic",
    prerequisites: ["g5-matematika-cislo-a-pocetni-operace-pisemne-pocetni-operace-nasobeni-a-deleni-desetinnych-cisel-10-100-1000"],
    recommendedNext: ["g6-mat-pocetni-operace-desetinna-komplexne-6"],
    generator: gen,
    helpTemplate: {
      hint: "Při násobení počítej bez čárek a v součinu odděl tolik desetinných míst, kolik mají činitelé dohromady. Při dělení desetinným číslem posuň čárku v děliteli i v dělenci o stejný počet míst.",
      steps: [
        "Násobení: vynásob čísla, jako by čárky nebyly.",
        "Sečti desetinná místa obou činitelů a tolik jich odděl v součinu zprava.",
        "Dělení: posuň čárku v děliteli tak, aby vzniklo přirozené číslo, a o stejný počet míst i v dělenci.",
        "Výsledek ověř odhadem nebo zkouškou.",
      ],
      commonMistake: "Čárka podle jednoho činitele místo podle součtu desetinných míst nebo posun čárky jen v děliteli.",
      example: "2,4 · 0,35: 24 · 35 = 840, desetinná místa 1 + 2 = 3, tedy 0,840 = 0,84. 4,56 : 0,6 = 45,6 : 6 = 7,6.",
    },
  },
];
