import { ChevronDown } from "lucide-react";
import type { JSX } from "react";
import type { FaqItem } from "@/content/faq";
import { cn } from "@/lib/utils";

/**
 * FAQ rendered with native <details>/<summary>.
 *
 * Every <details> starts OPEN (the `open` attribute), so every answer is
 * present in the server HTML and visible without any interaction — content
 * is never gated behind JS (AIO requirement) and the accordion collapses or
 * expands natively with zero client-side JavaScript.
 */
export function FaqList(props: { items: Array<FaqItem> }): JSX.Element {
  const { items } = props;

  return (
    <div className="divide-line/70 divide-y">
      {items.map(function (item, index): JSX.Element {
        return (
          <details key={index} open className="group-details group flex flex-col py-1">
            <summary
              className={cn(
                "group/summary flex w-full cursor-pointer list-none items-center justify-between gap-6 rounded-lg px-2 py-4 text-left",
                "hover:text-accent transition-colors [&::-webkit-details-marker]:hidden",
              )}
            >
              <h3 className="font-display text-ink text-lg font-semibold sm:text-xl">
                {item.question}
              </h3>
              <span
                aria-hidden="true"
                className="border-line text-accent flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-open:rotate-180"
              >
                <ChevronDown size={16} />
              </span>
            </summary>
            {/* min-h guard keeps the layout shift-free; content is static. */}
            <div className="text-muted px-2 pb-5">{item.answer}</div>
          </details>
        );
      })}
    </div>
  );
}
