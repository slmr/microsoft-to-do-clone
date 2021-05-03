import React from 'react'
import { useAuth } from '@/context/auth-context'
import firebase from '../lib/firebase'

type User = Pick<firebase.User, 'uid' | 'displayName' | 'email' | 'photoURL'>

const UserContext = React.createContext<User | undefined>(undefined)

const UserProvider = ({ children }) => <UserContext.Provider value={useAuth().user}>{children}</UserContext.Provider>

function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
export { UserProvider, useUser }
