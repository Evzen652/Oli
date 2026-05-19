import { useState } from "react";

interface Props {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  threshold?: number;
}

/**
 * Wrapper pro ilustrace — lokální subject assety jsou již průhledné PNG.
 * Pro dynamické storage URL (topic images) aplikuje mix-blend-multiply.
 * Při chybě načtení (404) zobrazí fallback.
 */
export function IllustrationImg({ src, alt = "", className, fallback }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback ?? null}</>;
  const isStorage = src.includes("supabase") || src.includes("storage");
  return (
    <img
      src={src}
      alt={alt}
      className={`${className ?? ""}${isStorage ? " mix-blend-multiply brightness-[1.1]" : ""}`}
      onError={() => setFailed(true)}
    />
  );
}
