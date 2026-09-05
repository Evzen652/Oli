import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

/**
 * Design systém Oli — sjednoceno 2026-08-25 podle designového auditu.
 *
 * Klíčová myšlenka: aplikace měla ~1700 natvrdo psaných barevných tříd a
 * paralelně běželo 5 šedých / 4 zelené / 4 fialové rampy, 7 rádiusů a 2
 * stínové škály. Místo přepisování stovek komponent se rampy PŘEMAPUJÍ tady:
 * `bg-slate-100` tak vykreslí teplou stone, `bg-violet-600` značkovou
 * borůvkovou atd. Jeden soubor srovná celou aplikaci a nic se nerozbije.
 *
 * Až se komponenty budou psát nově, používej rovnou tokeny (bg-primary,
 * bg-card, text-muted-foreground) — tyhle aliasy jsou most, ne cíl.
 */

/** Značková oranžová — primární barva Oli, shodná s logem. `500` = --primary. */
const brandOrange = {
  50: "#FFF7ED",
  100: "#FFEDD5",
  200: "#FED7AA",
  300: "#FDBA74",
  400: "#FB923C",
  500: "#F97316",
  600: "#EA580C",
  700: "#C2410C",
  800: "#9A3412",
  900: "#7C2D12",
  950: "#431407",
};

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // Pozn.: dřívější `["Baloo 2", …]` bez vnitřních uvozovek generovalo
        // nevalidní CSS (font-family: Baloo 2) → prohlížeč deklaraci zahodil
        // a Baloo 2 se NIKDY nevykreslil, jen se stahoval. Jedno písmo stačí —
        // Nunito má kulaté terminály a dětskou vlídnost nese samo.
        heading: ["Nunito", "ui-sans-serif", "sans-serif"],
        display: ["Nunito", "ui-sans-serif", "sans-serif"],
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // ── Typografická škála ──
      // Jedno písmo (Nunito), jedna škála. Pojmenované tokeny nesou i váhu,
      // takže `text-h2` je celý typografický styl, ne jen velikost.
      //
      // Číselné stupně jsou zároveň PŘEMAPOVANÉ o ~1 px nahoru: rodičovská
      // a admin část měly základní text 11–14 px, což je pod hranicí komfortu
      // u produktu, který má prodat důvěryhodnost. Posun v konfiguraci zvedne
      // písmo všude naráz — jinak by šlo o editaci stovek call-sitů.
      // `3xl` a výš se nemění (hero škála, řeší ji token `display`).
      fontSize: {
        xs: ["12px", { lineHeight: "1.45" }], // absolutní minimum
        sm: ["15px", { lineHeight: "1.55" }], // ← 14px; default rodič/admin
        base: ["17px", { lineHeight: "1.6" }], // ← 16px; default dětská část
        lg: ["19px", { lineHeight: "1.5" }], // ← 18px
        xl: ["21px", { lineHeight: "1.4" }], // ← 20px
        "2xl": ["26px", { lineHeight: "1.25" }], // ← 24px
        "3xl": ["30px", { lineHeight: "1.2" }],
        "4xl": ["36px", { lineHeight: "1.15" }],
        "5xl": ["48px", { lineHeight: "1.1" }],
        "6xl": ["60px", { lineHeight: "1" }],
        "7xl": ["72px", { lineHeight: "1" }],
        display: ["34px", { lineHeight: "1.15", fontWeight: "800" }],
        h1: ["26px", { lineHeight: "1.2", fontWeight: "800" }],
        h2: ["21px", { lineHeight: "1.3", fontWeight: "700" }],
        h3: ["17px", { lineHeight: "1.4", fontWeight: "700" }],
        "body-lg": ["17px", { lineHeight: "1.6", fontWeight: "400" }],
        body: ["15px", { lineHeight: "1.55", fontWeight: "400" }],
        label: ["13px", { lineHeight: "1.4", fontWeight: "600" }],
        caption: ["12px", { lineHeight: "1.4", fontWeight: "500" }],
      },
      // Dvě úrovně stínu: e1 = „dá se na mě kliknout", e2 = „vznáším se"
      // (modal, dropdown, hover). Statické plochy stín nemají — dělí je border.
      // Teple neutrální (rgba(41,37,36)) — studený modrošedý stín působí na
      // krémovém podkladu špinavě. Staré názvy jsou aliasy, ať se nemusí
      // editovat ~230 existujících volání.
      boxShadow: {
        e1: "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        e2: "0 4px 10px rgba(41,37,36,.08), 0 12px 28px rgba(41,37,36,.07)",
        sm: "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        DEFAULT: "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        md: "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        lg: "0 4px 10px rgba(41,37,36,.08), 0 12px 28px rgba(41,37,36,.07)",
        xl: "0 4px 10px rgba(41,37,36,.08), 0 12px 28px rgba(41,37,36,.07)",
        "2xl": "0 4px 10px rgba(41,37,36,.08), 0 12px 28px rgba(41,37,36,.07)",
        "soft-1": "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        "soft-2": "0 1px 2px rgba(41,37,36,.06), 0 2px 6px rgba(41,37,36,.04)",
        "soft-3": "0 4px 10px rgba(41,37,36,.08), 0 12px 28px rgba(41,37,36,.07)",
      },
      colors: {
        // ── Přemapování ramp na kanonické (viz hlavička souboru) ──
        // 5 šedých → 1 teplá stone (zabíjí studenou/teplou kolizi na /parent)
        slate: colors.stone,
        gray: colors.stone,
        zinc: colors.stone,
        neutral: colors.stone,
        // 4 zelené → 1 (green); teal necháváme — používá ho prvouka jako předmětovou
        emerald: colors.green,
        lime: colors.green,
        // růžovočervené → 1 červená
        rose: colors.red,
        // žlutá → jantarová (sémantika nápovědy)
        yellow: colors.amber,
        // 4 fialové → značková oranžová
        violet: brandOrange,
        purple: brandOrange,
        indigo: brandOrange,
        fuchsia: brandOrange,
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Běžný text (#44403C, 9,76:1). `--foreground-soft` byl v index.css
        // definovaný od začátku, ale TADY chyběl — takže `text-foreground-soft`
        // neexistoval a kdo potřeboval odstín mezi nadpisem a popiskem, sáhl
        // po `text-slate-600`. Tím vznikla většina zbylých slate tříd; token
        // se registruje, aby ta záminka zmizela.
        "foreground-soft": "hsl(var(--foreground-soft))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          muted: "hsl(var(--destructive-muted))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          muted: "hsl(var(--success-muted))",
        },
        // Nápověda/upozornění. Záměrně BEZ `foreground` — jantarová ani
        // oranžová nesmí nést bílý text (#B45309 s bílou = 3,4:1). Používej
        // `bg-warning-muted text-warning` (tint + tmavý text, 5,02:1).
        warning: {
          DEFAULT: "hsl(var(--warning))",
          muted: "hsl(var(--warning-muted))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Pravidlo: karta i tlačítko = 16px, menší ovládací prvek = 10px,
      // kulaté = full, 24px jen landing/hero. `xl` a `2xl` jsou zámerně
      // aliasy 16px — sjednotí ~250 existujících volání bez editace komponent.
      borderRadius: {
        none: "0",
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
        xl: "16px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
