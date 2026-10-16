import type { Tier } from './types'

const TIER_STYLE: Record<Tier, { base: string; light: string; shine: string }> = {
  흙수저: { base: '#8d6346', light: '#c89b6d', shine: '#e8cda3' },
  은수저: { base: '#9aa3ad', light: '#d9dee3', shine: '#ffffff' },
  금수저: { base: '#d4941f', light: '#f6d365', shine: '#fff3cf' },
  다이아몬드수저: { base: '#5ec8e0', light: '#c2e9fb', shine: '#ffffff' },
}

const TIER_SLUG: Record<Tier, string> = {
  흙수저: 'dirt',
  은수저: 'silver',
  금수저: 'gold',
  다이아몬드수저: 'diamond',
}

function sparkles(): string {
  return `
    <g fill="#ffffff">
      <path d="M150 40 L154 50 L164 54 L154 58 L150 68 L146 58 L136 54 L146 50 Z" />
      <path d="M44 90 L47 97 L54 100 L47 103 L44 110 L41 103 L34 100 L41 97 Z" />
    </g>
  `
}

export function renderBadgeSvg(tier: Tier): string {
  const style = TIER_STYLE[tier]
  const gradientId = `spoonFill-${TIER_SLUG[tier]}`

  return `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${style.light}" />
      <stop offset="100%" stop-color="${style.base}" />
    </linearGradient>
  </defs>
  <ellipse cx="100" cy="76" rx="40" ry="50" fill="url(#${gradientId})" />
  <ellipse cx="86" cy="58" rx="14" ry="18" fill="${style.shine}" opacity="0.55" />
  <path d="M84 118 Q100 108 116 118 L122 208 Q100 220 78 208 Z" fill="url(#${gradientId})" />
  ${tier === '다이아몬드수저' ? sparkles() : ''}
</svg>
`.trim()
}

export function badgeDataUrl(tier: Tier): string {
  const svg = renderBadgeSvg(tier)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
