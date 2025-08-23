/**
 * Performance Optimization Utilities
 * Modern performance patterns for React applications
 */

import React from 'react'

// Lazy loading utility for components
export function createLazyComponent<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(factory)
  
  return React.forwardRef<
    React.ElementRef<T>,
    React.ComponentPropsWithoutRef<T>
  >((props, ref) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  ))
}

// Optimized image component with lazy loading and optimization
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: (error: Event) => void
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    priority = false,
    placeholder = 'empty',
    blurDataURL,
    className,
    onLoad,
    onError,
    ...props
  }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
    const imgRef = React.useRef<HTMLImageElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => imgRef.current!)

    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    const handleError = (error: Event) => {
      setHasError(true)
      onError?.(error)
    }

    // Intersection observer for lazy loading
    React.useEffect(() => {
      if (!imgRef.current || priority) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              if (img.dataset.src) {
                img.src = img.dataset.src
                img.removeAttribute('data-src')
                observer.unobserve(img)
              }
            }
          })
        },
        { rootMargin: '50px' }
      )

      if (imgRef.current) {
        observer.observe(imgRef.current)
      }

      return () => observer.disconnect()
    }, [priority])

    if (hasError) {
      return (
        <div className="flex items-center justify-center bg-neutral-100 text-neutral-500">
          Failed to load image
        </div>
      )
    }

    return (
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={priority ? undefined : src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        className={cn(
          'transition-opacity duration-300',
          !isLoaded && placeholder === 'blur' && 'blur-sm',
          !isLoaded && 'opacity-0',
          isLoaded && 'opacity-100',
          className
        )}
        style={{
          backgroundImage: placeholder === 'blur' && blurDataURL ? `url(${blurDataURL})` : undefined,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

// Virtual scrolling hook for large lists
interface VirtualItem {
  index: number
  start: number
  size: number
}

interface UseVirtualScrollOptions {
  count: number
  getScrollElement: () => Element | null
  estimateSize?: () => number
  overscan?: number
}

export function useVirtualScroll({
  count,
  getScrollElement,
  estimateSize = () => 50,
  overscan = 5,
}: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const [isScrolling, setIsScrolling] = React.useState(false)
  const scrollTimeout = React.useRef<NodeJS.Timeout>()

  // Calculate visible range
  const itemHeight = estimateSize()
  const containerHeight = 400 // This should be dynamic based on container
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    count - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Generate virtual items
  const virtualItems: VirtualItem[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    virtualItems.push({
      index: i,
      start: i * itemHeight,
      size: itemHeight,
    })
  }

  // Handle scroll events
  React.useEffect(() => {
    const element = getScrollElement()
    if (!element) return

    const handleScroll = () => {
      setScrollTop(element.scrollTop)
      setIsScrolling(true)

      clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => element.removeEventListener('scroll', handleScroll)
  }, [getScrollElement])

  return {
    virtualItems,
    totalSize: count * itemHeight,
    isScrolling,
    scrollTop,
  }
}

// Debounced value hook for performance
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Throttled callback hook
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const throttledCallback = React.useRef<T>()
  const lastRan = React.useRef<number>()

  React.useEffect(() => {
    throttledCallback.current = callback
  })

  return React.useCallback(((...args: Parameters<T>) => {
    if (!lastRan.current || Date.now() - lastRan.current >= delay) {
      throttledCallback.current?.(...args)
      lastRan.current = Date.now()
    }
  }) as T, [delay])
}

// Memory optimization: Weak map cache
class WeakCache<K extends WeakKey, V> {
  private cache = new WeakMap<K, V>()

  get(key: K): V | undefined {
    return this.cache.get(key)
  }

  set(key: K, value: V): void {
    this.cache.set(key, value)
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }
}

export const componentCache = new WeakCache<React.ComponentType, React.ComponentType>()

// Bundle splitting utilities
export const createSplitPoint = (name: string) => ({
  /* webpackChunkName: "${name}" */ 
})

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // Flag renders longer than one frame
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
      }
    }
  })
}

// Web Vitals tracking (for production)
export function trackWebVitals() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Track Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { 
        renderTime: number 
        loadTime: number
      }
      
      // Send to analytics
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // Track Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let clsValue = 0
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      console.log('CLS:', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Example usage in comments:
/*
// Lazy component loading
const LazyBookCard = createLazyComponent(
  () => import('./BookCard'),
  () => <div className="animate-shimmer">Loading book card...</div>
)

// Optimized image
<OptimizedImage
  src="/book-covers/book-123.jpg"
  alt="Book cover"
  width={200}
  height={300}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Virtual scrolling for large book lists
const { virtualItems, totalSize } = useVirtualScroll({
  count: books.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 250,
  overscan: 3,
})

// Debounced search
const debouncedSearchTerm = useDebounce(searchTerm, 300)

// Performance monitoring
usePerformanceMonitor('BookList')
*/