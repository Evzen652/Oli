import { useState, useEffect } from "react";

const LS_KEY = "oli-image-versions";
const EVENT = "oli-image-versions-changed";

// In-memory blob URL cache — bypasses CDN entirely, lasts for current session.
const BLOB_CACHE: Record<string, string> = {};

function readVersions(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); }
  catch { return {}; }
}

/** Persist timestamp to localStorage (cross-session cache-bust via ?t=...). */
export function bumpImageVersion(key: string): void {
  const versions = readVersions();
  versions[key] = Date.now();
  localStorage.setItem(LS_KEY, JSON.stringify(versions));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Fetch a fresh copy of the image directly from origin, bypassing CDN cache.
 * Stores result as a blob URL. Components using useImageVersions() will
 * automatically switch to the blob URL on the next render.
 */
export async function fetchFreshBlob(key: string, storageUrl: string): Promise<void> {
  try {
    // Unique timestamp query param forces CDN cache miss (each request is a new URL)
    const sep = storageUrl.includes("?") ? "&" : "?";
    const bustUrl = `${storageUrl}${sep}_t=${Date.now()}`;
    const resp = await fetch(bustUrl, { cache: "no-store" });
    if (!resp.ok) return;
    const old = BLOB_CACHE[key];
    if (old) URL.revokeObjectURL(old);
    BLOB_CACHE[key] = URL.createObjectURL(await resp.blob());
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // fallback: ?t=timestamp from bumpImageVersion is still applied
  }
}

/**
 * Hook — returns a function that resolves the best available URL for a key:
 * 1. In-memory blob URL (freshly fetched, CDN-bypassing) — if available
 * 2. Storage URL + ?t=timestamp from localStorage — if regenerated this session or before
 * 3. Original URL
 */
export function useImageVersions(): (url: string, key: string) => string {
  const [versions, setVersions] = useState<Record<string, number>>(readVersions);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => {
      setVersions(readVersions());
      setTick((n) => n + 1); // force re-render so BLOB_CACHE changes are picked up
    };
    window.addEventListener(EVENT, handler);
    // Also handle cross-tab updates: storage event fires in OTHER tabs when localStorage changes
    const storageHandler = (e: StorageEvent) => { if (e.key === LS_KEY) handler(); };
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return (url: string, key: string) => {
    if (BLOB_CACHE[key]) return BLOB_CACHE[key];
    const v = versions[key];
    return v ? `${url}?t=${v}` : url;
  };
}
