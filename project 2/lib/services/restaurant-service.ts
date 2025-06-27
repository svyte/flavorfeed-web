import { supabase } from '../supabase'
import type { Database } from '../database.types'

type Restaurant = Database['public']['Tables']['restaurants']['Row']
type RestaurantInsert = Database['public']['Tables']['restaurants']['Insert']

export interface SearchFilters {
  location?: { lat: number; lng: number; radius?: number }
  cuisines?: string[]
  priceRange?: number[]
  minRating?: number
  hasInsiderAccess?: boolean
  amenities?: string[]
  dietaryOptions?: string[]
}

export class RestaurantService {
  // Search restaurants with advanced filtering
  static async searchRestaurants(
    query: string = '',
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase.rpc('search_restaurants', {
        search_query: query,
        user_lat: filters.location?.lat,
        user_lng: filters.location?.lng,
        max_distance_km: filters.location?.radius || 25,
        cuisine_filter: filters.cuisines,
        price_range_filter: filters.priceRange,
        min_rating: filters.minRating || 0,
        has_insider_access: filters.hasInsiderAccess,
        limit_count: limit,
        offset_count: offset
      })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Restaurant search error:', error)
      return []
    }
  }

  // Get restaurant by ID with full details
  static async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select(`
          *,
          dishes(*),
          posts(
            *,
            profiles(username, avatar_url)
          )
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get restaurant error:', error)
      return null
    }
  }

  // Get nearby restaurants
  static async getNearbyRestaurants(
    lat: number,
    lng: number,
    radius: number = 5,
    limit: number = 10
  ): Promise<Restaurant[]> {
    return this.searchRestaurants('', {
      location: { lat, lng, radius }
    }, limit)
  }

  // Get trending restaurants
  static async getTrendingRestaurants(limit: number = 10): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('status', 'active')
        .eq('trending', true)
        .order('popularity_score', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get trending restaurants error:', error)
      return []
    }
  }

  // Get featured restaurants
  static async getFeaturedRestaurants(limit: number = 10): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get featured restaurants error:', error)
      return []
    }
  }

  // Get restaurants with insider access
  static async getInsiderRestaurants(
    location?: { lat: number; lng: number },
    limit: number = 10
  ): Promise<Restaurant[]> {
    return this.searchRestaurants('', {
      location,
      hasInsiderAccess: true
    }, limit)
  }

  // Get restaurant menu
  static async getRestaurantMenu(restaurantId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true)
        .order('category', { ascending: true })
        .order('course_order', { ascending: true })

      if (error) throw error

      // Group dishes by category
      const menuByCategory: Record<string, any[]> = {}
      data?.forEach(dish => {
        const category = dish.category || 'Other'
        if (!menuByCategory[category]) {
          menuByCategory[category] = []
        }
        menuByCategory[category].push(dish)
      })

      return Object.entries(menuByCategory).map(([category, dishes]) => ({
        category,
        dishes
      }))
    } catch (error) {
      console.error('Get restaurant menu error:', error)
      return []
    }
  }

  // Get restaurant reviews/posts
  static async getRestaurantReviews(
    restaurantId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(username, avatar_url),
          dishes(name)
        `)
        .eq('restaurant_id', restaurantId)
        .not('overall_rating', 'is', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get restaurant reviews error:', error)
      return []
    }
  }

  // Save/unsave restaurant
  static async toggleSaveRestaurant(restaurantId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Check if already saved
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .single()

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId)

        if (error) throw error
        return false
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId
          })

        if (error) throw error
        return true
      }
    } catch (error) {
      console.error('Toggle save restaurant error:', error)
      throw error
    }
  }

  // Check if restaurant is saved
  static async isRestaurantSaved(restaurantId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { data } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('restaurant_id', restaurantId)
        .single()

      return !!data
    } catch (error) {
      return false
    }
  }

  // Get user's saved restaurants
  static async getSavedRestaurants(limit: number = 20): Promise<Restaurant[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          restaurants(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data?.map(item => item.restaurants).filter(Boolean) || []
    } catch (error) {
      console.error('Get saved restaurants error:', error)
      return []
    }
  }

  // Increment restaurant view count
  static async incrementViewCount(restaurantId: string): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_counter', {
        table_name: 'restaurants',
        column_name: 'view_count',
        row_id: restaurantId
      })

      if (error) throw error
    } catch (error) {
      console.error('Increment view count error:', error)
    }
  }

  // Get restaurant availability
  static async getRestaurantAvailability(
    restaurantId: string,
    date: Date,
    partySize: number
  ): Promise<{
    available: boolean
    nextAvailable?: Date
    waitTime?: number
  }> {
    try {
      // This would integrate with reservation systems
      // For now, return mock data
      const restaurant = await this.getRestaurantById(restaurantId)
      if (!restaurant) {
        return { available: false }
      }

      // Simple availability logic based on typical wait time
      const waitTime = restaurant.typical_wait_time || 0
      const available = waitTime < 30 // Available if wait time is less than 30 minutes

      return {
        available,
        waitTime: available ? waitTime : undefined,
        nextAvailable: available ? undefined : new Date(Date.now() + waitTime * 60000)
      }
    } catch (error) {
      console.error('Get restaurant availability error:', error)
      return { available: false }
    }
  }
}