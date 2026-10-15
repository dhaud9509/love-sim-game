import type { AppearanceVibe, PersonalityTrait } from './types'

const INK = '#2b2b36'

const VIBE_STYLE: Record<AppearanceVibe, { hair: string; outfit: string }> = {
  cute: { hair: '#ff9fc7', outfit: '#ffd1e0' },
  chic: { hair: '#2b2b36', outfit: '#3a3a46' },
  elegant: { hair: '#6b4a7a', outfit: '#8a6aa8' },
  bright: { hair: '#ff8a3d', outfit: '#ffd166' },
}

const SKIN = '#ffd9b3'

function mute(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const blend = (c: number) => Math.round(c * 0.45 + 170 * 0.55)
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`
}

function hairShapes(vibe: AppearanceVibe, hair: string): { back: string; front: string } {
  switch (vibe) {
    case 'cute':
      return {
        back: `
          <ellipse cx="38" cy="122" rx="17" ry="32" fill="${hair}" transform="rotate(-18 38 122)" />
          <ellipse cx="162" cy="122" rx="17" ry="32" fill="${hair}" transform="rotate(18 162 122)" />
        `,
        front: `<path d="M54 72 Q100 28 146 72 Q147 92 130 97 Q102 76 70 97 Q53 92 54 72 Z" fill="${hair}" />`,
      }
    case 'chic':
      return {
        back: `<path d="M52 88 Q48 38 100 33 Q152 38 148 88 Q150 58 100 54 Q50 58 52 88 Z" fill="${hair}" />`,
        front: `<path d="M68 56 Q100 40 100 56 L94 72 Q82 62 68 56 Z" fill="${hair}" opacity="0.92" />`,
      }
    case 'elegant':
      return {
        back: `
          <path d="M50 62 Q38 140 54 212 Q66 202 62 150 Q70 118 59 90 Z" fill="${hair}" />
          <path d="M150 62 Q162 140 146 212 Q134 202 138 150 Q130 118 141 90 Z" fill="${hair}" />
          <path d="M54 78 Q100 24 146 78 Q138 48 100 44 Q62 48 54 78 Z" fill="${hair}" />
        `,
        front: `<path d="M70 56 Q100 48 130 56 Q115 72 100 66 Q85 72 70 56 Z" fill="${hair}" />`,
      }
    case 'bright':
      return {
        back: '',
        front: `
          <path d="M56 82 Q100 44 144 82 Q130 60 100 58 Q70 60 56 82 Z" fill="${hair}" />
          <path d="M60 66 L68 40 L77 66 Z" fill="${hair}" />
          <path d="M83 61 L93 32 L101 61 Z" fill="${hair}" />
          <path d="M105 61 L113 30 L123 61 Z" fill="${hair}" />
          <path d="M128 66 L137 42 L145 67 Z" fill="${hair}" />
        `,
      }
  }
}

function brows(trait: PersonalityTrait): string {
  switch (trait) {
    case 'warm':
      return `
        <path d="M72 86 Q82 80 92 86" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M108 86 Q118 80 128 86" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      `
    case 'cool':
      return `
        <path d="M73 84 L93 82" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M107 82 L127 84" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
      `
    case 'humor':
      return `
        <path d="M72 84 Q82 78 92 84" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <path d="M108 80 Q118 86 128 80" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
      `
    case 'serious':
      return `
        <path d="M74 84 L92 84" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M108 84 L126 84" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
      `
  }
}

function eyeShapes(trait: PersonalityTrait): string {
  switch (trait) {
    case 'warm':
      return `
        <circle cx="82" cy="99" r="6" fill="${INK}" />
        <circle cx="118" cy="99" r="6" fill="${INK}" />
        <circle cx="84" cy="97" r="2" fill="#fff" />
        <circle cx="120" cy="97" r="2" fill="#fff" />
      `
    case 'cool':
      return `
        <path d="M74 98 Q83 93 92 98" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" />
        <path d="M108 98 Q117 93 126 98" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" />
      `
    case 'humor':
      return `
        <circle cx="82" cy="99" r="6" fill="${INK}" />
        <circle cx="84" cy="97" r="2" fill="#fff" />
        <path d="M110 99 Q118 93 126 99" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" />
      `
    case 'serious':
      return `
        <path d="M76 99 L92 99" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
        <path d="M108 99 L124 99" stroke="${INK}" stroke-width="2.5" stroke-linecap="round" />
      `
  }
}

function closedEyes(): string {
  return `
    <path d="M74 99 Q83 103 92 99" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M108 99 Q117 103 126 99" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round" />
  `
}

function mouth(trait: PersonalityTrait): string {
  switch (trait) {
    case 'warm':
      return `<path d="M86 118 Q100 128 114 118" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" />`
    case 'cool':
      return `<path d="M90 120 Q100 123 112 117" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round" />`
    case 'humor':
      return `<path d="M82 116 Q100 134 118 116 Q100 125 82 116 Z" fill="#8a4a4a" />`
    case 'serious':
      return `<path d="M90 120 L110 120" stroke="${INK}" stroke-width="3" stroke-linecap="round" />`
  }
}

function accessory(trait: PersonalityTrait): string {
  switch (trait) {
    case 'warm':
      return `
        <g transform="translate(58,54)">
          <path d="M-10 0 L0 -6 L0 6 Z" fill="#ff6fb0" />
          <path d="M10 0 L0 -6 L0 6 Z" fill="#ff6fb0" />
          <circle r="3.5" fill="#ff4f9a" />
        </g>
      `
    case 'cool':
      return `
        <circle cx="54" cy="110" r="3" fill="#e8e8ec" />
        <circle cx="146" cy="110" r="3" fill="#e8e8ec" />
      `
    case 'humor':
      return `
        <circle cx="70" cy="111" r="7" fill="#ff9aa2" opacity="0.5" />
        <circle cx="130" cy="111" r="7" fill="#ff9aa2" opacity="0.5" />
      `
    case 'serious':
      return `
        <circle cx="82" cy="99" r="15" fill="none" stroke="${INK}" stroke-width="2.5" />
        <circle cx="118" cy="99" r="15" fill="none" stroke="${INK}" stroke-width="2.5" />
        <path d="M97 99 L103 99" stroke="${INK}" stroke-width="2.5" />
        <path d="M67 97 L58 93" stroke="${INK}" stroke-width="2" />
        <path d="M133 97 L142 93" stroke="${INK}" stroke-width="2" />
      `
  }
}

export interface PortraitProps {
  vibe: AppearanceVibe
  trait?: PersonalityTrait
  blink?: boolean
}

export function renderPortraitSvg({ vibe, trait, blink = false }: PortraitProps): string {
  const style = VIBE_STYLE[vibe]
  const hair = trait ? style.hair : mute(style.hair)
  const outfit = trait ? style.outfit : mute(style.outfit)
  const skin = trait ? SKIN : mute(SKIN)
  const { back, front } = hairShapes(vibe, hair)

  const face = trait
    ? `
      ${brows(trait)}
      ${blink ? closedEyes() : eyeShapes(trait)}
      ${mouth(trait)}
      ${accessory(trait)}
    `
    : ''

  return `
<svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
  ${back}
  <path d="M38 220 Q38 162 100 156 Q162 162 162 220 Z" fill="${outfit}" />
  <rect x="88" y="130" width="24" height="26" rx="8" fill="${skin}" />
  <ellipse cx="100" cy="100" rx="46" ry="50" fill="${skin}" />
  ${face}
  ${front}
</svg>
`.trim()
}

export function portraitDataUrl(props: PortraitProps): string {
  const svg = renderPortraitSvg(props)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
