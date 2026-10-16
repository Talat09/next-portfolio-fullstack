// Admin only: requires a valid session (see src/lib/auth.ts); input is validated before any DB access.
import Home from "@/models/Home";
import { makeUpdateHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const PUT = makeUpdateHandler(Home, "home", "Home");
