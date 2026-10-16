// Sorting helpers shared by the public pages

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
