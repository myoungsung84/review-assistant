import { Box, Stack, Typography } from '@mui/material'

export default function CoupangSourceView() {
  return (
    <Box
      sx={{
        mt: 0.5,
        p: 1.25,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.75}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Preview
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          - 요약: (예시) 배송 빠르고 조립 쉬움. 소음은 생각보다 있음…
          {'\n'}- 주요 포인트: 내구성 / 소음 / 세척 / 크기
        </Typography>
      </Stack>
    </Box>
  )
}
