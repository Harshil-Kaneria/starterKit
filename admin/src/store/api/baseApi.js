'use client'

import axiosInstance from '@services/axiosInstance'
import { decryptApiPayload } from '@services/responseCrypto'

const normalizeError = async error => {
  if (error?.response?.data) {
    const errorData = await decryptApiPayload(error.response.data)
    return errorData || { message: 'Request failed' }
  }

  return { message: error?.message || 'Request failed' }
}

export const axiosBaseQuery =
  () =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const response = await axiosInstance({
        url,
        method,
        data,
        params
      })

      const decrypted = await decryptApiPayload(response.data)
      return { data: decrypted }
    } catch (error) {
      const normalizedError = await normalizeError(error)

      return {
        error: {
          status: error?.response?.status || 500,
          data: normalizedError
        }
      }
    }
  }
