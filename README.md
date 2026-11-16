# Arun Kumar M — Portfolio ("A Series")

Personal portfolio site for Arun Kumar M, HR & Admin Manager, in a streaming-series style.

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion. Statically exported and hosted on
GitHub Pages by the workflow in `.github/workflows/deploy.yml`.

## Updating the site

All content lives in `content/site-data.ts`: name, experience, the work write-ups, skills,
certifications, education, and the About page. Edit that file, commit, and push to `main`;
the site rebuilds and redeploys automatically.

- Photos: `public/photo.png` (portrait, home page and About), `public/og.png` (square, link previews).
- Résumé: `public/Arun-Kumar-M-Resume.pdf`.
- To show LinkedIn or GitHub links, fill `linkedin` / `github` in `site`.
- If the site moves to another address, update `url` in `site`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export -> ./out
```

## Publish on GitHub Pages (one time)

1. Create a new **public** repository named `arunkumar3011-hr.github.io`
   (no README or .gitignore).
2. In this folder, run:

   ```bash
   git init -b main
   git add .
   git commit -m "Portfolio site"
   git remote add origin https://Arunkumar3011-HR@github.com/Arunkumar3011-HR/arunkumar3011-hr.github.io.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. In the **Actions** tab, re-run "Deploy to GitHub Pages" if it failed before step 3.
   The site goes live at `https://arunkumar3011-hr.github.io/`.
