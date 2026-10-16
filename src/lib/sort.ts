// Sorting helpers shared by the public pages and the admin

function toTime(value?: string): number {
  const time = value ? Date.parse(value) : NaN;
  return Number.isNaN(time) ? 0 : time;
}

/** Newest first: by updatedAt, falling back to createdAt */
export function sortByUpdatedDesc<T extends { updatedAt?: string; createdAt?: string }>(
  items: T[] | undefined
): T[] {
  return [...(items || [])].sort(
    (a, b) =>
      toTime(b.updatedAt || b.createdAt) - toTime(a.updatedAt || a.createdAt)
  );
}

function hasOrder(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Display order for projects: items with a saved `order` come first
 * (ascending), the rest follow newest-updated first.
 */
export function sortByOrderThenUpdated<
  T extends { order?: number | null; updatedAt?: string; createdAt?: string }
>(items: T[] | undefined): T[] {
  const list = items || [];
  const ordered = list
    .filter((item) => hasOrder(item.order))
    .sort((a, b) => (a.order as number) - (b.order as number));
  const unordered = sortByUpdatedDesc(
    list.filter((item) => !hasOrder(item.order))
  );
  return [...ordered, ...unordered];
}
