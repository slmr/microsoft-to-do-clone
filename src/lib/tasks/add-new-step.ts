import firebase from '@/lib/firebase'
import uid from 'utils/generatePushId'

async function addNewStep(userId: string, taskId: string, { title }: { title: string }) {
  const newList = await firebase
    .firestore()
    .doc(`users/${userId}/tasks/${taskId}`)
    .update({
      steps: firebase.firestore.FieldValue.arrayUnion({
        id: uid.generate(),
        title,
        completed: false
      })
    })
  return newList
}

export default addNewStep
