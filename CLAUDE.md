# vape-studies

Astro static site (`app/`) deployed as a **Cloudflare Worker with static assets**.

## Where your changes appear (CI/CD)

This repo auto-deploys to **Cloudflare Workers** via **GitHub Actions** on every
push to `main`. Never deploy by hand and never run `wrangler deploy` from a laptop.

| You push to | Live URL | Access | Auto? |
|-------------|----------|--------|-------|
| `main` | https://vape-studies.research.lukacin.com | public | yes, ~1-2 min |

Watch runs: https://github.com/klukacin/vape-studies/actions

→ After you push, the change is live at the URL above once the run is **green ✅**
(~1–2 min). A **red ❌** run means the change did NOT go live — open the run to see
why. The run also proves the Worker itself on its own hostname
(`vape-studies.nosco-703.workers.dev`), which does not depend on the custom
domain's certificate. Secrets live in GitHub Actions — never commit them.

## Layout

- `app/` — the Astro app (`npm ci && npm run build` → `app/dist/`, 137 pages).
- `app/wrangler.jsonc` — Worker config: static assets from `./dist`, custom domain
  `vape-studies.research.lukacin.com` (Cloudflare account **NOSCO**, `lukacin.com` zone).
- `vuse-report/` — the source research report and its PNG/SVG charts (not built).
- `.github/workflows/deploy.yml` — the deploy pipeline: install → build → `wrangler deploy` → healthcheck.

## Local work

```sh
cd app
npm ci
npm run dev      # local preview of the real thing
npm run build    # same build CI runs
```

No server, no database, no runtime secrets — everything is prerendered at build time.

## Ops

- Cloudflare account `703c0e32f8df5e1e5ec73f30db85e15d` (NOSCO), zone `lukacin.com`
  (`103487becd4c5dc56981c230c2ad0661`); worker `vape-studies`, deploy token
  `workers-deploy-nosco` (Workers Scripts Write on the account, Workers Routes Write +
  Zone Read on the zone).
- Rollback: `git revert <sha>` and push (CI redeploys), or
  `npx wrangler rollback --name vape-studies`.
- Source of truth for runbooks: devops repo `cloudflare/domains/cf-nosco/lukacin.com/CHANGELOG.md`.