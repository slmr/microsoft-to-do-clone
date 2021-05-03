import firebase from '@/lib/firebase'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const useList = (userId: string, listId: string) => {
  const [data, isLoading, error] = useDocumentData(firebase.firestore().doc(`users/${userId}`), {
    idField: 'id'
  })
  return { data: data?.lists?.find((list) => list.id === listId), isLoading, error }
}

export default useList
