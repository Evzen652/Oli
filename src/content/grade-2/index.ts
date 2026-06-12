import type { TopicMetadata } from "@/lib/types";

// ── Matematika (13) ──
import { SCITANIAODCITANIDO100 } from "./matematika/scitaniAOdcitaniDo100";
import { CISELNAOSADO100 } from "./matematika/ciselnaOsaDo100";
import { CTENIZAPISPOROVNAVANICISELDO100 } from "./matematika/cteniZapisPorovnavaniCiselDo100";
import { NASOBENIJAKO_OPAKOVANE_SCITANI } from "./matematika/nasobeniJakoOpakovaneScitani";
import { NASOBILKA2345 } from "./matematika/nasobilka2345";
import { VZTAHNASOBENIADELENI } from "./matematika/vztahNasobieniADeleni";
import { SLOVNIULOHYDO100 } from "./matematika/slovniUlohyDo100";
import { JEDNOTKYDLKYHMOTNOSTIOBJEMU } from "./matematika/jednotkyDlkyHmotnostiObjemu";
import { MERENICASU } from "./matematika/mereniCasu";
import { POSLOUPNOSTICISEL } from "./matematika/posloupnostiCisel";
import { TABULKYAJEDNODUCHASHEMA } from "./matematika/tabulkyAJednoduchaSchema";
import { BODPRIMKAUSECKA } from "./matematika/bodPrimkaUsecka";
import { MERIENIDELIVKYUSECKY } from "./matematika/mereniDelkyUsecky";

// ── Prvouka (15) ──
import { HODINYKALENDARCAS } from "./prvouka/hodinyKalendarCas";
import { TRADICEAZVYKY } from "./prvouka/tradiceAZvyky";
import { LIDEVOKOLIKAMARADSTVI } from "./prvouka/lideVOkoliKamaradstvi";
import { POVOLANIPRACEDOSPELYCH } from "./prvouka/povolaniPraceDospelych";
import { PRAVIDLASLUSNEHOCHOVANI } from "./prvouka/pravidlaSlusnehoChovani";
import { NASEOBECNAZEV } from "./prvouka/naseObecNazev";
import { ORIENTACEVOBCI } from "./prvouka/orientaceVObci";
import { PLANOBCEOKOLISKOLY } from "./prvouka/planObceOkoliSkoly";
import { DOMACIHOSPODARSKAZVIRATA } from "./prvouka/domaciHospodarskaZvirata";
import { KVETOUCIROSTLINYMLADATA } from "./prvouka/kvetouciRostlinyMladata";
import { ZMENYVPRIRODEJAROLETO } from "./prvouka/zmenyVPrirodeJaroLeto";
import { ZAZIMOVANIZVIRAT } from "./prvouka/zazimovaniZvirat";
import { ZMENYVPRIRODEPODZIMZIMA } from "./prvouka/zmenyVPrirodePodzimZima";
import { DROBNAPORANENITISNOVELINKY } from "./prvouka/drobnaPoraneniTisnoveLinky";
import { ZDRAVYZIVOTNISTYL } from "./prvouka/zdravyZivotniStyl";

export const GRADE_2_TOPICS: TopicMetadata[] = [
  // ── Matematika ──
  ...SCITANIAODCITANIDO100,
  ...CISELNAOSADO100,
  ...CTENIZAPISPOROVNAVANICISELDO100,
  ...NASOBENIJAKO_OPAKOVANE_SCITANI,
  ...NASOBILKA2345,
  ...VZTAHNASOBENIADELENI,
  ...SLOVNIULOHYDO100,
  ...JEDNOTKYDLKYHMOTNOSTIOBJEMU,
  ...MERENICASU,
  ...POSLOUPNOSTICISEL,
  ...TABULKYAJEDNODUCHASHEMA,
  ...BODPRIMKAUSECKA,
  ...MERIENIDELIVKYUSECKY,
  // ── Prvouka ──
  ...HODINYKALENDARCAS,
  ...TRADICEAZVYKY,
  ...LIDEVOKOLIKAMARADSTVI,
  ...POVOLANIPRACEDOSPELYCH,
  ...PRAVIDLASLUSNEHOCHOVANI,
  ...NASEOBECNAZEV,
  ...ORIENTACEVOBCI,
  ...PLANOBCEOKOLISKOLY,
  ...DOMACIHOSPODARSKAZVIRATA,
  ...KVETOUCIROSTLINYMLADATA,
  ...ZMENYVPRIRODEJAROLETO,
  ...ZAZIMOVANIZVIRAT,
  ...ZMENYVPRIRODEPODZIMZIMA,
  ...DROBNAPORANENITISNOVELINKY,
  ...ZDRAVYZIVOTNISTYL,
];
