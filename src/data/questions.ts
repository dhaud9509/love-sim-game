import type { Question } from '../types'

export const questions: Question[] = [
  {
    id: 'q1',
    scene: '소개팅 자리, 상대가 10분 늦게 도착해 미안해하며 앉는다.',
    prompt: '당신의 첫 마디는?',
    choices: [
      { text: '괜찮아요, 오시느라 고생하셨어요', trait: 'warm', weight: 2 },
      { text: '다음부턴 늦지 마세요 (웃으며)', trait: 'humor', weight: 2 },
      { text: '괜찮습니다. 주문부터 할까요?', trait: 'serious', weight: 2 },
      { text: '...(말 없이 메뉴판을 건넨다)', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q2',
    scene: '대화 중 상대가 "저 사실 좀 긴장했어요"라고 털어놓는다.',
    prompt: '당신의 반응은?',
    choices: [
      { text: '저도 그래요, 편하게 해요', trait: 'warm', weight: 2 },
      { text: '긴장하면 더 매력있는데요?', trait: 'humor', weight: 2 },
      { text: '왜 긴장하셨어요? 궁금한데요', trait: 'serious', weight: 2 },
      { text: '(살짝 웃으며 시선을 피한다)', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q3',
    scene: '식사 중 상대가 음식을 쏟을 뻔하다가 겨우 수습한다.',
    prompt: '당신은?',
    choices: [
      { text: '놀란 상대를 다독여준다', trait: 'warm', weight: 2 },
      { text: '"방금 그거 못 봤어요" 하고 웃는다', trait: 'humor', weight: 2 },
      { text: '냅킨을 조용히 건네준다', trait: 'serious', weight: 2 },
      { text: '못 본 척 딴 곳을 본다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q4',
    scene: '상대가 "취미가 뭐예요?"라고 묻는다.',
    prompt: '대답한다면?',
    choices: [
      { text: '사람 만나고 이야기 나누는 거요', trait: 'warm', weight: 2 },
      { text: '밈 수집이요, 보여드릴까요?', trait: 'humor', weight: 2 },
      { text: '요즘은 자기계발서를 읽어요', trait: 'serious', weight: 2 },
      { text: '그냥... 혼자 있는 거요', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q5',
    scene: '대화가 잠시 끊기고 어색한 침묵이 흐른다.',
    prompt: '당신의 선택은?',
    choices: [
      { text: '상대의 손을 살짝 두드리며 웃어준다', trait: 'warm', weight: 2 },
      { text: '엉뚱한 농담으로 분위기를 깬다', trait: 'humor', weight: 2 },
      { text: '"어떤 얘기 좋아하세요?"라고 묻는다', trait: 'serious', weight: 2 },
      { text: '창밖을 보며 여유롭게 기다린다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q6',
    scene: '헤어질 시간, 상대가 "다음에 또 봐요"라고 말한다.',
    prompt: '당신의 대답은?',
    choices: [
      { text: '네, 오늘 정말 즐거웠어요', trait: 'warm', weight: 2 },
      { text: '다음엔 늦지 않기로 약속해요', trait: 'humor', weight: 2 },
      { text: '연락드릴게요, 조심히 가세요', trait: 'serious', weight: 2 },
      { text: '그래요 (짧게 웃고 돌아선다)', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q7',
    scene: '며칠 후, 상대에게서 늦은 밤 문자가 온다: "자요?"',
    prompt: '답장을 한다면?',
    choices: [
      { text: '아니요, 당신 생각하고 있었어요', trait: 'warm', weight: 2 },
      { text: '자려고 했는데 당신이 깨웠네요', trait: 'humor', weight: 2 },
      { text: '아직이요, 무슨 일 있어요?', trait: 'serious', weight: 2 },
      { text: '(한참 뒤에) 아니.', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q8',
    scene: '두 번째 만남, 상대가 깜짝 선물을 건넨다.',
    prompt: '당신의 반응은?',
    choices: [
      { text: '감동한 표정으로 꼭 안아준다', trait: 'warm', weight: 2 },
      { text: '"뭐 잘못한 거 있어요?" 장난친다', trait: 'humor', weight: 2 },
      { text: '어떤 의미인지 차분히 물어본다', trait: 'serious', weight: 2 },
      { text: '살짝 당황하며 고맙다고만 한다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q9',
    scene: '상대가 다른 사람과 즐겁게 이야기하는 모습을 본다.',
    prompt: '당신의 속마음은?',
    choices: [
      { text: '저 사람도 참 다정하네, 좋은 사람이야', trait: 'warm', weight: 2 },
      { text: '나한테도 저렇게 웃어줬으면', trait: 'humor', weight: 2 },
      { text: '어떤 사이인지 자연스럽게 물어본다', trait: 'serious', weight: 2 },
      { text: '신경 쓰지 않는 척한다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q10',
    scene: '다투고 난 뒤, 상대가 먼저 "미안해"라고 연락한다.',
    prompt: '당신의 답은?',
    choices: [
      { text: '나도 미안해, 우리 얘기해보자', trait: 'warm', weight: 2 },
      { text: '화해 선물 받고 싶은데?', trait: 'humor', weight: 2 },
      { text: '뭐가 문제였는지 짚어보자', trait: 'serious', weight: 2 },
      { text: '...알겠어.', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q11',
    scene: '상대가 "먼 미래에 어떻게 살고 싶어?"라고 묻는다.',
    prompt: '당신의 대답은?',
    choices: [
      { text: '사랑하는 사람과 소소하게 살고 싶어', trait: 'warm', weight: 2 },
      { text: '매일 웃으면서 사는 거지 뭐', trait: 'humor', weight: 2 },
      { text: '구체적인 계획이 있어, 들어볼래?', trait: 'serious', weight: 2 },
      { text: '글쎄, 그때 가봐야 알지', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q12',
    scene: '상대가 "나랑 왜 만나는 거야?"라고 진지하게 묻는다.',
    prompt: '당신의 진심은?',
    choices: [
      { text: '네 옆에 있으면 마음이 편해져', trait: 'warm', weight: 2 },
      { text: '너랑 있으면 안 웃을 수가 없어', trait: 'humor', weight: 2 },
      { text: '너라는 사람 자체가 믿을만하니까', trait: 'serious', weight: 2 },
      { text: '그냥... 네가 끌려서', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q13',
    scene: '썸을 타던 중, 상대가 "우리 무슨 사이야?"라고 물어본다.',
    prompt: '당신의 대답은?',
    choices: [
      { text: '너랑 있는 지금이 좋아, 천천히 알아가고 싶어', trait: 'warm', weight: 2 },
      { text: '음... 썸 타는 사이? (웃음)', trait: 'humor', weight: 2 },
      { text: '나는 너랑 진지하게 만나고 싶어', trait: 'serious', weight: 2 },
      { text: '글쎄, 네가 정하는 대로', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q14',
    scene: '사귄 지 100일, 상대가 깜빡하고 아무 말도 꺼내지 않는다.',
    prompt: '당신의 선택은?',
    choices: [
      { text: '오늘 무슨 날인지 알아? 하고 웃으며 알려준다', trait: 'warm', weight: 2 },
      { text: '서운한 척 장난스럽게 삐진다', trait: 'humor', weight: 2 },
      { text: '솔직하게 서운한 마음을 이야기한다', trait: 'serious', weight: 2 },
      { text: '별말 없이 그냥 넘어간다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q15',
    scene: '함께 떠난 여행, 숙소 예약에 문제가 생겼다.',
    prompt: '당신은?',
    choices: [
      { text: '괜찮아, 같이 해결하면 되지 하고 다독인다', trait: 'warm', weight: 2 },
      { text: '오늘의 해프닝이네 하고 웃어넘긴다', trait: 'humor', weight: 2 },
      { text: '바로 대안을 찾아 체계적으로 해결한다', trait: 'serious', weight: 2 },
      { text: '말없이 전화기를 들고 알아본다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q16',
    scene: '상대의 친구들과 처음 만나는 자리.',
    prompt: '당신의 모습은?',
    choices: [
      { text: '먼저 다가가 친구들과 친해지려 노력한다', trait: 'warm', weight: 2 },
      { text: '분위기를 띄우는 농담을 던진다', trait: 'humor', weight: 2 },
      { text: '예의 바르게 정중히 인사한다', trait: 'serious', weight: 2 },
      { text: '상대 옆에서 조용히 지켜본다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q17',
    scene: '다툰 후 며칠째 연락이 뜸하다.',
    prompt: '당신의 행동은?',
    choices: [
      { text: '먼저 연락해서 마음을 솔직히 전한다', trait: 'warm', weight: 2 },
      { text: '가벼운 농담으로 먼저 말을 건다', trait: 'humor', weight: 2 },
      { text: '따로 시간을 내서 대화를 요청한다', trait: 'serious', weight: 2 },
      { text: '상대가 먼저 연락할 때까지 기다린다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q18',
    scene: '상대가 힘든 일로 눈물을 보인다.',
    prompt: '당신의 행동은?',
    choices: [
      { text: '꼭 안아주며 옆에 있어준다', trait: 'warm', weight: 2 },
      { text: '울다가도 웃게 만드는 농담을 건넨다', trait: 'humor', weight: 2 },
      { text: '차분히 이야기를 들어주고 해결책을 고민한다', trait: 'serious', weight: 2 },
      { text: '말없이 조용히 어깨를 빌려준다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q19',
    scene: '상대의 가족에게 처음 인사드리는 날.',
    prompt: '당신의 인사는?',
    choices: [
      { text: '밝게 웃으며 먼저 인사를 건넨다', trait: 'warm', weight: 2 },
      { text: '긴장을 풀려고 가벼운 농담을 한다', trait: 'humor', weight: 2 },
      { text: '예의와 격식을 갖춰 또박또박 인사한다', trait: 'serious', weight: 2 },
      { text: '짧고 담백하게 인사한다', trait: 'cool', weight: 2 },
    ],
  },
  {
    id: 'q20',
    scene: '상대가 "나랑 평생 함께할 수 있어?"라고 묻는다.',
    prompt: '당신의 진심은?',
    choices: [
      { text: '응, 너라면 믿고 함께하고 싶어', trait: 'warm', weight: 2 },
      { text: '평생 네 옆에서 놀려줄 거야', trait: 'humor', weight: 2 },
      { text: '어떤 미래를 그리는지 구체적으로 이야기한다', trait: 'serious', weight: 2 },
      { text: '...응 (짧게 끄덕인다)', trait: 'cool', weight: 2 },
    ],
  },
]
