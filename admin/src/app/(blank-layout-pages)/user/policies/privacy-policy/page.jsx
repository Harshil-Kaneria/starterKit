import themeConfig from '@configs/themeConfig'

// Component Imports
import PolicyShow from '@views/PolicyShow'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: `Privacy policy - ${themeConfig.templateName}`,
  description: `Privacy policy - ${themeConfig.templateName}`
}

const policiesPage = () => {
  // Vars
  const mode = getServerMode()

  return <PolicyShow type='privacy_policy' />
}

export default policiesPage
