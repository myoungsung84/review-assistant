import { Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'

import { Panel } from '@/components/layout'
import { ScrollArea } from '@/components/ui'

import DraftOutput from './DraftOutput'

type ResultStatus = 'EMPTY' | 'LOADING' | 'DONE' | 'ERROR'

export default function ResultPanel() {
  // TODO: 실제 생성 상태 연결
  const [status, _setStatus] = useState<ResultStatus>('EMPTY')
  const [draftText, _setDraftText] = useState<string>('')

  return (
    <Panel
      title="Output"
      actions={
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" disabled={status !== 'DONE'}>
            Copy
          </Button>
          <Button size="small" variant="outlined" disabled={status !== 'DONE'}>
            Save
          </Button>
        </Stack>
      }
    >
      <ScrollArea>
        {status === 'EMPTY' && <EmptyState />}
        {status === 'LOADING' && <LoadingState />}
        {status === 'ERROR' && <ErrorState />}
        {status === 'DONE' && <DraftOutput text={draftText} />}
      </ScrollArea>
    </Panel>
  )
}

function EmptyState() {
  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
      spacing={0.5}
    >
      <Typography sx={{ fontWeight: 700 }}>아직 생성된 결과가 없어요</Typography>
      <Typography variant="body2" color="text.secondary">
        좌측에서 입력을 추가하고 Generate를 눌러보세요.
      </Typography>
    </Stack>
  )
}

function LoadingState() {
  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
      spacing={0.75}
    >
      <Typography sx={{ fontWeight: 700 }}>생성 중…</Typography>
      <Typography variant="body2" color="text.secondary">
        입력을 바탕으로 초안을 만들고 있어요.
      </Typography>
    </Stack>
  )
}

function ErrorState() {
  return (
    <Stack
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center',
      }}
      spacing={0.75}
    >
      <Typography sx={{ fontWeight: 700 }}>생성 실패</Typography>
      <Typography variant="body2" color="text.secondary">
        잠시 후 다시 시도해 주세요.
      </Typography>
      <Button variant="outlined" size="small" sx={{ mt: 1 }}>
        Retry
      </Button>
    </Stack>
  )
}
