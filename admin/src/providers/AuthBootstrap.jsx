'use client'

import { useAuthBootstrap } from '@store/auth'

const AuthBootstrap = ({ children }) => {
  useAuthBootstrap()
  return children
}

export default AuthBootstrap
