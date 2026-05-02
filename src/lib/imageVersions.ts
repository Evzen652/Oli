import { useState, useEffect } from "react";

const LS_KEY = "oli-image-versions";
const EVENT = "oli-image-versions-changed";

function readVersions(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); }
  catch { return {}; }
}

/** Call after successful regeneration — persists across component remounts. */
export function bumpImageVersion(key: string): void {
  const versions = readVersions();
  versions[key] = Date.now();
  localStorage.setItem(LS_KEY, JSON.stringify(versions));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * React hook — returns a function that appends ?t=timestamp to storage URLs
 * when the key has been regenerated. Subscribes to bumps globally.
 */
export function useImageVersions(): (url: string, key: string) => string {
  const [versions, setVersions] = useState<Record<string, number>>(readVersions);

  useEffect(() => {
    const handler = () => setVersions(readVersions());
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  return (url: string, key: string) => {
    const v = versions[key];
    return v ? `${url}?t=${v}` : url;
  };
}
