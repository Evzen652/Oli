/**
 * Čeština 6. ročník — Bajka, přísloví a pranostika (select_one).
 *
 * Navazuje na grade-4/cjl/pohadkaPovestBajkaPovidka.ts (tam žák poprvé
 * rozlišoval bajku od pohádky a pověsti podle obsahu) a grade-5/cjl/
 * elementarniLiterarniPojmyPriRozboruTextu.ts. Tady se lidová slovesnost dál
 * dělí na tři krátké útvary, které se snadno pletou, protože všechny bývají
 * krátké a mluví o zvířatech nebo přírodě:
 *  • bajka — krátký příběh, ve kterém zvířata jednají a mluví jako lidé,
 *    a končí ponaučením;
 *  • přísloví — jedna ustálená věta s obecnou životní moudrostí, platí
 *    kdykoli, nemá datum ani vazbu na svátek;
 *  • pranostika — jedna ustálená věta o počasí nebo úrodě vázaná na
 *    konkrétní měsíc nebo svátek (kalendář světců).
 *
 *  • L1 — ROZPOZNÁNÍ ÚTVARU nad krátkou ukázkou (7 přísloví + 7 pranostik
 *    + 5 bajek + 3 pohádky = 22 ukázek); znění otázky se střídá ve třech
 *    variantách, aby se úloha nestala mechanickou.
 *    Možnosti vždy stejné čtyři: bajka / přísloví / pranostika / pohádka.
 *    (Bajka je zčásti autorský žánr — Ezop, La Fontaine —, proto se v zadání
 *    mluví neutrálně o „literárním útvaru“, ne o lidové slovesnosti.)
 *  • L2 — POUŽITÍ, tři šablony: (a) bajka → ponaučení (10 bajek),
 *    (b) přísloví → přenesený význam (14 přísloví), (c) pranostika → co
 *    předpovídá nebo k čemu se váže (7 pranostik, jiné znění otázky než L1).
 *  • L3 — ANALÝZA A PŘENOS, čtyři šablony: (a) situace ze života → nejlépe
 *    sedící přísloví (12 situací), (b) situace → ponaučení z bajky, které na
 *    ni platí (8 situací), (c) pravdivé tvrzení o pranostice jako
 *    pozorování přírody (6 otázek), (d) zvířecí postava v bajce → lidská
 *    vlastnost, kterého člověka ze situace by ztvárnila (8 situací).
 *
 * Chybový model (viz specifikace):
 *  1) přísloví ↔ pranostika (obojí krátká, často rýmovaná lidová
 *     průpovídka) — rozhoduje počasí/úroda + datum/svátek u pranostiky;
 *  2) bajka ↔ pohádka (mluvící zvíře) — rozhoduje ponaučení a chybějící
 *     kouzlo/šťastný konec;
 *  3) doslovný výklad místo přeneseného významu (přísloví/bajka);
 *  4) na L2 detail děje nebo obrácená rada místo skutečného ponaučení;
 *     na L3 přísloví se stejným klíčovým slovem, ale jiným smyslem, nebo
 *     sousední smysl.
 *
 * Bajky i pohádkové ukázky jsou vlastní text (motivy volné, ne citace
 * překladu). Přísloví a pranostiky jsou doložené zlidovělé průpovídky
 * (volné dílo) — žádná vymyšlená ani smíchaná ze dvou různých.
 */
import type { TopicMetadata, PracticeTask } from "@/lib/types";
import { buildChoiceTask, losUlohy, ruzneUlohy, type Distractor } from "./_shared";

type Builder = () => PracticeTask | null;

/** buildChoiceTask, ale nápovědy přesně tak, jak je napíšeme (bez obecného přívěsku). */
function choice(
  question: string,
  correct: string,
  distractors: Distractor[],
  parts: { hints: [string, string]; explanation: string },
): PracticeTask | null {
  const t = buildChoiceTask(question, correct, distractors, parts);
  if (t) t.hints = [...parts.hints];
  return t;
}

// ── L1 — rozpoznání útvaru (22 ukázek) ──────────────────────────────────────
type Utvar = "bajka" | "prislovi" | "pranostika" | "pohadka";

const UTVAR_LABEL: Record<Utvar, string> = {
  bajka: "bajka",
  prislovi: "přísloví",
  pranostika: "pranostika",
  pohadka: "pohádka",
};

function whyNotUtvar(correct: Utvar, wrong: Utvar): string {
  const M: Record<Utvar, Record<Utvar, string>> = {
    bajka: {
      bajka: "",
      prislovi: "Toto je bajka, ne přísloví: má děj, ve kterém jednají a mluví zvířata jako lidé, a končí ponaučením. Přísloví je jen jedna krátká věta bez příběhu.",
      pranostika: "Toto je bajka, ne pranostika: nemluví o počasí ani úrodě a neváže se k žádnému měsíci ani svátku, ale vypráví příběh se zvířaty a ponaučením.",
      pohadka: "Toto je bajka, ne pohádka: chybí kouzlo a boj o vítězství dobra, jednají v ní zvířata jako lidé a končí jasným ponaučením.",
    },
    prislovi: {
      bajka: "Toto je přísloví, ne bajka: je to jen jedna krátká věta, chybí jí děj se zvířecími postavami i vypravěč.",
      prislovi: "",
      pranostika: "Toto je přísloví, ne pranostika: nemluví o počasí ani úrodě a neváže se k žádnému měsíci ani svátku — dává obecnou životní radu, která platí kdykoli.",
      pohadka: "Toto je přísloví, ne pohádka: je to jen jedna krátká věta bez vyprávěného děje, kouzel nebo postav.",
    },
    pranostika: {
      bajka: "Toto je pranostika, ne bajka: nevypráví příběh se zvířecími postavami, jen krátce popisuje počasí nebo úrodu vázané na konkrétní datum.",
      prislovi: "Toto je pranostika, ne přísloví: mluví o počasí nebo úrodě a váže se ke konkrétnímu měsíci nebo svátku — přísloví dává obecnou radu bez data.",
      pranostika: "",
      pohadka: "Toto je pranostika, ne pohádka: je to jen jedna krátká věta o počasí vázaná na datum, ne vyprávěný příběh.",
    },
    pohadka: {
      bajka: "Toto je pohádka, ne bajka: chybí ponaučení a hlavní postavy nejsou zvířata představující lidské vlastnosti — pohádka má naopak kouzlo a boj dobra se zlem.",
      prislovi: "Toto je pohádka, ne přísloví: má dlouhý vyprávěný děj s postavami a kouzlem, ne jednu krátkou větu.",
      pranostika: "Toto je pohádka, ne pranostika: nemluví o počasí ani úrodě a neváže se k datu, je to vyprávěný příběh.",
      pohadka: "",
    },
  };
  return M[correct][wrong];
}

/** Tři znění zadání — střídají se podle pořadí v bance, ať úloha není mechanická. */
const L1_ZADANI: ((text: string) => string)[] = [
  (text) => `O jaký literární útvar jde? „${text}“`,
  (text) => `Ke kterému útvaru ukázka patří? „${text}“`,
  (text) => `Urči útvar ukázky: „${text}“`,
];

const L1_EXPLANATION: Record<Utvar, string> = {
  bajka: "Jde o bajku: v ukázce jednají a mluví zvířata jako lidé a příběh vede k jasnému ponaučení.",
  prislovi: "Jde o přísloví: je to jedna ustálená věta s obecnou životní radou, která se neváže na žádné datum ani svátek.",
  pranostika: "Jde o pranostiku: je to jedna ustálená věta o počasí nebo úrodě, vázaná na konkrétní měsíc nebo svátek.",
  pohadka: "Jde o pohádku: je to vyprávěný příběh s kouzelným prvkem a šťastným koncem, který nekončí ponaučením jako bajka.",
};

function taskL1(text: string, correct: Utvar, varianta = 0): PracticeTask | null {
  const distractors: Distractor[] = (["bajka", "prislovi", "pranostika", "pohadka"] as Utvar[])
    .filter((u) => u !== correct)
    .map((u) => ({ value: UTVAR_LABEL[u], why: whyNotUtvar(correct, u) }));
  return choice(
    L1_ZADANI[varianta % L1_ZADANI.length](text),
    UTVAR_LABEL[correct],
    distractors,
    {
      hints: [
        "Zeptej se: je to jedna krátká věta, nebo příběh s dějem? A mluví se v ní o počasí, o úrodě, nebo o něčem jiném?",
        "Bajka má děj se zvířaty a končí ponaučením. Přísloví je jedna věta s obecnou radou bez data. Pranostika je jedna věta o počasí nebo úrodě vázaná na měsíc nebo svátek. Pohádka má vyprávěný děj s kouzlem a šťastným koncem, ale ponaučení na konci nemá.",
      ],
      explanation: L1_EXPLANATION[correct],
    },
  );
}

const L1_PRISLOVI: string[] = [
  "Kdo jinému jámu kopá, sám do ní padá.",
  "Bez práce nejsou koláče.",
  "Lepší vrabec v hrsti než holub na střeše.",
  "Tichá voda břehy mele.",
  "Jablko nepadá daleko od stromu.",
  "Dvakrát měř, jednou řež.",
  "Ranní ptáče dál doskáče.",
];

const L1_PRANOSTIKY: string[] = [
  "Na svatého Martina kouřívá se z komína.",
  "Medardova kápě čtyřicet dní kape.",
  "Na svatou Kateřinu schováme se pod peřinu.",
  "Březen, za kamna vlezem.",
  "Duben, ještě tam budem.",
  "Na Hromnice o hodinu více.",
  "Studený máj, v stodole ráj.",
];

const L1_BAJKY: string[] = [
  "Havran držel v zobáku sýr. Liška ho chválila, jak krásně zpívá. Havran se dal do zpěvu a sýr mu vypadl.",
  "Mravenec celé léto snášel zásoby. Cvrček se mu smál, že si raději hraje. V zimě hladověl a šel mravence prosit.",
  "Zajíc se posmíval želvě a vyzval ji na závod. Cestou si jistý vítězstvím lehl zdřímnout. Želva šla dál a vyhrála.",
  "Vlk u potoka vyčítal jehněti, že mu kalí vodu. Jehně namítlo, že stojí níž po proudu. Vlk ho stejně sežral.",
  "Pes nesl kost přes most a uviděl ve vodě svůj odraz. Chňapl po kosti druhého psa a o vlastní přišel.",
];

const L1_POHADKY: string[] = [
  "Nejmladší ze tří bratrů vysvobodil princeznu ze zakleté věže. Pomohl mu kouzelný meč od babičky. Na zámku pak šťastně vládli.",
  "Chudá dívka dostala od bílé paní kouzelný oříšek. V nouzi ho rozlouskla a vyskočily z něj zlaté šaty na ples.",
  "Chasník pomohl zakleté žábě. Proměnila se v dívku a dala mu kouzelný prsten. S ním přemohl draka a získal království.",
];

function poolL1(): Builder[] {
  const banka: { text: string; utvar: Utvar }[] = [];
  const n = Math.max(L1_PRISLOVI.length, L1_PRANOSTIKY.length, L1_BAJKY.length, L1_POHADKY.length);
  for (let i = 0; i < n; i++) {
    if (i < L1_PRISLOVI.length) banka.push({ text: L1_PRISLOVI[i], utvar: "prislovi" });
    if (i < L1_PRANOSTIKY.length) banka.push({ text: L1_PRANOSTIKY[i], utvar: "pranostika" });
    if (i < L1_BAJKY.length) banka.push({ text: L1_BAJKY[i], utvar: "bajka" });
    if (i < L1_POHADKY.length) banka.push({ text: L1_POHADKY[i], utvar: "pohadka" });
  }
  return banka.map((item, i) => () => taskL1(item.text, item.utvar, i));
}

// ── L2 (a) — bajka → ponaučení (10 bajek) ───────────────────────────────────
type Moral = "lichotnik" | "priprava" | "vytrvalost" | "sila" | "chamtivost" | "cizi" | "vymluva";

const MORAL_TEXT: Record<Moral, string> = {
  lichotnik: "Lichotníkům se nemá věřit, protože obvykle sledují vlastní prospěch.",
  priprava: "Kdo se včas nepřipraví a nechá všechno na poslední chvíli, sám sobě nakonec ublíží.",
  vytrvalost: "Vytrvalost a poctivá snaha nakonec porazí i pýchu.",
  sila: "Kdo je silnější a chce ublížit, najde si na to důvod, i kdyby žádný nebyl.",
  chamtivost: "Kdo je chamtivý a chce mít víc, může přijít i o to, co už jistě má.",
  cizi: "Kdo se chlubí cizími úspěchy nebo věcmi, bude nakonec odhalen a vysmán.",
  vymluva: "Kdo něčeho nedosáhne, často začne tvrdit, že o to vlastně ani nestál.",
};

/** Krátké pojmenování ponaučení — do zpětné vazby u distraktoru. */
const MORAL_GLOSS: Record<Moral, string> = {
  lichotnik: "o tom, že se nemá věřit lichotkám",
  priprava: "o odkládání práce na poslední chvíli",
  vytrvalost: "o vytrvalosti, která porazí pýchu",
  sila: "o silnějším, který si důvod k ublížení vymyslí",
  chamtivost: "o chamtivosti, kvůli které člověk přijde i o jisté",
  cizi: "o chlubení se cizím",
  vymluva: "o výmluvě toho, kdo něčeho nedosáhl",
};

/**
 * 3 morálky z jiné bajky/situace pro distraktory — otočené podle textu ukázky
 * (ne vždy prvních 6 v deklaraci Moral, jinak by 3 morálky s pořadím na
 * konci deklarace nikdy nefigurovaly jako distraktor, a tedy nikdy jako klíč).
 * Čistá funkce, žádný modulový stav.
 */
function moralDistractorKeys(moral: Moral, seed: string): Moral[] {
  const rest = (Object.keys(MORAL_TEXT) as Moral[]).filter((m) => m !== moral);
  const offset = seed.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % rest.length;
  return [0, 1, 2].map((i) => rest[(offset + i) % rest.length]);
}

const MORAL_WHY_NOT: Record<Moral, string> = {
  lichotnik: "To je ponaučení o lichocení, ale tahle bajka je o něčem jiném.",
  priprava: "To je ponaučení o včasné přípravě, ale tahle bajka je o něčem jiném.",
  vytrvalost: "To je ponaučení o vytrvalosti, ale tahle bajka je o něčem jiném.",
  sila: "To je ponaučení o zneužití síly, ale tahle bajka je o něčem jiném.",
  chamtivost: "To je ponaučení o chamtivosti, ale tahle bajka je o něčem jiném.",
  cizi: "To je ponaučení o chlubení se cizím, ale tahle bajka je o něčem jiném.",
  vymluva: "To je ponaučení o výmluvě po nezdaru, ale tahle bajka je o něčem jiném.",
};

interface BajkaItem {
  text: string;
  moral: Moral;
}

const L2A_BAJKY: BajkaItem[] = [
  { text: "Vrána našla kousek sýra a odletěla si s ním na strom. Kohout ji začal chválit, jak nádherně zpívá, a přemlouval ji, ať to všem předvede. Vrána se nechala nachytat, zakrákala a sýr jí vypadl přímo pod kohoutí nohy.", moral: "lichotnik" },
  { text: "Liška uviděla vysoko na révě zralé hrozny a marně po nich skákala. Ať se snažila, jak chtěla, nedosáhla na ně. Nakonec odešla a cestou si opakovala, že ty hrozny jsou stejně kyselé a ona o ně nestojí.", moral: "vymluva" },
  { text: "Veverka celé podzimní dny sbírala oříšky do své dutiny. Sojka se jí smála, že na zásoby je ještě spousta času a že si sbírání nechá na později. Když napadl sníh, sojka neměla co jíst a zůstala o hladu.", moral: "priprava" },
  { text: "Myš si na podzim snášela zrní do své nory pod stodolou. Cvrček se jí smál, že si raději užívá posledních teplých dní. Když přišla zima, cvrček neměl co jíst a myš mu řekla, že práci nejde odkládat na poslední chvíli.", moral: "priprava" },
  { text: "Ježek se vysmíval pomalému hlemýždi a vyzval ho na závod na kopec. Ježek si byl jistý, že vyhraje, a tak si po cestě sedl na sluníčko odpočinout. Hlemýžď šel bez zastavení pořád dál a na vrchol dorazil jako první.", moral: "vytrvalost" },
  { text: "Srnka se posmívala pomalému želvímu kamarádovi a vyzvala ho na závod k rybníku. Byla si jistá vítězstvím, a tak se cestou zastavila okusovat trávu. Želva šla bez přestávky pořád dál a k rybníku dorazila jako první.", moral: "vytrvalost" },
  { text: "Medvěd potkal v lese malého králíka a začal mu vyčítat, že mu minulý týden sežral mrkev, ačkoli to nebyla pravda. Králík se bránil, že tam ani nebyl. Medvěd si vymyslel novou výmluvu a stejně se na králíka rozzlobil.", moral: "sila" },
  { text: "Liška nesla v tlamě kousek masa a přecházela přes lávku nad rybníkem. Ve vodě uviděla svůj odraz a myslela si, že jiná liška má větší kus masa. Otevřela tlamu, aby jí ho vzala, a vlastní maso jí spadlo do rybníka.", moral: "chamtivost" },
  { text: "Kavka si nasbírala spadlá paví pírka a ozdobila se jimi, aby vypadala krásně jako páv. Přišla mezi pávy a chtěla si s nimi hrát jako rovná s rovnými. Pávové jí ale pírka rychle poznali a od sebe ji odehnali, protože nebyla jejich.", moral: "cizi" },
  { text: "Straka si mezi vlastní peří zastrkala lesklá cizí pírka, aby vypadala pestřeji než ostatní ptáci. Když ji ostatní ptáci uviděli, hned poznali, že pírka nejsou její, a vysmáli se jí.", moral: "cizi" },
];

function taskL2a(item: BajkaItem): PracticeTask | null {
  const distractors: Distractor[] = moralDistractorKeys(item.moral, item.text)
    .map((m) => ({ value: MORAL_TEXT[m], why: MORAL_WHY_NOT[m] }));
  return choice(
    `Přečti si bajku: „${item.text}“ Jaké ponaučení z ní plyne?`,
    MORAL_TEXT[item.moral],
    distractors,
    {
      hints: [
        "Nehledej detail děje (co kdo přesně řekl nebo udělal), ale to, čeho se má čtenář vyvarovat nebo co si má vzít k srdci.",
        "Ponaučení bajky platí obecně, ne jen pro zvířata z příběhu — zkus si představit, že postavy jsou lidé, a zeptej se, jaké jejich jednání bajka odsuzuje nebo chválí.",
      ],
      explanation: `${MORAL_TEXT[item.moral]} To je smysl celé bajky, ne jen jeden detail děje.`,
    },
  );
}

// ── L2 (b) — přísloví → přenesený význam (14 přísloví) ──────────────────────
interface PrisloviItem {
  text: string;
  vyznam: string;
  doslovny: string;
  opacna: string;
}

const PRISLOVI: PrisloviItem[] = [
  { text: "Kdo jinému jámu kopá, sám do ní padá.", vyznam: "Kdo chce druhému člověku úmyslně ublížit, nakonec často uškodí sám sobě.", doslovny: "Ten, kdo pro někoho jiného vykopal jámu v zemi, do ní nakonec sám spadl.", opacna: "Kdo chce druhému ublížit, vždycky mu to projde bez následků." },
  { text: "Bez práce nejsou koláče.", vyznam: "Kdo chce něčeho dosáhnout, musí se nejdřív snažit a pracovat.", doslovny: "Bez práce se nedají upéct koláče.", opacna: "Kdo nic nedělá, stejně nakonec něco získá." },
  { text: "Lepší vrabec v hrsti než holub na střeše.", vyznam: "Je lepší mít jistou menší věc, než riskovat kvůli nejisté větší věci.", doslovny: "Je lepší chytit malého ptáka vrabce než velkého holuba, kterého nemůžeš dosáhnout.", opacna: "Vždycky se vyplatí riskovat kvůli velké a nejisté odměně." },
  { text: "Tichá voda břehy mele.", vyznam: "Kdo navenek působí klidně a tiše, může být uvnitř silný nebo mít velký vliv, i když to není na první pohled vidět.", doslovny: "Voda v řece, i když teče potichu, postupně podemílá a ničí břehy.", opacna: "Kdo je navenek hlučný a nápadný, má vždycky největší vliv." },
  { text: "Jablko nepadá daleko od stromu.", vyznam: "Děti se povahou často podobají svým rodičům.", doslovny: "Jablko, když spadne ze stromu, dopadne těsně vedle něj, ne daleko.", opacna: "Děti bývají úplně jiné povahy než jejich rodiče." },
  { text: "Dvakrát měř, jednou řež.", vyznam: "Než se do něčeho pustíš, dobře si to rozmysli a ověř — udělanou chybu už pak nevrátíš.", doslovny: "Kdo řeže prkno, má si ho před řezáním pro jistotu ještě jednou přeměřit.", opacna: "Pusť se do toho hned a nic si předem nerozmýšlej, rozmýšlení je jen ztráta času." },
  { text: "Ranní ptáče dál doskáče.", vyznam: "Kdo začíná včas a nezaspává, má v životě výhodu a bývá úspěšnější.", doslovny: "Pták, který vyrazí ráno brzy, doskáče dál než ten, co vstal pozdě.", opacna: "Kdo dlouho spí a nikam nespěchá, má v životě vždycky výhodu." },
  { text: "Bez peněz do hospody nelez.", vyznam: "Do něčeho se nepouštěj, pokud na to nemáš potřebné prostředky.", doslovny: "Bez peněz v kapse nemá smysl chodit do hospody.", opacna: "Do čehokoli se můžeš pustit i bez potřebných prostředků, nic se nestane." },
  { text: "Co můžeš udělat dnes, neodkládej na zítřek.", vyznam: "Povinnosti dělej včas, neodkládej je na později.", doslovny: "Práci, kterou stihneš dnes, si nemáš nechávat na zítřejší den.", opacna: "Je jedno, kdy povinnost splníš — klidně ji odkládej, jak dlouho chceš." },
  { text: "Kdo šetří, má za tři.", vyznam: "Kdo si dnes umí něco ušetřit, bude z toho mít v budoucnu prospěch.", doslovny: "Kdo si ušetří peníze, bude jich mít třikrát tolik.", opacna: "Kdo hned všechno utratí, bude z toho mít vždycky prospěch." },
  { text: "Kdo chce psa bít, hůl si vždycky najde.", vyznam: "Kdo chce někomu ublížit nebo ho obvinit, najde si na to důvod, i kdyby žádný opravdový nebyl.", doslovny: "Člověk, který chce bít psa, si vždycky někde najde vhodnou hůl.", opacna: "Kdo chce někomu ublížit, potřebuje k tomu vždycky opravdový a poctivý důvod." },
  { text: "Neštěstí nechodí nikdy samo.", vyznam: "Když se stane jedna nepříjemná věc, často po ní následují další.", doslovny: "Neštěstí je jako osoba, která nikdy nechodí bez doprovodu.", opacna: "Když se stane jedna nepříjemná věc, už se nic dalšího špatného nestane." },
  { text: "Co oči nevidí, to srdce nebolí.", vyznam: "Co o něčem nevíme, to nás netrápí.", doslovny: "Když člověk něco očima nevidí, nemůže ho to bolet u srdce.", opacna: "Čím víc toho o problému víme, tím míň nás to trápí." },
  { text: "Kdo dřív přijde, ten dřív mele.", vyznam: "Kdo je někde první, má oproti ostatním výhodu.", doslovny: "Kdo dorazí do mlýna jako první, bude tam mlít obilí jako první.", opacna: "Je jedno, kdo přijde první — poslední na řadě má vždycky výhodu." },
];

function taskL2b(item: PrisloviItem, confuse: PrisloviItem): PracticeTask | null {
  const distractors: Distractor[] = [
    { value: item.doslovny, why: "Přísloví mluví obrazně, ne doslova — zastupuje v něm jedna věc (voda, jablko, jáma, ptáče…) obecnou lidskou zkušenost. Doslovný výklad tenhle přenesený smysl nezachytí." },
    { value: item.opacna, why: "To je opačná rada, než jakou přísloví dává. Zkontroluj si ještě jednou, k čemu přísloví nabádá." },
    { value: confuse.vyznam, why: `To je výklad jiného přísloví („${confuse.text}“), ne tohoto. Toto přísloví znamená: ${item.vyznam}` },
  ];
  return choice(
    `Co znamená přísloví „${item.text}“?`,
    item.vyznam,
    distractors,
    {
      hints: [
        "Přísloví nikdy nemluví jen o tom, co je v něm doslova napsané — hledá obecnou radu pro život, ne popis konkrétní věci.",
        "Zkus si představit, že místo věcí v přísloví (voda, jablko, ptáče, jáma…) vystupují lidé — jaké chování nebo jakou zkušenost tím přísloví popisuje?",
      ],
      explanation: `Přísloví „${item.text}“ znamená: ${item.vyznam}`,
    },
  );
}

// ── L2 (c) — pranostika → co předpovídá / k čemu se váže (7 pranostik) ─────
interface PranostikaItem {
  text: string;
  /** Vazba už i s předložkou ve 3. pádě — šablony před ni „k“ nepřidávají. */
  vazba: string; // "ke svátku svatého Martina (11. listopadu)" apod.
  vyznam: string;
  /** Doplňující poznámka do vysvětlení (např. výklad zastaralého slova). */
  pozn?: string;
}

const PRANOSTIKY: PranostikaItem[] = [
  { text: "Na svatého Martina kouřívá se z komína.", vazba: "ke svátku svatého Martina (11. listopadu)", vyznam: "Kolem svátku svatého Martina už bývá chladno, a proto lidé začínají topit v kamnech." },
  { text: "Medardova kápě čtyřicet dní kape.", vazba: "ke svátku svatého Medarda (8. června)", vyznam: "Pokud v den svatého Medarda prší, bude podle pranostiky pršet ještě dlouho potom.", pozn: "Kápě je kapuce pláště — obraz říká, že déšť z ní „kape“ dál a dál." },
  { text: "Na svatou Kateřinu schováme se pod peřinu.", vazba: "ke svátku svaté Kateřiny (25. listopadu)", vyznam: "Kolem svátku svaté Kateřiny už bývá chladno, a tak se lidé schovávali do tepla pod peřinu." },
  { text: "Březen, za kamna vlezem.", vazba: "k měsíci březnu", vyznam: "I v březnu bývá ještě chladno, a tak lidé zůstávali v teple u kamen." },
  { text: "Duben, ještě tam budem.", vazba: "k měsíci dubnu", vyznam: "I v dubnu bývá dost chladno, takže lidé u kamen zůstávali ještě déle." },
  { text: "Na Hromnice o hodinu více.", vazba: "ke svátku Hromnic (2. února)", vyznam: "Do svátku Hromnic se den znatelně prodlouží — denního světla přibude asi o hodinu." },
  { text: "Studený máj, v stodole ráj.", vazba: "k měsíci květnu", vyznam: "Chladnější počasí v květnu prospívá úrodě, takže na podzim bude ve stodole hodně obilí." },
];

function taskL2c(item: PranostikaItem, confuse: PranostikaItem[]): PracticeTask | null {
  const distractors: Distractor[] = confuse
    .slice(0, 3)
    .map((c) => ({ value: c.vyznam, why: `To se vztahuje ${c.vazba}, ne ${item.vazba}. Tato pranostika se váže ${item.vazba}: ${item.vyznam}` }));
  return choice(
    `Co pranostika „${item.text}“ předpovídá nebo k čemu se váže?`,
    item.vyznam,
    distractors,
    {
      hints: [
        "Pranostika se vždycky váže ke konkrétnímu měsíci nebo svátku — najdi v textu slovo, které tenhle svátek nebo měsíc pojmenovává.",
        "Vyber výklad, který mluví o stejném období roku jako pranostika v otázce — výklady jiných měsíců nebo svátků nesedí, i kdyby zněly podobně.",
      ],
      explanation: `Pranostika se váže ${item.vazba}. ${item.vyznam}${item.pozn ? ` ${item.pozn}` : ""}`,
    },
  );
}

function poolL2(): Builder[] {
  const a: Builder[] = L2A_BAJKY.map((item) => () => taskL2a(item));
  const b: Builder[] = PRISLOVI.map((item, i) => () => taskL2b(item, PRISLOVI[(i + 5) % PRISLOVI.length]));
  const c: Builder[] = PRANOSTIKY.map((item, i) => () => {
    const others = PRANOSTIKY.filter((_, j) => j !== i);
    return taskL2c(item, [others[i % others.length], others[(i + 1) % others.length], others[(i + 2) % others.length]]);
  });
  const out: Builder[] = [];
  const n = Math.max(a.length, b.length, c.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
    if (i < c.length) out.push(c[i]);
  }
  return out;
}

// ── L3 (a) — situace → nejlépe sedící přísloví (12 situací) ────────────────
interface SituaceItem {
  text: string;
  prisloviIdx: number; // index do PRISLOVI
}

const L3A_SITUACE: SituaceItem[] = [
  { text: "Tomáš se na velký test z matematiky vůbec neučil a spoléhal, že mu to půjde samo. Dostal špatnou známku.", prisloviIdx: 1 },
  { text: "Eliška vstává každý den o půl hodiny dřív než její spolužáci a stihne si v klidu zopakovat látku ještě před vyučováním. Díky tomu má ve škole čím dál lepší výsledky.", prisloviIdx: 6 },
  { text: "Matka Anety je vášnivá malířka a tráví víkendy u štětců. Aneta od malička kreslí úplně stejně nadšeně jako její maminka.", prisloviIdx: 4 },
  { text: "Filip měl jistou nabídku na drobnou brigádu za rozumné peníze, ale odmítl ji kvůli slibu kamaráda o velkém výdělku, který se nakonec neuskutečnil. Nakonec neměl nic.", prisloviIdx: 2 },
  { text: "Martin schválně pustil o spolužačce ošklivou pomluvu, aby ji dostal do potíží. Za pár dní se ale ukázalo, že si tu historku vymyslel on sám, a do potíží se kvůli tomu dostal on.", prisloviIdx: 0 },
  { text: "Karolína si každý měsíc odkládala část kapesného stranou místo toho, aby ho hned utratila za sladkosti. Po roce si za našetřené peníze mohla koupit nové kolo.", prisloviIdx: 9 },
  { text: "David nechával psaní referátu pořád na později a nakonec ho psal narychlo těsně před odevzdáním, plný chyb.", prisloviIdx: 8 },
  { text: "Ondra ve třídě skoro nikdy nemluví a působí nenápadně, ale ve skutečnosti tajně trénuje šachy a vyhrává jeden turnaj za druhým.", prisloviIdx: 3 },
  { text: "Učitelka chtěla Kubovi za každou cenu najít chybu, a tak mu kvůli maličkosti, které si jindy nikdo nevšímá, strhla body.", prisloviIdx: 10 },
  { text: "Na oblíbený tábor se hlásilo víc dětí, než bylo míst, a brali se jen ti, kdo se přihlásili jako první. Petra poslala přihlášku hned první den a místo dostala.", prisloviIdx: 13 },
  { text: "Klára měla odevzdat projekt učitelce. Než ho odeslala, pečlivě si ho celý ještě znovu zkontrolovala a našla v něm dvě chyby, které stihla opravit.", prisloviIdx: 5 },
  { text: "Rodiče Lucce schválně neřekli o zrušeném výletu, dokud se nevrátila ze školy v dobré náladě, aby ji to zbytečně netrápilo předem.", prisloviIdx: 12 },
];

function taskL3a(item: SituaceItem): PracticeTask | null {
  const correct = PRISLOVI[item.prisloviIdx];
  const others = PRISLOVI.filter((_, i) => i !== item.prisloviIdx);
  const distractorIdx = [
    (item.prisloviIdx + 2) % PRISLOVI.length,
    (item.prisloviIdx + 5) % PRISLOVI.length,
    (item.prisloviIdx + 9) % PRISLOVI.length,
  ].filter((i) => i !== item.prisloviIdx);
  const chosen = Array.from(new Set(distractorIdx))
    .map((i) => PRISLOVI[i])
    .filter((p) => p.text !== correct.text)
    .slice(0, 3);
  const filler = others.find((p) => !chosen.includes(p) && p.text !== correct.text);
  while (chosen.length < 3 && filler) chosen.push(filler);
  const distractors: Distractor[] = chosen.map((p) => ({
    value: p.text,
    why: `Tohle přísloví znamená: „${p.vyznam}“ K popsané situaci se hodí jiné přísloví: „${correct.text}“`,
  }));
  return choice(
    `${item.text} Které přísloví se k této situaci nejlépe hodí?`,
    correct.text,
    distractors,
    {
      hints: [
        "Nejdřív si řekni vlastními slovy, co se v situaci stalo a proč — teprve pak hledej přísloví se stejným smyslem, ne se stejným slovem.",
        "Situace a přísloví se nemusí podobat slovy, ale musí sedět smyslem. Vyřaď přísloví, která mluví o úplně jiné zkušenosti, i kdyby znělo podobně.",
      ],
      explanation: `Situaci nejlépe vystihuje přísloví „${correct.text}“ — ${correct.vyznam}`,
    },
  );
}

// ── L3 (b) — situace → ponaučení z bajky, které na ni platí (8 situací) ────
const L3B_SITUACE: { text: string; moral: Moral }[] = [
  { text: "Bára měla už dost bodů na jedničku z referátu, ale rozhodla se ještě přidat cizí větu z internetu, aby dostala i pochvalu navíc. Učitelka opis poznala a Báře kvůli tomu jedničku vůbec nedala.", moral: "chamtivost" },
  { text: "Honza odkládal trénink na poslední týden před závodem a pořád si říkal, že to ještě v klidu stihne. Když ten týden přišel, na trénink už nezbyl čas a Honza se na start postavil úplně nepřipravený.", moral: "priprava" },
  { text: "Spolužák Adamovi pořád říkal, jak skvěle hraje na kytaru, a přesvědčoval ho, ať mu půjčí svoje sluchátka. Adam mu je nakonec půjčil a spolužák mu je pak vůbec nevrátil.", moral: "lichotnik" },
  { text: "Nikola byla ve třídě nejrychlejší běžkyně a všem to připomínala, ale na trénink chodila jen málokdy. Pomalejší spolužačka, která trénovala pravidelně, ji na závodě nakonec předběhla.", moral: "vytrvalost" },
  { text: "Starší kluk chtěl mladšímu spolužákovi sebrat svačinu, a když ten řekl, že si nic špatného neudělal, starší si stejně vymyslel nějaký důvod a svačinu mu vzal.", moral: "sila" },
  { text: "Do skupinového projektu Filip skoro nic nepřidal, ale na prezentaci mluvil, jako by celou práci udělal on sám. Spolužáci to učiteli řekli a Filip dostal horší známku než ostatní.", moral: "cizi" },
  { text: "Radek měl doma dost sladkostí, ale na školním výletě chtěl navíc i cizí svačinu spolužáka. Při hádce o ni upustil vlastní jídlo do bahna a nakonec neměl nic.", moral: "chamtivost" },
  { text: "Týden před písemkou si Tereza řekla, že se to stihne naučit za poslední den. Ten den ale onemocněla a na test vůbec nebyla připravená.", moral: "priprava" },
];

function taskL3b(item: { text: string; moral: Moral }): PracticeTask | null {
  const distractors: Distractor[] = moralDistractorKeys(item.moral, item.text)
    .map((m) => ({
      value: MORAL_TEXT[m],
      why: `Tohle ponaučení mluví ${MORAL_GLOSS[m]} — nic takového se ale v popsané situaci nestalo. Sedí sem ponaučení ${MORAL_GLOSS[item.moral]}: „${MORAL_TEXT[item.moral]}“`,
    }));
  return choice(
    `${item.text} Které ponaučení z bajky se na tuto situaci nejlépe hodí?`,
    MORAL_TEXT[item.moral],
    distractors,
    {
      hints: [
        "Zamysli se, co si osoba v situaci měla uvědomit předem — co udělala špatně nebo naopak správně.",
        "Ponaučení z bajky platí i pro lidi, ne jen pro zvířata — hledej ponaučení, které popisuje stejné chování, jaké se stalo v situaci.",
      ],
      explanation: `${MORAL_TEXT[item.moral]} Přesně tohle se v popsané situaci stalo.`,
    },
  );
}

// ── L3 (c) — pravdivé tvrzení o pranostice (6 otázek) ───────────────────────
interface PravdaItem {
  q: string;
  correct: string;
  distractors: Distractor[];
}

const L3C_ITEMS: PravdaItem[] = [
  {
    q: "Které tvrzení o pranostikách je pravdivé?",
    correct: "Pranostiky vznikaly z dlouhodobého pozorování počasí a přírody, ale nejsou jistou předpovědí.",
    distractors: [
      { value: "Pranostiky vždy přesně určí počasí na sto procent.", why: "Pranostika je zkušenost z minulých let, ne jistá vědecká předpověď — konkrétní rok se od ní může lišit." },
      { value: "Pranostiky nemají nic společného s počasím ani úrodou, jsou to jen říkanky.", why: "Pranostiky se právě naopak vždycky týkají počasí nebo úrody — to je jejich hlavní znak." },
      { value: "Pranostiky vznikly teprve nedávno díky moderním meteorologickým měřením.", why: "Pranostiky jsou naopak velmi staré — vznikaly dávno, dřív než existovala moderní meteorologie." },
    ],
  },
  {
    q: "Proč se pranostika o Medardovi váže právě k datu 8. června?",
    correct: "Protože je to den svátku svatého Medarda podle kalendáře, ke kterému si lidé dříve vázali pozorování počasí.",
    distractors: [
      { value: "Protože 8. června byl vynalezen první deštník.", why: "Datum se váže ke svátku svatého Medarda podle kalendáře, ne k vynálezu deštníku." },
      { value: "Protože tento den je vždy nejteplejším dnem v roce.", why: "8. červen není nejteplejší den roku — pranostika s tím nesouvisí." },
      { value: "Protože se tak jmenoval král, který toho dne zakázal déšť.", why: "Medard je jméno světce z kalendáře, ne krále, a žádný král déšť zakázat nemůže." },
    ],
  },
  {
    q: "Proč pranostika o Hromnicích mluví o prodloužení dne?",
    correct: "Protože na začátku února už dny po zimním slunovratu znatelně přibývají.",
    distractors: [
      { value: "Protože 2. února mají všechny hodiny navíc jednu hodinu.", why: "Hodiny se neposouvají kvůli Hromnicím — jde o přirozené prodlužování dne po zimním slunovratu." },
      { value: "Protože ten den se posouvá čas kvůli letnímu času.", why: "Přechod na letní čas je v jiném období roku a s pranostikou o Hromnicích nesouvisí." },
      { value: "Protože je to nejdelší den v celém roce.", why: "Nejdelší den v roce je v červnu, ne na začátku února." },
    ],
  },
  {
    q: "Proč pranostiky o březnu a dubnu mluví o zůstávání u kamen?",
    correct: "Protože i v těchto jarních měsících bývalo často ještě dost chladno.",
    distractors: [
      { value: "Protože v březnu a dubnu bývaly vždy největší mrazy v celém roce.", why: "Nejsilnější mrazy bývají v zimě, ne v březnu a dubnu — tehdy už chlad postupně slábne." },
      { value: "Protože se tehdy netopilo vůbec a lidé venku mrzli.", why: "Naopak — pranostika mluví o tom, že lidé zůstávali v teple u kamen, tedy topili." },
      { value: "Protože březen a duben jsou letní měsíce s vedrem.", why: "Březen a duben jsou jarní měsíce, ne letní, a vedro k nim nepatří." },
    ],
  },
  {
    q: "Co znamená, že se pranostika někdy „nesplní“?",
    correct: "Pranostiky vycházejí z dlouhodobých zkušeností, ale konkrétní rok se od nich může odchýlit — nejsou to jisté předpovědi.",
    distractors: [
      { value: "Znamená to, že pranostika je vědecky dokázaný fakt, který musí platit vždy.", why: "Pranostika naopak vědecky dokázaný fakt není a nemusí platit vždy — je to zkušenost z minulosti." },
      { value: "Znamená to, že taková pranostika je úplně vymyšlená a nemá se používat.", why: "I pranostika, která se v konkrétním roce nesplní, může vycházet z opakovaného dlouhodobého pozorování." },
      { value: "Znamená to, že se počasí toho dne řídí pranostikou automaticky.", why: "Počasí se pranostikou neřídí — je to naopak lidský popis toho, jaké počasí obvykle bývá." },
    ],
  },
  {
    q: "Proč pranostika o svaté Kateřině mluví o peřině?",
    correct: "Protože koncem listopadu už bývá chladno a lidé se schovávali do tepla.",
    distractors: [
      { value: "Protože svatá Kateřina byla podle pověsti výrobkyní peřin.", why: "Pranostika nemluví o tom, čím se svatá Kateřina zabývala — popisuje počasí, jaké kolem jejího svátku obvykle bývá." },
      { value: "Protože 25. listopadu je oficiální začátek zimy podle kalendáře.", why: "Kalendářní zima začíná až v prosinci — pranostika mluví o obvyklém chladném počasí, ne o oficiálním datu zimy." },
      { value: "Protože se ten den odedávna musí spát celý den a nevstávat.", why: "Žádný takový zvyk neexistuje — peřina je v pranostice obraz pro schovávání se před chladem." },
    ],
  },
];

function taskL3c(item: PravdaItem): PracticeTask | null {
  return choice(item.q, item.correct, item.distractors, {
    hints: [
      "Pranostika vychází z toho, co si lidé po generace všímali na počasí v daném období — není to jistá věda ani náhoda.",
      "Vyřaď tvrzení, která pranostice přisuzují stoprocentní jistotu, nebo naopak tvrdí, že s počasím vůbec nesouvisí — obojí je špatně.",
    ],
    explanation: item.correct,
  });
}

// ── L3 (d) — zvířecí postava → lidská vlastnost (8 situací) ────────────────
type Zvire = "liska" | "mravenec" | "vlk" | "osel";

const ZVIRE_LABEL: Record<Zvire, string> = {
  liska: "liška (lstivost)",
  mravenec: "mravenec (pracovitost)",
  vlk: "vlk (síla a bezohlednost)",
  osel: "osel (tvrdohlavost)",
};

const ZVIRE_TRAIT: Record<Zvire, string> = {
  liska: "vychytralost a chytré, ne úplně poctivé jednání",
  mravenec: "pilnou, vytrvalou práci",
  vlk: "sílu, kterou zneužívá bez ohledu na druhé",
  osel: "tvrdohlavé trvání na svém, i když nemá pravdu",
};

const L3D_SITUACE: { text: string; zvire: Zvire }[] = [
  { text: "Zuzana vždycky vymyslí chytrý plán, jak něco obratně vyřešit, i když to není úplně poctivé.", zvire: "liska" },
  { text: "Tomáš pilně dělá domácí úkoly každý den, i když by si radši hrál, protože ví, že se mu to vyplatí.", zvire: "mravenec" },
  { text: "Radim je fyzicky nejsilnější kluk ve třídě, a když chce něco od slabšího spolužáka, prostě si to vezme bez ohledu na to, jestli mu ublíží.", zvire: "vlk" },
  { text: "Filip se nechce nikdy přizpůsobit, i když mu všichni radí jinak, a dělá věci pořád stejně tvrdohlavě po svém.", zvire: "osel" },
  { text: "Klára vymyslela vychytralý způsob, jak přesvědčit spolužáka, aby jí půjčil svačinu, aniž by musela říct celou pravdu.", zvire: "liska" },
  { text: "Matěj odmítá změnit názor, i když mu kamarádi ukázali, že se plete, a dál tvrdohlavě trvá na svém.", zvire: "osel" },
  { text: "Eliška si každý večer připraví věci na příští den dopředu a nikdy nic nenechává na poslední chvíli.", zvire: "mravenec" },
  { text: "Starší spolužák bere mladším svačiny, protože je fyzicky silnější a ví, že se mu nikdo neubrání.", zvire: "vlk" },
];

function taskL3d(item: { text: string; zvire: Zvire }): PracticeTask | null {
  const distractors: Distractor[] = (["liska", "mravenec", "vlk", "osel"] as Zvire[])
    .filter((z) => z !== item.zvire)
    .map((z) => ({
      value: ZVIRE_LABEL[z],
      why: `V bajkách ${ZVIRE_LABEL[z]} obvykle představuje ${ZVIRE_TRAIT[z]} — v popisu ale jde o jinou vlastnost. Situaci nejlíp vystihuje ${ZVIRE_LABEL[item.zvire]}.`,
    }));
  return choice(
    `${item.text} Kterou bajkovou zvířecí postavu by tento člověk nejlépe představoval?`,
    ZVIRE_LABEL[item.zvire],
    distractors,
    {
      hints: [
        "Zamysli se, jakou konkrétní vlastnost popis nejvíc zdůrazňuje — chytrost bez poctivosti, pilnost, sílu zneužitou proti slabším, nebo tvrdohlavost.",
        "Každé zvíře v bajkách zastupuje jinou vlastnost: liška vychytralost, mravenec pracovitost, vlk zneužitou sílu, osel tvrdohlavost. Vyber tu, která k popisu sedí nejlépe.",
      ],
      explanation: `V bajkách ${ZVIRE_LABEL[item.zvire]} představuje ${ZVIRE_TRAIT[item.zvire]}, a přesně to popis vystihuje.`,
    },
  );
}

function poolL3(): Builder[] {
  const a: Builder[] = L3A_SITUACE.map((item) => () => taskL3a(item));
  const b: Builder[] = L3B_SITUACE.map((item) => () => taskL3b(item));
  const c: Builder[] = L3C_ITEMS.map((item) => () => taskL3c(item));
  const d: Builder[] = L3D_SITUACE.map((item) => () => taskL3d(item));
  const out: Builder[] = [];
  const n = Math.max(a.length, b.length, c.length, d.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
    if (i < c.length) out.push(c[i]);
    if (i < d.length) out.push(d[i]);
  }
  return out;
}

/** Rotace po bance se nastaví při každém volání — žádný stav mezi voláními. */
function gen(level: number): PracticeTask[] {
  const pool = level <= 1 ? poolL1() : level === 2 ? poolL2() : poolL3();
  let i = 0;
  const dalsi = () => pool[i++ % pool.length]();
  return ruzneUlohy(() => losUlohy(dalsi), 24, pool.length * 3);
}

// ── Topic ────────────────────────────────────────────────────────────────────
export const BAJKA_PRISLOVI_PRANOSTIKA: TopicMetadata[] = [
  {
    id: "g6-cjl-bajka-prislovi-pranostika-6",
    rvpNodeId: "g6-cjl-literarni-vychova-lidova-slovesnost-bajka-prislovi-pranostika",
    displayName: "Bajka, přísloví a pranostika",
    title: "Bajka, přísloví a pranostika",
    studentTitle: "Bajka, přísloví a pranostika",
    subject: "čeština",
    category: "Literární výchova",
    topic: "Lidová slovesnost",
    briefDescription: "Poznáš bajku, přísloví a pranostiku a pochopíš, co nás učí.",
    keywords: ["bajka", "přísloví", "pranostika", "ponaučení", "lidová slovesnost", "Ezop", "kalendář světců"],
    goals: [
      "Rozlišit bajku, přísloví a pranostiku podle jejich znaků.",
      "Vyložit přenesený smysl přísloví a ponaučení bajky, ne jejich doslovné znění.",
      "Použít ponaučení bajky nebo smysl přísloví na novou situaci ze života.",
    ],
    boundaries: [
      "Jen zlidovělá přísloví a pranostiky s nesporným, školním výkladem; sporné pranostiky a přesná procenta úspěšnosti se nepoužívají.",
      "Bajky a pohádkové ukázky jsou vlastní text (volné motivy), ne citace konkrétního překladu.",
      "Žádné psaní vlastního textu (inputType 'essay' v aplikaci neexistuje) — jen výběr z možností.",
    ],
    gradeRange: [6, 6],
    inputType: "select_one",
    defaultLevel: 1,
    sessionTaskCount: 6,
    contentType: "conceptual",
    recommendedNext: [],
    generator: gen,
    helpTemplate: {
      hint: "Bajka = příběh se zvířaty jako lidmi a ponaučením. Přísloví = jedna věta s obecnou životní radou bez data. Pranostika = jedna věta o počasí nebo úrodě vázaná na měsíc nebo svátek.",
      steps: [
        "Zjisti, jestli jde o jednu větu, nebo o krátký příběh s dějem.",
        "U jedné věty rozhodni, jestli mluví o počasí/úrodě a má datum (pranostika), nebo dává obecnou radu bez data (přísloví).",
        "U příběhu se zvířaty hledej ponaučení na konci — to je znak bajky.",
      ],
      commonMistake: "Záměna přísloví a pranostiky (obě jsou krátké a rýmované) a záměna bajky s pohádkou (obě mají zvířata nebo kouzelné bytosti).",
      example: "„Bez práce nejsou koláče.“ = přísloví. „Na Hromnice o hodinu více.“ = pranostika (svátek + počasí). Liška, co ošidí havrana o sýr = bajka (ponaučení: nevěř lichotníkům).",
    },
  },
];
