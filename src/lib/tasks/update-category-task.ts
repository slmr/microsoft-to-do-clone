import firebase from '@/lib/firebase'

async function updateCategoryTask(taskId: string, categories: string[]) {
  const updatedTask = await firebase.firestore().collection('tasks').doc(taskId).update({ categories })
  return updatedTask
}

export default updateCategoryTask
