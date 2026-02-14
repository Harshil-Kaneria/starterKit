import {
  usePoliciesListQuery as usePoliciesListRtkQuery,
  usePolicyByTypeQuery as usePolicyByTypeRtkQuery,
  usePolicyUpdateMutation as usePolicyUpdateRtkMutation
} from '@store/api/appApi'

const normalizeError = error => {
  if (!error) return undefined
  if (error?.data) return error.data
  return { message: error?.error || 'Something went wrong' }
}

export const usePoliciesListQuery = () => {
  const queryState = usePoliciesListRtkQuery()
  return {
    ...queryState,
    error: normalizeError(queryState.error)
  }
}

export const usePolicyByTypeQuery = type => {
  const queryState = usePolicyByTypeRtkQuery(type, { skip: !type })
  return {
    ...queryState,
    error: normalizeError(queryState.error)
  }
}

export const usePolicyUpdateMutation = () => {
  const [trigger, state] = usePolicyUpdateRtkMutation()

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
