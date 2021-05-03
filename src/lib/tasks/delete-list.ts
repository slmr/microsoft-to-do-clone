import firebase from '@/lib/firebase'
import { IList } from '@/type/task'

async function deleteList(userId: string, listId: string) {
  const firestore = firebase.firestore()
  try {
    const user = await firestore.doc(`users/${userId}`).get()
    const lists: IList[] = await user.data().lists
    const tasksIds: string[] = await user.data().tasksIds
    const selectedlist = lists.find((list) => list.id === listId)
    const batch = firestore.batch()
    const tasksWithSelectedListSnapshot = await firestore
      .collection(`users/${userId}/tasks`)
      .where('listId', '==', selectedlist.id)
      .get()
    const selectedTasksIds = []
    tasksWithSelectedListSnapshot.forEach((doc) => {
      selectedTasksIds.push(doc.id)
      batch.delete(doc.ref)
    })
    batch.update(firestore.doc(`users/${userId}`), {
      lists: lists.filter((list) => list.id !== selectedlist.id),
      tasksIds: tasksIds.filter((id) => !selectedTasksIds.includes(id))
    })
    await batch.commit()
    return true
  } catch (error) {
    return false
  }
}

export default deleteList
