import firebase from '@/lib/firebase'
import { Task } from '@/type/task'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const useTask = (userId: string, taskId: string) => {
  const [data, isLoading, error] = useDocumentData<Task>(firebase.firestore().doc(`users/${userId}/tasks/${taskId}`), {
    idField: 'id'
  })

  return { data: !isLoading ? data : null, isLoading, error }
}

export default useTask
