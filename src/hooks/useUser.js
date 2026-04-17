import { useState } from 'react'
import { getUser, saveUser } from '../utils/storage'

export function useUser() {
  const [user, setUser] = useState(() => getUser())

  function createUser(name) {
    const newUser = { name, createdAt: new Date().toISOString() }
    saveUser(newUser)
    setUser(newUser)
  }

  return { user, createUser }
}
