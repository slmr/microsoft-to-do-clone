import firebase from '@/lib/firebase'
import { IList } from '@/type/task'

async function reorderLists(userId: string, lists: IList[]) {
  await firebase.firestore().doc(`users/${userId}`).update({ lists })
}

export default reorderLists
