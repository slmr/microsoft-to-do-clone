import firebase from '@/lib/firebase'

async function removeTask(userId: string, taskId: string) {
  const document = firebase.firestore().doc(`users/${userId}/tasks/${taskId}`)
  const doc = await document.get()
  if (doc.exists) {
    await document.delete()
    const snapshot = await firebase.firestore().collection(`users`).doc(userId).get()
    const data = snapshot.data()
    if (!data.tasksIds || data.tasksIds.length <= 0) {
      data.tasksIds = []
    }
    const newData = data.tasksIds.filter((taskId1) => taskId1 !== taskId)
    data.tasksIds = newData
    await firebase.firestore().collection('users').doc(userId).set(data, { merge: true })
  }
  return null
}

export default removeTask
