'use client'

import React, { Component, ReactNode } from 'react'
import { Button } from './ui/Button'
import { Container, Flex } from './ui/layout'
import { Heading2, Text } from './ui/Typography'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <svg
                className="w-24 h-24 mx-auto text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            
            <Heading2 className="mb-4">Something went wrong</Heading2>
            <Text className="mb-6 text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
            </Text>
            
            <Flex justify="center" gap="md">
              <Button onClick={this.handleReset} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="primary">
                Go Home
              </Button>
            </Flex>
          </div>
        </Container>
      )
    }

    return this.props.children
  }
}