import { useRightbar } from '@/context/rightbar-context'
import { useTaskType } from '@/context/task-type-context'
import { useUser } from '@/context/user-context'
import useLists from '@/hooks/useLists'
import moveTask from '@/lib/tasks/moveTask'
import removeTask from '@/lib/tasks/remove-task'
import reorderTasks from '@/lib/tasks/reorder-tasks'
import updateTask from '@/lib/tasks/update-task'
import { Task } from '@/type/task'
import {
  Box,
  Button,
  Collapse,
  Divider,
  Icon,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useColorModeValue,
  useDisclosure,
  useOutsideClick
} from '@chakra-ui/react'
import arrayMove from 'array-move'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import {
  IoCheckmarkCircleOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoHomeOutline,
  IoListOutline,
  IoRadioButtonOffOutline,
  IoStarOutline,
  IoSunnyOutline,
  IoTrashOutline
} from 'react-icons/io5'
import TaskView from './TaskView'

const AlertDialog = dynamic(() => import('@/components/ConfirmAlertDialog'))

const TaskList: FC<{ tasks: Task[]; completedTasks: Task[]; isDragDisabled: boolean }> = ({
  tasks,
  completedTasks,
  isDragDisabled
}) => {
  const [sortableTasks, setSortableTasks] = useState([])
  const { taskType } = useTaskType()
  useEffect(() => {
    setSortableTasks(tasks)
  }, [tasks])
  const router = useRouter()
  const user = useUser()
  const { data: lists } = useLists(user.uid)
  const [xPos, setXPos] = useState('0px')
  const [yPos, setYPos] = useState('0px')
  const { onClose } = useRightbar()
  const alertDialog = useDisclosure()
  const completedTaksState = useDisclosure()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [selectedContextMenuTask, setSelectedContextMenuTask] = useState<Task>(null)
  const isTaskSelected = (id: string) => id === router.query?.taskType[2]
  const isListPage = taskType?.type === 'list'
  const listId = isListPage ? taskType?.id : null

  const ref = useRef()
  useOutsideClick({
    ref,
    handler: () => setShowContextMenu(false)
  })

  function handleOnRightClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>, task: Task) {
    e.preventDefault()
    setXPos(`${e.pageX}px`)
    setYPos(`${e.pageY}px`)
    setSelectedContextMenuTask(task)
    setShowContextMenu(true)
  }

  async function deleteTask() {
    await removeTask(user.uid, selectedContextMenuTask.id)
    alertDialog.onClose()
    onClose()
    setShowContextMenu(false)
  }
  async function toggleMarkImportant() {
    await updateTask(user.uid, selectedContextMenuTask.id, { important: !selectedContextMenuTask.important })
    setShowContextMenu(false)
  }
  async function toggleMarkCompleted() {
    await updateTask(user.uid, selectedContextMenuTask.id, { completed: !selectedContextMenuTask.completed })
    setShowContextMenu(false)
  }
  async function toggleAddToMyDay() {
    await updateTask(user.uid, selectedContextMenuTask.id, { myday: !selectedContextMenuTask.myday })
    setShowContextMenu(false)
  }
  async function handleMoveTask(listId: string) {
    if (listId === selectedContextMenuTask.listId) {
      setShowContextMenu(false)
      return
    }
    await moveTask({ userId: user.uid, moveToListId: listId, taskId: selectedContextMenuTask.id })
    setShowContextMenu(false)
  }

  // Reorder tasks
  async function handleDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newOrderTasks = arrayMove(sortableTasks, result.source.index, result.destination.index)
    setSortableTasks(newOrderTasks)
    const savedTasks = newOrderTasks.map((task) => task.id)
    await reorderTasks({
      userId: user.uid,
      listId,
      order: [...savedTasks, ...completedTasks.map((completedTask) => completedTask.id)]
    })
  }

  // Color mode settings
  const bg = useColorModeValue('white', `gray.700`)
  const hoverBgColorMode = useColorModeValue('gray.50', `gray.700`)
  const menuColor = useColorModeValue('gray.600', `gray.400`)
  const boxShadow = useColorModeValue('lg', `var(--chakra-shadows-dark-lg)`)

  return (
    <>
      <Box overflowX="auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable-tasks" isDropDisabled={isDragDisabled}>
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
                {sortableTasks?.map((task, index) => (
                  <TaskView
                    key={task.id}
                    isDragDisabled={isDragDisabled}
                    index={index}
                    task={task}
                    isSelected={isTaskSelected(task.id)}
                    onRightClick={handleOnRightClick}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
        {completedTasks?.length > 0 && (
          <>
            <Box px={3}>
              <Button
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                minH="52px"
                isFullWidth
                minW="100%"
                variant="unstyled"
                onClick={completedTaksState.onToggle}
              >
                <Box boxSize={6} mr={4}>
                  <Icon
                    as={completedTaksState.isOpen ? IoChevronDownOutline : IoChevronForwardOutline}
                    boxSize={5}
                    color="gray.500"
                  />
                </Box>
                Completed
              </Button>
            </Box>

            <Collapse in={completedTaksState.isOpen} animateOpacity>
              <DragDropContext onDragEnd={() => {}}>
                <Droppable droppableId="droppable-tasks-completed" isDropDisabled>
                  {(provided) => (
                    <List ref={provided.innerRef} {...provided.droppableProps}>
                      {completedTasks?.map((task, index) => (
                        <TaskView
                          key={task.id}
                          index={index}
                          task={task}
                          isSelected={isTaskSelected(task.id)}
                          onRightClick={handleOnRightClick}
                        />
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            </Collapse>
          </>
        )}
      </Box>
      {showContextMenu && selectedContextMenuTask && (
        <Portal>
          <Box
            ref={ref}
            position="absolute"
            bg={bg}
            boxShadow={boxShadow}
            borderRadius="sm"
            style={{
              top: yPos,
              left: xPos,
              opacity: 1
            }}
          >
            <List minW="230px" py={2}>
              <ListItem>
                <Button
                  fontWeight="400"
                  color={menuColor}
                  fontSize="sm"
                  isFullWidth
                  variant="ghost"
                  leftIcon={<Icon as={IoSunnyOutline} boxSize={5} color="gray.500" mr={2} />}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderRadius="sm"
                  onClick={toggleAddToMyDay}
                >
                  {selectedContextMenuTask.myday ? 'Remove from My Day' : 'Add to My Day'}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  fontWeight="400"
                  color={menuColor}
                  fontSize="sm"
                  isFullWidth
                  variant="ghost"
                  leftIcon={<Icon as={IoStarOutline} boxSize={5} color="gray.500" mr={2} />}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderRadius="sm"
                  onClick={toggleMarkImportant}
                >
                  {selectedContextMenuTask.important ? 'Remove importance' : 'Mark as important'}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  fontWeight="400"
                  color={menuColor}
                  fontSize="sm"
                  isFullWidth
                  variant="ghost"
                  leftIcon={
                    <Icon
                      as={selectedContextMenuTask.completed ? IoRadioButtonOffOutline : IoCheckmarkCircleOutline}
                      boxSize={5}
                      color="gray.500"
                      mr={2}
                    />
                  }
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderRadius="sm"
                  onClick={toggleMarkCompleted}
                >
                  {selectedContextMenuTask.completed ? 'Mark as not complete' : 'Mark as complete'}
                </Button>
              </ListItem>
              {lists.length > 0 && (
                <>
                  <Divider my={1} />
                  <ListItem>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          fontWeight="400"
                          color={menuColor}
                          fontSize="sm"
                          isFullWidth
                          variant="ghost"
                          leftIcon={<Icon as={IoListOutline} boxSize={5} color="gray.500" mr={2} />}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="center"
                          borderRadius="sm"
                        >
                          <Box flex="1 1 0" textAlign="initial">
                            Move task to...
                          </Box>
                          <Icon as={IoChevronForwardOutline} boxSize={5} color="gray.500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody px={0}>
                          <List>
                            <ListItem>
                              <Button
                                fontWeight="400"
                                color={menuColor}
                                fontSize="sm"
                                isFullWidth
                                variant="ghost"
                                leftIcon={<Icon as={IoHomeOutline} boxSize={5} color="gray.500" mr={2} />}
                                display="flex"
                                justifyContent="flex-start"
                                alignItems="center"
                                borderRadius="sm"
                                onClick={() => handleMoveTask('inbox')}
                              >
                                Tasks
                              </Button>
                            </ListItem>
                            {lists.map((list) => (
                              <ListItem key={list.id}>
                                <Button
                                  fontWeight="400"
                                  color={menuColor}
                                  fontSize="sm"
                                  isFullWidth
                                  variant="ghost"
                                  leftIcon={<Icon as={IoListOutline} boxSize={5} color="gray.500" mr={2} />}
                                  display="flex"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                  borderRadius="sm"
                                  onClick={() => handleMoveTask(list.id)}
                                >
                                  {list.title}
                                </Button>
                              </ListItem>
                            ))}
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </ListItem>
                </>
              )}

              <Divider my={1} />
              <ListItem sx={{ ':hover': { bg: hoverBgColorMode } }} cursor="pointer">
                <Button
                  fontWeight="400"
                  fontSize="sm"
                  isFullWidth
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<Icon as={IoTrashOutline} boxSize={5} mr={2} />}
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderRadius="sm"
                  onClick={() => {
                    alertDialog.onOpen()
                  }}
                >
                  Delete task
                </Button>
              </ListItem>
            </List>
          </Box>
        </Portal>
      )}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={`"${selectedContextMenuTask?.title}"  will be permanently deleted.`}
        description="You won't be able to undo this action."
        onClose={alertDialog.onClose}
        onConfirm={deleteTask}
      />
    </>
  )
}

export default TaskList
