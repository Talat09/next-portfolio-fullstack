/**
 * One-time admin password tool. Run it yourself; it is never run automatically.
 *
 *   node --experimental-strip-types scripts/hash-admin-password.ts <username>
 *
 * - With NEW_ADMIN_PASSWORD set: stores a bcrypt hash of that new password.
 * - Without it: hashes the CURRENT plaintext password in place (if not already hashed).
 * Reads MONGODB_URI (or legacy NEXT_PUBLIC_API_URL) from the environment / .env.
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

async function main(): Promise<void> {
  try {
    process.loadEnvFile?.(".env");
  } catch {
    // no .env file; rely on the environment
  }
  const username = process.argv[2];
  if (!username) throw new Error("Usage: scripts/hash-admin-password.ts <username>");
  const uri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_API_URL;
  if (!uri) throw new Error("MONGODB_URI is not set");

  await mongoose.connect(uri);
  const users = mongoose.connection.collection("users");
  const user = await users.findOne({ username });
  if (!user) throw new Error(`User "${username}" not found`);

  const newPassword = process.env.NEW_ADMIN_PASSWORD;
  let hash: string;
  if (newPassword) {
    if (newPassword.length < 12) throw new Error("NEW_ADMIN_PASSWORD must be at least 12 characters");
    hash = await bcrypt.hash(newPassword, 12);
  } else {
    const current = user.password;
    if (typeof current !== "string" || !current) throw new Error("Stored password is empty");
    if (BCRYPT_RE.test(current)) {
      console.log("Password is already a bcrypt hash; nothing to do.");
      return;
    }
    hash = await bcrypt.hash(current, 12);
  }
  await users.updateOne({ _id: user._id }, { $set: { password: hash, updatedAt: new Date() } });
  console.log(`Password for "${username}" is now stored as a bcrypt hash.`);
}

main()
  .catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
