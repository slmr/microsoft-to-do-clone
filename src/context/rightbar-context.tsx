import { useDisclosure } from '@chakra-ui/react'
import React from 'react'

type RightbarState = {
  isOpen: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
  onToggle: VoidFunction
}

const RightbarContext = React.createContext<RightbarState | undefined>(undefined)

const RightbarProvider = ({ children }) => {
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure({ defaultIsOpen: false })
  return <RightbarContext.Provider value={{ isOpen, onClose, onOpen, onToggle }}>{children}</RightbarContext.Provider>
}

function useRightbar() {
  const context = React.useContext(RightbarContext)
  if (context === undefined) {
    throw new Error('useRightbar must be used within a RightbarProvider')
  }
  return context
}
export { RightbarProvider, useRightbar }
