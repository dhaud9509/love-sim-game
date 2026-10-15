import { useMemo } from 'react'
import { renderPortraitSvg } from '../portrait'
import type { AppearanceVibe, PersonalityTrait } from '../types'

interface CharacterPortraitProps {
  vibe: AppearanceVibe
  trait?: PersonalityTrait
  size?: number
  ringColor?: string
}

export function CharacterPortrait({ vibe, trait, size = 120, ringColor }: CharacterPortraitProps) {
  const svg = useMemo(() => renderPortraitSvg({ vibe, trait }), [vibe, trait])

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
