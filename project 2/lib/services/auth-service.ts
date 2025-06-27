import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export interface AuthState {
  user: any | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
  username?: string
}

export interface ProfileUpdateData {
  full_name?: string
  username?: string
  bio?: string
  phone?: string
  date_of_birth?: string
  location_name?: string
  dietary_restrictions?: string[]
  cuisine_preferences?: string[]
  privacy_settings?: any
  notification_settings?: any
}

export class AuthService {
  // Sign up with email and password
  static async signUp(data: SignUpData): Promise<{ user: any; profile: Profile }> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Create profile
      const profileData: ProfileInsert = {
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        username: data.username,
        revenuecat_user_id: `flavorfeed_${authData.user.id}`
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (profileError) throw profileError

      return { user: authData.user, profile }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<any> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Sign in with Apple
  static async signInWithApple(): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Apple sign in error:', error)
      throw error
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Get current user profile
  static async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get current profile error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(updates: ProfileUpdateData): Promise<Profile> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  // Update user location
  static async updateLocation(lat: number, lng: number, locationName?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          location: `POINT(${lng} ${lat})`,
          location_name: locationName,
          last_active_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.error('Update location error:', error)
      throw error
    }
  }

  // Check username availability
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      return !data // Available if no data found
    } catch (error) {
      return true // Assume available on error
    }
  }

  // Complete onboarding
  static async completeOnboarding(data: {
    dietary_restrictions?: string[]
    cuisine_preferences?: string[]
    location?: { lat: number; lng: number; name: string }
  }): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const updates: any = {
        onboarding_completed: true,
        dietary_restrictions: data.dietary_restrictions,
        cuisine_preferences: data.cuisine_preferences
      }

      if (data.location) {
        updates.location = `POINT(${data.location.lng} ${data.location.lat})`
        updates.location_name = data.location.name
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.error('Complete onboarding error:', error)
      throw error
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  // Update password
  static async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }

  // Delete account
  static async deleteAccount(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Delete profile (cascades to other tables)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (profileError) throw profileError

      // Sign out
      await this.signOut()
    } catch (error) {
      console.error('Delete account error:', error)
      throw error
    }
  }

  // Get user statistics
  static async getUserStats(): Promise<{
    posts: number
    reviews: number
    friends: number
    points: number
    level: number
  }> {
    try {
      const profile = await this.getCurrentProfile()
      if (!profile) throw new Error('Profile not found')

      return {
        posts: profile.total_posts,
        reviews: profile.total_reviews,
        friends: profile.friends_count,
        points: profile.points,
        level: profile.level
      }
    } catch (error) {
      console.error('Get user stats error:', error)
      return { posts: 0, reviews: 0, friends: 0, points: 0, level: 1 }
    }
  }
}