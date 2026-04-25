<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# You Are Enough, Tabitha

A love letter — beautifully animated and deployed to GitHub Pages.

**Live site:** [https://the-lucky-clover.github.io/tabi/](https://the-lucky-clover.github.io/tabi/)

---

## Local Development

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Set a Gemini API key if you use AI features
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Start the dev server  (available at http://localhost:3000)
npm run dev
```

## Build

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

## GitHub Pages Deployment

The repository ships with a GitHub Actions workflow at
`.github/workflows/deploy.yml` that builds and deploys the site automatically.

### First-time setup (one-time only)

1. Go to your repository on GitHub.
2. Open **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Save.

### Deploying

Every push to `main` triggers the workflow and deploys to
`https://the-lucky-clover.github.io/tabi/`.

You can also trigger it manually from the **Actions** tab →
**Deploy to GitHub Pages** → **Run workflow**.

### How it works

| Step | What happens |
|------|-------------|
| Build | Vite bundles the app with `base: '/tabi/'` so all asset paths are correct for the project sub-path. |
| Upload | The `dist/` folder is uploaded as a Pages artifact. |
| Deploy | GitHub Pages serves the artifact at `https://the-lucky-clover.github.io/tabi/`. |
| 404 fallback | `public/404.html` redirects unknown paths back to the SPA root, preserving deep-link compatibility. |

---

## Features

- **Elite motion graphics** — multi-layer parallax (stars, nebula, geometry), GPU-accelerated.
- **Interactive particles** — colorful particles with connection lines and glow; react to mouse movement.
- **Typography** — `text-wrap: balance/pretty`, non-breaking spaces prevent single-word orphans and mid-word line-breaks everywhere.
- **Reduced-motion** — all animations and parallax effects are disabled when the user enables "Reduce motion" in their OS/browser settings.
- **Performance** — RAF-throttled scroll listener, `will-change` hints, code-split vendor chunks.
