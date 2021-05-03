import firebase from '@/lib/firebase'
import uid from '@/utils/generatePushId'

async function addNewList(userId: string, title: string) {
  try {
    const id = uid.generate()
    await firebase
      .firestore()
      .collection(`users`)
      .doc(userId)
      .update({
        lists: firebase.firestore.FieldValue.arrayUnion({
          id,
          title,
          order: []
        })
      })

    return id
  } catch (error) {
    console.log(error)
  }
}

export default addNewList
