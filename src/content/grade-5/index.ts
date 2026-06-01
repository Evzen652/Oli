import type { TopicMetadata } from "@/lib/types";

// ── Matematika ──
import { ARITMETICKYPRUMERVYPOCET } from "./matematika/aritmetickyPrumerVypocet";
import { CISLANADMILIONMILIARDY } from "./matematika/cislaNadMilionMiliardy";
import { DESETINNACISLACTENIZAPISPOROVNAVANI } from "./matematika/desetinnaCislaCteniZapisPorovnavani";
import { DIAGRAMYGRAFYCTENIASESTAVOVANITABULEK } from "./matematika/diagramyGrafyCteniASestavovaniTabulek";
import { KONSTRUKCETROJUHELNIKUKOLMICEROVNOBEZKY } from "./matematika/konstrukceTrojuhelnikuKolmiceRovnobezky";
import { NASOBENIADELENIDESETINNYCHCISEL101001000 } from "./matematika/nasobeniADeleniDesetinnychCisel101001000";
import { OBSAHOBRAZCEVECTVERCOVESITIJEDNOTKYOBSAHU } from "./matematika/obsahObrazceVeCtvercoveSitiJednotkyObsahu";
import { OSOVASOUMERNOSTSESTROJENIOBRAZUURCENIOSY } from "./matematika/osovaSoumernostSestrojeniObrazuUrceniOsy";
import { PISEMNEDELENIDVOUCIFERNYMDELITELEM } from "./matematika/pisemneDeleniDvoucifernymDelitelem";
import { SCITANIAODCITANIDESETINNYCHCISEL } from "./matematika/scitaniAOdcitaniDesetinnychCisel";
import { ULOHYNEZAVISLENABEZNYCHPOSTUPECHPROSTOROVAPREDSTAVIVOST } from "./matematika/ulohyNezavisleNaBeznychPostupechProstorovaPredstavivost";
import { ZAPORNACISLANACISELNEOSE } from "./matematika/zapornaCislaNaCiselneOse";

// ── Český jazyk ──
import { BASENLYRICKAAEPICKAROMANPOVIDKA } from "./cjl/basenLyrickaAEpickaRomanPovidka";
import { CISLOVKYDRUHYZAKLADNIRADOVEDRUHOVENASOBNE } from "./cjl/cislovkyDruhyZakladniRadoveDruhoveNasobne";
import { DOPISUREDNIZADOSTTISKOPISYPRIHLASKADOTAZNIK } from "./cjl/dopisUredniZadostTiskopisyPrihlaskaDotaznik";
import { ELEMENTARNILITERARNIPOJMYPRIROZBORUTEXTU } from "./cjl/elementarniLiterarniPojmyPriRozboruTextu";
import { PODMETVYJADRENYNEVYJADRENYNEKOLIKANASOBNY } from "./cjl/podmetVyjadrenyNevyjadrenyNekolikanasobny";
import { POPISSUBJEKTIVNEZABARVENYPOPISPRACOVNIHOPOSTUPU } from "./cjl/popisSubjektivneZabarvenyPopisPracovnihoPostupu";
import { POSUZOVANIUPLNOSTISDELENI } from "./cjl/posuzovaniUplnostiSdeleni";
import { PRIDAVNAJMENADRUHYTVRDAMEKKAPRIVLASTNOVACISKLONOVANI } from "./cjl/pridavnaJmenaDruhyTvrdaMekkaPrivlastnovaciSklonovani";
import { PRIMAANEPRIMARECUVOD } from "./cjl/primaANeprimaRecUvod";
import { REPRODUKCEPRIMERENESLOZITEHOSDELENI } from "./cjl/reprodukcePrimereneSlozitehoSdeleni";
import { SHODAPRISUDKUSPODMETEM } from "./cjl/shodaPrisudkuSPodmetem";
import { SLOVAJEDNOZNACNAMNOHOZNACNAVICEVYZNAMOVA } from "./cjl/slovaJednoznacnaMnohoznacnaVicevyznamova";
import { SLOVASPISOVNAANESPISOVNA } from "./cjl/slovaSpisovnaANespisovna";
import { SLOVESAZPUSOBOZNAMOVACIROZKAZOVACIPODMINOVACI } from "./cjl/slovesaZpusobOznamovaciRozkazovaciPodminovaci";
import { SLOVNIDRUHYURCOVANIVSECHDESETIOHEBNEANEOHEBNE } from "./cjl/slovniDruhyUrcovaniVsechDesetiOhebneANeohebne";
import { SOUVETIVZORCEPOCETVET } from "./cjl/souvetiVzorcePocetVet";
import { STUDIJNICTENIAVECNECTENI } from "./cjl/studijniCteniAVecneCteni";
import { TELEFONICKYROZHOVORZANECHANIVZKAZU } from "./cjl/telefonickyRozhovorZanechaniVzkazu";
import { UMELECKEANEUMELECKETEXTY } from "./cjl/umeleckeANeumeleckeTexty";
import { VLASTNILITERARNITEXTNADANETEMA } from "./cjl/vlastniLiterarniTextNaDaneTema";
import { VYPRAVOVANISROZVINUTOUOSNOVOU } from "./cjl/vypravovaniSRozvinutouOsnovou";
import { ZAJMENASKLONOVANIOSOBNICHZAJMEN } from "./cjl/zajmenaSklonovaniOsobnichZajmen";

// ── Vlastivěda ──
import { DRUHASVETOVAVALKAOKUPACEOSVOBOZENI } from "./vlastiveda/druhaSvetovaValkaOkupaceOsvobozeni";
import { EVROPAPOLOHAPOVRCHVODSTVOPODNEBI } from "./vlastiveda/evropaPolohaPovrchVodstvoPodnebi";
import { EVROPSKESTATYAEUSOUSEDNIZEMECRPODROBNE } from "./vlastiveda/evropskeStatyAEuSousedniZemeCrPodrobne";
import { GLOBUSSVETOVESTRANYNAMAPECASOVAPASMAUVOD } from "./vlastiveda/globusSvetoveStranyNaMapeCasovaPasmaUvod";
import { HABSBURKOVEDOBAPOBELOHORSKABAROKO } from "./vlastiveda/habsburkoveDobaPobelohorskaBaroko";
import { KOMUNISTICKYREZIMSAMETOVAREVOLUCE1989 } from "./vlastiveda/komunistickyRezimSametovaRevoluce1989";
import { MARIETEREZIEJOSEFIIREFORMY } from "./vlastiveda/marieTerezieJosefIiReformy";
import { NARODNIOBROZENIJUNGMANNPALACKYHAVLICEK } from "./vlastiveda/narodniObrozeniJungmannPalackyHavlicek";
import { PRUMYSLOVAREVOLUCEVEDECKYATECHNICKYPOKROK } from "./vlastiveda/prumyslovaRevoluceVedeckyATechnickyPokrok";
import { PRVNISVETOVAVALKAAVZNIKCESKOSLOVENSKA1918 } from "./vlastiveda/prvniSvetovaValkaAVznikCeskoslovenska1918";
import { SVETADILYAOCEANYZEMEPREHLED } from "./vlastiveda/svetadilyAOceanyZemePrehled";
import { VOLBYZASTUPITELSKEORGANYCRPREZIDENTVLADA } from "./vlastiveda/volbyZastupitelskeOrganyCrPrezidentVlada";
import { VZNIKCR1993CRVEUANATO } from "./vlastiveda/vznikCr1993CrVEuANato";

// ── Přírodověda ──
import { BEZOBRATLIHMYZPAVOUCIMEKKYSICERVI } from "./prirodoveda/bezobratliHmyzPavouciMekkysiCervi";
import { ETAPYLIDSKEHOZIVOTADOSPIVANI } from "./prirodoveda/etapyLidskehoZivotaDospivani";
import { HORNINYANEROSTYDRUHYVLASTNOSTIVZNIK } from "./prirodoveda/horninyANerostyDruhyVlastnostiVznik";
import { KOSTRAASVALYDYCHACIAOBEHOVASOUSTAVA } from "./prirodoveda/kostraASvalyDychaciAObehovaSoustava";
import { MAGNETYELEKTRINAJEDNODUCHEOBVODYUVOD } from "./prirodoveda/magnetyElektrinaJednoducheObvodyUvod";
import { NAVYKOVELATKYALKOHOLNIKOTINDROGY } from "./prirodoveda/navykoveLatkyAlkoholNikotinDrogy";
import { NERVOVASOUSTAVASMYSLY } from "./prirodoveda/nervovaSoustavaSmysly";
import { OBNOVITELNEANEOBNOVITELNEZDROJEENERGIE } from "./prirodoveda/obnovitelneANeobnovitelneZdrojeEnergie";
import { OBRATLOVCISAVCIPTACIPLAZIOBOJZIVELNICIRYBY } from "./prirodoveda/obratlovciSavciPtaciPlaziObojzivelniciRyby";
import { OCHRANAPRIRODYNARODNIPARKYCHKOVCR } from "./prirodoveda/ochranaPrirodyNarodniParkyChkoVCr";
import { POTRAVNIRETEZECVZTAHYVEKOSYSTEMU } from "./prirodoveda/potravniRetezecVztahyVEkosystemu";
import { RISEROSTLINHUBZIVOCICHU } from "./prirodoveda/riseRostlinHubZivocichu";
import { ROZMNOZOVACISOUSTAVAVYVOJCLOVEKAUVOD } from "./prirodoveda/rozmnozovaciSoustavaVyvojClovekaUvod";
import { TRAVICISOUSTAVAVYLUCOVACISOUSTAVA } from "./prirodoveda/traviciSoustavaVylucovaciSoustava";
import { VESMIRSLUNECNISOUSTAVAPLANETYSLUNCEMESIC } from "./prirodoveda/vesmirSlunecniSoustavaPlanetySlunceMesic";
import { ZEMEJAKOPLANETATVARROTACEOBEHSTRIDANIDNEANOCI } from "./prirodoveda/zemeJakoPlanetaTvarRotaceObehStridaniDneANoci";

// Informatika — skryta, soubory existuji, az bude pripravena zverejnit odkomentovat

export const GRADE_5_TOPICS: TopicMetadata[] = [
  // Matematika (12)
  ...ARITMETICKYPRUMERVYPOCET,
  ...CISLANADMILIONMILIARDY,
  ...DESETINNACISLACTENIZAPISPOROVNAVANI,
  ...DIAGRAMYGRAFYCTENIASESTAVOVANITABULEK,
  ...KONSTRUKCETROJUHELNIKUKOLMICEROVNOBEZKY,
  ...NASOBENIADELENIDESETINNYCHCISEL101001000,
  ...OBSAHOBRAZCEVECTVERCOVESITIJEDNOTKYOBSAHU,
  ...OSOVASOUMERNOSTSESTROJENIOBRAZUURCENIOSY,
  ...PISEMNEDELENIDVOUCIFERNYMDELITELEM,
  ...SCITANIAODCITANIDESETINNYCHCISEL,
  ...ULOHYNEZAVISLENABEZNYCHPOSTUPECHPROSTOROVAPREDSTAVIVOST,
  ...ZAPORNACISLANACISELNEOSE,

  // Český jazyk (22)
  ...BASENLYRICKAAEPICKAROMANPOVIDKA,
  ...CISLOVKYDRUHYZAKLADNIRADOVEDRUHOVENASOBNE,
  ...DOPISUREDNIZADOSTTISKOPISYPRIHLASKADOTAZNIK,
  ...ELEMENTARNILITERARNIPOJMYPRIROZBORUTEXTU,
  ...PODMETVYJADRENYNEVYJADRENYNEKOLIKANASOBNY,
  ...POPISSUBJEKTIVNEZABARVENYPOPISPRACOVNIHOPOSTUPU,
  ...POSUZOVANIUPLNOSTISDELENI,
  ...PRIDAVNAJMENADRUHYTVRDAMEKKAPRIVLASTNOVACISKLONOVANI,
  ...PRIMAANEPRIMARECUVOD,
  ...REPRODUKCEPRIMERENESLOZITEHOSDELENI,
  ...SHODAPRISUDKUSPODMETEM,
  ...SLOVAJEDNOZNACNAMNOHOZNACNAVICEVYZNAMOVA,
  ...SLOVASPISOVNAANESPISOVNA,
  ...SLOVESAZPUSOBOZNAMOVACIROZKAZOVACIPODMINOVACI,
  ...SLOVNIDRUHYURCOVANIVSECHDESETIOHEBNEANEOHEBNE,
  ...SOUVETIVZORCEPOCETVET,
  ...STUDIJNICTENIAVECNECTENI,
  ...TELEFONICKYROZHOVORZANECHANIVZKAZU,
  ...UMELECKEANEUMELECKETEXTY,
  ...VLASTNILITERARNITEXTNADANETEMA,
  ...VYPRAVOVANISROZVINUTOUOSNOVOU,
  ...ZAJMENASKLONOVANIOSOBNICHZAJMEN,

  // Vlastivěda (13)
  ...DRUHASVETOVAVALKAOKUPACEOSVOBOZENI,
  ...EVROPAPOLOHAPOVRCHVODSTVOPODNEBI,
  ...EVROPSKESTATYAEUSOUSEDNIZEMECRPODROBNE,
  ...GLOBUSSVETOVESTRANYNAMAPECASOVAPASMAUVOD,
  ...HABSBURKOVEDOBAPOBELOHORSKABAROKO,
  ...KOMUNISTICKYREZIMSAMETOVAREVOLUCE1989,
  ...MARIETEREZIEJOSEFIIREFORMY,
  ...NARODNIOBROZENIJUNGMANNPALACKYHAVLICEK,
  ...PRUMYSLOVAREVOLUCEVEDECKYATECHNICKYPOKROK,
  ...PRVNISVETOVAVALKAAVZNIKCESKOSLOVENSKA1918,
  ...SVETADILYAOCEANYZEMEPREHLED,
  ...VOLBYZASTUPITELSKEORGANYCRPREZIDENTVLADA,
  ...VZNIKCR1993CRVEUANATO,

  // Přírodověda (16)
  ...BEZOBRATLIHMYZPAVOUCIMEKKYSICERVI,
  ...ETAPYLIDSKEHOZIVOTADOSPIVANI,
  ...HORNINYANEROSTYDRUHYVLASTNOSTIVZNIK,
  ...KOSTRAASVALYDYCHACIAOBEHOVASOUSTAVA,
  ...MAGNETYELEKTRINAJEDNODUCHEOBVODYUVOD,
  ...NAVYKOVELATKYALKOHOLNIKOTINDROGY,
  ...NERVOVASOUSTAVASMYSLY,
  ...OBNOVITELNEANEOBNOVITELNEZDROJEENERGIE,
  ...OBRATLOVCISAVCIPTACIPLAZIOBOJZIVELNICIRYBY,
  ...OCHRANAPRIRODYNARODNIPARKYCHKOVCR,
  ...POTRAVNIRETEZECVZTAHYVEKOSYSTEMU,
  ...RISEROSTLINHUBZIVOCICHU,
  ...ROZMNOZOVACISOUSTAVAVYVOJCLOVEKAUVOD,
  ...TRAVICISOUSTAVAVYLUCOVACISOUSTAVA,
  ...VESMIRSLUNECNISOUSTAVAPLANETYSLUNCEMESIC,
  ...ZEMEJAKOPLANETATVARROTACEOBEHSTRIDANIDNEANOCI,

  // Informatika (10) — skryta, odkomentovat az bude pripravena
];
