import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import DevTopicPreview from "@/pages/DevTopicPreview";

const at = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/dev/tema/:id?" element={<DevTopicPreview />} /></Routes>
    </MemoryRouter>,
  );

describe("dev náhled tématu", () => {
  it("bez ID vypíše všechna témata", () => {
    const { container } = at("/dev/tema");
    expect(container.textContent).toMatch(/340 z 340|\d+ z \d+/);
    expect(container.querySelectorAll("li a").length).toBeGreaterThan(300);
  });

  it("s ID ukáže výklad a úlohy všech tří úrovní", () => {
    const { container, getByText } = at("/dev/tema/g4-mat-zlomek-cast-celku-4");
    getByText("Zlomek jako část celku");
    getByText(/^Výklad \(„Co je dobré vědět/);
    const nadpisy = [...container.querySelectorAll("h2")].map((h) => h.textContent ?? "");
    expect(nadpisy.filter((h) => /^L[123]/.test(h))).toHaveLength(3);
    expect(container.querySelectorAll("[data-testid=worked-example]").length).toBe(12);
    // L1 zlomků má proužek (TaskVisual)
    expect(container.querySelector('[role="img"]')).not.toBeNull();
  });

  it("neexistující ID ohlásí srozumitelně", () => {
    const { container } = at("/dev/tema/neexistuje");
    expect(container.textContent).toContain("neexistuje");
  });

  it("v App.tsx je jen za import.meta.env.DEV (do produkce se nedostane)", () => {
    const app = readFileSync(resolve(__dirname, "../App.tsx"), "utf-8");
    expect(app).toMatch(/import\.meta\.env\.DEV \? lazy\(\(\) => import\("\.\/pages\/DevTopicPreview"\)\) : null/);
    expect(app).not.toMatch(/^import .*DevTopicPreview/m);
  });
});
