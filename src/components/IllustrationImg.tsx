import { useState } from "react";

interface Props {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  threshold?: number;
}

/**
 * Wrapper pro ilustrace — všechny obrázky jsou průhledné PNG.
 * Lokální subject assety i dynamické storage URL (AI-generované) mají transparentní pozadí.
 * Edge function dewhiteBackground() zajišťuje transparentnost pro storage obrázky.
 * Při chybě načtení (404) zobrazí fallback.
 */
export function IllustrationImg({ src, alt = "", className, fallback }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback ?? null}</>;
  return (
    <img
      src={src}
      alt={alt}
      className={`mix-blend-multiply ${className ?? ""}`}
      onError={() => setFailed(true)}
    />
  );
}
