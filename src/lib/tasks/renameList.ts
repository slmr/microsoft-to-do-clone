import firebase from '@/lib/firebase'
import { IList } from '@/type/task'

async function renameList(userId: string, lists: IList[]) {
  const updatedList = await firebase.firestore().doc(`users/${userId}`).update({
    lists
  })
  return updatedList
}

export default renameList
