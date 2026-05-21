/**
 * Grade 4 — veřejný export.
 *
 * Vše, co grade-4 modul nabízí zbytku aplikace, prochází tudy.
 * Vnitřní soubory grade-4/ se NEimportují odjinud.
 *
 * Grade-4 session přidává topics postupně. Každý topic je `TopicMetadata`
 * (z `src/lib/types.ts`) s vyplněným `rvpNodeId` linkujícím na RVP dataset.
 */

import type { TopicMetadata } from "@/lib/types";

import { PISEMNE_SCITANI_ODCITANI } from "./matematika/pisemneScitaniAOdcitaniVicecifernychCisel";
import { PISEMNE_DELENI } from "./matematika/pisemneDeleniJednocifernymDelitelem";
import { PISEMNE_NASOBENI } from "./matematika/pisemneNasobeniJednoADvoucifernymCinitelem";
import { ZLOMEK_CAST_CELKU } from "./matematika/zlomekJakoCastCelkuZnazorneniZlomku";
import { SCITANI_ODCITANI_ZLOMKU } from "./matematika/scitaniAOdcitaniZlomkuSeStejnymJmenovatelem";
import { CTENI_ZAPIS_POROVNAVANI } from "./matematika/cteniZapisAPorovnavaniCiselDoMilionu";
import { ZAOKROUHLOVANI } from "./matematika/zaokrouhlovaniNaDesitkyStovkyTisiceDesetitisice";
import { OBVOD_OBSAH } from "./matematika/obvodAObsahObdelnikuACtverce";
import { ROVNOBEZKY_KOLMICE } from "./matematika/rovnobezkyAKolmice";
import { TROJUHELNIK_DRUHY } from "./matematika/trojuhelnikDruhyPodleStran";
import { OSOVA_SOUMERNOST } from "./matematika/osovaSoumernostOsaSoumerneUtvary";
import { ARITMETICKY_PRUMER } from "./matematika/aritmetickyPrumerUvod";
import { TABULKY_DIAGRAMY } from "./matematika/tabulkyDiagramySloupcovyKruhovy";
import { MAGICKE_CTVERCE_RADY } from "./matematika/magickeCtverceCiselneRady";

export const GRADE_4_TOPICS: TopicMetadata[] = [
  ...PISEMNE_SCITANI_ODCITANI,
  ...PISEMNE_DELENI,
  ...PISEMNE_NASOBENI,
  ...ZLOMEK_CAST_CELKU,
  ...SCITANI_ODCITANI_ZLOMKU,
  ...CTENI_ZAPIS_POROVNAVANI,
  ...ZAOKROUHLOVANI,
  ...OBVOD_OBSAH,
  ...ROVNOBEZKY_KOLMICE,
  ...TROJUHELNIK_DRUHY,
  ...OSOVA_SOUMERNOST,
  ...ARITMETICKY_PRUMER,
  ...TABULKY_DIAGRAMY,
  ...MAGICKE_CTVERCE_RADY,
];
