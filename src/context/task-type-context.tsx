import useList from '@/hooks/useList'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useUser } from './user-context'

interface TaskType {
  id: string
  title: string
  type: string
}
type State = { taskType: TaskType; setTaskType: any }
type TaskTypeProviderProps = { children: React.ReactNode }

const TaskTypeContext = React.createContext<State | undefined>(undefined)

function TaskTypeProvider({ children }: TaskTypeProviderProps) {
  const [taskType, setTaskType] = useState<TaskType>(null)
  const router = useRouter()
  const user = useUser()
  const taskTypeQuery = router.query?.taskType?.length > 0 ? (router.query.taskType[0] as string) : ''
  const isListPage = taskTypeQuery.startsWith('list-')
  const listId = taskTypeQuery.split('list-')[1]
  const { data, isLoading } = useList(user.uid, listId)
  useEffect(() => {
    switch (taskTypeQuery) {
      case 'inbox':
        setTaskType({ type: 'inbox', id: 'inbox', title: 'Tasks' })
        break
      case 'search':
        setTaskType({ type: 'search', id: 'search', title: 'Searching for' })
        break
      case 'myday':
        setTaskType({ type: 'myday', id: 'myday', title: 'My Day' })
        break
      case 'important':
        setTaskType({ type: 'important', id: 'important', title: 'Important' })
        break
      case 'planned':
        setTaskType({ type: 'planned', id: 'planned', title: 'Planned' })
        break
      case 'assigned-to-me':
        setTaskType({ type: 'assigned-to-me', id: 'assigned-to-me', title: 'Assigned to You' })
        break
      default:
        if (isListPage && !isLoading && data) {
          setTaskType({ type: 'list', id: data?.id, title: data?.title })
        }
        if (isListPage && !isLoading && !data) {
          setTaskType({ type: null, id: null, title: null })
        }
        break
    }
  }, [data, isListPage, isLoading, listId, router.query, taskTypeQuery])

  return <TaskTypeContext.Provider value={{ taskType, setTaskType }}>{children}</TaskTypeContext.Provider>
}

function useTaskType() {
  const context = React.useContext(TaskTypeContext)
  if (context === undefined) {
    throw new Error('useTaskType must be used within a TaskTypeProvider')
  }
  return context
}
export { TaskTypeProvider, useTaskType }
