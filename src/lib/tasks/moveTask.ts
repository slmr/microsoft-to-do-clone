import firebase from '@/lib/firebase'

async function moveTask({ userId, taskId, moveToListId }: { userId: string; taskId: string; moveToListId: string }) {
  try {
    const batch = firebase.firestore().batch()
    const taskRef = firebase.firestore().doc(`users/${userId}/tasks/${taskId}`)
    batch.update(taskRef, { listId: moveToListId })
    const userRef = firebase.firestore().doc(`users/${userId}`)
    const { lists } = (await userRef.get()).data()
    if (moveToListId !== 'inbox') {
      batch.update(userRef, { order: firebase.firestore.FieldValue.arrayRemove(taskId) })
      batch.update(userRef, {
        lists: lists.map((list) => {
          if (list.id === moveToListId) {
            return {
              ...list,
              order: [...list.order, taskId]
            }
          }
          return list
        })
      })
    } else {
      batch.update(userRef, { order: firebase.firestore.FieldValue.arrayUnion(taskId) })
      batch.update(userRef, {
        lists: lists.map((list) => {
          if (list.id === moveToListId) {
            return {
              ...list,
              order: list.order.filter((id) => id !== taskId)
            }
          }
          return list
        })
      })
    }
    await batch.commit()
  } catch (error) {
    console.log(error)
  }
}

export default moveTask
