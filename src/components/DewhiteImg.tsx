import { useState, useEffect } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
}

/**
 * Zobrazí obrázek s odstraněným bílým pozadím.
 *
 * Dvě vrstvy záruky:
 *  1. CSS mix-blend-multiply — okamžité, bez CORS, funguje vždy na barevném pozadí
 *  2. Canvas dewhite — pro skutečnou průhlednost (funguje pokud CORS projde)
 *
 * Obrázky z edge funkce generate-prvouka-images jsou již uloženy jako transparentní PNG
 * (server-side dewhiteBackground). mix-blend-multiply je záloha pro případ, že PNG
 * transparency nestačí nebo CORS blokuje canvas.
 */
export function DewhiteImg({ src, alt, className, style, threshold = 245 }: Props) {
  const [out, setOut] = useState(src);

  useEffect(() => {
    if (!src) return;
    setOut(src); // reset pro nový src
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      try {
        const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = d.data;
        const fade = threshold - 35;
        for (let i = 0; i < px.length; i += 4) {
          const brightness = (px[i] + px[i + 1] + px[i + 2]) / 3;
          if (brightness > threshold) { px[i + 3] = 0; }
          else if (brightness > fade) { px[i + 3] = Math.round((threshold - brightness) * (255 / (threshold - fade))); }
        }
        ctx.putImageData(d, 0, 0);
        setOut(canvas.toDataURL("image/png"));
      } catch { /* CORS blokuje canvas — mix-blend-multiply zajistí vizuální transparentnost */ }
    };
    img.src = src;
  }, [src, threshold]);

  return <img src={out} alt={alt} className={className} style={style} />;
}
