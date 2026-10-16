// requireAdmin is exercised against the running dev server (no DB is reached:
// every request below is rejected before connectToDB). Run: npm run test:api
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = process.env.TEST_BASE_URL || "http://localhost:3000";
const ZERO = "000000000000000000000000";

const cases = [
  ["POST", "/api/project/add", { name: "should-not-save" }],
  ["PUT", "/api/project/update", { _id: ZERO }],
  ["DELETE", `/api/project/delete?id=${ZERO}`, undefined],
  ["PUT", "/api/project/reorder", { ids: [ZERO] }],
  ["POST", "/api/about/add", {}],
  ["PUT", "/api/home/update", { _id: ZERO }],
  ["DELETE", `/api/education/delete?id=${ZERO}`, undefined],
  ["PUT", "/api/contact-info/update", { _id: ZERO }],
  ["GET", "/api/contact/get", undefined],
];

for (const [method, path, body] of cases) {
  test(`${method} ${path} without a session is rejected`, async () => {
    const res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    // 401 = no session; 500 = SESSION_SECRET not configured (fails closed)
    assert.ok([401, 500].includes(res.status), `got ${res.status}`);
    const json = await res.json();
    assert.equal(json.success, false);
  });
}

test("public GET endpoints still work", async () => {
  const res = await fetch(`${BASE}/api/project/get`);
  assert.equal(res.status, 200);
});
