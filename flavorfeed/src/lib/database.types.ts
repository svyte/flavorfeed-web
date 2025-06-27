export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          date_of_birth: string | null
          location: unknown | null
          location_name: string | null
          subscription_tier: 'free' | 'premium' | 'insider'
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_end_date: string | null
          revenuecat_user_id: string | null
          dietary_restrictions: string[] | null
          cuisine_preferences: string[] | null
          privacy_settings: Json
          notification_settings: Json
          ai_voice_settings: Json
          points: number
          level: number
          total_posts: number
          total_reviews: number
          friends_count: number
          onboarding_completed: boolean
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          date_of_birth?: string | null
          location?: unknown | null
          location_name?: string | null
          subscription_tier?: 'free' | 'premium' | 'insider'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_end_date?: string | null
          revenuecat_user_id?: string | null
          dietary_restrictions?: string[] | null
          cuisine_preferences?: string[] | null
          privacy_settings?: Json
          notification_settings?: Json
          ai_voice_settings?: Json
          points?: number
          level?: number
          total_posts?: number
          total_reviews?: number
          friends_count?: number
          onboarding_completed?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          date_of_birth?: string | null
          location?: unknown | null
          location_name?: string | null
          subscription_tier?: 'free' | 'premium' | 'insider'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          subscription_end_date?: string | null
          revenuecat_user_id?: string | null
          dietary_restrictions?: string[] | null
          cuisine_preferences?: string[] | null
          privacy_settings?: Json
          notification_settings?: Json
          ai_voice_settings?: Json
          points?: number
          level?: number
          total_posts?: number
          total_reviews?: number
          friends_count?: number
          onboarding_completed?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string | null
          description: string | null
          cuisine_types: string[]
          location: unknown
          address: string
          city: string
          state: string | null
          country: string
          postal_code: string | null
          phone: string | null
          website: string | null
          email: string | null
          hours: Json | null
          special_hours: Json | null
          price_range: number | null
          rating: number
          review_count: number
          popularity_score: number
          verified: boolean
          partner_restaurant: boolean
          insider_access: boolean
          amenities: string[] | null
          dietary_options: string[] | null
          images: string[] | null
          menu_url: string | null
          virtual_tour_url: string | null
          reservation_system: string | null
          reservation_url: string | null
          accepts_reservations: boolean
          typical_wait_time: number | null
          business_owner_id: string | null
          claimed: boolean
          status: 'active' | 'inactive' | 'temporarily_closed' | 'permanently_closed'
          tags: string[] | null
          featured: boolean
          trending: boolean
          view_count: number
          save_count: number
          check_in_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          description?: string | null
          cuisine_types: string[]
          location: unknown
          address: string
          city: string
          state?: string | null
          country?: string
          postal_code?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          hours?: Json | null
          special_hours?: Json | null
          price_range?: number | null
          rating?: number
          review_count?: number
          popularity_score?: number
          verified?: boolean
          partner_restaurant?: boolean
          insider_access?: boolean
          amenities?: string[] | null
          dietary_options?: string[] | null
          images?: string[] | null
          menu_url?: string | null
          virtual_tour_url?: string | null
          reservation_system?: string | null
          reservation_url?: string | null
          accepts_reservations?: boolean
          typical_wait_time?: number | null
          business_owner_id?: string | null
          claimed?: boolean
          status?: 'active' | 'inactive' | 'temporarily_closed' | 'permanently_closed'
          tags?: string[] | null
          featured?: boolean
          trending?: boolean
          view_count?: number
          save_count?: number
          check_in_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          description?: string | null
          cuisine_types?: string[]
          location?: unknown
          address?: string
          city?: string
          state?: string | null
          country?: string
          postal_code?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          hours?: Json | null
          special_hours?: Json | null
          price_range?: number | null
          rating?: number
          review_count?: number
          popularity_score?: number
          verified?: boolean
          partner_restaurant?: boolean
          insider_access?: boolean
          amenities?: string[] | null
          dietary_options?: string[] | null
          images?: string[] | null
          menu_url?: string | null
          virtual_tour_url?: string | null
          reservation_system?: string | null
          reservation_url?: string | null
          accepts_reservations?: boolean
          typical_wait_time?: number | null
          business_owner_id?: string | null
          claimed?: boolean
          status?: 'active' | 'inactive' | 'temporarily_closed' | 'permanently_closed'
          tags?: string[] | null
          featured?: boolean
          trending?: boolean
          view_count?: number
          save_count?: number
          check_in_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          price: number | null
          category: string
          subcategory: string | null
          course_order: number | null
          dietary_tags: string[] | null
          allergens: string[] | null
          spice_level: number | null
          ingredients: string[] | null
          calories: number | null
          protein_grams: number | null
          carbs_grams: number | null
          fat_grams: number | null
          images: string[] | null
          preparation_time: number | null
          popularity_score: number
          order_count: number
          rating: number
          review_count: number
          available: boolean
          seasonal: boolean
          limited_time: boolean
          availability_schedule: Json | null
          chef_special: boolean
          house_favorite: boolean
          instagram_worthy: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          price?: number | null
          category: string
          subcategory?: string | null
          course_order?: number | null
          dietary_tags?: string[] | null
          allergens?: string[] | null
          spice_level?: number | null
          ingredients?: string[] | null
          calories?: number | null
          protein_grams?: number | null
          carbs_grams?: number | null
          fat_grams?: number | null
          images?: string[] | null
          preparation_time?: number | null
          popularity_score?: number
          order_count?: number
          rating?: number
          review_count?: number
          available?: boolean
          seasonal?: boolean
          limited_time?: boolean
          availability_schedule?: Json | null
          chef_special?: boolean
          house_favorite?: boolean
          instagram_worthy?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          price?: number | null
          category?: string
          subcategory?: string | null
          course_order?: number | null
          dietary_tags?: string[] | null
          allergens?: string[] | null
          spice_level?: number | null
          ingredients?: string[] | null
          calories?: number | null
          protein_grams?: number | null
          carbs_grams?: number | null
          fat_grams?: number | null
          images?: string[] | null
          preparation_time?: number | null
          popularity_score?: number
          order_count?: number
          rating?: number
          review_count?: number
          available?: boolean
          seasonal?: boolean
          limited_time?: boolean
          availability_schedule?: Json | null
          chef_special?: boolean
          house_favorite?: boolean
          instagram_worthy?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string | null
          dish_id: string | null
          content: string | null
          images: string[] | null
          video_url: string | null
          overall_rating: number | null
          dish_rating: number | null
          service_rating: number | null
          atmosphere_rating: number | null
          value_rating: number | null
          location: unknown | null
          visit_date: string | null
          meal_type: string | null
          occasion: string | null
          party_size: number | null
          tags: string[] | null
          mentions: string[] | null
          hashtags: string[] | null
          visibility: 'public' | 'friends' | 'private'
          like_count: number
          comment_count: number
          share_count: number
          save_count: number
          verified_visit: boolean
          quality_score: number
          ai_generated_tags: string[] | null
          ai_sentiment_score: number | null
          ai_summary: string | null
          featured: boolean
          reported: boolean
          moderated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id?: string | null
          dish_id?: string | null
          content?: string | null
          images?: string[] | null
          video_url?: string | null
          overall_rating?: number | null
          dish_rating?: number | null
          service_rating?: number | null
          atmosphere_rating?: number | null
          value_rating?: number | null
          location?: unknown | null
          visit_date?: string | null
          meal_type?: string | null
          occasion?: string | null
          party_size?: number | null
          tags?: string[] | null
          mentions?: string[] | null
          hashtags?: string[] | null
          visibility?: 'public' | 'friends' | 'private'
          like_count?: number
          comment_count?: number
          share_count?: number
          save_count?: number
          verified_visit?: boolean
          quality_score?: number
          ai_generated_tags?: string[] | null
          ai_sentiment_score?: number | null
          ai_summary?: string | null
          featured?: boolean
          reported?: boolean
          moderated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string | null
          dish_id?: string | null
          content?: string | null
          images?: string[] | null
          video_url?: string | null
          overall_rating?: number | null
          dish_rating?: number | null
          service_rating?: number | null
          atmosphere_rating?: number | null
          value_rating?: number | null
          location?: unknown | null
          visit_date?: string | null
          meal_type?: string | null
          occasion?: string | null
          party_size?: number | null
          tags?: string[] | null
          mentions?: string[] | null
          hashtags?: string[] | null
          visibility?: 'public' | 'friends' | 'private'
          like_count?: number
          comment_count?: number
          share_count?: number
          save_count?: number
          verified_visit?: boolean
          quality_score?: number
          ai_generated_tags?: string[] | null
          ai_sentiment_score?: number | null
          ai_summary?: string | null
          featured?: boolean
          reported?: boolean
          moderated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          parent_comment_id: string | null
          content: string
          like_count: number
          reply_count: number
          reported: boolean
          ai_moderated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          parent_comment_id?: string | null
          content: string
          like_count?: number
          reply_count?: number
          reported?: boolean
          ai_moderated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          parent_comment_id?: string | null
          content?: string
          like_count?: number
          reply_count?: number
          reported?: boolean
          ai_moderated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: string
          close_friend: boolean
          notification_settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: string
          close_friend?: boolean
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: string
          close_friend?: boolean
          notification_settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          revenuecat_subscription_id: string
          product_id: string
          tier: string
          status: string
          original_purchase_date: string
          expiration_date: string | null
          trial_end_date: string | null
          is_trial: boolean
          auto_renew: boolean
          price_usd: number | null
          currency: string
          billing_period: string | null
          platform: string
          store: string
          transaction_id: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          revenuecat_subscription_id: string
          product_id: string
          tier: string
          status: string
          original_purchase_date: string
          expiration_date?: string | null
          trial_end_date?: string | null
          is_trial?: boolean
          auto_renew?: boolean
          price_usd?: number | null
          currency?: string
          billing_period?: string | null
          platform: string
          store: string
          transaction_id?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          revenuecat_subscription_id?: string
          product_id?: string
          tier?: string
          status?: string
          original_purchase_date?: string
          expiration_date?: string | null
          trial_end_date?: string | null
          is_trial?: boolean
          auto_renew?: boolean
          price_usd?: number | null
          currency?: string
          billing_period?: string | null
          platform?: string
          store?: string
          transaction_id?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          session_id: string
          conversation_type: string
          messages: Json
          context: Json | null
          ai_provider: string
          response_time_ms: number | null
          tokens_used: number | null
          cost_usd: number | null
          user_satisfaction: number | null
          user_feedback: string | null
          voice_enabled: boolean
          voice_messages: Json | null
          active: boolean
          last_message_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          conversation_type?: string
          messages: Json
          context?: Json | null
          ai_provider?: string
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_usd?: number | null
          user_satisfaction?: number | null
          user_feedback?: string | null
          voice_enabled?: boolean
          voice_messages?: Json | null
          active?: boolean
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          conversation_type?: string
          messages?: Json
          context?: Json | null
          ai_provider?: string
          response_time_ms?: number | null
          tokens_used?: number | null
          cost_usd?: number | null
          user_satisfaction?: number | null
          user_feedback?: string | null
          voice_enabled?: boolean
          voice_messages?: Json | null
          active?: boolean
          last_message_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          reservation_type: string
          party_size: number
          reservation_datetime: string | null
          time_window_start: string | null
          time_window_end: string | null
          estimated_duration_minutes: number
          status: string
          confirmation_code: string | null
          check_in_code: string | null
          contact_name: string
          contact_phone: string
          contact_email: string | null
          special_requests: string | null
          dietary_requirements: string[] | null
          accessibility_needs: string[] | null
          celebration_type: string | null
          external_reservation_id: string | null
          external_platform: string | null
          deposit_amount: number | null
          deposit_paid: boolean
          cancellation_fee: number | null
          cancellation_policy: string | null
          modification_policy: string | null
          reminder_sent: boolean
          confirmation_sent: boolean
          follow_up_sent: boolean
          source: string | null
          conversion_funnel: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          reservation_type?: string
          party_size: number
          reservation_datetime?: string | null
          time_window_start?: string | null
          time_window_end?: string | null
          estimated_duration_minutes?: number
          status?: string
          confirmation_code?: string | null
          check_in_code?: string | null
          contact_name: string
          contact_phone: string
          contact_email?: string | null
          special_requests?: string | null
          dietary_requirements?: string[] | null
          accessibility_needs?: string[] | null
          celebration_type?: string | null
          external_reservation_id?: string | null
          external_platform?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean
          cancellation_fee?: number | null
          cancellation_policy?: string | null
          modification_policy?: string | null
          reminder_sent?: boolean
          confirmation_sent?: boolean
          follow_up_sent?: boolean
          source?: string | null
          conversion_funnel?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          reservation_type?: string
          party_size?: number
          reservation_datetime?: string | null
          time_window_start?: string | null
          time_window_end?: string | null
          estimated_duration_minutes?: number
          status?: string
          confirmation_code?: string | null
          check_in_code?: string | null
          contact_name?: string
          contact_phone?: string
          contact_email?: string | null
          special_requests?: string | null
          dietary_requirements?: string[] | null
          accessibility_needs?: string[] | null
          celebration_type?: string | null
          external_reservation_id?: string | null
          external_platform?: string | null
          deposit_amount?: number | null
          deposit_paid?: boolean
          cancellation_fee?: number | null
          cancellation_policy?: string | null
          modification_policy?: string | null
          reminder_sent?: boolean
          confirmation_sent?: boolean
          follow_up_sent?: boolean
          source?: string | null
          conversion_funnel?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          image_url: string | null
          action_url: string | null
          deep_link: string | null
          data: Json | null
          template_id: string | null
          channels: string[]
          delivery_status: Json
          read: boolean
          clicked: boolean
          dismissed: boolean
          read_at: string | null
          clicked_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          priority: string
          group_key: string | null
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          image_url?: string | null
          action_url?: string | null
          deep_link?: string | null
          data?: Json | null
          template_id?: string | null
          channels?: string[]
          delivery_status?: Json
          read?: boolean
          clicked?: boolean
          dismissed?: boolean
          read_at?: string | null
          clicked_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          priority?: string
          group_key?: string | null
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          image_url?: string | null
          action_url?: string | null
          deep_link?: string | null
          data?: Json | null
          template_id?: string | null
          channels?: string[]
          delivery_status?: Json
          read?: boolean
          clicked?: boolean
          dismissed?: boolean
          read_at?: string | null
          clicked_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          priority?: string
          group_key?: string | null
          created_at?: string
          expires_at?: string
        }
      }
      user_activity: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: Json | null
          session_id: string | null
          location: unknown | null
          user_agent: string | null
          ip_address: unknown | null
          platform: string | null
          app_version: string | null
          page_load_time_ms: number | null
          interaction_time_ms: number | null
          experiment_cohort: string | null
          feature_flags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data?: Json | null
          session_id?: string | null
          location?: unknown | null
          user_agent?: string | null
          ip_address?: unknown | null
          platform?: string | null
          app_version?: string | null
          page_load_time_ms?: number | null
          interaction_time_ms?: number | null
          experiment_cohort?: string | null
          feature_flags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: Json | null
          session_id?: string | null
          location?: unknown | null
          user_agent?: string | null
          ip_address?: unknown | null
          platform?: string | null
          app_version?: string | null
          page_load_time_ms?: number | null
          interaction_time_ms?: number | null
          experiment_cohort?: string | null
          feature_flags?: string[] | null
          created_at?: string
        }
      }
      restaurant_checkins: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          verification_level: string
          table_number: string | null
          points_earned: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          verification_level: string
          table_number?: string | null
          points_earned?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          verification_level?: string
          table_number?: string | null
          points_earned?: number
          created_at?: string
        }
      }
      user_devices: {
        Row: {
          id: string
          user_id: string
          device_id: string
          fcm_token: string | null
          platform: string
          app_version: string | null
          os_version: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id: string
          fcm_token?: string | null
          platform: string
          app_version?: string | null
          os_version?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string
          fcm_token?: string | null
          platform?: string
          app_version?: string | null
          os_version?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_metrics: {
        Row: {
          id: string
          endpoint: string
          method: string
          user_id: string | null
          response_time_ms: number
          status_code: number
          error_message: string | null
          external_api_calls: Json | null
          external_api_latency_ms: number | null
          external_api_cost_usd: number | null
          request_size_bytes: number | null
          response_size_bytes: number | null
          cache_hit: boolean
          created_at: string
        }
        Insert: {
          id?: string
          endpoint: string
          method: string
          user_id?: string | null
          response_time_ms: number
          status_code: number
          error_message?: string | null
          external_api_calls?: Json | null
          external_api_latency_ms?: number | null
          external_api_cost_usd?: number | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          cache_hit?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          endpoint?: string
          method?: string
          user_id?: string | null
          response_time_ms?: number
          status_code?: number
          error_message?: string | null
          external_api_calls?: Json | null
          external_api_latency_ms?: number | null
          external_api_cost_usd?: number | null
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          cache_hit?: boolean
          created_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_restaurants: {
        Args: {
          search_query?: string
          user_lat?: number
          user_lng?: number
          max_distance_km?: number
          cuisine_filter?: string[]
          price_range_filter?: number[]
          min_rating?: number
          has_insider_access?: boolean
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          name: string
          cuisine_types: string[]
          rating: number
          review_count: number
          price_range: number
          distance_km: number
          images: string[]
          insider_access: boolean
          status: string
        }[]
      }
      calculate_distance: {
        Args: {
          lat1: number
          lng1: number
          lat2: number
          lng2: number
        }
        Returns: number
      }
      increment_checkin_count: {
        Args: {
          restaurant_id: string
        }
        Returns: void
      }
      increment_counter: {
        Args: {
          table_name: string
          column_name: string
          row_id: string
          increment_by?: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}