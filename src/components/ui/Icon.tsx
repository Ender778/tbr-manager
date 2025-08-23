import React from 'react'
import { cn } from '@/lib/utils'
import { 
  Library, 
  BookOpen, 
  Plus, 
  Search, 
  Settings,
  Menu,
  X,
  Home,
  User,
  Star,
  Heart,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Tag,
  Filter,
  Sort,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'

// Icon size variants for consistent scaling
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// All available icon names from lucide-react
export type IconName = 
  | 'library' 
  | 'book-open'
  | 'plus' 
  | 'search' 
  | 'settings'
  | 'menu'
  | 'x'
  | 'home'
  | 'user'
  | 'star'
  | 'heart' 
  | 'eye'
  | 'eye-off'
  | 'calendar'
  | 'clock'
  | 'tag'
  | 'filter'
  | 'sort'
  | 'grid'
  | 'list'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-down'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'

interface IconProps {
  name: IconName
  size?: IconSize
  className?: string
  'aria-label'?: string
}

const iconSizes = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4', 
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8'
}

// Icon mapping for centralized icon management
const iconMap = {
  'library': Library,
  'book-open': BookOpen,
  'plus': Plus,
  'search': Search,
  'settings': Settings,
  'menu': Menu,
  'x': X,
  'home': Home,
  'user': User,
  'star': Star,
  'heart': Heart,
  'eye': Eye,
  'eye-off': EyeOff,
  'calendar': Calendar,
  'clock': Clock,
  'tag': Tag,
  'filter': Filter,
  'sort': Sort,
  'grid': Grid,
  'list': List,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
} as const

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 'md', 
  className, 
  'aria-label': ariaLabel,
  ...props 
}) => {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(', ')}`)
    return null
  }

  return (
    <IconComponent
      className={cn(iconSizes[size], className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    />
  )
}

// Convenience components for frequently used icons
export const LibraryIcon = (props: Omit<IconProps, 'name'>) => 
  <Icon name="library" {...props} />

export const BookOpenIcon = (props: Omit<IconProps, 'name'>) => 
  <Icon name="book-open" {...props} />

export const PlusIcon = (props: Omit<IconProps, 'name'>) => 
  <Icon name="plus" {...props} />

export const SearchIcon = (props: Omit<IconProps, 'name'>) => 
  <Icon name="search" {...props} />

export const SettingsIcon = (props: Omit<IconProps, 'name'>) => 
  <Icon name="settings" {...props} />