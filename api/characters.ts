// Self-contained copy of src/data/characters.ts for the /api/og serverless
// function — see the note in ./portrait.ts for why this isn't imported
// from ../src. Keep in sync if the character roster changes.

import type { AppearanceVibe, PersonalityTrait } from './portrait.js'

export interface CharacterProfile {
  key: string
  trait: PersonalityTrait
  vibe: AppearanceVibe
  name: string
  tagline: string
  line: string
  gradient: [string, string]
  tier: string
}

export const traitLabels: Record<PersonalityTrait, string> = {
  warm: '다정함',
  cool: '시크함',
  humor: '유쾌함',
  serious: '진지함',
}

export const vibeLabels: Record<AppearanceVibe, string> = {
  cute: '귀여운',
  chic: '시크한',
  elegant: '우아한',
  bright: '발랄한',
}

const profiles: CharacterProfile[] = [
  { key: 'warm-cute', trait: 'warm', vibe: 'cute', name: '하늘', tagline: '보고 있으면 저절로 웃음이 나는, 다정하고 귀여운 사람', line: '오늘도 네가 웃으니까 나도 좋다.', gradient: ['#ff9a9e', '#fecfef'], tier: '일반' },
  { key: 'warm-chic', trait: 'warm', vibe: 'chic', name: '서윤', tagline: '차가워 보이지만 당신 앞에서만 다정해지는 반전 매력', line: '남들한텐 안 그런데, 너한테만 이래.', gradient: ['#30cfd0', '#330867'], tier: '에픽' },
  { key: 'warm-elegant', trait: 'warm', vibe: 'elegant', name: '지안', tagline: '단정한 분위기 속에 숨겨진 깊은 다정함을 가진 사람', line: '천천히, 그래도 꾸준히 너를 아껴줄게.', gradient: ['#a18cd1', '#fbc2eb'], tier: '레어' },
  { key: 'warm-bright', trait: 'warm', vibe: 'bright', name: '도윤', tagline: '만나는 순간부터 분위기를 밝게 만드는 다정한 에너지', line: '너랑 있으면 하루가 다 재밌어져!', gradient: ['#f6d365', '#fda085'], tier: '일반' },

  { key: 'cool-cute', trait: 'cool', vibe: 'cute', name: '유나', tagline: '시크한 척하지만 웃을 때만큼은 못 숨기는 귀여움', line: '...딱히 좋아서 그런 거 아니야. (웃음 참는 중)', gradient: ['#fbc2eb', '#a6c1ee'], tier: '에픽' },
  { key: 'cool-chic', trait: 'cool', vibe: 'chic', name: '이안', tagline: '처음부터 끝까지 완벽하게 시크한, 쉽게 곁을 주지 않는 사람', line: '기대는 안 해. 근데 넌 좀 다르네.', gradient: ['#2b5876', '#4e4376'], tier: '일반' },
  { key: 'cool-elegant', trait: 'cool', vibe: 'elegant', name: '수아', tagline: '말보다 분위기로 말하는, 우아하고 시크한 사람', line: '말 안 해도 알아줬으면 하는 게 있어.', gradient: ['#667eea', '#764ba2'], tier: '레어' },
  { key: 'cool-bright', trait: 'cool', vibe: 'bright', name: '준서', tagline: '시크해 보이지만 당신 앞에서는 의외로 발랄해지는 사람', line: '시크한 척은 끝, 너랑 있을 땐 그냥 신나.', gradient: ['#43e97b', '#38f9d7'], tier: '레어' },

  { key: 'humor-cute', trait: 'humor', vibe: 'cute', name: '다은', tagline: '장난기 가득한 표정으로 매일을 웃게 만드는 귀여운 사람', line: '오늘의 할 일: 너 웃기기. 완료!', gradient: ['#ffecd2', '#fcb69f'], tier: '일반' },
  { key: 'humor-chic', trait: 'humor', vibe: 'chic', name: '태현', tagline: '시크한 얼굴로 던지는 농담에 매번 웃게 되는 사람', line: '무표정으로 던지는 드립, 믿고 가자.', gradient: ['#0f2027', '#2c5364'], tier: '레어' },
  { key: 'humor-elegant', trait: 'humor', vibe: 'elegant', name: '세은', tagline: '우아한 분위기 속에 깜짝 반전 유머를 숨긴 사람', line: '우아하게... 라고 쓰고 엉뚱하게 읽는다.', gradient: ['#c471f5', '#fa71cd'], tier: '에픽' },
  { key: 'humor-bright', trait: 'humor', vibe: 'bright', name: '민준', tagline: '어디서든 분위기 메이커, 텐션 100%의 유쾌한 사람', line: '텐션 100, 너도 같이 올려줄게!', gradient: ['#f78ca0', '#f9748f'], tier: '일반' },

  { key: 'serious-cute', trait: 'serious', vibe: 'cute', name: '하린', tagline: '진지한 눈빛과 귀여운 외모의 희귀한 조합을 가진 사람', line: '귀엽다는 말, 사실 되게 진지하게 듣고 있어.', gradient: ['#ff6a88', '#ff99ac'], tier: '레전더리' },
  { key: 'serious-chic', trait: 'serious', vibe: 'chic', name: '지호', tagline: '모든 말에 무게가 있는, 진지하고 시크한 사람', line: '가볍게 안 해. 너한테는 특히 더.', gradient: ['#232526', '#414345'], tier: '레어' },
  { key: 'serious-elegant', trait: 'serious', vibe: 'elegant', name: '채원', tagline: '한마디 한마디가 품격 있는, 진지하고 우아한 사람', line: '말에는 책임을 담아야 한다고 생각해.', gradient: ['#536976', '#292e49'], tier: '일반' },
  { key: 'serious-bright', trait: 'serious', vibe: 'bright', name: '은우', tagline: '진지한 속마음과 밝은 겉모습이 공존하는 보기 드문 사람', line: '밝아 보여도, 네 앞에선 다 진심이야.', gradient: ['#fdbb2d', '#22c1c3'], tier: '레전더리' },
]

export const characterPool: Record<string, CharacterProfile> = profiles.reduce(
  (acc, profile) => {
    acc[profile.key] = profile
    return acc
  },
  {} as Record<string, CharacterProfile>,
)
