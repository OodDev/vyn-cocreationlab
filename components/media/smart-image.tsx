import type { JSX } from "react";

/**
 * A server-rendered responsive <picture> for pre-optimized assets.
 *
 * Static exports cannot use next/image's on-demand optimizer, so sources are
 * generated at build time (scripts/generate-assets.mjs). Rendering as a plain
 * <picture> keeps the component usable in Server Components and fully
 * crawlable. Width/height attributes are always set (no CLS).
 */
export interface SmartImageSource {
  srcSet: string;
  type: string;
}

export interface SmartImageProps {
  sources: Array<SmartImageSource>;
  fallback: { src: string; width: number; height: number };
  alt: string;
  className?: string;
  sizes?: string;
  /** Marks the LCP candidate: eager + high priority + sync decode. */
  priority?: boolean;
}

export function SmartImage(props: SmartImageProps): JSX.Element {
  const { sources, fallback, alt, className, sizes, priority = false } = props;

  return (
    <picture>
      {sources.map(function (source): JSX.Element {
        return (
          <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
        );
      })}
      <img
        src={fallback.src}
        width={fallback.width}
        height={fallback.height}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
      />
    </picture>
  );
}
