export type IconName =
  | 'archive'
  | 'arrow-diagonal-down'
  | 'arrow-diagonal-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'attach'
  | 'chart'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-left-strong'
  | 'chevron-right'
  | 'chevron-right-strong'
  | 'chevron-up'
  | 'copy'
  | 'cross'
  | 'currency'
  | 'dash'
  | 'dashboard'
  | 'date-picker'
  | 'detach'
  | 'dots-horizontal'
  | 'dots-vertical'
  | 'download'
  | 'download-cloud'
  | 'download-email'
  | 'download-local'
  | 'download-remote'
  | 'download-report'
  | 'empty'
  | 'enter'
  | 'exclamation'
  | 'exclamation-ring'
  | 'eye-generic'
  | 'eye-hidden'
  | 'eye-visible'
  | 'filetype-csv'
  | 'filetype-pdf'
  | 'filetype-png'
  | 'filetype-xls'
  | 'filter'
  | 'fix'
  | 'generic'
  | 'home'
  | 'hyperlink'
  | 'information'
  | 'information-ring'
  | 'invoice'
  | 'link'
  | 'link-alt'
  | 'location'
  | 'location-alt'
  | 'location-gps'
  | 'modify'
  | 'more'
  | 'no-data'
  | 'plus'
  | 'print'
  | 'question'
  | 'return'
  | 'scan'
  | 'search'
  | 'select-all'
  | 'select-invert'
  | 'select-none'
  | 'sidebar-collapse'
  | 'sidebar-expand'
  | 'sign-in'
  | 'sign-out'
  | 'sort'
  | 'sort-alt'
  | 'table'
  | 'text-edit'
  | 'tick'
  | 'tick-circle'
  | 'time-picker'
  | 'tools'
  | 'trash'
  | 'unlink'
  | 'unlink-alt'
  | 'user'
  | 'user-add'
  | 'user-card'
  | 'user-file'
  | 'user-group'
  | 'user-group-config'
  | 'user-link'
  | 'user-multiple'
  | 'user-network'
  | 'user-remove'
  | 'warn'
  | 'wrench';

export type IconType = 'regular' | 'bold' | 'filled';

export type IconSize = 'huge' | 'large' | 'base' | 'mini' | 'tiny';

export const ICON_TYPE_MAP: Record<IconName, IconType[]> = {
  'archive': ['regular', 'bold', 'filled'],
  'arrow-diagonal-down': ['regular', 'bold'],
  'arrow-diagonal-up': ['regular', 'bold'],
  'arrow-down': ['regular', 'bold'],
  'arrow-left': ['regular', 'bold'],
  'arrow-right': ['regular', 'bold'],
  'arrow-up': ['regular', 'bold'],
  'attach': ['regular', 'bold'],
  'chart': ['regular', 'bold', 'filled'],
  'chevron-down': ['regular', 'bold'],
  'chevron-left': ['regular', 'bold'],
  'chevron-left-strong': ['regular', 'bold', 'filled'],
  'chevron-right': ['regular', 'bold'],
  'chevron-right-strong': ['regular', 'bold', 'filled'],
  'chevron-up': ['regular', 'bold'],
  'copy': ['regular', 'bold', 'filled'],
  'cross': ['regular', 'bold', 'filled'],
  'currency': ['regular', 'bold', 'filled'],
  'dash': ['regular', 'bold'],
  'dashboard': ['regular', 'bold', 'filled'],
  'date-picker': ['regular', 'filled'],
  'detach': ['regular', 'bold'],
  'dots-horizontal': ['regular', 'bold'],
  'dots-vertical': ['regular', 'bold'],
  'download': ['regular', 'bold'],
  'download-cloud': ['regular', 'bold', 'filled'],
  'download-email': ['regular', 'bold', 'filled'],
  'download-local': ['regular', 'bold'],
  'download-remote': ['regular', 'bold', 'filled'],
  'download-report': ['regular', 'bold', 'filled'],
  'empty': ['regular', 'bold', 'filled'],
  'enter': ['regular', 'bold'],
  'exclamation': ['regular', 'bold'],
  'exclamation-ring': ['regular', 'bold', 'filled'],
  'eye-generic': ['regular', 'bold', 'filled'],
  'eye-hidden': ['regular', 'bold', 'filled'],
  'eye-visible': ['regular', 'bold', 'filled'],
  'filetype-csv': ['regular', 'bold', 'filled'],
  'filetype-pdf': ['regular', 'bold'],
  'filetype-png': ['regular', 'bold', 'filled'],
  'filetype-xls': ['regular', 'bold', 'filled'],
  'filter': ['regular', 'bold', 'filled'],
  'fix': ['regular', 'bold', 'filled'],
  'generic': ['regular'],
  'home': ['regular', 'bold', 'filled'],
  'hyperlink': ['regular', 'bold'],
  'information': ['regular', 'bold'],
  'information-ring': ['regular', 'bold', 'filled'],
  'invoice': ['regular', 'bold', 'filled'],
  'link': ['regular', 'bold'],
  'link-alt': ['regular', 'bold'],
  'location': ['regular', 'bold', 'filled'],
  'location-alt': ['regular', 'bold', 'filled'],
  'location-gps': ['regular', 'bold', 'filled'],
  'modify': ['regular', 'bold', 'filled'],
  'more': ['regular', 'bold'],
  'no-data': ['regular', 'filled'],
  'plus': ['regular', 'bold'],
  'print': ['regular', 'bold', 'filled'],
  'question': ['regular', 'bold'],
  'return': ['regular', 'bold', 'filled'],
  'scan': ['regular', 'bold', 'filled'],
  'search': ['regular', 'bold', 'filled'],
  'select-all': ['regular', 'bold'],
  'select-invert': ['regular', 'bold'],
  'select-none': ['regular', 'bold'],
  'sidebar-collapse': ['regular'],
  'sidebar-expand': ['regular'],
  'sign-in': ['regular', 'bold'],
  'sign-out': ['regular', 'bold'],
  'sort': ['regular', 'bold', 'filled'],
  'sort-alt': ['regular', 'bold', 'filled'],
  'table': ['regular', 'bold', 'filled'],
  'text-edit': ['regular', 'bold', 'filled'],
  'tick': ['regular', 'bold', 'filled'],
  'tick-circle': ['regular', 'filled'],
  'time-picker': ['regular', 'filled'],
  'tools': ['regular', 'bold', 'filled'],
  'trash': ['regular', 'bold', 'filled'],
  'unlink': ['regular', 'bold'],
  'unlink-alt': ['regular', 'bold'],
  'user': ['regular', 'bold', 'filled'],
  'user-add': ['regular', 'bold', 'filled'],
  'user-card': ['regular', 'bold', 'filled'],
  'user-file': ['regular', 'bold', 'filled'],
  'user-group': ['regular', 'bold', 'filled'],
  'user-group-config': ['regular', 'bold', 'filled'],
  'user-link': ['regular', 'bold', 'filled'],
  'user-multiple': ['regular', 'bold', 'filled'],
  'user-network': ['regular', 'bold', 'filled'],
  'user-remove': ['regular', 'bold', 'filled'],
  'warn': ['regular', 'bold', 'filled'],
  'wrench': ['regular', 'bold', 'filled'],
};
