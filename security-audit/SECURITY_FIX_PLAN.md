# Security Fix Plan

## Already implemented locally (not committed or deployed)
1. Session auth.
   - `src/lib/session.ts`: HMAC-signed token, 8-hour expiry.
   - `src/lib/auth.ts`: `requireAdmin`, Origin check, cookie helpers.
   - `src/app/api/login/route.ts`: sets the HttpOnly, SameSite=Strict cookie (Secure in production).
   - `src/app/api/auth/{me,logout}/route.ts` added.
   - `src/app/admin/page.tsx`: checks the session through `/api/auth/me`.
2. Every admin route calls `requireAdmin` before validation and before any DB access. Shared handlers live in `src/lib/crud.ts`; `project/reorder` and `contact/get` are guarded directly. `src/proxy.ts` also guards all non-GET `/api/*` routes (except login, contact/add and logout) plus `contact/get`.
3. Validation (`src/lib/validate.ts`): field allowlists, string-type checks, max lengths, http(s)-only URLs, email format, 24-hex ObjectId checks, JSON body size limits. Also `mongoose.set("sanitizeFilter", true)`.
4. Passwords (`src/lib/password.ts`): bcrypt compare. A legacy plaintext value is still accepted (constant-time compare) and logs a warning. `scripts/hash-admin-password.ts` is provided but was not run.
5. Database (`src/database/index.ts`): `server-only`, cached connection, `MONGODB_URI`, and the legacy `NEXT_PUBLIC_API_URL` fallback with a warning. `dotenv` was removed.
6. Abuse controls: login allows 5 attempts per 15 minutes per IP; contact form allows 5 messages per 10 minutes per IP plus a hidden honeypot field.
7. Headers (`next.config.js`): CSP, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, `poweredByHeader:false`, and `no-store` on `/admin`.
8. Tooling: `eslint.config.mjs`, `npm run lint` (`eslint .`), `npm test`, `npm run test:api`.

## Required actions only you can take (in this order)
1. **Rotate the MongoDB password** in Atlas (Database Access, then Edit user, then a new password). The old one is in the public Git history. Restrict Atlas Network Access, and make sure the app's database user has readWrite on this database only.
2. In **Vercel, Project Settings, Environment Variables** (Production and Preview):
   - `MONGODB_URI` = the new connection string.
   - `SESSION_SECRET` = a random string of at least 32 characters, e.g. from `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.
   - After the deploy works, delete `NEXT_PUBLIC_API_URL`.
3. Locally, put the same two variables in `.env` (it is gitignored). Do not commit it.
4. **Change the admin password, and hash it.** The new password must be at least 12 characters (no hashing happens without one):
   `NEW_ADMIN_PASSWORD="<new strong password>" npm run hash-admin-password -- <username>` (PowerShell: `$env:NEW_ADMIN_PASSWORD="..."; npm run hash-admin-password -- <username>`).
5. Review the diff, commit and deploy. Then check production: `/admin` login works, unauthenticated `PUT /api/project/update` returns 401, and `/api/contact/get` returns 401.
6. Optional: add a Vercel Firewall rate-limit rule for `/api/login` and `/api/contact/add`, and enable Vercel Deployment Protection for preview deployments.

## Deployment implications
- `src/app/page.tsx` fetches **production** `/api/*/get`. Public GET routes did not change, so the homepage keeps working before and after deploy.
- Until you deploy, production keeps the old unauthenticated API. The local admin talks to the local API and works only once `SESSION_SECRET` is set locally.
- If you deploy **without** `SESSION_SECRET`, admin login and all admin writes fail closed with HTTP 500 "not configured". The public site is unaffected.

## Rollback
Every modified file has a backup next to it (see the list below). Restoring means copying `*.backupN.*` over the file. New files can simply be deleted (`src/lib/*`, `src/proxy.ts`, `src/app/api/auth/*`, `tests/*`, `scripts/hash-admin-password.ts`, `eslint.config.mjs`). `package.json` and `package-lock.json` have backups `package.backup5.json` and `package-lock.backup5.json`; run `npm install` after restoring them.
