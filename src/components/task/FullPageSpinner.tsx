import { Center, Icon, Spinner, Text, Box } from '@chakra-ui/react'
import React from 'react'

const FullPageSpinner = () => {
  return (
    <Center height="100vh" display="flex" flexDirection="column">
      <Icon viewBox="0 0 797 797" boxSize={16} mb={6}>
        <rect width="797" height="797" rx="108" fill="#805ad5" />
        <path
          d="M666.875 232.5L378.9 562.9 260.63 444.622m-11.57 119.56L129.5 444.622M535.745 232.5L372.476 420.2"
          fill="none"
          stroke="#fff"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="44"
        />
      </Icon>
      <Spinner thickness="3px" speed="0.65s" emptyColor="gray.200" color="purple.500" size="lg" mb={6} />
      <Text>
        Microsoft To do <br />
        clone by 🚀 <Box as="strong">Affri</Box>
      </Text>
    </Center>
  )
}

export default FullPageSpinner
