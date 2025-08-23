/**
 * Polymorphic Component Utilities
 * Type-safe polymorphic components for maximum flexibility
 */

import React from 'react'

// Base polymorphic component types
export type AsProp<C extends React.ElementType> = {
  as?: C
}

export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P)

// Polymorphic component props that merges component-specific props with element props
export type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>

// Polymorphic ref type
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref']

// Complete polymorphic component type with ref
export type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> }

// Utility type for creating polymorphic forwardRef components
export type PolymorphicForwardRefComponent<
  DefaultElement extends React.ElementType,
  Props = {}
> = <C extends React.ElementType = DefaultElement>(
  props: PolymorphicComponentPropWithRef<C, Props>
) => React.ReactElement | null

export * from './Text'
export * from './Box'