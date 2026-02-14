import themeConfig from '@configs/themeConfig'

// Component Imports
import DeleteUser from '@views/DeleteUser'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: `Delete user - ${themeConfig.templateName}`,
  description: `Delete a user from ${themeConfig.templateName}.`
}

const UserDeletePage = () => {
  // Vars
  const mode = getServerMode()

  return <DeleteUser mode={mode} />
}

export default UserDeletePage
