// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuSectionStyles = theme => {
  return {
    root: {
      marginBlockStart: theme.spacing(5),
      [`& .${menuClasses.menuSectionContent}`]: {
        color: 'var(--mui-palette-text-secondary)',
        paddingInline: '0 !important',
        paddingBlock: `${theme.spacing(1.5)} !important`,
        gap: theme.spacing(2.5),
        '&:before': {
          content: '""',
          blockSize: 1,
          inlineSize: '0.875rem',
          backgroundColor: 'rgb(var(--mui-palette-primary-mainChannel) / 0.4)'
        },
        '&:after': {
          content: '""',
          blockSize: 1,
          flexGrow: 1,
          backgroundColor: 'var(--mui-palette-divider)'
        }
      },
      [`& .${menuClasses.menuSectionLabel}`]: {
        flexGrow: 0,
        fontSize: '11px',
        lineHeight: 1.4,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        fontWeight: 700
      }
    }
  }
}

export default menuSectionStyles
