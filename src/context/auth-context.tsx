import FullPageErrorFallback from '@/components/FullPageErrorFallback'
import FullPageSpinner from '@/components/task/FullPageSpinner'
import React from 'react'
import firebase from '../lib/firebase'

type User = Pick<firebase.User, 'uid' | 'displayName' | 'email' | 'photoURL'>
type State = {
  user: User
  login: (email: string, password: string) => Promise<User>
  register: (registerDto: { name: string; email: string; password: string }) => Promise<User>
  authWithGoogle: () => Promise<User>
  logout: VoidFunction
  updateProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>
}
// type AuthProviderProps = { children: React.ReactNode }

const AuthContext = React.createContext<State | undefined>(undefined)

function AuthProvider({ children, ...props }) {
  const [state, setState] = React.useState<{ user: User; status: 'pending' | 'success' | 'error'; error: any }>({
    user: null,
    error: null,
    status: 'pending'
  })

  React.useEffect(() => {
    const unsubscriber = firebase.auth().onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const { uid, displayName, email, photoURL } = user
          setState({ user: { uid, displayName, email, photoURL }, status: 'success', error: null })
        } else {
          setState({
            user: null,
            error: null,
            status: 'success'
          })
        }
      } catch (error) {
        setState({
          user: null,
          error: null,
          status: 'error'
        })
        console.error(error)
      }
    })

    return () => unsubscriber()
  }, [])

  const addUserToCollections = async (userId: string) => {
    return firebase.firestore().collection('users').doc(userId).set({}, { merge: true })
  }

  const updateProfile = async (profile: { displayName?: string; photoURL?: string }) => {
    const { currentUser } = firebase.auth()
    await currentUser.updateProfile(profile)
    setState({ ...state, user: currentUser })
  }

  const login = async (email: string, password: string) => {
    const { user } = await firebase.auth().signInWithEmailAndPassword(email, password)
    await addUserToCollections(user.uid)
    setState({ ...state, user })
    return user
  }
  const register = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const { user } = await firebase.auth().createUserWithEmailAndPassword(email, password)
    const { currentUser } = firebase.auth()
    await currentUser.updateProfile({
      displayName: name
    })
    setState({ ...state, user: { ...user, displayName: name } })
    await addUserToCollections(user.uid)
    return user
  }

  const authWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    const { user } = await firebase.auth().signInWithPopup(provider)
    await addUserToCollections(user.uid)
    setState({ ...state, user })
    return user
  }

  const logout = async () => {
    await firebase.auth().signOut()
    setState({
      ...state,
      user: null,
      error: null
    })
  }
  if (state.status === 'pending') {
    return <FullPageSpinner />
  }
  if (state.status === 'error') {
    return <FullPageErrorFallback error={state.error} />
  }
  if (state.status === 'success') {
    return (
      <AuthContext.Provider
        value={{ user: state.user, login, logout, register, authWithGoogle, updateProfile }}
        {...props}
      >
        {children}
      </AuthContext.Provider>
    )
  }
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
export { AuthProvider, useAuth }
