import { Button, Chip, Stack, TextField } from '@mui/material'
import { useMemo, useState } from 'react'

import { Panel } from '@/components/layout'

export default function PromptPanel() {
  // TODO: 실제 소스 상태 연결 (coupang/youtube/text 등)
  const coupangIncluded = false
  const youtubeIncludedCount = 0

  const [textInput, setTextInput] = useState('')
  const [prompt, setPrompt] = useState('')

  const canGenerate = useMemo(() => {
    // 입력이 하나라도 있으면 생성 가능
    // - 쿠팡 포함됨
    // - 유튜브 Completed 1개 이상
    // - 텍스트 입력(붙여넣기) 존재
    return coupangIncluded || youtubeIncludedCount > 0 || textInput.trim().length > 0
  }, [coupangIncluded, youtubeIncludedCount, textInput])

  const reason = useMemo(() => {
    if (canGenerate) return '생성 가능'
    return '입력 1개 이상 필요 (쿠팡 포함 / 유튜브 완료 / 텍스트 중 1개)'
  }, [canGenerate])

  return (
    <Panel
      title="Prompt"
      badge={<Chip size="small" label="Optional" variant="outlined" />}
      actions={
        <Button size="small" variant="outlined">
          Templates
        </Button>
      }
    >
      <Stack spacing={1} sx={{ height: '100%', minHeight: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Chip
            size="small"
            variant="outlined"
            label={`Using: Coupang ${coupangIncluded ? 1 : 0} · YouTube ${youtubeIncludedCount} · Text ${
              textInput.trim().length > 0 ? 1 : 0
            }`}
          />
          <Chip size="small" variant="outlined" label="Auto-prompt: ON" />
        </Stack>

        {/* (옵션) 텍스트 입력: 쿠팡/유튜브 없이도 생성 가능하게 해주는 안전장치 */}
        <TextField
          label="Text (Optional)"
          placeholder="원문/메모/후기 텍스트를 붙여넣어도 돼요 (옵션)"
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          multiline
          minRows={3}
          fullWidth
        />

        {/* 프롬프트(옵션) */}
        <TextField
          label="Prompt (Optional)"
          placeholder="원하는 톤/관점/포인트가 있으면 적어줘 (옵션)"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          multiline
          minRows={4}
          fullWidth
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ mt: 'auto' }}
        >
          <Chip
            size="small"
            variant="outlined"
            color={canGenerate ? 'success' : 'default'}
            label={reason}
          />
          <Button variant="contained" disabled={!canGenerate}>
            Generate
          </Button>
        </Stack>
      </Stack>
    </Panel>
  )
}
