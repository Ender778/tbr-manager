import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "lg", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Container.displayName = "Container"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl"
}

const sectionSpacing = {
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionSpacing[spacing], className)}
      {...props}
    >
      {children}
    </section>
  )
)
Section.displayName = "Section"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: "sm" | "md" | "lg"
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 md:grid-cols-6 lg:grid-cols-12",
}

const gridGaps = {
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = "md", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid", gridCols[cols], gridGaps[gap], className)}
      {...props}
    >
      {children}
    </div>
  )
)
Grid.displayName = "Grid"

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse"
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
  align?: "start" | "end" | "center" | "baseline" | "stretch"
  wrap?: boolean
  gap?: "sm" | "md" | "lg"
}

const flexDirection = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
}

const flexJustify = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const flexAlign = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

const flexGaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = "row", 
    justify = "start", 
    align = "start", 
    wrap = false, 
    gap = "md", 
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        flexDirection[direction],
        flexJustify[justify],
        flexAlign[align],
        flexGaps[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Flex.displayName = "Flex"

// Main page layout wrapper
export const PageLayout = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-h-screen bg-gradient-to-br from-amber-50 to-amber-100", className)}
      {...props}
    >
      {children}
    </div>
  )
)
PageLayout.displayName = "PageLayout"