import firebase from '@/lib/firebase'

export interface Step {
  id: string
  title: string
  completed: boolean
}
export interface Task {
  id: string
  title: string
  completed: boolean
  important: boolean
  categories: string[]
  note: string
  createdAt: firebase.firestore.Timestamp
  myday: boolean
  position: number
  steps: Step[]
  listId: string
}

export interface IList {
  id: string
  title: string
  order: string[]
}
export type TaskPosition = string[]

export type SortTasks = 'importance' | 'added to My Day' | 'created date' | 'alphabetically' | 'position'
export type OrderTasks = 'asc' | 'desc'
