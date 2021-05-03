import Unauthenticated from '@/components/Unauthenticated'
import Head from 'next/head'
import { AuthProvider } from '@/context/auth-context'
import { TaskTypeProvider } from '@/context/task-type-context'
import { UserProvider, useUser } from '@/context/user-context'
import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import '../styles/globals.css'
import theme from '../theme'

function CheckAuth({ children }) {
  const user = useUser()
  return user ? children : <Unauthenticated />
}
function MyApp({ Component, pageProps, router }) {
  const unauthenticatedRoutes = ['/login', '/register']
  return (
    <>
      <Head>
        <title>To do clone</title>
      </Head>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <UserProvider>
            {unauthenticatedRoutes.includes(router.route) ? (
              <Component {...pageProps} />
            ) : (
              <CheckAuth>
                <TaskTypeProvider>
                  <Component {...pageProps} />
                </TaskTypeProvider>
              </CheckAuth>
            )}
          </UserProvider>
        </AuthProvider>
      </ChakraProvider>
    </>
  )
}

export default MyApp
