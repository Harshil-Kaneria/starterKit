'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: '',
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload
    },
    setAuthSession: (state, action) => {
      const { token, user } = action.payload || {}
      state.token = token || ''
      state.user = user || null
      state.loading = false
    },
    clearAuthSession: state => {
      state.user = null
      state.token = ''
      state.loading = false
    }
  }
})

export const { setAuthLoading, setAuthSession, clearAuthSession } = authSlice.actions

export default authSlice.reducer
