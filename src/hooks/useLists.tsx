import firebase from '@/lib/firebase'
import { IList } from '@/type/task'
import { useDocumentData } from 'react-firebase-hooks/firestore'

const useLists = (userId: string): { data: IList[]; isLoading: boolean } => {
  const [data, isLoading] = useDocumentData(firebase.firestore().doc(`users/${userId}`), {
    idField: 'id'
  })
  return { data: data?.lists, isLoading }
}

export default useLists
