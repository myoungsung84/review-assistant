import { Stack } from '@mui/material'

import { SplitLayout } from '@/components/layout'
import { CoupangPanel } from '@/features/coupang'
import { PromptPanel, ResultPanel } from '@/features/result'
import { YoutubePanel } from '@/features/youtube'

export default function HomePage() {
  return (
    <Stack p={1.5}>
      <SplitLayout
        left={
          <Stack spacing={1.5} direction={'column'}>
            <CoupangPanel />
            <YoutubePanel />
            <PromptPanel />
          </Stack>
        }
        right={<ResultPanel />}
      />
    </Stack>
  )
}
