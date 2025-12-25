import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Typography variant="h6" fontWeight={700}>
            Review Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Typography variant="body1">Ready.</Typography>
      </Container>
    </Box>
  )
}
