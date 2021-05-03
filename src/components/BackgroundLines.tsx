import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const BackgroundLines = () => {
  const background = useColorModeValue(
    `linear-gradient(180deg, white, white 52px, var(--chakra-colors-gray-200) 52px, var(--chakra-colors-gray-200) 52px)`,
    `linear-gradient(180deg, var(--chakra-colors-gray-800) , var(--chakra-colors-gray-800) 52px, var(--chakra-colors-gray-700) 52px, var(--chakra-colors-gray-700) 52px)`
  )
  const boxShadow = useColorModeValue(
    `inset 0 1px 0 0 var(--chakra-colors-gray-200)`,
    `inset 0 1px 0 0 var(--chakra-colors-gray-700) `
  )

  return (
    <Box
      sx={{
        flex: 1,
        background,
        backgroundSize: '100% 53px',
        boxShadow
      }}
    />
  )
}

export default BackgroundLines
