// Password verification for the admin user.
import { compare } from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
// Valid bcrypt hash of a random value; used so unknown users cost the same time.
const DUMMY_HASH = "$2b$12$a/N.KlzTDfxKtRxI5F10X.VCrxezV1gvO7iEVT0EYbk0KSylvnopa";

export function isBcryptHash(value: unknown): value is string {
  return typeof value === "string" && BCRYPT_RE.test(value);
}

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/**
 * Compares a login password with the stored value.
 * Stored bcrypt hashes are compared with bcrypt. A legacy plaintext value is
 * still accepted (constant-time) so the site keeps working until the admin runs
 * scripts/hash-admin-password.ts, but a warning is logged every time.
 */
export async function verifyPassword(
  password: string,
  stored: unknown
): Promise<boolean> {
  if (isBcryptHash(stored)) return compare(password, stored);
  if (typeof stored === "string" && stored.length > 0) {
    console.warn(
      "[auth] Admin password is stored in plaintext. Run scripts/hash-admin-password.ts to hash it."
    );
    return timingSafeEqual(sha256(password), sha256(stored));
  }
  return false;
}

/** Burns comparable time when the user does not exist (reduces enumeration). */
export async function fakePasswordCheck(password: string): Promise<false> {
  await compare(password, DUMMY_HASH).catch(() => false);
  return false;
}
