'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createAppStore } from '@store/index'
import AuthBootstrap from './AuthBootstrap'

const ReduxProvider = ({ children }) => {
  const storeRef = useRef(null)
  const persistorRef = useRef(null)

  if (!storeRef.current) {
    const { store, persistor } = createAppStore()
    storeRef.current = store
    persistorRef.current = persistor
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </PersistGate>
    </Provider>
  )
}

export default ReduxProvider
