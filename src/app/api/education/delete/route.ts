// Admin only: requires a valid session (see src/lib/auth.ts); input is validated before any DB access.
import Education from "@/models/Education";
import { makeDeleteHandler } from "@/lib/crud";

export const dynamic = "force-dynamic";
export const DELETE = makeDeleteHandler(Education, "education", "Education");
