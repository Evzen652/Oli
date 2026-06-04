import type { TopicMetadata } from "@/lib/types";

// ── Matematika (13) ──
import { CTENIZAPISPOROVNAVANICISELDO1000 } from "./matematika/cteniZapisPorovnavaniCiselDo1000";
import { ZAOKROUHLOVANINADESITKYASTOVKY } from "./matematika/zaokrouhlovaniNaDesitkyAStovky";
import { SCITANIAODCITANIDO1000 } from "./matematika/scitaniAOdcitaniDo1000";
import { NASOBILKA6789A10 } from "./matematika/nasobilka6789a10";
import { NASOBENIADELENIMALANASOBILKA } from "./matematika/nasobeniADeleniMalaNasobilka";
import { NASOBENI10A100DELENISEZBYTKEM } from "./matematika/nasobeni10a100DeleniSeZbytkem";
import { PREVODYJEDNOTEKDELKY } from "./matematika/prevodyJednotekDelky";
import { PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS } from "./matematika/prevodyJednotekHmotnostiObjemCas";
import { TABULKYJIZDNIRADYDIAGRAMY } from "./matematika/tabulkyJizdniRadyDiagramy";
import { SLOVNIULOHYSEDVEMAOPERACEMI } from "./matematika/slovniUlohySeDvemaOperacemi";
import { RYSOVANIUSECKYODANEDELCE } from "./matematika/rysovaaniUseckyODaneDelce";
import { KRUZNICAAKRUHRYSOVANI } from "./matematika/kruznicaKruhRysovani";
import { OBVODTROJUHELNIKUCTVERCEOBD } from "./matematika/obvodTrojuhelnikuCtverceObdelniku";

// ── Prvouka (14) ──
// TODO: přibývají jak grade-3 session implementuje

// ── Český jazyk a literatura (25) ──
// TODO: přibývají jak grade-3 session implementuje

export const GRADE_3_TOPICS: TopicMetadata[] = [
  // ── Matematika ──
  ...CTENIZAPISPOROVNAVANICISELDO1000,
  ...ZAOKROUHLOVANINADESITKYASTOVKY,
  ...SCITANIAODCITANIDO1000,
  ...NASOBILKA6789A10,
  ...NASOBENIADELENIMALANASOBILKA,
  ...NASOBENI10A100DELENISEZBYTKEM,
  ...PREVODYJEDNOTEKDELKY,
  ...PREVODYJEDNOTEKHMOTNOSTIOBJEMCAS,
  ...TABULKYJIZDNIRADYDIAGRAMY,
  ...SLOVNIULOHYSEDVEMAOPERACEMI,
  ...RYSOVANIUSECKYODANEDELCE,
  ...KRUZNICAAKRUHRYSOVANI,
  ...OBVODTROJUHELNIKUCTVERCEOBD,
];
