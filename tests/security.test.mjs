// Run with: npm test  (Node's built-in test runner; no database is touched)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isValidObjectIdString,
  isSafeHttpUrl,
  validateFields,
} from "../src/lib/validate.ts";
import { createSessionToken, verifySessionToken } from "../src/lib/session.ts";
import { rateLimit } from "../src/lib/rate-limit.ts";
import { isBcryptHash, verifyPassword } from "../src/lib/password.ts";

const SECRET = "test-secret-that-is-at-least-32-characters-long";

test("object ids must be 24-char hex strings", () => {
  assert.equal(isValidObjectIdString("000000000000000000000000"), true);
  assert.equal(isValidObjectIdString({ $ne: null }), false);
  assert.equal(isValidObjectIdString("abc"), false);
  assert.equal(isValidObjectIdString(123), false);
});

test("only http(s) urls are accepted", () => {
  assert.equal(isSafeHttpUrl("https://example.com"), true);
  assert.equal(isSafeHttpUrl(""), true);
  assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("data:text/html,x"), false);
});

test("validateFields keeps allowlisted strings only", () => {
  const r = validateFields("project", {
    name: " A ",
    website: "https://a.dev",
    order: 1,
    _id: "x",
    $where: "1",
  });
  assert.deepEqual(r, { ok: true, data: { name: "A", website: "https://a.dev" } });
});

test("validateFields rejects operators, bad urls, long values, missing required", () => {
  assert.equal(validateFields("project", { name: { $ne: null } }).ok, false);
  assert.equal(validateFields("project", { website: "javascript:x" }).ok, false);
  assert.equal(validateFields("project", { name: "x".repeat(201) }).ok, false);
  assert.equal(validateFields("contact", { name: "a" }, ["name", "email", "message"]).ok, false);
  assert.equal(validateFields("contact", { email: "nope" }).ok, false);
  assert.equal(validateFields("project", null).ok, false);
});

test("session tokens verify, expire and reject tampering", () => {
  const now = 1_000_000;
  const token = createSessionToken("admin", SECRET, now);
  assert.equal(verifySessionToken(token, SECRET, now + 10)?.sub, "admin");
  assert.equal(verifySessionToken(token, SECRET, now + 60 * 60 * 9), null);
  assert.equal(verifySessionToken(token, "another-secret-of-at-least-32-chars!!", now), null);
  const [body, sig] = token.split(".");
  const forged = Buffer.from(JSON.stringify({ sub: "x", iat: now, exp: now + 999 })).toString("base64url");
  assert.equal(verifySessionToken(`${forged}.${sig}`, SECRET, now), null);
  assert.equal(verifySessionToken(`${body}.`, SECRET, now), null);
  assert.equal(verifySessionToken(undefined, SECRET, now), null);
});

test("rate limiter blocks after the limit and resets after the window", () => {
  const key = `t:${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(key, 3, 1000, 0).ok, true);
  assert.equal(rateLimit(key, 3, 1000, 10).ok, false);
  assert.equal(rateLimit(key, 3, 1000, 2000).ok, true);
});

test("password verification: bcrypt hash and legacy plaintext", async () => {
  const { hash } = await import("bcryptjs");
  const hashed = await hash("correct horse", 4);
  assert.equal(isBcryptHash(hashed), true);
  assert.equal(await verifyPassword("correct horse", hashed), true);
  assert.equal(await verifyPassword("wrong", hashed), false);
  assert.equal(await verifyPassword("legacy", "legacy"), true);
  assert.equal(await verifyPassword("x", "legacy"), false);
  assert.equal(await verifyPassword("x", undefined), false);
});
