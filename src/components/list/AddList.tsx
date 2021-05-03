import addNewList from '@/lib/lists/add-new-list'
import { Flex, Icon, IconButton, Input, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useRef, useState } from 'react'
import { IoAddOutline } from 'react-icons/io5'

const AddList: FC<{ userId: string; onOpenSidebar: VoidFunction }> = ({ userId, onOpenSidebar }) => {
  const router = useRouter()
  const newListInputRef = useRef<HTMLInputElement>(null)
  const [newListValue, setNewListValue] = useState('')
  const hoverBgColorMode = useColorModeValue('gray.50', `gray.600`)
  const textColor = useColorModeValue('purple.500', 'purple.200')
  async function handleAddNewList(e: React.KeyboardEvent<HTMLInputElement>) {
    if (newListValue === '') {
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      try {
        const newListId = await addNewList(userId, newListValue)
        setNewListValue('')
        router.push(`/tasks/list-${newListId}`)
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <Flex
      flex="1 1 0px"
      _hover={{
        bg: hoverBgColorMode
      }}
      align="center"
    >
      <IconButton
        aria-label="Add new list"
        minW="46px"
        size="md"
        background="none"
        sx={{
          ':focus,:hover,:active': {
            bg: 'none'
          }
        }}
        borderRadius="none"
        icon={<Icon as={IoAddOutline} boxSize={5} color={textColor} />}
        onClick={() => {
          onOpenSidebar()
          newListInputRef.current.focus()
        }}
      />
      <Input
        ref={newListInputRef}
        value={newListValue}
        onChange={(e) => setNewListValue(e.target.value)}
        placeholder="New list"
        border="none"
        pl={0}
        borderRadius="none"
        size="sm"
        onKeyDown={handleAddNewList}
        _hover={{
          bg: 'none'
        }}
        _focus={{
          boxShadow: 'none',
          '::placeholder': {
            color: 'gray.300',
            opacity: 1
          }
        }}
        sx={{
          '::placeholder': {
            color: textColor,
            opacity: 1
          }
        }}
      />
    </Flex>
  )
}

export default AddList
