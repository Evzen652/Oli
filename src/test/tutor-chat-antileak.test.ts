import { describe, it, expect } from "vitest";
import { checkAnswerLeak, escapeRegex } from "../../supabase/functions/_shared/tutorAntiLeak";

/**
 * Anti-leak filter test suite (Fáze 7).
 *
 * Server-side guard, který v phase=practice blokuje AI odpovědi prozrazující
 * správnou odpověď. Pedagogický princip: lepší 1 false positive (žák dostane
 * "skoro jsem ti to prozradil") než 1 false negative (AI prozradí výsledek).
 *
 * Cílíme na:
 *  - explicitní rovnost "= 36"
 *  - slovní obraty "odpověď je…", "vyjde…", "je to…"
 *  - krátké číselné odpovědi jako samostatný token
 *  - čisté nepropuštění běžných slov / čísel v jiném kontextu (false positive guard)
 */

describe("checkAnswerLeak — explicitní rovnost", () => {
  it.each([
    ["12 × 3 = 36", "36", true],
    ["= 36", "36", true],
    ["=36", "36", true],
    ["x = 5", "5", true],
    ["3/8 = 0.375", "0.375", true],
    ["A=B", "B", true],
  ])("'%s' s odpovědí '%s' → leak=%s", (reply, ans, expected) => {
    expect(checkAnswerLeak(reply, ans)).toBe(expected);
  });
});

describe("checkAnswerLeak — slovní obraty", () => {
  it.each([
    ["odpověď je 42", "42", true],
    ["Odpověď: 42", "42", true],
    ["výsledek je 42", "42", true],
    ["vyjde 42", "42", true],
    ["správně je 42", "42", true],
    ["je to 42", "42", true],
    // Case insensitive
    ["VÝSLEDEK JE 42", "42", true],
    ["Odpověď JE 42", "42", true],
    // I pro textové odpovědi
    ["odpověď je podstatné jméno", "podstatné jméno", true],
    ["vyjde mužský rod", "mužský rod", true],
  ])("'%s' s odpovědí '%s' → leak=%s", (reply, ans, expected) => {
    expect(checkAnswerLeak(reply, ans)).toBe(expected);
  });
});

describe("checkAnswerLeak — krátké číselné odpovědi jako token", () => {
  it("'Tady je 36 jablek a 5 hrušek' s ans='36' → leak", () => {
    expect(checkAnswerLeak("Tady je 36 jablek a 5 hrušek", "36")).toBe(true);
  });
  it("'Mysli na čísla: 0 nebo 1' s ans='0' → leak", () => {
    expect(checkAnswerLeak("Mysli na čísla: 0 nebo 1", "0")).toBe(true);
  });
  it("samostatné '5' s ans='5' → leak", () => {
    expect(checkAnswerLeak("Číslo 5 je liché.", "5")).toBe(true);
  });
  it("'2.5' s ans='2.5' → leak", () => {
    expect(checkAnswerLeak("Tedy 2.5 metru.", "2.5")).toBe(true);
  });
  it("'2,5' (Czech decimal) s ans='2,5' → leak", () => {
    expect(checkAnswerLeak("Tedy 2,5 metru.", "2,5")).toBe(true);
  });
});

describe("checkAnswerLeak — porovnávací znaky < > =", () => {
  it("'tady je <' s ans='<' → leak", () => {
    expect(checkAnswerLeak("Tady je <", "<")).toBe(true);
  });
  it("'znak >' s ans='>' → leak", () => {
    expect(checkAnswerLeak("znak > znamená větší", ">")).toBe(true);
  });
  it("rovnítko v textu s ans='=' → leak", () => {
    expect(checkAnswerLeak("Použij = pro rovnost", "=")).toBe(true);
  });
});

describe("checkAnswerLeak — false positive guard (NESMÍ blokovat)", () => {
  it("ans='36' nesmí blokovat větu obsahující '36' jako součást většího čísla", () => {
    expect(checkAnswerLeak("Číslo 360 je větší.", "36")).toBe(false);
  });
  it("ans='36' nesmí blokovat '136'", () => {
    expect(checkAnswerLeak("Hodnota 136 jablek.", "36")).toBe(false);
  });
  it("ans='5' nesmí blokovat '15'", () => {
    expect(checkAnswerLeak("Mám 15 jablek.", "5")).toBe(false);
  });
  it("dlouhé číslo (>4 znaky) NE token-match", () => {
    // ans="12345" má 5 znaků → token-match se neaktivuje
    expect(checkAnswerLeak("Bylo to v roce 12345.", "12345")).toBe(false);
  });
  it("textová odpověď v navádějící otázce nesmí být blokována, pokud nepoužívá leak frázi", () => {
    expect(checkAnswerLeak("Co popisuje vlastnost? Zamysli se nad slovem.", "přídavné jméno")).toBe(false);
  });
  it("hint o principu bez výsledku → ne-leak", () => {
    expect(checkAnswerLeak("Násobení = opakované sčítání. Spočti to po 3.", "36")).toBe(false);
  });
  it("prázdný correctAnswer → ne-leak (žádný leak nedetekovatelný)", () => {
    expect(checkAnswerLeak("Cokoliv obsahující 36", "")).toBe(false);
  });
  it("whitespace-only correctAnswer → ne-leak", () => {
    expect(checkAnswerLeak("Cokoliv", "   ")).toBe(false);
  });
});

describe("checkAnswerLeak — case insensitivity", () => {
  it("uppercase reply, lowercase answer → leak", () => {
    expect(checkAnswerLeak("VÝSLEDEK JE PODSTATNÉ JMÉNO", "podstatné jméno")).toBe(true);
  });
  it("mixed case reply → leak", () => {
    expect(checkAnswerLeak("Odpověď Je Sloveso", "sloveso")).toBe(true);
  });
});

describe("checkAnswerLeak — speciální znaky v odpovědi", () => {
  it("ans s tečkou ('3.14') v reply → leak (regex escape funguje)", () => {
    expect(checkAnswerLeak("výsledek je 3.14", "3.14")).toBe(true);
  });
  it("ans se závorkou (regex special) je escapováno", () => {
    expect(checkAnswerLeak("odpověď je (1+2)", "(1+2)")).toBe(true);
  });
  it("ans s + (regex special) escapováno", () => {
    expect(checkAnswerLeak("vyjde 2+3", "2+3")).toBe(true);
  });
});

describe("checkAnswerLeak — pedagogicky bezpečné odpovědi", () => {
  it("navedení otázkou — ne-leak", () => {
    expect(checkAnswerLeak("Kolik je 3 + 3 + 3?", "9")).toBe(false);
  });
  it("vysvětlení principu — ne-leak", () => {
    expect(checkAnswerLeak("Při násobení sčítáš opakovaně. Zkus si to.", "36")).toBe(false);
  });
  it("analogie s jinými čísly — ne-leak", () => {
    // ans=36, příklad používá 4×2=8 (jiné numbers)
    expect(checkAnswerLeak("Třeba 4 × 2 = 8 — to je jen příklad. Tvoje úloha je jiná.", "36")).toBe(false);
  });
  it("zopakování pravidla — ne-leak", () => {
    expect(checkAnswerLeak("Násobíš stejné číslo několikrát. Pak je to součin.", "36")).toBe(false);
  });
});

describe("escapeRegex — utility", () => {
  it("escapuje všechny regex special chars", () => {
    expect(escapeRegex(".*+?^${}()|[]\\")).toBe("\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\");
  });
  it("nech čisté řetězce beze změny", () => {
    expect(escapeRegex("abc123")).toBe("abc123");
  });
  it("escapuje tečku v desetinném čísle", () => {
    expect(escapeRegex("3.14")).toBe("3\\.14");
  });
});

describe("checkAnswerLeak — Fáze 7 regression", () => {
  it("[regression] AI navrhuje výsledek nepřímo přes 'tedy je to X'", () => {
    expect(checkAnswerLeak("Spočti, kolik je 6×6. Tedy je to 36.", "36")).toBe(true);
  });
  it("[regression] AI šeptá výsledek slovem", () => {
    expect(checkAnswerLeak("Vyjde dvanáct.", "dvanáct")).toBe(true);
  });
  it("[regression] AI dává úplnou rovnici", () => {
    expect(checkAnswerLeak("12 × 3 = 36", "36")).toBe(true);
  });
  it("[regression] AI dává jen sub-výpočet (NESMÍ být blokováno pokud výsledek neuvádí)", () => {
    expect(checkAnswerLeak("Nejdřív si rozlož 12 na 10+2.", "36")).toBe(false);
  });
});
