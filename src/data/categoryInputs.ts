import type { CategoryInputConfig } from '../types'

export const categoryInputs: CategoryInputConfig[] = [
  {
    category: 'income',
    title: '수입',
    prompt: '월 평균 소득(세후)은 얼마인가요?',
    unit: '만원',
    placeholder: '예: 350',
    helper: '월급, 부수입 등을 모두 합친 금액이에요',
  },
  {
    category: 'spending',
    title: '지출',
    prompt: '월 평균 지출은 얼마인가요?',
    unit: '만원',
    placeholder: '예: 180',
    helper: '고정비, 생활비를 모두 합친 금액이에요',
  },
  {
    category: 'realEstate',
    title: '부동산',
    prompt: '보유한 부동산 자산은 얼마인가요?',
    unit: '만원',
    placeholder: '예: 30000',
    helper: '자가 시세, 전세보증금 등 (없으면 0)',
  },
  {
    category: 'stocks',
    title: '주식·투자',
    prompt: '보유한 주식·투자 자산은 얼마인가요?',
    unit: '만원',
    placeholder: '예: 1000',
    helper: '주식, 펀드, 코인 등을 합친 금액 (없으면 0)',
  },
  {
    category: 'insurance',
    title: '보험',
    prompt: '매달 납입하는 보험료는 얼마인가요?',
    unit: '만원',
    placeholder: '예: 20',
    helper: '보장성 보험료 합계 (없으면 0)',
  },
]
