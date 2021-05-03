import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const theme = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  global: (props) => ({
    body: {
      fontFamily: 'body',
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('white', 'gray.800')(props),
      lineHeight: 'base'
    },
    '*::placeholder': {
      color: mode('gray.400', 'whiteAlpha.400')(props)
    },
    '*, *::before, &::after': {
      borderColor: mode('gray.200', 'whiteAlpha.300')(props),
      wordWrap: 'break-word'
    }
  }),
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac'
    }
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: 'none'
        }
      }
    },
    Tooltip: {
      baseStyle: {
        fontSize: 'xs'
      }
    },
    Menu: {
      baseStyle: (props) => ({
        item: {
          py: 2,
          fontSize: 'sm',
          color: mode('gray.600', 'gray.300')(props)
        }
      })
    }
  }
}
export default extendTheme(theme)
