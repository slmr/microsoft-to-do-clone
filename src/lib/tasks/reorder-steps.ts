import firebase from '@/lib/firebase'
import { Step } from '@/type/task'

async function reorderSteps(userId: string, taskId: string, steps: Step[]) {
  await firebase.firestore().collection(`users/${userId}/tasks`).doc(taskId).update({ steps })
}

export default reorderSteps
