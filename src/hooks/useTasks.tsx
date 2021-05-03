import firebase from '@/lib/firebase'
import { OrderTasks, SortTasks, Task } from '@/type/task'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'

interface UseTasksOptions {
  sort: SortTasks
  order: OrderTasks
  searchValue?: string
  isListPage?: boolean
  taskType?: string
  taskTypeId?: string
}
const useTasks = (userId: string, options?: UseTasksOptions) => {
  const { sort, order, searchValue, taskType, taskTypeId }: UseTasksOptions = {
    sort: options?.sort ?? null,
    order: options?.order ?? null,
    searchValue: options?.searchValue ?? '',
    taskType: options?.taskType ?? '',
    taskTypeId: options?.taskTypeId ?? ''
  }
  let orderByValue: string
  let query: firebase.firestore.Query<firebase.firestore.DocumentData> = firebase
    .firestore()
    .collection(`users/${userId}/tasks`)

  switch (taskType) {
    case 'inbox':
      query = query.where('listId', '==', 'inbox')
      break
    case 'important':
      query = query.where('important', '==', true)
      break
    case 'myday':
      query = query.where('myday', '==', true)
      break
    case 'search':
      query = query
        .where('title', '>=', searchValue)
        .where('title', '<=', `${searchValue}\uf8ff`)
        .orderBy('title', 'asc')
      break
    case 'list':
      query = query.where('listId', '==', taskTypeId)
      break
    default:
      break
  }

  if (sort) {
    switch (sort) {
      case 'added to My Day':
        orderByValue = 'myday'
        break
      case 'alphabetically':
        orderByValue = 'title'
        break
      case 'importance':
        orderByValue = 'important'
        break
      case 'created date':
        orderByValue = 'createdAt'
        break
      default:
        orderByValue = 'title'
        break
    }
    query = query.orderBy(orderByValue, order || 'asc')
  }

  const [data, isLoading, error] = useCollectionData<Task>(query, { idField: 'id' })
  const [userDocument, isLoadingUserDocument] = useDocumentData(firebase.firestore().collection(`users`).doc(userId))
  if (data) {
    if (sort || searchValue) {
      return { data, isLoading, error }
    }
    let result = []
    switch (taskType) {
      case 'myday':
      case 'important':
        result = data
        break
      case 'inbox':
        result =
          userDocument?.order?.reduce((accumulator, currentValue: string) => {
            const checkIfExist = data.find((d) => d.id === currentValue)
            if (checkIfExist) {
              accumulator = [...accumulator, checkIfExist]
            }
            return accumulator
          }, []) ?? []
        break
      case 'list':
        result =
          userDocument?.lists
            .find((list) => list.id === taskTypeId)
            .order?.reduce((accumulator, currentValue: string) => {
              const checkIfExist = data.find((d) => d.id === currentValue)
              if (checkIfExist) {
                accumulator = [...accumulator, checkIfExist]
              }
              return accumulator
            }, []) ?? []
        break
      default:
        break
    }

    return {
      data: result,
      isLoading: isLoading || isLoadingUserDocument
    }
  }
  return { data: [], isLoading }
}

export default useTasks
