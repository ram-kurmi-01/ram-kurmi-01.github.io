# Rohit Kurmi — Portfolio

Modern developer portfolio built with **React**, **Vite**, **Tailwind CSS**, **Framer Motion**, and **React Three Fiber**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build for production

```bash
npm run build
```

Output is in `dist/`. The build copies `CNAME` into `dist/` for GitHub Pages custom domain (e.g. rohit.codes).

## Deploy (GitHub Pages)

- Push the repo and set GitHub Pages to deploy from the **main** branch, **/ (root)** or **/docs**.
- If using root: build, then push the contents of `dist/` to a branch (e.g. `gh-pages`) and set Pages to that branch.
- Or use GitHub Actions to run `npm run build` and deploy `dist/`.

## Tech stack

- React 18, TypeScript, Vite
- Tailwind CSS
- React Router, Framer Motion
- React Three Fiber + Three.js (3D hero element, lazy-loaded)

## Content

- **Resume:** Set `resumeUrl` in `src/data/site.ts` to your hosted CV URL.
- **Projects:** Edit `src/data/projects.ts` (add real images when ready).
- **Experience / Skills:** Edit `src/data/experience.ts` and `src/data/skills.ts`.
