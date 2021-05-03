import { useTaskType } from '@/context/task-type-context'
import { useUser } from '@/context/user-context'
import useLists from '@/hooks/useLists'
import deleteList from '@/lib/tasks/delete-list'
import renameList from '@/lib/tasks/renameList'
import { OrderTasks, SortTasks } from '@/type/task'
import {
  Box,
  Button,
  chakra,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Skeleton,
  Tooltip,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, SetStateAction, useEffect, useState } from 'react'
import {
  IoCalendarOutline,
  IoCheckmarkCircleOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCloseOutline,
  IoEllipsisHorizontal,
  IoPrintOutline,
  IoStarOutline,
  IoSunnyOutline,
  IoSwapVerticalOutline,
  IoTrashOutline
} from 'react-icons/io5'

const AlertDialog = dynamic(() => import('@/components/ConfirmAlertDialog'))

const PageTitle: FC<{
  onSortChange?: (sortValue: SortTasks) => void
  sort: SortTasks
  order: OrderTasks
  setOrder: React.Dispatch<SetStateAction<OrderTasks>>
}> = ({ onSortChange, sort, order, setOrder }) => {
  const { taskType } = useTaskType()
  const confirmAlert = useDisclosure()
  const router = useRouter()
  const isSearchPage = taskType?.id === 'search'
  const isListPage = taskType?.type === 'list'
  const user = useUser()
  const [value, setValue] = useState('')
  const { data } = useLists(user.uid)

  async function handleDeleteList() {
    await deleteList(user.uid, taskType.id)
    router.push('/tasks/inbox')
    confirmAlert.onClose()
  }

  async function handleSubmit() {
    if (value !== taskType.title) {
      const updateLists = data.map((list) => {
        if (list.id === taskType.id) {
          return {
            ...list,
            title: value
          }
        }
        return list
      })
      await renameList(user.uid, updateLists)
    }
  }
  useEffect(() => {
    setValue(isSearchPage ? `Searching for "${router.query.taskType[1] ?? ''}"` : taskType?.title ?? '')
  }, [isSearchPage, router.query.task, router.query.taskType, taskType?.title])
  const textColor = useColorModeValue('purple.500', 'purple.200')
  const textColorRed = useColorModeValue('red.500', 'red.200')
  return (
    <>
      <Flex justify="space-between" align="center" pt={6} pb={2} px={2}>
        <Flex align="center" overflow="hidden">
          {isListPage ? (
            value ? (
              <Tooltip label="Rename list" hasArrow placement="top" closeOnClick>
                <Editable
                  mr={1}
                  overflow="hidden"
                  position="relative"
                  display="flex"
                  alignItems="center"
                  value={value}
                  onChange={(e) => setValue(e)}
                  onSubmit={handleSubmit}
                  fontSize="xl"
                  fontWeight="500"
                  sx={{
                    ':hover': {
                      '.rename-list': {
                        opacity: 1,
                        display: 'flex'
                      }
                    }
                  }}
                >
                  <EditablePreview
                    px={2}
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    color={textColor}
                    m="1px"
                  />
                  <EditableInput
                    textAlign="left"
                    borderRadius="sm"
                    _focus={{ boxShadow: 'rgb(74, 85, 104) 0px 0px 0px 1px' }}
                    px={2}
                    color={isListPage ? 'gray.500' : textColor}
                    size={isListPage ? value?.length : value?.length - 3}
                    maxLength={255}
                    m="1px"
                  />
                </Editable>
              </Tooltip>
            ) : (
              <Skeleton h="20px" width="100px" />
            )
          ) : (
            <chakra.h1
              fontSize="xl"
              fontWeight="500"
              px={2}
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              color={textColor}
            >
              {value}
            </chakra.h1>
          )}
          {!isSearchPage && (
            <Menu autoSelect={false}>
              <Tooltip label="List options" hasArrow closeOnClick placement="top">
                <MenuButton
                  as={IconButton}
                  variant="ghost"
                  colorScheme="purple"
                  aria-label="List options"
                  size="sm"
                  icon={<Icon as={IoEllipsisHorizontal} boxSize={4} />}
                />
              </Tooltip>
              <MenuList>
                <MenuGroup title="List options">
                  <MenuItem iconSpacing={4} icon={<Icon as={IoPrintOutline} boxSize={4} />}>
                    Print list
                  </MenuItem>
                </MenuGroup>
                {isListPage && (
                  <>
                    <MenuDivider />
                    <MenuItem
                      iconSpacing={4}
                      icon={<Icon as={IoTrashOutline} boxSize={4} />}
                      color={textColorRed}
                      onClick={confirmAlert.onOpen}
                    >
                      Delete
                    </MenuItem>
                  </>
                )}
              </MenuList>
            </Menu>
          )}
        </Flex>
        {!['planned', 'assigned-to-me', 'important'].includes(taskType?.id) && (
          <HStack>
            <Menu placement="bottom" autoSelect={false}>
              <MenuButton
                as={Button}
                variant="ghost"
                colorScheme="purple"
                size="sm"
                leftIcon={isSearchPage ? null : <Icon as={IoSwapVerticalOutline} boxSize={5} />}
              >
                {isSearchPage ? 'Options' : 'Sort'}
              </MenuButton>
              <MenuList>
                <MenuGroup title={isSearchPage ? 'Options' : 'Sort by'}>
                  {isSearchPage ? (
                    <MenuItem iconSpacing={4} icon={<Icon as={IoCheckmarkCircleOutline} boxSize={4} />}>
                      Show completed tasks (todo)
                    </MenuItem>
                  ) : (
                    <>
                      <MenuItem
                        iconSpacing={4}
                        onClick={() => onSortChange('importance')}
                        icon={<Icon as={IoStarOutline} boxSize={4} />}
                      >
                        Importance
                      </MenuItem>
                      {taskType?.id === 'myday' ? null : (
                        <MenuItem
                          iconSpacing={4}
                          onClick={() => onSortChange('added to My Day')}
                          icon={<Icon as={IoSunnyOutline} boxSize={4} />}
                        >
                          Added to My Day
                        </MenuItem>
                      )}
                      <MenuItem
                        iconSpacing={4}
                        onClick={() => onSortChange('alphabetically')}
                        icon={<Icon as={IoSwapVerticalOutline} boxSize={4} />}
                      >
                        Alphabetically
                      </MenuItem>
                      <MenuItem
                        iconSpacing={4}
                        onClick={() => onSortChange('created date')}
                        icon={<Icon as={IoCalendarOutline} boxSize={4} />}
                      >
                        Creation Date
                      </MenuItem>
                    </>
                  )}
                </MenuGroup>
              </MenuList>
            </Menu>
          </HStack>
        )}
      </Flex>
      {!isSearchPage && sort && (
        <Flex py={2} px={2} justify="flex-end">
          <Flex align="center">
            <IconButton
              aria-label="Reverse sort order"
              variant="ghost"
              colorScheme="purple"
              size="sm"
              icon={<Icon as={order === 'desc' ? IoChevronDownOutline : IoChevronUpOutline} />}
              onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            />
            <Box as="span" fontSize="xs" fontWeight="500" mx={1}>
              Sort by {sort}
            </Box>
            <IconButton
              aria-label="Remove sort order option"
              variant="ghost"
              colorScheme="purple"
              size="sm"
              onClick={() => {
                onSortChange(null)
                setOrder(null)
              }}
              icon={<Icon as={IoCloseOutline} />}
            />
          </Flex>
        </Flex>
      )}

      <AlertDialog
        isOpen={confirmAlert.isOpen}
        title={`"${value}"  will be permanently deleted.`}
        description="You won't be able to undo this action."
        onClose={confirmAlert.onClose}
        confirmText="Delete list"
        onConfirm={handleDeleteList}
      />
    </>
  )
}

export default PageTitle
