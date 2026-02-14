// Component Imports
import DeleteUser from '@views/DeleteUser'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Delete user - Nutriscan',
  description: 'Delete a user from the nutriscan.'
}

const UserDeletePage = () => {
  // Vars
  const mode = getServerMode()

  return <DeleteUser mode={mode} />
}

export default UserDeletePage
