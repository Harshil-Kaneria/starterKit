import {
  appApi,
  useDeleteUserEmailOtpMutation as useDeleteUserEmailOtpRtkMutation,
  useDeleteUserEmailVerifyOtpMutation as useDeleteUserEmailVerifyOtpRtkMutation,
  useDeleteUserMutation as useDeleteUserRtkMutation
} from '@store/api/appApi'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

const normalizeError = error => {
  if (!error) return undefined
  if (error?.data) return error.data
  return { message: error?.error || 'Something went wrong' }
}

export const useDeleteUserMutation = () => {
  const [trigger, state] = useDeleteUserRtkMutation()

  const mutateAsync = async payload => {
    try {
      return await trigger(payload).unwrap()
    } catch (error) {
      throw normalizeError(error)
    }
  }

  return {
    ...state,
    error: normalizeError(state.error),
    mutateAsync
  }
}

export const useDeleteUserEmailOtpMutation = () => {
  const [trigger, state] = useDeleteUserEmailOtpRtkMutation()

  const mutateAsync = async payload => {
    try {
      return await trigger(payload).unwrap()
    } catch (error) {
      throw normalizeError(error)
    }
  }

  return {
    ...state,
    error: normalizeError(state.error),
    mutateAsync
  }
}

export const useDeleteUserEmailVerifyOtpMutation = () => {
  const [trigger, state] = useDeleteUserEmailVerifyOtpRtkMutation()

  const mutateAsync = async payload => {
    try {
      return await trigger(payload).unwrap()
    } catch (error) {
      throw normalizeError(error)
    }
  }

  return {
    ...state,
    error: normalizeError(state.error),
    mutateAsync
  }
}

export const useUserListLazyQuery = () => {
  const dispatch = useDispatch()

  const fetchData = useCallback(
    async params => {
      const request = dispatch(
        appApi.endpoints.userList.initiate(params, {
          forceRefetch: true,
          subscribe: false
        })
      )

      try {
        return await request.unwrap()
      } catch (error) {
        throw normalizeError(error)
      } finally {
        request.unsubscribe?.()
      }
    },
    [dispatch]
  )

  return {
    fetchData
  }
}
