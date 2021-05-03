import { useRightbar } from '@/context/rightbar-context'
import { useUser } from '@/context/user-context'
import removeTask from '@/lib/tasks/remove-task'
import updateTask from '@/lib/tasks/update-task'
import { Task } from '@/type/task'
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Input,
  List,
  ListItem,
  Skeleton,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  useOutsideClick,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'
import { format, isToday } from 'date-fns'
import dynamic from 'next/dynamic'
import React, { FC, useEffect, useRef } from 'react'
import {
  IoAttachOutline,
  IoCalendarOutline,
  IoCloseOutline,
  IoExitOutline,
  IoNotificationsCircleOutline,
  IoRepeatOutline,
  IoSunnyOutline,
  IoTrashOutline
} from 'react-icons/io5'
import EditableTask from '@/components/task/EditableTask'
import PickCategory from '@/components/task/PickCategory'
import TaskNote from '@/components/task/TaskNote'
import Steps from '@/components/task/steps/Steps'

const AlertDialog = dynamic(() => import('@/components/ConfirmAlertDialog'))

const DetailTaskSidebar: FC<{ task: Task }> = ({ task }) => {
  const {
    isOpen: isOpenAlertDeleteTask,
    onOpen: onOpenAlertDeleteTask,
    onClose: onCloseAlertDeleteTask
  } = useDisclosure()
  const [isLargerThanMedium] = useMediaQuery('(min-width: 48em)')
  const { isOpen, onClose, onOpen } = useRightbar()
  const user = useUser()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // default open when refresh page
  useEffect(() => {
    if (task) {
      onOpen()
    }
  }, [task, onOpen])

  useOutsideClick({
    ref: sidebarRef,
    handler: () => {
      if (!isLargerThanMedium) {
        onClose()
      }
    }
  })

  async function handleRemoveTask() {
    await removeTask(user.uid, task?.id)
    onCloseAlertDeleteTask()
    onClose()
  }

  async function toggleAddedToMyDay() {
    await updateTask(user.uid, task.id, { myday: !task.myday })
  }

  const bg = useColorModeValue('gray.100', `gray.700`)
  const childrenBg = useColorModeValue('white', `gray.800`)
  const hoverBgColor = useColorModeValue('gray.50', `gray.700`)
  const color = useColorModeValue('purple.500', `purple.200`)

  return (
    <>
      <Box
        ref={sidebarRef}
        display={isOpen ? 'flex' : 'none'}
        flexDirection="column"
        position={['absolute', 'absolute', 'relative']}
        top={0}
        right={0}
        bottom={0}
        zIndex={isLargerThanMedium ? 0 : 11}
        borderLeftWidth="1px"
        bg={bg}
        w={isOpen ? ['calc(100% - 80px)', '360px', '360px'] : 0}
      >
        <>
          <VStack p={4} flex="1" overflowX="hidden" overflowY="auto" spacing={4} align="flex-start">
            {/* Input field */}
            <Box boxShadow="sm" w="100%" bg={childrenBg} borderWidth="1px" borderRadius="sm">
              <EditableTask task={task} userId={user.uid} />
              <Steps userId={user.uid} taskId={task?.id} steps={task?.steps} />
            </Box>

            {/* Add to my day */}
            <Flex
              align="center"
              borderRadius="sm"
              borderWidth="1px"
              w="full"
              sx={{
                ':hover': {
                  bg: hoverBgColor,
                  '.remove-button': {
                    opacity: 1
                  }
                }
              }}
              bg={childrenBg}
              boxShadow="sm"
            >
              <Button
                pl={3}
                pr={3}
                variant="unstyled"
                borderRadius="sm"
                minH="52px"
                isFullWidth
                display="flex"
                justifyContent="flex-start"
                flex="1 1 0px"
                color={task?.myday ? color : 'gray.600'}
                fontWeight="400"
                fontSize="sm"
                onClick={toggleAddedToMyDay}
              >
                <Box>
                  <Center boxSize={6}>
                    <Icon as={IoSunnyOutline} boxSize={5} />
                  </Center>
                </Box>
                <Box as="span" px={3}>
                  {task?.myday ? 'Added' : 'Add'} to My Day
                </Box>
              </Button>
              {task?.myday ? (
                <Tooltip label="Remove from My Day" hasArrow>
                  <IconButton
                    className="remove-button"
                    opacity={0}
                    display="flex"
                    variant="unstyled"
                    aria-label="Remove from My Day"
                    onClick={toggleAddedToMyDay}
                    icon={<IoCloseOutline />}
                  />
                </Tooltip>
              ) : null}
            </Flex>

            {/* Remind me */}
            <List
              borderWidth="1px"
              boxShadow="sm"
              borderRadius="sm"
              bg={childrenBg}
              w="full"
              sx={{
                'li:hover': {
                  bg: hoverBgColor
                },
                'li:not(:last-child)': {
                  borderBottomWidth: '1px'
                }
              }}
            >
              <ListItem>
                <Button
                  variant="unstyled"
                  borderRadius="sm"
                  isFullWidth
                  display="flex"
                  justifyContent="flex-start"
                  pl={3}
                  pr={3}
                  bg="none"
                  color="gray.500"
                  fontWeight="400"
                  fontSize="sm"
                  minH="52px"
                >
                  <Box>
                    <Center boxSize={6}>
                      <Icon as={IoNotificationsCircleOutline} boxSize={5} />
                    </Center>
                  </Box>
                  <Box as="span" px={3}>
                    Remind me
                  </Box>
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  variant="unstyled"
                  borderRadius="sm"
                  minH="52px"
                  isFullWidth
                  display="flex"
                  justifyContent="flex-start"
                  pl={3}
                  pr={3}
                  bg="none"
                  color="gray.500"
                  fontWeight="400"
                  fontSize="sm"
                >
                  <Box>
                    <Center boxSize={6}>
                      <Icon as={IoCalendarOutline} boxSize={5} />
                    </Center>
                  </Box>
                  <Box as="span" px={3}>
                    Add due date
                  </Box>
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  variant="unstyled"
                  borderRadius="sm"
                  minH="52px"
                  isFullWidth
                  display="flex"
                  justifyContent="flex-start"
                  pl={3}
                  pr={3}
                  bg="none"
                  color="gray.500"
                  fontWeight="400"
                  fontSize="sm"
                >
                  <Box>
                    <Center boxSize={6}>
                      <Icon as={IoRepeatOutline} boxSize={5} />
                    </Center>
                  </Box>
                  <Box as="span" px={3}>
                    Repeat
                  </Box>
                </Button>
              </ListItem>
            </List>

            {/* Pick catergory */}
            {task ? (
              <PickCategory userId={user?.uid} taskId={task.id} values={task.categories} />
            ) : (
              <Skeleton h="52px" />
            )}

            {/* Add file */}
            <Flex
              align="center"
              borderRadius="sm"
              w="full"
              minH="52px"
              borderWidth="1px"
              p={3}
              bg={childrenBg}
              boxShadow="sm"
              color="gray.500"
              sx={{
                ':hover': {
                  bg: hoverBgColor
                }
              }}
            >
              <Box>
                <Center boxSize={6}>
                  <Icon as={IoAttachOutline} boxSize={5} />
                </Center>
              </Box>
              <Box as="label" cursor="pointer" fontSize="sm" px={3}>
                Add file
                <Input type="file" placeholder="Add file" visibility="hidden" display="none" fontSize="sm" />
              </Box>
            </Flex>
            {/* Add comment */}
            <TaskNote initialValue={task?.note} onSave={(value) => updateTask(user?.uid, task?.id, { note: value })} />
          </VStack>
          <Flex borderTopWidth="1px" px={2} py={1} w="full" justify="space-between" alignItems="center">
            <Tooltip label="Hide detail view" hasArrow>
              <IconButton
                variant="ghost"
                aria-label="Hide detail view"
                icon={<Icon as={IoExitOutline} boxSize={4} />}
                onClick={onClose}
              />
            </Tooltip>
            <Text fontSize="sm" color="gray.500">
              {task && (
                <>
                  {isToday(task.createdAt.toDate())
                    ? 'Created today'
                    : `Created on ${format(task.createdAt.toDate(), 'PP')}`}
                </>
              )}
            </Text>
            <Tooltip label="Delete task" hasArrow>
              <IconButton
                variant="ghost"
                aria-label="Delete task"
                icon={<Icon as={IoTrashOutline} boxSize={4} />}
                onClick={onOpenAlertDeleteTask}
              />
            </Tooltip>
          </Flex>
        </>
      </Box>
      {task && (
        <AlertDialog
          isOpen={isOpenAlertDeleteTask}
          title={`"${task?.title}"  will be permanently deleted.`}
          description="You won't be able to undo this action."
          onClose={onCloseAlertDeleteTask}
          onConfirm={handleRemoveTask}
        />
      )}

      {!isLargerThanMedium && (
        <Box
          zIndex={10}
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.600"
          opacity={isOpen ? 1 : 0}
          transition="opacity 300ms ease"
          pointerEvents={isOpen ? 'all' : 'none'}
        />
      )}
    </>
  )
}

export default DetailTaskSidebar
