import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { AuthService } from '../services/auth-service'
import type { Database } from '../database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthState {
  user: any | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        if (session?.user) {
          const profile = await AuthService.getCurrentProfile()
          setState({
            user: session.user,
            profile,
            loading: false,
            error: null
          })
        } else {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null
          })
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false 
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const profile = await AuthService.getCurrentProfile()
            setState({
              user: session.user,
              profile,
              loading: false,
              error: null
            })
          } else {
            setState({
              user: null,
              profile: null,
              loading: false,
              error: null
            })
          }
        } catch (error) {
          setState(prev => ({ 
            ...prev, 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          }))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signIn(email, password)
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign in failed',
        loading: false 
      }))
    }
  }

  const signUp = async (data: {
    email: string
    password: string
    fullName: string
    username?: string
  }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signUp(data)
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign up failed',
        loading: false 
      }))
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signOut()
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Sign out failed',
        loading: false 
      }))
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const updatedProfile = await AuthService.updateProfile(updates)
      setState(prev => ({ 
        ...prev, 
        profile: updatedProfile,
        loading: false 
      }))
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Update failed',
        loading: false 
      }))
    }
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!state.user,
    isOnboarded: state.profile?.onboarding_completed || false
  }
}