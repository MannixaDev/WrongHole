# ⛳ WrongHole

A mobile-friendly golf round tracker that runs entirely in the browser — no app
download, no backend, no accounts.

**Live at [mannixadev.github.io/WrongHole](https://mannixadev.github.io/WrongHole/)**
(installable to your home screen via your browser's *Add to Home Screen*).

## What it does

- **Play Mode** — full-screen satellite view of each hole, camera at the tee
  looking down the fairway, with an animated fly-to between holes
- **Live GPS rangefinder** — distance from where you're standing to the green
- **"Plays like" distances** — elevation-adjusted yardage (uphill/downhill)
- **Club suggestions** — enter how far you hit each club, get a recommendation
  per shot
- **Multi-player scoring** — 1–4 players, optional fairway/GIR/putt stats,
  live weather at the course
- **Course library** — shared courses in [courses.json](courses.json), plus map
  your own in the built-in course editor or import from OpenStreetMap
- **Resume-safe rounds** — an interrupted round (killed tab, dead battery)
  can be resumed exactly where you left off
- **Shareable scorecards** — the whole scorecard compresses into a URL, no
  server needed, plus a WhatsApp-friendly copy-as-text option

## How it's built

One self-contained [index.html](index.html) — no framework, no build step —
hosted on GitHub Pages. Google Maps JavaScript API (vector renderer) for the
satellite camera work, Maps Elevation API for plays-like distances, and free
OpenStreetMap/Open-Meteo services for course import, geocoding, and weather.
All personal data (rounds, clubs, settings) stays in your browser's
localStorage.

See [SPEC.md](SPEC.md) for the full design spec, API key setup, and the
admin course-publishing workflow.
