import { describe, it, expect } from "vitest";
import { mapAuthError } from "@/lib/authErrors";

describe("mapAuthError — překlad Supabase chyb do češtiny", () => {
  it("špatné přihlašovací údaje", () => {
    expect(mapAuthError("Invalid login credentials")).toContain("Nesprávný e-mail");
  });

  it("nepotvrzený e-mail", () => {
    expect(mapAuthError("Email not confirmed")).toContain("není potvrzený");
  });

  it("duplicitní registrace", () => {
    expect(mapAuthError("User already registered")).toContain("už je zaregistrovaný");
  });

  it("krátké heslo", () => {
    expect(mapAuthError("Password should be at least 6 characters")).toContain("alespoň 6 znaků");
  });

  it("neplatný e-mail", () => {
    expect(mapAuthError("Unable to validate email address")).toContain("platnou e-mailovou");
  });

  it("rate limit", () => {
    expect(mapAuthError("email rate limit exceeded")).toContain("Příliš mnoho pokusů");
  });

  it("síťová chyba", () => {
    expect(mapAuthError("Failed to fetch")).toContain("Chyba sítě");
  });

  it("neznámá chyba → obecný fallback", () => {
    expect(mapAuthError("něco úplně jiného")).toContain("Něco se nepovedlo");
  });

  it("null/undefined → fallback (nespadne)", () => {
    expect(mapAuthError(null)).toContain("Něco se nepovedlo");
    expect(mapAuthError(undefined)).toContain("Něco se nepovedlo");
  });

  it("výstup je vždy česky, ne surová anglická zpráva", () => {
    const raw = "Invalid login credentials";
    expect(mapAuthError(raw)).not.toBe(raw);
  });
});
