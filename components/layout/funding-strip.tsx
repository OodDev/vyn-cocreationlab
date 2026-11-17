import type { JSX } from "react";

/**
 * Funding strip: mandatory EU/PR MARCHE FSE+ attribution, rendered as a white
 * band below the site footer (logos extracted from the official project
 * targa PDF). Logos share a row; the disclaimer sits centered underneath on
 * its own line and collapses to normal wrapping on narrow screens.
 */

const LOGOS: Array<{ src: string; alt: string; width: number; height: number }> = [
  { src: "/logos-fse/coesione-italia-marche.png", alt: "Coesione Italia 21-27 Marche", width: 307, height: 117 },
  { src: "/logos-fse/cofinanziato-ue.png", alt: "Cofinanziato dall'Unione europea", width: 547, height: 113 },
  { src: "/logos-fse/repubblica-italiana.png", alt: "Repubblica Italiana", width: 97, height: 113 },
  { src: "/logos-fse/regione-marche.png", alt: "Regione Marche", width: 328, height: 117 },
];

export function FundingStrip(): JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 bg-white px-6 pt-4 pb-3">
      {LOGOS.map(function (logo, i): JSX.Element {
        return (
          <div key={logo.src} className="flex items-center gap-6">
            {i > 0 ? <span className="hidden h-[30px] w-px bg-[#d5dbe6] sm:block" aria-hidden="true" /> : null}
            <img
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              loading="lazy"
              decoding="async"
              className="h-10 w-auto"
            />
          </div>
        );
      })}
      <p className="w-full text-center text-[11px] leading-snug whitespace-nowrap text-[#44506b] max-sm:whitespace-normal">
        Intervento realizzato con il contributo dell&apos;Unione Europea — Avviso
        &ldquo;Sostegno alla creazione d&apos;impresa&rdquo; DDS 338/SIP/2024
      </p>
    </div>
  );
}
