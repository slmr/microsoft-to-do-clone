import updateTask from '@/lib/tasks/update-task'
import {
  Box,
  Center,
  Flex,
  Icon,
  Input,
  List,
  ListItem,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
  useColorModeValue
} from '@chakra-ui/react'
import { useCombobox, useMultipleSelection } from 'downshift'
import React, { FC, useState } from 'react'
import { IoPricetagOutline } from 'react-icons/io5'

const items = ['Orange', 'Green', 'Blue', 'Red', 'Yellow', 'Purple']

const PickCategory: FC<{ userId: string; taskId: string; values: string[] }> = ({ taskId, userId, values = [] }) => {
  const [inputValue, setInputValue] = useState('')
  const bgColorMode = useColorModeValue('white', `gray.800`)
  const hoverBgColorMode = useColorModeValue('gray.50', `gray.700`)
  const boxShadow = useColorModeValue('lg', `var(--chakra-shadows-dark-lg)`)

  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems
  } = useMultipleSelection({
    initialSelectedItems: [...values],
    onSelectedItemsChange: async ({ selectedItems }) => {
      await updateTask(userId, taskId, { categories: selectedItems })
    }
  })

  const getFilteredItems = () =>
    items.filter((item) => selectedItems.indexOf(item) < 0 && item.toLowerCase().startsWith(inputValue.toLowerCase()))

  const { isOpen, getMenuProps, getInputProps, getComboboxProps, openMenu, getItemProps } = useCombobox({
    inputValue,
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    items: getFilteredItems(),
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      // eslint-disable-next-line default-case
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true // keep the menu open after selection.
          }
      }
      return changes
    },
    onStateChange: ({ inputValue: value, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(value)
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem)
          }
          break
        default:
          break
      }
    }
  })

  return (
    <Flex align="center" bg={bgColorMode} px={3} borderRadius="sm" w="full" borderWidth="1px">
      <Box>
        <Center boxSize={6}>
          <Icon as={IoPricetagOutline} boxSize={5} color="gray.500" />
        </Center>
      </Box>
      <Box position="relative" w="100%">
        {selectedItems.length > 0 && (
          <Wrap mt={2} pl={3} pr={3}>
            {selectedItems.map((selectedItem, index) => (
              <WrapItem key={selectedItem} {...getSelectedItemProps({ selectedItem, index })}>
                <Tag variant="subtle" colorScheme={selectedItem.toLowerCase()} size="sm">
                  <TagLabel fontSize="xs">{selectedItem} category</TagLabel>
                  <TagCloseButton
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSelectedItem(selectedItem)
                    }}
                  />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        )}
        <Flex align="center" flex="1 1 0px" {...getComboboxProps()}>
          <Input
            minH="52px"
            placeholder="Pick a category"
            sx={{
              ':focus': {
                boxShadow: 'none'
              },
              '::placeholder': {
                color: 'gray.500',
                opacity: 1
              }
            }}
            border="none"
            fontSize="sm"
            w="full"
            {...getInputProps(
              getDropdownProps({
                preventKeyAction: isOpen,
                onFocus: () => {
                  if (!isOpen) {
                    openMenu()
                  }
                }
              })
            )}
            mr={2}
          />
        </Flex>

        <List
          {...getMenuProps()}
          position="absolute"
          top="calc(100% + 0.5rem)"
          left={0}
          right={0}
          borderRadius="sm"
          boxShadow={boxShadow}
          bg={bgColorMode}
          zIndex={10}
          borderWidth="1px"
          maxHeight="270px"
          overflowY="auto"
          opacity={isOpen ? 1 : 0}
          py={2}
        >
          {isOpen &&
            getFilteredItems().map((item, index) => (
              <ListItem
                key={item}
                {...getItemProps({
                  item,
                  index
                })}
              >
                <Box
                  position="relative"
                  py={2}
                  px={4}
                  cursor="pointer"
                  borderRadius="sm"
                  fontSize="sm"
                  sx={{
                    ':hover': {
                      bg: hoverBgColorMode
                    },
                    '::before': {
                      content: '""',
                      display: 'inline-block',
                      height: 3,
                      width: 3,
                      background: `${item.toLowerCase()}.100`,
                      borderColor: `${item.toLowerCase()}.300`,
                      borderWidth: '1px',
                      borderRadius: 'full',
                      mr: 4
                    }
                  }}
                >
                  {item} category
                </Box>
              </ListItem>
            ))}
        </List>
      </Box>
    </Flex>
  )
}

export default PickCategory
