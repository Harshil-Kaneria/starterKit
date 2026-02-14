// Third-party Imports
import styled from '@emotion/styled'

// Config Imports
import themeConfig from '@configs/themeConfig'

const StyledMain = styled.main`
  padding: ${themeConfig.layoutPadding}px;
  ${({ isContentCompact, contentMaxWidth }) =>
    isContentCompact &&
    `
    margin-inline: auto;
    max-inline-size: ${contentMaxWidth || themeConfig.compactContentWidth}px;
  `}
`

export default StyledMain
