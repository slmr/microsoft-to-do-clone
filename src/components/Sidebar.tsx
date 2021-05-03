import AddList from '@/components/list/AddList'
import { useTaskType } from '@/context/task-type-context'
import { useUser } from '@/context/user-context'
import useLists from '@/hooks/useLists'
import useGetAllTasks from '@/lib/tasks/getAllTasks'
import reorderLists from '@/lib/tasks/reorder-lists'
import { IList } from '@/type/task'
import {
  Box,
  chakra,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  Skeleton,
  useColorModeValue,
  useMediaQuery,
  useOutsideClick
} from '@chakra-ui/react'
import arrayMove from 'array-move'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import {
  IoCalendarOutline,
  IoChevronBackSharp,
  IoChevronForward,
  IoHomeOutline,
  IoListOutline,
  IoPersonOutline,
  IoStarOutline,
  IoSunnyOutline
} from 'react-icons/io5'
import SidebarMenuItem from './SidebarMenuItem'

const Sidebar = () => {
  const router = useRouter()
  const user = useUser()
  const [isLargerThanMedium] = useMediaQuery('(min-width: 48em)')
  const [openSidebar, setOpenSidebar] = useState(!!isLargerThanMedium)
  const sidebarRef = useRef<HTMLDivElement>(null)
  useOutsideClick({
    ref: sidebarRef,
    handler: () => {
      if (!isLargerThanMedium) {
        setOpenSidebar(false)
      }
    }
  })
  const { data } = useGetAllTasks(user.uid)
  const { data: lists, isLoading: isLoadingLists } = useLists(user.uid)

  const tasks = data?.filter((task) => !task.completed && task.listId === 'inbox')
  const imporantTasks = data?.filter((task) => task.important && !task.completed)
  const mydayTasks = data?.filter((task) => task.myday && !task.completed)

  const { taskType } = useTaskType()
  const bgColorMode = useColorModeValue('gray.100', `gray.700`)

  const [sortableLists, setSortableLists] = useState<IList[]>([])
  useEffect(() => {
    setSortableLists(lists)
  }, [lists])

  async function handleDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newOrderTasks = arrayMove(sortableLists, result.source.index, result.destination.index)
    setSortableLists(newOrderTasks)
    await reorderLists(user.uid, newOrderTasks)
  }
  function getCountListTasks(listId: string) {
    const count = data?.filter((task) => task.listId === listId && !task.completed).length
    return count > 0 ? count : null
  }
  return (
    <>
      <Box
        ref={sidebarRef}
        position={['absolute', 'absolute', 'relative']}
        top={0}
        left={0}
        bottom={0}
        zIndex={openSidebar ? 10 : 1}
        w={openSidebar ? ['200px', '200px', '290px'] : '50px'}
        bg={bgColorMode}
        transition="all 300ms ease"
        borderRightWidth="1px"
        overflow="hidden"
      >
        <Box pt={4} pb={2}>
          <IconButton
            maxW="50px"
            ml={1}
            aria-label="Toggle sidebar"
            variant="ghost"
            colorScheme="purple"
            onClick={() => setOpenSidebar((prev) => !prev)}
            size="md"
            icon={<Icon as={openSidebar ? IoChevronBackSharp : IoChevronForward} boxSize={5} color="purple.500" />}
          />
        </Box>
        <chakra.nav>
          <List>
            <SidebarMenuItem
              count={mydayTasks?.length}
              icon={IoSunnyOutline}
              isActive={taskType?.id === 'myday'}
              onClick={() => {
                router.push('/tasks/myday').then(() => {
                  if (!isLargerThanMedium) {
                    setOpenSidebar(false)
                  }
                })
              }}
            >
              My Day
            </SidebarMenuItem>
            <SidebarMenuItem
              count={imporantTasks?.length}
              icon={IoStarOutline}
              isActive={taskType?.id === 'important'}
              onClick={() => {
                router.push('/tasks/important').then(() => {
                  if (!isLargerThanMedium) {
                    setOpenSidebar(false)
                  }
                })
              }}
            >
              Important
            </SidebarMenuItem>
            <SidebarMenuItem
              count={tasks?.length}
              icon={IoHomeOutline}
              isActive={taskType?.id === 'inbox'}
              onClick={() => {
                router.push('/tasks/inbox').then(() => {
                  if (!isLargerThanMedium) {
                    setOpenSidebar(false)
                  }
                })
              }}
            >
              Tasks
            </SidebarMenuItem>
          </List>
          <Divider my={2} />
          {isLoadingLists ? (
            <List>
              {Array.from({ length: 2 }).map((v, index) => (
                <ListItem key={`skeleton-list-${index + 1}`} minH="32px" display="flex" alignItems="center" px={4}>
                  <Skeleton h="15px" borderRadius="full" w="15px" mr={4} />
                  <Skeleton h="15px" flex="1 1 0px" mr={4} />
                </ListItem>
              ))}
            </List>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable-lists">
                {(provided) => (
                  <List ref={provided.innerRef} {...provided.droppableProps}>
                    {sortableLists?.map((list, index) => {
                      const isActive = taskType?.id === list.id
                      return (
                        <SidebarMenuItem
                          key={list.id}
                          index={index}
                          id={list.id}
                          isDraggable
                          count={getCountListTasks(list.id)}
                          icon={IoListOutline}
                          isActive={isActive}
                          onClick={() => {
                            router.push(`/tasks/list-${list.id}`).then(() => {
                              if (!isLargerThanMedium) {
                                setOpenSidebar(false)
                              }
                            })
                          }}
                        >
                          {list.title}
                        </SidebarMenuItem>
                      )
                    })}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </chakra.nav>
        <AddList userId={user.uid} onOpenSidebar={() => setOpenSidebar(true)} />
      </Box>
      {!isLargerThanMedium && (
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.600"
          zIndex={openSidebar ? 9 : 0}
          opacity={openSidebar ? 1 : 0}
          transition="opacity 300ms ease"
          pointerEvents={openSidebar ? 'all' : 'none'}
        />
      )}
    </>
  )
}

export default Sidebar
