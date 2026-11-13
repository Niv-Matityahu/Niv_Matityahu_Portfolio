# Niv Matityahu — Portfolio

A static, single-page portfolio. No build step, no framework — just HTML, CSS, and vanilla JS.

```
portfolio/
├── index.html          # all the content lives here
├── assets/
│   ├── styles.css      # "Control Room" theme — tokens at the top
│   └── main.js         # theme toggle, scroll reveals, hero canvas
├── render.yaml         # optional one-click Render blueprint
└── README.md
```

## Preview locally

Because it loads `assets/*` with relative paths, serve it over HTTP rather than
opening the file directly:

```bash
cd portfolio
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy on Render (Static Site)

1. Push this `portfolio/` folder to a GitHub/GitLab repo (it can be the repo root).
2. On Render: **New → Static Site** → connect the repo.
3. Settings:
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.` — or `portfolio` if the folder sits inside a larger repo.
4. **Create Static Site.** Render gives you a `*.onrender.com` URL; add a custom domain later if you want.

Or commit `render.yaml` and use **New → Blueprint** to set it up in one step.

## Things to finish (marked with `TODO` in the code)

- **Client names** — the Moveo case studies use anonymized descriptors
  ("a leading Israeli retailer", "a national airline"). Replace them with real
  names **only after** you've confirmed you're cleared by Moveo / the client to
  publish them. Search `index.html` for `TODO (client naming)`.
- **Side-project link** — add a GitHub/demo link to the math-grader case (CASE 03).
- **Social preview image** — drop a 1200×630 `og-image.png` in this folder and
  uncomment the `og:image` tag in `index.html` so the link looks good on LinkedIn.
- **Phone number** — intentionally left off the public page; add it to the
  contact section if you want it there.

## Editing notes

- All colors and fonts are CSS custom properties at the top of `styles.css`
  (`:root`). Change the accent in one place (`--accent`) and it updates everywhere.
- Light and dark themes are both defined; the toggle persists the choice in
  `localStorage` and otherwise follows the visitor's system setting.
- Everything animated respects `prefers-reduced-motion`.
