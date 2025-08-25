import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, 'Password is required'),
})

export const signUpSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string(),
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name is too long')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, and underscores')
    .trim()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email is too long')
    .toLowerCase()
    .trim(),
})

export const updatePasswordSchema = z.object({
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const updateProfileSchema = z.object({
  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name is too long')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, and underscores')
    .trim(),
  bio: z.string()
    .max(500, 'Bio is too long')
    .trim()
    .optional(),
  avatarUrl: z.string()
    .url('Invalid URL')
    .optional()
    .nullable(),
})

export type SignInFormData = z.infer<typeof signInSchema>
export type SignUpFormData = z.infer<typeof signUpSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>