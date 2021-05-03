import { Box } from '@chakra-ui/react'
import React from 'react'

function FullPageErrorFallback({ error }) {
  return (
    <Box
      role="alert"
      sx={{
        color: 'red.500',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <p>Uh oh... There&apos;s a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </Box>
  )
}

export default FullPageErrorFallback
