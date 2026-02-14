'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { appApi } from '@store/api/appApi'
import { clearAuthSession, setAuthLoading, setAuthSession } from '@store/slices/authSlice'

const formatUser = userData => ({
  secretId: userData?.secretId,
  email: userData?.email,
  name: userData?.name,
  adminType: userData?.adminType
})

export const useAuthState = () =>
  useSelector(state => ({
    token: state.auth.token,
    user: state.auth.user,
    loading: state.auth.loading
  }))

export const useAuthActions = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const login = useCallback(
    (token, user) => {
      if (token) {
        localStorage.setItem('token', token)
      }

      dispatch(
        setAuthSession({
          token,
          user: formatUser(user)
        })
      )

      router.push('/')
    },
    [dispatch, router]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    dispatch(clearAuthSession())
    dispatch(appApi.util.resetApiState())
    router.push('/login')
  }, [dispatch, router])

  return {
    login,
    logout
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

      const token = localStorage.getItem('token')
      if (!token) {
        dispatch(clearAuthSession())
        return
      }

      try {
        const response = await dispatch(appApi.endpoints.adminProfile.initiate(undefined, { forceRefetch: true })).unwrap()

        if (response?.status) {
          dispatch(
            setAuthSession({
              token,
              user: formatUser(response.user)
            })
          )
          return
        }

        localStorage.removeItem('token')
        dispatch(clearAuthSession())
      } catch {
        localStorage.removeItem('token')
        dispatch(clearAuthSession())
      }
    }

    bootstrap()
  }, [dispatch])
}
