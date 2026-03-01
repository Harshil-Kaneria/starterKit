'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
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
      const { user } = action.payload || {}
      state.user = user || null
      state.loading = false
    },
    clearAuthSession: state => {
      state.user = null
      state.loading = false
    }
  }
})

export const { setAuthLoading, setAuthSession, clearAuthSession } = authSlice.actions

export default authSlice.reducer
