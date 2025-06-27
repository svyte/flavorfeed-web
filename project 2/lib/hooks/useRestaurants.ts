import { useState, useEffect } from 'react'
import { RestaurantService, type SearchFilters } from '../services/restaurant-service'
import type { Database } from '../database.types'

type Restaurant = Database['public']['Tables']['restaurants']['Row'] & {
  distance?: number;
  availability?: 'available' | 'limited' | 'unavailable';
  waitTime?: number;
}

export function useRestaurants(
  query: string = '',
  filters: SearchFilters = {},
  enabled: boolean = true
) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const searchRestaurants = async (reset: boolean = false) => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const offset = reset ? 0 : restaurants.length
      const newRestaurants = await RestaurantService.searchRestaurants(
        query,
        filters,
        20,
        offset
      )

      // Add mock data for demo purposes
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'Celestial Rooftop',
          slug: 'celestial-rooftop',
          description: 'Elegant rooftop dining with panoramic city views',
          cuisine_types: ['Mediterranean', 'Modern'],
          location: null,
          address: '123 Skyline Ave',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postal_code: '10001',
          phone: '(555) 123-4567',
          website: null,
          email: null,
          hours: null,
          special_hours: null,
          price_range: 3,
          rating: 4.8,
          review_count: 247,
          popularity_score: 95.5,
          verified: true,
          partner_restaurant: true,
          insider_access: true,
          amenities: ['Rooftop Dining', 'Wine Selection', 'Romantic'],
          dietary_options: ['Vegetarian', 'Gluten-Free'],
          images: ['https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg'],
          menu_url: null,
          virtual_tour_url: null,
          reservation_system: 'opentable',
          reservation_url: null,
          accepts_reservations: true,
          typical_wait_time: 15,
          business_owner_id: null,
          claimed: true,
          status: 'active',
          tags: ['romantic', 'rooftop', 'views'],
          featured: true,
          trending: true,
          view_count: 1250,
          save_count: 89,
          check_in_count: 156,
          created_at: '2023-01-15T10:00:00Z',
          updated_at: '2023-12-01T15:30:00Z',
          distance: 0.8,
          availability: 'available' as const,
        },
        {
          id: '2',
          name: "Nonna's Kitchen",
          slug: 'nonnas-kitchen',
          description: 'Authentic Italian family recipes passed down through generations',
          cuisine_types: ['Italian', 'Traditional'],
          location: null,
          address: '456 Little Italy St',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postal_code: '10013',
          phone: '(555) 234-5678',
          website: null,
          email: null,
          hours: null,
          special_hours: null,
          price_range: 2,
          rating: 4.6,
          review_count: 189,
          popularity_score: 88.2,
          verified: true,
          partner_restaurant: false,
          insider_access: false,
          amenities: ['Family Style', 'Homemade Pasta', 'Cozy'],
          dietary_options: ['Vegetarian'],
          images: ['https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg'],
          menu_url: null,
          virtual_tour_url: null,
          reservation_system: 'phone',
          reservation_url: null,
          accepts_reservations: true,
          typical_wait_time: 25,
          business_owner_id: null,
          claimed: false,
          status: 'active',
          tags: ['family', 'authentic', 'pasta'],
          featured: false,
          trending: false,
          view_count: 890,
          save_count: 67,
          check_in_count: 234,
          created_at: '2022-08-20T14:00:00Z',
          updated_at: '2023-11-28T09:15:00Z',
          distance: 1.2,
          availability: 'limited' as const,
          waitTime: 25,
        },
        {
          id: '3',
          name: 'Sakura Sushi',
          slug: 'sakura-sushi',
          description: 'Premium sushi experience with the freshest ingredients',
          cuisine_types: ['Japanese', 'Sushi'],
          location: null,
          address: '789 Zen Garden Way',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postal_code: '10014',
          phone: '(555) 345-6789',
          website: null,
          email: null,
          hours: null,
          special_hours: null,
          price_range: 3,
          rating: 4.9,
          review_count: 312,
          popularity_score: 97.8,
          verified: true,
          partner_restaurant: true,
          insider_access: true,
          amenities: ['Omakase', 'Fresh Fish', 'Minimalist'],
          dietary_options: ['Gluten-Free'],
          images: ['https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg'],
          menu_url: null,
          virtual_tour_url: null,
          reservation_system: 'resy',
          reservation_url: null,
          accepts_reservations: true,
          typical_wait_time: 10,
          business_owner_id: null,
          claimed: true,
          status: 'active',
          tags: ['sushi', 'premium', 'fresh'],
          featured: true,
          trending: true,
          view_count: 1890,
          save_count: 145,
          check_in_count: 298,
          created_at: '2023-03-10T11:30:00Z',
          updated_at: '2023-12-02T16:45:00Z',
          distance: 2.1,
          availability: 'available' as const,
        }
      ]

      const combinedRestaurants = [...mockRestaurants, ...newRestaurants]

      if (reset) {
        setRestaurants(combinedRestaurants)
      } else {
        setRestaurants(prev => [...prev, ...combinedRestaurants])
      }

      setHasMore(newRestaurants.length === 20)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (enabled) {
      searchRestaurants(true)
    }
  }, [query, JSON.stringify(filters), enabled])

  const loadMore = () => {
    if (!loading && hasMore) {
      searchRestaurants(false)
    }
  }

  const refresh = () => {
    searchRestaurants(true)
  }

  return {
    restaurants,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  }
}

export function useRestaurant(id: string) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await RestaurantService.getRestaurantById(id)
        setRestaurant(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurant')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRestaurant()
    }
  }, [id])

  return { restaurant, loading, error }
}

export function useNearbyRestaurants(
  location: { lat: number; lng: number } | null,
  radius: number = 5
) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNearby = async () => {
      if (!location) return

      try {
        setLoading(true)
        setError(null)
        const data = await RestaurantService.getNearbyRestaurants(
          location.lat,
          location.lng,
          radius
        )
        setRestaurants(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load nearby restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchNearby()
  }, [location?.lat, location?.lng, radius])

  return { restaurants, loading, error }
}