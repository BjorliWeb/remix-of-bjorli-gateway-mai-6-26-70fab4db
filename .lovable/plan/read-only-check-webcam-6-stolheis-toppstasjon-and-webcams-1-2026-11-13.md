# Read-only check: Webcam 6 (Stolheis toppstasjon) and webcams 1–5

Nothing is changed, deployed or published. All work is reading and measuring.

## 1. Trace the chain
- Read `webcam6-refresh` (camera fetch, left-lens approval, storage write, state row) and `webcam6-image` (what it serves, headers).
- Read the pg_cron schedule and the `webcam6_state` row (last attempt, last approved frame, timestamps, errors) with read-only queries.
- List the `webcam6` storage bucket objects and their timestamps.
- Read backend logs for both functions (boots only so far – look for errors and real refresh runs).
- Read the webcam page code: how `v` is built, refresh interval, timestamp shown, fallback when loading fails.
- Note dev vs production differences (same backend; prerendered `v` vs live value).

## 2. Freshness measurement (at least 5 minutes, ~every 60 s)
- Fetch the endpoint with the live `v`, the same URL again, and a unique `v`.
- Record time, status, response time, headers (Cache-Control, ETag, Last-Modified, CDN headers), size, SHA-256.
- Compare against `webcam6_state` timestamps and storage object times to decide if new frames are actually produced.
- Check whether the camera source is reachable from the backend (via logs/state only; no direct calls that change anything).
- Load the live page in a browser (desktop 1280, mobile 390) and check which `v` and image are shown and whether it updates.
- If image age cannot be determined, say so.

## 3. Failure handling
- From code: behaviour when the camera is down, refresh fails, frame is rejected, endpoint times out, browser/CDN caches, image fails to load.
- In the browser: block the image request and confirm what the visitor sees (no stale image presented as live).

## 4. Webcams 1–5
- Identify each source, check it loads, its refresh mechanism and whether it shows a timestamp. No changes.

## 5. Report
- The requested table (source, function, update, caching, display, webcams 1–5), test times, observed interval, evidence, limits, root cause if any (where, why, permanent/periodic/unproven), and prioritised fix proposals (auto-refresh interval, last-success time, stale warning, cache-safe URL).
- Fixes only after your approval.
