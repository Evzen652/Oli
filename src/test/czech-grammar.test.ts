import { describe, it, expect } from "vitest";
import { plural, pluralWithNumber, pad, form, adj, phrase, pastTense, pastTenseInclusive } from "@/lib/czechGrammar";

describe("plural — základní pravidlo 1/2-4/5+", () => {
  it("vrací one pro 1", () => expect(plural(1, "díl", "díly", "dílů")).toBe("díl"));
  it("vrací few pro 2,3,4", () => {
    expect(plural(2, "díl", "díly", "dílů")).toBe("díly");
    expect(plural(3, "díl", "díly", "dílů")).toBe("díly");
    expect(plural(4, "díl", "díly", "dílů")).toBe("díly");
  });
  it("vrací many pro 0,5,6,10,100", () => {
    expect(plural(0, "díl", "díly", "dílů")).toBe("dílů");
    expect(plural(5, "díl", "díly", "dílů")).toBe("dílů");
    expect(plural(10, "díl", "díly", "dílů")).toBe("dílů");
    expect(plural(100, "díl", "díly", "dílů")).toBe("dílů");
  });
  it("funguje pro záporná čísla podle absolutní hodnoty", () => {
    expect(plural(-1, "díl", "díly", "dílů")).toBe("díl");
    expect(plural(-3, "díl", "díly", "dílů")).toBe("díly");
  });
});

describe("pluralWithNumber", () => {
  it("složí číslo a tvar", () => {
    expect(pluralWithNumber(1, "úkol", "úkoly", "úkolů")).toBe("1 úkol");
    expect(pluralWithNumber(3, "úkol", "úkoly", "úkolů")).toBe("3 úkoly");
    expect(pluralWithNumber(5, "úkol", "úkoly", "úkolů")).toBe("5 úkolů");
  });
});

describe("pad — slovník substantiv", () => {
  it("ÚKOL", () => {
    expect(pad(1, "ÚKOL")).toBe("1 úkol");
    expect(pad(3, "ÚKOL")).toBe("3 úkoly");
    expect(pad(5, "ÚKOL")).toBe("5 úkolů");
  });
  it("DEN", () => {
    expect(pad(1, "DEN")).toBe("1 den");
    expect(pad(2, "DEN")).toBe("2 dny");
    expect(pad(5, "DEN")).toBe("5 dní");
  });
  it("DÍTĚ", () => {
    expect(pad(1, "DÍTĚ")).toBe("1 dítě");
    expect(pad(3, "DÍTĚ")).toBe("3 děti");
    expect(pad(5, "DÍTĚ")).toBe("5 dětí");
  });
  it("ROK", () => {
    expect(pad(1, "ROK")).toBe("1 rok");
    expect(pad(2, "ROK")).toBe("2 roky");
    expect(pad(5, "ROK")).toBe("5 let");
  });
  it("CVIČENÍ — neměnný tvar napříč pádem", () => {
    expect(pad(1, "CVIČENÍ")).toBe("1 cvičení");
    expect(pad(3, "CVIČENÍ")).toBe("3 cvičení");
    expect(pad(5, "CVIČENÍ")).toBe("5 cvičení");
  });
});

describe("form — jen tvar slova", () => {
  it("vrací tvar bez čísla", () => {
    expect(form(1, "DÍL")).toBe("díl");
    expect(form(3, "DÍL")).toBe("díly");
    expect(form(5, "DÍL")).toBe("dílů");
  });
});

describe("adj + phrase — adjektivum po čísle", () => {
  it("STEJNÝ správně mění tvar", () => {
    expect(adj(1, "STEJNÝ")).toBe("stejný");
    expect(adj(3, "STEJNÝ")).toBe("stejné");
    expect(adj(5, "STEJNÝ")).toBe("stejných");
  });
  it("phrase řeší celou frázi N adj subst", () => {
    expect(phrase(1, "STEJNÝ", "DÍL")).toBe("1 stejný díl");
    expect(phrase(3, "STEJNÝ", "DÍL")).toBe("3 stejné díly");
    expect(phrase(5, "STEJNÝ", "DÍL")).toBe("5 stejných dílů");
  });
});

describe("pastTense — sloveso podle rodu", () => {
  it("ženský rod přidá -a", () => {
    expect(pastTense("splnil", "f")).toBe("splnila");
    expect(pastTense("zvládl", "f")).toBe("zvládla");
  });
  it("střední rod přidá -o", () => {
    expect(pastTense("splnil", "n")).toBe("splnilo");
  });
  it("mužský rod beze změny", () => {
    expect(pastTense("splnil", "m")).toBe("splnil");
  });
  it("neznámý rod beze změny (default mužský)", () => {
    expect(pastTense("splnil", "unknown")).toBe("splnil");
  });
});

describe("pastTenseInclusive — rod nezjištěn → -(a)", () => {
  it("přidá -(a) u sloves končících -l", () => {
    expect(pastTenseInclusive("splnil")).toBe("splnil(a)");
    expect(pastTenseInclusive("zvládl")).toBe("zvládl(a)");
  });
});
