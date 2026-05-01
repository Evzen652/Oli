/**
 * JSON salvage helper — extrahuje JSON object/array z AI textových odpovědí.
 *
 * AI gateways občas vrátí JSON obalený markdown ```json blokem nebo
 * s trailing/leading textem. Tento helper:
 *   1) Strip markdown fences (```json ... ```)
 *   2) Najde první { nebo [
 *   3) Najde poslední odpovídající } nebo ]
 *   4) Pokusí se JSON.parse
 *   5) Pokud selže, ořízne trailing commas + control chars a zkusí znovu
 *
 * Používané v exercise-validator (fallback parsing).
 */

export function extractJsonFromResponse(response: string): unknown {
  let cleaned = response
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const jsonStart = cleaned.search(/[\{\[]/);
  const isArray = jsonStart !== -1 && cleaned[jsonStart] === "[";
  const jsonEnd = cleaned.lastIndexOf(isArray ? "]" : "}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("No JSON object found in response");
  }

  cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

  try {
    return JSON.parse(cleaned);
  } catch {
    cleaned = cleaned
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/[\x00-\x1F\x7F]/g, "");
    return JSON.parse(cleaned);
  }
}
