// Formats a 만원 (10,000 KRW) amount into readable 억/만원 Korean grouping,
// e.g. 157000 -> "15억 7,000만원", 350 -> "350만원".
export function formatManwon(manwon: number): string {
  const rounded = Math.round(manwon)
  if (rounded >= 10000) {
    const eok = Math.floor(rounded / 10000)
    const remainder = rounded % 10000
    if (remainder === 0) return `${eok}억원`
    return `${eok}억 ${remainder.toLocaleString()}만원`
  }
  return `${rounded.toLocaleString()}만원`
}

// Formats a large head-count (e.g. a world-population rank) using 만/억
// grouping instead of a long digit string, e.g. 62340000 -> "6,234만".
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
