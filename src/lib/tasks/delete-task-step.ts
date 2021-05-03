import firebase from '@/lib/firebase'
import { Step } from '@/type/task'

async function deleteTaskStep(userId: string, taskId: string, step: Step) {
  return firebase
    .firestore()
    .collection(`users/${userId}/tasks`)
    .doc(taskId)
    .update({
      steps: firebase.firestore.FieldValue.arrayRemove(step)
    })
}

export default deleteTaskStep
