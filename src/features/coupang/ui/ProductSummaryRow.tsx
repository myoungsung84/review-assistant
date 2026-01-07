// src/features/coupang/ui/ProductSummaryRow.tsx
import { Stack, Typography } from '@mui/material'
import { CoupangCollectedData } from '@s/types/coupang'
import { formatNumber } from '@s/utils'

import { TextItemSub, TextItemTitle, TextMeta } from '@/components/ui'

type ProductSummaryRowProps = {
  product?: CoupangCollectedData | null
  emptyTitle?: string
  emptyDescription?: string
}

function PriceBlock({
  sale,
  original,
  discountRate,
  unitPriceText,
}: {
  sale?: number
  original?: number
  discountRate?: number
  unitPriceText?: string | null
}) {
  return (
    <Stack spacing={0.25}>
      <Stack direction="row" spacing={1} alignItems="baseline">
        <Typography variant="h6" fontWeight={700}>
          {formatNumber(sale ?? 0)}원
        </Typography>
        <Typography variant="caption" color="primary.main">
          와우할인
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="body2"
          sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
        >
          {formatNumber(original ?? 0)}원
        </Typography>
        <Typography variant="body2" color="error.main">
          {discountRate ?? 0}% 할인
        </Typography>
      </Stack>

      {unitPriceText && (
        <Typography variant="caption" color="text.secondary">
          {unitPriceText}
        </Typography>
      )}
    </Stack>
  )
}

export default function ProductSummaryRow({
  product,
  emptyTitle = '상품이 등록 되지 않았습니다',
  emptyDescription = '상품이 등록되면 여기에서 요약 정보를 확인할 수 있습니다',
}: ProductSummaryRowProps) {
  const title = product?.title ?? emptyTitle
  const description = product?.description ?? emptyDescription
  const reviewCount = product?.reviewCount ?? 0
  const ratingNumber = product?.ratingNumber ?? 0

  return (
    <Stack
      direction="column"
      spacing={1}
      minWidth={0}
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <TextItemTitle>{title}</TextItemTitle>
      {description && <TextItemSub clamp={1}>{description}</TextItemSub>}
      <Stack direction="column" spacing={0.5} minWidth={0}>
        <PriceBlock
          sale={product?.sale}
          original={product?.original}
          discountRate={product?.discountRate}
          unitPriceText={product?.unitPriceText ?? null}
        />
        <Stack direction="row" spacing={1}>
          <TextMeta>리뷰 {formatNumber(reviewCount)}개</TextMeta>
          <TextMeta>별점 {ratingNumber.toFixed(1)}점</TextMeta>
        </Stack>
      </Stack>
    </Stack>
  )
}
