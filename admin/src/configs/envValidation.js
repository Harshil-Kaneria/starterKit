const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
const encryptionEnabledRaw = process.env.NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED
const encryptionKey = process.env.NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY

export const validateClientEnv = () => {
  const missing = []

  if (!apiBaseUrl) {
    missing.push('NEXT_PUBLIC_API_BASE_URL')
  }

  if (!encryptionEnabledRaw) {
    missing.push('NEXT_PUBLIC_RESPONSE_ENCRYPTION_ENABLED')
  }

  if (encryptionEnabledRaw === 'true' && !encryptionKey) {
    missing.push('NEXT_PUBLIC_RESPONSE_ENCRYPTION_KEY')
  }

  if (missing.length) {
    throw new Error(`Missing required client env vars: ${missing.join(', ')}`)
  }
}
