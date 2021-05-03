import firebase from '@/lib/firebase'
import { Step } from '@/type/task'

async function updateTaskStep(userId: string, taskId: string, steps: Step[]) {
  const updatedTask = await firebase.firestore().collection(`users/${userId}/tasks`).doc(taskId).update({
    steps
  })
  return updatedTask
}

export default updateTaskStep
