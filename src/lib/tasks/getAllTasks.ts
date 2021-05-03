import firebase from '@/lib/firebase'
import { Task } from '@/type/task'
import { useCollectionData } from 'react-firebase-hooks/firestore'

const useGetAllTasks = (userId: string) => {
  const [data, isLoading, error] = useCollectionData<Task>(firebase.firestore().collection(`users/${userId}/tasks`), {
    idField: 'id'
  })
  return {
    data,
    isLoading,
    error
  }
}

export default useGetAllTasks
