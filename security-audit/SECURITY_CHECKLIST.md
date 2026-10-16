# Security Checklist

## Confirmed controls (local code)
- [x] Server-side admin auth on every add/update/delete/reorder route and on contact/get
- [x] Proxy (`src/proxy.ts`) guards mutating `/api/*` routes as defence in depth
- [x] Signed HttpOnly, SameSite=Strict, Secure (prod) session cookie with an 8-hour expiry; logout route
- [x] Admin UI trusts the server session (`/api/auth/me`), not sessionStorage
- [x] ObjectId validation; username/password type checks; `sanitizeFilter`
- [x] Field allowlists, max lengths, http(s)-only URLs, email validation, JSON body size limits
- [x] bcrypt verification; generic login error; dummy bcrypt check for unknown users
- [x] Rate limits on login and contact; contact honeypot
- [x] Security headers and `poweredByHeader: false`; `no-store` on admin and contact responses
- [x] DB connection cached, `server-only`, `MONGODB_URI` supported
- [x] Unit and API rejection tests; ESLint config

## Missing / open
- [ ] Rotate the MongoDB credential leaked in the public Git history (**critical**)
- [ ] Set `SESSION_SECRET` and `MONGODB_URI` in Vercel and locally; delete `NEXT_PUBLIC_API_URL`
- [ ] Change the admin password and run `scripts/hash-admin-password.ts`
- [ ] Deploy the fixes (production is still vulnerable until then)
- [ ] Fix the existing lint errors (React hook rules) in the admin components
- [ ] CI workflow running tsc, lint and tests
- [ ] Use Node 24 locally to match `engines`

## Requires manual verification
- [ ] Vercel preview deployment protection and env separation
- [ ] Atlas network access list and database-user privileges; backups
- [ ] Production login/logout flow and 401s after deploy
- [ ] CSP has no violations in production (`'unsafe-inline'` remains; consider a nonce-based CSP later)
