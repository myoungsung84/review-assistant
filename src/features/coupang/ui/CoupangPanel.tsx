import { Stack } from '@mui/material'
import type { AppEvent } from '@s/types/events/app.event'
import { isNil } from '@s/utils'
import { useCallback, useState } from 'react'

import { Panel } from '@/components/layout'
import { ActionButton, ButtonGroupBar, Thumbnail } from '@/components/ui'
import { useCoupangEvents } from '@/features/coupang/hook/useCoupangEvents'

import ProductSummaryRow from './ProductSummaryRow'

export default function CoupangPanel() {
  const [lastPublished, setLastPublished] = useState<
    Extract<AppEvent, { type: 'COUPANG_PRODUCT_PUBLISHED' }>['data'] | null
  >(null)

  const onHandlePublished = useCallback(
    (ev: Extract<AppEvent, { type: 'COUPANG_PRODUCT_PUBLISHED' }>) => {
      const data = ev.data
      if (isNil(data)) return

      setLastPublished(data)
      console.log('Coupang product published event received:', data)
    },
    [],
  )

  const { isRunning } = useCoupangEvents({
    handlers: {
      onConnected: ev => {
        console.log('Coupang SSE connected:', ev)
      },
      onCoupangProductPublished: onHandlePublished,
    },
  })

  return (
    <Panel
      title="Coupang"
      actions={
        <ButtonGroupBar>
          <ActionButton
            color={isRunning ? 'success' : 'warning'}
            label={isRunning ? 'SSE ON' : 'SSE OFF'}
          />

          <ActionButton disabled={!isRunning} label="RAW" />

          <ActionButton
            disabled={isNil(lastPublished)}
            onClick={() => setLastPublished(null)}
            label="CLEAR"
          />
        </ButtonGroupBar>
      }
    >
      <Stack direction="row" spacing={2} justifyContent={'flex-start'} alignItems={'top'}>
        <Thumbnail src={lastPublished?.ogImage ?? undefined} />
        <ProductSummaryRow product={lastPublished} />
      </Stack>
    </Panel>
  )
}
