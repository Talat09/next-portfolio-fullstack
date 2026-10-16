# Security Audit Report: talat-mahmud-portfolio

Date: 2026-10-16. Scope: the local repository (`new-portfolio`), the local dev server, and harmless GET requests to the production site. No secrets are reproduced in this report.

## Executive summary
The portfolio is a Next.js 16 App Router app backed by MongoDB (Mongoose 9). Before this audit, every create, update, delete and reorder API route accepted unauthenticated requests. The admin "login" only set a `sessionStorage` flag in the browser. Contact-form messages (names and emails) were readable by anyone.

The code fixes are now in the local working tree. They are **not deployed and not committed**. Production stays vulnerable until the code is deployed and the steps in SECURITY_FIX_PLAN.md are done, above all rotating the MongoDB credential that was committed to the public GitHub history.

| Severity | Count |
|---|---|
| Critical | 2 |
| High | 4 |
| Medium | 3 |
| Low / Info | 7 |

## Architecture and attack surface
- Public pages: `/` (server component; fetches the production API at `https://talat-mahmud-portfolio.vercel.app/api/*/get`) and `/admin` (client component).
- Public API (GET): `/api/{home,about,experience,education,project,contact-info}/get`.
- Public API (write): `/api/contact/add` and `/api/login`.
- Admin API (now protected): `/api/{home,about,experience,education,project,contact-info}/{add,update}`, `/api/{experience,education,project}/delete`, `/api/project/reorder`, `/api/contact/get`.
- New: `/api/auth/me` (GET session status) and `/api/auth/logout` (POST).
- Data store: MongoDB Atlas (connection string from an environment variable). There are no file uploads, no server actions and no outbound fetches built from user-supplied URLs.

## Findings

| ID | Title | Severity | Confidence | Location | Status |
|---|---|---|---|---|---|
| F-01 | No server-side auth on any mutating API route | Critical | Confirmed (tested) | `src/app/api/**/{add,update,delete,reorder}/route.ts` | Fixed locally (`requireAdmin` plus `src/proxy.ts`); verified unauthenticated requests are rejected |
| F-02 | MongoDB connection string committed to a public Git history | Critical | Confirmed | `.env` in commits 5064689, 8836cc7, f7f7778, fb977e1 (deleted in daec09e); repo `Talat09/next-portfolio-fullstack` is public | **Open**: you must rotate the credential |
| F-03 | Mongo operator injection through `_id` / `username` | High | Confirmed (one unintended no-op write during testing; see the note below) | old `project/update/route.ts`, `login/route.ts` | Fixed: ObjectId/type validation and `mongoose.set("sanitizeFilter", true)` |
| F-04 | Admin password stored in plaintext; bcrypt misused | High | Confirmed | old `login/route.ts` (hashed the stored value at request time) | Code fixed (bcrypt compare, with plaintext fallback that logs a warning); **you must run the hash script** |
| F-05 | Client-only authentication (`sessionStorage`) | High | Confirmed | `src/app/admin/page.tsx` | Fixed: signed HttpOnly session cookie and `/api/auth/me` |
| F-06 | Contact messages (personal data) publicly readable | High | Confirmed (local and production) | `src/app/api/contact/get/route.ts` | Fixed locally (admin only, `no-store`) |
| F-07 | DB connection string in a `NEXT_PUBLIC_*` variable | Medium | Confirmed (not found in the client bundle) | `src/database/index.ts` | Fixed: reads `MONGODB_URI` first and falls back to the old name with a warning |
| F-08 | No rate limiting / abuse controls | Medium | Confirmed | `/api/login`, `/api/contact/add` | Partly fixed: per-IP in-memory limits and a contact honeypot (see residual risks) |
| F-09 | Missing security headers; `X-Powered-By` exposed | Medium | Confirmed | `next.config.js` | Fixed: CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, `poweredByHeader:false` |
| F-10 | Login user enumeration | Low | Confirmed | old `login/route.ts` | Fixed: generic message plus a dummy bcrypt check |
| F-11 | Mass assignment / no field validation or lengths; `javascript:` URLs storable | Low–Medium | Confirmed | old add routes | Fixed: per-section allowlists, max lengths, http(s)-only URLs |
| F-12 | DB connection not cached; `dotenv` unnecessary | Low | Confirmed | `src/database/index.ts` | Fixed |
| F-13 | No tests, no CI, broken lint script | Low | Confirmed | `package.json` | Partly fixed: ESLint flat config, unit tests, API rejection tests (no CI yet) |
| F-14 | Node version mismatch (local v22.8 vs `engines` 24.x) | Info | Confirmed | `package.json` | Open |
| F-15 | Dev-only npm audit findings via `eslint-config-next` | Info | Confirmed | devDependencies | Open (not shipped to production) |
| F-16 | Production uses in-memory rate limits (per instance) | Info | n/a | `src/lib/rate-limit.ts` | Residual risk |

**Note on F-03:** during the read-only audit, one probe (`PUT /api/project/update` with `_id: {"$ne": null}`) matched the first project record. Content fields stayed unchanged; only its `updatedAt` timestamp changed. This proved the issue.

## Test results (local)
- `npx tsc --noEmit`: pass.
- `npm test` (7 unit tests: validators, session tokens, rate limiter, password verification): pass.
- `npm run test:api` (9 unauthenticated write/private-read requests plus 1 public GET): pass. All 9 were rejected before any database access. Locally they returned 500 "SESSION_SECRET missing" because that variable is not set, so the API fails closed.
- Operator-injection probes on login and update: rejected before the database was touched.
- Invalid contact submission returned 400 before the database was touched.
- `/` and `/admin` return 200; the homepage still renders projects; no browser console or CSP errors.
- `npm run lint`: 5 errors and 9 warnings, all in code that existed before (`react-hooks/set-state-in-effect` and `immutability` in `src/app/admin/page.tsx` and `src/components/admin-view/project/index.tsx`; unused `_req` in the GET routes). None are security issues.
- `npm audit --omit=dev`: 0 vulnerabilities. The full audit shows 5 high findings in dev-only ESLint tooling.

## Residual risks and untested areas
- A successful login, real admin CRUD with a session, and session expiry were not exercised, because there was no `SESSION_SECRET` and no admin credentials were used.
- Logout clears the cookie, but tokens are stateless: a stolen token stays valid until it expires (8 hours). To revoke every session immediately, rotate `SESSION_SECRET`.
- The rate limiter is in memory and per serverless instance, so it is best-effort. Use Vercel WAF / Firewall rate-limit rules for stronger protection.
- The CSP allows `'unsafe-inline'` scripts and styles (required by Next.js hydration without nonces and by framer-motion).
- Not inspected: Vercel project settings (preview protection, env separation, team access), Atlas network rules and database-user privileges, backups.
- A production build (`next build`) was not run.
