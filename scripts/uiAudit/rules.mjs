/**
 * UI audit — pravidla.
 *
 * Každé pravidlo má v `origin` chybu, ze které vzniklo. Když někdo pravidlo
 * jednou vypne nebo přepíše, ať ví, co tím pouští zpátky.
 *
 * `suggestion` je návrh řešení, ne příkaz — u většiny těchhle vad je „oprava"
 * produktové rozhodnutí (smazat vs. napojit, dopsat vs. zrušit pole).
 * Automaticky se opravuje jedině `unused-import`, kde je náhrada prokazatelně
 * bez sémantického dopadu.
 */
import ts from "typescript";
import { walk, moduleIdOf } from "./engine.mjs";

const isComponentFile = (rel) => /^src\/(components|pages)\//.test(rel);
const PASCAL = /^[A-Z][A-Za-z0-9]*$/;

/** Spočítá výskyty identifikátoru v souboru mimo jeho vlastní deklaraci. */
function countReferences(sf, name, declNode) {
  let n = 0;
  walk(sf, (node) => {
    if (ts.isIdentifier(node) && node.text === name && node !== declNode) n++;
  });
  return n;
}

/** Vrátí JSX atribut daného jména, pokud na elementu je. */
function jsxAttr(openingEl, name) {
  return openingEl.attributes.properties.find(
    (p) => ts.isJsxAttribute(p) && p.name.getText() === name,
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export const RULES = [
  {
    id: "dead-component",
    title: "Komponenta, kterou nikdo nerenderuje",
    why:
      "Hotová komponenta, na kterou nevede jediný import, vypadá v repu jako funkční část produktu. " +
      "Nikdo ji nevidí, nikdo ji netestuje — a přitom se do ní dál investuje čas.",
    suggestion:
      "Rozhodni: napojit (a před tím projít, jestli nezastarala), nebo smazat. Nechat ji ležet je " +
      "nejhorší varianta — příští člověk ji buď opraví zbytečně, nebo ji nasadí i s vadami.",
    origin:
      "ChildActivityChart a SelfPracticeList (2026-09-04). Graf přežil jako mrtvý kód celý redesign " +
      "dashboardu a nesl 3 vady; do SelfPracticeList byly téhož dne napsány dvě opravy, které nikdo neuvidí.",
    check(file, project, report) {
      if (!isComponentFile(file.rel)) return;
      const modId = moduleIdOf(file.rel);
      if (project.importedModules.has(modId)) return;

      walk(file.sf, (node) => {
        let name = null;
        let target = node;
        if (ts.isFunctionDeclaration(node) && node.name && hasExport(node)) {
          name = node.name.text; target = node.name;
        } else if (ts.isVariableStatement(node) && hasExport(node)) {
          const d = node.declarationList.declarations[0];
          if (d && ts.isIdentifier(d.name) && d.initializer &&
              (ts.isArrowFunction(d.initializer) || ts.isFunctionExpression(d.initializer))) {
            name = d.name.text; target = d.name;
          }
        }
        if (!name || !PASCAL.test(name)) return;
        if (project.importedNames.has(name)) return;
        report(target, `<${name}> není nikde importována ani renderována.`);
      });
    },
  },

  {
    id: "stuck-toggle",
    title: "Přepínač, který nejde přepnout",
    why:
      "Řízená hodnota složená přes `||` s odvozeným výrazem: jakmile je druhý operand pravdivý, " +
      "je celý výraz natrvalo pravdivý. Handler stav poctivě přepne, ale na vykreslenou hodnotu to " +
      "nemá vliv — tlačítko vypadá funkčně a nedělá nic.",
    suggestion:
      "Rozliš „uživatel zatím nerozhodl\" od „uživatel zvolil false\": stav `boolean | null`, " +
      "`const isOpen = open ?? vychoziHodnota`. Popisek i ikonu čti ze stejné proměnné jako řízenou " +
      "hodnotu, ať se nemůžou rozejít.",
    origin:
      "ChildActivityChart `open={open || shouldDefaultOpen}` (2026-09-04) — tlačítko „Skrýt\" nešlo " +
      "použít vždycky, když mělo dítě jakoukoli aktivitu. Nahlásil uživatel, ne testy.",
    check(file, project, report) {
      walk(file.sf, (node) => {
        if (!ts.isJsxOpeningElement(node) && !ts.isJsxSelfClosingElement(node)) return;
        // Jen BOOLEOVSKÉ řízené hodnoty. `value={x || "all"}` je u Radix Selectu
        // idiom pro „prázdno → sentinel", ne uvíznutý přepínač — tam `||` mapuje
        // hodnotu, nezaklíná ji napevno.
        const CONTROLLED = [
          ["open", "onOpenChange"],
          ["checked", "onCheckedChange"],
          ["pressed", "onPressedChange"],
        ];
        for (const [valueAttr, handlerAttr] of CONTROLLED) {
          const v = jsxAttr(node, valueAttr);
          const h = jsxAttr(node, handlerAttr);
          if (!v || !h || !v.initializer || !ts.isJsxExpression(v.initializer)) continue;
          const expr = v.initializer.expression;
          if (!expr || !ts.isBinaryExpression(expr)) continue;
          if (expr.operatorToken.kind !== ts.SyntaxKind.BarBarToken) continue;
          report(
            node,
            `\`${valueAttr}={${expr.getText().slice(0, 60)}}\` je řízená hodnota složená přes \`||\`, ` +
              `zatímco \`${handlerAttr}\` mění jen jeden operand.`,
          );
        }
      });
    },
  },

  {
    id: "utc-day-key",
    title: "Klíč dne počítaný v UTC",
    why:
      "`toISOString().slice(0, 10)` vrací UTC den. V ČR (UTC+1/+2) tím večerní aktivita spadne do " +
      "jiného dne, než ve který se opravdu stala — statistika i graf ukážou špatný den.",
    suggestion:
      "Použij `localDayKey()` z `src/lib/assignmentBinding.ts` nebo `toLocaleDateString(\"en-CA\")`. " +
      "Pozor: `localDayKey` vrací `string | null`, návratovou hodnotu je potřeba ošetřit.",
    origin:
      "`useChildStats` + `weeklyReportGenerator` (opraveno ve `feed2bf`) a znovu `ChildActivityChart` " +
      "(2026-09-04) — tentýž bug na třech místech, protože se opravil jen tam, kde si ho někdo všiml.",
    check(file, project, report) {
      walk(file.sf, (node) => {
        if (!ts.isCallExpression(node)) return;
        const txt = node.getText().replace(/\s+/g, "");
        if (!/toISOString\(\)\.(slice|substring|substr)\(0,10\)$/.test(txt)) return;
        report(node, "`toISOString().slice(0, 10)` jako klíč dne — to je UTC den, ne místní.");
      });
    },
  },

  {
    id: "write-only-state",
    title: "Stav, který se zapisuje, ale nikde nečte",
    why:
      "`useState`, jehož hodnota se nikde nepoužije, znamená, že uživatelský vstup nemá kam dojít. " +
      "Typicky formulář, který data přijme a nikdy je nezobrazí.",
    suggestion:
      "Buď hodnotu zobraz (a umožni ji upravit), nebo pole zruš. Nechat uživatele psát do prázdna " +
      "je nejhorší z variant.",
    origin:
      "`editNotes` v ParentDashboard (2026-09-04) — „Poznámky k učení\" šlo vyplnit při zakládání " +
      "dítěte, ale editační formulář pro ně neměl pole a nic v aplikaci je nečetlo.",
    check(file, project, report) {
      walk(file.sf, (node) => {
        if (!ts.isVariableDeclaration(node)) return;
        if (!node.initializer || !ts.isCallExpression(node.initializer)) return;
        const callee = node.initializer.expression.getText();
        if (callee !== "useState" && callee !== "React.useState") return;
        if (!ts.isArrayBindingPattern(node.name)) return;
        const [valueEl, setterEl] = node.name.elements;
        if (!valueEl || !ts.isBindingElement(valueEl) || !ts.isIdentifier(valueEl.name)) return;
        if (!setterEl || !ts.isBindingElement(setterEl) || !ts.isIdentifier(setterEl.name)) return;
        const value = valueEl.name.text;
        const setter = setterEl.name.text;
        if (countReferences(file.sf, value, valueEl.name) > 0) return;
        if (countReferences(file.sf, setter, setterEl.name) === 0) return; // vůbec nepoužité řeší lint
        report(valueEl.name, `\`${value}\` se nastavuje přes \`${setter}\`, ale nikde se nečte.`);
      });
    },
  },

  {
    id: "branch-only-action",
    title: "Akce dostupná jen v jedné větvi",
    why:
      "Handler navěšený v jediné větvi renderu znamená, že se k akci uživatel dostane jen v jednom " +
      "stavu obrazovky. Typicky „spustit\" jde jen dokud není co spustit znovu.",
    suggestion:
      "Vytáhni prvek do proměnné a vlož ho do obou větví, nebo ho posuň nad větvení. Když je v jedné " +
      "větvi nežádoucí, ať to říká komentář — ne náhoda v JSX.",
    origin:
      "„Spustit AI analýzu chyb\" v ChildMisconceptions (2026-09-04) — tlačítko existovalo jen dokud " +
      "byl seznam nálezů prázdný, takže rodič nemohl přegenerovat zastaralou analýzu.",
    check(file, project, report) {
      if (!isComponentFile(file.rel)) return;

      // Handlery deklarované ve scope komponenty: const handleX = () => {…}
      const handlers = [];
      walk(file.sf, (node) => {
        if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) return;
        if (!node.initializer) return;
        if (!ts.isArrowFunction(node.initializer) && !ts.isFunctionExpression(node.initializer)) return;
        if (!/^handle[A-Z]/.test(node.name.text)) return;
        handlers.push({ name: node.name.text, decl: node.name, fn: enclosingFunction(node) });
      });
      if (handlers.length === 0) return;

      // Použití v JSX atributu (pozice v souboru)
      const usages = new Map();
      walk(file.sf, (node) => {
        if (!ts.isJsxAttribute(node) || !node.initializer) return;
        if (!ts.isJsxExpression(node.initializer) || !node.initializer.expression) return;
        const e = node.initializer.expression;
        if (!ts.isIdentifier(e)) return;
        if (!usages.has(e.text)) usages.set(e.text, []);
        usages.get(e.text).push(e.getStart(file.sf));
      });

      for (const { name, decl, fn } of handlers) {
        const where = usages.get(name);
        if (!where || where.length !== 1) continue; // víc míst = dostupné z víc stavů
        if (!fn) continue;

        // JSX returny TÉŽE funkce. Bez větvení nemá pravidlo smysl — proto ≥2.
        const jsxReturns = [];
        walk(fn, (n) => {
          if (!ts.isReturnStatement(n) || !n.expression) return;
          if (enclosingFunction(n) !== fn) return; // return vnořené funkce/callbacku
          if (containsJsx(n.expression)) jsxReturns.push(n.getStart(file.sf));
        });
        if (jsxReturns.length < 2) continue;

        // Sedí použití v jiné než POSLEDNÍ (hlavní) větvi?
        const lastReturn = Math.max(...jsxReturns);
        if (where[0] > lastReturn) continue;

        report(
          decl,
          `\`${name}\` je navěšený jen v dřívější větvi renderu — v hlavním returnu se nevyskytuje, ` +
            `takže akce zmizí, jakmile se komponenta překlopí do druhého stavu.`,
        );
      }
    },
  },

  {
    id: "empty-state-null",
    title: "Prázdný stav vrací `null`",
    why:
      "Když seznam při nule položek vrátí `null`, uživatel nedostane vysvětlení ani akci. A pokud má " +
      "nadřazený obal pevnou výšku, zůstane po komponentě prázdná díra.",
    suggestion:
      "Vrať prázdný stav s jednou větou, co se tu objeví a čím to uživatel spustí. Zkontroluj zároveň, " +
      "jestli obal nedrží pevnou výšku (`h-[…]`).",
    origin:
      "AssignmentList (2026-09-04) — `return null` při nule úkolů v obalu s `h-[460px]` znamenal " +
      "půlobrazovky prázdné bílé plochy pod nadpisem „Zadané úkoly\".",
    check(file, project, report) {
      if (!isComponentFile(file.rel)) return;
      walk(file.sf, (node) => {
        if (!ts.isIfStatement(node)) return;
        const cond = node.expression.getText().replace(/\s+/g, "");
        if (!/\.length===0|\.length<1|!\w+\.length/.test(cond)) return;
        const then = node.thenStatement;
        const isNullReturn = (s) =>
          ts.isReturnStatement(s) && s.expression && s.expression.kind === ts.SyntaxKind.NullKeyword;
        const hit = isNullReturn(then) ||
          (ts.isBlock(then) && then.statements.length === 1 && isNullReturn(then.statements[0]));
        if (!hit) return;
        report(node, `\`if (${cond}) return null\` — prázdný stav bez vysvětlení.`);
      });
    },
  },

  {
    id: "adhoc-subject-map",
    title: "Vlastní mapa předmětů místo rejstříku",
    why:
      "Předmět odvozený z prefixu `skill_id` funguje jen na legacy demo ID. Reálná témata mají tvar " +
      "`g4-mat-…`, `g4-cjl-…`, takže propadnou na obecný fallback — a všechna vypadají stejně.",
    suggestion:
      "Použij `getSkillSubject()` + `getSubjectMeta()` ze `src/lib/subjectRegistry.ts`. Design systém " +
      "kvůli tomu sjednotil šest nezávislých map do jedné.",
    origin:
      "`subjectEmoji()` v ChildActivityChart (2026-09-04) — porovnávala `startsWith(\"math\")`, " +
      "`\"cz-\"`, `\"prv-\"`, takže u každého reálného tématu vrátila obecné 📚.",
    check(file, project, report) {
      if (/subjectRegistry|skillReadableName/.test(file.rel)) return;
      walk(file.sf, (node) => {
        if (!ts.isCallExpression(node)) return;
        if (!ts.isPropertyAccessExpression(node.expression)) return;
        if (node.expression.name.text !== "startsWith") return;
        const arg = node.arguments[0];
        if (!arg || !ts.isStringLiteral(arg)) return;
        if (!/^(math|cz-|prv-|frac|diktat|pr-)$/.test(arg.text)) return;

        // Fallback řetěz je v pořádku: když funkce nejdřív zkusí rejstřík
        // a prefixy použije až pro legacy ID, žádná informace se neztrácí.
        // (Tvar z `Report.detectSubject` — bez téhle výjimky by pravidlo
        // křičelo na správně napsaný kód.)
        const fn = enclosingFunction(node);
        if (fn && /getSkillSubject|getSubjectMeta|resolveSubjectKey/.test(fn.getText())) return;

        report(node, `\`startsWith("${arg.text}")\` odvozuje předmět z prefixu bez použití rejstříku — reálná ID mají tvar \`g4-mat-…\`.`);
      });
    },
  },

  {
    id: "name-in-word",
    title: "Náhrada jména rozbíjí slovo",
    why:
      "`replace(/[Žž]ák/g, jmeno)` trefí i vnitřek slova: „žáka\" → „Tondaa\", „žákyně\" → „Tondayně\". " +
      "Rodič dostane v textu ne-slovo. České skloňování nejde spolehlivě odvodit, takže jediné bezpečné " +
      "je nahrazovat jen samostatný tvar.",
    suggestion:
      "Doplň hranice slova: `/\\b[Žž]ák\\b/g`. Skloňované tvary radši nech být — obecné „žáka\" je " +
      "lepší než rozbité „Tondaa\". Do budoucna ať AI prompt vynucuje 1. pád.",
    origin:
      "`ChildMisconceptions.sub()` a `Report.subName()` (2026-09-04). Táž past už jednou udeřila " +
      "u „Úkol pro Tonda\" — texty pro rodiče se od té doby píšou tak, aby jméno zůstalo v 1. pádu.",
    check(file, project, report) {
      walk(file.sf, (node) => {
        if (!ts.isCallExpression(node)) return;
        if (!ts.isPropertyAccessExpression(node.expression)) return;
        if (node.expression.name.text !== "replace") return;
        const [pattern] = node.arguments;
        if (!pattern || !ts.isRegularExpressionLiteral(pattern)) return;
        const src = pattern.getText();
        if (src.includes("\\b")) return; // hranice slova už tam je
        // Znakové třídy je nutné odstranit, než se v ZDROJI regexu hledá slovo:
        // v textu `/[Žž]ák/g` po `ž` následuje `]`, ne `ák`, takže naivní test
        // nikdy nepadne. (Přesně na tohle první verze pravidla doplatila.)
        const norm = src.replace(/[[\]]/g, "");
        if (!/[Žž]ák|[Žž]ačk|d[ií]t[ěe]/.test(norm)) return;
        report(node, `\`replace(${src}, …)\` nahrazuje i uvnitř slova — „žáka\" se změní na ne-slovo.`);
      });
    },
  },

  {
    id: "streak-language",
    title: "Text tvrdí sérii, kterou kód nepočítá",
    why:
      "„v řadě\" / „za sebou\" / „bez přerušení\" slibuje po sobě jdoucí dny. Pokud proměnná drží " +
      "počet RŮZNÝCH dnů s aktivitou, je to nepravda vůči uživateli — a zároveň streak, který " +
      "invariant projektu („no gamification\") zakazuje.",
    suggestion:
      "Popiš, co se opravdu měří („5 dní s procvičováním\"), nebo sérii doopravdy spočítej. " +
      "Zakázané je jen tvrdit jedno a počítat druhé.",
    origin:
      "„🔥 8 dní v řadě\" na dětské ploše + „kolik dní v řadě trénuje\" v ChildActivityBadge " +
      "(2026-09-04). `daysActive` je počet různých dnů, hook to tak i dokumentoval.",
    check(file, project, report) {
      // „za sebou" schválně NENÍ v seznamu: „máš za sebou 12 úloh" je běžné
      // české „mít hotovo", ne tvrzení o sérii. Zbylé fráze jsou jednoznačné.
      const PHRASES = ["v řadě", "bez přerušení", "v kuse"];
      // Podmínkou je `daysActive` — metrika, o které víme, že sérii NEpočítá.
      // Soubor se skutečným čítačem série (`error_streak`) je v pořádku a text
      // „× chyba v řadě" je tam pravdivý.
      if (!/daysActive/.test(file.text)) return;
      walk(file.sf, (node) => {
        if (!ts.isStringLiteral(node) && !ts.isNoSubstitutionTemplateLiteral(node) &&
            !ts.isTemplateExpression(node)) return;
        const text = node.getText();
        const hit = PHRASES.find((p) => text.includes(p));
        if (!hit) return;
        report(node, `Text obsahuje „${hit}\" v souboru, který pracuje s počtem dnů — ověř, že jde opravdu o dny po sobě.`);
      });
    },
  },

  {
    id: "hardcoded-grade-gate",
    title: "Dostupnost ročníku rozhodnutá natvrdo",
    why:
      "Který ročník je pro žáka otevřený, má rozhodovat jediné místo — `isGradeAvailable` " +
      "(`ACTIVE_GRADES`). Vlastní gate v komponentě se rozejde s obsahem a žák se ke svému " +
      "ročníku nedostane, i když pro něj obsah existuje.",
    suggestion:
      "Použij `isGradeAvailable(g)` z `src/lib/contentAvailability.ts`. Odemknutí ročníku se pak " +
      "propíše všude naráz — dětský onboarding, rodičovské výběry i tahle obrazovka.",
    origin:
      "`GradeSelect` (nalezeno 2026-09-04) — mělo `DEMO_MODE = true` / `DEMO_GRADE = 3`, takže " +
      "pouštělo dál JEN třetí ročník a u druhého i čtvrtého psalo „Již brzy\", přestože " +
      "`ACTIVE_GRADES` je `[2, 3, 4]` a obsah pro ně existuje.",
    check(file, project, report) {
      if (/contentAvailability|\.test\./.test(file.rel)) return;
      if (/isGradeAvailable/.test(file.text)) return; // rejstřík se používá → v pořádku
      walk(file.sf, (node) => {
        if (!ts.isVariableDeclaration(node) || !ts.isIdentifier(node.name)) return;
        const name = node.name.text;
        if (!/^(DEMO_GRADE|DEMO_MODE|ALLOWED_GRADES?|ENABLED_GRADES?)$/.test(name)) return;
        report(node.name, `\`${name}\` rozhoduje o ročnících mimo \`isGradeAvailable\`.`);
      });
    },
  },

  {
    id: "raw-id-fallback",
    title: "Uživateli se může zobrazit holé ID",
    why:
      "Poslední článek fallbacku na `skill_id` znamená, že se uživateli u nedohledatelného tématu " +
      "ukáže technický slug („cz-vyjmenovana-slova-b\"). Vypadá to jako rozbitá aplikace a v jedné " +
      "části produktu se to stane, zatímco v jiné ne.",
    suggestion:
      "Ukonči fallback `getReadableSkillName(id)` — má curated mapu i alias resolution, takže vrátí " +
      "čitelný název i pro legacy ID.",
    origin:
      "`ChildHomePage` (2026-09-04) — dítě u úkolu četlo „cz vyjmenovana slova b\", zatímco rodič " +
      "na téže věci viděl „Vyjmenovaná slova po B\". Nalezeno až živě v prohlížeči.",
    check(file, project, report) {
      if (/skillReadableName/.test(file.rel)) return;
      walk(file.sf, (node) => {
        if (!ts.isBinaryExpression(node)) return;
        const op = node.operatorToken.kind;
        if (op !== ts.SyntaxKind.QuestionQuestionToken && op !== ts.SyntaxKind.BarBarToken) return;
        const right = node.right;
        if (!ts.isPropertyAccessExpression(right)) return;
        if (!/^(skill_id|skillId)$/.test(right.name.text)) return;
        // Fallback uvnitř samotného resolveru je v pořádku — ten holé ID zušlechťuje.
        const fn = enclosingFunction(node);
        if (fn && /humanizeId|getReadableSkillName/.test(fn.getText())) return;
        report(node, `\`… ${op === ts.SyntaxKind.QuestionQuestionToken ? "??" : "||"} ${right.getText()}\` — poslední fallback je holé ID, ne čitelný název.`);
      });
    },
  },

  {
    id: "unused-import",
    title: "Import, který se nepoužívá",
    why:
      "Nepoužitý import vypadá, jako by se ta věc v souboru dělala. Kvůli `useT` importovanému bez " +
      "zavolání se dá snadno napsat `t(...)`, které není ve scope.",
    suggestion: "Smazat. Když má import zůstat (vedlejší efekt), patří k němu komentář proč.",
    origin:
      "`useT` v AssignmentList (2026-09-04) — importovaný, nikdy nezavolaný. Toho jsem si všiml až " +
      "když jsem na `t(...)` v prázdném stavu dostal chybu.",
    autofix: true,
    check(file, project, report) {
      walk(file.sf, (node) => {
        if (!ts.isImportDeclaration(node) || !node.importClause) return;
        const nb = node.importClause.namedBindings;
        if (!nb || !ts.isNamedImports(nb)) return;
        for (const el of nb.elements) {
          const name = el.name.text;
          if (name === "React") continue;
          if (countReferences(file.sf, name, el.name) > 0) continue;
          report(el.name, `\`${name}\` je importovaný, ale v souboru se nepoužívá.`, {
            fix: { kind: "remove-import-specifier", name, importStart: node.getStart(file.sf) },
          });
        }
      });
    },
  },
];

function hasExport(node) {
  return node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

/** Nejbližší nadřazená funkce — aby se větve porovnávaly v rámci jedné komponenty. */
function enclosingFunction(node) {
  let p = node.parent;
  while (p) {
    if (ts.isFunctionDeclaration(p) || ts.isFunctionExpression(p) || ts.isArrowFunction(p) ||
        ts.isMethodDeclaration(p)) return p;
    p = p.parent;
  }
  return null;
}

function containsJsx(node) {
  let found = false;
  walk(node, (n) => {
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) found = true;
  });
  return found;
}
