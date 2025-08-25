import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
  setSession: (session: Session | null) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        set({ error: error.message })
        return { success: false, error: error.message }
      }
      
      set({ 
        user: data.user, 
        session: data.session,
        error: null 
      })
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      set({ error: message })
      return { success: false, error: message }
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (email, password, displayName) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      })
      
      if (error) {
        set({ error: error.message })
        return { success: false, error: error.message }
      }
      
      if (!data.user) {
        const message = 'Failed to create user account'
        set({ error: message })
        return { success: false, error: message }
      }
      
      set({ 
        user: data.user,
        session: data.session,
        error: null 
      })
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      set({ error: message })
      return { success: false, error: message }
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        set({ error: error.message })
        return
      }
      
      set({ 
        user: null, 
        session: null,
        error: null 
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      set({ error: message })
    } finally {
      set({ isLoading: false })
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        set({ error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      set({ error: message })
      return { success: false, error: message }
    } finally {
      set({ isLoading: false })
    }
  },

  updatePassword: async (password) => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ 
        password 
      })
      
      if (error) {
        set({ error: error.message })
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred'
      set({ error: message })
      return { success: false, error: message }
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),

  setSession: (session) => {
    set({ 
      session,
      user: session?.user ?? null,
      isInitialized: true
    })
  },

  initialize: async () => {
    if (get().isInitialized) return
    
    set({ isLoading: true })
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      set({ 
        session,
        user: session?.user ?? null,
        isInitialized: true
      })

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          session,
          user: session?.user ?? null
        })
      })
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      set({ isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },
}))