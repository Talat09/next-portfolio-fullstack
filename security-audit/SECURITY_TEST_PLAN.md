# Security Test Plan

| # | Test | Preconditions | Steps (safe) | Expected | Actual (2026-10-16, local) |
|---|---|---|---|---|---|
| T1 | Unit: validators, sessions, rate limiter, passwords | none | `npm test` | 7/7 pass | Pass |
| T2 | Unauthenticated admin writes rejected before the DB | dev server running | `npm run test:api` | 401 (or 500 if SESSION_SECRET is unset) | Pass (500 fail-closed; secret not set locally) |
| T3 | Operator injection in `_id` | dev server | `PUT /api/project/update` body `{"_id":{"$ne":null}}` with no cookie | Rejected, no DB access | Pass (rejected by auth) |
| T4 | Operator injection in login | dev server | `POST /api/login` with `{"username":{"$ne":"x"},"password":"x"}` | 400 (or 500 if unconfigured) | 500 fail-closed; with a secret set, 400 by code review |
| T5 | Forged cookie | SESSION_SECRET set | Send `Cookie: admin_session=forged.token` | 401 | Not run (no secret locally); covered by unit tests |
| T6 | Valid session, invalid id returns 400 | SESSION_SECRET set, logged in | `PUT /api/project/update` with `{"_id":"abc"}` | 400 before DB | Not run (needs login) |
| T7 | Login rate limit | SESSION_SECRET set | 6 wrong logins within 15 minutes from one IP | 6th returns 429 | Not run (unit-tested) |
| T8 | Contact validation and honeypot | dev server | POST without email; POST with `company` filled | 400; fake success with nothing stored | 400 verified; honeypot by code review |
| T9 | Headers | dev server | Inspect response headers of `/` | CSP, XFO, nosniff, Referrer, Permissions present; no X-Powered-By | Pass |
| T10 | UI regression | dev server | Load `/` and `/admin`, check the console | 200, no CSP errors, projects render | Pass |
| T11 | Login and logout flow | SESSION_SECRET set, admin creds | Log in, edit nothing, reload (still logged in), log out (cookie cleared) | Works | Not run: needs your credentials |

## Production tests requiring your authorization
- After deploy: unauthenticated `PUT https://talat-mahmud-portfolio.vercel.app/api/project/update` with body `{"_id":"000000000000000000000000"}` should return 401.
- `GET /api/contact/get` on production should return 401.
- A single login and logout on production with your own credentials.
