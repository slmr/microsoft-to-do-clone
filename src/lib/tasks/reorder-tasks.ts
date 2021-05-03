import firebase from '@/lib/firebase'
import { IList } from '@/type/task'

interface UserSnapshot {
  lists: IList[]
  order: string[]
}
async function reorderTasks({ userId, order, listId }: { userId: string; listId: string; order: string[] }) {
  const snapshot = await firebase.firestore().collection('users').doc(userId).get()
  const data = snapshot.data() as UserSnapshot
  if (listId) {
    const selectedList: IList = data.lists.find((list) => list.id === listId)
    selectedList.order = order
    return firebase.firestore().collection('users').doc(userId).set(data, { merge: true })
  }
  if (!data.order || data.order.length <= 0) {
    console.error('No tasks to move')
    return
  }
  return firebase.firestore().collection('users').doc(userId).update({ order })
}

export default reorderTasks
