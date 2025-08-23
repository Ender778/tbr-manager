/**
 * Developer Experience Tools
 * Modern development utilities and debugging aids
 */

import React from 'react'

// Component prop inspector for development
export function withPropInspector<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName?: string
) {
  if (process.env.NODE_ENV !== 'development') {
    return Component
  }

  return React.forwardRef<any, T>((props, ref) => {
    React.useEffect(() => {
      console.group(`🔍 ${componentName || Component.displayName || Component.name} Props`)
      console.table(props)
      console.groupEnd()
    })

    return React.createElement(Component, { ...props, ref })
  })
}

// Design system validator
export function validateDesignTokens(tokenValue: string, allowedValues: string[]) {
  if (process.env.NODE_ENV === 'development') {
    if (!allowedValues.includes(tokenValue)) {
      console.warn(
        `Invalid design token "${tokenValue}". Expected one of: ${allowedValues.join(', ')}`
      )
    }
  }
}

// Component usage analytics (development only)
class ComponentUsageTracker {
  private usage = new Map<string, number>()

  track(componentName: string) {
    if (process.env.NODE_ENV !== 'development') return

    const currentCount = this.usage.get(componentName) || 0
    this.usage.set(componentName, currentCount + 1)
  }

  getReport() {
    if (process.env.NODE_ENV !== 'development') return

    console.group('📊 Component Usage Report')
    const sortedUsage = Array.from(this.usage.entries())
      .sort(([, a], [, b]) => b - a)
    
    sortedUsage.forEach(([component, count]) => {
      console.log(`${component}: ${count} renders`)
    })
    console.groupEnd()
  }

  reset() {
    this.usage.clear()
  }
}

export const componentTracker = new ComponentUsageTracker()

// Performance profiler hook
export function useRenderProfiler(componentName: string) {
  React.useLayoutEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const startTime = performance.now()
    componentTracker.track(componentName)

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime

      if (renderTime > 5) {
        console.warn(`⚠️ ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
      }
    }
  })
}

// Design system documentation generator
export function generateComponentDocs<T extends Record<string, any>>(
  component: React.ComponentType<T>,
  examples: Array<{ name: string; props: T }>
) {
  if (process.env.NODE_ENV !== 'development') return null

  return {
    name: component.displayName || component.name,
    examples,
    generateStorybook: () => {
      const stories = examples.map(({ name, props }) => ({
        name,
        render: () => React.createElement(component, props),
      }))
      
      console.log('Generated Storybook stories:', stories)
      return stories
    }
  }
}

// Accessibility audit hook
export function useA11yAudit(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !ref.current) return

    const element = ref.current
    const issues: string[] = []

    // Check for missing alt text on images
    const images = element.querySelectorAll('img')
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push(`Image missing alt text: ${img.src}`)
      }
    })

    // Check for missing labels on form inputs
    const inputs = element.querySelectorAll('input, textarea, select')
    inputs.forEach((input) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`)
      const hasAriaLabel = input.getAttribute('aria-label')
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push(`Form input missing label: ${input.tagName}`)
      }
    })

    // Check for missing focus indicators
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusableElements.forEach((el) => {
      const styles = window.getComputedStyle(el, ':focus')
      if (styles.outline === 'none' && !styles.boxShadow.includes('ring')) {
        issues.push(`Element missing focus indicator: ${el.tagName}`)
      }
    })

    if (issues.length > 0) {
      console.group('♿ Accessibility Issues Found')
      issues.forEach((issue) => console.warn(issue))
      console.groupEnd()
    }
  })
}

// Theme context debugger
export function useThemeDebugger() {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // Add visual indicators for theme tokens
    const style = document.createElement('style')
    style.textContent = `
      .debug-theme * {
        outline: 1px solid rgba(255, 0, 0, 0.1) !important;
        position: relative !important;
      }
      .debug-theme *:hover::after {
        content: attr(class);
        position: absolute;
        top: 0;
        left: 0;
        background: black;
        color: white;
        font-size: 10px;
        padding: 2px;
        z-index: 9999;
        white-space: nowrap;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)

    return () => document.head.removeChild(style)
  }, [])
}

// Component tree visualizer
export function visualizeComponentTree() {
  if (process.env.NODE_ENV !== 'development') return

  const components = new Map<string, number>()
  
  // Monkey patch React.createElement to track components
  const originalCreateElement = React.createElement
  React.createElement = function(type, props, ...children) {
    if (typeof type === 'string' || typeof type === 'function') {
      const name = typeof type === 'string' ? type : type.displayName || type.name || 'Unknown'
      components.set(name, (components.get(name) || 0) + 1)
    }
    
    return originalCreateElement.call(this, type, props, ...children)
  }

  // Generate tree visualization
  setTimeout(() => {
    console.group('🌳 Component Tree Visualization')
    Array.from(components.entries())
      .sort(([, a], [, b]) => b - a)
      .forEach(([name, count]) => {
        console.log(`${name}: ${count} instances`)
      })
    console.groupEnd()
  }, 1000)
}

// CSS-in-JS runtime optimizer
export function optimizeStyles(styles: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    // In production, return styles as-is
    return styles
  }

  // In development, validate and optimize styles
  const optimized: Record<string, any> = {}
  
  Object.entries(styles).forEach(([key, value]) => {
    // Warn about potential performance issues
    if (typeof value === 'function') {
      console.warn(`Dynamic style function detected in ${key}. Consider memoization.`)
    }
    
    // Convert camelCase to kebab-case for CSS properties
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    optimized[cssKey] = value
  })

  return optimized
}

// Bundle analyzer integration
export function analyzeBundleUsage() {
  if (process.env.NODE_ENV !== 'development') return

  const unusedComponents = new Set<string>()
  const usedComponents = new Set<string>()

  // Track component imports and usage
  const originalImport = (window as any).__webpack_require__
  if (originalImport) {
    (window as any).__webpack_require__ = function(moduleId: string) {
      const module = originalImport(moduleId)
      
      if (module && module.default && typeof module.default === 'function') {
        const componentName = module.default.displayName || module.default.name
        if (componentName && componentName.includes('Component')) {
          usedComponents.add(componentName)
        }
      }
      
      return module
    }
  }

  // Report unused components after app initialization
  setTimeout(() => {
    console.group('📦 Bundle Analysis')
    console.log('Used components:', Array.from(usedComponents))
    console.log('Potential unused components:', Array.from(unusedComponents))
    console.groupEnd()
  }, 3000)
}

// Export development utilities
export const devTools = {
  componentTracker,
  withPropInspector,
  validateDesignTokens,
  generateComponentDocs,
  visualizeComponentTree,
  optimizeStyles,
  analyzeBundleUsage,
}

// Development-only component wrapper
export function DevOnly({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return <>{children}</>
}

// Example usage in comments:
/*
// Component profiling
function MyComponent() {
  useRenderProfiler('MyComponent')
  return <div>Content</div>
}

// Prop inspection
const InspectedButton = withPropInspector(Button, 'Button')

// Accessibility audit
function AccessibleForm() {
  const formRef = useRef<HTMLFormElement>(null)
  useA11yAudit(formRef)
  
  return <form ref={formRef}>...</form>
}

// Development-only debug panel
<DevOnly>
  <div className="fixed bottom-4 right-4 bg-black text-white p-2">
    Debug Panel
  </div>
</DevOnly>
*/