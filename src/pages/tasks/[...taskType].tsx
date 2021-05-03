import BackgroundLines from '@/components/BackgroundLines'
import Layout from '@/components/Layout'
import NotFound from '@/components/NotFound'
import PageTitle from '@/components/PageTitle'
import AddTask from '@/components/task/AddTask'
import TaskList from '@/components/task/TaskList'
import TaskDetail from '@/components/TaskDetail'
import TaskListSkeleton from '@/components/TaskListSkeleton'
import { useAuth } from '@/context/auth-context'
import { useTaskType } from '@/context/task-type-context'
import useTask from '@/hooks/useTask'
import useTasks from '@/hooks/useTasks'
import { OrderTasks, SortTasks } from '@/type/task'
import { chakra, Container } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

const Inbox = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<OrderTasks>(null)
  const [sortBy, setSortBy] = useState<SortTasks>(null)

  const { taskType } = useTaskType()

  const isTaskDetailPage = router.query.taskType[1] === 'id'
  const isSearchPage = taskType?.id === 'search'

  const taskId = isTaskDetailPage ? router.query.taskType[2] : null
  const { data: task } = useTask(user.uid, isTaskDetailPage ? taskId : null)

  const { data, isLoading } = useTasks(user?.uid, {
    sort: sortBy,
    order,
    searchValue: taskType?.id === 'search' ? router.query?.taskType[1] : null,
    taskType: taskType?.type,
    taskTypeId: taskType?.id
  })

  const tasks = data?.filter((task) => {
    return task.completed === false
  })
  const completedTasks = data?.filter((task) => {
    return task.completed
  })

  return (
    <Layout>
      <Head>
        <title>
          {isSearchPage
            ? `Searching for ${router.query?.taskType[1]}`
            : isTaskDetailPage
            ? `${task?.title || 'Task detail'}`
            : taskType?.title}{' '}
          - To do Clone
        </title>
      </Head>
      <chakra.main flex="1 1 0%" overflow="hidden" position="relative">
        <Container maxW="100%" height="100%" display="flex" flexDir="column" px={[2, 4, 4]}>
          {taskType && taskType?.id ? (
            <>
              <>
                <PageTitle
                  sort={sortBy}
                  onSortChange={(value) => {
                    setSortBy(value)
                    setOrder('desc')
                  }}
                  order={order}
                  setOrder={setOrder}
                />

                {isSearchPage ? null : <AddTask />}
                {isLoading ? (
                  <TaskListSkeleton />
                ) : (
                  <TaskList
                    isDragDisabled={isSearchPage || Boolean(sortBy) || ['important', 'myday'].includes(taskType?.id)}
                    tasks={isSearchPage ? data : tasks}
                    completedTasks={isSearchPage ? [] : completedTasks}
                  />
                )}
                {data?.length === 0 && isSearchPage && <NotFound type="searchValue" />}
                <BackgroundLines />
              </>
            </>
          ) : (
            <NotFound type="list" />
          )}
        </Container>
      </chakra.main>
      {taskId && <TaskDetail task={task} />}
    </Layout>
  )
}

export default Inbox
