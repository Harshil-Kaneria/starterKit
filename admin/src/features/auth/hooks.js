import {
  useAdminLoginMutation as useAdminLoginRtkMutation,
  useAdminProfileQuery as useAdminProfileRtkQuery,
  useAdminUpdateProfileMutation as useAdminUpdateProfileRtkMutation,
  useAdminUpdatePasswordMutation as useAdminUpdatePasswordRtkMutation
} from '@store/api/appApi'

const normalizeError = error => {
  if (!error) return undefined
  if (error?.data) return error.data
  return { message: error?.error || 'Something went wrong' }
}

export const useAdminLoginMutation = () => {
  const [trigger, state] = useAdminLoginRtkMutation()

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

export const useAdminProfileQuery = (enabled = true) => {
  const queryState = useAdminProfileRtkQuery(undefined, { skip: !enabled })
  return {
    ...queryState,
    error: normalizeError(queryState.error)
  }
}

export const useAdminUpdatePasswordMutation = () => {
  const [trigger, state] = useAdminUpdatePasswordRtkMutation()

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

export const useAdminUpdateProfileMutation = () => {
  const [trigger, state] = useAdminUpdateProfileRtkMutation()

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
