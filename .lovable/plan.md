# Fix deployed Early Bird campaign image

## Scope
Keep the seasonal homepage and all unrelated sections unchanged. Use only the supplied `earlybird2.jpg` artwork at every breakpoint. Retain the current CTA timing: no CTA before 4 September; the existing purchase CTA appears from 4–20 September.

## Confirmed diagnosis
- The current production `__l5e/assets-v1` URL responds with `content-type: text/html`, not a JPEG, so the browser reports zero natural dimensions.
- The supplied `earlybird2.jpg` is the required 1350×1688 portrait artwork containing the Bjorli logo, EARLY BIRD text, dates, guests, and staff.

## Files to change
- Add the supplied image under the established repository image structure in `src/assets/photos/` so Vite imports, fingerprints, and emits it with the production build.
- `src/lib/cms/campaigns.ts`
  - Replace the CDN pointer import with a normal repository image import.
  - Use that one image for both image slots so all breakpoints resolve to the same emitted asset.
  - Update localized image alt text to describe the embedded campaign artwork; Norwegian will be exactly: “Early Bird på Bjorli 4.–20. september, med skigjester og ansatte i bakken.”
  - Add a localized online-only statement, with the required Norwegian wording.
  - Preserve the existing verified Skiperformance purchase URL and campaign schedule.
- `src/components/HomepageCampaign.tsx`
  - Render the complete portrait at its natural 4:5 ratio without `object-cover` cropping or distortion.
  - Use a restrained season-token background behind the contained image on wider layouts.
  - Remove the duplicate HTML EARLY BIRD badge and standalone date line because both are embedded in the artwork.
  - Render the highlighted online-only statement and preserve the heading, body, supporting line, and current CTA behavior.
- `src/lib/cms/campaigns.test.ts`
  - Update/add focused assertions for image data, content, scheduling, and CTA timing if existing tests cover these fields.
- Remove obsolete Early Bird pointer files only if they become unreferenced; exact deletion paths will be shown for approval before deletion, otherwise they will be left untouched.

## Verification
1. Run the focused campaign tests, TypeScript check, and production build.
2. Confirm the built campaign image is emitted as a Vite-hashed image asset and is not a `__l5e/assets-v1` URL.
3. Test the built/local production rendering at 1280, 834, and 390 px:
   - image visibly loaded;
   - `naturalWidth` and `naturalHeight` greater than zero;
   - logo, campaign wording, dates, and winter scene visible;
   - no distortion or duplicate EARLY BIRD/date text;
   - online-only statement visible;
   - current CTA timing/destination unchanged;
   - Sommer remains in navigation;
   - no unrelated homepage changes.
4. Deployment is a separate explicit action. After deployment, repeat the same browser checks against `https://bjorli.no/` and verify the final hashed production asset returns image content with non-zero natural dimensions.

## Risks and assumptions
- The repository-hosted binary is intentional here: Cloudflare Pages must receive the image through Vite’s normal asset pipeline rather than Lovable’s unavailable production CDN route.
- Production verification cannot be completed until the change is deployed; a successful local build will not be reported as production proof.
- No routing, SEO, navigation, analytics, backend, campaign dates, or other homepage content will change.
