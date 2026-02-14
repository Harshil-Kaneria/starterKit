import {
  appApi,
  useAdminDashboardQuery as useAdminDashboardRtkQuery,
  useAdminListQuery as useAdminListRtkQuery,
  useAdminToolkitQuery as useAdminToolkitRtkQuery,
  useAdminDetailsQuery as useAdminDetailsRtkQuery,
  useDeleteAdminMutation as useDeleteAdminRtkMutation,
  useRegisterAdminMutation as useRegisterAdminRtkMutation,
  useUpdateAdminMutation as useUpdateAdminRtkMutation
} from '@store/api/appApi'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

const normalizeError = error => {
  if (!error) return undefined
  if (error?.data) return error.data
  return { message: error?.error || 'Something went wrong' }
}

const useMutationCompat = useMutationHook => {
  const [trigger, state] = useMutationHook()

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

const useQueryCompat = queryState => ({
  ...queryState,
  error: normalizeError(queryState.error)
})

export const useAdminDashboardQuery = () => useQueryCompat(useAdminDashboardRtkQuery())

export const useAdminListQuery = params => useQueryCompat(useAdminListRtkQuery(params))

export const useAdminListLazyQuery = () => {
  const dispatch = useDispatch()

  const fetchData = useCallback(
    async params => {
      const request = dispatch(
        appApi.endpoints.adminList.initiate(params, {
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

export const useAdminToolkitQuery = () => useQueryCompat(useAdminToolkitRtkQuery())

export const useAdminDetailsQuery = secretId =>
  useQueryCompat(
    useAdminDetailsRtkQuery(secretId, {
      skip: !secretId
    })
  )

export const useRegisterAdminMutation = () => useMutationCompat(useRegisterAdminRtkMutation)

export const useUpdateAdminMutation = () => useMutationCompat(useUpdateAdminRtkMutation)

export const useDeleteAdminMutation = () => useMutationCompat(useDeleteAdminRtkMutation)
