# Golf Round Tracker — Project Spec

## Concept
A mobile-friendly website (alternative to apps like 18Birdies) for tracking golf
rounds. Pick a course, start a round, and view each hole one at a time on a
satellite map — camera positioned at the tee, rotated to look down the fairway
toward the green. After each hole, enter scores and the map smoothly flies to
the next tee. Primary motivation: something usable on a computer as well as
mobile, no app download required.

## Stack & constraints
- Single self-contained `index.html` — no build step, no framework, no backend
- Hosted on GitHub Pages from a public repo
- Google Maps JavaScript API, **vector renderer** (required for programmatic
  heading/tilt), satellite view
- Placeholder API key as a clearly-commented constant at the top of the file
- All persistence via localStorage; shared course library via a `courses.json`
  in the repo
- Mobile-first: big touch targets, primary controls in the bottom thumb zone;
  desktop acts as the review/browse experience

## Colour scheme
Golf-themed: deep fairway green primary (~#1e5631), cream/off-white scorecard
tones, flag-red accents. Clean and modern.

## Screens & features (all v1)

### 1. Home
- Course library: courses from `courses.json` + locally-mapped ones (localStorage)
- "Find nearby courses" — OSM import (see below)
- "Map a new course" → Course Editor
- Recent rounds history

### 2. Course Editor
- Pan/search satellite map to locate the course
- Per hole: tap to drop **Tee** pin, tap to drop **Green** pin, optional
  **dogleg midpoint** (camera aims tee→dogleg instead of tee→green), set par
- Hole list sidebar (supports 9 or 18 holes) showing completion progress
- "Camera preview" button per hole — shows exactly what Play Mode will look like
- Save to localStorage + **Export JSON** button (for pasting into `courses.json`)
- Imported OSM courses can be opened in the editor to correct pins
- **Publish to Library** button (admin-only, see below) — commits the course
  directly into the shared `courses.json` on `main` via GitHub's Contents API,
  so it's live for all visitors without a manual PR

### 3. OSM Course Import
- Query the Overpass API for golf features near the user's location or a
  searched area: `golf=tee`, `golf=green`, `golf=hole` ways, par/ref tags
- Convert results into the app's course format; flag as "imported" so users
  know to verify/edit
- Handle patchy data gracefully (missing holes, missing pars)

### 4. Play Mode
- Full-screen satellite; camera at tee, heading = bearing tee→green (or
  tee→dogleg), slight tilt for a flyover feel
- Overlay: hole number, par, tee-to-green distance (yards default,
  metres toggle in settings)
- Big "Hole Complete" button → score entry → animated fly-to next tee
- Mini scorecard accessible mid-round

### 5. Multi-player scoring
- On round start: add 1–4 players by name
- Score entry per hole shows a row per player (defaults to par, +/- taps,
  skippable)
- Scorecard/summary shows players side by side
- Stableford/handicaps are OUT of scope for v1

### 6. Round Summary & sharing
- Classic scorecard grid: front 9 / back 9 / totals, vs-par, per-hole colouring
  (birdie/eagle/par/bogey/double+)
- Rounds saved to localStorage → Recent Rounds
- **Share**: encode the full scorecard (course name, players, scores) compressed
  into the URL hash fragment, so a pasted link opens the exact scorecard with
  no server. Also a clean screenshot-friendly summary view.

## Distance/bearing maths
Haversine for distances, standard forward-bearing formula for camera heading,
from tee/green/dogleg lat-lngs.

## Parked for v2 (do NOT build yet)
- Handicaps/Stableford

## Admin publish (direct-to-main course publishing)
Since the site is static (no backend), "publish for all users" works by
calling GitHub's Contents API directly from the browser with a GitHub
Personal Access Token, gated behind a hidden admin control — not a real
auth system, since there's no server to enforce one. The token itself
*is* the access control: anyone holding it can publish on your behalf, so
treat it like a password.

**One-time setup:**
1. GitHub → Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token
2. Resource owner: your account. Repository access: **only this repo**
   (`WrongHole`)
3. Permissions → Repository permissions → **Contents: Read and write**
   (leave everything else as No access)
4. Set an expiration (GitHub caps fine-grained tokens at 1 year; you'll
   need to regenerate and re-paste when it expires)
5. Copy the token, open the site, click the ⚙ icon next to the units
   toggle on Home, paste it into "Admin — Publish Settings", Save

Once saved, the Course Editor shows a **Publish to Library** button that
reads the current `courses.json`, upserts the course by `id`, and commits
straight to `main`. The token stays in that browser's localStorage only —
if the device is lost or shared, revoke the token on GitHub immediately.

## Google Maps API key — setup (user to do once)
1. console.cloud.google.com → create project (e.g. "golf-tracker")
2. Enable billing (card required; expected usage is well within the 10k free
   monthly map loads for Dynamic Maps — a "map load" is per page load, not per
   camera move)
3. Enable **Maps JavaScript API** only
4. Create API key, then restrict it:
   - Application restriction: HTTP referrers → `https://USERNAME.github.io/*`
     (plus `http://localhost/*` for local testing)
   - API restriction: Maps JavaScript API only
5. Set a daily quota cap (e.g. 300 map loads/day) + budget alert at £1
6. Paste key into the placeholder constant in `index.html`
   (Also create a **Map ID** in Google Cloud console — required for the vector
   renderer — and put it in the adjacent placeholder constant)

**Maps Elevation API** (for "plays like" uphill/downhill distance) uses the
same key/referrer restrictions — just add **Maps Elevation API** to the
key's API restriction list alongside Maps JavaScript API. It's a separate
billed SKU from Dynamic Maps loads, so it's worth its own budget-alert
sanity check if hole-view volume grows; results are cached per tee/green
pair for the session to avoid repeat calls on hole revisits.

## Working preferences
- Plan and confirm before implementing changes; ask before creating/overwriting
  files
