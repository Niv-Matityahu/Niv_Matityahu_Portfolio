# CLAUDE.md — Niv Matityahu Portfolio

Guidance for Claude Code when working in this project.

## Repository

- **Home:** personal GitHub — https://github.com/Niv-Matityahu
  (this project should live in a repo under that account).
- **Owner:** Niv Matityahu — AI Engineer. Contact: nivmat47@gmail.com

## What this is

A personal portfolio website. Goal: **personal brand + attracting freelance / consulting
work** (secondary: job visibility). Static HTML/CSS/JS — **no framework, no build step.**

## Delivery

Hosted by Niv on **Render** as a Static Site (Build Command empty, Publish Directory `.`).
See `README.md` for full deploy steps and `render.yaml` for the blueprint.
It is **not** a Claude Artifact — build real files, don't rely on Artifact-only behavior.

## Structure

```
index.html          # all content — hero, "What I build", case studies, about, contact
assets/styles.css   # design tokens + all styling
assets/main.js      # theme toggle, scroll reveals, counters, hero canvas graph
render.yaml         # Render Static Site blueprint
README.md           # preview + deploy instructions + TODO list
```

## Design system — "Control Room"

Deliberate identity: the tension between probabilistic LLMs and engineered reliability.
Do **not** match the old resume (blue/cyan) — this project has its own look.

- **Accent:** signal-gold `--accent: #f0b429`. Change colors via the CSS custom properties
  at the top of `styles.css` (`:root` + the light/dark overrides) — never hard-code hex in
  components.
- **Fonts:** Bricolage Grotesque (display), IBM Plex Sans (body), IBM Plex Mono (labels/data).
  Loaded from Google Fonts via `<link>` — fine on Render (CDN fonts only fail inside Artifacts).
- **Themes:** light + dark both defined; toggle persists to `localStorage`, otherwise follows
  system. Keep both themes working and contrast-legible on any change.
- **Motion:** everything animated must respect `prefers-reduced-motion`.

## Conventions

- Keep it dependency-free and build-step-free. Don't introduce a framework or bundler
  unless Niv asks.
- Content voice: first-person, concrete, outcome-first. Case studies follow
  problem → approach → outcome → stack.
- Preview over HTTP (`python3 -m http.server`), not by opening the file — relative asset
  paths need a server.

## Open decision — client naming (important)

The Moveo AI case studies use anonymized descriptors ("a leading Israeli retailer",
"a national airline"). Niv wants to name the real clients, but **only after confirming he's
cleared (NDA) to publish them.** Do **not** insert real client names until he explicitly
confirms clearance. Spots are marked `TODO (client naming)` in `index.html`.

## Outstanding TODOs (also marked in code)

- Replace client placeholders once cleared (see above).
- Add a GitHub/demo link to the math-grader case (CASE 03).
- Add `og-image.png` (1200×630) and uncomment the `og:image` meta tag.
- Optional: headshot in About; phone number in Contact (left off the public page by default).
