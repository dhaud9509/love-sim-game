import type { Question } from '../types'

export const questions: Question[] = [
  // 수입
  {
    id: 'income-1',
    category: 'income',
    scene: '수입',
    prompt: '현재 월 평균 소득(세후)은 어느 구간에 가까운가요?',
    choices: [
      { text: '200만원 미만', score: 2 },
      { text: '200~350만원', score: 5 },
      { text: '350~600만원', score: 8 },
      { text: '600만원 이상', score: 10 },
    ],
  },
  {
    id: 'income-2',
    category: 'income',
    scene: '수입',
    prompt: '월급 외에 추가 수입(부업, 임대료, 배당 등)이 있나요?',
    choices: [
      { text: '전혀 없다', score: 2 },
      { text: '가끔 생기는 정도', score: 5 },
      { text: '꾸준히 소액 있다', score: 8 },
      { text: '꽤 안정적인 규모다', score: 10 },
    ],
  },
  {
    id: 'income-3',
    category: 'income',
    scene: '수입',
    prompt: '최근 3년간 내 소득의 변화는?',
    choices: [
      { text: '거의 그대로다', score: 4 },
      { text: '조금씩 올랐다', score: 6 },
      { text: '꽤 올랐다', score: 8 },
      { text: '큰 폭으로 올랐다', score: 10 },
    ],
  },
  {
    id: 'income-4',
    category: 'income',
    scene: '수입',
    prompt: '소득 대비 매달 저축·투자할 수 있는 여력은?',
    choices: [
      { text: '거의 없다', score: 2 },
      { text: '10% 정도', score: 5 },
      { text: '20~30%', score: 8 },
      { text: '30% 이상', score: 10 },
    ],
  },

  // 지출
  {
    id: 'spending-1',
    category: 'spending',
    scene: '지출',
    prompt: '매달 고정지출(월세, 구독, 할부 등)이 소득에서 차지하는 비중은?',
    choices: [
      { text: '70% 이상', score: 2 },
      { text: '50~70%', score: 5 },
      { text: '30~50%', score: 8 },
      { text: '30% 미만', score: 10 },
    ],
  },
  {
    id: 'spending-2',
    category: 'spending',
    scene: '지출',
    prompt: '계획에 없던 충동구매, 얼마나 자주 하나요?',
    choices: [
      { text: '거의 매주', score: 3 },
      { text: '한 달에 몇 번', score: 5 },
      { text: '가끔', score: 8 },
      { text: '거의 안 한다', score: 10 },
    ],
  },
  {
    id: 'spending-3',
    category: 'spending',
    scene: '지출',
    prompt: '외식·여가·쇼핑에 쓰는 지출을 어떻게 관리하나요?',
    choices: [
      { text: '딱히 신경 안 쓴다', score: 3 },
      { text: '대충 감으로 조절한다', score: 6 },
      { text: '예산을 정해둔다', score: 8 },
      { text: '가계부로 꼼꼼히 관리한다', score: 10 },
    ],
  },
  {
    id: 'spending-4',
    category: 'spending',
    scene: '지출',
    prompt: '갑자기 급전이 필요하면?',
    choices: [
      { text: '바로 빚을 내야 한다', score: 2 },
      { text: '카드론·마이너스통장을 쓴다', score: 5 },
      { text: '비상금으로 어느 정도 해결된다', score: 8 },
      { text: '비상금만으로 충분히 해결된다', score: 10 },
    ],
  },

  // 부동산
  {
    id: 'realEstate-1',
    category: 'realEstate',
    scene: '부동산',
    prompt: '현재 거주 형태는?',
    choices: [
      { text: '월세', score: 4 },
      { text: '전세', score: 6 },
      { text: '자가 (대출 많음)', score: 7 },
      { text: '자가 (대출 적거나 없음)', score: 10 },
    ],
  },
  {
    id: 'realEstate-2',
    category: 'realEstate',
    scene: '부동산',
    prompt: '투자 목적 부동산(토지, 상가, 분양권 등)을 보유하고 있나요?',
    choices: [
      { text: '없다', score: 3 },
      { text: '검토 중이다', score: 5 },
      { text: '소액으로 하나 있다', score: 8 },
      { text: '여러 개 보유 중이다', score: 10 },
    ],
  },
  {
    id: 'realEstate-3',
    category: 'realEstate',
    scene: '부동산',
    prompt: '부동산 관련 대출 상환 부담은?',
    choices: [
      { text: '소득 절반 이상 나간다', score: 3 },
      { text: '꽤 부담된다', score: 5 },
      { text: '감당할 만하다', score: 8 },
      { text: '대출이 없거나 여유롭다', score: 10 },
    ],
  },
  {
    id: 'realEstate-4',
    category: 'realEstate',
    scene: '부동산',
    prompt: '앞으로 부동산 계획은?',
    choices: [
      { text: '엄두가 안 난다', score: 3 },
      { text: '막연히 생각만 한다', score: 5 },
      { text: '구체적으로 준비 중이다', score: 8 },
      { text: '이미 추가 매입을 진행하고 있다', score: 10 },
    ],
  },

  // 주식·투자
  {
    id: 'stocks-1',
    category: 'stocks',
    scene: '주식·투자',
    prompt: '주식·펀드·ETF 투자 경험은?',
    choices: [
      { text: '해본 적 없다', score: 3 },
      { text: '소액으로 해봤다', score: 5 },
      { text: '꾸준히 하고 있다', score: 8 },
      { text: '포트폴리오를 적극 운용 중이다', score: 10 },
    ],
  },
  {
    id: 'stocks-2',
    category: 'stocks',
    scene: '주식·투자',
    prompt: '현재 투자 자산 규모는?',
    choices: [
      { text: '거의 없다', score: 2 },
      { text: '몇백만원 수준', score: 5 },
      { text: '몇천만원 수준', score: 8 },
      { text: '억 단위 이상', score: 10 },
    ],
  },
  {
    id: 'stocks-3',
    category: 'stocks',
    scene: '주식·투자',
    prompt: '투자 성향은?',
    choices: [
      { text: '손실이 무서워 안 한다', score: 3 },
      { text: '안정적인 상품 위주', score: 6 },
      { text: '적당히 분산 투자', score: 8 },
      { text: '공격적으로 수익을 노린다', score: 9 },
    ],
  },
  {
    id: 'stocks-4',
    category: 'stocks',
    scene: '주식·투자',
    prompt: '투자 수익률, 어떻게 관리하나요?',
    choices: [
      { text: '신경 쓸 여유가 없다', score: 3 },
      { text: '가끔 들여다본다', score: 5 },
      { text: '주기적으로 리밸런싱한다', score: 8 },
      { text: '철저히 분석하고 관리한다', score: 10 },
    ],
  },

  // 보험
  {
    id: 'insurance-1',
    category: 'insurance',
    scene: '보험',
    prompt: '가입한 보험은 몇 개 정도 되나요?',
    choices: [
      { text: '없다', score: 3 },
      { text: '1~2개', score: 6 },
      { text: '3~4개', score: 8 },
      { text: '필요한 보장을 꼼꼼히 갖췄다', score: 10 },
    ],
  },
  {
    id: 'insurance-2',
    category: 'insurance',
    scene: '보험',
    prompt: '보험료가 소득에서 차지하는 비중은?',
    choices: [
      { text: '전혀 모른다', score: 3 },
      { text: '부담스러운 편이다', score: 5 },
      { text: '적당한 수준이다', score: 8 },
      { text: '효율적으로 설계돼 있다', score: 10 },
    ],
  },
  {
    id: 'insurance-3',
    category: 'insurance',
    scene: '보험',
    prompt: '보장 내용을 얼마나 자주 점검하나요?',
    choices: [
      { text: '가입하고 한 번도 안 봤다', score: 3 },
      { text: '어쩌다 한 번', score: 5 },
      { text: '1년에 한 번 정도', score: 8 },
      { text: '정기적으로 점검·업데이트한다', score: 10 },
    ],
  },
  {
    id: 'insurance-4',
    category: 'insurance',
    scene: '보험',
    prompt: '은퇴·노후 대비 상품(연금저축, IRP 등)에 가입했나요?',
    choices: [
      { text: '아니다', score: 3 },
      { text: '생각만 하고 있다', score: 5 },
      { text: '소액으로 하나 있다', score: 8 },
      { text: '체계적으로 여러 개 운용 중이다', score: 10 },
    ],
  },
]
