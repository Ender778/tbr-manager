/**
 * Comprehensive Design Token System
 * Semantic design tokens for consistent UI experiences
 */

// Base tokens (primitive values)
export const baseTokens = {
  colors: {
    // Cork theme palette (existing)
    cork: {
      50: '#fdf8f3',
      100: '#faf0e4',
      200: '#f3ddc4',
      300: '#ecc399',
      400: '#e3a06d',
      500: '#dc8349',
      600: '#ce6c3e',
      700: '#ab5536',
      800: '#884632',
      900: '#6f3a2b',
    },
    // Semantic neutrals
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    // Status colors
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  
  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // Spacing scale (8pt grid)
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border radius scale
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadow scale
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Animation durations
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },
} as const

// Semantic tokens (design decisions)
export const semanticTokens = {
  colors: {
    // Theme-aware colors
    background: {
      primary: baseTokens.colors.neutral[50],
      secondary: baseTokens.colors.cork[50],
      tertiary: baseTokens.colors.cork[100],
    },
    text: {
      primary: baseTokens.colors.cork[800],
      secondary: baseTokens.colors.cork[600],
      muted: baseTokens.colors.neutral[500],
      inverse: baseTokens.colors.neutral[50],
    },
    border: {
      primary: baseTokens.colors.cork[200],
      secondary: baseTokens.colors.neutral[200],
      focus: baseTokens.colors.cork[500],
    },
    surface: {
      primary: baseTokens.colors.neutral[50],
      secondary: baseTokens.colors.cork[50],
      elevated: baseTokens.colors.neutral[50],
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
  },

  // Component-specific tokens
  components: {
    button: {
      primary: {
        bg: baseTokens.colors.cork[600],
        bgHover: baseTokens.colors.cork[700],
        text: baseTokens.colors.neutral[50],
        border: baseTokens.colors.cork[600],
      },
      secondary: {
        bg: baseTokens.colors.cork[100],
        bgHover: baseTokens.colors.cork[200],
        text: baseTokens.colors.cork[700],
        border: baseTokens.colors.cork[300],
      },
      ghost: {
        bg: 'transparent',
        bgHover: baseTokens.colors.cork[100],
        text: baseTokens.colors.cork[600],
        border: 'transparent',
      },
    },
    card: {
      bg: baseTokens.colors.neutral[50],
      border: baseTokens.colors.cork[200],
      shadow: baseTokens.shadow.md,
      borderRadius: baseTokens.borderRadius.lg,
    },
    input: {
      bg: baseTokens.colors.neutral[50],
      border: baseTokens.colors.neutral[300],
      borderFocus: baseTokens.colors.cork[500],
      text: baseTokens.colors.cork[800],
      placeholder: baseTokens.colors.neutral[400],
    },
  },

  // Layout tokens
  layout: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    sidebar: {
      width: '280px',
      widthCollapsed: '80px',
    },
    header: {
      height: '64px',
    },
  },

  // Animation presets
  animation: {
    fadeIn: {
      duration: baseTokens.duration.base,
      easing: 'ease-out',
    },
    slideUp: {
      duration: baseTokens.duration.slow,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    scaleIn: {
      duration: baseTokens.duration.fast,
      easing: 'ease-out',
    },
  },
} as const

// Type exports for TypeScript usage
export type BaseTokens = typeof baseTokens
export type SemanticTokens = typeof semanticTokens
export type ColorToken = keyof typeof baseTokens.colors
export type SpacingToken = keyof typeof baseTokens.spacing
export type TypographyToken = keyof typeof baseTokens.typography.fontSize

// Utility function to get token values
export function getToken<T extends keyof BaseTokens>(
  category: T,
  token: keyof BaseTokens[T]
): BaseTokens[T][keyof BaseTokens[T]] {
  return baseTokens[category][token]
}

// Theme configuration for Tailwind
export const tailwindThemeExtension = {
  extend: {
    colors: {
      ...baseTokens.colors,
      // Semantic color aliases
      'text-primary': semanticTokens.colors.text.primary,
      'text-secondary': semanticTokens.colors.text.secondary,
      'bg-primary': semanticTokens.colors.background.primary,
      'bg-secondary': semanticTokens.colors.background.secondary,
    },
    spacing: baseTokens.spacing,
    fontSize: baseTokens.typography.fontSize,
    fontWeight: baseTokens.typography.fontWeight,
    lineHeight: baseTokens.typography.lineHeight,
    letterSpacing: baseTokens.typography.letterSpacing,
    borderRadius: baseTokens.borderRadius,
    boxShadow: baseTokens.shadow,
    zIndex: baseTokens.zIndex,
    transitionDuration: baseTokens.duration,
    fontFamily: baseTokens.typography.fontFamily,
  },
}