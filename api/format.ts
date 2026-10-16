// Self-contained mirror of src/format.ts — see the note in api/tiers.ts.

export function formatCount(n: number): string {
  const rounded = Math.round(n)
  if (rounded >= 100_000_000) {
    const eok = rounded / 100_000_000
    return `${eok >= 10 ? Math.round(eok) : Math.round(eok * 10) / 10}억`
  }
  if (rounded >= 10_000) {
    return `${Math.round(rounded / 10_000).toLocaleString()}만`
  }
  return rounded.toLocaleString()
}
