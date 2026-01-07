import type { ComponentProps } from 'react'

import Text from './Text'

type Props = ComponentProps<typeof Text>

/**
 * 패널/영역의 최상위 제목 텍스트
 *
 * - 좌측 패널: Coupang, YouTube
 * - 우측 패널: Output
 * - 시각적으로 가장 강한 텍스트 계층
 *
 * 사용 규칙:
 * - 패널당 1회 사용
 * - body 텍스트로 대체 금지
 */
export function TextPanelTitle(props: Props) {
  return <Text variant="subtitle1" fontWeight={700} {...props} />
}

/**
 * 작은 상태/옵션 표시용 텍스트 (pill/chip 내부)
 *
 * - Optional, Empty
 * - SSE ON / OFF
 *
 * 사용 규칙:
 * - 단독 문장으로 사용하지 않음
 * - Chip / Badge / Status UI 내부 전용
 */
export function TextPillLabel(props: Props) {
  return (
    <Text variant="caption" fontWeight={600} sx={{ letterSpacing: 0.2, ...props.sx }} {...props} />
  )
}

/**
 * 리스트 아이템의 주 제목
 *
 * - 제품 설명 요약
 * - 비교 리뷰
 * - 사용기
 *
 * 사용 규칙:
 * - 한 줄 고정 (clamp=1)
 * - 리스트/카드 내부에서만 사용
 */
export function TextItemTitle(props: Props) {
  return <Text variant="body1" fontWeight={700} clamp={1} {...props} />
}

/**
 * 리스트 아이템의 보조 설명 텍스트
 *
 * - URL
 * - 부가 설명
 *
 * 사용 규칙:
 * - 항상 Title 하단에 위치
 * - 단독 사용 금지
 */
export function TextItemSub(props: Props) {
  return <Text variant="body2" color="text.secondary" clamp={1} {...props} />
}

/**
 * 보조 정보 / 메타 데이터 표시용 텍스트
 *
 * - 상태, 카운트, 출처, 부가 정보 표현
 * - UI에서 주 정보보다 한 단계 낮은 위계
 *
 * 사용 규칙:
 * - 단독 강조용 사용 금지
 * - 제목(TextPanelTitle, TextItemTitle)과 직접 경쟁 금지
 * - 항상 시각적으로 약한 톤 유지
 */
export function TextMeta(props: Props) {
  return <Text variant="caption" color="text.secondary" {...props} />
}

/**
 * 버튼 내부 텍스트
 *
 * - Clear
 * - + URL
 * - Copy / Save
 *
 * 사용 규칙:
 * - 버튼 외부 사용 금지
 * - 아이콘과 함께 사용 가능
 */
export function TextButton(props: Props) {
  return <Text variant="button" fontWeight={700} {...props} />
}

/**
 * Empty State의 메인 문구
 *
 * - "아직 생성된 결과가 없어요"
 *
 * 사용 규칙:
 * - 화면 중앙 단독 사용
 * - 강조 목적 외 사용 금지
 */
export function TextEmptyTitle(props: Props) {
  return <Text variant="h6" fontWeight={800} {...props} />
}

/**
 * Empty State의 설명 문구
 *
 * - "좌측에서 입력을 추가하고 Generate를 눌러보세요."
 *
 * 사용 규칙:
 * - TextEmptyTitle 바로 하단에만 배치
 */
export function TextEmptyBody(props: Props) {
  return <Text variant="body2" color="text.secondary" {...props} />
}

/**
 * 폼 / 패널 하단 안내 문구
 *
 * - 입력 조건
 * - 힌트 / 가이드
 *
 * 사용 규칙:
 * - 경고/에러 표현 금지
 * - 항상 secondary color 유지
 */
export function TextHint(props: Props) {
  return <Text variant="caption" color="text.secondary" {...props} />
}

/**
 * Output 패널의 결과 본문 텍스트
 *
 * - 생성된 리뷰 결과
 * - 장문 텍스트
 *
 * 사용 규칙:
 * - whiteSpace 유지
 * - 개행 포함 텍스트 전용
 */
export function TextOutputBody(props: Props) {
  return (
    <Text
      variant="body2"
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        ...props.sx,
      }}
      {...props}
    />
  )
}
