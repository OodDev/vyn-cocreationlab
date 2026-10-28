/**
 * Copy any value here into `.env.local` / your host's dashboard when you wire
 * up the corresponding service. Nothing here is required to build or deploy
 * the site — every feature is disabled by default.
 *
 * @type {Record<string, string>}
 */
const envExample = {
  // Reserved for future analytics (Plausible/Umami/Cloudflare) — currently unused.
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "",
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: "",
  NEXT_PUBLIC_UMAMI_SRC: "",
  CLOUDFLARE_BEACON_TOKEN: "",
};

console.log(
  Object.entries(envExample)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n"),
);
