import themeConfig from '@configs/themeConfig'

// Component Imports
import PolicyShow from '@views/PolicyShow'

export const metadata = {
  title: `About - ${themeConfig.templateName}`,
  description: `About - ${themeConfig.templateName}`
}

const AboutPage = () => {
  return <PolicyShow type='terms_and_conditions' />
}

export default AboutPage
