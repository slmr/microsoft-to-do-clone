import { chakra, ChakraProps } from '@chakra-ui/react'
import Nextlink, { LinkProps } from 'next/link'
import * as React from 'react'

const Link: React.FC<LinkProps & ChakraProps & { className?: string; onClick?: VoidFunction }> = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  ...props
}) => {
  return (
    <Nextlink href={href} as={as} replace={replace} scroll={scroll} shallow={shallow} prefetch={prefetch} passHref>
      <chakra.a {...props}>{children}</chakra.a>
    </Nextlink>
  )
}

export default Link
