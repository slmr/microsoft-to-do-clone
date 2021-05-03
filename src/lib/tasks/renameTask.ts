import firebase from '@/lib/firebase'

async function renameTask(taskId: string, title: string) {
  const updatedTask = await firebase.firestore().collection('tasks').doc(taskId).update({ title })
  return updatedTask
}

export default renameTask
