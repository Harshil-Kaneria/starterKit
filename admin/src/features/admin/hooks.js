import {
  useAdminDashboardQuery as useAdminDashboardRtkQuery,
  useAdminListByQueryQuery,
  useAdminListQuery as useAdminListRtkQuery,
  useAdminToolkitQuery as useAdminToolkitRtkQuery,
  useAdminDetailsQuery as useAdminDetailsRtkQuery,
  useDeleteAdminMutation as useDeleteAdminRtkMutation,
  useRegisterAdminMutation as useRegisterAdminRtkMutation,
  useUpdateAdminMutation as useUpdateAdminRtkMutation
} from '@store/api/appApi'

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

export const useAdminListQuery = () => useQueryCompat(useAdminListRtkQuery())

export const useAdminListByQuery = params => useQueryCompat(useAdminListByQueryQuery(params))

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
