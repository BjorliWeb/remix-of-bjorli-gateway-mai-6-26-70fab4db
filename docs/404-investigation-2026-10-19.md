# 404 investigation — 19 October 2026

## Evidence and limits
User-supplied Cloudflare Requests screenshot, filter status 404, last 30 days: approximately 92,570 requests. The nine visible path rows account for approximately 7,970 requests (8.6%). The other 91.4% is not allocated to paths in the supplied evidence. These are requests, not unique broken URLs or affected visitors. Ahrefs separately reported 56 historical 404 URLs; that URL export has not been supplied.

Direct checks from the agent environment returned HTTP 403 even for known live pages, so no present-day production status is certified here. Source reviewed at commit 0be15375f5fa401137430046a4a7ea72cf244d79.

## Measurement break
Commit 27acfb1f68477ec4d61d251160b9808fce8c75b2 (1 October 2026, 19:35 UTC) changes the routing contract from unmatched routes loading index.html with 200 to dist/404.html returning a genuine 404. This is consistent with the screenshot's rise around 1 October, but deployment timing must be confirmed. Do not infer that all errors were newly introduced then. Do not restore the global SPA fallback to hide them.

## Prioritized known paths
| Path | Requests shown | Assessment / action |
| --- | ---: | --- |
| /nb/heiskort | 515 | No redirect in main. Canonical Norwegian ticket route is /heiskort/. Add both trailing slash variants. |
| /webcam/bjorli.jpg | 703 | Historical image endpoint. Identify camera and referring sites before choosing a valid image replacement; do not redirect image consumers to HTML. |
| /favicon.ico | 991 | Existing asset is public/favicon.jpeg. Redirect conventional lookup to existing correctly typed asset. |
| /apple-touch-icon.png | 625 | Existing asset is public/apple-touch-icon.jpeg. Redirect lookup. |
| /apple-touch-icon-precomposed.png | 619 | Same existing icon asset. Redirect lookup. |
| /.well-known/passkey-endpoints | ~1,850 | Automated lookup suspected; confirm caller and whether the feature is intended. |
| /.well-known/acme-challenge/motd | ~1,650 | Screenshot also shows domeneshop-acme/2.6.2 at similar volume. Potential certificate checking; correlation is not proof. Check registrar/renewal configuration before changing it. |
| /.env | 624 | Probe for configuration. Preserve non-disclosure; do not create a public file. |
| /userfiles | 393 | Unclassified. Need full path, referrer and caller context. |

## Completing the inventory
Export the complete Cloudflare 404 path breakdown for the same time range, retaining hostname, request count, first/last seen and referrer where available. Use status-filtered logs or an available analytics dataset; verify plan limits, sampling and truncation. Paginate all results and reconcile counts with the same-period total. Keep any raw IPs and user agents outside the board dashboard.

Export Ahrefs' 56 URLs with link source / last crawled date, and Search Console's missing-page list. Normalize scheme/host and retain meaningful query parameters. Separate actual content, missing assets, legacy links, automated discovery, security probes and unknowns. Check each URL's current response and redirect chain, relevant live replacement, internal links, sitemap presence and external referrers. Prioritize ticket, travel, accommodation and foreign-language pages by affected human traffic, Google clicks and external links, not raw requests alone.

## Review before publishing this patch
Confirm /heiskort/ responds 200 and both JPEG assets respond with an image Content-Type in the Cloudflare preview. Confirm all five source URLs return one 301 to the intended destination. Confirm a random nonexistent path still returns 404, and .env stays unavailable. Check browser favicon and home-screen icon behavior. This draft does not claim fixes are deployed.

## Follow-up
Compare 7 and 30 days after deployment using stable response definitions. Track known affected URLs and verified visitor impact separately from automated probes. Record deployment date beside the dashboard timeline.
