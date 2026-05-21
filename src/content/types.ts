/**
 * Sdílené identifikátory mezi grade-N moduly a curriculum API.
 *
 * Pozn.: `TopicMetadata`, `PracticeTask`, `HelpData`, `InputType` atd.
 * jsou definovány v `src/lib/types.ts` (existující domain typy).
 * Grade-N session si je odtud importuje.
 *
 * Zde žije pouze formalismus RVP NodeId — most mezi RVP datasetem
 * (`data/rvp_data.json`) a internímim `TopicMetadata.id`.
 *
 * ZMRAZENO. Edituje pouze architekt session.
 */

/**
 * Stabilní ID uzlu kurikula z RVP datasetu — nikdy se nemění po vytvoření.
 *
 * Formát: `g{ročník}-{předmět}-{okruh}-{téma}-{podtéma}`
 *
 * Příklad: `g4-matematika-cislo-a-pocetni-operace-zlomky-zlomek-jako-cast-celku-znazorneni-zlomku`
 *
 * Všechny části jsou kebab-case slugy bez diakritiky.
 *
 * Použij `TopicMetadata.rvpNodeId` pro link mezi internímim topicem a RVP uzlem.
 */
export type NodeId = string;

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
