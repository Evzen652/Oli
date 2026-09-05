/**
 * Texty k výsledkům jednoho tématu — oddělené podle publika.
 *
 * PROČ TENHLE MODUL EXISTUJE
 * `SkillDetailModal` se otevírá ze tří míst a dvě z nich mají různé publikum:
 * rodič (`ChildSessionLog`, `AssignmentList`) a **dítě** (`ChildHomePage`,
 * tlačítko „Ukázat moje výsledky"). Texty byly ale napsané jen pro rodiče a
 * ukazovaly se oběma — dítě četlo o sobě ve třetí osobě („Tonda procvičoval/a…",
 * „dítě odpovědělo") a spolu s tím i věty, které mu adresované být nemají:
 * „zkuste se zeptat, jak o úlohách uvažuje", „doporučujeme probrat s učitelem",
 * „spíše hádá než přemýšlí".
 *
 * Rozdíl není jen v osobě slovesa. Rodičovský text je **diagnóza pro někoho
 * třetího** a doporučuje zásah (zeptejte se, proberte, motivujte). Dětský text
 * má říct dvě věci: jak to dopadlo a co s tím dál. Překlopit rodičovské věty do
 * druhé osoby by vyrobilo nesmysly („zkus se sám sebe zeptat, jak uvažuješ"),
 * proto má dítě vlastní, kratší sadu.
 *
 * Bez gamifikace (invariant projektu): žádné body ani série, a taky žádné
 * chválení do prázdna — když to nedopadlo, dítě se to dozví rovně.
 */
import { pad } from "@/lib/czechGrammar";

export type Audience = "parent" | "child";

export interface SessionSummary {
  sessionId: string;
  date: string;
  correct: number;
  helpUsed: number;
  wrong: number;
  total: number;
  pct: number;
}

/** Popisky sekcí — liší se osobou, ne významem. */
export const FEEDBACK_LABELS: Record<Audience, {
  history: string;
  breakdown: string;
  advice: string;
  answeredPrefix: string;
  correctAnswer: string;
}> = {
  parent: {
    history: "Historie",
    breakdown: "Jak si vedl(a)",
    advice: "Doporučení",
    answeredPrefix: "Dítě odpovědělo:",
    correctAnswer: "Správná odpověď:",
  },
  child: {
    history: "Dřívější pokusy",
    breakdown: "Jak ti to šlo",
    advice: "Co dál",
    answeredPrefix: "Odpověděl/a jsi:",
    correctAnswer: "Správně mělo být:",
  },
};

/** Krátké datum pro popisky („4. 9."). Sdílené, aby se úvodní věta a řádky
 *  historie neshodovaly jen náhodou. */
export function formatCzDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()}. ${d.getMonth() + 1}.`;
}

/**
 * Úvodní věta nad hodnotící kartou.
 *
 * Rodič dostane jméno a třetí osobu, dítě druhou osobu a žádné jméno — mluvíme
 * přímo na něj, oslovovat ho jeho vlastním jménem by znělo jako školní hlášení.
 */
export function getIntroSentence(
  audience: Audience,
  last: SessionSummary,
  grade: number,
  childName?: string,
): string {
  const when = formatCzDate(last.date);
  const count = pad(last.total, "OTÁZKA");

  if (audience === "child") {
    const head = `Tohle téma jsi procvičoval/a ${when} — ${count}.`;
    if (grade <= 2) return `${head} Šlo ti to dobře (${last.pct} %).`;
    if (grade === 3) return `${head} Vyšlo to na ${last.pct} % — půlka správně, půlka ne.`;
    return `${head} Zatím to moc nešlo (${last.pct} %), a to je v pořádku — jde to spravit.`;
  }

  const head = childName
    ? `${childName} procvičoval/a uvedené téma dne ${when}, celkem ${count}.`
    : `Procvičování ze dne ${when}, celkem ${count}.`;
  if (grade <= 2) return `${head} Výsledek výborný (${last.pct} %).`;
  if (grade === 3) return `${head} Výsledek průměrný (${last.pct} %).`;
  return `${head} Výsledek zatím slabší (${last.pct} %). Stojí za to se k tématu vrátit.`;
}

/** Souhrnná čísla, ze kterých se odvozují doporučení pro obě publika. */
function summarize(sessions: SessionSummary[]) {
  const n = sessions.length;
  const totalAnswers = sessions.reduce((s, x) => s + x.total, 0);
  const totalHelp = sessions.reduce((s, x) => s + x.helpUsed, 0);
  const totalWrong = sessions.reduce((s, x) => s + x.wrong, 0);
  const totalCorrect = sessions.reduce((s, x) => s + x.correct, 0);
  return {
    n,
    totalAnswers,
    totalHelp,
    totalWrong,
    totalCorrect,
    helpRatio: totalAnswers > 0 ? totalHelp / totalAnswers : 0,
    wrongRatio: totalAnswers > 0 ? totalWrong / totalAnswers : 0,
    correctRatio: totalAnswers > 0 ? totalCorrect / totalAnswers : 0,
  };
}

/**
 * Doporučení pro DÍTĚ — **právě jedna věta, a to o tom, co dál**.
 *
 * Původně jich byly dvě a první z nich shrnovala výsledek („Všechno správně,
 * ani jedna chyba…"). Jenže výsledek už stojí o dva bloky výš ve známce
 * i v úvodní větě — tentýž fakt byl na první obrazovce počtvrté. Ubráno,
 * ne zmenšeno: zbylo jen to, co jinde není, tedy pokyn.
 *
 * Pořadí = priorita. Situační signál (skok, propad, nápověda, první pokus)
 * přebíjí obecný pokyn podle známky, protože říká víc.
 */
function getChildRecommendations(sessions: SessionSummary[], overallPct: number, grade: number): string[] {
  const { n, helpRatio } = summarize(sessions);
  const lastPct = n >= 1 ? sessions[0].pct : null;
  const prevPct = n >= 2 ? sessions[1].pct : null;

  // === SITUAČNÍ SIGNÁL ===
  if (lastPct !== null && prevPct !== null && lastPct >= 80 && prevPct < 55) {
    return ["Oproti minule velký skok nahoru. Ať jsi udělal/a cokoliv jinak, drž se toho."];
  }
  if (lastPct !== null && prevPct !== null && lastPct < 50 && prevPct >= 80) {
    return ["Minule ti to šlo líp. Zkus to znovu, až budeš odpočatý/a — někdy je to jen tím."];
  }
  if (helpRatio >= 0.4) {
    return ["Nápovědu jsi potřeboval/a často. Příště zkus nejdřív odpovědět sám/sama a teprve pak se podívat."];
  }
  if (n === 1 && grade <= 3) {
    return ["Zkus téma ještě jednou jiný den — uvidíš, co ti z něj zůstalo."];
  }

  // === OBECNÝ POKYN PODLE ZNÁMKY ===
  if (grade <= 2) return ["Tohle téma ti jde. Můžeš zkusit něco těžšího."];
  if (grade === 3) return ["Projdi si téma ještě jednou, klidně po malých kouscích."];
  if (grade === 4) return ["Zkus kratší cvičení, ale víckrát. Po částech to půjde líp než najednou."];
  return ["Začni od základů a klidně si řekni o pomoc. Není to ostuda, je to zkratka."];
}

/**
 * Doporučení pro RODIČE.
 *
 * Původní sada z `SkillDetailModal`, beze změny významu. Je to diagnostický
 * text pro dospělého: popisuje dítě ve třetí osobě a navrhuje zásah.
 * Vrací se jen první (nejsilnější) věta — pořadí podmínek je tady tou prioritou.
 */
function getParentRecommendations(sessions: SessionSummary[], overallPct: number, grade: number): string[] {
  const tips: string[] = [];
  const { n, totalAnswers, helpRatio, wrongRatio, correctRatio } = summarize(sessions);
  // sessions[0] = nejnovější, sessions[n-1] = nejstarší

  const pcts = sessions.map(s => s.pct);
  const mean = n > 0 ? pcts.reduce((a, b) => a + b, 0) / n : 0;
  const stdDev = n > 1 ? Math.sqrt(pcts.reduce((a, b) => a + (b - mean) ** 2, 0) / n) : 0;
  const bestPct = Math.max(...pcts);
  const worstPct = Math.min(...pcts);

  const lastPct = n >= 1 ? sessions[0].pct : null;
  const prevPct = n >= 2 ? sessions[1].pct : null;
  const thirdPct = n >= 3 ? sessions[2].pct : null;

  const perfectCount = sessions.filter(s => s.pct === 100).length;

  // === CELKOVÝ VÝSLEDEK ===
  if (overallPct === 100) {
    tips.push("Perfektní výsledek — ani jedna chyba! Tato látka je zvládnuta na výbornou.");
  } else if (overallPct >= 95) {
    tips.push("Výsledek téměř bez chyby. Látka je pevně zvládnuta a dítě ji umí spolehlivě použít.");
  } else if (grade === 1) {
    tips.push("Výborný výsledek. Látka je dobře zvládnuta, dítě ji chápe a umí ji bez větších potíží použít.");
  } else if (grade === 2 && overallPct >= 85) {
    tips.push("Velmi dobrý výsledek. Drobné chyby se tu a tam vyskytnou, ale látku dítě celkově ovládá dobře.");
  } else if (grade === 2) {
    tips.push("Dobrý výsledek s menšími mezerami. Krátké opakování klíčových pojmů by výsledek ještě posunulo.");
  } else if (grade === 3 && overallPct >= 65) {
    tips.push("Průměrný výsledek — látka je hrubě zvládnuta, ale chyby se opakují. Pravidelné krátké procvičení pomůže.");
  } else if (grade === 3 && overallPct >= 55) {
    tips.push("Výsledek na spodní hranici průměru. Látka není zcela jistá — doporučujeme se k ní pravidelně vracet.");
  } else if (grade === 4 && overallPct >= 45) {
    tips.push("Výsledek je pod průměrem. Je dobré rozdělit látku na menší části a procvičovat postupně.");
  } else if (grade === 4) {
    tips.push("S touto látkou má dítě znatelné potíže. Doporučujeme kratší a časté procvičování zaměřené na konkrétní slabá místa.");
  } else if (grade === 5 && overallPct <= 20) {
    tips.push("Velmi nízký výsledek — látka zatím není pochopena. Doporučujeme projít ji znovu od začátku, ideálně s pomocí rodiče nebo učitele.");
  } else if (grade === 5) {
    tips.push("Látka zatím není zvládnuta. Je vhodné probrat ji znovu od základů a postupovat po malých krocích bez spěchu.");
  }

  // === TREND ===
  if (n >= 4) {
    const newest = sessions.slice(0, Math.ceil(n / 2));
    const oldest = sessions.slice(Math.floor(n / 2));
    const avgNew = newest.reduce((s, x) => s + x.pct, 0) / newest.length;
    const avgOld = oldest.reduce((s, x) => s + x.pct, 0) / oldest.length;
    const diff = avgNew - avgOld;
    if (diff >= 30) tips.push("Výsledky se výrazně zlepšily — dítě udělalo velký pokrok. Procvičování se zřetelně vyplácí.");
    else if (diff >= 15) tips.push("Výsledky se postupem času zlepšují. Látka se pomalu usazuje — to je skvělý znak.");
    else if (diff <= -30) tips.push("Výsledky výrazně klesly. Látka pravděpodobně přestala být čerstvá — doporučujeme krátkou rekapitulaci a nový pokus.");
    else if (diff <= -15) tips.push("Výsledky mírně klesají. Může pomoci kratší, ale pravidelnější procvičování.");
    else if (Math.abs(diff) <= 5 && grade <= 2) tips.push("Výsledky jsou dlouhodobě stabilně dobré — látka je pevně zažitá.");
    else if (Math.abs(diff) <= 5 && grade >= 4) tips.push("Výsledky dlouhodobě stagnují na nízké úrovni. Doporučujeme změnit přístup — například látku procvičovat jiným způsobem nebo kratšími úseky.");
  } else if (n === 3 && lastPct !== null && thirdPct !== null) {
    const diff = lastPct - thirdPct;
    if (diff >= 20) tips.push("Za tři cvičení je vidět zlepšení — dítě se učí a látka mu jde stále lépe.");
    else if (diff <= -20) tips.push("Výsledky ve třech cvičeních mírně klesají. Stojí za to zjistit, co dítěti dělá největší potíže.");
  }

  // === KONZISTENCE ===
  if (n >= 3) {
    if (stdDev >= 30) {
      tips.push("Výsledky jsou velmi nevyrovnané — někdy výborně, jindy špatně. Může jít o vliv nálady, únavy nebo prostředí. Zkuste procvičovat pravidelně ve stejnou dobu a v klidu.");
    } else if (stdDev >= 18) {
      tips.push("Výsledky poměrně kolísají. Zkuste zjistit, za jakých podmínek se dítěti daří nejlépe, a tyto podmínky opakovat.");
    } else if (stdDev <= 6 && grade <= 2) {
      tips.push("Výsledky jsou stabilně dobré bez větších výkyvů — dítě je v této látce sebejisté a spolehlivé.");
    } else if (stdDev <= 6 && grade >= 4) {
      tips.push("Výsledky jsou konzistentně slabé — jde pravděpodobně o systematický problém, ne náhodu. Doporučujeme látku probrat s učitelem.");
    } else if (stdDev <= 10 && grade === 3) {
      tips.push("Výsledky jsou stabilní, ale stále v průměru. Cílené procvičení konkrétních chybných úloh by mohlo posunout výsledek výše.");
    }
  }

  // === NÁPOVĚDA ===
  if (helpRatio === 0 && grade >= 4 && totalAnswers >= 6) {
    tips.push("Dítě nápovědu vůbec nevyužívá, přitom výsledky jsou slabé. Může to znamenat, že spíše hádá než přemýšlí — zkuste se zeptat, jak o úlohách uvažuje.");
  } else if (helpRatio >= 0.6) {
    tips.push("Nápověda se využívala ve více než polovině odpovědí. Látka pravděpodobně ještě není internalizovaná — procvičujte pomaleji a klaste důraz na porozumění, ne rychlost.");
  } else if (helpRatio >= 0.4) {
    tips.push("Nápověda se využívala poměrně často. Je dobré trénovat vybavování bez ní — dítě si zkusí odpovědět samo a až pak se podívá.");
  } else if (helpRatio >= 0.2) {
    tips.push("Nápověda se příležitostně hodila. Je to v pořádku — důležité je, aby ji dítě postupně potřebovalo méně.");
  } else if (helpRatio > 0 && helpRatio < 0.08 && grade <= 2) {
    tips.push("Nápovědu využívalo jen výjimečně. To svědčí o dobré samostatnosti a jistotě v látce.");
  } else if (helpRatio === 0 && grade <= 2 && totalAnswers >= 6) {
    tips.push("Ani jednou nepotřebovalo nápovědu — výborná samostatnost!");
  }

  // === CHYBOVOST ===
  if (wrongRatio >= 0.6) {
    tips.push("Více než polovina odpovědí byla chybná. Doporučujeme látku nejdříve společně projít a teprve pak znovu procvičovat.");
  } else if (wrongRatio >= 0.4) {
    tips.push("Velká část odpovědí byla chybná. Pomůže se u každé chybné odpovědi společně zamyslet, proč byla špatně.");
  } else if (wrongRatio >= 0.25 && grade <= 2) {
    tips.push("I přes dobrý výsledek se vyskytuje čtvrtina chybných odpovědí. Stojí za to zjistit, u kterých typů úloh k tomu dochází.");
  } else if (wrongRatio <= 0.03 && grade <= 2 && totalAnswers >= 8) {
    tips.push("Téměř žádné chyby na velkém počtu úloh — výborná přesnost a jistota v látce.");
  } else if (wrongRatio <= 0.08 && grade <= 2) {
    tips.push("Minimální chybovost — dítě odpovídalo přesně a s jistotou.");
  }

  // === CELKOVÝ ROZSAH (počet úloh) ===
  if (totalAnswers >= 50 && grade <= 2) {
    tips.push(`Za všechna cvičení celkem zodpovědělo ${pad(totalAnswers, "ÚLOHA")} s výborným výsledkem — to je pořádný kus práce!`);
  } else if (totalAnswers >= 50 && grade >= 4) {
    tips.push(`Za všechna cvičení proběhlo celkem ${pad(totalAnswers, "ÚLOHA")}. I přes velký objem procvičování výsledky zatím nestačí — zkuste jiný způsob výkladu.`);
  } else if (totalAnswers <= 8 && n === 1) {
    tips.push("Cvičení bylo krátké — hodnocení je zatím orientační. Delší nebo opakované procvičení přinese přesnější obrázek.");
  }

  // === POČET CVIČENÍ ===
  if (n === 1) {
    tips.push("Zatím proběhlo jen jedno cvičení. Pro spolehlivé hodnocení doporučujeme látku zopakovat alespoň dvakrát nebo třikrát v různé dny.");
  } else if (n === 2 && grade <= 2) {
    tips.push("Dvě cvičení, oba dobré výsledky — slibný start. Třetí opakování potvrdí, že je látka skutečně zažitá.");
  } else if (n === 2 && grade >= 4) {
    tips.push("Dvě cvičení s nižším výsledkem. Je ještě brzy na závěry — doporučujeme alespoň jedno nebo dvě další procvičení.");
  } else if (n >= 7 && grade <= 2) {
    tips.push("Sedm a více cvičení s dobrými výsledky — tato látka je pevně zvládnuta. Není třeba ji nyní intenzivně procvičovat, stačí občasné zopakování.");
  } else if (n >= 5 && grade >= 4) {
    tips.push("I přes pět a více cvičení výsledky stagnují. Pouhé opakování pravděpodobně nestačí — doporučujeme jiný přístup nebo pomoc učitele.");
  } else if (n >= 4 && grade <= 2) {
    tips.push("Opakované procvičování přineslo ovoce — vytrvalost se zřetelně vyplatila.");
  } else if (n === 3 && grade >= 4) {
    tips.push("Tři cvičení za sebou s nižším výsledkem. Je vhodné zpomalit a zkontrolovat, zda dítě základům skutečně rozumí.");
  }

  // === SKOK V POSLEDNÍM VÝSLEDKU ===
  if (lastPct !== null && prevPct !== null) {
    if (lastPct >= 90 && prevPct < 60) {
      tips.push("Poslední cvičení dopadlo výrazně lépe než předchozí — skvělý skok! Stojí za to zeptat se dítěte, co mu tentokrát pomohlo.");
    } else if (lastPct >= 80 && prevPct < 55) {
      tips.push("Poslední cvičení bylo znatelně lepší. Dítě se posunulo — motivujte ho, aby v tom pokračovalo.");
    } else if (lastPct < 40 && prevPct >= 75) {
      tips.push("Poslední výsledek byl výrazně horší než předchozí. Může jít o špatný den nebo únavu — není třeba panikovat, ale příště situaci sledujte.");
    } else if (lastPct < 55 && prevPct >= 80) {
      tips.push("Poslední výsledek byl horší než obvykle. Může to být výjimka — zkuste zopakovat za pár dní a výsledky porovnat.");
    } else if (lastPct >= 85 && prevPct >= 85) {
      tips.push("Poslední dvě cvičení dopadla výborně — dítě je v látce stabilně dobré.");
    } else if (lastPct < 45 && prevPct < 45) {
      tips.push("Poslední dvě cvičení dopadla slabě. Doporučujeme látku projít společně před dalším procvičováním.");
    }
  }

  // === NEJLEPŠÍ vs. NEJHORŠÍ ===
  if (n >= 3 && bestPct - worstPct >= 40) {
    tips.push(`Rozdíl mezi nejlepším (${bestPct} %) a nejhorším (${worstPct} %) cvičením je velký. Výsledky závisí na podmínkách nebo náladě — zkuste zjistit, co situaci ovlivňuje.`);
  }

  // === PERFEKTNÍ VÝSLEDKY ===
  if (perfectCount >= 3) {
    tips.push(`${perfectCount} ze ${n} cvičení dopadla na 100 % — výjimečná výkonnost, na kterou může být dítě velmi hrdé!`);
  } else if (perfectCount === 2) {
    tips.push("Dvě cvičení dopadla na 100 % — dítě na to opakovaně ukázalo. Skvělý výsledek!");
  } else if (perfectCount === 1 && n >= 3) {
    tips.push("Jedno cvičení dopadlo na 100 % — dítě na to má. Motivujte ho, aby takového výsledku dosáhlo znovu.");
  }

  // === PODÍL SPRÁVNÝCH BEZ NÁPOVĚDY ===
  if (correctRatio >= 0.9 && helpRatio <= 0.05 && totalAnswers >= 10) {
    tips.push("Naprostá většina odpovědí byla správná hned napoprvé bez nápovědy — to je opravdu solidní výkon.");
  } else if (correctRatio <= 0.2 && n >= 2) {
    tips.push("Správných odpovědí bez nápovědy bylo velmi málo. Doporučujeme začít jednodušší formou procvičení nebo si látku nejdříve projít.");
  }

  // === SÉRIE POSLEDNÍCH CVIČENÍ ===
  if (n >= 3 && sessions.slice(0, 3).every(s => s.pct >= 80)) {
    tips.push("Poslední tři cvičení dopadla výborně — dítě je v plné formě a látku ovládá jistě.");
  } else if (n >= 3 && sessions.slice(0, 3).every(s => s.pct < 50)) {
    tips.push("Poslední tři cvičení za sebou dopadla slabě. To stojí za pozornost — doporučujeme zjistit příčinu a případně zpomalit.");
  }

  return tips.slice(0, 1);
}

export function getRecommendations(
  sessions: SessionSummary[],
  overallPct: number,
  grade: number,
  audience: Audience,
): string[] {
  if (sessions.length === 0) return [];
  return audience === "child"
    ? getChildRecommendations(sessions, overallPct, grade)
    : getParentRecommendations(sessions, overallPct, grade);
}
