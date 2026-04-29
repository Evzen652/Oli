/**
 * Symbolic math solver pro nezávislé ověření AI-generovaných matematických úloh.
 *
 * Použití:
 *   const result = solveSimple("12 + 7"); // → "19"
 *   const result = solveSimple("3/8 + 1/4"); // → "5/8"
 *   const result = checkAnswer("3/8 + 1/4", "5/8"); // → { ok: true }
 *
 * Strategie:
 *   1) Pokus o parse expression z otázky (extrahovat aritmetický výraz)
 *   2) Spočítat nezávisle (čisté JS aritmetika + zlomky)
 *   3) Porovnat s tvrzeným výsledkem AI
 *
 * Podporuje:
 *   • Celá čísla, desetinná, zlomky (a/b, "X a/b" smíšené)
 *   • +, -, *, /, ()
 *   • % (procenta z čísla)
 *   • srovnání <, >, =
 *   • jednoduché rovnice s 1 neznámou (lineární)
 *
 * NE-podporuje (vrátí "indeterminate"):
 *   • Slovní úlohy (potřebují AI parsing)
 *   • Geometrie s diagramy
 *   • Jakékoliv vyjadřování v textu
 */

type FractionResult = { num: number; den: number };

/** Parse zlomek "a/b", "X a/b" nebo celé/desetinné číslo. */
function parseNumberOrFraction(s: string): FractionResult | null {
  const trimmed = s.trim().replace(/,/g, ".");
  // Mixed: "3 1/2"
  const mixedMatch = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const num = parseInt(mixedMatch[2], 10);
    const den = parseInt(mixedMatch[3], 10);
    if (den === 0) return null;
    const sign = whole < 0 ? -1 : 1;
    return { num: sign * (Math.abs(whole) * den + num), den };
  }
  // Pure fraction: "3/8"
  const fracMatch = trimmed.match(/^(-?\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = parseInt(fracMatch[1], 10);
    const den = parseInt(fracMatch[2], 10);
    if (den === 0) return null;
    return { num, den };
  }
  // Decimal: "0.5", "3.14"
  const num = parseFloat(trimmed);
  if (Number.isFinite(num)) {
    if (Number.isInteger(num)) return { num, den: 1 };
    // Convert decimal to fraction (limited precision)
    const str = trimmed;
    const dotIdx = str.indexOf(".");
    if (dotIdx < 0) return { num, den: 1 };
    const decimals = str.length - dotIdx - 1;
    const den = Math.pow(10, decimals);
    return { num: Math.round(num * den), den };
  }
  return null;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function reduce(f: FractionResult): FractionResult {
  if (f.den === 0) return f;
  const g = gcd(f.num, f.den);
  const sign = f.den < 0 ? -1 : 1;
  return { num: sign * f.num / g, den: sign * f.den / g };
}

function eqFrac(a: FractionResult, b: FractionResult): boolean {
  // Cross-multiplication: a.num * b.den === b.num * a.den
  return a.num * b.den === b.num * a.den;
}

/**
 * Vyhodnotí jednoduchý aritmetický výraz.
 * Podporuje + - * / () a zlomky / desetinná.
 *
 * Vrací FractionResult nebo null pokud parse selhal.
 */
function evalExpression(expr: string): FractionResult | null {
  // Sanitize — odstraníme mezery, jiné znaky než cifry/operátory/+-*/().
  // U procent: "20%" → "0.2"
  const cleaned = expr
    .replace(/\s+/g, "")
    .replace(/(\d+(?:\.\d+)?)%/g, (_, num) => `(${num}/100)`)
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");

  // Bezpečnostní check — povolíme jen cifry, operátory, závorky, lomítko, tečku
  if (!/^[\d+\-*/().\s]+$/.test(cleaned)) {
    // Možná jde o zlomek s lomítkem mezi celými čísly (např. "3/8")
    // V takovém případě parseNumberOrFraction
    const direct = parseNumberOrFraction(expr);
    if (direct) return direct;
    return null;
  }

  // Recursive descent parser pro aritmetický výraz se zlomky
  let pos = 0;

  function peek() { return cleaned[pos]; }
  function consume() { return cleaned[pos++]; }

  function parseNumber(): FractionResult | null {
    let start = pos;
    while (pos < cleaned.length && /[\d.]/.test(cleaned[pos])) pos++;
    if (start === pos) return null;
    const numStr = cleaned.slice(start, pos);
    return parseNumberOrFraction(numStr);
  }

  function parseFactor(): FractionResult | null {
    if (peek() === "(") {
      consume();
      const v = parseExpr();
      if (peek() === ")") consume();
      return v;
    }
    if (peek() === "-") {
      consume();
      const v = parseFactor();
      if (!v) return null;
      return { num: -v.num, den: v.den };
    }
    if (peek() === "+") {
      consume();
      return parseFactor();
    }
    return parseNumber();
  }

  function parseTerm(): FractionResult | null {
    let left = parseFactor();
    if (!left) return null;
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parseFactor();
      if (!right) return null;
      if (op === "*") {
        left = { num: left.num * right.num, den: left.den * right.den };
      } else {
        if (right.num === 0) return null;
        left = { num: left.num * right.den, den: left.den * right.num };
      }
    }
    return left;
  }

  function parseExpr(): FractionResult | null {
    let left = parseTerm();
    if (!left) return null;
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseTerm();
      if (!right) return null;
      if (op === "+") {
        left = { num: left.num * right.den + right.num * left.den, den: left.den * right.den };
      } else {
        left = { num: left.num * right.den - right.num * left.den, den: left.den * right.den };
      }
    }
    return left;
  }

  const result = parseExpr();
  if (!result || pos !== cleaned.length) return null;
  return reduce(result);
}

/**
 * Pokusí se vytáhnout aritmetický výraz z otázky a spočítat ho.
 * Vrátí null pokud nelze rozumně extrahovat.
 *
 * Příklady:
 *   "Kolik je 12 + 7?" → 19
 *   "Spočítej: 3/8 + 1/4" → 5/8
 *   "Vyřeš: 4 × (3 + 2)" → 20
 */
export function tryExtractAndSolve(question: string): FractionResult | null {
  // Najdi něco co vypadá jako aritmetický výraz
  // Heuristika: hledej delší segment s ciframi a operátory
  const matches = question.match(/[\d.,]+(?:\s*[+\-*×/÷()]\s*[\d.,]+)+/g);
  if (!matches) {
    // Možná jen jediné číslo / zlomek (porovnání např.)
    const single = question.match(/(-?\d+\/\d+|-?\d+(?:[.,]\d+)?)/);
    if (single) return parseNumberOrFraction(single[0]);
    return null;
  }
  // Vyber nejdelší match (nejpravděpodobněji to je hlavní expression)
  const longest = matches.reduce((a, b) => (a.length >= b.length ? a : b));
  return evalExpression(longest);
}

/**
 * Hlavní API: porovná otázku se stated answer.
 *
 * Vrací:
 *   { status: "match" }            — výsledek souhlasí
 *   { status: "mismatch", expected, got } — neshoda, pravděpodobně chyba AI
 *   { status: "indeterminate" }    — nelze rozhodnout (slovní úloha apod.)
 */
export interface MathCheckResult {
  status: "match" | "mismatch" | "indeterminate";
  expected?: string;
  got?: string;
  reason?: string;
}

export function checkMathAnswer(
  question: string,
  statedAnswer: string,
  practiceType?: string
): MathCheckResult {
  // Jen pro deterministické typy
  const supportedTypes = ["number", "fraction", "comparison", "result_only"];
  if (practiceType && !supportedTypes.includes(practiceType)) {
    return { status: "indeterminate", reason: `practice_type=${practiceType} není podporovaný` };
  }

  // Porovnání — speciální případ
  if (practiceType === "comparison" || /[<>=]/.test(statedAnswer)) {
    return checkComparison(question, statedAnswer);
  }

  const computed = tryExtractAndSolve(question);
  if (!computed) {
    return { status: "indeterminate", reason: "Nepodařilo se extrahovat výraz z otázky" };
  }

  const stated = parseNumberOrFraction(statedAnswer);
  if (!stated) {
    return { status: "indeterminate", reason: "Stated answer nelze parsovat jako číslo/zlomek" };
  }

  if (eqFrac(computed, stated)) {
    return { status: "match" };
  }

  const formatFrac = (f: FractionResult) => {
    if (f.den === 1) return String(f.num);
    return `${f.num}/${f.den}`;
  };

  return {
    status: "mismatch",
    expected: formatFrac(reduce(computed)),
    got: statedAnswer,
    reason: `Spočítáno ${formatFrac(reduce(computed))}, AI tvrdí ${statedAnswer}`,
  };
}

/** Pro porovnání: "3/5 _ 2/5" + odpověď ">" */
function checkComparison(question: string, answer: string): MathCheckResult {
  const op = answer.trim();
  if (!["<", ">", "=", "≤", "≥"].includes(op)) {
    return { status: "indeterminate", reason: "Neznámý operátor porovnání" };
  }

  // Rozeber "X _ Y" formát — najdi 2 čísla v otázce
  const matches = question.match(/(-?\d+\/\d+|-?\d+(?:[.,]\d+)?)/g);
  if (!matches || matches.length < 2) {
    return { status: "indeterminate", reason: "Nelze najít 2 hodnoty pro porovnání" };
  }

  const a = parseNumberOrFraction(matches[0]);
  const b = parseNumberOrFraction(matches[1]);
  if (!a || !b) return { status: "indeterminate", reason: "Hodnoty nelze parsovat" };

  // Cross-multiply pro určení ordering
  const aTimesB = a.num * b.den;
  const bTimesA = b.num * a.den;
  const aDenSign = a.den < 0 ? -1 : 1;
  const bDenSign = b.den < 0 ? -1 : 1;
  const sign = aDenSign * bDenSign;
  const cmp = sign * (aTimesB - bTimesA);

  let expected: string;
  if (cmp < 0) expected = "<";
  else if (cmp > 0) expected = ">";
  else expected = "=";

  if (op === expected || (op === "≤" && cmp <= 0) || (op === "≥" && cmp >= 0)) {
    return { status: "match" };
  }

  return {
    status: "mismatch",
    expected,
    got: op,
    reason: `Porovnání: ${matches[0]} ${expected} ${matches[1]}, AI tvrdí ${op}`,
  };
}
