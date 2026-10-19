# Legacy URL redirects

This draft preserves existing links and adds precise HTTP 301 redirects from legacy ticket and browser icon addresses to their existing counterparts. The website's existing unknown-route 404 behavior remains unchanged.

| Old URL | Existing target |
| --- | --- |
| /nb/heiskort | /heiskort/ |
| /nb/heiskort/ | /heiskort/ |
| /favicon.ico | /favicon.jpeg |
| /apple-touch-icon.png | /apple-touch-icon.jpeg |
| /apple-touch-icon-precomposed.png | /apple-touch-icon.jpeg |

Before merge, verify each target responds successfully and each redirect is a single hop. Verify image Content-Type and browser icon rendering. Live HTTP validation from the agent environment was blocked with 403 even for known routes; this draft is not production verification.

The historical /webcam/bjorli.jpg URL needs its intended camera and image replacement identified before adding a redirect. Do not redirect image consumers to HTML or unknown content to the homepage. Do not expose configuration files to satisfy probes.

Complete path inventory and visitor-impact analysis remain in the private dashboard workflow.
