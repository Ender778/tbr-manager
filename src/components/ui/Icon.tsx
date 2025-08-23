import * as React from "react"
import { 
  BookOpen, 
  Library, 
  Plus, 
  Search, 
  Settings, 
  Menu, 
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface IconProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  "aria-label"?: string
  decorative?: boolean
}

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4", 
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
}

// Library/Book icon
export const LibraryIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <Library
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
LibraryIcon.displayName = "LibraryIcon"

// Book Open icon
export const BookOpenIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <BookOpen
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
BookOpenIcon.displayName = "BookOpenIcon"

// Plus icon
export const PlusIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <Plus
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
PlusIcon.displayName = "PlusIcon"

// Search icon
export const SearchIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <Search
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
SearchIcon.displayName = "SearchIcon"

// Settings icon
export const SettingsIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <Settings
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
SettingsIcon.displayName = "SettingsIcon"

// Menu icon
export const MenuIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <Menu
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
MenuIcon.displayName = "MenuIcon"

// Close icon
export const CloseIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => (
    <X
      ref={ref}
      className={cn(iconSizes[size], className)}
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative}
      role={decorative ? "presentation" : "img"}
      {...props}
    />
  )
)
CloseIcon.displayName = "CloseIcon"

// Generic Icon component for any Lucide icon
interface GenericIconProps extends IconProps {
  name: keyof typeof iconMap
}

const iconMap = {
  library: Library,
  "book-open": BookOpen,
  plus: Plus,
  search: Search,
  settings: Settings,
  menu: Menu,
  close: X,
} as const

export const Icon = React.forwardRef<SVGSVGElement, GenericIconProps>(
  ({ name, size = "md", className, "aria-label": ariaLabel, decorative, ...props }, ref) => {
    const IconComponent = iconMap[name]
    
    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in icon map`)
      return null
    }

    return (
      <IconComponent
        ref={ref}
        className={cn(iconSizes[size], className)}
        aria-label={decorative ? undefined : ariaLabel}
        aria-hidden={decorative}
        role={decorative ? "presentation" : "img"}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"