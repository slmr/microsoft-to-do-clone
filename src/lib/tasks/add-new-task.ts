import firebase from '@/lib/firebase'
import { Task } from '@/type/task'

interface AddNewTask {
  userId: string
  taskType?: 'list' | 'inbox'
  data: Partial<Task>
}
async function addNewTask(params: AddNewTask) {
  const { data, userId, taskType } = params
  const firestore = firebase.firestore()
  const newList = await firestore.collection(`users/${userId}/tasks`).add({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    ...data,
    completed: false,
    steps: [],
    categories: []
  })
  try {
    const query = firestore.collection(`users`).doc(userId)
    const snapshot = await query.get()
    const snapshotData = snapshot.data()
    if (taskType === 'list') {
      if (!snapshotData.lists || snapshotData.lists.length <= 0) {
        snapshotData.lists = []
      }
      const selectedList = snapshotData.lists.find((list) => list.id === data.listId)
      selectedList.order.unshift(newList.id)
      await query.set({ lists: snapshotData.lists }, { merge: true })
    } else {
      if (!snapshotData.order || snapshotData.order.length <= 0) {
        snapshotData.order = []
      }
      const { order } = snapshotData
      order.unshift(newList.id)
      await query.set({ order }, { merge: true })
    }

    return newList
  } catch (error) {
    console.log(error)
  }
}

export default addNewTask
