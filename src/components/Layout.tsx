import { RightbarProvider } from '@/context/rightbar-context'
import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

if (typeof window !== 'undefined') {
  console.groupCollapsed(
    '%c🙌 Site credits',
    'display:block;padding:0.125em 1em;font-family:courier;font-size:16px;font-weight:bold;line-height:2;text-transform:uppercase;background:#040d21;color:white;'
  )
  console.log(
    '%cWeb Development by Affri \n– https://t.me/affrii',
    'display:block;font-family:courier;font-size:14px;font-weight:bold;line-height:1;color:black;background:white;'
  )
  console.groupEnd()
}

const Layout: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Box display="flex" flex="1 1 0" position="relative" pl={['50px', '50px', 0]} overflow="hidden">
        <Sidebar />
        <RightbarProvider>{children}</RightbarProvider>
      </Box>
    </>
  )
}

export default Layout
