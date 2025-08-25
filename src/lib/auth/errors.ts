export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_CONFIRMED: 'Please check your email and click the confirmation link',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  RATE_LIMITED: 'Too many attempts. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  USER_NOT_FOUND: 'User account not found',
  INVALID_TOKEN: 'Invalid or expired token',
  ACCOUNT_LOCKED: 'Account has been locked due to too many failed attempts',
} as const

export function handleAuthError(error: any): string {
  if (!error) {
    return 'An unexpected error occurred'
  }

  const errorMessage = error?.message || error?.error_description || error

  if (typeof errorMessage === 'string') {
    const lowerMessage = errorMessage.toLowerCase()

    if (lowerMessage.includes('invalid login credentials') || 
        lowerMessage.includes('invalid password') ||
        lowerMessage.includes('user not found')) {
      return AUTH_ERRORS.INVALID_CREDENTIALS
    }

    if (lowerMessage.includes('email not confirmed') || 
        lowerMessage.includes('confirm your email')) {
      return AUTH_ERRORS.EMAIL_NOT_CONFIRMED
    }

    if (lowerMessage.includes('weak password') || 
        lowerMessage.includes('password should')) {
      return AUTH_ERRORS.WEAK_PASSWORD
    }

    if (lowerMessage.includes('user already registered') || 
        lowerMessage.includes('email already exists') ||
        lowerMessage.includes('duplicate key')) {
      return AUTH_ERRORS.EMAIL_ALREADY_EXISTS
    }

    if (lowerMessage.includes('rate limit') || 
        lowerMessage.includes('too many requests')) {
      return AUTH_ERRORS.RATE_LIMITED
    }

    if (lowerMessage.includes('network') || 
        lowerMessage.includes('fetch failed') ||
        lowerMessage.includes('connection')) {
      return AUTH_ERRORS.NETWORK_ERROR
    }

    if (lowerMessage.includes('session expired') || 
        lowerMessage.includes('jwt expired') ||
        lowerMessage.includes('token expired')) {
      return AUTH_ERRORS.SESSION_EXPIRED
    }

    if (lowerMessage.includes('unauthorized') || 
        lowerMessage.includes('not authorized')) {
      return AUTH_ERRORS.UNAUTHORIZED
    }

    if (lowerMessage.includes('invalid token') || 
        lowerMessage.includes('malformed jwt')) {
      return AUTH_ERRORS.INVALID_TOKEN
    }

    if (lowerMessage.includes('account locked') || 
        lowerMessage.includes('account disabled')) {
      return AUTH_ERRORS.ACCOUNT_LOCKED
    }
  }

  return typeof errorMessage === 'string' 
    ? errorMessage 
    : 'An unexpected error occurred'
}

export function isAuthError(error: any): error is AuthError {
  return error instanceof AuthError
}

export function createAuthError(
  message: string, 
  code?: string, 
  statusCode?: number
): AuthError {
  return new AuthError(message, code, statusCode)
}