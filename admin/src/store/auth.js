'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { appApi } from '@store/api/appApi'
import { clearAuthSession, setAuthLoading, setAuthSession } from '@store/slices/authSlice'
import axiosInstance from '@services/axiosInstance'

const formatUser = userData => ({
  secretId: userData?.secretId,
  email: userData?.email,
  name: userData?.name,
  adminType: userData?.adminType
})

export const useAuthState = () =>
  useSelector(state => ({
    user: state.auth.user,
    loading: state.auth.loading
  }))

export const useAuthActions = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const login = useCallback(
    (user) => {
      dispatch(
        setAuthSession({
          user: formatUser(user)
        })
      )

      router.push('/')
    },
    [dispatch, router]
  )

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/public/api/v1/auth/logout')
    } catch (error) {
      // Ignore logout network errors and clear local session state anyway.
    }
    dispatch(clearAuthSession())
    dispatch(appApi.util.resetApiState())
    router.push('/login')
  }, [dispatch, router])

  const logoutAll = useCallback(async () => {
    try {
      await axiosInstance.post('/api/v1/auth/logout-all')
    } catch (error) {
      // Ignore logout-all network errors and clear local session state anyway.
    }
    dispatch(clearAuthSession())
    dispatch(appApi.util.resetApiState())
    router.push('/login')
  }, [dispatch, router])

  return {
    login,
    logout,
    logoutAll
  }
}

export const useAuthBootstrap = () => {
  const dispatch = useDispatch()
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const bootstrap = async () => {
      dispatch(setAuthLoading(true))

      try {
        const response = await dispatch(appApi.endpoints.adminProfile.initiate(undefined, { forceRefetch: true })).unwrap()

        if (response?.status) {
          dispatch(
            setAuthSession({
              user: formatUser(response.user)
            })
          )
          return
        }

        dispatch(clearAuthSession())
      } catch {
        dispatch(clearAuthSession())
      }
    }

    bootstrap()
  }, [dispatch])
}
