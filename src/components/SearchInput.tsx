import { Box, Button, Icon, Input, InputGroup, InputRightElement, Tooltip, UseDisclosureProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5'
import { useDebouncedCallback } from 'use-debounce'

const SearchInput: FC<Pick<UseDisclosureProps, 'isOpen' | 'onOpen' | 'onClose'>> = ({ isOpen, onOpen, onClose }) => {
  const router = useRouter()
  const debounced = useDebouncedCallback((value: string) => {
    router.push(`/tasks/search/${value}`)
  }, 1000)
  const isSearchPage = router.query?.taskType === 'search'
  const defaultValue = router.query?.taskType === 'search' ? router.query?.taskType[1] : ''

  useEffect(() => {
    if (!isSearchPage) {
      onClose()
    }
  }, [isSearchPage, onClose])

  return (
    <Box ml={[0, 0, 'auto']} mr={['auto']} display="flex" minW={['auto', 'auto', 'md']}>
      <Tooltip label="Search" hasArrow placement="left">
        <Button
          flex="1 1 0%"
          px="0.5rem !important"
          justifyContent={['center', 'center', 'flex-start']}
          isFullWidth
          variant="unstyled"
          size="sm"
          bg={isOpen ? 'white' : 'purple.100'}
          borderRadius="sm"
          borderTopRightRadius={isOpen ? 0 : 'sm'}
          borderBottomRightRadius={isOpen ? 0 : 'sm'}
          display="flex"
          onClick={onOpen}
          _hover={{
            bg: 'white'
          }}
          _focus={{
            boxShadow: 'none'
          }}
        >
          <Icon as={IoSearchOutline} color="purple.600" boxSize={4} />
        </Button>
      </Tooltip>
      {isOpen && (
        <InputGroup size="sm">
          <Input
            autoFocus
            onBlur={(e) => {
              if (!e.target.value) {
                onClose()
              }
            }}
            _focus={{
              boxShadow: 'none'
            }}
            _hover={{
              borderLeftColor: 'transparent'
            }}
            type="text"
            placeholder="Search"
            defaultValue={defaultValue}
            onChange={(e) => debounced(e.target.value)}
            bg="white"
            color="gray.900"
            variant="filled"
            pl={0}
            borderLeftColor="transparent"
            borderTopLeftRadius={isOpen ? 0 : 'md'}
            borderBottomLeftRadius={isOpen ? 0 : 'md'}
          />
          <InputRightElement>
            <Tooltip label="Exit search" hasArrow placement="bottom">
              <Button
                variant="unstyled"
                h="1.75rem"
                size="sm"
                onClick={() => {
                  router.push('/tasks/inbox').then(() => onClose())
                }}
                display="flex"
                _focus={{
                  boxShadow: 'none'
                }}
              >
                <Icon as={IoCloseOutline} color="purple.600" boxSize={4} />
              </Button>
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      )}
    </Box>
  )
}

export default SearchInput
