import { useRightbar } from '@/context/rightbar-context'
import { useTaskType } from '@/context/task-type-context'
import { useUser } from '@/context/user-context'
import updateTask from '@/lib/tasks/update-task'
import { Task } from '@/type/task'
import {
  Box,
  Flex,
  Icon,
  IconButton,
  ListItem,
  Text,
  Tooltip,
  useColorModeValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import {
  IoCheckmarkCircle,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoRadioButtonOffOutline,
  IoStar,
  IoStarOutline,
  IoSunnyOutline
} from 'react-icons/io5'

const TaskView: FC<{
  task: Task
  index: number
  isSelected: boolean
  isDragDisabled?: boolean
  onRightClick: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, task: Task) => void
}> = ({ task, isSelected, onRightClick, index, isDragDisabled = true }) => {
  const router = useRouter()
  const { onOpen } = useRightbar()
  const user = useUser()
  const { taskType } = useTaskType()
  const isListPage = taskType.type === 'list'
  const completedSteps = task?.steps?.filter((step) => step.completed)
  async function toggleMarkCompleted() {
    await updateTask(user.uid, task.id, { completed: !task.completed })
  }
  async function toggleMarkImportant() {
    await updateTask(user.uid, task.id, { important: !task.important })
  }

  const isSelectedBg = useColorModeValue('gray.50', `gray.700`)
  const hoverBgColorMode = useColorModeValue('gray.100', `gray.600`)
  const borderborderBottomColorColorMode = useColorModeValue('gray.200', `gray.700`)
  const textColor = useColorModeValue('purple.500', 'purple.300')

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          transition="background 0.3s"
          onContextMenu={(e) => {
            router.push(
              isListPage
                ? `/tasks/list-${taskType.id}/id/${task.id}`
                : `/tasks/${
                    taskType.id === 'search' ? (task.listId === 'inbox' ? 'inbox' : `list-${task.listId}`) : taskType.id
                  }/id/${task.id}`
            )
            onOpen()
            onRightClick(e, task)
          }}
          _hover={{ bg: isSelected ? isSelectedBg : hoverBgColorMode }}
          bg={isSelected ? isSelectedBg : 'unset'}
          px={3}
          sx={{
            ':not(:last-child)': {
              borderBottomWidth: '1px',
              borderBottomColor: borderborderBottomColorColorMode
            }
          }}
          {...provided.draggableProps}
        >
          <Flex align="center">
            <Tooltip label={`Mark as ${task.completed ? 'not completed' : 'completed'}`} hasArrow>
              <Box
                position="relative"
                display="flex"
                mr={4}
                sx={{
                  ':hover': {
                    '.checkbox-complete': {
                      opacity: 1
                    }
                  }
                }}
                role="button"
                onClick={toggleMarkCompleted}
              >
                {task.completed ? (
                  <Icon as={IoCheckmarkCircle} boxSize={6} fill={textColor} />
                ) : (
                  <>
                    <Icon as={IoRadioButtonOffOutline} boxSize={6} stroke={textColor} />
                    <Icon
                      position="absolute"
                      left={0}
                      top={0}
                      opacity={0}
                      as={IoCheckmarkCircleOutline}
                      className="checkbox-complete"
                      boxSize={6}
                      stroke={textColor}
                    />
                  </>
                )}
              </Box>
            </Tooltip>
            <Box
              as="div"
              role="button"
              lineHeight="1.4"
              display="flex"
              justifyContent="center"
              alignItems="flex-start"
              flexDir="column"
              height="auto"
              minHeight="52px"
              py={2}
              flex="1 1 0px"
              fontWeight="400"
              onClick={() => {
                router.push(
                  isListPage
                    ? `/tasks/list-${taskType.id}/id/${task.id}`
                    : `/tasks/${
                        taskType.id === 'search'
                          ? task.listId === 'inbox'
                            ? 'inbox'
                            : `list-${task.listId}`
                          : taskType.id
                      }/id/${task.id}`
                )
                onOpen()
              }}
              fontSize="sm"
              whiteSpace="normal"
              wordBreak="break-word"
              {...provided.dragHandleProps}
              style={{ cursor: 'pointer' }}
            >
              <Box
                as="span"
                textAlign="left"
                textDecoration={task.completed ? 'line-through' : 'none'}
                color={task.completed ? 'gray.500' : 'inherit'}
              >
                {task.title}
              </Box>
              <Wrap
                spacing={0}
                sx={{
                  'li.task-metadata-group': {
                    display: 'flex',
                    alignItems: 'center'
                  },
                  'li.task-metadata-group:not(:last-child)': {
                    '::after': {
                      content: '"•"',
                      color: 'gray.500',
                      lineHeight: 0.9,
                      mx: 2
                    }
                  }
                }}
              >
                {task.myday && (
                  <WrapItem className="task-metadata-group">
                    <Flex alignItems="center">
                      <Icon as={IoSunnyOutline} boxSize={4} color="gray.500" mr={1} />
                      <Text fontSize="xs" color="gray.500">
                        My Day
                      </Text>
                    </Flex>
                  </WrapItem>
                )}
                {task.steps?.length > 0 && (
                  <WrapItem className="task-metadata-group">
                    <Flex align="center">
                      {completedSteps.length === task.steps.length && (
                        <Icon color="gray.500" as={IoCheckmarkOutline} mr={1} />
                      )}
                      <Text color="gray.500" fontSize="xs">
                        {completedSteps.length} of {task.steps.length}
                      </Text>
                    </Flex>
                  </WrapItem>
                )}
                {task.categories?.length > 0 && (
                  <WrapItem className="task-metadata-group">
                    <Wrap spacing={1}>
                      {task.categories.map((category) => (
                        <WrapItem
                          key={category}
                          display="flex"
                          alignItems="center"
                          position="relative"
                          cursor="pointer"
                          borderRadius="sm"
                          color={`${category.toLowerCase()}.400`}
                          fontSize="xs"
                          sx={{
                            '::before': {
                              content: '""',
                              display: 'inline-block',
                              height: 3,
                              width: 3,
                              background: `${category.toLowerCase()}.100`,
                              borderColor: `${category.toLowerCase()}.300`,
                              borderWidth: '1px',
                              borderRadius: 'full',
                              mr: 1
                            }
                          }}
                        >
                          {category} category
                        </WrapItem>
                      ))}
                    </Wrap>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
            <Tooltip label={task.important ? 'Remove importance.' : 'Mark task as important.'} hasArrow>
              <IconButton
                aria-label={task.important ? 'Remove importance.' : 'Mark task as important.'}
                variant="ghost"
                onClick={toggleMarkImportant}
                color="gray.500"
                size="sm"
                icon={
                  <Icon
                    as={task.important ? IoStar : IoStarOutline}
                    boxSize={4}
                    fill={task.important ? textColor : 'currentColor'}
                  />
                }
              />
            </Tooltip>
          </Flex>
        </ListItem>
      )}
    </Draggable>
  )
}

export default TaskView
