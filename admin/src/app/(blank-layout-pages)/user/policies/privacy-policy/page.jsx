// Component Imports
import PolicyShow from '@views/PolicyShow'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Privacy policy - Nutriscan',
  description: 'Privacy policy - Nutriscan'
}

const policiesPage = () => {
  // Vars
  const mode = getServerMode()

  return <PolicyShow type='privacy_policy' />
}

export default policiesPage
