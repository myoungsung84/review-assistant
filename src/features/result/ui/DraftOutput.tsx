import { Stack, Typography } from '@mui/material'

export default function DraftOutput({ text }: { text: string }) {
  return (
    <Stack spacing={1}>
      {/* 나중에 섹션 렌더러(고민/사용/장단점/총평)로 확장하기 쉽게 분리 */}
      <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{text}</Typography>
    </Stack>
  )
}
