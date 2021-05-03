import { AuthProvider } from '@/context/auth-context'
import { UserProvider } from '@/context/user-context'
import { ChakraProvider } from '@chakra-ui/react'
import { render, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom'

const CustomRenderer = ({ children }) => {
  return (
    <ChakraProvider>
     {children}
    </ChakraProvider>
  )
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, {
    wrapper: CustomRenderer,
    ...options
  })

export * from '@testing-library/react'
export { customRender as render }
