'use client'

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import authReducer from './slices/authSlice'
import { appApi } from './api/appApi'

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null)
  },
  setItem(_key, value) {
    return Promise.resolve(value)
  },
  removeItem() {
    return Promise.resolve()
  }
})

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token']
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const createAppStore = () => {
  const store = configureStore({
    reducer: {
      auth: persistedAuthReducer,
      [appApi.reducerPath]: appApi.reducer
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/FLUSH', 'persist/REGISTER']
        }
      }).concat(appApi.middleware)
  })

  setupListeners(store.dispatch)
  const persistor = persistStore(store)

  return { store, persistor }
}
