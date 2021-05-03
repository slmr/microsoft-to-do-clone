import firebase from '@/lib/firebase'
import { Task } from '@/type/task'

async function updateTask(userId: string, taskId: string, updatedDto: Partial<Task>) {
  const updatedTask = await firebase.firestore().collection(`users/${userId}/tasks`).doc(taskId).update(updatedDto)
  return updatedTask
}

export default updateTask
