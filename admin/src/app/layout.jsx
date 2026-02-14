// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import themeConfig from '@configs/themeConfig'

export const metadata = {
  title: themeConfig.templateName + ' - Admin panel',
  description: themeConfig.templateName + ' - Admin panel'
}

const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
