/**
 * Inline, synchronous flag scripts.
 *
 * Both run BEFORE first paint so the CSS below never flashes wrong states:
 *
 * - `data-motion="on"` → arms the scroll-reveal system. Elements are visible
 *   in static HTML; the attribute only *enables* hiding for entrance anims
 *   (always rendered server-side, so crawlers and no-JS users see content).
 * - `data-splash="on"` → shows the splashscreen overlay whenever JS is on
 *   and the user has no reduced-motion preference (un-gated: shows on every
 *   full page load/reload, not just first visit).
 */
export const MOTION_FLAG_ATTR = "data-motion";
export const SPLASH_FLAG_ATTR = "data-splash";
export const SPLASH_STORE_KEY = "vyn.splash.done";

export const bootFlagsScript: string = `(function(){try{var d=document.documentElement;var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!rm){d.setAttribute("data-motion","on")}if(!rm){d.setAttribute("data-splash","on")}}catch(e){}})();`;
