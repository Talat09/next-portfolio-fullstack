// Cache tag shared by the public data layer and the admin mutation routes.
import { revalidatePath, revalidateTag } from "next/cache";

export const PORTFOLIO_TAG = "portfolio";

/**
 * Call after any successful admin write so the cached homepage and the
 * cached section data are rebuilt on the next request.
 */
export function revalidatePortfolio(): void {
  try {
    revalidateTag(PORTFOLIO_TAG, { expire: 0 });
    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");
    revalidatePath("/sitemap.xml");
  } catch (e) {
    // Outside a Next.js request (e.g. unit tests) there is no cache to purge.
    console.error("[revalidate]", e instanceof Error ? e.message : e);
  }
}
