// Util Imports
import { menuClasses, verticalNavClasses } from '@menu/utils/menuClasses'

const navigationCustomStyles = theme => {
  return {
    color: 'var(--mui-palette-text-primary)',
    zIndex: 'var(--drawer-z-index) !important',
    [`& .${verticalNavClasses.bgColorContainer}`]: {
      background:
        'linear-gradient(180deg, rgb(var(--mui-palette-primary-mainChannel) / 0.08) 0%, var(--mui-palette-background-default) 18%)'
    },
    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(5),
      paddingInline: theme.spacing(5.5, 4),
      borderBottom: '1px solid var(--mui-palette-divider)'
    },
    [`& .${verticalNavClasses.container}`]: {
      transition: 'none',
      borderColor: 'var(--mui-palette-divider)',
      borderInlineEndWidth: '1px',
      [`& .${verticalNavClasses.toggled}`]: {
        boxShadow: 'var(--mui-customShadows-lg)'
      }
    },
    [`& .${menuClasses.root}`]: {
      paddingBlockStart: theme.spacing(3),
      paddingBlockEnd: theme.spacing(2),
      paddingInlineEnd: theme.spacing(4)
    },
    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: 'var(--backdrop-color)'
    }
  }
}

export default navigationCustomStyles
