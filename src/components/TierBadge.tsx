import { useMemo } from 'react'
import { renderBadgeSvg } from '../badge'
import type { Tier } from '../types'

interface TierBadgeProps {
  tier: Tier
  size?: number
  ringColor?: string
}

export function TierBadge({ tier, size = 120, ringColor }: TierBadgeProps) {
  const svg = useMemo(() => renderBadgeSvg(tier), [tier])

  return (
    <div
      className="portrait-frame"
      style={{
        width: size,
        height: size,
        borderColor: ringColor ?? 'rgba(255,255,255,0.5)',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
